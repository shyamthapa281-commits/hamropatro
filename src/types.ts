/**
 * Nepali Calendar Types & Interfaces
 */

export type Language = 'ne' | 'en';

export interface NepaliDate {
  year: number;       // e.g. 2081
  month: number;      // 1 to 12 (Baishakh = 1, Chaitra = 12)
  day: number;        // 1 to 32
  monthNameNe: string;// e.g. "वैशाख"
  monthNameEn: string;// e.g. "Baishakh"
  dayNameNe: string;  // e.g. "आइतवार"
  dayNameEn: string;  // e.g. "Sunday"
  dayOfWeek: number;  // 0 = Sunday, 6 = Saturday
  formattedNe: string;// e.g. "२०८१ वैशाख १५"
  formattedEn: string;// e.g. "15 Baishakh 2081"
  adDate: string;     // ISO format YYYY-MM-DD
  adFormatted: string;// e.g. "Apr 28, 2024"
}

export interface Panchanga {
  tithi: string;          // e.g. "शुक्ल पक्ष पञ्चमी"
  tithiEn: string;
  nakshatra: string;      // e.g. "रोहिणी"
  nakshatraEn: string;
  yoga: string;           // e.g. "सिद्ध"
  karana: string;         // e.g. "बव"
  chandraRashi: string;   // e.g. "वृष (Taurus)"
  suryaRashi: string;     // e.g. "मेष (Aries)"
  sunrise: string;        // e.g. "05:28 AM"
  sunset: string;         // e.g. "06:45 PM"
  rahuKaal: string;       // e.g. "04:30 PM - 06:00 PM"
  yamaganda: string;      // e.g. "12:00 PM - 01:30 PM"
  abhijitMuhurat: string; // e.g. "11:45 AM - 12:35 PM"
  ritu: string;           // e.g. "ग्रीष्म (Summer)"
  ayan: string;           // e.g. "उत्तरायण (Uttarayan)"
  disaSool: string;       // e.g. "पश्चिम (West)"
}

export interface CalendarEvent {
  id: string;
  titleNe: string;
  titleEn: string;
  isHoliday: boolean;
  descriptionNe?: string;
  descriptionEn?: string;
  category: 'festival' | 'national' | 'religious' | 'international' | 'personal';
  color?: string;
}

export interface CalendarDay {
  bsYear: number;
  bsMonth: number;
  bsDay: number;
  bsDayNe: string;      // "१५"
  dayOfWeek: number;    // 0 = Sun, 6 = Sat
  adDate: Date;
  adDay: number;        // English day of month e.g. 28
  adMonthName: string;  // "Apr"
  isToday: boolean;
  isCurrentMonth: boolean;
  isSaturday: boolean;
  isHoliday: boolean;
  tithiNe: string;
  tithiEn: string;
  events: CalendarEvent[];
  panchanga?: Panchanga;
}

export type RashiId = 
  | 'mesh' 
  | 'vrishabha' 
  | 'mithun' 
  | 'karkat' 
  | 'simha' 
  | 'kanya' 
  | 'tula' 
  | 'vrischika' 
  | 'dhanu' 
  | 'makar' 
  | 'kumbha' 
  | 'meen';

export interface RashiInfo {
  id: RashiId;
  nameNe: string;       // मेष
  nameEn: string;       // Aries
  symbol: string;       // ♈
  iconName: string;
  element: string;      // Fire / अग्नि
  rulingPlanet: string; // Mars / मंगल
  lettersNe: string;    // अ, ल, च, चु, चे, चो
  englishDateRange: string; // Mar 21 - Apr 19
  color: string;
  bgColor: string;
}

export interface DailyHoroscope {
  rashiId: RashiId;
  date: string;
  rating: number; // 1 to 5 stars
  scores: {
    love: number;     // 0-100
    career: number;   // 0-100
    finance: number;  // 0-100
    health: number;   // 0-100
    travel: number;   // 0-100
  };
  predictionNe: string;
  predictionEn: string;
  luckyColorNe: string;
  luckyColorEn: string;
  luckyNumber: number;
  luckyDirectionNe: string;
  luckyDirectionEn: string;
  favorableTime: string;
  unfavorableTime: string;
  remedyNe: string;     // ज्योतिषीय उपाय
  remedyEn: string;
  gemstoneNe: string;   // रत्न
  gemstoneEn: string;
  mantraNe: string;     // मन्त्र
}

export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface NewsArticle {
  id: string;
  titleNe: string;
  titleEn: string;
  summaryNe: string;
  summaryEn: string;
  contentNe: string;
  contentEn: string;
  category: 'trending' | 'national' | 'politics' | 'economy' | 'sports' | 'technology' | 'entertainment' | 'opinion' | 'world' | string;
  source: string;       // Kantipur, OnlineKhabar, Setopati, Ratopati, The Himalayan Times, etc.
  sourceUrl?: string;
  publishedAt: string;  // e.g. "२० मिनेट अगाडि" or ISO date
  author?: string;
  imageUrl?: string;
  readTimeMin: number;
  tags: string[];
  isBreaking?: boolean;
  isLive?: boolean;
  rawPubDate?: string;
}

export interface ForexRate {
  currencyCode: string; // USD, EUR, GBP, AUD, JPY, QAR, AED, INR, CAD, etc.
  currencyNameNe: string;
  currencyNameEn: string;
  unit: number;
  buyRate: number;
  sellRate: number;
  change: number; // +0.15, -0.08
  flag: string;
}

export interface GoldSilverRate {
  itemNe: string;
  itemEn: string;
  unitNe: string;
  unitEn: string;
  rateNpr: number;
  changeNpr: number;
  isUp: boolean;
  date: string;
}

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  location: string;
  streamUrl: string;
  backupStreamUrl?: string;
  genre: string;
  genreNe?: string;
  logo: string;
  bitrate: string;
  isInstrumental?: boolean;
}

export interface FestivalInfo {
  id: string;
  nameNe: string;
  nameEn: string;
  bsDate: string;
  adDate: string;
  daysRemaining: number;
  importance: 'major' | 'medium' | 'minor';
  taglineNe: string;
  taglineEn: string;
  descriptionNe: string;
  descriptionEn: string;
  ritualsNe: string[];
  ritualsEn: string[];
  recipeOrHighlightNe?: string;
  recipeOrHighlightEn?: string;
  imageTheme: string;
}

export interface KundaliQuestionRequest {
  rashiId?: RashiId;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  question: string;
  category?: 'career' | 'marriage' | 'health' | 'finance' | 'general';
  language?: Language;
}

export interface KundaliQuestionResponse {
  answer: string;
  astrologicalBasis: string;
  remedies: string[];
  auspiciousPlanets: string[];
  suggestedGemstone: string;
  dailyChant: string;
}

export interface NepalCity {
  id: string;
  nameNe: string;
  nameEn: string;
  provinceNe: string;
  provinceEn: string;
  latitude: number;
  longitude: number;
  elevation: number;
  isCapital?: boolean;
  isPopular?: boolean;
  region: 'himal' | 'pahad' | 'terai';
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  isDay: boolean;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface CityWeatherData {
  city: NepalCity;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  lastUpdated: string;
}

export interface MotivationQuote {
  id: string;
  quoteNe: string;
  quoteEn: string;
  authorNe: string;
  authorEn: string;
  category: 'proverb' | 'literary' | 'buddha' | 'wisdom' | 'perseverance';
  categoryNe: string;
  categoryEn: string;
  contextNe?: string;
  contextEn?: string;
}
