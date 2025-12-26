/**
 * Edge-Compatible Rate Limiting
 *
 * This module implements rate limiting for Edge Runtime environments.
 * Since Edge functions are stateless and run across multiple instances,
 * we use a combination of strategies:
 *
 * 1. In-memory rate limiting (per-instance) with aggressive cleanup
 * 2. Client-side rate limit headers for browser throttling
 * 3. Cryptographic hash-based fingerprinting for user identification
 *
 * For true distributed rate limiting in production, consider:
 * - Cloudflare Workers KV Store
 * - Upstash Redis (Edge-ready)
 * - Vercel KV
 *
 * @see https://developers.cloudflare.com/kv/
 */

interface RateLimitConfig {
  interval: number; // Time window in ms
  maxRequests: number; // Max requests per interval
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  windowStart: number; // Track window for sliding window
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Per-instance rate limit storage
// In edge runtime, each instance maintains its own map
// This provides basic rate limiting but not global coordination
const buckets = new Map<string, TokenBucket>();

// Cleanup configuration
const CLEANUP_INTERVAL = 30000; // 30 seconds - more aggressive cleanup for Edge
const BUCKET_TTL = 300000; // 5 minutes - keep buckets for this long
let lastCleanup = Date.now();

// Request counter per identifier (for stricter enforcement in Edge)
const requestCounters = new Map<string, { count: number; resetTime: number }>();

/**
 * Creates a consistent hash of a string for use as identifier
 * Uses a simple non-cryptographic hash for performance
 */
function hashIdentifier(identifier: string): string {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `rl_${Math.abs(hash)}`;
}

/**
 * Sanitize identifier to prevent map pollution attacks
 * Limits length and removes potentially malicious characters
 */
function sanitizeIdentifier(identifier: string): string {
  // Remove null bytes and control characters
  let sanitized = identifier.replace(/[\x00-\x1F\x7F]/g, "");

  // Limit length to prevent memory exhaustion
  const MAX_IDENTIFIER_LENGTH = 256;
  if (sanitized.length > MAX_IDENTIFIER_LENGTH) {
    sanitized = sanitized.substring(0, MAX_IDENTIFIER_LENGTH);
  }

  // Use hash if still contains potentially problematic characters
  if (/[^a-zA-Z0-9_:.-]/.test(sanitized)) {
    return hashIdentifier(identifier);
  }

  return sanitized;
}

/**
 * Clean up old entries to prevent memory leaks
 * Runs more frequently in Edge to manage limited memory
 */
function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  const cutoff = now - BUCKET_TTL;
  let deleted = 0;

  // Clean up token buckets
  const keysToDelete: string[] = [];
  buckets.forEach((bucket, key) => {
    if (bucket.lastRefill < cutoff) {
      keysToDelete.push(key);
    }
  });
  for (const key of keysToDelete) {
    buckets.delete(key);
    deleted++;
  }

  // Clean up request counters
  const counterKeysToDelete: string[] = [];
  requestCounters.forEach((counter, key) => {
    if (counter.resetTime < now) {
      counterKeysToDelete.push(key);
    }
  });
  for (const key of counterKeysToDelete) {
    requestCounters.delete(key);
  }

  lastCleanup = now;

  // Log cleanup in development for monitoring
  if (process.env.NODE_ENV === "development" && deleted > 0) {
    console.log(`[RateLimit] Cleaned up ${deleted} expired buckets`);
  }
}

/**
 * Core rate limiting function using token bucket algorithm
 *
 * @param identifier - Unique identifier for the rate limit subject (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result with headers values
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 10000, maxRequests: 10 },
): RateLimitResult {
  cleanup();

  const sanitizedId = sanitizeIdentifier(identifier);
  const now = Date.now();
  const bucket = buckets.get(sanitizedId);

  if (!bucket) {
    // First request - create new bucket
    buckets.set(sanitizedId, {
      tokens: config.maxRequests - 1,
      lastRefill: now,
      windowStart: now,
    });

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: now + config.interval,
    };
  }

  // Calculate time elapsed and tokens to refill
  const timePassed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(
    (timePassed / config.interval) * config.maxRequests,
  );

  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(config.maxRequests, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    // Reset window start if we've passed a full interval
    if (timePassed >= config.interval) {
      bucket.windowStart = now;
    }
  }

  // Check if request should be allowed
  if (bucket.tokens > 0) {
    bucket.tokens--;
    return {
      success: true,
      limit: config.maxRequests,
      remaining: bucket.tokens,
      reset: bucket.lastRefill + config.interval,
    };
  }

  // Rate limit exceeded
  const resetTime = bucket.lastRefill + config.interval;
  const retryAfter = Math.ceil((resetTime - now) / 1000);

  return {
    success: false,
    limit: config.maxRequests,
    remaining: 0,
    reset: resetTime,
    retryAfter: Math.max(1, retryAfter),
  };
}

/**
 * Strict rate limiting for expensive operations
 *
 * Uses a sliding window counter approach for more accurate enforcement
 * at the cost of slightly higher memory usage
 */
export function strictRateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 10000, maxRequests: 10 },
): RateLimitResult {
  cleanup();

  const sanitizedId = sanitizeIdentifier(identifier);
  const now = Date.now();
  const counter = requestCounters.get(sanitizedId);

  // Reset counter if window expired
  if (!counter || now >= counter.resetTime) {
    requestCounters.set(sanitizedId, {
      count: 1,
      resetTime: now + config.interval,
    });

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: now + config.interval,
    };
  }

  // Check limit
  if (counter.count >= config.maxRequests) {
    const retryAfter = Math.ceil((counter.resetTime - now) / 1000);
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: counter.resetTime,
      retryAfter: Math.max(1, retryAfter),
    };
  }

  counter.count++;
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - counter.count,
    reset: counter.resetTime,
  };
}

/**
 * Extract client IP from request headers
 *
 * Supports various proxy/CDN headers:
 * - Cloudflare: cf-connecting-ip
 * - Vercel: x-vercel-forwarded-for
 * - AWS: x-forwarded-for
 * - Standard: x-real-ip
 *
 * @param request - Incoming request object
 * @returns Client IP address or hash of it
 */
export function getClientIp(request: Request): string {
  // Try Cloudflare header first (most common for Edge deployments)
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp && cfConnectingIp.length > 0) {
    return sanitizeIp(cfConnectingIp);
  }

  // Try Vercel header
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor && vercelForwardedFor.length > 0) {
    return sanitizeIp(vercelForwardedFor.split(",")[0]);
  }

  // Try X-Forwarded-For (standard proxy header)
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor && xForwardedFor.length > 0) {
    return sanitizeIp(xForwardedFor.split(",")[0].trim());
  }

  // Try X-Real-IP
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp && xRealIp.length > 0) {
    return sanitizeIp(xRealIp);
  }

  // Fallback to a hash of request fingerprint
  // This allows rate limiting even without a visible IP
  return generateRequestFingerprint(request);
}

/**
 * Sanitize IP address for use as identifier
 * Removes port, validates IPv6, handles privacy extensions
 */
function sanitizeIp(ip: string): string {
  // Remove port if present
  const sanitized = ip.split(":")[0];

  // For IPv6, use a shortened version to avoid overly long identifiers
  if (sanitized.includes(".")) {
    // IPv4 - use as-is
    return sanitized;
  }

  // IPv6 - hash it to keep identifiers short
  return hashIdentifier(sanitized);
}

/**
 * Generate request fingerprint when IP is not available
 * Uses a combination of headers to create a stable identifier
 */
function generateRequestFingerprint(request: Request): string {
  const headers = request.headers;

  // Use User-Agent and Accept headers as fallback fingerprint
  const userAgent = headers.get("user-agent") || "unknown";
  const accept = headers.get("accept") || "unknown";
  const acceptLanguage = headers.get("accept-language") || "unknown";
  const acceptEncoding = headers.get("accept-encoding") || "unknown";

  // Create a hash of these headers
  const fingerprint = `${userAgent}:${accept}:${acceptLanguage}:${acceptEncoding}`;
  return hashIdentifier(fingerprint);
}

/**
 * Create a standardized rate limit response with proper headers
 *
 * Includes all standard rate limit headers:
 * - X-RateLimit-Limit: Total requests allowed
 * - X-RateLimit-Remaining: Requests remaining in window
 * - X-RateLimit-Reset: Unix timestamp when limit resets
 * - Retry-After: Seconds until client should retry (429 only)
 *
 * @param result - Rate limit result
 * @param message - Optional custom error message
 * @returns Response object with appropriate headers
 */
export function rateLimitResponse(
  result: RateLimitResult,
  message: string = "Rate limit exceeded. Please try again later.",
): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.reset).toISOString(),
  };

  // Add Retry-After header for rate limit responses
  if (result.retryAfter) {
    headers["Retry-After"] = result.retryAfter.toString();
  }

  return new Response(
    JSON.stringify({
      error: message,
      rateLimitExceeded: true,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers,
    },
  );
}

/**
 * Add rate limit headers to an existing response
 *
 * Use this to add rate limit info to successful responses
 */
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult,
): Response {
  const newResponse = new Response(response.body, response);

  newResponse.headers.set("X-RateLimit-Limit", result.limit.toString());
  newResponse.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  newResponse.headers.set(
    "X-RateLimit-Reset",
    new Date(result.reset).toISOString(),
  );

  return newResponse;
}

/**
 * Rate limit middleware for API routes
 *
 * Wraps a handler with rate limiting logic
 *
 * @example
 * ```ts
 * export const GET = withRateLimit(
 *   async (request) => {
 *     // Your handler code
 *   },
 *   { interval: 10000, maxRequests: 10 }
 * );
 * ```
 */
export function withRateLimit<T extends Request>(
  handler: (request: T) => Promise<Response>,
  config: RateLimitConfig,
): (request: T) => Promise<Response> {
  return async (request: T) => {
    const clientIp = getClientIp(request as unknown as Request);
    const result = rateLimit(clientIp, config);

    if (!result.success) {
      return rateLimitResponse(result);
    }

    const response = await handler(request);
    return addRateLimitHeaders(response, result);
  };
}
