import { NextRequest, NextResponse } from "next/server";
import { GoogleSearchResponse } from "@/types";
import {
  usernameSearchSchema,
  safeValidateRequest,
} from "@/lib/api-validation";
import {
  buildGoogleUsernameQuery,
  clampGoogleNum,
  formatGoogleErrorMessage,
  getRotatedKeyOrder,
  isRetryableGoogleError,
  parseGoogleApiKeys,
} from "@/lib/google-search";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import {
  handleApiError,
  configurationErrorResponse,
  validationErrorResponse,
} from "@/lib/api-error-handler";
import { getEnvVar } from "@/lib/cloudflare";

const GOOGLE_SEARCH_API_URL = "https://www.googleapis.com/customsearch/v1";

export async function GET(request: NextRequest) {
  // Rate limiting: 5 requests per 10 seconds per IP (stricter due to Google quota)
  const clientIp = getClientIp(request);
  const rateLimitResult = await rateLimit(`google:${clientIp}`, {
    interval: 10000,
    maxRequests: 5,
  });

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult);
  }

  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const numParam = searchParams.get("num");

  // Validate username with Zod
  const validation = safeValidateRequest(usernameSearchSchema, { username });
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const validatedUsername = validation.data.username;
  const num = clampGoogleNum(Number(numParam ?? "10"), 10);

  // Validate API credentials
  const configuredKeys = parseGoogleApiKeys(
    getEnvVar("GOOGLE_CUSTOM_SEARCH_API_KEYS"),
  );
  const fallbackKey = parseGoogleApiKeys(
    getEnvVar("GOOGLE_CUSTOM_SEARCH_API_KEY"),
  );
  const apiKeys = configuredKeys.length > 0 ? configuredKeys : fallbackKey;
  const cx = getEnvVar("GOOGLE_CUSTOM_SEARCH_CX");

  if (apiKeys.length === 0 || !cx) {
    return configurationErrorResponse(
      "Google Custom Search API credentials not configured (set GOOGLE_CUSTOM_SEARCH_CX and GOOGLE_CUSTOM_SEARCH_API_KEY(S))",
    );
  }

  try {
    const searchQuery = buildGoogleUsernameQuery(validatedUsername);
    if (!searchQuery) {
      return validationErrorResponse("Invalid search query");
    }

    const keyOrder = getRotatedKeyOrder(
      apiKeys,
      validatedUsername.toLowerCase(),
    );
    let lastError: { status: number; message: string } | null = null;

    for (let attempt = 0; attempt < keyOrder.length; attempt++) {
      const { key, index } = keyOrder[attempt];

      const url = new URL(GOOGLE_SEARCH_API_URL);
      url.searchParams.set("key", key);
      url.searchParams.set("cx", cx);
      url.searchParams.set("q", searchQuery);
      url.searchParams.set("num", String(num));
      url.searchParams.set("safe", "active");
      url.searchParams.set(
        "fields",
        [
          "items(title,link,displayLink,snippet,formattedUrl)",
          "searchInformation(searchTime,totalResults)",
          "queries(request(searchTerms))",
        ].join(","),
      );

      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(30000), // per-attempt timeout (30s for slow networks)
      });

      if (response.ok) {
        const data = (await response.json()) as {
          items?: unknown[];
          searchInformation?: GoogleSearchResponse["searchInformation"];
          queries?: { request?: Array<{ searchTerms?: string }> };
        };

        const result: GoogleSearchResponse & { query?: string } = {
          items: (data.items as GoogleSearchResponse["items"]) || [],
          searchInformation: data.searchInformation,
          query: data.queries?.request?.[0]?.searchTerms,
        };

        // Cache the response to reduce quota usage
        return NextResponse.json(result, {
          headers: {
            "Cache-Control":
              "public, s-maxage=900, stale-while-revalidate=1800",
            "X-Google-Key-Index": String(index),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
          },
        });
      }

      const errorText = await response.text();
      let errorPayload: unknown = null;
      try {
        errorPayload = errorText ? JSON.parse(errorText) : null;
      } catch {
        errorPayload = { error: { message: errorText || response.statusText } };
      }

      const message = formatGoogleErrorMessage(response.status, errorPayload);
      lastError = { status: response.status, message };

      const shouldRetry =
        attempt < keyOrder.length - 1 &&
        isRetryableGoogleError(response.status, errorPayload);

      if (!shouldRetry) {
        return NextResponse.json(
          { error: message },
          { status: response.status },
        );
      }

      console.warn(
        `Google Search API attempt ${attempt + 1}/${keyOrder.length} failed (status=${response.status}, keyIndex=${index}). Retrying with next key...`,
      );
    }

    return NextResponse.json(
      {
        error:
          lastError?.message || "Google Search API error (all API keys failed)",
      },
      { status: lastError?.status || 502 },
    );
  } catch (error: unknown) {
    return handleApiError(error, { context: "Google Search API" });
  }
}

// Enable edge runtime for better performance
