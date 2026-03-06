import { getLocale } from "next-intl/server";
import { defaultLocale, locales } from "@/i18n/request";
import { educationContent } from "@/content/education";

export async function EducationalContent() {
  const locale = await getLocale();
  const safeLocale = (locales as readonly string[]).includes(locale)
    ? locale
    : defaultLocale;
  const html = educationContent[safeLocale] || educationContent[defaultLocale];

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
