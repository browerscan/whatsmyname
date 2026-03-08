import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { CONTACT_EMAIL } from "@/lib/constants";
import { defaultLocale } from "@/i18n/request";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const [locale, t, tFeatures] = await Promise.all([
    getLocale(),
    getTranslations("footer"),
    getTranslations("footer.features"),
  ]);

  const homeHref = locale === defaultLocale ? "/" : `/${locale}`;

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              {t("about_title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("about_description")}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              {t("features_title")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="transition-colors hover:text-primary" href={homeHref}>
                  {tFeatures("username_search")}
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href={homeHref}>
                  {tFeatures("platform_support")}
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href={homeHref}>
                  {tFeatures("realtime_results")}
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href={homeHref}>
                  {tFeatures("ai_analysis")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              {t("connect_title")}
            </h3>
            <a
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t("copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
