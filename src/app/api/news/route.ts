import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { translate } from '@vitalets/google-translate-api';
import type { NewsCategory } from '@/lib/news';

export const dynamic = 'force-dynamic';

const FEEDS = [
  {
    url: 'https://artificialintelligenceact.eu/feed/',
    source: 'EU AI Act',
    region: 'EU',
  },
  {
    url: 'https://edpb.europa.eu/feed/news_en',
    source: 'EDPB',
    region: 'EU',
  },
  {
    url: 'https://www.ftc.gov/feeds/blog-business.xml',
    source: 'FTC Business Blog',
    region: 'USA',
  },
];

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  timeout: 15000,
});

type FeedNewsItem = {
  id: string;
  title: string;
  title_zh?: string;
  summary: string;
  summary_zh?: string;
  url: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
  region: string;
};

const AI_PATTERNS = [
  /\bai\b/i,
  /artificial intelligence/i,
  /algorithm/i,
  /automated decision/i,
  /foundation model/i,
  /general-purpose ai/i,
  /machine learning/i,
  /biometric/i,
];

const LEGAL_PATTERNS = [
  /\bact\b/i,
  /\blaw\b/i,
  /\blegal\b/i,
  /privacy/i,
  /data protection/i,
  /gdpr/i,
  /regulation/i,
  /regulatory/i,
  /compliance/i,
  /guidance/i,
  /guideline/i,
  /authority/i,
  /board/i,
  /office/i,
  /enforcement/i,
  /investigation/i,
  /lawsuit/i,
  /court/i,
  /sanction/i,
  /\bfine\b/i,
  /transparency/i,
];

function normalizeText(value: string) {
  return value.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function isLegallyRelevant(title: string, summary: string) {
  const content = `${title} ${summary}`.toLowerCase();
  return (
    AI_PATTERNS.some((pattern) => pattern.test(content)) &&
    LEGAL_PATTERNS.some((pattern) => pattern.test(content))
  );
}

function determineCategory(title: string, summary: string): NewsCategory {
  const content = (title + ' ' + summary).toLowerCase();
  if (/(enforcement|investigation|lawsuit|court|fine|sanction|complaint|penalty|order)/.test(content)) {
    return 'Case & Enforcement';
  }
  if (/(privacy|data protection|gdpr|personal data|biometric|surveillance|data breach)/.test(content)) {
    return 'Privacy / Data Protection';
  }
  if (/(guidance|guideline|playbook|toolkit|framework|checklist|compliance)/.test(content)) {
    return 'Compliance Guidance';
  }
  return 'Policy / Regulation';
}

async function tryTranslate(text: string) {
  if (!text) return '';
  try {
    const res = await (translate as any)(text, { to: 'zh-CN', client: 'gtx' });
    return res.text;
  } catch (err: any) {
    console.error('Translation failed:', err.message || err);
    return text;
  }
}

export async function GET() {
  try {
    const allFeeds = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const feedData = await parser.parseURL(feed.url);

          const items = feedData.items
            .filter((item) =>
              isLegallyRelevant(item.title || '', item.contentSnippet || item.content || '')
            )
            .slice(0, 8)
            .map((item) => {
              const cleanSummary = normalizeText(item.contentSnippet || item.content || '');
              const summary = cleanSummary ? `${cleanSummary.substring(0, 220)}...` : 'No summary available.';

              return {
                id: item.guid || item.link || Math.random().toString(),
                title: item.title || 'Untitled',
                summary,
                url: item.link || '#',
                source: feed.source,
                publishedAt: item.pubDate || new Date().toISOString(),
                category: determineCategory(item.title || '', cleanSummary),
                region: feed.region,
              };
            });

          return Promise.all(
            items.map(async (item, index) => {
              if (index > 1) {
                return item;
              }

              return {
                ...item,
                title_zh: await tryTranslate(item.title),
                summary_zh: await tryTranslate(item.summary),
              };
            })
          );
        } catch (err: any) {
          console.error(`Failed to fetch feed ${feed.url}:`, err.message || err);
          return [];
        }
      })
    );

    const deduped = Object.values(
      allFeeds.flat().reduce<Record<string, FeedNewsItem>>((acc, item) => {
        const key = item.url;
        const existing = acc[key];

        if (
          !existing ||
          new Date(item.publishedAt).getTime() > new Date(existing.publishedAt).getTime()
        ) {
          acc[key] = item;
        }

        return acc;
      }, {})
    );

    const flattenedNews = deduped.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return NextResponse.json(flattenedNews.slice(0, 24));
  } catch (error: any) {
    console.error('API Error:', error.message || error);
    return NextResponse.json({ error: 'Failed to fetch legal news' }, { status: 500 });
  }
}
