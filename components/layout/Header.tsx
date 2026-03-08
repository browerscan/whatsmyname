import Link from "next/link";
import { User } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { defaultLocale, locales } from "@/i18n/request";
import { HeaderAIControls } from "./HeaderAIControls";
import { HeaderLocaleSwitcher } from "./HeaderLocaleSwitcher";
import { HeaderThemeToggle } from "./HeaderThemeToggle";

export async function Header() {
  const [locale, tAi, tApp, tTheme, tLanguage] = await Promise.all([
    getLocale(),
    getTranslations("ai"),
    getTranslations("common.app"),
    getTranslations("common.theme"),
    getTranslations("common.language"),
  ]);

  const homeHref = locale === defaultLocale ? "/" : `/${locale}`;
  const localeOptions = locales.map((localeOption) => ({
    value: localeOption,
    label: tLanguage(localeOption),
  }));
  const aiAssistantLabel = tAi("assistant_label");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          href={homeHref}
        >
          <User className="h-6 w-6 text-primary" strokeWidth={3} />
          <span className="text-lg font-bold">{tApp("name")}</span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
          <HeaderAIControls label={aiAssistantLabel} />
        </div>

        <nav className="flex items-center gap-2">
          <HeaderLocaleSwitcher
            ariaLabel={tLanguage("label")}
            currentLocale={locale}
            defaultLocale={defaultLocale}
            options={localeOptions}
            supportedLocales={localeOptions.map((option) => option.value)}
          />
          <HeaderThemeToggle ariaLabel={tTheme("toggle_aria")} />
          <HeaderAIControls className="md:hidden" iconOnly label={aiAssistantLabel} />
        </nav>
      </div>
    </header>
  );
}
