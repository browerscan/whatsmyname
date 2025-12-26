import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { aiAnalyzeSchema, safeValidateRequest } from "@/lib/api-validation";
import {
  handleApiError,
  configurationErrorResponse,
  upstreamApiErrorResponse,
} from "@/lib/api-error-handler";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  // Rate limiting: 3 requests per 10 seconds per IP (AI queries are expensive)
  const clientIp = getClientIp(request);
  const rateLimitResult = await rateLimit(`ai:${clientIp}`, {
    interval: 10000,
    maxRequests: 3,
  });

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult);
  }

  try {
    const body = await request.json();

    // Validate request with Zod
    const validation = safeValidateRequest(aiAnalyzeSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { messages } = validation.data;

    // Validate API credentials
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model =
      process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3.1:free";

    if (!apiKey) {
      return configurationErrorResponse("OpenRouter API key not configured");
    }

    // Convert our message format to OpenRouter format
    const openRouterMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call OpenRouter API with streaming
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          request.headers.get("referer") || "https://whatismyname.org",
        "X-Title": "whatismyname",
      },
      body: JSON.stringify({
        model,
        messages: openRouterMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: AbortSignal.timeout(60000), // 60 seconds timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return upstreamApiErrorResponse(
        "OpenRouter",
        response.statusText,
        response.status,
      );
    }

    // Stream the SSE response back to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error("Response body is not readable"));
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Send completion marker
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
              break;
            }

            // Decode and add to buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE messages
            const lines = buffer.split("\n\n");
            buffer = lines.pop() || ""; // Keep incomplete message in buffer

            for (const message of lines) {
              if (message.trim()) {
                // Forward the SSE message as-is
                controller.enqueue(encoder.encode(message + "\n\n"));
              }
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);

          // Send error as SSE (sanitized for production)
          const errorMessage = {
            error:
              process.env.NODE_ENV === "production"
                ? "An error occurred during AI processing"
                : error instanceof Error
                  ? error.message
                  : "Unknown error",
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorMessage)}\n\n`),
          );
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
    });

    // Return streaming response with SSE headers and rate limit info
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Content-Type-Options": "nosniff",
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
      },
    });
  } catch (error: unknown) {
    return handleApiError(error, { context: "AI analyze API" });
  }
}

// Enable edge runtime for better performance
export const runtime = "edge";
