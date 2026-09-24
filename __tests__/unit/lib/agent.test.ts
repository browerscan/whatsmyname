import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { GET as getMarkdown } from "@/app/api/markdown/[[...path]]/route";
import { GET as getSkillIndex } from "@/app/.well-known/agent-skills/index.json/route";
import { GET as getSkill } from "@/app/.well-known/agent-skills/username-search/SKILL.md/route";
import { GET as getApiCatalog } from "@/app/.well-known/api-catalog/route";
import { GET as getMcpGet, OPTIONS as mcpOptions, POST as mcpPost } from "@/app/mcp/route";
import {
  buildAiCatalog,
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildMcpServerCard,
  buildRobotsTxt,
} from "@/lib/agent/documents";
import { renderMarkdownPage } from "@/lib/agent/markdown";
import { handleMcpMessage } from "@/lib/agent/mcp";
import { AGENT_LINK_HEADER, prefersMarkdown } from "@/lib/agent/site";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { getAllPlatformSlugs } from "@/lib/platforms-data";

function robotsGroups(robots: string) {
  return robots
    .split(/\n\s*\n/)
    .filter((block) => /^User-agent:/m.test(block))
    .map((block) => ({
      agents: [...block.matchAll(/^User-agent: (.+)$/gm)].map((match) => match[1]),
      body: block,
    }));
}

async function callMcp(body: unknown) {
  const response = await mcpPost(
    new Request("https://whatismyname.org/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
  return response;
}

describe("Markdown negotiation", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9", true],
    ["text/html, text/markdown", true],
    ["text/html;q=1, text/markdown;q=0.5", false],
    ["text/markdown;q=0", false],
    ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", false],
    [null, false],
  ])("Accept %s -> markdown %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  it("renders every page family as Markdown with a canonical URL", async () => {
    const home = await renderMarkdownPage("/");
    expect(home?.url).toBe("https://whatismyname.org/");
    expect(home?.body).toContain("1,400+");

    const platform = await renderMarkdownPage("/platforms/github");
    expect(platform?.url).toBe("https://whatismyname.org/platforms/github");
    expect(platform?.body).toContain("https://github.com");

    const post = await renderMarkdownPage(`/de/blog/${getAllBlogSlugs()[0]}`);
    expect(post?.locale).toBe("de");
    expect(post?.url).toBe(`https://whatismyname.org/de/blog/${getAllBlogSlugs()[0]}`);
    expect(post?.body.startsWith("# ")).toBe(true);

    for (const path of ["/tools", "/categories", "/categories/social", "/blog", "/privacy", "/terms", "/zh"]) {
      const page = await renderMarkdownPage(path);
      expect(page, path).not.toBeNull();
      expect(page?.body.length, path).toBeGreaterThan(100);
    }
  });

  it("returns null for unknown pages", async () => {
    expect(await renderMarkdownPage("/platforms/not-a-platform")).toBeNull();
    expect(await renderMarkdownPage("/categories/nope")).toBeNull();
    expect(await renderMarkdownPage("/blog/a/b")).toBeNull();
    expect(await renderMarkdownPage("/unknown")).toBeNull();
  });

  it("serves text/markdown with front matter from the rewrite target", async () => {
    const response = await getMarkdown(new Request("https://whatismyname.org/api/markdown") as never, {
      params: Promise.resolve({ path: ["platforms", "github"] }),
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("link")).toBe('<https://whatismyname.org/platforms/github>; rel="canonical"');
    expect(Number(response.headers.get("x-markdown-tokens"))).toBeGreaterThan(0);
    const body = await response.text();
    expect(body).toMatch(/^---\ntitle: ".+"\n/);

    const missing = await getMarkdown(new Request("https://whatismyname.org/api/markdown") as never, {
      params: Promise.resolve({ path: ["nope"] }),
    });
    expect(missing.status).toBe(404);
  });
});

describe("robots.txt", () => {
  const robots = buildRobotsTxt("https://whatismyname.org");

  it("declares Content-Signal and keeps /api/ out of every group", () => {
    const groups = robotsGroups(robots);
    expect(groups.length).toBeGreaterThanOrEqual(3);
    for (const group of groups) {
      expect(group.body).toContain("Allow: /");
      expect(group.body).toContain("Disallow: /api/");
      expect(group.body).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=yes");
    }
  });

  it("allows answer engines and AI crawlers instead of blocking them", () => {
    const agents = robotsGroups(robots).flatMap((group) => group.agents);
    for (const bot of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "GPTBot", "ClaudeBot", "Google-Extended"]) {
      expect(agents).toContain(bot);
    }
    expect(robots).not.toMatch(/^Disallow: \/$/m);
    expect(robots).toContain("Sitemap: https://whatismyname.org/sitemap.xml");
  });
});

describe("llms.txt", () => {
  it("follows the llms.txt shape and links every guide and article", () => {
    const llms = buildLlmsTxt();
    expect(llms).toMatch(/^# What is my Name\n\n> /);
    for (const slug of getAllPlatformSlugs()) {
      expect(llms).toContain(`https://whatismyname.org/platforms/${slug})`);
    }
    for (const slug of getAllBlogSlugs()) {
      expect(llms).toContain(`https://whatismyname.org/blog/${slug})`);
    }
    expect(llms).toContain("https://whatismyname.org/mcp");
    expect(llms).not.toContain("undefined");
  });

  it("puts every article body in llms-full.txt", () => {
    const full = buildLlmsFullTxt();
    expect(full.length).toBeGreaterThan(buildLlmsTxt().length * 3);
    expect(full).toContain("# Responsible use");
    expect(full).not.toMatch(/<\/?(p|h2|h3|section)\b/);
  });
});

describe("Discovery documents", () => {
  it("publishes an RFC 9727 linkset for the MCP endpoint", async () => {
    const response = getApiCatalog();
    expect(response.headers.get("content-type")).toContain("application/linkset+json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    const catalog = await response.json();
    expect(catalog.linkset[0].anchor).toBe("https://whatismyname.org/mcp");
    expect(catalog.linkset[0]["service-desc"][0].href).toBe(
      "https://whatismyname.org/.well-known/mcp/server-card.json",
    );
  });

  it("lists the same tools in the server card as the MCP server", () => {
    const listed = handleMcpMessage({ jsonrpc: "2.0", id: 1, method: "tools/list" });
    const names = (listed as { result: { tools: { name: string }[] } }).result.tools.map((tool) => tool.name);
    expect(buildMcpServerCard().tools.map((tool) => tool.name)).toEqual(names);
  });

  it("publishes a skill digest that matches the served SKILL.md bytes", async () => {
    const skill = await getSkill().text();
    const index = await getSkillIndex().json();
    const expected = createHash("sha256").update(skill).digest("hex");
    expect(index.skills[0].digest).toBe(`sha256:${expected}`);
    expect(skill).toMatch(/^---\nname: username-search\ndescription: .+\n---\n/);
  });

  it("gives every ARD entry an urn:air id and representative queries", () => {
    for (const entry of buildAiCatalog().entries) {
      expect(entry.identifier).toMatch(/^urn:air:whatismyname\.org:[a-z]+:[a-z0-9-]+$/);
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("advertises the discovery documents in the Link header", () => {
    expect(AGENT_LINK_HEADER).toContain('</.well-known/api-catalog>; rel="api-catalog"');
    expect(AGENT_LINK_HEADER).toContain('</llms.txt>; rel="service-doc"');
  });
});

describe("MCP endpoint", () => {
  it("initializes and negotiates the protocol version", async () => {
    const response = await callMcp({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1" } },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    const body = await response.json();
    expect(body.result.protocolVersion).toBe("2025-03-26");
    expect(body.result.serverInfo.name).toBe("whatismyname");
    expect(body.result.capabilities.tools).toBeDefined();

    const unknownVersion = await (await callMcp({ jsonrpc: "2.0", id: 2, method: "initialize", params: { protocolVersion: "1999-01-01" } })).json();
    expect(unknownVersion.result.protocolVersion).toBe("2025-06-18");
  });

  it("accepts notifications with 202 and no body", async () => {
    const response = await callMcp({ jsonrpc: "2.0", method: "notifications/initialized" });
    expect(response.status).toBe(202);
    expect(await response.text()).toBe("");
  });

  it("calls read-only tools with structured results", async () => {
    const guide = await (await callMcp({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_platform_guide", arguments: { slug: "GitHub" } } })).json();
    expect(guide.result.isError).toBe(false);
    expect(guide.result.structuredContent.guideUrl).toBe("https://whatismyname.org/platforms/github");
    expect(JSON.parse(guide.result.content[0].text).name).toBe(guide.result.structuredContent.name);

    const list = await (await callMcp({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "list_platform_guides", arguments: { category: "coding" } } })).json();
    expect(list.result.structuredContent.count).toBeGreaterThan(0);
    expect(list.result.structuredContent.platforms.every((item: { category: string }) => item.category === "coding")).toBe(true);

    const article = await (await callMcp({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "get_article", arguments: { slug: getAllBlogSlugs()[0] } } })).json();
    expect(article.result.structuredContent.markdown).toMatch(/^# /);

    const valid = await (await callMcp({ jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "check_username_format", arguments: { username: "john_doe" } } })).json();
    expect(valid.result.structuredContent.valid).toBe(true);
    const invalid = await (await callMcp({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "check_username_format", arguments: { username: "a" } } })).json();
    expect(invalid.result.structuredContent).toMatchObject({ valid: false, problem: "too_short" });
  });

  it("reports tool and protocol errors", async () => {
    const missing = await (await callMcp({ jsonrpc: "2.0", id: 8, method: "tools/call", params: { name: "get_platform_guide", arguments: { slug: "nope" } } })).json();
    expect(missing.result.isError).toBe(true);

    const unknownTool = await (await callMcp({ jsonrpc: "2.0", id: 9, method: "tools/call", params: { name: "delete_everything" } })).json();
    expect(unknownTool.error.code).toBe(-32602);

    const unknownMethod = await (await callMcp({ jsonrpc: "2.0", id: 10, method: "resources/list" })).json();
    expect(unknownMethod.error.code).toBe(-32601);

    const parse = await callMcp("{not json");
    expect(parse.status).toBe(400);
    expect((await parse.json()).error.code).toBe(-32700);

    const batch = await (await callMcp([{ jsonrpc: "2.0", id: 11, method: "ping" }, { jsonrpc: "2.0", method: "notifications/initialized" }])).json();
    expect(batch).toEqual([{ jsonrpc: "2.0", id: 11, result: {} }]);
  });

  it("answers CORS preflight and refuses GET", async () => {
    expect(mcpOptions().status).toBe(204);
    const get = getMcpGet();
    expect(get.status).toBe(405);
    expect(get.headers.get("allow")).toBe("POST, OPTIONS");
  });
});
