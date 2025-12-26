"use client";

import { useCallback } from "react";
import { SearchResult, GoogleSearchResponse } from "@/types";

const CACHE_VERSION = "v1";
const CACHE_PREFIX = "whatsmyname_cache_";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of cached searches

interface CacheEntry {
  timestamp: number;
  whatsMyNameResults: SearchResult[];
  googleResults: GoogleSearchResponse;
}

interface CachedSearchResult {
  whatsMyNameResults: SearchResult[];
  googleResults: GoogleSearchResponse | null;
  fromCache: boolean;
}

/**
 * Get cache key for a username
 */
function getCacheKey(username: string): string {
  const lowerUsername = username.toLowerCase();
  return CACHE_PREFIX + CACHE_VERSION + "_" + lowerUsername;
}

/**
 * Clean old cache entries
 */
function cleanOldEntries(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .map((key) => {
        try {
          return { key, data: JSON.parse(localStorage.getItem(key) || "{}") };
        } catch {
          return { key, data: null };
        }
      })
      .filter((entry) => entry.data && entry.data.timestamp)
      .sort((a, b) => a.data.timestamp - b.data.timestamp);

    // Remove expired entries
    const now = Date.now();
    cacheKeys.forEach((entry) => {
      if (now - entry.data.timestamp > CACHE_TTL) {
        localStorage.removeItem(entry.key);
      }
    });

    // If still too many entries, remove oldest
    const remainingKeys = Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .map((key) => {
        try {
          return { key, data: JSON.parse(localStorage.getItem(key) || "{}") };
        } catch {
          return { key, data: null };
        }
      })
      .filter((entry) => entry.data && entry.data.timestamp)
      .sort((a, b) => a.data.timestamp - b.data.timestamp);

    if (remainingKeys.length > MAX_CACHE_SIZE) {
      const toRemove = remainingKeys.slice(
        0,
        remainingKeys.length - MAX_CACHE_SIZE,
      );
      toRemove.forEach((entry) => localStorage.removeItem(entry.key));
    }
  } catch (error) {
    console.warn("Failed to clean cache entries:", error);
  }
}

/**
 * Custom hook for managing search result caching
 * @returns Cache operations object
 */
export function useSearchCache() {
  /**
   * Get cached results for a username
   */
  const getCached = useCallback(
    (username: string): CachedSearchResult | null => {
      if (typeof window === "undefined") return null;

      try {
        cleanOldEntries();
        const key = getCacheKey(username);
        const cached = localStorage.getItem(key);

        if (!cached) return null;

        const entry: CacheEntry = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - entry.timestamp > CACHE_TTL) {
          localStorage.removeItem(key);
          return null;
        }

        return {
          whatsMyNameResults: entry.whatsMyNameResults,
          googleResults: entry.googleResults,
          fromCache: true,
        };
      } catch (error) {
        console.warn("Failed to get cached results:", error);
        return null;
      }
    },
    [],
  );

  /**
   * Set cached results for a username
   */
  const setCached = useCallback(
    (
      username: string,
      whatsMyNameResults: SearchResult[],
      googleResults: GoogleSearchResponse | null,
    ): void => {
      if (typeof window === "undefined") return;

      try {
        cleanOldEntries();
        const key = getCacheKey(username);
        const entry: CacheEntry = {
          timestamp: Date.now(),
          whatsMyNameResults,
          googleResults: googleResults || { items: [] },
        };
        localStorage.setItem(key, JSON.stringify(entry));
      } catch (error) {
        // Handle quota exceeded or other errors
        console.warn("Failed to cache results:", error);
        // If quota exceeded, try to clear more space
        try {
          cleanOldEntries();
          // Clear all cache and try again
          const keys = Object.keys(localStorage).filter((k) =>
            k.startsWith(CACHE_PREFIX),
          );
          keys.forEach((k) => localStorage.removeItem(k));
        } catch {
          // Silently fail
        }
      }
    },
    [],
  );

  /**
   * Invalidate cache for a specific username
   */
  const invalidateCache = useCallback((username: string): void => {
    if (typeof window === "undefined") return;

    try {
      const key = getCacheKey(username);
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to invalidate cache:", error);
    }
  }, []);

  /**
   * Clear all cached search results
   */
  const clearAllCache = useCallback((): void => {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(CACHE_PREFIX),
      );
      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }, []);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    if (typeof window === "undefined") return { count: 0, size: 0 };

    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(CACHE_PREFIX),
      );
      let size = 0;

      keys.forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) size += item.length;
      });

      return {
        count: keys.length,
        size: size, // in bytes
        sizeFormatted: (size / 1024).toFixed(2) + " KB",
      };
    } catch {
      return { count: 0, size: 0, sizeFormatted: "0 KB" };
    }
  }, []);

  return {
    getCached,
    setCached,
    invalidateCache,
    clearAllCache,
    getCacheStats,
  };
}
