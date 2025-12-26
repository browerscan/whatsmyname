import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { getLocale } from "next-intl/server";
import { defaultLocale, locales } from "@/i18n/request";

/**
 * Reads educational HTML content from file system
 * Note: This content is trusted (part of our codebase), not user-generated,
 * so sanitization is not required. All content is reviewed before deployment.
 */
const readEducationHtml = cache((locale: string): string => {
  const baseDir = path.join(process.cwd(), "content", "education");
  const requestedPath = path.join(baseDir, `${locale}.html`);
  const fallbackPath = path.join(baseDir, `${defaultLocale}.html`);

  try {
    return fs.readFileSync(requestedPath, "utf8");
  } catch {
    return fs.readFileSync(fallbackPath, "utf8");
  }
});

function isSupportedLocale(locale: string): boolean {
  return (locales as readonly string[]).includes(locale);
}

export async function EducationalContent() {
  const locale = await getLocale();
  const safeLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  return (
    <div dangerouslySetInnerHTML={{ __html: readEducationHtml(safeLocale) }} />
  );
}
