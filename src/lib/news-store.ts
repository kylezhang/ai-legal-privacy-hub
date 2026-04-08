import { mkdir, readFile, rename, writeFile } from 'fs/promises';
import path from 'path';
import type { NewsItem } from '@/lib/news';

const CACHE_DIR = path.join(process.cwd(), 'data');
const CACHE_FILE = path.join(CACHE_DIR, 'news-cache.json');
const CACHE_VERSION = 1;
const MAX_CACHE_ITEMS = 200;

type NewsCache = {
  version: number;
  lastSyncedAt: string | null;
  items: NewsItem[];
};

function createEmptyCache(): NewsCache {
  return {
    version: CACHE_VERSION,
    lastSyncedAt: null,
    items: [],
  };
}

function normalizeCache(cache: Partial<NewsCache> | null | undefined): NewsCache {
  return {
    version: CACHE_VERSION,
    lastSyncedAt: cache?.lastSyncedAt || null,
    items: Array.isArray(cache?.items) ? cache.items : [],
  };
}

function getNewsKey(item: Pick<NewsItem, 'url' | 'source' | 'id'>) {
  if (item.url && item.url !== '#') {
    return item.url;
  }

  return `${item.source}:${item.id}`;
}

function sortByPublishedAtDesc(items: NewsItem[]) {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function readNewsCache() {
  try {
    const raw = await readFile(CACHE_FILE, 'utf8');
    return normalizeCache(JSON.parse(raw) as Partial<NewsCache>);
  } catch {
    return createEmptyCache();
  }
}

export async function writeNewsCache(items: NewsItem[], lastSyncedAt = new Date().toISOString()) {
  const payload: NewsCache = {
    version: CACHE_VERSION,
    lastSyncedAt,
    items: sortByPublishedAtDesc(items).slice(0, MAX_CACHE_ITEMS),
  };

  await mkdir(CACHE_DIR, { recursive: true });

  const tempFile = `${CACHE_FILE}.tmp`;
  await writeFile(tempFile, JSON.stringify(payload, null, 2), 'utf8');
  await rename(tempFile, CACHE_FILE);

  return payload;
}

export function mergeNewsItems(existingItems: NewsItem[], incomingItems: NewsItem[]) {
  const merged = new Map<string, NewsItem>();

  for (const item of [...incomingItems, ...existingItems]) {
    const key = getNewsKey(item);
    const current = merged.get(key);

    if (
      !current ||
      new Date(item.publishedAt).getTime() > new Date(current.publishedAt).getTime()
    ) {
      merged.set(key, item);
    }
  }

  return sortByPublishedAtDesc(Array.from(merged.values()));
}

export function createKnownNewsIndex(items: NewsItem[]) {
  return new Map(items.map((item) => [getNewsKey(item), item]));
}
