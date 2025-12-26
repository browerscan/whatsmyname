"use client";

import { useState, useEffect, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FilterOptions, ResultStatus } from "@/types";
import { cn } from "@/lib/utils";

interface MobileFilterSheetProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  resultCount?: number;
}

export function MobileFilterSheet({
  filters,
  onFilterChange,
  categories,
  resultCount,
}: MobileFilterSheetProps) {
  const t = useTranslations("filters");
  const [isOpen, setIsOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.category !== null ||
    filters.searchQuery !== "" ||
    filters.showNSFW;

  const clearFilters = () => {
    onFilterChange({
      status: "all",
      category: null,
      showNSFW: false,
      searchQuery: "",
    });
    setCategorySearch("");
  };

  const handleStatusChange = (status: ResultStatus) => {
    onFilterChange({ ...filters, status });
  };

  const handleCategoryChange = (category: string | null) => {
    onFilterChange({ ...filters, category });
  };

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant={hasActiveFilters ? "default" : "outline"}
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>{t("title")}</span>
        {resultCount !== undefined && (
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
            {resultCount}
          </Badge>
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[60] md:hidden",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div
          ref={contentRef}
          className="bg-background rounded-t-3xl border-t border-border shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-muted rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div>
              <h2 className="text-lg font-semibold">{t("title")}</h2>
              {resultCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {t("showing_results", { count: resultCount })}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label={t("close_aria")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {/* Search Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("search_placeholder")}
              </label>
              <Input
                type="text"
                placeholder={t("search_placeholder")}
                value={filters.searchQuery}
                onChange={(e) =>
                  onFilterChange({ ...filters, searchQuery: e.target.value })
                }
                className="rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                {t("status_label")}
              </label>
              <div className="flex gap-2">
                {[
                  { value: "all" as const, label: t("all") },
                  { value: "found" as const, label: t("found") },
                  { value: "not-found" as const, label: t("not_found") },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStatusChange(option.value)}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors",
                      filters.status === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("category_label")}
                </label>

                {/* Category Search */}
                {categories.length > 10 && (
                  <div className="relative mb-3">
                    <Input
                      type="text"
                      placeholder={t("search_categories_placeholder")}
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="rounded-lg h-10 text-sm"
                    />
                  </div>
                )}

                {/* Category Grid */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto -mx-1 px-1">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(null)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      filters.category === null
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80",
                    )}
                  >
                    {t("all_categories")}
                  </button>
                  {filteredCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        filters.category === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80",
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {categorySearch && filteredCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("no_categories_found")}
                  </p>
                )}
              </div>
            )}

            {/* NSFW Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">{t("show_nsfw")}</span>
              <button
                type="button"
                onClick={() =>
                  onFilterChange({ ...filters, showNSFW: !filters.showNSFW })
                }
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors duration-200",
                  filters.showNSFW ? "bg-primary" : "bg-muted",
                )}
                role="switch"
                aria-checked={filters.showNSFW}
              >
                <span
                  className={cn(
                    "absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200",
                    filters.showNSFW ? "translate-x-8" : "translate-x-1",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 p-5 border-t border-border/50">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                {t("clear")}
              </Button>
            )}
            <Button
              onClick={() => setIsOpen(false)}
              className={cn("flex-1", hasActiveFilters ? "" : "flex-[2]")}
            >
              {t("apply_filters")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
