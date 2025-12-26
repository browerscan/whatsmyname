/**
 * Standardized error types for the whatsmyname application
 *
 * Provides consistent error handling across all modules with proper
 * error codes, messages, and metadata for debugging and user feedback.
 */

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * Convert error to a plain object for serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

/**
 * Error codes for different types of errors
 */
export enum ErrorCode {
  // Network Errors
  NETWORK_ERROR = "NETWORK_ERROR",
  NETWORK_TIMEOUT = "NETWORK_TIMEOUT",
  NETWORK_ABORTED = "NETWORK_ABORTED",

  // API Errors
  API_ERROR = "API_ERROR",
  API_RATE_LIMIT = "API_RATE_LIMIT",
  API_UNAUTHORIZED = "API_UNAUTHORIZED",
  API_NOT_FOUND = "API_NOT_FOUND",
  API_SERVER_ERROR = "API_SERVER_ERROR",

  // Validation Errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_USERNAME = "INVALID_USERNAME",
  INVALID_INPUT = "INVALID_INPUT",

  // Search Errors
  SEARCH_ERROR = "SEARCH_ERROR",
  SEARCH_FAILED = "SEARCH_FAILED",
  SEARCH_NO_RESULTS = "SEARCH_NO_RESULTS",

  // AI Errors
  AI_ERROR = "AI_ERROR",
  AI_STREAM_ERROR = "AI_STREAM_ERROR",
  AI_PARSE_ERROR = "AI_PARSE_ERROR",
  AI_TIMEOUT = "AI_TIMEOUT",

  // Cache Errors
  CACHE_ERROR = "CACHE_ERROR",
  CACHE_MISS = "CACHE_MISS",

  // State Errors
  STATE_ERROR = "STATE_ERROR",
  STATE_INVALID = "STATE_INVALID",
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.NETWORK_ERROR, details);
  }
}

export class NetworkTimeoutError extends AppError {
  constructor(timeout: number) {
    const message = "Request timeout after " + timeout + "ms";
    super(message, ErrorCode.NETWORK_TIMEOUT, { timeout });
  }
}

export class NetworkAbortedError extends AppError {
  constructor() {
    super("Request was aborted", ErrorCode.NETWORK_ABORTED);
  }
}

/**
 * API-related errors
 */
export class APIError extends AppError {
  constructor(
    message: string,
    public status?: number,
    details?: Record<string, unknown>,
  ) {
    const allDetails = { ...details, status };
    super(message, ErrorCode.API_ERROR, allDetails);
    this.status = status;
  }
}

export class APIRateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super(
      "Rate limit exceeded. Please try again later.",
      ErrorCode.API_RATE_LIMIT,
      { retryAfter },
    );
  }
}

/**
 * Validation-related errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    details?: Record<string, unknown>,
  ) {
    const allDetails = { ...details, field };
    super(message, ErrorCode.VALIDATION_ERROR, allDetails);
  }
}

export class InvalidUsernameError extends ValidationError {
  constructor(username: string, reason?: string) {
    const baseMsg = "Invalid username: " + username;
    const fullMsg = reason ? baseMsg + " (" + reason + ")" : baseMsg;
    super(fullMsg, "username", { username, reason });
    this.code = ErrorCode.INVALID_USERNAME;
  }
}

/**
 * Search-related errors
 */
export class SearchError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.SEARCH_ERROR, details);
  }
}

/**
 * AI-related errors
 */
export class AIError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.AI_ERROR, details);
  }
}

export class AIStreamError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.AI_STREAM_ERROR, details);
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if an error is a specific error type
 */
export function isErrorType<T extends AppError>(
  error: unknown,
  errorClass: new (...args: unknown[]) => T,
): error is T {
  return error instanceof errorClass;
}

/**
 * Get a user-friendly error message
 */
export function getUserMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Get error code from unknown error
 */
export function getErrorCode(error: unknown): string {
  if (isAppError(error)) {
    return error.code;
  }

  if (error instanceof Error) {
    return error.name;
  }

  return "UNKNOWN_ERROR";
}

/**
 * Create error from unknown value
 * Useful for catching and standardizing errors from external sources
 */
export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, ErrorCode.API_ERROR, {
      originalError: error.name,
    });
  }

  return new AppError(
    typeof error === "string" ? error : "Unknown error occurred",
    ErrorCode.API_ERROR,
    { originalValue: error },
  );
}
