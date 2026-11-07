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
  Compass,
  Wallet,
  Flag
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
      nameNe: 'पात्रो / पञ्चाङ्ग',
      nameEn: 'Calendar & Panchanga',
      icon: CalendarIcon,
    },
    {
      id: 'festivals',
      nameNe: 'चाडपर्व तथा बिदा',
      nameEn: 'Festivals & Holidays',
      icon: Flag,
      badgeNe: '२०८१/८२',
      badgeEn: 'Festivals',
    },
    {
      id: 'articles',
      nameNe: 'लेख तथा ज्ञान',
      nameEn: 'Articles & Guides',
      icon: BookOpen,
      badgeNe: 'ज्ञान',
      badgeEn: 'Guides',
    },
    {
      id: 'rashifal',
      nameNe: 'दैनिक राशिफल',
      nameEn: 'Daily Rashifal',
      icon: Sparkles,
      badgeNe: 'शुभ',
      badgeEn: 'Daily',
    },
    {
      id: 'kundali',
      nameNe: 'कुण्डली तथा गुण मिलान',
      nameEn: 'Kundali & Milan',
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
      badgeNe: '१०%',
      badgeEn: '10%',
    },
    {
      id: 'dharma',
      nameNe: 'धर्म संस्कृति र सपना',
      nameEn: 'Dharma & Rituals',
      icon: BookOpen,
      badgeNe: 'पूजा',
      badgeEn: 'Puja',
    },
    {
      id: 'weather',
      nameNe: 'मौसम पूर्वानुमान',
      nameEn: 'Weather',
      icon: CloudSun,
      badgeNe: 'लाइभ',
      badgeEn: 'Live',
    },
    {
      id: 'worldclock',
      nameNe: 'विश्व घडी',
      nameEn: 'World Clock',
      icon: Clock,
      badgeNe: 'NPT',
      badgeEn: 'NPT',
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
      nameEn: 'Date & Unit Converter',
      icon: ArrowLeftRight,
    },
    {
      id: 'payments',
      nameNe: 'सहयोग',
      nameEn: 'Support Our Work',
      icon: Wallet,
      badgeNe: 'सहयोग',
      badgeEn: 'Support',
    },
  ];

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
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
    const scrollAmount = direction === 'left' ? -260 : 260;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 320);
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className="bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md text-white sticky top-[73px] sm:top-[77px] z-30 transition-all duration-200 border-b border-stone-800/80 shadow-lg shadow-black/20"
    >
      {/* Subtle top golden accent hairline */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative flex items-center">
        {/* Left Scroll Button with soft gradient scrim */}
        {showLeftArrow && (
          <div className="absolute left-0 z-20 flex items-center pl-1 sm:pl-2 pr-6 bg-gradient-to-r from-stone-900 via-stone-900/95 to-transparent dark:from-stone-950 dark:via-stone-950/95 h-full pointer-events-none">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="pointer-events-auto flex w-8 h-8 items-center justify-center rounded-xl bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-700/90 border border-stone-700 shadow-lg backdrop-blur-md transition-all cursor-pointer active:scale-95 hover:border-amber-400/50"
              aria-label="Scroll navigation left"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Navigation Track */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 sm:py-3 scroll-smooth scrollbar-none w-full px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badgeText = lang === 'ne' ? item.badgeNe : item.badgeEn;

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 select-none cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-[0.98] ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-md shadow-red-950/40 border border-red-400/40 ring-1 ring-red-400/20'
                    : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 dark:bg-stone-800/50 dark:hover:bg-stone-800 border border-stone-800/80 hover:border-stone-700/80 shadow-2xs'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive
                      ? 'text-amber-300 stroke-[2.3] scale-105'
                      : 'text-amber-400/80 group-hover:text-amber-300 group-hover:scale-110'
                  }`}
                />
                <span className={`tracking-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  {lang === 'ne' ? item.nameNe : item.nameEn}
                </span>

                {/* Subtle refined micro-badge */}
                {badgeText && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider transition-colors shrink-0 ${
                      item.id === 'payments'
                        ? (isActive
                            ? 'bg-black/35 text-emerald-300 border border-emerald-400/30'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 group-hover:bg-emerald-900')
                        : (isActive
                            ? 'bg-black/35 text-amber-200 border border-amber-300/30'
                            : 'bg-stone-800 text-stone-300 dark:text-stone-400 border border-stone-700/60 group-hover:text-amber-300 group-hover:border-amber-400/30')
                    }`}
                  >
                    {badgeText}
                  </span>
                )}

                {/* Active bottom glow line indicator */}
                {isActive && (
                  <span className="absolute -bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 rounded-full shadow-xs shadow-amber-300/60" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button with soft gradient scrim */}
        {showRightArrow && (
          <div className="absolute right-0 z-20 flex items-center pr-1 sm:pr-2 pl-6 bg-gradient-to-l from-stone-900 via-stone-900/95 to-transparent dark:from-stone-950 dark:via-stone-950/95 h-full pointer-events-none">
            <button
              type="button"
              onClick={() => scroll('right')}
              className="pointer-events-auto flex w-8 h-8 items-center justify-center rounded-xl bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-700/90 border border-stone-700 shadow-lg backdrop-blur-md transition-all cursor-pointer active:scale-95 hover:border-amber-400/50"
              aria-label="Scroll navigation right"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Radiant accent border strip along bottom */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-700/60 to-transparent" />
    </nav>
  );
};
