'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type Locale = 'zh' | 'en';

type Dict = Record<string, { zh: string; en: string }>;

const DICT: Dict = {
  site_name_main: { zh: 'AI 法律', en: 'AI Legal' },
  site_name_sub: { zh: '与隐私中心', en: '& Privacy Hub' },
  nav_latest: { zh: '最新动态', en: 'Latest' },
  nav_policy: { zh: '政策解读', en: 'Policy' },
  nav_tools: { zh: '合规工具', en: 'Tools' },
  hero_badge: { zh: '实时全球情报', en: 'Realtime Global Intel' },
  hero_title_l1: { zh: '全球AI法律、数据保护', en: 'Global AI Law & Data Protection' },
  hero_title_l2: { zh: '与隐私监管中心', en: '& Privacy Oversight Hub' },
  hero_desc: {
    zh: '实时获取全球人工智能在法律领域的合规要求、隐私政策动态与数据安全前沿趋势。',
    en: 'Realtime updates on AI law, privacy policy changes and data protection trends worldwide.',
  },
  section_latest: { zh: '最新情报汇总', en: 'Latest Intelligence' },
  search_placeholder: { zh: '搜索关键词 (如: GDPR, AI Act...)', en: 'Search keywords (e.g., GDPR, AI Act...)' },
  filter_all: { zh: '全部', en: 'All' },
  refresh: { zh: '刷新新闻', en: 'Refresh' },
  read_original: { zh: '阅读原文', en: 'Read Original' },
  last_updated: { zh: '最后更新', en: 'Last Updated' },
  cat_data_protection: { zh: '数据保护', en: 'Data Protection' },
  cat_privacy: { zh: '隐私', en: 'Privacy' },
  cat_ai_reg: { zh: 'AI 监管', en: 'AI Regulation' },
  cat_ai_law: { zh: 'AI 法律', en: 'AI Law' },
  section_policy: { zh: '政策解读', en: 'Policy Analysis' },
  section_tools: { zh: '合规工具', en: 'Compliance Tools' },
  empty: { zh: '未找到相关新闻，请尝试更换关键词。', en: 'No items found. Try different keywords.' },
  open_tool: { zh: '打开工具', en: 'Open Tool' },
};

function t(locale: Locale, key: string) {
  const item = DICT[key];
  if (!item) return key;
  return item[locale];
}

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  tb: (key: string) => string; // Translate Bilingual: "EN / ZH"
  formatCategory: (category: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh');
  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => t(locale, key),
      tb: (key: string) => {
        const item = DICT[key];
        if (!item) return key;
        return `${item.en} / ${item.zh}`;
      },
      formatCategory: (category: string) => {
        switch (category) {
          case 'Data Protection':
            return t(locale, 'cat_data_protection');
          case 'Privacy':
            return t(locale, 'cat_privacy');
          case 'AI Regulation':
            return t(locale, 'cat_ai_reg');
          default:
            return t(locale, 'cat_ai_law');
        }
      },
    }),
    [locale]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
