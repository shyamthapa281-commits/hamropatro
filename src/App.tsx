import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CalendarView } from './components/CalendarView';
import { RashifalView } from './components/RashifalView';
import { NewsView } from './components/NewsView';
import { WeatherView } from './components/WeatherView';
import { WorldClockView } from './components/WorldClockView';
import { ForexGoldView } from './components/ForexGoldView';
import { FestivalsView } from './components/FestivalsView';
import { HealthWellnessView } from './components/HealthWellnessView';
import { DateConverter } from './components/DateConverter';
import { CalculatorsView } from './components/CalculatorsView';
import { LanguageLearningView } from './components/LanguageLearningView';
import { ActivityCentreView } from './components/ActivityCentreView';
import { GovernmentHelpCentreView } from './components/GovernmentHelpCentreView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { RadioPlayer } from './components/RadioPlayer';
import { Footer } from './components/Footer';

import { getCurrentNepaliDate, getPanchangaForDate } from './utils/nepaliCalendar';
import { MOCK_RADIO_STATIONS } from './data/mockNews';
import { Language, RadioStation } from './types';

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

  // Radio player state
  const [isRadioOpen, setIsRadioOpen] = useState<boolean>(false);
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);
  const [activeRadioStation, setActiveRadioStation] = useState<RadioStation>(MOCK_RADIO_STATIONS[0]);

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
        onOpenRadio={() => setIsRadioOpen(true)}
        isRadioPlaying={isRadioPlaying}
        activeRadioName={activeRadioStation.name}
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
            onOpenWellness={() => handleNavigate('health')}
          />
        )}

        {activeTab === 'rashifal' && (
          <RashifalView lang={lang} todayBs={todayBs} />
        )}

        {activeTab === 'news' && (
          <NewsView lang={lang} />
        )}

        {activeTab === 'weather' && (
          <WeatherView lang={lang} />
        )}

        {activeTab === 'worldclock' && (
          <WorldClockView lang={lang} todayBs={todayBs} />
        )}

        {activeTab === 'forex' && (
          <ForexGoldView lang={lang} />
        )}

        {activeTab === 'calculator' && (
          <CalculatorsView lang={lang} />
        )}

        {activeTab === 'converter' && (
          <DateConverter lang={lang} />
        )}

        {activeTab === 'health' && (
          <HealthWellnessView lang={lang} todayBs={todayBs} />
        )}

        {activeTab === 'language' && (
          <LanguageLearningView lang={lang} />
        )}

        {activeTab === 'games' && (
          <ActivityCentreView lang={lang} />
        )}

        {activeTab === 'govhelp' && (
          <GovernmentHelpCentreView lang={lang} />
        )}

        {activeTab === 'festivals' && (
          <FestivalsView lang={lang} />
        )}
      </main>

      {/* Offline Toast Indicator */}
      <OfflineIndicator lang={lang} />

      {/* Floating Live Radio Player */}
      <RadioPlayer
        lang={lang}
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
        isPlaying={isRadioPlaying}
        setIsPlaying={setIsRadioPlaying}
        activeStation={activeRadioStation}
        setActiveStation={setActiveRadioStation}
      />

      {/* Footer */}
      <Footer lang={lang} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;

