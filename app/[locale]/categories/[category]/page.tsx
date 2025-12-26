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
} from "lucide-react";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/seo/schema-org";
import {
  getAllCategories,
  getPlatformsByCategory,
  CATEGORY_METADATA,
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

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
  }>;
}

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
  const locales = ["en", "zh", "es", "ja", "fr", "ko"];
  const categories = getAllCategories();

  return locales.flatMap((locale) =>
    categories.map((category) => ({
      locale,
      category,
    })),
  );
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const categoryMeta = CATEGORY_METADATA[category];

  if (!categoryMeta) {
    return {
      title: "Category Not Found",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/categories/${category}`;

  return {
    title: `${categoryMeta.name} Platforms - Username Search | What is my Name`,
    description: `Search and check username availability across ${categoryMeta.name.toLowerCase()} platforms. ${categoryMeta.description}`,
    keywords: [
      ...categoryMeta.keywords,
      `${categoryMeta.name} username search`,
      `${categoryMeta.name} platforms list`,
      `username availability ${categoryMeta.name.toLowerCase()}`,
    ],
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",

    openGraph: {
      type: "website",
      locale: locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: `${categoryMeta.name} Platforms - Username Search`,
      description: categoryMeta.description,
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: `${categoryMeta.name} Platforms Username Search`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${categoryMeta.name} Platforms - Username Search`,
      description: categoryMeta.description,
      images: [`${baseUrl}/images/og-image.svg`],
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/categories/${category}`,
        zh: `${baseUrl}/zh/categories/${category}`,
        es: `${baseUrl}/es/categories/${category}`,
        ja: `${baseUrl}/ja/categories/${category}`,
        fr: `${baseUrl}/fr/categories/${category}`,
        ko: `${baseUrl}/ko/categories/${category}`,
      },
    },
  };
}

/**
 * Category page component
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  const categoryMeta = CATEGORY_METADATA[category];

  if (!categoryMeta) {
    notFound();
  }

  const platforms = getPlatformsByCategory(category);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/categories/${category}`;
  const IconComponent = iconMap[categoryMeta.icon] || Grid;

  // Get all categories for the "Other Categories" section
  const allCategories = getAllCategories().filter((c) => c !== category);

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/${locale}` },
          { name: "Categories", item: `${baseUrl}/${locale}/categories` },
          { name: categoryMeta.name, item: canonicalUrl },
        ]}
      />
      <CollectionPageJsonLd
        name={`${categoryMeta.name} Platforms`}
        description={`Search and check username availability across ${categoryMeta.name.toLowerCase()} platforms. ${categoryMeta.description}`}
        url={canonicalUrl}
        inLanguage={locale}
        items={platforms.map((p) => ({
          name: p.name,
          url: `${baseUrl}/${locale}/platforms/${p.slug}`,
          description: p.description,
        }))}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
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
            <li className="text-foreground font-medium">{categoryMeta.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-subtle border border-border/50 mb-6">
            <IconComponent className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {categoryMeta.name} Platforms
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {categoryMeta.description}
          </p>
          <p className="text-muted-foreground mt-4">
            Showing {platforms.length} popular {categoryMeta.name.toLowerCase()}{" "}
            platforms
          </p>
        </div>

        {/* Search CTA */}
        <section className="mb-12 p-8 rounded-3xl bg-gradient-subtle border border-border/50 shadow-custom-lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Check Username Across All {categoryMeta.name} Platforms
            </h2>
            <p className="text-muted-foreground mb-6">
              Enter a username to check availability across all{" "}
              {categoryMeta.name.toLowerCase()} platforms and 1,400+ more.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Username Search
            </Link>
          </div>
        </section>

        {/* Platforms Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            Popular {categoryMeta.name} Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <Link
                key={platform.slug}
                href={`/${locale}/platforms/${platform.slug}`}
                className="group p-6 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {platform.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {platform.founded && (
                        <span>Since {platform.founded}</span>
                      )}
                      <span>Popularity: {platform.popularity}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Keywords */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Related Searches</h2>
          <div className="flex flex-wrap gap-2">
            {categoryMeta.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>

        {/* Other Categories */}
        {allCategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Other Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allCategories.map((cat) => {
                const catMeta = CATEGORY_METADATA[cat];
                const CatIcon = iconMap[catMeta.icon] || Grid;

                return (
                  <Link
                    key={cat}
                    href={`/${locale}/categories/${cat}`}
                    className="group p-4 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 rounded-lg bg-background">
                        <CatIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">
                        {catMeta.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Category Description for SEO */}
        <article className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            About {categoryMeta.name} Platforms
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              {categoryMeta.description} Checking username availability across
              multiple {categoryMeta.name.toLowerCase()} platforms is essential
              for maintaining a consistent online presence. Whether you are
              building a personal brand, establishing a business presence, or
              simply want to secure your preferred handle across the web, our
              platform makes it easy to see where your username is available.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our service searches across {platforms.length} popular{" "}
              {categoryMeta.name.toLowerCase()} platforms and over 1,400 total
              platforms worldwide. Simply enter your desired username and we
              will show you exactly where it is available, where it is already
              taken, and provide direct links to claim it on available
              platforms.
            </p>
          </div>
        </article>

        {/* CTA Section */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Search Across 1,400+ Platforms Instantly
            </h2>
            <p className="text-muted-foreground mb-6">
              Check username availability on all{" "}
              {categoryMeta.name.toLowerCase()} platforms and thousands more.
              Free, fast, and no account required.
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
