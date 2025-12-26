"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

/**
 * Props for the ErrorPageContent component
 */
export interface ErrorPageContentProps {
  /** The error object caught by the error boundary */
  error: Error & { digest?: string };
  /** Reset function to retry rendering */
  reset: () => void;
  /** Context identifier for logging (e.g., "Global", "Locale") */
  errorContext?: string;
}

/**
 * Shared error page content component used by both root and locale error boundaries.
 * This eliminates code duplication between app/error.tsx and app/[locale]/error.tsx.
 *
 * Features:
 * - Consistent error UI across the application
 * - Internationalized text via next-intl
 * - Development-only error details display
 * - Retry and home navigation actions
 */
export function ErrorPageContent({
  error,
  reset,
  errorContext = "Error boundary",
}: ErrorPageContentProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error(errorContext, error);
  }, [error, errorContext]);

  const t = useTranslations("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title and Description */}
        <h1 className="mb-2 text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mb-6 text-muted-foreground">{t("description")}</p>

        {/* Development Error Details */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 rounded-lg bg-muted p-4 text-left">
            <p className="text-sm font-mono text-destructive break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                {t("error_id", { id: error.digest })}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {t("retry")}
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {t("go_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
