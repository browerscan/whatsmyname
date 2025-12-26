"use client";

import { memo } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleResult } from "@/types";
import { getIconForUrl, extractDomain } from "@/lib";
import { useTranslations } from "next-intl";

interface GoogleResultCardProps {
  result: GoogleResult;
  index?: number;
  username?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatches(text: string, rawTerms: string[]): React.ReactNode {
  const terms = rawTerms.map((t) => t.trim()).filter(Boolean);
  if (!text || terms.length === 0) return text;

  const uniqueTerms = Array.from(new Set(terms));
  const escaped = uniqueTerms
    .map(escapeRegExp)
    .sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  const lowerTerms = new Set(uniqueTerms.map((t) => t.toLowerCase()));

  return parts.map((part, i) =>
    lowerTerms.has(part.toLowerCase()) ? (
      <mark key={i} className="rounded bg-primary/15 text-foreground px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function GoogleResultCardComponent({
  result,
  index = 0,
  username,
}: GoogleResultCardProps) {
  const { title, link, snippet, displayLink } = result;
  const iconInfo = getIconForUrl(link);
  const domain = extractDomain(link);
  const highlightTerms = username ? [username, `@${username}`] : [];
  const t = useTranslations("google");

  return (
    <Card className="transition-all duration-200 hover:shadow-custom-md hover:scale-[1.005] rounded-2xl border-2">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Favicon/Icon */}
          <div className="flex-shrink-0 mt-1">
            {iconInfo.type === "favicon" ? (
              <img
                src={iconInfo.value}
                alt={t("icon_alt", { domain })}
                className="w-5 h-5 rounded"
                onError={(e) => {
                  // Fallback to globe icon if favicon fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
            ) : (
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: iconInfo.color || "#666" }}
              >
                {domain.charAt(0).toUpperCase()}
              </div>
            )}
            <Globe className="w-5 h-5 text-muted-foreground hidden" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Display Link */}
            <p className="text-xs text-muted-foreground mb-2 truncate uppercase tracking-[0.1em]">
              <span className="mr-2 text-muted-foreground/70">
                {index + 1}.
              </span>
              {displayLink}
            </p>

            {/* Title */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 hover:underline font-semibold line-clamp-2 mb-2 flex items-start gap-2 transition-colors"
              aria-label={t("visit", { title })}
            >
              <span className="flex-1">
                {highlightMatches(title, highlightTerms)}
              </span>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            </a>

            {/* Snippet */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {highlightMatches(snippet, highlightTerms)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const GoogleResultCard = memo(GoogleResultCardComponent);
