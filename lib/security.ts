/**
 * Security Utilities
 *
 * Collection of security-related utility functions for input sanitization,
 * output encoding, and common security operations.
 */

/**
 * HTML entity encoding map
 */
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape HTML special characters to prevent XSS
 *
 * @param str - String to escape
 * @returns HTML-escaped string
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str).replace(
    /[&<>"'`=/]/g,
    (char) => HTML_ENTITIES[char] || char,
  );
}

/**
 * Escape HTML in an object's values recursively
 *
 * @param obj - Object to sanitize
 * @returns New object with escaped string values
 */
export function escapeHtmlObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return escapeHtml(obj) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(escapeHtmlObject) as T;
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = escapeHtmlObject(value);
    }
    return result as T;
  }
  return obj;
}

/**
 * Sanitize a URL to prevent javascript: and data: schemes
 *
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") return "";

  const trimmed = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = [
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
    "about:",
    "chrome:",
    "chrome-extension:",
  ];

  const lowerUrl = trimmed.toLowerCase();
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return "";
    }
  }

  // Only allow http://, https://, mailto:, tel:, and relative paths
  const allowedProtocols = ["http://", "https://", "mailto:", "tel:", "/"];
  const hasAllowedProtocol = allowedProtocols.some((p) =>
    lowerUrl.startsWith(p),
  );

  if (!hasAllowedProtocol && !lowerUrl.startsWith("/")) {
    return "";
  }

  return trimmed;
}

/**
 * Validate and sanitize a username
 *
 * @param username - Username to validate
 * @returns Sanitized username or null if invalid
 */
export function sanitizeUsername(username: string): string | null {
  if (!username || typeof username !== "string") return null;

  const trimmed = username.trim();

  // Length check
  if (trimmed.length < 1 || trimmed.length > 100) return null;

  // Check for invalid characters
  // Only allow alphanumeric, underscore, hyphen (no dots for API consistency)
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return null;

  // Check for path traversal patterns
  if (trimmed.includes("..")) return null;
  if (trimmed.includes("./")) return null;
  if (trimmed.includes("../")) return null;

  return trimmed;
}

/**
 * Generate a CSP nonce value for inline scripts
 *
 * @returns Base64-encoded random nonce
 */
export function generateCspNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  // Convert Uint8Array to string without spread operator
  let binary = "";
  for (let i = 0; i < array.length; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary);
}

/**
 * Check if a request appears to be a bot
 *
 * @param userAgent - User-Agent string
 * @returns true if likely a bot
 */
export function isLikelyBot(userAgent: string | null): boolean {
  if (!userAgent) return true;

  const lowerUA = userAgent.toLowerCase();

  // Known bot patterns
  const botPatterns = [
    "bot",
    "crawl",
    "spider",
    "scraper",
    "curl",
    "wget",
    "python-requests",
    "go-http-client",
    "java",
    "node-fetch",
    "axios",
    "http.rb",
    "libwww-perl",
    "lwp-trivial",
    "ua-tester",
    "googlebot",
    "bingbot",
    "slurp",
    "duckduckbot",
    "baiduspider",
    "yandexbot",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "showyoubot",
    "outbrain",
    "pinterest",
    "applebot",
    "semrushbot",
  ];

  return botPatterns.some((pattern) => lowerUA.includes(pattern));
}

/**
 * Validate API key format
 *
 * @param key - API key to validate
 * @returns true if format appears valid
 */
export function isValidApiKeyFormat(key: string): boolean {
  if (!key || typeof key !== "string") return false;

  // API keys should be at least 20 characters
  if (key.length < 20) return false;

  // Should only contain URL-safe characters
  return /^[A-Za-z0-9_-]+$/.test(key);
}

/**
 * Rate limit configuration presets
 */
export const RATE_LIMIT_PRESETS = {
  // WhatsMyName API - 10 requests per 10 seconds
  WHATSMYNAME: { interval: 10000, maxRequests: 10 },
  // Google Search - 5 requests per 10 seconds (stricter due to quota)
  GOOGLE: { interval: 10000, maxRequests: 5 },
  // AI Analyze - 3 requests per 10 seconds (most expensive)
  AI_ANALYZE: { interval: 10000, maxRequests: 3 },
  // Health check - no rate limiting (or very permissive)
  HEALTH_CHECK: { interval: 60000, maxRequests: 100 },
} as const;

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

/**
 * Add security headers to a Response
 */
export function addSecurityHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    newResponse.headers.set(key, value);
  }

  return newResponse;
}

/**
 * Safe JSON stringify that handles circular references
 * and prevents prototype pollution
 */
export function safeJsonStringify(obj: unknown): string {
  const seen = new WeakSet();

  return JSON.stringify(obj, (_key, value) => {
    // Prevent prototype pollution
    if (typeof value === "object" && value !== null) {
      // Check for dangerous prototype properties
      if (
        "__proto__" in value ||
        "constructor" in value ||
        "prototype" in value
      ) {
        return undefined;
      }

      // Handle circular references
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }

    return value;
  });
}

/**
 * Validate content type of a request
 */
export function isValidContentType(
  contentType: string | null,
  expected: string[],
): boolean {
  if (!contentType) return false;

  const normalized = contentType.toLowerCase().split(";")[0].trim();
  return expected.some((expectedType) =>
    normalized.includes(expectedType.toLowerCase()),
  );
}

/**
 * Check if origin is allowed for CORS
 */
export function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string[],
): boolean {
  if (!origin) return false;

  // Exact match
  if (allowedOrigins.includes(origin)) return true;

  // Wildcard match
  for (const allowed of allowedOrigins) {
    if (allowed === "*") return true;
    if (allowed.startsWith("*.")) {
      const domain = allowed.substring(2);
      if (origin === `https://${domain}` || origin.endsWith(`.${domain}`)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Create a CORS response with appropriate headers
 */
export function createCorsResponse(
  body: unknown,
  status: number,
  origin: string | null,
  allowedOrigins: string[],
): Response {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add CORS headers if origin is allowed
  if (origin && isOriginAllowed(origin, allowedOrigins)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization, X-Requested-With";
    headers["Access-Control-Max-Age"] = "86400";
  }

  return new Response(JSON.stringify(body), { status, headers });
}

/**
 * Create a preflight CORS response
 */
export function createCorsPreflightResponse(
  origin: string | null,
  allowedOrigins: string[],
): Response {
  const headers: HeadersInit = {};

  if (origin && isOriginAllowed(origin, allowedOrigins)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization, X-Requested-With";
    headers["Access-Control-Max-Age"] = "86400";
  }

  return new Response(null, { status: 204, headers });
}
