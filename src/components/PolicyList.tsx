'use client';

import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { useI18n } from './I18nProvider';
import { POLICY_RESOURCES } from '@/lib/policies';

export default function PolicyList() {
  const { t, locale } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {POLICY_RESOURCES.map((it) => {
        const title = locale === 'zh' ? it.title_zh : it.title;
        const summary = locale === 'zh' ? it.summary_zh : it.summary;
        const type = locale === 'zh' ? it.type_zh : it.type;

        return (
          <div key={it.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 group flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {it.source}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {it.region}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600">
              {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-4 flex-grow">
              {summary}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <BookOpen className="w-3 h-3" />
                {type}
              </div>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-widest shrink-0"
              >
                {t('read_original')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
