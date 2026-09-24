import { getLocalizedUrl, locales } from "@/i18n/request";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-data";
import { POPULAR_PLATFORMS, getAllCategories } from "@/lib/platforms-data";
import { getLocalizedCategoryMetadata } from "@/lib/platforms-i18n";
import { educationContent } from "@/content/education";
import { getHomeFaq } from "@/content/faq";

import { educationHtmlToMarkdown, faqToMarkdown } from "./markdown";
import { getMcpToolSummaries } from "./mcp";
import {
  AGENT_PATHS,
  AGENT_SKILL_NAME,
  MCP_PROTOCOL_VERSION,
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  RESULT_CAVEAT,
  SITE_NAME,
  SITE_SUMMARY,
  getBaseUrl,
} from "./site";

const page = (path: string) => getLocalizedUrl(getBaseUrl(), "en", path);
const abs = (path: string) => `${getBaseUrl()}${path}`;

function firstSentence(text: string): string {
  return text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
}

function articles() {
  return getAllBlogSlugs()
    .map((slug) => getBlogPostBySlug(slug, "en"))
    .filter((post) => post !== undefined);
}

export function buildLlmsTxt(): string {
  const categories = getAllCategories().map((slug) => {
    const meta = getLocalizedCategoryMetadata(slug, "en");
    return `- [${meta.name}](${page(`/categories/${slug}`)}): ${meta.description}`;
  });
  const platforms = POPULAR_PLATFORMS.map(
    (platform) => `- [${platform.name}](${page(`/platforms/${platform.slug}`)}): ${firstSentence(platform.description)}`,
  );
  const posts = articles().map(
    (post) => `- [${post.title}](${page(`/blog/${post.slug}`)}): ${post.excerpt}`,
  );
  const tools = getMcpToolSummaries().map((tool) => `  - \`${tool.name}\`: ${tool.description}`);

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_SUMMARY}`,
    "",
    `${SITE_NAME} (${page("/")}) is an independent service for reviewing your own public usernames, comparing handles for a brand, and following up on possible matches with permission and a lawful purpose. No account or sign-up is needed.`,
    "",
    `Important limits: ${RESULT_CAVEAT} Coverage and response time depend on the data provider and on each platform; some services change their URLs or block automated requests.`,
    "",
    `The interface is published in ${locales.length} languages (${locales.join(", ")}); non-English pages use a locale prefix such as ${page("/").replace(/\/$/, "")}/de. This file is English only.`,
    "",
    "## Pages",
    "",
    `- [Username search](${page("/")}): Enter a username once and see where it exists across 1,400+ platforms, with Google web results and optional AI analysis.`,
    `- [Tools](${page("/tools")}): The available username tools and how to read their results.`,
    `- [Platform categories](${page("/categories")}): Platforms grouped by type.`,
    `- [Blog](${page("/blog")}): Guides on choosing, protecting and changing usernames.`,
    `- [Privacy policy](${page("/privacy")}) and [Terms of service](${page("/terms")}).`,
    "",
    "## Platform categories",
    "",
    ...categories,
    "",
    "## Platform guides",
    "",
    ...platforms,
    "",
    "## Articles",
    "",
    ...posts,
    "",
    "## For agents",
    "",
    `- Markdown: every page has a Markdown twin at its URL plus \`.md\` (the home page is ${abs("/index.html.md")}), and any page URL requested with \`Accept: text/markdown\` returns the same Markdown.`,
    `- MCP server: ${abs(AGENT_PATHS.mcp)} (Streamable HTTP, JSON responses, read-only, no auth). Server card: ${abs(AGENT_PATHS.mcpServerCard)}. Tools:`,
    ...tools,
    `- Agent skill: ${abs(AGENT_PATHS.agentSkill)}`,
    `- Discovery: ${abs(AGENT_PATHS.apiCatalog)} and ${abs(AGENT_PATHS.aiCatalog)}`,
    `- Browser agents: the home page registers a WebMCP tool, \`search_username\`, where the browser supports navigator.modelContext.`,
    "- The live search endpoints under /api/ serve the website itself; they are rate-limited and are not a public API.",
    "",
    "## Optional",
    "",
    `- [Full text](${abs(AGENT_PATHS.llmsFull)}): this file plus every article, platform guide and the responsible-use guide.`,
    "",
  ].join("\n");
}

export function buildLlmsFullTxt(): string {
  const guide = educationHtmlToMarkdown(educationContent.en);
  const platformGuides = POPULAR_PLATFORMS.map((platform) =>
    [
      `### ${platform.name}`,
      "",
      platform.description,
      "",
      `Category: ${getLocalizedCategoryMetadata(platform.category, "en").name}${platform.founded ? `. Founded: ${platform.founded}` : ""}. Official site: ${platform.url}. Guide: ${page(`/platforms/${platform.slug}`)}`,
    ].join("\n"),
  );
  const posts = articles().map((post) =>
    [
      `---`,
      "",
      `Source: ${page(`/blog/${post.slug}`)} (published ${post.publishedAt})`,
      "",
      post.content.trim().replace(/^# /, "## "),
    ].join("\n"),
  );

  return [
    buildLlmsTxt().trim(),
    "",
    "# Responsible use",
    "",
    guide.replace(/^## .*\n+/, ""),
    "",
    faqToMarkdown(getHomeFaq("en"), 1),
    "",
    "# Platform guides",
    "",
    ...platformGuides.flatMap((entry) => [entry, ""]),
    "# Articles",
    "",
    ...posts.flatMap((entry) => [entry, ""]),
  ].join("\n");
}

export function buildAgentSkill(): string {
  return [
    "---",
    `name: ${AGENT_SKILL_NAME}`,
    "description: Help someone check where a username exists across 1,400+ websites and apps with whatismyname.org, read the results responsibly, and cite the site's platform guides and articles.",
    "---",
    "",
    `# Username search with ${SITE_NAME}`,
    "",
    `${page("/")} checks a username across 1,400+ platforms, adds Google web results and offers optional AI analysis. It is free and needs no account.`,
    "",
    "## Run a search",
    "",
    `1. Check the format first. Usernames are 3-30 characters of letters, numbers, underscores and hyphens, starting and ending with a letter or number. The MCP tool \`check_username_format\` at ${abs(AGENT_PATHS.mcp)} applies the same rule.`,
    `2. Open ${page("/")} and enter the username without @ or a profile URL. In a browser that supports WebMCP, call the page's \`search_username\` tool instead.`,
    "3. Results stream in per platform. Report the found profiles with their URLs.",
    "",
    "## Read results carefully",
    "",
    `- ${RESULT_CAVEAT}`,
    "- Open the original platform and compare public details before drawing conclusions.",
    "- Search your own accounts, or use the service with permission and a lawful purpose.",
    "",
    "## Look things up without searching",
    "",
    `- MCP (Streamable HTTP, read-only, no auth): ${abs(AGENT_PATHS.mcp)}. Tools: ${getMcpToolSummaries().map((tool) => `\`${tool.name}\``).join(", ")}.`,
    `- Any page as Markdown: append \`.md\` to its URL (home: ${abs("/index.html.md")}) or send \`Accept: text/markdown\`.`,
    `- Route map: ${abs(AGENT_PATHS.llms)}; full text: ${abs(AGENT_PATHS.llmsFull)}.`,
    "",
    "## Rules",
    "",
    "- Do not call the /api/ search endpoints directly; they serve the website, are rate-limited and are not a public API.",
    `- Cite the page an answer came from, for example a platform guide under ${page("/platforms/")}.`,
    "",
  ].join("\n");
}

export function buildMcpServerCard() {
  return {
    version: "1.0",
    protocolVersion: MCP_PROTOCOL_VERSION,
    serverInfo: { name: MCP_SERVER_NAME, title: SITE_NAME, version: MCP_SERVER_VERSION },
    description:
      "Read-only facts from whatismyname.org: platform username guides, articles, and username format checks.",
    documentationUrl: abs(AGENT_PATHS.llms),
    transport: { type: "streamable-http", endpoint: abs(AGENT_PATHS.mcp) },
    endpoint: abs(AGENT_PATHS.mcp),
    authentication: { required: false, schemes: [] },
    capabilities: { tools: { listChanged: false } },
    tools: getMcpToolSummaries(),
  };
}

export function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: abs(AGENT_PATHS.mcp),
        "service-desc": [
          {
            href: abs(AGENT_PATHS.mcpServerCard),
            type: "application/json",
            title: "MCP server card: read-only tools for platform guides, articles and username format checks.",
          },
        ],
        "service-doc": [
          { href: abs(AGENT_PATHS.llms), type: "text/plain", title: `${SITE_NAME} route map for language models` },
        ],
        status: [{ href: abs(AGENT_PATHS.health), type: "application/json" }],
      },
    ],
  };
}

export function buildAgentSkillsIndex(skillDigestHex: string) {
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: AGENT_SKILL_NAME,
        type: "skill-md",
        description:
          "Check where a username exists across 1,400+ websites and apps with whatismyname.org and read the results responsibly.",
        url: AGENT_PATHS.agentSkill,
        digest: `sha256:${skillDigestHex}`,
      },
    ],
  };
}

export function buildAiCatalog() {
  const host = new URL(getBaseUrl()).host;
  return {
    specVersion: "1.0",
    host: { displayName: SITE_NAME, identifier: `did:web:${host}` },
    entries: [
      {
        identifier: `urn:air:${host}:server:${MCP_SERVER_NAME}`,
        displayName: `${SITE_NAME} MCP server (read-only)`,
        type: "application/mcp-server-card+json",
        url: abs(AGENT_PATHS.mcpServerCard),
        representativeQueries: [
          "which platforms does whatismyname.org have username guides for",
          "is this username in a valid format for a username search",
          "how do I choose or protect a username",
        ],
      },
      {
        identifier: `urn:air:${host}:api:catalog`,
        displayName: `${SITE_NAME} API catalog`,
        type: "application/linkset+json",
        url: abs(AGENT_PATHS.apiCatalog),
        representativeQueries: [
          "what machine-readable interfaces does whatismyname.org offer",
          "where is the whatismyname.org MCP endpoint",
        ],
      },
      {
        identifier: `urn:air:${host}:skill:${AGENT_SKILL_NAME}`,
        displayName: "Username search skill",
        type: "text/markdown",
        url: abs(AGENT_PATHS.agentSkill),
        representativeQueries: [
          "check where a username exists across social networks",
          "search a username on 1,400+ websites",
          "is my username taken on other platforms",
        ],
      },
      {
        identifier: `urn:air:${host}:doc:llms-txt`,
        displayName: `${SITE_NAME} route map for language models`,
        type: "text/plain",
        url: abs(AGENT_PATHS.llms),
        representativeQueries: [
          "what pages does whatismyname.org publish",
          "free username search across platforms",
        ],
      },
    ],
  };
}

// Served by app/robots.txt/route.ts rather than app/robots.ts, because
// MetadataRoute.Robots cannot emit Content-Signal directives.
const RULES = [
  "Allow: /",
  "Disallow: /api/",
  "Disallow: /private/",
  "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
];

export function buildRobotsTxt(baseUrl: string): string {
  return [
    "# Search engines, answer engines and AI assistants are welcome to read and cite this site.",
    "# /api/ serves the site's own live searches and is not for crawling; agents can use /mcp.",
    "User-agent: *",
    ...RULES,
    "Crawl-delay: 1",
    "",
    "User-agent: Googlebot",
    "User-agent: Bingbot",
    "User-agent: OAI-SearchBot",
    "User-agent: ChatGPT-User",
    "User-agent: Claude-SearchBot",
    "User-agent: Claude-User",
    "User-agent: PerplexityBot",
    "User-agent: Perplexity-User",
    ...RULES,
    "",
    "# Training crawlers are allowed on purpose.",
    "User-agent: GPTBot",
    "User-agent: ClaudeBot",
    "User-agent: CCBot",
    "User-agent: Google-Extended",
    "User-agent: Applebot-Extended",
    "User-agent: Amazonbot",
    "User-agent: meta-externalagent",
    ...RULES,
    "",
    `Host: ${baseUrl}`,
    `Sitemap: ${baseUrl}/sitemap.xml`,
    `# LLM guide: ${baseUrl}${AGENT_PATHS.llms}`,
    `# LLM full text: ${baseUrl}${AGENT_PATHS.llmsFull}`,
    "",
  ].join("\n");
}
