import { describe, it, expect } from "vitest";
import {
  formatResponseTime,
  getResponseTimeCategory,
  formatNumber,
  formatNumberString,
  formatPercentage,
  truncateText,
  extractDomain,
  capitalizeFirst,
  formatCategory,
  sanitizeUsername,
} from "@/lib/formatters";

describe("formatters", () => {
  describe("formatResponseTime", () => {
    it("should format milliseconds correctly", () => {
      expect(formatResponseTime(500)).toBe("500ms");
      expect(formatResponseTime(999)).toBe("999ms");
    });

    it("should format seconds correctly", () => {
      expect(formatResponseTime(1000)).toBe("1.00s");
      expect(formatResponseTime(1500)).toBe("1.50s");
      expect(formatResponseTime(2345)).toBe("2.35s");
    });
  });

  describe("getResponseTimeCategory", () => {
    it("should categorize as fast", () => {
      expect(getResponseTimeCategory(100)).toBe("fast");
      expect(getResponseTimeCategory(499)).toBe("fast");
    });

    it("should categorize as medium", () => {
      expect(getResponseTimeCategory(500)).toBe("medium");
      expect(getResponseTimeCategory(999)).toBe("medium");
    });

    it("should categorize as slow", () => {
      expect(getResponseTimeCategory(1000)).toBe("slow");
      expect(getResponseTimeCategory(5000)).toBe("slow");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
      expect(formatNumber(123456789)).toBe("123,456,789");
    });

    it("should handle small numbers", () => {
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(42)).toBe("42");
      expect(formatNumber(999)).toBe("999");
    });
  });

  describe("formatNumberString", () => {
    it("should format numeric strings with commas", () => {
      expect(formatNumberString("1000")).toBe("1,000");
      expect(formatNumberString("6220000000")).toBe("6,220,000,000");
      expect(formatNumberString("  42 ")).toBe("42");
    });

    it("should return original value for non-numeric strings", () => {
      expect(formatNumberString("not a number")).toBe("not a number");
      expect(formatNumberString("12.34")).toBe("12.34");
      expect(formatNumberString("")).toBe("");
    });
  });

  describe("formatPercentage", () => {
    it("should calculate percentage correctly", () => {
      expect(formatPercentage(50, 100)).toBe("50%");
      expect(formatPercentage(25, 100)).toBe("25%");
      expect(formatPercentage(1, 3)).toBe("33%");
    });

    it("should handle zero total", () => {
      expect(formatPercentage(10, 0)).toBe("0%");
    });
  });

  describe("truncateText", () => {
    it("should truncate long text", () => {
      expect(truncateText("Hello World", 8)).toBe("Hello...");
      expect(truncateText("Short text is very long", 10)).toBe("Short t...");
    });

    it("should not truncate short text", () => {
      expect(truncateText("Short", 10)).toBe("Short");
      expect(truncateText("Hello", 5)).toBe("Hello");
    });
  });

  describe("extractDomain", () => {
    it("should extract domain from URL", () => {
      expect(extractDomain("https://github.com/user")).toBe("github.com");
      expect(extractDomain("https://www.twitter.com")).toBe("twitter.com");
      expect(extractDomain("http://example.com/path/to/page")).toBe(
        "example.com",
      );
    });

    it("should handle invalid URLs", () => {
      expect(extractDomain("not a url")).toBe("not a url");
    });
  });

  describe("capitalizeFirst", () => {
    it("should capitalize first letter", () => {
      expect(capitalizeFirst("hello")).toBe("Hello");
      expect(capitalizeFirst("world")).toBe("World");
    });

    it("should handle empty strings", () => {
      expect(capitalizeFirst("")).toBe("");
    });

    it("should not change already capitalized", () => {
      expect(capitalizeFirst("Hello")).toBe("Hello");
    });
  });

  describe("formatCategory", () => {
    it("should format category names", () => {
      expect(formatCategory("social-media")).toBe("Social Media");
      expect(formatCategory("developer_tools")).toBe("Developer Tools");
      expect(formatCategory("gaming platform")).toBe("Gaming Platform");
    });

    it("should handle single words", () => {
      expect(formatCategory("social")).toBe("Social");
    });
  });

  describe("sanitizeUsername", () => {
    it("should sanitize usernames", () => {
      expect(sanitizeUsername("  UserName  ")).toBe("username");
      expect(sanitizeUsername("User@Name!")).toBe("username");
      expect(sanitizeUsername("user_name-123")).toBe("user_name-123");
    });

    it("should remove invalid characters", () => {
      expect(sanitizeUsername("user#name$")).toBe("username");
      expect(sanitizeUsername("hello world")).toBe("helloworld");
    });
  });
});
