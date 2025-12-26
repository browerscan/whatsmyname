"use client";

import { useCallback, useRef, useEffect } from "react";
import { useSearchStore } from "@/stores";
import {
  parseNDJSONStream,
  isSearchResult,
  isSearchMetadata,
} from "@/lib/parsers";
import { API_ENDPOINTS } from "@/lib/constants";
import type { GoogleSearchResponse, SearchResult } from "@/types";
import { useSearchCache } from "./useSearchCache";

interface UseUsernameSearchOptions {
  enableCache?: boolean;
  onCacheHit?: (username: string) => void;
  onSearchStart?: (username: string) => void;
  onSearchComplete?: (username: string, resultCount: number) => void;
  onError?: (error: string) => void;
}

interface SearchState {
  isSearching: boolean;
  abortController: AbortController | null;
  searchId: number;
}

/**
 * Custom hook for managing username search with caching and optimized streaming
 * Extracted from HomeClient to improve code organization and reusability
 *
 * @param options - Configuration options for the search hook
 * @returns Object containing search function and current search state
 */
export function useUsernameSearch(options: UseUsernameSearchOptions = {}) {
  const {
    enableCache = true,
    onCacheHit,
    onSearchStart,
    onSearchComplete,
    onError,
  } = options;

  // Store actions
  const setUsername = useSearchStore((state) => state.setUsername);
  const startSearch = useSearchStore((state) => state.startSearch);
  const stopSearch = useSearchStore((state) => state.stopSearch);
  const addWhatsMyNameResults = useSearchStore(
    (state) => state.addWhatsMyNameResults,
  );
  const setGoogleResponse = useSearchStore((state) => state.setGoogleResponse);
  const setGoogleError = useSearchStore((state) => state.setGoogleError);
  const setProgressTotal = useSearchStore((state) => state.setProgressTotal);
  const incrementProgressCompletedBy = useSearchStore(
    (state) => state.incrementProgressCompletedBy,
  );
  const completeProgress = useSearchStore((state) => state.completeProgress);
  const setError = useSearchStore((state) => state.setError);

  // Cache hook
  const { getCached, setCached } = useSearchCache();

  // Refs for managing search state
  const searchStateRef = useRef<SearchState>({
    isSearching: false,
    abortController: null,
    searchId: 0,
  });

  /**
   * Check if current search is stale (aborted or superseded)
   */
  const isStale = useCallback(
    (controller: AbortController, searchId: number): boolean => {
      return (
        controller.signal.aborted ||
        searchId !== searchStateRef.current.searchId
      );
    },
    [],
  );

  /**
   * Perform WhatsMyName search with optimized batching
   */
  const searchWhatsMyName = useCallback(
    async (
      username: string,
      controller: AbortController,
      searchId: number,
    ): Promise<void> => {
      const response = await fetch(
        API_ENDPOINTS.WHATSMYNAME + "?username=" + encodeURIComponent(username),
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error("WhatsMyName search failed");
      }

      // Batch buffer for collecting results before state updates
      let buffer: SearchResult[] = [];
      let flushScheduled = false;
      let rafId: number | null = null;

      const flush = () => {
        flushScheduled = false;
        rafId = null;
        if (buffer.length === 0 || isStale(controller, searchId)) return;

        const batch = buffer;
        buffer = [];
        addWhatsMyNameResults(batch);
        incrementProgressCompletedBy(batch.length);
      };

      const scheduleFlush = () => {
        if (flushScheduled) return;
        flushScheduled = true;
        // Use requestAnimationFrame for batching updates to reduce re-renders
        rafId = requestAnimationFrame(flush);
      };

      try {
        for await (const data of parseNDJSONStream(response)) {
          if (isStale(controller, searchId)) break;

          if (isSearchMetadata(data)) {
            if (data.total) {
              setProgressTotal(data.total);
            }
            if (data.completed) {
              completeProgress();
            }
          } else if (isSearchResult(data)) {
            buffer.push(data);
            // Batch updates to reduce re-renders
            scheduleFlush();
          }
        }
      } finally {
        // Flush any remaining results
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        flush();
      }
    },
    [
      addWhatsMyNameResults,
      setProgressTotal,
      incrementProgressCompletedBy,
      completeProgress,
      isStale,
    ],
  );

  /**
   * Perform Google search
   */
  const searchGoogle = useCallback(
    async (
      username: string,
      controller: AbortController,
      searchId: number,
    ): Promise<void> => {
      const response = await fetch(
        API_ENDPOINTS.GOOGLE + "?username=" + encodeURIComponent(username),
        { signal: controller.signal },
      );

      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok || !isGoogleSearchResponse(payload)) {
        throw new Error("Google search failed");
      }

      if (!isStale(controller, searchId)) {
        setGoogleResponse(payload);
      }
    },
    [setGoogleResponse, isStale],
  );

  /**
   * Main search function
   */
  const search = useCallback(
    async (searchUsername: string): Promise<void> => {
      const trimmedUsername = searchUsername.trim();
      if (!trimmedUsername) return;

      // Check cache first if enabled
      if (enableCache) {
        const cached = getCached(trimmedUsername);
        if (cached && cached.whatsMyNameResults.length > 0) {
          setUsername(trimmedUsername);
          startSearch();

          // Simulate loading for better UX
          setTimeout(() => {
            addWhatsMyNameResults(cached.whatsMyNameResults);
            if (cached.googleResults) {
              setGoogleResponse(cached.googleResults);
            }
            setProgressTotal(cached.whatsMyNameResults.length);
            completeProgress();
            stopSearch();
            onCacheHit?.(trimmedUsername);
            onSearchComplete?.(
              trimmedUsername,
              cached.whatsMyNameResults.length,
            );
          }, 100);

          return;
        }
      }

      // Abort any in-flight search to avoid stale state updates
      searchStateRef.current.abortController?.abort();

      const controller = new AbortController();
      searchStateRef.current.abortController = controller;
      searchStateRef.current.searchId += 1;
      const searchId = searchStateRef.current.searchId;

      setUsername(trimmedUsername);
      startSearch();
      onSearchStart?.(trimmedUsername);

      let whatsMyNameResultCount = 0;

      try {
        const [whatsResult, googleResult] = await Promise.allSettled([
          searchWhatsMyName(trimmedUsername, controller, searchId),
          searchGoogle(trimmedUsername, controller, searchId),
        ]);

        if (!isStale(controller, searchId)) {
          if (whatsResult.status === "rejected") {
            console.error("WhatsMyName search error:", whatsResult.reason);
            const errorMsg = "Failed to complete WhatsMyName search";
            setError(errorMsg);
            onError?.(errorMsg);
          } else if (whatsResult.status === "fulfilled") {
            whatsMyNameResultCount =
              useSearchStore.getState().whatsMyNameResults.length;
          }

          if (googleResult.status === "rejected") {
            console.error("Google search error:", googleResult.reason);
            const errorMsg = "Failed to complete Google search";
            setGoogleError(errorMsg);
            onError?.(errorMsg);
          }

          // Cache results if enabled
          if (enableCache && whatsMyNameResultCount > 0) {
            const currentState = useSearchStore.getState();
            setCached(
              trimmedUsername,
              currentState.whatsMyNameResults,
              currentState.googleResults.length > 0
                ? {
                    items: currentState.googleResults,
                    searchInformation:
                      currentState.googleSearchInformation || undefined,
                    query: currentState.googleQuery || undefined,
                  }
                : null,
            );
          }

          onSearchComplete?.(trimmedUsername, whatsMyNameResultCount);
        }
      } finally {
        if (!isStale(controller, searchId)) {
          stopSearch();
        }
      }
    },
    [
      enableCache,
      getCached,
      setUsername,
      startSearch,
      addWhatsMyNameResults,
      setGoogleResponse,
      setProgressTotal,
      completeProgress,
      stopSearch,
      onCacheHit,
      onSearchStart,
      onSearchComplete,
      onError,
      searchWhatsMyName,
      searchGoogle,
      setError,
      setGoogleError,
      setCached,
      isStale,
    ],
  );

  /**
   * Abort current search
   */
  const abortSearch = useCallback(() => {
    searchStateRef.current.abortController?.abort();
    searchStateRef.current.abortController = null;
    stopSearch();
  }, [stopSearch]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    const abortController = searchStateRef.current.abortController;
    return () => {
      abortController?.abort();
    };
  }, []);

  return {
    search,
    abortSearch,
    isSearching: searchStateRef.current.isSearching,
  };
}

// Type guard for Google search response
function isGoogleSearchResponse(value: unknown): value is GoogleSearchResponse {
  return (
    !!value &&
    typeof value === "object" &&
    "items" in value &&
    Array.isArray((value as { items?: unknown }).items)
  );
}
