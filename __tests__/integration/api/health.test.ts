import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GET } from "@/app/api/health/route";

/**
 * Integration Tests for Health Check API
 *
 * Tests the /api/health endpoint which returns service status
 */
describe("Health API", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return healthy status when all services are configured", async () => {
    process.env.WHATSMYNAME_API_KEY = "test-key";
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS = "key1,key2";
    process.env.GOOGLE_CUSTOM_SEARCH_CX = "test-cx";
    process.env.OPENROUTER_API_KEY = "openrouter-key";
    process.env.npm_package_version = "1.0.0";
    process.env.NODE_ENV = "production";

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.timestamp).toBeTruthy();
    expect(data.version).toBe("1.0.0");
    expect(data.environment).toBe("production");
    expect(data.services.whatsmyname.status).toBe("available");
    expect(data.services.google.status).toBe("available");
    expect(data.services.openrouter.status).toBe("available");
  });

  it("should return degraded status when some services are missing", async () => {
    process.env.WHATSMYNAME_API_KEY = "test-key";
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS = "";
    process.env.GOOGLE_CUSTOM_SEARCH_CX = "";
    process.env.OPENROUTER_API_KEY = "";
    process.env.NODE_ENV = "development";

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("degraded");
    expect(data.services.whatsmyname.status).toBe("available");
    expect(data.services.google.status).toBe("unavailable");
    expect(data.services.openrouter.status).toBe("unavailable");
  });

  it("should return unhealthy status when all services are missing", async () => {
    process.env.WHATSMYNAME_API_KEY = "";
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS = "";
    process.env.GOOGLE_CUSTOM_SEARCH_CX = "";
    process.env.OPENROUTER_API_KEY = "";

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("unhealthy");
  });

  it("should return default version when npm_package_version is not set", async () => {
    process.env.WHATSMYNAME_API_KEY = "test-key";
    delete process.env.npm_package_version;

    const response = await GET();
    const data = await response.json();

    expect(data.version).toBe("1.0.0");
  });

  it("should include configured flag for each service", async () => {
    process.env.WHATSMYNAME_API_KEY = "test-key";
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS = "";
    process.env.GOOGLE_CUSTOM_SEARCH_CX = "";
    process.env.OPENROUTER_API_KEY = "openrouter-key";

    const response = await GET();
    const data = await response.json();

    expect(data.services.whatsmyname.configured).toBe(true);
    expect(data.services.google.configured).toBe(false);
    expect(data.services.openrouter.configured).toBe(true);
  });

  it("should include OpenRouter model in response", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "gpt-4";

    const response = await GET();
    const data = await response.json();

    expect(data.services.openrouter.model).toBe("gpt-4");
  });

  it("should use default OpenRouter model when not configured", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    delete process.env.OPENROUTER_MODEL;

    const response = await GET();
    const data = await response.json();

    expect(data.services.openrouter.model).toBe(
      "deepseek/deepseek-chat-v3.1:free",
    );
  });
});
