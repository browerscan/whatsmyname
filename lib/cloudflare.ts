/**
 * Cloudflare Workers Environment Helpers
 *
 * Provides access to Cloudflare Workers environment variables and secrets
 * in OpenNext deployments. Falls back to process.env for local development.
 */

interface CloudflareContext {
  env: Record<string, string>;
  ctx: {
    waitUntil: (fn: Promise<unknown>) => void;
    passThroughOnException: () => void;
  };
  cf?: Record<string, unknown>;
}

/**
 * Get Cloudflare env from OpenNext context
 * Falls back to process.env for local development
 */
export function getCloudflareEnv(): Record<string, string> | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = (globalThis as any)[Symbol.for("__cloudflare-context__")];
  if (!context?.env) return undefined;

  // Convert all env values to strings (including Cloudflare secrets)
  const result: Record<string, string> = {};
  for (const key of Object.keys(context.env)) {
    const value = context.env[key];
    if (typeof value === "string") {
      result[key] = value;
    } else if (value && typeof value?.toString === "function") {
      // Cloudflare secret bindings have a toString method
      const strValue = value.toString();
      if (strValue && strValue !== "[object Object]") {
        result[key] = strValue;
      }
    }
  }
  return result;
}

/**
 * Get an environment variable from Cloudflare or process.env
 *
 * @param key - Environment variable name
 * @returns The value or undefined if not found
 */
export function getEnvVar(key: string): string | undefined {
  const cfEnv = getCloudflareEnv();
  return cfEnv?.[key] || process.env[key];
}

/**
 * Get a required environment variable
 *
 * @param key - Environment variable name
 * @returns The value
 * @throws Error if the variable is not set
 */
export function getRequiredEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}
