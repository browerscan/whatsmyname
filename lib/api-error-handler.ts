import { NextResponse } from "next/server";

/**
 * Standardized API error response type
 */
export interface ApiErrorResponse {
  error: string;
  details?: string;
}

/**
 * Options for API error handling
 */
export interface HandleApiErrorOptions {
  /** Context for logging (e.g., "WhatsMyName API", "Google Search API") */
  context?: string;
  /** Whether to include error details in production (default: false) */
  exposeDetailsInProduction?: boolean;
  /** Additional headers for the response */
  headers?: HeadersInit;
}

function createJsonHeaders(headers?: HeadersInit): HeadersInit | undefined {
  if (!headers) {
    return undefined;
  }

  return new Headers(headers);
}

/**
 * Handles API errors consistently across all API routes.
 *
 * Features:
 * - Detects and handles timeout errors (AbortError, TimeoutError)
 * - Sanitizes error messages in production
 * - Logs errors with context
 * - Returns appropriate HTTP status codes
 *
 * @param error - The caught error
 * @param options - Optional configuration
 * @returns NextResponse with standardized error format
 *
 * @example
 * ```typescript
 * try {
 *   // API logic
 * } catch (error) {
 *   return handleApiError(error, { context: "WhatsMyName API" });
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  options: HandleApiErrorOptions = {},
): NextResponse<ApiErrorResponse> {
  const {
    context = "API",
    exposeDetailsInProduction = false,
    headers,
  } = options;
  const errorObj = error as Error;

  // Log the error with context
  console.error(`${context} route error:`, error);

  // Handle timeout errors
  if (isTimeoutError(errorObj)) {
    return NextResponse.json(
      { error: "Request timed out" },
      { status: 504, headers: createJsonHeaders(headers) },
    );
  }

  // Determine error details based on environment
  const details = getErrorDetails(errorObj, exposeDetailsInProduction);

  return NextResponse.json(
    { error: "Internal server error", details },
    { status: 500, headers: createJsonHeaders(headers) },
  );
}

/**
 * Checks if an error is a timeout-related error
 */
export function isTimeoutError(error: Error): boolean {
  return error.name === "AbortError" || error.name === "TimeoutError";
}

/**
 * Gets appropriate error details based on environment
 */
export function getErrorDetails(
  error: Error,
  exposeInProduction = false,
): string {
  if (process.env.NODE_ENV === "production" && !exposeInProduction) {
    return "An unexpected error occurred";
  }
  return error.message;
}

/**
 * Creates a validation error response
 */
export function validationErrorResponse(
  message: string,
  headers?: HeadersInit,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: message },
    { status: 400, headers: createJsonHeaders(headers) },
  );
}

/**
 * Creates a configuration error response (missing API keys, etc.)
 */
export function configurationErrorResponse(
  message: string,
  headers?: HeadersInit,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: message },
    { status: 500, headers: createJsonHeaders(headers) },
  );
}

/**
 * Creates an upstream API error response
 */
export function upstreamApiErrorResponse(
  serviceName: string,
  statusText: string,
  status: number,
  headers?: HeadersInit,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: `${serviceName} API error: ${statusText}` },
    { status, headers: createJsonHeaders(headers) },
  );
}
