"use client";

import { ErrorPageContent } from "@/components/features";

/**
 * Locale-specific error boundary.
 * Uses the shared ErrorPageContent component for consistent error UI.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPageContent
      error={error}
      reset={reset}
      errorContext="Locale error boundary"
    />
  );
}
