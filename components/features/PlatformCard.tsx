"use client";

import { memo } from "react";
import { ExternalLink, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchResult } from "@/types";
import {
  formatResponseTime,
  formatCategory,
  getResponseTimeCategory,
} from "@/lib";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PlatformCardProps {
  result: SearchResult;
  index?: number;
}

function getDomain(urlString: string) {
  try {
    return new URL(urlString).hostname;
  } catch {
    return "";
  }
}

function PlatformCardComponent({ result }: PlatformCardProps) {
  const { source, url, checkResult, category, isNSFW } = result;
  const { isExist, responseTime } = checkResult;
  const responseCategory = getResponseTimeCategory(responseTime);
  const t = useTranslations("platform");

  const domain = getDomain(url);

  return (
    <Card
      className={cn(
        "rounded-2xl transition-all duration-200 hover:shadow-custom-md hover:scale-[1.01] border-2",
        isExist
          ? "border-l-4 border-l-green-500 hover:border-green-500/30"
          : "border-l-4 border-l-border hover:border-border",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Platform Name */}
            <div className="flex items-center gap-2 mb-3">
              {isExist ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-muted flex-shrink-0" />
              )}
              {domain && (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                  alt={t("icon_alt", { source })}
                  className="h-4 w-4 flex-shrink-0"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <h3 className="font-semibold text-base truncate">{source}</h3>
            </div>

            {/* URL */}
            {isExist && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 hover:underline flex items-center gap-1 truncate mb-3 transition-colors"
                aria-label={t("visit_profile", { source })}
              >
                <span className="truncate">{url}</span>
                <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              </a>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {category && (
                <Badge variant="secondary" className="text-xs rounded-lg">
                  {formatCategory(category)}
                </Badge>
              )}

              {isNSFW && (
                <Badge variant="destructive" className="text-xs rounded-lg">
                  {t("badge_nsfw")}
                </Badge>
              )}

              {/* Response Time Badge */}
              <Badge
                variant="outline"
                className={cn(
                  "text-xs flex items-center gap-1 rounded-lg",
                  responseCategory === "fast" &&
                    "border-green-500 text-green-500 bg-green-500/5",
                  responseCategory === "medium" &&
                    "border-amber-500 text-amber-500 bg-amber-500/5",
                  responseCategory === "slow" &&
                    "border-red-500 text-red-500 bg-red-500/5",
                )}
              >
                <Clock className="h-3 w-3" />
                {formatResponseTime(responseTime)}
              </Badge>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isExist ? (
              <Badge className="bg-green-500 hover:bg-green-500/90 rounded-lg">
                {t("badge_found")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="rounded-lg">
                {t("badge_not_found")}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Memoize component for better performance with large lists
export const PlatformCard = memo(PlatformCardComponent);
