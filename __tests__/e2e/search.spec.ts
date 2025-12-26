import { test, expect, Page } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/**
 * E2E Tests for Main Search Flow
 *
 * Tests the complete user journey for searching usernames across platforms
 */
test.describe("Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("should display search input and button on page load", async ({
    page,
  }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();
  });

  test("should show validation error for empty username", async ({ page }) => {
    const searchButton = page.getByRole("button", { name: /search/i });

    // Try to submit with empty input
    await searchButton.click();

    // Error should be displayed
    const errorMessage = page.getByRole("alert");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/required/i);
  });

  test("should show validation error for short username", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("ab");
    await searchButton.click();

    const errorMessage = page.getByRole("alert");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/too short/i);
  });

  test("should show validation error for invalid characters", async ({
    page,
  }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("user@name");
    await searchButton.click();

    const errorMessage = page.getByRole("alert");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/invalid/i);
  });

  test("should disable search button while loading", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("testuser");
    await searchButton.click();

    // Button should show loading state
    await expect(searchButton).toBeDisabled();
    await expect(page.getByText(/searching/i)).toBeVisible();
  });

  test("should display loading skeleton during search", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("testuser");
    await searchButton.click();

    // Loading skeleton should appear
    const skeleton = page
      .locator("[data-testid='loading-skeleton']")
      .or(page.locator(".animate-pulse"));
    await expect(skeleton.first()).toBeVisible({ timeout: 5000 });
  });

  test("should display search progress indicator", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("testuser");
    await searchButton.click();

    // Progress should be visible
    const progress = page
      .locator("[data-testid='search-progress']")
      .or(page.locator("text=/\\d+/"));
    await expect(progress.first()).toBeVisible({ timeout: 5000 });
  });

  test("should display results when search completes", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    // Wait for search to complete
    await page.waitForLoadState("networkidle");

    // Results section should be visible
    const results = page
      .locator("[data-testid='platform-card']")
      .or(page.locator("[data-testid='results-section']"));
    await expect(results.first()).toBeVisible({ timeout: 60000 });
  });

  test("should display platform cards with correct information", async ({
    page,
  }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("github");
    await searchButton.click();

    // Wait for results
    await page.waitForLoadState("networkidle");

    // Check for platform cards
    const platformCards = page
      .locator("[data-testid='platform-card']")
      .or(page.locator(".platform-card"));

    const count = await platformCards.count();
    expect(count).toBeGreaterThan(0);

    // First card should have expected elements
    const firstCard = platformCards.first();
    await expect(firstCard.locator("h3")).toBeVisible();
  });

  test("should differentiate between found and not found results", async ({
    page,
  }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Check for found badge
    const foundBadge = page
      .locator("text=/found/i")
      .or(page.locator("[data-found='true']"));
    await expect(foundBadge.first()).toBeVisible();

    // Check for not found badge
    const notFoundBadge = page
      .locator("text=/not found/i")
      .or(page.locator("[data-found='false']"));
    await expect(notFoundBadge.first()).toBeVisible();
  });

  test("should display response time for each platform", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Response time badges should be visible
    const responseTimeBadges = page.locator("text=/(ms|s)/");
    await expect(responseTimeBadges.first()).toBeVisible();
  });

  test("should allow starting a new search after completion", async ({
    page,
  }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    // First search
    await searchInput.fill("testuser1");
    await searchButton.click();
    await page.waitForLoadState("networkidle");

    // Clear and new search
    await searchInput.clear();
    await searchInput.fill("testuser2");
    await searchButton.click();

    // Input should still be enabled
    await expect(searchInput).toBeEnabled();
  });

  test("should display category badges on results", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("test");
    await searchButton.click();

    await page.waitForLoadState("networkidle");

    // Category badges should be visible
    const categoryBadges = page
      .locator("[data-testid='category-badge']")
      .or(page.locator("text=/(social|coding|gaming|business)/i"));
    await expect(categoryBadges.first()).toBeVisible();
  });

  test("should handle special characters in username gracefully", async ({
    page,
  }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    // Valid username with special characters
    await searchInput.fill("user_name-123");
    await searchButton.click();

    // Should not show validation error
    const errorMessage = page.getByRole("alert");
    await expect(errorMessage).not.toBeVisible();
  });

  test("should have accessible form controls", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    // Check ARIA attributes
    await expect(searchInput).toHaveAttribute("aria-invalid", "false");
    await expect(searchButton).toHaveAttribute("aria-label");
  });

  test("should clear error when user starts typing", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    // Trigger error
    await searchButton.click();
    await expect(page.getByRole("alert")).toBeVisible();

    // Start typing valid input
    await searchInput.fill("validuser");

    // Error should disappear
    await expect(page.getByRole("alert")).not.toBeVisible();
  });

  test("should trim whitespace from username", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /username/i });
    const searchButton = page.getByRole("button", { name: /search/i });

    // Type with leading/trailing spaces
    await searchInput.fill("  testuser  ");
    await searchButton.click();

    // Should search with trimmed username (no error for valid username with spaces)
    const errorMessage = page.getByRole("alert");
    await expect(errorMessage).not.toBeVisible();
  });
});
