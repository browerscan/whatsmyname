/**
 * OpenNext Configuration for Cloudflare Workers
 *
 * This configures how the Next.js app is transformed for Cloudflare Workers.
 * See: https://opennext.js.org/cloudflare
 */

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Cloudflare-specific overrides
  // For most apps, the defaults work well
  // Uncomment options below as needed
  // incrementalCache: "dummy",
  // tagCache: "dummy",
  // queue: "direct",
  // routePreloadingBehavior: "none",
});
