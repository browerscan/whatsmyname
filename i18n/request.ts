import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "zh", "es", "ja", "fr", "ko", "de", "pt", "ru"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";

export const localeSchemaNames: Record<AppLocale, string> = {
  en: "English",
  zh: "Chinese",
  es: "Spanish",
  ja: "Japanese",
  fr: "French",
  ko: "Korean",
  de: "German",
  pt: "Portuguese",
  ru: "Russian",
};

export function isSupportedLocale(locale: string): locale is AppLocale {
  return (locales as readonly string[]).includes(locale);
}

export function getLocalePath(locale: string, pathname: string = "/") {
  const normalizedPath = pathname === "/" ? "" : pathname.replace(/^\/+|\/+$/g, "");

  if (locale === defaultLocale) {
    return normalizedPath ? `/${normalizedPath}` : "/";
  }

  return normalizedPath ? `/${locale}/${normalizedPath}` : `/${locale}`;
}

export function getLocalizedUrl(
  baseUrl: string,
  locale: string,
  pathname: string = "/",
) {
  return `${baseUrl}${getLocalePath(locale, pathname)}`;
}

export function getLocaleAlternates(baseUrl: string, pathname: string = "/") {
  return Object.fromEntries(
    locales.map((locale) => [locale, getLocalizedUrl(baseUrl, locale, pathname)]),
  ) as Record<AppLocale, string>;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && isSupportedLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
