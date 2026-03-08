"use client";

import { useTranslations } from "next-intl";
import { GoogleResultCard } from "@/components/features";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatNumberString } from "@/lib/formatters";
import { GoogleResult, GoogleSearchResponse } from "@/types";

interface GooglePanelProps {
  googleError: string | null;
  googleIsLoadingMore: boolean;
  googleNextStartIndex: number | null;
  googleQuery: string | null;
  googleResults: GoogleResult[];
  googleSearchInformation: GoogleSearchResponse["searchInformation"] | null;
  isSearching: boolean;
  onLoadMore: () => void | Promise<void>;
  username: string;
}

export function GooglePanel({
  googleError,
  googleIsLoadingMore,
  googleNextStartIndex,
  googleQuery,
  googleResults,
  googleSearchInformation,
  isSearching,
  onLoadMore,
  username,
}: GooglePanelProps) {
  const tWeb = useTranslations("home.web");
  const tResults = useTranslations("results");

  return (
    <>
      {username && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/40 px-6 py-4 glass">
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
                    seconds: googleSearchInformation.searchTime.toFixed(2),
                  })}
                </span>
              </>
            ) : (
              <span>
                {tWeb("for_prefix")} {" "}
                <span className="font-mono text-primary">@{username}</span>
              </span>
            )}

            {googleQuery && (
              <span className="ml-2 inline-block max-w-[28rem] truncate align-bottom text-xs text-muted-foreground/80">
                {tWeb("query_prefix")} {googleQuery}
              </span>
            )}
          </div>

          <a
            aria-label={tWeb("open_in_google_aria")}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent hover:underline"
            href={`https://www.google.com/search?q=${encodeURIComponent(`@${username}`)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {tWeb("open_in_google")}
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </a>
        </div>
      )}

      {googleError && (
        <Alert className="rounded-2xl glass" variant="destructive">
          <AlertDescription>{googleError}</AlertDescription>
        </Alert>
      )}

      {googleResults.length > 0 ? (
        <>
          {googleResults.map((result, index) => (
            <GoogleResultCard
              index={index}
              key={result.link || index}
              result={result}
              username={username}
            />
          ))}

          {googleNextStartIndex && (
            <div className="flex justify-center pt-4">
              <Button
                className="rounded-xl px-8"
                disabled={googleIsLoadingMore}
                onClick={onLoadMore}
                variant="outline"
              >
                {googleIsLoadingMore ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                    {tWeb("loading_more")}
                  </>
                ) : (
                  <>
                    {tWeb("load_more")}
                    <span className="ml-2 text-muted-foreground">
                      ({googleResults.length} / {googleSearchInformation?.totalResults || "?"})
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : !isSearching ? (
        <div className="py-16 text-center text-muted-foreground">
          <p>{tResults("empty_web")}</p>
        </div>
      ) : null}
    </>
  );
}
