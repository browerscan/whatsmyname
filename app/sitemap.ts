import { MetadataRoute } from "next";
import { getLocaleAlternates, getLocalizedUrl, locales } from "@/i18n/request";
import { getAllPlatformSlugs, getAllCategories } from "@/lib/platforms-data";
import { getAllBlogSlugs } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";

  const currentDate = new Date();

  // Generate sitemap entries for all locales
  const localePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: getLocalizedUrl(baseUrl, locale),
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: locale === "en" ? 1.0 : 0.8,
    alternates: {
      languages: getLocaleAlternates(baseUrl),
    },
  }));

  // Add categories pages for all locales
  const categoriesPages: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const categories = getAllCategories();
    return [
      // Categories index
      {
        url: getLocalizedUrl(baseUrl, locale, "/categories"),
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: getLocaleAlternates(baseUrl, "/categories"),
        },
      },
      // Individual category pages
      ...categories.map((category) => ({
        url: getLocalizedUrl(baseUrl, locale, `/categories/${category}`),
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: getLocaleAlternates(baseUrl, `/categories/${category}`),
        },
      })),
    ];
  });

  // Add platform pages for all locales
  const platformPages: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const platforms = getAllPlatformSlugs();
    return platforms.map((slug) => ({
      url: getLocalizedUrl(baseUrl, locale, `/platforms/${slug}`),
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: getLocaleAlternates(baseUrl, `/platforms/${slug}`),
      },
    }));
  });

  // Add tools pages for all locales
  const toolsPages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: getLocalizedUrl(baseUrl, locale, "/tools"),
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: getLocaleAlternates(baseUrl, "/tools"),
    },
  }));

  // Add blog pages for all locales
  const blogPages: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const blogSlugs = getAllBlogSlugs();
    return [
      // Blog index
      {
        url: getLocalizedUrl(baseUrl, locale, "/blog"),
        lastModified: currentDate,
        changeFrequency: "daily" as const,
        priority: 0.8,
        alternates: {
          languages: getLocaleAlternates(baseUrl, "/blog"),
        },
      },
      // Individual blog posts
      ...blogSlugs.map((slug) => ({
        url: getLocalizedUrl(baseUrl, locale, `/blog/${slug}`),
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: getLocaleAlternates(baseUrl, `/blog/${slug}`),
        },
      })),
    ];
  });

  // Add privacy and terms pages for all locales
  const legalPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: getLocalizedUrl(baseUrl, locale, "/privacy"),
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: getLocalizedUrl(baseUrl, locale, "/terms"),
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]);

  // Add root URL (redirects to default locale)
  const rootPage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: {
        languages: getLocaleAlternates(baseUrl),
      },
    },
  ];

  return [
    ...rootPage,
    ...localePages,
    ...categoriesPages,
    ...platformPages,
    ...toolsPages,
    ...blogPages,
    ...legalPages,
  ];
}
