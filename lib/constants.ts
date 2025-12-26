// Brand Icons Mapping for Google Results
export const BRAND_ICONS: Record<string, { icon: string; color: string }> = {
  "github.com": { icon: "github", color: "#181717" },
  "twitter.com": { icon: "twitter", color: "#1DA1F2" },
  "x.com": { icon: "twitter", color: "#000000" },
  "linkedin.com": { icon: "linkedin", color: "#0A66C2" },
  "facebook.com": { icon: "facebook", color: "#1877F2" },
  "instagram.com": { icon: "instagram", color: "#E4405F" },
  "youtube.com": { icon: "youtube", color: "#FF0000" },
  "reddit.com": { icon: "reddit", color: "#FF4500" },
  "medium.com": { icon: "medium", color: "#000000" },
  "stackoverflow.com": { icon: "stack-overflow", color: "#F48024" },
  "discord.com": { icon: "discord", color: "#5865F2" },
  "twitch.tv": { icon: "twitch", color: "#9146FF" },
  "tiktok.com": { icon: "tiktok", color: "#000000" },
  "pinterest.com": { icon: "pinterest", color: "#E60023" },
  "snapchat.com": { icon: "snapchat", color: "#FFFC00" },
};

// Username Validation
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
/**
 * Secure username regex pattern
 * - Must start with a letter or number
 * - Can contain letters, numbers, underscores, and hyphens in the middle
 * - Must end with a letter or number
 * - Prevents path traversal and confusing usernames
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/;

// API Configuration
export const API_ENDPOINTS = {
  WHATSMYNAME: "/api/search/whatsmyname",
  GOOGLE: "/api/search/google",
  AI_ANALYZE: "/api/ai/analyze",
} as const;

// Default Values
export const DEFAULT_FILTER_OPTIONS = {
  status: "all" as const,
  category: null,
  showNSFW: false,
  searchQuery: "",
};

export const DEFAULT_SORT_OPTIONS = {
  sortBy: "default" as const,
  order: "asc" as const,
};

// Categories (will be populated from actual results)
export const COMMON_CATEGORIES = [
  "social",
  "coding",
  "gaming",
  "business",
  "entertainment",
  "news",
  "forum",
  "dating",
  "shopping",
  "other",
];

// Response Time Thresholds (in milliseconds)
export const RESPONSE_TIME_THRESHOLDS = {
  FAST: 500,
  MEDIUM: 1000,
  SLOW: 2000,
} as const;

// Virtualization Settings
export const VIRTUAL_SCROLL_CONFIG = {
  ITEM_HEIGHT: 120, // Height of each PlatformCard
  OVERSCAN: 5, // Number of items to render outside visible area
  CONTAINER_HEIGHT: 600, // Height of scrollable container
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  RECENT_SEARCHES: "whatsmyname_recent_searches",
  FILTER_PREFERENCES: "whatsmyname_filter_preferences",
  THEME_PREFERENCE: "whatsmyname_theme",
} as const;

// Limits
export const MAX_RECENT_SEARCHES = 10;
export const MAX_AI_MESSAGES = 50;

// Debounce Delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH_INPUT: 300,
  FILTER_CHANGE: 150,
} as const;

// Contact / External Links
export const CONTACT_EMAIL = "findme@whatismyname.org";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_GITHUB_URL = "https://github.com";
