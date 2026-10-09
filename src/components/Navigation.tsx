import React, { useRef, useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Coins, 
  ArrowLeftRight,
  Calculator as CalcIcon,
  Clock,
  CloudSun,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Compass
} from 'lucide-react';
import { Language } from '../types';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  lang,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const navItems = [
    {
      id: 'calendar',
      nameNe: 'क्यालेन्डर / पञ्चाङ्ग',
      nameEn: 'Calendar & Panchanga',
      icon: CalendarIcon,
    },
    {
      id: 'rashifal',
      nameNe: 'दैनिक राशिफल',
      nameEn: 'Daily Rashifal',
      icon: Sparkles,
      badge: 'शुभ',
    },
    {
      id: 'kundali',
      nameNe: 'कुण्डली तथा गुण मिलान',
      nameEn: 'Kundali & Gun Milan',
      icon: Compass,
      badgeNe: 'वैदिक',
      badgeEn: 'Vedic',
    },
    {
      id: 'forex',
      nameNe: 'विदेशी मुद्रा र सुन',
      nameEn: 'Forex & Gold',
      icon: Coins,
      badgeNe: 'NRB',
      badgeEn: 'Rates',
    },
    {
      id: 'nrn-banking',
      nameNe: 'NRN बैंकिङ र IPO',
      nameEn: 'NRN Banking & IPO',
      icon: TrendingUp,
      badgeNe: '१०% कोटा',
      badgeEn: '10% Quota',
    },
    {
      id: 'dharma',
      nameNe: 'धर्म संस्कृति र सपना',
      nameEn: 'Dharma & Dreams',
      icon: BookOpen,
      badgeNe: 'सपना फल',
      badgeEn: 'Dreams',
    },
    {
      id: 'weather',
      nameNe: 'मौसम पूर्वानुमान',
      nameEn: 'Weather',
      icon: CloudSun,
      badgeNe: 'प्रत्यक्ष',
      badgeEn: 'Live',
    },
    {
      id: 'worldclock',
      nameNe: 'विश्व घडी',
      nameEn: 'World Clock',
      icon: Clock,
      badgeNe: 'नेपाल समय',
      badgeEn: 'Nepal NPT',
    },
    {
      id: 'calculator',
      nameNe: 'क्याल्कुलेटर',
      nameEn: 'Calculator & EMI',
      icon: CalcIcon,
    },
    {
      id: 'converter',
      nameNe: 'नाप तथा मिति रूपान्तरण',
      nameEn: 'Measurement & Date',
      icon: ArrowLeftRight,
    },
  ];

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 8);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  // Auto scroll active tab into visible view
  useEffect(() => {
    const activeEl = document.getElementById(`nav-tab-${activeTab}`);
    if (activeEl && scrollContainerRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -240 : 240;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 320);
  };

  return (
    <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-xs sticky top-[73px] sm:top-[77px] z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative flex items-center">
        {/* Left Scroll Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="flex absolute left-1 sm:left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full bg-white/95 dark:bg-stone-800/95 text-stone-700 dark:text-stone-200 hover:text-sky-600 dark:hover:text-sky-400 shadow-md border border-stone-200 dark:border-stone-700 transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Scroll left"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Navigation Track */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-1.5 scroll-smooth scrollbar-none w-full px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 select-none cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-700 dark:ring-sky-500'
                    : 'text-stone-700 dark:text-stone-200 hover:text-sky-600 dark:hover:text-amber-300 hover:bg-sky-50/80 dark:hover:bg-stone-800 bg-stone-50/60 dark:bg-stone-800/40 border border-transparent dark:border-stone-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{lang === 'ne' ? item.nameNe : item.nameEn}</span>
                {item.badgeNe && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300'
                    }`}
                  >
                    {lang === 'ne' ? item.badgeNe : item.badgeEn}
                  </span>
                )}
                {item.badge && !item.badgeNe && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="flex absolute right-1 sm:right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full bg-white/95 dark:bg-stone-800/95 text-stone-700 dark:text-stone-200 hover:text-sky-600 dark:hover:text-sky-400 shadow-md border border-stone-200 dark:border-stone-700 transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Scroll right"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};
