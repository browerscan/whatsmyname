import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAIStore } from "@/stores/useAIStore";
import { AIMessage, AITemplate } from "@/types";

/**
 * Unit Tests for AI Store
 *
 * Tests the Zustand store for AI dialog state management
 */
describe("useAIStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { reset } = useAIStore.getState();
    reset();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useAIStore());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.currentTemplate).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should open dialog", () => {
    const { result } = renderHook(() => useAIStore());

    act(() => {
      result.current.openDialog();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should close dialog", () => {
    const { result } = renderHook(() => useAIStore());

    act(() => {
      result.current.openDialog();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeDialog();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("should add user message", () => {
    const { result } = renderHook(() => useAIStore());

    const message: AIMessage = {
      role: "user",
      content: "Hello AI",
      timestamp: Date.now(),
    };

    act(() => {
      result.current.addMessage(message);
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual(message);
  });

  it("should add assistant message", () => {
    const { result } = renderHook(() => useAIStore());

    const message: AIMessage = {
      role: "assistant",
      content: "Hello! How can I help?",
      timestamp: Date.now(),
    };

    act(() => {
      result.current.addMessage(message);
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe("assistant");
  });

  it("should limit messages to MAX_AI_MESSAGES", () => {
    const { result } = renderHook(() => useAIStore());

    // Add more than MAX_AI_MESSAGES (50)
    const messages: AIMessage[] = Array.from({ length: 55 }, (_, i) => ({
      role: "user",
      content: `Message ${i}`,
      timestamp: Date.now() + i,
    }));

    act(() => {
      messages.forEach((msg) => result.current.addMessage(msg));
    });

    // Should only have 50 messages (max)
    expect(result.current.messages.length).toBeLessThanOrEqual(50);
  });

  it("should keep most recent messages when limit is exceeded", () => {
    const { result } = renderHook(() => useAIStore());

    // Add 55 messages
    const messages: AIMessage[] = Array.from({ length: 55 }, (_, i) => ({
      role: "user",
      content: `Message ${i}`,
      timestamp: Date.now() + i,
    }));

    act(() => {
      messages.forEach((msg) => result.current.addMessage(msg));
    });

    // The last 50 messages should be kept
    expect(result.current.messages[0].content).toBe("Message 5");
    expect(result.current.messages[49].content).toBe("Message 54");
  });

  it("should set streaming state", () => {
    const { result } = renderHook(() => useAIStore());

    act(() => {
      result.current.setStreaming(true);
    });

    expect(result.current.isStreaming).toBe(true);

    act(() => {
      result.current.setStreaming(false);
    });

    expect(result.current.isStreaming).toBe(false);
  });

  it("should set template", () => {
    const { result } = renderHook(() => useAIStore());

    const template: AITemplate = {
      id: "value_assessment",
      name: "Value Assessment",
      description: "Analyze the value of this username",
      prompt: "Analyze username: testuser",
    };

    act(() => {
      result.current.setTemplate(template);
    });

    expect(result.current.currentTemplate).toEqual(template);
  });

  it("should set error and stop streaming", () => {
    const { result } = renderHook(() => useAIStore());

    act(() => {
      result.current.setStreaming(true);
    });

    act(() => {
      result.current.setError("API Error");
    });

    expect(result.current.error).toBe("API Error");
    expect(result.current.isStreaming).toBe(false);
  });

  it("should clear all messages", () => {
    const { result } = renderHook(() => useAIStore());

    const messages: AIMessage[] = [
      { role: "user", content: "Hello", timestamp: Date.now() },
      { role: "assistant", content: "Hi there!", timestamp: Date.now() },
    ];

    act(() => {
      messages.forEach((msg) => result.current.addMessage(msg));
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.currentTemplate).toBeNull();
  });

  it("should reset all state", () => {
    const { result } = renderHook(() => useAIStore());

    // Set some state
    act(() => {
      result.current.openDialog();
      result.current.addMessage({
        role: "user",
        content: "Test",
        timestamp: Date.now(),
      });
      result.current.setStreaming(true);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.currentTemplate).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should preserve messages when closing dialog", () => {
    const { result } = renderHook(() => useAIStore());

    act(() => {
      result.current.openDialog();
      result.current.addMessage({
        role: "user",
        content: "Test",
        timestamp: Date.now(),
      });
    });

    act(() => {
      result.current.closeDialog();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toHaveLength(1);
  });

  it("should preserve template when closing dialog", () => {
    const { result } = renderHook(() => useAIStore());

    const template: AITemplate = {
      id: "test",
      name: "Test Template",
      description: "Test",
      prompt: "Test prompt",
    };

    act(() => {
      result.current.setTemplate(template);
      result.current.closeDialog();
    });

    expect(result.current.currentTemplate).toEqual(template);
  });

  it("should set null template", () => {
    const { result } = renderHook(() => useAIStore());

    const template: AITemplate = {
      id: "test",
      name: "Test",
      description: "Test",
      prompt: "Test",
    };

    act(() => {
      result.current.setTemplate(template);
    });

    expect(result.current.currentTemplate).not.toBeNull();

    act(() => {
      result.current.setTemplate(null);
    });

    expect(result.current.currentTemplate).toBeNull();
  });

  it("should clear error when setting new error", () => {
    const { result } = renderHook(() => useAIStore());

    act(() => {
      result.current.setError("First error");
    });

    expect(result.current.error).toBe("First error");

    act(() => {
      result.current.setError("New error");
    });

    expect(result.current.error).toBe("New error");
  });

  it("should allow null as error value", () => {
    const { result } = renderHook(() => useAIStore());

    act(() => {
      result.current.setError("Error");
    });

    expect(result.current.error).toBe("Error");

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });

  it("should handle messages with different roles", () => {
    const { result } = renderHook(() => useAIStore());

    const messages: AIMessage[] = [
      { role: "user", content: "Question", timestamp: Date.now() },
      { role: "assistant", content: "Answer", timestamp: Date.now() },
      { role: "user", content: "Follow-up", timestamp: Date.now() },
    ];

    act(() => {
      messages.forEach((msg) => result.current.addMessage(msg));
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[0].role).toBe("user");
    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[2].role).toBe("user");
  });
});
