import { describe, it, expect } from "vitest";
import {
  parseGoogleApiKeys,
  buildGoogleUsernameQuery,
  clampGoogleNum,
  hashStringToUint32,
  getRotatedKeyOrder,
  isRetryableGoogleError,
  formatGoogleErrorMessage,
} from "@/lib/google-search";

describe("google-search", () => {
  describe("parseGoogleApiKeys", () => {
    it("should return empty array for empty input", () => {
      expect(parseGoogleApiKeys(undefined)).toEqual([]);
      expect(parseGoogleApiKeys("")).toEqual([]);
      expect(parseGoogleApiKeys("   ")).toEqual([]);
    });

    it("should parse comma/whitespace separated keys and dedupe", () => {
      const raw = "k1, k2\nk3   k2\tk4";
      expect(parseGoogleApiKeys(raw)).toEqual(["k1", "k2", "k3", "k4"]);
    });
  });

  describe("buildGoogleUsernameQuery", () => {
    it("should build username query with @ variant", () => {
      expect(buildGoogleUsernameQuery("john_doe")).toBe(
        '"john_doe" OR "@john_doe"',
      );
    });

    it("should trim input", () => {
      expect(buildGoogleUsernameQuery("  user  ")).toBe('"user" OR "@user"');
    });
  });

  describe("clampGoogleNum", () => {
    it("should clamp to 1..10", () => {
      expect(clampGoogleNum(0)).toBe(1);
      expect(clampGoogleNum(1)).toBe(1);
      expect(clampGoogleNum(10)).toBe(10);
      expect(clampGoogleNum(11)).toBe(10);
    });
  });

  describe("hashStringToUint32 / getRotatedKeyOrder", () => {
    it("should return stable unsigned 32-bit hash", () => {
      const value = hashStringToUint32("seed");
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(0xffffffff);
      expect(hashStringToUint32("seed")).toBe(value);
    });

    it("should rotate key order deterministically for a seed", () => {
      const keys = ["k0", "k1", "k2", "k3"];
      const orderA = getRotatedKeyOrder(keys, "alice").map((x) => x.key);
      const orderB = getRotatedKeyOrder(keys, "alice").map((x) => x.key);
      expect(orderA).toEqual(orderB);
      expect(orderA).toHaveLength(keys.length);
      // Same keys, just rotated
      expect(new Set(orderA)).toEqual(new Set(keys));
    });
  });

  describe("isRetryableGoogleError", () => {
    it("should treat 429/401/403 as retryable", () => {
      expect(isRetryableGoogleError(429, null)).toBe(true);
      expect(isRetryableGoogleError(401, null)).toBe(true);
      expect(isRetryableGoogleError(403, null)).toBe(true);
    });

    it("should detect retryable reasons in payload", () => {
      const payload = {
        error: {
          errors: [{ reason: "dailyLimitExceeded" }],
        },
      };
      expect(isRetryableGoogleError(400, payload)).toBe(true);
    });

    it("should not retry unknown 400 errors without reasons", () => {
      expect(
        isRetryableGoogleError(400, { error: { message: "bad request" } }),
      ).toBe(false);
    });
  });

  describe("formatGoogleErrorMessage", () => {
    it("should prefer structured message and append reasons", () => {
      const payload = {
        error: {
          message: "Quota exceeded",
          errors: [{ reason: "dailyLimitExceeded" }],
        },
      };
      expect(formatGoogleErrorMessage(403, payload)).toContain(
        "Quota exceeded",
      );
      expect(formatGoogleErrorMessage(403, payload)).toContain(
        "dailyLimitExceeded",
      );
    });
  });
});
