import { describe, it, expect } from "vitest";
import {
  filterResults,
  sortResults,
  getUniqueCategories,
  getResultStats,
} from "@/lib/filters";
import { SearchResult, FilterOptions, SortOptions } from "@/types";

// Mock data
const mockResults: SearchResult[] = [
  {
    source: "GitHub",
    username: "testuser",
    url: "https://github.com/testuser",
    isNSFW: false,
    category: "coding",
    tags: ["developer"],
    checkResult: {
      status: 200,
      checkType: "status_code",
      isExist: true,
      responseTime: 150,
    },
  },
  {
    source: "Twitter",
    username: "testuser",
    url: "https://twitter.com/testuser",
    isNSFW: false,
    category: "social",
    tags: ["social-media"],
    checkResult: {
      status: 404,
      checkType: "status_code",
      isExist: false,
      responseTime: 300,
    },
  },
  {
    source: "Reddit",
    username: "testuser",
    url: "https://reddit.com/u/testuser",
    isNSFW: true,
    category: "social",
    tags: ["forum"],
    checkResult: {
      status: 200,
      checkType: "status_code",
      isExist: true,
      responseTime: 200,
    },
  },
];

describe("filters", () => {
  describe("filterResults", () => {
    it("should filter by status - found", () => {
      const filters: FilterOptions = {
        status: "found",
        category: null,
        showNSFW: true,
        searchQuery: "",
      };
      const filtered = filterResults(mockResults, filters);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.checkResult.isExist)).toBe(true);
    });

    it("should filter by status - not found", () => {
      const filters: FilterOptions = {
        status: "not-found",
        category: null,
        showNSFW: true,
        searchQuery: "",
      };
      const filtered = filterResults(mockResults, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].source).toBe("Twitter");
    });

    it("should filter by category", () => {
      const filters: FilterOptions = {
        status: "all",
        category: "social",
        showNSFW: true,
        searchQuery: "",
      };
      const filtered = filterResults(mockResults, filters);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.category === "social")).toBe(true);
    });

    it("should filter NSFW content", () => {
      const filters: FilterOptions = {
        status: "all",
        category: null,
        showNSFW: false,
        searchQuery: "",
      };
      const filtered = filterResults(mockResults, filters);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => !r.isNSFW)).toBe(true);
    });

    it("should filter by search query", () => {
      const filters: FilterOptions = {
        status: "all",
        category: null,
        showNSFW: true,
        searchQuery: "git",
      };
      const filtered = filterResults(mockResults, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].source).toBe("GitHub");
    });
  });

  describe("sortResults", () => {
    it("should sort by response time ascending", () => {
      const sortOptions: SortOptions = {
        sortBy: "response-time",
        order: "asc",
      };
      const sorted = sortResults(mockResults, sortOptions);
      expect(sorted[0].source).toBe("GitHub"); // 150ms
      expect(sorted[1].source).toBe("Reddit"); // 200ms
      expect(sorted[2].source).toBe("Twitter"); // 300ms
    });

    it("should sort by response time descending", () => {
      const sortOptions: SortOptions = {
        sortBy: "response-time",
        order: "desc",
      };
      const sorted = sortResults(mockResults, sortOptions);
      expect(sorted[0].source).toBe("Twitter"); // 300ms
      expect(sorted[2].source).toBe("GitHub"); // 150ms
    });

    it("should sort alphabetically", () => {
      const sortOptions: SortOptions = {
        sortBy: "alphabetical",
        order: "asc",
      };
      const sorted = sortResults(mockResults, sortOptions);
      expect(sorted[0].source).toBe("GitHub");
      expect(sorted[1].source).toBe("Reddit");
      expect(sorted[2].source).toBe("Twitter");
    });

    it("should use default sort (found first)", () => {
      const sortOptions: SortOptions = {
        sortBy: "default",
        order: "asc",
      };
      const sorted = sortResults(mockResults, sortOptions);
      // Found results should come first
      expect(sorted[0].checkResult.isExist).toBe(true);
      expect(sorted[1].checkResult.isExist).toBe(true);
      expect(sorted[2].checkResult.isExist).toBe(false);
    });
  });

  describe("getUniqueCategories", () => {
    it("should return unique categories sorted", () => {
      const categories = getUniqueCategories(mockResults);
      expect(categories).toEqual(["coding", "social"]);
    });
  });

  describe("getResultStats", () => {
    it("should calculate stats correctly", () => {
      const stats = getResultStats(mockResults);
      expect(stats.total).toBe(3);
      expect(stats.found).toBe(2);
      expect(stats.notFound).toBe(1);
      expect(stats.nsfw).toBe(1);
      expect(stats.avgResponseTime).toBe((150 + 300 + 200) / 3);
      expect(stats.categoryCounts).toEqual({
        coding: 1,
        social: 2,
      });
    });
  });
});
