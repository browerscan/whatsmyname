import { describe, it, expect } from "vitest";
import {
  DEFAULT_OPENROUTER_MODELS,
  isAccountLevelOpenRouterError,
  parseOpenRouterModels,
} from "@/lib/openrouter";

describe("parseOpenRouterModels", () => {
  it("falls back to the built-in list when unset", () => {
    expect(parseOpenRouterModels(undefined)).toEqual([
      ...DEFAULT_OPENROUTER_MODELS,
    ]);
  });

  it("falls back to the built-in list for an empty value", () => {
    expect(parseOpenRouterModels("   ")).toEqual([
      ...DEFAULT_OPENROUTER_MODELS,
    ]);
  });

  it("accepts a single model id", () => {
    expect(parseOpenRouterModels("minimax/minimax-m3:free")).toEqual([
      "minimax/minimax-m3:free",
    ]);
  });

  it("splits a comma-separated list and trims blanks", () => {
    expect(
      parseOpenRouterModels(" a/one:free , b/two:free ,, c/three:free "),
    ).toEqual(["a/one:free", "b/two:free", "c/three:free"]);
  });

  it("keeps every default model free", () => {
    for (const model of DEFAULT_OPENROUTER_MODELS) {
      expect(model === "openrouter/free" || model.endsWith(":free")).toBe(true);
    }
  });
});

describe("isAccountLevelOpenRouterError", () => {
  it("treats auth, billing and permission failures as account-level", () => {
    expect(isAccountLevelOpenRouterError(401)).toBe(true);
    expect(isAccountLevelOpenRouterError(402)).toBe(true);
    expect(isAccountLevelOpenRouterError(403)).toBe(true);
  });

  it("treats model-specific failures as retryable on the next model", () => {
    expect(isAccountLevelOpenRouterError(404)).toBe(false);
    expect(isAccountLevelOpenRouterError(429)).toBe(false);
    expect(isAccountLevelOpenRouterError(503)).toBe(false);
  });
});
