"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FilterBar,
  GoogleResultsSkeleton,
  PlatformGridSkeleton,
  ResultsHeader,
  SearchProgress,
} from "@/components/features";
import {
  FilterOptions,
  GoogleResult,
  GoogleSearchResponse,
  SearchProgress as SearchProgressState,
  SearchResult,
  SortOptions,
} from "@/types";
import { GooglePanel } from "./GooglePanel";

const PlatformGrid = dynamic(
  () => import("@/components/features/PlatformGrid").then((mod) => ({ default: mod.PlatformGrid })),
  {
    loading: () => <PlatformGridSkeleton />,
    ssr: false,
  },
);

interface ResultsPanelProps {
  categories: string[];
  error: string | null;
  filters: FilterOptions;
  foundCount: number;
  googleError: string | null;
  googleIsLoadingMore: boolean;
  googleNextStartIndex: number | null;
  googleQuery: string | null;
  googleResults: GoogleResult[];
  googleSearchInformation: GoogleSearchResponse["searchInformation"] | null;
  isSearching: boolean;
  onFilterChange: (filters: FilterOptions) => void;
  onLoadMoreGoogle: () => void | Promise<void>;
  progress: SearchProgressState;
  sortOptions: SortOptions;
  username: string;
  whatsMyNameResults: SearchResult[];
}

export function ResultsPanel({
  categories,
  error,
  filters,
  foundCount,
  googleError,
  googleIsLoadingMore,
  googleNextStartIndex,
  googleQuery,
  googleResults,
  googleSearchInformation,
  isSearching,
  onFilterChange,
  onLoadMoreGoogle,
  progress,
  sortOptions,
  username,
  whatsMyNameResults,
}: ResultsPanelProps) {
  const tTabs = useTranslations("results.tabs");
  const useWebFallback = Boolean(error && googleResults.length > 0 && whatsMyNameResults.length === 0);

  return (
    <section className="space-y-8 animate-fade-in">
      {error && (
        <Alert className="rounded-2xl glass" variant="destructive">
          <AlertDescription>{tTabs("platform_unavailable")}</AlertDescription>
        </Alert>
      )}

      {(!error || whatsMyNameResults.length > 0) && <ResultsHeader
        foundResults={foundCount}
        isLoading={isSearching}
        totalResults={whatsMyNameResults.length}
        username={username}
      />}

      <SearchProgress
        completed={progress.completed}
        isSearching={isSearching}
        percentage={progress.percentage}
        total={progress.total}
      />

      <Tabs key={useWebFallback ? "web-fallback" : "normal"} className="w-full" defaultValue={useWebFallback ? "google" : "platforms"}>
        <TabsList className="mb-6 flex h-auto w-full rounded-2xl border border-border/40 bg-muted/40 p-1.5 backdrop-blur-sm sm:mb-8 sm:inline-flex sm:w-auto">
          <TabsTrigger
            className="min-w-0 flex-1 whitespace-normal rounded-xl px-2 py-1.5 text-center text-xs leading-snug data-[state=active]:bg-background data-[state=active]:shadow-custom-sm sm:flex-none sm:whitespace-nowrap sm:px-3 sm:text-sm"
            value="platforms"
          >
            <span className="flex items-center gap-2">
              {tTabs("platforms", { count: whatsMyNameResults.length })}
              {isSearching && progress.total > 0 && (
                <span className="hidden items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary sm:inline-flex">
                  {progress.percentage}%
                </span>
              )}
            </span>
          </TabsTrigger>

          <TabsTrigger
            className="min-w-0 flex-1 whitespace-normal rounded-xl px-2 py-1.5 text-center text-xs leading-snug data-[state=active]:bg-background data-[state=active]:shadow-custom-sm sm:flex-none sm:whitespace-nowrap sm:px-3 sm:text-sm"
            value="google"
          >
            {tTabs("web", { count: googleResults.length })}
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6 animate-fade-in" value="platforms">
          {whatsMyNameResults.length > 0 && (
            <>
              <FilterBar
                categories={categories}
                filters={filters}
                onFilterChange={onFilterChange}
              />
              <PlatformGrid
                filters={filters}
                results={whatsMyNameResults}
                sortOptions={sortOptions}
              />
            </>
          )}

          {isSearching && whatsMyNameResults.length === 0 && <PlatformGridSkeleton />}
        </TabsContent>

        <TabsContent className="space-y-4 animate-fade-in" value="google">
          <GooglePanel
            googleError={googleError}
            googleIsLoadingMore={googleIsLoadingMore}
            googleNextStartIndex={googleNextStartIndex}
            googleQuery={googleQuery}
            googleResults={googleResults}
            googleSearchInformation={googleSearchInformation}
            isSearching={isSearching}
            onLoadMore={onLoadMoreGoogle}
            username={username}
          />

          {isSearching && googleResults.length === 0 && <GoogleResultsSkeleton />}
        </TabsContent>
      </Tabs>
    </section>
  );
}
