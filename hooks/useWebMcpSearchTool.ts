"use client";

import { useEffect, useRef } from "react";

import { RESULT_CAVEAT } from "@/lib/agent/site";
import { validateUsername } from "@/lib/validators";
import { useSearchStore } from "@/stores";

interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: Record<string, boolean>;
  execute: (input: { username?: unknown }) => Promise<{
    content: { type: "text"; text: string }[];
    isError?: boolean;
  }>;
}

interface ModelContext {
  registerTool?: (tool: WebMcpTool) => unknown;
  unregisterTool?: (name: string) => void;
  provideContext?: (context: { tools: WebMcpTool[] }) => void;
  clearContext?: () => void;
}

const TOOL_NAME = "search_username";
const MAX_REPORTED_PROFILES = 200;

function waitForSearchToSettle(): Promise<void> {
  return new Promise((resolve) => {
    if (!useSearchStore.getState().isSearching) {
      resolve();
      return;
    }
    const unsubscribe = useSearchStore.subscribe((state) => {
      if (!state.isSearching) {
        unsubscribe();
        resolve();
      }
    });
  });
}

function text(value: unknown, isError = false) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }], isError };
}

/**
 * Registers a WebMCP tool (navigator.modelContext) that runs the page's own
 * username search, so browser agents use the same rate-limited flow as a
 * person pressing Search. The tool lives only while the home page is mounted.
 */
export function useWebMcpSearchTool(search: (username: string) => Promise<void>) {
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    const modelContext = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!modelContext) return;

    const tool: WebMcpTool = {
      name: TOOL_NAME,
      description:
        "Check where a username exists across 1,400+ websites and apps on whatismyname.org. Runs the same search as the page's Search button and returns the profiles found.",
      inputSchema: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "Username without @ or a profile URL: 3-30 letters, numbers, underscores or hyphens.",
          },
        },
        required: ["username"],
      },
      annotations: { readOnlyHint: true },
      async execute({ username }) {
        const value = typeof username === "string" ? username.trim() : "";
        const validation = validateUsername(value);
        if (!validation.isValid) {
          return text({ username: value, error: validation.errorKey }, true);
        }

        await searchRef.current(value);
        await waitForSearchToSettle();

        const state = useSearchStore.getState();
        const found = state.whatsMyNameResults
          .filter((result) => result.checkResult.isExist)
          .map((result) => ({ site: result.source, url: result.url, category: result.category }));

        return text(
          {
            username: value,
            checked: state.whatsMyNameResults.length,
            foundCount: found.length,
            found: found.slice(0, MAX_REPORTED_PROFILES),
            error: state.error,
            note: RESULT_CAVEAT,
          },
          Boolean(state.error) && found.length === 0,
        );
      },
    };

    // The API is still moving: current drafts use registerTool/unregisterTool
    // (some polyfills return a handle with unregister()), older ones
    // provideContext/clearContext.
    if (typeof modelContext.registerTool === "function") {
      const registration = modelContext.registerTool(tool) as { unregister?: () => void } | undefined;
      return () => {
        if (typeof registration?.unregister === "function") registration.unregister();
        else modelContext.unregisterTool?.(TOOL_NAME);
      };
    }
    if (typeof modelContext.provideContext === "function") {
      modelContext.provideContext({ tools: [tool] });
      return () => modelContext.clearContext?.();
    }
    return undefined;
  }, []);
}
