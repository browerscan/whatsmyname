import { describe, it, expect } from "vitest";
import { validateUsername, isValidUrl, isEmpty } from "@/lib/validators";

describe("validators", () => {
  describe("validateUsername", () => {
    it("should accept valid usernames", () => {
      expect(validateUsername("john_doe").isValid).toBe(true);
      expect(validateUsername("user123").isValid).toBe(true);
      expect(validateUsername("test-user").isValid).toBe(true);
      expect(validateUsername("a".repeat(15)).isValid).toBe(true);
    });

    it("should reject empty usernames", () => {
      const result = validateUsername("");
      expect(result.isValid).toBe(false);
      expect(result.errorKey).toBe("required");
    });

    it("should reject usernames that are too short", () => {
      const result = validateUsername("ab");
      expect(result.isValid).toBe(false);
      expect(result.errorKey).toBe("too_short");
    });

    it("should reject usernames that are too long", () => {
      const result = validateUsername("a".repeat(31));
      expect(result.isValid).toBe(false);
      expect(result.errorKey).toBe("too_long");
    });

    it("should reject usernames with invalid characters", () => {
      const result1 = validateUsername("user@name");
      expect(result1.isValid).toBe(false);
      expect(result1.errorKey).toBe("invalid_chars");

      const result2 = validateUsername("user name");
      expect(result2.isValid).toBe(false);
      expect(result2.errorKey).toBe("invalid_chars");

      const result3 = validateUsername("user#123");
      expect(result3.isValid).toBe(false);
      expect(result3.errorKey).toBe("invalid_chars");
    });

    it("should trim whitespace before validation", () => {
      const result = validateUsername("  valid_user  ");
      expect(result.isValid).toBe(true);
    });
  });

  describe("isValidUrl", () => {
    it("should accept valid URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("https://example.com/path")).toBe(true);
      expect(isValidUrl("https://sub.example.com")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidUrl("not a url")).toBe(false);
      expect(isValidUrl("example.com")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("should detect empty strings", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should detect non-empty strings", () => {
      expect(isEmpty("hello")).toBe(false);
      expect(isEmpty("  hello  ")).toBe(false);
      expect(isEmpty("0")).toBe(false);
    });
  });
});
