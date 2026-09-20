import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  CloudSnow, 
  CloudFog, 
  Wind, 
  Droplets, 
  Gauge, 
  Thermometer, 
  Umbrella, 
  Search, 
  RefreshCw, 
  MapPin, 
  Sunrise, 
  Sunset, 
  Sparkles, 
  Mountain,
  Navigation as CompassIcon,
  X
} from 'lucide-react';
import { Language, NepalCity, CityWeatherData } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { 
  NEPAL_MAJOR_CITIES, 
  getWeatherCondition, 
  fetchCityWeather, 
  getFallbackWeatherData,
  WeatherConditionMeta 
} from '../utils/weatherService';

interface WeatherViewProps {
  lang: Language;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ lang }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('kathmandu');
  const [cityWeatherDataMap, setCityWeatherDataMap] = useState<Record<string, CityWeatherData>>({});
  const [isLoadingCity, setIsLoadingCity] = useState<boolean>(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState<boolean>(false);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  const selectedCity = useMemo(() => {
    return NEPAL_MAJOR_CITIES.find(c => c.id === selectedCityId) || NEPAL_MAJOR_CITIES[0];
  }, [selectedCityId]);

  const activeWeatherData = cityWeatherDataMap[selectedCityId];

  // Helper to convert Celsius to display unit
  const formatTemp = (celsius: number): string => {
    const val = temperatureUnit === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius;
    return lang === 'ne' ? `${toNepaliDigits(val)}°${temperatureUnit}` : `${val}°${temperatureUnit}`;
  };

  // Render weather icon according to iconType
  const renderWeatherIcon = (iconType: string, className: string = 'w-6 h-6') => {
    switch (iconType) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'moon':
        return <Moon className={`${className} text-indigo-400`} />;
      case 'sun-cloud':
        return <CloudSun className={`${className} text-amber-500`} />;
      case 'moon-cloud':
        return <CloudMoon className={`${className} text-indigo-300`} />;
      case 'cloud':
        return <Cloud className={`${className} text-stone-400`} />;
      case 'fog':
        return <CloudFog className={`${className} text-slate-400`} />;
      case 'drizzle':
        return <CloudDrizzle className={`${className} text-cyan-400`} />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'snow':
      case 'snow-rain':
        return <CloudSnow className={`${className} text-sky-300`} />;
      case 'thunderstorm':
      case 'thunderstorm-hail':
        return <CloudLightning className={`${className} text-amber-400`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  // Load weather for selected city
  const loadCityWeather = async (city: NepalCity, force = false) => {
    if (!force && cityWeatherDataMap[city.id]) {
      return;
    }
    setIsLoadingCity(true);
    try {
      const data = await fetchCityWeather(city);
      setCityWeatherDataMap(prev => ({ ...prev, [city.id]: data }));
      setLastRefreshedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn(`Live weather fetch failed for ${city.nameEn}, using fallback data`, err);
      const fallback = getFallbackWeatherData(city);
      setCityWeatherDataMap(prev => ({ ...prev, [city.id]: fallback }));
      setLastRefreshedAt(new Date().toLocaleTimeString());
    } finally {
      setIsLoadingCity(false);
    }
  };

  // Pre-load popular cities on initial mount
  useEffect(() => {
    const initWeather = async () => {
      // First load selected city
      await loadCityWeather(selectedCity);

      // In background, load popular cities
      const popularCities = NEPAL_MAJOR_CITIES.filter(c => c.isPopular && c.id !== selectedCity.id);
      for (const city of popularCities.slice(0, 6)) {
        try {
          const data = await fetchCityWeather(city);
          setCityWeatherDataMap(prev => ({ ...prev, [city.id]: data }));
        } catch {
          const fallback = getFallbackWeatherData(city);
          setCityWeatherDataMap(prev => ({ ...prev, [city.id]: fallback }));
        }
      }
    };

    initWeather();
  }, []);

  // When selected city changes, fetch its data if not yet cached
  useEffect(() => {
    loadCityWeather(selectedCity);
  }, [selectedCityId]);

  // Refresh all currently cached cities
  const handleRefreshAll = async () => {
    setIsRefreshingAll(true);
    try {
      const updated = await fetchCityWeather(selectedCity);
      setCityWeatherDataMap(prev => ({ ...prev, [selectedCity.id]: updated }));
      setLastRefreshedAt(new Date().toLocaleTimeString());
    } catch {
      const fallback = getFallbackWeatherData(selectedCity);
      setCityWeatherDataMap(prev => ({ ...prev, [selectedCity.id]: fallback }));
    } finally {
      setIsRefreshingAll(false);
    }
  };

  // Filtered cities list based on search and region
  const filteredCities = useMemo(() => {
    return NEPAL_MAJOR_CITIES.filter(city => {
      // Region filter
      if (selectedRegionFilter !== 'all') {
        if (selectedRegionFilter === 'himal' || selectedRegionFilter === 'pahad' || selectedRegionFilter === 'terai') {
          if (city.region !== selectedRegionFilter) return false;
        } else if (selectedRegionFilter === 'bagmati' && !city.provinceEn.includes('Bagmati')) {
          return false;
        } else if (selectedRegionFilter === 'gandaki' && !city.provinceEn.includes('Gandaki')) {
          return false;
        } else if (selectedRegionFilter === 'koshi' && !city.provinceEn.includes('Koshi')) {
          return false;
        } else if (selectedRegionFilter === 'madhesh' && !city.provinceEn.includes('Madhesh')) {
          return false;
        } else if (selectedRegionFilter === 'lumbini' && !city.provinceEn.includes('Lumbini')) {
          return false;
        } else if (selectedRegionFilter === 'karnali' && !city.provinceEn.includes('Karnali')) {
          return false;
        } else if (selectedRegionFilter === 'sudurpashchim' && !city.provinceEn.includes('Sudurpashchim')) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameEn = city.nameEn.toLowerCase().includes(q);
        const matchNameNe = city.nameNe.includes(q);
        const matchProvEn = city.provinceEn.toLowerCase().includes(q);
        const matchProvNe = city.provinceNe.includes(q);
        return matchNameEn || matchNameNe || matchProvEn || matchProvNe;
      }

      return true;
    });
  }, [searchQuery, selectedRegionFilter]);

  // Current condition info for active city
  const currentCondition: WeatherConditionMeta = useMemo(() => {
    if (!activeWeatherData) {
      return getWeatherCondition(0, true);
    }
    return getWeatherCondition(activeWeatherData.current.weatherCode, activeWeatherData.current.isDay);
  }, [activeWeatherData]);

  // Dynamic hero gradient background based on day/night and condition
  const heroBackgroundClass = useMemo(() => {
    if (!activeWeatherData) {
      return 'from-blue-600 via-sky-600 to-indigo-700 text-white';
    }
    const isDay = activeWeatherData.current.isDay;
    const cat = currentCondition.category;

    if (!isDay) {
      return 'from-slate-900 via-indigo-950 to-stone-900 text-white border-indigo-900/40';
    }
    if (cat === 'rain' || cat === 'drizzle') {
      return 'from-slate-700 via-sky-800 to-blue-900 text-white border-slate-700';
    }
    if (cat === 'thunderstorm') {
      return 'from-purple-950 via-indigo-900 to-slate-900 text-white border-purple-900';
    }
    if (cat === 'snow') {
      return 'from-sky-700 via-cyan-800 to-blue-900 text-white border-sky-800';
    }
    if (cat === 'cloudy' || cat === 'fog') {
      return 'from-stone-700 via-slate-700 to-zinc-800 text-white border-stone-600';
    }
    // Clear / Partly Cloudy Day
    return 'from-sky-600 via-blue-600 to-indigo-700 text-white border-sky-500';
  }, [activeWeatherData, currentCondition]);

  // Format hourly time (e.g., "14:00" -> "2 PM" or "२:०० दिउँसो")
  const formatHour = (isoTime: string) => {
    const d = new Date(isoTime);
    const h = d.getHours();
    const ampm = h >= 12 ? (lang === 'ne' ? 'दिउँसो/साँझ' : 'PM') : (lang === 'ne' ? 'बिहान' : 'AM');
    const displayH = h % 12 || 12;
    return lang === 'ne' ? `${toNepaliDigits(displayH)} ${ampm}` : `${displayH} ${ampm}`;
  };

  // Format day of week for daily forecast
  const formatDayName = (dateStr: string, idx: number) => {
    if (idx === 0) return lang === 'ne' ? 'आज (Today)' : 'Today';
    if (idx === 1) return lang === 'ne' ? 'भोलि (Tomorrow)' : 'Tomorrow';
    const d = new Date(dateStr);
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysNe = ['आइतवार', 'सोमवार', 'मङ्गलवार', 'बुधवार', 'बिहीवार', 'शुक्रवार', 'शनिवार'];
    const dayIdx = d.getDay();
    return lang === 'ne' ? daysNe[dayIdx] : daysEn[dayIdx];
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Top Title & Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <span>{lang === 'ne' ? 'नेपालको मौसम पूर्वानुमान' : 'Nepal Weather & Live Forecast'}</span>
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'ne' 
                  ? 'नेपालका प्रमुख शहरहरूको प्रत्यक्ष मौसमी अवस्था, तापक्रम तथा आगामी ७ दिनको पूर्वानुमान' 
                  : 'Live weather conditions, temperatures, and 7-day forecasts for major cities across Nepal'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Live API badge, Celsius/Fahrenheit toggle, Refresh */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {/* Live Free Weather API Source Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-900/60 rounded-xl text-xs font-semibold text-sky-800 dark:text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Open-Meteo API</span>
          </div>

          {/* Temperature Unit Toggle (°C / °F) */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setTemperatureUnit('C')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                temperatureUnit === 'C'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setTemperatureUnit('F')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                temperatureUnit === 'F'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshingAll || isLoadingCity}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title={lang === 'ne' ? 'मौसम तथ्याङ्क ताजा गर्नुहोस्' : 'Refresh Weather Data'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingAll || isLoadingCity ? 'animate-spin' : ''}`} />
            <span>{lang === 'ne' ? 'ताजा गर्नुहोस्' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Featured City Main Hero Weather Section */}
      <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${heroBackgroundClass} shadow-lg relative overflow-hidden transition-all duration-300 border`}>
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Top Row: Location Name, Province, Elevation & Condition Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="p-1.5 bg-white/20 backdrop-blur-xs rounded-xl text-white">
                  <MapPin className="w-4 h-4" />
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {lang === 'ne' ? selectedCity.nameNe : selectedCity.nameEn}
                </h2>
                {selectedCity.isCapital && (
                  <span className="px-2.5 py-0.5 bg-amber-400 text-stone-950 text-xs font-extrabold rounded-full">
                    {lang === 'ne' ? 'राजधानी' : 'Capital'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-white/80 font-medium">
                <span>{lang === 'ne' ? selectedCity.provinceNe : selectedCity.provinceEn}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? `${toNepaliDigits(selectedCity.elevation)} मि.` : `${selectedCity.elevation} m`}</span>
                </span>
                {lastRefreshedAt && (
                  <>
                    <span>•</span>
                    <span className="text-white/70 text-xs">
                      {lang === 'ne' ? `अपडेट: ${lastRefreshedAt}` : `Updated: ${lastRefreshedAt}`}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Weather condition badge */}
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-xs">
              {renderWeatherIcon(currentCondition.iconType, 'w-8 h-8')}
              <div>
                <span className="text-xs uppercase tracking-wider text-white/80 block font-bold">
                  {lang === 'ne' ? 'हालको अवस्था' : 'Condition'}
                </span>
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {lang === 'ne' ? currentCondition.labelNe : currentCondition.labelEn}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Row: Big Temperature Display + Feels like + High/Low */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Big Temperature */}
            <div className="md:col-span-6 flex items-baseline gap-4">
              <span className="text-6xl sm:text-8xl font-black tracking-tighter leading-none drop-shadow-sm">
                {activeWeatherData ? formatTemp(activeWeatherData.current.temperature) : '--'}
              </span>
              <div className="space-y-1">
                <span className="text-sm sm:text-base text-white/90 font-semibold block">
                  {lang === 'ne' ? 'महसुस हुने:' : 'Feels like:'}{' '}
                  <span className="font-bold">
                    {activeWeatherData ? formatTemp(activeWeatherData.current.apparentTemperature) : '--'}
                  </span>
                </span>
                {activeWeatherData && activeWeatherData.daily?.[0] && (
                  <span className="text-xs sm:text-sm text-white/80 font-medium block">
                    {lang === 'ne' ? 'अधिकतम:' : 'High:'} {formatTemp(activeWeatherData.daily[0].tempMax)} •{' '}
                    {lang === 'ne' ? 'न्यूनतम:' : 'Low:'} {formatTemp(activeWeatherData.daily[0].tempMin)}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Summary Notice */}
            <div className="md:col-span-6 bg-black/15 backdrop-blur-sm rounded-2xl p-4 border border-white/15 text-xs sm:text-sm text-white/90 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ne' ? 'मौसम विश्लेषण' : 'Weather Insights'}</span>
              </div>
              <p>
                {lang === 'ne'
                  ? `${selectedCity.nameNe}मा हाल ${currentCondition.labelNe} रहेको छ। आर्द्रता ${toNepaliDigits(activeWeatherData?.current.humidity || 0)}% र हावाको गति ${toNepaliDigits(activeWeatherData?.current.windSpeed || 0)} कि.मि./घण्टा मापन गरिएको छ।`
                  : `Currently ${currentCondition.labelEn} in ${selectedCity.nameEn}. Humidity stands at ${activeWeatherData?.current.humidity || 0}% with winds at ${activeWeatherData?.current.windSpeed || 0} km/h.`}
              </p>
            </div>
          </div>

          {/* 6 Key Weather Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {/* Metric 1: Humidity */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-300" />
                <span>{lang === 'ne' ? 'आर्द्रता' : 'Humidity'}</span>
              </div>
              <div className="text-lg font-black text-white">
                {activeWeatherData ? (lang === 'ne' ? `${toNepaliDigits(activeWeatherData.current.humidity)}%` : `${activeWeatherData.current.humidity}%`) : '--'}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {lang === 'ne' ? 'सापेक्षिक आर्द्रता' : 'Relative humidity'}
              </div>
            </div>

            {/* Metric 2: Wind Speed */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-1">
                <Wind className="w-3.5 h-3.5 text-sky-300" />
                <span>{lang === 'ne' ? 'हावाको गति' : 'Wind Speed'}</span>
              </div>
              <div className="text-lg font-black text-white">
                {activeWeatherData ? (lang === 'ne' ? `${toNepaliDigits(activeWeatherData.current.windSpeed)} km/h` : `${activeWeatherData.current.windSpeed} km/h`) : '--'}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {lang === 'ne' ? 'दिशा:' : 'Dir:'} {activeWeatherData?.current.windDirection || 0}°
              </div>
            </div>

            {/* Metric 3: Rain/Precipitation */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-1">
                <Umbrella className="w-3.5 h-3.5 text-indigo-300" />
                <span>{lang === 'ne' ? 'वर्षा सम्भावना' : 'Rain Chance'}</span>
              </div>
              <div className="text-lg font-black text-white">
                {activeWeatherData && activeWeatherData.daily?.[0]
                  ? (lang === 'ne' ? `${toNepaliDigits(activeWeatherData.daily[0].precipitationProbability)}%` : `${activeWeatherData.daily[0].precipitationProbability}%`)
                  : '0%'}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {lang === 'ne' ? 'आजको अधिकतम' : "Today's prob."}
              </div>
            </div>

            {/* Metric 4: UV Index */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'ne' ? 'UV सूचकाङ्क' : 'UV Index'}</span>
              </div>
              <div className="text-lg font-black text-white">
                {activeWeatherData && activeWeatherData.daily?.[0]
                  ? (lang === 'ne' ? toNepaliDigits(activeWeatherData.daily[0].uvIndexMax) : activeWeatherData.daily[0].uvIndexMax)
                  : '--'}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {activeWeatherData?.daily?.[0]?.uvIndexMax !== undefined && activeWeatherData.daily[0].uvIndexMax >= 8 
                  ? (lang === 'ne' ? 'धेरै उच्च (छाता ओढ्नुहोस्)' : 'Very High') 
                  : (lang === 'ne' ? 'मध्यम' : 'Moderate')}
              </div>
            </div>

            {/* Metric 5: Surface Pressure */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-300" />
                <span>{lang === 'ne' ? 'वायु चाप' : 'Pressure'}</span>
              </div>
              <div className="text-lg font-black text-white">
                {activeWeatherData ? (lang === 'ne' ? `${toNepaliDigits(activeWeatherData.current.pressure)} hPa` : `${activeWeatherData.current.pressure} hPa`) : '--'}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {lang === 'ne' ? 'वायुमण्डलीय चाप' : 'Surface level'}
              </div>
            </div>

            {/* Metric 6: Sun Timing */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-1">
                <Sunrise className="w-3.5 h-3.5 text-orange-300" />
                <span>{lang === 'ne' ? 'सूर्य चक्र' : 'Sun Times'}</span>
              </div>
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>{activeWeatherData?.daily?.[0]?.sunrise || '05:45'}</span>
                <span>/</span>
                <span>{activeWeatherData?.daily?.[0]?.sunset || '18:20'}</span>
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {lang === 'ne' ? 'सूर्योदय / सूर्यास्त' : 'Sunrise / Sunset'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Strip (Next 24 Hours) */}
      {activeWeatherData && activeWeatherData.hourly.length > 0 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{lang === 'ne' ? 'आगामी घण्टाको तापक्रम पूर्वानुमान' : 'Hourly Temperature Forecast'}</span>
            </h3>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {lang === 'ne' ? '२४ घण्टे विवरण' : '24-Hour Timeline'}
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            {activeWeatherData.hourly.slice(0, 18).map((hour, idx) => {
              const cond = getWeatherCondition(hour.weatherCode, true);
              const isFirst = idx === 0;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-between p-3 rounded-2xl min-w-[76px] sm:min-w-[84px] text-center border transition-all ${
                    isFirst
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/80 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-100 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${isFirst ? 'text-sky-700 dark:text-sky-300' : 'text-stone-600 dark:text-stone-400'}`}>
                    {isFirst ? (lang === 'ne' ? 'अहिले' : 'Now') : formatHour(hour.time)}
                  </span>
                  
                  <div className="my-2">
                    {renderWeatherIcon(cond.iconType, 'w-6 h-6')}
                  </div>

                  <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                    {formatTemp(hour.temperature)}
                  </span>

                  {hour.precipitationProbability > 0 && (
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-0.5 mt-1">
                      <Droplets className="w-2.5 h-2.5" />
                      {lang === 'ne' ? `${toNepaliDigits(hour.precipitationProbability)}%` : `${hour.precipitationProbability}%`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-Day Extended Forecast Section */}
      {activeWeatherData && activeWeatherData.daily.length > 0 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{lang === 'ne' ? 'आगामी ७ दिनको विस्तृत मौसम पूर्वानुमान' : '7-Day Extended Weather Forecast'}</span>
            </h3>
            <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-1 rounded-full font-bold">
              {lang === 'ne' ? `${selectedCity.nameNe} क्षेत्र` : `${selectedCity.nameEn} Region`}
            </span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {activeWeatherData.daily.map((day, idx) => {
              const cond = getWeatherCondition(day.weatherCode, true);
              return (
                <div 
                  key={idx} 
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 dark:hover:bg-stone-800/40 rounded-xl px-2 transition-colors"
                >
                  {/* Day and Date */}
                  <div className="w-36 flex items-center gap-2">
                    <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                      {formatDayName(day.date, idx)}
                    </span>
                    <span className="text-xs text-stone-400 dark:text-stone-500">
                      {day.date.slice(5)}
                    </span>
                  </div>

                  {/* Weather Icon & Condition Name */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-[180px]">
                    <div className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                      {renderWeatherIcon(cond.iconType, 'w-5 h-5')}
                    </div>
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 truncate">
                      {lang === 'ne' ? cond.labelNe : cond.labelEn}
                    </span>
                  </div>

                  {/* Rain Probability Bar */}
                  <div className="w-28 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <div className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(5, day.precipitationProbability))}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-bold min-w-[28px] text-right">
                      {lang === 'ne' ? `${toNepaliDigits(day.precipitationProbability)}%` : `${day.precipitationProbability}%`}
                    </span>
                  </div>

                  {/* Temperature Range (Min to Max) */}
                  <div className="w-36 flex items-center justify-end gap-3 text-xs font-bold">
                    <span className="text-stone-500 dark:text-stone-400">
                      {formatTemp(day.tempMin)}
                    </span>
                    {/* Visual Temp Bar */}
                    <div className="w-16 h-1.5 bg-gradient-to-r from-sky-400 to-amber-500 rounded-full"></div>
                    <span className="text-stone-900 dark:text-white">
                      {formatTemp(day.tempMax)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Major Cities of Nepal Selector Grid Section */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs transition-colors space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <CompassIcon className="w-4 h-4 text-red-600" />
              <span>{lang === 'ne' ? 'नेपालका प्रमुख शहरहरूको मौसमी स्थिति' : 'Major Cities of Nepal Weather Index'}</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'ne' ? 'कुनै पनि शहरमा क्लिक गरी त्यहाँको पूर्ण मौसम विवरण हेर्नुहोस्' : 'Click any city to view its detailed live forecast'}
            </p>
          </div>

          {/* Search bar for cities */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'ne' ? 'शहर वा प्रदेश खोज्नुहोस्...' : 'Search city or province...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-8 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', nameNe: 'सबै शहरहरू', nameEn: 'All Cities' },
            { id: 'bagmati', nameNe: 'बागमती', nameEn: 'Bagmati' },
            { id: 'gandaki', nameNe: 'गण्डकी', nameEn: 'Gandaki' },
            { id: 'koshi', nameNe: 'कोशी', nameEn: 'Koshi' },
            { id: 'madhesh', nameNe: 'मधेश', nameEn: 'Madhesh' },
            { id: 'lumbini', nameNe: 'लुम्बिनी', nameEn: 'Lumbini' },
            { id: 'karnali', nameNe: 'कर्णाली', nameEn: 'Karnali' },
            { id: 'sudurpashchim', nameNe: 'सुदूरपश्चिम', nameEn: 'Sudurpashchim' },
            { id: 'himal', nameNe: 'हिमाली क्षेत्र', nameEn: 'Himalayan' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegionFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedRegionFilter === tab.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {lang === 'ne' ? tab.nameNe : tab.nameEn}
            </button>
          ))}
        </div>

        {/* Cities Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
          {filteredCities.map((city) => {
            const isSelected = city.id === selectedCityId;
            const cityData = cityWeatherDataMap[city.id];
            const cond = cityData ? getWeatherCondition(cityData.current.weatherCode, cityData.current.isDay) : null;

            return (
              <div
                key={city.id}
                onClick={() => {
                  setSelectedCityId(city.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600 ring-2 ring-sky-400/30 shadow-sm'
                    : 'bg-stone-50/70 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 hover:bg-white dark:hover:bg-stone-800 hover:border-sky-300 dark:hover:border-stone-600 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-extrabold text-sm ${isSelected ? 'text-sky-800 dark:text-sky-300' : 'text-stone-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors'}`}>
                          {lang === 'ne' ? city.nameNe : city.nameEn}
                        </span>
                        {city.isCapital && (
                          <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded">
                            {lang === 'ne' ? 'राजधानी' : 'Capital'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                        {lang === 'ne' ? city.provinceNe : city.provinceEn}
                      </span>
                    </div>

                    {cond && (
                      <div className="p-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-700 shadow-2xs">
                        {renderWeatherIcon(cond.iconType, 'w-5 h-5')}
                      </div>
                    )}
                  </div>

                  {/* Temperature & Condition */}
                  <div className="my-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                        {cityData ? formatTemp(cityData.current.temperature) : (
                          <span className="text-xs text-stone-400 animate-pulse">{lang === 'ne' ? 'लोड हुँदै...' : 'Loading...'}</span>
                        )}
                      </span>
                      {cityData && (
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold truncate">
                          {lang === 'ne' ? cond?.labelNe : cond?.labelEn}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card bottom details: High/Low & Humidity */}
                <div className="pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  {cityData && cityData.daily?.[0] ? (
                    <>
                      <span>
                        H: {formatTemp(cityData.daily[0].tempMax)} • L: {formatTemp(cityData.daily[0].tempMin)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Droplets className="w-3 h-3 text-cyan-500" />
                        {cityData.current.humidity}%
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-stone-400">
                      {lang === 'ne' ? 'क्लिक गरी हेर्नुहोस्' : 'Click to inspect'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nepal Climate & Travel Weather Advisory */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 rounded-3xl p-5 sm:p-6 border border-amber-200/80 dark:border-amber-900/60">
        <div className="flex items-center gap-2 mb-2 font-bold text-amber-900 dark:text-amber-300 text-sm">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{lang === 'ne' ? 'नेपालको मौसमी जानकारी तथा यात्रा सुझाव' : 'Nepal Climate Advisory & Travel Tips'}</span>
        </div>
        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          {lang === 'ne'
            ? 'नेपालमा भौगोलिकता अनुसार तराईमा उष्ण, पहाडी क्षेत्रमा समशीतोष्ण र हिमाली क्षेत्रमा अल्पाइन मौसम पाइन्छ। हिमाली पदयात्रा वा लामा यात्रा गर्नुअघि स्थानीय मौसम पूर्वानुमान, वर्षा तथा हिमपातको अवस्था अनिवार्य हेर्नुहोला।'
            : 'Nepal features diverse climates ranging from subtropical in the southern Terai plains to temperate in the central hills and alpine in the northern Himalayas. Always review localized precipitation and elevation-adjusted forecasts before trekking or highway travel.'}
        </p>
      </div>

    </div>
  );
};
