import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";
import { defaultLocale, getLocalePath } from "@/i18n/request";

interface FooterProps {
  locale: string;
  copy: {
    aboutTitle: string; aboutDescription: string; featuresTitle: string;
    usernameSearch: string; categories: string; tools: string;
    connectTitle: string; copyright: string; legalTitle: string;
    privacy: string; terms: string;
  };
}

export function Footer({ locale, copy }: FooterProps) {
  const homeHref = locale === defaultLocale ? "/" : `/${locale}`;
  const privacyHref = locale === defaultLocale ? "/privacy" : `/${locale}/privacy`;
  const termsHref = locale === defaultLocale ? "/terms" : `/${locale}/terms`;

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              {copy.aboutTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {copy.aboutDescription}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              {copy.featuresTitle}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="transition-colors hover:text-primary" href={homeHref}>
                  {copy.usernameSearch}
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href={getLocalePath(locale, "/categories")}>
                  {copy.categories}
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href={getLocalePath(locale, "/tools")}>
                  {copy.tools}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              {copy.connectTitle}
            </h3>
            <a
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>{copy.copyright}</p>
          <nav aria-label={copy.legalTitle}>
            <ul className="flex items-center gap-4">
              <li>
                <Link className="transition-colors hover:text-primary" href={privacyHref}>
                  {copy.privacy}
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-primary" href={termsHref}>
                  {copy.terms}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
