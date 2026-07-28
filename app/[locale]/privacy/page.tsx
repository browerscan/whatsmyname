import { Metadata } from "next";
import Link from "next/link";
import { getPrivacyDocument } from "@/content/legal";
import {
  getLocaleAlternates,
  getLocalePath,
  getLocalizedUrl,
} from "@/i18n/request";

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const document = getPrivacyDocument(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";

  return {
    title: document.title,
    description: document.sections[0]?.paragraphs?.[0] ?? document.title,
    alternates: {
      canonical: getLocalizedUrl(baseUrl, locale, "/privacy"),
      languages: {
        "x-default": `${baseUrl}/privacy`,
        ...getLocaleAlternates(baseUrl, "/privacy"),
      },
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const document = getPrivacyDocument(locale);
  const homeHref = getLocalePath(locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href={homeHref} className="text-primary hover:underline text-sm">
          ← {document.backToHome}
        </Link>
      </div>

      <article className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">{document.title}</h1>
        <p className="text-muted-foreground mb-8">{document.lastUpdatedLabel}</p>

        {document.sections.map((section) => (
          <section key={section.title} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mb-4">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {section.items.map((item) => (
                  <li key={`${section.title}-${item.label ?? item.text}`}>
                    {item.label ? (
                      <>
                        <strong>{item.label}:</strong>{" "}
                        {item.href ? (
                          <a
                            href={item.href}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {item.text}
                          </a>
                        ) : (
                          item.text
                        )}
                      </>
                    ) : (
                      item.text
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
