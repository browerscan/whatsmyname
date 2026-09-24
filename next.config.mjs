import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isProduction = process.env.NODE_ENV === "production";
// Allowlist ceiling: Google only supports a nonce-based strict CSP for AdSense
// and changes its hosts over time. Move to nonces if new AdSense hosts get blocked.
// *.adtrafficquality.google is the ad traffic quality (sodar) check; Auto ads
// inject Google Sans from fonts.googleapis.com / fonts.gstatic.com.
const advertisingScriptSources = [
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.googletagservices.com",
  "https://*.gstatic.com",
  "https://*.google.com",
  "https://*.adtrafficquality.google",
].join(" ");
const advertisingConnectionSources = [
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.googletagservices.com",
  "https://*.gstatic.com",
  "https://*.google.com",
  "https://*.adtrafficquality.google",
].join(" ");
const contentSecurityPolicy = [
  "default-src 'self'",
  isProduction
    ? `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com ${advertisingScriptSources}`
    : `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com ${advertisingScriptSources}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data: https://fonts.gstatic.com",
  isProduction
    ? `connect-src 'self' ${advertisingConnectionSources}`
    : `connect-src 'self' https://api.whatsmynameapp.org https://www.googleapis.com https://*.googleapis.com https://google.com https://*.google.com https://openrouter.ai https://*.openrouter.ai ${advertisingConnectionSources}`,
  `frame-src 'self' ${advertisingConnectionSources}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Metadata is computed from local translations. Publish it in the initial
  // head for every visitor instead of moving streamed metadata during hydration.
  htmlLimitedBots: /.*/,
  // Memory optimization for development
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 3,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      {
        protocol: "https",
        hostname: "*.google.com",
        pathname: "/s2/favicons/**",
      },
    ],
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Memory optimization for development
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 3,
  },

  // Compress output
  compress: true,

  // Production source maps (disabled for smaller bundle size)
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
      // Cache headers for static assets
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache headers for Next.js static files
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
