import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { buildRobotsTxt } from "@/lib/agent/documents";
import { getPrivacyDocument } from "@/content/legal";
import { getAllPlatformSlugs } from "@/lib/platforms-data";
import { locales } from "@/i18n/request";
import { educationContent } from "@/content/education";
import { getToolsCatalog, getToolsPageCopy } from "@/content/route-copy";

describe("AdSense crawl and disclosure readiness", () => {
  it("publishes unique canonical URLs and unique platform routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    const slugs = getAllPlatformSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.filter((slug) => slug === "discord")).toHaveLength(1);
  });
  it("lets ad crawlers fetch rendering assets", () => {
    const robots = buildRobotsTxt("https://whatismyname.org");
    expect(robots).toMatch(/^User-agent: \*\nAllow: \/$/m);
    expect(robots).not.toContain("Disallow: /_next/");
    expect(robots).not.toContain("Disallow: /static/");
  });
  for (const locale of locales) {
    it(`publishes a complete practical guide and only available tools in ${locale}`, () => {
      const guide = educationContent[locale];
      expect(guide).toContain('id="lookup-guide-title"');
      expect(guide.match(/<section\b/g)).toHaveLength(6);
      expect(guide).not.toMatch(/\d+(?:[.,]\d+)?\s*[%％]/);
      expect(guide).not.toContain("#statistics");
      const tools = getToolsCatalog(locale);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((tool) => !tool.comingSoon && tool.href === "/")).toBe(true);
      expect(getToolsPageCopy(locale).checker.length).toBeGreaterThan(30);
    });
    it(`discloses Google advertising and choices in ${locale}`, () => {
      const document = getPrivacyDocument(locale);
      const content = JSON.stringify(document);
      expect(content).toContain("Google AdSense");
      expect(content).not.toContain("Ad.Plus");
      expect(content).toContain("https://adssettings.google.com/");
      expect(content).toContain("policies.google.com/technologies/partner-sites");
    });
  }
});
