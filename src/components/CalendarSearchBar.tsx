import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Flag, 
  Moon, 
  ArrowRight, 
  Check, 
  Filter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Language, CalendarDay, CalendarEvent, NepaliDate } from '../types';
import { 
  BS_MONTH_NAMES_NE, 
  BS_MONTH_NAMES_EN, 
  NEPALI_DAYS_NE, 
  NEPALI_DAYS_EN, 
  getDaysInBsMonth, 
  toNepaliDigits, 
  getPanchangaForDate, 
  getEventsForBsDate, 
  bsToAd 
} from '../utils/nepaliCalendar';

export interface CalendarSearchResult {
  bsYear: number;
  bsMonth: number;
  bsDay: number;
  bsDayNe: string;
  monthNameNe: string;
  monthNameEn: string;
  dayNameNe: string;
  dayNameEn: string;
  adFormatted: string;
  tithiNe: string;
  tithiEn: string;
  events: CalendarEvent[];
  isHoliday: boolean;
  isSaturday: boolean;
  matchType: 'festival' | 'tithi' | 'holiday' | 'panchanga';
  matchLabelNe: string;
  matchLabelEn: string;
}

interface CalendarSearchBarProps {
  currentYear: number;
  currentMonth: number;
  todayBs: NepaliDate;
  lang: Language;
  onSelectDate: (year: number, month: number, day: number) => void;
  selectedDay?: CalendarDay | null;
}

// Popular quick query suggestions
const POPULAR_CHIPS: { labelNe: string; labelEn: string; query: string }[] = [
  { labelNe: 'दशैं', labelEn: 'Dashain', query: 'दशैं' },
  { labelNe: 'तिहार', labelEn: 'Tihar', query: 'तिहार' },
  { labelNe: 'एकादशी', labelEn: 'Ekadashi', query: 'एकादशी' },
  { labelNe: 'पूर्णिमा', labelEn: 'Purnima', query: 'पूर्णिमा' },
  { labelNe: 'औंसी', labelEn: 'Aaunsi', query: 'औंसी' },
  { labelNe: 'छठ', labelEn: 'Chhath', query: 'छठ' },
  { labelNe: 'शिवरात्रि', labelEn: 'Shivaratri', query: 'शिवरात्रि' },
  { labelNe: 'होली', labelEn: 'Holi', query: 'होली' },
  { labelNe: 'तीज', labelEn: 'Teej', query: 'तीज' },
  { labelNe: 'सार्वजनिक बिदा', labelEn: 'Holidays', query: 'बिदा' },
];

// Transliteration keyword aliases for flexible English typing
const TRANSLITERATION_MAP: Record<string, string[]> = {
  dashain: ['दशैं', 'dashain', 'tika', 'घटस्थापना', 'फूलपाती', 'महाअष्टमी', 'महानवमी', 'विजयादशमी'],
  dasai: ['दशैं', 'dashain', 'विजयादशमी'],
  tihar: ['तिहार', 'tihar', 'दीपावली', 'लक्ष्मी', 'काग', 'कुकुर', 'गोवर्धन', 'भाइटीका'],
  diwali: ['तिहार', 'लक्ष्मी पूजा', 'दीपावली'],
  ekadashi: ['एकादशी', 'ekadashi'],
  purnima: ['पूर्णिमा', 'purnima', 'पुन्हि'],
  punhi: ['पूर्णिमा', 'पुन्हि'],
  aunsi: ['औंसी', 'aaunsi', 'amavasya'],
  aaunsi: ['औंसी', 'aaunsi', 'amavasya'],
  amavasya: ['औंसी', 'amavasya'],
  chhath: ['छठ', 'chhath'],
  chath: ['छठ', 'chhath'],
  shivaratri: ['शिवरात्रि', 'shivaratri', 'महाशिवरात्रि'],
  shivratri: ['शिवरात्रि', 'shivaratri', 'महाशिवरात्रि'],
  holi: ['होली', 'फागु', 'holi'],
  fagu: ['फागु', 'होली'],
  teej: ['तीज', 'teej', 'हरितालिका'],
  haritalika: ['हरितालिका', 'तीज'],
  buddha: ['बुद्ध', 'buddha', 'उभौली'],
  lhosar: ['ल्होसार', 'lhosar', 'तमु', 'सोनाम', 'ग्याल्पो'],
  maghe: ['माघे', 'माघी', 'maghe'],
  sankranti: ['संक्रान्ति', 'sankranti'],
  ramnavami: ['रामनवमी', 'ram navami'],
  krishna: ['कृष्ण', 'janmashtami'],
  janmashtami: ['जन्माष्टमी', 'कृष्ण'],
  holiday: ['बिदा', 'holiday'],
  bida: ['बिदा', 'holiday'],
};

export const CalendarSearchBar: React.FC<CalendarSearchBarProps> = ({
  currentYear,
  currentMonth,
  todayBs,
  lang,
  onSelectDate,
  selectedDay
}) => {
  const [query, setQuery] = useState('');
  const [searchScope, setSearchScope] = useState<'year' | 'month'>('year');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'festival' | 'tithi' | 'holiday'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut (Cmd+K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pre-generate full calendar days for the current year (memoized for efficiency)
  const fullYearDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const monthNamesShortEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let m = 1; m <= 12; m++) {
      const daysInMonth = getDaysInBsMonth(currentYear, m);
      for (let d = 1; d <= daysInMonth; d++) {
        const curAdDate = bsToAd(currentYear, m, d);
        const dOfWeek = curAdDate.getDay();
        const isSat = dOfWeek === 6;
        const events = getEventsForBsDate(m, d);
        const isHoliday = isSat || events.some(e => e.isHoliday);
        const isToday = (todayBs.year === currentYear && todayBs.month === m && todayBs.day === d);
        const panchanga = getPanchangaForDate(currentYear, m, d);

        days.push({
          bsYear: currentYear,
          bsMonth: m,
          bsDay: d,
          bsDayNe: toNepaliDigits(d),
          dayOfWeek: dOfWeek,
          adDate: curAdDate,
          adDay: curAdDate.getDate(),
          adMonthName: monthNamesShortEn[curAdDate.getMonth()],
          isToday,
          isCurrentMonth: true,
          isSaturday: isSat,
          isHoliday,
          tithiNe: panchanga.tithi,
          tithiEn: panchanga.tithiEn,
          events,
          panchanga,
        });
      }
    }
    return days;
  }, [currentYear, todayBs.year, todayBs.month, todayBs.day]);

  // Compute search matches
  const searchResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    // Check alias expansions
    const aliasTerms = TRANSLITERATION_MAP[cleanQuery] || [];
    const searchTerms = [cleanQuery, ...aliasTerms.map(t => t.toLowerCase())];

    const pool = searchScope === 'month'
      ? fullYearDays.filter(d => d.bsMonth === currentMonth)
      : fullYearDays;

    const results: CalendarSearchResult[] = [];

    pool.forEach(day => {
      const tithiNe = day.tithiNe.toLowerCase();
      const tithiEn = day.tithiEn.toLowerCase();
      const monthNe = BS_MONTH_NAMES_NE[day.bsMonth - 1].toLowerCase();
      const monthEn = BS_MONTH_NAMES_EN[day.bsMonth - 1].toLowerCase();
      const dayNe = NEPALI_DAYS_NE[day.dayOfWeek].toLowerCase();
      const dayEn = NEPALI_DAYS_EN[day.dayOfWeek].toLowerCase();

      // Check events match
      const matchedEvents = day.events.filter(ev => {
        const titleNe = ev.titleNe.toLowerCase();
        const titleEn = ev.titleEn.toLowerCase();
        return searchTerms.some(term => titleNe.includes(term) || titleEn.includes(term));
      });

      // Check tithi match
      const isTithiMatch = searchTerms.some(term => 
        tithiNe.includes(term) || tithiEn.includes(term)
      );

      // Check holiday query match
      const isHolidayQuery = searchTerms.some(term => 
        term === 'बिदा' || term === 'holiday' || term === 'सार्वजनिक बिदा' || term === 'holidays'
      );
      const isHolidayMatch = isHolidayQuery && (day.isHoliday || day.isSaturday);

      // Check month / day match
      const isDateNameMatch = searchTerms.some(term => 
        monthNe.includes(term) || monthEn.includes(term) || dayNe.includes(term) || dayEn.includes(term)
      );

      if (matchedEvents.length > 0 || isTithiMatch || isHolidayMatch || (isDateNameMatch && day.events.length > 0)) {
        let matchType: 'festival' | 'tithi' | 'holiday' | 'panchanga' = 'festival';
        let matchLabelNe = '';
        let matchLabelEn = '';

        if (matchedEvents.length > 0) {
          matchType = 'festival';
          matchLabelNe = matchedEvents.map(e => e.titleNe).join(' • ');
          matchLabelEn = matchedEvents.map(e => e.titleEn).join(' • ');
        } else if (isTithiMatch) {
          matchType = 'tithi';
          matchLabelNe = `तिथी: ${day.tithiNe}`;
          matchLabelEn = `Tithi: ${day.tithiEn}`;
        } else if (isHolidayMatch) {
          matchType = 'holiday';
          matchLabelNe = day.events.length > 0 ? day.events[0].titleNe : 'सार्वजनिक बिदा (शनिवार)';
          matchLabelEn = day.events.length > 0 ? day.events[0].titleEn : 'Public Holiday (Saturday)';
        } else {
          matchType = 'panchanga';
          matchLabelNe = day.tithiNe;
          matchLabelEn = day.tithiEn;
        }

        // Apply category filter if active
        if (categoryFilter === 'festival' && matchType !== 'festival') return;
        if (categoryFilter === 'tithi' && matchType !== 'tithi') return;
        if (categoryFilter === 'holiday' && !day.isHoliday && !day.isSaturday) return;

        results.push({
          bsYear: day.bsYear,
          bsMonth: day.bsMonth,
          bsDay: day.bsDay,
          bsDayNe: day.bsDayNe,
          monthNameNe: BS_MONTH_NAMES_NE[day.bsMonth - 1],
          monthNameEn: BS_MONTH_NAMES_EN[day.bsMonth - 1],
          dayNameNe: NEPALI_DAYS_NE[day.dayOfWeek],
          dayNameEn: NEPALI_DAYS_EN[day.dayOfWeek],
          adFormatted: `${day.adMonthName} ${day.adDay}, ${day.adDate.getFullYear()}`,
          tithiNe: day.tithiNe,
          tithiEn: day.tithiEn,
          events: day.events,
          isHoliday: day.isHoliday,
          isSaturday: day.isSaturday,
          matchType,
          matchLabelNe,
          matchLabelEn,
        });
      }
    });

    return results;
  }, [query, searchScope, categoryFilter, fullYearDays, currentMonth]);

  const handleSelectResult = (result: CalendarSearchResult) => {
    onSelectDate(result.bsYear, result.bsMonth, result.bsDay);
    setIsOpen(false);
  };

  const handleChipClick = (chipQuery: string) => {
    setQuery(chipQuery);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const currentMonthName = lang === 'ne' ? BS_MONTH_NAMES_NE[currentMonth - 1] : BS_MONTH_NAMES_EN[currentMonth - 1];

  return (
    <div ref={containerRef} className="relative w-full mb-5">
      {/* Search Input Box */}
      <div className="relative bg-white dark:bg-stone-900 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800 p-2 sm:p-2.5 transition-all focus-within:ring-2 focus-within:ring-red-600 dark:focus-within:ring-red-500 focus-within:border-transparent">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          {/* Main text input */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-stone-400 dark:text-stone-500 absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              id="calendar-search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={
                lang === 'ne'
                  ? 'चाडपर्व वा तिथी खोज्नुहोस् (उदा: दशैं, तिहार, एकादशी, पूर्णिमा, औंसी, छठ)...'
                  : 'Search festivals or tithi (e.g. Dashain, Tihar, Ekadashi, Purnima, Aaunsi)...'
              }
              className="w-full pl-10 pr-9 py-2 text-sm bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Scope Switcher & Filter */}
          <div className="flex items-center gap-1.5 shrink-0 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-800 pt-2 sm:pt-0 sm:pl-2">
            {/* Scope Toggle: Current Month vs Whole Year */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 text-xs font-semibold text-stone-600 dark:text-stone-300">
              <button
                type="button"
                id="search-scope-month-btn"
                onClick={() => setSearchScope('month')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  searchScope === 'month'
                    ? 'bg-white dark:bg-stone-700 text-red-700 dark:text-red-400 shadow-xs font-bold'
                    : 'hover:text-stone-900 dark:hover:text-white'
                }`}
                title={`खोज्ने दायरा: यो महिना (${currentMonthName})`}
              >
                {lang === 'ne' ? `महिना (${currentMonthName})` : `Month (${currentMonthName})`}
              </button>
              <button
                type="button"
                id="search-scope-year-btn"
                onClick={() => setSearchScope('year')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  searchScope === 'year'
                    ? 'bg-white dark:bg-stone-700 text-red-700 dark:text-red-400 shadow-xs font-bold'
                    : 'hover:text-stone-900 dark:hover:text-white'
                }`}
                title={`खोज्ने दायरा: पूरा वर्ष (${currentYear})`}
              >
                {lang === 'ne' ? `वर्ष ${toNepaliDigits(currentYear)}` : `Year ${currentYear}`}
              </button>
            </div>

            {/* Category Filter Pills */}
            <select
              id="search-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl px-2.5 py-1.5 border-none font-medium focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">{lang === 'ne' ? 'सबै (All)' : 'All'}</option>
              <option value="festival">{lang === 'ne' ? 'चाडपर्व (Festivals)' : 'Festivals'}</option>
              <option value="tithi">{lang === 'ne' ? 'तिथी (Tithis)' : 'Tithis'}</option>
              <option value="holiday">{lang === 'ne' ? 'सार्वजनिक बिदा (Holidays)' : 'Holidays'}</option>
            </select>
          </div>

        </div>

        {/* Quick Suggestion Chips Bar */}
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 overflow-x-auto pb-0.5 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {lang === 'ne' ? 'लोकप्रिय:' : 'Popular:'}
          </span>
          {POPULAR_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.query)}
              className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 font-medium ${
                query === chip.query
                  ? 'bg-red-700 text-white shadow-2xs font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200/50 dark:border-stone-700/50'
              }`}
            >
              <span>{lang === 'ne' ? chip.labelNe : chip.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Results Dropdown Container */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 z-50 overflow-hidden max-h-[460px] flex flex-col">
          
          {/* Results Header */}
          <div className="p-3 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {lang === 'ne' ? `खोज परिणामहरू ("${query}")` : `Search Results for "${query}"`}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-extrabold">
                {lang === 'ne' ? `${toNepaliDigits(searchResults.length)} भेटियो` : `${searchResults.length} found`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {searchScope === 'year' 
                  ? (lang === 'ne' ? `वर्ष ${toNepaliDigits(currentYear)}` : `Year ${currentYear} BS`)
                  : (lang === 'ne' ? `महिना ${currentMonthName}` : `Month ${currentMonthName}`)}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results List Body */}
          <div className="overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/80 p-1">
            {searchResults.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CalendarIcon className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {lang === 'ne'
                    ? `"${query}" सँग सम्बन्धित कुनै मिति वा चाडपर्व फेला परेन।`
                    : `No dates or festivals found matching "${query}".`}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'ne'
                    ? 'कृपया अर्को शब्द खोज्नुहोस् (उदा: एकादशी, पूर्णिमा, औंसी, दशैं, तिहार, छठ) वा दायरा "पूरा वर्ष" राख्नुहोस्।'
                    : 'Try another keyword like Ekadashi, Purnima, Dashain, Tihar, or switch scope to "Full Year".'}
                </p>
              </div>
            ) : (
              searchResults.map((result, idx) => {
                const isSelected = selectedDay && 
                  selectedDay.bsYear === result.bsYear && 
                  selectedDay.bsMonth === result.bsMonth && 
                  selectedDay.bsDay === result.bsDay;

                return (
                  <div
                    key={`${result.bsYear}-${result.bsMonth}-${result.bsDay}-${idx}`}
                    onClick={() => handleSelectResult(result)}
                    className={`p-3 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    {/* Left: Date Display */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200/70 dark:border-red-900/50 flex flex-col items-center justify-center shrink-0">
                        <span className="text-base font-extrabold text-red-700 dark:text-red-400 leading-none">
                          {result.bsDayNe}
                        </span>
                        <span className="text-[10px] font-bold text-red-900 dark:text-red-300 leading-tight">
                          {result.monthNameNe}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 dark:text-white text-sm">
                            {lang === 'ne'
                              ? `${result.bsDayNe} ${result.monthNameNe} ${toNepaliDigits(result.bsYear)}`
                              : `${result.bsDay} ${result.monthNameEn} ${result.bsYear}`}
                          </span>

                          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                            ({lang === 'ne' ? result.dayNameNe : result.dayNameEn})
                          </span>

                          {result.isHoliday && (
                            <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                              {lang === 'ne' ? 'सार्वजनिक बिदा' : 'Holiday'}
                            </span>
                          )}

                          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                            AD: {result.adFormatted}
                          </span>
                        </div>

                        {/* Festival / Event / Tithi Highlight */}
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          {result.matchType === 'festival' ? (
                            <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1 truncate">
                              <Flag className="w-3.5 h-3.5 shrink-0" />
                              {lang === 'ne' ? result.matchLabelNe : result.matchLabelEn}
                            </span>
                          ) : result.matchType === 'tithi' ? (
                            <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 truncate">
                              <Moon className="w-3.5 h-3.5 shrink-0" />
                              {lang === 'ne' ? result.matchLabelNe : result.matchLabelEn}
                            </span>
                          ) : (
                            <span className="font-medium text-stone-700 dark:text-stone-300 truncate">
                              {lang === 'ne' ? result.matchLabelNe : result.matchLabelEn}
                            </span>
                          )}

                          <span className="text-stone-400 dark:text-stone-600">•</span>
                          
                          <span className="text-stone-500 dark:text-stone-400 text-[11px] truncate">
                            {lang === 'ne' ? result.tithiNe : result.tithiEn}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Navigate CTA */}
                    <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400 group-hover:translate-x-0.5 transition-transform">
                      <span className="hidden sm:inline">
                        {lang === 'ne' ? 'पात्रोमा हेर्नुहोस्' : 'View in Calendar'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Results Footer Tip */}
          {searchResults.length > 0 && (
            <div className="p-2.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-center text-[11px] text-stone-500 dark:text-stone-400">
              {lang === 'ne' 
                ? 'कुनै पनि परिणाममा थिचेर सिधै उक्त दिनको पात्रो र पञ्चाङ्ग खोल्नुहोस्।'
                : 'Click any result to jump directly to that date and open its Panchanga details.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
