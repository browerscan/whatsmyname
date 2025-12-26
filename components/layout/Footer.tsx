"use client";

import Link from "next/link";
import { Mail, Github } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_EMAIL_HREF, CONTACT_GITHUB_URL } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = useLocale();
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const privacyHref = `/${locale}/privacy`;
  const termsHref = `/${locale}/terms`;
  const t = useTranslations("footer");
  const tFeatures = useTranslations("footer.features");

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
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
            <div className="flex gap-4 items-center">
              <a
                href={CONTACT_EMAIL_HREF}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                aria-label={t("email_aria")}
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={CONTACT_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                aria-label={t("github_aria")}
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              {t("legal_title")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={privacyHref}
                  className="hover:text-primary transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={termsHref}
                  className="hover:text-primary transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t("copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
