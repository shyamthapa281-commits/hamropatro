import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Globe, 
  Search, 
  Star, 
  Pin, 
  Sun, 
  Moon, 
  SlidersHorizontal, 
  Calendar, 
  Sparkles, 
  Compass,
  PhoneCall,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { Language, NepaliDate } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';

interface WorldClockCity {
  id: string;
  cityNameNe: string;
  cityNameEn: string;
  countryNameNe: string;
  countryNameEn: string;
  flag: string;
  timeZone: string;
  region: 'middle_east' | 'asia' | 'europe' | 'americas' | 'oceania';
  isDefaultHome?: boolean;
}

const CITIES: WorldClockCity[] = [
  {
    id: 'kathmandu',
    cityNameNe: 'काठमाडौं',
    cityNameEn: 'Kathmandu',
    countryNameNe: 'नेपाल',
    countryNameEn: 'Nepal',
    flag: '🇳🇵',
    timeZone: 'Asia/Kathmandu',
    region: 'asia',
    isDefaultHome: true,
  },
  {
    id: 'dubai',
    cityNameNe: 'दुबई',
    cityNameEn: 'Dubai',
    countryNameNe: 'संयुक्त अरब इमिरेट्स',
    countryNameEn: 'UAE',
    flag: '🇦🇪',
    timeZone: 'Asia/Dubai',
    region: 'middle_east',
  },
  {
    id: 'doha',
    cityNameNe: 'दोहा',
    cityNameEn: 'Doha',
    countryNameNe: 'कतार',
    countryNameEn: 'Qatar',
    flag: '🇶🇦',
    timeZone: 'Asia/Qatar',
    region: 'middle_east',
  },
  {
    id: 'riyadh',
    cityNameNe: 'रियाद',
    cityNameEn: 'Riyadh',
    countryNameNe: 'साउदी अरब',
    countryNameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    timeZone: 'Asia/Riyadh',
    region: 'middle_east',
  },
  {
    id: 'kuwait',
    cityNameNe: 'कुवेत सिटी',
    cityNameEn: 'Kuwait City',
    countryNameNe: 'कुवेत',
    countryNameEn: 'Kuwait',
    flag: '🇰🇼',
    timeZone: 'Asia/Kuwait',
    region: 'middle_east',
  },
  {
    id: 'muscat',
    cityNameNe: 'मस्कट',
    cityNameEn: 'Muscat',
    countryNameNe: 'ओमान',
    countryNameEn: 'Oman',
    flag: '🇴🇲',
    timeZone: 'Asia/Muscat',
    region: 'middle_east',
  },
  {
    id: 'manama',
    cityNameNe: 'मनामा',
    cityNameEn: 'Manama',
    countryNameNe: 'बहराइन',
    countryNameEn: 'Bahrain',
    flag: '🇧🇭',
    timeZone: 'Asia/Bahrain',
    region: 'middle_east',
  },
  {
    id: 'delhi',
    cityNameNe: 'नयाँ दिल्ली',
    cityNameEn: 'New Delhi',
    countryNameNe: 'भारत',
    countryNameEn: 'India',
    flag: '🇮🇳',
    timeZone: 'Asia/Kolkata',
    region: 'asia',
  },
  {
    id: 'kl',
    cityNameNe: 'क्वालालम्पुर',
    cityNameEn: 'Kuala Lumpur',
    countryNameNe: 'मलेसिया',
    countryNameEn: 'Malaysia',
    flag: '🇲🇾',
    timeZone: 'Asia/Kuala_Lumpur',
    region: 'asia',
  },
  {
    id: 'tokyo',
    cityNameNe: 'टोकियो',
    cityNameEn: 'Tokyo',
    countryNameNe: 'जापान',
    countryNameEn: 'Japan',
    flag: '🇯🇵',
    timeZone: 'Asia/Tokyo',
    region: 'asia',
  },
  {
    id: 'seoul',
    cityNameNe: 'सियोल',
    cityNameEn: 'Seoul',
    countryNameNe: 'दक्षिण कोरिया',
    countryNameEn: 'South Korea',
    flag: '🇰🇷',
    timeZone: 'Asia/Seoul',
    region: 'asia',
  },
  {
    id: 'singapore',
    cityNameNe: 'सिंगापुर',
    cityNameEn: 'Singapore',
    countryNameNe: 'सिंगापुर',
    countryNameEn: 'Singapore',
    flag: '🇸🇬',
    timeZone: 'Asia/Singapore',
    region: 'asia',
  },
  {
    id: 'bangkok',
    cityNameNe: 'बैंकक',
    cityNameEn: 'Bangkok',
    countryNameNe: 'थाइल्याण्ड',
    countryNameEn: 'Thailand',
    flag: '🇹🇭',
    timeZone: 'Asia/Bangkok',
    region: 'asia',
  },
  {
    id: 'hongkong',
    cityNameNe: 'हङकङ',
    cityNameEn: 'Hong Kong',
    countryNameNe: 'हङकङ',
    countryNameEn: 'Hong Kong',
    flag: '🇭🇰',
    timeZone: 'Asia/Hong_Kong',
    region: 'asia',
  },
  {
    id: 'london',
    cityNameNe: 'लन्डन',
    cityNameEn: 'London',
    countryNameNe: 'बेलायत',
    countryNameEn: 'United Kingdom',
    flag: '🇬🇧',
    timeZone: 'Europe/London',
    region: 'europe',
  },
  {
    id: 'paris',
    cityNameNe: 'पेरिस',
    cityNameEn: 'Paris',
    countryNameNe: 'फ्रान्स',
    countryNameEn: 'France',
    flag: '🇫🇷',
    timeZone: 'Europe/Paris',
    region: 'europe',
  },
  {
    id: 'berlin',
    cityNameNe: 'बर्लिन',
    cityNameEn: 'Berlin',
    countryNameNe: 'जर्मनी',
    countryNameEn: 'Germany',
    flag: '🇩🇪',
    timeZone: 'Europe/Berlin',
    region: 'europe',
  },
  {
    id: 'newyork',
    cityNameNe: 'न्यूयोर्क',
    cityNameEn: 'New York',
    countryNameNe: 'संयुक्त राज्य अमेरिका',
    countryNameEn: 'USA (EST/EDT)',
    flag: '🇺🇸',
    timeZone: 'America/New_York',
    region: 'americas',
  },
  {
    id: 'chicago',
    cityNameNe: 'शिकागो / टेक्सास',
    cityNameEn: 'Chicago / Dallas',
    countryNameNe: 'संयुक्त राज्य अमेरिका',
    countryNameEn: 'USA (CST/CDT)',
    flag: '🇺🇸',
    timeZone: 'America/Chicago',
    region: 'americas',
  },
  {
    id: 'denver',
    cityNameNe: 'डेन्भर / कोलोराडो',
    cityNameEn: 'Denver / Colorado',
    countryNameNe: 'संयुक्त राज्य अमेरिका',
    countryNameEn: 'USA (MST/MDT)',
    flag: '🇺🇸',
    timeZone: 'America/Denver',
    region: 'americas',
  },
  {
    id: 'losangeles',
    cityNameNe: 'लस एन्जलस / क्यालिफोर्निया',
    cityNameEn: 'Los Angeles / SF',
    countryNameNe: 'संयुक्त राज्य अमेरिका',
    countryNameEn: 'USA (PST/PDT)',
    flag: '🇺🇸',
    timeZone: 'America/Los_Angeles',
    region: 'americas',
  },
  {
    id: 'toronto',
    cityNameNe: 'टोरन्टो',
    cityNameEn: 'Toronto',
    countryNameNe: 'क्यानाडा',
    countryNameEn: 'Canada',
    flag: '🇨🇦',
    timeZone: 'America/Toronto',
    region: 'americas',
  },
  {
    id: 'sydney',
    cityNameNe: 'सिड्नी',
    cityNameEn: 'Sydney',
    countryNameNe: 'अस्ट्रेलिया',
    countryNameEn: 'Australia (NSW)',
    flag: '🇦🇺',
    timeZone: 'Australia/Sydney',
    region: 'oceania',
  },
  {
    id: 'melbourne',
    cityNameNe: 'मेलबर्न',
    cityNameEn: 'Melbourne',
    countryNameNe: 'अस्ट्रेलिया',
    countryNameEn: 'Australia (VIC)',
    flag: '🇦🇺',
    timeZone: 'Australia/Melbourne',
    region: 'oceania',
  },
  {
    id: 'perth',
    cityNameNe: 'पर्थ',
    cityNameEn: 'Perth',
    countryNameNe: 'अस्ट्रेलिया',
    countryNameEn: 'Australia (WA)',
    flag: '🇦🇺',
    timeZone: 'Australia/Perth',
    region: 'oceania',
  },
  {
    id: 'auckland',
    cityNameNe: 'अकल्याण्ड',
    cityNameEn: 'Auckland',
    countryNameNe: 'न्युजिल्याण्ड',
    countryNameEn: 'New Zealand',
    flag: '🇳🇿',
    timeZone: 'Pacific/Auckland',
    region: 'oceania',
  },
];

interface WorldClockViewProps {
  lang: Language;
  todayBs: NepaliDate;
}

export const WorldClockView: React.FC<WorldClockViewProps> = ({ lang, todayBs }) => {
  const [now, setNow] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [pinnedCityIds, setPinnedCityIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hamro_patro_pinned_cities');
      return saved ? JSON.parse(saved) : ['dubai', 'doha', 'riyadh', 'delhi', 'tokyo', 'london', 'newyork', 'sydney'];
    } catch {
      return ['dubai', 'doha', 'riyadh', 'delhi', 'tokyo', 'london', 'newyork', 'sydney'];
    }
  });

  // Interactive Planner state (Simulated Nepal Hour offset in minutes)
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);
  const [plannerMinutesOffset, setPlannerMinutesOffset] = useState<number>(0);

  // Update clock tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePinCity = (cityId: string) => {
    setPinnedCityIds((prev) => {
      const next = prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId];
      try {
        localStorage.setItem('hamro_patro_pinned_cities', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Base date used for calculation (either live now or planner shifted)
  const effectiveDate = useMemo(() => {
    if (plannerMinutesOffset === 0) return now;
    return new Date(now.getTime() + plannerMinutesOffset * 60 * 1000);
  }, [now, plannerMinutesOffset]);

  // Helper to extract time details in a timezone
  const getTimeInZone = (tz: string, targetDate: Date = effectiveDate) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: !is24Hour,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const parts = formatter.formatToParts(targetDate);
      let hour = '';
      let minute = '';
      let second = '';
      let dayPeriod = '';
      let weekday = '';
      let month = '';
      let day = '';
      let year = '';

      parts.forEach((p) => {
        if (p.type === 'hour') hour = p.value;
        if (p.type === 'minute') minute = p.value;
        if (p.type === 'second') second = p.value;
        if (p.type === 'dayPeriod') dayPeriod = p.value;
        if (p.type === 'weekday') weekday = p.value;
        if (p.type === 'month') month = p.value;
        if (p.type === 'day') day = p.value;
        if (p.type === 'year') year = p.value;
      });

      // Get 24h raw hour for day/night and call suitability
      const f24 = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false,
      });
      const rawHour24 = parseInt(f24.format(targetDate), 10);
      const isDayTime = rawHour24 >= 6 && rawHour24 < 18;

      // Call suitability:
      // 8 AM - 9 PM: Ideal call time
      // 6 AM - 8 AM or 9 PM - 11 PM: Early/Late
      // 11 PM - 6 AM: Night/Sleeping
      let callStatus: 'ideal' | 'moderate' | 'sleeping' = 'sleeping';
      if (rawHour24 >= 8 && rawHour24 < 21) {
        callStatus = 'ideal';
      } else if ((rawHour24 >= 6 && rawHour24 < 8) || (rawHour24 >= 21 && rawHour24 < 23)) {
        callStatus = 'moderate';
      }

      return {
        hour,
        minute,
        second,
        dayPeriod,
        weekday,
        month,
        day,
        year,
        rawHour24,
        isDayTime,
        callStatus,
        dateFormatted: `${weekday}, ${month} ${day}`,
      };
    } catch {
      return {
        hour: '--',
        minute: '--',
        second: '--',
        dayPeriod: '',
        weekday: '',
        month: '',
        day: '',
        year: '',
        rawHour24: 12,
        isDayTime: true,
        callStatus: 'ideal' as const,
        dateFormatted: '',
      };
    }
  };

  // Calculate difference with Nepal Time in minutes
  const getDifferenceWithNepal = (tz: string, targetDate: Date = effectiveDate) => {
    if (tz === 'Asia/Kathmandu') return { diffMinutes: 0, textNe: 'नेपाल समय (गृह)', textEn: 'Home (Nepal)' };

    try {
      const getTzOffsetMs = (timeZone: string, date: Date) => {
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
        return tzDate.getTime() - utcDate.getTime();
      };

      const nepalOffset = getTzOffsetMs('Asia/Kathmandu', targetDate);
      const cityOffset = getTzOffsetMs(tz, targetDate);
      const diffMs = cityOffset - nepalOffset;
      const totalMinutes = Math.round(diffMs / (60 * 1000));

      const isAhead = totalMinutes > 0;
      const absMinutes = Math.abs(totalMinutes);
      const hours = Math.floor(absMinutes / 60);
      const mins = absMinutes % 60;

      let partsNe = [];
      let partsEn = [];
      if (hours > 0) {
        partsNe.push(`${toNepaliDigits(hours)} घण्टा`);
        partsEn.push(`${hours} hr`);
      }
      if (mins > 0) {
        partsNe.push(`${toNepaliDigits(mins)} मिनेट`);
        partsEn.push(`${mins} min`);
      }

      const diffStrNe = partsNe.join(' ');
      const diffStrEn = partsEn.join(' ');

      if (totalMinutes === 0) {
        return { diffMinutes: 0, textNe: 'नेपालसँग उस्तै समय', textEn: 'Same as Nepal' };
      }

      return {
        diffMinutes: totalMinutes,
        textNe: isAhead ? `नेपालभन्दा ${diffStrNe} अगाडि` : `नेपालभन्दा ${diffStrNe} पछाडि`,
        textEn: isAhead ? `${diffStrEn} ahead of Nepal` : `${diffStrEn} behind Nepal`,
      };
    } catch {
      return { diffMinutes: 0, textNe: '', textEn: '' };
    }
  };

  // Nepal baseline time
  const nepalTime = getTimeInZone('Asia/Kathmandu', effectiveDate);

  // Analog Clock angles for Nepal
  const nepalSeconds = effectiveDate.getSeconds();
  const nepalMinutes = effectiveDate.getMinutes();
  const nepalHours = nepalTime.rawHour24 % 12;

  const secondHandAngle = nepalSeconds * 6; // 360 / 60
  const minuteHandAngle = nepalMinutes * 6 + nepalSeconds * 0.1;
  const hourHandAngle = nepalHours * 30 + nepalMinutes * 0.5;

  // Filtered cities
  const filteredCities = useMemo(() => {
    return CITIES.filter((city) => {
      // Don't duplicate Kathmandu in the grid as it's shown in the hero
      if (city.isDefaultHome) return false;

      // Region Filter
      if (selectedRegion === 'pinned') {
        if (!pinnedCityIds.includes(city.id)) return false;
      } else if (selectedRegion !== 'all' && city.region !== selectedRegion) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNe = city.cityNameNe.toLowerCase().includes(q) || city.countryNameNe.toLowerCase().includes(q);
        const matchEn = city.cityNameEn.toLowerCase().includes(q) || city.countryNameEn.toLowerCase().includes(q);
        return matchNe || matchEn;
      }

      return true;
    }).sort((a, b) => {
      // Pinned cities first
      const aPinned = pinnedCityIds.includes(a.id);
      const bPinned = pinnedCityIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [searchQuery, selectedRegion, pinnedCityIds]);

  const regionTabs = [
    { id: 'all', nameNe: 'सबै शहरहरू', nameEn: 'All Cities', icon: Globe },
    { id: 'pinned', nameNe: `मनपर्ने (${toNepaliDigits(pinnedCityIds.length)})`, nameEn: `Favorites (${pinnedCityIds.length})`, icon: Star },
    { id: 'middle_east', nameNe: 'खाडी / मध्यपूर्व', nameEn: 'Middle East / Gulf', icon: Compass },
    { id: 'asia', nameNe: 'एसिया र छिमेकी', nameEn: 'Asia & Neighbors', icon: Globe },
    { id: 'americas', nameNe: 'उत्तर अमेरिका', nameEn: 'Americas', icon: Globe },
    { id: 'europe', nameNe: 'युरोप र बेलायत', nameEn: 'Europe & UK', icon: Globe },
    { id: 'oceania', nameNe: 'अस्ट्रेलिया / प्रशान्त', nameEn: 'Oceania', icon: Globe },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Page Title & Format Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{lang === 'ne' ? 'विश्व घडी' : 'World Clock'}</span>
                <span className="text-xs bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                  {lang === 'ne' ? 'नेपाल प्रमाणिक समय (NPT)' : 'Nepal Standard Time'}
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'ne'
                  ? 'नेपाल समयलाई आधार मानि विश्वभरका मुख्य शहरहरूको प्रत्यक्ष समय र अन्तर'
                  : 'Live international time zones benchmarked against Nepal Standard Time (UTC +5:45)'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPlannerOpen(!isPlannerOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPlannerOpen || plannerMinutesOffset !== 0
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'कल योजनाकार / कन्भर्टर' : 'Meeting / Call Planner'}</span>
            {plannerMinutesOffset !== 0 && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIs24Hour(!is24Hour)}
            className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
          >
            {is24Hour 
              ? (lang === 'ne' ? '२४-घण्टा ढाँचा' : '24-Hour Format') 
              : (lang === 'ne' ? '१२-घण्टा (AM/PM)' : '12-Hour (AM/PM)')}
          </button>
        </div>
      </div>

      {/* Interactive Call Planner Slider Card (if open) */}
      {isPlannerOpen && (
        <div className="bg-amber-50/90 dark:bg-stone-900 border-2 border-amber-300 dark:border-amber-500/50 rounded-2xl p-5 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-amber-200/80 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-white text-sm">
                  {lang === 'ne' ? 'विदेशमा रहेका परिवार तथा साथीहरूसँग कुराकानी गर्ने समय योजनाकार' : 'Global Call & Meeting Time Planner'}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {lang === 'ne'
                    ? 'तलको स्लाइडर सार्नुहोस् र नेपालको कुनै पनि समय छान्नुहोस्, अन्य देशमा कुन समय हुन्छ तत्काल देखिनेछ।'
                    : 'Slide to adjust Nepal time and instantly see the corresponding time across all international destinations.'}
                </p>
              </div>
            </div>

            {plannerMinutesOffset !== 0 && (
              <button
                type="button"
                onClick={() => setPlannerMinutesOffset(0)}
                className="text-xs font-bold bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{lang === 'ne' ? 'हालको समयमा फर्कनुहोस्' : 'Reset to Live Time'}</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <span className="flex items-center gap-1 text-amber-800 dark:text-amber-300">
                🇳🇵 {lang === 'ne' ? 'छानिएको नेपाल समय:' : 'Simulated Nepal Time:'}
                <strong className="text-sm text-stone-900 dark:text-white underline ml-1">
                  {lang === 'ne'
                    ? `${toNepaliDigits(nepalTime.hour)}:${toNepaliDigits(nepalTime.minute)} ${nepalTime.dayPeriod === 'AM' ? 'बिहान' : 'साँझ/दिउँसो'}`
                    : `${nepalTime.hour}:${nepalTime.minute} ${nepalTime.dayPeriod}`}
                </strong>
              </span>
              <span className="text-stone-500">
                {plannerMinutesOffset > 0 ? `+${plannerMinutesOffset / 60}h` : plannerMinutesOffset < 0 ? `${plannerMinutesOffset / 60}h` : lang === 'ne' ? 'प्रत्यक्ष (Live)' : 'Live'}
              </span>
            </div>

            <input
              type="range"
              min="-720"
              max="720"
              step="30"
              value={plannerMinutesOffset}
              onChange={(e) => setPlannerMinutesOffset(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span>-12 घण्टा (पहिले)</span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">● ० (अहिलेको प्रत्यक्ष समय)</span>
              <span>+12 घण्टा (पछि)</span>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION: DEFAULT NEPAL STANDARD TIME (काठमाडौं, नेपाल) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-600/40">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-10 text-white select-none pointer-events-none">
          <Clock className="w-80 h-80" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left / Center Info */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-3xl">🇳🇵</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {lang === 'ne' ? 'काठमाडौं, नेपाल' : 'Kathmandu, Nepal'}
                  </h3>
                  <span className="bg-amber-400 text-stone-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {lang === 'ne' ? 'गृह समय (Home)' : 'Home Time'}
                  </span>
                </div>
                <p className="text-xs text-red-200 font-medium">
                  {lang === 'ne' 
                    ? 'नेपाल प्रमाणिक समय (Nepal Standard Time - NPT) • UTC +05:45'
                    : 'Nepal Standard Time (NPT) • UTC +05:45 (Gaurishankar Meridian)'}
                </p>
              </div>
            </div>

            {/* Giant Live Digital Display */}
            <div className="flex flex-wrap items-baseline gap-3">
              <div className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono drop-shadow-md">
                {lang === 'ne' ? (
                  <>
                    <span>{toNepaliDigits(nepalTime.hour)}</span>
                    <span className="animate-pulse text-amber-300">:</span>
                    <span>{toNepaliDigits(nepalTime.minute)}</span>
                    <span className="animate-pulse text-amber-300">:</span>
                    <span className="text-2xl sm:text-4xl text-amber-300 font-bold">{toNepaliDigits(nepalTime.second)}</span>
                  </>
                ) : (
                  <>
                    <span>{nepalTime.hour}</span>
                    <span className="animate-pulse text-amber-300">:</span>
                    <span>{nepalTime.minute}</span>
                    <span className="animate-pulse text-amber-300">:</span>
                    <span className="text-2xl sm:text-4xl text-amber-300 font-bold">{nepalTime.second}</span>
                  </>
                )}
              </div>

              {!is24Hour && (
                <div className="text-lg sm:text-2xl font-extrabold text-amber-300 uppercase tracking-wider">
                  {lang === 'ne' 
                    ? (nepalTime.dayPeriod === 'AM' ? 'बिहान (AM)' : 'साँझ / दिउँसो (PM)') 
                    : nepalTime.dayPeriod}
                </div>
              )}
            </div>

            {/* Live Nepali Date & Gregorian Date Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-red-100 bg-red-950/70 border border-red-500/30 rounded-2xl p-3 w-fit">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <Calendar className="w-4 h-4 text-amber-300" />
                {lang === 'ne' ? todayBs.formattedNe : todayBs.formattedEn}
              </span>
              <span className="text-red-400">•</span>
              <span className="text-stone-200 font-medium">
                {nepalTime.dateFormatted} {nepalTime.year}
              </span>
              <span className="text-red-400">•</span>
              <span className="flex items-center gap-1 text-red-200">
                {nepalTime.isDayTime ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'ne' ? 'दिवा समय (Daylight)' : 'Daytime'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-200" />
                    <span>{lang === 'ne' ? 'रात्री समय (Night)' : 'Nighttime'}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right: Beautiful Live Analog Clock Face */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-white/10 backdrop-blur-md border-4 border-amber-400/80 shadow-2xl flex items-center justify-center">
              {/* Hour tick marks */}
              {[...Array(12)].map((_, i) => {
                const angle = i * 30;
                const isQuarter = i % 3 === 0;
                return (
                  <div
                    key={i}
                    className="absolute w-full h-full flex justify-center items-start pt-1.5"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div
                      className={`${
                        isQuarter ? 'w-1 h-3 bg-amber-300' : 'w-0.5 h-1.5 bg-white/50'
                      } rounded-full`}
                    />
                  </div>
                );
              })}

              {/* Hour Hand */}
              <div
                className="absolute w-1.5 bg-white rounded-full origin-bottom shadow-sm"
                style={{
                  height: '32%',
                  bottom: '50%',
                  transform: `rotate(${hourHandAngle}deg)`,
                  transition: 'transform 0.05s ease-in-out',
                }}
              />

              {/* Minute Hand */}
              <div
                className="absolute w-1 bg-amber-300 rounded-full origin-bottom shadow-sm"
                style={{
                  height: '42%',
                  bottom: '50%',
                  transform: `rotate(${minuteHandAngle}deg)`,
                  transition: 'transform 0.05s ease-in-out',
                }}
              />

              {/* Second Hand */}
              <div
                className="absolute w-0.5 bg-red-400 rounded-full origin-bottom shadow-sm"
                style={{
                  height: '46%',
                  bottom: '50%',
                  transform: `rotate(${secondHandAngle}deg)`,
                  transition: 'transform 0.1s linear',
                }}
              />

              {/* Center Pin */}
              <div className="w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-red-900 z-20 shadow-md" />

              {/* Nepal Flag inside clock */}
              <div className="absolute bottom-6 text-[11px] font-bold text-amber-200 tracking-wider">
                NPT 5:45
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="space-y-4">
        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ne' ? 'शहर वा देश खोज्नुहोस् (उदा. दुबई, टोकियो, लन्डन...)' : 'Search city or country (e.g. Dubai, Tokyo, London)...'}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <span>
              {lang === 'ne'
                ? `कुल ${toNepaliDigits(filteredCities.length)} शहरहरू प्रदर्शित`
                : `Showing ${filteredCities.length} world cities`}
            </span>
          </div>
        </div>

        {/* Region Tabs Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {regionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedRegion === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-red-700 text-white border-red-700 shadow-sm'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-400 dark:text-stone-500'}`} />
                <span>{lang === 'ne' ? tab.nameNe : tab.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* INTERNATIONAL CITIES GRID */}
      {filteredCities.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-12 text-center text-stone-500 dark:text-stone-400">
          <Clock className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
          <p className="font-bold text-stone-700 dark:text-stone-200">
            {lang === 'ne' ? 'कुनै शहर फेला परेन' : 'No matching cities found'}
          </p>
          <p className="text-xs mt-1">
            {lang === 'ne' ? 'कृपया फरक खोजी शब्द प्रयोग गर्नुहोस्।' : 'Try searching with another keyword.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map((city) => {
            const timeInfo = getTimeInZone(city.timeZone, effectiveDate);
            const diffInfo = getDifferenceWithNepal(city.timeZone, effectiveDate);
            const isPinned = pinnedCityIds.includes(city.id);

            return (
              <div
                key={city.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-md hover:border-red-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Header: Flag, City, Pin button */}
                  <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-stone-100 dark:border-stone-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl" role="img" aria-label={city.cityNameEn}>
                        {city.flag}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-stone-900 dark:text-white text-base group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                          {lang === 'ne' ? city.cityNameNe : city.cityNameEn}
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {lang === 'ne' ? city.countryNameNe : city.countryNameEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => togglePinCity(city.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isPinned
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-300'
                        }`}
                        title={isPinned ? 'Unpin City' : 'Pin to Top'}
                      >
                        <Star className={`w-4 h-4 ${isPinned ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Big Digital Time Display */}
                  <div className="flex items-baseline justify-between gap-2 my-2">
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-stone-900 dark:text-white">
                      {lang === 'ne' ? (
                        <>
                          <span>{toNepaliDigits(timeInfo.hour)}</span>
                          <span className="text-stone-400 dark:text-stone-600 animate-pulse">:</span>
                          <span>{toNepaliDigits(timeInfo.minute)}</span>
                          {!is24Hour && (
                            <span className="text-xs sm:text-sm font-bold ml-1.5 text-stone-500 dark:text-stone-400 font-sans">
                              {timeInfo.dayPeriod === 'AM' ? 'बिहान' : 'साँझ'}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span>{timeInfo.hour}</span>
                          <span className="text-stone-400 dark:text-stone-600 animate-pulse">:</span>
                          <span>{timeInfo.minute}</span>
                          {!is24Hour && (
                            <span className="text-xs sm:text-sm font-bold ml-1.5 text-stone-500 dark:text-stone-400 font-sans">
                              {timeInfo.dayPeriod}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Day / Night icon */}
                    <div
                      className={`px-2 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 ${
                        timeInfo.isDayTime
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-900/60'
                      }`}
                    >
                      {timeInfo.isDayTime ? (
                        <>
                          <Sun className="w-3 h-3 text-amber-500" />
                          <span>{lang === 'ne' ? 'दिन' : 'Day'}</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3 h-3 text-indigo-500" />
                          <span>{lang === 'ne' ? 'रात' : 'Night'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Local Date */}
                  <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{timeInfo.dateFormatted}</span>
                  </div>
                </div>

                {/* Footer Metadata: Difference with Nepal & Call suitability */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400">
                      {lang === 'ne' ? 'नेपालसँग समय अन्तर:' : 'Diff with Nepal:'}
                    </span>
                    <span
                      className={`font-bold text-xs ${
                        diffInfo.diffMinutes > 0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : diffInfo.diffMinutes < 0
                          ? 'text-purple-700 dark:text-purple-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {lang === 'ne' ? diffInfo.textNe : diffInfo.textEn}
                    </span>
                  </div>

                  {/* Call Suitability Indicator */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        timeInfo.callStatus === 'ideal'
                          ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950'
                          : timeInfo.callStatus === 'moderate'
                          ? 'bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-950'
                          : 'bg-rose-500 ring-2 ring-rose-200 dark:ring-rose-950'
                      }`}
                    />
                    <span className="text-stone-600 dark:text-stone-300 font-medium">
                      {timeInfo.callStatus === 'ideal'
                        ? (lang === 'ne' ? 'कल गर्न उपयुक्त समय (८ AM - ९ PM)' : 'Ideal call time (8 AM - 9 PM)')
                        : timeInfo.callStatus === 'moderate'
                        ? (lang === 'ne' ? 'सबेरै वा ढिला साँझ' : 'Early morning / late evening')
                        : (lang === 'ne' ? 'सुत्ने समय (११ PM - ६ AM)' : 'Night / Sleeping hours (11 PM - 6 AM)')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Information Notice */}
      <div className="bg-stone-50 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-stone-800 dark:text-stone-200">
            {lang === 'ne' ? 'नेपाल प्रमाणिक समय (NPT) बारे तथ्य:' : 'About Nepal Standard Time (NPT):'}
          </p>
          <p>
            {lang === 'ne'
              ? 'नेपालको समय गौरीशङ्कर हिमाल (८६° १५\' पूर्वी देशान्तर) लाई आधार मानी निर्धारण गरिएको छ, जुन ग्रीनविच मिन टाइम (GMT/UTC) भन्दा ५ घण्टा ४५ मिनेट अगाडि छ। यो विश्वका ३ वटा मात्र ४५ मिनेटको अन्तर भएका विशिष्ट समय क्षेत्रहरू मध्ये एक हो।'
              : 'Nepal Standard Time is based on the meridian of Mount Gaurishankar (86° 15\' E), which is exactly 5 hours and 45 minutes ahead of UTC/GMT (+05:45). It is one of only three time zones globally with a 45-minute offset.'}
          </p>
        </div>
      </div>
    </div>
  );
};
