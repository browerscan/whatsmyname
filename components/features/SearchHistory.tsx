"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS, MAX_RECENT_SEARCHES } from "@/lib/constants";

export interface RecentSearch {
  username: string;
  timestamp: number;
  resultCount?: number;
}

interface SearchHistoryProps {
  onSearch: (username: string) => void;
}

export function SearchHistory({ onSearch }: SearchHistoryProps) {
  const t = useTranslations("search_history");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentSearch[];
        setRecentSearches(parsed);
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const addSearch = (username: string, resultCount?: number) => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;

    const newSearch: RecentSearch = {
      username: trimmedUsername,
      timestamp: Date.now(),
      resultCount,
    };

    // Remove existing search with same username (if any)
    const filtered = recentSearches.filter(
      (s) => s.username !== trimmedUsername,
    );

    // Add new search at the beginning
    const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);

    try {
      localStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(updated),
      );
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  };

  const removeSearch = (username: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updated = recentSearches.filter((s) => s.username !== username);
    setRecentSearches(updated);

    try {
      localStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(updated),
      );
    } catch (error) {
      console.error("Failed to update search history:", error);
    }
  };

  const clearAll = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
      console.error("Failed to clear search history:", error);
    }
  };

  const handleSearch = (username: string) => {
    onSearch(username);
    setIsOpen(false);
  };

  // Format time helper - needs to be a function that can use current time
  const formatTimeAgo = useCallback(
    (timestamp: number): string => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) return t("just_now");
      if (seconds < 3600)
        return t("minutes_ago", { count: Math.floor(seconds / 60) });
      if (seconds < 86400)
        return t("hours_ago", { count: Math.floor(seconds / 3600) });
      if (seconds < 604800)
        return t("days_ago", { count: Math.floor(seconds / 86400) });

      return t("on_date", {
        date: new Date(timestamp).toLocaleDateString(),
      });
    },
    [t],
  );

  // Expose addSearch method to parent via ref pattern or custom hook
  // For now, we'll use a global event approach
  useEffect(() => {
    const handleSearchComplete = (
      event: CustomEvent<{ username: string; resultCount?: number }>,
    ) => {
      addSearch(event.detail.username, event.detail.resultCount);
    };

    window.addEventListener(
      "search-complete",
      handleSearchComplete as EventListener,
    );

    return () => {
      window.removeEventListener(
        "search-complete",
        handleSearchComplete as EventListener,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - we want to register listener once

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("toggle_aria")}
        aria-expanded={isOpen}
        className={cn(
          "text-muted-foreground hover:text-foreground gap-2",
          isOpen && "bg-accent",
        )}
      >
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">{t("recent")}</span>
        <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {recentSearches.length}
        </span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className={cn(
              "absolute z-50 w-72 rounded-xl border bg-background shadow-lg animate-in fade-in zoom-in-95 duration-200",
              "top-full mt-2 max-h-96 overflow-hidden",
              "md:left-0 md:right-auto",
              "left-0 right-0 md:w-80",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">{t("title")}</h3>
              </div>
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {t("clear_all")}
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {recentSearches.map((search) => (
                <button
                  key={search.username}
                  type="button"
                  onClick={() => handleSearch(search.username)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3",
                    "hover:bg-accent transition-colors text-left",
                    "border-b last:border-b-0",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {search.username}
                      </span>
                      {search.resultCount !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          ({search.resultCount} {t("results")})
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(search.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => removeSearch(search.username, e)}
                    aria-label={t("remove_aria", { username: search.username })}
                    className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to trigger search complete event
export function recordSearchComplete(username: string, resultCount?: number) {
  window.dispatchEvent(
    new CustomEvent("search-complete", { detail: { username, resultCount } }),
  );
}
