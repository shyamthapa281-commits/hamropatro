import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  BookOpen, 
  Coins, 
  Menu, 
  X,
  Compass, 
  TrendingUp, 
  CloudSun, 
  Clock, 
  Calculator, 
  Download,
  Smartphone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import { hapticFeedback } from '../utils/haptics';
import { AppStoreModal } from './AppStoreModal';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang,
}) => {
  const [showMoreDrawer, setShowMoreDrawer] = useState<boolean>(false);
  const [showAppStoreModal, setShowAppStoreModal] = useState<boolean>(false);

  const mainTabs = [
    { id: 'calendar', labelNe: 'पात्रो', labelEn: 'Calendar', icon: CalendarIcon },
    { id: 'rashifal', labelNe: 'राशिफल', labelEn: 'Rashifal', icon: Sparkles },
    { id: 'dharma', labelNe: 'धर्म', labelEn: 'Dharma', icon: BookOpen },
    { id: 'forex', labelNe: 'मुद्रा', labelEn: 'Forex', icon: Coins },
  ];

  const moreFeatures = [
    { id: 'articles', labelNe: 'लेख तथा ज्ञान', labelEn: 'Articles & Guides', icon: BookOpen },
    { id: 'kundali', labelNe: 'कुण्डली तथा गुण मिलान', labelEn: 'Kundali & Gun Milan', icon: Compass },
    { id: 'festivals', labelNe: 'चाडपर्व तथा बिदा', labelEn: 'Festivals & Holidays', icon: Sparkles },
    { id: 'nrn-banking', labelNe: 'NRN बैंकिङ र IPO', labelEn: 'NRN Banking & IPO', icon: TrendingUp },
    { id: 'weather', labelNe: 'मौसम पूर्वानुमान', labelEn: 'Weather Forecast', icon: CloudSun },
    { id: 'worldclock', labelNe: 'विश्व घडी', labelEn: 'World Clock', icon: Clock },
    { id: 'calculator', labelNe: 'क्याल्कुलेटर र नाप', labelEn: 'Calculators & EMI', icon: Calculator },
  ];

  const handleTabClick = (tabId: string) => {
    hapticFeedback.light();
    onSelectTab(tabId);
    setShowMoreDrawer(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar for Mobile (< 768px) */}
      <nav 
        id="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 dark:bg-black/95 text-stone-200 backdrop-blur-xl border-t border-stone-800/80 shadow-2xl transition-all select-none pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        {/* Top radiant shimmer border with crimson & amber accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 opacity-80" />

        <div className="grid grid-cols-5 items-center h-14">
          {mainTabs.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                id={`mobile-tab-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center h-full w-full relative transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {/* Active Indicator Top Line */}
                {isActive && (
                  <span className="absolute top-0 w-8 h-[2.5px] bg-gradient-to-r from-amber-400 via-red-500 to-amber-400 rounded-b-full shadow-sm shadow-amber-400/50" />
                )}
                
                <IconComp className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.2] text-amber-400 drop-shadow-[0_1px_4px_rgba(251,191,36,0.4)]' : 'stroke-[1.75]'}`} />
                <span className={`text-[10px] tracking-tight leading-tight mt-0.5 ${isActive ? 'font-bold text-amber-300' : 'font-medium text-stone-400'}`}>
                  {lang === 'ne' ? item.labelNe : item.labelEn}
                </span>
              </button>
            );
          })}

          {/* 5th Tab: More Drawer Trigger */}
          <button
            type="button"
            id="mobile-tab-more"
            onClick={() => {
              hapticFeedback.light();
              setShowMoreDrawer(true);
            }}
            className={`flex flex-col items-center justify-center h-full w-full relative transition-all duration-200 cursor-pointer active:scale-95 ${
              showMoreDrawer
                ? 'text-amber-400 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Menu className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] tracking-tight leading-tight mt-0.5 font-medium">
              {lang === 'ne' ? 'थप' : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-over More Drawer for Mobile */}
      {showMoreDrawer && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setShowMoreDrawer(false)}
        >
          <div 
            className="bg-white dark:bg-stone-900 rounded-t-3xl border-t border-stone-200 dark:border-stone-800 p-5 space-y-4 max-h-[80vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                    {lang === 'ne' ? 'सम्पूर्ण सेवाहरू तथा एप स्टोर' : 'All Features & App Store'}
                  </h4>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Shubha Patro (शुभ पात्रो)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* App Store Feature Callout Card */}
            <div 
              onClick={() => {
                hapticFeedback.medium();
                setShowMoreDrawer(false);
                setShowAppStoreModal(true);
              }}
              className="p-3.5 bg-gradient-to-r from-red-700 via-sky-700 to-red-800 text-white rounded-2xl flex items-center justify-between gap-3 shadow-md cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-sm shrink-0 flex items-center justify-center">
                  <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">{lang === 'ne' ? 'एप स्टोर संस्करण इन्स्टल गर्नुहोस्' : 'Install App Store Edition'}</span>
                    <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded">PWA</span>
                  </div>
                  <span className="text-[10px] text-sky-100 block">
                    {lang === 'ne' ? '१००% अफलाइन, छिटो र ब्याट्री-मैत्री' : 'Offline ready, fast & battery efficient'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />
            </div>

            {/* Additional Features List */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {moreFeatures.map((item) => {
                const IconComp = item.icon;
                const isItemActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isItemActive
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 font-bold'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                    <span className="truncate">{lang === 'ne' ? item.labelNe : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* App Store Modal Launcher */}
      <AppStoreModal
        isOpen={showAppStoreModal}
        onClose={() => setShowAppStoreModal(false)}
        lang={lang}
      />
    </>
  );
};
