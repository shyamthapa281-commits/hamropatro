import React, { useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Flag,
  ArrowRight,
  Info
} from 'lucide-react';
import { CalendarDay, NepaliDate, Language } from '../types';
import { 
  BS_MONTH_NAMES_NE, 
  BS_MONTH_NAMES_EN, 
  NEPALI_DAYS_SHORT_NE, 
  NEPALI_DAYS_SHORT_EN, 
  generateMonthGrid, 
  toNepaliDigits, 
  bsToAd 
} from '../utils/nepaliCalendar';

interface Year12MonthViewProps {
  year: number;
  lang: Language;
  todayBs: NepaliDate;
  selectedDay: CalendarDay | null;
  onSelectDay: (day: CalendarDay) => void;
  onOpenMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
}

export const Year12MonthView: React.FC<Year12MonthViewProps> = ({
  year,
  lang,
  todayBs,
  selectedDay,
  onSelectDay,
  onOpenMonth,
  onSelectYear,
}) => {
  const availableYears = [2080, 2081, 2082, 2083, 2084];
  const daysHeader = lang === 'ne' ? NEPALI_DAYS_SHORT_NE : NEPALI_DAYS_SHORT_EN;

  // Precompute grids for all 12 months for this year
  const all12Months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const grid = generateMonthGrid(year, monthNum);
      const currentDays = grid.filter((d) => d.isCurrentMonth);
      const holidayCount = currentDays.filter((d) => d.isHoliday || d.isSaturday).length;
      const festivalEvents = currentDays
        .filter((d) => d.events.length > 0)
        .flatMap((d) => d.events);

      const firstAd = bsToAd(year, monthNum, 1);
      const lastAd = bsToAd(year, monthNum, currentDays.length);
      const adRange = `${firstAd.toLocaleString('default', { month: 'short' })} - ${lastAd.toLocaleString('default', { month: 'short' })} ${lastAd.getFullYear()}`;

      return {
        monthNum,
        nameNe: BS_MONTH_NAMES_NE[i],
        nameEn: BS_MONTH_NAMES_EN[i],
        grid,
        totalDays: currentDays.length,
        holidayCount,
        festivalEvents,
        adRange,
        isCurrentMonth: todayBs.year === year && todayBs.month === monthNum,
      };
    });
  }, [year, todayBs.year, todayBs.month]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 12-Month Year Header Control Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-sky-500/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-950/60 rounded-full border border-sky-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? '१२ महिना वार्षिक क्यालेन्डर अवलोकन' : '12-Month Annual Calendar Overview'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>{lang === 'ne' ? `वि.सं. ${toNepaliDigits(year)} सालको १२ महिना` : `BS ${year} (Full Year Calendar)`}</span>
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl">
              {lang === 'ne'
                ? 'वैशाखदेखि चैतसम्मका १२ वटै महिनाको पञ्चाङ्ग, बिदा र चाडपर्वहरू एकै नजरमा। कुनै पनि मितिमा क्लिक गरी विस्तृत पञ्चाङ्ग विवरण हेर्नुहोस्।'
                : 'All 12 Bikram Sambat months at a glance. Click any date to open complete Vedic Panchanga, Tithi, festivals, and auspicious timings.'}
            </p>
          </div>

          {/* Year Switcher Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 bg-sky-950/70 p-1.5 rounded-2xl border border-sky-400/30 overflow-x-auto max-w-full">
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  id={`year-12m-selector-${yr}`}
                  onClick={() => onSelectYear(yr)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    year === yr
                      ? 'bg-amber-400 text-stone-950 shadow-xs ring-1 ring-amber-300'
                      : 'text-sky-100 hover:text-white hover:bg-sky-800/80'
                  }`}
                >
                  {toNepaliDigits(yr)} {lang === 'ne' ? 'साल' : 'BS'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-sky-500/30 flex flex-wrap items-center gap-4 text-xs text-sky-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-300"></span>
            <span className="font-medium">{lang === 'ne' ? 'आजको दिन (Today)' : 'Today'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500/80 border border-rose-400"></span>
            <span className="font-medium">{lang === 'ne' ? 'शनिवार / सार्वजनिक बिदा (Holiday)' : 'Holiday / Saturday'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-sky-400 border border-sky-300"></span>
            <span className="font-medium">{lang === 'ne' ? 'चयन गरिएको मिति (Selected)' : 'Selected Date'}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto text-amber-300 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? '💡 मितिमा क्लिक गरेर विवरण हेर्नुहोस्' : '💡 Click any date to view details'}</span>
          </div>
        </div>
      </div>

      {/* 12 Months Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {all12Months.map((m) => {
          return (
            <div
              key={m.monthNum}
              className={`rounded-3xl border transition-all duration-200 bg-white dark:bg-stone-900 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                m.isCurrentMonth
                  ? 'border-sky-500 ring-2 ring-sky-400/50'
                  : 'border-stone-200 dark:border-stone-800 hover:border-sky-300 dark:hover:border-sky-700'
              }`}
            >
              {/* Month Card Header */}
              <div className="p-3.5 sm:p-4 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      {toNepaliDigits(m.monthNum)}
                    </span>
                    <h3 className="font-extrabold text-base text-stone-900 dark:text-white leading-tight">
                      {lang === 'ne' ? m.nameNe : m.nameEn}
                    </h3>
                  </div>
                  <span className="text-[10.5px] text-stone-500 dark:text-stone-400 font-medium block mt-0.5">
                    {m.adRange} • {toNepaliDigits(m.totalDays)} {lang === 'ne' ? 'दिन' : 'days'}
                  </span>
                </div>

                <button
                  type="button"
                  id={`open-month-grid-${m.monthNum}`}
                  onClick={() => onOpenMonth(m.monthNum)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-700 hover:bg-sky-600 hover:text-white text-sky-700 dark:text-sky-300 border border-stone-200 dark:border-stone-600 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs group"
                  title={lang === 'ne' ? `${m.nameNe} को पूरै महिना खोल्नुहोस्` : `Open ${m.nameEn} month view`}
                >
                  <span>{lang === 'ne' ? 'महिना' : 'View'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Mini Calendar Grid */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1.5">
                  {daysHeader.map((dName, dIdx) => (
                    <div 
                      key={dIdx}
                      className={dIdx === 6 ? 'text-rose-500 dark:text-rose-400 font-black' : ''}
                    >
                      {dName}
                    </div>
                  ))}
                </div>

                {/* Day Cells Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {m.grid.map((day, cellIdx) => {
                    if (!day.isCurrentMonth) {
                      return <div key={cellIdx} className="h-7 sm:h-8" />;
                    }

                    const isSelected = selectedDay && 
                      selectedDay.bsYear === day.bsYear && 
                      selectedDay.bsMonth === day.bsMonth && 
                      selectedDay.bsDay === day.bsDay;

                    const hasFestivals = day.events && day.events.length > 0;

                    return (
                      <button
                        key={cellIdx}
                        type="button"
                        id={`year12-date-${day.bsYear}-${day.bsMonth}-${day.bsDay}`}
                        onClick={() => onSelectDay(day)}
                        className={`h-7 sm:h-8 rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer relative group/day select-none ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-400 scale-105 z-10'
                            : day.isToday
                            ? 'bg-amber-400 text-stone-950 font-black shadow-xs ring-1 ring-amber-500'
                            : day.isHoliday || day.isSaturday
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-black'
                            : 'text-stone-700 dark:text-stone-200 hover:bg-sky-50 dark:hover:bg-stone-800 hover:text-sky-700'
                        }`}
                        title={`${toNepaliDigits(day.bsDay)} ${m.nameNe} (${day.tithiNe || ''})${hasFestivals ? ' - ' + day.events[0].titleNe : ''}`}
                      >
                        <span className="leading-none">
                          {toNepaliDigits(day.bsDay)}
                        </span>

                        {/* Tiny festival or holiday indicator dot */}
                        {hasFestivals && !isSelected && (
                          <span className={`w-1 h-1 rounded-full absolute bottom-0.5 ${day.isHoliday ? 'bg-rose-600' : 'bg-sky-500'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Month Festival Teaser / Highlights */}
                {m.festivalEvents.length > 0 ? (
                  <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-[10.5px] text-stone-600 dark:text-stone-400 flex items-center justify-between gap-1">
                    <span className="truncate flex items-center gap-1 font-medium">
                      <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">
                        {lang === 'ne' ? m.festivalEvents[0].titleNe : m.festivalEvents[0].titleEn}
                      </span>
                    </span>
                    {m.festivalEvents.length > 1 && (
                      <span className="shrink-0 text-[10px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 rounded-md font-bold text-stone-500">
                        +{m.festivalEvents.length - 1}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-[10.5px] text-stone-400 dark:text-stone-500 italic truncate">
                    {lang === 'ne' ? 'कुनै विशेष चाड छैन' : 'No major festival'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
