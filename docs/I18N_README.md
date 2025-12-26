# I18N System - Quick Start Guide

## 🎯 Overview

This document provides a quick reference for the i18n (internationalization) system setup for the whatsmyname project. The system ensures **zero hardcoded text** and enables seamless multi-language support.

## 📚 Documentation Structure

1. **[I18N_IMPLEMENTATION_GUIDE.md](./I18N_IMPLEMENTATION_GUIDE.md)** - Complete implementation guide with best practices
2. **[I18N_AUTO_TEST.md](./I18N_AUTO_TEST.md)** - Automated testing documentation
3. **This README** - Quick start and command reference

## 🚀 Quick Start

### 1. Check for Hardcoded Text

Scan your codebase for hardcoded text that needs to be internationalized:

```bash
npm run i18n:scan
```

**Output Example:**

```
📊 I18N SCAN REPORT
═══════════════════
📁 Total Files Scanned: 26
⚠️  Files with Violations: 25
❌ Total Violations: 272

📝 Violations by File:
📄 app/page.tsx (17 violations)
   Line 190: "No Google results found"
   Line 201: "Ready to start?"
   ...
```

### 2. Get Translation Key Suggestions

Automatically generate suggested translation keys based on found violations:

```bash
npm run i18n:scan:suggest
```

This will output suggested keys to add to your `locales/en.json` file.

### 3. Run Automated Tests

Run the full i18n validation test suite:

```bash
npm run test:i18n
```

### 4. Validate Before Commit (CI/CD)

Use in your CI/CD pipeline to enforce i18n compliance:

```bash
npm run i18n:validate
```

This exits with error code 1 if violations are found.

## 📝 Available Commands

| Command                     | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `npm run i18n:scan`         | Scan codebase for hardcoded text                         |
| `npm run i18n:scan:suggest` | Scan and suggest translation keys                        |
| `npm run i18n:validate`     | Validate and exit with error if violations found (CI/CD) |
| `npm run test:i18n`         | Run all i18n validation tests                            |
| `npm run test:i18n:watch`   | Run tests in watch mode (development)                    |
| `npm run test:i18n:ui`      | Open Vitest UI for i18n tests                            |

## 🏗️ System Architecture

```
app/
├── docs/
│   ├── I18N_IMPLEMENTATION_GUIDE.md  # Complete implementation guide
│   ├── I18N_AUTO_TEST.md             # Testing documentation
│   └── I18N_README.md                # This file
├── scripts/
│   ├── i18n-scanner.ts               # Hardcoded text scanner
│   └── i18n-validator.test.ts        # Automated test suite
├── locales/
│   └── en.json                        # English translations (default)
├── app/
│   └── [locale]/                      # (Future) Locale-based routing
└── components/
    └── **/*.tsx                       # Components using translations
```

## 📖 Translation File Structure

**`locales/en.json`:**

```json
{
  "common": {
    "buttons": {
      "search": "Search",
      "cancel": "Cancel"
    }
  },
  "home": {
    "hero": {
      "title": "whatismyname",
      "subtitle": "Discover your username across 1400+ platforms"
    }
  }
}
```

**Usage in Component:**

```tsx
import { useTranslations } from "next-intl";

export function SearchBar() {
  const t = useTranslations("common.buttons");
  return <button>{t("search")}</button>;
}
```

## 🔄 Typical Workflow

### Scenario: Adding a New Feature

1. **Plan Translation Keys**

   ```json
   // Add to locales/en.json
   {
     "newFeature": {
       "title": "New Feature",
       "description": "Feature description"
     }
   }
   ```

2. **Implement Component**

   ```tsx
   import { useTranslations } from "next-intl";

   export function NewFeature() {
     const t = useTranslations("newFeature");
     return (
       <div>
         <h2>{t("title")}</h2>
         <p>{t("description")}</p>
       </div>
     );
   }
   ```

3. **Verify No Hardcoded Text**

   ```bash
   npm run i18n:scan
   ```

4. **Run Tests**
   ```bash
   npm run test:i18n
   ```

### Scenario: Migrating Existing Component

1. **Scan Component**

   ```bash
   npm run i18n:scan:suggest
   ```

2. **Copy Suggested Keys** to `locales/en.json`

3. **Update Component** to use `useTranslations`

4. **Verify**
   ```bash
   npm run i18n:scan
   npm run test:i18n
   ```

## ⚙️ Configuration

### Scanner Configuration

Edit `scripts/i18n-scanner.ts` to customize:

```typescript
const CONFIG = {
  include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  exclude: ["node_modules/**", ".next/**"],
  ignorePatterns: [
    /^https?:\/\//i, // URLs
    /^[A-Z_][A-Z0-9_]*$/, // Constants
    // Add custom patterns here
  ],
};
```

## 🎯 Current Status

### ✅ Completed Setup

- ✅ I18n scanner script created
- ✅ Automated test suite implemented
- ✅ Documentation created
- ✅ npm scripts configured
- ✅ Base English translations file created

### 🚧 Next Steps

1. **Optimize Scanner** - Improve pattern detection to reduce false positives
2. **Migrate Components** - Update existing components to use translations
3. **Add next-intl** - Install and configure next-intl library
4. **Setup Routing** - Configure App Router for locale-based routing
5. **Add Languages** - Create translation files for additional languages (zh, etc.)

## 📊 Coverage Report

Run this to see current i18n coverage:

```bash
npm run test:i18n
```

Look for the **"I18N Coverage Metrics"** section in the test output:

```
📊 I18N Coverage Metrics:
   Total Files: 26
   Files with i18n: 0
   Coverage: 0.0%
   Translation Keys: 23
```

## 🚨 Common Issues

### Issue: Too Many False Positives

**Problem**: Scanner detects CSS classes as violations

**Solution**: Update ignore patterns in `scripts/i18n-scanner.ts`:

```typescript
ignorePatterns: [
  /^[a-z-\s]+$/, // CSS classes
  // Add more patterns
];
```

### Issue: Missing Translation Key

**Problem**: Component uses `t('key')` but key not found

**Solution**:

1. Check key exists in `locales/en.json`
2. Verify namespace matches: `useTranslations('namespace')`
3. Use correct full path: `namespace.section.key`

### Issue: Tests Failing

**Problem**: `npm run test:i18n` shows failures

**Solution**:

1. Run `npm run i18n:scan` to see violations
2. Fix hardcoded text in reported files
3. Re-run tests

## 🎓 Best Practices

### ✅ Do This

```tsx
// Use translations for all user-visible text
const t = useTranslations('search');
<button>{t('submit')}</button>
<input placeholder={t('placeholder')} />
<div aria-label={t('label')} />
```

### ❌ Don't Do This

```tsx
// Hardcoded text
<button>Search</button>
<input placeholder="Enter username" />
<div aria-label="Search input" />
```

## 📈 KPIs and Goals

| Metric               | Current | Target |
| -------------------- | ------- | ------ |
| Components with i18n | 0%      | 100%   |
| Hardcoded violations | 272     | 0      |
| Translation keys     | 23      | TBD    |
| Test coverage        | 100%    | 100%   |

## 🔗 Resources

- **[I18N Implementation Guide](./I18N_IMPLEMENTATION_GUIDE.md)** - Detailed implementation patterns
- **[I18N Auto Test Guide](./I18N_AUTO_TEST.md)** - Testing strategy and examples
- **[next-intl Docs](https://next-intl-docs.vercel.app/)** - Official documentation
- **Scanner Script**: `scripts/i18n-scanner.ts`
- **Test Suite**: `scripts/i18n-validator.test.ts`

## 🤝 Contributing

When adding new features:

1. Add translation keys to `locales/en.json` FIRST
2. Use `useTranslations` in components
3. Run `npm run i18n:scan` before committing
4. Ensure `npm run test:i18n` passes
5. Update translations for other locales (future)

## 📞 Support

For questions or issues:

1. Check [I18N_IMPLEMENTATION_GUIDE.md](./I18N_IMPLEMENTATION_GUIDE.md)
2. Check [I18N_AUTO_TEST.md](./I18N_AUTO_TEST.md)
3. Review scanner output: `npm run i18n:scan`
4. Check test results: `npm run test:i18n`

---

**Last Updated**: 2025-11-16
**Status**: ✅ System Ready - Migration Pending
**Next Milestone**: Zero Hardcoded Text (0/272 violations fixed)
