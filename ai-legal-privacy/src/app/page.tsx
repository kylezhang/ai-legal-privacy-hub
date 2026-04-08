'use client';

import React from 'react';
import NewsList from '@/components/NewsList';
import { ShieldCheck, Scale, Lock, Globe, Mail } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import PolicyList from '@/components/PolicyList';
import ToolsList from '@/components/ToolsList';

export default function Home() {
  const { t, tb, locale, setLocale } = useI18n();
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Scale className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white uppercase italic">AI LEGAL</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mt-0.5">& PRIVACY HUB</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#news" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{tb('nav_latest')}</a>
            <a href="#policy" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{tb('nav_policy')}</a>
            <a href="#tools" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{tb('nav_tools')}</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all tracking-wide"
            >
              {locale === 'zh' ? '中文 / EN' : 'EN / 中文'}
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-white dark:bg-slate-900 pt-24 pb-16">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('hero_badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight max-w-4xl mx-auto italic uppercase">
            {t('hero_title_l1')}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{t('hero_title_l2')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">{t('hero_desc')}</p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-10 mt-4">
            <div className="flex items-center gap-2 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('cat_data_protection')}</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="flex items-center gap-2 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Lock className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('cat_privacy')}</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="flex items-center gap-2 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('cat_ai_reg')}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="bg-slate-50/50 dark:bg-slate-950/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-4">{tb('section_latest')}</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <NewsList />
        </div>
      </section>

      <section id="policy" className="bg-white dark:bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-4">{tb('section_policy')}</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <PolicyList />
        </div>
      </section>

      <section id="tools" className="bg-slate-50/50 dark:bg-slate-950/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-4">{tb('section_tools')}</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <ToolsList />
        </div>
      </section>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
            <div className="w-7 h-7 bg-slate-900 dark:bg-slate-800 rounded flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase italic">AI LEGAL HUB</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold tracking-widest uppercase mb-4">
            &copy; 2024 全球 AI 法律与隐私监测中心
          </p>
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Globe className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
