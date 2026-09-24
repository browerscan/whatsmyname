/**
 * Shared facts for agent-facing surfaces (llms.txt, Markdown negotiation,
 * MCP, agent skills, discovery manifests). Everything here is derived from
 * bundled site data; none of it calls the paid username-search upstream.
 */

export const SITE_NAME = "What is my Name";
export const MCP_SERVER_NAME = "whatismyname";
export const MCP_SERVER_VERSION = "1.0.0";
export const MCP_PROTOCOL_VERSION = "2025-06-18";
export const AGENT_SKILL_NAME = "username-search";

export const SITE_SUMMARY =
  "Free username search: check where a username exists across 1,400+ websites and apps, alongside Google web results and optional AI analysis, in nine languages.";

export const RESULT_CAVEAT =
  "A found result is a lead to a public profile, not proof of ownership. A not-found result does not guarantee the name is free to register: reserved names, login walls, rate limits and network errors can affect checks. A matching username alone does not identify a person.";

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
}

export const AGENT_PATHS = {
  llms: "/llms.txt",
  llmsFull: "/llms-full.txt",
  mcp: "/mcp",
  apiCatalog: "/.well-known/api-catalog",
  mcpServerCard: "/.well-known/mcp/server-card.json",
  agentSkillsIndex: "/.well-known/agent-skills/index.json",
  agentSkill: `/.well-known/agent-skills/${AGENT_SKILL_NAME}/SKILL.md`,
  aiCatalog: "/.well-known/ai-catalog.json",
  health: "/api/health",
} as const;

/** RFC 8288 Link header value advertised on every HTML page. */
export const AGENT_LINK_HEADER = [
  `<${AGENT_PATHS.apiCatalog}>; rel="api-catalog"`,
  `<${AGENT_PATHS.llms}>; rel="service-doc"; type="text/plain"`,
  `<${AGENT_PATHS.agentSkillsIndex}>; rel="describedby"; type="application/json"`,
].join(", ");

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
} as const;

export function jsonResponse(
  body: unknown,
  contentType = "application/json; charset=utf-8",
): Response {
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export function textResponse(body: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

/**
 * Serve Markdown only when the client explicitly ranks text/markdown at
 * least as high as text/html. Browsers never list text/markdown, so they
 * keep receiving HTML.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;

  let markdownQ = -1;
  let htmlQ = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    const qParam = params.find((param) => param.trim().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
    const weight = Number.isFinite(q) ? q : 0;
    if (type.trim() === "text/markdown") markdownQ = Math.max(markdownQ, weight);
    if (type.trim() === "text/html") htmlQ = Math.max(htmlQ, weight);
  }

  return markdownQ > 0 && markdownQ >= htmlQ;
}
