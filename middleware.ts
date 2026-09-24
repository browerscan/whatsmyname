import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/request";
import { markdownTwinPath, markdownTwinToPagePath } from "./lib/agent/markdown-path";
import { AGENT_LINK_HEADER, prefersMarkdown } from "./lib/agent/site";

export const runtime = "experimental-edge";

const intlProxy = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

function rewriteToMarkdown(request: NextRequest, pagePath: string) {
  const target = request.nextUrl.clone();
  target.pathname = `/api/markdown${pagePath === "/" ? "" : pagePath}`;
  return NextResponse.rewrite(target);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A page's .md twin (llms.txt convention) is the page as Markdown; other
  // .md files are static assets.
  if (pathname.endsWith(".md")) {
    const pagePath = markdownTwinToPagePath(pathname);
    return pagePath === null ? NextResponse.next() : rewriteToMarkdown(request, pagePath);
  }

  // Agents that ask for text/markdown get the same page as Markdown.
  if (prefersMarkdown(request.headers.get("accept"))) {
    return rewriteToMarkdown(request, pathname);
  }

  const response = intlProxy(request);
  response.headers.set("X-DNS-Prefetch-Control", "on");
  const agentLinks = `${AGENT_LINK_HEADER}, <${markdownTwinPath(pathname)}>; rel="alternate"; type="text/markdown"`;
  const link = response.headers.get("Link");
  response.headers.set("Link", link ? `${link}, ${agentLinks}` : agentLinks);
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|mcp|_next|_vercel|.*\\..*).*)",
    "/((?!api/|_next/|\\.well-known/).+\\.md)",
  ],
};
