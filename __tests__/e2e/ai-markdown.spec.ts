import { test, expect } from "@playwright/test";

const markdown = [
  "## Actionable Next Steps", "", "- **Check** `brandname`", "- Review results", "", "---", "",
  "| Category | What to Evaluate |", "| --- | --- |", "| Name | Availability |", "",
  "```text", "a".repeat(180), "```", "",
  "[Safe link](https://example.com)", "[Unsafe link](javascript:alert%281%29)", "",
  '<img src="x" onerror="alert(1)">',
].join("\n");

async function openAI(page: import("@playwright/test").Page) {
  await page.route("**/adsbygoogle.js*", route => route.abort());
  await page.route("**/api/search/whatsmyname?*", route => route.fulfill({
    contentType: "application/x-ndjson",
    body: [{ total: 1 }, { source: "Example", username: "example", url: "https://example.com/example", category: "coding", isNSFW: false, checkResult: { status: 200, checkType: "status_code", isExist: true, responseTime: 10 } }, { completed: true }].map(x => JSON.stringify(x)).join("\n") + "\n",
  }));
  await page.route("**/api/search/google?*", route => route.fulfill({ json: { items: [], searchInformation: { totalResults: "0", searchTime: 0.01 } } }));
  await page.goto("/");
  await page.getByRole("textbox", { name: /username/i }).fill("example");
  await page.getByRole("button", { name: /search for username/i }).click();
  const ai = page.locator('button[aria-label]').filter({ has: page.locator('svg.lucide-sparkles') });
  await expect(ai).toBeEnabled();
  await ai.click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

for (const theme of ["dark", "light"]) {
  test(`renders Markdown safely in ${theme} theme`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(value => localStorage.setItem("theme", value), theme);
    await page.route("**/api/ai/analyze", route => route.fulfill({
      contentType: "text/event-stream",
      body: markdown.match(/[\s\S]{1,60}/g)!.map(content => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`).join("") + "data: [DONE]\n\n",
    }));
    await openAI(page);
    const dialog = page.getByRole("dialog");
    await dialog.locator(".cursor-pointer").first().click();
    await expect(dialog.getByRole("heading", { name: "Actionable Next Steps" }).last()).toBeVisible();
    await expect(dialog.getByRole("table").last()).toContainText("Availability");
    await expect(dialog.getByRole("link", { name: "Safe link" }).last()).toHaveAttribute("rel", "noopener noreferrer");
    await expect(dialog.getByRole("link", { name: "Unsafe link" })).toHaveCount(0);
    await expect(dialog.locator("img, script")).toHaveCount(0);
    await expect(dialog.locator("input")).toBeEnabled();
    await dialog.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
    const dimensions = await dialog.evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth, left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, viewport: innerWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
    expect(dimensions.left).toBeGreaterThanOrEqual(0);
    expect(dimensions.right).toBeLessThanOrEqual(dimensions.viewport);
    expect(errors).toEqual([]);
    await dialog.getByRole("heading").last().scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`${theme}.png`) });
  });
}

test("shows AI error and re-enables input", async ({ page }) => {
  await page.route("**/api/ai/analyze", route => route.fulfill({ status: 503, json: { error: "Unavailable" } }));
  await openAI(page);
  const dialog = page.getByRole("dialog");
  await dialog.locator(".cursor-pointer").first().click();
  await expect(dialog.locator(".text-destructive")).toBeVisible();
  await expect(dialog.locator("input")).toBeEnabled();
});


test("real production AI response renders as elements", async ({ page }, testInfo) => {
  test.skip(!process.env.MARKDOWN_QA_REAL || testInfo.project.name !== "desktop", "Production-only real AI check");
  test.setTimeout(150000);
  await openAI(page);
  const dialog = page.getByRole("dialog");
  const response = page.waitForResponse(r => r.url().includes("/api/ai/analyze"), { timeout: 90000 });
  await dialog.locator(".cursor-pointer").first().click();
  expect((await response).status()).toBe(200);
  await expect(dialog.locator("input")).toBeEnabled({ timeout: 120000 });
  await expect(dialog.locator(".text-destructive")).toHaveCount(0);
  const rendered = dialog.locator(".min-w-0.text-\\[15px\\]").last();
  await expect(rendered).toBeVisible();
  expect((await rendered.innerText()).length).toBeGreaterThan(40);
  expect(await rendered.locator("p, h1, h2, h3, ul, ol, table").count()).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath("real-ai.png") });
});
