import { cache } from "react";
import { getLocale } from "next-intl/server";
import { defaultLocale, locales } from "@/i18n/request";

/**
 * Educational HTML content imported at build time
 * This is Edge Runtime compatible (no fs.readFileSync at runtime)
 *
 * Note: This content is trusted (part of our codebase), not user-generated,
 * so sanitization is not required. All content is reviewed before deployment.
 */
async function importEducationHtml(locale: string): Promise<string> {
  try {
    // Dynamic import works at build time, compatible with Edge Runtime
    const mod = await import(`../../content/education/${locale}.ts`);
    return mod.default;
  } catch {
    // Fallback to default locale
    const fallbackMod = await import(
      `../../content/education/${defaultLocale}.ts`
    );
    return fallbackMod.default;
  }
}

// Cache the imported content to avoid repeated imports
const getCachedEducationHtml = cache(
  async (locale: string): Promise<string> => {
    return importEducationHtml(locale);
  },
);

function isSupportedLocale(locale: string): boolean {
  return (locales as readonly string[]).includes(locale);
}

export async function EducationalContent() {
  const locale = await getLocale();
  const safeLocale = isSupportedLocale(locale) ? locale : defaultLocale;
  const html = await getCachedEducationHtml(safeLocale);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
