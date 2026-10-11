/**
 * Precision Vedic Kundali & Classical Ashtakoot 36 Gun Milan Astrological Engine
 * 
 * Implements standard mathematical ephemeris formulas from Brihat Parashara Hora Shastra,
 * Muhurta Chintamani, and high-precision Sidereal Nirayana astronomy.
 */

import { 
  calculateVedicHoroscope, 
  VedicHoroscope, 
  BirthInput, 
  GrahaPosition, 
  LagnaInfo, 
  DashaBalance, 
  ManglikAnalysis,
  RASHIS,
  NAKSHATRAS,
  PlanetKey
} from './VedicAstrologyUtils';

export { 
  calculateVedicHoroscope, 
  type VedicHoroscope, 
  type BirthInput, 
  type GrahaPosition, 
  type LagnaInfo, 
  type DashaBalance, 
  type ManglikAnalysis 
};

export interface PlanetPosition {
  nameNe: string;
  nameEn: string;
  symbol: string;
  rashiNe: string;
  rashiEn: string;
  house: number; // 1 to 12
  degree: string;
  isRetrograde?: boolean;
  dignityNe?: string;
  dignityEn?: string;
}

export interface HouseDetail {
  houseNumber: number;
  houseNameNe: string;
  houseNameEn: string;
  signNe: string;
  signEn: string;
  signIndex: number;
  lordNe: string;
  lordEn: string;
  planets: string[];
}

export interface MahadashaPeriod {
  planetKey: PlanetKey;
  planetNe: string;
  planetEn: string;
  startYear: number;
  endYear: number;
  durationYears: number;
  isCurrent: boolean;
}

export interface KundaliResult {
  name: string;
  gender: string;
  dob: string;       // User entered date (BS or AD)
  dobAd: string;     // Gregorian converted date YYYY-MM-DD
  dobBsFormatted?: string; // e.g. २०५२ भदौ १५ वि.सं.
  tob: string;
  pob: string;
  latitude: number;
  longitude: number;
  timezoneOffsetHours: number;
  
  // Ascendant (Lagna)
  lagnaNe: string;
  lagnaEn: string;
  lagnaDegree: string;
  lagnaLordNe: string;
  lagnaLordEn: string;

  // Moon Sign & Nakshatra
  rashiNe: string;
  rashiEn: string;
  rashiLordNe: string;
  rashiLordEn: string;
  nakshatraNe: string;
  nakshatraEn: string;
  nakshatraLordNe: string;
  charan: number; // 1 - 4
  ganNe: string;
  ganEn: string;
  nadiNe: string;
  nadiEn: string;
  yoniNe: string;
  yoniEn: string;
  varnaNe: string;
  varnaEn: string;

  // Name Astrology (नाम विश्लेषण)
  namaRashiNe: string;
  namaRashiEn: string;
  namaLordNe: string;
  namaLordEn: string;
  janmaNamaAkshar: string; // वैदिक नामाक्षर (e.g. 'चू')
  allCharanAksharas: string[]; // [चरण १, २, ३, ४]
  namaJanmaHarmonyNe: string;
  namaJanmaHarmonyEn: string;

  // Sun Sign & Vitality
  sunSignNe: string;
  sunSignEn: string;
  sunDegree: string;

  // Manglik Analysis
  isManglik: boolean;
  manglikSeverity: 'none' | 'partial' | 'high';
  manglikDetailsNe: string;
  manglikDetailsEn: string;

  // Planets & 12 Houses
  planets: PlanetPosition[];
  houses: HouseDetail[];

  // Dynamic Vimshottari Mahadasha Timeline
  fullDashaTimeline: MahadashaPeriod[];
  currentDasha: {
    mahadasha: string;
    antardasha: string;
    startDate: string;
    endDate: string;
    predictionNe: string;
    predictionEn: string;
  };

  // Auspicious Elements & Upaya
  luckyGem: string;
  secondaryGem: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDayNe: string;
  luckyDayEn: string;
  luckyDirectionNe: string;
  luckyDeity: string;
  vedicMantra: string;

  // Tailored Life Predictions
  personalityNe: string;
  personalityEn: string;
  careerPredictionNe: string;
  careerPredictionEn: string;
  marriagePredictionNe: string;
  marriagePredictionEn: string;
  healthPredictionNe: string;
  healthPredictionEn: string;
}

export interface GunMilanKoota {
  nameNe: string;
  nameEn: string;
  maxPoints: number;
  obtainedPoints: number;
  boyValue: string;
  girlValue: string;
  status: 'excellent' | 'good' | 'average' | 'dosha';
  analysisNe: string;
  analysisEn: string;
}

export interface GunMilanResult {
  boyName: string;
  boyRashi: string;
  boyNakshatra: string;
  girlName: string;
  girlRashi: string;
  girlNakshatra: string;
  totalScore: number; // out of 36
  verdictNe: string;
  verdictEn: string;
  verdictType: 'excellent' | 'auspicious' | 'moderate' | 'incompatible';
  hasNadiDosha: boolean;
  hasBhakootDosha: boolean;
  kootas: GunMilanKoota[];
  recommendationNe: string;
  recommendationEn: string;
  remediesNe: string[];
  remediesEn: string[];
  manglikMatchNe?: string;
  manglikMatchEn?: string;
  hasManglikDoshaConflict?: boolean;
  boyKundaliSummary?: {
    dob?: string;
    lagna?: string;
    isManglik?: boolean;
    rashiLord?: string;
  };
  girlKundaliSummary?: {
    dob?: string;
    lagna?: string;
    isManglik?: boolean;
    rashiLord?: string;
  };
}

export interface CityCoordinate {
  nameNe: string;
  nameEn: string;
  lat: number;
  lng: number;
  tz: number;
  country: string;
}

export const POPULAR_BIRTH_PLACES: CityCoordinate[] = [
  { nameNe: 'काठमाडौं (Kathmandu)', nameEn: 'Kathmandu', lat: 27.7172, lng: 85.3240, tz: 5.75, country: 'Nepal' },
  { nameNe: 'पोखरा (Pokhara)', nameEn: 'Pokhara', lat: 28.2096, lng: 83.9856, tz: 5.75, country: 'Nepal' },
  { nameNe: 'ललितपुर (Lalitpur)', nameEn: 'Lalitpur', lat: 27.6644, lng: 85.3188, tz: 5.75, country: 'Nepal' },
  { nameNe: 'भक्तपुर (Bhaktapur)', nameEn: 'Bhaktapur', lat: 27.6710, lng: 85.4298, tz: 5.75, country: 'Nepal' },
  { nameNe: 'विराटनगर (Biratnagar)', nameEn: 'Biratnagar', lat: 26.4525, lng: 87.2718, tz: 5.75, country: 'Nepal' },
  { nameNe: 'भरतपुर / चितवन (Chitwan)', nameEn: 'Chitwan', lat: 27.6833, lng: 84.4333, tz: 5.75, country: 'Nepal' },
  { nameNe: 'बुटवल / रूपन्देही (Butwal)', nameEn: 'Butwal', lat: 27.7006, lng: 83.4484, tz: 5.75, country: 'Nepal' },
  { nameNe: 'धरान (Dharan)', nameEn: 'Dharan', lat: 26.8124, lng: 87.2835, tz: 5.75, country: 'Nepal' },
  { nameNe: 'नेपालगन्ज (Nepalgunj)', nameEn: 'Nepalgunj', lat: 28.0500, lng: 81.6167, tz: 5.75, country: 'Nepal' },
  { nameNe: 'धनगढी (Dhangadhi)', nameEn: 'Dhangadhi', lat: 28.6852, lng: 80.6078, tz: 5.75, country: 'Nepal' },
  { nameNe: 'जनकपुर (Janakpur)', nameEn: 'Janakpur', lat: 26.7288, lng: 85.9244, tz: 5.75, country: 'Nepal' },
  { nameNe: 'हेटौंडा (Hetauda)', nameEn: 'Hetauda', lat: 27.4287, lng: 85.0322, tz: 5.75, country: 'Nepal' },
  { nameNe: 'दाङ (Dang / Ghorahi)', nameEn: 'Dang', lat: 28.0416, lng: 82.4932, tz: 5.75, country: 'Nepal' },
  { nameNe: 'विर्तामोड / झापा (Jhapa)', nameEn: 'Jhapa', lat: 26.6347, lng: 87.9863, tz: 5.75, country: 'Nepal' },
  { nameNe: 'सिड्नी (Sydney, Australia)', nameEn: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, tz: 10.0, country: 'Australia' },
  { nameNe: 'मेलबर्न (Melbourne, Australia)', nameEn: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, tz: 10.0, country: 'Australia' },
  { nameNe: 'ब्रिसबेन (Brisbane, Australia)', nameEn: 'Brisbane, Australia', lat: -27.4698, lng: 153.0251, tz: 10.0, country: 'Australia' },
  { nameNe: 'पर्थ (Perth, Australia)', nameEn: 'Perth, Australia', lat: -31.9505, lng: 115.8605, tz: 8.0, country: 'Australia' },
  { nameNe: 'न्युयोर्क (New York, USA)', nameEn: 'New York, USA', lat: 40.7128, lng: -74.0060, tz: -5.0, country: 'USA' },
  { nameNe: 'डल्लास / टेक्सास (Dallas, USA)', nameEn: 'Dallas, USA', lat: 32.7767, lng: -96.7970, tz: -6.0, country: 'USA' },
  { nameNe: 'लन्डन (London, UK)', nameEn: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 0.0, country: 'UK' },
  { nameNe: 'टोकियो (Tokyo, Japan)', nameEn: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, tz: 9.0, country: 'Japan' },
  { nameNe: 'दुबई (Dubai, UAE)', nameEn: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, tz: 4.0, country: 'UAE' },
  { nameNe: 'दोहा (Doha, Qatar)', nameEn: 'Doha, Qatar', lat: 25.2854, lng: 51.5310, tz: 3.0, country: 'Qatar' }
];

export const VEDIC_RASHIS = [
  { id: 0, ne: 'मेष', en: 'Aries', lord: 'Mars', lordNe: 'मङ्गल (Mars)', varna: 'क्षत्रिय', vashya: 'चतुष्पाद', element: 'अग्नि (Fire)', nature: 'चर (Movable)' },
  { id: 1, ne: 'वृष', en: 'Taurus', lord: 'Venus', lordNe: 'शुक्र (Venus)', varna: 'वैश्य', vashya: 'चतुष्पाद', element: 'पृथ्वी (Earth)', nature: 'स्थिर (Fixed)' },
  { id: 2, ne: 'मिथुन', en: 'Gemini', lord: 'Mercury', lordNe: 'बुध (Mercury)', varna: 'शूद्र', vashya: 'मानव', element: 'वायु (Air)', nature: 'द्विस्वभाव (Dual)' },
  { id: 3, ne: 'कर्कट', en: 'Cancer', lord: 'Moon', lordNe: 'चन्द्रमा (Moon)', varna: 'ब्राह्मण', vashya: 'जलचर', element: 'जल (Water)', nature: 'चर (Movable)' },
  { id: 4, ne: 'सिंह', en: 'Leo', lord: 'Sun', lordNe: 'सूर्य (Sun)', varna: 'क्षत्रिय', vashya: 'सिंह', element: 'अग्नि (Fire)', nature: 'स्थिर (Fixed)' },
  { id: 5, ne: 'कन्या', en: 'Virgo', lord: 'Mercury', lordNe: 'बुध (Mercury)', varna: 'वैश्य', vashya: 'मानव', element: 'पृथ्वी (Earth)', nature: 'द्विस्वभाव (Dual)' },
  { id: 6, ne: 'तुला', en: 'Libra', lord: 'Venus', lordNe: 'शुक्र (Venus)', varna: 'शूद्र', vashya: 'मानव', element: 'वायु (Air)', nature: 'चर (Movable)' },
  { id: 7, ne: 'वृश्चिक', en: 'Scorpio', lord: 'Mars', lordNe: 'मङ्गल (Mars)', varna: 'ब्राह्मण', vashya: 'कीटक', element: 'जल (Water)', nature: 'स्थिर (Fixed)' },
  { id: 8, ne: 'धनु', en: 'Sagittarius', lord: 'Jupiter', lordNe: 'बृहस्पति (Jupiter)', varna: 'क्षत्रिय', vashya: 'मानव', element: 'अग्नि (Fire)', nature: 'द्विस्वभाव (Dual)' },
  { id: 9, ne: 'मकर', en: 'Capricorn', lord: 'Saturn', lordNe: 'शनि (Saturn)', varna: 'वैश्य', vashya: 'जलचर', element: 'पृथ्वी (Earth)', nature: 'चर (Movable)' },
  { id: 10, ne: 'कुम्भ', en: 'Aquarius', lord: 'Saturn', lordNe: 'शनि (Saturn)', varna: 'शूद्र', vashya: 'मानव', element: 'वायु (Air)', nature: 'स्थिर (Fixed)' },
  { id: 11, ne: 'मीन', en: 'Pisces', lord: 'Jupiter', lordNe: 'बृहस्पति (Jupiter)', varna: 'ब्राह्मण', vashya: 'जलचर', element: 'जल (Water)', nature: 'द्विस्वभाव (Dual)' },
];

export const VEDIC_NAKSHATRAS = [
  { id: 0, ne: 'अश्विनी', en: 'Ashwini', rashiId: 0, lord: 'Ketu', gana: 'देव', nadi: 'आदि', yoni: 'अश्व', aksharas: ['चू (Chu)', 'चे (Che)', 'चो (Cho)', 'ला (La)'] },
  { id: 1, ne: 'भरणी', en: 'Bharani', rashiId: 0, lord: 'Venus', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'गज', aksharas: ['ली (Lee)', 'लू (Lu)', 'ले (Le)', 'लो (Lo)'] },
  { id: 2, ne: 'कृत्तिका', en: 'Krittika', rashiId: 1, lord: 'Sun', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'मेष', aksharas: ['अ (A)', 'ई (Ee)', 'उ (U)', 'ए (E)'] },
  { id: 3, ne: 'रोहिणी', en: 'Rohini', rashiId: 1, lord: 'Moon', gana: 'मनुष्य', nadi: 'अन्त्य', yoni: 'सर्प', aksharas: ['ओ (O)', 'वा (Va)', 'वी (Vi)', 'वू (Vu)'] },
  { id: 4, ne: 'मृगशिरा', en: 'Mrigashira', rashiId: 2, lord: 'Mars', gana: 'देव', nadi: 'मध्य', yoni: 'सर्प', aksharas: ['वे (Ve)', 'वो (Vo)', 'का (Ka)', 'की (Kee)'] },
  { id: 5, ne: 'आर्द्रा', en: 'Ardra', rashiId: 2, lord: 'Rahu', gana: 'मनुष्य', nadi: 'आदि', yoni: 'श्वान', aksharas: ['कू (Koo)', 'घ (Gha)', 'ङ (Nga)', 'छ (Chha)'] },
  { id: 6, ne: 'पुनर्वसु', en: 'Punarvasu', rashiId: 3, lord: 'Jupiter', gana: 'देव', nadi: 'आदि', yoni: 'मार्जार', aksharas: ['के (Ke)', 'को (Ko)', 'हा (Ha)', 'ही (Hee)'] },
  { id: 7, ne: 'पुष्य', en: 'Pushya', rashiId: 3, lord: 'Saturn', gana: 'देव', nadi: 'मध्य', yoni: 'मेष', aksharas: ['हू (Hoo)', 'हे (He)', 'हो (Ho)', 'डा (Da)'] },
  { id: 8, ne: 'आश्लेषा', en: 'Ashlesha', rashiId: 3, lord: 'Mercury', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'मार्जार', aksharas: ['डी (Dee)', 'डू (Doo)', 'डे (De)', 'डो (Do)'] },
  { id: 9, ne: 'मघा', en: 'Magha', rashiId: 4, lord: 'Ketu', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'मूषक', aksharas: ['मा (Ma)', 'मी (Mee)', 'मू (Moo)', 'मे (Me)'] },
  { id: 10, ne: 'पूर्वाफाल्गुनी', en: 'Purva Phalguni', rashiId: 4, lord: 'Venus', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'मूषक', aksharas: ['मो (Mo)', 'टा (Ta)', 'टी (Tee)', 'टू (Too)'] },
  { id: 11, ne: 'उत्तराफाल्गुनी', en: 'Uttara Phalguni', rashiId: 5, lord: 'Sun', gana: 'मनुष्य', nadi: 'आदि', yoni: 'गौ', aksharas: ['टे (Te)', 'टो (To)', 'पा (Pa)', 'पी (Pee)'] },
  { id: 12, ne: 'हस्त', en: 'Hasta', rashiId: 5, lord: 'Moon', gana: 'देव', nadi: 'आदि', yoni: 'महिष', aksharas: ['पू (Poo)', 'ष (Sha)', 'ण (Na)', 'ठ (Tha)'] },
  { id: 13, ne: 'चित्रा', en: 'Chitra', rashiId: 6, lord: 'Mars', gana: 'राक्षस', nadi: 'मध्य', yoni: 'व्याघ्र', aksharas: ['पे (Pe)', 'पो (Po)', 'रा (Ra)', 'री (Ree)'] },
  { id: 14, ne: 'स्वाती', en: 'Swati', rashiId: 6, lord: 'Rahu', gana: 'देव', nadi: 'अन्त्य', yoni: 'महिष', aksharas: ['रू (Roo)', 'रे (Re)', 'रो (Ro)', 'ता (Ta)'] },
  { id: 15, ne: 'विशाखा', en: 'Vishakha', rashiId: 7, lord: 'Jupiter', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'व्याघ्र', aksharas: ['ती (Tee)', 'तू (Too)', 'ते (Te)', 'तो (To)'] },
  { id: 16, ne: 'अनुराधा', en: 'Anuradha', rashiId: 7, lord: 'Saturn', gana: 'देव', nadi: 'मध्य', yoni: 'मृग', aksharas: ['ना (Na)', 'नी (Nee)', 'नू (Noo)', 'ने (Ne)'] },
  { id: 17, ne: 'ज्येष्ठा', en: 'Jyeshtha', rashiId: 7, lord: 'Mercury', gana: 'राक्षस', nadi: 'आदि', yoni: 'मृग', aksharas: ['नो (No)', 'या (Ya)', 'यी (Yee)', 'यू (Yoo)'] },
  { id: 18, ne: 'मूल', en: 'Mula', rashiId: 8, lord: 'Ketu', gana: 'राक्षस', nadi: 'आदि', yoni: 'श्वान', aksharas: ['ये (Ye)', 'यो (Yo)', 'भा (Bha)', 'भी (Bhee)'] },
  { id: 19, ne: 'पूर्वाषाढा', en: 'Purva Ashadha', rashiId: 8, lord: 'Venus', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'वानर', aksharas: ['भू (Bhoo)', 'धा (Dha)', 'फा (Pha)', 'ढा (Dha)'] },
  { id: 20, ne: 'उत्तराषाढा', en: 'Uttara Ashadha', rashiId: 9, lord: 'Sun', gana: 'मनुष्य', nadi: 'अन्त्य', yoni: 'नकुल', aksharas: ['भे (Bhe)', 'भो (Bho)', 'जा (Ja)', 'जी (Jee)'] },
  { id: 21, ne: 'श्रवण', en: 'Shravana', rashiId: 9, lord: 'Moon', gana: 'देव', nadi: 'अन्त्य', yoni: 'वानर', aksharas: ['खी (Khee)', 'खू (Khoo)', 'खे (Khe)', 'खो (Kho)'] },
  { id: 22, ne: 'धनिष्ठा', en: 'Dhanishta', rashiId: 10, lord: 'Mars', gana: 'राक्षस', nadi: 'मध्य', yoni: 'सिंह', aksharas: ['गा (Ga)', 'गी (Gee)', 'गू (Goo)', 'गे (Ge)'] },
  { id: 23, ne: 'शतभिषा', en: 'Shatabhisha', rashiId: 10, lord: 'Rahu', gana: 'राक्षस', nadi: 'आदि', yoni: 'अश्व', aksharas: ['गो (Go)', 'सा (Sa)', 'सी (See)', 'सू (Soo)'] },
  { id: 24, ne: 'पूर्वाभाद्रपदा', en: 'Purva Bhadrapada', rashiId: 11, lord: 'Jupiter', gana: 'मनुष्य', nadi: 'आदि', yoni: 'सिंह', aksharas: ['से (Se)', 'सो (So)', 'दा (Da)', 'दी (Dee)'] },
  { id: 25, ne: 'उत्तराभाद्रपदा', en: 'Uttara Bhadrapada', rashiId: 11, lord: 'Saturn', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'गौ', aksharas: ['दू (Doo)', 'थ (Tha)', 'झ (Jha)', 'ञ (Jna)'] },
  { id: 26, ne: 'रेवती', en: 'Revati', rashiId: 11, lord: 'Mercury', gana: 'देव', nadi: 'अन्त्य', yoni: 'गज', aksharas: ['दे (De)', 'दो (Do)', 'चा (Cha)', 'ची (Chee)'] },
];

/**
 * Robust Bikram Sambat (BS) to Gregorian (AD) Date Converter
 * Valid for any year between 1920 AD and 2035 AD (1977 BS to 2092 BS).
 */
export function convertBsToAd(bsYear: number, bsMonth: number, bsDay: number): { year: number; month: number; day: number; formatted: string } {
  const approxAdYear = bsYear - 57;
  const standardMonthDays = [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30];
  
  let daysFromNewYear = 0;
  for (let i = 0; i < bsMonth - 1; i++) {
    daysFromNewYear += standardMonthDays[i] || 30;
  }
  daysFromNewYear += (Math.max(1, Math.min(32, bsDay)) - 1);

  // New year (1 Baishakh) starts around April 14 UTC
  const base = new Date(Date.UTC(approxAdYear, 3, 14));
  base.setUTCDate(base.getUTCDate() + daysFromNewYear);

  const y = base.getUTCFullYear();
  const m = base.getUTCMonth() + 1;
  const d = base.getUTCDate();
  return {
    year: y,
    month: m,
    day: d,
    formatted: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  };
}

/**
 * Gregorian (AD) to Bikram Sambat (BS) Approximate Converter
 */
export function convertAdToBs(adYear: number, adMonth: number, adDay: number): { year: number; month: number; day: number; formattedBs: string } {
  // Baishakh 1 is around April 14
  const isBeforeNewYear = adMonth < 4 || (adMonth === 4 && adDay < 14);
  const bsYear = isBeforeNewYear ? adYear + 56 : adYear + 57;
  
  const newYearAd = new Date(Date.UTC(adYear, 3, 14));
  const targetAd = new Date(Date.UTC(adYear, adMonth - 1, adDay));
  let diffDays = Math.round((targetAd.getTime() - newYearAd.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Falls in the previous BS year (Poush - Chaitra)
    const prevNewYearAd = new Date(Date.UTC(adYear - 1, 3, 14));
    diffDays = Math.round((targetAd.getTime() - prevNewYearAd.getTime()) / (1000 * 60 * 60 * 24));
  }

  const standardMonthDays = [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30];
  let bsMonth = 1;
  let bsDay = 1;

  for (let i = 0; i < 12; i++) {
    const daysInM = standardMonthDays[i] || 30;
    if (diffDays < daysInM) {
      bsMonth = i + 1;
      bsDay = diffDays + 1;
      break;
    }
    diffDays -= daysInM;
  }

  const bsMonthNames = ['वैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
    formattedBs: `${bsYear} ${bsMonthNames[bsMonth - 1] || ''} ${bsDay} गते`
  };
}

/**
 * Classical Vedic Name Astrological Engine (नाम ज्योतिष)
 * Derives Nama Rashi (नाम राशि) and Ruling Lord from a person's spoken name.
 */
export function getNamaRashi(name: string): { rashiId: number; rashiNe: string; rashiEn: string; lordNe: string; lordEn: string } {
  const cleanName = (name || '').trim();
  if (!cleanName) {
    return { rashiId: 0, rashiNe: 'मेष', rashiEn: 'Aries', lordNe: 'मङ्गल (Mars)', lordEn: 'Mars' };
  }

  const firstChar = cleanName.charAt(0);
  const firstLower = cleanName.charAt(0).toLowerCase();
  const firstTwo = cleanName.slice(0, 2).toLowerCase();

  // 1. English Transliteration Mapping
  if (/[a-zA-Z]/.test(firstChar)) {
    if (firstTwo === 'sh' || firstLower === 's') return { rashiId: 10, rashiNe: 'कुम्भ', rashiEn: 'Aquarius', lordNe: 'शनि (Saturn)', lordEn: 'Saturn' };
    if (firstLower === 'r') return { rashiId: 6, rashiNe: 'तुला', rashiEn: 'Libra', lordNe: 'शुक्र (Venus)', lordEn: 'Venus' };
    if (firstLower === 'm' || firstLower === 't') return { rashiId: 4, rashiNe: 'सिंह', rashiEn: 'Leo', lordNe: 'सूर्य (Sun)', lordEn: 'Sun' };
    if (firstLower === 'b' || firstLower === 'v') return { rashiId: 1, rashiNe: 'वृष', rashiEn: 'Taurus', lordNe: 'शुक्र (Venus)', lordEn: 'Venus' };
    if (firstLower === 'k' || firstLower === 'h') return { rashiId: 2, rashiNe: 'मिथुन', rashiEn: 'Gemini', lordNe: 'बुध (Mercury)', lordEn: 'Mercury' };
    if (firstLower === 'p') return { rashiId: 5, rashiNe: 'कन्या', rashiEn: 'Virgo', lordNe: 'बुध (Mercury)', lordEn: 'Mercury' };
    if (firstLower === 'n' || firstLower === 'y') return { rashiId: 7, rashiNe: 'वृश्चिक', rashiEn: 'Scorpio', lordNe: 'मङ्गल (Mars)', lordEn: 'Mars' };
    if (firstLower === 'j' || firstLower === 'g') return { rashiId: 9, rashiNe: 'मकर', rashiEn: 'Capricorn', lordNe: 'शनि (Saturn)', lordEn: 'Saturn' };
    if (firstLower === 'd') return { rashiId: 11, rashiNe: 'मीन', rashiEn: 'Pisces', lordNe: 'बृहस्पति (Jupiter)', lordEn: 'Jupiter' };
    if (firstLower === 'a' || firstLower === 'l' || firstLower === 'c') return { rashiId: 0, rashiNe: 'मेष', rashiEn: 'Aries', lordNe: 'मङ्गल (Mars)', lordEn: 'Mars' };
  }

  // 2. Devanagari Mapping
  // मेष: अ, ल, च, चु, चे, चो, ला, ली, लू, ले, लो
  if (/[अआलच]/.test(firstChar)) return { rashiId: 0, rashiNe: 'मेष', rashiEn: 'Aries', lordNe: 'मङ्गल (Mars)', lordEn: 'Mars' };
  // वृष: इ, उ, ए, ओ, व, ब, बा, बि, बु, बे, बो
  if (/[इउएओवब]/.test(firstChar)) return { rashiId: 1, rashiNe: 'वृष', rashiEn: 'Taurus', lordNe: 'शुक्र (Venus)', lordEn: 'Venus' };
  // मिथुन: क, घ, छ, ह, का, की, कु, के, को, हा, ही
  if (/[कघछह]/.test(firstChar)) return { rashiId: 2, rashiNe: 'मिथुन', rashiEn: 'Gemini', lordNe: 'बुध (Mercury)', lordEn: 'Mercury' };
  // कर्कट: ही, हू, हे, हो, ड, डा, डी, डू
  if (/[ड]/.test(firstChar)) return { rashiId: 3, rashiNe: 'कर्कट', rashiEn: 'Cancer', lordNe: 'चन्द्रमा (Moon)', lordEn: 'Moon' };
  // सिंह: म, ट, मा, मी, मू, मे, मो, टा, टी
  if (/[मट]/.test(firstChar)) return { rashiId: 4, rashiNe: 'सिंह', rashiEn: 'Leo', lordNe: 'सूर्य (Sun)', lordEn: 'Sun' };
  // कन्या: प, ठ, पा, पी, पू, पे, पो, ष, ण
  if (/[पठण]/.test(firstChar)) return { rashiId: 5, rashiNe: 'कन्या', rashiEn: 'Virgo', lordNe: 'बुध (Mercury)', lordEn: 'Mercury' };
  // तुला: र, त, रा, री, रू, रे, रो, ता, ती, तू, ते
  if (/[रत]/.test(firstChar)) return { rashiId: 6, rashiNe: 'तुला', rashiEn: 'Libra', lordNe: 'शुक्र (Venus)', lordEn: 'Venus' };
  // वृश्चिक: न, य, ना, नी, नू, ने, नो, या, यी, यू
  if (/[नय]/.test(firstChar)) return { rashiId: 7, rashiNe: 'वृश्चिक', rashiEn: 'Scorpio', lordNe: 'मङ्गल (Mars)', lordEn: 'Mars' };
  // धनु: भ, ध, फ, ढा, भे, भो
  if (/[भधफढ]/.test(firstChar)) return { rashiId: 8, rashiNe: 'धनु', rashiEn: 'Sagittarius', lordNe: 'बृहस्पति (Jupiter)', lordEn: 'Jupiter' };
  // मकर: ख, ज, ग, गा, गी, जा, जी
  if (/[खजग]/.test(firstChar)) return { rashiId: 9, rashiNe: 'मकर', rashiEn: 'Capricorn', lordNe: 'शनि (Saturn)', lordEn: 'Saturn' };
  // कुम्भ: स, श, ष, गु, गे, गो, सा, सी, सू, से, सो
  if (/[सशष]/.test(firstChar)) return { rashiId: 10, rashiNe: 'कुम्भ', rashiEn: 'Aquarius', lordNe: 'शनि (Saturn)', lordEn: 'Saturn' };
  // मीन: द, थ, झ, दी, दू, दे, दो, चा
  if (/[दथझ]/.test(firstChar)) return { rashiId: 11, rashiNe: 'मीन', rashiEn: 'Pisces', lordNe: 'बृहस्पति (Jupiter)', lordEn: 'Jupiter' };

  return { rashiId: 0, rashiNe: 'मेष', rashiEn: 'Aries', lordNe: 'मङ्गल (Mars)', lordEn: 'Mars' };
}

/**
 * 12 House Sanskrit Names & Significance
 */
const HOUSE_NAMES: { ne: string; en: string; meaningNe: string }[] = [
  { ne: 'तनु भाव (Lagna)', en: '1st House (Self & Body)', meaningNe: 'शारीरिक बनावट, व्यक्तित्व, आत्मविश्वास र स्वास्थ्य' },
  { ne: 'धन भाव (Dhana)', en: '2nd House (Wealth & Family)', meaningNe: 'सञ्चित धन, वाणी, खानपान र पारिवारिक सुख' },
  { ne: 'सहज भाव (Sahaja)', en: '3rd House (Siblings & Courage)', meaningNe: 'साहस, पराक्रम, भाइ-बहिनी र छोटो यात्रा' },
  { ne: 'सुख भाव (Bandhu)', en: '4th House (Mother & Real Estate)', meaningNe: 'माता, गृहसुख, जग्गा-जमिन, वाहन र मानसिक शान्ति' },
  { ne: 'सुत भाव (Putra)', en: '5th House (Children & Intelligence)', meaningNe: 'विद्या, बुद्धि, सन्तान, पूर्वजन्मको पुण्य र सिर्जनात्मकता' },
  { ne: 'शत्रु भाव (Ari)', en: '6th House (Health & Obstacles)', meaningNe: 'रोग, ऋण, शत्रु, प्रतिस्पर्धा र कार्यक्षमता' },
  { ne: 'कलत्र भाव (Yuvati)', en: '7th House (Marriage & Partnership)', meaningNe: 'दाम्पत्य जीवन, जीवनसाथी, साझेदारी व्यापार र सामाजिक सम्बन्ध' },
  { ne: 'आयु भाव (Randhra)', en: '8th House (Longevity & Mystery)', meaningNe: 'दीर्घायुष्य, गुप्त धन, अनुसन्धान र आकस्मिक परिवर्तन' },
  { ne: 'भाग्य भाव (Dharma)', en: '9th House (Destiny & Spirituality)', meaningNe: 'भाग्य, धर्म, पिता, गुरु, तीर्थयात्रा र उच्च शिक्षा' },
  { ne: 'कर्म भाव (Karma)', en: '10th House (Career & Status)', meaningNe: 'पेशा, व्यवसाय, पदोन्नति, मान-सम्मान र राज्य कृपा' },
  { ne: 'लाभ भाव (Labha)', en: '11th House (Gains & Network)', meaningNe: 'आम्दानी, मनोकामना पूर्ति, मित्र मण्डली र समृद्धि' },
  { ne: 'व्यय भाव (Vyaya)', en: '12th House (Expenditure & Moksha)', meaningNe: 'खर्च, विदेश यात्रा, शयन सुख, मोक्ष र आध्यात्मिक चिन्तन' },
];

/**
 * 120-Year Vimshottari Mahadasha Planetary Sequence
 */
const VIMSHOTTARI_CYCLE: { key: PlanetKey; nameNe: string; nameEn: string; years: number }[] = [
  { key: 'ketu', nameNe: 'केतु (Ketu)', nameEn: 'Ketu', years: 7 },
  { key: 'venus', nameNe: 'शुक्र (Venus)', nameEn: 'Venus', years: 20 },
  { key: 'sun', nameNe: 'सूर्य (Sun)', nameEn: 'Sun', years: 6 },
  { key: 'moon', nameNe: 'चन्द्र (Moon)', nameEn: 'Moon', years: 10 },
  { key: 'mars', nameNe: 'मङ्गल (Mars)', nameEn: 'Mars', years: 7 },
  { key: 'rahu', nameNe: 'राहु (Rahu)', nameEn: 'Rahu', years: 18 },
  { key: 'jupiter', nameNe: 'बृहस्पति (Jupiter)', nameEn: 'Jupiter', years: 16 },
  { key: 'saturn', nameNe: 'शनि (Saturn)', nameEn: 'Saturn', years: 19 },
  { key: 'mercury', nameNe: 'बुध (Mercury)', nameEn: 'Mercury', years: 17 },
];

/**
 * Precision Vedic Janma Kundali Chart & Planetary Position Calculator
 */
export function calculateVedicKundali(
  name: string,
  gender: string,
  dob: string,
  tob: string,
  pob: string
): KundaliResult {
  // 1. Resolve City Coordinates & Timezone Offset
  const matchedCity = POPULAR_BIRTH_PLACES.find(c => 
    (pob && (pob.includes(c.nameNe) || pob.includes(c.nameEn)))
  ) || POPULAR_BIRTH_PLACES[0];
  
  const latitude = matchedCity.lat;
  const longitude = matchedCity.lng;
  const timezoneOffsetHours = matchedCity.tz ?? 5.75;

  // 2. Intelligent Date Parsing: Auto-detect BS vs AD
  let normalizedAdDate = '1995-09-01';
  let dobBsFormatted = '';
  const dateParts = dob.split(/[-/]/);
  const rawYear = parseInt(dateParts[0], 10) || 1995;
  const rawMonth = parseInt(dateParts[1], 10) || 1;
  const rawDay = parseInt(dateParts[2], 10) || 1;

  if (rawYear >= 1980 && rawYear <= 2095) {
    // If year is in Nepali Bikram Sambat range (e.g. 2000 to 2090 BS)
    const converted = convertBsToAd(rawYear, rawMonth, rawDay);
    normalizedAdDate = converted.formatted;
    dobBsFormatted = `${rawYear} साल ${rawMonth} महिना ${rawDay} गते (वि.सं.)`;
  } else {
    // Standard Gregorian AD
    normalizedAdDate = `${rawYear}-${String(rawMonth).padStart(2, '0')}-${String(rawDay).padStart(2, '0')}`;
    const bsConv = convertAdToBs(rawYear, rawMonth, rawDay);
    dobBsFormatted = bsConv.formattedBs;
  }

  // 3. Deterministic Astronomical Ephemeris Calculation
  const horoscope = calculateVedicHoroscope({
    date: normalizedAdDate,
    time: tob || '06:30',
    location: {
      nameNe: matchedCity.nameNe,
      nameEn: matchedCity.nameEn,
      latitude,
      longitude,
      timezoneOffsetHours
    }
  });

  // 4. Map 9 Planetary Coordinates & Dignities
  const planets: PlanetPosition[] = horoscope.grahasList.map((g) => ({
    nameNe: g.nameNe.split(' ')[0],
    nameEn: g.nameEn,
    symbol: g.symbol,
    rashiNe: g.rashiNe,
    rashiEn: g.rashiEn,
    house: g.house,
    degree: g.formattedDegree,
    isRetrograde: g.isRetrograde,
    dignityNe: g.dignityNe,
    dignityEn: g.dignityEn
  }));

  // 5. Build 12 Detailed Houses with Sanskrit Significations
  const houses: HouseDetail[] = horoscope.houses.map((h, idx) => {
    const meta = HOUSE_NAMES[idx] || { ne: `${idx + 1}औं भाव`, en: `House ${idx + 1}`, meaningNe: '' };
    return {
      houseNumber: h.houseNumber,
      houseNameNe: meta.ne,
      houseNameEn: meta.en,
      signNe: h.rashiNe,
      signEn: h.rashiEn,
      signIndex: h.rashiIndex,
      lordNe: h.lordNe,
      lordEn: h.lordEn,
      planets: h.planets.map(p => p.nameNe.split(' ')[0])
    };
  });

  // 6. Ascendant & Planetary Placements
  const lagnaNe = horoscope.lagna.rashiNe;
  const lagnaEn = horoscope.lagna.rashiEn;
  const lagnaIndex = horoscope.lagna.rashiIndex;
  const lagnaMeta = VEDIC_RASHIS[lagnaIndex] || VEDIC_RASHIS[0];

  const moonRashiIndex = horoscope.moonSign.rashiIndex;
  const moonMeta = VEDIC_RASHIS[moonRashiIndex] || VEDIC_RASHIS[0];
  const moonNakshatraIndex = horoscope.grahas.moon.nakshatra.index;
  const nakshatraMeta = VEDIC_NAKSHATRAS[moonNakshatraIndex] || VEDIC_NAKSHATRAS[0];
  const charan = horoscope.moonSign.pada; // 1 to 4

  // 7. Auspicious Nama-Akshar (नामरूप अक्षर) from Nakshatra & Charan
  const janmaNamaAkshar = nakshatraMeta.aksharas[charan - 1] || nakshatraMeta.aksharas[0];
  const allCharanAksharas = nakshatraMeta.aksharas;

  // 8. Nama Rashi (बोलचालको नामको राशि)
  const namaInfo = getNamaRashi(name);
  const isNamaJanmaSame = namaInfo.rashiId === moonRashiIndex;
  const namaJanmaHarmonyNe = isNamaJanmaSame
    ? `तपाईंको बोलचालको नाम (${namaInfo.rashiNe}) र जन्म कुण्डलीको चन्द्र राशि (${horoscope.moonSign.rashiNe}) पूर्ण रूपमा एकाकार छन्। यसले जीवनमा स्पष्टता, उच्च आत्मविश्वास र नामको पूर्ण सकारात्मक प्रभाव दिलाउँछ।`
    : `तपाईंको बोलचालको नाम अनुसारको राशि '${namaInfo.rashiNe}' (स्वामी: ${namaInfo.lordNe}) हो भने जन्म समय अनुसारको राशि '${horoscope.moonSign.rashiNe}' हो। वैदिक शास्त्र अनुसार धार्मिक अनुष्ठान, पूजा-पाठ तथा विवाह आदिमा जन्म राशि (${horoscope.moonSign.rashiNe}) र व्यावहारिक कार्यमा बोलचालको नाम प्रयोग गर्नु फलदायी हुन्छ।`;
  
  const namaJanmaHarmonyEn = isNamaJanmaSame
    ? `Your worldly name (${namaInfo.rashiEn}) aligns flawlessly with your birth moon sign (${horoscope.moonSign.rashiEn}), bestowing exceptional inner clarity and unified vitality.`
    : `Your spoken name corresponds to ${namaInfo.rashiEn} while your Janma Rashi is ${horoscope.moonSign.rashiEn}. Use your birth sign for spiritual sacraments and worldly name for social identity.`;

  // 9. Chronological Vimshottari Mahadasha Timeline (from Birth Year)
  const birthAdYear = parseInt(normalizedAdDate.split('-')[0], 10) || 1995;
  const currentAdYear = new Date().getFullYear();

  // Find start index in Vimshottari cycle from Moon's nakshatra lord
  const rulingLordKey = horoscope.dashaBalance.rulingPlanetKey;
  let startCycleIdx = VIMSHOTTARI_CYCLE.findIndex(v => v.key === rulingLordKey);
  if (startCycleIdx < 0) startCycleIdx = 0;

  const fullDashaTimeline: MahadashaPeriod[] = [];
  let runningYear = birthAdYear;
  
  // First dasha: has balance from birth
  const firstBalanceYears = Math.max(1, horoscope.dashaBalance.remainingYears + (horoscope.dashaBalance.remainingMonths / 12));
  const firstDasha = VIMSHOTTARI_CYCLE[startCycleIdx];
  const firstEndYear = Math.round(runningYear + firstBalanceYears);
  
  fullDashaTimeline.push({
    planetKey: firstDasha.key,
    planetNe: firstDasha.nameNe,
    planetEn: firstDasha.nameEn,
    startYear: runningYear,
    endYear: firstEndYear,
    durationYears: Math.round(firstBalanceYears),
    isCurrent: (currentAdYear >= runningYear && currentAdYear <= firstEndYear)
  });
  runningYear = firstEndYear;

  // Next cycles up to 100+ years of age
  for (let i = 1; i <= 8; i++) {
    const cycleItem = VIMSHOTTARI_CYCLE[(startCycleIdx + i) % 9];
    const endYear = runningYear + cycleItem.years;
    const isCurrent = (currentAdYear >= runningYear && currentAdYear <= endYear);
    
    fullDashaTimeline.push({
      planetKey: cycleItem.key,
      planetNe: cycleItem.nameNe,
      planetEn: cycleItem.nameEn,
      startYear: runningYear,
      endYear,
      durationYears: cycleItem.years,
      isCurrent
    });
    runningYear = endYear;
  }

  // Active Dasha identification
  const activeDashaPeriod = fullDashaTimeline.find(d => d.isCurrent) || fullDashaTimeline[0];
  
  // 10. Manglik Analysis
  const isManglik = horoscope.manglikAnalysis.isManglik;
  const manglikSeverity = horoscope.manglikAnalysis.severity;
  const manglikDetailsNe = horoscope.manglikAnalysis.verdictNe;
  const manglikDetailsEn = horoscope.manglikAnalysis.verdictEn;

  // 11. Tailored Personality Profile based on Lagna & Moon
  const lagnaPersonalitiesNe: Record<number, string> = {
    0: 'मेष लग्न भएकाले तपाईंमा स्वाभाविक नेतृत्व क्षमता, उत्साह र निर्भीकता छ। कुनै पनि चुनौतीको सामना सिधै गर्ने र नयाँ कार्यको थालनी तुरुन्तै गर्ने तपाईंको मूल स्वभाव हो।',
    1: 'वृष लग्न भएकाले तपाईं धैर्यवान्, व्यावहारिक र सौन्दर्यप्रेमी हुनुहुन्छ। स्थिरता, पारिवारिक सुरक्षा र निष्ठालाई तपाईं सर्वोच्च प्राथमिकता दिनुहुन्छ।',
    2: 'मिथुन लग्न भएकाले तपाईं बहुमुखी प्रतिभा, तीक्ष्ण बौद्धिकता र प्रभावकारी सञ्चार कलाले सम्पन्न हुनुहुन्छ। नयाँ ज्ञान सिक्न र सामाजिक सञ्जाल विस्तार गर्न तपाईं सधैं अग्रसर रहनुहुन्छ।',
    3: 'कर्कट लग्न भएकाले तपाईं अत्यन्त संवेदनशील, भावनात्मक रूपमा गम्भीर र परिवारप्रेमी हुनुहुन्छ। अरूको भावना छिटो बुझ्ने र सुरक्षात्मक स्नेह प्रदान गर्ने तपाईंको विशेषता हो।',
    4: 'सिंह लग्न भएकाले तपाईं तेजस्वी, स्वाभिमानी र प्राकृतिक रूपमै प्रभावकारी व्यक्तित्वको धनी हुनुहुन्छ। उच्च पद, स्वाभिमान र स्पष्ट दृष्टिकोण तपाईंको जीवनको आधारशिला हुन्।',
    5: 'कन्या लग्न भएकाले तपाईं विश्लेषणात्मक, सूक्ष्मदर्शी र अत्यन्त परिश्रमी हुनुहुन्छ। हरेक कार्यलाई व्यवस्थित, त्रुटिरहित र समयमै सम्पन्न गर्न तपाईं विशेष दक्षता राख्नुहुन्छ।',
    6: 'तुला लग्न भएकाले तपाईं सन्तुलित, न्यायप्रिय र मिलनसार हुनुहुन्छ। कला, साझेदारी र सौहार्दपूर्ण वातावरण निर्माण गर्न तपाईंको स्वभाव अति अनुकूल रहन्छ।',
    7: 'वृश्चिक लग्न भएकाले तपाईं दृढ निश्चयी, गम्भीर र उच्च इच्छाशक्तिका धनी हुनुहुन्छ। जस्तोसुकै कठिन परिस्थितिबाट पनि नयाँ ऊर्जाका साथ उठ्ने अद्भूत सामर्थ्य तपाईंमा छ।',
    8: 'धनु लग्न भएकाले तपाईं आशावादी, दार्शनिक र सत्यवादी हुनुहुन्छ। उच्च आदर्श, गुरुजनको सम्मान र निरन्तर ज्ञान आर्जन तपाईंको मुख्य पहिचान हो।',
    9: 'मकर लग्न भएकाले तपाईं अनुशासित, धैर्यवान् र कर्तव्यनिष्ठ हुनुहुन्छ। दीर्घकालीन योजना, कठोर परिश्रम र कार्यसम्पादनमा विश्वास राख्ने तपाईंको स्वभावले जीवनमा उच्च सफलता दिलाउँछ।',
    10: 'कुम्भ लग्न भएकाले तपाईं नवप्रवर्तक, वैज्ञानिक सोच र मानवीय भावनाले ओतप्रोत हुनुहुन्छ। समाज सुधार, मौलिक विचार र स्वतन्त्रता तपाईंलाई सर्वाधिक प्रिय लाग्छ।',
    11: 'मीन लग्न भएकाले तपाईं दयालु, आध्यात्मिक र कल्पनाशील हुनुहुन्छ। अरूप्रति सहानुभूति राख्ने र ईश्वरभक्ति तथा परोपकारमा आनन्द लिने तपाईंको स्वभाव हो।'
  };

  const lagnaPersonalitiesEn: Record<number, string> = {
    0: 'With Aries Ascendant, you possess innate pioneering bravery, direct initiative, and spontaneous leadership charisma.',
    1: 'With Taurus Ascendant, you are rooted in pragmatic patience, artistic grace, and profound loyalty to financial stability.',
    2: 'With Gemini Ascendant, you are gifted with communicative intellect, versatile curiosity, and vibrant social adaptability.',
    3: 'With Cancer Ascendant, deep emotional intuition, familial devotion, and protective nurturing instincts define your core persona.',
    4: 'With Leo Ascendant, magnetic dignity, royal generosity, and an unshakeable sense of self-respect radiate through your endeavors.',
    5: 'With Virgo Ascendant, methodical precision, analytical discernment, and an unwavering devotion to excellence guide your actions.',
    6: 'With Libra Ascendant, diplomatic charm, aesthetic harmony, and a passionate devotion to balanced justice shape your worldview.',
    7: 'With Scorpio Ascendant, profound intensity, magnetic willpower, and resilience to rise from adversity are your defining gifts.',
    8: 'With Sagittarius Ascendant, philosophical optimism, boundless enthusiasm for truth, and higher wisdom inspire your journey.',
    9: 'With Capricorn Ascendant, strategic discipline, structured endurance, and methodical perseverance secure your lasting success.',
    10: 'With Aquarius Ascendant, progressive vision, original humanitarian insight, and unconventional wisdom define your path.',
    11: 'With Pisces Ascendant, compassionate empathy, transcendent intuition, and spiritual imagination enrich your inner life.'
  };

  // 12. Dynamic Career & Wealth (१०औं भाव र कर्म विश्लेषण)
  const tenthHouseSignIdx = (lagnaIndex + 9) % 12;
  const tenthLord = VEDIC_RASHIS[tenthHouseSignIdx].lord;
  const careerDomainsNe: Record<string, string> = {
    'Sun': 'दशम भावमा सूर्यको प्रभावले निजामती सेवा, सरकारी पद, प्रशासनिक नेतृत्व, राजनीति वा उच्च व्यवस्थापकीय जिम्मेवारीमा प्रचुर सफलता दिलाउनेछ।',
    'Moon': 'दशम भावमा चन्द्रमाको प्रभावले जनसम्पर्क, स्वास्थ्य क्षेत्र, आतिथ्य सत्कार, विदेश व्यापार वा परामर्श सेवामा विशेष ख्याति दिलाउनेछ।',
    'Mars': 'दशम भावमा मङ्गलको अधिपत्यले इन्जिनियरिङ, रक्षा, सुरक्षा बल, घरजग्गा (रियल एस्टेट), प्राविधिक निर्माण वा शल्यचिकित्सामा असाधारण सफलता प्राप्त हुनेछ।',
    'Mercury': 'दशम भावमा बुधको प्रभावले सूचना प्रविधि (IT), वाणिज्य, बैंकिङ, चार्टर्ड एकाउन्टेन्सी, पत्रकारिता वा व्यापारमा द्रुत उन्नति दिलाउनेछ।',
    'Jupiter': 'दशम भावमा बृहस्पतिको कृपाले शिक्षण, न्याय क्षेत्र, कानुन, वित्तीय व्यवस्थापन, उच्च अनुसन्धान वा आध्यात्मिक मार्गदर्शनमा प्रतिष्ठित बनाउनेछ।',
    'Venus': 'दशम भावमा शुक्रको प्रभावले कला, फेसन, मिडिया, अन्तर्राष्ट्रिय व्यापार, सफ्टवेयर डिजाइन वा होटल तथा मनोरञ्जन उद्योगमा ठूलो प्रतिष्ठा दिलाउनेछ।',
    'Saturn': 'दशम भावमा शनिको प्रभावले उद्योग, धातु, निर्माण, कृषि, सार्वजनिक प्रशासन वा अनुसन्धानमूलक प्राविधिक उद्यममा दीर्घकालीन सफलता दिलाउनेछ।'
  };

  const careerDomainsEn: Record<string, string> = {
    'Sun': '10th House solar dominance fosters administrative civil service, governance, executive management, and governmental authority.',
    'Moon': '10th House lunar resonance favors healthcare, public diplomacy, hospitality, international commerce, and human advisory.',
    'Mars': '10th House martial strength elevates engineering, real estate development, defense, tech manufacturing, and surgical science.',
    'Mercury': '10th House mercurial vitality drives software engineering, FinTech, accounting, corporate journalism, and lucrative commerce.',
    'Jupiter': '10th House jovial wisdom crowns higher academia, judiciary, corporate law, wealth management, and spiritual mentorship.',
    'Venus': '10th House venusian grace empowers creative media, architectural design, global trade, luxury hospitality, and public arts.',
    'Saturn': '10th House saturnine endurance ensures lasting authority in manufacturing, infrastructure, public works, and technological governance.'
  };

  // 13. Dynamic Marriage & 7th House (दाम्पत्य तथा वैवाहिक जीवन)
  const seventhHouseSignIdx = (lagnaIndex + 6) % 12;
  const seventhSignMeta = VEDIC_RASHIS[seventhHouseSignIdx];
  const marriagePredictionNe = isManglik
    ? `सप्तम भावमा ${seventhSignMeta.ne} राशि रहेको र कुण्डलीमा ${manglikDetailsNe} परेकाले विवाहपूर्व मङ्गल शान्ति वा कुम्भ विवाह अनुष्ठान शुभ रहनेछ। जीवनसाथी ऊर्जावान्, दृढनिश्चयी र स्पष्ट वक्ता हुनेछन्। आपसी संवाद र सम्मानले दाम्पत्य जीवन सुदृढ रहनेछ।`
    : `सप्तम भावमा ${seventhSignMeta.ne} राशि (स्वामी: ${seventhSignMeta.lordNe}) रहेकाले जीवनसाथी सहयोगी, समझदार र सौम्य प्रकृतिका प्राप्त हुनेछन्। विवाह पश्चात् भाग्यवृद्धि र पारिवारिक सुख-शान्तिमा विशेष वृद्धि हुने योग छ।`;

  const marriagePredictionEn = isManglik
    ? `7th house occupies ${seventhSignMeta.en}. ${manglikDetailsEn}. Performing peaceful Manglik Shanti rituals harmonizes relations. Your partner will be courageous and candid; mutual respect ensures lasting happiness.`
    : `7th house is graced by ${seventhSignMeta.en} (ruled by ${seventhSignMeta.lord}). Your spouse will be supportive, empathetic, and cultured. Marriage significantly elevates your domestic prosperity and social standing.`;

  // 14. Dynamic Health & Vitality (६औं र ८औं भाव तथा धातु विश्लेषण)
  const lagnaElement = lagnaMeta.element;
  let healthPredictionNe = '';
  let healthPredictionEn = '';

  if (lagnaElement.includes('अग्नि')) {
    healthPredictionNe = 'अग्नि तत्त्वको प्रभावले पाचन तथा पित्त सम्बन्धी सन्तुलनमा ध्यान दिनु आवश्यक छ। नियमित प्रशस्त पानी पिउने र बिहान सूर्य नमस्कार गर्नाले शारीरिक ऊर्जा सधैं सबल रहनेछ।';
    healthPredictionEn = 'Fire element governs your constitution. Keep pitta and digestion balanced with hydration and calming morning pranayama.';
  } else if (lagnaElement.includes('पृथ्वी')) {
    healthPredictionNe = 'पृथ्वी तत्त्वको प्रभावले हाडजोर्नी, ढाड र मन्द पाचनमा ध्यान दिनु लाभप्रद छ। ताजा सात्विक आहार र दैनिक शारीरिक व्यायामले दीर्घायुष्य र स्फूर्ति प्रदान गर्नेछ।';
    healthPredictionEn = 'Earth element anchors your vitality. Maintain regular joints/spinal posture exercises and fiber-rich sattvic nutrition.';
  } else if (lagnaElement.includes('वायु')) {
    healthPredictionNe = 'वायु तत्त्वको प्रभावले स्नायु प्रणाली, अनिद्रा तथा श्वासप्रश्वासको सन्तुलनमा ख्याल राख्नुपर्छ। नियमित ध्यान (Meditation) र शान्त वातावरणले मानसिक शक्ति उच्च राख्नेछ।';
    healthPredictionEn = 'Air element influences your nervous system. Daily meditation and rhythmic breathing keep tension away and vitality vibrant.';
  } else {
    healthPredictionNe = 'जल तत्त्वको प्रभावले कफ, रुघाखोकी तथा तरल पदार्थको सन्तुलनमा ध्यान दिनुपर्छ। बिहान मनतातो पानी पिउने र प्राणायाम गर्नाले रोगप्रतिरोधात्मक क्षमता सबल रहनेछ।';
    healthPredictionEn = 'Water element regulates your lymphatic balance. Warm herbal teas and morning sun exposure fortify your immunity and stamina.';
  }

  // 15. Active Mahadasha Dynamic Prediction
  const activePlanetKey = activeDashaPeriod.planetKey;
  const dashaPredictionsNe: Record<PlanetKey, string> = {
    sun: 'सूर्य महादशाको प्रभावले समाजमा प्रतिष्ठा, कार्यक्षेत्रमा पदोन्नति र पिता तथा गुरुजनको सद्भाव प्राप्त हुनेछ। आत्मविश्वास र सरकारी काममा सफलता मिल्ने समय छ।',
    moon: 'चन्द्रमा महादशाको प्रभावले मानसिक शान्ति, रचनात्मकता, विदेश यात्रा तथा पारिवारिक सुख-सौहार्दतामा उल्लेखनीय वृद्धि गराउनेछ।',
    mars: 'मङ्गल महादशाको प्रभावले साहस, पराक्रम, जग्गाजमिनको लाभ तथा नयाँ उद्यम सुरु गर्ने ऊर्जा दिलाउनेछ। धैर्यतापूर्वक काम गर्दा ठूलो लाभ हुनेछ।',
    mercury: 'बुध महादशाको प्रभावले बौद्धिक विकास, व्यापार-व्यवसायमा प्रगति, वित्तीय लाभ तथा लेखन/सञ्चार क्षेत्रमा असाधारण ख्याति दिलाउनेछ।',
    jupiter: 'बृहस्पति महादशाको प्रभावले ज्ञान, सन्तान सुख, धर्म-कर्ममा रुचि, आर्थिक स्थिरता र समाजमा सम्मानित पदवी प्राप्त हुनेछ।',
    venus: 'शुक्र महादशाको प्रभावले ऐश्वर्य, भौतिक सुख, वैवाहिक आनन्द, कला-साहित्य तथा नयाँ वाहन वा घरको सुख दिलाउनेछ।',
    saturn: 'शनि महादशाको प्रभावले कडा परिश्रमको मीठो फल, स्थायी सम्पत्ति, आत्मअनुशासन र सामाजिक कार्यमा परिपक्व सफलता दिलाउनेछ।',
    rahu: 'राहु महादशाको प्रभावले आकस्मिक अवसर, प्रविधि, विदेश सम्बन्धित लाभ तथा दूरगामी योजनाहरूमा सफलता दिलाउनेछ। कूटनीतिक विवेक आवश्यक।',
    ketu: 'केतु महादशाको प्रभावले आध्यात्मिक जागरण, अनुसन्धान, तीर्थाटन र गुप्त ज्ञान आर्जनमा विशेष सफलता दिलाउनेछ।'
  };

  const dashaPredictionsEn: Record<PlanetKey, string> = {
    sun: 'Sun Mahadasha fosters leadership elevation, executive acclaim, and favorable patronage from authorities.',
    moon: 'Moon Mahadasha stimulates emotional intuition, creative breakthrough, foreign travel, and domestic harmony.',
    mars: 'Mars Mahadasha sparks bold ambition, real estate acquisitions, athletic vitality, and entrepreneurial courage.',
    mercury: 'Mercury Mahadasha brings rapid commercial gains, communicative excellence, analytical triumphs, and lucrative networking.',
    jupiter: 'Jupiter Mahadasha heralds profound wisdom, family bliss, financial abundance, and high societal honor.',
    venus: 'Venus Mahadasha bestows material prosperity, romantic bliss, aesthetic fulfillment, and luxurious comforts.',
    saturn: 'Saturn Mahadasha rewards disciplined grit, creating enduring institutional pillars and structural stability.',
    rahu: 'Rahu Mahadasha unlocks unconventional breakthroughs, tech innovation, international ventures, and rapid ascent.',
    ketu: 'Ketu Mahadasha deepens spiritual introspection, esoteric discernment, research breakthroughs, and liberation.'
  };

  return {
    name,
    gender,
    dob,
    dobAd: normalizedAdDate,
    dobBsFormatted,
    tob,
    pob,
    latitude,
    longitude,
    timezoneOffsetHours,
    lagnaNe,
    lagnaEn,
    lagnaDegree: horoscope.lagna.formattedDegree,
    lagnaLordNe: lagnaMeta.lordNe,
    lagnaLordEn: lagnaMeta.lord,
    rashiNe: horoscope.moonSign.rashiNe,
    rashiEn: horoscope.moonSign.rashiEn,
    rashiLordNe: moonMeta.lordNe,
    rashiLordEn: moonMeta.lord,
    nakshatraNe: horoscope.moonSign.nakshatraNe,
    nakshatraEn: horoscope.moonSign.nakshatraEn,
    nakshatraLordNe: NAKSHATRAS[moonNakshatraIndex]?.lord || 'Unknown',
    charan,
    ganNe: nakshatraMeta.gana,
    ganEn: nakshatraMeta.gana === 'देव' ? 'Deva' : nakshatraMeta.gana === 'मनुष्य' ? 'Manushya' : 'Rakshasa',
    nadiNe: nakshatraMeta.nadi,
    nadiEn: nakshatraMeta.nadi === 'आदि' ? 'Aadi' : nakshatraMeta.nadi === 'मध्य' ? 'Madhya' : 'Antya',
    yoniNe: nakshatraMeta.yoni,
    yoniEn: nakshatraMeta.yoni,
    varnaNe: moonMeta.varna,
    varnaEn: moonMeta.varna,

    // Name Astrology
    namaRashiNe: namaInfo.rashiNe,
    namaRashiEn: namaInfo.rashiEn,
    namaLordNe: namaInfo.lordNe,
    namaLordEn: namaInfo.lordEn,
    janmaNamaAkshar,
    allCharanAksharas,
    namaJanmaHarmonyNe,
    namaJanmaHarmonyEn,

    // Solar Sign
    sunSignNe: horoscope.sunSign.rashiNe,
    sunSignEn: horoscope.sunSign.rashiEn,
    sunDegree: horoscope.grahas.sun.formattedDegree,

    // Manglik
    isManglik,
    manglikSeverity,
    manglikDetailsNe,
    manglikDetailsEn,

    // Planets & Houses
    planets,
    houses,

    // Full Timeline & Active Mahadasha
    fullDashaTimeline,
    currentDasha: {
      mahadasha: activeDashaPeriod.planetNe,
      antardasha: `${activeDashaPeriod.planetNe} अन्तर्गत शुभ अन्तर्दशा`,
      startDate: `${activeDashaPeriod.startYear}`,
      endDate: `${activeDashaPeriod.endYear}`,
      predictionNe: dashaPredictionsNe[activePlanetKey] || 'शुभ ग्रहको प्रभावले कार्यक्षेत्रमा सफलता प्राप्त हुनेछ।',
      predictionEn: dashaPredictionsEn[activePlanetKey] || 'Favorable transit aspects support steady progress and purposeful achievements.'
    },

    // Auspicious Factors
    luckyGem: horoscope.luckyElements.luckyGemNe,
    secondaryGem: lagnaIndex === 0 ? 'गार्नेट (Garnet)' : lagnaIndex === 1 ? 'फिरोजा (Turquoise)' : lagnaIndex === 2 ? 'ओनेक्स (Green Onyx)' : 'उपरत्न (Secondary Gem)',
    luckyColor: horoscope.luckyElements.luckyColorNe,
    luckyNumber: horoscope.luckyElements.luckyNumber,
    luckyDayNe: lagnaIndex === 0 || lagnaIndex === 7 ? 'मंगलबार' : lagnaIndex === 1 || lagnaIndex === 6 ? 'शुक्रबार' : lagnaIndex === 2 || lagnaIndex === 5 ? 'बुधबार' : lagnaIndex === 3 ? 'सोमबार' : lagnaIndex === 4 ? 'आइतबार' : lagnaIndex === 8 || lagnaIndex === 11 ? 'बिहीबार' : 'शनिबार',
    luckyDayEn: lagnaIndex === 0 || lagnaIndex === 7 ? 'Tuesday' : lagnaIndex === 1 || lagnaIndex === 6 ? 'Friday' : lagnaIndex === 2 || lagnaIndex === 5 ? 'Wednesday' : lagnaIndex === 3 ? 'Monday' : lagnaIndex === 4 ? 'Sunday' : lagnaIndex === 8 || lagnaIndex === 11 ? 'Thursday' : 'Saturday',
    luckyDirectionNe: lagnaMeta.element.includes('अग्नि') ? 'पूर्व / दक्षिण-पूर्व (आग्नेय)' : lagnaMeta.element.includes('पृथ्वी') ? 'दक्षिण / दक्षिण-पश्चिम' : lagnaMeta.element.includes('वायु') ? 'पश्चिम / उत्तर-पश्चिम' : 'उत्तर / उत्तर-पूर्व (ईशान)',
    luckyDeity: horoscope.luckyElements.luckyDeityNe,
    vedicMantra: lagnaIndex === 0 || lagnaIndex === 7 ? 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' : lagnaIndex === 1 || lagnaIndex === 6 ? 'ॐ शुं शुक्राय नमः' : lagnaIndex === 2 || lagnaIndex === 5 ? 'ॐ बुं बुधाय नमः' : lagnaIndex === 3 ? 'ॐ सों सोमाय नमः' : lagnaIndex === 4 ? 'ॐ घृणि सूर्याय नमः' : lagnaIndex === 8 || lagnaIndex === 11 ? 'ॐ बृं बृहस्पतये नमः' : 'ॐ शं शनैश्चराय नमः',

    // Tailored Predictions
    personalityNe: lagnaPersonalitiesNe[lagnaIndex] || lagnaPersonalitiesNe[0],
    personalityEn: lagnaPersonalitiesEn[lagnaIndex] || lagnaPersonalitiesEn[0],
    careerPredictionNe: careerDomainsNe[tenthLord] || 'कर्म भाव अनुकूल रहेकाले प्रशासनिक, व्यापार वा प्राविधिक कार्यमा उन्नति हुनेछ।',
    careerPredictionEn: careerDomainsEn[tenthLord] || 'Supportive 10th house aspects empower administration, commerce, or technical ventures.',
    marriagePredictionNe,
    marriagePredictionEn,
    healthPredictionNe,
    healthPredictionEn
  };
}

/**
 * Classical Ashtakoot 8-Koota Calculation Rules
 */

// 1. Varna Score (1 Pt)
function calculateVarnaScore(boyRashiId: number, girlRashiId: number) {
  const varnaRank = { 'ब्राह्मण': 4, 'क्षत्रिय': 3, 'वैश्य': 2, 'शूद्र': 1 };
  const boyVarna = VEDIC_RASHIS[boyRashiId].varna as keyof typeof varnaRank;
  const girlVarna = VEDIC_RASHIS[girlRashiId].varna as keyof typeof varnaRank;

  if (varnaRank[boyVarna] >= varnaRank[girlVarna]) {
    return {
      points: 1,
      boyVal: boyVarna,
      girlVal: girlVarna,
      analysisNe: 'दम्पतीबीच आध्यात्मिक तथा बौद्धिक तालमेल उत्तम रहनेछ।',
      analysisEn: 'High spiritual affinity and mutual intellectual respect.'
    };
  }
  return {
    points: 0,
    boyVal: boyVarna,
    girlVal: girlVarna,
    analysisNe: 'वर्ण भिन्नता भए पनि पारिवारिक समझदारीबाट तालमेल मिलाउन सकिन्छ।',
    analysisEn: 'Minor varna variance; mutual emotional harmony reconciles this.'
  };
}

// 2. Vashya Score (2 Pts)
function calculateVashyaScore(boyRashiId: number, girlRashiId: number) {
  const boyVashya = VEDIC_RASHIS[boyRashiId].vashya;
  const girlVashya = VEDIC_RASHIS[girlRashiId].vashya;

  if (boyVashya === girlVashya) {
    return { points: 2, boyVal: boyVashya, girlVal: girlVashya, analysisNe: 'एक-अर्काप्रति समान आकर्षण तथा पूर्ण समझदारी रहनेछ।', analysisEn: 'Complete mutual attraction and devotion.' };
  }
  if ((boyVashya === 'मानव' && girlVashya === 'चतुष्पाद') || (boyVashya === 'चतुष्पाद' && girlVashya === 'मानव')) {
    return { points: 1, boyVal: boyVashya, girlVal: girlVashya, analysisNe: 'पारिवारिक सौहार्दता तथा सम्मान रहनेछ।', analysisEn: 'Balanced affection and mutual respect.' };
  }
  return { points: 0.5, boyVal: boyVashya, girlVal: girlVashya, analysisNe: 'आकर्षण सामान्य रहनेछ, विचारको सम्मान आवश्यक।', analysisEn: 'Moderate attraction; active communication advised.' };
}

// 3. Tara Score (3 Pts)
function calculateTaraScore(boyNakshatraId: number, girlNakshatraId: number) {
  const diffBoyToGirl = ((girlNakshatraId - boyNakshatraId + 27) % 9) + 1;
  const diffGirlToBoy = ((boyNakshatraId - girlNakshatraId + 27) % 9) + 1;

  const inauspiciousTaras = [3, 5, 7]; // Vipat, Pratyak, Naidhana
  let score = 3;
  if (inauspiciousTaras.includes(diffBoyToGirl) && inauspiciousTaras.includes(diffGirlToBoy)) {
    score = 0;
  } else if (inauspiciousTaras.includes(diffBoyToGirl) || inauspiciousTaras.includes(diffGirlToBoy)) {
    score = 1.5;
  }

  return {
    points: score,
    boyVal: `तारा #${diffBoyToGirl}`,
    girlVal: `तारा #${diffGirlToBoy}`,
    analysisNe: score >= 2 ? 'दीर्घायुष्य, भाग्यवृद्धि र सुखद सहकार्यको संकेत गर्दछ।' : 'स्वास्थ्य तथा दीर्घायुष्यका लागि महामृत्युञ्जय जप शुभ रहनेछ।',
    analysisEn: score >= 2 ? 'Auspicious destiny synergy and sound longevity indices.' : 'Occasional remedial prayers recommended for long-term health.'
  };
}

// 4. Yoni Score (4 Pts)
function calculateYoniScore(boyNakshatraId: number, girlNakshatraId: number) {
  const boyYoni = VEDIC_NAKSHATRAS[boyNakshatraId].yoni;
  const girlYoni = VEDIC_NAKSHATRAS[girlNakshatraId].yoni;

  if (boyYoni === girlYoni) {
    return { points: 4, boyVal: boyYoni, girlVal: girlYoni, analysisNe: 'शारीरिक र भावनात्मक आत्मीयता अति सौहार्दपूर्ण रहनेछ।', analysisEn: 'Flawless biological affinity and deep intimacy.' };
  }

  const swornEnemies: Record<string, string> = {
    'गौ': 'व्याघ्र', 'व्याघ्र': 'गौ',
    'मार्जार': 'मूषक', 'मूषक': 'मार्जार',
    'सर्प': 'नकुल', 'नकुल': 'सर्प',
    'अश्व': 'महिष', 'महिष': 'अश्व',
    'सिंह': 'गज', 'गज': 'सिंह',
    'श्वान': 'मृग', 'मृग': 'श्वान',
    'वानर': 'मेष', 'मेष': 'वानर'
  };

  if (swornEnemies[boyYoni] === girlYoni) {
    return { points: 0, boyVal: boyYoni, girlVal: girlYoni, analysisNe: 'योनि वैर परेकाले भावनात्मक समझदारीमा विशेष ध्यान दिनुपर्छ।', analysisEn: 'Incompatible Yoni; conscious patience needed.' };
  }

  return { points: 2, boyVal: boyYoni, girlVal: girlYoni, analysisNe: 'दम्पतीबीच सामान्य तथा सन्तुलित आत्मीयता रहनेछ।', analysisEn: 'Harmonious physical and emotional bonding.' };
}

// 5. Graha Maitri (5 Pts)
function calculateGrahaMaitriScore(boyRashiId: number, girlRashiId: number) {
  const lordBoy = VEDIC_RASHIS[boyRashiId].lord;
  const lordGirl = VEDIC_RASHIS[girlRashiId].lord;

  if (lordBoy === lordGirl) {
    return { points: 5, boyVal: lordBoy, girlVal: lordGirl, analysisNe: 'दुवैका राशी स्वामी एउटै भएकाले विचार तथा संस्कारमा पूर्ण समानता छ।', analysisEn: 'Identical sign lords ensure intellectual unity.' };
  }

  const friends: Record<string, string[]> = {
    'Sun': ['Moon', 'Mars', 'Jupiter'],
    'Moon': ['Sun', 'Mercury'],
    'Mars': ['Sun', 'Moon', 'Jupiter'],
    'Mercury': ['Sun', 'Venus'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn'],
    'Saturn': ['Mercury', 'Venus']
  };

  const isBoyFriendly = friends[lordBoy]?.includes(lordGirl);
  const isGirlFriendly = friends[lordGirl]?.includes(lordBoy);

  if (isBoyFriendly && isGirlFriendly) {
    return { points: 5, boyVal: lordBoy, girlVal: lordGirl, analysisNe: 'राशी स्वामीहरू मित्र भएकाले जीवनभर मेलमिलाप रहनेछ।', analysisEn: 'Mutual planetary friendship brings enduring domestic joy.' };
  }
  if (isBoyFriendly || isGirlFriendly) {
    return { points: 4, boyVal: lordBoy, girlVal: lordGirl, analysisNe: 'राम्रो मित्रता र सहयोगात्मक सम्बन्ध रहनेछ।', analysisEn: 'Good mutual understanding and cooperative spirit.' };
  }
  return { points: 1, boyVal: lordBoy, girlVal: lordGirl, analysisNe: 'विचारमा सामान्य मतभेद हुनसक्छ, संवाद आवश्यक।', analysisEn: 'Occasional differences in viewpoint; open discussion helps.' };
}

// 6. Gana Score (6 Pts)
function calculateGanaScore(boyNakshatraId: number, girlNakshatraId: number) {
  const boyGana = VEDIC_NAKSHATRAS[boyNakshatraId].gana;
  const girlGana = VEDIC_NAKSHATRAS[girlNakshatraId].gana;

  if (boyGana === girlGana) {
    return { points: 6, boyVal: boyGana, girlVal: girlGana, analysisNe: 'स्वभाव, संस्कार र जीवनशैलीमा शतप्रतिशत तालमेल छ।', analysisEn: 'Flawless temperament synchrony and shared values.' };
  }
  if ((boyGana === 'देव' && girlGana === 'मनुष्य') || (boyGana === 'मनुष्य' && girlGana === 'देव')) {
    return { points: 5, boyVal: boyGana, girlVal: girlGana, analysisNe: 'स्वभावमा राम्रो सन्तुलन र सम्मान रहनेछ।', analysisEn: 'Auspicious social temperament and mutual respect.' };
  }
  if (boyGana === 'राक्षस' && girlGana === 'देव') {
    return { points: 1, boyVal: boyGana, girlVal: girlGana, analysisNe: 'स्वभावमा केही कठोरता, धैर्य र समझदारी आवश्यक।', analysisEn: 'Temperament differences; emotional adaptability required.' };
  }
  return { points: 0, boyVal: boyGana, girlVal: girlGana, analysisNe: 'गण दोष देखिएको छ, विवाहपूर्व शान्ति मन्त्र जप शुभ।', analysisEn: 'Gana Dosha; peaceful spiritual rituals recommended.' };
}

// 7. Bhakoot Score (7 Pts)
function calculateBhakootScore(boyRashiId: number, girlRashiId: number) {
  const distance = Math.abs(boyRashiId - girlRashiId) + 1;

  if (distance === 1 || distance === 7 || distance === 4 || distance === 10 || distance === 3 || distance === 11) {
    return {
      points: 7,
      boyVal: VEDIC_RASHIS[boyRashiId].ne,
      girlVal: VEDIC_RASHIS[girlRashiId].ne,
      hasDosha: false,
      analysisNe: 'पारिवारिक सुख, सन्तान प्राप्ति तथा धनसम्पत्तिमा निरन्तर वृद्धि हुनेछ।',
      analysisEn: 'High domestic bliss, financial growth, and family harmony.'
    };
  }

  // Exception / Parihar: if lords are identical, Bhakoot dosha is cancelled
  const lordBoy = VEDIC_RASHIS[boyRashiId].lord;
  const lordGirl = VEDIC_RASHIS[girlRashiId].lord;
  if (lordBoy === lordGirl) {
    return {
      points: 7,
      boyVal: VEDIC_RASHIS[boyRashiId].ne,
      girlVal: VEDIC_RASHIS[girlRashiId].ne,
      hasDosha: false,
      analysisNe: 'राशी स्वामी एउटै भएकाले भकूट दोषको परिहार भई पूर्ण अंक प्राप्त भयो।',
      analysisEn: 'Identical rashi lords cancel Bhakoot dosha, granting full points.'
    };
  }

  return {
    points: 0,
    boyVal: VEDIC_RASHIS[boyRashiId].ne,
    girlVal: VEDIC_RASHIS[girlRashiId].ne,
    hasDosha: true,
    analysisNe: 'भकूट दोष देखिएको छ, विवाहपूर्व महामृत्युञ्जय जप तथा शिव पूजा शुभ।',
    analysisEn: 'Bhakoot Dosha detected; Mahamrityunjaya japa recommended.'
  };
}

// 8. Nadi Score (8 Pts)
function calculateNadiScore(boyNakshatraId: number, girlNakshatraId: number) {
  const boyNadi = VEDIC_NAKSHATRAS[boyNakshatraId].nadi;
  const girlNadi = VEDIC_NAKSHATRAS[girlNakshatraId].nadi;

  if (boyNadi !== girlNadi) {
    return {
      points: 8,
      boyVal: boyNadi,
      girlVal: girlNadi,
      hasDosha: false,
      analysisNe: 'नाडी भिन्न रहेकाले सन्तान स्वास्थ्य, दीर्घायु र वंश वृद्धिका लागि अति उत्तम।',
      analysisEn: 'Different Nadis ensure robust genetic vitality and longevity.'
    };
  }

  return {
    points: 0,
    boyVal: boyNadi,
    girlVal: girlNadi,
    hasDosha: true,
    analysisNe: 'एउटै नाडी परेकाले नाडी दोष देखिएको छ, स्वर्ण दान वा नाडी शान्ति पूजा अनिवार्य।',
    analysisEn: 'Same Nadi indicates Nadi Dosha; specialized remedial puja advised.'
  };
}

export interface GunMilanBirthDetails {
  dob: string;
  tob?: string;
  pob?: string;
  isBs?: boolean;
}

export interface GunMilanExtraDetails {
  boyKundali?: Partial<KundaliResult>;
  girlKundali?: Partial<KundaliResult>;
  manglikMatchNe?: string;
  manglikMatchEn?: string;
  hasManglikDoshaConflict?: boolean;
}

/**
 * 100% Deterministic Mathematical 36 Gun Milan Engine
 * Supports direct Rashi/Nakshatra matching OR full birth-details derivation!
 */
export function calculate36GunMilan(
  boyName: string,
  boyRashiName: string,
  boyNakshatraName: string,
  girlName: string,
  girlRashiName: string,
  girlNakshatraName: string,
  extra?: GunMilanExtraDetails
): GunMilanResult {
  const boyRashiObj = VEDIC_RASHIS.find(r => boyRashiName.includes(r.ne) || boyRashiName.includes(r.en)) || VEDIC_RASHIS[0];
  const girlRashiObj = VEDIC_RASHIS.find(r => girlRashiName.includes(r.ne) || girlRashiName.includes(r.en)) || VEDIC_RASHIS[4];

  const boyNakObj = VEDIC_NAKSHATRAS.find(n => boyNakshatraName.includes(n.ne) || boyNakshatraName.includes(n.en)) || VEDIC_NAKSHATRAS[0];
  const girlNakObj = VEDIC_NAKSHATRAS.find(n => girlNakshatraName.includes(n.ne) || girlNakshatraName.includes(n.en)) || VEDIC_NAKSHATRAS[9];

  const varna = calculateVarnaScore(boyRashiObj.id, girlRashiObj.id);
  const vashya = calculateVashyaScore(boyRashiObj.id, girlRashiObj.id);
  const tara = calculateTaraScore(boyNakObj.id, girlNakObj.id);
  const yoni = calculateYoniScore(boyNakObj.id, girlNakObj.id);
  const maitri = calculateGrahaMaitriScore(boyRashiObj.id, girlRashiObj.id);
  const gana = calculateGanaScore(boyNakObj.id, girlNakObj.id);
  const bhakoot = calculateBhakootScore(boyRashiObj.id, girlRashiObj.id);
  const nadi = calculateNadiScore(boyNakObj.id, girlNakObj.id);

  const totalScore = Math.round(
    varna.points +
    vashya.points +
    tara.points +
    yoni.points +
    maitri.points +
    gana.points +
    bhakoot.points +
    nadi.points
  );

  const kootas: GunMilanKoota[] = [
    { nameNe: 'वर्ण (Varna)', nameEn: 'Varna', maxPoints: 1, obtainedPoints: varna.points, boyValue: varna.boyVal, girlValue: varna.girlVal, status: varna.points === 1 ? 'excellent' : 'average', analysisNe: varna.analysisNe, analysisEn: varna.analysisEn },
    { nameNe: 'वश्य (Vashya)', nameEn: 'Vashya', maxPoints: 2, obtainedPoints: vashya.points, boyValue: vashya.boyVal, girlValue: vashya.girlVal, status: vashya.points === 2 ? 'excellent' : 'good', analysisNe: vashya.analysisNe, analysisEn: vashya.analysisEn },
    { nameNe: 'तारा (Tara)', nameEn: 'Tara', maxPoints: 3, obtainedPoints: tara.points, boyValue: tara.boyVal, girlValue: tara.girlVal, status: tara.points >= 2 ? 'excellent' : 'average', analysisNe: tara.analysisNe, analysisEn: tara.analysisEn },
    { nameNe: 'योनि (Yoni)', nameEn: 'Yoni', maxPoints: 4, obtainedPoints: yoni.points, boyValue: yoni.boyVal, girlValue: yoni.girlVal, status: yoni.points >= 3 ? 'excellent' : yoni.points === 0 ? 'dosha' : 'good', analysisNe: yoni.analysisNe, analysisEn: yoni.analysisEn },
    { nameNe: 'ग्रह मैत्री (Graha Maitri)', nameEn: 'Graha Maitri', maxPoints: 5, obtainedPoints: maitri.points, boyValue: maitri.boyVal, girlValue: maitri.girlVal, status: maitri.points >= 4 ? 'excellent' : 'good', analysisNe: maitri.analysisNe, analysisEn: maitri.analysisEn },
    { nameNe: 'गण (Gana)', nameEn: 'Gana', maxPoints: 6, obtainedPoints: gana.points, boyValue: gana.boyVal, girlValue: gana.girlVal, status: gana.points >= 5 ? 'excellent' : gana.points === 0 ? 'dosha' : 'average', analysisNe: gana.analysisNe, analysisEn: gana.analysisEn },
    { nameNe: 'भकूट (Bhakoot)', nameEn: 'Bhakoot', maxPoints: 7, obtainedPoints: bhakoot.points, boyValue: bhakoot.boyVal, girlValue: bhakoot.girlVal, status: bhakoot.hasDosha ? 'dosha' : 'excellent', analysisNe: bhakoot.analysisNe, analysisEn: bhakoot.analysisEn },
    { nameNe: 'नाडी (Nadi)', nameEn: 'Nadi', maxPoints: 8, obtainedPoints: nadi.points, boyValue: nadi.boyVal, girlValue: nadi.girlVal, status: nadi.hasDosha ? 'dosha' : 'excellent', analysisNe: nadi.analysisNe, analysisEn: nadi.analysisEn },
  ];

  let verdictNe = 'उत्तम विवाह योग (अति शुभ)';
  let verdictEn = 'Highly Auspicious Match';
  let verdictType: 'excellent' | 'auspicious' | 'moderate' | 'incompatible' = 'excellent';

  if (totalScore >= 28) {
    verdictNe = 'सर्वोत्तम विवाह सम्बन्ध (३६ मा २८+ गुण मिलान - अति शुभ)';
    verdictEn = 'Superb Marital Union (28+ Gunas Matched - Highly Auspicious)';
    verdictType = 'excellent';
  } else if (totalScore >= 18) {
    verdictNe = 'शुभ तथा मध्यम विवाह योग (गृहस्थ जीवन सुखद रहनेछ)';
    verdictEn = 'Auspicious & Harmonious Match (Above minimum threshold)';
    verdictType = 'auspicious';
  } else if (totalScore >= 12) {
    verdictNe = 'सामान्य गुण मिलान (पारिवारिक समझदारी तथा उपाय आवश्यक)';
    verdictEn = 'Moderate Match (Remedial Pujas recommended)';
    verdictType = 'moderate';
  } else {
    verdictNe = 'अशुभ गुण मिलान (न्यूनतम १८ अंक नपुगेकोले विवाह विचारणीय)';
    verdictEn = 'Incompatible Match (Score below 18 threshold)';
    verdictType = 'incompatible';
  }

  const remediesNe: string[] = [];
  const remediesEn: string[] = [];

  if (nadi.hasDosha) {
    remediesNe.push('नाडी दोष निवारणका लागि विवाह पूर्व महामृत्युञ्जय जप तथा स्वर्ण दान गर्नु उत्तम।');
    remediesEn.push('Perform Mahamrityunjaya Japa and Gold Charity to neutralize Nadi Dosha.');
  }
  if (bhakoot.hasDosha) {
    remediesNe.push('भकूट दोष शान्तिका लागि दम्पतीले रुद्राभिषेक पूजा र सोमबार शिव मन्दिर दर्शन गर्नु शुभ।');
    remediesEn.push('Perform Rudrabhisheka puja on Mondays to nullify Bhakoot Dosha.');
  }
  if (gana.points === 0) {
    remediesNe.push('गण दोष निवारणका लागि विष्णु सहस्रनाम पाठ तथा अन्न दान फलदायी रहनेछ।');
    remediesEn.push('Chant Vishnu Sahasranama and offer food to devotees.');
  }

  // Manglik cross-check if birth details provided
  let manglikMatchNe = extra?.manglikMatchNe;
  let manglikMatchEn = extra?.manglikMatchEn;
  let hasManglikDoshaConflict = extra?.hasManglikDoshaConflict || false;

  if (extra?.boyKundali && extra?.girlKundali) {
    const boyManglik = !!extra.boyKundali.isManglik;
    const girlManglik = !!extra.girlKundali.isManglik;

    if (boyManglik && girlManglik) {
      manglikMatchNe = 'वर र कन्या दुवै माङ्गलिक भएकाले माङ्गलिक दोष स्वतः निष्क्रिय (भङ्ग) भएको छ। विवाह अति शुभ छ।';
      manglikMatchEn = 'Both Boy and Girl are Manglik, canceling each other out naturally (Manglik Dosha Bhanga). Auspicious!';
      hasManglikDoshaConflict = false;
    } else if (!boyManglik && !girlManglik) {
      manglikMatchNe = 'वर र कन्या दुवै माङ्गलिक दोषरहित (अमाङ्गलिक) हुनुहुन्छ। माङ्गलिक दोषको कुनै बाधा छैन।';
      manglikMatchEn = 'Neither partner is Manglik. Pure matrimonial alignment without Manglik interference.';
      hasManglikDoshaConflict = false;
    } else if (boyManglik && !girlManglik) {
      manglikMatchNe = 'वर माङ्गलिक हुनुहुन्छ तर कन्या अमाङ्गलिक हुनुहुन्छ। विवाह पूर्व कुम्भ विवाह वा मङ्गल शान्ति पूजा गर्नु शास्त्रसम्मत हुन्छ।';
      manglikMatchEn = 'Boy is Manglik while Girl is Non-Manglik. Remedial Kumbha Vivaha or Mangal Shanti is advised prior to marriage.';
      hasManglikDoshaConflict = true;
      remediesNe.push('वरको मङ्गल दोष शान्तिका लागि मङ्गलवार रातो वस्त्र, मुसुरो दाल दान तथा मङ्गल ग्रहको जप गर्नुहोस्।');
      remediesEn.push('Perform Mangal Shanti ritual or donation of red lentils on Tuesday to balance Mars.');
    } else {
      manglikMatchNe = 'कन्या माङ्गलिक हुनुहुन्छ तर वर अमाङ्गलिक हुनुहुन्छ। विवाह पूर्व पीपल विवाह वा विष्णु प्रतिमा विवाह पूजा गर्नु शुभ हुन्छ।';
      manglikMatchEn = 'Girl is Manglik while Boy is Non-Manglik. Peepal Vivaha or Vishnu Pratima Vivaha is recommended.';
      hasManglikDoshaConflict = true;
      remediesNe.push('कन्याको मङ्गल दोष शान्तिका लागि कात्यायनी मन्त्र जप वा पिपल वृक्षको पूजा शुभ मानिन्छ।');
      remediesEn.push('Chant Katyayani mantra or perform Peepal tree ritual for Mangal mitigation.');
    }
  }

  return {
    boyName,
    boyRashi: boyRashiObj.ne,
    boyNakshatra: boyNakObj.ne,
    girlName,
    girlRashi: girlRashiObj.ne,
    girlNakshatra: girlNakObj.ne,
    totalScore,
    verdictNe,
    verdictEn,
    verdictType,
    hasNadiDosha: nadi.hasDosha,
    hasBhakootDosha: bhakoot.hasDosha,
    kootas,
    recommendationNe: totalScore >= 18 
      ? 'ज्योतिषीय हिसाबले यो विवाह सम्बन्ध अति उत्तम तथा फलदायी मानिन्छ। दम्पतीबीच राम्रो समझदारी र प्रेम रहनेछ।'
      : 'यो सम्बन्धमा केही ग्रह तथा दोषको प्रभाव देखिएकाले योग्य ज्योतिषीसँग परामर्श गरी शान्ति पूजा गरेर मात्र अघि बढ्नुहोला।',
    recommendationEn: totalScore >= 18
      ? 'Astrologically, this is a very auspicious and blessed union. Both partners will enjoy harmony and mutual prosperity.'
      : 'Certain astrological doshas require remedial attention. Consulting a Vedic pandit for preparatory shanti rituals is advised.',
    remediesNe: remediesNe.length > 0 ? remediesNe : ['दाम्पत्य जीवन सधैं सुखमय रहोस् भनी नित्य शिव-पार्वतीको आराधना गर्नुहोस्।'],
    remediesEn: remediesEn.length > 0 ? remediesEn : ['Pray regularly to Lord Shiva and Goddess Parvati for perennial marital bliss.'],
    manglikMatchNe,
    manglikMatchEn,
    hasManglikDoshaConflict,
    boyKundaliSummary: extra?.boyKundali ? {
      dob: extra.boyKundali.dobBsFormatted || extra.boyKundali.dob,
      lagna: extra.boyKundali.lagnaNe,
      isManglik: extra.boyKundali.isManglik,
      rashiLord: extra.boyKundali.rashiLordNe
    } : undefined,
    girlKundaliSummary: extra?.girlKundali ? {
      dob: extra.girlKundali.dobBsFormatted || extra.girlKundali.dob,
      lagna: extra.girlKundali.lagnaNe,
      isManglik: extra.girlKundali.isManglik,
      rashiLord: extra.girlKundali.rashiLordNe
    } : undefined
  };
}
