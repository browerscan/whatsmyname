import { ResultStatus } from "@/types";

/**
 * Status filter options for the filter bar
 * Extracted to a constant for better maintainability and consistency
 */
export const STATUS_FILTER_OPTIONS: readonly {
  value: ResultStatus;
  label: string;
}[] = [
  { value: "all", label: "all" },
  { value: "found", label: "found" },
  { value: "not-found", label: "not_found" },
] as const;

/**
 * Type representing the status filter option
 */
export type StatusFilterOption = (typeof STATUS_FILTER_OPTIONS)[number];

/**
 * Get the label key for a given status value
 * @param status - The status value to get the label for
 * @returns The label key for translation
 */
export function getStatusLabelKey(status: ResultStatus): string {
  const option = STATUS_FILTER_OPTIONS.find((opt) => opt.value === status);
  return option?.label ?? "all";
}

/**
 * Check if a status value is valid
 * @param status - The status value to validate
 * @returns True if the status is valid
 */
export function isValidStatus(status: string): status is ResultStatus {
  return STATUS_FILTER_OPTIONS.some((opt) => opt.value === status);
}
