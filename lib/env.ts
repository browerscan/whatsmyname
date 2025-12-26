/**
 * Environment Variable Validation
 *
 * Validates all required environment variables at build/runtime
 * Uses Zod for schema validation and type safety
 */

import { z } from "zod";

/**
 * Environment variable schema with validation
 *
 * This schema validates:
 * - Required API keys are present
 * - URLs are valid format
 * - Enum values are within allowed sets
 * - Numeric values are in valid ranges
 */
const envSchema = z
  .object({
    // Node Environment
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    // Base URL for the application
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url("NEXT_PUBLIC_BASE_URL must be a valid URL")
      .default("https://whatismyname.org"),

    // WhatsMyName API Configuration
    WHATSMYNAME_API_KEY: z
      .string()
      .min(1, "WHATSMYNAME_API_KEY is required")
      .min(20, "WHATSMYNAME_API_KEY appears invalid (too short)"),

    // Google Custom Search Configuration
    GOOGLE_CUSTOM_SEARCH_API_KEY: z
      .string()
      .min(1, "GOOGLE_CUSTOM_SEARCH_API_KEY is required")
      .min(20, "GOOGLE_CUSTOM_SEARCH_API_KEY appears invalid (too short)")
      .optional(),
    GOOGLE_CUSTOM_SEARCH_API_KEYS: z
      .string()
      .min(1, "At least one Google API key is required")
      .optional(),
    GOOGLE_CUSTOM_SEARCH_CX: z
      .string()
      .min(1, "GOOGLE_CUSTOM_SEARCH_CX is required")
      .min(10, "GOOGLE_CUSTOM_SEARCH_CX appears invalid (too short)"),

    // OpenRouter AI Configuration
    OPENROUTER_API_KEY: z
      .string()
      .min(1, "OPENROUTER_API_KEY is required")
      .min(20, "OPENROUTER_API_KEY appears invalid (too short)")
      .optional(),
    OPENROUTER_MODEL: z.string().default("deepseek/deepseek-chat-v3.1:free"),
  })
  .refine(
    (data) => {
      // At least one Google API key source must be configured
      return (
        !!data.GOOGLE_CUSTOM_SEARCH_API_KEY ||
        !!data.GOOGLE_CUSTOM_SEARCH_API_KEYS
      );
    },
    {
      message:
        "Either GOOGLE_CUSTOM_SEARCH_API_KEY or GOOGLE_CUSTOM_SEARCH_API_KEYS must be configured",
    },
  )
  .transform((data) => {
    // Normalize: prefer API_KEYS over single API_KEY
    return {
      ...data,
      googleApiKeys: data.GOOGLE_CUSTOM_SEARCH_API_KEYS
        ? data.GOOGLE_CUSTOM_SEARCH_API_KEYS.split(",").map((k) => k.trim())
        : data.GOOGLE_CUSTOM_SEARCH_API_KEY
          ? [data.GOOGLE_CUSTOM_SEARCH_API_KEY]
          : [],
    };
  });

/**
 * Validated and typed environment variables
 */
export type Env = z.infer<typeof envSchema> & {
  googleApiKeys: string[];
};

/**
 * Cached validated environment variables
 */
let _validatedEnv: Env | null = null;

/**
 * Validates environment variables and returns typed object
 *
 * @throws {Error} If validation fails with detailed error messages
 * @returns {Env} Validated and typed environment variables
 */
export function validateEnv(): Env {
  if (_validatedEnv) {
    return _validatedEnv;
  }

  try {
    const rawEnv = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      WHATSMYNAME_API_KEY: process.env.WHATSMYNAME_API_KEY,
      GOOGLE_CUSTOM_SEARCH_API_KEY: process.env.GOOGLE_CUSTOM_SEARCH_API_KEY,
      GOOGLE_CUSTOM_SEARCH_API_KEYS: process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS,
      GOOGLE_CUSTOM_SEARCH_CX: process.env.GOOGLE_CUSTOM_SEARCH_CX,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
    };

    _validatedEnv = envSchema.parse(rawEnv);
    return _validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(
        (err) => `  - ${err.path.join(".")}: ${err.message}`,
      );
      throw new Error(
        `Environment validation failed:\n${messages.join("\n")}\n\nPlease check your .env configuration.`,
      );
    }
    throw error;
  }
}

/**
 * Safely get environment variable value
 *
 * Returns validated env or throws in development/build
 * In production, logs error and returns default values
 */
export function getEnv(): Env {
  try {
    return validateEnv();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      // In production, log but don't crash - allow degraded service
      console.error("Environment validation error:", error);
      return {
        NODE_ENV: "production",
        NEXT_PUBLIC_BASE_URL: "https://whatismyname.org",
        WHATSMYNAME_API_KEY: "",
        GOOGLE_CUSTOM_SEARCH_CX: "",
        OPENROUTER_MODEL: "deepseek/deepseek-chat-v3.1:free",
        googleApiKeys: [],
      };
    }
    throw error;
  }
}

/**
 * Check if a service is properly configured
 */
export function isServiceConfigured(
  service: "whatsmyname" | "google" | "ai",
): boolean {
  const env = getEnv();

  switch (service) {
    case "whatsmyname":
      return !!env.WHATSMYNAME_API_KEY && env.WHATSMYNAME_API_KEY.length > 0;
    case "google":
      return (
        env.googleApiKeys.length > 0 &&
        !!env.GOOGLE_CUSTOM_SEARCH_CX &&
        env.GOOGLE_CUSTOM_SEARCH_CX.length > 0
      );
    case "ai":
      return !!env.OPENROUTER_API_KEY && env.OPENROUTER_API_KEY.length > 0;
    default:
      return false;
  }
}
