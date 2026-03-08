import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/request";

export const runtime = "experimental-edge";

const intlProxy = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

export default function proxy(request: NextRequest) {
  const response = intlProxy(request);
  response.headers.set("X-DNS-Prefetch-Control", "on");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
