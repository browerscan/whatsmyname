import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import {
  usernameSearchSchema,
  safeValidateRequest,
} from "@/lib/api-validation";
import {
  handleApiError,
  configurationErrorResponse,
  upstreamApiErrorResponse,
} from "@/lib/api-error-handler";

const WHATSMYNAME_API_URL = "https://api.whatsmynameapp.org/api/v1/search";

export async function GET(request: NextRequest) {
  // Rate limiting: 10 requests per 10 seconds per IP
  const clientIp = getClientIp(request);
  const rateLimitResult = await rateLimit(`whatsmyname:${clientIp}`, {
    interval: 10000,
    maxRequests: 10,
  });

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult);
  }

  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  // Validate username with Zod
  const validation = safeValidateRequest(usernameSearchSchema, { username });
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const validatedUsername = validation.data.username;

  // Validate API key
  const apiKey = process.env.WHATSMYNAME_API_KEY;
  if (!apiKey) {
    return configurationErrorResponse("WhatsMyName API key not configured");
  }

  try {
    // Call WhatsMyName API
    const response = await fetch(
      `${WHATSMYNAME_API_URL}?username=${encodeURIComponent(validatedUsername)}`,
      {
        headers: {
          "x-api-key": apiKey,
          Accept: "application/x-ndjson",
        },
        // Set a timeout
        signal: AbortSignal.timeout(60000), // 60 seconds for streaming
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WhatsMyName API error:", errorText);
      return upstreamApiErrorResponse(
        "WhatsMyName",
        response.statusText,
        response.status,
      );
    }

    // Stream the NDJSON response back to the client
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
              // Send any remaining buffer
              if (buffer.trim()) {
                controller.enqueue(encoder.encode(buffer + "\n"));
              }
              controller.close();
              break;
            }

            // Decode and add to buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete lines
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim()) {
                // Send each line as NDJSON
                controller.enqueue(encoder.encode(line + "\n"));
              }
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    // Return streaming response with rate limit headers
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
      },
    });
  } catch (error: unknown) {
    return handleApiError(error, { context: "WhatsMyName API" });
  }
}

// Enable edge runtime for better performance
