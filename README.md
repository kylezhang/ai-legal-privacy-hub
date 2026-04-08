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

## Deployment Flow

- The main code repository is maintained in AtomGit and then mirrored to GitHub.
- Vercel deploys the main site from the mirrored GitHub repository.
- A separate public GitHub repository stores the news snapshot JSON:
  `https://github.com/kylezhang/ai-legal-privacy-hub-data`
- The main site reads that snapshot from:
  `https://raw.githubusercontent.com/kylezhang/ai-legal-privacy-hub-data/main/news.json`

## Why The Data Repo Is Separate

- AtomGit is the source of truth for the main codebase, and its mirror process can overwrite the GitHub code repository.
- Because of that mirror behavior, the main GitHub code repository is not a safe place to store independently updated data branches or files.
- To avoid the mirror overwriting generated data, the news snapshot lives in its own GitHub repository and is updated there only.

## Snapshot Update Pipeline

1. GitHub Actions in `ai-legal-privacy-hub-data` runs `scripts/update-news.mjs`.
2. The script fetches the fixed RSS feeds and, when `TAVILY_API_KEY` is available, Tavily-discovered global sources.
3. The script merges new items into `news.json` and backfills Chinese titles and summaries.
4. If `news.json` changed, the workflow commits and pushes the updated snapshot.
5. The main site on Vercel serves that remote snapshot first and only falls back to live aggregation when the snapshot is unavailable.

## Refresh Schedule

- The data repository workflow runs on this cron:
  `17 */6 * * *`
- That means it runs every 6 hours at minute `17`.
- In UTC, that is:
  `00:17`, `06:17`, `12:17`, `18:17`
- In China Standard Time (`UTC+8`), that is:
  `08:17`, `14:17`, `20:17`, and `02:17` on the next day
- The workflow can also be triggered manually from GitHub Actions with `workflow_dispatch`.

## Operational Notes

- `TAVILY_API_KEY` is configured as a GitHub Actions secret in the data repository.
- The data repository does not need a custom GitHub token for commits; GitHub Actions uses the built-in `GITHUB_TOKEN`.
- The main site can work without extra GitHub credentials because the data repository is public.
- If desired, Vercel can still set `REMOTE_NEWS_DATA_URL` explicitly to make the data source easier to change later.
- If desired, Vercel can also set `TAVILY_API_KEY` so the main site keeps global-source fallback capability even when the remote snapshot is temporarily unavailable.

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
