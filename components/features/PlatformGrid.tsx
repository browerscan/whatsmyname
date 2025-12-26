"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlatformCard } from "./PlatformCard";
import { SearchResult, FilterOptions, SortOptions } from "@/types";
import { filterResults, sortResults } from "@/lib";
import { useTranslations } from "next-intl";
import { VIRTUAL_SCROLL_CONFIG } from "@/lib/constants";

interface PlatformGridProps {
  results: SearchResult[];
  filters: FilterOptions;
  sortOptions: SortOptions;
}

function useResponsiveColumns() {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      setColumns(lg.matches ? 3 : md.matches ? 2 : 1);
    };

    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);

  return columns;
}

export function PlatformGrid({
  results,
  filters,
  sortOptions,
}: PlatformGridProps) {
  const t = useTranslations("results");
  const columns = useResponsiveColumns();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Filter and sort results
  const processedResults = useMemo(() => {
    const filtered = filterResults(results, filters);
    return sortResults(filtered, sortOptions);
  }, [results, filters, sortOptions]);

  const rows = useMemo(() => {
    const chunked: SearchResult[][] = [];
    for (let i = 0; i < processedResults.length; i += columns) {
      chunked.push(processedResults.slice(i, i + columns));
    }
    return chunked;
  }, [columns, processedResults]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =>
      scrollAreaRef.current?.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]",
      ) ?? null,
    estimateSize: () => Math.max(140, VIRTUAL_SCROLL_CONFIG.ITEM_HEIGHT),
    overscan: VIRTUAL_SCROLL_CONFIG.OVERSCAN,
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [columns, rowVirtualizer, rows.length]);

  if (processedResults.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">{t("empty_platforms_title")}</p>
        <p className="text-sm mt-2">{t("empty_platforms_description")}</p>
      </div>
    );
  }

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="h-[600px] w-full rounded-md border p-4"
    >
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {row.map((result) => (
                  <PlatformCard
                    key={`${result.source}:${result.url}`}
                    result={result}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
