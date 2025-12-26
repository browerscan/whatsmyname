import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/ai/analyze/route";
import { NextRequest } from "next/server";

/**
 * Integration Tests for AI Analyze API
 *
 * Tests the /api/ai/analyze endpoint with proper mocking
 */
describe("AI Analyze API", () => {
  const originalEnv = process.env;
  let mockFetch: ReturnType<typeof vi.fn>;
  let testCounter = 0;

  beforeEach(() => {
    vi.resetModules();
    testCounter++;
    process.env = { ...originalEnv };
    process.env.OPENROUTER_API_KEY = "test-openrouter-key";
    process.env.OPENROUTER_MODEL = "deepseek/deepseek-chat-v3.1:free";
    process.env.NODE_ENV = "test";

    // Mock fetch globally
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("should return 400 for invalid request body", async () => {
    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({ invalid: "data" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("should return 400 for empty messages array", async () => {
    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({ messages: [] }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Validation failed");
  });

  it("should return 400 when first message is not from user", async () => {
    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "assistant", content: "Hello" }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("First message must be from the user");
  });

  it("should return 400 for non-alternating message roles", async () => {
    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Hello" },
          { role: "user", content: "Hello again" },
        ],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Messages must alternate");
  });

  it("should return 400 for message exceeding max length", async () => {
    const longContent = "a".repeat(4001);

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: longContent }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Validation failed");
  });

  it("should return 500 when OpenRouter API key is not configured", async () => {
    process.env.OPENROUTER_API_KEY = "";

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("not configured");
  });

  it("should return streaming response with SSE headers", async () => {
    // Mock successful SSE streaming response
    const mockStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode(
            'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
          ),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: mockStream,
    });

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: {
        "x-forwarded-for": `127.0.0.${testCounter}`,
        referer: "https://whatismyname.org",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");
    expect(response.headers.get("Cache-Control")).toBe(
      "no-cache, no-transform",
    );
    expect(response.headers.get("Connection")).toBe("keep-alive");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("should call OpenRouter API with correct parameters", async () => {
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

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Test message" },
          { role: "assistant", content: "Response" },
          { role: "user", content: "Follow up" },
        ],
      }),
    });

    await POST(request);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-openrouter-key",
          "Content-Type": "application/json",
          "HTTP-Referer": "https://whatismyname.org",
          "X-Title": "whatismyname",
        }),
        body: expect.stringContaining('"stream":true'),
      }),
    );
  });

  it("should handle OpenRouter API errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: async () => "Unauthorized",
    });

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain("OpenRouter API error");
  });

  it("should handle timeout errors", async () => {
    const error = new Error("AbortError");
    error.name = "AbortError";
    mockFetch.mockImplementationOnce(() => Promise.reject(error));

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(504);
    expect(data.error).toContain("timed out");
  });

  it("should include rate limit headers", async () => {
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

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);

    expect(response.headers.get("X-RateLimit-Limit")).toBe("3");
    expect(response.headers.get("X-RateLimit-Remaining")).toBeTruthy();
    expect(response.headers.get("X-RateLimit-Reset")).toBeTruthy();
  });

  it("should stream SSE chunks correctly", async () => {
    const chunks = [
      'data: {"choices":[{"delta":{"content":"Hello "}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"world"}}]}\n\n',
      "data: [DONE]\n\n",
    ];

    const mockStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: mockStream,
    });

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");

    // Read the response
    const reader = response.body?.getReader();
    expect(reader).toBeDefined();

    if (reader) {
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      expect(fullText).toContain("Hello ");
      expect(fullText).toContain("world");
      expect(fullText).toContain("[DONE]");
    }
  });

  it("should sanitize error messages in production mode", async () => {
    process.env.NODE_ENV = "production";

    mockFetch.mockRejectedValueOnce(new Error("Detailed internal error"));

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
    expect(data.details).toBe("An unexpected error occurred");
  });

  it("should include detailed errors in development mode", async () => {
    process.env.NODE_ENV = "development";

    mockFetch.mockRejectedValueOnce(new Error("Detailed internal error"));

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.details).toBe("Detailed internal error");
  });

  it("should limit messages to 50 per conversation", async () => {
    const messages = Array.from({ length: 51 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i}`,
    }));

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({ messages }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Maximum 50 messages");
  });

  it("should send completion marker at end of stream", async () => {
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

    const request = new NextRequest("http://localhost:3000/api/ai/analyze", {
      method: "POST",
      headers: { "x-forwarded-for": `127.0.0.${testCounter}` },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await POST(request);

    const reader = response.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      expect(fullText).toContain("[DONE]");
    }
  });
});
