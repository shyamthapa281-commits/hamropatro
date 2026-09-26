import React, { useState, useEffect, useMemo } from 'react';
import { 
  Quote, 
  Sparkles, 
  Shuffle, 
  Copy, 
  Check, 
  Share2, 
  Heart, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Info, 
  Filter
} from 'lucide-react';
import { MotivationQuote, Language, NepaliDate } from '../types';
import { MOTIVATION_QUOTES } from '../data/motivationQuotes';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface DailyMotivationCardProps {
  lang: Language;
  todayBs: NepaliDate;
  className?: string;
}

export const DailyMotivationCard: React.FC<DailyMotivationCardProps> = ({
  lang,
  todayBs,
  className = '',
}) => {
  // Compute deterministic "Daily Quote" index based on current date
  const dailyQuoteIndex = useMemo(() => {
    const seed = (todayBs.year * 372) + (todayBs.month * 31) + todayBs.day;
    return Math.abs(seed) % MOTIVATION_QUOTES.length;
  }, [todayBs.year, todayBs.month, todayBs.day]);

  const [currentIndex, setCurrentIndex] = useState<number>(dailyQuoteIndex);
  const [copied, setCopied] = useState<boolean>(false);
  const [showContext, setShowContext] = useState<boolean>(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Favorites persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hamro_patro_quote_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeQuote: MotivationQuote = MOTIVATION_QUOTES[currentIndex] || MOTIVATION_QUOTES[0];
  const isFavorite = favorites.includes(activeQuote.id);
  const isDailyDefault = currentIndex === dailyQuoteIndex;

  // Filtered pool for randomizer
  const filteredQuotes = useMemo(() => {
    if (selectedCategory === 'all') return MOTIVATION_QUOTES;
    return MOTIVATION_QUOTES.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  // Handle Random Quote selection
  const handleRandomize = () => {
    const pool = filteredQuotes.length > 0 ? filteredQuotes : MOTIVATION_QUOTES;
    if (pool.length <= 1) {
      setCurrentIndex(MOTIVATION_QUOTES.findIndex(q => q.id === pool[0].id));
      return;
    }
    let nextIdx = currentIndex;
    const currentId = activeQuote.id;
    const remaining = pool.filter(q => q.id !== currentId);
    const chosen = remaining[Math.floor(Math.random() * remaining.length)];
    const fullIndex = MOTIVATION_QUOTES.findIndex(q => q.id === chosen.id);
    
    // Stop speech if playing
    if (window.speechSynthesis && isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    }
    
    setCurrentIndex(fullIndex >= 0 ? fullIndex : 0);
  };

  // Reset to today's official quote
  const handleResetToToday = () => {
    setCurrentIndex(dailyQuoteIndex);
    setSelectedCategory('all');
  };

  // Toggle Favorite
  const handleToggleFavorite = () => {
    let updated: string[];
    if (isFavorite) {
      updated = favorites.filter(id => id !== activeQuote.id);
    } else {
      updated = [...favorites, activeQuote.id];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('hamro_patro_quote_favorites', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Copy to Clipboard
  const handleCopyQuote = async () => {
    const textToCopy = `"${lang === 'ne' ? activeQuote.quoteNe : activeQuote.quoteEn}"\n— ${lang === 'ne' ? activeQuote.authorNe : activeQuote.authorEn}\n(Nepali Calendar)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error(err);
    }
  };

  // Share using Web Share API
  const handleShare = async () => {
    const shareText = `"${lang === 'ne' ? activeQuote.quoteNe : activeQuote.quoteEn}" — ${lang === 'ne' ? activeQuote.authorNe : activeQuote.authorEn}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: lang === 'ne' ? 'Nepali Calendar - दैनिक प्रेरणा' : 'Nepali Calendar - Daily Motivation',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Fallback to copy
        handleCopyQuote();
      }
    } else {
      handleCopyQuote();
    }
  };

  // Speech Synthesis for pronouncing quote
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      return;
    }

    const textToSpeak = lang === 'ne' ? activeQuote.quoteNe : activeQuote.quoteEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Attempt to pick an appropriate language voice
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'ne') {
      const neVoice = voices.find(v => v.lang.startsWith('ne') || v.lang.startsWith('hi'));
      if (neVoice) utterance.voice = neVoice;
      utterance.lang = neVoice ? neVoice.lang : 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }
    
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingSpeech(false);
    utterance.onerror = () => setIsPlayingSpeech(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingSpeech(true);
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div 
      id="daily-motivation-card"
      className={`bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-all duration-200 relative group ${className}`}
    >
      {/* Decorative Top Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-red-600 to-amber-500 w-full" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Card Header: Title & Badges */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-stone-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
                  <span>{lang === 'ne' ? 'दैनिक प्रेरणा' : 'Daily Motivation'}</span>
                </h3>
                {isDailyDefault ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                    {lang === 'ne' ? 'आजको विचार' : 'Today’s Pick'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {lang === 'ne' ? 'अनियमित विचार' : 'Randomized'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {lang === 'ne' ? 'नेपाली उखान टुक्का तथा प्रेरक वाणीहरू' : 'Nepali proverbs & timeless inspirational wisdom'}
              </p>
            </div>
          </div>

          {/* Quick Action: Shuffle Quote */}
          <div className="flex items-center gap-1.5">
            {!isDailyDefault && (
              <button
                id="reset-quote-today-btn"
                onClick={handleResetToToday}
                className="text-[11px] text-red-600 dark:text-red-400 hover:underline px-2 py-1 font-bold cursor-pointer transition-colors"
                title={lang === 'ne' ? 'आजको विचारमा फर्कनुहोस्' : 'Reset to Today’s Quote'}
              >
                {lang === 'ne' ? 'आजको' : 'Today’s'}
              </button>
            )}
            <button
              id="shuffle-daily-quote-btn"
              type="button"
              onClick={handleRandomize}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-stone-700 dark:text-stone-200 hover:text-red-700 dark:hover:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-stone-200/80 dark:border-stone-700/80 active:scale-95"
              title={lang === 'ne' ? 'अर्को प्रेरणादायी भनाइ हेर्नुहोस्' : 'Shuffle for next quote'}
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'ne' ? 'अर्को विचार' : 'Shuffle'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters (Pill selector) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {lang === 'ne' ? 'सबै' : 'All'}
          </button>
          <button
            onClick={() => setSelectedCategory('proverb')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'proverb'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {lang === 'ne' ? 'उखान टुक्का' : 'Proverbs'}
          </button>
          <button
            onClick={() => setSelectedCategory('literary')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'literary'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {lang === 'ne' ? 'साहित्यिक' : 'Literary'}
          </button>
          <button
            onClick={() => setSelectedCategory('buddha')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'buddha'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {lang === 'ne' ? 'बुद्ध वाणी' : 'Buddha'}
          </button>
          <button
            onClick={() => setSelectedCategory('perseverance')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'perseverance'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {lang === 'ne' ? 'कर्म र सङ्घर्ष' : 'Resilience'}
          </button>
        </div>

        {/* The Quote Body */}
        <div className="relative bg-stone-50/80 dark:bg-stone-800/50 p-4 sm:p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
          {/* Subtle Watermark Quote Icon */}
          <div className="absolute top-2 right-3 text-red-900/10 dark:text-white/5 pointer-events-none select-none">
            <Quote className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>

          <div className="relative z-10 space-y-3">
            {/* Category Tag & Favorite Indicator */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                <BookOpen className="w-3 h-3" />
                <span>{lang === 'ne' ? activeQuote.categoryNe : activeQuote.categoryEn}</span>
              </span>

              <button
                id="toggle-quote-fav-btn"
                type="button"
                onClick={handleToggleFavorite}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isFavorite 
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' 
                    : 'text-stone-400 hover:text-rose-500 hover:bg-stone-200/50 dark:hover:bg-stone-700'
                }`}
                title={isFavorite ? (lang === 'ne' ? 'मनपर्नेबाट हटाउनुहोस्' : 'Remove from Favorites') : (lang === 'ne' ? 'मनपर्नेमा राख्नुहोस्' : 'Save as Favorite')}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            {/* Primary Quote Text (Nepali) */}
            <p className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50 font-serif leading-relaxed tracking-wide">
              “{activeQuote.quoteNe}”
            </p>

            {/* Secondary English Translation */}
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans italic leading-relaxed pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
              “{activeQuote.quoteEn}”
            </p>

            {/* Author Attribution */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>— {lang === 'ne' ? activeQuote.authorNe : activeQuote.authorEn}</span>
              </div>

              {/* Context / Lesson Toggle */}
              {(activeQuote.contextNe || activeQuote.contextEn) && (
                <button
                  type="button"
                  onClick={() => setShowContext(prev => !prev)}
                  className="text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  <Info className="w-3 h-3 text-stone-400" />
                  <span>{showContext ? (lang === 'ne' ? 'भाव लुकाउनुहोस्' : 'Hide Meaning') : (lang === 'ne' ? 'यसको भाव/अर्थ' : 'View Meaning')}</span>
                </button>
              )}
            </div>

            {/* Expanded Meaning / Life Context */}
            {showContext && (activeQuote.contextNe || activeQuote.contextEn) && (
              <div className="mt-2 p-2.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl text-xs text-amber-950 dark:text-amber-200 animate-in fade-in duration-150">
                <strong className="block font-bold text-amber-900 dark:text-amber-300 mb-0.5">
                  {lang === 'ne' ? '💡 प्रेरणादायी अर्थ र सन्देश:' : '💡 Practical Life Insight:'}
                </strong>
                <span>{lang === 'ne' ? activeQuote.contextNe : activeQuote.contextEn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Audio / Copy / Share Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Audio Pronunciation Button */}
          {'speechSynthesis' in window && (
            <button
              id="quote-speech-btn"
              type="button"
              onClick={handleToggleSpeech}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingSpeech
                  ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
              title={isPlayingSpeech ? 'रोक्नुहोस् (Stop)' : 'सुन्नुहोस् (Listen)'}
            >
              {isPlayingSpeech ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'रोक्नुहोस्' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>{lang === 'ne' ? 'सुन्नुहोस्' : 'Listen'}</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Copy Button */}
            <button
              id="copy-quote-btn"
              type="button"
              onClick={handleCopyQuote}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title={lang === 'ne' ? 'विचार कपी गर्नुहोस्' : 'Copy quote'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{lang === 'ne' ? 'कपी भयो!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'कपी' : 'Copy'}</span>
                </>
              )}
            </button>

            {/* Share Button */}
            <button
              id="share-quote-btn"
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              title={lang === 'ne' ? 'साथीहरूसँग सेयर गर्नुहोस्' : 'Share with friends'}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'सेयर' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
