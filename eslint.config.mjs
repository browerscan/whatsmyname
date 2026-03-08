import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      ".pnpm-store/**",
      ".wrangler/**",
      "dist/**",
      "build/**",
      "out/**",
      "coverage/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "components/features/GoogleResultCard.tsx",
      "components/features/PlatformCard.tsx",
    ],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["components/features/PlatformGrid.tsx"],
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["content/education/*.ts"],
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default config;
