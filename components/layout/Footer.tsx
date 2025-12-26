"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = useLocale();
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const t = useTranslations("footer");
  const tFeatures = useTranslations("footer.features");

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
                <Link
                  href={homeHref}
                  className="hover:text-primary transition-colors"
                >
                  {tFeatures("username_search")}
                </Link>
              </li>
              <li>
                <Link
                  href={homeHref}
                  className="hover:text-primary transition-colors"
                >
                  {tFeatures("platform_support")}
                </Link>
              </li>
              <li>
                <Link
                  href={homeHref}
                  className="hover:text-primary transition-colors"
                >
                  {tFeatures("realtime_results")}
                </Link>
              </li>
              <li>
                <Link
                  href={homeHref}
                  className="hover:text-primary transition-colors"
                >
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
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
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
