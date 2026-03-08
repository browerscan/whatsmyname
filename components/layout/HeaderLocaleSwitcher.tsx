"use client";

import { usePathname, useRouter } from "next/navigation";

interface HeaderLocaleSwitcherProps {
  ariaLabel: string;
  currentLocale: string;
  defaultLocale: string;
  options: Array<{ value: string; label: string }>;
  supportedLocales: string[];
}

function stripLocalePrefix(pathname: string, supportedLocales: string[]) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && supportedLocales.includes(segments[0] ?? "")) {
    return segments.slice(1);
  }

  return segments;
}

function buildLocalePath(
  pathname: string,
  nextLocale: string,
  defaultLocale: string,
  supportedLocales: string[],
) {
  const pathSegments = stripLocalePrefix(pathname, supportedLocales);
  const normalizedPath = pathSegments.join("/");

  if (nextLocale === defaultLocale) {
    return normalizedPath ? `/${normalizedPath}` : "/";
  }

  return normalizedPath ? `/${nextLocale}/${normalizedPath}` : `/${nextLocale}`;
}

export function HeaderLocaleSwitcher({
  ariaLabel,
  currentLocale,
  defaultLocale,
  options,
  supportedLocales,
}: HeaderLocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      data-testid="language-selector"
      aria-label={ariaLabel}
      className="h-9 rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/30"
      onChange={(event) => {
        router.push(
          buildLocalePath(
            pathname || "/",
            event.target.value,
            defaultLocale,
            supportedLocales,
          ),
        );
      }}
      value={currentLocale}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
