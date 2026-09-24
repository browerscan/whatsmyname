import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

// Read-only browser diagnostic on OpenClaw. The response-only instrumentation
// adds a log at React's existing throw site; it does not suppress the error.
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
const records = [];
try {
  for (let attempt = 0; attempt < 40 && records.filter((r) => r.detail).length < 2; attempt++) {
    const page = await browser.newPage();
    const record = { attempt, path: attempt % 2 ? "/zh/privacy" : "/categories", errors: [], patched: false };
    await page.route("**/adsbygoogle.js*", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    await page.route("**/4bd1b696-*.js", async (route) => {
      const response = await route.fetch();
      const source = await response.text();
      const needle = "function rD(e){var n=Error(i(418,";
      if (!source.includes(needle)) throw new Error("React diagnostic anchor changed");
      const inject = 'function rD(e){console.log("HYDRATION_DETAIL:"+JSON.stringify({expectedType:typeof e.type==="string"?e.type:"component",fiberTag:e.tag,expectedProps:Object.fromEntries(Object.entries(e.pendingProps||{}).filter(([k,v])=>k!=="children"&&(typeof v==="string"||typeof v==="number"))),actual:rN&&rN.outerHTML?rN.outerHTML.slice(0,1400):String(rN),parent:rN&&rN.parentElement?rN.parentElement.tagName:null}));var n=Error(i(418,';
      record.patched = true;
      await route.fulfill({ response, body: source.replace(needle, inject) });
    });
    page.on("console", (message) => {
      if (message.text().startsWith("HYDRATION_DETAIL:")) record.detail = JSON.parse(message.text().slice("HYDRATION_DETAIL:".length));
    });
    page.on("pageerror", (error) => record.errors.push(error.message));
    await page.goto("https://whatismyname.org" + record.path);
    await page.getByRole("button", { name: /Toggle theme|切换主题/ }).click();
    await page.waitForTimeout(300);
    records.push(record);
    console.log(JSON.stringify(record));
    await page.close();
  }
} finally {
  await browser.close();
  const outputDirectory = process.env.OPENCLAW_ARTIFACT_DIR || "output";
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(`${outputDirectory}/hydration-diagnostic.json`, JSON.stringify(records, null, 2));
}
