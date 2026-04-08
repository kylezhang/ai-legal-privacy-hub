# AI Legal & Privacy Hub

A legal-first AI intelligence website focused on cases, policy, enforcement, and compliance tooling.

## Features

- **Legal-Focused Feed**: Prioritizes AI regulation, privacy enforcement, compliance guidance, and official legal updates instead of general AI tech news.
- **Remote Data Sync**: In production, the app can read a prebuilt `news.json` snapshot from a dedicated GitHub data repository before falling back to live aggregation.
- **Local Fallback Cache**: Live aggregation still persists into a local cache during development and acts as a fallback when the remote snapshot is unavailable.
- **Global Source Discovery**: Fixed RSS feeds are supplemented with Tavily-based discovery for additional jurisdictions such as the UK, Canada, Singapore, Australia, and global policy bodies.
- **Curated Policy Shelf**: Highlights foundational resources from the European Commission, EDPB, FTC, ICO, and NIST.
- **Practice Toolkit**: Collects operational tools for assessment, governance, and regulatory tracking.
- **Bilingual UI**: Supports English and Chinese with selective machine translation for live feed items.
- **Responsive Design**: Built with Next.js App Router and Tailwind CSS for desktop and mobile use.

## Current Structure

- `src/app/api/news/route.ts`: live legal/policy news aggregation
- `src/lib/news-store.ts`: file-backed cache read/write and merge logic
- `src/lib/policies.ts`: curated official policy and guidance resources
- `src/lib/tools.ts`: practical legal/compliance toolkit registry
- `src/components/*`: homepage sections for legal updates, policy guidance, and tools

## Data Flow

- On each request to `/api/news`, the app first tries to read a remote JSON snapshot from `REMOTE_NEWS_DATA_URL`.
- If the remote snapshot is unavailable, it falls back to the local cache in `data/news-cache.json`.
- In fallback mode, it fetches the latest feed entries, keeps only new or newer records, and merges them into the cache.
- When `TAVILY_API_KEY` is configured, the app periodically supplements the cache with additional global legal and policy sources discovered via Tavily search.
- Cached items are sorted by `publishedAt` in descending order, so the newest items always appear first.
- Local cache persistence is best-effort, which keeps Vercel serverless deployments working even though the filesystem is ephemeral.
- `data/news-cache.json` is ignored by Git by default to avoid dirtying the repository on each refresh.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

To enable Tavily-backed global source discovery, add this to `.env.local`:

```bash
TAVILY_API_KEY=your_tavily_api_key
```

To point the app at a dedicated remote data repository, optionally add:

```bash
REMOTE_NEWS_DATA_URL=https://raw.githubusercontent.com/<owner>/<repo>/main/news.json
PREFER_REMOTE_NEWS_DATA=true
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- `rss-parser` for real-time data fetching
- Tavily Search API for global source discovery
- `@vitalets/google-translate-api` for server-side translation

## License

MIT
