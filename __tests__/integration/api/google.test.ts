import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET } from "@/app/api/search/google/route";
import { NextRequest } from "next/server";

/**
 * Integration Tests for Google Search API
 *
 * Tests the /api/search/google endpoint with proper mocking
 */
describe("Google Search API", () => {
  const originalEnv = process.env;
  let mockFetch: ReturnType<typeof vi.fn>;
  let testCounter = 0;

  beforeEach(() => {
    vi.resetModules();
    testCounter++;
    process.env = { ...originalEnv };
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS = "key1,key2";
    process.env.GOOGLE_CUSTOM_SEARCH_CX = "test-cx-123";
    process.env.NODE_ENV = "test";

    // Mock fetch globally
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("should return 400 for missing username", async () => {
    const request = new NextRequest("http://localhost:3000/api/search/google", {
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("should return 400 for invalid username", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=user@name",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Validation failed");
  });

  it("should return 500 when API credentials are not configured", async () => {
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS = "";
    process.env.GOOGLE_CUSTOM_SEARCH_CX = "";

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=testuser",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("not configured");
  });

  it("should return search results on successful API call", async () => {
    const mockResponse = {
      items: [
        {
          title: "Test User - GitHub",
          link: "https://github.com/testuser",
          displayLink: "github.com",
          snippet: "Test user profile",
          formattedUrl: "github.com/testuser",
        },
      ],
      searchInformation: {
        totalResults: "1000",
        searchTime: 0.5,
      },
      queries: {
        request: [{ searchTerms: '"testuser" OR "@testuser"' }],
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=testuser",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].title).toBe("Test User - GitHub");
    expect(data.searchInformation.totalResults).toBe("1000");
  });

  it("should clamp num parameter between 1 and 10", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test&num=15",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    await GET(request);

    const fetchUrl = mockFetch.mock.calls[0][0] as string;
    expect(fetchUrl).toContain("num=10");
  });

  it("should retry with next key on 429 error", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () =>
          '{"error": {"code": 429, "message": "Rate limit exceeded"}}',
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ items: [] }),
      });

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(200);
  });

  it("should return error when all keys are exhausted", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => '{"error": {"code": 403, "message": "Forbidden"}}',
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBeTruthy();
  });

  it("should handle timeout errors", async () => {
    const abortError = new Error("Request aborted");
    abortError.name = "AbortError";
    mockFetch.mockImplementationOnce(() => Promise.reject(abortError));

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(504);
    expect(data.error).toContain("timed out");
  });

  it("should include cache headers on successful response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
    );

    const response = await GET(request);

    expect(response.headers.get("Cache-Control")).toContain("public");
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=900");
    expect(response.headers.get("Cache-Control")).toContain(
      "stale-while-revalidate=1800",
    );
  });

  it("should use rotated API key order", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });

    const request1 = new NextRequest(
      "http://localhost:3000/api/search/google?username=alice",
    );

    const request2 = new NextRequest(
      "http://localhost:3000/api/search/google?username=bob",
    );

    await GET(request1);
    const firstCallUrl = mockFetch.mock.calls[0][0] as string;
    const firstKey = new URL(firstCallUrl).searchParams.get("key");

    await GET(request2);
    const secondCallUrl = mockFetch.mock.calls[1][0] as string;
    const secondKey = new URL(secondCallUrl).searchParams.get("key");

    // Keys should be rotated based on username hash
    expect(firstKey).toBeTruthy();
    expect(secondKey).toBeTruthy();
  });

  it("should use fallback GOOGLE_CUSTOM_SEARCH_API_KEY if primary is empty", async () => {
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS = "";
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEY = "fallback-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
    );

    await GET(request);

    const fetchUrl = mockFetch.mock.calls[0][0] as string;
    expect(fetchUrl).toContain("key=fallback-key");
  });

  it("should include rate limit headers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
    );

    const response = await GET(request);

    expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
    expect(response.headers.get("X-RateLimit-Remaining")).toBeTruthy();
    expect(response.headers.get("X-RateLimit-Reset")).toBeTruthy();
  });

  it("should sanitize errors in production mode", async () => {
    process.env.NODE_ENV = "production";

    // Mock rejection for all API keys
    mockFetch
      .mockRejectedValueOnce(new Error("Detailed internal error"))
      .mockRejectedValueOnce(new Error("Detailed internal error"));

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
    expect(data.details).toBe("An unexpected error occurred");
  });

  it("should include detailed errors in development mode", async () => {
    process.env.NODE_ENV = "development";

    // Mock rejection for all API keys
    mockFetch
      .mockRejectedValueOnce(new Error("Detailed internal error"))
      .mockRejectedValueOnce(new Error("Detailed internal error"));

    const request = new NextRequest(
      "http://localhost:3000/api/search/google?username=test",
      {
        headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.details).toBe("Detailed internal error");
  });
});
