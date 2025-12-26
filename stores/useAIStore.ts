import { create } from "zustand";
import { AIState, AIMessage, AITemplate } from "@/types";
import { MAX_AI_MESSAGES } from "@/lib/constants";

export const useAIStore = create<AIState>((set) => ({
  isOpen: false,
  messages: [],
  isStreaming: false,
  currentTemplate: null,
  error: null,

  openDialog: () => set({ isOpen: true, error: null }),

  closeDialog: () => set({ isOpen: false }),

  addMessage: (message: AIMessage) =>
    set((state) => {
      const newMessages = [...state.messages, message];
      // Limit total messages to prevent excessive memory usage
      if (newMessages.length > MAX_AI_MESSAGES) {
        return {
          messages: newMessages.slice(newMessages.length - MAX_AI_MESSAGES),
        };
      }
      return { messages: newMessages };
    }),

  setStreaming: (isStreaming: boolean) => set({ isStreaming }),

  setTemplate: (template: AITemplate | null) =>
    set({ currentTemplate: template }),

  setError: (error: string | null) => set({ error, isStreaming: false }),

  clearMessages: () => set({ messages: [], currentTemplate: null }),

  reset: () =>
    set({
      isOpen: false,
      messages: [],
      isStreaming: false,
      currentTemplate: null,
      error: null,
    }),
}));
