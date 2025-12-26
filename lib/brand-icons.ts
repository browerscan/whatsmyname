import { BRAND_ICONS } from "./constants";
import { extractDomain } from "./formatters";

export interface BrandInfo {
  icon: string | null;
  color: string | null;
  domain: string;
}

/**
 * Get brand icon and color for a given URL or domain
 */
export function getBrandInfo(urlOrDomain: string): BrandInfo {
  const domain = extractDomain(urlOrDomain);

  // Check if we have a brand icon for this domain
  const brandData = BRAND_ICONS[domain];

  if (brandData) {
    return {
      icon: brandData.icon,
      color: brandData.color,
      domain,
    };
  }

  // Return null if no brand icon found
  return {
    icon: null,
    color: null,
    domain,
  };
}

/**
 * Check if a domain has a brand icon
 */
export function hasBrandIcon(urlOrDomain: string): boolean {
  const domain = extractDomain(urlOrDomain);
  return domain in BRAND_ICONS;
}

/**
 * Get all supported brand domains
 */
export function getSupportedBrands(): string[] {
  return Object.keys(BRAND_ICONS);
}

/**
 * Get favicon URL for a domain (fallback when no brand icon)
 */
export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * Get the best icon for a URL (brand icon or favicon)
 */
export function getIconForUrl(url: string): {
  type: "brand" | "favicon";
  value: string;
  color?: string;
} {
  const brandInfo = getBrandInfo(url);

  if (brandInfo.icon) {
    return {
      type: "brand",
      value: brandInfo.icon,
      color: brandInfo.color || undefined,
    };
  }

  return {
    type: "favicon",
    value: getFaviconUrl(brandInfo.domain),
  };
}
