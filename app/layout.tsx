import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { Header, Footer } from "@/components/layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

// Generate comprehensive metadata
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.home");
  const locale = await getLocale();

  // Base URL - update this with your production domain
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://whatismyname.org";
  const canonicalUrl = `${baseUrl}/${locale === "en" ? "" : locale}`;

  return {
    // Basic metadata
    title: {
      default: t("title"),
      template: "%s | What is my Name",
    },
    description: t("description"),
    applicationName: "What is my Name",
    authors: [{ name: "What is my Name Team" }],
    creator: "What is my Name",
    publisher: "What is my Name",
    keywords: [
      "username search",
      "what is my name",
      "social media search",
      "digital footprint",
      "OSINT",
      "username availability",
      "platform search",
      "identity verification",
      "username finder",
      "social discovery",
      "online presence",
      "cyber security",
      "digital identity",
      "privacy audit",
      "account finder",
      "username checker",
      "social media username",
      "digital privacy",
      "identity protection",
      "username tracker",
      "social media scanner",
    ],

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Icons
    icons: {
      icon: [
        { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
        { url: "/favicon.ico" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
    },

    // Manifest
    manifest: "/site.webmanifest",

    // Open Graph
    openGraph: {
      type: "website",
      locale: locale,
      url: canonicalUrl,
      siteName: "What is my Name",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${baseUrl}/images/og-image.svg`,
          width: 1200,
          height: 630,
          alt: "whatismyname - Search Username Across 1,400+ Platforms",
          type: "image/svg+xml",
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/images/og-image.svg`],
      creator: "@whatismyname",
      site: "@whatismyname",
    },

    // Language alternates
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/en`,
        en: `${baseUrl}/en`,
        zh: `${baseUrl}/zh`,
        es: `${baseUrl}/es`,
        ja: `${baseUrl}/ja`,
        fr: `${baseUrl}/fr`,
        ko: `${baseUrl}/ko`,
      },
    },

    // Additional metadata
    category: "technology",
    classification: "Business",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    // Other
    other: {
      "msapplication-TileColor": "#2563eb",
      "msapplication-config": "/browserconfig.xml",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Resource hints for Core Web Vitals */}
        <link rel="preconnect" href="https://api.whatsmynameapp.org" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://openrouter.ai" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
