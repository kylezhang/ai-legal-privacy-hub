'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type Locale = 'zh' | 'en';

type Dict = Record<string, { zh: string; en: string }>;

const DICT: Dict = {
  site_name_main: { zh: 'AI 法律', en: 'AI Legal' },
  site_name_sub: { zh: '与隐私中心', en: '& Privacy Hub' },
  nav_latest: { zh: '案例执法', en: 'Case Watch' },
  nav_policy: { zh: '政策指南', en: 'Policy' },
  nav_tools: { zh: '实务工具', en: 'Toolkit' },
  hero_badge: { zh: '法律场景优先', en: 'Law-First Intelligence' },
  hero_title_l1: { zh: '全球 AI 法律案例、政策', en: 'Global AI Cases, Policy' },
  hero_title_l2: { zh: '与合规工具中心', en: '& Compliance Toolkit' },
  hero_desc: {
    zh: '聚焦 AI 监管执法、司法案例、政策指引与合规工具，减少泛技术资讯噪音。',
    en: 'Focused on AI enforcement, legal developments, policy guidance, and compliance tools instead of general AI tech noise.',
  },
  section_latest: { zh: '案例与执法动态', en: 'Case & Enforcement Watch' },
  search_placeholder: { zh: '搜索关键词（如：AI Act、GDPR、FTC、biometric）', en: 'Search keywords (e.g. AI Act, GDPR, FTC, biometric)' },
  filter_all: { zh: '全部', en: 'All' },
  refresh: { zh: '刷新动态', en: 'Refresh' },
  read_original: { zh: '阅读原文', en: 'Read Original' },
  last_updated: { zh: '最后更新', en: 'Last Updated' },
  cat_case: { zh: '案例与执法', en: 'Case & Enforcement' },
  cat_policy: { zh: '政策与监管', en: 'Policy / Regulation' },
  cat_guidance: { zh: '合规指引', en: 'Compliance Guidance' },
  cat_privacy_data: { zh: '隐私与数据保护', en: 'Privacy / Data Protection' },
  section_policy: { zh: '重点政策与官方指引', en: 'Policy & Guidance' },
  section_tools: { zh: '实务工具清单', en: 'Practice Toolkit' },
  empty: { zh: '未找到匹配内容，请调整关键词或筛选条件。', en: 'No matching items found. Try different search terms or filters.' },
  open_tool: { zh: '打开资源', en: 'Open Resource' },
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
          case 'Case & Enforcement':
            return t(locale, 'cat_case');
          case 'Policy / Regulation':
            return t(locale, 'cat_policy');
          case 'Compliance Guidance':
            return t(locale, 'cat_guidance');
          case 'Privacy / Data Protection':
            return t(locale, 'cat_privacy_data');
          default:
            return category;
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
