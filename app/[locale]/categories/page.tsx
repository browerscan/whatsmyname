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
  getLocaleAlternates,
  getLocalePath,
  getLocalizedUrl,
} from "@/i18n/request";
import { getAllCategories, POPULAR_PLATFORMS } from "@/lib/platforms-data";
import { getLocalizedCategoryMetadata } from "@/lib/platforms-i18n";
import { getCategoriesIndexCopy } from "@/content/route-copy";

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

export async function generateMetadata({
  params,
}: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const tSeo = await getTranslations({ locale, namespace: "seo.categories" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, "/categories");

  return {
    title: tSeo("title"),
    description: tSeo("description"),
    keywords: ["platform categories", "username search", "platform list"],
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
      languages: getLocaleAlternates(baseUrl, "/categories"),
    },
  };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.categories_index" });
  const copy = getCategoriesIndexCopy(locale);
  const categories = getAllCategories();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, "/categories");
  const homeHref = getLocalePath(locale);

  const categoryCounts = categories.reduce(
    (acc, category) => {
      acc[category] = POPULAR_PLATFORMS.filter((platform) => platform.category === category).length;
      return acc;
    },
    {} as Record<string, number>,
  );

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("description")}</p>
        </div>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryMeta = getLocalizedCategoryMetadata(category, locale);
              const IconComponent = iconMap[categoryMeta.icon] || Grid;
              const count = categoryCounts[category] || 0;

              return (
                <Link
                  key={category}
                  href={getLocalePath(locale, `/categories/${category}`)}
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
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{categoryMeta.description}</p>
                      <span className="text-xs text-muted-foreground">{t("platform_count", { count })}</span>
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
            <p className="text-muted-foreground leading-relaxed mb-4">{copy.details}</p>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{t("reason_title")}</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              {copy.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
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
              {t("cta_button")}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
