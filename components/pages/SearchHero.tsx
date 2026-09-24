"use client";

import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/features";

interface SearchHeroProps {
  isSearching: boolean;
  onSearch: (username: string) => void;
}

export function SearchHero({ isSearching, onSearch }: SearchHeroProps) {
  const tHero = useTranslations("home.hero");

  return (
    <section className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="tech-grid absolute inset-0 opacity-30" />

        <div className="relative rounded-3xl border border-border/40 px-5 py-10 shadow-custom-lg glass-strong sm:p-10 md:p-16">
          <div className="mx-auto max-w-3xl space-y-7 text-center sm:space-y-8">
            <div className="inline-flex animate-scale-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary sm:px-4 sm:text-xs sm:tracking-[0.3em]">
                <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-primary" />
                {tHero("kicker")}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-[2.25rem] font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
                {tHero("title_prefix")} {" "}
                <span className="inline-block text-gradient">
                  {tHero("title_highlight")}
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {tHero("description")}
              </p>
            </div>

            <SearchBar isLoading={isSearching} onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}
