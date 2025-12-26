# I18N Implementation Guide

## 📋 Overview

This guide establishes the standard for implementing internationalization (i18n) in the whatsmyname project. The goal is to achieve **zero hardcoded text** and ensure all user-facing content is properly internationalized.

## 🎯 Core Principles

### 1. Zero Hardcoding

- **Rule**: ALL user-visible text MUST be internationalized
- **Scope**: Components, pages, error messages, metadata, alt text, aria-labels
- **No exceptions**: Even single-word strings like "Search" or "Loading" must use translation keys

### 2. Translation Key Consistency

- **Naming Convention**: `namespace.section.key`
- **Structure**: Organized by feature/component hierarchy
- **Examples**:
  - `home.hero.title` → "whatismyname"
  - `search.button.submit` → "Search"
  - `search.placeholder` → "Enter username to search..."
  - `results.status.found` → "Found"

### 3. Default Language: English

- **Primary locale**: `en` (no prefix in URL)
- **URL pattern**: `/about` (English), `/zh/about` (Chinese)
- **File location**: `locales/en.json`

## 🏗️ Architecture

### File Structure

```
app/
├── [locale]/              # All pages under locale routing
│   ├── layout.tsx        # Root layout with lang attribute
│   ├── page.tsx          # Home page
│   └── about/
│       └── page.tsx
├── components/
│   └── features/
│       └── SearchBar.tsx # Uses useTranslations('search')
├── locales/
│   ├── en.json           # English (default)
│   └── zh.json           # Chinese
├── scripts/
│   ├── i18n-scanner.ts   # Auto-scan for hardcoded text
│   └── i18n-validator.test.ts # Automated testing
└── middleware.ts          # Locale routing logic
```

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Library**: `next-intl`
- **Installation**: `npm install next-intl`

## 📝 Translation File Structure

### Namespace Organization

```json
{
  "common": {
    "nav": {
      "home": "Home",
      "about": "About",
      "pricing": "Pricing"
    },
    "buttons": {
      "search": "Search",
      "cancel": "Cancel",
      "submit": "Submit"
    },
    "status": {
      "loading": "Loading...",
      "searching": "Searching...",
      "error": "Error"
    }
  },
  "home": {
    "hero": {
      "title": "whatismyname",
      "subtitle": "Discover your username across 1400+ platforms instantly",
      "description": "Search for a username across 1400+ platforms, Google, and get AI analysis"
    }
  },
  "search": {
    "input": {
      "placeholder": "Enter username to search...",
      "label": "Username search input",
      "error": {
        "invalid": "Invalid username",
        "required": "Username is required"
      }
    },
    "button": {
      "submit": "Search",
      "label": "Search for username"
    }
  },
  "results": {
    "header": {
      "title": "Results for \"{username}\"",
      "titleDefault": "Search Results",
      "platformsChecked": "{count} platform{plural} checked"
    },
    "status": {
      "found": "Found",
      "notFound": "Not Found",
      "searching": "Searching..."
    },
    "tabs": {
      "platforms": "whatismyname Results ({count})",
      "google": "Google Results ({count})"
    },
    "empty": {
      "title": "Ready to start?",
      "description": "Enter a username above to search across 1400+ platforms",
      "noGoogle": "No Google results found"
    }
  },
  "errors": {
    "api": {
      "search": "Search failed",
      "network": "Network error occurred"
    }
  },
  "seo": {
    "home": {
      "title": "whatismyname - Search Username Across 1400+ Platforms",
      "description": "Find your username across social media and websites instantly"
    }
  }
}
```

## 💻 Implementation Standards

### 1. Component Usage

```tsx
// ❌ BAD: Hardcoded text
export function SearchBar() {
  return <button>Search</button>;
}

// ✅ GOOD: Using translations
import { useTranslations } from "next-intl";

export function SearchBar() {
  const t = useTranslations("search.button");
  return <button>{t("submit")}</button>;
}
```

### 2. Dynamic Content

```tsx
// Variables in translations
const t = useTranslations("results.header");

// In en.json: "title": "Results for \"{username}\""
<h2>{t("title", { username: "john" })}</h2>;
// Output: Results for "john"
```

### 3. Pluralization

```tsx
// In en.json: "platformsChecked": "{count} platform{plural} checked"
const t = useTranslations("results.header");
<p>
  {t("platformsChecked", {
    count: totalResults,
    plural: totalResults !== 1 ? "s" : "",
  })}
</p>;
```

### 4. Accessibility Attributes

```tsx
// ✅ GOOD: Internationalized aria-labels
const t = useTranslations("search.input");

<Input
  placeholder={t("placeholder")}
  aria-label={t("label")}
  aria-describedby={error ? "username-error" : undefined}
/>;
```

### 5. SEO Metadata

```tsx
// app/[locale]/layout.tsx
import { useTranslations } from "next-intl";

export function generateMetadata({ params: { locale } }) {
  const t = useTranslations("seo.home");

  return {
    title: t("title"),
    description: t("description"),
  };
}
```

## 🔄 Translation Workflow

### Phase 1: Setup (Current)

1. ✅ Install `next-intl`
2. ✅ Configure middleware and routing
3. ✅ Create English (default) translations
4. ✅ Set up automated scanning

### Phase 2: Migration

1. Run scanner to identify all hardcoded text
2. Create translation keys systematically
3. Update components to use `useTranslations`
4. Verify with automated tests

### Phase 3: Expansion (Future)

1. Add new language files (e.g., `zh.json`)
2. Professional translation
3. Test with locale switching
4. Deploy with proper SEO tags

## 🧪 Quality Assurance

### Automated Checks

```bash
# Scan for hardcoded text
npm run i18n:scan

# Run i18n validation tests
npm run test:i18n

# Check for missing keys
npm run i18n:validate
```

### Manual Checklist

- [ ] No hardcoded strings in JSX
- [ ] All buttons have translated labels
- [ ] Form inputs have translated placeholders
- [ ] Error messages are internationalized
- [ ] Aria-labels are translated
- [ ] SEO metadata is localized

## 📊 Coverage Requirements

### Minimum Coverage

- **Components**: 100% of user-visible text
- **Error Messages**: 100%
- **Navigation**: 100%
- **Forms**: 100% (labels, placeholders, validation)

### Test Assertions

```typescript
// Example test
test("SearchBar should not contain hardcoded text", () => {
  const hardcodedStrings = scanForHardcodedText(
    "components/features/SearchBar.tsx",
  );
  expect(hardcodedStrings).toHaveLength(0);
});
```

## 🚀 Adding New Components

### Standard Procedure

1. **Plan translation keys** before writing JSX
2. **Add keys to `locales/en.json`** with namespace
3. **Use `useTranslations`** in component
4. **Run scanner** to verify no hardcoded text
5. **Add tests** to validate translation usage

### Example

```typescript
// 1. Plan keys (in locales/en.json)
{
  "filter": {
    "bar": {
      "title": "Filter Results",
      "categories": "Categories",
      "status": "Status"
    }
  }
}

// 2. Implement component
import { useTranslations } from 'next-intl';

export function FilterBar() {
  const t = useTranslations('filter.bar');

  return (
    <div>
      <h3>{t('title')}</h3>
      <label>{t('categories')}</label>
      <label>{t('status')}</label>
    </div>
  );
}
```

## 🌐 Multi-Language SEO

### URL Structure

- English: `example.com/about`
- Chinese: `example.com/zh/about`
- Auto-detection: Based on `Accept-Language` header

### Hreflang Tags (Auto-generated by next-intl)

```html
<link rel="alternate" hreflang="en" href="https://example.com/about" />
<link rel="alternate" hreflang="zh" href="https://example.com/zh/about" />
<link rel="alternate" hreflang="x-default" href="https://example.com/about" />
```

## ⚠️ Common Pitfalls

### ❌ Don't Do This

```tsx
// Hardcoded text
<button>Search</button>;

// String concatenation
const message = "Found " + count + " results";

// Hardcoded error messages
throw new Error("Invalid username");

// Untranslated placeholders
<input placeholder="Enter username" />;
```

### ✅ Do This Instead

```tsx
// Use translation hook
const t = useTranslations("search");
<button>{t("button.submit")}</button>;

// Use dynamic variables
const t = useTranslations("results");
const message = t("found", { count });

// Translate errors
const t = useTranslations("errors");
throw new Error(t("validation.username"));

// Translate placeholders
const t = useTranslations("search.input");
<input placeholder={t("placeholder")} />;
```

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js App Router I18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Project Auto-scan Script](../scripts/i18n-scanner.ts)
- [Project Validation Tests](../scripts/i18n-validator.test.ts)

## 🎯 Success Metrics

- **Zero** hardcoded strings in production
- **100%** test coverage for i18n validation
- **Automated** detection of new hardcoded text
- **Scalable** system for adding new languages
- **SEO-ready** with proper hreflang tags

---

**Last Updated**: 2025-11-16
**Maintainer**: Development Team
**Status**: Active Standard
