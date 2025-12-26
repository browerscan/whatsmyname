# Assets Setup Guide

This directory contains all static assets for the whatismyname application.

## Required Assets

### Favicons (place in `/public/icons/`)

Generate these using a service like [realfavicongenerator.net](https://realfavicongenerator.net):

- `favicon.ico` (32x32, 16x16 multi-resolution)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Open Graph Image (place in `/public/images/`)

- `og-image.png` (1200x630) - Main Open Graph image for social sharing
- `og-image-twitter.png` (1200x600) - Twitter-optimized version

## Image Guidelines

### OG Image Design

- **Size**: 1200x630px (Facebook/LinkedIn standard)
- **Safe zone**: Keep important content in the center 1200x600px
- **Format**: PNG or JPG
- **File size**: < 1MB
- **Content**:
  - App name: "whatismyname"
  - Tagline: "Search Username Across 1,400+ Platforms"
  - Simple, bold design with high contrast
  - Include app icon/logo if available

### Favicon Requirements

- Simple, recognizable at small sizes
- Use 2-3 colors maximum
- Consider using first letter "W" or a magnifying glass icon
- Ensure visibility on both light and dark backgrounds

## Temporary Placeholders

Until proper assets are created, the app will use:

- Next.js default favicon
- Generated placeholder OG images
- System default icons

## Asset Generation Tools

Recommended tools:

- **Figma**: Design OG images
- **Canva**: Quick OG image templates
- **RealFaviconGenerator**: Generate all favicon formats
- **ImageMagick**: Batch resize and convert images

## TODO

- [ ] Design and add custom favicon
- [ ] Create branded OG image
- [ ] Generate all required favicon sizes
- [ ] Optimize images for web (compression)
- [ ] Add app logo/icon assets
