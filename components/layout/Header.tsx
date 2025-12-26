"use client";

import Link from "next/link";
import { User, Moon, Sun, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAIStore } from "@/stores";

export function Header() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const tApp = useTranslations("common.app");
  const tTheme = useTranslations("common.theme");
  const tLanguage = useTranslations("common.language");
  const { openDialog } = useAIStore();

  const homeHref = locale === "en" ? "/" : `/${locale}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href={homeHref}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <User className="h-6 w-6 text-primary" strokeWidth={3} />
          <span className="text-lg font-bold">{tApp("name")}</span>
        </Link>

        {/* Center Chat Button */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openDialog}
            className="gap-2 text-muted-foreground hover:text-primary hover:bg-accent/50"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">AI Assistant</span>
          </Button>
        </div>

        <nav className="flex items-center gap-2">
          <select
            value={locale}
            onChange={(e) => {
              const nextLocale = e.target.value;
              router.push(nextLocale === "en" ? "/" : `/${nextLocale}`);
            }}
            aria-label={tLanguage("label")}
            className="h-9 rounded-xl border border-border bg-background/80 backdrop-blur px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="en">{tLanguage("en")}</option>
            <option value="zh">{tLanguage("zh")}</option>
            <option value="es">{tLanguage("es")}</option>
            <option value="ja">{tLanguage("ja")}</option>
            <option value="fr">{tLanguage("fr")}</option>
            <option value="ko">{tLanguage("ko")}</option>
          </select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={tTheme("toggle_aria")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Chat Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openDialog}
            className="md:hidden"
            aria-label="AI Assistant"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
