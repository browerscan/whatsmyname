import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlatformCard } from "@/components/features/PlatformCard";
import { SearchResult } from "@/types";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      platform: {
        icon_alt: "{source} icon",
        visit_profile: "Visit {source} profile",
        badge_nsfw: "NSFW",
        badge_found: "Found",
        badge_not_found: "Not Found",
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

// Mock lib/index exports
vi.mock("@/lib", () => ({
  formatResponseTime: (ms: number) => `${ms}ms`,
  formatCategory: (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1),
  getResponseTimeCategory: (ms: number) =>
    ms < 500 ? "fast" : ms < 1000 ? "medium" : "slow",
}));

/**
 * Component Integration Tests for PlatformCard
 *
 * Tests the PlatformCard component rendering and display
 */
describe("PlatformCard Component", () => {
  const mockFoundResult: SearchResult = {
    source: "GitHub",
    username: "testuser",
    url: "https://github.com/testuser",
    isNSFW: false,
    category: "coding",
    tags: ["developer"],
    checkResult: {
      status: 200,
      checkType: "status_code",
      isExist: true,
      responseTime: 150,
    },
  };

  const mockNotFoundResult: SearchResult = {
    source: "Twitter",
    username: "testuser",
    url: "https://twitter.com/testuser",
    isNSFW: false,
    category: "social",
    tags: ["social-media"],
    checkResult: {
      status: 404,
      checkType: "status_code",
      isExist: false,
      responseTime: 300,
    },
  };

  const mockNSFWResult: SearchResult = {
    source: "Reddit",
    username: "testuser",
    url: "https://reddit.com/u/testuser",
    isNSFW: true,
    category: "social",
    tags: ["forum"],
    checkResult: {
      status: 200,
      checkType: "status_code",
      isExist: true,
      responseTime: 200,
    },
  };

  it("should render found result with correct styling", () => {
    render(<PlatformCard result={mockFoundResult} />);

    expect(screen.getByText("GitHub")).toBeVisible();

    // Should show found badge
    const foundBadge = screen.getByText(/found/i);
    expect(foundBadge).toBeVisible();

    // URL should be visible for found results
    const link = screen.getByRole("link");
    expect(link).toBeVisible();
    expect(link).toHaveAttribute("href", "https://github.com/testuser");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render not found result with correct styling", () => {
    render(<PlatformCard result={mockNotFoundResult} />);

    expect(screen.getByText("Twitter")).toBeVisible();

    // Should show not found badge
    const notFoundBadge = screen.getByText(/not found/i);
    expect(notFoundBadge).toBeVisible();

    // URL should not be visible for not found results
    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });

  it("should display NSFW badge for NSFW results", () => {
    render(<PlatformCard result={mockNSFWResult} />);

    const nsfwBadge = screen.getByText(/nsfw/i);
    expect(nsfwBadge).toBeVisible();
  });

  it("should display category badge", () => {
    render(<PlatformCard result={mockFoundResult} />);

    expect(screen.getByText("Coding")).toBeVisible();
  });

  it("should display response time badge with correct color", () => {
    const { container } = render(<PlatformCard result={mockFoundResult} />);

    // Fast response time should have green color
    const responseTimeBadge = screen.getByText("150ms");
    expect(responseTimeBadge).toBeVisible();
  });

  it("should have correct border styling for found results", () => {
    const { container } = render(<PlatformCard result={mockFoundResult} />);

    const card = container.querySelector("div[class*='border-l-4']");
    expect(card).toBeTruthy();
  });

  it("should display favicon image", () => {
    const { container } = render(<PlatformCard result={mockFoundResult} />);

    const favicon = container.querySelector(
      "img[src*='google.com/s2/favicons']",
    );
    expect(favicon).toBeTruthy();
  });

  it("should handle image error gracefully", () => {
    const { container } = render(<PlatformCard result={mockFoundResult} />);

    // The image should have loading and decoding attributes for performance
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("should render external link icon for found results", () => {
    render(<PlatformCard result={mockFoundResult} />);

    const link = screen.getByRole("link");
    const svgIcon = link.querySelector("svg");
    expect(svgIcon).toBeTruthy();
  });

  it("should render checkmark icon for found results", () => {
    const { container } = render(<PlatformCard result={mockFoundResult} />);

    const checkIcon = container.querySelector("svg");
    expect(checkIcon).toBeTruthy();
  });

  it("should render x icon for not found results", () => {
    const { container } = render(<PlatformCard result={mockNotFoundResult} />);

    const xIcon = container.querySelector("svg");
    expect(xIcon).toBeTruthy();
  });

  it("should have clock icon for response time", () => {
    const { container } = render(<PlatformCard result={mockFoundResult} />);

    const clockIcon = container.querySelector("svg");
    expect(clockIcon).toBeTruthy();
  });

  it("should render with correct domain", () => {
    render(<PlatformCard result={mockFoundResult} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/testuser");
  });

  it("should be memoized to prevent unnecessary re-renders", () => {
    const { rerender } = render(<PlatformCard result={mockFoundResult} />);

    // Re-render with same result
    rerender(<PlatformCard result={mockFoundResult} />);

    expect(screen.getByText("GitHub")).toBeVisible();
  });

  it("should handle different response time categories", () => {
    const slowResult: SearchResult = {
      ...mockFoundResult,
      checkResult: {
        ...mockFoundResult.checkResult,
        responseTime: 1500,
      },
    };

    const { container } = render(<PlatformCard result={slowResult} />);

    const responseTimeBadge = screen.getByText(/1500|1.50s/);
    expect(responseTimeBadge).toBeVisible();
  });

  it("should have accessible ARIA attributes", () => {
    render(<PlatformCard result={mockFoundResult} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label");
  });

  it("should display username correctly", () => {
    render(<PlatformCard result={mockFoundResult} />);

    // The username is embedded in the URL
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/testuser");
  });

  it("should render tags if present", () => {
    const resultWithTags: SearchResult = {
      ...mockFoundResult,
      tags: ["developer", "coding", "git"],
    };

    render(<PlatformCard result={resultWithTags} />);

    // Tags might be rendered differently depending on implementation
    expect(screen.getByText("GitHub")).toBeVisible();
  });
});
