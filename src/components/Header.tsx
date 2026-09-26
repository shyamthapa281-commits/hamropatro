import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Radio as RadioIcon, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Globe, 
  Clock,
  CloudSun,
  Compass
} from 'lucide-react';
import { NepaliDate, Panchanga, Language } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface HeaderProps {
  todayBs: NepaliDate;
  panchanga: Panchanga;
  lang: Language;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onOpenRadio: () => void;
  isRadioPlaying: boolean;
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
  onOpenRadio,
  isRadioPlaying,
  activeRadioName,
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
    <header className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 dark:from-stone-950 dark:via-red-950 dark:to-stone-950 text-white shadow-lg sticky top-0 z-40 border-b border-red-900/40 dark:border-stone-800 transition-colors duration-200">
      {/* Top Banner / Ticker Bar */}
      <div className="bg-red-950/70 dark:bg-black/60 border-b border-red-800/40 dark:border-stone-800/80 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap text-red-200">
          <span className="flex items-center gap-1 font-semibold text-amber-300">
            <Sun className="w-3.5 h-3.5" />
            {lang === 'ne' ? 'सूर्योदय' : 'Sunrise'}: {panchanga.sunrise}
          </span>
          <span className="text-red-400">•</span>
          <span className="flex items-center gap-1 text-amber-200">
            <Moon className="w-3.5 h-3.5" />
            {lang === 'ne' ? 'सूर्यास्त' : 'Sunset'}: {panchanga.sunset}
          </span>
          <span className="text-red-400">•</span>
          <span className="text-amber-100 font-medium">
            {lang === 'ne' ? `तिथी: ${panchanga.tithi}` : `Tithi: ${panchanga.tithiEn}`}
          </span>
          <span className="text-red-400 hidden sm:inline">•</span>
          <span className="text-red-200 hidden sm:inline">
            {lang === 'ne' ? `नक्षत्र: ${panchanga.nakshatra}` : `Nakshatra: ${panchanga.nakshatraEn}`}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Weather Quick Link */}
          <button
            id="header-weather-top-btn"
            type="button"
            onClick={() => onNavigate('weather')}
            className="flex items-center gap-1 bg-red-900/60 dark:bg-stone-800/70 hover:bg-red-800 dark:hover:bg-stone-700 px-2.5 py-0.5 rounded-lg border border-red-700/40 dark:border-stone-700 text-sky-200 text-xs transition-colors font-medium cursor-pointer"
            title={lang === 'ne' ? 'नेपालको मौसम पूर्वानुमान हेर्नुहोस्' : 'Nepal Weather Forecast'}
          >
            <CloudSun className="w-3 h-3 text-sky-300" />
            <span className="hidden sm:inline">{lang === 'ne' ? 'मौसम' : 'Weather'}</span>
          </button>

          {/* World Clock Quick Link */}
          <button
            id="header-worldclock-top-btn"
            type="button"
            onClick={() => onNavigate('worldclock')}
            className="flex items-center gap-1 bg-red-900/60 dark:bg-stone-800/70 hover:bg-red-800 dark:hover:bg-stone-700 px-2.5 py-0.5 rounded-lg border border-red-700/40 dark:border-stone-700 text-amber-200 text-xs transition-colors font-medium cursor-pointer"
            title={lang === 'ne' ? 'विश्व घडी हेर्नुहोस् (World Clock)' : 'Open World Clock'}
          >
            <Clock className="w-3 h-3 text-amber-300" />
            <span className="hidden xs:inline">{lang === 'ne' ? 'विश्व घडी' : 'World Clock'}</span>
          </button>

          {/* Global Theme Toggle (Light / Dark) */}
          <button
            id="header-theme-toggle-top"
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              theme === 'dark'
                ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300 shadow-xs'
                : 'bg-red-900/70 hover:bg-red-800 text-amber-200 border-red-700/50'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode for Nighttime'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                <span>{lang === 'ne' ? 'दिन मोड' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" />
                <span>{lang === 'ne' ? 'रात्री मोड' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Radio Toggle */}
          <button
            id="header-radio-toggle-top"
            onClick={onOpenRadio}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
              isRadioPlaying
                ? 'bg-amber-400 text-stone-900 animate-pulse font-semibold'
                : 'bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700/50'
            }`}
          >
            <RadioIcon className="w-3 h-3" />
            <span>
              {isRadioPlaying 
                ? (activeRadioName ? `लाइभ: ${activeRadioName}` : 'Radio ON') 
                : (lang === 'ne' ? 'नेपाली रेडियो' : 'Nepali FM')}
            </span>
          </button>

          {/* Language Switch */}
          <button
            id="header-language-toggle-top"
            onClick={onToggleLang}
            className="flex items-center gap-1 bg-red-900/60 hover:bg-red-800/80 px-2 py-0.5 rounded border border-red-700/40 text-amber-200 transition-colors font-medium cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>{lang === 'ne' ? 'English' : 'नेपाली'}</span>
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
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-900 text-red-700 dark:text-red-500 flex items-center justify-center shadow-md ring-2 ring-amber-400/60 group-hover:scale-105 transition-transform">
            <CalendarIcon className="w-6 h-6 text-red-700 dark:text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Nepali Calendar
                <span className="text-xs bg-amber-400 text-stone-900 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  BS {toNepaliDigits(todayBs.year)}
                </span>
              </h1>
            </div>
            <p className="text-xs text-red-200 dark:text-stone-300 font-medium">
              {lang === 'ne' ? 'नेपाली क्यालेन्डर, राशिफल र ताजा समाचार' : 'Nepali Calendar, Rashifal & News'}
            </p>
          </div>
        </div>

        {/* Current Live Date & Clock Card - Clickable to open World Clock */}
        <div 
          onClick={() => onNavigate('worldclock')}
          className="bg-red-950/60 dark:bg-stone-900/90 border border-red-600/30 dark:border-stone-700/70 rounded-2xl px-4 py-2 flex items-center gap-4 text-center sm:text-left shadow-inner hover:border-amber-400/70 hover:bg-red-950/80 dark:hover:bg-stone-800/90 transition-all cursor-pointer group"
          title={lang === 'ne' ? 'विश्व घडी र अन्य देशको समय हेर्न क्लिक गर्नुहोस्' : 'Click to view World Clock and international time zones'}
        >
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-red-700/40 dark:bg-stone-800 text-amber-300 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <span>🇳🇵</span>
              <span>{lang === 'ne' ? todayBs.formattedNe : todayBs.formattedEn}</span>
              <span className="text-[10px] bg-red-800/80 dark:bg-stone-800 text-red-200 dark:text-amber-200 px-1.5 py-0.2 rounded group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                {lang === 'ne' ? 'नेपाल' : 'NPT'}
              </span>
            </div>
            <div className="text-xs text-red-200 dark:text-stone-300 flex items-center gap-2">
              <span className="font-semibold text-white font-mono">{timeStr}</span>
              <span className="text-red-400">•</span>
              <span className="text-stone-300 dark:text-stone-400">{todayBs.adFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
