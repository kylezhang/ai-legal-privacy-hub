# AI Legal & Privacy Hub

A legal-first AI intelligence website focused on cases, policy, enforcement, and compliance tooling.

## Features

- **Legal-Focused Feed**: Prioritizes AI regulation, privacy enforcement, compliance guidance, and official legal updates instead of general AI tech news.
- **File-Based Cache**: News fetched from external sources is persisted into a local project cache file, and each refresh only merges newly discovered items to the front.
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

- On each request to `/api/news`, the app reads the local cache from `data/news-cache.json`.
- It then fetches the latest feed entries, keeps only new or newer records, and merges them into the cache.
- When `TAVILY_API_KEY` is configured, the app periodically supplements the cache with additional global legal and policy sources discovered via Tavily search.
- Cached items are sorted by `publishedAt` in descending order, so the newest items always appear first.
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
