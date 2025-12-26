import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/schema-org";
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
  getRelatedBlogPosts,
  type BlogPost,
} from "@/lib/blog-data";

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts
 */
export async function generateStaticParams() {
  const locales = ["en", "zh", "es", "ja", "fr", "ko"];
  const slugs = getAllBlogSlugs();

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
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/blog/${slug}`;

  return {
    title: `${post.title} | What is my Name Blog`,
    description: post.excerpt,
    keywords: [
      ...post.keywords,
      ...post.tags,
      "username blog",
      "digital identity",
    ],
    authors: [{ name: post.author }],
    creator: "What is my Name",
    publisher: "What is my Name",

    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      locale: locale,
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
      tags: post.tags,
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
      languages: {
        en: `${baseUrl}/en/blog/${slug}`,
        zh: `${baseUrl}/zh/blog/${slug}`,
        es: `${baseUrl}/es/blog/${slug}`,
        ja: `${baseUrl}/ja/blog/${slug}`,
        fr: `${baseUrl}/fr/blog/${slug}`,
        ko: `${baseUrl}/ko/blog/${slug}`,
      },
    },
  };
}

/**
 * Custom markdown parser for blog content
 */
function parseMarkdownContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle headings
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
    }
    // Handle bullet points
    else if (line.startsWith("- ")) {
      inList = true;
      currentList.push(
        <li key={`li-${i}`} className="text-muted-foreground leading-relaxed">
          {line.slice(2)}
        </li>,
      );
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
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
    }
    // Handle bold text
    else if (line.startsWith("**") && line.endsWith("**")) {
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
    }
    // Handle paragraphs
    else if (line.trim()) {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
      elements.push(
        <p
          key={`p-${i}`}
          className="text-muted-foreground leading-relaxed mb-4"
        >
          {line}
        </p>,
      );
    }
    // Handle empty lines
    else {
      if (inList) {
        elements.push(<ul key={`list-${i}`}>{currentList}</ul>);
        currentList = [];
        inList = false;
      }
    }
  }

  // Close any remaining list
  if (inList) {
    elements.push(<ul key="list-final">{currentList}</ul>);
  }

  return elements;
}

/**
 * Blog post page component
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/blog/${slug}`;
  const relatedPosts = getRelatedBlogPosts(slug, 3);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const contentElements = parseMarkdownContent(post.content);

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/${locale}` },
          { name: "Blog", item: `${baseUrl}/${locale}/blog` },
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
        articleSection={post.category}
        wordCount={post.content.split(/\s+/).length}
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
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
                href={`/${locale}/blog`}
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className="mb-12">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium uppercase mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          </div>

          {/* Meta Info */}
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
              {post.readTime} min read
            </span>
          </div>

          {/* Article Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {contentElements}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/30">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${locale}/blog?tag=${tag}`}
                    className="px-3 py-1 rounded-full bg-muted/50 border border-border/30 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Share Section */}
        <section className="mb-12 p-6 rounded-2xl bg-muted/20 border border-border/30">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share this article
          </h3>
          <div className="flex gap-3">
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
              Copy Link
            </button>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  className="group p-5 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all"
                >
                  <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase mb-3">
                    {relatedPost.category}
                  </span>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {relatedPost.excerpt}
                  </p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {relatedPost.readTime} min read
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Check Your Username Now
            </h2>
            <p className="text-muted-foreground mb-6">
              Use our free tool to check username availability across 1,400+
              platforms instantly.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Username Search
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
