import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useWebMcpSearchTool } from "@/hooks/useWebMcpSearchTool";
import { useSearchStore } from "@/stores";
import type { SearchResult } from "@/types";

function result(source: string, isExist: boolean): SearchResult {
  return {
    source,
    username: "octocat",
    url: `https://${source}.example/octocat`,
    isNSFW: false,
    category: "coding",
    checkResult: { status: isExist ? 200 : 404, checkType: "status", isExist, responseTime: 10 },
  };
}

type Tool = {
  name: string;
  execute: (input: { username?: unknown }) => Promise<{ content: { text: string }[]; isError?: boolean }>;
};

function installModelContext(api: Record<string, unknown>) {
  Object.defineProperty(navigator, "modelContext", { value: api, configurable: true });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "modelContext");
});

describe("useWebMcpSearchTool", () => {
  it("does nothing when the browser has no WebMCP", () => {
    expect(() => renderHook(() => useWebMcpSearchTool(vi.fn()))).not.toThrow();
  });

  it("registers search_username, runs the page search and reports found profiles", async () => {
    let tool: Tool | undefined;
    const unregisterTool = vi.fn();
    installModelContext({ registerTool: (registered: Tool) => (tool = registered), unregisterTool });

    // Mirrors the cached-search path: search() resolves before results land.
    const search = vi.fn(async (username: string) => {
      useSearchStore.getState().setUsername(username);
      useSearchStore.getState().startSearch();
      setTimeout(() => {
        useSearchStore.getState().addWhatsMyNameResults([result("github", true), result("gitlab", false)]);
        useSearchStore.getState().stopSearch();
      }, 10);
    });

    const { unmount } = renderHook(() => useWebMcpSearchTool(search));
    expect(tool?.name).toBe("search_username");

    const output = await tool!.execute({ username: " octocat " });
    expect(search).toHaveBeenCalledWith("octocat");
    const payload = JSON.parse(output.content[0].text);
    expect(payload).toMatchObject({ username: "octocat", checked: 2, foundCount: 1 });
    expect(payload.found).toEqual([{ site: "github", url: "https://github.example/octocat", category: "coding" }]);
    expect(output.isError).toBe(false);

    unmount();
    expect(unregisterTool).toHaveBeenCalledWith("search_username");
  });

  it("rejects malformed usernames without searching", async () => {
    let tool: Tool | undefined;
    installModelContext({ provideContext: ({ tools }: { tools: Tool[] }) => (tool = tools[0]) });
    const search = vi.fn();

    renderHook(() => useWebMcpSearchTool(search));
    const output = await tool!.execute({ username: "a" });

    expect(search).not.toHaveBeenCalled();
    expect(output.isError).toBe(true);
    expect(JSON.parse(output.content[0].text).error).toBe("too_short");
  });
});
