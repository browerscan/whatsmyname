import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Run on OpenClaw after OpenNext build AND Wrangler's bundling dry-run.
// OpenNext's raw worker.js is an entry point, not a deployable no-bundle file.
const target = "output/adsense-release";
if (existsSync(target)) throw new Error("Release output already exists; use a fresh build workspace/output.");
const worker = readFileSync("output/worker-bundle/worker.js");
if (worker.length < 100_000) throw new Error("Expected Wrangler's compiled application, not the raw entry point.");
const sourceAds = readFileSync("public/ads.txt");
if (!sourceAds.equals(readFileSync(".open-next/assets/ads.txt"))) throw new Error("ads.txt build mismatch");
mkdirSync(target, { recursive: true });
cpSync("output/worker-bundle/worker.js", `${target}/worker.js`);
cpSync(".open-next/assets", `${target}/assets`, { recursive: true });
writeFileSync(`${target}/wrangler.json`, JSON.stringify({
  name: "whatsmyname", main: "worker.js",
  compatibility_date: "2024-12-01", compatibility_flags: ["nodejs_compat"],
  no_bundle: true, find_additional_modules: false, upload_source_maps: false,
  assets: { directory: "assets", binding: "ASSETS" },
  vars: { NODE_ENV: "production", NEXT_PUBLIC_BASE_URL: "https://whatismyname.org" },
}, null, 2) + "\n");
console.log(JSON.stringify({
  output: target,
  worker_sha256: createHash("sha256").update(worker).digest("hex"),
  ads_sha256: createHash("sha256").update(sourceAds).digest("hex"),
}));
