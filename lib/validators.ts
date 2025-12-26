import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_REGEX,
} from "./constants";

export interface ValidationResult {
  isValid: boolean;
  errorKey?: "required" | "too_short" | "too_long" | "invalid_chars";
}

/**
 * Validate username format
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim().length === 0) {
    return {
      isValid: false,
      errorKey: "required",
    };
  }

  const trimmed = username.trim();

  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return {
      isValid: false,
      errorKey: "too_short",
    };
  }

  if (trimmed.length > USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      errorKey: "too_long",
    };
  }

  if (!USERNAME_REGEX.test(trimmed)) {
    return {
      isValid: false,
      errorKey: "invalid_chars",
    };
  }

  return { isValid: true };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate API key format (basic check)
 */
export function isValidApiKey(key: string): boolean {
  return key.length > 10 && /^[A-Za-z0-9_-]+$/.test(key);
}

/**
 * Check if string is empty or whitespace
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
