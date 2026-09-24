import { NextRequest } from "next/server";

import { formatMarkdownDocument, renderMarkdownPage } from "@/lib/agent/markdown";

// Internal rewrite target for Accept: text/markdown requests (see middleware.ts).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;
  const page = await renderMarkdownPage(`/${path.join("/")}`);

  if (!page) {
    return new Response("# Not found\n", {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
        Vary: "Accept",
      },
    });
  }

  const body = formatMarkdownDocument(page);
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Vary: "Accept",
      Link: `<${page.url}>; rel="canonical"`,
      "X-Markdown-Tokens": String(Math.ceil(body.length / 4)),
    },
  });
}
