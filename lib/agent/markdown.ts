import { createTranslator } from "next-intl";

import {
  defaultLocale,
  getLocalizedUrl,
  isSupportedLocale,
  type AppLocale,
} from "@/i18n/request";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-data";
import { getAllCategories } from "@/lib/platforms-data";
import {
  getLocalizedCategoryMetadata,
  getLocalizedPlatformBySlug,
  getLocalizedPlatformsByCategory,
} from "@/lib/platforms-i18n";
import {
  getCategoriesIndexCopy,
  getCategoryDetailCopy,
  getCategoryHeaderCopy,
  getPlatformDetailCopy,
  getToolsCatalog,
  getToolsPageCopy,
} from "@/content/route-copy";
import { getPrivacyDocument, getTermsDocument } from "@/content/legal";
import { educationContent } from "@/content/education";
import type { LegalDocument } from "@/content/legal";

import { AGENT_PATHS, getBaseUrl } from "./site";

export interface MarkdownPage {
  title: string;
  description: string;
  url: string;
  locale: AppLocale;
  body: string;
}

export function splitLocalePath(pathname: string): {
  locale: AppLocale;
  segments: string[];
} {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });

  if (segments[0] && isSupportedLocale(segments[0])) {
    return { locale: segments[0], segments: segments.slice(1) };
  }

  return { locale: defaultLocale, segments };
}

async function getTranslator(locale: AppLocale) {
  const messages = (await import(`../../locales/${locale}.json`)).default;
  return createTranslator({ locale, messages });
}

/** Minimal converter for the education HTML fragments (h2/h3/p only). */
export function educationHtmlToMarkdown(html: string): string {
  return html
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n### $1\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, "\n$1\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function legalToMarkdown(document: LegalDocument): string {
  const lines = [`# ${document.title}`, "", document.lastUpdatedLabel];
  for (const section of document.sections) {
    lines.push("", `## ${section.title}`);
    for (const paragraph of section.paragraphs ?? []) {
      lines.push("", paragraph);
    }
    if (section.items?.length) {
      lines.push("");
      for (const item of section.items) {
        const label = item.label ? `**${item.label}:** ` : "";
        const link = item.href ? ` (${item.href})` : "";
        lines.push(`- ${label}${item.text}${link}`);
      }
    }
  }
  return lines.join("\n");
}

export async function renderMarkdownPage(
  pathname: string,
): Promise<MarkdownPage | null> {
  const { locale, segments } = splitLocalePath(pathname);
  const baseUrl = getBaseUrl();
  const t = await getTranslator(locale);
  const url = (path: string) => getLocalizedUrl(baseUrl, locale, path);
  const [section, slug, ...rest] = segments;

  if (rest.length > 0) return null;

  if (!section) {
    const categories = getAllCategories().map((category) => {
      const meta = getLocalizedCategoryMetadata(category, locale);
      return `- [${meta.name}](${url(`/categories/${category}`)}): ${meta.description}`;
    });
    const guide = educationHtmlToMarkdown(
      educationContent[locale] || educationContent[defaultLocale],
    );
    return {
      title: t("seo.home.title"),
      description: t("seo.home.description"),
      url: url("/"),
      locale,
      body: [
        `# ${t("home.hero.title_highlight")}`,
        "",
        t("home.hero.description"),
        "",
        `[${t("pages.platform_detail.cta_button")}](${url("/")})`,
        "",
        guide,
        "",
        `- [${t("seo.tools.title")}](${url("/tools")})`,
        `- [${t("pages.blog_index.title")}](${url("/blog")})`,
        `- [${t("footer.privacy")}](${url("/privacy")})`,
        `- [${t("footer.terms")}](${url("/terms")})`,
        "",
        `## ${t("pages.categories_index.title")}`,
        "",
        ...categories,
        "",
        "## For agents",
        "",
        `- Site guide: ${baseUrl}${AGENT_PATHS.llms}`,
        `- MCP server (read-only, no auth): ${baseUrl}${AGENT_PATHS.mcp}`,
        `- Agent skill: ${baseUrl}${AGENT_PATHS.agentSkill}`,
      ].join("\n"),
    };
  }

  if (section === "tools" && !slug) {
    const copy = getToolsPageCopy(locale);
    const tools = getToolsCatalog(locale).map(
      (tool) => `- [${tool.name}](${url(tool.href ?? "/")}): ${tool.description}`,
    );
    return {
      title: t("seo.tools.title"),
      description: t("seo.tools.description"),
      url: url("/tools"),
      locale,
      body: [`# ${t("seo.tools.title")}`, "", copy.intro, "", ...tools, "", copy.checker].join("\n"),
    };
  }

  if (section === "categories") {
    if (!slug) {
      const copy = getCategoriesIndexCopy(locale);
      const categories = getAllCategories().map((category) => {
        const meta = getLocalizedCategoryMetadata(category, locale);
        return `- [${meta.name}](${url(`/categories/${category}`)}): ${meta.description}`;
      });
      return {
        title: t("seo.categories.title"),
        description: t("seo.categories.description"),
        url: url("/categories"),
        locale,
        body: [
          `# ${t("seo.categories.title")}`,
          "",
          copy.intro,
          "",
          ...categories,
          "",
          copy.details,
          "",
          ...copy.reasons.map((reason) => `- ${reason}`),
        ].join("\n"),
      };
    }

    if (!getAllCategories().includes(slug)) return null;
    const meta = getLocalizedCategoryMetadata(slug, locale);
    const platforms = getLocalizedPlatformsByCategory(slug, locale);
    const header = getCategoryHeaderCopy(locale, meta.name, platforms.length);
    const copy = getCategoryDetailCopy(locale, meta.name, meta.description, platforms.length);
    return {
      title: t("seo.category.title", { category: meta.name }),
      description: t("seo.category.description", { category: meta.name }),
      url: url(`/categories/${slug}`),
      locale,
      body: [
        `# ${header.title}`,
        "",
        copy.paragraph1,
        "",
        ...platforms.map(
          (platform) =>
            `- [${platform.name}](${url(`/platforms/${platform.slug}`)}): ${platform.description}`,
        ),
        "",
        copy.paragraph2,
      ].join("\n"),
    };
  }

  if (section === "platforms" && slug) {
    const platform = getLocalizedPlatformBySlug(slug, locale);
    if (!platform) return null;
    const copy = getPlatformDetailCopy(locale, platform.name, platform.founded);
    const category = getLocalizedCategoryMetadata(platform.category, locale);
    return {
      title: t("seo.platform.title", { platform: platform.name }),
      description: t("seo.platform.description", { platform: platform.name }),
      url: url(`/platforms/${slug}`),
      locale,
      body: [
        `# ${copy.title}`,
        "",
        platform.description,
        "",
        `- ${t("pages.platform_detail.category_label")} [${category.name}](${url(`/categories/${platform.category}`)})`,
        ...(copy.foundedLabel ? [`- ${copy.foundedLabel}`] : []),
        `- [${t("pages.platform_detail.visit_platform", { platform: platform.name })}](${platform.url})`,
        "",
        `## ${t("pages.platform_detail.about_title", { platform: platform.name })}`,
        "",
        copy.aboutParagraph,
        "",
        `## ${t("pages.platform_detail.cta_title")}`,
        "",
        t("pages.platform_detail.cta_description", { platform: platform.name }),
        "",
        `[${t("pages.platform_detail.cta_button")}](${url("/")})`,
      ].join("\n"),
    };
  }

  if (section === "blog") {
    if (!slug) {
      const posts = getAllBlogSlugs()
        .map((postSlug) => getBlogPostBySlug(postSlug, locale))
        .filter((post) => post !== undefined);
      return {
        title: t("seo.blog.title"),
        description: t("seo.blog.description"),
        url: url("/blog"),
        locale,
        body: [
          `# ${t("seo.blog.title")}`,
          "",
          t("pages.blog_index.description"),
          "",
          ...posts.map(
            (post) =>
              `- [${post.title}](${url(`/blog/${post.slug}`)}) (${post.publishedAt}): ${post.excerpt}`,
          ),
        ].join("\n"),
      };
    }

    const post = getBlogPostBySlug(slug, locale);
    if (!post) return null;
    const content = post.content.trim();
    return {
      title: post.title,
      description: post.excerpt,
      url: url(`/blog/${slug}`),
      locale,
      body: [
        content.startsWith("# ") ? content : `# ${post.title}\n\n${content}`,
        "",
        `Published ${post.publishedAt}${post.updatedAt ? `, updated ${post.updatedAt}` : ""} by ${post.author}.`,
      ].join("\n"),
    };
  }

  if (section === "privacy" && !slug) {
    const document = getPrivacyDocument(locale);
    return {
      title: document.title,
      description: document.lastUpdatedLabel,
      url: url("/privacy"),
      locale,
      body: legalToMarkdown(document),
    };
  }

  if (section === "terms" && !slug) {
    const document = getTermsDocument(locale);
    return {
      title: document.title,
      description: document.lastUpdatedLabel,
      url: url("/terms"),
      locale,
      body: legalToMarkdown(document),
    };
  }

  return null;
}

export function formatMarkdownDocument(page: MarkdownPage): string {
  return [
    "---",
    `title: ${JSON.stringify(page.title)}`,
    `description: ${JSON.stringify(page.description)}`,
    `url: ${page.url}`,
    `language: ${page.locale}`,
    "---",
    "",
    page.body.trim(),
    "",
  ].join("\n");
}
