import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Globe, 
  Clock,
  CloudSun,
  Compass,
  Coins,
  Heart,
  Wallet
} from 'lucide-react';
import { NepaliDate, Panchanga, Language } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  todayBs: NepaliDate;
  panchanga: Panchanga;
  lang: Language;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onOpenRadio?: () => void;
  isRadioPlaying?: boolean;
  activeRadioName?: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todayBs,
  panchanga,
  lang,
  theme,
  onToggleTheme,
  onToggleLang,
  onNavigate,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      if (lang === 'ne') {
        const neH = toNepaliDigits(formattedHours);
        const neM = toNepaliDigits(minutes);
        const neS = toNepaliDigits(seconds);
        const neAmpm = ampm === 'AM' ? 'बिहान' : 'साँझ/दिउँसो';
        setTimeStr(`${neH}:${neM}:${neS} (${neAmpm})`);
      } else {
        setTimeStr(`${formattedHours}:${minutes}:${seconds} ${ampm}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <header className="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 dark:from-stone-950 dark:via-sky-950 dark:to-stone-950 text-white shadow-lg sticky top-0 z-40 border-b border-sky-800/40 dark:border-stone-800 transition-colors duration-200">
      {/* Top Banner / Ticker Bar */}
      <div className="bg-sky-950/70 dark:bg-black/60 border-b border-sky-800/40 dark:border-stone-800/80 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap text-sky-100">
          <span className="flex items-center gap-1 font-semibold text-amber-300">
            <Sun className="w-3.5 h-3.5" />
            {lang === 'ne' ? 'सूर्योदय' : 'Sunrise'}: {panchanga.sunrise}
          </span>
          <span className="text-sky-400">•</span>
          <span className="flex items-center gap-1 text-amber-200">
            <Moon className="w-3.5 h-3.5" />
            {lang === 'ne' ? 'सूर्यास्त' : 'Sunset'}: {panchanga.sunset}
          </span>
          <span className="text-sky-400">•</span>
          <span className="text-white font-medium">
            {lang === 'ne' ? `तिथी: ${panchanga.tithi}` : `Tithi: ${panchanga.tithiEn}`}
          </span>
          <span className="text-sky-400 hidden sm:inline">•</span>
          <span className="text-sky-200 hidden sm:inline">
            {lang === 'ne' ? `नक्षत्र: ${panchanga.nakshatra}` : `Nakshatra: ${panchanga.nakshatraEn}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Forex & Gold Quick Link */}
          <button
            id="header-forex-top-btn"
            type="button"
            onClick={() => onNavigate('forex')}
            className="h-7 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-stone-800/80 dark:hover:bg-stone-700/80 border border-white/15 dark:border-stone-700 text-white text-xs transition-all font-medium flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={lang === 'ne' ? 'विदेशी मुद्रा र सुनचाँदी दर' : 'Forex & Gold Rates'}
          >
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden lg:inline">{lang === 'ne' ? 'मुद्रा / सुन' : 'Forex & Gold'}</span>
          </button>

          {/* Weather Quick Link */}
          <button
            id="header-weather-top-btn"
            type="button"
            onClick={() => onNavigate('weather')}
            className="h-7 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-stone-800/80 dark:hover:bg-stone-700/80 border border-white/15 dark:border-stone-700 text-white text-xs transition-all font-medium flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={lang === 'ne' ? 'नेपालको मौसम पूर्वानुमान हेर्नुहोस्' : 'Nepal Weather Forecast'}
          >
            <CloudSun className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">{lang === 'ne' ? 'मौसम' : 'Weather'}</span>
          </button>

          {/* World Clock Quick Link */}
          <button
            id="header-worldclock-top-btn"
            type="button"
            onClick={() => onNavigate('worldclock')}
            className="h-7 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-stone-800/80 dark:hover:bg-stone-700/80 border border-white/15 dark:border-stone-700 text-white text-xs transition-all font-medium flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={lang === 'ne' ? 'विश्व घडी हेर्नुहोस् (World Clock)' : 'Open World Clock'}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xs:inline">{lang === 'ne' ? 'विश्व घडी' : 'World Clock'}</span>
          </button>

          {/* PWA App Store Install Button */}
          <PWAInstallButton lang={lang} variant="header" />

          {/* Support Quick Link */}
          <button
            id="header-support-top-btn"
            type="button"
            onClick={() => onNavigate('payments')}
            className="h-7 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition-all font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 border border-emerald-500/80"
            title={lang === 'ne' ? 'सहयोग (Support)' : 'Support Our Work'}
          >
            <Wallet className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'ne' ? 'सहयोग' : 'Support'}</span>
          </button>

          {/* Global Theme Toggle (Light / Dark) */}
          <button
            id="header-theme-toggle-top"
            type="button"
            onClick={onToggleTheme}
            className={`h-7 px-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              theme === 'dark'
                ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode for Nighttime'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                <span className="hidden sm:inline">{lang === 'ne' ? 'दिन' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" />
                <span className="hidden sm:inline">{lang === 'ne' ? 'रात' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Language Switch */}
          <button
            id="header-language-toggle-top"
            onClick={onToggleLang}
            className="h-7 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-stone-800/80 dark:hover:bg-stone-700/80 border border-white/15 dark:border-stone-700 text-amber-200 hover:text-white text-xs transition-all font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'ne' ? 'EN' : 'नेपाली'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div 
          onClick={() => onNavigate('calendar')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-900 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-md ring-2 ring-amber-400/60 group-hover:scale-105 transition-transform">
            <CalendarIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Shubha Patro
                <span className="text-xs bg-amber-400 text-stone-900 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  BS {toNepaliDigits(todayBs.year)}
                </span>
              </h1>
            </div>
            <p className="text-xs text-sky-100 dark:text-stone-300 font-medium">
              {lang === 'ne' ? 'नेपाली क्यालेन्डर, पञ्चाङ्ग र राशिफल' : 'Nepali Calendar, Panchanga & Rashifal'}
            </p>
          </div>
        </div>

        {/* Current Live Date & Clock Card - Clickable to open World Clock */}
        <div 
          onClick={() => onNavigate('worldclock')}
          className="bg-sky-950/60 dark:bg-stone-900/90 border border-sky-500/30 dark:border-stone-700/70 rounded-2xl px-4 py-2 flex items-center gap-4 text-center sm:text-left shadow-inner hover:border-amber-400/70 hover:bg-sky-950/80 dark:hover:bg-stone-800/90 transition-all cursor-pointer group"
          title={lang === 'ne' ? 'विश्व घडी र अन्य देशको समय हेर्न क्लिक गर्नुहोस्' : 'Click to view World Clock and international time zones'}
        >
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-sky-700/40 dark:bg-stone-800 text-amber-300 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <span>🇳🇵</span>
              <span>{lang === 'ne' ? todayBs.formattedNe : todayBs.formattedEn}</span>
              <span className="text-[10px] bg-sky-800/80 dark:bg-stone-800 text-sky-100 dark:text-amber-200 px-1.5 py-0.2 rounded group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                {lang === 'ne' ? 'नेपाल' : 'NPT'}
              </span>
            </div>
            <div className="text-xs text-sky-100 dark:text-stone-300 flex items-center gap-2">
              <span className="font-semibold text-white font-mono">{timeStr}</span>
              <span className="text-sky-400">•</span>
              <span className="text-stone-300 dark:text-stone-400">{todayBs.adFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
