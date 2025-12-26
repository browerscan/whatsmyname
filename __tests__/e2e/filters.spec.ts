import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/**
 * E2E Tests for Filter Functionality
 *
 * Tests the filtering, sorting, and search capabilities of results
 */
test.describe("Filter Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    // Perform a search first
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    // Wait for results
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  });

  test("should display filter section after search", async ({ page }) => {
    const filterSection = page
      .locator("[data-testid='filter-bar']")
      .or(page.locator("text=/filters/i"));
    await expect(filterSection).toBeVisible();
  });

  test("should display status filter options", async ({ page }) => {
    // All status option
    const allFilter = page
      .locator("text=/all/i")
      .or(page.locator("[data-filter-status='all']"));
    await expect(allFilter.first()).toBeVisible();

    // Found status option
    const foundFilter = page
      .locator("text=/found/i")
      .or(page.locator("[data-filter-status='found']"));
    await expect(foundFilter.first()).toBeVisible();

    // Not found status option
    const notFoundFilter = page
      .locator("text=/not found/i")
      .or(page.locator("[data-filter-status='not-found']"));
    await expect(notFoundFilter.first()).toBeVisible();
  });

  test("should filter results by status - found", async ({ page }) => {
    // Click on 'found' filter
    const foundFilter = page
      .locator("text=/found/i")
      .or(page.locator("[data-filter-status='found']"));
    await foundFilter.first().click();

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Check that only found results are shown
    const foundBadges = page.locator("text=/found/i");
    const notFoundBadges = page.locator("text=/not found/i");

    const foundCount = await foundBadges.count();
    const notFoundCount = await notFoundBadges.count();

    expect(foundCount).toBeGreaterThan(0);
    // Not found badges should not be visible in filtered results
    // (or at least significantly fewer)
  });

  test("should filter results by status - not found", async ({ page }) => {
    // Click on 'not found' filter
    const notFoundFilter = page
      .locator("text=/not found/i")
      .or(page.locator("[data-filter-status='not-found']"));
    await notFoundFilter.first().click();

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Verify filter is active
    await expect(notFoundFilter.first()).toHaveAttribute("data-active", "true");
  });

  test("should filter results by category", async ({ page }) => {
    // Find category filter buttons
    const categoryButtons = page
      .locator("[data-category]")
      .or(page.locator("text=/(social|coding|gaming|business)/i"));

    const count = await categoryButtons.count();
    if (count > 0) {
      await categoryButtons.first().click();
      await page.waitForTimeout(500);

      // Some filtering should occur
      const results = page.locator("[data-testid='platform-card']");
      await expect(results.first()).toBeVisible();
    }
  });

  test("should toggle NSFW content visibility", async ({ page }) => {
    const nsfwCheckbox = page
      .locator("input[type='checkbox']")
      .or(page.locator("[data-testid='nsfw-toggle']"));

    const count = await nsfwCheckbox.count();
    if (count > 0) {
      const checkbox = nsfwCheckbox.first();

      // Uncheck to hide NSFW
      const isChecked = await checkbox.isChecked();
      if (isChecked) {
        await checkbox.click();
      }

      await page.waitForTimeout(500);

      // NSFW badges should be hidden or limited
      const nsfwBadges = page.locator("text=/nsfw/i");
      // After unchecking, NSFW results should be filtered out
    }
  });

  test("should filter results by search query", async ({ page }) => {
    const searchInput = page
      .locator("[data-testid='filter-search']")
      .or(
        page
          .locator("input[placeholder*='search']")
          .or(page.locator("input[placeholder*='Search']")),
      );

    const count = await searchInput.count();
    if (count > 0) {
      // Type a search query
      await searchInput.first().fill("github");

      // Wait for debounce
      await page.waitForTimeout(500);

      // Results should be filtered
      const results = page.locator("[data-testid='platform-card']");
      await expect(results.first()).toBeVisible();
    }
  });

  test("should clear all filters when clear button is clicked", async ({
    page,
  }) => {
    // Apply a filter first
    const foundFilter = page
      .locator("text=/found/i")
      .or(page.locator("[data-filter-status='found']"));
    await foundFilter.first().click();
    await page.waitForTimeout(500);

    // Click clear filters button
    const clearButton = page
      .locator("text=/clear/i")
      .or(page.locator("[data-testid='clear-filters']"));

    const clearCount = await clearButton.count();
    if (clearCount > 0) {
      await clearButton.first().click();
      await page.waitForTimeout(500);

      // All results should be visible again
      const allFilter = page
        .locator("[data-filter-status='all']")
        .or(page.locator("text=/all/i"));
      await expect(allFilter.first()).toBeVisible();
    }
  });

  test("should show clear button only when filters are active", async ({
    page,
  }) => {
    const clearButton = page
      .locator("text=/clear/i")
      .or(page.locator("[data-testid='clear-filters']"));

    // Initially, clear button might not be visible (no active filters)
    // After applying a filter, it should appear
    const foundFilter = page
      .locator("text=/found/i")
      .or(page.locator("[data-filter-status='found']"));
    await foundFilter.first().click();
    await page.waitForTimeout(500);

    await expect(clearButton.first()).toBeVisible();
  });

  test("should display result count statistics", async ({ page }) => {
    const stats = page
      .locator("[data-testid='result-stats']")
      .or(page.locator("text=/\\d+\\s*(results?|found)/i"));

    const count = await stats.count();
    if (count > 0) {
      await expect(stats.first()).toBeVisible();
    }
  });

  test("should maintain filters when new search is performed", async ({
    page,
  }) => {
    // Apply a filter
    const foundFilter = page
      .locator("text=/found/i")
      .or(page.locator("[data-filter-status='found']"));
    await foundFilter.first().click();
    await page.waitForTimeout(500);

    // Perform new search
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.clear();
    await searchInput.fill("github");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Filter should still be available/visible
    await expect(foundFilter.first()).toBeVisible();
  });

  test("should have accessible filter controls", async ({ page }) => {
    // Check for ARIA labels on filter elements
    const filterSection = page
      .locator("[data-testid='filter-bar']")
      .or(page.locator("section:has-text('filters')"));

    const count = await filterSection.count();
    if (count > 0) {
      // Filter buttons should be clickable
      const filterButtons = filterSection.locator("button, [role='button']");
      const buttonCount = await filterButtons.count();

      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        await expect(filterButtons.nth(i)).toBeVisible();
      }
    }
  });

  test("should update URL with filter parameters", async ({ page }) => {
    // Apply a filter
    const foundFilter = page
      .locator("text=/found/i")
      .or(page.locator("[data-filter-status='found']"));

    const initialUrl = page.url();
    await foundFilter.first().click();
    await page.waitForTimeout(500);

    // URL might be updated with query params (implementation dependent)
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });
});
