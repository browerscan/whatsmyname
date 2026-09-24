import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AIMessageContent } from "@/components/features/AIMessageContent";

describe("AIMessageContent", () => {
  it("renders headings, lists, code, separators and GFM tables", () => {
    const { container } = render(<AIMessageContent content={'## Next steps\n\n- **Check** `username`\n\n---\n\n| Category | Value |\n| --- | --- |\n| Name | Available |\n\n```text\nexample\n```'} />);
    expect(screen.getByRole("heading", { name: "Next steps", level: 2 })).toBeVisible();
    expect(screen.getByRole("listitem")).toHaveTextContent("Check username");
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveTextContent("Available");
    expect(container.querySelector("pre code")).toHaveTextContent("example");
  });

  it("ignores raw HTML and images and blocks unsafe links", () => {
    const { container } = render(<AIMessageContent content={'<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n![tracking](https://example.com/pixel)\n\n[unsafe](javascript:alert%281%29)\n\n[safe](https://example.com)'} />);
    expect(container.querySelector("script, img")).toBeNull();
    expect(screen.queryByRole("link", { name: "unsafe" })).toBeNull();
    expect(screen.getByRole("link", { name: "safe" })).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("updates partial streaming Markdown into its completed structure", () => {
    const { rerender } = render(<AIMessageContent content="## Next" />);
    expect(screen.getByRole("heading")).toHaveTextContent("Next");
    rerender(<AIMessageContent content={'## Next steps\n\n**Done**'} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Next steps");
    expect(screen.getByText("Done").tagName).toBe("STRONG");
  });
});
