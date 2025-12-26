#!/usr/bin/env tsx

/**
 * I18N Scanner
 *
 * Scans the codebase for hardcoded text that should be internationalized.
 * This script helps maintain zero hardcoded strings by detecting violations.
 *
 * Usage:
 *   npm run i18n:scan              # Scan and report violations
 *   npm run i18n:scan -- --fix     # Auto-generate translation keys (future)
 *   npm run i18n:validate          # Exit with error if violations found (CI/CD)
 */

import fs from "fs";
import { glob } from "glob";

// ===========================
// Configuration
// ===========================

interface ScannerConfig {
  include: string[];
  exclude: string[];
  ignorePatterns: RegExp[];
  technicalPrefixes: string[];
}

const CONFIG: ScannerConfig = {
  // Directories and patterns to scan
  include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],

  // Directories to exclude
  exclude: [
    "node_modules/**",
    ".next/**",
    "dist/**",
    "build/**",
    "__tests__/**",
    "scripts/**",
    "app/api/**",
    "app/[locale]/privacy/**",
    "app/[locale]/terms/**",
    "app/[locale]/tools/**", // SEO content pages
    "app/[locale]/platforms/**", // SEO platform pages
    "app/[locale]/categories/**", // SEO category pages
    "app/[locale]/blog/**", // SEO blog pages
    "app/layout.tsx",
    "app/manifest.ts",
    "app/robots.ts",
    "components/seo/StructuredData.tsx",
    "*.config.*",
    "proxy.ts",
  ],

  // Patterns to ignore (technical strings)
  ignorePatterns: [
    /^https?:\/\//i, // URLs
    /^\/api\//, // API routes
    /^\/[a-z-/]*$/, // Routes like /about, /zh/about
    /^[A-Z_][A-Z0-9_]*$/, // Constants like API_URL, MAX_LENGTH
    /^[a-z0-9]+(?:[._][a-z0-9]+)+$/, // Translation keys / identifiers (foo_bar, foo.bar)
    /^\d+\s+\d+$/, // Ranges like "100 900" (font weights)
    /^\d+\s+\d+\s+\d+\s+\d+$/, // SVG viewBox like "0 0 24 24"
    /^noopener noreferrer$/i, // Link rel attribute
    /^[a-z]+\/[a-z0-9.+-]+$/i, // MIME types (application/json)
    /^\d+$/, // Pure numbers
    /^[a-z-]+$/, // kebab-case (CSS classes)
    /^[a-z][a-zA-Z]*$/, // camelCase variables (single word)
    /^\.[a-z]/, // File extensions
    /^[a-z]{2}$/, // Locale codes (en, zh)
    /^[Mm][0-9][0-9.,\sA-Za-z-]*[Zz]$/, // SVG path data (e.g. "M12 9v2...z")
    /^\[[^\]]+\]$/, // CSS attribute selectors like "[data-foo]"
    /^(translate|scale|rotate|skew)[A-Za-z0-9]*\([^)]*\)$/, // CSS transform-like strings
    /^[!@#$%^&*()_+=\[\]{};':"\\|,.<>?/-]+$/, // Pure symbols
    /^[\s\n\r\t]+$/, // Whitespace only
    /^displayName$/, // React component displayName property
    /^[A-Z][a-zA-Z]+$/, // PascalCase component names
    /^width=\$\{.+\},height=\$\{.+\}$/, // Template literals for window.open features
    /^width=,height=$/, // Partial template literals for window features
    /^mailto:\?subject=&body=$/, // Mailto URL scheme
    /^[A-Za-z\s()]+$/, // Column names and labels (e.g., "Response Time (ms)")
    /^whatsmyname-/, // Export filename prefix
    /^=== [A-Z ]+ ===\\n$/, // AI prompt section headers with newline
    /^=== [A-Z ()]+ ===$/, // AI prompt section headers
    /^(Search Results|Total platforms|Profiles found|URL:|Category:|Tags:|NSFW:|Exported:)/, // AI prompt labels
    /^Username Search Results for:$/, // Export header
    /^Total Found: .* platform\(s\)/, // Export count label
    /^(No search results available|Profiles not found:|more found profiles)/, // AI prompt messages
    /^=== NOT FOUND \(Sample\) ===/, // AI prompt section
    /^\.\.\. and .* more found profiles/, // AI prompt summary
  ],

  // Technical prefixes to ignore
  technicalPrefixes: [
    "data-",
    "aria-describedby",
    "aria-controls",
    "aria-labelledby",
    "id=",
    "className=",
    "key=",
    "testid",
  ],
};

// ===========================
// Types
// ===========================

interface Violation {
  file: string;
  line: number;
  column: number;
  text: string;
  context: string;
  type: ViolationType;
}

type ViolationType =
  | "jsx-text" // <button>Text</button>
  | "string-literal" // "hardcoded string"
  | "template-literal" // `template ${var}`
  | "placeholder" // placeholder="text"
  | "aria-label" // aria-label="text"
  | "title" // title="text"
  | "alt"; // alt="text"

interface ScanResult {
  totalFiles: number;
  scannedFiles: number;
  violations: Violation[];
  summary: {
    [key in ViolationType]: number;
  };
}

// ===========================
// Helper Functions
// ===========================

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

function shouldSkipFile(filePath: string): boolean {
  const normalized = normalizePath(filePath);

  if (
    normalized === "app/layout.tsx" ||
    normalized === "app/manifest.ts" ||
    normalized === "app/robots.ts" ||
    normalized === "components/seo/StructuredData.tsx"
  ) {
    return true;
  }

  if (
    normalized.includes("app/[locale]/privacy/") ||
    normalized.includes("app/[locale]/terms/") ||
    normalized.includes("app/[locale]/tools/") ||
    normalized.includes("app/[locale]/platforms/") ||
    normalized.includes("app/[locale]/categories/") ||
    normalized.includes("app/[locale]/blog/")
  ) {
    return true;
  }

  return false;
}

function looksLikeTailwindClassList(text: string): boolean {
  if (!text.includes(" ")) return false;

  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return false;

  // Tailwind tokens often include prefixes like md:, hover:, data-[...]:, brackets, slashes, etc.
  const variantPrefix =
    /^(2xl|xl|lg|md|sm|xs|hover|focus|active|disabled|data-\[[^\]]+\]|aria-\[[^\]]+\]):/;
  const utilityPrefix =
    /^(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|h|w|min-h|min-w|max-h|max-w|text|bg|border|rounded|shadow|flex|grid|items|justify|gap|space|prose|container|z|top|bottom|left|right|inset|translate|scale|rotate|skew|animate|duration|transition|backdrop|opacity|font|tracking|leading|ring|outline|overflow|whitespace|truncate|line-clamp|select|cursor|pointer-events|sr)-/;

  let score = 0;
  for (const token of tokens) {
    if (variantPrefix.test(token)) score++;
    if (utilityPrefix.test(token)) score++;
    if (token.includes("[") || token.includes("]")) score++;
    if (token.includes("/")) score++;
    if (token.includes("-")) score++;
    if (token.includes(":")) score++;
  }

  // Heuristic: enough "tailwind-ish" signals across tokens
  return score >= Math.max(2, Math.floor(tokens.length * 1.2));
}

function shouldIgnore(text: string): boolean {
  // Empty or whitespace-only
  if (!text || text.trim().length === 0) {
    return true;
  }

  // Check against ignore patterns
  for (const pattern of CONFIG.ignorePatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }

  // Check technical prefixes
  for (const prefix of CONFIG.technicalPrefixes) {
    if (text.startsWith(prefix)) {
      return true;
    }
  }

  // Ignore if it looks like a translation key usage
  if (text.includes("t(") || text.includes("useTranslations")) {
    return true;
  }

  // Ignore Tailwind class lists (e.g., "rounded-md px-3 hover:bg-muted")
  if (looksLikeTailwindClassList(text)) {
    return true;
  }

  // Ignore single characters (like 'x', '+', etc.)
  if (text.length === 1) {
    return true;
  }

  // Ignore if contains only special characters and spaces
  if (/^[^a-zA-Z0-9]+$/.test(text)) {
    return true;
  }

  return false;
}

function extractJSXText(content: string, filePath: string): Violation[] {
  const violations: Violation[] = [];
  const lines = content.split("\n");

  // Pattern to match JSX text content
  // Matches: <tag>Text Here</tag>
  const jsxTextPattern = />([^<>{}\n]+)</g;

  lines.forEach((line, lineIndex) => {
    let match;
    while ((match = jsxTextPattern.exec(line)) !== null) {
      const text = match[1].trim();

      // Avoid false-positives in TypeScript generics (e.g. React.ElementRef<...>)
      // by requiring a closing tag on the same line.
      if (!line.slice(match.index).includes("</")) {
        continue;
      }

      if (!shouldIgnore(text) && text.length > 0) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index,
          text,
          context: line.trim(),
          type: "jsx-text",
        });
      }
    }
  });

  return violations;
}

function extractAttributes(content: string, filePath: string): Violation[] {
  const violations: Violation[] = [];
  const lines = content.split("\n");

  // Attributes to check
  const attributePatterns = [
    {
      name: "placeholder",
      regex: /placeholder=["']([^"']+)["']/g,
      type: "placeholder" as ViolationType,
    },
    {
      name: "aria-label",
      regex: /aria-label=["']([^"']+)["']/g,
      type: "aria-label" as ViolationType,
    },
    {
      name: "title",
      regex: /title=["']([^"']+)["']/g,
      type: "title" as ViolationType,
    },
    {
      name: "alt",
      regex: /alt=["']([^"']+)["']/g,
      type: "alt" as ViolationType,
    },
  ];

  lines.forEach((line, lineIndex) => {
    attributePatterns.forEach(({ regex, type }) => {
      let match;
      const regexCopy = new RegExp(regex);
      while ((match = regexCopy.exec(line)) !== null) {
        const text = match[1].trim();

        // Skip if it's using a variable or translation
        if (text.startsWith("{") || text.includes("t(") || shouldIgnore(text)) {
          continue;
        }

        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index,
          text,
          context: line.trim(),
          type,
        });
      }
    });
  });

  return violations;
}

function extractStringLiterals(content: string, filePath: string): Violation[] {
  const violations: Violation[] = [];
  const lines = content.split("\n");

  // Pattern for string literals that look like user-visible text
  // Must contain at least one space or be longer than 15 chars
  const stringPattern = /["']([^"'\n]{3,})["']/g;

  lines.forEach((line, lineIndex) => {
    // Skip import statements
    if (line.trim().startsWith("import ") || line.trim().startsWith("from ")) {
      return;
    }

    // Skip console.log (warning, but not error)
    if (line.includes("console.")) {
      return;
    }

    // Skip comments
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) {
      return;
    }

    // Skip className attributes (CSS classes)
    if (line.includes("className=")) {
      return;
    }

    // Skip 'use client' and 'use server' directives
    if (line.trim().match(/^['"]use (client|server)['"];?$/)) {
      return;
    }

    // Skip lines with common code patterns (includes, replace, etc.)
    if (
      line.includes(".includes(") ||
      line.includes(".replace(") ||
      line.includes(".match(")
    ) {
      return;
    }

    // Skip CSV generation code (quoted strings)
    if (line.includes('""') && line.includes("replace")) {
      return;
    }

    let match;
    while ((match = stringPattern.exec(line)) !== null) {
      const text = match[1].trim();

      // Skip if it looks like a CSS class (contains common Tailwind patterns)
      if (
        text.match(
          /^[\w\s-]+(px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr|gap|flex|grid|bg|text|border|rounded|shadow|hover|focus|from|to|via)[\w\s-]*$/,
        )
      ) {
        continue;
      }

      // Skip if it's a file path or import path
      if (
        text.startsWith("@/") ||
        text.startsWith("./") ||
        text.startsWith("../")
      ) {
        continue;
      }

      // Skip single characters and short code symbols
      if (text.length <= 3) {
        continue;
      }

      // Skip MIME types
      if (text.includes("/") && text.includes("charset")) {
        continue;
      }

      // Only flag if it looks like user-visible text
      // (contains space OR is longer than 15 chars)
      const looksLikeUserText = text.includes(" ") || text.length > 15;

      if (looksLikeUserText && !shouldIgnore(text)) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index,
          text,
          context: line.trim(),
          type: "string-literal",
        });
      }
    }
  });

  return violations;
}

function extractTemplateLiterals(
  content: string,
  filePath: string,
): Violation[] {
  const violations: Violation[] = [];
  const lines = content.split("\n");

  // Pattern for template literals
  const templatePattern = /`([^`\n]+)`/g;

  lines.forEach((line, lineIndex) => {
    // Skip imports and comments
    if (line.trim().startsWith("import ") || line.trim().startsWith("//")) {
      return;
    }

    // Skip template literals used for CSS classes
    if (line.includes("className=")) {
      return;
    }

    let match;
    while ((match = templatePattern.exec(line)) !== null) {
      const text = match[1].trim();
      const staticText = text.replace(/\$\{[^}]*\}/g, "").trim();

      // Only flag if it contains actual text (not just variables)
      const hasText = /[a-zA-Z]{3,}/.test(staticText);

      if (hasText && !shouldIgnore(staticText)) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index,
          text: staticText,
          context: line.trim(),
          type: "template-literal",
        });
      }
    }
  });

  return violations;
}

async function scanFile(filePath: string): Promise<Violation[]> {
  if (shouldSkipFile(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const violations: Violation[] = [];

  // Skip files that are mostly imports/exports
  const codeLines = content.split("\n").filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      !trimmed.startsWith("import ") &&
      !trimmed.startsWith("export ") &&
      !trimmed.startsWith("//")
    );
  });

  if (codeLines.length < 5) {
    return violations; // Skip small utility files
  }

  // Extract different types of violations
  violations.push(...extractJSXText(content, filePath));
  violations.push(...extractAttributes(content, filePath));
  violations.push(...extractStringLiterals(content, filePath));
  violations.push(...extractTemplateLiterals(content, filePath));

  return violations;
}

// ===========================
// Main Scanner
// ===========================

async function scan(): Promise<ScanResult> {
  console.log("🔍 Scanning for hardcoded text...\n");

  // Find all files to scan
  const files = await glob(CONFIG.include, {
    ignore: CONFIG.exclude,
    cwd: process.cwd(),
  });

  console.log(`📁 Found ${files.length} files to scan\n`);

  const allViolations: Violation[] = [];
  let scannedCount = 0;

  // Scan each file
  for (const file of files) {
    const violations = await scanFile(file);
    if (violations.length > 0) {
      allViolations.push(...violations);
      scannedCount++;
    }
  }

  // Calculate summary
  const summary = {
    "jsx-text": 0,
    "string-literal": 0,
    "template-literal": 0,
    placeholder: 0,
    "aria-label": 0,
    title: 0,
    alt: 0,
  };

  allViolations.forEach((v) => {
    summary[v.type]++;
  });

  return {
    totalFiles: files.length,
    scannedFiles: scannedCount,
    violations: allViolations,
    summary,
  };
}

// ===========================
// Reporting
// ===========================

function printReport(result: ScanResult) {
  console.log("\n" + "=".repeat(80));
  console.log("📊 I18N SCAN REPORT");
  console.log("=".repeat(80) + "\n");

  console.log(`📁 Total Files Scanned: ${result.totalFiles}`);
  console.log(`⚠️  Files with Violations: ${result.scannedFiles}`);
  console.log(`❌ Total Violations: ${result.violations.length}\n`);

  if (result.violations.length === 0) {
    console.log("✅ No hardcoded text found! Great job! 🎉\n");
    return;
  }

  // Print summary by type
  console.log("📈 Violations by Type:");
  Object.entries(result.summary).forEach(([type, count]) => {
    if (count > 0) {
      console.log(`   ${type.padEnd(20)} ${count}`);
    }
  });
  console.log("");

  // Group violations by file
  const byFile: { [file: string]: Violation[] } = {};
  result.violations.forEach((v) => {
    if (!byFile[v.file]) {
      byFile[v.file] = [];
    }
    byFile[v.file].push(v);
  });

  // Print violations by file
  console.log("📝 Violations by File:\n");
  Object.entries(byFile).forEach(([file, violations]) => {
    console.log(`\n📄 ${file} (${violations.length} violations)`);
    console.log("─".repeat(80));

    violations.forEach((v) => {
      console.log(`   Line ${v.line}:${v.column} [${v.type}]`);
      console.log(`   Text: "${v.text}"`);
      console.log(`   Context: ${v.context}`);
      console.log("");
    });
  });

  // Recommendations
  console.log("\n" + "=".repeat(80));
  console.log("💡 RECOMMENDATIONS");
  console.log("=".repeat(80) + "\n");
  console.log("1. Add translation keys to locales/en.json");
  console.log("2. Use useTranslations() hook in components");
  console.log('3. Replace hardcoded text with t("key") calls');
  console.log("4. Run tests: npm run test:i18n");
  console.log("\nSee docs/I18N_IMPLEMENTATION_GUIDE.md for details.\n");
}

function generateSuggestedKeys(result: ScanResult) {
  console.log("\n" + "=".repeat(80));
  console.log("🔑 SUGGESTED TRANSLATION KEYS");
  console.log("=".repeat(80) + "\n");

  const suggestions: { [namespace: string]: { [key: string]: string } } = {};

  result.violations.forEach((v) => {
    // Infer namespace from file path
    let namespace = "common";
    if (v.file.includes("components/features/")) {
      const component = v.file.split("components/features/")[1].split(".")[0];
      namespace = component
        .toLowerCase()
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase();
    } else if (v.file.includes("app/")) {
      namespace = "page";
    }

    // Generate key from text
    const key = v.text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join("_");

    if (!suggestions[namespace]) {
      suggestions[namespace] = {};
    }

    suggestions[namespace][key] = v.text;
  });

  console.log("Add these to locales/en.json:\n");
  console.log(JSON.stringify(suggestions, null, 2));
  console.log("");
}

// ===========================
// CLI
// ===========================

async function main() {
  const args = process.argv.slice(2);
  const isValidateMode = args.includes("--validate");
  const isFixMode = args.includes("--fix");
  const showSuggestions = args.includes("--suggest");

  try {
    const result = await scan();
    printReport(result);

    if (showSuggestions && result.violations.length > 0) {
      generateSuggestedKeys(result);
    }

    if (isFixMode) {
      console.log("⚠️  Auto-fix mode is not yet implemented.");
      console.log("Please manually update components with translation keys.\n");
    }

    // Exit with error in validate mode if violations found
    if (isValidateMode && result.violations.length > 0) {
      console.error(
        "❌ I18N validation failed. Fix violations before proceeding.\n",
      );
      process.exit(1);
    }

    if (result.violations.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error during scan:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for testing
export {
  scan,
  scanFile,
  shouldIgnore,
  extractJSXText,
  extractAttributes,
  extractStringLiterals,
  extractTemplateLiterals,
};
