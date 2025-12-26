import { SearchResult, SearchMetadata } from "@/types";

/**
 * Parse NDJSON (Newline Delimited JSON) stream
 *
 * NDJSON is a format where each line is a valid JSON object.
 * This async generator handles streaming responses, yielding each
 * parsed JSON object as it arrives.
 *
 * @param response - The Fetch API Response object containing a readable body
 * @yields SearchResult or SearchMetadata objects parsed from the stream
 * @throws {Error} If the response body is not readable
 *
 * @example
 * ```ts
 * for await (const data of parseNDJSONStream(response)) {
 *   if (isSearchResult(data)) {
 *     console.log('Found:', data.source);
 *   }
 * }
 * ```
 */
export async function* parseNDJSONStream(
  response: Response,
): AsyncGenerator<SearchResult | SearchMetadata> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          try {
            const parsed = JSON.parse(trimmedLine);
            yield parsed;
          } catch {
            console.error("Failed to parse JSON line:", trimmedLine);
          }
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      try {
        yield JSON.parse(buffer);
      } catch (error) {
        console.error("Failed to parse final buffer:", buffer, error);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Parse Server-Sent Events (SSE) stream for AI responses
 *
 * SSE is a format where events are sent as text blocks separated
 * by double newlines, with each event starting with "data: ".
 * This parser handles the OpenRouter-compatible SSE format.
 *
 * Expected SSE format:
 * - Standard: "data: {content}"
 * - OpenRouter: "data: {"choices":[{"delta":{"content":"..."}}]}"
 * - Termination: "data: [DONE]"
 *
 * @param response - The Fetch API Response object containing a readable body
 * @yields String content chunks from the AI stream
 * @throws {Error} If the response body is not readable
 *
 * @example
 * ```ts
 * let fullContent = "";
 * for await (const chunk of parseSSEStream(response)) {
 *   fullContent += chunk;
 *   updateUI(fullContent);
 * }
 * ```
 */
export async function* parseSSEStream(
  response: Response,
): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");

      // Keep the last incomplete message in the buffer
      buffer = lines.pop() || "";

      for (const message of lines) {
        if (message.trim()) {
          // Parse SSE format: "data: {content}"
          const messageLines = message.split("\n");
          for (const line of messageLines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6); // Remove "data: " prefix
              if (data === "[DONE]") {
                return;
              }
              try {
                const parsed = JSON.parse(data);
                // OpenRouter format: { choices: [{ delta: { content: "..." } }] }
                const content =
                  parsed.choices?.[0]?.delta?.content || parsed.content || "";
                if (content) {
                  yield content;
                }
              } catch {
                // If it's not JSON, yield the raw data
                yield data;
              }
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Type guard to check if data is a SearchMetadata object
 *
 * SearchMetadata objects contain progress information like total
 * count and completion status, distinct from actual search results.
 *
 * @param data - The data to check
 * @returns True if the data is a SearchMetadata object
 *
 * @example
 * ```ts
 * for await (const data of parseNDJSONStream(response)) {
 *   if (isSearchMetadata(data)) {
 *     console.log('Progress:', data.total, 'items');
 *   }
 * }
 * ```
 */
export function isSearchMetadata(
  data: SearchResult | SearchMetadata,
): data is SearchMetadata {
  return "total" in data || "completed" in data;
}

/**
 * Type guard to check if data is a SearchResult object
 *
 * SearchResult objects contain actual platform detection results
 * with source information, URLs, and check results.
 *
 * @param data - The data to check
 * @returns True if the data is a SearchResult object
 *
 * @example
 * ```ts
 * for await (const data of parseNDJSONStream(response)) {
 *   if (isSearchResult(data)) {
 *     console.log('Found at:', data.source, data.url);
 *   }
 * }
 * ```
 */
export function isSearchResult(
  data: SearchResult | SearchMetadata,
): data is SearchResult {
  return "source" in data && "checkResult" in data;
}
