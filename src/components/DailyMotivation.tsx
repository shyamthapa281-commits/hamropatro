import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Quote, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Share2, 
  Heart, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  List,
  RotateCcw,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MotivationQuote, Language, NepaliDate } from '../types';
import { 
  MOTIVATION_QUOTES, 
  getDailyMotivationQuote, 
  fetchDailyMotivationQuote 
} from '../data/motivationQuotes';
import { toNepaliDigits } from '../utils/nepaliCalendar';

export interface DailyMotivationProps {
  lang: Language;
  todayBs: NepaliDate;
  className?: string;
  defaultExpanded?: boolean;
}

export const DailyMotivation: React.FC<DailyMotivationProps> = ({
  lang,
  todayBs,
  className = '',
  defaultExpanded = true,
}) => {
  // Deterministic daily quote index for today
  const dailyMeta = useMemo(() => getDailyMotivationQuote(todayBs), [todayBs]);
  
  const [currentQuote, setCurrentQuote] = useState<MotivationQuote>(dailyMeta.quote);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [showMeaning, setShowMeaning] = useState<boolean>(false);
  const [showDirectory, setShowDirectory] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Favorites saved in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shubha_patro_favorite_quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Available categories
  const CATEGORIES = [
    { id: 'all', nameNe: 'सबै विचार', nameEn: 'All Quotes' },
    { id: 'proverb', nameNe: 'उखान-टुक्का', nameEn: 'Proverbs' },
    { id: 'literary', nameNe: 'साहित्यिक', nameEn: 'Literary Classics' },
    { id: 'buddha', nameNe: 'बुद्ध वाणी', nameEn: 'Buddha Teachings' },
    { id: 'perseverance', nameNe: 'कर्म र सङ्घर्ष', nameEn: 'Resilience' },
    { id: 'wisdom', nameNe: 'ज्ञान र विवेक', nameEn: 'Wisdom' },
  ];

  // Pool of quotes matching active category
  const activePool = useMemo(() => {
    if (selectedCategory === 'all') return MOTIVATION_QUOTES;
    return MOTIVATION_QUOTES.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  // Current quote index within the active category pool
  const activeIndexInPool = useMemo(() => {
    const idx = activePool.findIndex((q) => q.id === currentQuote.id);
    return idx >= 0 ? idx : 0;
  }, [activePool, currentQuote.id]);

  const isFavorite = favorites.includes(currentQuote.id);
  const isTodayQuote = currentQuote.id === dailyMeta.quote.id && selectedCategory === 'all';

  // Fetch or cycle quote with subtle simulated async feedback
  const handleFetchNewQuote = useCallback(async (forcedCategory?: string) => {
    setIsLoading(true);
    if (window.speechSynthesis && isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    
    const cat = forcedCategory || selectedCategory;
    try {
      const next = await fetchDailyMotivationQuote(todayBs, cat === 'all' ? undefined : cat);
      // Ensure we don't pick the exact same quote if pool has > 1
      const pool = cat === 'all' ? MOTIVATION_QUOTES : MOTIVATION_QUOTES.filter(q => q.category === cat);
      if (pool.length > 1 && next.id === currentQuote.id) {
        const remaining = pool.filter(q => q.id !== currentQuote.id);
        const alt = remaining[Math.floor(Math.random() * remaining.length)];
        setCurrentQuote(alt);
      } else {
        setCurrentQuote(next);
      }
    } catch {
      // Fallback: simple random
      const pool = cat === 'all' ? MOTIVATION_QUOTES : MOTIVATION_QUOTES.filter(q => q.category === cat);
      const random = pool[Math.floor(Math.random() * pool.length)];
      setCurrentQuote(random || MOTIVATION_QUOTES[0]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, todayBs, isPlayingAudio, currentQuote.id]);

  // Next quote in active category
  const handleNextQuote = () => {
    if (activePool.length <= 1) return;
    const nextIdx = (activeIndexInPool + 1) % activePool.length;
    setCurrentQuote(activePool[nextIdx]);
    if (window.speechSynthesis && isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Previous quote in active category
  const handlePrevQuote = () => {
    if (activePool.length <= 1) return;
    const prevIdx = (activeIndexInPool - 1 + activePool.length) % activePool.length;
    setCurrentQuote(activePool[prevIdx]);
    if (window.speechSynthesis && isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Reset to today's official daily quote
  const handleResetToToday = () => {
    setSelectedCategory('all');
    setCurrentQuote(dailyMeta.quote);
    if (window.speechSynthesis && isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Select category
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setShowMeaning(false);
    setShowDirectory(false);
    if (catId === 'all') {
      setCurrentQuote(dailyMeta.quote);
    } else {
      const pool = MOTIVATION_QUOTES.filter((q) => q.category === catId);
      if (pool.length > 0) {
        setCurrentQuote(pool[0]);
      }
    }
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    let updated: string[];
    if (isFavorite) {
      updated = favorites.filter((id) => id !== currentQuote.id);
    } else {
      updated = [...favorites, currentQuote.id];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('shubha_patro_favorite_quotes', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Copy to clipboard
  const handleCopyQuote = async () => {
    const quoteText = lang === 'ne' ? currentQuote.quoteNe : currentQuote.quoteEn;
    const authorText = lang === 'ne' ? currentQuote.authorNe : currentQuote.authorEn;
    const textToCopy = `“${quoteText}”\n— ${authorText}\n(शुभ पात्रो • Shubha Patro • shubhapatro.com)`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  // Social / Web share
  const handleShare = async () => {
    const quoteText = lang === 'ne' ? currentQuote.quoteNe : currentQuote.quoteEn;
    const authorText = lang === 'ne' ? currentQuote.authorNe : currentQuote.authorEn;
    const shareData = {
      title: lang === 'ne' ? 'शुभ पात्रो - दैनिक प्रेरणा' : 'Shubha Patro - Daily Motivation',
      text: `“${quoteText}” — ${authorText}`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://shubhapatro.com',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopyQuote();
      }
    } else {
      handleCopyQuote();
    }
  };

  // Text to speech
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const text = lang === 'ne' ? currentQuote.quoteNe : currentQuote.quoteEn;
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'ne') {
      const nepaliVoice = voices.find(v => v.lang.startsWith('ne') || v.lang.startsWith('hi'));
      if (nepaliVoice) utterance.voice = nepaliVoice;
      utterance.lang = nepaliVoice ? nepaliVoice.lang : 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Today's date string representation
  const dateSubtext = lang === 'ne'
    ? `${toNepaliDigits(todayBs.year)} ${todayBs.monthNameNe} ${toNepaliDigits(todayBs.day)}`
    : `${todayBs.monthNameEn} ${todayBs.day}, ${todayBs.year} BS`;

  return (
    <section 
      id="daily-motivation-section"
      aria-label="Daily Motivation"
      className={`bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs overflow-hidden transition-all duration-200 relative group ${className}`}
    >
      {/* Top warm cultural accent stripe */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-700 w-full" />

      <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
        {/* Header: Zero-pill typographic header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-stone-900 dark:text-stone-50">
                  {lang === 'ne' ? 'दैनिक प्रेरणा' : 'Daily Motivation'}
                </h2>
                {/* Zero-pill: clean text with interpunct */}
                <span className="text-xs text-stone-400 dark:text-stone-500">·</span>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {isTodayQuote 
                    ? (lang === 'ne' ? 'आजको विशेष भनाइ' : 'Today’s Selected Quote')
                    : (lang === 'ne' ? 'प्रेरणादायी सङ्ग्रह' : 'Curated Wisdom')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {dateSubtext} · {lang === 'ne' ? 'नेपाली उखान-टुक्का तथा प्रेरक चिन्तन' : 'Nepali proverbs & timeless inspirational insights'}
              </p>
            </div>
          </div>

          {/* Quick controls: Today reset, fetch new quote & collapse/expand */}
          <div className="flex items-center gap-1.5 ml-auto">
            {!isTodayQuote && (
              <button
                type="button"
                onClick={handleResetToToday}
                className="text-xs font-bold text-red-700 dark:text-red-400 hover:text-red-800 hover:underline px-2 py-1 cursor-pointer flex items-center gap-1 transition-colors"
                title={lang === 'ne' ? 'आजको मुख्य भनाइमा फर्कनुहोस्' : 'Return to today’s pick'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'ne' ? 'आजको विचार' : 'Today'}</span>
              </button>
            )}

            <button
              type="button"
              id="fetch-daily-motivation-btn"
              onClick={() => handleFetchNewQuote()}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-stone-200/60 dark:border-stone-700 active:scale-95 disabled:opacity-50"
              title={lang === 'ne' ? 'नयाँ प्रेरणादायी भनाइ प्राप्त गर्नुहोस्' : 'Fetch a new inspirational quote'}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{lang === 'ne' ? 'नयाँ भनाइ' : 'Fetch Next'}</span>
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
              title={isExpanded ? (lang === 'ne' ? 'संक्षिप्त बनाउनुहोस्' : 'Minimize') : (lang === 'ne' ? 'विस्तृत हेर्नुहोस्' : 'Expand')}
              aria-label={isExpanded ? 'Collapse daily motivation' : 'Expand daily motivation'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Compact View when Collapsed */}
        {!isExpanded ? (
          <div className="flex items-center justify-between gap-3 bg-stone-50/80 dark:bg-stone-800/40 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-800">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-sm font-bold font-serif text-stone-900 dark:text-stone-100 truncate">
                “{currentQuote.quoteNe}”
              </p>
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5 truncate">
                — {lang === 'ne' ? currentQuote.authorNe : currentQuote.authorEn} · {lang === 'ne' ? currentQuote.categoryNe : currentQuote.categoryEn}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyQuote}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 cursor-pointer"
                title={lang === 'ne' ? 'कपी गर्नुहोस्' : 'Copy'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline px-2 py-1 cursor-pointer"
              >
                {lang === 'ne' ? 'विस्तृत' : 'Expand'}
              </button>
            </div>
          </div>
        ) : (
          /* Full Expanded View */
          <>
            {/* Category navigation: Minimal zero-pill category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar border-b border-stone-100 dark:border-stone-800/60">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = cat.id === 'all' 
                  ? MOTIVATION_QUOTES.length 
                  : MOTIVATION_QUOTES.filter(q => q.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`motivation-tab-${cat.id}`}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{lang === 'ne' ? cat.nameNe : cat.nameEn}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'opacity-80' : 'text-stone-400 dark:text-stone-500'}`}>
                      {lang === 'ne' ? toNepaliDigits(count) : count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quote Spotlight Box */}
            <div className="relative bg-gradient-to-br from-amber-50/50 via-stone-50 to-stone-50/80 dark:from-stone-800/40 dark:via-stone-850 dark:to-stone-900/60 p-5 sm:p-7 rounded-2xl border border-stone-200/80 dark:border-stone-800 transition-all">
              {/* Subtle watermark quote icon */}
              <div className="absolute top-3 right-4 text-stone-200 dark:text-stone-800 pointer-events-none select-none">
                <Quote className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.2]" />
              </div>

              <div className="relative z-10 space-y-4">
                {/* Top metadata strip (Zero-pill discipline: unboxed text with interpuncts) */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {lang === 'ne' ? currentQuote.categoryNe : currentQuote.categoryEn}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[11px]">
                      {lang === 'ne' 
                        ? `${toNepaliDigits(activeIndexInPool + 1)} / ${toNepaliDigits(activePool.length)}` 
                        : `${activeIndexInPool + 1} of ${activePool.length}`}
                    </span>
                  </div>

                  {/* Prev / Next pool browsing & Directory toggle */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevQuote}
                      disabled={activePool.length <= 1}
                      className="p-1 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title={lang === 'ne' ? 'अघिल्लो भनाइ' : 'Previous quote'}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextQuote}
                      disabled={activePool.length <= 1}
                      className="p-1 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title={lang === 'ne' ? 'पछिल्लो भनाइ' : 'Next quote'}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDirectory(prev => !prev)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ml-1 ${
                        showDirectory
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                          : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                      }`}
                      title={lang === 'ne' ? 'यस विधाका सबै विचार हेर्नुहोस्' : 'Browse quote directory'}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleFavorite}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isFavorite 
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' 
                          : 'text-stone-400 hover:text-rose-600 hover:bg-stone-200/50 dark:hover:bg-stone-700'
                      }`}
                      title={isFavorite 
                        ? (lang === 'ne' ? 'मनपर्नेबाट हटाउनुहोस्' : 'Saved to favorites') 
                        : (lang === 'ne' ? 'मनपर्नेमा राख्नुहोस्' : 'Save as favorite')}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Primary Quote Typography */}
                <blockquote className="space-y-2">
                  <p className="text-lg sm:text-xl md:text-2xl font-black font-serif text-stone-900 dark:text-stone-50 leading-relaxed tracking-wide">
                    “{currentQuote.quoteNe}”
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans italic leading-relaxed pt-1.5 border-t border-stone-200/60 dark:border-stone-800">
                    “{currentQuote.quoteEn}”
                  </p>
                </blockquote>

                {/* Author Attribution & Practical Meaning Toggle */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-0.5 bg-amber-500"></span>
                    <span>— {lang === 'ne' ? currentQuote.authorNe : currentQuote.authorEn}</span>
                  </div>

                  {(currentQuote.contextNe || currentQuote.contextEn) && (
                    <button
                      type="button"
                      onClick={() => setShowMeaning(prev => !prev)}
                      className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>
                        {showMeaning 
                          ? (lang === 'ne' ? 'भाव लुकाउनुहोस्' : 'Hide Meaning')
                          : (lang === 'ne' ? 'जीवनोपयोगी सन्देश हेर्नुहोस्' : 'View Life Meaning')}
                      </span>
                    </button>
                  )}
                </div>

                {/* Expandable Practical Life Meaning */}
                {showMeaning && (currentQuote.contextNe || currentQuote.contextEn) && (
                  <div className="p-3.5 bg-amber-500/10 dark:bg-amber-500/5 border-l-2 border-amber-500 rounded-r-xl text-xs text-stone-800 dark:text-stone-200 leading-relaxed animate-in fade-in duration-200">
                    <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{lang === 'ne' ? 'चिन्तन र जीवनोपयोगी सन्देश' : 'Practical Life Reflection'}:</span>
                    </div>
                    <p>{lang === 'ne' ? currentQuote.contextNe : currentQuote.contextEn}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Directory List of Quotes (Collapsible) */}
            {showDirectory && (
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-4 bg-stone-50 dark:bg-stone-850 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 pb-1 border-b border-stone-200 dark:border-stone-700/60">
                  <span>
                    {lang === 'ne' 
                      ? `यस विधाका सबै भनाइहरू (${toNepaliDigits(activePool.length)}):` 
                      : `Quotes in this Category (${activePool.length}):`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDirectory(false)}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-[11px] cursor-pointer"
                  >
                    {lang === 'ne' ? 'बन्द' : 'Close'}
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {activePool.map((q, idx) => {
                    const isSelected = q.id === currentQuote.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setCurrentQuote(q);
                          setShowDirectory(false);
                          setShowMeaning(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400 dark:border-amber-600 text-stone-900 dark:text-stone-100 font-semibold'
                            : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="font-mono text-[10px] text-stone-400 shrink-0 mt-0.5">
                          {lang === 'ne' ? `${toNepaliDigits(idx + 1)}.` : `${idx + 1}.`}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-2 leading-relaxed text-xs">
                            {lang === 'ne' ? q.quoteNe : q.quoteEn}
                          </p>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block mt-0.5">
                            — {lang === 'ne' ? q.authorNe : q.authorEn}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Toolbar: Speech, Copy, Share */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
              {/* Audio reader */}
              {'speechSynthesis' in window && (
                <button
                  type="button"
                  id="quote-audio-listen-btn"
                  onClick={handleToggleAudio}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                  title={isPlayingAudio ? 'वाचन रोक्नुहोस्' : 'भनाइ सुन्नुहोस्'}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>{lang === 'ne' ? 'रोक्नुहोस्' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{lang === 'ne' ? 'सुन्नुहोस्' : 'Listen'}</span>
                    </>
                  )}
                </button>
              )}

              {/* Copy and Share actions */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  id="copy-daily-motivation-btn"
                  onClick={handleCopyQuote}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title={lang === 'ne' ? 'भनाइ कपी गर्नुहोस्' : 'Copy quote text'}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{lang === 'ne' ? 'कपी भयो!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'ne' ? 'कपी' : 'Copy'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="share-daily-motivation-btn"
                  onClick={handleShare}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                  title={lang === 'ne' ? 'साथीहरूसँग सेयर गर्नुहोस्' : 'Share with friends'}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'सेयर' : 'Share'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DailyMotivation;
