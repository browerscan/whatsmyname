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
import { getAllCategories } from "@/lib/platforms-data";
import {
  getLocalizedCategoryMetadata,
  getLocalizedPlatformsByCategory,
} from "@/lib/platforms-i18n";
import {
  getLocaleAlternates,
  getLocalePath,
  getLocalizedUrl,
  locales,
} from "@/i18n/request";
import {
  getCategoryDetailCopy,
  getCategoryHeaderCopy,
} from "@/content/route-copy";

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

export async function generateStaticParams() {
  const categories = getAllCategories();

  return locales.flatMap((locale) =>
    categories.map((category) => ({
      locale,
      category,
    })),
  );
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const tSeo = await getTranslations({ locale, namespace: "seo.category" });
  const t = await getTranslations({ locale, namespace: "pages.category_detail" });
  const categoryMeta = getLocalizedCategoryMetadata(category, locale);

  if (!categoryMeta) {
    return { title: t("not_found_title") };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, `/categories/${category}`);

  return {
    title: tSeo("title", { category: categoryMeta.name }),
    description: `${tSeo("description", { category: categoryMeta.name })} ${categoryMeta.description}`,
    keywords: categoryMeta.keywords,
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",
    openGraph: {
      type: "website",
      locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: tSeo("title", { category: categoryMeta.name }),
      description: categoryMeta.description,
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: categoryMeta.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tSeo("title", { category: categoryMeta.name }),
      description: categoryMeta.description,
      images: [`${baseUrl}/images/og-image.svg`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getLocaleAlternates(baseUrl, `/categories/${category}`),
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "pages.category_detail" });
  const categoryMeta = getLocalizedCategoryMetadata(category, locale);

  if (!categoryMeta) {
    notFound();
  }

  const platforms = getLocalizedPlatformsByCategory(category, locale);
  const allCategories = getAllCategories().filter((item) => item !== category);
  const categoryHeader = getCategoryHeaderCopy(locale, categoryMeta.name, platforms.length);
  const categoryCopy = getCategoryDetailCopy(
    locale,
    categoryMeta.name,
    categoryMeta.description,
    platforms.length,
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, `/categories/${category}`);
  const homeHref = getLocalePath(locale);
  const categoriesHref = getLocalePath(locale, "/categories");
  const IconComponent = iconMap[categoryMeta.icon] || Grid;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("home"), item: homeHref },
          { name: t("categories"), item: categoriesHref },
          { name: categoryMeta.name, item: canonicalUrl },
        ]}
      />
      <CollectionPageJsonLd
        name={categoryHeader.title}
        description={categoryMeta.description}
        url={canonicalUrl}
        inLanguage={locale}
        items={platforms.map((platform) => ({
          name: platform.name,
          url: getLocalizedUrl(baseUrl, locale, `/platforms/${platform.slug}`),
          description: platform.description,
        }))}
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
            <li>
              <Link href={categoriesHref} className="hover:text-foreground transition-colors">
                {t("categories")}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{categoryMeta.name}</li>
          </ol>
        </nav>

        <div className="mb-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-subtle border border-border/50 mb-6">
            <IconComponent className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryHeader.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{categoryMeta.description}</p>
          <p className="text-muted-foreground mt-4">{categoryHeader.summary}</p>
        </div>

        <section className="mb-12 p-8 rounded-3xl bg-gradient-subtle border border-border/50 shadow-custom-lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{t("search_title", { category: categoryMeta.name })}</h2>
            <p className="text-muted-foreground mb-6">{t("search_description", { category: categoryMeta.name })}</p>
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {t("cta_button")}
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("popular_platforms_title", { category: categoryMeta.name })}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <Link
                key={platform.slug}
                href={getLocalePath(locale, `/platforms/${platform.slug}`)}
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
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{platform.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {platform.founded && <span>{t("since", { year: platform.founded })}</span>}
                      <span>{t("popularity_percent", { popularity: platform.popularity })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t("related_searches_title")}</h2>
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

        {allCategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("other_categories_title")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allCategories.map((item) => {
                const itemMeta = getLocalizedCategoryMetadata(item, locale);
                const ItemIcon = iconMap[itemMeta.icon] || Grid;

                return (
                  <Link
                    key={item}
                    href={getLocalePath(locale, `/categories/${item}`)}
                    className="group p-4 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 rounded-lg bg-background">
                        <ItemIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{itemMeta.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <article className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{t("about_title", { category: categoryMeta.name })}</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">{categoryCopy.paragraph1}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{categoryCopy.paragraph2}</p>
          </div>
        </article>

        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{t("cta_title")}</h2>
            <p className="text-muted-foreground mb-6">{t("cta_description")}</p>
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {t("cta_search_now")}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
