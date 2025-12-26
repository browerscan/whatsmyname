import { describe, it, expect, vi } from "vitest";
import {
  parseNDJSONStream,
  parseSSEStream,
  isSearchMetadata,
  isSearchResult,
} from "@/lib/parsers";
import { SearchResult, SearchMetadata } from "@/types";

/**
 * Streaming Edge Case Tests
 *
 * Tests for NDJSON and SSE stream parsing edge cases
 */
describe("NDJSON Stream Parsing", () => {
  it("should parse complete NDJSON lines", async () => {
    const ndjson =
      '{"source":"GitHub","username":"test","url":"https://github.com/test","isNSFW":false,"category":"coding","tags":[],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":100}}\n{"source":"Twitter","username":"test","url":"https://twitter.com/test","isNSFW":false,"category":"social","tags":[],"checkResult":{"status":404,"checkType":"status_code","isExist":false,"responseTime":200}}\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(ndjson));
        controller.close();
      },
    });

    const results: SearchResult[] = [];
    const metadata: SearchMetadata[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchResult(item)) {
        results.push(item);
      } else if (isSearchMetadata(item)) {
        metadata.push(item);
      }
    }

    expect(results).toHaveLength(2);
    expect(results[0].source).toBe("GitHub");
    expect(results[1].source).toBe("Twitter");
  });

  it("should handle incomplete NDJSON lines at end of stream", async () => {
    // Last line is incomplete (no newline)
    const ndjson =
      '{"source":"GitHub","username":"test","url":"https://github.com/test","isNSFW":false,"category":"coding","tags":[],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":100}}\n{"source":"Twitter';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(ndjson));
        controller.close();
      },
    });

    const results: SearchResult[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchResult(item)) {
        results.push(item);
      }
    }

    // Should parse the complete line and handle incomplete buffer
    expect(results).toHaveLength(1);
    expect(results[0].source).toBe("GitHub");
  });

  it("should handle empty NDJSON stream", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const results: SearchResult[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchResult(item)) {
        results.push(item);
      }
    }

    expect(results).toHaveLength(0);
  });

  it("should handle NDJSON with only whitespace and newlines", async () => {
    const ndjson = "\n\n   \n\n";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(ndjson));
        controller.close();
      },
    });

    const results: SearchResult[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchResult(item)) {
        results.push(item);
      }
    }

    expect(results).toHaveLength(0);
  });

  it("should handle chunked NDJSON data split across packets", async () => {
    const completeJson =
      '{"source":"GitHub","username":"test","url":"https://github.com/test","isNSFW":false,"category":"coding","tags":[],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":100}}\n';

    const mockStream = new ReadableStream({
      start(controller) {
        // Split the data into two chunks
        const chunk1 = completeJson.slice(0, 50);
        const chunk2 = completeJson.slice(50);
        controller.enqueue(new TextEncoder().encode(chunk1));
        controller.enqueue(new TextEncoder().encode(chunk2));
        controller.close();
      },
    });

    const results: SearchResult[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchResult(item)) {
        results.push(item);
      }
    }

    expect(results).toHaveLength(1);
    expect(results[0].source).toBe("GitHub");
  });

  it("should skip malformed JSON lines and continue", async () => {
    const ndjson =
      '{"source":"GitHub","username":"test","url":"https://github.com/test","isNSFW":false,"category":"coding","tags":[],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":100}}\n{invalid json}\n{"source":"Twitter","username":"test","url":"https://twitter.com/test","isNSFW":false,"category":"social","tags":[],"checkResult":{"status":404,"checkType":"status_code","isExist":false,"responseTime":200}}\n';

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(ndjson));
        controller.close();
      },
    });

    const results: SearchResult[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchResult(item)) {
        results.push(item);
      }
    }

    // Should parse valid lines and skip invalid
    expect(results).toHaveLength(2);
    expect(results[0].source).toBe("GitHub");
    expect(results[1].source).toBe("Twitter");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle very long NDJSON lines", async () => {
    const longString = "a".repeat(10000);
    const ndjson = `{"source":"GitHub","username":"test","url":"https://github.com/test","isNSFW":false,"category":"coding","tags":["${longString}"],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":100}}\n`;

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(ndjson));
        controller.close();
      },
    });

    const results: SearchResult[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchResult(item)) {
        results.push(item);
      }
    }

    expect(results).toHaveLength(1);
    expect(results[0].tags[0].length).toBe(10000);
  });

  it("should throw error when response body is not readable", async () => {
    const mockResponse = new Response(null) as Response;

    await expect(async () => {
      for await (const _ of parseNDJSONStream(mockResponse)) {
        // Should throw
      }
    }).rejects.toThrow();
  });

  it("should release reader lock after completion", async () => {
    const ndjson =
      '{"source":"GitHub","username":"test","url":"https://github.com/test","isNSFW":false,"category":"coding","tags":[],"checkResult":{"status":200,"checkType":"status_code","isExist":true,"responseTime":100}}\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(ndjson));
        controller.close();
      },
    });

    const response = new Response(mockStream);

    // Consume the stream
    for await (const _ of parseNDJSONStream(response)) {
      // Process items
    }

    // Stream should be closed and lock released
    expect(response.body?.locked).toBe(false);
  });

  it("should process metadata objects", async () => {
    const ndjson = '{"total":100,"completed":50}\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(ndjson));
        controller.close();
      },
    });

    const metadata: SearchMetadata[] = [];

    for await (const item of parseNDJSONStream(new Response(mockStream))) {
      if (isSearchMetadata(item)) {
        metadata.push(item);
      }
    }

    expect(metadata).toHaveLength(1);
    expect(metadata[0].total).toBe(100);
    expect(metadata[0].completed).toBe(50);
  });
});

describe("SSE Stream Parsing", () => {
  it("should parse SSE data events", async () => {
    const sse =
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: {"choices":[{"delta":{"content":" world"}}]}\n\ndata: [DONE]\n\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello", " world"]);
  });

  it("should handle incomplete SSE messages", async () => {
    // Split message across chunks
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            'data: {"choices":[{"delta":{"content":"Hel',
          ),
        );
        controller.enqueue(new TextEncoder().encode('lo"}}]}\n\n'));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello"]);
  });

  it("should handle SSE with mixed newlines", async () => {
    const sse =
      'data: {"choices":[{"delta":{"content":"Test"}}]}\n' +
      "\n" +
      'data: {"choices":[{"delta":{"content":" data"}}]}\n\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Test", " data"]);
  });

  it("should stop on [DONE] message", async () => {
    const sse =
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: [DONE]\n\ndata: {"choices":[{"delta":{"content":"Should not parse"}}]}\n\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello"]);
  });

  it("should handle non-JSON SSE data", async () => {
    const sse = "data: plain text message\n\n";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["plain text message"]);
  });

  it("should skip SSE comments", async () => {
    const sse = `: comment line
data: {"choices":[{"delta":{"content":"Hello"}}]}

`;

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    // Comments are ignored, only data is parsed
    expect(chunks.length).toBeGreaterThan(0);
  });

  it("should handle empty SSE stream", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(0);
  });

  it("should handle SSE with only whitespace", async () => {
    const sse = "   \n\n   \n\n";

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(0);
  });

  it("should extract content from OpenRouter format", async () => {
    const sse = 'data: {"choices":[{"delta":{"content":"Response text"}}]}\n\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Response text"]);
  });

  it("should extract content from simple format", async () => {
    const sse = 'data: {"content":"Simple response"}\n\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Simple response"]);
  });

  it("should handle SSE events without content field", async () => {
    const sse = 'data: {"other":"field"}\n\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];

    for await (const chunk of parseSSEStream(new Response(mockStream))) {
      chunks.push(chunk);
    }

    // Should not add empty content
    expect(chunks).toHaveLength(0);
  });

  it("should release reader lock after SSE completion", async () => {
    const sse =
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: [DONE]\n\n';

    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const response = new Response(mockStream);

    for await (const _ of parseSSEStream(response)) {
      // Process
    }

    expect(response.body?.locked).toBe(false);
  });

  it("should throw error when response body is not readable for SSE", async () => {
    const mockResponse = new Response(null) as Response;

    await expect(async () => {
      for await (const _ of parseSSEStream(mockResponse)) {
        // Should throw
      }
    }).rejects.toThrow();
  });
});

describe("Stream Type Guards", () => {
  it("should identify SearchResult objects", () => {
    const result: SearchResult = {
      source: "GitHub",
      username: "test",
      url: "https://github.com/test",
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

    expect(isSearchResult(result)).toBe(true);
    expect(isSearchMetadata(result)).toBe(false);
  });

  it("should identify SearchMetadata objects", () => {
    const metadata: SearchMetadata = { total: 100, completed: 50 };

    expect(isSearchMetadata(metadata)).toBe(true);
    expect(isSearchResult(metadata)).toBe(false);
  });

  it("should handle partial metadata", () => {
    const partialMetadata: SearchMetadata = { total: 100 };

    expect(isSearchMetadata(partialMetadata)).toBe(true);
  });

  it("should handle completed-only metadata", () => {
    const completedMetadata: SearchMetadata = { completed: true };

    expect(isSearchMetadata(completedMetadata)).toBe(true);
  });
});
