/**
 * Schema.org Structured Data Components
 *
 * These components generate JSON-LD structured data for various schema types
 * to improve SEO and search engine understanding.
 */

import { useMemo } from "react";

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList Schema
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    };
  }, [items]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebPageJsonLdProps {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  image?: string;
}

/**
 * WebPage Schema
 */
export function WebPageJsonLd({
  name,
  description,
  url,
  inLanguage = "en",
  datePublished,
  dateModified,
  author = "What is my Name",
  image,
}: WebPageJsonLdProps) {
  const schema = useMemo(() => {
    const baseSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name,
      description,
      url,
      inLanguage,
      author: {
        "@type": "Organization",
        name: author,
      },
    };

    if (datePublished) {
      baseSchema.datePublished = datePublished;
    }

    if (dateModified) {
      baseSchema.dateModified = dateModified;
    }

    if (image) {
      baseSchema.primaryImageOfPage = {
        "@type": "ImageObject",
        url: image,
      };
    }

    return baseSchema;
  }, [
    name,
    description,
    url,
    inLanguage,
    datePublished,
    dateModified,
    author,
    image,
  ]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SoftwareApplicationJsonLdProps {
  name: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
    bestRating: string;
    worstRating: string;
  };
}

/**
 * SoftwareApplication Schema
 */
export function SoftwareApplicationJsonLd({
  name,
  description,
  url,
  applicationCategory = "UtilitiesApplication",
  operatingSystem = "Web",
  offers,
  aggregateRating,
}: SoftwareApplicationJsonLdProps) {
  const schema = useMemo(() => {
    const baseSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name,
      applicationCategory,
      operatingSystem,
    };

    if (description) {
      baseSchema.description = description;
    }

    if (url) {
      baseSchema.url = url;
    }

    if (offers) {
      baseSchema.offers = {
        "@type": "Offer",
        price: offers.price,
        priceCurrency: offers.priceCurrency,
      };
    }

    if (aggregateRating) {
      baseSchema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        ratingCount: aggregateRating.ratingCount,
        bestRating: aggregateRating.bestRating,
        worstRating: aggregateRating.worstRating,
      };
    }

    return baseSchema;
  }, [
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers,
    aggregateRating,
  ]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  items?: Array<{
    name: string;
    url: string;
    description?: string;
  }>;
}

/**
 * CollectionPage Schema
 */
export function CollectionPageJsonLd({
  name,
  description,
  url,
  inLanguage = "en",
  items = [],
}: CollectionPageJsonLdProps) {
  const schema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name,
      description,
      url,
      inLanguage,
      about: items.map((item) => ({
        "@type": "Thing",
        name: item.name,
        url: item.url,
        description: item.description,
      })),
    };
  }, [name, description, url, inLanguage, items]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    email: string;
    contactType: string;
  };
}

/**
 * Organization Schema
 */
export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  sameAs = [],
  contactPoint,
}: OrganizationJsonLdProps) {
  const schema = useMemo(() => {
    const baseSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      url,
    };

    if (logo) {
      baseSchema.logo = {
        "@type": "ImageObject",
        url: logo,
      };
    }

    if (description) {
      baseSchema.description = description;
    }

    if (sameAs.length > 0) {
      baseSchema.sameAs = sameAs;
    }

    if (contactPoint) {
      baseSchema.contactPoint = {
        "@type": "ContactPoint",
        email: contactPoint.email,
        contactType: contactPoint.contactType,
      };
    }

    return baseSchema;
  }, [name, url, logo, description, sameAs, contactPoint]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQPageJsonLdProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * FAQPage Schema
 */
export function FAQPageJsonLd({ questions }: FAQPageJsonLdProps) {
  const schema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer,
        },
      })),
    };
  }, [questions]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToJsonLdProps {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}

/**
 * HowTo Schema
 */
export function HowToJsonLd({ name, description, steps }: HowToJsonLdProps) {
  const schema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name,
      description,
      step: steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
        ...(step.image && { image: step.image }),
      })),
    };
  }, [name, description, steps]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface VideoObjectJsonLdProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl?: string;
}

/**
 * VideoObject Schema
 */
export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
}: VideoObjectJsonLdProps) {
  const schema = useMemo(() => {
    const baseSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name,
      description,
      thumbnailUrl,
      uploadDate,
    };

    if (duration) {
      baseSchema.duration = duration;
    }

    if (embedUrl) {
      baseSchema.embedUrl = embedUrl;
    }

    return baseSchema;
  }, [name, description, thumbnailUrl, uploadDate, duration, embedUrl]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
