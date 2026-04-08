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
    url: 'https://www.pdpc.gov.sg/rss/news-and-events',
    source: 'PDPC SG',
    region: 'Asia',
  },
  {
    url: 'https://artificialintelligence-news.com/feed/',
    source: 'AI News',
    region: 'Global',
  }
];

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  timeout: 15000,
});

async function tryTranslate(text: string) {
  if (!text) return '';
  try {
    console.log(`Translating policy: ${text.substring(0, 30)}...`);
    const res = await (translate as any)(text, { to: 'zh-CN', client: 'gtx' });
    return res.text;
  } catch (err: any) {
    console.error('Translation failed:', err.message || err);
    return text;
  }
}

export async function GET() {
  console.log('API Policy GET called');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const allFeeds = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          console.log(`Fetching policy feed: ${feed.url}`);
          const feedData = await parser.parseURL(feed.url);
          const policyKeywords = ['guidance', 'guidelines', 'analysis', 'legal', 'compliance', 'framework', 'policy', 'regulation', 'act'];
          
          const items = feedData.items
            .filter(item => {
              const content = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
              return policyKeywords.some(kw => content.includes(kw));
            })
            .map((item) => {
              const cleanSummary = (item.contentSnippet || item.content || '')
                .replace(/<[^>]*>?/gm, '')
                .substring(0, 300) + '...';
                
              return {
                id: item.guid || item.link || Math.random().toString(),
                title: item.title || 'Untitled',
                summary: cleanSummary,
                url: item.link || '#',
                source: feed.source,
                publishedAt: item.pubDate || new Date().toISOString(),
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
          console.error(`Failed to fetch policy feed ${feed.url}:`, err.message || err);
          return [];
        }
      })
    );

    clearTimeout(timeoutId);
    const flattenedNews = allFeeds.flat().sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    console.log(`Returning ${flattenedNews.length} policy items`);
    return NextResponse.json(flattenedNews.slice(0, 20));
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('API Error:', error.message || error);
    return NextResponse.json({ error: 'Failed to fetch policy or timed out' }, { status: 500 });
  }
}
