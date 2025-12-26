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
  const tGoogle = useTranslations("home.google");
  const tTabs = useTranslations("results.tabs");
  const tResults = useTranslations("results");

  // Store state - using useShallow to prevent unnecessary re-renders
  // All selectors are now combined into a single subscription with shallow comparison
  const {
    username,
    isSearching,
    whatsMyNameResults,
    googleResults,
    googleQuery,
    googleSearchInformation,
    googleError,
    error,
    progress,
  } = useSearchStore(
    useShallow((state) => ({
      username: state.username,
      isSearching: state.isSearching,
      whatsMyNameResults: state.whatsMyNameResults,
      googleResults: state.googleResults,
      googleQuery: state.googleQuery,
      googleSearchInformation: state.googleSearchInformation,
      googleError: state.googleError,
      error: state.error,
      progress: state.progress,
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
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-10">
      {/* Hero Section with Gradient */}
      <section className="space-y-6 rounded-3xl bg-gradient-subtle backdrop-blur-sm border border-border/50 p-8 md:p-12 shadow-custom-lg">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
              {tHero("kicker")}
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
              {tHero("title_prefix")}{" "}
              <span className="text-gradient">{tHero("title_highlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tHero("description")}
            </p>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </section>

      {/* Results Section */}
      {showResultsSection && (
        <section className="space-y-8">
          {error && (
            <Alert variant="destructive" className="rounded-2xl">
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
            <TabsList className="mb-6 rounded-2xl">
              <TabsTrigger value="platforms" className="rounded-xl">
                <span className="flex items-center gap-2">
                  {tTabs("platforms", { count: whatsMyNameResults.length })}
                  {isSearching && progress.total > 0 && (
                    <span className="text-xs font-medium text-primary">
                      {progress.percentage}%
                    </span>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value="google" className="rounded-xl">
                {tTabs("google", { count: googleResults.length })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="platforms" className="space-y-6">
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

            <TabsContent value="google" className="space-y-4">
              {username && (
                <div className="flex items-center justify-between gap-4 flex-wrap rounded-2xl bg-muted/20 border border-border/30 px-5 py-4">
                  <div className="text-sm text-muted-foreground">
                    {googleSearchInformation ? (
                      <>
                        <span className="font-medium text-foreground">
                          {tGoogle("about_results", {
                            total_results: formatNumberString(
                              googleSearchInformation.totalResults,
                            ),
                          })}
                        </span>
                        <span>
                          {" "}
                          {tGoogle("seconds", {
                            seconds:
                              googleSearchInformation.searchTime.toFixed(2),
                          })}
                        </span>
                      </>
                    ) : (
                      <span>
                        {tGoogle("for_prefix")}{" "}
                        <span className="font-mono text-foreground">
                          @{username}
                        </span>
                      </span>
                    )}
                    {googleQuery && (
                      <span className="ml-2 text-xs text-muted-foreground/80 inline-block max-w-[28rem] truncate align-bottom">
                        {tGoogle("query_prefix")} {googleQuery}
                      </span>
                    )}
                  </div>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `@${username}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                    aria-label={tGoogle("open_in_google_aria")}
                  >
                    {tGoogle("open_in_google")}
                  </a>
                </div>
              )}

              {googleError && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertDescription>{googleError}</AlertDescription>
                </Alert>
              )}

              {googleResults.length > 0 ? (
                googleResults.map((result, index) => (
                  <GoogleResultCard
                    key={result.link || index}
                    result={result}
                    index={index}
                    username={username}
                  />
                ))
              ) : isSearching ? (
                <GoogleResultsSkeleton />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>{tResults("empty_google")}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <section className="text-center py-20 rounded-3xl bg-gradient-subtle border border-border/30 shadow-custom-md">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
            {tEmpty("kicker")}
          </p>
          <h2 className="text-2xl font-semibold mb-4">{tEmpty("title")}</h2>
          <p className="text-muted-foreground">{tEmpty("description")}</p>
        </section>
      )}

      {/* AI Button - Always visible for testing */}
      <AIButton disabled={isSearching} />

      {/* AI Dialog */}
      <AIDialog />
    </div>
  );
}
