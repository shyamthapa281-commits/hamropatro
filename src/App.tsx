import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CalendarView } from './components/CalendarView';
import { RashifalView } from './components/RashifalView';
import { DharmaSanskritiView } from './components/DharmaSanskritiView';
import { WeatherView } from './components/WeatherView';
import { WorldClockView } from './components/WorldClockView';
import { ForexGoldView } from './components/ForexGoldView';
import { FestivalsView } from './components/FestivalsView';
import { DateConverter } from './components/DateConverter';
import { CalculatorsView } from './components/CalculatorsView';
import { SupportWorkView } from './components/SupportWorkView';
import { NrnBankingIpoView } from './components/NrnBankingIpoView';
import { KundaliGunMilanView } from './components/KundaliGunMilanView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';

import { getCurrentNepaliDate, getPanchangaForDate } from './utils/nepaliCalendar';
import { Language } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [lang, setLang] = useState<Language>('ne');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('hamro_patro_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('hamro_patro_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Today's Nepali date and Panchanga
  const todayBs = getCurrentNepaliDate();
  const todayPanchanga = getPanchangaForDate(todayBs.year, todayBs.month, todayBs.day);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ne' ? 'en' : 'ne'));
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-stone-100/80 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-red-500 selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <Header
        todayBs={todayBs}
        panchanga={todayPanchanga}
        lang={lang}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLanguage}
        onNavigate={handleNavigate}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        lang={lang}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'calendar' && (
          <CalendarView
            todayBs={todayBs}
            lang={lang}
            onNavigate={handleNavigate}
            onSelectDateForHoroscope={() => handleNavigate('rashifal')}
            onOpenWellness={() => handleNavigate('dharma')}
          />
        )}

        {activeTab === 'rashifal' && (
          <RashifalView lang={lang} todayBs={todayBs} onNavigate={handleNavigate} />
        )}

        {activeTab === 'kundali' && (
          <KundaliGunMilanView lang={lang} onNavigate={handleNavigate} />
        )}

        {activeTab === 'forex' && (
          <ForexGoldView lang={lang} onNavigate={handleNavigate} />
        )}

        {activeTab === 'nrn-banking' && (
          <NrnBankingIpoView lang={lang} onNavigate={handleNavigate} />
        )}

        {activeTab === 'dharma' && (
          <DharmaSanskritiView lang={lang} onNavigate={handleNavigate} />
        )}

        {activeTab === 'weather' && (
          <WeatherView lang={lang} />
        )}

        {activeTab === 'worldclock' && (
          <WorldClockView lang={lang} todayBs={todayBs} />
        )}

        {activeTab === 'calculator' && (
          <CalculatorsView lang={lang} />
        )}

        {activeTab === 'converter' && (
          <DateConverter lang={lang} />
        )}

        {activeTab === 'festivals' && (
          <FestivalsView lang={lang} todayBs={todayBs} />
        )}

        {activeTab === 'support' && (
          <SupportWorkView lang={lang} onNavigate={handleNavigate} />
        )}
      </main>

      {/* Offline Toast Indicator */}
      <OfflineIndicator lang={lang} />

      {/* Footer */}
      <Footer lang={lang} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;

