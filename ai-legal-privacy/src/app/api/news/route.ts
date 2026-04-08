import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { translate } from '@vitalets/google-translate-api';

const FEEDS = [
  {
    url: 'https://artificialintelligenceact.eu/feed/',
    source: 'EU AI Act',
    region: 'EU',
  },
  {
    url: 'https://www.oschina.net/news/rss/',
    source: 'OSChina',
    region: 'China',
  }
];

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  timeout: 15000, // 15 seconds timeout for RSS fetching
});

function determineCategory(title: string, summary: string) {
  const content = (title + ' ' + summary).toLowerCase();
  if (content.includes('ai act') || content.includes('artificial intelligence act') || content.includes('ai regulation') || content.includes('regulatory sandbox')) return 'AI Regulation';
  if (content.includes('privacy') || content.includes('confidential') || content.includes('tracking') || content.includes('surveillance')) return 'Privacy';
  if (content.includes('data protection') || content.includes('gdpr') || content.includes('personal data') || content.includes('data breach')) return 'Data Protection';
  if (content.includes('act') || content.includes('policy') || content.includes('bill') || content.includes('law') || content.includes('legal')) return 'AI Regulation';
  return 'General AI Law';
}

async function tryTranslate(text: string) {
  if (!text) return '';
  try {
    console.log(`Translating: ${text.substring(0, 30)}...`);
    // Use client: 'gtx' for more stable free translation (Google Translate Extension)
    const res = await (translate as any)(text, { to: 'zh-CN', client: 'gtx' });
    return res.text;
  } catch (err: any) {
    console.error('Translation failed:', err.message || err);
    return text; // Return original if translation fails
  }
}

export async function GET() {
  console.log('API News GET called');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s total timeout for the entire API

  try {
    const allFeeds = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          console.log(`Fetching feed: ${feed.url}`);
          const feedData = await parser.parseURL(feed.url);
          console.log(`Fetched ${feedData.items.length} items from ${feed.source}`);
          
          const items = feedData.items.map((item) => {
            const cleanSummary = (item.contentSnippet || item.content || '')
              .replace(/<[^>]*>?/gm, '')
              .substring(0, 250) + '...';
              
            return {
              id: item.guid || item.link || Math.random().toString(),
              title: item.title || 'Untitled',
              summary: cleanSummary,
              url: item.link || '#',
              source: feed.source,
              publishedAt: item.pubDate || new Date().toISOString(),
              category: determineCategory(item.title || '', item.contentSnippet || ''),
              region: feed.region,
            };
          });

          // Translate only the first 3 items of each feed
          const itemsToTranslate = items.slice(0, 3);
          const translatedItems = [];
          for (const item of itemsToTranslate) {
            // Add a small delay between translations to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
            translatedItems.push({
              ...item,
              title_zh: await tryTranslate(item.title),
              summary_zh: await tryTranslate(item.summary),
            });
          }

          return [...translatedItems, ...items.slice(3)];
        } catch (err: any) {
          console.error(`Failed to fetch feed ${feed.url}:`, err.message || err);
          return [];
        }
      })
    );

    clearTimeout(timeoutId);
    const flattenedNews = allFeeds.flat().sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    console.log(`Returning ${flattenedNews.length} news items`);
    return NextResponse.json(flattenedNews.slice(0, 40));
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('API Error:', error.message || error);
    return NextResponse.json({ error: 'Failed to fetch news or timed out' }, { status: 500 });
  }
}
