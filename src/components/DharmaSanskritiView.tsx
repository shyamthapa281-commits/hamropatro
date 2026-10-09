import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Flame, 
  Moon, 
  Sun, 
  Shield, 
  Leaf, 
  HeartHandshake, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RotateCcw, 
  Volume2,
  VolumeX,
  Bell,
  Share2,
  Calendar,
  Compass,
  ArrowRight,
  Clock,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { 
  DREAM_INTERPRETATIONS, 
  VEDIC_RITUALS_DATA, 
  SACRED_MANTRAS_DATA,
  SWAPNA_TIMING_GUIDES,
  BAD_DREAM_REMEDIES,
  DreamItem,
  VedicRitual,
  SacredMantra
} from '../data/dharmaCultureData';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { soundSynthesizer } from '../utils/audioSynthesizer';

interface DharmaSanskritiViewProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
  initialSubTab?: 'dreams' | 'rituals' | 'mantras' | 'fasting';
}

export const DharmaSanskritiView: React.FC<DharmaSanskritiViewProps> = ({ 
  lang, 
  onNavigate,
  initialSubTab = 'dreams'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dreams' | 'rituals' | 'mantras' | 'fasting'>(initialSubTab);

  // --- DREAM SEARCH STATE ---
  const [dreamQuery, setDreamQuery] = useState<string>('');
  const [dreamCategory, setDreamCategory] = useState<'all' | 'auspicious' | 'cautionary' | 'neutral'>('all');
  const [selectedDream, setSelectedDream] = useState<DreamItem | null>(DREAM_INTERPRETATIONS[0]);
  const [copiedDreamId, setCopiedDreamId] = useState<string | null>(null);

  // --- JAPA & SOUND STATE ---
  const [selectedMantra, setSelectedMantra] = useState<SacredMantra>(SACRED_MANTRAS_DATA[0]);
  const [japaCount, setJapaCount] = useState<number>(0);
  const [japaRounds, setJapaRounds] = useState<number>(0);
  const [copiedMantraId, setCopiedMantraId] = useState<string | null>(null);
  const [isContinuousDrone, setIsContinuousDrone] = useState<boolean>(false);
  const [isPlayingMantraRecitation, setIsPlayingMantraRecitation] = useState<boolean>(false);

  // Filtered Dreams
  const filteredDreams = useMemo(() => {
    return DREAM_INTERPRETATIONS.filter((item) => {
      const matchesCategory = dreamCategory === 'all' || item.category === dreamCategory;
      if (!matchesCategory) return false;

      if (!dreamQuery.trim()) return true;
      const q = dreamQuery.toLowerCase().trim();
      const matchKeywordNe = item.keywordNe.toLowerCase().includes(q);
      const matchKeywordEn = item.keywordEn.toLowerCase().includes(q);
      const matchMeaningNe = item.shortMeaningNe.toLowerCase().includes(q);
      const matchMeaningEn = item.shortMeaningEn.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));

      return matchKeywordNe || matchKeywordEn || matchMeaningNe || matchMeaningEn || matchTags;
    });
  }, [dreamQuery, dreamCategory]);

  // Handle Japa Click
  const handleJapaStep = () => {
    // Unique sound: If Maha Mrityunjaya Mantra, play rich Tibetan singing bowl strike!
    if (selectedMantra.id === 'mahamrityunjaya') {
      soundSynthesizer.playSingingBowl(216, 4.0);
    } else {
      soundSynthesizer.playTempleBell(528);
    }

    const nextCount = japaCount + 1;
    if (nextCount >= selectedMantra.suggestedChants) {
      setJapaCount(0);
      setJapaRounds((prev) => prev + 1);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981'],
      });
    } else {
      setJapaCount(nextCount);
    }
  };

  const handlePlaySingingBowl = () => {
    soundSynthesizer.playSingingBowl(216, 5.0);
  };

  const handleToggleDrone = () => {
    const isPlaying = soundSynthesizer.toggleContinuousSingingBowl(setIsContinuousDrone);
    setIsContinuousDrone(isPlaying);
  };

  const handleReciteMantra = (m: SacredMantra) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingMantraRecitation) {
      window.speechSynthesis.cancel();
      setIsPlayingMantraRecitation(false);
      return;
    }

    // Strike the singing bowl
    soundSynthesizer.playSingingBowl(216, 6.0);

    const cleanText = m.sanskritText.replace(/[।॥\n]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ne-NP';
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlayingMantraRecitation(false);
    utterance.onerror = () => setIsPlayingMantraRecitation(false);

    setIsPlayingMantraRecitation(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetJapa = () => {
    setJapaCount(0);
  };

  const handleCopyDream = (dream: DreamItem) => {
    const text = `🌙 सपनाको फल (Swapna Shastra) • Shubha Patro (Nepali Calendar)
✨ सपना: ${lang === 'ne' ? dream.keywordNe : dream.keywordEn}
📖 फल: ${lang === 'ne' ? dream.shortMeaningNe : dream.shortMeaningEn}
🔍 संकेत: ${lang === 'ne' ? dream.indicationNe : dream.indicationEn}
🌿 वैदिक शान्ति उपाय: ${lang === 'ne' ? dream.remedyNe : dream.remedyEn}

📱 थप सपनाको फल तथा धर्म संस्कृतिका लागि Shubha Patro (Nepali Calendar • shubhapatro.com) हेर्नुहोस्।`;

    navigator.clipboard.writeText(text);
    setCopiedDreamId(dream.id);
    setTimeout(() => setCopiedDreamId(null), 2500);
  };

  const handleCopyMantra = (m: SacredMantra) => {
    const text = `🕉️ ${m.titleNe} (${m.deityNe})
${m.sanskritText}

अर्थ: ${m.nepaliMeaning}
फल: ${m.benefitNe}

Shubha Patro (शुभ पात्रो • shubhapatro.com) • धर्म संस्कृति`;
    navigator.clipboard.writeText(text);
    setCopiedMantraId(m.id);
    setTimeout(() => setCopiedMantraId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-800 via-amber-800 to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-amber-900/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 backdrop-blur-md rounded-full border border-amber-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ne' ? 'वैदिक सनातन परम्परा तथा स्वप्न शास्त्र' : 'Vedic Dharma, Culture & Dream Science'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              {lang === 'ne' ? 'धर्म संस्कृति तथा सपनाको फल' : 'Dharma Sanskriti & Dream Interpretation'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              {lang === 'ne'
                ? 'प्राचीन स्वप्न शास्त्र अनुसार सपनाको फल, वैदिक नित्यकर्म, पूजा विधि, दैनिक जप मन्त्र र एकादशी तथा व्रतका नियमहरूको प्रमाणिक संग्रह।'
                : 'Explore authentic Vedic dream interpretations (Swapna Shastra), daily morning rituals, sacred puja vidhi, 108 japa counter, and fasting rules.'}
            </p>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubTab('dreams')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                activeSubTab === 'dreams'
                  ? 'bg-amber-400 text-stone-950 font-extrabold shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>{lang === 'ne' ? 'सपनाको फल (Swapna Shastra)' : 'Dream Interpretation'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('rituals')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                activeSubTab === 'rituals'
                  ? 'bg-amber-400 text-stone-950 font-extrabold shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{lang === 'ne' ? 'नित्यकर्म र पूजा विधि' : 'Daily Rituals & Puja'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('mantras')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                activeSubTab === 'mantras'
                  ? 'bg-amber-400 text-stone-950 font-extrabold shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{lang === 'ne' ? 'मन्त्र र १०८ जप काउन्टर' : 'Sacred Mantras & 108 Japa'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('fasting')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                activeSubTab === 'fasting'
                  ? 'bg-amber-400 text-stone-950 font-extrabold shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ne' ? 'व्रत र उपवास नियम' : 'Vedic Fasting Rules'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ============================================================ */}
      {/* SUB-TAB 1: DREAMS INTERPRETATION (सपनाको फल) */}
      {/* ============================================================ */}
      {activeSubTab === 'dreams' && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search Input */}
              <div className="md:col-span-7 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'ne' ? 'सपनामा के देख्नुभयो? खोज्नुहोस् (उदा: सर्प, पानी, गाई, दाँत, सुन, हात्ती, उड्नु...)' : 'Search dream symbol (e.g. snake, water, cow, teeth, gold, temple)...'}
                  value={dreamQuery}
                  onChange={(e) => setDreamQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                {dreamQuery && (
                  <button
                    onClick={() => setDreamQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', labelNe: 'सबै सपना', labelEn: 'All Dreams' },
                  { id: 'auspicious', labelNe: 'शुभ फल (Auspicious)', labelEn: 'Auspicious' },
                  { id: 'cautionary', labelNe: 'सतर्कता (Cautionary)', labelEn: 'Cautionary' },
                  { id: 'neutral', labelNe: 'सामान्य (Neutral)', labelEn: 'Neutral' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setDreamCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      dreamCategory === cat.id
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {lang === 'ne' ? cat.labelNe : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-stone-400 font-medium">{lang === 'ne' ? 'प्रचलित खोजहरू:' : 'Popular:'}</span>
              {['सर्प', 'गाई', 'पानी', 'मन्दिर', 'दाँत', 'सुन', 'उड्नु', 'रुनु'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setDreamQuery(chip)}
                  className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 text-[11px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 cursor-pointer transition-colors"
                >
                  ✨ {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Dream Results & Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Dream Cards List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
                <span>
                  {lang === 'ne'
                    ? `कुल ${toNepaliDigits(filteredDreams.length)} सपनाको फल फेला पर्यो`
                    : `Showing ${filteredDreams.length} dream symbols`}
                </span>
                <span className="text-[11px]">
                  {lang === 'ne' ? 'विस्तृत हेर्न कार्डमा क्लिक गर्नुहोस्' : 'Click to view full interpretation'}
                </span>
              </div>

              {filteredDreams.length === 0 ? (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 text-center border border-stone-200 dark:border-stone-800 space-y-3">
                  <Moon className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
                  <h4 className="text-stone-700 dark:text-stone-300 font-bold text-sm">
                    {lang === 'ne' ? `"${dreamQuery}" सम्बन्धित सपना फेला परेन` : `No results for "${dreamQuery}"`}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                    {lang === 'ne'
                      ? 'कृपया अर्को शब्द खोज्नुहोस् वा माथिका प्रचलित शब्दहरू (सर्प, पानी, गाई, मन्दिर, दाँत) छानेर हेर्नुहोस्।'
                      : 'Try another keyword or select popular symbols above like snake, river, cow, temple, or tooth.'}
                  </p>
                </div>
              ) : (
                filteredDreams.map((item) => {
                  const isSelected = selectedDream?.id === item.id;
                  const isCopied = copiedDreamId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDream(item)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/30 shadow-sm'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                              item.category === 'auspicious'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : item.category === 'cautionary'
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            {item.category === 'auspicious' ? 'शुभ' : item.category === 'cautionary' ? 'सचेत' : 'संकेत'}
                          </div>

                          <div>
                            <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                              {lang === 'ne' ? item.keywordNe : item.keywordEn}
                            </h4>
                            <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold">
                              {lang === 'ne' ? item.shortMeaningNe : item.shortMeaningEn}
                            </p>
                          </div>
                        </div>

                        {/* Category Tag */}
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                            item.category === 'auspicious'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.category === 'cautionary'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                          }`}
                        >
                          {item.category === 'auspicious'
                            ? (lang === 'ne' ? 'शुभ फल' : 'Auspicious')
                            : item.category === 'cautionary'
                            ? (lang === 'ne' ? 'सतर्क रहनुपर्ने' : 'Caution')
                            : (lang === 'ne' ? 'सामान्य' : 'Neutral')}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {lang === 'ne' ? item.detailedInterpretationNe : item.detailedInterpretationEn}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px]">
                        <span className="text-stone-400">
                          🌿 {lang === 'ne' ? `उपाय: ${item.remedyNe.slice(0, 40)}...` : `Remedy: ${item.remedyEn.slice(0, 40)}...`}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyDream(item);
                          }}
                          className="p-1 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                          title="Copy interpretation"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Selected Dream Detail Reading (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              {selectedDream ? (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 space-y-5 transition-colors">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                          {lang === 'ne' ? 'स्वप्न फल विश्लेषण' : 'Swapna Analysis'}
                        </span>
                        <h3 className="font-extrabold text-stone-900 dark:text-white text-base">
                          {lang === 'ne' ? selectedDream.keywordNe : selectedDream.keywordEn}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyDream(selectedDream)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedDreamId === selectedDream.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{lang === 'ne' ? 'कपी भयो' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ne' ? 'सेयर' : 'Share'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Auspicious Badge & Main Result */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      selectedDream.category === 'auspicious'
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                        : selectedDream.category === 'cautionary'
                        ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
                        : 'bg-stone-50 dark:bg-stone-800/70 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block mb-1">
                      {lang === 'ne' ? 'मुख्य फलादेश र फल' : 'Key Prediction'}
                    </span>
                    <p className="text-base font-extrabold leading-snug">
                      {lang === 'ne' ? selectedDream.shortMeaningNe : selectedDream.shortMeaningEn}
                    </p>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <h5 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                      {lang === 'ne' ? 'शास्त्रोक्त व्याख्या' : 'Classical Scriptural Analysis'}
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                      {lang === 'ne' ? selectedDream.detailedInterpretationNe : selectedDream.detailedInterpretationEn}
                    </p>
                  </div>

                  {/* Indication / Significance */}
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-900/40 text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                      🔮 {lang === 'ne' ? 'सपनाले के संकेत गर्दछ?' : 'What does this signal?'}
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">
                      {lang === 'ne' ? selectedDream.indicationNe : selectedDream.indicationEn}
                    </span>
                  </div>

                  {/* Vedic Remedy / Upaya */}
                  <div className="p-3.5 bg-red-50/60 dark:bg-red-950/30 rounded-2xl border border-red-200/50 dark:border-red-900/40 text-xs space-y-1">
                    <span className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {lang === 'ne' ? 'वैदिक शान्ति उपाय (के गर्ने?)' : 'Vedic Peace Remedy / Action'}
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {lang === 'ne' ? selectedDream.remedyNe : selectedDream.remedyEn}
                    </p>
                  </div>

                  {/* Astrological Note */}
                  <p className="text-[11px] text-stone-400 italic text-center">
                    {lang === 'ne'
                      ? 'नोट: बिहानको ब्रह्ममुहूर्त (४ देखि ६ बजे) मा देखिएका सपना चाँडै फलदायी हुने मान्यता छ।'
                      : 'Note: Dreams witnessed during Brahma Muhurta (4:00 AM - 6:00 AM) are considered quickest to manifest.'}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Swapna Shastra Timing Guide & Bad Dream Remedies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-stone-200 dark:border-stone-800">
            {/* 1. Prahar Timing Guide */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base">
                    {lang === 'ne' ? 'प्रहर अनुसार सपनाको फल कहिले मिल्छ?' : 'When Do Dreams Manifest? (Prahar Timing)'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {lang === 'ne' ? 'प्राचीन स्वप्न शास्त्र अनुसार समय र प्रहरको प्रभाव' : 'Vedic Swapna Shastra timing precision'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {SWAPNA_TIMING_GUIDES.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-stone-900 dark:text-white block">
                        {lang === 'ne' ? item.praharNe : item.praharEn}
                      </span>
                      <p className="text-stone-600 dark:text-stone-300 text-[11px] mt-0.5">
                        {lang === 'ne' ? item.manifestationNe : item.manifestationEn}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 shrink-0 self-start sm:self-center">
                      {lang === 'ne' ? item.accuracyNe : item.accuracyEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Bad Dream Neutralizing Remedies */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base">
                    {lang === 'ne' ? 'दुःस्वप्न शान्ति तथा वैदिक रक्षा विधि' : 'Bad Dream Protection & Remedies'}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {lang === 'ne' ? 'अशुभ सपना देखेमा तत्काल गर्नुपर्ने सरल उपाय' : 'Simple authentic steps to dispel bad dreams'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {BAD_DREAM_REMEDIES.map((rem) => (
                  <div key={rem.id} className="p-3.5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-xs space-y-1">
                    <span className="font-bold text-red-900 dark:text-red-300 block">
                      🛡️ {lang === 'ne' ? rem.titleNe : rem.titleEn}
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed">
                      {lang === 'ne' ? rem.descNe : rem.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: DAILY RITUALS & PUJA VIDHI (नित्यकर्म र पूजा) */}
      {/* ============================================================ */}
      {activeSubTab === 'rituals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VEDIC_RITUALS_DATA.map((ritual) => (
              <div
                key={ritual.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-colors space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center font-bold shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block">
                        {ritual.category === 'daily'
                          ? (lang === 'ne' ? 'दैनिक नित्यकर्म' : 'Daily Observance')
                          : ritual.category === 'fasting'
                          ? (lang === 'ne' ? 'पवित्र व्रत' : 'Sacred Fast')
                          : (lang === 'ne' ? 'वास्तु तथा कल्याण' : 'Vastu & Wellness')}
                      </span>
                      <h3 className="font-extrabold text-stone-900 dark:text-white text-base">
                        {lang === 'ne' ? ritual.titleNe : ritual.titleEn}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold mb-2">
                    {lang === 'ne' ? ritual.taglineNe : ritual.taglineEn}
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                    {lang === 'ne' ? ritual.descriptionNe : ritual.descriptionEn}
                  </p>

                  {/* Sacred Mantra if present */}
                  {ritual.mantraNe && (
                    <div className="p-3 bg-amber-50/80 dark:bg-stone-800/80 rounded-2xl border border-amber-200/70 dark:border-stone-700 text-xs mb-4">
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-1">
                        🕉️ {lang === 'ne' ? 'पवित्र मन्त्र' : 'Sacred Sloka'}
                      </span>
                      <p className="font-serif font-bold text-stone-900 dark:text-white whitespace-pre-line leading-relaxed">
                        {ritual.mantraNe}
                      </p>
                    </div>
                  )}

                  {/* Step by Step Guide */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                      {lang === 'ne' ? 'विधि तथा चरणहरू:' : 'Step-by-Step Procedure:'}
                    </span>
                    {(lang === 'ne' ? ritual.stepsNe : ritual.stepsEn).map((st, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                        <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {toNepaliDigits(i + 1)}
                        </span>
                        <span className="leading-relaxed">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Significance Footer */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{lang === 'ne' ? ritual.significanceNe : ritual.significanceEn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: SACRED MANTRAS & 108 JAPA COUNTER */}
      {/* ============================================================ */}
      {activeSubTab === 'mantras' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Mantra Selector & Detailed Text (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-extrabold text-stone-900 dark:text-white text-base">
              {lang === 'ne' ? 'दैनिक पाठ गर्ने कल्याणकारी वैदिक मन्त्रहरू' : 'Vedic Chanting & Stotrams'}
            </h3>

            <div className="space-y-3">
              {SACRED_MANTRAS_DATA.map((m) => {
                const isSelected = selectedMantra.id === m.id;
                const isCopied = copiedMantraId === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMantra(m);
                      setJapaCount(0);
                    }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/30 shadow-sm'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                          {lang === 'ne' ? m.deityNe : m.deityEn}
                        </span>
                        <h4 className="font-extrabold text-stone-900 dark:text-white text-base">
                          {lang === 'ne' ? m.titleNe : m.titleEn}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyMantra(m);
                          }}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                          title="Copy Sanskrit text & meaning"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Sanskrit Sloka Box */}
                    <div className="p-3.5 bg-gradient-to-r from-red-900 to-amber-950 text-amber-100 rounded-2xl border border-red-800/40 font-serif font-bold text-sm sm:text-base leading-relaxed text-center shadow-inner">
                      {m.sanskritText}
                    </div>

                    {/* Meaning */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-stone-700 dark:text-stone-300 block">
                        {lang === 'ne' ? 'मन्त्रको सरल नेपाली अर्थ:' : 'Spiritual Meaning:'}
                      </span>
                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                        {lang === 'ne' ? m.nepaliMeaning : m.englishMeaning}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{lang === 'ne' ? `फल: ${m.benefitNe}` : `Benefit: ${m.benefitEn}`}</span>
                    </div>

                    {/* Dedicated Audio & Singing Bowl Sound Controls */}
                    <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center gap-2">
                      {m.id === 'mahamrityunjaya' ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySingingBowl();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                            title="Play authentic bronze Tibetan singing bowl sound"
                          >
                            <Bell className="w-3.5 h-3.5 text-stone-900" />
                            <span>{lang === 'ne' ? 'सिङ्गिङ बाउल ध्वनि बजाउनुहोस्' : 'Play Singing Bowl Chime'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleDrone();
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              isContinuousDrone
                                ? 'bg-red-600 text-white animate-pulse'
                                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            {isContinuousDrone ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
                            <span>{isContinuousDrone ? (lang === 'ne' ? 'ध्यान ध्वनि बन्द' : 'Stop Drone') : (lang === 'ne' ? 'निरन्तर ध्यान ध्वनि (Drone)' : 'Singing Bowl Drone')}</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundSynthesizer.playTempleBell(528);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5 text-amber-600" />
                          <span>{lang === 'ne' ? 'मन्दिरको घण्टी बजाउनुहोस्' : 'Play Bell Chime'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReciteMantra(m);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isPlayingMantraRecitation ? (lang === 'ne' ? 'रोक्नुहोस्' : 'Stop Audio') : (lang === 'ne' ? 'मन्त्र पाठ सुन्नुहोस्' : 'Listen Chanting')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 108 Digital Japa Counter Bead Machine (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-red-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-800 space-y-5 relative overflow-hidden text-center">
              
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  🕉️ {lang === 'ne' ? 'डिजिटल रुद्राक्ष / १०८ जप काउन्टर' : '108 JAPA MALA BEADS COUNTER'}
                </span>
                <h3 className="font-black text-lg sm:text-xl text-white">
                  {lang === 'ne' ? selectedMantra.titleNe : selectedMantra.titleEn}
                </h3>
                <p className="text-xs text-amber-200/80 mt-1 line-clamp-1 font-serif">
                  {selectedMantra.sanskritText.split('\n')[0]}
                </p>

                {selectedMantra.id === 'mahamrityunjaya' && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-bold text-amber-300">
                    <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{lang === 'ne' ? 'महामृत्युञ्जय: सिङ्गिङ बाउल ध्वनि सक्रिय (प्रत्येक ट्यापमा)' : 'Singing Bowl sound active on each tap'}</span>
                  </div>
                )}
              </div>

              {/* Central Japa Dial */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex flex-col items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin-slow pointer-events-none" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-red-500/30 pointer-events-none" />

                {/* Big Button Counter */}
                <button
                  type="button"
                  id="japa-counter-click-btn"
                  onClick={handleJapaStep}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 hover:from-amber-300 hover:to-red-500 active:scale-95 text-stone-950 font-black shadow-2xl flex flex-col items-center justify-center transition-all cursor-pointer ring-4 ring-amber-400/30 group"
                >
                  <span className="text-3xl sm:text-4xl font-mono tracking-tight leading-none group-hover:scale-110 transition-transform">
                    {toNepaliDigits(japaCount)}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-900 mt-1">
                    / {toNepaliDigits(selectedMantra.suggestedChants)} {lang === 'ne' ? 'जप' : 'Chants'}
                  </span>
                  <span className="text-[10px] font-bold text-stone-800 bg-amber-300/80 px-2 py-0.5 rounded-full mt-1.5 shadow-2xs">
                    👆 {selectedMantra.id === 'mahamrityunjaya' ? (lang === 'ne' ? '🔔 छुनुहोस् (बाउल ध्वनि)' : '🔔 Tap for Singing Bowl') : (lang === 'ne' ? 'यहाँ छुनुहोस्' : 'Tap Bead')}
                  </span>
                </button>
              </div>

              {/* Mala Rounds Counter */}
              <div className="flex items-center justify-center gap-6 py-2 px-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">
                    {lang === 'ne' ? 'पूरा भएको माला' : 'Mala Rounds'}
                  </span>
                  <span className="text-base font-extrabold text-amber-300">
                    {toNepaliDigits(japaRounds)} {lang === 'ne' ? 'माला' : 'Rounds'}
                  </span>
                </div>
                <div className="h-8 w-px bg-stone-700" />
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">
                    {lang === 'ne' ? 'बाँकी जप' : 'Remaining'}
                  </span>
                  <span className="text-base font-extrabold text-stone-200">
                    {toNepaliDigits(selectedMantra.suggestedChants - japaCount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Reset, Singing bowl, Drone */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedMantra.id === 'mahamrityunjaya' && (
                  <button
                    type="button"
                    onClick={handlePlaySingingBowl}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Play singing bowl chime"
                  >
                    <Bell className="w-3.5 h-3.5 text-stone-950" />
                    <span>{lang === 'ne' ? 'बाउल ध्वनि' : 'Bowl Chime'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetJapa}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'रिसेट' : 'Reset'}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-400">
                {lang === 'ne'
                  ? '💡 शान्त स्थानमा बसेर आँखा चिम्ली प्रत्येक मन्त्र उच्चारणसँगै बटन थिच्नुहोस्।'
                  : '💡 Sit in a quiet posture, close your eyes, and tap after each sacred chant.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 4: SACRED FASTING RULES (व्रत र उपवास नियम) */}
      {/* ============================================================ */}
      {activeSubTab === 'fasting' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 transition-colors space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-950/60 rounded-full text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'वैदिक उपवास विधान' : 'Vedic Fasting Science'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                {lang === 'ne' ? 'सनातन धर्ममा प्रमुख व्रतहरू र पालन गर्ने नियम' : 'Major Vedic Fasting Observances & Protocols'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-3xl">
                {lang === 'ne'
                  ? 'उपवास केवल खाना छोड्नु मात्र होइन; यो इन्द्रिय संयम, मानसिक शान्ति, शरीरको विषहरण (Detox) र आत्मशुद्धिको महान् तपस्या हो।'
                  : 'Fasting in Sanatana Dharma is a multidimensional discipline fostering sensory mastery, cellular autophagy, digestive renewal, and spiritual elevation.'}
              </p>
            </div>

            {/* Fasts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Ekadashi */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    ११
                  </span>
                  <div>
                    <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                      {lang === 'ne' ? 'एकादशी व्रत (हरि वासर)' : 'Ekadashi Vrata'}
                    </h4>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                      {lang === 'ne' ? 'महिनामा २ पटक (शुक्ल/कृष्ण ११)' : 'Twice a month (11th tithi)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <p><strong>{lang === 'ne' ? 'के खाने?' : 'What to Eat:'}</strong> {lang === 'ne' ? 'फलफूल, दूध, दही, साबुदाना, काजु, बदाम, पानी।' : 'Fresh fruits, milk, curd, sago, dry fruits, water.'}</p>
                  <p><strong>{lang === 'ne' ? 'के नखाने?' : 'Forbidden:'}</strong> {lang === 'ne' ? 'चामल, गहुँ, दाल, मकै, कोदो, नून (सादा) र तामसिक भोजन।' : 'Rice, wheat, grains, pulses, regular salt, onions/garlic.'}</p>
                  <p><strong>{lang === 'ne' ? 'पारणा समय:' : 'Parana Timing:'}</strong> {lang === 'ne' ? 'द्वादशीको बिहान सूर्योदयपछि ब्राह्मण वा गरिबलाई दान गरेर।' : 'Dvadashi morning after sunrise and feeding the needy.'}</p>
                </div>
              </div>

              {/* Card 2: Pradosha Vrata */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    १३
                  </span>
                  <div>
                    <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                      {lang === 'ne' ? 'प्रदोष व्रत (शिव उपासना)' : 'Pradosha Vrata (Shiva)'}
                    </h4>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {lang === 'ne' ? 'त्रयोदशी तिथि (साँझको समय)' : 'Trayodashi Tithi (Twilight)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <p><strong>{lang === 'ne' ? 'विधि:' : 'Method:'}</strong> {lang === 'ne' ? 'दिनभर उपवास बसी सूर्यास्त हुनुभन्दा ४५ मिनेट अघि शिव लिंगमा जलाभिषेक र बेलपत्र अर्पण।' : 'Fast during daytime; perform Rudrabhishek 45 mins before dusk.'}</p>
                  <p><strong>{lang === 'ne' ? 'फल:' : 'Significance:'}</strong> {lang === 'ne' ? 'शत्रु नाश, दीर्घायु, चन्द्र दोष निवारण र दाम्पत्य सुख।' : 'Dispels planetary curses, promotes longevity and peace.'}</p>
                  <p><strong>{lang === 'ne' ? 'मन्त्र:' : 'Mantra:'}</strong> ॐ नमः शिवाय (१०८ पटक)</p>
                </div>
              </div>

              {/* Card 3: Sankashti Chaturthi */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                    ४
                  </span>
                  <div>
                    <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                      {lang === 'ne' ? 'संकष्टी चतुर्थी (गणेश व्रत)' : 'Sankashti Chaturthi'}
                    </h4>
                    <span className="text-[10px] text-red-600 dark:text-red-400 font-bold">
                      {lang === 'ne' ? 'कृष्ण पक्षको चतुर्थी' : 'Krishna Paksha 4th Tithi'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <p><strong>{lang === 'ne' ? 'विधि:' : 'Method:'}</strong> {lang === 'ne' ? 'दिनभर निराहार रही राति चन्द्रमा उदाएपछि अर्घ्य दिएर मात्र व्रत खोल्ने।' : 'Daylong fasting; fast broken only after moonrise and Arghya.'}</p>
                  <p><strong>{lang === 'ne' ? 'प्रसाद:' : 'Prasad:'}</strong> {lang === 'ne' ? 'भगवान गणेशलाई २१ वटा दुबो, मोदक र सख्खरको लड्डु अर्पण।' : 'Offer 21 holy Dubo blades and sweet modaks to Ganesha.'}</p>
                  <p><strong>{lang === 'ne' ? 'फल:' : 'Significance:'}</strong> {lang === 'ne' ? 'ठूला संकट, ऋण र विघ्न-बाधाबाट पूर्ण मुक्ति।' : 'Relief from financial debt and critical undertakings.'}</p>
                </div>
              </div>

            </div>

            {/* Scientific Fasting Benefits Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 dark:from-stone-800 dark:via-emerald-950/20 dark:to-stone-800 border border-emerald-200 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Leaf className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-stone-900 dark:text-white">
                    {lang === 'ne' ? 'उपवास र विज्ञान (Autophagy & Detox)' : 'Scientific Merit of Fasting'}
                  </h5>
                  <p className="text-stone-600 dark:text-stone-300">
                    {lang === 'ne'
                      ? 'नोबेल पुरस्कार विजेता अनुसन्धान अनुसार उपवास गर्दा शरीरले पुराना र हानिकारक कोषहरूलाई नष्ट गरी नयाँ स्वस्थ कोष निर्माण गर्छ (Autophagy)।'
                      : 'Nobel-winning scientific discovery confirms intermittent fasting initiates autophagy—cleansing damaged cellular debris and recharging immunity.'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
