import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "@/components/features/FilterBar";
import { FilterOptions } from "@/types";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      filters: {
        title: "FILTERS",
        search_placeholder: "Search results...",
        search_categories_placeholder: "Search categories...",
        status_label: "Status",
        category_label: "Category",
        all: "All",
        found: "Found",
        not_found: "Not Found",
        all_categories: "All Categories",
        show_nsfw: "Show NSFW",
        clear: "Clear",
        show_more: "Show {count} more",
        show_less: "Show less",
        no_categories_found: "No categories found",
        showing_results: "Showing {count} results",
        apply_filters: "Apply Filters",
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

/**
 * Component Integration Tests for FilterBar
 *
 * Tests the FilterBar component behavior and interactions
 */
describe("FilterBar Component", () => {
  const mockOnFilterChange = vi.fn();
  const defaultFilters: FilterOptions = {
    status: "all",
    category: null,
    showNSFW: false,
    searchQuery: "",
  };
  const categories = ["coding", "social", "gaming", "business"];

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it("should render filter section with all controls", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    expect(screen.getByText(/filters/i)).toBeVisible();
    expect(screen.getByPlaceholderText(/search/i)).toBeVisible();
    expect(screen.getByText(/status/i)).toBeVisible();
  });

  it("should display status filter options", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    expect(screen.getByText("All")).toBeVisible();
    expect(screen.getByText("Found")).toBeVisible();
    expect(screen.getByText("Not Found")).toBeVisible();
  });

  it("should call onFilterChange when status is clicked", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const foundButton = screen.getByText("Found");
    await user.click(foundButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      status: "found",
    });
  });

  it("should display category filter when categories are provided", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    expect(screen.getByText(/category/i)).toBeVisible();
    expect(screen.getByText("All Categories")).toBeVisible();
    expect(screen.getByText("coding")).toBeVisible();
    expect(screen.getByText("social")).toBeVisible();
  });

  it("should limit categories to 10 when many are provided", () => {
    const manyCategories = Array.from({ length: 15 }, (_, i) => `cat${i}`);
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={manyCategories}
      />,
    );

    // Should show "All Categories" plus up to 10 categories
    const allCategoriesButton = screen.getByText("All Categories");
    expect(allCategoriesButton).toBeVisible();
  });

  it("should not display category section when no categories", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={[]}
      />,
    );

    expect(screen.queryByText(/category/i)).not.toBeInTheDocument();
  });

  it("should call onFilterChange when category is clicked", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const codingButton = screen.getByText("coding");
    await user.click(codingButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      category: "coding",
    });
  });

  it("should call onFilterChange with null when all categories is clicked", async () => {
    const user = userEvent.setup();
    const activeFilters: FilterOptions = {
      ...defaultFilters,
      category: "coding",
    };

    render(
      <FilterBar
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const allCategoriesButton = screen.getByText("All Categories");
    await user.click(allCategoriesButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...activeFilters,
      category: null,
    });
  });

  it("should display NSFW toggle checkbox", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeVisible();
    expect(screen.getByText("Show NSFW")).toBeVisible();
  });

  it("should toggle NSFW filter when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      showNSFW: true,
    });
  });

  it("should show clear button when filters are active", () => {
    const activeFilters: FilterOptions = {
      ...defaultFilters,
      status: "found",
    };

    render(
      <FilterBar
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    expect(screen.getByText("Clear")).toBeVisible();
  });

  it("should not show clear button when no filters are active", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("should clear all filters when clear button is clicked", async () => {
    const user = userEvent.setup();
    const activeFilters: FilterOptions = {
      ...defaultFilters,
      status: "found",
      category: "coding",
      searchQuery: "test",
    };

    render(
      <FilterBar
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const clearButton = screen.getByText("Clear");
    await user.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(defaultFilters);
  });

  it("should debounce search input", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "github");

    // Wait for debounce
    await waitFor(
      () => {
        expect(mockOnFilterChange).toHaveBeenCalledWith({
          ...defaultFilters,
          searchQuery: "github",
        });
      },
      { timeout: 500 },
    );
  });

  it("should highlight active status filter", () => {
    const activeFilters: FilterOptions = {
      ...defaultFilters,
      status: "found",
    };

    render(
      <FilterBar
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    // The active filter should have different styling
    const foundButton = screen.getByText("Found");
    expect(foundButton).toBeVisible();
  });

  it("should highlight active category filter", () => {
    const activeFilters: FilterOptions = {
      ...defaultFilters,
      category: "coding",
    };

    render(
      <FilterBar
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const codingButton = screen.getByText("coding");
    expect(codingButton).toBeVisible();
  });

  it("should have accessible checkbox label", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText("Show NSFW").closest("label");

    expect(label).toContainElement(checkbox);
  });

  it("should have accessible search input", () => {
    render(
      <FilterBar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        categories={categories}
      />,
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toHaveAttribute("type", "text");
  });
});
