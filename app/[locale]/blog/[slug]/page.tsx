import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/schema-org";
import {
  getLocaleAlternates,
  getLocalePath,
  getLocalizedUrl,
  locales,
} from "@/i18n/request";
import {
  getLocalizedBlogPostBySlug,
  getLocalizedBlogSlugs,
  getLocalizedRelatedBlogPosts,
  intlLocaleCodes,
} from "@/lib/blog-i18n";

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getLocalizedBlogSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog_post" });
  const post = getLocalizedBlogPostBySlug(slug, locale);

  if (!post) {
    return {
      title: t("not_found_title"),
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, `/blog/${slug}`);

  return {
    title: `${post.title} | What is my Name Blog`,
    description: post.excerpt,
    keywords: [...post.keywords, ...post.tags.map((tag) => tag.label)],
    authors: [{ name: post.author }],
    creator: "What is my Name",
    publisher: "What is my Name",
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: post.title,
      description: post.excerpt,
      images: post.image
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: `${baseUrl}/images/og-image.svg`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
      tags: post.tags.map((tag) => tag.label),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [`${baseUrl}/images/og-image.svg`],
      creator: post.author,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getLocaleAlternates(baseUrl, `/blog/${slug}`),
    },
  };
}

function parseMarkdownContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-semibold mt-8 mb-4">
          {line.slice(2)}
        </h2>,
      );
    } else if (line.startsWith("## ")) {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-semibold mt-6 mb-3">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("### ")) {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      elements.push(
        <h4 key={`h4-${i}`} className="text-lg font-semibold mt-4 mb-2">
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith("- ")) {
      inList = true;
      currentList.push(
        <li key={`li-${i}`} className="text-muted-foreground leading-relaxed">
          {line.slice(2)}
        </li>,
      );
    } else if (/^\d+\.\s/.test(line)) {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      elements.push(
        <li
          key={`li-${i}`}
          className="text-muted-foreground leading-relaxed ml-4 list-disc"
        >
          {line.replace(/^\d+\.\s/, "")}
        </li>,
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      elements.push(
        <p key={`bold-${i}`} className="font-semibold mt-4 mb-2">
          {line.slice(2, -2)}
        </p>,
      );
    } else if (line.trim()) {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      elements.push(
        <p key={`p-${i}`} className="text-muted-foreground leading-relaxed mb-4">
          {line}
        </p>,
      );
    } else if (inList) {
      elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
      currentList = [];
      inList = false;
    }
  }

  if (inList) {
    elements.push(<ul key="list-final">{currentList}</ul>);
  }

  return elements;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog_post" });
  const post = getLocalizedBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = getLocalizedUrl(baseUrl, locale, `/blog/${slug}`);
  const homeHref = getLocalePath(locale);
  const blogHref = getLocalePath(locale, "/blog");
  const relatedPosts = getLocalizedRelatedBlogPosts(slug, locale, 3);
  const intlLocale = intlLocaleCodes[locale as keyof typeof intlLocaleCodes] ?? intlLocaleCodes.en;

  const formattedDate = new Intl.DateTimeFormat(intlLocale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  const contentElements = parseMarkdownContent(post.content);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("home"), item: homeHref },
          { name: t("blog"), item: blogHref },
          { name: post.title, item: canonicalUrl },
        ]}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={canonicalUrl}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt || post.publishedAt}
        author={post.author}
        image={post.image || `${baseUrl}/images/og-image.svg`}
        inLanguage={locale}
        articleSection={post.category.label}
        wordCount={post.content.split(/\s+/).length}
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <nav className="mb-8 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={homeHref} className="hover:text-foreground transition-colors">
                {t("home")}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={blogHref} className="hover:text-foreground transition-colors">
                {t("blog")}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        <Link
          href={blogHref}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_blog")}
        </Link>

        <article className="mb-12">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium uppercase mb-4">
              {post.category.label}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/30">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {t("minutes_read", { count: post.readTime })}
            </span>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">{contentElements}</div>

          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/30">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={getLocalePath(locale, `/blog?tag=${tag.slug}`)}
                    className="px-3 py-1 rounded-full bg-muted/50 border border-border/30 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all text-sm"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        <section className="mb-12 p-6 rounded-2xl bg-muted/20 border border-border/30">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {t("share_title")}
          </h3>
          <div className="flex gap-3 flex-wrap">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors text-sm font-medium"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#0855a0] transition-colors text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#1563d6] transition-colors text-sm font-medium"
            >
              Facebook
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(canonicalUrl)}
              className="px-4 py-2 rounded-lg bg-muted border border-border/30 hover:bg-muted/70 transition-colors text-sm font-medium"
            >
              {t("copy_link")}
            </button>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("related_articles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={getLocalePath(locale, `/blog/${relatedPost.slug}`)}
                  className="group p-6 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all"
                >
                  <div className="text-xs text-muted-foreground mb-2">{relatedPost.category.label}</div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{relatedPost.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

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
