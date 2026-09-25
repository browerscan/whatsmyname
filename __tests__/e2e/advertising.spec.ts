import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

const adUrl = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7152359349184850";

test("serves authorized sellers without a locale redirect", async ({ request }) => {
  const response = await request.get("/ads.txt", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect(await response.text()).toBe(readFileSync("public/ads.txt", "utf8"));
});

for (const path of ["/", "/privacy", "/zh/privacy", "/tools", "/terms", "/categories", "/platforms/discord"]) {
  test("AdSense is in the original head and unique on " + path, async ({ page }) => {
    await page.route("**/adsbygoogle.js*", (route) => route.fulfill({
      contentType: "application/javascript", body: "window.adsenseTestLoaded = true;",
    }));
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const responseHtml = await response!.text();
    const head = responseHtml.split("</head>")[0];
    expect(head).toContain(adUrl);
    expect(head).toContain("<title>");
    expect(head).toContain('rel="canonical"');
    const initialTitle = await page.evaluate((html) => new DOMParser().parseFromString(html, "text/html").title, responseHtml);
    await expect(page).toHaveTitle(initialTitle);
    const script = page.locator('head script[src*="adsbygoogle.js"]');
    await expect(script).toHaveCount(1);
    await expect(script).toHaveAttribute("src", adUrl);
    await expect(script).toHaveAttribute("async", "");
    await expect(script).toHaveAttribute("crossorigin", "anonymous");
    await expect(page.locator('script[src*="/tag/js/gpt.js"]')).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (path.includes("privacy")) await expect(page.locator("main")).toContainText("Google AdSense");
    if (path === "/tools") {
      await expect(page.locator('a[href*="/tools/username-"]')).toHaveCount(0);
      await expect(page.locator("main")).not.toContainText(/coming soon/i);
      await expect(page).toHaveTitle(/Username Search Tools/);
    }
    if (path === "/") {
      await expect(page.locator("#lookup-guide-title")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).not.toContainText("86%");
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      const parsed = schemas.map((json) => JSON.parse(json));
      expect(parsed.some((schema) => schema["@type"] === "FAQPage")).toBe(false);
      expect(parsed.find((schema) => schema["@type"] === "WebSite").potentialAction).toBeUndefined();
      expect(parsed.find((schema) => schema["@type"] === "Organization").sameAs).toBeUndefined();
    }
    if (errors.length) {
      await test.info().attach("response.html", { body: responseHtml, contentType: "text/html" });
      await test.info().attach("dom.html", { body: await page.content(), contentType: "text/html" });
    }
    expect(errors).toEqual([]);
  });
}

test("search stays usable with the advertising library blocked", async ({ page }) => {
  await page.route("**/adsbygoogle.js*", (route) => route.abort());
  const response = await page.goto("/");
  expect(await response!.text()).toContain("Ctrl / ⌘ + K");
  const input = page.getByRole("textbox", { name: /username/i });
  await input.fill("example");
  await expect(input).toHaveValue("example");
  await input.blur();
  await page.keyboard.press("Control+k");
  await expect(input).toBeFocused();
  await input.blur();
  await page.keyboard.press("Meta+k");
  await expect(input).toBeFocused();
});

for (const hasMatch of [true, false]) {
  test(`search handles matches=${hasMatch} and excludes restricted results`, async ({ page }) => {
    await page.route("**/adsbygoogle.js*", (route) => route.abort());
    const safe = {
      source: "AuditSafePlatform", username: "example", url: "https://example.com/example",
      category: "coding", isNSFW: false,
      checkResult: { status: hasMatch ? 200 : 404, checkType: "status_code", isExist: hasMatch, responseTime: 10 },
    };
    await page.route("**/api/search/whatsmyname?*", (route) => route.fulfill({
      contentType: "application/x-ndjson",
      body: [{ total: 2 }, safe, { ...safe, source: "AuditRestrictedPlatform", isNSFW: true }, { completed: true }]
        .map((row) => JSON.stringify(row)).join("\n") + "\n",
    }));
    await page.route("**/api/search/google?*", (route) => route.fulfill({
      json: { items: [], searchInformation: { totalResults: "0", searchTime: 0.01 } },
    }));
    await page.goto("/");
    await page.getByRole("textbox", { name: /username/i }).fill("example");
    await page.getByRole("button", { name: /search for username/i }).click();
    await expect(page.getByText("AuditSafePlatform", { exact: true })).toBeVisible();
    await expect(page.getByText("AuditRestrictedPlatform")).toHaveCount(0);
    await expect(page.getByText("Show NSFW", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /search for username/i })).toBeEnabled();
  });
}

test("shows usable web results and an honest warning when platform checks fail", async ({ page }) => {
  await page.route("**/adsbygoogle.js*", (route) => route.abort());
  await page.route("**/api/search/whatsmyname?*", (route) => route.fulfill({ status: 521, json: { error: "Upstream unavailable" } }));
  await page.route("**/api/search/google?*", (route) => route.fulfill({ json: {
    items: [{ title: "Recovered Web Match", link: "https://example.com/profile", displayLink: "example.com", snippet: "Public web result" }],
    searchInformation: { totalResults: "1", searchTime: 0.1 },
  } }));
  await page.goto("/");
  await page.getByRole("textbox", { name: /username/i }).fill("example");
  await page.getByRole("button", { name: /search for username/i }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("temporarily unavailable");
  await expect(page.getByText("Recovered Web Match", { exact: true })).toBeVisible();
});

test.describe("first render", () => {
  test.use({ javaScriptEnabled: false });
  test("shows the shortcut and publisher before application JavaScript", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("kbd").filter({ hasText: "Ctrl / ⌘ + K" })).toBeVisible();
    await expect(page.locator('head script[src*="adsbygoogle.js"]')).toHaveAttribute("src", adUrl);
  });
});
