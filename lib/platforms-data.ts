/**
 * Platform Data for Programmatic SEO Pages
 *
 * This file contains platform metadata for generating
 * SEO-optimized platform pages.
 */

export interface PlatformMetadata {
  slug: string;
  name: string;
  category: string;
  url: string;
  description: string;
  keywords: string[];
  popularity: number;
  founded?: string;
  type:
    | "social"
    | "coding"
    | "gaming"
    | "business"
    | "entertainment"
    | "news"
    | "forum"
    | "dating"
    | "shopping"
    | "other";
}

/**
 * Platform categories with metadata
 */
export const CATEGORY_METADATA: Record<
  string,
  {
    name: string;
    description: string;
    keywords: string[];
    icon: string;
  }
> = {
  social: {
    name: "Social Media",
    description:
      "Popular social networking platforms where users connect, share content, and communicate with friends, family, and communities worldwide.",
    keywords: [
      "social media platforms",
      "social networking",
      "social media search",
      "find social media accounts",
      "social media username check",
      "social presence",
    ],
    icon: "users",
  },
  coding: {
    name: "Developer & Coding",
    description:
      "Platforms for developers, programmers, and tech enthusiasts to share code, collaborate on projects, and showcase their work.",
    keywords: [
      "developer platforms",
      "coding platforms",
      "GitHub alternatives",
      "programmer communities",
      "developer portfolio",
      "code hosting",
    ],
    icon: "code",
  },
  gaming: {
    name: "Gaming",
    description:
      "Gaming platforms, streaming services, and gaming communities where players connect, compete, and share their gaming experiences.",
    keywords: [
      "gaming platforms",
      "gaming username",
      "gamer tags",
      "gaming social",
      "game streaming",
      "gaming communities",
    ],
    icon: "gamepad-2",
  },
  business: {
    name: "Business & Professional",
    description:
      "Professional networking and business platforms for career development, job searching, and industry connections.",
    keywords: [
      "professional networking",
      "business platforms",
      "LinkedIn alternatives",
      "professional username",
      "career platforms",
      "business networking",
    ],
    icon: "briefcase",
  },
  entertainment: {
    name: "Entertainment",
    description:
      "Entertainment platforms including streaming services, video sharing, and creative content creation.",
    keywords: [
      "entertainment platforms",
      "streaming services",
      "video platforms",
      "content creation",
      "creative platforms",
    ],
    icon: "film",
  },
  news: {
    name: "News & Media",
    description:
      "News aggregation and media platforms for staying updated on current events and trending topics.",
    keywords: [
      "news platforms",
      "media aggregation",
      "news reading",
      "content curation",
      "news discovery",
    ],
    icon: "newspaper",
  },
  forum: {
    name: "Forums & Communities",
    description:
      "Discussion forums and community platforms for sharing knowledge, asking questions, and connecting with like-minded individuals.",
    keywords: [
      "forum platforms",
      "online communities",
      "discussion boards",
      "question and answer",
      "community platforms",
    ],
    icon: "message-square",
  },
  dating: {
    name: "Dating & Relationships",
    description:
      "Dating and relationship platforms for meeting new people and finding romantic connections.",
    keywords: [
      "dating platforms",
      "dating apps",
      "relationship platforms",
      "meet new people",
      "online dating",
    ],
    icon: "heart",
  },
  shopping: {
    name: "Shopping & E-commerce",
    description:
      "E-commerce platforms and marketplaces for buying, selling, and discovering products.",
    keywords: [
      "shopping platforms",
      "e-commerce sites",
      "online marketplaces",
      "product reviews",
      "shopping accounts",
    ],
    icon: "shopping-cart",
  },
  other: {
    name: "Other Platforms",
    description:
      "A diverse collection of platforms across various categories including niche services and specialized tools.",
    keywords: [
      "online platforms",
      "web services",
      "digital tools",
      "username check",
      "platform availability",
    ],
    icon: "grid",
  },
};

/**
 * Popular platforms with metadata for SEO pages
 * This is a curated list for demonstration - expand as needed
 */
export const POPULAR_PLATFORMS: PlatformMetadata[] = [
  // Social Media
  {
    slug: "twitter",
    name: "Twitter / X",
    category: "social",
    url: "https://twitter.com",
    description:
      "Twitter is a real-time social networking platform where users post and interact with messages known as tweets. Now known as X, it remains one of the most influential social media platforms globally.",
    keywords: [
      "twitter username search",
      "x username check",
      "twitter name availability",
      "find twitter account",
      "x handle lookup",
    ],
    popularity: 98,
    founded: "2006",
    type: "social",
  },
  {
    slug: "instagram",
    name: "Instagram",
    category: "social",
    url: "https://instagram.com",
    description:
      "Instagram is a photo and video sharing social networking service. Users can share photos, videos, and stories with followers, and discover content from creators worldwide.",
    keywords: [
      "instagram username search",
      "instagram name availability",
      "find instagram account",
      "ig username check",
      "instagram handle lookup",
    ],
    popularity: 97,
    founded: "2010",
    type: "social",
  },
  {
    slug: "facebook",
    name: "Facebook",
    category: "social",
    url: "https://facebook.com",
    description:
      "Facebook is a social networking service that allows users to create profiles, connect with friends, share content, and join communities based on interests.",
    keywords: [
      "facebook username search",
      "facebook name availability",
      "find facebook profile",
      "fb username check",
      "facebook account lookup",
    ],
    popularity: 95,
    founded: "2004",
    type: "social",
  },
  {
    slug: "tiktok",
    name: "TikTok",
    category: "social",
    url: "https://tiktok.com",
    description:
      "TikTok is a short-form video hosting service featuring user-generated videos. Known for its viral trends and algorithm-driven content discovery.",
    keywords: [
      "tiktok username search",
      "tiktok name availability",
      "find tiktok account",
      "tiktok handle check",
      "tiktok username lookup",
    ],
    popularity: 96,
    founded: "2016",
    type: "social",
  },
  {
    slug: "youtube",
    name: "YouTube",
    category: "entertainment",
    url: "https://youtube.com",
    description:
      "YouTube is a video sharing platform where users can upload, watch, and share videos. It's the largest video platform globally with billions of users.",
    keywords: [
      "youtube username search",
      "youtube channel name",
      "find youtube account",
      "yt username check",
      "youtube handle lookup",
    ],
    popularity: 99,
    founded: "2005",
    type: "entertainment",
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    category: "business",
    url: "https://linkedin.com",
    description:
      "LinkedIn is a professional networking platform focused on career development, job searching, and business connections. Essential for professional networking.",
    keywords: [
      "linkedin username search",
      "linkedin profile url",
      "find linkedin account",
      "linkedin name availability",
      "professional username check",
    ],
    popularity: 94,
    founded: "2003",
    type: "business",
  },
  {
    slug: "reddit",
    name: "Reddit",
    category: "forum",
    url: "https://reddit.com",
    description:
      "Reddit is a community-driven platform where users share content, discuss topics, and vote on posts. Known as the 'front page of the internet'.",
    keywords: [
      "reddit username search",
      "reddit name availability",
      "find reddit account",
      "reddit user lookup",
      "reddit username check",
    ],
    popularity: 92,
    founded: "2005",
    type: "forum",
  },
  {
    slug: "github",
    name: "GitHub",
    category: "coding",
    url: "https://github.com",
    description:
      "GitHub is a code hosting platform for version control and collaboration. Essential for developers to share projects and contribute to open source.",
    keywords: [
      "github username search",
      "github profile lookup",
      "find github account",
      "github name availability",
      "developer username check",
    ],
    popularity: 93,
    founded: "2008",
    type: "coding",
  },
  {
    slug: "pinterest",
    name: "Pinterest",
    category: "social",
    url: "https://pinterest.com",
    description:
      "Pinterest is a visual discovery platform where users save and share ideas through images and pins. Popular for inspiration in fashion, food, and DIY.",
    keywords: [
      "pinterest username search",
      "pinterest name availability",
      "find pinterest account",
      "pinterest profile lookup",
      "pinterest username check",
    ],
    popularity: 85,
    founded: "2010",
    type: "social",
  },
  {
    slug: "snapchat",
    name: "Snapchat",
    category: "social",
    url: "https://snapchat.com",
    description:
      "Snapchat is a multimedia messaging app known for disappearing messages and augmented reality features. Popular among younger demographics.",
    keywords: [
      "snapchat username search",
      "snapchat name availability",
      "find snapchat account",
      "snap username check",
      "snapchat username lookup",
    ],
    popularity: 84,
    founded: "2011",
    type: "social",
  },
  {
    slug: "twitch",
    name: "Twitch",
    category: "gaming",
    url: "https://twitch.tv",
    description:
      "Twitch is a live streaming platform focused on video game live streaming and esports. Also features music, creative content, and 'in real life' streams.",
    keywords: [
      "twitch username search",
      "twitch name availability",
      "find twitch account",
      "twitch channel lookup",
      "twitch username check",
    ],
    popularity: 88,
    founded: "2011",
    type: "gaming",
  },
  {
    slug: "discord",
    name: "Discord",
    category: "gaming",
    url: "https://discord.com",
    description:
      "Discord is a voice, video, and text communication platform. Originally for gamers, now used by communities of all types for organized communication.",
    keywords: [
      "discord username search",
      "discord name availability",
      "find discord account",
      "discord username lookup",
      "discord user check",
    ],
    popularity: 90,
    founded: "2015",
    type: "gaming",
  },
  {
    slug: "medium",
    name: "Medium",
    category: "social",
    url: "https://medium.com",
    description:
      "Medium is a blogging and publishing platform for writers and readers. Features long-form content on diverse topics from technology to culture.",
    keywords: [
      "medium username search",
      "medium publication lookup",
      "find medium account",
      "medium writer check",
      "medium username availability",
    ],
    popularity: 75,
    founded: "2012",
    type: "social",
  },
  {
    slug: "spotify",
    name: "Spotify",
    category: "entertainment",
    url: "https://spotify.com",
    description:
      "Spotify is a digital music streaming service offering millions of songs and podcasts. Users can create playlists and discover new music.",
    keywords: [
      "spotify username search",
      "spotify profile lookup",
      "find spotify account",
      "spotify name check",
      "music streaming username",
    ],
    popularity: 89,
    founded: "2006",
    type: "entertainment",
  },
  {
    slug: "patreon",
    name: "Patreon",
    category: "business",
    url: "https://patreon.com",
    description:
      "Patreon is a membership platform for creators to receive recurring income from their fans. Used by artists, podcasters, and content creators.",
    keywords: [
      "patreon username search",
      "patreon creator lookup",
      "find patreon account",
      "patreon name check",
      "creator platform username",
    ],
    popularity: 72,
    founded: "2013",
    type: "business",
  },
  {
    slug: "flickr",
    name: "Flickr",
    category: "social",
    url: "https://flickr.com",
    description:
      "Flickr is a photo sharing and hosting service. Popular among photographers for showcasing and organizing their photography portfolios.",
    keywords: [
      "flickr username search",
      "flickr photostream lookup",
      "find flickr account",
      "flickr name availability",
      "photo sharing username",
    ],
    popularity: 65,
    founded: "2004",
    type: "social",
  },
  {
    slug: "soundcloud",
    name: "SoundCloud",
    category: "entertainment",
    url: "https://soundcloud.com",
    description:
      "SoundCloud is a music streaming platform for artists to share their music. Popular among independent musicians and podcasters.",
    keywords: [
      "soundcloud username search",
      "soundcloud artist lookup",
      "find soundcloud account",
      "soundcloud name check",
      "music platform username",
    ],
    popularity: 76,
    founded: "2007",
    type: "entertainment",
  },
  {
    slug: "deviantart",
    name: "DeviantArt",
    category: "entertainment",
    url: "https://deviantart.com",
    description:
      "DeviantArt is an online art community featuring artwork, photography, and creative writing. A platform for artists to showcase and share their work.",
    keywords: [
      "deviantart username search",
      "deviantart artist lookup",
      "find deviantart account",
      "art platform username",
      "deviantart name availability",
    ],
    popularity: 70,
    founded: "2000",
    type: "entertainment",
  },
  {
    slug: "dribbble",
    name: "Dribbble",
    category: "business",
    url: "https://dribbble.com",
    description:
      "Dribbble is a community for designers to share screenshots of their work. A showcase platform for UI/UX designers and digital artists.",
    keywords: [
      "dribbble username search",
      "dribbble designer lookup",
      "find dribbble account",
      "design platform username",
      "dribbble portfolio check",
    ],
    popularity: 73,
    founded: "2009",
    type: "business",
  },
  {
    slug: "behance",
    name: "Behance",
    category: "business",
    url: "https://behance.net",
    description:
      "Behance is a creative platform for showcasing creative work. Used by designers, illustrators, and photographers to display portfolios.",
    keywords: [
      "behance username search",
      "behance portfolio lookup",
      "find behance account",
      "creative platform username",
      "behance name availability",
    ],
    popularity: 74,
    founded: "2005",
    type: "business",
  },
  {
    slug: "stack-overflow",
    name: "Stack Overflow",
    category: "coding",
    url: "https://stackoverflow.com",
    description:
      "Stack Overflow is a question and answer platform for professional and enthusiast programmers. Essential resource for coding help.",
    keywords: [
      "stackoverflow username search",
      "stackoverflow profile lookup",
      "find stackoverflow account",
      "coding platform username",
      "developer reputation check",
    ],
    popularity: 86,
    founded: "2008",
    type: "coding",
  },
  {
    slug: "steam",
    name: "Steam",
    category: "gaming",
    url: "https://steampowered.com",
    description:
      "Steam is a digital distribution platform for video games. Offers multiplayer gaming, video streaming, and social networking services.",
    keywords: [
      "steam username search",
      "steam profile lookup",
      "find steam account",
      "steam id check",
      "gaming platform username",
    ],
    popularity: 91,
    founded: "2003",
    type: "gaming",
  },
  {
    slug: "discord",
    name: "Discord",
    category: "gaming",
    url: "https://discord.com",
    description:
      "Discord is a communication platform for communities. Offers voice, video, and text chat channels organized by servers.",
    keywords: [
      "discord username search",
      "discord server lookup",
      "find discord account",
      "discord user check",
      "community platform username",
    ],
    popularity: 90,
    founded: "2015",
    type: "gaming",
  },
];

/**
 * Get platform metadata by slug
 */
export function getPlatformBySlug(slug: string): PlatformMetadata | undefined {
  return POPULAR_PLATFORMS.find((p) => p.slug === slug);
}

/**
 * Get platforms by category
 */
export function getPlatformsByCategory(category: string): PlatformMetadata[] {
  return POPULAR_PLATFORMS.filter((p) => p.category === category);
}

/**
 * Get all platform slugs for static generation
 */
export function getAllPlatformSlugs(): string[] {
  return POPULAR_PLATFORMS.map((p) => p.slug);
}

/**
 * Get all categories for static generation
 */
export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_METADATA);
}

/**
 * Search platforms by name
 */
export function searchPlatforms(query: string): PlatformMetadata[] {
  const lowerQuery = query.toLowerCase();
  return POPULAR_PLATFORMS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.slug.includes(lowerQuery) ||
      p.keywords.some((k) => k.toLowerCase().includes(lowerQuery)),
  );
}
