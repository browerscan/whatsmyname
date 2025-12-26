import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET } from "@/app/api/search/whatsmyname/route";
import { NextRequest } from "next/server";

/**
 * Integration Tests for WhatsMyName Search API
 *
 * Tests the /api/search/whatsmyname endpoint with proper mocking
 */
describe("WhatsMyName Search API", () => {
  const originalEnv = process.env;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.WHATSMYNAME_API_KEY = "test-api-key";

    // Mock fetch globally
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("should return 400 for missing username", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("should return 400 for invalid username with special characters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=user@name",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Validation failed");
  });

  it("should return 500 when API key is not configured", async () => {
    process.env.WHATSMYNAME_API_KEY = "";

    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=testuser",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("not configured");
  });

  it("should return streaming response with correct headers", async () => {
    // Mock successful streaming response
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            '{"source":"GitHub","username":"testuser","url":"https://github.com/testuser","isNSFW":false,"category":"coding","tags":["developer"],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":150}}\n',
          ),
        );
        controller.close();
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: mockStream,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=testuser",
      {
        headers: {
          "x-forwarded-for": "127.0.0.1",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/x-ndjson");
    expect(response.headers.get("Cache-Control")).toBe(
      "no-cache, no-transform",
    );
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-RateLimit-Limit")).toBeTruthy();
  });

  it("should call WhatsMyName API with correct parameters", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: mockStream,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=testuser",
    );

    await GET(request);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("username=testuser"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-api-key": "test-api-key",
          Accept: "application/x-ndjson",
        }),
      }),
    );
  });

  it("should handle API error responses", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "Server error",
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=testuser",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("WhatsMyName API error");
  });

  it("should handle timeout errors", async () => {
    const abortError = new Error("Request aborted");
    abortError.name = "AbortError";
    mockFetch.mockImplementationOnce(() => Promise.reject(abortError));

    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=testuser",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(504);
    expect(data.error).toContain("timed out");
  });

  it("should handle rate limiting headers", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: mockStream,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=testuser",
    );

    const response = await GET(request);

    expect(response.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(response.headers.get("X-RateLimit-Remaining")).toBeTruthy();
    expect(response.headers.get("X-RateLimit-Reset")).toBeTruthy();
  });

  it("should stream NDJSON data correctly", async () => {
    const githubEntry =
      '{"source":"GitHub","username":"test","url":"https://github.com/test","isNSFW":false,"category":"coding","tags":[],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":100}}\n';
    const twitterEntry =
      '{"source":"Twitter","username":"test","url":"https://twitter.com/test","isNSFW":false,"category":"social","tags":[],"checkResult":{"status":404,"checkType":"status_code","isExist":false,"responseTime":200}}\n';

    const encoder = new TextEncoder();
    let chunkIndex = 0;
    const chunks = [githubEntry, twitterEntry];

    const mockStream = new ReadableStream({
      pull(controller) {
        if (chunkIndex < chunks.length) {
          controller.enqueue(encoder.encode(chunks[chunkIndex]));
          chunkIndex++;
        } else {
          controller.close();
        }
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: mockStream,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/search/whatsmyname?username=test",
      {
        headers: {
          "x-forwarded-for": "127.0.0.200",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/x-ndjson");

    // Read the response body
    const reader = response.body?.getReader();
    expect(reader).toBeDefined();

    if (reader) {
      const decoder = new TextDecoder();
      let fullText = "";

      // Read all chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      expect(fullText).toContain("GitHub");
      expect(fullText).toContain("Twitter");
    }
  });
});
