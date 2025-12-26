import { getTranslations } from "next-intl/server";

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
      "Multi-language support (6 languages)",
      "Google Custom Search integration",
      "OSINT capabilities",
    ],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
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
    inLanguage: ["en", "zh", "es", "ja", "fr", "ko"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?username={search_term_string}`,
      },
      "query-input": {
        "@type": "PropertyValueSpecification",
        valueRequired: true,
        valueName: "search_term_string",
        description: "Username to search across platforms",
      },
    },
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
    foundingDate: "2024",
    sameAs: [
      "https://github.com/whatismyname",
      "https://twitter.com/whatismyname",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "contact@whatismyname.com",
      availableLanguage: [
        "English",
        "Chinese",
        "Spanish",
        "Japanese",
        "French",
        "Korean",
      ],
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

  // FAQPage Schema for educational content
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is username search and why is it important?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Username search allows you to find accounts across multiple platforms using a single username. It's important for digital identity management, online security audits, OSINT investigations, and verifying your digital footprint across the internet.",
        },
      },
      {
        "@type": "Question",
        name: "How many platforms does What is my Name search?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "What is my Name searches across 1,400+ platforms including social media networks, forums, gaming platforms, professional networks, and various online communities.",
        },
      },
      {
        "@type": "Question",
        name: "Is What is my Name free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, What is my Name is completely free to use. You can search for usernames across all supported platforms without any cost or registration required.",
        },
      },
      {
        "@type": "Question",
        name: "What is OSINT and how does this tool help?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "OSINT (Open Source Intelligence) is the collection and analysis of publicly available information. What is my Name helps with OSINT by aggregating username presence across platforms, helping researchers, security professionals, and individuals understand their online presence.",
        },
      },
      {
        "@type": "Question",
        name: "How can I protect my digital identity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To protect your digital identity: regularly audit your online presence using tools like What is my Name, use unique usernames for sensitive accounts, enable two-factor authentication, review privacy settings on all platforms, and remove accounts you no longer use.",
        },
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

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
