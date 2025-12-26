import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AIDialog } from "@/components/features/AIDialog";
import { useAIStore, useSearchStore } from "@/stores";

// Mock stores
vi.mock("@/stores", () => ({
  useAIStore: vi.fn(),
  useSearchStore: vi.fn(),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    const allTranslations: Record<string, Record<string, string>> = {
      ai: {
        title: "AI",
        subtitle: "AI Assistant",
        close_aria: "Close dialog",
        templates_hint: "Choose a template to get started",
        thinking: "Thinking...",
        input_placeholder: "Type your message...",
        send_aria: "Send message",
        assistant_label: "AI",
        error_prefix: "Error:",
      },
      "ai.templates": {
        "value_assessment.name": "Value Assessment",
        "value_assessment.description": "Analyze username value",
        "value_assessment.prompt": "Analyze testuser",
        "pattern_analysis.name": "Pattern Analysis",
        "pattern_analysis.description": "Analyze patterns",
        "pattern_analysis.prompt": "Analyze patterns for testuser",
        "platform_suggestions.name": "Platform Suggestions",
        "platform_suggestions.description": "Suggest platforms",
        "platform_suggestions.prompt": "Suggest platforms for testuser",
        "security_check.name": "Security Check",
        "security_check.description": "Check security",
        "security_check.prompt": "Check security for testuser",
      },
      errors: {
        ai_failed: "AI request failed",
      },
    };
    return (key: string) => allTranslations[namespace]?.[key] || key;
  },
}));

// Mock parsers
vi.mock("@/lib/parsers", () => ({
  parseSSEStream: vi.fn(async function* () {
    yield "AI response";
  }),
}));

// Mock useAIStream hook
vi.mock("@/hooks/useAIStream", () => ({
  useAIStream: () => ({
    stream: vi.fn(),
  }),
}));

const mockedUseAIStore = vi.mocked(useAIStore);
const mockedUseSearchStore = vi.mocked(useSearchStore);

const defaultAIStore = {
  isOpen: false,
  messages: [],
  isStreaming: false,
  currentTemplate: null,
  error: null,
  openDialog: vi.fn(),
  closeDialog: vi.fn(),
  addMessage: vi.fn(),
  setStreaming: vi.fn(),
  setTemplate: vi.fn(),
  setError: vi.fn(),
  clearMessages: vi.fn(),
  reset: vi.fn(),
};

const defaultSearchStore = {
  username: "testuser",
  isSearching: false,
  whatsMyNameResults: [],
  googleResults: [],
  googleQuery: "",
  googleSearchInformation: null,
  googleError: null,
  error: null,
  progress: { total: 0, completed: 0, percentage: 0 },
  setUsername: vi.fn(),
  setIsSearching: vi.fn(),
  addWhatsMyNameResult: vi.fn(),
  setGoogleResults: vi.fn(),
  setError: vi.fn(),
  setProgress: vi.fn(),
  clearResults: vi.fn(),
  reset: vi.fn(),
};

/**
 * Component Integration Tests for AIDialog
 *
 * Tests the AIDialog component behavior and interactions
 */
describe("AIDialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSearchStore.mockReturnValue(defaultSearchStore);
  });

  it("should not render when isOpen is false", () => {
    mockedUseAIStore.mockReturnValue({ ...defaultAIStore, isOpen: false });

    const { container } = render(<AIDialog />);

    // Dialog should not be visible
    expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
  });

  it("should render backdrop when dialog is open", () => {
    mockedUseAIStore.mockReturnValue({ ...defaultAIStore, isOpen: true });

    const { container } = render(<AIDialog />);

    // Backdrop should be visible
    const backdrop = container.querySelector(".fixed");
    expect(backdrop).toBeInTheDocument();
  });

  it("should render header with title and close button", () => {
    mockedUseAIStore.mockReturnValue({ ...defaultAIStore, isOpen: true });

    render(<AIDialog />);

    expect(screen.getByText("AI")).toBeVisible();
    expect(screen.getByText("AI Assistant")).toBeVisible();
  });

  it("should display template options when no messages", () => {
    mockedUseAIStore.mockReturnValue({
      ...defaultAIStore,
      isOpen: true,
      messages: [],
    });

    render(<AIDialog />);

    expect(screen.getByText("Value Assessment")).toBeVisible();
    expect(screen.getByText("Pattern Analysis")).toBeVisible();
    expect(screen.getByText("Platform Suggestions")).toBeVisible();
    expect(screen.getByText("Security Check")).toBeVisible();
  });

  it("should display messages when they exist", () => {
    mockedUseAIStore.mockReturnValue({
      ...defaultAIStore,
      isOpen: true,
      messages: [
        { role: "user" as const, content: "Hello", timestamp: Date.now() },
        {
          role: "assistant" as const,
          content: "Hi there!",
          timestamp: Date.now(),
        },
      ],
    });

    render(<AIDialog />);

    expect(screen.getByText("Hello")).toBeVisible();
    expect(screen.getByText("Hi there!")).toBeVisible();
  });

  it("should render chat input when messages exist", () => {
    mockedUseAIStore.mockReturnValue({
      ...defaultAIStore,
      isOpen: true,
      messages: [
        { role: "user" as const, content: "Test", timestamp: Date.now() },
      ],
    });

    render(<AIDialog />);

    const input = screen.getByRole("textbox");
    expect(input).toBeVisible();
  });

  it("should display loading indicator when streaming", () => {
    mockedUseAIStore.mockReturnValue({
      ...defaultAIStore,
      isOpen: true,
      messages: [
        { role: "user" as const, content: "Test", timestamp: Date.now() },
      ],
      isStreaming: true,
    });

    render(<AIDialog />);

    expect(screen.getByText(/thinking/i)).toBeVisible();
  });

  it("should display error when present", () => {
    mockedUseAIStore.mockReturnValue({
      ...defaultAIStore,
      isOpen: true,
      messages: [
        { role: "user" as const, content: "Test", timestamp: Date.now() },
      ],
      error: "API Error occurred",
    });

    render(<AIDialog />);

    expect(screen.getByText(/api error/i)).toBeVisible();
  });

  it("should have close button with aria-label", () => {
    mockedUseAIStore.mockReturnValue({ ...defaultAIStore, isOpen: true });

    render(<AIDialog />);

    const closeButton = screen.getByLabelText(/close/i);
    expect(closeButton).toBeVisible();
  });

  it("should have dialog role", () => {
    mockedUseAIStore.mockReturnValue({ ...defaultAIStore, isOpen: true });

    const { container } = render(<AIDialog />);

    const dialog = container.querySelector("[role='dialog']");
    expect(dialog).toBeInTheDocument();
  });

  it("should disable input during streaming", () => {
    mockedUseAIStore.mockReturnValue({
      ...defaultAIStore,
      isOpen: true,
      messages: [
        { role: "user" as const, content: "Test", timestamp: Date.now() },
      ],
      isStreaming: true,
    });

    render(<AIDialog />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });
});
