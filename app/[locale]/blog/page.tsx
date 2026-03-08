import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
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
import {
  getLocalizedBlogCategories,
  getLocalizedBlogTags,
  getLocalizedRecentBlogPosts,
  intlLocaleCodes,
} from "@/lib/blog-i18n";

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const tSeo = await getTranslations({ locale, namespace: "seo.blog" });
  const posts = getLocalizedRecentBlogPosts(locale, 6);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, "/blog");

  return {
    title: tSeo("title"),
    description: tSeo("description"),
    keywords: Array.from(new Set(posts.flatMap((post) => post.keywords))).slice(0, 10),
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
      languages: getLocaleAlternates(baseUrl, "/blog"),
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog_index" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, "/blog");
  const homeHref = getLocalePath(locale);
  const intlLocale = intlLocaleCodes[locale as keyof typeof intlLocaleCodes] ?? intlLocaleCodes.en;

  const posts = getLocalizedRecentBlogPosts(locale, 20);
  const categories = getLocalizedBlogCategories(locale);
  const tags = getLocalizedBlogTags(locale).slice(0, 20);

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
        items={posts.map((post) => ({
          name: post.title,
          url: getLocalizedUrl(baseUrl, locale, `/blog/${post.slug}`),
          description: post.excerpt,
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
            <li className="text-foreground font-medium">{t("breadcrumb")}</li>
          </ol>
        </nav>

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("description")}</p>
        </div>

        {posts.length > 0 && (
          <section className="mb-12">
            <Link
              href={getLocalePath(locale, `/blog/${posts[0].slug}`)}
              className="group block p-8 rounded-3xl bg-gradient-subtle border border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase">
                  {t("featured")}
                </span>
                <span>{posts[0].category.label}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {posts[0].title}
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-2">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Intl.DateTimeFormat(intlLocale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(posts[0].publishedAt))}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {t("minutes_read", { count: posts[0].readTime })}
                </span>
              </div>
            </Link>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("latest_articles")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={getLocalePath(locale, `/blog/${post.slug}`)}
                className="group p-6 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium uppercase">
                    {post.category.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t("minutes_short", { count: post.readTime })}
                  </span>
                  <span>
                    {new Intl.DateTimeFormat(intlLocale, {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(post.publishedAt))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("browse_by_category")}</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={getLocalePath(locale, `/blog?category=${category.slug}`)}
                className="px-4 py-2 rounded-full bg-muted/50 border border-border/30 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("popular_topics")}</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={getLocalePath(locale, `/blog?tag=${tag.slug}`)}
                className="px-3 py-1.5 rounded-full bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors text-sm flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{t("newsletter_title")}</h2>
            <p className="text-muted-foreground mb-6">{t("newsletter_description")}</p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t("newsletter_placeholder")}
                className="flex-1 px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                {t("newsletter_button")}
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
