import { getTranslations } from "next-intl/server";
import { localeSchemaNames, locales } from "@/i18n/request";
import { CONTACT_EMAIL } from "@/lib/constants";

export async function StructuredData() {
  const t = await getTranslations("seo.home");
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";

  // WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "What is my Name",
    alternateName: "Username Search Platform",
    description: t("description"),
    url: baseUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Search across 1,400+ platforms",
      "Real-time username availability check",
      "AI-powered analysis",
      `Multi-language support (${locales.length} languages)`,
      "Google Custom Search integration",
      "OSINT capabilities",
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    author: {
      "@type": "Organization",
      name: "What is my Name Team",
      url: baseUrl,
    },
  };

  // WebSite Schema with SearchAction
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "What is my Name",
    alternateName: "Username Search Platform",
    url: baseUrl,
    description: t("description"),
    inLanguage: [...locales],
    publisher: {
      "@type": "Organization",
      name: "What is my Name",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/og-image.svg`,
        width: 1200,
        height: 630,
      },
    },
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "What is my Name",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/og-image.svg`,
      width: 1200,
      height: 630,
    },
    description: t("description"),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: CONTACT_EMAIL,
      availableLanguage: Object.values(localeSchemaNames),
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

    </>
  );
}
