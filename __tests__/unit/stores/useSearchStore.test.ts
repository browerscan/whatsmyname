import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearchStore } from "@/stores/useSearchStore";
import { SearchResult, GoogleSearchResponse } from "@/types";

/**
 * Unit Tests for Search Store
 *
 * Tests the Zustand store for search state management
 */
describe("useSearchStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { reset } = useSearchStore.getState();
    reset();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useSearchStore());

    expect(result.current.username).toBe("");
    expect(result.current.isSearching).toBe(false);
    expect(result.current.whatsMyNameResults).toEqual([]);
    expect(result.current.googleResults).toEqual([]);
    expect(result.current.googleQuery).toBeNull();
    expect(result.current.googleSearchInformation).toBeNull();
    expect(result.current.googleError).toBeNull();
    expect(result.current.progress).toEqual({
      total: 0,
      completed: 0,
      percentage: 0,
    });
    expect(result.current.error).toBeNull();
  });

  it("should set username", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setUsername("testuser");
    });

    expect(result.current.username).toBe("testuser");
  });

  it("should start search and reset state", () => {
    const { result } = renderHook(() => useSearchStore());

    // Set some state first
    act(() => {
      result.current.setUsername("olduser");
      result.current.setGoogleResponse({
        items: [
          {
            title: "Test",
            link: "https://test.com",
            displayLink: "test.com",
            snippet: "test",
          },
        ],
        searchInformation: { totalResults: "100", searchTime: 0.5 },
      });
    });

    act(() => {
      result.current.startSearch();
    });

    expect(result.current.isSearching).toBe(true);
    expect(result.current.whatsMyNameResults).toEqual([]);
    expect(result.current.googleResults).toEqual([]);
    expect(result.current.googleQuery).toBeNull();
    expect(result.current.googleSearchInformation).toBeNull();
    expect(result.current.googleError).toBeNull();
    expect(result.current.progress).toEqual({
      total: 0,
      completed: 0,
      percentage: 0,
    });
    expect(result.current.error).toBeNull();
    // Username should remain
    expect(result.current.username).toBe("olduser");
  });

  it("should stop search", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.startSearch();
    });

    expect(result.current.isSearching).toBe(true);

    act(() => {
      result.current.stopSearch();
    });

    expect(result.current.isSearching).toBe(false);
  });

  it("should add single WhatsMyName result", () => {
    const { result } = renderHook(() => useSearchStore());

    const mockResult: SearchResult = {
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
    };

    act(() => {
      result.current.addWhatsMyNameResult(mockResult);
    });

    expect(result.current.whatsMyNameResults).toHaveLength(1);
    expect(result.current.whatsMyNameResults[0]).toEqual(mockResult);
  });

  it("should add multiple WhatsMyName results", () => {
    const { result } = renderHook(() => useSearchStore());

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
    ];

    act(() => {
      result.current.addWhatsMyNameResults(mockResults);
    });

    expect(result.current.whatsMyNameResults).toHaveLength(2);
    expect(result.current.whatsMyNameResults[0].source).toBe("GitHub");
    expect(result.current.whatsMyNameResults[1].source).toBe("Twitter");
  });

  it("should append results when adding multiple times", () => {
    const { result } = renderHook(() => useSearchStore());

    const result1: SearchResult = {
      source: "GitHub",
      username: "testuser",
      url: "https://github.com/testuser",
      isNSFW: false,
      category: "coding",
      tags: [],
      checkResult: {
        status: 200,
        checkType: "status_code",
        isExist: true,
        responseTime: 100,
      },
    };

    const result2: SearchResult = {
      source: "Twitter",
      username: "testuser",
      url: "https://twitter.com/testuser",
      isNSFW: false,
      category: "social",
      tags: [],
      checkResult: {
        status: 200,
        checkType: "status_code",
        isExist: true,
        responseTime: 200,
      },
    };

    act(() => {
      result.current.addWhatsMyNameResult(result1);
      result.current.addWhatsMyNameResult(result2);
    });

    expect(result.current.whatsMyNameResults).toHaveLength(2);
  });

  it("should set Google response", () => {
    const { result } = renderHook(() => useSearchStore());

    const mockResponse: GoogleSearchResponse = {
      items: [
        {
          title: "Test User - GitHub",
          link: "https://github.com/testuser",
          displayLink: "github.com",
          snippet: "Test user profile",
        },
      ],
      searchInformation: {
        totalResults: "1000",
        searchTime: 0.5,
      },
      query: '"testuser" OR "@testuser"',
    };

    act(() => {
      result.current.setGoogleResponse(mockResponse);
    });

    expect(result.current.googleResults).toHaveLength(1);
    expect(result.current.googleResults[0].title).toBe("Test User - GitHub");
    expect(result.current.googleQuery).toBe('"testuser" OR "@testuser"');
    expect(result.current.googleSearchInformation).toEqual({
      totalResults: "1000",
      searchTime: 0.5,
    });
    expect(result.current.googleError).toBeNull();
  });

  it("should set Google error and clear Google data", () => {
    const { result } = renderHook(() => useSearchStore());

    // Set some data first
    act(() => {
      result.current.setGoogleResponse({
        items: [
          {
            title: "Test",
            link: "https://test.com",
            displayLink: "test.com",
            snippet: "test",
          },
        ],
      });
    });

    act(() => {
      result.current.setGoogleError("API rate limit exceeded");
    });

    expect(result.current.googleError).toBe("API rate limit exceeded");
    expect(result.current.googleResults).toEqual([]);
    expect(result.current.googleQuery).toBeNull();
    expect(result.current.googleSearchInformation).toBeNull();
  });

  it("should set progress total", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(100);
    });

    expect(result.current.progress).toEqual({
      total: 100,
      completed: 0,
      percentage: 0,
    });
  });

  it("should increment progress completed", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(100);
    });

    act(() => {
      result.current.incrementProgressCompleted();
    });

    expect(result.current.progress).toEqual({
      total: 100,
      completed: 1,
      percentage: 1,
    });
  });

  it("should increment progress completed by count", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(100);
    });

    act(() => {
      result.current.incrementProgressCompletedBy(5);
    });

    expect(result.current.progress).toEqual({
      total: 100,
      completed: 5,
      percentage: 5,
    });
  });

  it("should handle negative values in incrementProgressCompletedBy", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(100);
      result.current.incrementProgressCompletedBy(-5);
    });

    expect(result.current.progress.completed).toBeGreaterThanOrEqual(0);
  });

  it("should complete progress", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(100);
      result.current.incrementProgressCompleted();
    });

    act(() => {
      result.current.completeProgress();
    });

    expect(result.current.progress).toEqual({
      total: 100,
      completed: 100,
      percentage: 100,
    });
  });

  it("should calculate percentage correctly", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(200);
    });

    act(() => {
      result.current.incrementProgressCompletedBy(50);
    });

    expect(result.current.progress.percentage).toBe(25);
  });

  it("should handle zero total gracefully", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(0);
      result.current.incrementProgressCompleted();
    });

    expect(result.current.progress.percentage).toBe(0);
  });

  it("should cap completed at total", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setProgressTotal(10);
      result.current.incrementProgressCompletedBy(100);
    });

    expect(result.current.progress.completed).toBe(10);
    expect(result.current.progress.percentage).toBe(100);
  });

  it("should set error and stop searching", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.startSearch();
    });

    act(() => {
      result.current.setError("Search failed");
    });

    expect(result.current.error).toBe("Search failed");
    expect(result.current.isSearching).toBe(false);
  });

  it("should reset all state", () => {
    const { result } = renderHook(() => useSearchStore());

    // Set some state
    act(() => {
      result.current.setUsername("testuser");
      result.current.startSearch();
      result.current.setProgressTotal(100);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.username).toBe("");
    expect(result.current.isSearching).toBe(false);
    expect(result.current.whatsMyNameResults).toEqual([]);
    expect(result.current.googleResults).toEqual([]);
    expect(result.current.googleQuery).toBeNull();
    expect(result.current.googleSearchInformation).toBeNull();
    expect(result.current.googleError).toBeNull();
    expect(result.current.progress).toEqual({
      total: 0,
      completed: 0,
      percentage: 0,
    });
    expect(result.current.error).toBeNull();
  });

  it("should handle empty Google response", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setGoogleResponse({ items: [] });
    });

    expect(result.current.googleResults).toEqual([]);
    expect(result.current.googleQuery).toBeNull();
    expect(result.current.googleSearchInformation).toBeNull();
  });

  it("should handle Google response without query", () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setGoogleResponse({
        items: [
          {
            title: "Test",
            link: "https://test.com",
            displayLink: "test.com",
            snippet: "test",
          },
        ],
      });
    });

    expect(result.current.googleQuery).toBeNull();
  });
});
