import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse,
  Sparkles,
  Sun,
  Moon,
  Wind,
  Droplets,
  Flame,
  Leaf,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
  Calendar,
  Compass,
  Bell,
  Volume2,
  VolumeX,
  Apple,
  ShieldAlert,
  Flower2,
  Activity,
  Maximize2,
  Check,
  MapPin
} from 'lucide-react';
import { Language, NepaliDate } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import {
  NEPALI_SEASONS_WELLNESS,
  YOGA_POSES_DATABASE,
  PRANAYAMA_EXERCISES,
  REGION_HEALTH_GUIDES,
  DAILY_WELLNESS_QUOTES,
  NepaliSeasonWellness,
  YogaPose,
  PranayamaPractice
} from '../data/healthWellnessData';

interface HealthWellnessViewProps {
  lang: Language;
  todayBs: NepaliDate;
}

// Helper: Synthesize gentle Tibetan bell chime via Web Audio API
function playTibetanBell(ctx: AudioContext | null) {
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    
    // Fundamental tone + harmonics
    const freqs = [432, 864, 1296];
    const gains = [0.35, 0.15, 0.05];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(gains[idx], now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.0);
    });
  } catch (err) {
    console.debug('AudioContext chime not available', err);
  }
}

export const HealthWellnessView: React.FC<HealthWellnessViewProps> = ({
  lang,
  todayBs,
}) => {
  // Determine current active Nepali season from todayBs.month (1=Baishakh ... 12=Chaitra)
  const currentSeasonId = React.useMemo(() => {
    const m = todayBs.month;
    const match = NEPALI_SEASONS_WELLNESS.find((s) => s.monthNumbers.includes(m));
    return match ? match.id : 'sharad';
  }, [todayBs.month]);

  // Selected season (defaults to current season, but user can freely explore all 6)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(currentSeasonId);
  const activeSeason = NEPALI_SEASONS_WELLNESS.find((s) => s.id === selectedSeasonId) || NEPALI_SEASONS_WELLNESS[3];

  // Active module tab
  const [activeTab, setActiveTab] = useState<'tips' | 'yoga' | 'meditation' | 'habits' | 'regions'>('tips');

  // Yoga category filter
  const [yogaCategory, setYogaCategory] = useState<string>('all');
  const [selectedYogaPose, setSelectedYogaPose] = useState<YogaPose | null>(null);

  // Live Yoga Stopwatch state
  const [poseTimerSeconds, setPoseTimerSeconds] = useState<number>(60);
  const [initialPoseSeconds, setInitialPoseSeconds] = useState<number>(60);
  const [isPoseTimerRunning, setIsPoseTimerRunning] = useState<boolean>(false);

  // Meditation & Breathing studio state
  const [selectedPranayamaId, setSelectedPranayamaId] = useState<string>('box-breathing');
  const activePranayama = PRANAYAMA_EXERCISES.find((p) => p.id === selectedPranayamaId) || PRANAYAMA_EXERCISES[0];
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathSecondsRemaining, setBreathSecondsRemaining] = useState<number>(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState<number>(0);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Daily Habits & Hydration state (persisted to localStorage)
  const storageKey = `hamro_wellness_${todayBs.year}_${todayBs.month}_${todayBs.day}`;
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_water`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [habitsCompleted, setHabitsCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_habits`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Reminders state
  const [reminders, setReminders] = useState<{
    morningYoga: boolean;
    waterReminder: boolean;
    eveningMeditation: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('hamro_patro_wellness_reminders');
      return saved ? JSON.parse(saved) : { morningYoga: true, waterReminder: true, eveningMeditation: false };
    } catch {
      return { morningYoga: true, waterReminder: true, eveningMeditation: false };
    }
  });

  const [notificationStatus, setNotificationStatus] = useState<string>('');

  // Selected Geography Region for climate tips
  const [selectedRegionId, setSelectedRegionId] = useState<'pahad' | 'terai' | 'himal'>('pahad');

  // Handle Water Update
  const updateWater = (delta: number) => {
    setWaterGlasses((prev) => {
      const next = Math.max(0, Math.min(12, prev + delta));
      try {
        localStorage.setItem(`${storageKey}_water`, next.toString());
      } catch {}
      return next;
    });
  };

  // Toggle Habit
  const toggleHabit = (habitId: string) => {
    setHabitsCompleted((prev) => {
      const next = { ...prev, [habitId]: !prev[habitId] };
      try {
        localStorage.setItem(`${storageKey}_habits`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Toggle Reminders
  const toggleReminderSetting = (key: keyof typeof reminders) => {
    setReminders((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('hamro_patro_wellness_reminders', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Request notification permissions
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus(lang === 'ne' ? 'तपाईँको ब्राउजरमा नोटिफिकेसन सपोर्ट छैन।' : 'Notifications not supported in this browser.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationStatus(lang === 'ne' ? 'दैनिक रिमाइन्डर सक्रिय भयो!' : 'Daily reminders successfully activated!');
        new Notification('Shubha Patro Health & Wellness', {
          body: lang === 'ne' ? 'दैनिक योग र ध्यान रिमाइन्डर सक्रिय गरियो।' : 'Daily yoga & meditation reminders are active.',
          icon: '/icon.svg'
        });
      } else {
        setNotificationStatus(lang === 'ne' ? 'नोटिफिकेसन अनुमति दिइएन।' : 'Notification permission denied.');
      }
    } catch {
      setNotificationStatus(lang === 'ne' ? 'अनुमति लिन सकिएन।' : 'Could not request permissions.');
    }
  };

  // Yoga Pose Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPoseTimerRunning && poseTimerSeconds > 0) {
      interval = setInterval(() => {
        setPoseTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsPoseTimerRunning(false);
            if (!isSoundMuted) playTibetanBell(audioCtxRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPoseTimerRunning, poseTimerSeconds, isSoundMuted]);

  // Breathing Pacer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Transition phases
            if (breathPhase === 'inhale') {
              if (activePranayama.pattern.hold > 0) {
                setBreathPhase('hold');
                return activePranayama.pattern.hold;
              } else {
                setBreathPhase('exhale');
                return activePranayama.pattern.exhale;
              }
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return activePranayama.pattern.exhale;
            } else if (breathPhase === 'exhale') {
              if (activePranayama.pattern.pause > 0) {
                setBreathPhase('pause');
                return activePranayama.pattern.pause;
              } else {
                setBreathPhase('inhale');
                setCompletedBreathCycles((c) => c + 1);
                if (!isSoundMuted) playTibetanBell(audioCtxRef.current);
                return activePranayama.pattern.inhale;
              }
            } else {
              // Pause finished
              setBreathPhase('inhale');
              setCompletedBreathCycles((c) => c + 1);
              if (!isSoundMuted) playTibetanBell(audioCtxRef.current);
              return activePranayama.pattern.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingActive, breathPhase, activePranayama, isSoundMuted]);

  // Daily Quote based on Nepali Day
  const dailyQuote = DAILY_WELLNESS_QUOTES[(todayBs.day - 1) % DAILY_WELLNESS_QUOTES.length];

  // Filtered Yoga Poses
  const filteredYogaPoses = YOGA_POSES_DATABASE.filter((pose) => {
    if (yogaCategory === 'all') return true;
    return pose.category === yogaCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. TOP HERO: SEASONAL RITUCHARYA & AYURVEDA OVERVIEW */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white p-6 sm:p-8 border border-stone-700/60 shadow-md">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/10">
              <HeartPulse className="w-3.5 h-3.5 text-red-400" />
              <span>{lang === 'ne' ? 'नेपाली स्वास्थ्य तथा ऋतुचर्या' : 'Nepali Health & Ritucharya'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>{toNepaliDigits(todayBs.year)} BS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex flex-wrap items-center gap-3">
              <span>{lang === 'ne' ? activeSeason.nameNe : activeSeason.nameEn}</span>
              {activeSeason.id === currentSeasonId && (
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-600 text-white border border-red-400/40 shadow-xs">
                  {lang === 'ne' ? 'हालको ऋतु' : 'Active Season'}
                </span>
              )}
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {lang === 'ne' ? activeSeason.climateSummaryNe : activeSeason.climateSummaryEn}
            </p>

            {/* Ayurvedic Core Attributes Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-stone-800/90 text-amber-300 border border-stone-700 font-medium">
                🌿 {lang === 'ne' ? `दोष: ${activeSeason.doshaNe}` : `Dosha: ${activeSeason.doshaEn}`}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-stone-800/90 text-sky-300 border border-stone-700 font-medium">
                ☀️ {lang === 'ne' ? `तत्व: ${activeSeason.elementNe}` : `Element: ${activeSeason.elementEn}`}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-stone-800/90 text-emerald-300 border border-stone-700 font-medium">
                📅 {lang === 'ne' ? activeSeason.monthsNe : activeSeason.monthsEn}
              </span>
            </div>
          </div>

          {/* Quick Daily Hydration & Practice Status Summary */}
          <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/80 backdrop-blur-xs min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-300">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Droplets className="w-4 h-4" />
                {lang === 'ne' ? 'दैनिक जलपान (Hydration)' : 'Daily Hydration'}
              </span>
              <span className="font-mono text-white">
                {toNepaliDigits(waterGlasses)} / {toNepaliDigits(8)} {lang === 'ne' ? 'गिलास' : 'glasses'}
              </span>
            </div>

            {/* Water progress bar */}
            <div className="w-full bg-stone-700/70 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterGlasses / 8) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => updateWater(1)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? '+१ गिलास पिएँ' : '+1 Glass'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('meditation')}
                className="py-1.5 px-3 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                title={lang === 'ne' ? 'ध्यान सुरु गर्नुहोस्' : 'Start Meditation'}
              >
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>{lang === 'ne' ? 'प्राणायाम' : 'Breathe'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 Nepali Seasons Selector Pills */}
        <div className="mt-6 pt-5 border-t border-stone-800 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 whitespace-nowrap mr-1">
            {lang === 'ne' ? 'ऋतु छनोट:' : 'Select Season:'}
          </span>
          {NEPALI_SEASONS_WELLNESS.map((season) => {
            const isSelected = season.id === selectedSeasonId;
            const isCurrent = season.id === currentSeasonId;
            return (
              <button
                key={season.id}
                type="button"
                onClick={() => setSelectedSeasonId(season.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-sm ring-1 ring-red-400/50'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 border border-stone-700/60'
                }`}
              >
                <span>{lang === 'ne' ? season.nameNe : season.nameEn.split(' ')[0]}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Current Season" />
                )}
              </button>
            );
          })}

          {selectedSeasonId !== currentSeasonId && (
            <button
              type="button"
              onClick={() => setSelectedSeasonId(currentSeasonId)}
              className="ml-auto text-xs text-amber-400 hover:underline font-bold whitespace-nowrap cursor-pointer"
            >
              {lang === 'ne' ? 'हालको ऋतुमा फर्कनुहोस्' : 'Return to Current'}
            </button>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('tips')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tips'
              ? 'bg-red-700 text-white shadow-xs'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>{lang === 'ne' ? 'ऋतुचर्या र खानपान' : 'Seasonal Tips & Diet'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('yoga')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'yoga'
              ? 'bg-red-700 text-white shadow-xs'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{lang === 'ne' ? 'अनुकूल योगासन' : 'Yoga Poses'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('meditation');
            initAudio();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'meditation'
              ? 'bg-red-700 text-white shadow-xs'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>{lang === 'ne' ? 'प्राणायाम र ध्यान' : 'Meditation & Breath'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('habits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'habits'
              ? 'bg-red-700 text-white shadow-xs'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{lang === 'ne' ? 'दैनिक स्वास्थ्य बानी' : 'Daily Habits & Tracker'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('regions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'regions'
              ? 'bg-red-700 text-white shadow-xs'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{lang === 'ne' ? 'भौगोलिक स्वास्थ्य (तराई-पहाड-हिमाल)' : 'Regional Climate Care'}</span>
        </button>
      </div>

      {/* 3. TAB 1: SEASONAL TIPS & DIET (ऋतुचर्या र खानपान) */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          
          {/* Daily Ayurvedic Quote */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-l-4 border-amber-600 dark:border-amber-500 p-4 rounded-r-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-serif italic text-stone-800 dark:text-stone-200">
                  "{lang === 'ne' ? dailyQuote.quoteNe : dailyQuote.quoteEn}"
                </p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 mt-1">
                  — {dailyQuote.author}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col (8 cols): Diet Recommendations (पथ्य र अपथ्य) & Daily Routine */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Diet Cards: What to Eat vs What to Avoid */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-5">
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Apple className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>{lang === 'ne' ? `${activeSeason.nameNe}मा आहार-विहार (पथ्य र अपथ्य)` : `${activeSeason.nameEn} Dietary Guidelines`}</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {lang === 'ne'
                      ? 'आयुर्वेद अनुसार ऋतु परिवर्तनसँगै खानाको छनोटले शरीरको दोष सन्तुलनमा राख्छ।'
                      : 'Aligning seasonal nutrition pacifies active doshas and maintains strong metabolic immunity.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Favorable Foods (पथ्य) */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'ne' ? 'खाने कुरा (पथ्य / Favorable)' : 'Recommended Foods'}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                      {(lang === 'ne' ? activeSeason.dietRecommendations.favorableNe : activeSeason.dietRecommendations.favorableEn).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Foods to Avoid (अपथ्य) */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-extrabold text-xs uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{lang === 'ne' ? 'बार्नुपर्ने (अपथ्य / Avoid)' : 'Foods to Moderate'}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                      {(lang === 'ne' ? activeSeason.dietRecommendations.avoidNe : activeSeason.dietRecommendations.avoidEn).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Classical Seasonal Daily Routine (दिनचर्या) */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
                <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>{lang === 'ne' ? `${activeSeason.nameNe}को दैनिक जीवनशैली (दिनचर्या)` : `${activeSeason.nameEn} Daily Lifestyle Guide`}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(lang === 'ne' ? activeSeason.dailyRitucharyaNe : activeSeason.dailyRitucharyaEn).map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                        {toNepaliDigits(idx + 1)}
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pt-0.5">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col (4 cols): Traditional Herbal Remedy & Climate Health Risks */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Traditional Nepali Home Herbal Brew Card */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-stone-50 dark:from-stone-900 dark:via-amber-950/20 dark:to-stone-900 rounded-3xl p-5 sm:p-6 border border-amber-200 dark:border-amber-900/60 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                  <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {lang === 'ne' ? 'घरेलु जडीबुटी काढा (Herbal Brew)' : 'Authentic Herbal Decoction'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-stone-900 dark:text-white">
                    {lang === 'ne' ? activeSeason.herbalRemedy.nameNe : activeSeason.herbalRemedy.nameEn}
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium mt-0.5">
                    {lang === 'ne' ? activeSeason.herbalRemedy.benefitNe : activeSeason.herbalRemedy.benefitEn}
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-stone-800/80 rounded-2xl border border-amber-200/80 dark:border-stone-700 text-xs space-y-2">
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ne' ? 'आवश्यक सामग्रीहरू:' : 'Ingredients:'}</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                    {lang === 'ne' ? activeSeason.herbalRemedy.ingredientsNe : activeSeason.herbalRemedy.ingredientsEn}
                  </p>

                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 pt-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>{lang === 'ne' ? 'बनाउने र सेवन गर्ने विधि:' : 'Method:'}</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                    {lang === 'ne' ? activeSeason.herbalRemedy.instructionsNe : activeSeason.herbalRemedy.instructionsEn}
                  </p>
                </div>
              </div>

              {/* Climate Health Risks */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
                <h4 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>{lang === 'ne' ? 'मौसमजन्य स्वास्थ्य जोखिम र सतर्कता' : 'Seasonal Health Risks & Vigilance'}</span>
                </h4>

                <div className="space-y-2">
                  {(lang === 'ne' ? activeSeason.climateRisksNe : activeSeason.climateRisksEn).map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. TAB 2: SEASONAL YOGA POSES (अनुकूल योगासनहरू) */}
      {activeTab === 'yoga' && (
        <div className="space-y-6">
          
          {/* Header & Filter pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <div>
              <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-700 dark:text-red-400" />
                <span>{lang === 'ne' ? `${activeSeason.nameNe} अनुकूल योगासनहरू` : `Yoga Poses for ${activeSeason.nameEn}`}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {lang === 'ne'
                  ? 'मौसम अनुसार शरीरको लचकता, पाचन र स्नायु प्रणाली बलियो बनाउने शास्त्रीय आसनहरू।'
                  : 'Traditional Asanas calibrated to balance seasonal energy, enhance immunity, and improve flexibility.'}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', ne: 'सबै आसन', en: 'All Poses' },
                { id: 'strength', ne: 'शक्ति', en: 'Strength' },
                { id: 'relaxation', ne: 'विश्राम', en: 'Relaxation' },
                { id: 'digestion', ne: 'पाचन', en: 'Digestion' },
                { id: 'flexibility', ne: 'लचकता', en: 'Flexibility' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setYogaCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    yogaCategory === cat.id
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {lang === 'ne' ? cat.ne : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Yoga Pose Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredYogaPoses.map((pose) => {
              const isAffinity = pose.seasonAffinity.includes(activeSeason.id);
              return (
                <div
                  key={pose.id}
                  className={`rounded-3xl p-5 sm:p-6 bg-white dark:bg-stone-900 border transition-all hover:shadow-md flex flex-col justify-between space-y-4 ${
                    isAffinity
                      ? 'border-amber-300 dark:border-amber-800/60 ring-1 ring-amber-400/20'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {lang === 'ne' ? pose.categoryNe : pose.categoryEn}
                      </span>
                      {isAffinity && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                          ★ {lang === 'ne' ? 'ऋतु विशेष' : 'Season Pick'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-stone-900 dark:text-white">
                        {lang === 'ne' ? pose.nameNe : pose.nameEn}
                      </h4>
                      <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400">
                        {pose.sanskritName}
                      </p>
                    </div>

                    <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        <span>{lang === 'ne' ? `अवधि: ${toNepaliDigits(pose.durationMinutes)} मिनेट` : `Duration: ${pose.durationMinutes} mins`}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{lang === 'ne' ? `लक्षित क्षेत्र: ${pose.targetAreaNe}` : `Target: ${pose.targetAreaEn}`}</span>
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
                        {lang === 'ne' ? 'मुख्य फाइदाहरू:' : 'Key Benefits:'}
                      </span>
                      <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                        {(lang === 'ne' ? pose.benefitsNe : pose.benefitsEn).slice(0, 2).map((b, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Open Details & Interactive Practice Timer */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYogaPose(pose);
                      setPoseTimerSeconds(pose.durationMinutes * 60);
                      setInitialPoseSeconds(pose.durationMinutes * 60);
                      setIsPoseTimerRunning(false);
                      initAudio();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:text-white text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{lang === 'ne' ? 'अभ्यास विधि र टाइमर हेर्नुहोस्' : 'Instructions & Practice Timer'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selected Yoga Pose Modal / Drawer */}
          {selectedYogaPose && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                
                <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400 block mb-1">
                      {lang === 'ne' ? selectedYogaPose.categoryNe : selectedYogaPose.categoryEn} • {lang === 'ne' ? selectedYogaPose.levelNe : selectedYogaPose.levelEn}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                      {lang === 'ne' ? selectedYogaPose.nameNe : selectedYogaPose.nameEn}
                    </h3>
                    <p className="text-xs font-serif italic text-stone-500">
                      {selectedYogaPose.sanskritName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYogaPose(null);
                      setIsPoseTimerRunning(false);
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Built-in Interactive Pose Timer */}
                <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50 dark:from-stone-800 dark:to-stone-800/80 rounded-2xl border border-red-200/80 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-red-700 dark:text-red-400" />
                      {lang === 'ne' ? 'आसन अभ्यास टाइमर (Pose Timer)' : 'Live Practice Timer'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-stone-900 dark:text-white mt-1">
                      {toNepaliDigits(Math.floor(poseTimerSeconds / 60))}:{toNepaliDigits(String(poseTimerSeconds % 60).padStart(2, '0'))}
                      <span className="text-xs font-normal text-stone-500 ml-1.5">
                        ({lang === 'ne' ? 'बाँकी' : 'remaining'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPoseTimerRunning(!isPoseTimerRunning)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        isPoseTimerRunning
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-red-700 hover:bg-red-800 text-white'
                      }`}
                    >
                      {isPoseTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPoseTimerRunning ? (lang === 'ne' ? 'रोक्नुहोस्' : 'Pause') : (lang === 'ne' ? 'सुरु गर्नुहोस्' : 'Start')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPoseTimerRunning(false);
                        setPoseTimerSeconds(initialPoseSeconds);
                      }}
                      className="p-2 rounded-xl bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600 hover:bg-stone-100 cursor-pointer"
                      title={lang === 'ne' ? 'रिसेट' : 'Reset'}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSoundMuted(!isSoundMuted)}
                      className="p-2 rounded-xl bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600 hover:bg-stone-100 cursor-pointer"
                      title={isSoundMuted ? 'Unmute Bell' : 'Mute Bell'}
                    >
                      {isSoundMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2">
                  <h5 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    {lang === 'ne' ? 'आसन गर्ने क्रमबद्ध विधिहरू (Steps):' : 'Step-by-Step Execution:'}
                  </h5>
                  <div className="space-y-2">
                    {(lang === 'ne' ? selectedYogaPose.stepsNe : selectedYogaPose.stepsEn).map((step, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs text-stone-700 dark:text-stone-300 leading-relaxed border border-stone-100 dark:border-stone-800">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Precautions */}
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                  <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {lang === 'ne' ? 'सावधानी (Precautions):' : 'Precautions & Contraindications:'}
                  </span>
                  <ul className="list-disc list-inside text-stone-600 dark:text-stone-300 pl-1 text-[11px] space-y-0.5">
                    {(lang === 'ne' ? selectedYogaPose.precautionsNe : selectedYogaPose.precautionsEn).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. TAB 3: PRANAYAMA & MEDITATION STUDIO (प्राणायाम र ध्यान स्टुडियो) */}
      {activeTab === 'meditation' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Col (7 cols): Interactive Visual Breath Pacer */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6 flex flex-col items-center text-center">
              
              <div className="space-y-1 max-w-md">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {lang === 'ne' ? 'प्रत्यक्ष श्वासप्रश्वास मार्गदर्शक' : 'Interactive Breathing Orb'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  {lang === 'ne' ? activePranayama.nameNe : activePranayama.nameEn}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'ne' ? activePranayama.taglineNe : activePranayama.taglineEn}
                </p>
              </div>

              {/* Central Pulsating Orb */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4 select-none">
                {/* Outer Ring */}
                <div 
                  className={`absolute inset-0 rounded-full border-4 border-dashed transition-all duration-1000 ${
                    isBreathingActive 
                      ? breathPhase === 'inhale' 
                        ? 'border-teal-400 scale-105 rotate-45' 
                        : breathPhase === 'hold' 
                          ? 'border-amber-400 scale-105' 
                          : breathPhase === 'exhale' 
                            ? 'border-indigo-400 scale-95 -rotate-45'
                            : 'border-stone-400 scale-90'
                      : 'border-stone-300 dark:border-stone-700'
                  }`}
                />

                {/* Inner Breathing Core */}
                <div
                  className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${
                    isBreathingActive
                      ? breathPhase === 'inhale'
                        ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white scale-110 shadow-teal-500/30'
                        : breathPhase === 'hold'
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white scale-110 shadow-amber-500/30'
                          : breathPhase === 'exhale'
                            ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white scale-90 shadow-indigo-500/30'
                            : 'bg-gradient-to-br from-stone-600 to-stone-700 text-white scale-85'
                      : 'bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">
                    {isBreathingActive ? (
                      breathPhase === 'inhale'
                        ? (lang === 'ne' ? 'श्वास तान्नुहोस् (Inhale)' : 'Inhale')
                        : breathPhase === 'hold'
                          ? (lang === 'ne' ? 'रोक्नुहोस् (Hold)' : 'Hold')
                          : breathPhase === 'exhale'
                            ? (lang === 'ne' ? 'छोड्नुहोस् (Exhale)' : 'Exhale')
                            : (lang === 'ne' ? 'विश्राम (Pause)' : 'Rest')
                    ) : (
                      lang === 'ne' ? 'तयार हुनुहोस्' : 'Ready'
                    )}
                  </span>

                  <span className="text-4xl sm:text-5xl font-mono font-black tracking-tight">
                    {isBreathingActive ? toNepaliDigits(breathSecondsRemaining) : '०'}
                  </span>

                  <span className="text-[11px] font-medium opacity-80 mt-1">
                    {lang === 'ne' 
                      ? `${toNepaliDigits(completedBreathCycles)} चक्र सम्पन्न` 
                      : `${completedBreathCycles} cycles done`}
                  </span>
                </div>
              </div>

              {/* Breath Pacer Controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    initAudio();
                    setIsBreathingActive(!isBreathingActive);
                    if (!isBreathingActive) {
                      setBreathPhase('inhale');
                      setBreathSecondsRemaining(activePranayama.pattern.inhale);
                      playTibetanBell(audioCtxRef.current);
                    }
                  }}
                  className={`py-3 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    isBreathingActive
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-teal-700 hover:bg-teal-800 text-white'
                  }`}
                >
                  {isBreathingActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isBreathingActive ? (lang === 'ne' ? 'विश्राम लिनुहोस्' : 'Pause Practice') : (lang === 'ne' ? 'अभ्यास सुरु गर्नुहोस्' : 'Start Breathing')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsBreathingActive(false);
                    setCompletedBreathCycles(0);
                    setBreathPhase('inhale');
                    setBreathSecondsRemaining(activePranayama.pattern.inhale);
                  }}
                  className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer"
                  title={lang === 'ne' ? 'रिसेट गर्नुहोस्' : 'Reset Cycles'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSoundMuted(!isSoundMuted)}
                  className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer"
                  title={isSoundMuted ? 'Unmute Bell' : 'Mute Bell'}
                >
                  {isSoundMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
                </button>
              </div>

              {/* Rhythmic Pattern Indicator */}
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-600 dark:text-stone-400 pt-2">
                <span>In: {toNepaliDigits(activePranayama.pattern.inhale)}s</span>
                <span>•</span>
                <span>Hold: {toNepaliDigits(activePranayama.pattern.hold)}s</span>
                <span>•</span>
                <span>Out: {toNepaliDigits(activePranayama.pattern.exhale)}s</span>
                {activePranayama.pattern.pause > 0 && (
                  <>
                    <span>•</span>
                    <span>Rest: {toNepaliDigits(activePranayama.pattern.pause)}s</span>
                  </>
                )}
              </div>

            </div>

            {/* Right Col (5 cols): Exercises Selector & Benefits */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
                <h4 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                  <Flower2 className="w-4 h-4 text-teal-600" />
                  <span>{lang === 'ne' ? 'प्राणायाम विधि छान्नुहोस्' : 'Select Breathing Practice'}</span>
                </h4>

                <div className="space-y-2.5">
                  {PRANAYAMA_EXERCISES.map((p) => {
                    const isSelected = p.id === selectedPranayamaId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPranayamaId(p.id);
                          setIsBreathingActive(false);
                          setBreathPhase('inhale');
                          setBreathSecondsRemaining(p.pattern.inhale);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 shadow-2xs ring-1 ring-teal-400/30'
                            : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${isSelected ? 'text-teal-900 dark:text-teal-300' : 'text-stone-900 dark:text-white'}`}>
                            {lang === 'ne' ? p.nameNe : p.nameEn}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {p.pattern.inhale}-{p.pattern.hold}-{p.pattern.exhale}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                          {lang === 'ne' ? p.taglineNe : p.taglineEn}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Exercise Benefits */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {lang === 'ne' ? 'अभ्यासका मुख्य फाइदाहरू:' : 'Scientific Benefits:'}
                  </span>
                  <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                    {(lang === 'ne' ? activePranayama.benefitsNe : activePranayama.benefitsEn).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold shrink-0">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 mt-2">
                    <span className="font-bold">{lang === 'ne' ? 'सावधानी: ' : 'Caution: '}</span>
                    {lang === 'ne' ? activePranayama.contraindicationsNe : activePranayama.contraindicationsEn}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* 6. TAB 4: DAILY HABITS & TRACKER (दैनिक स्वास्थ्य बानी) */}
      {activeTab === 'habits' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Water Tracker Card */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                    {lang === 'ne' ? 'जलपान निगरानी' : 'Hydration Tracker'}
                  </span>
                  <h4 className="text-lg font-black text-stone-900 dark:text-white">
                    {lang === 'ne' ? 'दैनिक पानी पिउने लक्ष्य (८ गिलास)' : 'Daily 8-Glass Water Goal'}
                  </h4>
                </div>
                <div className="text-2xl font-mono font-black text-sky-600 dark:text-sky-400">
                  {toNepaliDigits(waterGlasses)} / {toNepaliDigits(8)}
                </div>
              </div>

              {/* 8 Glass Visual Grid */}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const isFilled = idx < waterGlasses;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateWater(isFilled ? -1 : 1)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                        isFilled
                          ? 'bg-sky-500 text-white border-sky-600 shadow-sm scale-98'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-400 border-dashed border-stone-300 dark:border-stone-700 hover:border-sky-400'
                      }`}
                      title={`गिलास #${idx + 1}`}
                    >
                      <Droplets className={`w-6 h-6 mb-1 ${isFilled ? 'text-white' : 'text-stone-300 dark:text-stone-600'}`} />
                      <span className="text-[10px] font-bold">
                        {toNepaliDigits(idx + 1)} {lang === 'ne' ? 'गिलास' : 'Glass'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => updateWater(1)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Droplets className="w-4 h-4" />
                  <span>{lang === 'ne' ? '१ गिलास थप्नुहोस् (+१)' : '+1 Glass (250ml)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateWater(-1)}
                  className="py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs transition-all cursor-pointer"
                >
                  {lang === 'ne' ? 'घटाउनुहोस् (-१)' : '-1'}
                </button>
              </div>

              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                {lang === 'ne'
                  ? '💡 सुझाव: जाडो वा चिसो मौसममा फ्रिजको सट्टा थर्मसमा मनतातो पानी राखेर नियमित पिउनुहोस्।'
                  : '💡 Tip: During autumn and winter, sip warm boiled water from a thermos to keep metabolism humming.'}
              </p>
            </div>

            {/* Daily Wellness Checklist */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  {lang === 'ne' ? 'दैनिक संकल्प' : 'Daily Checklist'}
                </span>
                <h4 className="text-lg font-black text-stone-900 dark:text-white">
                  {lang === 'ne' ? 'आजका स्वास्थ्य बानीहरू' : 'Today\'s Wellness Intentions'}
                </h4>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'morning_walk', ne: '२० मिनेट बिहानी हिँडाइ वा सूर्य नमस्कार', en: '20-min Morning walk or Surya Namaskar' },
                  { id: 'hydration_goal', ne: 'कम्तीमा २ लिटर शुद्ध पानी पिउने', en: '2 Liters adequate hydration' },
                  { id: 'fruit_herb', ne: 'मौसमी फलफूल (अमला/स्याउ) वा जडीबुटी चिया', en: 'Seasonal fruit (Amala/Orange) or herbal tea' },
                  { id: 'meditation_10', ne: '१० मिनेट गहिरो ध्यान वा अनुलोम-विलोम', en: '10-min mindful breathing / meditation' },
                  { id: 'digital_detox', ne: 'सुत्नुभन्दा १ घण्टा अगाडि मोबाइल बन्द', en: 'Digital detox 1 hour before sleep' },
                ].map((habit) => {
                  const isDone = !!habitsCompleted[habit.id];
                  return (
                    <button
                      key={habit.id}
                      type="button"
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer border ${
                        isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 text-stone-800 dark:text-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 ${
                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'
                      }`}>
                        {isDone && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs font-semibold ${isDone ? 'line-through opacity-80' : ''}`}>
                        {lang === 'ne' ? habit.ne : habit.en}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400">
                {lang === 'ne'
                  ? `तपाईँको प्रगति यस यन्त्रमा सुरक्षित रहन्छ (${toNepaliDigits(Object.values(habitsCompleted).filter(Boolean).length)}/५ सम्पन्न)।`
                  : `Your progress is saved locally (${Object.values(habitsCompleted).filter(Boolean).length}/5 completed).`}
              </div>
            </div>

          </div>

          {/* Reminders & Notification Preferences Box */}
          <div className="bg-gradient-to-r from-stone-50 via-white to-amber-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ne' ? 'दैनिक योग तथा स्वास्थ्य रिमाइन्डर' : 'Daily Yoga & Wellness Reminders'}</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' 
                    ? 'दैनिक नियमित दिनचर्या कायम राख्न अलर्ट र सूचनाहरू सक्रिय गर्नुहोस्।' 
                    : 'Configure automatic daily prompts to stay mindful, hydrated, and active.'}
                </p>
              </div>

              <button
                type="button"
                onClick={requestNotificationPermission}
                className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'ब्राउजर नोटिफिकेसन सक्रिय' : 'Enable Browser Alerts'}</span>
              </button>
            </div>

            {notificationStatus && (
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800">
                {notificationStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                { key: 'morningYoga' as const, ne: 'बिहानी योग (६:०० AM)', en: 'Morning Yoga (6:00 AM)' },
                { key: 'waterReminder' as const, ne: 'दिउँसो पानी पिउने (प्रत्येक २ घन्टा)', en: 'Water Hydration (Every 2h)' },
                { key: 'eveningMeditation' as const, ne: 'साँझको ध्यान (८:०० PM)', en: 'Evening Meditation (8:00 PM)' },
              ].map((rem) => {
                const isActive = reminders[rem.key];
                return (
                  <button
                    key={rem.key}
                    type="button"
                    onClick={() => toggleReminderSetting(rem.key)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-white dark:bg-stone-800 border-amber-400 dark:border-amber-600 shadow-2xs'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-400'
                    }`}
                  >
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {lang === 'ne' ? rem.ne : rem.en}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {isActive ? (lang === 'ne' ? 'सक्रिय' : 'ON') : (lang === 'ne' ? 'निष्क्रिय' : 'OFF')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 7. TAB 5: REGIONAL CLIMATE HEALTH GUIDES (भौगोलिक स्वास्थ्य) */}
      {activeTab === 'regions' && (
        <div className="space-y-6">
          
          {/* Region Switcher Pills */}
          <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-x-auto">
            {REGION_HEALTH_GUIDES.map((rg) => {
              const isSelected = rg.id === selectedRegionId;
              return (
                <button
                  key={rg.id}
                  type="button"
                  onClick={() => setSelectedRegionId(rg.id)}
                  className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {lang === 'ne' ? rg.titleNe : rg.titleEn}
                </button>
              );
            })}
          </div>

          {/* Active Region Guide Details */}
          {(() => {
            const activeRegion = REGION_HEALTH_GUIDES.find((r) => r.id === selectedRegionId) || REGION_HEALTH_GUIDES[0];
            return (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400 block mb-0.5">
                      {lang === 'ne' ? 'नेपालको भौगोलिक स्वास्थ्य मार्गदर्शन' : 'Geographic Climate Care'}
                    </span>
                    <h3 className="text-xl font-black text-stone-900 dark:text-white">
                      {lang === 'ne' ? activeRegion.titleNe : activeRegion.titleEn}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'ne' ? activeRegion.geographyNe : activeRegion.geographyEn} • {lang === 'ne' ? `उचाइ: ${activeRegion.elevation}` : `Elevation: ${activeRegion.elevation}`}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-mono font-bold self-start sm:self-auto">
                    {activeRegion.elevation}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Climate attributes */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                    <span className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <Sun className="w-4 h-4 text-amber-600" />
                      {lang === 'ne' ? 'मौसमी विशेषता' : 'Climate Factors'}
                    </span>
                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                      {(lang === 'ne' ? activeRegion.climateAttributesNe : activeRegion.climateAttributesEn).map((attr, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span>{attr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Seasonal health risks */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
                    <span className="text-xs font-black text-rose-900 dark:text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      {lang === 'ne' ? 'जोखिम र रोगहरू' : 'Health Risks'}
                    </span>
                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                      {(lang === 'ne' ? activeRegion.seasonalRisksNe : activeRegion.seasonalRisksEn).map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold shrink-0">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lifestyle & preventive tips */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {lang === 'ne' ? 'बच्ने उपायहरू' : 'Protective Tips'}
                    </span>
                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                      {(lang === 'ne' ? activeRegion.lifestyleTipsNe : activeRegion.lifestyleTipsEn).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
};
