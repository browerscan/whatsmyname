import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "whatismyname - Username Search Platform",
    short_name: "whatismyname",
    description:
      "Search your username across 1,400+ platforms instantly. Discover your digital footprint, analyze with AI, and secure your online identity.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: ["productivity", "utilities", "security"],

    icons: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],

    shortcuts: [
      {
        name: "New Search",
        short_name: "Search",
        description: "Start a new username search",
        url: "/",
        icons: [
          {
            src: "/icons/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],

    screenshots: [
      {
        src: "/images/og-image.svg",
        sizes: "1200x630",
        type: "image/svg+xml",
        form_factor: "wide",
        label: "whatismyname Dashboard",
      },
    ],

    related_applications: [],
    prefer_related_applications: false,
  };
}
