export type NewsCategory =
  | 'Case & Enforcement'
  | 'Policy / Regulation'
  | 'Compliance Guidance'
  | 'Privacy / Data Protection';

export interface NewsItem {
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
}

export async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
