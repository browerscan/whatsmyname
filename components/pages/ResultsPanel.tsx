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

  return (
    <section className="space-y-8 animate-fade-in">
      {error && (
        <Alert className="rounded-2xl glass" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ResultsHeader
        foundResults={foundCount}
        isLoading={isSearching}
        totalResults={whatsMyNameResults.length}
        username={username}
      />

      <SearchProgress
        completed={progress.completed}
        isSearching={isSearching}
        percentage={progress.percentage}
        total={progress.total}
      />

      <Tabs className="w-full" defaultValue="platforms">
        <TabsList className="mb-8 rounded-2xl border border-border/40 bg-muted/30 p-1.5 backdrop-blur-sm">
          <TabsTrigger
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg"
            value="platforms"
          >
            <span className="flex items-center gap-2">
              {tTabs("platforms", { count: whatsMyNameResults.length })}
              {isSearching && progress.total > 0 && (
                <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                  {progress.percentage}%
                </span>
              )}
            </span>
          </TabsTrigger>

          <TabsTrigger
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg"
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
