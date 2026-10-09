import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Sun, 
  Moon, 
  Clock, 
  Compass, 
  Sparkles, 
  Flag, 
  Plus, 
  Trash2, 
  ArrowRight,
  Share2,
  Check
} from 'lucide-react';
import { CalendarDay, Language } from '../types';
import { 
  BS_MONTH_NAMES_NE, 
  BS_MONTH_NAMES_EN, 
  NEPALI_DAYS_NE, 
  NEPALI_DAYS_EN, 
  toNepaliDigits, 
  getPanchangaForDate 
} from '../utils/nepaliCalendar';
import { 
  getTithiDetails, 
  getYogaDetails, 
  getKaranaDetails 
} from '../utils/panchangaDetails';

export interface UserNote {
  id: string;
  bsDateKey: string;
  text: string;
  createdAt: string;
}

interface DayDetailModalProps {
  day: CalendarDay | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  notes: UserNote[];
  onAddNote: (bsDateKey: string, text: string) => void;
  onDeleteNote: (id: string) => void;
  onOpenMonthView?: (year: number, month: number, day: number) => void;
  onNavigate?: (tab: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  isOpen,
  onClose,
  lang,
  notes,
  onAddNote,
  onDeleteNote,
  onOpenMonthView,
  onNavigate,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen || !day) return null;

  const bsDateKey = `${day.bsYear}-${day.bsMonth}-${day.bsDay}`;
  const dayNotes = notes.filter((n) => n.bsDateKey === bsDateKey);
  const panchanga = day.panchanga || getPanchangaForDate(day.bsYear, day.bsMonth, day.bsDay);

  const tithiInfo = getTithiDetails(panchanga.tithi);
  const yogaInfo = getYogaDetails(panchanga.yoga);
  const karanaInfo = getKaranaDetails(panchanga.karana);

  const monthName = lang === 'ne' 
    ? BS_MONTH_NAMES_NE[day.bsMonth - 1] 
    : BS_MONTH_NAMES_EN[day.bsMonth - 1];

  const dayOfWeekName = lang === 'ne' 
    ? NEPALI_DAYS_NE[day.dayOfWeek] 
    : NEPALI_DAYS_EN[day.dayOfWeek];

  const fullBsDateStr = lang === 'ne'
    ? `${toNepaliDigits(day.bsDay)} ${monthName} ${toNepaliDigits(day.bsYear)}, ${dayOfWeekName}`
    : `${day.bsDay} ${monthName} ${day.bsYear}, ${dayOfWeekName}`;

  const adDateFormatted = day.adDate.toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(bsDateKey, newNoteText.trim());
    setNewNoteText('');
  };

  const handleShare = () => {
    const textToShare = `${fullBsDateStr} (${day.adDate.toDateString()})\nतिथी: ${panchanga.tithi}\nनक्षत्र: ${panchanga.nakshatra}\nसूर्योदय: ${panchanga.sunrise} | सूर्यास्त: ${panchanga.sunset}\nनेपाली क्यालेन्डर`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 text-white p-5 sm:p-6 relative shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {day.isToday && (
                  <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {lang === 'ne' ? 'आज (Today)' : 'Today'}
                  </span>
                )}
                {day.isHoliday && (
                  <span className="bg-red-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {lang === 'ne' ? 'सार्वजनिक बिदा' : 'Public Holiday'}
                  </span>
                )}
                {day.isSaturday && !day.isHoliday && (
                  <span className="bg-white/20 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                    {lang === 'ne' ? 'साप्ताहिक बिदा' : 'Saturday Off'}
                  </span>
                )}
                <span className="bg-sky-950/60 text-sky-100 font-bold text-[10px] px-2 py-0.5 rounded-full border border-sky-400/30">
                  {lang === 'ne' ? `तिथी: ${panchanga.tithi}` : `Tithi: ${panchanga.tithiEn}`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{fullBsDateStr}</span>
              </h2>

              <p className="text-xs sm:text-sm text-sky-100 font-medium mt-1 flex items-center gap-1.5">
                <span>📅 AD: {adDateFormatted}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title={lang === 'ne' ? 'मिति विवरण कपी गर्नुहोस्' : 'Copy date details'}
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-800 dark:text-stone-200">
          
          {/* Section 1: Festivals & Events on this day */}
          {day.events && day.events.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'यस दिनका मुख्य चाडपर्व तथा विशेष दिवस' : 'Events & Festivals on this Day'}</span>
              </h3>
              <div className="space-y-2">
                {day.events.map((ev, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      ev.isHoliday
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                        : 'bg-sky-50/60 dark:bg-stone-800/60 border-sky-100 dark:border-stone-700/60'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                        {lang === 'ne' ? ev.titleNe : ev.titleEn}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {lang === 'ne' ? 'नेपाली सांस्कृतिक पञ्चाङ्ग पर्व' : 'Cultural & National Observance'}
                      </p>
                    </div>
                    {ev.isHoliday && (
                      <span className="text-[10px] bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                        {lang === 'ne' ? 'सार्वजनिक बिदा' : 'Holiday'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-stone-400" />
              <span>{lang === 'ne' ? 'यस दिनमा कुनै विशेष सार्वजनिक बिदा छैन।' : 'No official public holiday recorded on this day.'}</span>
            </div>
          )}

          {/* Section 2: Complete Vedic Panchanga Details */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-3 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'सम्पूर्ण पञ्चाङ्ग तथा मुहूर्त विवरण' : 'Detailed Vedic Panchanga & Timings'}</span>
            </h3>

            {/* Three Pillars: Tithi, Yoga, and Karana Highlights */}
            <div className="space-y-3 mb-4">
              {/* Tithi Detail Box */}
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-black uppercase text-amber-900 dark:text-amber-200">
                      {lang === 'ne' ? '१. तिथि विश्लेषण' : '1. Tithi (Lunar Phase)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                      {lang === 'ne' ? `${tithiInfo.categoryNe} तिथि` : `${tithiInfo.categoryEn} Tithi`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {lang === 'ne' ? tithiInfo.pakshaNe : tithiInfo.pakshaEn}
                    </span>
                  </div>
                </div>
                <div className="text-base font-extrabold text-stone-900 dark:text-white mb-1">
                  {lang === 'ne' ? panchanga.tithi : panchanga.tithiEn}
                </div>
                <p className="text-xs text-amber-950 dark:text-amber-200/90 leading-relaxed">
                  {lang === 'ne' ? tithiInfo.significanceNe : tithiInfo.significanceEn}
                </p>
                <div className="mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                  {lang === 'ne' ? `अधिष्ठाता देवता: ${tithiInfo.deityNe}` : `Ruling Deity: ${tithiInfo.deityEn}`}
                </div>
              </div>

              {/* Yoga & Karana Two-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Yoga Detail Box */}
                <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-xs font-black uppercase text-sky-900 dark:text-sky-200">
                      {lang === 'ne' ? '२. योग (Yoga)' : '2. Astrological Yoga'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      yogaInfo.type === 'shubh'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    }`}>
                      {lang === 'ne' ? yogaInfo.typeNe : yogaInfo.typeEn}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-stone-900 dark:text-white mb-1">
                    {panchanga.yoga} {lang === 'ne' ? 'योग' : 'Yoga'}
                  </div>
                  <p className="text-xs text-sky-950 dark:text-sky-200/90 leading-relaxed">
                    {lang === 'ne' ? yogaInfo.guidanceNe : yogaInfo.guidanceEn}
                  </p>
                  <div className="mt-2 pt-2 border-t border-sky-200/60 dark:border-sky-900/40 text-[11px] text-sky-800 dark:text-sky-400 font-medium">
                    {lang === 'ne' ? `देवता: ${yogaInfo.deityNe}` : `Deity: ${yogaInfo.deityEn}`}
                  </div>
                </div>

                {/* Karana Detail Box */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-xs font-black uppercase text-indigo-900 dark:text-indigo-200">
                      {lang === 'ne' ? '३. करण (Karana)' : '3. Half-Tithi Karana'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      karanaInfo.isBhadra
                        ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100 animate-pulse'
                        : 'bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200'
                    }`}>
                      {karanaInfo.isBhadra ? (lang === 'ne' ? '⚠️ भद्रा' : '⚠️ Bhadra') : (lang === 'ne' ? karanaInfo.categoryNe : karanaInfo.categoryEn)}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-stone-900 dark:text-white mb-1">
                    {panchanga.karana} {lang === 'ne' ? 'करण' : 'Karana'}
                  </div>
                  <p className="text-xs text-indigo-950 dark:text-indigo-200/90 leading-relaxed">
                    {lang === 'ne' ? karanaInfo.guidanceNe : karanaInfo.guidanceEn}
                  </p>
                  <div className="mt-2 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 text-[11px] text-indigo-800 dark:text-indigo-400 font-medium">
                    {lang === 'ne' ? `देवता/प्रतीक: ${karanaInfo.deityNe}` : `Symbol/Deity: ${karanaInfo.deityEn}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Astronomical & Timing Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {/* Sunrise / Sunset */}
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'ne' ? 'सूर्योदय' : 'Sunrise'}</span>
                </div>
                <div className="font-extrabold text-stone-900 dark:text-white text-sm">{panchanga.sunrise}</div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 font-bold mb-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{lang === 'ne' ? 'सूर्यास्त' : 'Sunset'}</span>
                </div>
                <div className="font-extrabold text-stone-900 dark:text-white text-sm">{panchanga.sunset}</div>
              </div>

              {/* Nakshatra */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">{lang === 'ne' ? 'नक्षत्र' : 'Nakshatra'}</span>
                <span className="font-bold text-stone-900 dark:text-white">{lang === 'ne' ? panchanga.nakshatra : panchanga.nakshatraEn}</span>
              </div>

              {/* Moon Sign */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">{lang === 'ne' ? 'चन्द्र राशि' : 'Moon Sign'}</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{panchanga.chandraRashi}</span>
              </div>

              {/* Sun Sign */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">{lang === 'ne' ? 'सूर्य राशि' : 'Sun Sign'}</span>
                <span className="font-bold text-sky-700 dark:text-sky-400">{panchanga.suryaRashi}</span>
              </div>

              {/* Abhijit Muhurat */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                <span className="text-emerald-800 dark:text-emerald-300 text-[11px] font-bold block">{lang === 'ne' ? 'शुभ अभिजित मुहूर्त' : 'Auspicious Muhurat'}</span>
                <span className="font-extrabold text-emerald-950 dark:text-emerald-100">{panchanga.abhijitMuhurat}</span>
              </div>

              {/* Rahu Kaal */}
              <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                <span className="text-rose-800 dark:text-rose-300 text-[11px] font-bold block">{lang === 'ne' ? 'राहु काल (अशुभ)' : 'Rahu Kaal'}</span>
                <span className="font-bold text-rose-950 dark:text-rose-100">{panchanga.rahuKaal}</span>
              </div>

              {/* Season */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">{lang === 'ne' ? 'ऋतु' : 'Season'}</span>
                <span className="font-bold text-stone-900 dark:text-white">{panchanga.ritu}</span>
              </div>

              {/* Direction Sool */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">{lang === 'ne' ? 'दिशा शूल' : 'Disha Sool'}</span>
                <span className="font-semibold text-stone-900 dark:text-white">{panchanga.disaSool}</span>
              </div>
            </div>
          </div>

          {/* Section 3: User Personal Notes */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 flex items-center justify-between">
              <span>{lang === 'ne' ? 'यस दिनका व्यक्तिगत टिपोटहरू (Notes)' : 'Personal Notes for this Date'}</span>
              <span className="text-[10px] text-stone-400 font-normal">
                {dayNotes.length} {lang === 'ne' ? 'टिपोट' : 'note(s)'}
              </span>
            </h3>

            {dayNotes.length > 0 ? (
              <div className="space-y-2 mb-3">
                {dayNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="text-stone-900 dark:text-stone-100 font-medium">{note.text}</p>
                      <span className="text-[10px] text-stone-400">{note.createdAt}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      title={lang === 'ne' ? 'हटाउनुहोस्' : 'Delete note'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 mb-3 italic">
                {lang === 'ne' ? 'यस दिनमा कुनै टिपोट लेखिएको छैन।' : 'No personal notes saved for this date.'}
              </p>
            )}

            {/* Add note input */}
            <form onSubmit={handleCreateNote} className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'ne' ? 'नयाँ टिपोट वा रिमाइन्डर लेख्नुहोस्...' : 'Add a note or reminder for this date...'}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'थप्नुहोस्' : 'Add'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="bg-stone-50 dark:bg-stone-950/80 p-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {onOpenMonthView && (
            <button
              type="button"
              onClick={() => {
                onOpenMonthView(day.bsYear, day.bsMonth, day.bsDay);
                onClose();
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>
                {lang === 'ne' 
                  ? `${monthName} महिनाको पूरै क्यालेन्डर हेर्नुहोस्` 
                  : `Open Full ${monthName} Calendar`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
          >
            {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
