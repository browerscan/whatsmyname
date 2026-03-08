import { Metadata } from "next";
import Link from "next/link";
import { Search, Sparkles, UserCheck, Lightbulb } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/seo/schema-org";
import {
  getLocaleAlternates,
  getLocalePath,
  getLocalizedUrl,
} from "@/i18n/request";
import { getToolsCatalog, getToolsPageCopy } from "@/content/route-copy";

interface ToolsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const iconMap = {
  "username-generator": Sparkles,
  "username-availability-checker": UserCheck,
  "username-ideas": Lightbulb,
} as const;

export async function generateMetadata({
  params,
}: ToolsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const tSeo = await getTranslations({ locale, namespace: "seo.tools" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, "/tools");

  return {
    title: tSeo("title"),
    description: tSeo("description"),
    keywords: ["username tools", "username generator", "username ideas"],
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",
    openGraph: {
      type: "website",
      locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: tSeo("title"),
      description: tSeo("description"),
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: tSeo("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tSeo("title"),
      description: tSeo("description"),
      images: [`${baseUrl}/images/og-image.svg`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getLocaleAlternates(baseUrl, "/tools"),
    },
  };
}

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.tools" });
  const copy = getToolsPageCopy(locale);
  const tools = getToolsCatalog(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, "/tools");
  const homeHref = getLocalePath(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("home"), item: homeHref },
          { name: t("breadcrumb"), item: canonicalUrl },
        ]}
      />
      <CollectionPageJsonLd
        name={t("collection_name")}
        description={t("collection_description")}
        url={canonicalUrl}
        inLanguage={locale}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <nav className="mb-8 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={homeHref} className="hover:text-foreground transition-colors">
                {t("home")}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{t("breadcrumb")}</li>
          </ol>
        </nav>

        <div className="mb-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-subtle border border-border/50 mb-6">
            <Search className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("description")}</p>
        </div>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const IconComponent = iconMap[tool.slug as keyof typeof iconMap] ?? Lightbulb;
              const href = tool.href ? getLocalePath(locale, tool.href) : getLocalePath(locale, `/tools/${tool.slug}`);

              return (
                <Link
                  key={tool.slug}
                  href={href}
                  className="group p-6 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-background">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {tool.name}
                        </h2>
                        {tool.comingSoon && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {t("coming_soon")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {tool.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <article className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{t("content_title")}</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">{copy.intro}</p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{t("checker_title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{copy.checker}</p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{t("generator_title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{copy.generator}</p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{t("ideas_title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{copy.ideas}</p>
          </div>
        </article>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t("features_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("feature_search_title")}</h3>
              <p className="text-sm text-muted-foreground">{t("feature_search_description")}</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("feature_results_title")}</h3>
              <p className="text-sm text-muted-foreground">{t("feature_results_description")}</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("feature_free_title")}</h3>
              <p className="text-sm text-muted-foreground">{t("feature_free_description")}</p>
            </div>
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{t("cta_title")}</h2>
            <p className="text-muted-foreground mb-6">{t("cta_description")}</p>
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {t("cta_button")}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
