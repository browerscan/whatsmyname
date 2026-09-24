import { isSupportedLocale } from "@/i18n/request";

// First path segment of every page family renderMarkdownPage knows.
const PAGE_SECTIONS = new Set(["tools", "categories", "platforms", "blog", "privacy", "terms"]);

/**
 * Page path behind a `.md` twin URL, following the llms.txt convention:
 * `/blog/x.md` -> `/blog/x`, `/index.html.md` -> `/`, `/de.md` -> `/de`.
 * Returns null for other `.md` files (static READMEs), which stay untouched.
 */
export function markdownTwinToPagePath(pathname: string): string | null {
  if (!pathname.endsWith(".md")) return null;

  const segments = pathname
    .slice(0, -".md".length)
    .replace(/\/index(\.html)?$/, "")
    .split("/")
    .filter(Boolean);
  const [section] = segments[0] && isSupportedLocale(segments[0]) ? segments.slice(1) : segments;

  if (section !== undefined && !PAGE_SECTIONS.has(section)) return null;
  return `/${segments.join("/")}`;
}

/** The `.md` twin URL path advertised for a page path. */
export function markdownTwinPath(pathname: string): string {
  const path = pathname.replace(/\/+$/, "");
  return path ? `${path}.md` : "/index.html.md";
}
