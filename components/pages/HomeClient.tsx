"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/shallow";
import {
  SearchBar,
  PlatformGrid,
  GoogleResultCard,
  ResultsHeader,
  FilterBar,
  AIButton,
  SearchProgress,
  PlatformGridSkeleton,
  GoogleResultsSkeleton,
} from "@/components/features";
import { useSearchStore } from "@/stores";
import { getUniqueCategories } from "@/lib/filters";
import { FilterOptions, SortOptions } from "@/types";
import {
  DEFAULT_FILTER_OPTIONS,
  DEFAULT_SORT_OPTIONS,
  STORAGE_KEYS,
} from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatNumberString } from "@/lib/formatters";
import { useUsernameSearch } from "@/hooks/useUsernameSearch";

// Dynamic import for AI Dialog (lazy loaded, code splitting)
const AIDialog = dynamic(
  () =>
    import("@/components/features/AIDialog").then((mod) => ({
      default: mod.AIDialog,
    })),
  {
    loading: () => <span className="sr-only" />,
    ssr: false, // Don't render on server
  },
);

/**
 * HomeClient Component - Main client-side home page component
 * Refactored to use useUsernameSearch hook for better code organization
 * and improved performance with client-side caching
 */
export function HomeClient() {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [sortOptions] = useState<SortOptions>(DEFAULT_SORT_OPTIONS);

  // Translations
  const tHero = useTranslations("home.hero");
  const tEmpty = useTranslations("home.empty");
  const tWeb = useTranslations("home.web");
  const tTabs = useTranslations("results.tabs");
  const tResults = useTranslations("results");

  // Store state - using useShallow to prevent unnecessary re-renders
  const {
    username,
    isSearching,
    whatsMyNameResults,
    googleResults,
    googleQuery,
    googleSearchInformation,
    googleNextStartIndex,
    googleIsLoadingMore,
    googleError,
    error,
    progress,
    appendGoogleResults,
    setGoogleLoadingMore,
  } = useSearchStore(
    useShallow((state) => ({
      username: state.username,
      isSearching: state.isSearching,
      whatsMyNameResults: state.whatsMyNameResults,
      googleResults: state.googleResults,
      googleQuery: state.googleQuery,
      googleSearchInformation: state.googleSearchInformation,
      googleNextStartIndex: state.googleNextStartIndex,
      googleIsLoadingMore: state.googleIsLoadingMore,
      googleError: state.googleError,
      error: state.error,
      progress: state.progress,
      appendGoogleResults: state.appendGoogleResults,
      setGoogleLoadingMore: state.setGoogleLoadingMore,
    })),
  );

  // Custom hook for username search with caching and optimized streaming
  const { search } = useUsernameSearch({
    enableCache: true,
    onSearchStart: useCallback(() => {
      // Optional: Track analytics or update UI state
    }, []),
    onSearchComplete: useCallback(() => {
      // Optional: Track analytics or update UI state
    }, []),
    onError: useCallback(() => {
      // Optional: Track errors
    }, []),
  });

  // Memoized computed values for better performance
  const categories = useMemo(
    () => getUniqueCategories(whatsMyNameResults),
    [whatsMyNameResults],
  );

  const foundCount = useMemo(
    () => whatsMyNameResults.filter((r) => r.checkResult.isExist).length,
    [whatsMyNameResults],
  );

  // Optimized search handler
  const handleSearch = useCallback(
    (searchUsername: string) => {
      search(searchUsername);
    },
    [search],
  );

  // Load more Google results handler
  const handleLoadMoreGoogle = useCallback(async () => {
    if (!username || !googleNextStartIndex || googleIsLoadingMore) return;

    setGoogleLoadingMore(true);
    try {
      const response = await fetch(
        `/api/search/google?username=${encodeURIComponent(username)}&start=${googleNextStartIndex}`,
      );
      if (response.ok) {
        const data = await response.json();
        appendGoogleResults(data);
      }
    } catch {
      // Silently fail, user can try again
    } finally {
      setGoogleLoadingMore(false);
    }
  }, [
    username,
    googleNextStartIndex,
    googleIsLoadingMore,
    appendGoogleResults,
    setGoogleLoadingMore,
  ]);

  // Persist filter preferences
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Optionally save to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEYS.FILTER_PREFERENCES,
        JSON.stringify(newFilters),
      );
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  // Show results section if there are results, errors, or search is in progress
  const showResultsSection =
    whatsMyNameResults.length > 0 ||
    googleResults.length > 0 ||
    isSearching ||
    error ||
    googleError;

  // Show empty state if no results, errors, or search is in progress
  const showEmptyState =
    !isSearching &&
    !error &&
    !googleError &&
    whatsMyNameResults.length === 0 &&
    googleResults.length === 0;

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl space-y-16">
      {/* Hero Section with Modern Tech Styling */}
      <section className="space-y-8 animate-fade-in">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-subtle" />
          <div className="absolute inset-0 tech-grid opacity-30" />

          {/* Glass effect overlay */}
          <div className="relative glass-strong rounded-3xl border border-border/40 p-10 md:p-16 shadow-custom-lg">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex animate-scale-in">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-[0.3em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {tHero("kicker")}
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                  {tHero("title_prefix")}{" "}
                  <span className="text-gradient inline-block hover:scale-105 transition-transform duration-300 cursor-default">
                    {tHero("title_highlight")}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {tHero("description")}
                </p>
              </div>

              {/* Search Bar */}
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResultsSection && (
        <section className="space-y-8 animate-fade-in">
          {error && (
            <Alert variant="destructive" className="rounded-2xl glass">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ResultsHeader
            totalResults={whatsMyNameResults.length}
            foundResults={foundCount}
            isLoading={isSearching}
            username={username}
          />

          {/* Search Progress Bar */}
          <SearchProgress
            total={progress.total}
            completed={progress.completed}
            percentage={progress.percentage}
            isSearching={isSearching}
          />

          <Tabs defaultValue="platforms" className="w-full">
            <TabsList className="mb-8 rounded-2xl p-1.5 bg-muted/30 backdrop-blur-sm border border-border/40">
              <TabsTrigger
                value="platforms"
                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg"
              >
                <span className="flex items-center gap-2">
                  {tTabs("platforms", { count: whatsMyNameResults.length })}
                  {isSearching && progress.total > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                      {progress.percentage}%
                    </span>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="google"
                className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg"
              >
                {tTabs("web", { count: googleResults.length })}
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="platforms"
              className="space-y-6 animate-fade-in"
            >
              {whatsMyNameResults.length > 0 && (
                <>
                  <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    categories={categories}
                  />
                  <PlatformGrid
                    results={whatsMyNameResults}
                    filters={filters}
                    sortOptions={sortOptions}
                  />
                </>
              )}
              {isSearching && whatsMyNameResults.length === 0 && (
                <PlatformGridSkeleton />
              )}
            </TabsContent>

            <TabsContent value="google" className="space-y-4 animate-fade-in">
              {username && (
                <div className="flex items-center justify-between gap-4 flex-wrap rounded-2xl glass px-6 py-4 border border-border/40">
                  <div className="text-sm text-muted-foreground">
                    {googleSearchInformation ? (
                      <>
                        <span className="font-medium text-foreground">
                          {tWeb("about_results", {
                            total_results: formatNumberString(
                              googleSearchInformation.totalResults,
                            ),
                          })}
                        </span>
                        <span>
                          {" "}
                          {tWeb("seconds", {
                            seconds:
                              googleSearchInformation.searchTime.toFixed(2),
                          })}
                        </span>
                      </>
                    ) : (
                      <span>
                        {tWeb("for_prefix")}{" "}
                        <span className="font-mono text-primary">
                          @{username}
                        </span>
                      </span>
                    )}
                    {googleQuery && (
                      <span className="ml-2 text-xs text-muted-foreground/80 inline-block max-w-[28rem] truncate align-bottom">
                        {tWeb("query_prefix")} {googleQuery}
                      </span>
                    )}
                  </div>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `@${username}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent hover:underline transition-colors"
                    aria-label={tWeb("open_in_google_aria")}
                  >
                    {tWeb("open_in_google")}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              )}

              {googleError && (
                <Alert variant="destructive" className="rounded-2xl glass">
                  <AlertDescription>{googleError}</AlertDescription>
                </Alert>
              )}

              {googleResults.length > 0 ? (
                <>
                  {googleResults.map((result, index) => (
                    <GoogleResultCard
                      key={result.link || index}
                      result={result}
                      index={index}
                      username={username}
                    />
                  ))}
                  {/* Load More Button */}
                  {googleNextStartIndex && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleLoadMoreGoogle}
                        disabled={googleIsLoadingMore}
                        variant="outline"
                        className="rounded-xl px-8"
                      >
                        {googleIsLoadingMore ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            {tWeb("loading_more")}
                          </>
                        ) : (
                          <>
                            {tWeb("load_more")}
                            <span className="ml-2 text-muted-foreground">
                              ({googleResults.length} /{" "}
                              {googleSearchInformation?.totalResults || "?"})
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : isSearching ? (
                <GoogleResultsSkeleton />
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p>{tResults("empty_web")}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <section className="text-center py-24 rounded-3xl glass border border-border/30 shadow-custom-md animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-6 animate-float">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
            {tEmpty("kicker")}
          </p>
          <h2 className="text-2xl font-semibold mb-4">{tEmpty("title")}</h2>
          <p className="text-muted-foreground">{tEmpty("description")}</p>
        </section>
      )}

      {/* AI Button - Always visible */}
      <AIButton disabled={isSearching} />

      {/* AI Dialog */}
      <AIDialog />
    </div>
  );
}
