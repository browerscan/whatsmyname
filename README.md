# whatsmyname - Username Search Tool

> Search across 1,400+ platforms instantly to discover where your username exists online

A modern, lightning-fast username search tool built with Next.js that searches across 1,400+ platforms using the WhatsMyName API, Google Custom Search, and provides AI-powered insights.

---

## Quick Links

- [Quick Start](#quick-start)
- [Features](#features)
- [Usage Examples](#usage-examples)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 20.9 or higher
- npm or yarn package manager
- API keys (see [Environment Variables](#environment-variables))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/whatsmyname.git
cd whatsmyname

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Verify Installation

Once running, you should see:

- Search bar at the top of the page
- Platform count showing 1,400+
- Language selector in the header
- Theme toggle (light/dark mode)

---

## Features

### Core Features

| Feature               | Description                              |
| --------------------- | ---------------------------------------- |
| Multi-Platform Search | Search 1,400+ platforms simultaneously   |
| Real-Time Streaming   | See results as they arrive               |
| Google Integration    | Complementary Google search results      |
| AI Analysis           | Get intelligent insights about usernames |
| Advanced Filtering    | Filter by status, category, NSFW content |
| Export Results        | Save as CSV or JSON                      |
| Multi-Language        | Support for 6 languages                  |

### Technical Features

- Edge Runtime for global low latency
- TypeScript strict mode for type safety
- WCAG AA accessibility compliance
- Full i18n support (en/zh/es/ja/fr/ko)
- Responsive design (mobile, tablet, desktop)

---

## Usage Examples

### Example 1: Basic Username Search

```bash
# Via web interface
1. Navigate to http://localhost:3000
2. Enter username: "johndoe"
3. Click Search
4. View results in real-time
```

### Example 2: Using AI Analysis

```bash
# After completing a search
1. Click the AI button (bottom-right)
2. Select "Value Assessment" template
3. Review AI insights about username value
```

### Example 3: Export Results

```bash
# After search completes
1. Click Export button
2. Choose format: CSV, JSON, or Copy to Clipboard
3. Save file for documentation
```

### Example 4: Check Username Availability

```bash
# Before claiming a new username
1. Search your desired username
2. Filter by "Not Found" status
3. Use AI "Platform Suggestions" template
4. Get recommendations on where to claim
```

---

## API Documentation

### WhatsMyName Search API

```http
GET /api/search/whatsmyname?username={username}
```

**Response Format:** NDJSON stream

```json
{
  "username": "johndoe",
  "uri": "https://twitter.com/johndoe",
  "source": "Twitter",
  "status": "found",
  "category": "social"
}
```

### Google Search API

```http
GET /api/search/google?username={username}&num=10
```

**Response Format:** JSON array

```json
[
  {
    "title": "Twitter",
    "link": "https://twitter.com/johndoe",
    "snippet": "..."
  }
]
```

### AI Analysis API

```http
POST /api/ai/analyze
Content-Type: application/json

{
  "messages": [
    {"role": "user", "content": "Analyze username johndoe"}
  ]
}
```

**Response Format:** Server-Sent Events (SSE)

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Required: WhatsMyName API
WHATSMYNAME_API_KEY=your_api_key_here

# Required: Google Custom Search
GOOGLE_CUSTOM_SEARCH_API_KEYS=key1,key2,key3
GOOGLE_CUSTOM_SEARCH_CX=your_search_engine_id

# Required: OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Getting API Keys

| Service              | How to Get                                                              |
| -------------------- | ----------------------------------------------------------------------- |
| WhatsMyName          | Visit whatsmyname.app and sign up for API access                        |
| Google Custom Search | Create a Custom Search Engine and get API key from Google Cloud Console |
| OpenRouter           | Sign up at openrouter.ai and get API key from dashboard                 |

---

## Project Structure

```
whatsmyname/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Localized routes
│   │   ├── page.tsx         # Home page
│   │   ├── privacy/         # Privacy policy
│   │   └── terms/           # Terms of service
│   └── api/                 # API routes
│       ├── search/          # Search endpoints
│       └── ai/              # AI analysis endpoint
├── components/
│   ├── features/            # Feature components
│   ├── layout/              # Layout components
│   └── ui/                  # shadcn/ui components
├── content/                 # Static content
│   ├── education/           # Educational content
│   ├── quick-start/         # Quick start guides
│   └── use-cases/           # Use case documentation
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── TROUBLESHOOTING.md   # Troubleshooting guide
├── lib/                     # Utilities
├── locales/                 # i18n translations
└── types/                   # TypeScript types
```

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add all variables from .env.local

# Deploy to production
vercel --prod
```

### Deploy to Cloudflare Pages

```bash
# Build the project
npm run build

# Deploy using Wrangler
npx wrangler pages deploy .next
```

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Troubleshooting

### Common Issues

| Issue          | Solution                             |
| -------------- | ------------------------------------ |
| API errors     | Verify API keys in `.env.local`      |
| Build fails    | Run `rm -rf .next && npm install`    |
| No results     | Check username format and API status |
| AI not working | Verify OpenRouter API key and model  |

For detailed troubleshooting, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run tests with UI
npm run test:ui
```

---

## Tech Stack

| Technology   | Purpose           |
| ------------ | ----------------- |
| Next.js 16   | React framework   |
| TypeScript   | Type safety       |
| Tailwind CSS | Styling           |
| shadcn/ui    | Component library |
| Zustand      | State management  |
| Vitest       | Unit testing      |
| Playwright   | E2E testing       |

---

## License

MIT License - see LICENSE file for details.

---

## Credits

- [WhatsMyName](https://github.com/webbreacher/whatsmyname) - Original project
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [OpenRouter](https://openrouter.ai/) - AI model routing

---

## Support

For issues, questions, or contributions:

1. Check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Search existing [GitHub Issues](https://github.com/yourusername/whatsmyname/issues)
3. Create a new issue with details

---

**Built with Next.js, TypeScript, and AI**
