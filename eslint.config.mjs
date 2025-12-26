import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
      "coverage/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
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
];

export default config;
