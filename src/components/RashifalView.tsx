import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Shield, 
  Moon, 
  Sun, 
  Feather, 
  Scale, 
  Zap, 
  Compass, 
  Mountain, 
  Wind, 
  Waves, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Gem, 
  BookOpen, 
  HelpCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  Share2, 
  Search,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';
import { 
  RashiId, 
  RashiInfo, 
  DailyHoroscope, 
  HoroscopePeriod, 
  Language, 
  NepaliDate 
} from '../types';
import { RASHIS_DATA, MOCK_DAILY_HOROSCOPES } from '../data/mockAstrology';
import { getDynamicHoroscope } from '../utils/horoscopeEngine';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { DREAM_INTERPRETATIONS, DreamItem } from '../data/dharmaCultureData';
import { HoroscopeShareModal } from './HoroscopeShareModal';
import confetti from 'canvas-confetti';

interface RashifalViewProps {
  lang: Language;
  todayBs?: NepaliDate;
  onNavigate?: (tab: string) => void;
}

export const RashifalView: React.FC<RashifalViewProps> = ({ lang, todayBs, onNavigate }) => {
  const [selectedRashiId, setSelectedRashiId] = useState<RashiId>('mesh');
  const [period, setPeriod] = useState<HoroscopePeriod>('daily');
  const [copiedMantra, setCopiedMantra] = useState<boolean>(false);

  // Sharing state
  const [shareModalRashi, setShareModalRashi] = useState<RashiInfo | null>(null);
  const [shareModalTab, setShareModalTab] = useState<'image' | 'text'>('image');
  const [copiedRashiId, setCopiedRashiId] = useState<string | null>(null);

  // Dream Interpretation quick search state
  const [dreamSearchQuery, setDreamSearchQuery] = useState<string>('');
  const [selectedDreamResult, setSelectedDreamResult] = useState<DreamItem>(DREAM_INTERPRETATIONS[0]);

  // Japa Bead Counter for this Rashi's auspicious mantra
  const [rashiJapaCount, setRashiJapaCount] = useState<number>(0);
  const [rashiJapaRounds, setRashiJapaRounds] = useState<number>(0);

  const selectedRashi = RASHIS_DATA.find((r) => r.id === selectedRashiId) || RASHIS_DATA[0];
  const horoscope = useMemo(() => {
    return getDynamicHoroscope(selectedRashiId, period, todayBs, lang);
  }, [selectedRashiId, period, todayBs, lang]);

  const handleCopyMantra = () => {
    navigator.clipboard.writeText(horoscope.mantraNe);
    setCopiedMantra(true);
    setTimeout(() => setCopiedMantra(false), 2000);
  };

  const handleRashiJapaClick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}

    const next = rashiJapaCount + 1;
    if (next >= 108) {
      setRashiJapaCount(0);
      setRashiJapaRounds((r) => r + 1);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981'],
      });
    } else {
      setRashiJapaCount(next);
    }
  };

  // Matched dreams for quick finder
  const matchingDreams = useMemo(() => {
    if (!dreamSearchQuery.trim()) return DREAM_INTERPRETATIONS.slice(0, 4);
    const q = dreamSearchQuery.toLowerCase().trim();
    return DREAM_INTERPRETATIONS.filter(
      (d) =>
        d.keywordNe.toLowerCase().includes(q) ||
        d.keywordEn.toLowerCase().includes(q) ||
        d.shortMeaningNe.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [dreamSearchQuery]);

  const openShareModal = (rashiToShare: RashiInfo, tab: 'image' | 'text' = 'image') => {
    setShareModalRashi(rashiToShare);
    setShareModalTab(tab);
  };

  const handleCopyHoroscopeText = (rashiToCopy: RashiInfo, h: DailyHoroscope) => {
    const dateHeading = todayBs 
      ? (lang === 'ne' ? todayBs.formattedNe : todayBs.formattedEn)
      : (lang === 'ne' ? 'आजको दिन' : "Today's Date");

    const text = `🌟 Nepali Calendar • वैदिक राशिफल (Horoscope)
${rashiToCopy.symbol} ${rashiToCopy.nameNe} (${rashiToCopy.nameEn}) | ${h.date}
⭐ शुभ योग: ${h.rating}/५ तारा

📖 फलादेश:
${lang === 'ne' ? h.predictionNe : h.predictionEn}

🎨 भाग्यशाली रङ: ${lang === 'ne' ? h.luckyColorNe : h.luckyColorEn}
🔢 भाग्यशाली अङ्क: ${toNepaliDigits(h.luckyNumber)}
🧭 शुभ दिशा: ${lang === 'ne' ? h.luckyDirectionNe : h.luckyDirectionEn}
⏰ शुभ समय: ${h.favorableTime}

🕉️ जप मन्त्र: "${h.mantraNe}"
🌿 ज्योतिषीय उपाय: ${lang === 'ne' ? h.remedyNe : h.remedyEn}
💎 शुभ रत्न: ${lang === 'ne' ? h.gemstoneNe : h.gemstoneEn}

📱 थप विस्तृत पञ्चाङ्ग तथा राशिफलका लागि Nepali Calendar हेर्नुहोस्।`;

    navigator.clipboard.writeText(text);
    setCopiedRashiId(rashiToCopy.id);
    setTimeout(() => setCopiedRashiId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl text-white p-6 sm:p-8 shadow-md mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 rounded-full border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {lang === 'ne' ? 'दैनिक वैदिक राशिफल' : 'Daily Vedic Horoscope'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {lang === 'ne' ? 'आफ्नो राशिको आजको भविष्यफल' : 'Discover Your Daily Astrological Reading'}
          </h2>
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
            {lang === 'ne'
              ? 'ग्रह, नक्षत्र र गोचर स्थिति अनुसार १२ वटै राशिका लागि सटीक फलादेश, शुभ समय, भाग्यशाली रङ, अंक र ज्योतिषीय उपायहरू।'
              : 'Authentic Vedic planetary analysis, lucky metrics, favorable hours, and personalized remedies for all 12 zodiac signs.'}
          </p>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-15 pointer-events-none text-9xl">
          ♈
        </div>
      </div>

      {/* 12 Rashis Selector Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>{lang === 'ne' ? '१२ राशि चयन गर्नुहोस्:' : 'Select Your Zodiac Sign (Rashi):'}</span>
          </h3>
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-bold">
            {(['daily', 'weekly', 'monthly', 'yearly'] as HoroscopePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p === 'daily' && (lang === 'ne' ? 'दैनिक' : 'Daily')}
                {p === 'weekly' && (lang === 'ne' ? 'साप्ताहिक' : 'Weekly')}
                {p === 'monthly' && (lang === 'ne' ? 'मासिक' : 'Monthly')}
                {p === 'yearly' && (lang === 'ne' ? 'वार्षिक' : 'Yearly')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {RASHIS_DATA.map((rashi) => {
            const isSelected = rashi.id === selectedRashiId;
            return (
              <button
                key={rashi.id}
                id={`rashi-select-${rashi.id}`}
                onClick={() => setSelectedRashiId(rashi.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-red-700 text-white border-red-800 shadow-md ring-2 ring-red-500 scale-[1.03]'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                <span className="text-2xl mb-1">{rashi.symbol}</span>
                <span className="text-xs font-bold block leading-tight">
                  {lang === 'ne' ? rashi.nameNe : rashi.nameEn}
                </span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                  {rashi.rulingPlanet.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Rashi Detailed Horoscope Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Left/Main Column: Detailed Prediction & Metric Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
            {/* Rashi Header Badge */}
            <div className="bg-gradient-to-r from-red-800 to-red-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-inner">
                  {selectedRashi.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {selectedRashi.nameNe} ({selectedRashi.nameEn})
                    </h3>
                    <span className="px-2.5 py-0.5 bg-amber-400 text-stone-950 font-bold rounded-full text-xs">
                      {selectedRashi.element}
                    </span>
                  </div>
                  <p className="text-xs text-amber-200 mt-1">
                    {lang === 'ne' ? 'नामरूप अक्षरहरू:' : 'Name Letters:'} {selectedRashi.lettersNe}
                  </p>
                  <p className="text-xs text-red-200">
                    {lang === 'ne' ? 'स्वामी ग्रह:' : 'Ruling Planet:'} {selectedRashi.rulingPlanet} • {selectedRashi.englishDateRange}
                  </p>
                </div>
              </div>

              {/* Actions & Star Rating */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Star Rating */}
                <div className="bg-red-950/60 px-4 py-2 rounded-2xl border border-red-700/40 text-center">
                  <div className="flex items-center gap-1 text-amber-400 justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < horoscope.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    {horoscope.rating}/५ तारा (शुभ योग)
                  </span>
                </div>

                {/* Share and Copy Quick Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    id="selected-rashi-share-btn"
                    type="button"
                    onClick={() => openShareModal(selectedRashi, 'image')}
                    className="px-3.5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold rounded-2xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer select-none"
                    title={lang === 'ne' ? 'सामाजिक सञ्जाल तस्बिर स्निपेट वा टेक्स्ट सेयर गर्नुहोस्' : 'Share image snippet or copy text'}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{lang === 'ne' ? 'सेयर गर्नुहोस्' : 'Share'}</span>
                  </button>

                  <button
                    id="selected-rashi-copy-btn"
                    type="button"
                    onClick={() => handleCopyHoroscopeText(selectedRashi, horoscope)}
                    className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer select-none"
                    title={lang === 'ne' ? 'फलादेश टेक्स्ट कपी गर्नुहोस्' : 'Copy horoscope text'}
                  >
                    {copiedRashiId === selectedRashi.id ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedRashiId === selectedRashi.id ? (lang === 'ne' ? 'कपी भयो!' : 'Copied!') : (lang === 'ne' ? 'कपी' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Prediction Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-700" />
                  {horoscope.date}
                </h4>
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  {lang === 'ne' ? horoscope.predictionNe : horoscope.predictionEn}
                </p>
              </div>

              {/* Multi-Metric Scores Bar */}
              <div>
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  {lang === 'ne' ? 'क्षेत्रगत शुभता सूचकांक (Life Aspects Rating)' : 'Life Aspects Breakdown'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { labelNe: 'प्रेम र सम्बन्ध', labelEn: 'Love & Romance', val: horoscope.scores.love, color: 'bg-rose-500' },
                    { labelNe: 'पेशा र व्यवसाय', labelEn: 'Career & Business', val: horoscope.scores.career, color: 'bg-blue-500' },
                    { labelNe: 'आर्थिक स्थिति', labelEn: 'Finance & Wealth', val: horoscope.scores.finance, color: 'bg-emerald-500' },
                    { labelNe: 'स्वास्थ्य र ऊर्जा', labelEn: 'Health & Wellness', val: horoscope.scores.health, color: 'bg-amber-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                        <span>{lang === 'ne' ? item.labelNe : item.labelEn}</span>
                        <span className="text-stone-600">{toNepaliDigits(item.val)}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auspicious Metrics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-red-50/70 border border-red-100 rounded-2xl text-center">
                  <span className="text-[11px] text-red-600 font-bold block mb-1">
                    {lang === 'ne' ? 'भाग्यशाली रङ' : 'Lucky Color'}
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {lang === 'ne' ? horoscope.luckyColorNe : horoscope.luckyColorEn}
                  </span>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-center">
                  <span className="text-[11px] text-amber-700 font-bold block mb-1">
                    {lang === 'ne' ? 'भाग्यशाली अङ्क' : 'Lucky Number'}
                  </span>
                  <span className="text-base font-extrabold text-amber-900">
                    {toNepaliDigits(horoscope.luckyNumber)}
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
                  <span className="text-[11px] text-emerald-700 font-bold block mb-1">
                    {lang === 'ne' ? 'शुभ दिशा' : 'Lucky Direction'}
                  </span>
                  <span className="text-xs font-bold text-emerald-900">
                    {lang === 'ne' ? horoscope.luckyDirectionNe : horoscope.luckyDirectionEn}
                  </span>
                </div>

                <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl text-center">
                  <span className="text-[11px] text-purple-700 font-bold block mb-1">
                    {lang === 'ne' ? 'शुभ समय' : 'Favorable Hours'}
                  </span>
                  <span className="text-xs font-bold text-purple-900">
                    {horoscope.favorableTime}
                  </span>
                </div>
              </div>

              {/* Vedic Remedy & Gemstone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                      {lang === 'ne' ? 'ज्योतिषीय उपाय (Remedy)' : 'Vedic Upaya (Remedy)'}
                    </h5>
                    <p className="text-xs text-amber-950 font-medium">
                      {lang === 'ne' ? horoscope.remedyNe : horoscope.remedyEn}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-200/80 text-blue-900 flex items-center justify-center shrink-0">
                    <Gem className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                      {lang === 'ne' ? 'शुभ रत्न (Gemstone)' : 'Auspicious Gemstone'}
                    </h5>
                    <p className="text-xs text-blue-950 font-medium">
                      {lang === 'ne' ? horoscope.gemstoneNe : horoscope.gemstoneEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chanting Mantra */}
              <div className="p-4 bg-stone-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-inner">
                <div>
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                    {lang === 'ne' ? 'दैनिक जप मन्त्र' : 'Daily Chanting Mantra'}
                  </span>
                  <span className="text-sm font-semibold tracking-wide text-stone-100 font-serif">
                    {horoscope.mantraNe}
                  </span>
                </div>
                <button
                  onClick={handleCopyMantra}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedMantra ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMantra ? (lang === 'ne' ? 'कपी गरियो' : 'Copied') : (lang === 'ne' ? 'मन्त्र कपी' : 'Copy')}</span>
                </button>
              </div>

              {/* Social Share Callout Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 dark:from-amber-950/30 dark:via-red-950/30 dark:to-amber-950/30 border border-amber-300/60 dark:border-amber-700/50 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <span>{lang === 'ne' ? `${selectedRashi.nameNe} (${selectedRashi.nameEn}) राशिफल सेयर गर्नुहोस्` : `Share ${selectedRashi.nameEn} Horoscope`}</span>
                      <span className="px-1.5 py-0.5 bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold rounded-md">
                        {lang === 'ne' ? 'तस्बिर स्निपेट' : 'Image Snippet'}
                      </span>
                    </h5>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {lang === 'ne' 
                        ? 'इन्स्टाग्राम, फेसबुक, ह्वाट्सएप वा भाइबरका लागि १०८०p तस्बिर स्निपेट तयार पार्नुहोस् वा फलादेश कपी गर्नुहोस्।' 
                        : 'Generate ready-to-post 1080p Instagram/Facebook image snippet or copy formatted text.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openShareModal(selectedRashi, 'image')}
                    className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'ne' ? 'तस्बिर स्निपेट बनाउनुहोस्' : 'Create Image Snippet'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openShareModal(selectedRashi, 'text')}
                    className="px-3.5 py-2 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ne' ? 'टेक्स्ट सेयर' : 'Share Text'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dream Interpretation (सपनाको फल) & Dharma Sanskriti Hub */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dream Interpretation Quick Lookup Card */}
          <div className="bg-gradient-to-b from-stone-900 to-red-950 text-white rounded-3xl p-6 shadow-md border border-stone-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center shadow-lg font-bold">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {lang === 'ne' ? 'सपनाको फल (Swapna Shastra)' : 'Dream Interpretation'}
                  </h3>
                  <p className="text-xs text-amber-200">
                    {lang === 'ne' ? 'सपनाको अर्थ, शुभ-अशुभ संकेत र उपाय' : 'Vedic Dream Meanings & Remedies'}
                  </p>
                </div>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('dharma')}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-[11px] font-bold border border-amber-400/40 cursor-pointer transition-colors"
                >
                  {lang === 'ne' ? 'सबै हेर्नुहोस् →' : 'View All →'}
                </button>
              )}
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mb-3">
              {lang === 'ne'
                ? 'राति वा बिहानीको समयमा देखेको सपनाको शास्त्रोक्त फल, संकेत र वैदिक शान्ति उपाय तुरुन्त खोज्नुहोस्:'
                : 'Search any dream symbol to discover its traditional Vedic omen, psychological significance, and peace remedies:'}
            </p>

            {/* Quick Dream Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'ne' ? 'सपना खोज्नुहोस् (उदा: सर्प, गाई, पानी, दाँत, सुन, उड्नु)...' : 'Search symbol (e.g. snake, cow, water, tooth)...'}
                value={dreamSearchQuery}
                onChange={(e) => setDreamSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-800/90 text-white placeholder:text-stone-400 text-xs rounded-xl border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              {dreamSearchQuery && (
                <button
                  onClick={() => setDreamSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              <span className="text-[10px] text-stone-400 font-bold uppercase block mr-1">
                {lang === 'ne' ? 'प्रचलित:' : 'Quick:'}
              </span>
              {['सर्प', 'गाई', 'पानी', 'दाँत', 'मन्दिर', 'सुन'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setDreamSearchQuery(chip)}
                  className="px-2 py-0.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 text-[11px] font-medium transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Matching Dreams Mini List */}
            <div className="space-y-2 mb-4">
              {matchingDreams.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDreamResult(d)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    selectedDreamResult.id === d.id
                      ? 'bg-amber-500/20 border-amber-400/60 text-white'
                      : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/60 text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{lang === 'ne' ? d.keywordNe : d.keywordEn}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                        d.category === 'auspicious'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : d.category === 'cautionary'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-stone-700 text-stone-300'
                      }`}
                    >
                      {d.category === 'auspicious' ? 'शुभ' : d.category === 'cautionary' ? 'सतर्क' : 'सामान्य'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 mt-0.5 line-clamp-1 font-medium">
                    {lang === 'ne' ? d.shortMeaningNe : d.shortMeaningEn}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Dream Details Box */}
            {selectedDreamResult && (
              <div className="p-3.5 bg-stone-800/90 rounded-2xl border border-amber-400/40 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-stone-700 pb-1.5">
                  <span className="font-extrabold text-amber-300">
                    📖 {lang === 'ne' ? selectedDreamResult.keywordNe : selectedDreamResult.keywordEn}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {lang === 'ne' ? selectedDreamResult.indicationNe : selectedDreamResult.indicationEn}
                  </span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  {lang === 'ne' ? selectedDreamResult.detailedInterpretationNe : selectedDreamResult.detailedInterpretationEn}
                </p>
                <div className="pt-1 text-[11px] text-amber-300/90 border-t border-stone-700/60">
                  🌿 <strong>{lang === 'ne' ? 'शान्ति उपाय:' : 'Remedy:'}</strong> {lang === 'ne' ? selectedDreamResult.remedyNe : selectedDreamResult.remedyEn}
                </div>
              </div>
            )}

            {/* Portal Link */}
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dharma')}
                className="w-full mt-4 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'धर्म संस्कृति तथा सम्पूर्ण सपनाको फल खोल्नुहोस्' : 'Explore Full Dharma & Dream Guide'}</span>
              </button>
            )}
          </div>

          {/* Daily Rashi Japa Counter (१०८ जप काउन्टर) */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block">
                  {selectedRashi.nameNe} {lang === 'ne' ? 'राशिको दैनिक जप' : 'Daily Japa'}
                </span>
                <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                  {lang === 'ne' ? '१०८ मन्त्र जप काउन्टर' : '108 Japa Beads Counter'}
                </h4>
              </div>
            </div>

            {/* Mantra Display */}
            <div className="p-3 bg-amber-50 dark:bg-stone-800/80 rounded-2xl border border-amber-200 dark:border-stone-700 text-center">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block mb-0.5">
                {lang === 'ne' ? 'आज जप गर्ने शुभ मन्त्र:' : 'Auspicious Mantra for Today:'}
              </span>
              <p className="font-serif font-extrabold text-stone-900 dark:text-amber-200 text-sm">
                "{horoscope.mantraNe}"
              </p>
            </div>

            {/* Interactive Bead Clicker */}
            <div className="flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={handleRashiJapaClick}
                className="flex-1 py-3 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>📿 {lang === 'ne' ? 'जप गर्नुहोस्' : 'Chant Bead'}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs">
                  {toNepaliDigits(rashiJapaCount)} / १०८
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRashiJapaCount(0)}
                className="p-2.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-xs font-bold cursor-pointer"
                title="Reset counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {rashiJapaRounds > 0 && (
              <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                🎉 {toNepaliDigits(rashiJapaRounds)} {lang === 'ne' ? 'माला पूरा भयो!' : 'Mala rounds completed!'}
              </p>
            )}

            {/* Quick Astrological Remedy Pill */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300">
              <span className="font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                🌿 {lang === 'ne' ? 'दैनिक शान्ति उपाय:' : 'Planetary Remedy:'}
              </span>
              <p>{lang === 'ne' ? horoscope.remedyNe : horoscope.remedyEn}</p>
            </div>
          </div>

        </div>
      </div>

      {/* All 12 Signs Horoscope Cards Grid with Share on Each Card */}
      <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 rounded-full border border-amber-300/40 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'ne' ? '१२ वटै राशिका कार्डहरू' : 'All 12 Zodiac Cards'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <span>{lang === 'ne' ? 'सबै १२ राशिको आजको फलादेश र सेयरिङ' : 'All 12 Signs Daily Horoscope & Social Sharing'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              {lang === 'ne' 
                ? 'प्रत्येक राशिको फलादेश हेर्नुहोस्, तस्बिर स्निपेट बनाउनुहोस् वा एक क्लिकमा सेयर गर्नुहोस्।' 
                : 'Browse readings for each sign, generate custom social media image snippets, or copy text with one click.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RASHIS_DATA.map((r) => {
            const h = getDynamicHoroscope(r.id, period, todayBs, lang);
            const isSelected = r.id === selectedRashiId;
            const isCopied = copiedRashiId === r.id;

            return (
              <div
                key={r.id}
                id={`horoscope-card-${r.id}`}
                className={`bg-white dark:bg-stone-900 rounded-3xl border p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-red-600 dark:border-red-500 ring-2 ring-red-500/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700/60'
                }`}
              >
                <div>
                  {/* Card Header: Symbol, Name, Ruling planet & Rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-800 to-amber-900 text-white flex items-center justify-center text-2xl shadow-inner font-serif">
                        {r.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-stone-900 dark:text-white text-base">
                            {r.nameNe} ({r.nameEn})
                          </h4>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px] font-bold rounded-md">
                              {lang === 'ne' ? 'चयनित' : 'Active'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {r.element} • {r.rulingPlanet.split(' ')[0]}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800/60 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{h.rating}/५</span>
                    </div>
                  </div>

                  {/* Prediction Summary Text */}
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-4 line-clamp-3 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-100 dark:border-stone-800">
                    {lang === 'ne' ? h.predictionNe : h.predictionEn}
                  </p>

                  {/* Auspicious Badges: Color, Number, Time */}
                  <div className="grid grid-cols-3 gap-1.5 mb-4 text-[11px]">
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-red-600 dark:text-red-400 block font-medium">
                        {lang === 'ne' ? 'रङ' : 'Color'}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                        {lang === 'ne' ? h.luckyColorNe : h.luckyColorEn}
                      </span>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-medium">
                        {lang === 'ne' ? 'अङ्क' : 'No.'}
                      </span>
                      <span className="font-bold text-amber-950 dark:text-amber-200 block">
                        {toNepaliDigits(h.luckyNumber)}
                      </span>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-medium">
                        {lang === 'ne' ? 'शुभ समय' : 'Time'}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 truncate block text-[10px]">
                        {h.favorableTime.split(' - ')[0] || h.favorableTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons: Share, Copy, Detailed View */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  {/* Share Button (opens image generator / share modal for this sign) */}
                  <button
                    type="button"
                    id={`share-rashi-card-${r.id}`}
                    onClick={() => openShareModal(r, 'image')}
                    className="flex-1 py-2 px-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    title={lang === 'ne' ? `${r.nameNe} राशिको तस्बिर स्निपेट वा फलादेश सेयर गर्नुहोस्` : `Share ${r.nameEn} horoscope`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'सेयर' : 'Share'}</span>
                  </button>

                  {/* Quick Copy Button */}
                  <button
                    type="button"
                    id={`copy-rashi-card-${r.id}`}
                    onClick={() => handleCopyHoroscopeText(r, h)}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                    title={lang === 'ne' ? 'फलादेश कपी गर्नुहोस्' : 'Copy text'}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? (lang === 'ne' ? 'कपी भयो' : 'Copied') : (lang === 'ne' ? 'कपी' : 'Copy')}</span>
                  </button>

                  {/* View Detailed Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRashiId(r.id);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className="py-2 px-2.5 text-stone-500 hover:text-red-700 dark:text-stone-400 dark:hover:text-red-400 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    title={lang === 'ne' ? 'माथि विस्तृत हेर्नुहोस्' : 'View full details above'}
                  >
                    {lang === 'ne' ? 'विस्तृत' : 'Details'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Modal */}
      {shareModalRashi && (
        <HoroscopeShareModal
          isOpen={true}
          onClose={() => setShareModalRashi(null)}
          rashi={shareModalRashi}
          horoscope={getDynamicHoroscope(shareModalRashi.id, period, todayBs, lang)}
          lang={lang}
          todayBs={todayBs}
          initialTab={shareModalTab}
        />
      )}
    </div>
  );
};
