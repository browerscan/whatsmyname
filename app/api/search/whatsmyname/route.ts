import { NextRequest, NextResponse } from "next/server";
import {
  rateLimit,
  getClientIp,
  rateLimitResponse,
  isBlockedBotRequest,
} from "@/lib/rate-limit";
import {
  type UsernameSearchRequest,
  usernameSearchSchema,
  safeValidateRequest,
} from "@/lib/api-validation";
import {
  handleApiError,
  configurationErrorResponse,
  upstreamApiErrorResponse,
} from "@/lib/api-error-handler";

const WHATSMYNAME_API_URL = "https://api.whatsmynameapp.org/api/v1/search";
const WHATSMYNAME_CACHE_CONTROL = "private, no-store, no-transform";
// A full check of ~1,500 platforms streams for about two minutes, so there is
// no total deadline: give up only when the upstream is slow to answer or stalls.
const UPSTREAM_RESPONSE_TIMEOUT_MS = 20_000;
const UPSTREAM_IDLE_TIMEOUT_MS = 30_000;

function createWhatsMyNameHeaders(headers?: HeadersInit): Headers {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", WHATSMYNAME_CACHE_CONTROL);
  return responseHeaders;
}

function createWhatsMyNameJsonResponse(
  body: unknown,
  init: ResponseInit = {},
): NextResponse {
  return NextResponse.json(body, {
    ...init,
    headers: createWhatsMyNameHeaders(init.headers),
  });
}

export async function GET(request: NextRequest) {
  if (isBlockedBotRequest(request)) {
    return createWhatsMyNameJsonResponse(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  // Rate limiting: 10 requests per 10 seconds per IP
  const clientIp = getClientIp(request);
  const rateLimitResult = await rateLimit(`whatsmyname:${clientIp}`, {
    interval: 10000,
    maxRequests: 10,
  });

  if (!rateLimitResult.success) {
    return rateLimitResponse(
      rateLimitResult,
      undefined,
      createWhatsMyNameHeaders(),
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  // Validate username
  const validation = safeValidateRequest<UsernameSearchRequest>(
    usernameSearchSchema,
    { username },
  );
  if (!validation.success) {
    return createWhatsMyNameJsonResponse(
      { error: validation.error },
      { status: 400 },
    );
  }

  const validatedUsername = validation.data.username;

  // Validate API key - use process.env (injected by OpenNext from Cloudflare env)
  const apiKey = process.env.WHATSMYNAME_API_KEY;
  if (!apiKey) {
    return configurationErrorResponse(
      "WhatsMyName API key not configured",
      createWhatsMyNameHeaders(),
    );
  }

  // Aborting the upstream request also errors its body, so one watchdog covers
  // both waiting for the response and each read of the stream.
  const upstream = new AbortController();
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  const armWatchdog = (ms: number) => {
    clearTimeout(watchdog);
    watchdog = setTimeout(
      () => upstream.abort(new DOMException("WhatsMyName upstream timed out", "TimeoutError")),
      ms,
    );
  };

  try {
    armWatchdog(UPSTREAM_RESPONSE_TIMEOUT_MS);
    const response = await fetch(
      `${WHATSMYNAME_API_URL}?username=${encodeURIComponent(validatedUsername)}`,
      {
        headers: {
          "x-api-key": apiKey,
          Accept: "application/x-ndjson",
        },
        signal: upstream.signal,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      clearTimeout(watchdog);
      console.error("WhatsMyName API error:", errorText);
      return upstreamApiErrorResponse(
        "WhatsMyName",
        response.statusText,
        response.status,
        createWhatsMyNameHeaders(),
      );
    }

    // Stream the NDJSON response back to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          clearTimeout(watchdog);
          controller.error(new Error("Response body is not readable"));
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            armWatchdog(UPSTREAM_IDLE_TIMEOUT_MS);
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
          clearTimeout(watchdog);
          reader.releaseLock();
        }
      },
      cancel(reason) {
        // The visitor left: stop the upstream check instead of reading it to the end.
        clearTimeout(watchdog);
        upstream.abort(reason);
      },
    });

    // Return streaming response with rate limit headers
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": WHATSMYNAME_CACHE_CONTROL,
        "X-Content-Type-Options": "nosniff",
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
      },
    });
  } catch (error: unknown) {
    clearTimeout(watchdog);
    return handleApiError(error, {
      context: "WhatsMyName API",
      headers: createWhatsMyNameHeaders(),
    });
  }
}
