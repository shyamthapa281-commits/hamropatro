import React, { useState, useEffect, useMemo } from 'react';
import { 
  Leaf, 
  Sparkles, 
  Clock, 
  Check, 
  Copy, 
  Share2, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  Compass, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  HeartPulse,
  Flame,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { Language, NepaliDate } from '../types';
import { 
  SEASONAL_WELLNESS_TIPS, 
  SeasonalWellnessTip, 
  getDailyWellnessTip, 
  getSeasonIdForMonth 
} from '../data/dailyWellnessTipsData';
import { NEPALI_SEASONS_WELLNESS } from '../data/healthWellnessData';
import { toNepaliDigits, getCurrentNepaliDate } from '../utils/nepaliCalendar';

export interface DailyWellnessTipProps {
  lang: Language;
  todayBs?: NepaliDate;
  className?: string;
  defaultExpanded?: boolean;
}

export const DailyWellnessTip: React.FC<DailyWellnessTipProps> = ({
  lang,
  todayBs,
  className = '',
  defaultExpanded = true,
}) => {
  const activeDate = useMemo(() => todayBs || getCurrentNepaliDate(), [todayBs]);
  
  // Deterministic daily pick for current season
  const dailyMeta = useMemo(() => getDailyWellnessTip(activeDate), [activeDate]);

  // Active season selection (defaults to current season)
  const [activeSeasonId, setActiveSeasonId] = useState<string>(dailyMeta.seasonId);
  const [currentTip, setCurrentTip] = useState<SeasonalWellnessTip>(dailyMeta.tip);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showSeasonSelector, setShowSeasonSelector] = useState<boolean>(false);

  // Metadata for the active season from healthWellnessData
  const activeSeasonData = useMemo(() => {
    return NEPALI_SEASONS_WELLNESS.find(s => s.id === activeSeasonId) || NEPALI_SEASONS_WELLNESS[0];
  }, [activeSeasonId]);

  // Pool of tips for the active season and filtered type
  const activePool = useMemo(() => {
    let pool = SEASONAL_WELLNESS_TIPS.filter(t => t.seasonId === activeSeasonId);
    if (selectedType !== 'all') {
      pool = pool.filter(t => t.type === selectedType);
    }
    return pool.length > 0 ? pool : SEASONAL_WELLNESS_TIPS.filter(t => t.seasonId === activeSeasonId);
  }, [activeSeasonId, selectedType]);

  // Current index within active pool
  const activeIndexInPool = useMemo(() => {
    const idx = activePool.findIndex(t => t.id === currentTip.id);
    return idx >= 0 ? idx : 0;
  }, [activePool, currentTip.id]);

  const isTodayPick = currentTip.id === dailyMeta.tip.id && activeSeasonId === dailyMeta.seasonId;

  // Next tip in season pool
  const handleNextTip = () => {
    if (activePool.length <= 1) return;
    const nextIdx = (activeIndexInPool + 1) % activePool.length;
    setCurrentTip(activePool[nextIdx]);
    stopAudio();
  };

  // Previous tip in season pool
  const handlePrevTip = () => {
    if (activePool.length <= 1) return;
    const prevIdx = (activeIndexInPool - 1 + activePool.length) % activePool.length;
    setCurrentTip(activePool[prevIdx]);
    stopAudio();
  };

  // Reset to today's seasonal pick
  const handleResetToToday = () => {
    setActiveSeasonId(dailyMeta.seasonId);
    setSelectedType('all');
    setCurrentTip(dailyMeta.tip);
    stopAudio();
  };

  // Switch season
  const handleSelectSeason = (seasonId: string) => {
    setActiveSeasonId(seasonId);
    const pool = SEASONAL_WELLNESS_TIPS.filter(t => t.seasonId === seasonId);
    if (pool.length > 0) {
      setCurrentTip(pool[0]);
    }
    stopAudio();
  };

  // Switch type filter (All, Ayurveda, Yoga, Herbal)
  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    let pool = SEASONAL_WELLNESS_TIPS.filter(t => t.seasonId === activeSeasonId);
    if (typeId !== 'all') {
      pool = pool.filter(t => t.type === typeId);
    }
    if (pool.length > 0) {
      setCurrentTip(pool[0]);
    }
    stopAudio();
  };

  // Stop audio helper
  const stopAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis && isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Copy tip to clipboard
  const handleCopyTip = async () => {
    const title = lang === 'ne' ? currentTip.titleNe : currentTip.titleEn;
    const summary = lang === 'ne' ? currentTip.shortSummaryNe : currentTip.shortSummaryEn;
    const season = lang === 'ne' ? currentTip.seasonNameNe : currentTip.seasonNameEn;
    const dosha = lang === 'ne' ? currentTip.doshaFocusNe : currentTip.doshaFocusEn;
    const timing = lang === 'ne' ? currentTip.practiceTimingNe : currentTip.practiceTimingEn;
    
    const steps = (lang === 'ne' ? currentTip.stepsNe : currentTip.stepsEn).join('\n');
    const benefits = (lang === 'ne' ? currentTip.benefitsNe : currentTip.benefitsEn).map(b => `• ${b}`).join('\n');

    const textToCopy = `🌿 ${title} (${season} • ${dosha})
⏱️ समय: ${timing}

📖 विवरण:
${summary}

📋 विधि:
${steps}

✨ लाभहरू:
${benefits}

(शुभ पात्रो • Shubha Patro • shubhapatro.com/dharma)`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error(err);
    }
  };

  // Share tip via Web Share API
  const handleShareTip = async () => {
    const title = lang === 'ne' ? currentTip.titleNe : currentTip.titleEn;
    const summary = lang === 'ne' ? currentTip.shortSummaryNe : currentTip.shortSummaryEn;
    const season = lang === 'ne' ? currentTip.seasonNameNe : currentTip.seasonNameEn;

    const shareData = {
      title: `${title} - ${season} दैनिक स्वास्थ्य सूत्र`,
      text: `${title} (${season}): ${summary}`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://shubhapatro.com',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopyTip();
      }
    } else {
      handleCopyTip();
    }
  };

  // Text-to-speech audio reader
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    const title = lang === 'ne' ? currentTip.titleNe : currentTip.titleEn;
    const summary = lang === 'ne' ? currentTip.shortSummaryNe : currentTip.shortSummaryEn;
    const steps = (lang === 'ne' ? currentTip.stepsNe : currentTip.stepsEn).join('. ');
    const textToSpeak = `${title}. ${summary}. विधि: ${steps}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();

    if (lang === 'ne') {
      const nepaliVoice = voices.find(v => v.lang.startsWith('ne') || v.lang.startsWith('hi'));
      if (nepaliVoice) utterance.voice = nepaliVoice;
      utterance.lang = nepaliVoice ? nepaliVoice.lang : 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.88;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filter types available
  const TYPE_FILTERS = [
    { id: 'all', labelNe: 'सबै सूत्र', labelEn: 'All Tips' },
    { id: 'ayurveda', labelNe: 'आयुर्वेदिक दिनचर्या', labelEn: 'Ayurveda' },
    { id: 'yoga', labelNe: 'ऋतु अनुकूल योगासन', labelEn: 'Yoga Poses' },
    { id: 'herbal', labelNe: 'काढा र जडीबुटी', labelEn: 'Herbal Elixirs' },
    { id: 'pranayama', labelNe: 'प्राणायाम', labelEn: 'Pranayama' },
  ];

  const dateSubtext = lang === 'ne'
    ? `${toNepaliDigits(activeDate.year)} ${activeDate.monthNameNe} ${toNepaliDigits(activeDate.day)}`
    : `${activeDate.monthNameEn} ${activeDate.day}, ${activeDate.year} BS`;

  return (
    <section 
      id="daily-wellness-tip-section"
      aria-label="Daily Seasonal Wellness Tip"
      className={`bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden transition-all duration-200 relative group ${className}`}
    >
      {/* Decorative top organic botanical accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 w-full" />

      <div className="p-4 sm:p-5 lg:p-6 space-y-4">
        {/* Header: Zero-pill typographic layout */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-stone-900 dark:text-stone-50">
                  {lang === 'ne' ? 'दैनिक ऋतु आरोग्य सूत्र' : 'Daily Seasonal Wellness Tip'}
                </h3>
                {/* Zero-pill: clean text with interpuncts */}
                <span className="text-xs text-stone-400 dark:text-stone-500">·</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {lang === 'ne' ? activeSeasonData.nameNe : activeSeasonData.nameEn}
                </span>
                <span className="text-xs text-stone-400 dark:text-stone-500">·</span>
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                  {lang === 'ne' ? currentTip.doshaFocusNe : currentTip.doshaFocusEn}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {dateSubtext} · {lang === 'ne' ? 'प्राचीन ऋतुचर्या अनुसार दैनिक आयुर्वेदिक अभ्यास तथा योगासन' : 'Ayurvedic Ritucharya practices & yoga poses tuned to the active Nepali season'}
              </p>
            </div>
          </div>

          {/* Quick controls: Reset to today, Season preview toggle, Collapse/Expand */}
          <div className="flex items-center gap-1.5 ml-auto">
            {!isTodayPick && (
              <button
                type="button"
                onClick={handleResetToToday}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline px-2 py-1 cursor-pointer flex items-center gap-1 transition-colors"
                title={lang === 'ne' ? 'आजको ऋतु आरोग्य सूत्रमा फर्कनुहोस्' : 'Return to today’s pick'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'ne' ? 'आजको सूत्र' : 'Today'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowSeasonSelector(prev => !prev)}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-stone-200/60 dark:border-stone-700"
              title={lang === 'ne' ? 'अन्य ऋतुका सूत्र हेर्नुहोस्' : 'Explore other seasons'}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'ne' ? 'ऋतु छनोट' : 'Seasons'}</span>
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
              title={isExpanded ? (lang === 'ne' ? 'संक्षिप्त' : 'Minimize') : (lang === 'ne' ? 'विस्तृत' : 'Expand')}
              aria-label={isExpanded ? 'Collapse wellness tip' : 'Expand wellness tip'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Optional: Season Selector Bar */}
        {showSeasonSelector && (
          <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>{lang === 'ne' ? 'नेपालका ६ ऋतुहरू (Six Traditional Nepali Seasons):' : 'Select Season to preview practices:'}</span>
              <button 
                type="button" 
                onClick={() => setShowSeasonSelector(false)}
                className="text-stone-400 hover:text-stone-700 text-[11px] cursor-pointer"
              >
                {lang === 'ne' ? 'बन्द' : 'Close'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
              {NEPALI_SEASONS_WELLNESS.map((s) => {
                const isSelected = activeSeasonId === s.id;
                const isCurrentCalendarSeason = s.id === dailyMeta.seasonId;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      handleSelectSeason(s.id);
                      setShowSeasonSelector(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">{lang === 'ne' ? s.nameNe : s.nameEn.split(' ')[0]}</span>
                      {isCurrentCalendarSeason && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="हालको ऋतु (Active season)" />
                      )}
                    </div>
                    <span className={`text-[10px] block truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-stone-500 dark:text-stone-400'}`}>
                      {lang === 'ne' ? s.monthsNe.split(' ')[0] : s.monthsEn.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Compact View when Collapsed */}
        {!isExpanded ? (
          <div className="flex items-center justify-between gap-3 bg-stone-50/80 dark:bg-stone-800/40 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-800">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 truncate">
                  {lang === 'ne' ? currentTip.titleNe : currentTip.titleEn}
                </span>
                <span className="text-[11px] text-stone-400">·</span>
                <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium truncate">
                  {lang === 'ne' ? currentTip.typeNe : currentTip.typeEn}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 truncate mt-0.5">
                {lang === 'ne' ? currentTip.shortSummaryNe : currentTip.shortSummaryEn}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyTip}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 cursor-pointer"
                title={lang === 'ne' ? 'कपी' : 'Copy'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-2 py-1 cursor-pointer"
              >
                {lang === 'ne' ? 'विस्तृत' : 'Expand'}
              </button>
            </div>
          </div>
        ) : (
          /* Full Expanded View */
          <>
            {/* Category / Type Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar border-b border-stone-100 dark:border-stone-800/60">
              {TYPE_FILTERS.map((f) => {
                const isSelected = selectedType === f.id;
                const count = f.id === 'all'
                  ? SEASONAL_WELLNESS_TIPS.filter(t => t.seasonId === activeSeasonId).length
                  : SEASONAL_WELLNESS_TIPS.filter(t => t.seasonId === activeSeasonId && t.type === f.id).length;

                if (count === 0 && f.id !== 'all') return null;

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectType(f.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white dark:bg-emerald-700 shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{lang === 'ne' ? f.labelNe : f.labelEn}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'opacity-80' : 'text-stone-400 dark:text-stone-500'}`}>
                      {lang === 'ne' ? toNepaliDigits(count) : count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Spotlight Tip Card */}
            <div className="bg-gradient-to-br from-emerald-50/40 via-stone-50 to-stone-50/90 dark:from-stone-800/50 dark:via-stone-850 dark:to-stone-900/60 p-5 sm:p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-4 transition-all">
              {/* Header inside card: Type badge & Prev/Next pool controls */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    {lang === 'ne' ? currentTip.typeNe : currentTip.typeEn}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500 dark:text-stone-400 font-medium">
                    {lang === 'ne' ? currentTip.seasonNameNe : currentTip.seasonNameEn} ({lang === 'ne' ? activeSeasonData.monthsNe : activeSeasonData.monthsEn})
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="font-mono text-[11px] text-stone-500">
                    {lang === 'ne' 
                      ? `${toNepaliDigits(activeIndexInPool + 1)} / ${toNepaliDigits(activePool.length)}`
                      : `${activeIndexInPool + 1} of ${activePool.length}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrevTip}
                    disabled={activePool.length <= 1}
                    className="p-1 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title={lang === 'ne' ? 'अघिल्लो सूत्र' : 'Previous tip'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTip}
                    disabled={activePool.length <= 1}
                    className="p-1 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title={lang === 'ne' ? 'पछिल्लो सूत्र' : 'Next tip'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Timing */}
              <div>
                <h4 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                  {lang === 'ne' ? currentTip.titleNe : currentTip.titleEn}
                </h4>
                {currentTip.sanskritName && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-serif italic mt-0.5">
                    {currentTip.sanskritName}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 font-medium mt-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'ne' ? `उपयुक्त समय: ${currentTip.practiceTimingNe}` : `Suggested timing: ${currentTip.practiceTimingEn}`}
                  </span>
                  {currentTip.durationMinutes && (
                    <>
                      <span>·</span>
                      <span>
                        {lang === 'ne' ? `${toNepaliDigits(currentTip.durationMinutes)} मिनेट` : `${currentTip.durationMinutes} mins`}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                {lang === 'ne' ? currentTip.shortSummaryNe : currentTip.shortSummaryEn}
              </p>

              {/* Steps and Method */}
              <div className="bg-white/80 dark:bg-stone-900/80 p-3.5 sm:p-4 rounded-xl border border-stone-200/70 dark:border-stone-800 space-y-2">
                <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider block">
                  {lang === 'ne' ? 'अभ्यास वा प्रयोग विधि (Step-by-Step Method):' : 'Application Method:'}
                </span>
                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {(lang === 'ne' ? currentTip.stepsNe : currentTip.stepsEn).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  {lang === 'ne' ? 'ऋतु अनुसारका मुख्य लाभहरू (Seasonal Benefits):' : 'Key Health Benefits:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(lang === 'ne' ? currentTip.benefitsNe : currentTip.benefitsEn).map((benefit, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-stone-800 dark:text-stone-200 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cautions (if any) */}
              {(currentTip.cautionsNe || currentTip.cautionsEn) && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="font-bold">{lang === 'ne' ? 'सावधानी: ' : 'Caution: '}</strong>
                    <span>{(lang === 'ne' ? currentTip.cautionsNe : currentTip.cautionsEn)?.join(' ')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
              {/* Audio Listen */}
              {'speechSynthesis' in window && (
                <button
                  type="button"
                  id="wellness-audio-btn"
                  onClick={handleToggleAudio}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-emerald-600 text-white font-black'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                  title={isPlayingAudio ? 'रोक्नुहोस्' : 'सुन्नुहोस्'}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>{lang === 'ne' ? 'रोक्नुहोस्' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{lang === 'ne' ? 'सुन्नुहोस्' : 'Listen'}</span>
                    </>
                  )}
                </button>
              )}

              {/* Next tip & Copy & Share */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  id="next-wellness-tip-btn"
                  onClick={handleNextTip}
                  disabled={activePool.length <= 1}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-stone-200/60 dark:border-stone-700 active:scale-95 disabled:opacity-40"
                  title={lang === 'ne' ? 'अर्को सूत्र हेर्नुहोस्' : 'Next tip in this season'}
                >
                  <span>{lang === 'ne' ? 'अर्को सूत्र' : 'Next Tip'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>

                <button
                  type="button"
                  id="copy-wellness-tip-btn"
                  onClick={handleCopyTip}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title={lang === 'ne' ? 'सूत्र कपी गर्नुहोस्' : 'Copy wellness tip'}
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
                  id="share-wellness-tip-btn"
                  onClick={handleShareTip}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
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

export default DailyWellnessTip;
