import { Metadata } from "next";
import Link from "next/link";
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
import { getAllCategories, CATEGORY_METADATA } from "@/lib/platforms-data";

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

interface CategoriesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/categories`;

  return {
    title:
      "Platform Categories - Username Search by Category | What is my Name",
    description:
      "Browse platform categories and check username availability across social media, gaming, business, coding, and entertainment platforms. Find where your username is available.",
    keywords: [
      "platform categories",
      "username search by category",
      "social media platforms list",
      "gaming platforms list",
      "business platforms list",
      "developer platforms list",
      "username availability by category",
    ],
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",

    openGraph: {
      type: "website",
      locale: locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: "Platform Categories - Username Search by Category",
      description:
        "Browse platform categories and check username availability across social media, gaming, business, coding, and entertainment platforms.",
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: "Platform Categories Username Search",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Platform Categories - Username Search by Category",
      description:
        "Browse platform categories and check username availability across social media, gaming, business, coding, and entertainment platforms.",
      images: [`${baseUrl}/images/og-image.svg`],
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/categories`,
        zh: `${baseUrl}/zh/categories`,
        es: `${baseUrl}/es/categories`,
        ja: `${baseUrl}/ja/categories`,
        fr: `${baseUrl}/fr/categories`,
        ko: `${baseUrl}/ko/categories`,
      },
    },
  };
}

/**
 * Categories index page component
 */
export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  const categories = getAllCategories();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/categories`;

  // Import platforms data to get counts
  const { POPULAR_PLATFORMS } = await import("@/lib/platforms-data");

  // Get platform count per category
  const categoryCounts = categories.reduce(
    (acc, cat) => {
      acc[cat] = POPULAR_PLATFORMS.filter((p) => p.category === cat).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/${locale}` },
          { name: "Categories", item: canonicalUrl },
        ]}
      />
      <CollectionPageJsonLd
        name="Platform Categories"
        description="Browse platform categories and check username availability across social media, gaming, business, coding, and entertainment platforms."
        url={canonicalUrl}
        inLanguage={locale}
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
            <li className="text-foreground font-medium">Categories</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Platform Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse platform categories and check username availability across
            1,400+ platforms worldwide
          </p>
        </div>

        {/* Categories Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryMeta = CATEGORY_METADATA[category];
              const IconComponent = iconMap[categoryMeta.icon] || Grid;
              const count = categoryCounts[category] || 0;

              return (
                <Link
                  key={category}
                  href={`/${locale}/categories/${category}`}
                  className="group p-6 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-background">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {categoryMeta.name}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {categoryMeta.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {count} platform{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SEO Content */}
        <article className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Search Username by Platform Category
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our platform category browser helps you check username
              availability across different types of platforms. Whether you are
              looking for social media platforms, gaming websites, developer
              communities, or business networking sites, we have organized them
              into easy-to-browse categories.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Simply select a category above to view all platforms in that
              group. For each platform, you can see detailed information about
              username search, availability checking, and direct links to create
              accounts. Our service covers over 1,400 platforms across 10 major
              categories, making it easy to secure your username wherever you
              need it.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">
              Why Search by Category?
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Focus on platforms relevant to your interests or industry</li>
              <li>Discover new platforms in your favorite categories</li>
              <li>
                Secure your username on all important platforms in your niche
              </li>
              <li>Compare availability across similar platforms at once</li>
            </ul>
          </div>
        </article>

        {/* CTA Section */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Search Across All 1,400+ Platforms
            </h2>
            <p className="text-muted-foreground mb-6">
              Skip the categories and search everywhere at once. Enter your
              username and find where it is available across all platforms.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Universal Search
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
