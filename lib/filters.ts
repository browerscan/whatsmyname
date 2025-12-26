import { SearchResult, FilterOptions, SortOptions } from "@/types";

/**
 * Filter search results based on filter options
 */
export function filterResults(
  results: SearchResult[],
  filters: FilterOptions,
): SearchResult[] {
  const status = filters.status;
  const category = filters.category;
  const showNSFW = filters.showNSFW;
  const query = filters.searchQuery.trim().toLowerCase();

  return results.filter((result) => {
    // Filter by status
    if (status === "found" && !result.checkResult.isExist) {
      return false;
    }
    if (status === "not-found" && result.checkResult.isExist) {
      return false;
    }

    // Filter by category
    if (category && result.category !== category) {
      return false;
    }

    // Filter NSFW content
    if (!showNSFW && result.isNSFW) {
      return false;
    }

    // Filter by search query (source name)
    if (query) {
      const sourceLower = result.source.toLowerCase();
      if (!sourceLower.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort search results based on sort options
 */
export function sortResults(
  results: SearchResult[],
  sortOptions: SortOptions,
): SearchResult[] {
  const sorted = [...results];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortOptions.sortBy) {
      case "response-time":
        comparison = a.checkResult.responseTime - b.checkResult.responseTime;
        break;

      case "alphabetical":
        comparison = a.source.localeCompare(b.source);
        break;

      case "default":
      default:
        // Default: Found first, then by response time
        if (a.checkResult.isExist !== b.checkResult.isExist) {
          return a.checkResult.isExist ? -1 : 1;
        }
        comparison = a.checkResult.responseTime - b.checkResult.responseTime;
        break;
    }

    return sortOptions.order === "asc" ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Get unique categories from results
 */
export function getUniqueCategories(results: SearchResult[]): string[] {
  const categories = new Set<string>();
  results.forEach((result) => {
    if (result.category) {
      categories.add(result.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get statistics from results
 */
export function getResultStats(results: SearchResult[]) {
  const total = results.length;
  const found = results.filter((r) => r.checkResult.isExist).length;
  const notFound = total - found;
  const nsfw = results.filter((r) => r.isNSFW).length;

  const totalResponseTime = results.reduce(
    (sum, r) => sum + r.checkResult.responseTime,
    0,
  );
  const avgResponseTime = total > 0 ? totalResponseTime / total : 0;

  const categoryCounts = results.reduce(
    (acc, result) => {
      acc[result.category] = (acc[result.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    total,
    found,
    notFound,
    nsfw,
    avgResponseTime,
    categoryCounts,
  };
}

/**
 * Group results by category
 */
export function groupByCategory(
  results: SearchResult[],
): Record<string, SearchResult[]> {
  return results.reduce(
    (acc, result) => {
      const category = result.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );
}
