import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearchCache } from "@/hooks/useSearchCache";
import { SearchResult, GoogleSearchResponse } from "@/types";

/**
 * Unit Tests for useSearchCache Hook
 *
 * Tests search result caching with localStorage
 * - Cache storage and retrieval
 * - Cache expiration (5 minute TTL)
 * - Maximum cache size (50 entries)
 * - Cache cleanup
 */

// Helper to create mock search result
const createMockSearchResult = (source: string): SearchResult => ({
  source,
  username: "testuser",
  url: `https://${source.toLowerCase()}.com/testuser`,
  isNSFW: false,
  category: "social",
  tags: ["test"],
  checkResult: {
    status: 200,
    checkType: "status_code",
    isExist: true,
    responseTime: 100,
  },
});

// Helper to create mock Google response
const createMockGoogleResponse = (): GoogleSearchResponse => ({
  items: [
    {
      title: "Test Result",
      link: "https://example.com",
      displayLink: "example.com",
      snippet: "Test snippet",
    },
  ],
  searchInformation: {
    totalResults: "100",
    searchTime: 0.5,
  },
});

// Create a proper localStorage mock class
class LocalStorageMock implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // Helper to get all keys (for testing)
  keys(): string[] {
    return Array.from(this.store.keys());
  }
}

describe("useSearchCache", () => {
  let localStorageMock: LocalStorageMock;
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    // Create fresh mock for each test
    localStorageMock = new LocalStorageMock();

    // Override localStorage
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    // Mock Object.keys to work with our localStorage mock
    const originalObjectKeys = Object.keys;
    vi.spyOn(Object, "keys").mockImplementation((obj: object) => {
      if (obj === localStorageMock) {
        return localStorageMock.keys();
      }
      return originalObjectKeys(obj);
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore original localStorage
    Object.defineProperty(global, "localStorage", {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });

    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("getCached", () => {
    it("should return null when cache is empty", () => {
      const { result } = renderHook(() => useSearchCache());

      const cached = result.current.getCached("testuser");

      expect(cached).toBeNull();
    });

    it("should return cached results when available", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
      });

      const cached = result.current.getCached("testuser");

      expect(cached).not.toBeNull();
      expect(cached?.fromCache).toBe(true);
      expect(cached?.whatsMyNameResults).toEqual(mockResults);
      expect(cached?.googleResults).toEqual(mockGoogleResponse);
    });

    it("should be case-insensitive for usernames", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("TestUser", mockResults, mockGoogleResponse);
      });

      // Should find with different casing
      const cached = result.current.getCached("testuser");
      expect(cached).not.toBeNull();

      const cachedUpper = result.current.getCached("TESTUSER");
      expect(cachedUpper).not.toBeNull();
    });

    it("should return null for expired cache (TTL = 5 minutes)", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
      });

      // Advance time by 5 minutes + 1ms
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000 + 1);
      });

      const cached = result.current.getCached("testuser");

      expect(cached).toBeNull();
    });

    it("should return valid cache just before expiration", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
      });

      // Advance time to just before expiration (5 minutes - 1ms)
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000 - 1);
      });

      const cached = result.current.getCached("testuser");

      expect(cached).not.toBeNull();
      expect(cached?.fromCache).toBe(true);
    });

    it("should handle corrupted cache data gracefully", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      // Set corrupted data directly
      localStorageMock.setItem(
        "whatsmyname_cache_v1_testuser",
        "invalid json{",
      );

      const { result } = renderHook(() => useSearchCache());

      const cached = result.current.getCached("testuser");

      expect(cached).toBeNull();
      consoleWarnSpy.mockRestore();
    });
  });

  describe("setCached", () => {
    it("should store cache with correct key format", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("TestUser", mockResults, mockGoogleResponse);
      });

      // Should use lowercase username in key
      const storedData = localStorageMock.getItem(
        "whatsmyname_cache_v1_testuser",
      );
      expect(storedData).not.toBeNull();
    });

    it("should store timestamp with cache entry", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();
      const now = Date.now();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
      });

      const storedValue = JSON.parse(
        localStorageMock.getItem("whatsmyname_cache_v1_testuser") || "{}",
      );

      expect(storedValue.timestamp).toBeGreaterThanOrEqual(now);
    });

    it("should handle null Google results", () => {
      const mockResults = [createMockSearchResult("GitHub")];

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, null);
      });

      const cached = result.current.getCached("testuser");

      expect(cached).not.toBeNull();
      expect(cached?.googleResults).toEqual({ items: [] });
    });

    it("should overwrite existing cache for same username", () => {
      const mockResults1 = [createMockSearchResult("GitHub")];
      const mockResults2 = [createMockSearchResult("Twitter")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults1, mockGoogleResponse);
      });

      act(() => {
        result.current.setCached("testuser", mockResults2, mockGoogleResponse);
      });

      const cached = result.current.getCached("testuser");

      expect(cached?.whatsMyNameResults[0].source).toBe("Twitter");
    });
  });

  describe("invalidateCache", () => {
    it("should remove specific cache entry", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
        result.current.setCached("otheruser", mockResults, mockGoogleResponse);
      });

      act(() => {
        result.current.invalidateCache("testuser");
      });

      expect(result.current.getCached("testuser")).toBeNull();
      expect(result.current.getCached("otheruser")).not.toBeNull();
    });

    it("should handle non-existent cache gracefully", () => {
      const { result } = renderHook(() => useSearchCache());

      // Should not throw
      expect(() => {
        act(() => {
          result.current.invalidateCache("nonexistent");
        });
      }).not.toThrow();
    });
  });

  describe("clearAllCache", () => {
    it("should remove all cache entries", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("user1", mockResults, mockGoogleResponse);
        result.current.setCached("user2", mockResults, mockGoogleResponse);
        result.current.setCached("user3", mockResults, mockGoogleResponse);
      });

      act(() => {
        result.current.clearAllCache();
      });

      expect(result.current.getCached("user1")).toBeNull();
      expect(result.current.getCached("user2")).toBeNull();
      expect(result.current.getCached("user3")).toBeNull();
    });

    it("should only remove cache entries with correct prefix", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      // Set a non-cache item
      localStorageMock.setItem("other_key", "other_value");

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
      });

      act(() => {
        result.current.clearAllCache();
      });

      // Non-cache item should remain
      expect(localStorageMock.getItem("other_key")).toBe("other_value");
    });
  });

  describe("getCacheStats", () => {
    it("should return zero stats when cache is empty", () => {
      const { result } = renderHook(() => useSearchCache());

      const stats = result.current.getCacheStats();

      expect(stats.count).toBe(0);
      expect(stats.size).toBe(0);
    });

    it("should return correct count", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("user1", mockResults, mockGoogleResponse);
        result.current.setCached("user2", mockResults, mockGoogleResponse);
        result.current.setCached("user3", mockResults, mockGoogleResponse);
      });

      const stats = result.current.getCacheStats();

      expect(stats.count).toBe(3);
    });

    it("should return formatted size", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
      });

      const stats = result.current.getCacheStats();

      expect(stats.size).toBeGreaterThan(0);
      expect(stats.sizeFormatted).toMatch(/^\d+\.\d+ KB$/);
    });
  });

  describe("cache cleanup - old entries", () => {
    it("should remove expired entries during getCached", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      // Set first cache entry
      act(() => {
        result.current.setCached("olduser", mockResults, mockGoogleResponse);
      });

      // Advance time past TTL
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000 + 1);
      });

      // Getting cached should trigger cleanup and return null for expired
      const cached = result.current.getCached("olduser");
      expect(cached).toBeNull();
    });

    it("should remove expired entries during setCached", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached(
          "expireduser",
          mockResults,
          mockGoogleResponse,
        );
      });

      // Advance time past TTL
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000 + 1);
      });

      // Setting new cache triggers cleanup
      act(() => {
        result.current.setCached("newuser", mockResults, mockGoogleResponse);
      });

      // The expired entry should have been cleaned
      const expiredCache = result.current.getCached("expireduser");
      expect(expiredCache).toBeNull();
    });
  });

  describe("cache cleanup - maximum size (50 entries)", () => {
    it("should remove oldest entries when exceeding max cache size", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      // Create 55 entries (exceeds max of 50)
      for (let i = 0; i < 55; i++) {
        act(() => {
          // Advance time slightly between entries to ensure different timestamps
          vi.advanceTimersByTime(10);
          result.current.setCached(`user${i}`, mockResults, mockGoogleResponse);
        });
      }

      // Trigger one more setCached to force cleanup
      // (cleanup happens BEFORE adding new entry)
      act(() => {
        vi.advanceTimersByTime(10);
        result.current.setCached("final_user", mockResults, mockGoogleResponse);
      });

      // Get stats - should be at or near max (cleanup removes oldest)
      const stats = result.current.getCacheStats();

      // After cleanup, should be at max (50) plus one new entry = 51 max
      // The implementation cleans up entries BEFORE adding new one,
      // so we expect at most 51 entries
      expect(stats.count).toBeLessThanOrEqual(51);
    });

    it("should keep newest entries when cleaning up", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      // Create 55 entries
      for (let i = 0; i < 55; i++) {
        act(() => {
          vi.advanceTimersByTime(10);
          result.current.setCached(`user${i}`, mockResults, mockGoogleResponse);
        });
      }

      // The most recent entries should still be accessible
      // (user54 is the newest)
      const newestCache = result.current.getCached("user54");
      expect(newestCache).not.toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle empty username", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("", mockResults, mockGoogleResponse);
      });

      const cached = result.current.getCached("");
      expect(cached).not.toBeNull();
    });

    it("should handle special characters in username", () => {
      const mockResults = [createMockSearchResult("GitHub")];
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached(
          "user_name-123",
          mockResults,
          mockGoogleResponse,
        );
      });

      const cached = result.current.getCached("user_name-123");
      expect(cached).not.toBeNull();
    });

    it("should handle empty search results", () => {
      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", [], { items: [] });
      });

      const cached = result.current.getCached("testuser");

      expect(cached).not.toBeNull();
      expect(cached?.whatsMyNameResults).toEqual([]);
      expect(cached?.googleResults.items).toEqual([]);
    });

    it("should handle large result sets", () => {
      const mockResults = Array.from({ length: 100 }, (_, i) =>
        createMockSearchResult(`Platform${i}`),
      );
      const mockGoogleResponse = createMockGoogleResponse();

      const { result } = renderHook(() => useSearchCache());

      act(() => {
        result.current.setCached("testuser", mockResults, mockGoogleResponse);
      });

      const cached = result.current.getCached("testuser");

      expect(cached?.whatsMyNameResults).toHaveLength(100);
    });
  });

  describe("server-side rendering compatibility", () => {
    it("should have all expected methods", () => {
      const { result } = renderHook(() => useSearchCache());

      // All methods should be callable
      expect(typeof result.current.getCached).toBe("function");
      expect(typeof result.current.setCached).toBe("function");
      expect(typeof result.current.invalidateCache).toBe("function");
      expect(typeof result.current.clearAllCache).toBe("function");
      expect(typeof result.current.getCacheStats).toBe("function");
    });
  });
});
