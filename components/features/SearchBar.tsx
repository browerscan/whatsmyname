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
  const [isFocused, setIsFocused] = useState(false);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={cn(
            "flex gap-3 transition-all duration-300",
            isFocused && "scale-[1.02]",
          )}
        >
          <div className="relative flex-1 group">
            {/* Glow effect on focus */}
            <div
              className={cn(
                "absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-xl opacity-0 transition-opacity duration-300",
                isFocused && "opacity-100",
              )}
            />

            <Input
              ref={inputRef}
              type="text"
              placeholder={tInput("placeholder")}
              value={username}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading || disabled}
              className={cn(
                "relative h-14 text-base rounded-2xl border-2 transition-all duration-200",
                "bg-background/70 backdrop-blur-md",
                error
                  ? "border-destructive focus-visible:ring-destructive/50"
                  : "border-border/60 focus:border-primary/50",
                "focus-visible:ring-4 focus-visible:ring-primary/20",
                "shadow-md hover:shadow-lg",
                "placeholder:text-muted-foreground/60",
              )}
              aria-label={tInput("aria_label")}
              aria-invalid={!!error}
              aria-describedby={error ? "username-error" : undefined}
              autoFocus
            />

            {/* Search icon with subtle animation */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <Search
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-colors",
                  isFocused && "text-primary",
                )}
              />
            </div>

            {/* Keyboard shortcut hint */}
            <kbd
              className={cn(
                "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
                "hidden h-7 select-none items-center gap-1.5",
                "rounded-lg border border-border/50 bg-muted/80 backdrop-blur-sm",
                "px-2 font-mono text-[10px] font-medium text-muted-foreground",
                "transition-opacity duration-200",
                username || isFocused ? "opacity-0 sm:flex" : "sm:flex",
              )}
            >
              <Keyboard className="h-3 w-3" />
              <span>K</span>
            </kbd>
          </div>

          <Button
            type="submit"
            disabled={isLoading || disabled || !username.trim()}
            className="h-14 px-8 rounded-2xl text-base shadow-lg hover:shadow-glow transition-all duration-200"
            aria-label={tButton("aria_label")}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {tButton("searching")}
              </>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {tButton("submit")}
              </span>
            )}
          </Button>
        </div>

        {error && (
          <div
            id="username-error"
            className="flex items-center gap-2 text-sm text-destructive font-medium animate-fade-in"
            role="alert"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <p className="text-sm text-muted-foreground/80 text-center">
          {tSearch("hint")}
          {tShortcut && (
            <span className="ml-2">
              Press{" "}
              <kbd className="mx-1 px-2 py-0.5 rounded-lg bg-muted/60 border border-border/50 font-mono text-xs">
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
