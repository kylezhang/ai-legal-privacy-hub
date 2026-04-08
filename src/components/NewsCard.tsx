import React from 'react';
import { ExternalLink, Calendar, ShieldCheck, Lock, Globe, Scale } from 'lucide-react';
import { formatDistanceToNow, isValid } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { NewsItem } from '@/lib/news';
import { useI18n } from './I18nProvider';

export default function NewsCard({ news }: { news: NewsItem }) {
  const { t, locale, formatCategory } = useI18n();
  const getIcon = (category: string) => {
    switch (category) {
      case 'Case & Enforcement': return <Scale className="w-4 h-4 text-rose-500" />;
      case 'Policy / Regulation': return <Scale className="w-4 h-4 text-purple-500" />;
      case 'Compliance Guidance': return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case 'Privacy / Data Protection': return <Lock className="w-4 h-4 text-green-500" />;
      default: return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  const publishDate = new Date(news.publishedAt);
  const formattedDate = isValid(publishDate) 
    ? formatDistanceToNow(publishDate, { addSuffix: true, locale: locale === 'zh' ? zhCN : undefined })
    : 'Recently';

  const title = locale === 'zh' && news.title_zh ? news.title_zh : news.title;
  const summary = locale === 'zh' && news.summary_zh ? news.summary_zh : news.summary;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-md hover:border-blue-500/30 group flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {getIcon(news.category)}
          {formatCategory(news.category)}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          {news.region}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
        {title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
        {summary}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest">
            {news.source}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>
        
        <a 
          href={news.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-widest group/link"
        >
          {t('read_original')}
          <ExternalLink className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
