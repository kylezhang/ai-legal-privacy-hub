import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { translate } from '@vitalets/google-translate-api';
import type { NewsCategory, NewsItem } from '@/lib/news';
import {
  createKnownNewsIndex,
  mergeNewsItems,
  readNewsCache,
  writeNewsCache,
} from '@/lib/news-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

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

type FeedSource = (typeof FEEDS)[number];

type TavilySearchConfig = {
  region: string;
  query: string;
  includeDomains: string[];
};

type TavilySearchResult = {
  title?: string;
  url?: string;
  content?: string;
  published_date?: string;
};

type TavilyResponse = {
  results?: TavilySearchResult[];
};

type RemoteNewsPayload =
  | NewsItem[]
  | {
      version?: number;
      lastSyncedAt?: string | null;
      items?: NewsItem[];
    };

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  timeout: 15000,
});

const RETURN_ITEMS_LIMIT = 24;
const TRANSLATION_BACKFILL_LIMIT = RETURN_ITEMS_LIMIT;
const TRANSLATION_CONCURRENCY = 6;
const GOOGLE_TRANSLATE_TIMEOUT_MS = 1200;
const FALLBACK_TRANSLATE_TIMEOUT_MS = 4000;
const TRANSLATION_SPLIT_TOKEN = '[[AI_LEGAL_HUB_SPLIT]]';
const TAVILY_API_URL = 'https://api.tavily.com/search';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000;
const TAVILY_RESULTS_PER_SEARCH = 3;
const TAVILY_FETCH_TIMEOUT_MS = 8000;
const REMOTE_NEWS_DATA_URL =
  process.env.REMOTE_NEWS_DATA_URL ||
  'https://raw.githubusercontent.com/kylezhang/ai-legal-privacy-hub-data/main/news.json';
const PREFER_REMOTE_NEWS_DATA = process.env.PREFER_REMOTE_NEWS_DATA !== 'false';
const REMOTE_NEWS_FETCH_TIMEOUT_MS = 8000;

const TAVILY_SEARCHES: TavilySearchConfig[] = [
  {
    region: 'UK',
    query: 'UK AI regulation privacy enforcement guidance official updates',
    includeDomains: ['ico.org.uk', 'gov.uk'],
  },
  {
    region: 'Canada',
    query: 'Canada artificial intelligence privacy law enforcement official updates',
    includeDomains: ['priv.gc.ca', 'canada.ca'],
  },
  {
    region: 'Singapore',
    query: 'Singapore AI governance privacy regulation official updates',
    includeDomains: ['pdpc.gov.sg', 'imda.gov.sg', 'aiverifyfoundation.sg'],
  },
  {
    region: 'Australia',
    query: 'Australia AI privacy regulation enforcement official updates',
    includeDomains: ['oaic.gov.au', 'industry.gov.au', 'esafety.gov.au'],
  },
  {
    region: 'Global',
    query: 'Global AI governance policy regulation official updates',
    includeDomains: ['oecd.ai', 'unesco.org', 'coe.int', 'cdep.coe.int'],
  },
];

const DOMAIN_SOURCE_LABELS: Record<string, string> = {
  'ico.org.uk': 'ICO',
  'gov.uk': 'GOV.UK',
  'priv.gc.ca': 'OPC Canada',
  'canada.ca': 'Government of Canada',
  'pdpc.gov.sg': 'PDPC',
  'imda.gov.sg': 'IMDA',
  'aiverifyfoundation.sg': 'AI Verify Foundation',
  'oaic.gov.au': 'OAIC',
  'industry.gov.au': 'Australian Government',
  'esafety.gov.au': 'eSafety Commissioner',
  'oecd.ai': 'OECD AI',
  'unesco.org': 'UNESCO',
  'coe.int': 'Council of Europe',
  'cdep.coe.int': 'Council of Europe',
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

function buildSummary(content: string, fallback = 'No summary available.') {
  const cleanContent = normalizeText(content);

  if (!cleanContent) {
    return fallback;
  }

  return cleanContent.length > 220
    ? `${cleanContent.substring(0, 220)}...`
    : cleanContent;
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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GOOGLE_TRANSLATE_TIMEOUT_MS);

  try {
    const res = await (translate as any)(text, {
      to: 'zh-CN',
      fetchOptions: { signal: controller.signal },
    });
    return res.text;
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.error('Google translation failed:', err.message || err);
    }
    return '';
  } finally {
    clearTimeout(timer);
  }
}

async function translateWithFallback(text: string) {
  if (!text) return '';

  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', 'en|zh-CN');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FALLBACK_TRANSLATE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AI Legal & Privacy Hub/1.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Fallback translation failed:', response.status, response.statusText);
      return '';
    }

    const data = (await response.json()) as {
      responseData?: { translatedText?: string };
      responseStatus?: number;
      responseDetails?: string;
    };

    if (data.responseStatus && data.responseStatus !== 200) {
      console.error('Fallback translation failed:', data.responseStatus, data.responseDetails || 'Unknown error');
      return '';
    }

    return typeof data.responseData?.translatedText === 'string'
      ? data.responseData.translatedText
      : '';
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.error('Fallback translation failed:', err.message || err);
    }
    return '';
  } finally {
    clearTimeout(timer);
  }
}

function normalizeTranslation(text: string) {
  return text.replace(/\r\n/g, '\n').trim();
}

function needsChineseTranslation(source: string, translated?: string) {
  const normalizedSource = normalizeTranslation(source);
  const normalizedTranslated = normalizeTranslation(translated || '');

  if (!normalizedSource) {
    return false;
  }

  if (!normalizedTranslated) {
    return true;
  }

  return normalizedTranslated === normalizedSource && /[A-Za-z]{3}/.test(normalizedSource);
}

async function translateToChinese(text: string) {
  const normalized = normalizeTranslation(text);

  if (!normalized) {
    return '';
  }

  const fallbackResult = normalizeTranslation(await translateWithFallback(normalized));
  if (fallbackResult && !needsChineseTranslation(normalized, fallbackResult)) {
    return fallbackResult;
  }

  const googleResult = normalizeTranslation(await tryTranslate(normalized));
  if (googleResult && !needsChineseTranslation(normalized, googleResult)) {
    return googleResult;
  }

  return '';
}

function splitTranslatedFields(text: string) {
  const directParts = text.split(TRANSLATION_SPLIT_TOKEN).map((part) => normalizeTranslation(part));
  if (directParts.length === 2) {
    return directParts as [string, string];
  }

  const looseParts = text
    .split(/\[\[\s*AI_LEGAL_HUB_SPLIT\s*\]\]/i)
    .map((part) => normalizeTranslation(part));

  if (looseParts.length === 2) {
    return looseParts as [string, string];
  }

  return null;
}

function applyTranslatedField(source: string, translated: string, current?: string) {
  if (!translated || needsChineseTranslation(source, translated)) {
    return current;
  }

  return translated;
}

async function translateNewsItem(item: NewsItem) {
  const needsTitle = needsChineseTranslation(item.title, item.title_zh);
  const needsSummary = needsChineseTranslation(item.summary, item.summary_zh);

  if (!needsTitle && !needsSummary) {
    return item;
  }

  const combinedText = [
    needsTitle ? item.title : item.title_zh || item.title,
    needsSummary ? item.summary : item.summary_zh || item.summary,
  ].join(`\n${TRANSLATION_SPLIT_TOKEN}\n`);

  const translatedText = await translateToChinese(combinedText);
  const translatedFields = splitTranslatedFields(translatedText);

  if (!translatedFields) {
    return item;
  }

  const [translatedTitle, translatedSummary] = translatedFields;

  return {
    ...item,
    title_zh: needsTitle
      ? applyTranslatedField(item.title, translatedTitle, item.title_zh)
      : item.title_zh,
    summary_zh: needsSummary
      ? applyTranslatedField(item.summary, translatedSummary, item.summary_zh)
      : item.summary_zh,
  };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>
) {
  const results = new Array<R>(items.length);
  let index = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (index < items.length) {
        const currentIndex = index;
        index += 1;
        results[currentIndex] = await mapper(items[currentIndex]);
      }
    })
  );

  return results;
}

async function backfillChineseTranslations(items: NewsItem[]) {
  const visibleItems = items.slice(0, TRANSLATION_BACKFILL_LIMIT);
  const translatedVisibleItems = await mapWithConcurrency(
    visibleItems,
    TRANSLATION_CONCURRENCY,
    translateNewsItem
  );

  return [...translatedVisibleItems, ...items.slice(TRANSLATION_BACKFILL_LIMIT)];
}

function buildNewsItem(
  item: Parser.Item,
  feed: FeedSource
): NewsItem {
  const cleanSummary = normalizeText(item.contentSnippet || item.content || '');
  const summary = buildSummary(item.contentSnippet || item.content || '');

  return {
    id: item.guid || item.link || `${feed.source}-${item.pubDate || Date.now()}`,
    title: item.title || 'Untitled',
    summary,
    url: item.link || '#',
    source: feed.source,
    publishedAt: item.pubDate || new Date().toISOString(),
    category: determineCategory(item.title || '', cleanSummary),
    region: feed.region,
  };
}

function getItemUrlKey(item: Pick<NewsItem, 'url' | 'id' | 'source'>) {
  if (item.url && item.url !== '#') {
    return item.url;
  }

  return `${item.source}:${item.id}`;
}

function hasGlobalCoverage(items: NewsItem[]) {
  const visibleRegions = new Set(items.slice(0, RETURN_ITEMS_LIMIT).map((item) => item.region));
  const supplementalRegions = ['UK', 'Canada', 'Singapore', 'Australia', 'Global'];

  return supplementalRegions.some((region) => visibleRegions.has(region));
}

function shouldFetchTavily(items: NewsItem[], lastSyncedAt: string | null) {
  if (!TAVILY_API_KEY) {
    return false;
  }

  if (!lastSyncedAt) {
    return true;
  }

  if (!hasGlobalCoverage(items)) {
    return true;
  }

  const lastSyncedMs = new Date(lastSyncedAt).getTime();
  if (Number.isNaN(lastSyncedMs)) {
    return true;
  }

  return Date.now() - lastSyncedMs >= TAVILY_REFRESH_INTERVAL_MS;
}

function normalizePublishedAt(publishedAt: string | undefined, fallback: string) {
  if (!publishedAt) {
    return fallback;
  }

  const parsed = new Date(publishedAt);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString();
}

function getSourceLabelFromUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return DOMAIN_SOURCE_LABELS[hostname] || hostname;
  } catch {
    return 'Global Source';
  }
}

function buildTavilyNewsItem(
  result: TavilySearchResult,
  config: TavilySearchConfig,
  knownItems: Map<string, NewsItem>,
  fallbackPublishedAt: string
) {
  const title = normalizeText(result.title || '');
  const url = result.url || '';
  const content = normalizeText(result.content || '');

  if (!title || !url || !content) {
    return null;
  }

  if (!isLegallyRelevant(title, content)) {
    return null;
  }

  const current = knownItems.get(url);

  return {
    id: url,
    title,
    summary: buildSummary(content),
    url,
    source: current?.source || getSourceLabelFromUrl(url),
    publishedAt: current?.publishedAt || normalizePublishedAt(result.published_date, fallbackPublishedAt),
    category: determineCategory(title, content),
    region: current?.region || config.region,
    title_zh: current?.title_zh,
    summary_zh: current?.summary_zh,
  } satisfies NewsItem;
}

async function fetchTavilyResults(config: TavilySearchConfig) {
  if (!TAVILY_API_KEY) {
    return [] as TavilySearchResult[];
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TAVILY_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: config.query,
        topic: 'general',
        search_depth: 'basic',
        time_range: 'month',
        max_results: TAVILY_RESULTS_PER_SEARCH,
        include_domains: config.includeDomains,
        include_answer: false,
        include_raw_content: false,
        include_images: false,
      }),
    });

    if (!response.ok) {
      console.error('Tavily search failed:', response.status, response.statusText, config.region);
      return [] as TavilySearchResult[];
    }

    const data = (await response.json()) as TavilyResponse;
    return Array.isArray(data.results) ? data.results : [];
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.error('Tavily search failed:', err.message || err, config.region);
    }
    return [] as TavilySearchResult[];
  } finally {
    clearTimeout(timer);
  }
}

async function fetchTavilyNewsItems(existingItems: NewsItem[], fallbackPublishedAt: string) {
  const knownItems = createKnownNewsIndex(existingItems);
  const seenKeys = new Set(existingItems.map((item) => getItemUrlKey(item)));

  const tavilyResults = await mapWithConcurrency(
    TAVILY_SEARCHES,
    2,
    fetchTavilyResults
  );

  const items: NewsItem[] = [];

  for (let index = 0; index < tavilyResults.length; index += 1) {
    const config = TAVILY_SEARCHES[index];
    const results = tavilyResults[index];

    for (const result of results) {
      const item = buildTavilyNewsItem(result, config, knownItems, fallbackPublishedAt);
      if (!item) {
        continue;
      }

      const key = getItemUrlKey(item);
      if (seenKeys.has(key)) {
        continue;
      }

      seenKeys.add(key);
      items.push(item);
    }
  }

  return items;
}

function isNewsItem(value: unknown): value is NewsItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<NewsItem>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.summary === 'string' &&
    typeof item.url === 'string' &&
    typeof item.source === 'string' &&
    typeof item.publishedAt === 'string' &&
    typeof item.category === 'string' &&
    typeof item.region === 'string'
  );
}

function parseRemoteNewsItems(payload: RemoteNewsPayload): NewsItem[] {
  if (Array.isArray(payload)) {
    return payload.filter(isNewsItem);
  }

  if (Array.isArray(payload.items)) {
    return payload.items.filter(isNewsItem);
  }

  return [];
}

async function fetchRemoteNewsItems() {
  if (!PREFER_REMOTE_NEWS_DATA || !REMOTE_NEWS_DATA_URL) {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REMOTE_NEWS_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(REMOTE_NEWS_DATA_URL, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Remote news fetch failed:', response.status, response.statusText);
      return null;
    }

    const payload = (await response.json()) as RemoteNewsPayload;
    const items = parseRemoteNewsItems(payload);

    return items.length > 0 ? items : null;
  } catch (error: any) {
    if (error?.name !== 'AbortError') {
      console.error('Remote news fetch failed:', error.message || error);
    }

    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  try {
    const remoteItems = await fetchRemoteNewsItems();
    if (remoteItems) {
      return NextResponse.json(remoteItems.slice(0, RETURN_ITEMS_LIMIT));
    }

    const cache = await readNewsCache();
    const knownItems = createKnownNewsIndex(cache.items);

    const allFeeds = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const feedData = await parser.parseURL(feed.url);

          const items = feedData.items
            .filter((item) =>
              isLegallyRelevant(item.title || '', item.contentSnippet || item.content || '')
            )
            .map((item) => buildNewsItem(item, feed))
            .filter((item) => {
              const current = knownItems.get(item.url && item.url !== '#' ? item.url : `${item.source}:${item.id}`);
              if (!current) {
                return true;
              }

              return (
                new Date(item.publishedAt).getTime() >
                new Date(current.publishedAt).getTime()
              );
            })
            .slice(0, 8);

          return items;
        } catch (err: any) {
          console.error(`Failed to fetch feed ${feed.url}:`, err.message || err);
          return [];
        }
      })
    );

    const mergedItems = mergeNewsItems(cache.items, allFeeds.flat());
    const tavilyItems = shouldFetchTavily(mergedItems, cache.lastSyncedAt)
      ? await fetchTavilyNewsItems(mergedItems, new Date().toISOString())
      : [];
    const globallyMergedItems = mergeNewsItems(mergedItems, tavilyItems);
    const translatedItems = await backfillChineseTranslations(globallyMergedItems);
    const persistedCache = await writeNewsCache(translatedItems);

    return NextResponse.json(persistedCache.items.slice(0, RETURN_ITEMS_LIMIT));
  } catch (error: any) {
    console.error('API Error:', error.message || error);
    const cache = await readNewsCache();

    if (cache.items.length > 0) {
      return NextResponse.json(cache.items.slice(0, RETURN_ITEMS_LIMIT));
    }

    return NextResponse.json({ error: 'Failed to fetch legal news' }, { status: 500 });
  }
}
