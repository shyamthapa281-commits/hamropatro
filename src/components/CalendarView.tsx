import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sun, 
  Moon, 
  Clock, 
  Compass, 
  Sparkles, 
  Flag, 
  Plus, 
  Trash2, 
  CheckCircle,
  X,
  Share2,
  HeartPulse,
  Leaf,
  CloudSun,
  Newspaper,
  Coins,
  Calculator as CalcIcon,
  ArrowLeftRight,
  Gamepad2,
  Building2,
  Languages,
  Flame,
  BookOpen
} from 'lucide-react';
import { 
  CalendarDay, 
  NepaliDate, 
  Language, 
  CalendarEvent, 
  Panchanga 
} from '../types';
import { 
  BS_MONTH_NAMES_NE, 
  BS_MONTH_NAMES_EN, 
  NEPALI_DAYS_SHORT_NE, 
  NEPALI_DAYS_SHORT_EN, 
  generateMonthGrid, 
  toNepaliDigits, 
  getPanchangaForDate,
  getCurrentNepaliDate,
  bsToAd
} from '../utils/nepaliCalendar';
import { NEPALI_SEASONS_WELLNESS } from '../data/healthWellnessData';
import { DailyMotivationCard } from './DailyMotivationCard';
import { CalendarSearchBar } from './CalendarSearchBar';

interface CalendarViewProps {
  todayBs: NepaliDate;
  lang: Language;
  onNavigate?: (tab: string) => void;
  onSelectDateForHoroscope?: (rashiIndex: number) => void;
  onOpenWellness?: () => void;
}

interface UserNote {
  id: string;
  bsDateKey: string; // "2081-1-15"
  text: string;
  createdAt: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ todayBs, lang, onNavigate, onOpenWellness }) => {
  const [currentYear, setCurrentYear] = useState<number>(todayBs.year);
  const [currentMonth, setCurrentMonth] = useState<number>(todayBs.month);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [highlightedDayKey, setHighlightedDayKey] = useState<string | null>(null);
  const [searchNotification, setSearchNotification] = useState<string | null>(null);

  // Active Nepali Season for Seasonal Wellness teaser
  const currentSeason = NEPALI_SEASONS_WELLNESS.find((s) => s.monthNumbers.includes(todayBs.month)) || NEPALI_SEASONS_WELLNESS[3];

  // User personal notes persisted in local storage
  const [notes, setNotes] = useState<UserNote[]>(() => {
    try {
      const saved = localStorage.getItem('hamro_patro_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newNoteText, setNewNoteText] = useState<string>('');

  const saveNotes = (updated: UserNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem('hamro_patro_notes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedDay) return;
    const key = `${selectedDay.bsYear}-${selectedDay.bsMonth}-${selectedDay.bsDay}`;
    const newNote: UserNote = {
      id: Date.now().toString(),
      bsDateKey: key,
      text: newNoteText.trim(),
      createdAt: new Date().toLocaleTimeString(),
    };
    saveNotes([...notes, newNote]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleJumpToday = () => {
    const today = getCurrentNepaliDate();
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
    const todayGrid = generateMonthGrid(today.year, today.month);
    const foundToday = todayGrid.find(d => d.isToday);
    if (foundToday) setSelectedDay(foundToday);
  };

  const handleSelectDateFromSearch = (year: number, month: number, day: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    const targetGrid = generateMonthGrid(year, month);
    const foundDay = targetGrid.find(d => d.isCurrentMonth && d.bsDay === day);
    if (foundDay) {
      setSelectedDay(foundDay);
    }
    const key = `${year}-${month}-${day}`;
    setHighlightedDayKey(key);

    const monthNe = BS_MONTH_NAMES_NE[month - 1];
    const monthEn = BS_MONTH_NAMES_EN[month - 1];
    const notificationText = lang === 'ne'
      ? `${toNepaliDigits(day)} ${monthNe} ${toNepaliDigits(year)} क्यालेन्डरमा चयन गरियो`
      : `Selected ${day} ${monthEn} ${year} in calendar`;
    setSearchNotification(notificationText);

    setTimeout(() => {
      const cell = document.getElementById(`cal-cell-${year}-${month}-${day}`);
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 120);

    setTimeout(() => {
      setHighlightedDayKey(prev => (prev === key ? null : prev));
    }, 4500);

    setTimeout(() => {
      setSearchNotification(null);
    }, 4500);
  };

  const monthGrid = generateMonthGrid(currentYear, currentMonth);

  const monthName = lang === 'ne' 
    ? BS_MONTH_NAMES_NE[currentMonth - 1] 
    : BS_MONTH_NAMES_EN[currentMonth - 1];

  const yearLabel = lang === 'ne' 
    ? `${toNepaliDigits(currentYear)} साल` 
    : `${currentYear} BS`;

  // Get English Month range corresponding to this BS month
  const firstDayAd = bsToAd(currentYear, currentMonth, 1);
  const lastDayAd = bsToAd(currentYear, currentMonth, monthGrid.filter(d => d.isCurrentMonth).length);
  const adMonthRange = `${firstDayAd.toLocaleString('default', { month: 'short' })} - ${lastDayAd.toLocaleString('default', { month: 'short' })} ${lastDayAd.getFullYear()}`;

  // Month events
  const monthHolidays = monthGrid
    .filter(d => d.isCurrentMonth && d.events.length > 0)
    .flatMap(d => d.events.map(e => ({ ...e, dayNum: d.bsDay, dayNumNe: d.bsDayNe })));

  const selectedDayKey = selectedDay 
    ? `${selectedDay.bsYear}-${selectedDay.bsMonth}-${selectedDay.bsDay}` 
    : '';
  const selectedDayNotes = notes.filter(n => n.bsDateKey === selectedDayKey);

  const daysHeader = lang === 'ne' ? NEPALI_DAYS_SHORT_NE : NEPALI_DAYS_SHORT_EN;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Calendar Quick Search Bar for Tithis & Festivals */}
      <CalendarSearchBar
        currentYear={currentYear}
        currentMonth={currentMonth}
        todayBs={todayBs}
        lang={lang}
        onSelectDate={handleSelectDateFromSearch}
        selectedDay={selectedDay}
      />

      {/* Search Selection Notification Banner */}
      {searchNotification && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>🎯 {searchNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setSearchNotification(null)}
            className="text-amber-800 dark:text-amber-400 hover:text-amber-950 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Calendar Controls & Quick Panchanga Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Calendar Card (Left/Center: 8 or 9 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-colors">
          {/* Header Bar with Month/Year picker and Navigation */}
          <div className="bg-gradient-to-r from-red-700 to-red-800 dark:from-stone-950 dark:to-red-950 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-red-900/30 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span>{monthName}</span>
                    <span className="text-amber-300">{yearLabel}</span>
                  </h2>
                </div>
                <span className="text-xs text-red-100 dark:text-stone-300 font-medium">{adMonthRange}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="calendar-jump-today-btn"
                onClick={handleJumpToday}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg border border-white/30 transition-colors cursor-pointer"
              >
                {lang === 'ne' ? 'आज' : 'Today'}
              </button>

              <div className="flex items-center bg-red-900/60 dark:bg-stone-800 rounded-xl p-0.5 border border-red-600/40 dark:border-stone-700">
                <button
                  id="calendar-prev-month-btn"
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-red-800/80 dark:hover:bg-stone-700 rounded-lg text-white transition-colors cursor-pointer"
                  title="अघिल्लो महिना (Previous Month)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  id="calendar-next-month-btn"
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-red-800/80 dark:hover:bg-stone-700 rounded-lg text-white transition-colors cursor-pointer"
                  title="पछिल्लो महिना (Next Month)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-stone-100/80 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-center py-2.5 text-xs font-bold uppercase tracking-wider">
            {daysHeader.map((dName, idx) => (
              <div 
                key={idx} 
                className={idx === 6 ? 'text-red-600 dark:text-red-400 font-extrabold' : 'text-stone-700 dark:text-stone-300'}
              >
                {dName}
                {idx === 6 && <span className="ml-1 text-[10px] text-red-500 dark:text-red-400 font-normal">({lang === 'ne' ? 'बिदा' : 'Off'})</span>}
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-stone-200 dark:divide-stone-800">
            {monthGrid.map((day, idx) => {
              const isSelected = selectedDay && 
                selectedDay.bsYear === day.bsYear && 
                selectedDay.bsMonth === day.bsMonth && 
                selectedDay.bsDay === day.bsDay;

              const isHighlighted = highlightedDayKey === `${day.bsYear}-${day.bsMonth}-${day.bsDay}`;

              const hasNotes = notes.some(
                n => n.bsDateKey === `${day.bsYear}-${day.bsMonth}-${day.bsDay}`
              );

              return (
                <div
                  key={idx}
                  id={`cal-cell-${day.bsYear}-${day.bsMonth}-${day.bsDay}`}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[102px] sm:min-h-[116px] md:min-h-[124px] p-1.5 sm:p-2 cursor-pointer transition-all duration-150 relative flex flex-col justify-between select-none group ${
                    isHighlighted
                      ? 'bg-amber-100/90 dark:bg-amber-950/80 ring-4 ring-red-600 dark:ring-red-400 z-10 scale-[1.02] shadow-md'
                      : !day.isCurrentMonth
                      ? 'bg-stone-50/50 dark:bg-stone-950/40 text-stone-300 dark:text-stone-700 opacity-60'
                      : day.isToday
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 ring-2 ring-inset ring-amber-500'
                      : isSelected
                      ? 'bg-red-50/80 dark:bg-red-950/50 ring-2 ring-inset ring-red-600 dark:ring-red-500'
                      : day.isSaturday || day.isHoliday
                      ? 'bg-red-50/20 dark:bg-red-950/20 hover:bg-red-50/50 dark:hover:bg-red-950/30'
                      : 'bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/80'
                  }`}
                >
                  {/* Top Row: BS Day (Large) & Tithi */}
                  <div className="flex items-baseline justify-between gap-1">
                    <span
                      className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none ${
                        !day.isCurrentMonth
                          ? 'text-stone-400 dark:text-stone-600'
                          : day.isSaturday || day.isHoliday
                          ? 'text-red-600 dark:text-red-400'
                          : day.isToday
                          ? 'text-amber-700 dark:text-amber-400 font-black'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {day.bsDayNe}
                    </span>

                    <span className={`text-[9.5px] sm:text-[11px] leading-tight truncate text-right font-medium max-w-[65%] ${
                      day.isToday ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-stone-500 dark:text-stone-400'
                    }`}>
                      {lang === 'ne' ? day.tithiNe : day.tithiEn}
                    </span>
                  </div>

                  {/* Middle: Event Box - Displays both primary title and secondary (parenthesized) info in one box */}
                  <div className="flex flex-col gap-0.5 my-1">
                    {day.events.slice(0, 1).map((ev) => {
                      const fullTitle = lang === 'ne' ? ev.titleNe : ev.titleEn;
                      // Detect secondary title in parentheses, e.g. "मातातीर्थ औंसी (आमाको मुख हेर्ने दिन)"
                      const parenMatch = fullTitle.match(/^(.*?)\s*(\([^\)]+\))$/);

                      return (
                        <div
                          key={ev.id}
                          className={`px-1.5 py-0.5 sm:py-1 rounded text-left transition-colors ${
                            ev.isHoliday
                              ? 'bg-red-100/95 dark:bg-red-950/85 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-900 shadow-2xs'
                              : 'bg-amber-100/95 dark:bg-amber-950/85 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-900 shadow-2xs'
                          }`}
                          title={fullTitle}
                        >
                          {parenMatch ? (
                            <div className="flex flex-col leading-tight">
                              <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold tracking-tight break-words">
                                {parenMatch[1]}
                              </span>
                              <span className={`text-[7.5px] sm:text-[8px] md:text-[8.5px] font-semibold tracking-tight break-words mt-0.5 ${
                                ev.isHoliday 
                                  ? 'text-red-800 dark:text-red-300' 
                                  : 'text-amber-800 dark:text-amber-300'
                              }`}>
                                {parenMatch[2]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-semibold leading-tight break-words line-clamp-2 block">
                              {fullTitle}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {day.events.length > 1 && (
                      <span className="text-[8.5px] text-red-600 dark:text-red-400 font-bold px-0.5">
                        +{day.events.length - 1} थप
                      </span>
                    )}
                  </div>

                  {/* Bottom Row: Status Tags on Left & English Date on Bottom Right */}
                  <div className="flex items-end justify-between mt-auto pt-0.5 gap-1">
                    <div className="flex items-center gap-1 flex-wrap">
                      {day.isToday && (
                        <span className="text-[9px] bg-amber-500 text-stone-950 font-bold px-1 rounded leading-tight">
                          {lang === 'ne' ? 'आज' : 'Today'}
                        </span>
                      )}

                      {isHighlighted && (
                        <span className="text-[9px] bg-red-600 text-white font-extrabold px-1 rounded shadow-xs leading-tight">
                          🔍 {lang === 'ne' ? 'नतिजा' : 'Match'}
                        </span>
                      )}

                      {hasNotes && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" title="Note saved" />
                      )}
                    </div>

                    <span
                      className={`text-xs sm:text-sm font-semibold tracking-tight font-sans ml-auto shrink-0 ${
                        !day.isCurrentMonth
                          ? 'text-stone-300 dark:text-stone-700'
                          : day.isToday
                          ? 'text-amber-800 dark:text-amber-300 font-bold'
                          : 'text-stone-400 dark:text-stone-500'
                      }`}
                    >
                      {day.adDay === 1 ? `${day.adMonthName} 1` : day.adDay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Year Selector Jump */}
          <div className="bg-stone-50 dark:bg-stone-950 px-4 py-3 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 dark:text-stone-400">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {lang === 'ne' ? 'वर्ष चयन गर्नुहोस् (BS):' : 'Select BS Year:'}
            </span>
            <div className="flex items-center gap-1.5">
              {[2080, 2081, 2082, 2083, 2084].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setCurrentYear(yr)}
                  className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                    currentYear === yr
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-red-300 dark:hover:border-stone-700'
                  }`}
                >
                  {toNepaliDigits(yr)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Daily Motivation, Quick Features Hub, Today's Full Panchanga & Selected Day Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Daily Motivation Card */}
          <DailyMotivationCard lang={lang} todayBs={todayBs} />

          {/* Quick Feature Navigation Hub */}
          {onNavigate && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800 p-4 transition-colors">
              <div className="flex items-center justify-between mb-3 border-b border-stone-100 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <h3 className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm uppercase tracking-wider">
                    {lang === 'ne' ? 'द्रुत सेवाहरू' : 'Quick Features'}
                  </h3>
                </div>
                <span className="text-[10px] text-stone-400 font-medium">
                  {lang === 'ne' ? 'सिधै जानुहोस्' : 'Instant Jump'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rashifal', labelNe: 'राशिफल', labelEn: 'Rashifal', icon: Sparkles },
                  { id: 'dharma', labelNe: 'धर्म / सपना', labelEn: 'Dharma & Dreams', icon: BookOpen },
                  { id: 'weather', labelNe: 'मौसम', labelEn: 'Weather', icon: CloudSun },
                  { id: 'news', labelNe: 'समाचार', labelEn: 'News', icon: Newspaper },
                  { id: 'forex', labelNe: 'मुद्रा / सुन', labelEn: 'Forex & Gold', icon: Coins },
                  { id: 'worldclock', labelNe: 'विश्व घडी', labelEn: 'World Clock', icon: Clock },
                  { id: 'calculator', labelNe: 'क्याल्कुलेटर', labelEn: 'Calculator', icon: CalcIcon },
                  { id: 'converter', labelNe: 'नाप रूपान्तरण', labelEn: 'Converters', icon: ArrowLeftRight },
                  { id: 'games', labelNe: 'सुडोकू र खेल', labelEn: 'Sudoku & Games', icon: Gamepad2 },
                  { id: 'health', labelNe: 'स्वास्थ्य / योग', labelEn: 'Wellness', icon: HeartPulse },
                  { id: 'govhelp', labelNe: 'सरकारी सेवा', labelEn: 'Gov Help', icon: Building2 },
                  { id: 'language', labelNe: 'भाषा सिकाई', labelEn: 'Language Hub', icon: Languages },
                  { id: 'festivals', labelNe: 'चाडपर्वहरू', labelEn: 'Festivals', icon: Flame },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`calendar-quick-nav-${item.id}`}
                      onClick={() => onNavigate(item.id)}
                      className="group flex flex-col items-center justify-center p-2 rounded-xl border border-red-200/60 dark:border-red-950 bg-red-50/50 hover:bg-red-100/70 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 transition-all duration-150 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                      title={lang === 'ne' ? `${item.labelNe} हेर्नुहोस्` : `Open ${item.labelEn}`}
                    >
                      <IconComp className="w-4 h-4 mb-1 shrink-0 text-red-700 dark:text-red-300 group-hover:scale-110 transition-transform" />
                      <span className="text-[10.5px] font-bold leading-tight truncate w-full text-center text-red-700 dark:text-red-300">
                        {lang === 'ne' ? item.labelNe : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day Detail & Panchanga Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-5 transition-colors">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-base">
                    {selectedDay 
                      ? (lang === 'ne' ? `${toNepaliDigits(selectedDay.bsDay)} ${BS_MONTH_NAMES_NE[selectedDay.bsMonth - 1]}` : `${selectedDay.bsDay} ${BS_MONTH_NAMES_EN[selectedDay.bsMonth - 1]}`)
                      : (lang === 'ne' ? 'आजको पञ्चाङ्ग' : "Today's Panchanga")}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {selectedDay 
                      ? `${selectedDay.adDate.toDateString()}` 
                      : todayBs.formattedEn}
                  </p>
                </div>
              </div>

              {selectedDay && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Panchanga Grid */}
            {(() => {
              const activePanchanga = selectedDay?.panchanga || getPanchangaForDate(todayBs.year, todayBs.month, todayBs.day);
              return (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-stone-50 dark:bg-stone-800/70 p-3 rounded-xl border border-stone-100 dark:border-stone-700/60">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{lang === 'ne' ? 'तिथी' : 'Tithi'}</span>
                      <span className="font-bold text-stone-800 dark:text-stone-100">{lang === 'ne' ? activePanchanga.tithi : activePanchanga.tithiEn}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{lang === 'ne' ? 'नक्षत्र' : 'Nakshatra'}</span>
                      <span className="font-bold text-stone-800 dark:text-stone-100">{lang === 'ne' ? activePanchanga.nakshatra : activePanchanga.nakshatraEn}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-stone-50 dark:bg-stone-800/70 p-3 rounded-xl border border-stone-100 dark:border-stone-700/60">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{lang === 'ne' ? 'योग' : 'Yoga'}</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-100">{activePanchanga.yoga}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{lang === 'ne' ? 'करण' : 'Karana'}</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-100">{activePanchanga.karana}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-stone-50 dark:bg-stone-800/70 p-3 rounded-xl border border-stone-100 dark:border-stone-700/60">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{lang === 'ne' ? 'चन्द्र राशि' : 'Moon Sign'}</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400">{activePanchanga.chandraRashi}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{lang === 'ne' ? 'सूर्य राशि' : 'Sun Sign'}</span>
                      <span className="font-bold text-red-700 dark:text-red-400">{activePanchanga.suryaRashi}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-amber-50/70 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/60">
                    <div className="flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div>
                        <span className="text-amber-800 dark:text-amber-300 block font-medium">{lang === 'ne' ? 'सूर्योदय' : 'Sunrise'}</span>
                        <span className="font-bold text-amber-950 dark:text-amber-100">{activePanchanga.sunrise}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div>
                        <span className="text-indigo-800 dark:text-indigo-300 block font-medium">{lang === 'ne' ? 'सूर्यास्त' : 'Sunset'}</span>
                        <span className="font-bold text-indigo-950 dark:text-indigo-100">{activePanchanga.sunset}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-stone-50 dark:bg-stone-800/70 p-3 rounded-xl border border-stone-100 dark:border-stone-700/60">
                    <div>
                      <span className="text-red-700 dark:text-red-400 block font-medium">{lang === 'ne' ? 'राहु काल (अशुभ)' : 'Rahu Kaal'}</span>
                      <span className="font-semibold text-red-950 dark:text-red-200">{activePanchanga.rahuKaal}</span>
                    </div>
                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400 block font-medium">{lang === 'ne' ? 'अभिजित मुहूर्त (शुभ)' : 'Abhijit Muhurat'}</span>
                      <span className="font-semibold text-emerald-950 dark:text-emerald-200">{activePanchanga.abhijitMuhurat}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Events for selected day */}
            {selectedDay && selectedDay.events.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-red-700 dark:text-red-400">
                  <Flag className="w-3.5 h-3.5" />
                  {lang === 'ne' ? 'यस दिनका चाडपर्वहरू' : 'Events & Festivals'}
                </h4>
                <div className="space-y-1.5">
                  {selectedDay.events.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-2.5 rounded-xl text-xs ${
                        ev.isHoliday 
                          ? 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 font-semibold'
                          : 'bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang === 'ne' ? ev.titleNe : ev.titleEn}</span>
                        {ev.isHoliday && (
                          <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                            {lang === 'ne' ? 'सार्वजनिक बिदा' : 'Public Holiday'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Notes Section for selected day */}
            {selectedDay && (
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {lang === 'ne' ? 'व्यक्तिगत टिपोट (Notes)' : 'My Notes & Reminders'}
                </h4>

                {/* Existing notes */}
                <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
                  {selectedDayNotes.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">
                      {lang === 'ne' ? 'यस दिनको कुनै टिपोट छैन।' : 'No notes saved for this date.'}
                    </p>
                  ) : (
                    selectedDayNotes.map((note) => (
                      <div 
                        key={note.id} 
                        className="flex items-start justify-between gap-2 p-2 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-lg text-xs"
                      >
                        <span className="text-stone-800 dark:text-stone-200">{note.text}</span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-stone-400 hover:text-red-600 dark:hover:text-red-400 p-0.5 shrink-0 cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new note */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder={lang === 'ne' ? 'नयाँ टिपोट लेख्नुहोस्...' : 'Add a note...'}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    className="flex-1 text-xs px-2.5 py-1.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-2.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {lang === 'ne' ? 'थप्नुहोस्' : 'Add'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Month Holidays and Key Festivals list */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-5 transition-colors">
            <h3 className="font-bold text-stone-900 dark:text-white text-sm mb-3 flex items-center justify-between">
              <span>{lang === 'ne' ? `यस महिनाका मुख्य चाडपर्वहरू (${monthName})` : `Festivals in ${monthName}`}</span>
              <span className="text-xs bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 font-bold px-2 py-0.5 rounded-full">
                {monthHolidays.length}
              </span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {monthHolidays.length === 0 ? (
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'ne' ? 'यस महिनामा कुनै विशेष चाडपर्व छैन।' : 'No major festivals recorded this month.'}
                </p>
              ) : (
                monthHolidays.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-red-50/50 dark:hover:bg-stone-800 border border-stone-100 dark:border-stone-700/60 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-red-700 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-2xs">
                        {ev.dayNumNe}
                      </span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {lang === 'ne' ? ev.titleNe : ev.titleEn}
                      </span>
                    </div>

                    {ev.isHoliday && (
                      <span className="text-[10px] text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded">
                        {lang === 'ne' ? 'बिदा' : 'Holiday'}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {onNavigate && (
              <button
                type="button"
                id="calendar-explore-all-festivals-btn"
                onClick={() => onNavigate('festivals')}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700"
              >
                <span>{lang === 'ne' ? 'सबै चाडपर्वहरू हेर्नुहोस्' : 'Explore All Nepali Festivals'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Seasonal Health & Wellness Quick Teaser Card */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-stone-50 dark:from-stone-900 dark:via-emerald-950/20 dark:to-stone-900 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm">
                    {lang === 'ne' ? `${currentSeason.nameNe} • स्वास्थ्य सल्लाह` : `${currentSeason.nameEn} • Wellness`}
                  </h4>
                  <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold">
                    🌿 {lang === 'ne' ? `दोष: ${currentSeason.doshaNe}` : `Dosha: ${currentSeason.doshaEn}`}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                {lang === 'ne' ? 'आयुर्वेद' : 'Ayurveda'}
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {lang === 'ne' ? currentSeason.taglineNe : currentSeason.taglineEn}
            </p>

            <div className="p-2.5 bg-white dark:bg-stone-800/80 rounded-xl border border-emerald-200/60 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold block text-stone-900 dark:text-white">
                  {lang === 'ne' ? currentSeason.herbalRemedy.nameNe : currentSeason.herbalRemedy.nameEn}
                </span>
                <span className="text-stone-500 dark:text-stone-400 text-[10px]">
                  {lang === 'ne' ? currentSeason.herbalRemedy.benefitNe : currentSeason.herbalRemedy.benefitEn}
                </span>
              </div>
            </div>

            {onOpenWellness && (
              <button
                type="button"
                onClick={onOpenWellness}
                className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>{lang === 'ne' ? 'स्वास्थ्य तथा योग खण्ड हेर्नुहोस्' : 'Open Health & Wellness Section'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
