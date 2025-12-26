import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, Tag } from "lucide-react";
import {
  BreadcrumbJsonLd,
  BlogJsonLd,
  CollectionPageJsonLd,
} from "@/components/seo/schema-org";
import {
  BLOG_POSTS,
  getRecentBlogPosts,
  getBlogCategories,
} from "@/lib/blog-data";

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/blog`;

  return {
    title: "Blog - Username Tips, Guides & Digital Identity | What is my Name",
    description:
      "Learn about username best practices, digital identity protection, personal branding, and online security. Expert tips and guides for managing your online presence.",
    keywords: [
      "username blog",
      "digital identity tips",
      "personal branding guide",
      "username security",
      "online presence tips",
      "social media branding",
    ],
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",

    openGraph: {
      type: "website",
      locale: locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: "Blog - Username Tips, Guides & Digital Identity",
      description:
        "Learn about username best practices, digital identity protection, personal branding, and online security.",
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: "What is my Name Blog",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Blog - Username Tips, Guides & Digital Identity",
      description:
        "Learn about username best practices, digital identity protection, personal branding, and online security.",
      images: [`${baseUrl}/images/og-image.svg`],
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/blog`,
        zh: `${baseUrl}/zh/blog`,
        es: `${baseUrl}/es/blog`,
        ja: `${baseUrl}/ja/blog`,
        fr: `${baseUrl}/fr/blog`,
        ko: `${baseUrl}/ko/blog`,
      },
    },
  };
}

/**
 * Blog index page component
 */
export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/blog`;

  const posts = getRecentBlogPosts(20);
  const categories = getBlogCategories();

  // Group posts by category
  const postsByCategory = posts.reduce(
    (acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = [];
      }
      acc[post.category].push(post);
      return acc;
    },
    {} as Record<string, typeof posts>,
  );

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/${locale}` },
          { name: "Blog", item: canonicalUrl },
        ]}
      />
      <CollectionPageJsonLd
        name="What is my Name Blog"
        description="Learn about username best practices, digital identity protection, personal branding, and online security."
        url={canonicalUrl}
        inLanguage={locale}
        items={posts.map((post) => ({
          name: post.title,
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          description: post.excerpt,
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
            <li className="text-foreground font-medium">Blog</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert tips, guides, and insights on usernames, digital identity,
            and building your online presence
          </p>
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <section className="mb-12">
            <Link
              href={`/${locale}/blog/${posts[0].slug}`}
              className="group block p-8 rounded-3xl bg-gradient-subtle border border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase">
                  Featured
                </span>
                <span>{posts[0].category}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {posts[0].title}
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(posts[0].publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {posts[0].readTime} min read
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Posts by Category */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group p-6 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium uppercase">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min
                  </span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${locale}/blog?category=${category}`}
                className="px-4 py-2 rounded-full bg-muted/50 border border-border/30 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Tags */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(posts.flatMap((p) => p.tags)))
              .slice(0, 20)
              .map((tag) => (
                <Link
                  key={tag}
                  href={`/${locale}/blog?tag=${tag}`}
                  className="px-3 py-1.5 rounded-full bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors text-sm flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </Link>
              ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Get the latest tips on usernames, digital identity, and online
              security delivered to your inbox.
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
