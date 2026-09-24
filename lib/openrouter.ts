/**
 * OpenRouter model routing for the AI analyze endpoint.
 *
 * Free OpenRouter models get delisted or rate-limited without notice (the
 * previous default, deepseek/deepseek-chat-v3.1:free, disappeared and every
 * request started failing with 404). We therefore keep an ordered list of
 * currently-free candidates and fall through to the next one when the
 * upstream rejects a request.
 *
 * OPENROUTER_MODEL may hold a single model id or a comma-separated list;
 * when unset, DEFAULT_OPENROUTER_MODELS is used.
 *
 * Source of truth for what is free: https://openrouter.ai/api/v1/models
 * (pricing.prompt === "0" && pricing.completion === "0"). Re-check before
 * editing this list.
 */
export const DEFAULT_OPENROUTER_MODELS: readonly string[] = [
  "openrouter/free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-26b-a4b-it:free",
  "z-ai/glm-5.2:free",
];

/**
 * Parse OPENROUTER_MODEL into an ordered candidate list.
 */
export function parseOpenRouterModels(value: string | undefined): string[] {
  const models = (value ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  return models.length > 0 ? models : [...DEFAULT_OPENROUTER_MODELS];
}

/**
 * Account-wide upstream failures (bad key, no credits, forbidden) will not be
 * fixed by switching model, so the fallback loop stops on them.
 */
export function isAccountLevelOpenRouterError(status: number): boolean {
  return status === 401 || status === 402 || status === 403;
}
