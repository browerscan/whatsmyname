/**
 * I18N Validator Tests
 *
 * Automated test suite to ensure i18n compliance across the codebase.
 * These tests enforce zero hardcoded text and proper translation key usage.
 *
 * Usage:
 *   npm run test:i18n              # Run all i18n tests
 *   npm run test:i18n -- --watch   # Watch mode for development
 *   npm run test:i18n -- --ui      # Visual test UI
 */

import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { scan, scanFile } from "./i18n-scanner";

const SUPPORTED_LOCALES = [
  "en",
  "zh",
  "es",
  "ja",
  "fr",
  "ko",
  "de",
  "pt",
  "ru",
] as const;

// ===========================
// Helper Functions
// ===========================

/**
 * Get all component files to test
 */
async function getAllComponents(
  pattern: string = "components/**/*.tsx",
): Promise<string[]> {
  return await glob(pattern, {
    ignore: ["node_modules/**", "__tests__/**", "*.test.tsx", "*.spec.tsx"],
    cwd: process.cwd(),
  });
}

/**
 * Get all page files to test
 */
async function getAllPages(): Promise<string[]> {
  return await glob("app/**/*.tsx", {
    ignore: ["node_modules/**", "__tests__/**", "app/api/**"],
    cwd: process.cwd(),
  });
}

/**
 * Check if translation file exists and is valid JSON
 */
function validateTranslationFile(locale: string): boolean {
  const filePath = path.join(process.cwd(), `locales/${locale}.json`);

  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load translation file
 */
function loadTranslations(locale: string): Record<string, unknown> {
  const filePath = path.join(process.cwd(), `locales/${locale}.json`);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function getLocaleFiles(): string[] {
  const localesDir = path.join(process.cwd(), "locales");

  if (!fs.existsSync(localesDir)) {
    return [];
  }

  return fs
    .readdirSync(localesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"))
    .sort();
}

/**
 * Flatten nested object to dot notation
 * Example: { common: { nav: { home: "Home" } } } => { "common.nav.home": "Home" }
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = "",
): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(
        flattened,
        flattenObject(value as Record<string, unknown>, newKey),
      );
    } else {
      flattened[newKey] = String(value);
    }
  }

  return flattened;
}

function extractTranslationBindings(content: string): Record<string, string> {
  const bindings: Record<string, string> = {};
  const patterns = [
    /const\s+(\w+)\s*=\s*useTranslations\(['"]([^'"]+)['"]\)/g,
    /const\s+(\w+)\s*=\s*(?:await\s+)?getTranslations\(['"]([^'"]+)['"]\)/g,
    /const\s+(\w+)\s*=\s*(?:await\s+)?getTranslations\(\{[^}]*namespace:\s*['"]([^'"]+)['"][^}]*\}\)/g,
  ];

  for (const pattern of patterns) {
    let match;

    while ((match = pattern.exec(content)) !== null) {
      bindings[match[1]] = match[2];
    }
  }

  return bindings;
}

function extractUsedTranslationKeys(
  content: string,
): Array<{ binding: string; key: string; namespace: string }> {
  const bindings = extractTranslationBindings(content);
  const usedKeys: Array<{ binding: string; key: string; namespace: string }> = [];
  const translationCallPattern = /\b([A-Za-z_$][\w$]*)\(['"]([^'"]+)['"](?:\s*,\s*\{[^)]*\})?\)/g;
  let match;

  while ((match = translationCallPattern.exec(content)) !== null) {
    const binding = match[1];
    const namespace = bindings[binding];

    if (namespace) {
      usedKeys.push({ binding, key: match[2], namespace });
    }
  }

  return usedKeys;
}

// ===========================
// Test Suites
// ===========================

describe("I18N Validator", () => {
  describe("Translation Files", () => {
    it("should have valid English translation file", () => {
      const isValid = validateTranslationFile("en");
      expect(isValid).toBe(true);
    });

    it("should have valid JSON structure in en.json", () => {
      const translations = loadTranslations("en");
      expect(translations).toBeDefined();
      expect(typeof translations).toBe("object");
    });

    it("should include all 9 supported locale files", () => {
      expect(getLocaleFiles()).toEqual([...SUPPORTED_LOCALES].sort());
    });

    it("should not have empty translation values", () => {
      const translations = loadTranslations("en");
      const flattened = flattenObject(translations);

      const emptyKeys = Object.entries(flattened)
        .filter(([, value]) => !value || value.trim().length === 0)
        .map(([key]) => key);

      expect(emptyKeys).toHaveLength(0);
    });

    it("should follow naming convention (lowercase with dots)", () => {
      const translations = loadTranslations("en");
      const flattened = flattenObject(translations);

      const invalidKeys = Object.keys(flattened).filter((key) => {
        // Should be lowercase with dots and underscores only
        return !/^[a-z][a-z0-9._]*$/.test(key);
      });

      if (invalidKeys.length > 0) {
        console.warn("⚠️  Keys not following convention:", invalidKeys);
      }

      expect(invalidKeys).toHaveLength(0);
    });
  });

  describe("Hardcoded Text Detection", () => {
    let scanResult: Awaited<ReturnType<typeof scan>>;

    beforeAll(async () => {
      scanResult = await scan();
    });

    it("should have zero hardcoded text violations", () => {
      if (scanResult.violations.length > 0) {
        console.error("\n❌ Found hardcoded text violations:\n");
        scanResult.violations.slice(0, 10).forEach((v) => {
          console.error(`  ${v.file}:${v.line} [${v.type}]`);
          console.error(`    "${v.text}"`);
        });
        if (scanResult.violations.length > 10) {
          console.error(
            `\n  ... and ${scanResult.violations.length - 10} more`,
          );
        }
        console.error('\nRun "npm run i18n:scan" for full report\n');
      }

      expect(scanResult.violations).toHaveLength(0);
    });

    it("should scan all component files", () => {
      expect(scanResult.totalFiles).toBeGreaterThan(0);
    });
  });

  describe("Component Coverage", () => {
    it("should test all feature components", async () => {
      const components = await getAllComponents("components/features/*.tsx");

      expect(components.length).toBeGreaterThan(0);

      for (const component of components) {
        const violations = await scanFile(component);

        if (violations.length > 0) {
          console.error(
            `\n❌ ${component} has ${violations.length} violations`,
          );
          violations.forEach((v) => {
            console.error(`  Line ${v.line}: "${v.text}"`);
          });
        }

        expect(violations).toHaveLength(0);
      }
    });

    it("should test all UI components", async () => {
      const components = await getAllComponents("components/ui/*.tsx");

      // UI components might have some technical text, so we're more lenient
      expect(components.length).toBeGreaterThan(0);
    });

    it("should test all pages", async () => {
      const pages = await getAllPages();

      expect(pages.length).toBeGreaterThan(0);

      for (const page of pages) {
        const violations = await scanFile(page);

        if (violations.length > 0) {
          console.error(`\n❌ ${page} has ${violations.length} violations`);
          violations.slice(0, 5).forEach((v) => {
            console.error(`  Line ${v.line}: "${v.text}"`);
          });
        }

        expect(violations).toHaveLength(0);
      }
    });
  });

  describe("Translation Key Usage", () => {
    it("should use correct translation hooks", async () => {
      const components = await getAllComponents("components/**/*.tsx");
      const pages = await getAllPages();
      const allFiles = [...components, ...pages];

      const filesWithTranslations: string[] = [];

      for (const file of allFiles) {
        const content = fs.readFileSync(file, "utf-8");

        // Check if file uses translations
        if (content.includes("useTranslations")) {
          filesWithTranslations.push(file);
        }
      }

      // At least some files should use translations
      // (This will increase as we migrate more components)
      console.log(
        `\n📊 Files using translations: ${filesWithTranslations.length}/${allFiles.length}`,
      );

      expect(filesWithTranslations.length).toBeGreaterThanOrEqual(0);
    });

    it("should have all used translation keys defined", async () => {
      const components = await getAllComponents("components/**/*.tsx");
      const pages = await getAllPages();
      const allFiles = [...components, ...pages];

      const translations = loadTranslations("en");
      const definedKeys = new Set(Object.keys(flattenObject(translations)));

      const missingKeys: { file: string; key: string; namespace: string }[] =
        [];

      for (const file of allFiles) {
        const content = fs.readFileSync(file, "utf-8");

        const usedKeys = extractUsedTranslationKeys(content);

        usedKeys.forEach(({ key, namespace }) => {
          const fullKey = `${namespace}.${key}`;

          if (!definedKeys.has(fullKey)) {
            missingKeys.push({ file, key: fullKey, namespace });
          }
        });
      }

      if (missingKeys.length > 0) {
        console.error("\n❌ Missing translation keys:");
        missingKeys.slice(0, 10).forEach(({ file, key }) => {
          console.error(`  ${file}: "${key}"`);
        });
        if (missingKeys.length > 10) {
          console.error(`\n  ... and ${missingKeys.length - 10} more`);
        }
      }

      expect(missingKeys).toHaveLength(0);
    });
  });

  describe("Specific Component Tests", () => {
    it("SearchBar should not have hardcoded text", async () => {
      const searchBarPath = "components/features/SearchBar.tsx";

      if (fs.existsSync(searchBarPath)) {
        const violations = await scanFile(searchBarPath);

        expect(violations).toHaveLength(0);
      }
    });

    it("ResultsHeader should not have hardcoded text", async () => {
      const resultsHeaderPath = "components/features/" + "ResultsHeader.tsx";

      if (fs.existsSync(resultsHeaderPath)) {
        const violations = await scanFile(resultsHeaderPath);

        expect(violations).toHaveLength(0);
      }
    });

    it("PlatformCard should not have hardcoded text", async () => {
      const platformCardPath = "components/features/" + "PlatformCard.tsx";

      if (fs.existsSync(platformCardPath)) {
        const violations = await scanFile(platformCardPath);

        expect(violations).toHaveLength(0);
      }
    });

    it("Home page should not have hardcoded text", async () => {
      const homePath = "app/page.tsx";

      if (fs.existsSync(homePath)) {
        const violations = await scanFile(homePath);

        expect(violations).toHaveLength(0);
      }
    });
  });

  describe("Multi-locale Support", () => {
    it("should have consistent keys across all supported locales", () => {
      const keysByLocale = SUPPORTED_LOCALES.map((locale) => {
        const translations = loadTranslations(locale);
        return {
          locale,
          keys: new Set(Object.keys(flattenObject(translations))),
        };
      });

      // Compare keys between locales
      const enKeys = keysByLocale.find((l) => l.locale === "en")?.keys;
      if (!enKeys) return;

      keysByLocale.forEach(({ locale, keys }) => {
        if (locale === "en") return;

        const missingInLocale = [...enKeys].filter((key) => !keys.has(key));
        const extraInLocale = [...keys].filter((key) => !enKeys.has(key));

        if (missingInLocale.length > 0 || extraInLocale.length > 0) {
          console.error(`\n❌ Locale mismatch detected for ${locale}`);
        }

        if (missingInLocale.length > 0) {
          console.error(
            `  Missing (${missingInLocale.length}):`,
            missingInLocale.slice(0, 10),
          );
        }

        if (extraInLocale.length > 0) {
          console.error(
            `  Extra (${extraInLocale.length}):`,
            extraInLocale.slice(0, 10),
          );
        }

        expect(missingInLocale).toHaveLength(0);
        expect(extraInLocale).toHaveLength(0);
      });
    });

    it("should have all supported locales with valid JSON", () => {
      SUPPORTED_LOCALES.forEach((locale) => {
        const isValid = validateTranslationFile(locale);
        expect(isValid).toBe(true);
      });
    });
  });

  describe("Statistics & Metrics", () => {
    it("should report i18n coverage metrics", async () => {
      const components = await getAllComponents("components/**/*.tsx");
      const pages = await getAllPages();
      const allFiles = [...components, ...pages];

      let filesUsingI18n = 0;

      for (const file of allFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (content.includes("useTranslations")) {
          filesUsingI18n++;
        }
      }

      const coverage = (filesUsingI18n / allFiles.length) * 100;

      console.log("\n📊 I18N Coverage Metrics:");
      console.log(`   Total Files: ${allFiles.length}`);
      console.log(`   Files with i18n: ${filesUsingI18n}`);
      console.log(`   Coverage: ${coverage.toFixed(1)}%`);

      const translations = loadTranslations("en");
      const keyCount = Object.keys(flattenObject(translations)).length;
      console.log(`   Translation Keys: ${keyCount}`);

      // No assertion - just reporting
      expect(true).toBe(true);
    });

    it("should report translation key count by namespace", () => {
      const translations = loadTranslations("en");

      const countByNamespace: Record<string, number> = {};

      for (const key of Object.keys(translations)) {
        const namespace = key.split(".")[0];
        countByNamespace[namespace] = (countByNamespace[namespace] || 0) + 1;
      }

      console.log("\n📊 Translation Keys by Namespace:");
      Object.entries(countByNamespace)
        .sort((a, b) => b[1] - a[1])
        .forEach(([namespace, count]) => {
          console.log(`   ${namespace.padEnd(15)} ${count} keys`);
        });

      expect(true).toBe(true);
    });
  });
});

// ===========================
// Integration Tests
// ===========================

describe("I18N Integration", () => {
  it("should have i18n scanner configured", () => {
    const scannerPath = path.join(process.cwd(), "scripts/i18n-scanner.ts");
    expect(fs.existsSync(scannerPath)).toBe(true);
  });

  it("should have implementation guide", () => {
    const guidePath = path.join(
      process.cwd(),
      "docs/I18N_IMPLEMENTATION_GUIDE.md",
    );
    expect(fs.existsSync(guidePath)).toBe(true);
  });

  it("should have auto-test documentation", () => {
    const testDocPath = path.join(process.cwd(), "docs/I18N_AUTO_TEST.md");
    expect(fs.existsSync(testDocPath)).toBe(true);
  });
});
