# I18N Automated Testing Guide

## 📋 Overview

This guide explains the automated testing system for i18n in the whatsmyname project. The system automatically detects hardcoded text, validates translation keys, and ensures 100% internationalization coverage.

## 🎯 Testing Goals

1. **Zero Hardcoded Text**: Detect and prevent hardcoded strings in components
2. **Translation Key Validation**: Ensure all translation keys exist in locale files
3. **Coverage Verification**: Confirm all user-visible text is internationalized
4. **Regression Prevention**: Catch new hardcoded text in CI/CD pipeline

## 🛠️ Testing Tools

### 1. i18n Scanner (`scripts/i18n-scanner.ts`)

- **Purpose**: Scan codebase for hardcoded text
- **Output**: List of files and line numbers with violations
- **Usage**: `npm run i18n:scan`

### 2. i18n Validator (`scripts/i18n-validator.test.ts`)

- **Purpose**: Automated test suite for i18n compliance
- **Framework**: Vitest
- **Usage**: `npm run test:i18n`

## 📁 Test File Structure

```
app/
├── scripts/
│   ├── i18n-scanner.ts           # Core scanning logic
│   └── i18n-validator.test.ts    # Test suite
├── __tests__/
│   └── i18n/
│       ├── components.test.ts    # Component-specific tests
│       └── locale-files.test.ts  # Translation file validation
└── package.json                   # Test scripts
```

## 🧪 Test Categories

### 1. Hardcoded Text Detection

**What it checks:**

- JSX text content (e.g., `<button>Search</button>`)
- String literals in components
- Placeholders and aria-labels
- Error messages

**Example Test:**

```typescript
import { describe, it, expect } from "vitest";
import { scanForHardcodedText } from "../scripts/i18n-scanner";

describe("SearchBar Component", () => {
  it("should not contain hardcoded text", async () => {
    const violations = await scanForHardcodedText(
      "components/features/SearchBar.tsx",
    );
    expect(violations).toHaveLength(0);
  });
});
```

**Expected Output:**

```
✓ SearchBar should not contain hardcoded text
```

### 2. Translation Key Consistency

**What it checks:**

- All used keys exist in `locales/en.json`
- No orphaned keys (defined but unused)
- Proper namespace structure

**Example Test:**

```typescript
describe("Translation Keys", () => {
  it("should have all used keys defined in en.json", async () => {
    const usedKeys = await extractUsedTranslationKeys();
    const definedKeys = await getDefinedKeys("locales/en.json");

    const missingKeys = usedKeys.filter((key) => !definedKeys.includes(key));
    expect(missingKeys).toHaveLength(0);
  });

  it("should not have orphaned keys", async () => {
    const usedKeys = await extractUsedTranslationKeys();
    const definedKeys = await getDefinedKeys("locales/en.json");

    const orphanedKeys = definedKeys.filter((key) => !usedKeys.includes(key));

    if (orphanedKeys.length > 0) {
      console.warn("⚠️  Orphaned translation keys:", orphanedKeys);
    }

    // Warning only, not failure
    expect(true).toBe(true);
  });
});
```

### 3. Component Coverage

**What it checks:**

- All components in `components/features/` are tested
- All pages in `app/[locale]/` are tested
- No components are excluded from scanning

**Example Test:**

```typescript
describe("I18N Coverage", () => {
  it("should test all feature components", async () => {
    const components = await getAllComponents("components/features");
    const testedComponents = await getTestedComponents();

    const untested = components.filter((c) => !testedComponents.includes(c));
    expect(untested).toHaveLength(0);
  });
});
```

### 4. Translation File Validation

**What it checks:**

- Valid JSON syntax
- Consistent structure across locales
- All locales have same keys (future)

**Example Test:**

```typescript
describe("Locale Files", () => {
  it("should have valid JSON structure", () => {
    const locales = ["en", "zh"]; // Add more as needed

    locales.forEach((locale) => {
      expect(() => {
        const content = fs.readFileSync(`locales/${locale}.json`, "utf-8");
        JSON.parse(content);
      }).not.toThrow();
    });
  });

  it("should have consistent namespace structure", () => {
    const en = require("../locales/en.json");
    const zh = require("../locales/zh.json");

    const enKeys = Object.keys(flattenObject(en));
    const zhKeys = Object.keys(flattenObject(zh));

    expect(enKeys.sort()).toEqual(zhKeys.sort());
  });
});
```

## 🚀 Running Tests

### Command Line

```bash
# Run all i18n tests
npm run test:i18n

# Run with coverage
npm run test:i18n -- --coverage

# Watch mode (for development)
npm run test:i18n -- --watch

# Run scanner only
npm run i18n:scan

# Run scanner with auto-fix (future feature)
npm run i18n:scan -- --fix
```

### Package.json Scripts

```json
{
  "scripts": {
    "i18n:scan": "tsx scripts/i18n-scanner.ts",
    "i18n:validate": "tsx scripts/i18n-scanner.ts --validate",
    "test:i18n": "vitest run scripts/i18n-validator.test.ts",
    "test:i18n:watch": "vitest watch scripts/i18n-validator.test.ts",
    "test:i18n:ui": "vitest --ui scripts/i18n-validator.test.ts"
  }
}
```

## 📊 Test Output Examples

### ✅ Success Output

```
 ✓ scripts/i18n-validator.test.ts (15)
   ✓ SearchBar Component (3)
     ✓ should not contain hardcoded text
     ✓ should use correct translation namespace
     ✓ should have all aria-labels translated
   ✓ ResultsHeader Component (2)
     ✓ should not contain hardcoded text
     ✓ should handle pluralization correctly
   ✓ Translation Keys (5)
     ✓ should have all used keys defined
     ✓ should not have orphaned keys
     ✓ should follow naming convention
     ✓ should have consistent structure
     ✓ should be valid JSON
   ✓ Coverage (2)
     ✓ should test all components
     ✓ should cover all pages

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Duration  2.34s
```

### ❌ Failure Output

```
 ✗ scripts/i18n-validator.test.ts (15)
   ✗ SearchBar Component (3)
     ✗ should not contain hardcoded text

       Found hardcoded text in components/features/SearchBar.tsx:

       Line 52: "Enter username to search..."
       Line 80: "Search"
       Line 96: "Search for a username across 1400+ platforms"

       Please add these to locales/en.json under 'search' namespace

     ✓ should use correct translation namespace
     ✓ should have all aria-labels translated

 Test Files  1 failed (1)
      Tests  1 failed | 14 passed (15)
   Duration  2.34s
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: I18N Validation

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  i18n-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run i18n scanner
        run: npm run i18n:scan

      - name: Run i18n tests
        run: npm run test:i18n

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: i18n-test-results
          path: coverage/
```

### Pre-commit Hook

```bash
#!/bin/sh
# .husky/pre-commit

echo "🌐 Running i18n validation..."

npm run i18n:scan

if [ $? -ne 0 ]; then
  echo "❌ I18n validation failed. Please fix hardcoded text before committing."
  exit 1
fi

echo "✅ I18n validation passed"
```

## 🎯 Detection Patterns

### What Gets Detected

```tsx
// ❌ Hardcoded JSX text
<button>Search</button>

// ❌ Hardcoded attributes
<input placeholder="Enter username" />

// ❌ Hardcoded aria-labels
<button aria-label="Search button">...</button>

// ❌ String literals in variables
const message = "Search completed";

// ❌ Template literals
const title = `Results for ${username}`;

// ❌ Error messages
throw new Error("Invalid input");
```

### What Gets Ignored

```tsx
// ✅ Technical constants
const API_URL = "https://api.example.com";
const MAX_LENGTH = 100;

// ✅ CSS classes
<div className="flex gap-2">

// ✅ Data attributes
<div data-testid="search-bar">

// ✅ Code comments
// This is a comment

// ✅ Console logs (warning in production)
console.log("Debug message");

// ✅ Translation function calls
const t = useTranslations('search');
<button>{t('submit')}</button>
```

## 🔧 Configuration

### Scanner Config (`scripts/i18n-scanner.ts`)

```typescript
export const SCANNER_CONFIG = {
  // Directories to scan
  include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],

  // Directories to ignore
  exclude: [
    "node_modules/**",
    ".next/**",
    "dist/**",
    "__tests__/**",
    "scripts/**",
  ],

  // Patterns to detect
  patterns: {
    jsxText: /<[^>]+>([^<]+)</g,
    stringLiteral: /['"`]([^'"`]+)['"`]/g,
    templateLiteral: /`([^`]+)`/g,
  },

  // Ignore list (technical strings)
  ignore: [
    /^https?:\/\//, // URLs
    /^\/api\//, // API routes
    /^[A-Z_]+$/, // Constants
    /^\d+$/, // Numbers
    /^[a-z-]+$/, // CSS classes (kebab-case)
  ],
};
```

## 📈 Metrics & Reporting

### Coverage Report

```
I18N Coverage Report
====================

Components Tested:     12/12 (100%)
Pages Tested:          5/5 (100%)
Translation Keys:      87
Hardcoded Strings:     0
Orphaned Keys:         3

Coverage by Namespace:
  - common:       23 keys (26%)
  - home:         12 keys (14%)
  - search:       15 keys (17%)
  - results:      28 keys (32%)
  - errors:        9 keys (10%)

Status: ✅ PASSING
```

### Trend Tracking

```
I18N Health Trend (Last 7 Days)
================================

Nov 16: ✅ 100% coverage, 0 violations
Nov 15: ⚠️  98% coverage, 2 violations
Nov 14: ⚠️  97% coverage, 5 violations
Nov 13: ❌ 92% coverage, 12 violations
Nov 12: ❌ 85% coverage, 24 violations
Nov 11: ❌ 78% coverage, 38 violations
Nov 10: ❌ 65% coverage, 52 violations

Improvement: +35% in 7 days 📈
```

## 🎓 Best Practices

### 1. Write Tests First (TDD)

```typescript
// 1. Write test
it('should not have hardcoded text in NewComponent', () => {
  const violations = scanForHardcodedText('components/NewComponent.tsx');
  expect(violations).toHaveLength(0);
});

// 2. Add translation keys to en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Description here"
  }
}

// 3. Implement component with translations
export function NewComponent() {
  const t = useTranslations('newFeature');
  return <h1>{t('title')}</h1>;
}
```

### 2. Run Tests Locally

```bash
# Before committing
npm run i18n:scan
npm run test:i18n

# If violations found, fix them before pushing
```

### 3. Review Test Output

- Don't ignore warnings
- Fix orphaned keys
- Keep translation files organized

### 4. Update Tests When Adding Features

- Add new test cases for new components
- Update expected key counts
- Verify namespace structure

## 🚨 Troubleshooting

### False Positives

**Problem**: Scanner detects technical strings as violations

**Solution**: Add to ignore list in scanner config

```typescript
ignore: [
  /^https?:\/\//, // URLs
  /^[A-Z_]+$/, // Constants
  "YOUR_PATTERN", // Add custom pattern
];
```

### Missing Keys

**Problem**: Test fails with "Translation key not found"

**Solution**:

1. Check the exact key path used in component
2. Verify key exists in `locales/en.json`
3. Check for typos in namespace

### Performance Issues

**Problem**: Tests are slow

**Solution**:

```typescript
// Use .only for focused testing during development
it.only('should test specific component', () => {
  // ...
});

// Or run specific file
npm run test:i18n -- SearchBar.test.ts
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [next-intl Testing Guide](https://next-intl-docs.vercel.app/docs/getting-started/testing)
- [Project Implementation Guide](./I18N_IMPLEMENTATION_GUIDE.md)

## 🎯 Success Criteria

- ✅ All tests passing in CI/CD
- ✅ Zero hardcoded strings detected
- ✅ 100% component coverage
- ✅ All translation keys validated
- ✅ Automated pre-commit checks
- ✅ Clear error messages for violations

---

**Last Updated**: 2025-11-16
**Maintainer**: Development Team
**Status**: Active Standard
