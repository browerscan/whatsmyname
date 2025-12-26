import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "zh", "es", "ja", "fr", "ko"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";

function isSupportedLocale(locale: string): locale is AppLocale {
  return (locales as readonly string[]).includes(locale);
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
