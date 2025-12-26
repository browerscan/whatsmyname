import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/features/SearchBar";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      "search.input": {
        placeholder: "Enter username to search...",
        aria_label: "Username input",
        error_required: "Username is required",
        error_too_short: "Username must be at least 3 characters",
        error_too_long: "Username must be less than 30 characters",
        error_invalid_chars: "Username contains invalid characters",
        error_invalid: "Invalid username",
      },
      "search.button": {
        aria_label: "Search for username",
        submit: "Search",
        searching: "Searching...",
      },
      search: {
        hint: "Enter a username to search across platforms",
      },
      shortcuts: {
        to_focus: "to focus",
      },
    };
    return (key: string) => {
      return translations[namespace]?.[key] || key;
    };
  },
}));

/**
 * Component Integration Tests for SearchBar
 *
 * Tests the SearchBar component behavior and interactions
 */
describe("SearchBar Component", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it("should render search input and button", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    expect(input).toBeVisible();
    expect(input).toHaveAttribute("placeholder");
    expect(button).toBeVisible();
  });

  it("should call onSearch with trimmed username when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    await user.type(input, "  testuser  ");
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith("testuser");
  });

  it("should disable button when input is empty", async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeDisabled();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("should show too short error for short username", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "ab{Enter}");

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeVisible();
    expect(errorMessage).toHaveTextContent(/at least 3 characters/i);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("should show invalid characters error for invalid username", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "user@name{Enter}");

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toBeVisible();
    expect(errorMessage).toHaveTextContent(/invalid/i);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("should clear error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");

    // First trigger an error by typing too short and submitting
    await user.type(input, "ab{Enter}");

    // Error should be visible
    let errorMessage = screen.queryByRole("alert");
    expect(errorMessage).toBeVisible();

    // Type more to clear the error
    await user.type(input, "valid");

    // Error should be cleared
    errorMessage = screen.queryByRole("alert");
    expect(errorMessage).toBeNull();
  });

  it("should disable input and button when loading", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("should enable button when input has valid content", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    // Initially disabled when empty
    expect(button).toBeDisabled();

    // Enable when input has content
    await user.type(input, "testuser");
    expect(button).toBeEnabled();
  });

  it("should submit on Enter key press", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "testuser{Enter}");

    expect(mockOnSearch).toHaveBeenCalledWith("testuser");
  });

  it("should have proper ARIA attributes", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox", { name: /username/i });
    const button = screen.getByRole("button", { name: /search/i });

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(button).toHaveAttribute("aria-label");
  });

  it("should set aria-invalid to true when there's an error", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    // Type too short username and submit
    await user.type(input, "ab{Enter}");

    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("should associate error with input using aria-describedby", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    // Type too short username and submit
    await user.type(input, "ab{Enter}");

    const describedBy = input.getAttribute("aria-describedby");

    expect(describedBy).toBeTruthy();

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveAttribute("id", describedBy);
  });

  it("should show searching state when isLoading is true", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toHaveTextContent(/searching/i);
  });

  it("should accept valid usernames with underscores and hyphens", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    await user.type(input, "user_name-123");
    await user.click(button);

    const errorMessage = screen.queryByRole("alert");
    expect(errorMessage).toBeNull();
    expect(mockOnSearch).toHaveBeenCalledWith("user_name-123");
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <SearchBar onSearch={mockOnSearch} isLoading={false} disabled={true} />,
    );

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /search/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("should display hint text below the form", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    // Hint text may be split across elements, use a function matcher
    const hint = screen.getByText((content) =>
      content.includes("Enter a username"),
    );
    expect(hint).toBeVisible();
  });

  it("should autofocus the input", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveFocus();
  });
});
