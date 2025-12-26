"use client";

import { useCallback, useRef } from "react";
import { parseSSEStream } from "@/lib/parsers";
import { AIMessage } from "@/types";

/**
 * Error types for AI streaming operations
 */
export enum AIStreamErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  PARSE_ERROR = "PARSE_ERROR",
  RESPONSE_ERROR = "RESPONSE_ERROR",
  ABORTED = "ABORTED",
}

/**
 * Custom error class for AI stream operations
 */
export class AIStreamError extends Error {
  constructor(
    message: string,
    public code: AIStreamErrorCode,
    public status?: number,
  ) {
    super(message);
    this.name = "AIStreamError";
  }
}

/**
 * Options for configuring AI stream behavior
 */
export interface UseAIStreamOptions {
  /**
   * API endpoint for AI analysis
   * @default "/api/ai/analyze"
   */
  endpoint?: string;

  /**
   * Callback invoked when streaming starts
   */
  onStart?: () => void;

  /**
   * Callback invoked when streaming completes successfully
   * @param fullContent - The complete accumulated content
   */
  onComplete?: (fullContent: string) => void;

  /**
   * Callback invoked for each content chunk received
   * @param chunk - The content chunk received
   * @param accumulatedContent - The full accumulated content so far
   */
  onChunk?: (chunk: string, accumulatedContent: string) => void;

  /**
   * Callback invoked when an error occurs
   * @param error - The error that occurred
   */
  onError?: (error: AIStreamError | Error) => void;

  /**
   * Callback invoked when streaming is stopped (not due to error)
   */
  onStop?: () => void;
}

/**
 * Result object returned by useAIStream hook
 */
export interface UseAIStreamResult {
  /**
   * Initiates the AI stream with the provided message history
   * @param messageHistory - Array of previous messages to send to the AI
   * @returns Promise that resolves when streaming completes
   */
  stream: (messageHistory: AIMessage[]) => Promise<void>;

  /**
   * Aborts the current stream if active
   */
  abort: () => void;
}

/**
 * Custom hook for managing AI streaming operations
 *
 * Extracts the stream management logic from AIDialog component
 * to improve code organization, testability, and reusability.
 *
 * @param updateAssistantMessage - Callback to update the assistant message in state
 * @param addMessage - Callback to add a new message to the state
 * @param getMessages - Callback to get current messages from state
 * @param options - Configuration options for stream behavior
 * @returns Object containing stream and abort functions
 *
 * @example
 * ```tsx
 * const { stream, abort } = useAIStream(
 *   (msg) => updateMessage(msg),
 *   (msg) => addMessage(msg),
 *   () => useAIStore.getState().messages,
 *   {
 *     onStart: () => console.log('Streaming started'),
 *     onComplete: (content) => console.log('Streaming completed:', content),
 *     onError: (error) => console.error('Streaming error:', error),
 *   }
 * );
 * ```
 */
export function useAIStream(
  updateAssistantMessage: (message: AIMessage) => void,
  addMessage: (message: AIMessage) => void,
  getMessages: () => AIMessage[],
  options: UseAIStreamOptions = {},
): UseAIStreamResult {
  const {
    endpoint = "/api/ai/analyze",
    onStart,
    onComplete,
    onChunk,
    onError,
    onStop,
  } = options;

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Abort any ongoing stream
   */
  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    onStop?.();
  }, [onStop]);

  /**
   * Stream AI response from the server
   */
  const stream = useCallback(
    async (messageHistory: AIMessage[]): Promise<void> => {
      // Abort any existing stream
      abort();

      // Create new abort controller for this stream
      const controller = new AbortController();
      abortControllerRef.current = controller;

      onStart?.();

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: messageHistory }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new AIStreamError(
            `AI API error: ${response.statusText}`,
            AIStreamErrorCode.RESPONSE_ERROR,
            response.status,
          );
        }

        // Initialize assistant message
        let assistantContent = "";
        const currentMessages = getMessages();
        const assistantMessage: AIMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        // Stream the response chunk by chunk
        for await (const chunk of parseSSEStream(response)) {
          // Check if aborted
          if (controller.signal.aborted) {
            throw new AIStreamError(
              "Stream aborted",
              AIStreamErrorCode.ABORTED,
            );
          }

          assistantContent += chunk;
          assistantMessage.content = assistantContent;

          // Notify about the chunk
          onChunk?.(chunk, assistantContent);

          // Update the last message (or add if first chunk)
          if (
            currentMessages[currentMessages.length - 1]?.role === "assistant"
          ) {
            // Update existing assistant message
            updateAssistantMessage({ ...assistantMessage });
          } else {
            // Add new assistant message
            addMessage({ ...assistantMessage });
          }
        }

        onComplete?.(assistantContent);
      } catch (err) {
        // Don't treat abort as an error
        if (
          err instanceof AIStreamError &&
          err.code === AIStreamErrorCode.ABORTED
        ) {
          return;
        }

        const error =
          err instanceof AIStreamError
            ? err
            : new AIStreamError(
                err instanceof Error ? err.message : "Unknown streaming error",
                AIStreamErrorCode.NETWORK_ERROR,
              );

        onError?.(error);
      } finally {
        abortControllerRef.current = null;
      }
    },
    [
      abort,
      endpoint,
      onStart,
      onComplete,
      onChunk,
      onError,
      getMessages,
      updateAssistantMessage,
      addMessage,
    ],
  );

  return { stream, abort };
}
