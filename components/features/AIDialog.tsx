"use client";

import { useState, useRef, useEffect, FormEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Send,
  Loader2,
  Sparkles,
  X,
  BrainCircuit,
  TrendingUp,
  Search,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAIStore, useSearchStore } from "@/stores";
import { useAIStream } from "@/hooks/useAIStream";
import { AIMessage, SearchResult } from "@/types";

const AI_TEMPLATE_ITEMS = [
  { id: "value_assessment", icon: Sparkles },
  { id: "pattern_analysis", icon: TrendingUp },
  { id: "platform_suggestions", icon: Search },
  { id: "security_check", icon: Shield },
] as const;

type AiTemplateId = (typeof AI_TEMPLATE_ITEMS)[number]["id"];

/**
 * Format search results for AI consumption
 * Creates a structured summary of found/not-found profiles with category distribution
 *
 * @param results - Array of search results to format
 * @param username - The username that was searched
 * @returns Formatted string for AI analysis
 */
function formatSearchResultsForAI(
  results: SearchResult[],
  username: string,
): string {
  if (results.length === 0) {
    return `No search results available for username "${username}".`;
  }

  const foundResults = results.filter((r) => r.checkResult.isExist);
  const notFoundResults = results.filter((r) => !r.checkResult.isExist);

  let summary = `Search Results for "${username}":\n`;
  summary += `Total platforms checked: ${results.length}\n`;
  summary += `Profiles found: ${foundResults.length}\n`;
  summary += `Profiles not found: ${notFoundResults.length}\n\n`;

  if (foundResults.length > 0) {
    summary += "=== FOUND PROFILES ===\n";
    foundResults.slice(0, 20).forEach((result, index) => {
      summary += `${index + 1}. ${result.source}\n`;
      summary += `   URL: ${result.url}\n`;
      summary += `   Category: ${result.category}\n`;
      if (result.isNSFW) summary += `   NSFW: Yes\n`;
      if (result.tags && result.tags.length > 0)
        summary += `   Tags: ${result.tags.join(", ")}\n`;
      summary += `\n`;
    });

    if (foundResults.length > 20) {
      summary += `... and ${foundResults.length - 20} more found profiles.\n\n`;
    }
  }

  // Include some not-found results for pattern analysis
  if (notFoundResults.length > 0) {
    summary += "=== NOT FOUND (Sample) ===\n";
    notFoundResults.slice(0, 10).forEach((result, index) => {
      summary += `${index + 1}. ${result.source} (${result.category})\n`;
    });
    summary += `\n`;
  }

  // Category distribution
  const categoryCount: Record<string, number> = {};
  results.forEach((result) => {
    categoryCount[result.category] = (categoryCount[result.category] || 0) + 1;
  });
  summary += "=== CATEGORY DISTRIBUTION ===\n";
  Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      summary += `${category}: ${count}\n`;
    });

  return summary;
}

export function AIDialog() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("ai");
  const tTemplates = useTranslations("ai.templates");
  const tErrors = useTranslations("errors");

  const {
    isOpen,
    closeDialog,
    messages,
    isStreaming,
    error,
    addMessage,
    setStreaming,
    setTemplate,
    setError,
    clearMessages,
  } = useAIStore();

  const { username, whatsMyNameResults } = useSearchStore();

  /**
   * Update assistant message in store
   */
  const updateAssistantMessage = useCallback((message: AIMessage) => {
    useAIStore.setState((state) => ({
      messages: [...state.messages.slice(0, -1), message],
    }));
  }, []);

  /**
   * Get current messages from store
   */
  const getMessages = useCallback(() => {
    return useAIStore.getState().messages;
  }, []);

  /**
   * Stream management using custom hook
   */
  const { stream: streamAIResponse } = useAIStream(
    updateAssistantMessage,
    addMessage,
    getMessages,
    {
      onStart: () => setStreaming(true),
      onComplete: () => setStreaming(false),
      onError: (err) => {
        console.error("AI streaming error:", err);
        setError(err.message || tErrors("ai_failed"));
        setStreaming(false);
      },
    },
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTemplateSelect = async (templateId: AiTemplateId) => {
    // Prevent multiple calls while streaming
    if (isStreaming) {
      return;
    }

    // Build the enhanced prompt with actual search results
    const basePrompt = tTemplates(`${templateId}.prompt`, { username });
    const searchResultsData = formatSearchResultsForAI(
      whatsMyNameResults,
      username,
    );

    const enhancedPrompt = `${basePrompt}\n\n${searchResultsData}`;

    const template = {
      id: templateId,
      name: tTemplates(`${templateId}.name`),
      description: tTemplates(`${templateId}.description`),
      prompt: enhancedPrompt,
    };

    setTemplate(template);
    clearMessages();
    setError(null);

    // Add user message
    const userMessage: AIMessage = {
      role: "user",
      content: enhancedPrompt,
      timestamp: Date.now(),
    };
    addMessage(userMessage);

    // Stream AI response
    await streamAIResponse([userMessage]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    // Enhance user input with search results if available
    let enhancedContent = input.trim();

    if (whatsMyNameResults.length > 0) {
      const searchResultsData = formatSearchResultsForAI(
        whatsMyNameResults,
        username,
      );
      enhancedContent = `${input.trim()}\n\n${searchResultsData}`;
    }

    const userMessage: AIMessage = {
      role: "user",
      content: enhancedContent,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput("");
    setError(null);

    await streamAIResponse([...messages, userMessage]);
  };

  const handleClose = () => {
    if (!isStreaming) {
      closeDialog();
    }
  };

  // Show result count indicator if results are available
  const foundCount = whatsMyNameResults.filter(
    (r) => r.checkResult.isExist,
  ).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Chat container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-dialog-title"
        className="fixed left-1/2 top-1/2 z-[9999] w-[min(90vw,700px)] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-background/98 backdrop-blur-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                {t("title")}
              </p>
              <p id="ai-dialog-title" className="text-lg font-bold">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Results indicator */}
            {whatsMyNameResults.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                <span>{foundCount}</span>
                <span>/</span>
                <span>{whatsMyNameResults.length}</span>
                <span>results</span>
              </div>
            )}
            <button
              aria-label={t("close_aria")}
              className="rounded-full hover:bg-muted p-2 text-muted-foreground hover:text-foreground transition-all"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {messages.length === 0 ? (
          /* Template Selector */
          <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
            <p className="text-sm text-muted-foreground mb-6 text-center">
              {t("templates_hint")}
            </p>

            {/* Results notice */}
            {whatsMyNameResults.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                  <BrainCircuit className="h-4 w-4" />
                  <span>
                    Analyzing {foundCount} found profiles across{" "}
                    {whatsMyNameResults.length} platforms
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_TEMPLATE_ITEMS.map(({ id, icon: Icon }, index) => (
                <Card
                  key={id}
                  className={`p-5 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary hover:scale-[1.02] border-2 ${isStreaming ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => {
                    if (!isStreaming) {
                      handleTemplateSelect(id);
                    }
                  }}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5 text-base">
                        {tTemplates(`${id}.name`)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tTemplates(`${id}.description`)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* No results hint */}
            {whatsMyNameResults.length === 0 && (
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Search for a username first to get AI-powered insights based
                  on actual results.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Chat Interface */
          <div className="flex flex-col">
            {/* Messages */}
            <div
              ref={scrollRef}
              className="mb-6 h-96 space-y-4 overflow-y-auto pr-2 text-sm"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    message.role === "user" ? "flex justify-end" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={
                      message.role === "assistant"
                        ? "rounded-2xl bg-card border border-border p-4 text-foreground shadow-sm max-w-[90%]"
                        : "max-w-[85%] rounded-2xl border-2 border-primary/30 bg-primary/15 p-4"
                    }
                  >
                    {message.role === "assistant" && (
                      <div className="mb-2 flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-1">
                          <BrainCircuit className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                          {t("assistant_label")}
                        </span>
                      </div>
                    )}
                    <div className="leading-relaxed whitespace-pre-wrap text-[15px]">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {isStreaming && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground animate-pulse">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                  <span className="font-medium">{t("thinking")}</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex gap-3">
                <Input
                  placeholder={t("input_placeholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isStreaming}
                  className="text-[15px] h-11"
                />
                <Button
                  aria-label={t("send_aria")}
                  onClick={handleSubmit}
                  disabled={isStreaming || !input.trim()}
                  size="lg"
                  className="px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive font-medium">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
