"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import { Search, Loader2, Keyboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateUsername } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const KEYBOARD_SHORTCUT = isMac() ? "Cmd+K" : "Ctrl+K";

function isMac(): boolean {
  if (typeof window === "undefined") return false;
  return window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

export function SearchBar({
  onSearch,
  isLoading,
  disabled = false,
}: SearchBarProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tInput = useTranslations("search.input");
  const tButton = useTranslations("search.button");
  const tSearch = useTranslations("search");
  const tShortcut = useTranslations("shortcuts");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate username
    const validation = validateUsername(username);
    if (!validation.isValid) {
      const message =
        validation.errorKey === "required"
          ? tInput("error_required")
          : validation.errorKey === "too_short"
            ? tInput("error_too_short", { min: USERNAME_MIN_LENGTH })
            : validation.errorKey === "too_long"
              ? tInput("error_too_long", { max: USERNAME_MAX_LENGTH })
              : validation.errorKey === "invalid_chars"
                ? tInput("error_invalid_chars")
                : tInput("error_invalid");

      setError(message);
      return;
    }

    // Clear error and trigger search
    setError(null);
    onSearch(username.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // Clear error when user types
    if (error) {
      setError(null);
    }
  };

  // Focus the input when keyboard shortcut is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder={tInput("placeholder")}
              value={username}
              onChange={handleChange}
              disabled={isLoading || disabled}
              className={cn(
                "pr-24 h-14 text-base rounded-2xl border-2 shadow-custom-sm transition-all",
                error && "border-destructive focus-visible:ring-destructive",
              )}
              aria-label={tInput("aria_label")}
              aria-invalid={!!error}
              aria-describedby={error ? "username-error" : undefined}
              autoFocus
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            {/* Keyboard shortcut hint */}
            <kbd className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              <Keyboard className="h-3 w-3" />
              <span>K</span>
            </kbd>
          </div>

          <Button
            type="submit"
            disabled={isLoading || disabled || !username.trim()}
            className="h-14 px-8 rounded-2xl font-semibold shadow-custom-md hover:shadow-custom-lg transition-all"
            aria-label={tButton("aria_label")}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tButton("searching")}
              </>
            ) : (
              tButton("submit")
            )}
          </Button>
        </div>

        {error && (
          <p
            id="username-error"
            className="text-sm text-destructive font-medium"
            role="alert"
          >
            {error}
          </p>
        )}

        <p className="text-sm text-muted-foreground text-center">
          {tSearch("hint")}
          {tShortcut && (
            <span className="ml-2">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-xs">
                {KEYBOARD_SHORTCUT}
              </kbd>{" "}
              {tShortcut("to_focus")}
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
