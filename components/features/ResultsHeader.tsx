"use client";

import { formatNumber } from "@/lib";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ResultsHeaderProps {
  totalResults: number;
  foundResults: number;
  isLoading: boolean;
  username?: string;
}

export function ResultsHeader({
  totalResults,
  foundResults,
  isLoading,
  username,
}: ResultsHeaderProps) {
  const notFoundResults = totalResults - foundResults;
  const tHeader = useTranslations("results.header");
  const tStatus = useTranslations("results.status");

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-6 rounded-2xl bg-gradient-subtle border border-border/30 p-6 shadow-custom-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-2">
          {tHeader("kicker")}
        </p>
        <h2 className="text-2xl font-semibold">
          {username ? tHeader("title", { username }) : tHeader("title_default")}
        </h2>
        {totalResults > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {tHeader("platforms_checked", {
              count: formatNumber(totalResults),
              plural: totalResults !== 1 ? "s" : "",
            })}
          </p>
        )}
      </div>

      {/* ARIA live region for screen readers - announces result changes */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {isLoading
          ? tStatus("searching")
          : `${formatNumber(foundResults)} ${tStatus("found")}, ${formatNumber(notFoundResults)} ${tStatus("not_found")}`}
      </div>

      <div className="flex gap-3">
        {/* Found Count */}
        <div className="flex items-center gap-3 bg-green-500/10 px-5 py-3 rounded-2xl border border-green-500/20 shadow-custom-sm">
          <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              {tStatus("found")}
            </p>
            <p className="text-lg font-semibold text-green-500">
              {formatNumber(foundResults)}
            </p>
          </div>
        </div>

        {/* Not Found Count */}
        <div className="flex items-center gap-3 bg-muted/30 px-5 py-3 rounded-2xl border border-border shadow-custom-sm">
          <XCircle
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              {tStatus("not_found")}
            </p>
            <p className="text-lg font-semibold text-muted-foreground">
              {formatNumber(notFoundResults)}
            </p>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 bg-primary/10 px-5 py-3 rounded-2xl border border-primary/20 shadow-custom-sm">
            <Loader2
              className="h-4 w-4 text-primary animate-spin"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-primary">
              {tStatus("searching")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
