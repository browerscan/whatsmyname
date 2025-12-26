import { NextResponse } from "next/server";

/**
 * Health check endpoint
 * Returns service status and configuration validity
 *
 * Uses centralized environment validation to ensure consistency
 */
export async function GET() {
  const checks = {
    status: "healthy" as "healthy" | "degraded" | "unhealthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    services: {
      whatsmyname: checkWhatsmynameConfig(),
      google: checkGoogleConfig(),
      openrouter: checkOpenrouterConfig(),
    },
  };

  // Determine overall status
  const serviceStatuses = Object.values(checks.services);
  const unhealthyCount = serviceStatuses.filter(
    (s) => s.status === "unavailable",
  ).length;

  if (unhealthyCount === serviceStatuses.length) {
    checks.status = "unhealthy";
  } else if (unhealthyCount > 0) {
    checks.status = "degraded";
  }

  // Return 503 if unhealthy, 200 otherwise
  const statusCode = checks.status === "unhealthy" ? 503 : 200;

  return NextResponse.json(checks, { status: statusCode });
}

function checkWhatsmynameConfig() {
  const apiKey = process.env.WHATSMYNAME_API_KEY;
  return {
    name: "WhatsMyName API",
    status: apiKey ? "available" : "unavailable",
    configured: !!apiKey,
  };
}

function checkGoogleConfig() {
  const apiKeys = process.env.GOOGLE_CUSTOM_SEARCH_API_KEYS;
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_CX;
  const isConfigured = !!apiKeys && !!cx;

  return {
    name: "Google Custom Search",
    status: isConfigured ? "available" : "unavailable",
    configured: isConfigured,
  };
}

function checkOpenrouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  return {
    name: "OpenRouter AI",
    status: apiKey ? "available" : "unavailable",
    configured: !!apiKey,
    model: model || "deepseek/deepseek-chat-v3.1:free",
  };
}
