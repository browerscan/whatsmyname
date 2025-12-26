"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { formatNumber } from "@/lib";

interface SearchProgressProps {
  total: number;
  completed: number;
  percentage: number;
  isSearching: boolean;
}

export function SearchProgress({
  total,
  completed,
  percentage,
  isSearching,
}: SearchProgressProps) {
  const tStatus = useTranslations("results.status");

  if (!isSearching && total === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl bg-gradient-subtle border border-border/30 p-6 shadow-custom-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {isSearching && (
            <Loader2
              className="h-4 w-4 text-primary animate-spin"
              aria-hidden="true"
            />
          )}
          <h3 className="text-sm font-semibold">
            {isSearching ? tStatus("searching") : tStatus("complete")}
          </h3>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {formatNumber(completed)} / {formatNumber(total)} ({percentage}%)
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={tStatus("progress_aria", { percentage })}
        >
          {/* Animated shimmer effect */}
          {isSearching && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>

      {/* Additional info */}
      {isSearching && total > 0 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {tStatus("checking", { total: formatNumber(total) })}
        </p>
      )}
    </div>
  );
}
