import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/request";

// Known malicious bots to block
const BLOCKED_BOTS = [
  "AhrefsBot",
  "MJ12bot",
  "DotBot",
  "SemrushBot",
  "BLEXBot",
  "DataForSeoBot",
  "megaindex",
  "MauiBot",
  "Sogou",
  "YandexBot",
];

// Bot detection
function isBlockedBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BLOCKED_BOTS.some((bot) => ua.includes(bot.toLowerCase()));
}

const intlProxy = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

export default function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const pathname = request.nextUrl.pathname;

  // Block malicious bots from accessing API routes
  if (pathname.startsWith("/api/") && isBlockedBot(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Skip i18n middleware for API routes and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    const response = NextResponse.next();
    // Add security headers for API routes
    if (pathname.startsWith("/api/")) {
      response.headers.set("X-DNS-Prefetch-Control", "on");
      response.headers.set("X-Content-Type-Options", "nosniff");
    }
    return response;
  }

  // Apply internationalization middleware for page routes
  const response = intlProxy(request);

  // Add additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for Next.js internals and static files
    "/((?!_next|_vercel|.*\\..*).*)",
    // Also run for API routes for bot blocking
    "/api/:path*",
  ],
};
