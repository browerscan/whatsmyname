import { describe, it, expect } from "vitest";
import {
  getBrandInfo,
  hasBrandIcon,
  getFaviconUrl,
  getIconForUrl,
} from "@/lib/brand-icons";

describe("brand-icons", () => {
  describe("getBrandInfo", () => {
    it("should return brand info for known domains", () => {
      const github = getBrandInfo("https://github.com/user");
      expect(github.icon).toBe("github");
      expect(github.color).toBe("#181717");
      expect(github.domain).toBe("github.com");

      const twitter = getBrandInfo("https://twitter.com/user");
      expect(twitter.icon).toBe("twitter");
      expect(twitter.color).toBe("#1DA1F2");
    });

    it("should return null for unknown domains", () => {
      const unknown = getBrandInfo("https://example.com");
      expect(unknown.icon).toBeNull();
      expect(unknown.color).toBeNull();
      expect(unknown.domain).toBe("example.com");
    });

    it("should handle domains without www", () => {
      const github = getBrandInfo("https://www.github.com/user");
      expect(github.domain).toBe("github.com");
    });
  });

  describe("hasBrandIcon", () => {
    it("should return true for known brands", () => {
      expect(hasBrandIcon("https://github.com")).toBe(true);
      expect(hasBrandIcon("https://twitter.com")).toBe(true);
      expect(hasBrandIcon("https://linkedin.com")).toBe(true);
    });

    it("should return false for unknown brands", () => {
      expect(hasBrandIcon("https://unknown-site.com")).toBe(false);
      expect(hasBrandIcon("https://example.com")).toBe(false);
    });
  });

  describe("getFaviconUrl", () => {
    it("should generate correct favicon URL", () => {
      const url = getFaviconUrl("example.com");
      expect(url).toBe(
        "https://www.google.com/s2/favicons?domain=example.com&sz=64",
      );
    });
  });

  describe("getIconForUrl", () => {
    it("should return brand icon for known brands", () => {
      const result = getIconForUrl("https://github.com");
      expect(result.type).toBe("brand");
      expect(result.value).toBe("github");
      expect(result.color).toBe("#181717");
    });

    it("should return favicon for unknown brands", () => {
      const result = getIconForUrl("https://example.com");
      expect(result.type).toBe("favicon");
      expect(result.value).toContain("google.com/s2/favicons");
    });
  });
});
