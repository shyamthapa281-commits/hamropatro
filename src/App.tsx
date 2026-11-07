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
import { ReceivePaymentsView } from './components/ReceivePaymentsView';
import { NrnBankingIpoView } from './components/NrnBankingIpoView';
import { KundaliGunMilanView } from './components/KundaliGunMilanView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { AppStoreModal } from './components/AppStoreModal';
import { MobileInstallStickyBanner } from './components/MobileInstallStickyBanner';
import { usePWAInstall } from './hooks/usePWAInstall';
import { EditorialHubView } from './components/EditorialHubView';

import { getCurrentNepaliDate, getPanchangaForDate } from './utils/nepaliCalendar';
import { Language } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('hamro_patro_lang');
      if (saved === 'en' || saved === 'ne') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });
  const { isStandalone, isFromQRScan } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  useEffect(() => {
    // If arriving from QR code scan or install URL parameter on mobile, immediately open install prompt
    if (isFromQRScan && !isStandalone) {
      setShowInstallModal(true);
    }
  }, [isFromQRScan, isStandalone]);
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

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      localStorage.setItem('hamro_patro_lang', lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const articleParam = params.get('article');
      if (articleParam || tabParam === 'articles') {
        setActiveTab('articles');
      } else if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

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

      {/* Main Content Area (padded for mobile bottom nav on small screens) */}
      <main className="flex-1 pb-20 md:pb-0">
        {activeTab === 'calendar' && (
          <CalendarView
            todayBs={todayBs}
            lang={lang}
            onNavigate={handleNavigate}
            onSelectDateForHoroscope={() => handleNavigate('rashifal')}
            onOpenWellness={() => handleNavigate('dharma')}
          />
        )}

        {activeTab === 'articles' && (
          <EditorialHubView lang={lang} onNavigate={handleNavigate} />
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
          <DharmaSanskritiView lang={lang} todayBs={todayBs} onNavigate={handleNavigate} />
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

        {activeTab === 'payments' && (
          <ReceivePaymentsView lang={lang} onNavigate={handleNavigate} />
        )}

        {activeTab === 'festivals' && (
          <FestivalsView lang={lang} todayBs={todayBs} />
        )}

        {activeTab === 'support' && (
          <ReceivePaymentsView lang={lang} onNavigate={handleNavigate} initialPurpose="platform_support" />
        )}
      </main>

      {/* Offline Toast Indicator */}
      <OfflineIndicator lang={lang} />

      {/* Footer */}
      <Footer lang={lang} onNavigate={handleNavigate} />

      {/* Persistent 1-Tap Mobile Install Bar (< 768px) */}
      <MobileInstallStickyBanner lang={lang} onOpenModal={() => setShowInstallModal(true)} />

      {/* App Store Standard Mobile Bottom Navigation (< 768px) */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={handleNavigate} lang={lang} />

      {/* Direct QR Scan / PWA Install Modal */}
      <AppStoreModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;

