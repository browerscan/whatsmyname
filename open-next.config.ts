/**
 * OpenNext Configuration for Cloudflare Workers
 *
 * This configures how the Next.js app is transformed for Cloudflare Workers.
 * See: https://opennext.js.org/cloudflare
 */

import { defineConfig } from "@opennextjs/cloudflare";

export default defineConfig({
  // Cloudflare-specific options
  cloudflare: {
    // Enable image optimization using Cloudflare Images
    // Requires Cloudflare Images to be configured
    images: {
      // You can use 'sharp' for local optimization or 'cloudflare' for the service
      optimizer: "sharp",
    },

    // Enable static assets optimization
    staticAssets: {
      // Cache static assets at the edge
      cacheControl: "public, max-age=31536000, immutable",
    },
  },

  // Build options
  build: {
    // Override the default build output directory
    output: ".open-next",

    // Enable standalone build mode
    // This creates a minimal server bundle
    standalone: false,
  },

  // Next.js app options
  app: {
    // The path to your Next.js app
    path: ".",

    // Override the default Next.js build command
    buildCommand: "npm run build",
  },

  // Override the default edge function bundle
  edge: {
    // Specify additional files to include in the edge bundle
    include: [],
  },
});
