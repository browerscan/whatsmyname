import { Metadata } from "next";
import Link from "next/link";
import { Search, Sparkles, UserCheck, Lightbulb, BookOpen } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CollectionPageJsonLd,
} from "@/components/seo/schema-org";

interface ToolsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const tools = [
  {
    slug: "username-generator",
    name: "Username Generator",
    description:
      "Generate creative, unique username ideas based on your name, interests, or keywords. Perfect for finding available usernames across platforms.",
    icon: Sparkles,
    keywords: [
      "username generator",
      "username ideas",
      "create username",
      "unique username",
      "random username",
      "username suggestions",
    ],
    comingSoon: true,
  },
  {
    slug: "username-availability-checker",
    name: "Username Availability Checker",
    description:
      "Check if your desired username is available across 1,400+ platforms instantly. See where it is taken and where you can still claim it.",
    icon: UserCheck,
    keywords: [
      "username availability",
      "check username",
      "username taken",
      "username search",
      "available username",
      "username checker",
    ],
    comingSoon: false,
    href: "/",
  },
  {
    slug: "username-ideas",
    name: "Username Ideas & Inspiration",
    description:
      "Browse curated username ideas by category, style, and platform. Get inspiration for creating your perfect username.",
    icon: Lightbulb,
    keywords: [
      "username ideas",
      "username inspiration",
      "cool usernames",
      "creative usernames",
      "username suggestions",
      "username examples",
    ],
    comingSoon: true,
  },
];

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: ToolsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/tools`;

  return {
    title:
      "Username Tools - Generator, Availability Checker & More | What is my Name",
    description:
      "Free username tools including availability checker, username generator, and username ideas. Check and create perfect usernames for all platforms.",
    keywords: [
      "username tools",
      "username generator",
      "username availability checker",
      "username ideas",
      "username creator",
      "username finder",
    ],
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",

    openGraph: {
      type: "website",
      locale: locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: "Username Tools - Generator, Availability Checker & More",
      description:
        "Free username tools including availability checker, username generator, and username ideas.",
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: "Username Tools",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Username Tools - Generator, Availability Checker & More",
      description:
        "Free username tools including availability checker, username generator, and username ideas.",
      images: [`${baseUrl}/images/og-image.svg`],
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/tools`,
        zh: `${baseUrl}/zh/tools`,
        es: `${baseUrl}/es/tools`,
        ja: `${baseUrl}/ja/tools`,
        fr: `${baseUrl}/fr/tools`,
        ko: `${baseUrl}/ko/tools`,
      },
    },
  };
}

/**
 * Tools index page component
 */
export default async function ToolsPage({ params }: ToolsPageProps) {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale}/tools`;

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/${locale}` },
          { name: "Tools", item: canonicalUrl },
        ]}
      />
      <CollectionPageJsonLd
        name="Username Tools"
        description="Free username tools including availability checker, username generator, and username ideas."
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
            <li className="text-foreground font-medium">Tools</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-subtle border border-border/50 mb-6">
            <Search className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Username Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Free tools to help you find, check, and create the perfect username
            across all platforms
          </p>
        </div>

        {/* Tools Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const IconComponent = tool.icon;

              return tool.comingSoon ? (
                <div
                  key={tool.slug}
                  className="group p-6 rounded-2xl bg-muted/10 border border-border/20 cursor-not-allowed opacity-75"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-background">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-semibold">{tool.name}</h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {tool.keywords.slice(0, 3).map((keyword) => (
                          <span
                            key={keyword}
                            className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={tool.slug}
                  href={`/${locale}${tool.href || `/tools/${tool.slug}`}`}
                  className="group p-6 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-background">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                        {tool.name}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {tool.keywords.slice(0, 3).map((keyword) => (
                          <span
                            key={keyword}
                            className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SEO Content */}
        <article className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Free Username Tools</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our collection of free username tools helps you find, check, and
              create the perfect username for any platform. Whether you are
              building a personal brand, starting a new business, or just want a
              consistent handle across your favorite websites, our tools make it
              easy.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">
              Username Availability Checker
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our most popular tool checks if your desired username is available
              across 1,400+ platforms instantly. Simply enter your username and
              see exactly where it is taken, where it is available, and get
              direct links to claim it on platforms where it is free.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">
              Username Generator
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Coming soon! Our username generator will help you create unique,
              creative usernames based on your name, interests, or keywords.
              Perfect when your first choice is taken everywhere.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">
              Username Ideas & Inspiration
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Coming soon! Browse curated username ideas by category, style, and
              platform. Get inspiration for creating your perfect username.
            </p>
          </div>
        </article>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Why Use Our Username Tools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Search 1,400+ Platforms</h3>
              <p className="text-sm text-muted-foreground">
                Check username availability across more platforms than any other
                service
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get real-time availability checks with no waiting or account
                required
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/30 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">100% Free</h3>
              <p className="text-sm text-muted-foreground">
                All tools are completely free with no hidden costs or premium
                tiers
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Check Your Username Now
            </h2>
            <p className="text-muted-foreground mb-6">
              Use our availability checker to see where your username is taken
              and where you can still claim it. Free, instant, and no account
              required.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Checking Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
