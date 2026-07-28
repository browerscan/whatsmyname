import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Gamepad2,
  Users,
  Code,
  Briefcase,
  Film,
  Newspaper,
  MessageSquare,
  Heart,
  ShoppingCart,
  Grid,
  ExternalLink,
} from "lucide-react";
import {
  BreadcrumbJsonLd,
  WebPageJsonLd,
  SoftwareApplicationJsonLd,
} from "@/components/seo/schema-org";
import { getAllPlatformSlugs } from "@/lib/platforms-data";
import {
  getLocalizedCategoryMetadata,
  getLocalizedPlatformBySlug,
  getLocalizedPlatformsByCategory,
} from "@/lib/platforms-i18n";
import {
  getLocaleAlternates,
  getLocalePath,
  getLocalizedUrl,
  locales,
} from "@/i18n/request";
import { getPlatformDetailCopy } from "@/content/route-copy";

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  code: Code,
  "gamepad-2": Gamepad2,
  briefcase: Briefcase,
  film: Film,
  newspaper: Newspaper,
  "message-square": MessageSquare,
  heart: Heart,
  "shopping-cart": ShoppingCart,
  grid: Grid,
};

interface PlatformPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPlatformSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: PlatformPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tSeo = await getTranslations({ locale, namespace: "seo.platform" });
  const t = await getTranslations({ locale, namespace: "pages.platform_detail" });
  const platform = getLocalizedPlatformBySlug(slug, locale);

  if (!platform) {
    return { title: t("not_found_title") };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, `/platforms/${slug}`);
  const platformCopy = getPlatformDetailCopy(locale, platform.name, platform.founded);

  return {
    title: tSeo("title", { platform: platform.name }),
    description: `${tSeo("description", { platform: platform.name })} ${platform.description}`,
    keywords: platform.keywords,
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",
    openGraph: {
      type: "website",
      locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: platformCopy.title,
      description: platform.description,
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: platformCopy.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: platformCopy.title,
      description: platform.description,
      images: [`${baseUrl}/images/og-image.svg`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getLocaleAlternates(baseUrl, `/platforms/${slug}`),
    },
  };
}

export default async function PlatformPage({ params }: PlatformPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "pages.platform_detail" });
  const platform = getLocalizedPlatformBySlug(slug, locale);

  if (!platform) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, `/platforms/${slug}`);
  const homeHref = getLocalePath(locale);
  const categoriesHref = getLocalePath(locale, "/categories");
  const categoryHref = getLocalePath(locale, `/categories/${platform.category}`);
  const categoryMeta = getLocalizedCategoryMetadata(platform.category, locale);
  const IconComponent = iconMap[categoryMeta.icon] || Grid;
  const related = getLocalizedPlatformsByCategory(platform.category, locale)
    .filter((item) => item.slug !== platform.slug)
    .slice(0, 6);
  const platformCopy = getPlatformDetailCopy(locale, platform.name, platform.founded);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("home"), item: homeHref },
          { name: t("categories"), item: categoriesHref },
          { name: categoryMeta.name, item: categoryHref },
          { name: platform.name, item: canonicalUrl },
        ]}
      />
      <WebPageJsonLd
        name={platformCopy.title}
        description={platform.description}
        url={canonicalUrl}
        inLanguage={locale}
      />
      <SoftwareApplicationJsonLd
        name={platform.name}
        description={platform.description}
        url={platform.url}
        applicationCategory={
          platform.category === "social"
            ? "SocialNetworkingApplication"
            : "UtilitiesApplication"
        }
        operatingSystem="Web"
        offers={{
          price: "0",
          priceCurrency: "USD",
        }}
      />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <nav className="mb-8 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={homeHref} className="hover:text-foreground transition-colors">
                {t("home")}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={categoriesHref} className="hover:text-foreground transition-colors">
                {t("categories")}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={categoryHref} className="hover:text-foreground transition-colors">
                {categoryMeta.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{platform.name}</li>
          </ol>
        </nav>

        <div className="mb-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-subtle border border-border/50">
              <IconComponent className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-4xl font-bold">{platformCopy.title}</h1>
                {platformCopy.foundedLabel && (
                  <span className="text-sm text-muted-foreground">{platformCopy.foundedLabel}</span>
                )}
              </div>
              <p className="text-lg text-muted-foreground">{platform.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="px-4 py-2 rounded-xl bg-muted/50 border border-border/30">
              <span className="text-sm text-muted-foreground">{t("category_label")}</span>{" "}
              <span className="font-medium">{categoryMeta.name}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-muted/50 border border-border/30">
              <span className="text-sm text-muted-foreground">{t("popularity_label")}</span>{" "}
              <span className="font-medium">{platform.popularity}/100</span>
            </div>
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-muted/50 border border-border/30 hover:bg-muted/70 transition-colors inline-flex items-center gap-2"
            >
              {t("visit_platform", { platform: platform.name })}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/30 font-mono text-sm">
            <span className="text-muted-foreground">{t("profile_url_pattern")}</span>{" "}
            <span className="text-foreground">{platform.url}/[username]</span>
          </div>
        </div>

        <section className="mb-12 p-8 rounded-3xl bg-gradient-subtle border border-border/50 shadow-custom-lg">
          <h2 className="text-2xl font-semibold mb-4">{t("search_title", { platform: platform.name })}</h2>
          <p className="text-muted-foreground mb-6">{t("search_description", { platform: platform.name })}</p>
          <form action={homeHref} method="get" className="flex gap-3 max-w-md">
            <input
              type="text"
              name="username"
              placeholder={t("username_placeholder")}
              className="flex-1 px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {t("search_button")}
            </button>
          </form>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t("about_title", { platform: platform.name })}</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">{platform.description}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{platformCopy.aboutParagraph}</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t("related_searches")}</h2>
          <div className="flex flex-wrap gap-2">
            {platform.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("similar_platforms")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((relatedPlatform) => {
                const relatedCategory = getLocalizedCategoryMetadata(relatedPlatform.category, locale);
                const RelatedIcon = iconMap[relatedCategory.icon] || Grid;

                return (
                  <Link
                    key={relatedPlatform.slug}
                    href={getLocalePath(locale, `/platforms/${relatedPlatform.slug}`)}
                    className="p-4 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background">
                        <RelatedIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{relatedPlatform.name}</h3>
                        <p className="text-sm text-muted-foreground">{relatedCategory.name}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{t("cta_title")}</h2>
            <p className="text-muted-foreground mb-6">{t("cta_description", { platform: platform.name })}</p>
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
