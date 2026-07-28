import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isProduction = process.env.NODE_ENV === "production";
const adsenseScriptSources = [
  "https://pagead2.googlesyndication.com",
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.google.com",
].join(" ");
const adsenseConnectionSources = [
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.google.com",
].join(" ");
const contentSecurityPolicy = [
  "default-src 'self'",
  isProduction
    ? `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com ${adsenseScriptSources}`
    : `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com ${adsenseScriptSources}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  isProduction
    ? `connect-src 'self' ${adsenseConnectionSources}`
    : `connect-src 'self' https://api.whatsmynameapp.org https://www.googleapis.com https://*.googleapis.com https://google.com https://*.google.com https://openrouter.ai https://*.openrouter.ai ${adsenseConnectionSources}`,
  `frame-src 'self' ${adsenseConnectionSources}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
