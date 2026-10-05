import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Utensils, 
  Calendar, 
  HeartHandshake, 
  PartyPopper,
  Search,
  ChevronRight,
  Filter,
  Check,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FestivalInfo, Language, NepaliDate } from '../types';
import { getLiveFestivals } from '../data/festivals';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface FestivalsViewProps {
  lang: Language;
  todayBs?: NepaliDate;
}

export const FestivalsView: React.FC<FestivalsViewProps> = ({ lang, todayBs }) => {
  const [filter, setFilter] = useState<'all' | 'major' | 'medium'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamically compute festivals for current live year
  const liveFestivals = useMemo(() => {
    const list = getLiveFestivals(todayBs);
    // Sort by nearest upcoming days remaining first
    return [...list].sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [todayBs]);

  const [selectedFestival, setSelectedFestival] = useState<FestivalInfo>(liveFestivals[0]);

  // Keep selected festival in sync if list updates
  useMemo(() => {
    if (!liveFestivals.some(f => f.id === selectedFestival?.id)) {
      setSelectedFestival(liveFestivals[0]);
    }
  }, [liveFestivals]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
    });
  };

  const handleShareFestival = async (fest: FestivalInfo) => {
    const shareText = `🎉 ${lang === 'ne' ? fest.nameNe : fest.nameEn}
📅 ${fest.bsDate} (${fest.adDate})
⏳ ${lang === 'ne' ? `बाँकी दिन: ${toNepaliDigits(fest.daysRemaining)} दिन` : `${fest.daysRemaining} days left`}
✨ ${lang === 'ne' ? fest.taglineNe : fest.taglineEn}
(Nepali Calendar - नेपाली क्यालेन्डर)`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: lang === 'ne' ? fest.nameNe : fest.nameEn,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopiedId(fest.id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    } catch {
      await navigator.clipboard.writeText(shareText);
      setCopiedId(fest.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Filtered festivals by type and search query
  const filteredFestivals = useMemo(() => {
    return liveFestivals.filter((f) => {
      if (filter !== 'all' && f.importance !== filter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchNe = f.nameNe.toLowerCase().includes(query) || f.taglineNe.toLowerCase().includes(query);
        const matchEn = f.nameEn.toLowerCase().includes(query) || f.taglineEn.toLowerCase().includes(query);
        const matchDate = f.bsDate.toLowerCase().includes(query) || f.adDate.toLowerCase().includes(query);
        return matchNe || matchEn || matchDate;
      }
      return true;
    });
  }, [liveFestivals, filter, searchQuery]);

  // Current BS Year title
  const currentBsYearStr = todayBs ? toNepaliDigits(todayBs.year) : '२०८३';
  const currentAdYearStr = new Date().getFullYear();

  // Nearest upcoming festival
  const nextFestival = liveFestivals[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-colors">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-sky-700 via-cyan-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-6 flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-900/60 rounded-full border border-sky-400/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'ne' ? 'नेपाली चाडपर्व तथा सांस्कृतिक धरोहर' : 'Nepali Cultural Festivals & Heritage'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-1"></span>
            <span>{lang === 'ne' ? `वि.सं. ${currentBsYearStr} लाइभ तालिका` : `BS ${currentBsYearStr} Live Almanac`}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {lang === 'ne' 
              ? `चालू वि.सं. ${currentBsYearStr} का प्रमुख नेपाली चाडपर्वहरू` 
              : `Major Nepali Festivals & Live Countdowns (${currentAdYearStr}-${currentAdYearStr + 1})`}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-2 leading-relaxed">
            {lang === 'ne'
              ? 'बडादशैं, तिहार, छठ, महाशिवरात्रि, होली, ल्होसार, तीज लगायत सम्पूर्ण पर्वहरूको प्रत्यक्ष चालु मिति, शुद्ध वैदिक विधि, परिकार र दिन गन्ती।'
              : 'Real-time live dates, authentic rituals, culinary traditions, and exact day countdowns for Nepal’s sacred celebrations.'}
          </p>

          {/* Quick Notice Badge */}
          {nextFestival && (
            <div className="mt-4 inline-flex items-center gap-2 bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/15 text-xs">
              <span className="text-amber-300 font-bold">
                {lang === 'ne' ? 'आसन्न चाड:' : 'Next Festival:'}
              </span>
              <span className="font-semibold text-white">
                {lang === 'ne' ? nextFestival.nameNe : nextFestival.nameEn} ({nextFestival.bsDate})
              </span>
              <span className="bg-amber-400 text-stone-900 font-extrabold px-2 py-0.5 rounded-md text-[11px]">
                {lang === 'ne' ? `${toNepaliDigits(nextFestival.daysRemaining)} दिन बाँकी` : `${nextFestival.daysRemaining} days left`}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={triggerCelebration}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
        >
          <PartyPopper className="w-4 h-4" />
          <span>{lang === 'ne' ? 'चाडपर्व उत्सव मनाउनुहोस् 🎉' : 'Celebrate Festivals 🎉'}</span>
        </button>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ne' ? 'चाडपर्व वा मिति खोज्नुहोस् (उदा: दशैं, तिहार)...' : 'Search festivals (e.g. Dashain, Tihar)...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {lang === 'ne' ? 'प्रकार:' : 'Filter:'}
          </span>
          {(['all', 'major', 'medium'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === t
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {t === 'all' && (lang === 'ne' ? 'सबै चाडपर्व' : 'All Festivals')}
              {t === 'major' && (lang === 'ne' ? 'महान् चाडहरू (Major)' : 'Major Festivals')}
              {t === 'medium' && (lang === 'ne' ? 'अन्य सांस्कृतिक पर्व' : 'Other Events')}
            </button>
          ))}
        </div>
      </div>

      {/* Festivals Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Festival Cards Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
            <span>
              {lang === 'ne' 
                ? `जम्मा ${toNepaliDigits(filteredFestivals.length)} वटा चाडपर्वहरू फेला परे` 
                : `Showing ${filteredFestivals.length} festival events`}
            </span>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
              {lang === 'ne' ? '• आगामी दिन गन्ती अनुसार क्रमबद्ध' : '• Sorted by live upcoming countdown'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFestivals.map((fest) => {
              const isSelected = selectedFestival?.id === fest.id;
              const isToday = fest.daysRemaining === 0;

              return (
                <div
                  key={fest.id}
                  onClick={() => setSelectedFestival(fest)}
                  className={`rounded-3xl p-5 border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-400 shadow-md bg-sky-50/30 dark:bg-sky-950/20'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-sky-300 dark:hover:border-sky-800 hover:shadow-xs'
                  }`}
                >
                  {/* Card Header: Live BS & AD Dates */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/60 font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg">
                        {fest.bsDate}
                      </span>
                      <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 truncate">
                        {fest.adDate}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900 dark:text-white mb-1 leading-snug">
                      {lang === 'ne' ? fest.nameNe : fest.nameEn}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">
                      {lang === 'ne' ? fest.taglineNe : fest.taglineEn}
                    </p>
                  </div>

                  {/* Card Footer: Live Countdown Badge & Action */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg text-xs ${
                      isToday
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 animate-pulse'
                        : fest.isPassedThisYear
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {isToday
                          ? (lang === 'ne' ? 'आज परेको छ 🎉' : 'Celebrating Today 🎉')
                          : (lang === 'ne' ? `बाँकी: ${toNepaliDigits(fest.daysRemaining)} दिन` : `${fest.daysRemaining} days left`)}
                      </span>
                    </span>

                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 group-hover:underline flex items-center gap-0.5">
                      {lang === 'ne' ? 'विस्तार' : 'View'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFestivals.length === 0 && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 text-center">
              <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                {lang === 'ne' ? 'कुनै चाडपर्व फेला परेन।' : 'No festivals matched your query.'}
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setFilter('all'); }}
                className="mt-3 px-3 py-1.5 bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {lang === 'ne' ? 'सबै चाडपर्वहरू देखाउनुहोस्' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Selected Festival Deep Dive (5 cols) */}
        {selectedFestival && (
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm p-6 sm:p-7 space-y-6 sticky top-20 transition-colors">
            {/* Top Bar with Live Dates & Share */}
            <div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="bg-red-700 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-2xs">
                  {selectedFestival.bsDate}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {selectedFestival.adDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleShareFestival(selectedFestival)}
                    title={lang === 'ne' ? 'चाडपर्व विवरण सेयर गर्नुहोस्' : 'Share festival details'}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                  >
                    {copiedId === selectedFestival.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white mt-3 leading-snug">
                {lang === 'ne' ? selectedFestival.nameNe : selectedFestival.nameEn}
              </h3>
              <p className="text-xs text-red-700 dark:text-red-400 font-bold mt-1">
                {lang === 'ne' ? selectedFestival.taglineNe : selectedFestival.taglineEn}
              </p>

              {/* Countdown Alert in Deep Dive */}
              <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {lang === 'ne' ? 'प्रत्यक्ष दिन गन्ती (Live Countdown):' : 'Live Countdown:'}
                  </span>
                </div>
                <span className="bg-amber-400 text-stone-950 font-black px-2.5 py-1 rounded-xl text-xs shadow-2xs">
                  {selectedFestival.daysRemaining === 0
                    ? (lang === 'ne' ? 'आज परेको छ 🎉' : 'Today 🎉')
                    : (lang === 'ne' ? `${toNepaliDigits(selectedFestival.daysRemaining)} दिन बाँकी` : `${selectedFestival.daysRemaining} days left`)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {lang === 'ne' ? selectedFestival.descriptionNe : selectedFestival.descriptionEn}
            </div>

            {/* Rituals List */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-red-600 dark:text-red-400" />
                {lang === 'ne' ? 'मुख्य धार्मिक तथा सामाजिक विधिहरू' : 'Core Rituals & Traditions'}
              </h4>
              <div className="space-y-2">
                {(lang === 'ne' ? selectedFestival.ritualsNe : selectedFestival.ritualsEn).map((ritual, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-800 dark:text-stone-200 bg-stone-50/70 dark:bg-stone-800/40 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{ritual}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditional Recipe Highlight */}
            {selectedFestival.recipeOrHighlightNe && (
              <div className="p-4 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1">
                    {lang === 'ne' ? 'विशेष खानपिन र परिकार' : 'Traditional Festive Cuisine'}
                  </h5>
                  <p className="text-xs text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
                    {lang === 'ne' ? selectedFestival.recipeOrHighlightNe : selectedFestival.recipeOrHighlightEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
