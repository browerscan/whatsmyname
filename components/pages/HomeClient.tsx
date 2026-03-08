"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";
import {
  AIButton,
  GoogleResultsSkeleton,
  PlatformGridSkeleton,
} from "@/components/features";
import { useUsernameSearch } from "@/hooks/useUsernameSearch";
import { STORAGE_KEYS, DEFAULT_FILTER_OPTIONS, DEFAULT_SORT_OPTIONS } from "@/lib/constants";
import { getUniqueCategories } from "@/lib/filters";
import { useSearchStore } from "@/stores";
import { FilterOptions, SortOptions } from "@/types";
import { SearchHero } from "./SearchHero";

const ResultsPanel = dynamic(
  () => import("./ResultsPanel").then((mod) => ({ default: mod.ResultsPanel })),
  {
    loading: () => (
      <section className="space-y-6 animate-fade-in">
        <PlatformGridSkeleton />
        <GoogleResultsSkeleton />
      </section>
    ),
    ssr: false,
  },
);

const AIDialog = dynamic(
  () =>
    import("@/components/features/AIDialog").then((mod) => ({
      default: mod.AIDialog,
    })),
  {
    loading: () => <span className="sr-only" />,
    ssr: false,
  },
);

export function HomeClient() {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [sortOptions] = useState<SortOptions>(DEFAULT_SORT_OPTIONS);
  const tEmpty = useTranslations("home.empty");

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

  const { search } = useUsernameSearch({
    enableCache: true,
    onSearchStart: useCallback(() => {}, []),
    onSearchComplete: useCallback(() => {}, []),
    onError: useCallback(() => {}, []),
  });

  const categories = useMemo(
    () => getUniqueCategories(whatsMyNameResults),
    [whatsMyNameResults],
  );

  const foundCount = useMemo(
    () => whatsMyNameResults.filter((result) => result.checkResult.isExist).length,
    [whatsMyNameResults],
  );

  const handleSearch = useCallback(
    (searchUsername: string) => {
      search(searchUsername);
    },
    [search],
  );

  const handleLoadMoreGoogle = useCallback(async () => {
    if (!username || !googleNextStartIndex || googleIsLoadingMore) {
      return;
    }

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
    } finally {
      setGoogleLoadingMore(false);
    }
  }, [
    appendGoogleResults,
    googleIsLoadingMore,
    googleNextStartIndex,
    setGoogleLoadingMore,
    username,
  ]);

  const handleFilterChange = useCallback((nextFilters: FilterOptions) => {
    setFilters(nextFilters);

    try {
      localStorage.setItem(
        STORAGE_KEYS.FILTER_PREFERENCES,
        JSON.stringify(nextFilters),
      );
    } catch {
    }
  }, []);

  const showResultsSection =
    whatsMyNameResults.length > 0 ||
    googleResults.length > 0 ||
    isSearching ||
    Boolean(error) ||
    Boolean(googleError);

  const showEmptyState =
    !isSearching &&
    !error &&
    !googleError &&
    whatsMyNameResults.length === 0 &&
    googleResults.length === 0;

  return (
    <div className="container mx-auto max-w-7xl space-y-16 px-4 py-16">
      <SearchHero isSearching={isSearching} onSearch={handleSearch} />

      {showResultsSection && (
        <ResultsPanel
          categories={categories}
          error={error}
          filters={filters}
          foundCount={foundCount}
          googleError={googleError}
          googleIsLoadingMore={googleIsLoadingMore}
          googleNextStartIndex={googleNextStartIndex}
          googleQuery={googleQuery}
          googleResults={googleResults}
          googleSearchInformation={googleSearchInformation}
          isSearching={isSearching}
          onFilterChange={handleFilterChange}
          onLoadMoreGoogle={handleLoadMoreGoogle}
          progress={progress}
          sortOptions={sortOptions}
          username={username}
          whatsMyNameResults={whatsMyNameResults}
        />
      )}

      {showEmptyState && (
        <section className="animate-fade-in rounded-3xl border border-border/30 py-24 text-center shadow-custom-md glass">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 animate-float">
            <svg
              className="h-8 w-8 text-muted-foreground"
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
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {tEmpty("kicker")}
          </p>
          <h2 className="mb-4 text-2xl font-semibold">{tEmpty("title")}</h2>
          <p className="text-muted-foreground">{tEmpty("description")}</p>
        </section>
      )}

      <AIButton disabled={isSearching} />
      <AIDialog />
    </div>
  );
}
