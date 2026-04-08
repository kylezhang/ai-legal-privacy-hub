# AI Legal & Privacy Hub

A legal-first AI intelligence website focused on cases, policy, enforcement, and compliance tooling.

## Features

- **Legal-Focused Feed**: Prioritizes AI regulation, privacy enforcement, compliance guidance, and official legal updates instead of general AI tech news.
- **Curated Policy Shelf**: Highlights foundational resources from the European Commission, EDPB, FTC, ICO, and NIST.
- **Practice Toolkit**: Collects operational tools for assessment, governance, and regulatory tracking.
- **Bilingual UI**: Supports English and Chinese with selective machine translation for live feed items.
- **Responsive Design**: Built with Next.js App Router and Tailwind CSS for desktop and mobile use.

## Current Structure

- `src/app/api/news/route.ts`: live legal/policy news aggregation
- `src/lib/policies.ts`: curated official policy and guidance resources
- `src/lib/tools.ts`: practical legal/compliance toolkit registry
- `src/components/*`: homepage sections for legal updates, policy guidance, and tools

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- `rss-parser` for real-time data fetching
- `@vitalets/google-translate-api` for server-side translation

## License

MIT
