import { createHash } from "node:crypto";
import { test, expect } from "@playwright/test";

const BROWSER_ACCEPT = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
const MCP_HEADERS = { "content-type": "application/json", accept: "application/json, text/event-stream" };

test.describe("agent discovery over HTTP", () => {
  test.skip(({ isMobile }) => isMobile, "HTTP contract is device-independent");

  test("robots.txt welcomes answer engines and declares Content-Signal", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
    const body = await response.text();
    expect(body).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=yes");
    expect(body).toContain("User-agent: OAI-SearchBot");
    expect(body).toContain("User-agent: GPTBot");
    expect(body).not.toMatch(/^Disallow: \/$/m);
    expect(body).toContain("Sitemap: https://whatismyname.org/sitemap.xml");
  });

  test("llms.txt and llms-full.txt are served as text", async ({ request }) => {
    const llms = await request.get("/llms.txt");
    expect(llms.status()).toBe(200);
    expect(llms.headers()["content-type"]).toContain("text/plain");
    expect(await llms.text()).toMatch(/^# What is my Name\n\n> /);
    const full = await request.get("/llms-full.txt");
    expect(full.status()).toBe(200);
    expect((await full.text()).length).toBeGreaterThan((await llms.text()).length * 3);
  });

  test("/llm.txt serves the llms.txt file with a canonical link", async ({ request }) => {
    const alias = await request.get("/llm.txt", { maxRedirects: 0 });
    expect(alias.status()).toBe(200);
    expect(alias.headers()["content-type"]).toContain("text/plain");
    expect(alias.headers()["link"]).toBe('<https://whatismyname.org/llms.txt>; rel="canonical"');
    expect(await alias.text()).toBe(await (await request.get("/llms.txt")).text());
  });

  test("pages have .md twins and static .md files stay static", async ({ request }) => {
    for (const [twin, canonical] of [
      ["/index.html.md", "https://whatismyname.org/"],
      ["/platforms/github.md", "https://whatismyname.org/platforms/github"],
      ["/de/blog/how-to-choose-the-perfect-username.md", "https://whatismyname.org/de/blog/how-to-choose-the-perfect-username"],
      ["/zh.md", "https://whatismyname.org/zh"],
    ]) {
      const response = await request.get(twin, { maxRedirects: 0 });
      expect(response.status(), twin).toBe(200);
      expect(response.headers()["content-type"], twin).toBe("text/markdown; charset=utf-8");
      expect(response.headers()["link"], twin).toBe(`<${canonical}>; rel="canonical"`);
      expect(await response.text(), twin).toMatch(/^---\ntitle: ".+"\n/);
    }
    expect((await request.get("/platforms/not-a-platform.md", { maxRedirects: 0 })).status()).toBe(404);

    // A real file under public/ must not be taken over by the twin rewrite.
    const asset = await request.get("/ASSETS_README.md", { maxRedirects: 0 });
    expect(asset.status()).toBe(200);
    expect(await asset.text()).not.toMatch(/^---\ntitle:/);
  });

  test("well-known discovery documents resolve with CORS", async ({ request }) => {
    const catalog = await request.get("/.well-known/api-catalog");
    expect(catalog.status()).toBe(200);
    expect(catalog.headers()["content-type"]).toContain("application/linkset+json");
    expect(catalog.headers()["access-control-allow-origin"]).toBe("*");
    expect((await catalog.json()).linkset[0].anchor).toBe("https://whatismyname.org/mcp");

    const card = await request.get("/.well-known/mcp/server-card.json");
    expect(card.status()).toBe(200);
    expect((await card.json()).transport).toEqual({ type: "streamable-http", endpoint: "https://whatismyname.org/mcp" });

    const index = await (await request.get("/.well-known/agent-skills/index.json")).json();
    const skill = await request.get(index.skills[0].url);
    expect(skill.status()).toBe(200);
    expect(skill.headers()["content-type"]).toContain("text/markdown");
    const digest = createHash("sha256").update(await skill.body()).digest("hex");
    expect(index.skills[0].digest).toBe(`sha256:${digest}`);

    const ard = await request.get("/.well-known/ai-catalog.json");
    expect(ard.status()).toBe(200);
    expect(ard.headers()["access-control-allow-origin"]).toBe("*");
    expect((await ard.json()).entries.length).toBeGreaterThanOrEqual(3);
  });

  test("MCP endpoint speaks stateless Streamable HTTP", async ({ request }) => {
    const init = await request.post("/mcp", {
      headers: MCP_HEADERS,
      data: { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "qa", version: "1" } } },
    });
    expect(init.status()).toBe(200);
    expect((await init.json()).result.serverInfo.name).toBe("whatismyname");

    const notified = await request.post("/mcp", { headers: MCP_HEADERS, data: { jsonrpc: "2.0", method: "notifications/initialized" } });
    expect(notified.status()).toBe(202);

    const tools = await (await request.post("/mcp", { headers: MCP_HEADERS, data: { jsonrpc: "2.0", id: 2, method: "tools/list" } })).json();
    expect(tools.result.tools.map((tool: { name: string }) => tool.name)).toContain("get_platform_guide");

    const call = await (await request.post("/mcp", {
      headers: MCP_HEADERS,
      data: { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_platform_guide", arguments: { slug: "github" } } },
    })).json();
    expect(call.result.structuredContent.guideUrl).toBe("https://whatismyname.org/platforms/github");

    expect((await request.get("/mcp")).status()).toBe(405);
    expect((await request.fetch("/mcp", { method: "OPTIONS" })).status()).toBe(204);
  });

  test("pages negotiate Markdown for agents and stay HTML for browsers", async ({ request }) => {
    for (const path of ["/", "/platforms/github", "/categories/social", "/de/blog/how-to-choose-the-perfect-username", "/zh/tools"]) {
      const markdown = await request.get(path, { headers: { accept: "text/markdown" }, maxRedirects: 0 });
      expect(markdown.status(), path).toBe(200);
      expect(markdown.headers()["content-type"], path).toBe("text/markdown; charset=utf-8");
      expect(markdown.headers()["vary"], path).toContain("Accept");
      expect(await markdown.text(), path).toMatch(/^---\ntitle: ".+"\n/);
    }

    const html = await request.get("/", { headers: { accept: BROWSER_ACCEPT } });
    expect(html.status()).toBe(200);
    expect(html.headers()["content-type"]).toContain("text/html");
    const link = html.headers()["link"];
    expect(link).toContain('rel="alternate"; hreflang="zh"');
    expect(link).toContain('</.well-known/api-catalog>; rel="api-catalog"');
    expect(link).toContain('</llms.txt>; rel="service-doc"');
    expect(link).toContain('</index.html.md>; rel="alternate"; type="text/markdown"');
  });
});

test("home page shows the FAQ and publishes the same questions as FAQPage JSON-LD", async ({ page }) => {
  await page.route("**/adsbygoogle.js*", (route) => route.abort());
  await page.goto("/de");
  const faq = page.locator('section[aria-labelledby="home-faq-title"]');
  await expect(faq.getByRole("heading", { level: 2 })).toHaveText("Häufige Fragen");
  await faq.scrollIntoViewIfNeeded();
  await expect(faq.getByRole("heading", { level: 3 }).first()).toBeVisible();

  const visible = await faq.getByRole("heading", { level: 3 }).allTextContents();
  const published = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent || "{}"))
      .find((schema) => schema["@type"] === "FAQPage")
      ?.mainEntity.map((item: { name: string }) => item.name),
  );
  expect(visible).toHaveLength(7);
  expect(published).toEqual(visible);
});

test("home page registers the WebMCP search tool and runs the page's own search", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const registry: { name: string }[] = [];
    Object.assign(window, { __webmcpTools: registry });
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: {
        registerTool: (tool: { name: string }) => registry.push(tool),
        unregisterTool: (name: string) => registry.splice(registry.findIndex((tool) => tool.name === name), 1),
      },
    });
  });
  await page.route("**/adsbygoogle.js*", (route) => route.abort());
  await page.route("**/api/search/whatsmyname?*", (route) => route.fulfill({
    contentType: "application/x-ndjson",
    body: [
      { total: 2 },
      { source: "Example", username: "example", url: "https://example.com/example", category: "coding", isNSFW: false, checkResult: { status: 200, checkType: "status_code", isExist: true, responseTime: 10 } },
      { source: "Missing", username: "example", url: "https://missing.example/example", category: "social", isNSFW: false, checkResult: { status: 404, checkType: "status_code", isExist: false, responseTime: 10 } },
      { completed: true },
    ].map((line) => JSON.stringify(line)).join("\n") + "\n",
  }));
  await page.route("**/api/search/google?*", (route) => route.fulfill({ json: { items: [], searchInformation: { totalResults: "0", searchTime: 0.01 } } }));

  await page.goto("/");
  await expect.poll(() => page.evaluate(() => (window as unknown as { __webmcpTools: { name: string }[] }).__webmcpTools.map((tool) => tool.name))).toEqual(["search_username"]);

  const output = await page.evaluate(async () => {
    const [tool] = (window as unknown as { __webmcpTools: { execute: (input: unknown) => Promise<{ content: { text: string }[]; isError: boolean }> }[] }).__webmcpTools;
    return tool.execute({ username: "example" });
  });
  const payload = JSON.parse(output.content[0].text);
  expect(output.isError).toBe(false);
  expect(payload).toMatchObject({ username: "example", checked: 2, foundCount: 1 });
  expect(payload.found[0].url).toBe("https://example.com/example");
  await expect(page.getByText("Example", { exact: true }).first()).toBeVisible();

  await page.screenshot({ path: `output/agent-webmcp-${testInfo.project.name}.png` });
  expect(errors).toEqual([]);
});
