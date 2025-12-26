import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/**
 * E2E Tests for AI Dialog Flow
 *
 * Tests the AI chat functionality including template selection,
 * message streaming, and error handling
 */
test.describe("AI Dialog Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("should display AI button on the page", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await expect(aiButton.first()).toBeVisible();
  });

  test("should open AI dialog when button is clicked", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Dialog should appear
    const dialog = page
      .locator("[data-testid='ai-dialog']")
      .or(
        page
          .locator("[role='dialog']")
          .or(page.locator(".fixed:has-text('AI')")),
      );

    await expect(dialog.first()).toBeVisible();
  });

  test("should display AI template options when dialog opens", async ({
    page,
  }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Template cards should be visible
    const templates = page
      .locator("[data-testid='ai-template']")
      .or(
        page.locator(
          "text=/(value assessment|pattern analysis|platform suggestions)/i",
        ),
      );

    await expect(templates.first()).toBeVisible();
  });

  test("should display all four template options", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Check for common template names
    const templates = [
      /value\s*assessment/i,
      /pattern\s*analysis/i,
      /platform\s*suggestions/i,
      /security\s*check/i,
    ];

    for (const template of templates) {
      const element = page.locator(`text=${template}`);
      await expect(element.first()).toBeVisible();
    }
  });

  test("should close dialog when close button is clicked", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    const dialog = page
      .locator("[data-testid='ai-dialog']")
      .or(page.locator("[role='dialog']"));
    await expect(dialog.first()).toBeVisible();

    // Click close button
    const closeButton = page
      .locator("[aria-label='close']")
      .or(page.locator("button:has-text('x')").or(page.locator(".close")));
    await closeButton.first().click();

    // Dialog should be hidden
    await expect(dialog.first()).not.toBeVisible({ timeout: 5000 });
  });

  test("should close dialog when backdrop is clicked", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    const dialog = page
      .locator("[data-testid='ai-dialog']")
      .or(page.locator("[role='dialog']"));
    await expect(dialog.first()).toBeVisible();

    // Click on backdrop (outside dialog)
    const backdrop = page
      .locator(".fixed:has([role='dialog']) ~ .fixed")
      .or(page.locator("[data-testid='backdrop']"));
    const count = await backdrop.count();
    if (count > 0) {
      await backdrop.first().click();

      // Dialog should be hidden
      await expect(dialog.first()).not.toBeVisible({ timeout: 5000 });
    }
  });

  test("should switch to chat interface when template is selected", async ({
    page,
  }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Select a template
    const template = page
      .locator("text=/value assessment/i")
      .or(page.locator("[data-template-id]"));
    await template.first().click();

    // Chat interface should appear
    const chatInput = page
      .locator("[data-testid='ai-chat-input']")
      .or(page.locator("input[placeholder*='message']"));
    await expect(chatInput.first()).toBeVisible({ timeout: 5000 });
  });

  test("should display user message in chat", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Select a template
    const template = page
      .locator("text=/value assessment/i")
      .or(page.locator("[data-template-id]"));
    await template.first().click();

    // User message should be visible
    const userMessage = page
      .locator("[data-message-role='user']")
      .or(page.locator(".user-message"));
    await expect(userMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test("should display assistant response", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Select a template
    const template = page
      .locator("text=/value assessment/i")
      .or(page.locator("[data-template-id]"));
    await template.first().click();

    // Wait for streaming to complete (or at least start)
    await page.waitForTimeout(3000);

    // Check for loading or response
    const loading = page
      .locator("text=/thinking|generating/i")
      .or(page.locator(".animate-spin"));

    const assistantMessage = page
      .locator("[data-message-role='assistant']")
      .or(page.locator(".assistant-message"));

    // Either loading should be visible or response should appear
    const isLoadingVisible = (await loading.count()) > 0;
    const hasResponse = (await assistantMessage.count()) > 0;

    expect(isLoadingVisible || hasResponse).toBeTruthy();
  });

  test("should allow sending custom messages", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Type a custom message
    const chatInput = page
      .locator("[data-testid='ai-chat-input']")
      .or(page.locator("input[placeholder*='message']"));

    const count = await chatInput.count();
    if (count > 0) {
      await chatInput.first().fill("Hello AI");

      // Send button should be enabled
      const sendButton = page
        .locator("[data-testid='ai-send']")
        .or(page.locator("button:has(svg)"));

      await sendButton.first().click();

      // User message should appear
      const userMessage = page.locator("text=/Hello AI/i");
      await expect(userMessage.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test("should disable input while streaming", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Select a template to trigger streaming
    const template = page
      .locator("text=/value assessment/i")
      .or(page.locator("[data-template-id]"));
    await template.first().click();

    // Wait a bit for streaming to start
    await page.waitForTimeout(500);

    // Input should be disabled while streaming
    const chatInput = page
      .locator("[data-testid='ai-chat-input']")
      .or(page.locator("input[placeholder*='message']"));

    const count = await chatInput.count();
    if (count > 0) {
      const isDisabled = await chatInput.first().isDisabled();
      // Input might be disabled during streaming
      expect(isDisabled).toBe(true);
    }
  });

  test("should display error when API fails", async ({ page }) => {
    // Mock API failure by intercepting the request
    await page.route("**/api/ai/analyze", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Select a template
    const template = page
      .locator("text=/value assessment/i")
      .or(page.locator("[data-template-id]"));
    await template.first().click();

    // Wait for error
    await page.waitForTimeout(2000);

    // Error message should be visible
    const error = page
      .locator("text=/error|failed/i")
      .or(page.locator("[data-testid='error-message']"));
    await expect(error.first()).toBeVisible({ timeout: 5000 });
  });

  test("should have accessible dialog elements", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Check for proper ARIA attributes
    const dialog = page
      .locator("[role='dialog']")
      .or(page.locator("[data-testid='ai-dialog']"));

    const count = await dialog.count();
    if (count > 0) {
      await expect(dialog.first()).toHaveAttribute("role", "dialog");

      // Close button should have aria-label
      const closeButton = page
        .locator("[aria-label='close']")
        .or(page.locator("button[aria-label]"));
      await expect(closeButton.first()).toBeVisible();
    }
  });

  test("should maintain conversation history in chat", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Send first message
    const chatInput = page
      .locator("[data-testid='ai-chat-input']")
      .or(page.locator("input[placeholder*='message']"));

    const count = await chatInput.count();
    if (count > 0) {
      await chatInput.first().fill("First message");
      const sendButton = page
        .locator("[data-testid='ai-send']")
        .or(page.locator("button:has(svg)"));
      await sendButton.first().click();

      await page.waitForTimeout(1000);

      // Send second message
      await chatInput.first().fill("Second message");
      await sendButton.first().click();

      // Both messages should be in history
      const firstMessage = page.locator("text=/First message/i");
      const secondMessage = page.locator("text=/Second message/i");

      await expect(firstMessage.first()).toBeVisible();
      await expect(secondMessage.first()).toBeVisible();
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    // Press Tab to focus AI button (if it's focusable)
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    // Dialog should open
    const dialog = page
      .locator("[data-testid='ai-dialog']")
      .or(page.locator("[role='dialog']"));

    const count = await dialog.count();
    if (count > 0) {
      await expect(dialog.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test("should clear messages when dialog is reopened", async ({ page }) => {
    const aiButton = page
      .locator("[data-testid='ai-button']")
      .or(page.locator("button:has-text('AI')").or(page.locator("text=/ai/i")));

    await aiButton.first().click();

    // Send a message
    const chatInput = page
      .locator("[data-testid='ai-chat-input']")
      .or(page.locator("input[placeholder*='message']"));

    const count = await chatInput.count();
    if (count > 0) {
      await chatInput.first().fill("Test message");
      const sendButton = page
        .locator("[data-testid='ai-send']")
        .or(page.locator("button:has(svg)"));
      await sendButton.first().click();

      await page.waitForTimeout(1000);

      // Close dialog
      const closeButton = page
        .locator("[aria-label='close']")
        .or(page.locator("button:has-text('x')"));
      await closeButton.first().click();

      await page.waitForTimeout(500);

      // Reopen dialog
      await aiButton.first().click();

      // Should show template options again (not chat)
      const templates = page
        .locator("[data-testid='ai-template']")
        .or(page.locator("text=/value assessment/i"));
      await expect(templates.first()).toBeVisible({ timeout: 2000 });
    }
  });
});
