"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { FilterOptions, ResultStatus } from "@/types";
import { useTranslations } from "next-intl";
import { DEBOUNCE_DELAYS } from "@/lib/constants";
import { STATUS_FILTER_OPTIONS } from "@/lib/filterConstants";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
}

const INITIAL_CATEGORY_DISPLAY = 10;

export function FilterBar({
  filters,
  onFilterChange,
  categories,
}: FilterBarProps) {
  const t = useTranslations("filters");
  const [searchText, setSearchText] = useState(filters.searchQuery);
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Translate status labels once using constant
  const statusOptions = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.label),
      })),
    [t],
  );

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const search = categorySearch.toLowerCase();
    return categories.filter((cat) => cat.toLowerCase().includes(search));
  }, [categories, categorySearch]);

  // Determine which categories to show
  const displayedCategories = useMemo(() => {
    if (showAllCategories || categorySearch.trim()) {
      return filteredCategories;
    }
    return filteredCategories.slice(0, INITIAL_CATEGORY_DISPLAY);
  }, [filteredCategories, showAllCategories, categorySearch]);

  const hasMoreCategories =
    filteredCategories.length > INITIAL_CATEGORY_DISPLAY;
  const hasHiddenCategories =
    !showAllCategories && filteredCategories.length > INITIAL_CATEGORY_DISPLAY;

  const handleStatusChange = (status: ResultStatus) => {
    onFilterChange({ ...filters, status });
  };

  const handleCategoryChange = (category: string | null) => {
    onFilterChange({ ...filters, category });
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleNSFWToggle = () => {
    onFilterChange({ ...filters, showNSFW: !filters.showNSFW });
  };

  const toggleShowAllCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.category !== null ||
    filters.searchQuery !== "" ||
    filters.showNSFW;

  const clearFilters = () => {
    setSearchText("");
    setCategorySearch("");
    setShowAllCategories(false);
    onFilterChange({
      status: "all",
      category: null,
      showNSFW: false,
      searchQuery: "",
    });
  };

  useEffect(() => {
    const trimmed = searchText;
    if (trimmed === filters.searchQuery) return;

    const timeoutId = setTimeout(() => {
      onFilterChange({ ...filters, searchQuery: trimmed });
    }, DEBOUNCE_DELAYS.FILTER_CHANGE);

    return () => clearTimeout(timeoutId);
  }, [filters, onFilterChange, searchText]);

  // Focus category search when expanded
  useEffect(() => {
    if (showAllCategories && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAllCategories]);

  return (
    <div className="space-y-5 mb-6 p-6 bg-gradient-subtle border border-border/30 rounded-2xl shadow-custom-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
        {t("title")}
      </p>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("search_placeholder")}
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-11 rounded-xl border-2 shadow-custom-sm"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3 block">
          {t("status_label")}
        </label>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <Badge
              key={option.value}
              variant={filters.status === option.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors rounded-xl px-4 py-1.5"
              onClick={() => handleStatusChange(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3 block">
            {t("category_label")}
          </label>

          {/* Category Search - shown when there are many categories */}
          {categories.length > INITIAL_CATEGORY_DISPLAY && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={t("search_categories_placeholder")}
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-9 h-8 text-sm rounded-lg border border-border/50"
                onClick={() => {
                  if (!showAllCategories) setShowAllCategories(true);
                }}
              />
              {categorySearch && (
                <button
                  type="button"
                  onClick={() => setCategorySearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label={t("clear_category_search")}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={filters.category === null ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors rounded-xl px-4 py-1.5"
              onClick={() => handleCategoryChange(null)}
            >
              {t("all_categories")}
            </Badge>
            {displayedCategories.map((category) => (
              <Badge
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                className={cn(
                  "cursor-pointer hover:bg-primary/90 transition-colors rounded-xl px-4 py-1.5",
                  categorySearch &&
                    category
                      .toLowerCase()
                      .includes(categorySearch.toLowerCase()) &&
                    "ring-2 ring-primary/30",
                )}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Show More/Less Button */}
          {hasMoreCategories && !categorySearch && (
            <button
              type="button"
              onClick={toggleShowAllCategories}
              className="mt-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {hasHiddenCategories ? (
                <>
                  <span>
                    {t("show_more", {
                      count:
                        filteredCategories.length - INITIAL_CATEGORY_DISPLAY,
                    })}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>{t("show_less")}</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              )}
            </button>
          )}

          {/* No results message */}
          {categorySearch && filteredCategories.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("no_categories_found")}
            </p>
          )}
        </div>
      )}

      {/* NSFW Toggle & Clear */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showNSFW}
            onChange={handleNSFWToggle}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm font-medium">{t("show_nsfw")}</span>
        </label>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="rounded-xl"
          >
            <X className="h-4 w-4 mr-1.5" />
            {t("clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
