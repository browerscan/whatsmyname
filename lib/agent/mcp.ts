import { getLocalizedUrl } from "@/i18n/request";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-data";
import {
  CATEGORY_METADATA,
  POPULAR_PLATFORMS,
  getAllCategories,
  getPlatformBySlug,
} from "@/lib/platforms-data";
import { validateUsername } from "@/lib/validators";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";

import {
  MCP_PROTOCOL_VERSION,
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  RESULT_CAVEAT,
  SITE_NAME,
  getBaseUrl,
} from "./site";

/**
 * Stateless, read-only MCP server (Streamable HTTP, JSON responses).
 * Every tool answers from data bundled with the site, so a tool call never
 * triggers the rate-limited username-search upstream.
 */

const SUPPORTED_PROTOCOL_VERSIONS = [MCP_PROTOCOL_VERSION, "2025-03-26", "2024-11-05"];

export const MCP_INSTRUCTIONS = `Read-only facts from ${SITE_NAME} (whatismyname.org): which platforms the site has guides for, the site's articles, and whether a username is in the format the search accepts. Live username checks across 1,400+ sites run in the browser at https://whatismyname.org/. ${RESULT_CAVEAT}`;

interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: Record<string, boolean>;
  run: (args: Record<string, unknown>) => ToolOutcome;
}

type ToolOutcome = { data: Record<string, unknown>; isError?: boolean };

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function pageUrl(path: string): string {
  return getLocalizedUrl(getBaseUrl(), "en", path);
}

function platformSummary(slug: string) {
  const platform = getPlatformBySlug(slug);
  if (!platform) return null;
  return {
    slug: platform.slug,
    name: platform.name,
    category: platform.category,
    officialUrl: platform.url,
    guideUrl: pageUrl(`/platforms/${platform.slug}`),
  };
}

const TOOLS: ToolDefinition[] = [
  {
    name: "list_platform_guides",
    title: "List platform guides",
    description:
      "List the platforms whatismyname.org publishes username guides for, optionally filtered by category. The live search itself covers 1,400+ sites; this is the curated guide set.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: getAllCategories(),
          description: "Optional platform category.",
        },
      },
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    run: (args) => {
      const category = typeof args.category === "string" ? args.category : undefined;
      if (category && !(category in CATEGORY_METADATA)) {
        return {
          isError: true,
          data: { error: `Unknown category "${category}".`, categories: getAllCategories() },
        };
      }
      const platforms = POPULAR_PLATFORMS.filter(
        (platform) => !category || platform.category === category,
      ).map((platform) => platformSummary(platform.slug));
      return {
        data: {
          category: category ?? null,
          categories: getAllCategories(),
          count: platforms.length,
          platforms,
        },
      };
    },
  },
  {
    name: "get_platform_guide",
    title: "Get platform guide",
    description:
      "Get the whatismyname.org guide for one platform: what it is, its category, founding year, official site and the guide page URL to cite.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Platform slug from list_platform_guides, for example github or instagram.",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    run: (args) => {
      const slug = typeof args.slug === "string" ? args.slug.trim().toLowerCase() : "";
      const platform = getPlatformBySlug(slug);
      if (!platform) {
        return {
          isError: true,
          data: {
            error: `No guide for "${slug}". Call list_platform_guides for valid slugs.`,
          },
        };
      }
      return {
        data: {
          ...platformSummary(slug),
          description: platform.description,
          founded: platform.founded ?? null,
          categoryName: CATEGORY_METADATA[platform.category]?.name ?? platform.category,
          searchUrl: pageUrl("/"),
        },
      };
    },
  },
  {
    name: "list_articles",
    title: "List articles",
    description:
      "List whatismyname.org articles about choosing, protecting and changing usernames, newest first, with URLs to cite.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: READ_ONLY,
    run: () => {
      const articles = getAllBlogSlugs()
        .map((slug) => getBlogPostBySlug(slug, "en"))
        .filter((post) => post !== undefined)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
          url: pageUrl(`/blog/${post.slug}`),
        }));
      return { data: { count: articles.length, articles } };
    },
  },
  {
    name: "get_article",
    title: "Get article",
    description: "Get the full Markdown text of one whatismyname.org article by slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Article slug from list_articles." },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    run: (args) => {
      const slug = typeof args.slug === "string" ? args.slug.trim() : "";
      const post = getBlogPostBySlug(slug, "en");
      if (!post) {
        return {
          isError: true,
          data: { error: `No article "${slug}". Call list_articles for valid slugs.` },
        };
      }
      return {
        data: {
          slug: post.slug,
          title: post.title,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt ?? null,
          url: pageUrl(`/blog/${post.slug}`),
          markdown: post.content.trim(),
        },
      };
    },
  },
  {
    name: "check_username_format",
    title: "Check username format",
    description:
      "Check whether a username fits the format the whatismyname.org search accepts before sending a person to run the search. It does not check any platform.",
    inputSchema: {
      type: "object",
      properties: {
        username: { type: "string", description: "Username to check, without @ or a profile URL." },
      },
      required: ["username"],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    run: (args) => {
      const username = typeof args.username === "string" ? args.username : "";
      const result = validateUsername(username);
      const rules = `${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters; letters, numbers, underscores and hyphens; must start and end with a letter or number.`;
      return {
        data: {
          username: username.trim(),
          valid: result.isValid,
          problem: result.isValid ? null : result.errorKey,
          rules,
          searchUrl: pageUrl("/"),
          note: result.isValid
            ? `Enter this username at ${pageUrl("/")} to check 1,400+ sites. ${RESULT_CAVEAT}`
            : "Fix the format before searching.",
        },
      };
    },
  },
];

export function getMcpToolSummaries() {
  return TOOLS.map(({ name, description }) => ({ name, description }));
}

type JsonRpcId = string | number | null;

interface JsonRpcMessage {
  jsonrpc?: unknown;
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
}

function result(id: JsonRpcId, value: unknown) {
  return { jsonrpc: "2.0" as const, id, result: value };
}

function error(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id, error: { code, message } };
}

/** Returns the JSON-RPC response, or null for notifications. */
export function handleMcpMessage(message: unknown) {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return error(null, -32600, "Invalid Request");
  }

  const { jsonrpc, id, method, params } = message as JsonRpcMessage;
  const isNotification = id === undefined;

  if (jsonrpc !== "2.0" || typeof method !== "string") {
    return isNotification ? null : error(id ?? null, -32600, "Invalid Request");
  }

  if (isNotification) return null;

  const args =
    params && typeof params === "object" && !Array.isArray(params)
      ? (params as Record<string, unknown>)
      : {};

  switch (method) {
    case "initialize": {
      const requested = typeof args.protocolVersion === "string" ? args.protocolVersion : "";
      return result(id, {
        protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested)
          ? requested
          : MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: MCP_SERVER_NAME, title: SITE_NAME, version: MCP_SERVER_VERSION },
        instructions: MCP_INSTRUCTIONS,
      });
    }
    case "ping":
      return result(id, {});
    case "tools/list":
      return result(id, {
        tools: TOOLS.map(({ name, title, description, inputSchema, annotations }) => ({
          name,
          title,
          description,
          inputSchema,
          annotations,
        })),
      });
    case "tools/call": {
      const tool = TOOLS.find((item) => item.name === args.name);
      if (!tool) {
        return error(id, -32602, `Unknown tool: ${String(args.name)}`);
      }
      const toolArgs =
        args.arguments && typeof args.arguments === "object" && !Array.isArray(args.arguments)
          ? (args.arguments as Record<string, unknown>)
          : {};
      const outcome = tool.run(toolArgs);
      return result(id, {
        content: [{ type: "text", text: JSON.stringify(outcome.data, null, 2) }],
        structuredContent: outcome.data,
        isError: outcome.isError ?? false,
      });
    }
    default:
      return error(id, -32601, `Method not found: ${method}`);
  }
}
