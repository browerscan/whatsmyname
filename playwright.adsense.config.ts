import { defineConfig, devices } from "@playwright/test";

// Executed only through the OpenClaw E2E lane. Playwright owns server teardown.
const baseURL = process.env.ADSENSE_QA_URL || "http://localhost:4387";
export default defineConfig({
  testDir: "./__tests__/e2e",
  testMatch: "advertising.spec.ts",
  workers: 1,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "output/adsense-browser.json" }]],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: process.env.ADSENSE_QA_URL ? undefined : {
    command: process.env.ADSENSE_QA_WORKER
      ? "pnpm exec wrangler dev --config output/adsense-release/wrangler.json --local --ip 127.0.0.1 --port 4387 --inspector-port 0"
      : "pnpm exec next start --hostname 127.0.0.1 --port 4387",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60000,
  },
});
