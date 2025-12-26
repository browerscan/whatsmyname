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
  ArticleJsonLd,
} from "@/components/seo/schema-org";
import {
  getPlatformBySlug,
  getAllPlatformSlugs,
  getPlatformsByCategory,
  CATEGORY_METADATA,
  type PlatformMetadata,
} from "@/lib/platforms-data";

// Icons mapping
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

/**
 * Generate static params for all platforms
 */
export async function generateStaticParams() {
  const locales = ["en", "zh", "es", "ja", "fr", "ko"];
  const slugs = getAllPlatformSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PlatformPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const platform = getPlatformBySlug(slug);

  if (!platform) {
    return {
      title: "Platform Not Found",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/platforms/${slug}`;
  const categoryMeta = CATEGORY_METADATA[platform.category];

  return {
    title: `${platform.name} Username Search - Check Availability | What is my Name`,
    description: `Search and check username availability on ${platform.name}. ${platform.description} Find out if your desired username is available on ${platform.name}.`,
    keywords: [
      ...platform.keywords,
      `${platform.name} username`,
      `${platform.name} name check`,
      `username availability ${platform.name}`,
      `${platform.name} account lookup`,
      `check ${platform.name} username`,
      ...categoryMeta.keywords,
    ],
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",

    openGraph: {
      type: "website",
      locale: locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: `${platform.name} Username Search - Check Availability`,
      description: `Search and check username availability on ${platform.name}. ${platform.description}`,
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: `${platform.name} Username Search`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${platform.name} Username Search`,
      description: `Search and check username availability on ${platform.name}.`,
      images: [`${baseUrl}/images/og-image.svg`],
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/platforms/${slug}`,
        zh: `${baseUrl}/zh/platforms/${slug}`,
        es: `${baseUrl}/es/platforms/${slug}`,
        ja: `${baseUrl}/ja/platforms/${slug}`,
        fr: `${baseUrl}/fr/platforms/${slug}`,
        ko: `${baseUrl}/ko/platforms/${slug}`,
      },
    },
  };
}

/**
 * Platform page component
 */
export default async function PlatformPage({ params }: PlatformPageProps) {
  const { locale, slug } = await params;
  const platform = getPlatformBySlug(slug);

  if (!platform) {
    notFound();
  }

  const t = await getTranslations("platform");
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/platforms/${slug}`;
  const categoryMeta = CATEGORY_METADATA[platform.category];
  const IconComponent = iconMap[categoryMeta.icon] || Grid;

  // Get related platforms in the same category
  const related = getPlatformsByCategory(platform.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 6);

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/${locale}` },
          {
            name: categoryMeta.name,
            item: `${baseUrl}/${locale}/categories/${platform.category}`,
          },
          { name: platform.name, item: canonicalUrl },
        ]}
      />
      <WebPageJsonLd
        name={`${platform.name} Username Search`}
        description={`Search and check username availability on ${platform.name}. ${platform.description}`}
        url={canonicalUrl}
        inLanguage={locale}
      />
      <SoftwareApplicationJsonLd
        name={platform.name}
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
        aggregateRating={{
          ratingValue:
            platform.popularity > 90
              ? "4.8"
              : platform.popularity > 80
                ? "4.5"
                : "4.2",
          ratingCount: Math.floor(platform.popularity * 10).toString(),
          bestRating: "5",
          worstRating: "1",
        }}
      />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                href={`/${locale}`}
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/${locale}/categories`}
                className="hover:text-foreground transition-colors"
              >
                Categories
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/${locale}/categories/${platform.category}`}
                className="hover:text-foreground transition-colors"
              >
                {categoryMeta.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{platform.name}</li>
          </ol>
        </nav>

        {/* Platform Header */}
        <div className="mb-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-subtle border border-border/50">
              <IconComponent className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">
                  {platform.name} Username Search
                </h1>
                {platform.founded && (
                  <span className="text-sm text-muted-foreground">
                    Since {platform.founded}
                  </span>
                )}
              </div>
              <p className="text-lg text-muted-foreground">
                {platform.description}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="px-4 py-2 rounded-xl bg-muted/50 border border-border/30">
              <span className="text-sm text-muted-foreground">Category:</span>{" "}
              <span className="font-medium">{categoryMeta.name}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-muted/50 border border-border/30">
              <span className="text-sm text-muted-foreground">Popularity:</span>{" "}
              <span className="font-medium">{platform.popularity}/100</span>
            </div>
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-muted/50 border border-border/30 hover:bg-muted/70 transition-colors inline-flex items-center gap-2"
            >
              Visit {platform.name} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Platform URL Template */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/30 font-mono text-sm">
            <span className="text-muted-foreground">Profile URL pattern:</span>{" "}
            <span className="text-foreground">{platform.url}/[username]</span>
          </div>
        </div>

        {/* Search Section */}
        <section className="mb-12 p-8 rounded-3xl bg-gradient-subtle border border-border/50 shadow-custom-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Check Username on {platform.name}
          </h2>
          <p className="text-muted-foreground mb-6">
            Enter a username to check if it&apos;s available on {platform.name}.
            We&apos;ll search across our database of 1,400+ platforms to show
            you where this username is taken or available.
          </p>

          <form
            action={`/${locale}`}
            method="get"
            className="flex gap-3 max-w-md"
          >
            <input
              type="text"
              name="username"
              placeholder="Enter username..."
              className="flex-1 px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </section>

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">About {platform.name}</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              {platform.description}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {categoryMeta.description} Checking username availability across
              multiple platforms is essential for maintaining a consistent
              online presence, brand protection, and personal branding. Whether
              you&apos;re a content creator, business professional, or casual
              user, securing your preferred username helps establish your
              digital identity.
            </p>
          </div>
        </section>

        {/* SEO Keywords Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Related Searches</h2>
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

        {/* Related Platforms */}
        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Similar Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((relatedPlatform) => {
                const relatedCategory =
                  CATEGORY_METADATA[relatedPlatform.category];
                const RelatedIcon = iconMap[relatedCategory.icon] || Grid;

                return (
                  <Link
                    key={relatedPlatform.slug}
                    href={`/${locale}/platforms/${relatedPlatform.slug}`}
                    className="p-4 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background">
                        <RelatedIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{relatedPlatform.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {relatedCategory.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Search Across 1,400+ Platforms
            </h2>
            <p className="text-muted-foreground mb-6">
              Check username availability on {platform.name} and thousands of
              other platforms in one search. Find where your username is
              available, where it&apos;s taken, and secure your digital identity
              across the web.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Searching Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
