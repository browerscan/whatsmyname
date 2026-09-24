import Link from "next/link";
import { User } from "lucide-react";
import { defaultLocale } from "@/i18n/request";
import { HeaderAIControls } from "./HeaderAIControls";
import { HeaderLocaleSwitcher } from "./HeaderLocaleSwitcher";
import { HeaderThemeToggle } from "./HeaderThemeToggle";

interface HeaderProps {
  locale: string;
  appName: string;
  aiAssistantLabel: string;
  themeLabel: string;
  languageLabel: string;
  localeOptions: Array<{ value: string; label: string }>;
}

export function Header({ locale, appName, aiAssistantLabel, themeLabel, languageLabel, localeOptions }: HeaderProps) {
  const homeHref = locale === defaultLocale ? "/" : `/${locale}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-3">
        <Link
          className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80 sm:gap-2.5"
          href={homeHref}
        >
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 sm:h-8 sm:w-8 sm:rounded-xl">
            <User className="h-4 w-4 text-primary sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} />
          </span>
          <span className="truncate text-[15px] font-bold tracking-tight sm:text-lg">{appName}</span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
          <HeaderAIControls label={aiAssistantLabel} />
        </div>

        <nav className="flex flex-shrink-0 items-center gap-0.5 sm:gap-2">
          <HeaderLocaleSwitcher
            ariaLabel={languageLabel}
            currentLocale={locale}
            defaultLocale={defaultLocale}
            options={localeOptions}
            supportedLocales={localeOptions.map((option) => option.value)}
          />
          <HeaderThemeToggle ariaLabel={themeLabel} />
          <HeaderAIControls className="md:hidden" iconOnly label={aiAssistantLabel} />
        </nav>
      </div>
    </header>
  );
}
