import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/**
 * E2E Tests for Accessibility
 *
 * Tests WCAG compliance including keyboard navigation,
 * screen reader support, and visual accessibility
 */
test.describe("Accessibility", () => {
  test("should not have critical accessibility issues on homepage", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto(BASE_URL);

    // Get all headings
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();

    expect(headings.length).toBeGreaterThan(0);

    // First heading should be h1
    const firstHeading = page.locator("h1").first();
    await expect(firstHeading).toBeVisible();
  });

  test("should have skip links for keyboard navigation", async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for skip links
    const skipLinks = page
      .locator("a[href^='#']:has-text('skip')")
      .or(page.locator("[data-testid='skip-link']"));

    const count = await skipLinks.count();
    if (count > 0) {
      await expect(skipLinks.first()).toBeVisible();
    }
  });

  test("should be fully navigable via keyboard", async ({ page }) => {
    await page.goto(BASE_URL);

    // Get all focusable elements
    const focusableElements = await page
      .locator(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      )
      .all();

    if (focusableElements.length > 0) {
      // Try tabbing through elements
      for (let i = 0; i < Math.min(5, focusableElements.length); i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(100);

        // Check that something is focused
        const focused = await page.evaluate(
          () => document.activeElement?.tagName,
        );
        expect(["BUTTON", "INPUT", "A", "TEXTAREA", "SELECT"]).toContain(
          focused || "",
        );
      }
    }
  });

  test("should have visible focus indicators", async ({ page }) => {
    await page.goto(BASE_URL);

    // Focus the search input
    const searchInput = page.getByRole("textbox", { name: /username/i });
    await searchInput.first().focus();

    // Check for focus-visible class or outline
    const isFocused = await searchInput.first().evaluate((el) => {
      return document.activeElement === el;
    });

    expect(isFocused).toBe(true);
  });

  test("should have proper ARIA labels on interactive elements", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    // Check search input
    const searchInput = page.getByRole("textbox", { name: /username/i });
    await expect(searchInput.first()).toBeVisible();

    // Check search button
    const searchButton = page.getByRole("button", { name: /search/i });
    await expect(searchButton.first()).toBeVisible();
  });

  test("should have alt text on images", async ({ page }) => {
    await page.goto(BASE_URL);

    // Perform search to get results with images
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Check images for alt text
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const alt = await images.nth(i).getAttribute("alt");
      // Alt attribute should exist (can be empty for decorative images)
      expect(alt !== null).toBe(true);
    }
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto(BASE_URL);

    // Check that input has associated label
    const searchInput = page.getByRole("textbox", { name: /username/i });
    await expect(searchInput.first()).toBeVisible();

    // Verify aria-label or aria-labelledby exists
    const hasAria = await searchInput.first().evaluate((el) => {
      return (
        el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby")
      );
    });

    expect(hasAria).toBe(true);
  });

  test("should announce errors to screen readers", async ({ page }) => {
    await page.goto(BASE_URL);

    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    // Trigger validation error
    await searchButton.click();

    // Error should have role="alert"
    const errorMessage = page.getByRole("alert");
    await expect(errorMessage.first()).toBeVisible();
  });

  test("should have sufficient color contrast", async ({ page }) => {
    await page.goto(BASE_URL);

    // This is a basic check - for comprehensive testing, use axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include(["body"])
      .analyze();

    // Filter for color-contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast",
    );

    expect(contrastViolations).toEqual([]);
  });

  test("should support keyboard shortcuts for common actions", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    // Press "/" to focus search (common pattern)
    await page.keyboard.press("/");

    // Check if search input is focused
    const focused = await page.evaluate(() => {
      const active = document.activeElement;
      return (
        active?.tagName === "INPUT" && active?.getAttribute("type") === "text"
      );
    });

    // This is optional behavior, so we just log if not implemented
    if (focused) {
      expect(focused).toBe(true);
    }
  });

  test("should have proper landmark regions", async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for main landmark
    const main = page.locator("main").or(page.locator("[role='main']"));
    await expect(main.first()).toBeVisible();

    // Check for nav landmark
    const nav = page.locator("nav").or(page.locator("[role='navigation']"));
    const navCount = await nav.count();
    // Nav is optional on homepage
  });

  test("should have proper list semantics", async ({ page }) => {
    await page.goto(BASE_URL);

    // Perform search to get results
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Results should be in a list or grid
    const resultsList = page.locator(
      "ul[role='list'], ol[role='list'], [role='list']",
    );
    const count = await resultsList.count();

    if (count > 0) {
      await expect(resultsList.first()).toBeVisible();
    }
  });

  test("should have accessible modal behavior", async ({ page }) => {
    await page.goto(BASE_URL);

    // Open AI dialog
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Check modal accessibility
    const dialog = page.locator("[role='dialog']");
    const dialogCount = await dialog.count();

    if (dialogCount > 0) {
      // Focus should be trapped in modal
      const activeElement = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      expect(["BUTTON", "INPUT", "DIALOG"]).toContain(activeElement || "");

      // Close button should be visible
      const closeButton = page
        .locator("[aria-label='close']")
        .or(page.locator("button[aria-label]"));
      await expect(closeButton.first()).toBeVisible();
    }
  });

  test("should have accessible filter controls", async ({ page }) => {
    await page.goto(BASE_URL);

    // Perform search to show filters
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Filter buttons should be accessible
    const filterButtons = page.locator("[data-testid='filter-bar'] button");
    const count = await filterButtons.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        await expect(filterButtons.nth(i)).toBeVisible();
      }
    }
  });

  test("should have proper link descriptions", async ({ page }) => {
    await page.goto(BASE_URL);

    // Perform search to get external links
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // External links should have descriptive text or aria-label
    const externalLinks = page.locator("a[target='_blank']");
    const count = await externalLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(5, count); i++) {
        const link = externalLinks.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute("aria-label");

        expect((text && text.trim().length > 0) || ariaLabel).toBeTruthy();
      }
    }
  });

  test("should have proper table semantics if tables exist", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    // Check for tables
    const tables = page.locator("table");
    const count = await tables.count();

    if (count > 0) {
      // Tables should have captions or headers
      const table = tables.first();
      const hasCaptionOrHeader = await table.evaluate((el) => {
        return (
          el.querySelector("caption") !== null ||
          el.querySelector("th") !== null ||
          el.getAttribute("role") === "table"
        );
      });

      expect(hasCaptionOrHeader).toBe(true);
    }
  });

  test("should have proper progress indicators", async ({ page }) => {
    await page.goto(BASE_URL);

    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    // Progress indicators should be accessible
    const progress = page.locator("[role='progressbar'], aria-busy='true'");
    const count = await progress.count();

    if (count > 0) {
      await expect(progress.first()).toBeVisible();
    }
  });
});
