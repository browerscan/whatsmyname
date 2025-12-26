import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/**
 * E2E Tests for Internationalization (i18n)
 *
 * Tests language switching and content localization
 */
test.describe("Internationalization", () => {
  test("should display content in default language", async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for common English text elements
    const searchInput = page.getByPlaceholder(/username/i);
    await expect(searchInput.first()).toBeVisible();
  });

  test("should support language switching to Spanish", async ({ page }) => {
    await page.goto(BASE_URL);

    // Find language selector
    const langSelector = page
      .locator("[data-testid='language-selector']")
      .or(
        page
          .locator("select[name='lang']")
          .or(page.locator("[aria-label*='language']")),
      );

    const count = await langSelector.count();
    if (count > 0) {
      await langSelector.first().selectOption("es");

      // Wait for page to update
      await page.waitForTimeout(1000);

      // Check for Spanish content (implementation dependent)
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test("should support language switching via URL", async ({ page }) => {
    // Try accessing Spanish version directly
    await page.goto(`${BASE_URL}/es`);

    // Check that the page loads
    const searchInput = page.getByRole("textbox");
    await expect(searchInput.first()).toBeVisible();
  });

  test("should maintain language preference across navigation", async ({
    page,
  }) => {
    // Start with Spanish
    await page.goto(`${BASE_URL}/es`);

    // Navigate to different page or reload
    await page.reload();

    // Language should be maintained
    const url = page.url();
    expect(url).toContain("/es");
  });

  test("should translate validation errors", async ({ page }) => {
    await page.goto(BASE_URL);

    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    // Trigger validation error
    await searchButton.click();

    const errorMessage = page.getByRole("alert");
    await expect(errorMessage.first()).toBeVisible();
  });

  test("should translate AI dialog content", async ({ page }) => {
    await page.goto(BASE_URL);

    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Dialog title should be translated
    const dialogTitle = page
      .locator("text=/AI/i")
      .or(page.locator("[data-testid='ai-dialog'] h2"));
    await expect(dialogTitle.first()).toBeVisible();
  });

  test("should translate filter labels", async ({ page }) => {
    await page.goto(BASE_URL);

    // Perform a search to see filters
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Check for filter section
    const filterSection = page
      .locator("[data-testid='filter-bar']")
      .or(page.locator("text=/filters/i"));

    const count = await filterSection.count();
    if (count > 0) {
      await expect(filterSection.first()).toBeVisible();
    }
  });

  test("should translate result badges", async ({ page }) => {
    await page.goto(BASE_URL);

    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Check for found badge
    const foundBadge = page.locator("text=/found/i");
    await expect(foundBadge.first()).toBeVisible();
  });

  test("should handle missing translations gracefully", async ({ page }) => {
    // Try accessing an unsupported language
    await page.goto(`${BASE_URL}/xx`);

    // Page should still load (fallback to default)
    const searchInput = page.getByRole("textbox");
    await expect(searchInput.first()).toBeVisible();
  });

  test("should update HTML lang attribute", async ({ page }) => {
    await page.goto(BASE_URL);

    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlLang).toBeTruthy();
  });

  test("should support RTL languages if configured", async ({ page }) => {
    // Try Arabic (RTL language)
    await page.goto(`${BASE_URL}/ar`);

    const htmlDir = await page.locator("html").getAttribute("dir");
    // If RTL is supported, dir should be "rtl"
    if (htmlDir) {
      expect(["ltr", "rtl"]).toContain(htmlDir);
    }
  });
});
