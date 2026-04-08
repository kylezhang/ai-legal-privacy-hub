'use client';

import React from 'react';
import { ExternalLink, ShieldCheck, BookOpen, Layers } from 'lucide-react';
import { COMPLIANCE_TOOLS } from '@/lib/tools';
import { useI18n } from './I18nProvider';

export default function ToolsList() {
  const { t, locale } = useI18n();

  const getIcon = (cat: string) => {
    if (cat === 'Assessment') return <ShieldCheck className="w-4 h-4 text-green-600" />;
    if (cat === 'Framework') return <Layers className="w-4 h-4 text-purple-600" />;
    return <BookOpen className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {COMPLIANCE_TOOLS.map((tool) => (
        <div key={tool.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 group">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {getIcon(tool.category)}
              {tool.category}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {tool.region}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight">
            {locale === 'zh' ? tool.title_zh : tool.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
            {locale === 'zh' ? tool.description_zh : tool.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest">
              {tool.region}
            </span>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-widest"
            >
              {t('open_tool')}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

