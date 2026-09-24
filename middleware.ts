import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/request";
import { AGENT_LINK_HEADER, prefersMarkdown } from "./lib/agent/site";

export const runtime = "experimental-edge";

const intlProxy = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

export default function proxy(request: NextRequest) {
  // Agents that ask for text/markdown get the same page as Markdown.
  if (prefersMarkdown(request.headers.get("accept"))) {
    const { pathname } = request.nextUrl;
    const target = request.nextUrl.clone();
    target.pathname = `/api/markdown${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(target);
  }

  const response = intlProxy(request);
  response.headers.set("X-DNS-Prefetch-Control", "on");
  const link = response.headers.get("Link");
  response.headers.set("Link", link ? `${link}, ${AGENT_LINK_HEADER}` : AGENT_LINK_HEADER);
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: ["/((?!api|mcp|_next|_vercel|.*\\..*).*)"],
};
