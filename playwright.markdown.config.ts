import { defineConfig, devices } from "@playwright/test";
const baseURL = process.env.MARKDOWN_QA_URL || "http://127.0.0.1:4388";
export default defineConfig({
  testDir: "./__tests__/e2e", testMatch: "ai-markdown.spec.ts", workers: 1, retries: 0,
  reporter: [["list"], ["json", { outputFile: "output/markdown-browser.json" }]],
  use: { baseURL, launchOptions: { executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" } },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: process.env.MARKDOWN_QA_URL ? undefined : {
    command: "node node_modules/wrangler/bin/wrangler.js dev --config output/adsense-release/wrangler.json --local --ip 127.0.0.1 --port 4388 --inspector-port 0",
    url: baseURL, reuseExistingServer: false, timeout: 60000,
  },
});
