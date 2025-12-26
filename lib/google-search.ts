export interface GoogleApiErrorPayload {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    errors?: Array<{
      message?: string;
      domain?: string;
      reason?: string;
    }>;
  };
}

export function parseGoogleApiKeys(raw: string | undefined): string[] {
  if (!raw) return [];

  const candidates = raw
    .split(/[\s,]+/g)
    .map((key) => key.trim())
    .filter(Boolean);

  // Preserve order but remove duplicates
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const key of candidates) {
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(key);
  }
  return unique;
}

export function buildGoogleUsernameQuery(username: string): string {
  const trimmed = username.trim();
  if (!trimmed) return "";

  // Most social platforms display usernames with "@", but some do not.
  // Using both improves recall without changing the user input rules.
  return `"${trimmed}" OR "@${trimmed}"`;
}

export function clampGoogleNum(num: number, fallback = 10): number {
  const value = Number.isFinite(num) ? num : fallback;
  return Math.max(1, Math.min(Math.trunc(value), 10));
}

export function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Ensure unsigned
  return hash >>> 0;
}

export function getRotatedKeyOrder(
  keys: string[],
  seed: string,
): Array<{ key: string; index: number }> {
  if (keys.length === 0) return [];
  if (keys.length === 1) return [{ key: keys[0], index: 0 }];

  const startIndex = hashStringToUint32(seed) % keys.length;
  const ordered: Array<{ key: string; index: number }> = [];
  for (let offset = 0; offset < keys.length; offset++) {
    const index = (startIndex + offset) % keys.length;
    ordered.push({ key: keys[index], index });
  }
  return ordered;
}

function extractReasons(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];

  const error = (payload as GoogleApiErrorPayload).error;
  const reasons = error?.errors
    ?.map((e) => e?.reason)
    .filter((r): r is string => typeof r === "string" && r.length > 0);

  return reasons ?? [];
}

export function isRetryableGoogleError(
  status: number,
  payload: unknown,
): boolean {
  if (status === 429) return true;
  if (status === 401) return true;
  if (status === 403) return true;

  // Some quota/auth issues can come back as 400 with structured reasons.
  const reasons = extractReasons(payload);
  const retryableReasons = new Set<string>([
    "dailyLimitExceeded",
    "userRateLimitExceeded",
    "rateLimitExceeded",
    "quotaExceeded",
    "keyInvalid",
    "ipRefererBlocked",
  ]);

  return reasons.some((reason) => retryableReasons.has(reason));
}

export function formatGoogleErrorMessage(
  status: number,
  payload: unknown,
): string {
  if (!payload || typeof payload !== "object") {
    return `Google Search API error (${status})`;
  }

  const error = (payload as GoogleApiErrorPayload).error;
  const message = typeof error?.message === "string" ? error.message : null;
  const reasons = extractReasons(payload);
  const reasonSuffix = reasons.length > 0 ? ` [${reasons.join(", ")}]` : "";

  return message
    ? `${message}${reasonSuffix}`
    : `Google Search API error (${status})${reasonSuffix}`;
}
