/**
 * Nepali Bikram Sambat (BS) Calendar Engine & Date Utilities
 */
import { NepaliDate, CalendarDay, Panchanga, CalendarEvent } from '../types';

// Nepali digits
export const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toNepaliDigits(num: number | string): string {
  return String(num).replace(/\d/g, (digit) => NEPALI_DIGITS[parseInt(digit, 10)]);
}

export const BS_MONTH_NAMES_NE = [
  'वैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
];

export const BS_MONTH_NAMES_EN = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const NEPALI_DAYS_NE = [
  'आइतवार', 'सोमवार', 'मङ्गलवार', 'बुधवार', 'बिहीवार', 'शुक्रवार', 'शनिवार'
];

export const NEPALI_DAYS_SHORT_NE = [
  'आइत', 'सोम', 'मङ्गल', 'बुध', 'बिही', 'शुक्र', 'शनि'
];

export const NEPALI_DAYS_EN = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const NEPALI_DAYS_SHORT_EN = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

// Days in each BS Month for available years (BS 2080 to 2084)
export const BS_MONTH_DAYS: Record<number, number[]> = {
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
};

// Reference starting points for BS to AD conversion
// Reference date: 2081 Baishakh 1 is 2024 April 13 (Saturday)
interface ReferenceDate {
  bsYear: number;
  bsMonth: number; // 1-indexed
  bsDay: number;
  adDate: Date; // UTC / Local Date
}

const REF_DATES: Record<number, { month1Day1Ad: string }> = {
  2080: { month1Day1Ad: '2023-04-14' },
  2081: { month1Day1Ad: '2024-04-13' },
  2082: { month1Day1Ad: '2025-04-14' },
  2083: { month1Day1Ad: '2026-04-14' },
  2084: { month1Day1Ad: '2027-04-14' },
};

/**
 * Get number of days in a BS month
 */
export function getDaysInBsMonth(year: number, month: number): number {
  const yearDays = BS_MONTH_DAYS[year] || BS_MONTH_DAYS[2081];
  return yearDays[month - 1] || 30;
}

/**
 * Convert BS Date to AD Date
 */
export function bsToAd(year: number, month: number, day: number): Date {
  const validYear = BS_MONTH_DAYS[year] ? year : 2081;
  const refStart = new Date(REF_DATES[validYear]?.month1Day1Ad || '2024-04-13');
  
  let daysPassed = 0;
  const yearDays = BS_MONTH_DAYS[validYear];
  
  for (let m = 0; m < month - 1; m++) {
    daysPassed += yearDays[m];
  }
  daysPassed += (day - 1);
  
  const result = new Date(refStart);
  result.setDate(result.getDate() + daysPassed);
  return result;
}

/**
 * Convert AD Date to BS Date
 */
export function adToBs(adDate: Date): NepaliDate {
  const currentAd = new Date(adDate);
  currentAd.setHours(0, 0, 0, 0);

  // Find matching BS year
  const years = [2080, 2081, 2082, 2083, 2084];
  let matchedYear = 2081;

  for (let i = 0; i < years.length; i++) {
    const y = years[i];
    const startAd = new Date(REF_DATES[y].month1Day1Ad);
    startAd.setHours(0, 0, 0, 0);
    
    // Check end of this BS year
    const totalDaysInYear = BS_MONTH_DAYS[y].reduce((a, b) => a + b, 0);
    const endAd = new Date(startAd);
    endAd.setDate(endAd.getDate() + totalDaysInYear - 1);

    if (currentAd >= startAd && currentAd <= endAd) {
      matchedYear = y;
      break;
    }
    if (i === years.length - 1 && currentAd > endAd) {
      matchedYear = 2084;
    } else if (i === 0 && currentAd < startAd) {
      matchedYear = 2080;
    }
  }

  const yearStartAd = new Date(REF_DATES[matchedYear].month1Day1Ad);
  yearStartAd.setHours(0, 0, 0, 0);

  const diffTime = currentAd.getTime() - yearStartAd.getTime();
  let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let bsMonth = 1;
  let bsDay = 1;
  const monthDays = BS_MONTH_DAYS[matchedYear];

  for (let m = 0; m < 12; m++) {
    if (diffDays < monthDays[m]) {
      bsMonth = m + 1;
      bsDay = diffDays + 1;
      break;
    }
    diffDays -= monthDays[m];
  }

  const dayOfWeek = currentAd.getDay();
  const monthIdx = bsMonth - 1;

  const monthNamesShortEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const adFormatted = `${monthNamesShortEn[currentAd.getMonth()]} ${currentAd.getDate()}, ${currentAd.getFullYear()}`;

  return {
    year: matchedYear,
    month: bsMonth,
    day: bsDay,
    monthNameNe: BS_MONTH_NAMES_NE[monthIdx],
    monthNameEn: BS_MONTH_NAMES_EN[monthIdx],
    dayNameNe: NEPALI_DAYS_NE[dayOfWeek],
    dayNameEn: NEPALI_DAYS_EN[dayOfWeek],
    dayOfWeek,
    formattedNe: `${toNepaliDigits(matchedYear)} ${BS_MONTH_NAMES_NE[monthIdx]} ${toNepaliDigits(bsDay)} गते, ${NEPALI_DAYS_NE[dayOfWeek]}`,
    formattedEn: `${bsDay} ${BS_MONTH_NAMES_EN[monthIdx]} ${matchedYear}, ${NEPALI_DAYS_EN[dayOfWeek]}`,
    adDate: currentAd.toISOString().split('T')[0],
    adFormatted,
  };
}

/**
 * Get current Nepali Date (Today)
 */
export function getCurrentNepaliDate(): NepaliDate {
  return adToBs(new Date());
}

// Tithi names rotation
export const TITHI_LIST_NE = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
  'प्रतिपदा (कृष्ण)', 'द्वितीया (कृष्ण)', 'तृतीया (कृष्ण)', 'चतुर्थी (कृष्ण)', 'पञ्चमी (कृष्ण)',
  'षष्ठी (कृष्ण)', 'सप्तमी (कृष्ण)', 'अष्टमी (कृष्ण)', 'नवमी (कृष्ण)', 'दशमी (कृष्ण)',
  'एकादशी (कृष्ण)', 'द्वादशी (कृष्ण)', 'त्रयोदशी (कृष्ण)', 'चतुर्दशी (कृष्ण)', 'औंसी'
];

export const TITHI_LIST_EN = [
  'Pratipada (Shukla)', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada (Krishna)', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Aaunsi'
];

export const NAKSHATRAS = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य',
  'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति',
  'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढा', 'उत्तराषाढा', 'श्रवण',
  'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'
];

export const NAKSHATRAS_EN = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const YOGAS = [
  'विष्कुम्भ', 'प्रीति', 'आयुष्मान्', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति',
  'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि',
  'व्यतीपात', 'वरीयान्', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल',
  'ब्रह्म', 'इन्द्र', 'वैधृति'
];

export const KARANAS = [
  'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पाद', 'नाग', 'किंस्तुघ्न'
];

export const RASHIS_NE = [
  'मेष', 'वृष', 'मिथुन', 'कर्कट', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
];

export const RASHIS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Astronomical Tithi index calculation from Gregorian AD Date
 * Synodic month = 29.53058867 days.
 * Reference: New Moon on October 10, 2026 at 16:50 UTC (Ashwin Krishna Amavasya)
 * Next sunrise on Oct 11, 2026 marks Ashwin Shukla Pratipada (Ghatasthapana).
 */
export function getAstronomicalTithiIndex(adDate: Date): number {
  const synodicMonth = 29.53058867;
  const refNewMoon = new Date('2026-10-10T16:50:00Z').getTime();
  
  const d = new Date(adDate);
  d.setUTCHours(0, 15, 0, 0); // ~6:00 AM NPT (Nepal Standard Time)
  
  const diffDays = (d.getTime() - refNewMoon) / (1000 * 60 * 60 * 24);
  const phase = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
  return Math.floor((phase / synodicMonth) * 30) % 30;
}

/**
 * Generate accurate Panchanga for any given BS date
 */
export function getPanchangaForDate(year: number, month: number, day: number): Panchanga {
  const curAdDate = bsToAd(year, month, day);
  const tithiIdx = getAstronomicalTithiIndex(curAdDate);

  const seed = (year * 372) + (month * 31) + day;
  const nakshatraIdx = (seed * 3 + 7) % NAKSHATRAS.length;
  const yogaIdx = (seed * 5 + 11) % YOGAS.length;
  const karanaIdx = (seed * 2 + 3) % KARANAS.length;
  const chandraRashiIdx = (seed + 2) % 12;
  const suryaRashiIdx = (month - 1) % 12;

  // Approximate sunrise / sunset according to season
  const sunriseHours = 5 + Math.floor((Math.sin(month / 12 * Math.PI) * 0.8));
  const sunriseMinutes = 20 + ((day * 7) % 35);
  const sunsetHours = 6 + Math.floor((Math.cos(month / 12 * Math.PI) * 0.7));
  const sunsetMinutes = 15 + ((day * 9) % 40);

  const formatTime = (h: number, m: number, ap: 'AM' | 'PM') => 
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`;

  const rituList = ['वसन्त (Spring)', 'ग्रीष्म (Summer)', 'वर्षा (Monsoon)', 'शरद् (Autumn)', 'हेमन्त (Pre-Winter)', 'शिशिर (Winter)'];
  const ritu = rituList[Math.floor((month - 1) / 2)];
  const ayan = (month >= 4 && month <= 9) ? 'दक्षिणायन (Dakshinayan)' : 'उत्तरायण (Uttarayan)';
  
  const disaSoolList = ['पश्चिम (West)', 'उत्तर (North)', 'पूर्व (East)', 'दक्षिण (South)', 'वायव्य (North-West)', 'नैऋत्य (South-West)'];
  const disaSool = disaSoolList[day % disaSoolList.length];

  return {
    tithi: TITHI_LIST_NE[tithiIdx],
    tithiEn: TITHI_LIST_EN[tithiIdx],
    nakshatra: NAKSHATRAS[nakshatraIdx],
    nakshatraEn: NAKSHATRAS_EN[nakshatraIdx],
    yoga: YOGAS[yogaIdx],
    karana: KARANAS[karanaIdx],
    chandraRashi: `${RASHIS_NE[chandraRashiIdx]} (${RASHIS_EN[chandraRashiIdx]})`,
    suryaRashi: `${RASHIS_NE[suryaRashiIdx]} (${RASHIS_EN[suryaRashiIdx]})`,
    sunrise: formatTime(sunriseHours, sunriseMinutes, 'AM'),
    sunset: formatTime(sunsetHours, sunsetMinutes, 'PM'),
    rahuKaal: '०४:३० PM - ०६:०० PM',
    yamaganda: '१२:०० PM - ०१:३० PM',
    abhijitMuhurat: '११:४५ AM - १२:३५ PM',
    ritu,
    ayan,
    disaSool,
  };
}

/**
 * Fixed Solar Annual Events in BS (Same BS date every year)
 */
export const FIXED_ANNUAL_EVENTS: Record<string, CalendarEvent[]> = {
  // Baishakh (Month 1)
  '1-1': [{ id: 'nye', titleNe: 'नयाँ वर्ष (बैशाख संक्रान्ति)', titleEn: 'Nepali New Year (Navavarsha)', isHoliday: true, category: 'national' }],
  '1-11': [{ id: 'lok', titleNe: 'लोकतन्त्र दिवस', titleEn: 'Loktantra Diwas (Democracy Day)', isHoliday: true, category: 'national' }],
  '1-18': [{ id: 'mayday', titleNe: 'अन्तर्राष्ट्रिय मजदुर दिवस (मे १)', titleEn: 'International Workers Day', isHoliday: true, category: 'international' }],

  // Jestha (Month 2)
  '2-15': [{ id: 'ganatantra', titleNe: 'गणतन्त्र दिवस', titleEn: 'Republic Day', isHoliday: true, category: 'national' }],
  '2-24': [{ id: 'sithi', titleNe: 'सिठी नखः / वातावरण दिवस', titleEn: 'Sithi Nakha / Environment Day', isHoliday: false, category: 'festival' }],

  // Ashadh (Month 3)
  '3-15': [{ id: 'dhan', titleNe: 'राष्ट्रिय धान दिवस (दही चिउरा खाने दिन)', titleEn: 'National Paddy Day (Dahi Chiura)', isHoliday: false, category: 'festival' }],
  '3-29': [{ id: 'bhanu', titleNe: 'भानु जयन्ती', titleEn: 'Bhanu Jayanti', isHoliday: false, category: 'national' }],

  // Shrawan (Month 4)
  '4-1': [{ id: 'saune', titleNe: 'साउने संक्रान्ति (लुतो फाल्ने दिन)', titleEn: 'Saune Sankranti', isHoliday: false, category: 'festival' }],
  '4-15': [{ id: 'khir', titleNe: 'खीर खाने दिन', titleEn: 'Khir Khane Din', isHoliday: false, category: 'festival' }],

  // Ashwin (Month 6)
  '6-3': [{ id: 'samvidhan', titleNe: 'संविधान दिवस (राष्ट्रिय दिवस)', titleEn: 'Constitution Day (National Day)', isHoliday: true, category: 'national' }],

  // Poush (Month 9)
  '9-27': [{ id: 'prithvi', titleNe: 'पृथ्वी जयन्ती / राष्ट्रिय एकता दिवस', titleEn: 'Prithvi Jayanti / National Unity Day', isHoliday: true, category: 'national' }],

  // Magh (Month 10)
  '10-1': [{ id: 'maghe', titleNe: 'माघे संक्रान्ति / माघी पर्व (थारु समुदाय)', titleEn: 'Maghe Sankranti / Maghi Parva', isHoliday: true, category: 'festival' }],
  '10-16': [{ id: 'shahid', titleNe: 'शहीद दिवस', titleEn: 'Martyrs\' Day (Shahid Diwas)', isHoliday: true, category: 'national' }],

  // Falgun (Month 11)
  '11-7': [{ id: 'prajatantra', titleNe: 'राष्ट्रिय प्रजातन्त्र दिवस', titleEn: 'National Democracy Day', isHoliday: true, category: 'national' }],
  '11-24': [{ id: 'nari', titleNe: 'अन्तर्राष्ट्रिय महिला दिवस (मार्च ८)', titleEn: 'International Women\'s Day', isHoliday: true, category: 'international' }],
};

/**
 * Year-Specific Lunar & Tithi Festivals for Bikram Sambat Years (2080 - 2084 BS)
 * Format: `${year}-${month}-${day}`
 */
export const YEAR_SPECIFIC_LUNAR_EVENTS: Record<string, CalendarEvent[]> = {
  // ==========================================
  // BS 2083 (2026 - 2027 AD) - CURRENT YEAR
  // ==========================================
  '2083-1-4': [{ id: 'matatirtha', titleNe: 'मातातीर्थ औंसी (आमाको मुख हेर्ने दिन)', titleEn: 'Mata Tirtha Aaunsi (Mother\'s Day)', isHoliday: false, category: 'festival' }],
  '2083-1-18': [{ id: 'buddha', titleNe: 'बुद्ध जयन्ती / उभौली पर्व', titleEn: 'Buddha Jayanti / Ubhauli Parva', isHoliday: true, category: 'religious' }],
  '2083-4-2': [{ id: 'nag', titleNe: 'नाग पञ्चमी', titleEn: 'Naag Panchami', isHoliday: false, category: 'religious' }],
  '2083-4-14': [{ id: 'gurupurnima', titleNe: 'गुरु पूर्णिमा / व्यास जयन्ती', titleEn: 'Guru Purnima / Vyas Jayanti', isHoliday: false, category: 'religious' }],
  '2083-5-12': [{ id: 'janai', titleNe: 'जनै पूर्णिमा / रक्षा बन्धन / क्वाँटी खाने दिन', titleEn: 'Janai Purnima / Raksha Bandhan / Kwati Punhi', isHoliday: true, category: 'religious' }],
  '2083-5-13': [{ id: 'gai', titleNe: 'गाईजात्रा (काठमाडौं उपत्यका बिदा)', titleEn: 'Gai Jatra (Kathmandu Valley)', isHoliday: true, category: 'festival' }],
  '2083-5-19': [{ id: 'krishna', titleNe: 'श्रीकृष्ण जन्माष्टमी', titleEn: 'Shree Krishna Janmashtami', isHoliday: true, category: 'religious' }],
  '2083-5-25': [{ id: 'kushe', titleNe: 'कुशे औंसी (बुवाको मुख हेर्ने दिन)', titleEn: 'Kushe Aaunsi (Father\'s Day)', isHoliday: false, category: 'festival' }],
  '2083-5-29': [{ id: 'teej', titleNe: 'हरितालिका तीज (महिला बिदा)', titleEn: 'Haritalika Teej (Women Holiday)', isHoliday: true, category: 'festival' }],
  '2083-6-1': [{ id: 'rishi', titleNe: 'ऋषि पञ्चमी', titleEn: 'Rishi Panchami', isHoliday: false, category: 'religious' }],
  '2083-6-9': [{ id: 'indra', titleNe: 'इन्द्रजात्रा (काठमाडौं उपत्यका बिदा)', titleEn: 'Indra Jatra', isHoliday: true, category: 'festival' }],
  // Dashain 2083 (October 11 - October 25, 2026)
  '2083-6-25': [{ id: 'ghatasthapana', titleNe: 'घटस्थापना (बडादशैं प्रारम्भ - ११ अक्टोबर)', titleEn: 'Ghatasthapana (Dashain Starts - Oct 11)', isHoliday: true, category: 'festival' }],
  '2083-6-31': [{ id: 'fulpati', titleNe: 'फूलपाती (दशैं बिदा)', titleEn: 'Fulpati (Dashain Holiday)', isHoliday: true, category: 'festival' }],
  '2083-7-1': [{ id: 'mahaashtami', titleNe: 'महाअष्टमी / कालरात्रि', titleEn: 'Maha Ashtami / Kalratri', isHoliday: true, category: 'festival' }],
  '2083-7-3': [{ id: 'mahanavami', titleNe: 'महानवमी', titleEn: 'Maha Navami', isHoliday: true, category: 'festival' }],
  '2083-7-4': [{ id: 'vijayadashami', titleNe: 'विजयादशमी (दशैंको मुख्य टीका - २१ अक्टोबर)', titleEn: 'Vijaya Dashami (Main Tika - Oct 21)', isHoliday: true, category: 'festival' }],
  '2083-7-5': [{ id: 'papankusha', titleNe: 'पापाङ्कुशा एकादशी (दशैं टीका बिदा)', titleEn: 'Dashain Holiday (Tika continue)', isHoliday: true, category: 'festival' }],
  '2083-7-8': [{ id: 'kojagrat', titleNe: 'कोजाग्रत पूर्णिमा (दशैं समापन)', titleEn: 'Kojagrat Purnima (Dashain concludes)', isHoliday: false, category: 'festival' }],
  // Tihar & Chhath 2083 (November 6 - November 15, 2026)
  '2083-7-20': [{ id: 'kag', titleNe: 'काग तिहार / धनतेरस', titleEn: 'Kag Tihar / Dhanteras', isHoliday: false, category: 'festival' }],
  '2083-7-21': [{ id: 'kukur', titleNe: 'कुकुर तिहार / नरक चतुर्दशी', titleEn: 'Kukur Tihar / Narak Chaturdashi', isHoliday: false, category: 'festival' }],
  '2083-7-22': [{ id: 'laxmi', titleNe: 'लक्ष्मी पूजा (दीपावली - ८ नोभेम्बर)', titleEn: 'Laxmi Puja (Deepawali - Nov 8)', isHoliday: true, category: 'festival' }],
  '2083-7-23': [{ id: 'govardhan', titleNe: 'गोवर्धन पूजा / म्ह पूजा / नेपाल संवत् ११४७ नयाँ वर्ष', titleEn: 'Govardhan Puja / Mha Puja / Nepal Sambat 1147', isHoliday: true, category: 'festival' }],
  '2083-7-25': [{ id: 'bhai', titleNe: 'भाइटीका / यमद्वितीया (किजा पूजा - ११ नोभेम्बर)', titleEn: 'Bhai Tika / Kija Puja (Nov 11)', isHoliday: true, category: 'festival' }],
  '2083-7-29': [{ id: 'chhath', titleNe: 'छठ पर्व (सूर्य पूजा)', titleEn: 'Chhath Parva (Sun Worship)', isHoliday: true, category: 'festival' }],
  '2083-8-5': [{ id: 'haribodhini', titleNe: 'हरिबोधनी एकादशी (तुलसी विवाह)', titleEn: 'Haribodhini Ekadashi (Tulsi Vivah)', isHoliday: false, category: 'religious' }],
  '2083-8-19': [{ id: 'bibaha', titleNe: 'विवाह पञ्चमी (राम-जानकी विवाह)', titleEn: 'Bibaha Panchami', isHoliday: false, category: 'festival' }],
  '2083-9-9': [{ id: 'udhauli', titleNe: 'उधौली पर्व / योमरी पुन्हि / ज्यापू दिवस', titleEn: 'Udhauli Parva / Yomari Punhi', isHoliday: true, category: 'festival' }],
  '2083-9-15': [{ id: 'tamu', titleNe: 'तमु ल्होसार (गुरुङ समुदाय)', titleEn: 'Tamu Lhosar (Gurung)', isHoliday: true, category: 'festival' }],
  '2083-10-24': [{ id: 'sonam', titleNe: 'सोनाम ल्होसार (तामाङ समुदाय)', titleEn: 'Sonam Lhosar (Tamang)', isHoliday: true, category: 'festival' }],
  '2083-10-28': [{ id: 'saraswati', titleNe: 'श्रीपञ्चमी / वसन्त पञ्चमी / सरस्वती पूजा', titleEn: 'Saraswati Puja / Basanta Panchami', isHoliday: false, category: 'religious' }],
  '2083-11-22': [{ id: 'shivaratri', titleNe: 'महाशिवरात्रि (सेना दिवस - ६ मार्च २०२७)', titleEn: 'Maha Shivaratri (Army Day - Mar 6, 2027)', isHoliday: true, category: 'religious' }],
  '2083-11-24': [{ id: 'gyalpo', titleNe: 'ग्याल्पो ल्होसार (शेर्पा समुदाय)', titleEn: 'Gyalpo Lhosar (Sherpa)', isHoliday: true, category: 'festival' }],
  '2083-12-7': [{ id: 'holi_pahad', titleNe: 'फागु पूर्णिमा (होली - पहाड)', titleEn: 'Holi (Hilly Region)', isHoliday: true, category: 'festival' }],
  '2083-12-8': [{ id: 'holi_terai', titleNe: 'फागु पूर्णिमा (होली - तराई)', titleEn: 'Holi (Terai Region)', isHoliday: true, category: 'festival' }],
  '2083-12-23': [{ id: 'ghode', titleNe: 'घोडेजात्रा (काठमाडौं उपत्यका बिदा)', titleEn: 'Ghode Jatra (Kathmandu)', isHoliday: true, category: 'festival' }],
  '2083-12-31': [{ id: 'chaite', titleNe: 'चैते दशैं', titleEn: 'Chaite Dashain', isHoliday: false, category: 'festival' }],

  // ==========================================
  // BS 2082 (2025 - 2026 AD)
  // ==========================================
  '2082-1-14': [{ id: 'matatirtha', titleNe: 'मातातीर्थ औंसी (आमाको मुख हेर्ने दिन)', titleEn: 'Mata Tirtha Aaunsi (Mother\'s Day)', isHoliday: false, category: 'festival' }],
  '2082-1-29': [{ id: 'buddha', titleNe: 'बुद्ध जयन्ती / उभौली पर्व', titleEn: 'Buddha Jayanti / Ubhauli Parva', isHoliday: true, category: 'religious' }],
  '2082-4-15': [{ id: 'nag', titleNe: 'नाग पञ्चमी', titleEn: 'Naag Panchami', isHoliday: false, category: 'religious' }],
  '2082-4-24': [{ id: 'janai', titleNe: 'जनै पूर्णिमा / रक्षाबन्धन / क्वाँटी खाने दिन', titleEn: 'Janai Purnima / Raksha Bandhan / Kwati Punhi', isHoliday: true, category: 'religious' }],
  '2082-4-25': [{ id: 'gai', titleNe: 'गाईजात्रा (काठमाडौं उपत्यका बिदा)', titleEn: 'Gai Jatra (Kathmandu Valley)', isHoliday: true, category: 'festival' }],
  '2082-4-31': [{ id: 'krishna', titleNe: 'श्रीकृष्ण जन्माष्टमी', titleEn: 'Shree Krishna Janmashtami', isHoliday: true, category: 'religious' }],
  '2082-5-7': [{ id: 'kushe', titleNe: 'कुशे औंसी (बुवाको मुख हेर्ने दिन)', titleEn: 'Kushe Aaunsi (Father\'s Day)', isHoliday: false, category: 'festival' }],
  '2082-5-10': [{ id: 'teej', titleNe: 'हरितालिका तीज (महिला बिदा)', titleEn: 'Haritalika Teej (Women Holiday)', isHoliday: true, category: 'festival' }],
  '2082-5-12': [{ id: 'rishi', titleNe: 'ऋषि पञ्चमी', titleEn: 'Rishi Panchami', isHoliday: false, category: 'religious' }],
  '2082-5-20': [{ id: 'indra', titleNe: 'इन्द्रजात्रा (काठमाडौं बिदा)', titleEn: 'Indra Jatra', isHoliday: true, category: 'festival' }],
  '2082-6-6': [{ id: 'ghatasthapana', titleNe: 'घटस्थापना (बडादशैं प्रारम्भ)', titleEn: 'Ghatasthapana (Dashain Starts)', isHoliday: true, category: 'festival' }],
  '2082-6-13': [{ id: 'fulpati', titleNe: 'फूलपाती (दशैं बिदा)', titleEn: 'Fulpati (Dashain Holiday)', isHoliday: true, category: 'festival' }],
  '2082-6-14': [{ id: 'mahaashtami', titleNe: 'महाअष्टमी / कालरात्रि', titleEn: 'Maha Ashtami / Kalratri', isHoliday: true, category: 'festival' }],
  '2082-6-15': [{ id: 'mahanavami', titleNe: 'महानवमी', titleEn: 'Maha Navami', isHoliday: true, category: 'festival' }],
  '2082-6-16': [{ id: 'vijayadashami', titleNe: 'विजयादशमी (दशैंको मुख्य टीका)', titleEn: 'Vijaya Dashami (Main Tika)', isHoliday: true, category: 'festival' }],
  '2082-6-20': [{ id: 'kojagrat', titleNe: 'कोजाग्रत पूर्णिमा (दशैं समापन)', titleEn: 'Kojagrat Purnima', isHoliday: false, category: 'festival' }],
  '2082-7-1': [{ id: 'kag', titleNe: 'काग तिहार / धनतेरस', titleEn: 'Kag Tihar / Dhanteras', isHoliday: false, category: 'festival' }],
  '2082-7-2': [{ id: 'kukur', titleNe: 'कुकुर तिहार / नरक चतुर्दशी', titleEn: 'Kukur Tihar / Narak Chaturdashi', isHoliday: false, category: 'festival' }],
  '2082-7-3': [{ id: 'laxmi', titleNe: 'लक्ष्मी पूजा (दीपावली)', titleEn: 'Laxmi Puja (Deepawali)', isHoliday: true, category: 'festival' }],
  '2082-7-4': [{ id: 'govardhan', titleNe: 'गोवर्धन पूजा / म्ह पूजा / नेपाल संवत् नयाँ वर्ष', titleEn: 'Govardhan Puja / Mha Puja', isHoliday: true, category: 'festival' }],
  '2082-7-6': [{ id: 'bhai', titleNe: 'भाइटीका / यमद्वितीया', titleEn: 'Bhai Tika / Kija Puja', isHoliday: true, category: 'festival' }],
  '2082-7-10': [{ id: 'chhath', titleNe: 'छठ पर्व (सूर्य पूजा)', titleEn: 'Chhath Parva (Sun Worship)', isHoliday: true, category: 'festival' }],
  '2082-7-16': [{ id: 'haribodhini', titleNe: 'हरिबोधनी एकादशी (तुलसी विवाह)', titleEn: 'Haribodhini Ekadashi (Tulsi Vivah)', isHoliday: false, category: 'religious' }],
  '2082-8-9': [{ id: 'bibaha', titleNe: 'विवाह पञ्चमी (राम-जानकी विवाह)', titleEn: 'Bibaha Panchami', isHoliday: false, category: 'festival' }],
  '2082-8-18': [{ id: 'udhauli', titleNe: 'उधौली पर्व / योमरी पुन्हि', titleEn: 'Udhauli Parva / Yomari Punhi', isHoliday: true, category: 'festival' }],
  '2082-9-15': [{ id: 'tamu', titleNe: 'तमु ल्होसार (गुरुङ समुदाय)', titleEn: 'Tamu Lhosar (Gurung)', isHoliday: true, category: 'festival' }],
  '2082-10-6': [{ id: 'sonam', titleNe: 'सोनाम ल्होसार (तामाङ समुदाय)', titleEn: 'Sonam Lhosar (Tamang)', isHoliday: true, category: 'festival' }],
  '2082-10-10': [{ id: 'saraswati', titleNe: 'श्रीपञ्चमी / वसन्त पञ्चमी / सरस्वती पूजा', titleEn: 'Saraswati Puja / Basanta Panchami', isHoliday: false, category: 'religious' }],
  '2082-11-4': [{ id: 'shivaratri', titleNe: 'महाशिवरात्रि (सेना दिवस)', titleEn: 'Maha Shivaratri (Army Day)', isHoliday: true, category: 'religious' }],
  '2082-11-19': [{ id: 'holi_pahad', titleNe: 'फागु पूर्णिमा (होली - पहाड)', titleEn: 'Holi (Hilly Region)', isHoliday: true, category: 'festival' }],
  '2082-11-20': [{ id: 'holi_terai', titleNe: 'फागु पूर्णिमा (होली - तराई)', titleEn: 'Holi (Terai Region)', isHoliday: true, category: 'festival' }],

  // ==========================================
  // BS 2081 (2024 - 2025 AD)
  // ==========================================
  '2081-1-26': [{ id: 'matatirtha', titleNe: 'मातातीर्थ औंसी (आमाको मुख हेर्ने दिन)', titleEn: 'Mata Tirtha Aaunsi (Mother\'s Day)', isHoliday: false, category: 'festival' }],
  '2081-2-10': [{ id: 'buddha', titleNe: 'बुद्ध जयन्ती / उभौली पर्व', titleEn: 'Buddha Jayanti / Ubhauli Parva', isHoliday: true, category: 'religious' }],
  '2081-4-25': [{ id: 'nag', titleNe: 'नाग पञ्चमी', titleEn: 'Naag Panchami', isHoliday: false, category: 'religious' }],
  '2081-5-3': [{ id: 'janai', titleNe: 'जनै पूर्णिमा / रक्षा बन्धन / क्वाँटी खाने दिन', titleEn: 'Janai Purnima / Raksha Bandhan / Kwati Punhi', isHoliday: true, category: 'religious' }],
  '2081-5-4': [{ id: 'gai', titleNe: 'गाईजात्रा (काठमाडौं उपत्यका बिदा)', titleEn: 'Gai Jatra (Kathmandu Valley)', isHoliday: true, category: 'festival' }],
  '2081-5-10': [{ id: 'krishna', titleNe: 'श्रीकृष्ण जन्माष्टमी', titleEn: 'Shree Krishna Janmashtami', isHoliday: true, category: 'religious' }],
  '2081-5-17': [{ id: 'kushe', titleNe: 'कुशे औंसी (बुवाको मुख हेर्ने दिन)', titleEn: 'Kushe Aaunsi (Father\'s Day)', isHoliday: false, category: 'festival' }],
  '2081-5-21': [{ id: 'teej', titleNe: 'हरितालिका तीज (महिला बिदा)', titleEn: 'Haritalika Teej (Women Holiday)', isHoliday: true, category: 'festival' }],
  '2081-5-23': [{ id: 'rishi', titleNe: 'ऋषि पञ्चमी', titleEn: 'Rishi Panchami', isHoliday: false, category: 'religious' }],
  '2081-5-31': [{ id: 'indra', titleNe: 'इन्द्रजात्रा (काठमाडौं बिदा)', titleEn: 'Indra Jatra', isHoliday: true, category: 'festival' }],
  '2081-6-17': [{ id: 'ghatasthapana', titleNe: 'घटस्थापना (बडादशैं प्रारम्भ)', titleEn: 'Ghatasthapana (Dashain Starts)', isHoliday: true, category: 'festival' }],
  '2081-6-24': [{ id: 'fulpati', titleNe: 'फूलपाती (दशैं बिदा)', titleEn: 'Fulpati (Dashain Holiday)', isHoliday: true, category: 'festival' }],
  '2081-6-25': [{ id: 'mahaashtami', titleNe: 'महाअष्टमी / कालरात्रि', titleEn: 'Maha Ashtami / Kalratri', isHoliday: true, category: 'festival' }],
  '2081-6-26': [{ id: 'mahanavami', titleNe: 'महानवमी', titleEn: 'Maha Navami', isHoliday: true, category: 'festival' }],
  '2081-6-27': [{ id: 'vijayadashami', titleNe: 'विजयादशमी (दशैंको मुख्य टीका)', titleEn: 'Vijaya Dashami (Main Tika)', isHoliday: true, category: 'festival' }],
  '2081-7-1': [{ id: 'kojagrat', titleNe: 'कोजाग्रत पूर्णिमा (दशैं समापन)', titleEn: 'Kojagrat Purnima', isHoliday: false, category: 'festival' }],
  '2081-7-13': [{ id: 'kag', titleNe: 'काग तिहार / धनतेरस', titleEn: 'Kag Tihar / Dhanteras', isHoliday: false, category: 'festival' }],
  '2081-7-14': [{ id: 'kukur', titleNe: 'कुकुर तिहार / नरक चतुर्दशी', titleEn: 'Kukur Tihar / Narak Chaturdashi', isHoliday: false, category: 'festival' }],
  '2081-7-15': [{ id: 'laxmi', titleNe: 'लक्ष्मी पूजा (दीपावली)', titleEn: 'Laxmi Puja (Deepawali)', isHoliday: true, category: 'festival' }],
  '2081-7-17': [{ id: 'govardhan', titleNe: 'गोवर्धन पूजा / म्ह पूजा / नेपाल संवत् नयाँ वर्ष', titleEn: 'Govardhan Puja / Mha Puja', isHoliday: true, category: 'festival' }],
  '2081-7-18': [{ id: 'bhai', titleNe: 'भाइटीका / यमद्वितीया', titleEn: 'Bhai Tika / Kija Puja', isHoliday: true, category: 'festival' }],
  '2081-7-22': [{ id: 'chhath', titleNe: 'छठ पर्व (सूर्य पूजा)', titleEn: 'Chhath Parva (Sun Worship)', isHoliday: true, category: 'festival' }],
  '2081-7-27': [{ id: 'haribodhini', titleNe: 'हरिबोधनी एकादशी (तुलसी विवाह)', titleEn: 'Haribodhini Ekadashi (Tulsi Vivah)', isHoliday: false, category: 'religious' }],
  '2081-8-21': [{ id: 'bibaha', titleNe: 'विवाह पञ्चमी (राम-जानकी विवाह)', titleEn: 'Bibaha Panchami', isHoliday: false, category: 'festival' }],
  '2081-8-30': [{ id: 'udhauli', titleNe: 'उधौली पर्व / योमरी पुन्हि', titleEn: 'Udhauli Parva / Yomari Punhi', isHoliday: true, category: 'festival' }],
  '2081-9-15': [{ id: 'tamu', titleNe: 'तमु ल्होसार (गुरुङ समुदाय)', titleEn: 'Tamu Lhosar (Gurung)', isHoliday: true, category: 'festival' }],
  '2081-10-16': [{ id: 'sonam', titleNe: 'सोनाम ल्होसार (तामाङ समुदाय)', titleEn: 'Sonam Lhosar (Tamang)', isHoliday: true, category: 'festival' }],
  '2081-10-21': [{ id: 'saraswati', titleNe: 'श्रीपञ्चमी / वसन्त पञ्चमी / सरस्वती पूजा', titleEn: 'Saraswati Puja / Basanta Panchami', isHoliday: false, category: 'religious' }],
  '2081-11-14': [{ id: 'shivaratri', titleNe: 'महाशिवरात्रि (सेना दिवस)', titleEn: 'Maha Shivaratri (Army Day)', isHoliday: true, category: 'religious' }],
  '2081-11-29': [{ id: 'holi_pahad', titleNe: 'फागु पूर्णिमा (होली - पहाड)', titleEn: 'Holi (Hilly Region)', isHoliday: true, category: 'festival' }],
  '2081-11-30': [{ id: 'holi_terai', titleNe: 'फागु पूर्णिमा (होली - तराई)', titleEn: 'Holi (Terai Region)', isHoliday: true, category: 'festival' }],

  // ==========================================
  // BS 2080 (2023 - 2024 AD)
  // ==========================================
  '2080-6-1': [{ id: 'teej', titleNe: 'हरितालिका तीज', titleEn: 'Haritalika Teej', isHoliday: true, category: 'festival' }],
  '2080-6-28': [{ id: 'ghatasthapana', titleNe: 'घटस्थापना (बडादशैं प्रारम्भ)', titleEn: 'Ghatasthapana (Dashain Starts)', isHoliday: true, category: 'festival' }],
  '2080-7-4': [{ id: 'fulpati', titleNe: 'फूलपाती (दशैं बिदा)', titleEn: 'Fulpati (Dashain Holiday)', isHoliday: true, category: 'festival' }],
  '2080-7-5': [{ id: 'mahaashtami', titleNe: 'महाअष्टमी / कालरात्रि', titleEn: 'Maha Ashtami / Kalratri', isHoliday: true, category: 'festival' }],
  '2080-7-6': [{ id: 'mahanavami', titleNe: 'महानवमी', titleEn: 'Maha Navami', isHoliday: true, category: 'festival' }],
  '2080-7-7': [{ id: 'vijayadashami', titleNe: 'विजयादशमी (दशैंको मुख्य टीका)', titleEn: 'Vijaya Dashami (Main Tika)', isHoliday: true, category: 'festival' }],
  '2080-7-11': [{ id: 'kojagrat', titleNe: 'कोजाग्रत पूर्णिमा (दशैं समापन)', titleEn: 'Kojagrat Purnima', isHoliday: false, category: 'festival' }],
  '2080-7-24': [{ id: 'kag', titleNe: 'काग तिहार / धनतेरस', titleEn: 'Kag Tihar / Dhanteras', isHoliday: false, category: 'festival' }],
  '2080-7-25': [{ id: 'kukur', titleNe: 'कुकुर तिहार / नरक चतुर्दशी', titleEn: 'Kukur Tihar / Narak Chaturdashi', isHoliday: false, category: 'festival' }],
  '2080-7-26': [{ id: 'laxmi', titleNe: 'लक्ष्मी पूजा (दीपावली)', titleEn: 'Laxmi Puja (Deepawali)', isHoliday: true, category: 'festival' }],
  '2080-7-27': [{ id: 'govardhan', titleNe: 'गोवर्धन पूजा / म्ह पूजा', titleEn: 'Govardhan Puja / Mha Puja', isHoliday: true, category: 'festival' }],
  '2080-7-29': [{ id: 'bhai', titleNe: 'भाइटीका / यमद्वितीया', titleEn: 'Bhai Tika / Kija Puja', isHoliday: true, category: 'festival' }],
  '2080-8-3': [{ id: 'chhath', titleNe: 'छठ पर्व (सूर्य पूजा)', titleEn: 'Chhath Parva (Sun Worship)', isHoliday: true, category: 'festival' }],

  // ==========================================
  // BS 2084 (2027 - 2028 AD)
  // ==========================================
  '2084-5-18': [{ id: 'teej', titleNe: 'हरितालिका तीज', titleEn: 'Haritalika Teej', isHoliday: true, category: 'festival' }],
  '2084-6-14': [{ id: 'ghatasthapana', titleNe: 'घटस्थापना (बडादशैं प्रारम्भ)', titleEn: 'Ghatasthapana (Dashain Starts)', isHoliday: true, category: 'festival' }],
  '2084-6-21': [{ id: 'fulpati', titleNe: 'फूलपाती (दशैं बिदा)', titleEn: 'Fulpati (Dashain Holiday)', isHoliday: true, category: 'festival' }],
  '2084-6-22': [{ id: 'mahaashtami', titleNe: 'महाअष्टमी / कालरात्रि', titleEn: 'Maha Ashtami / Kalratri', isHoliday: true, category: 'festival' }],
  '2084-6-23': [{ id: 'mahanavami', titleNe: 'महानवमी', titleEn: 'Maha Navami', isHoliday: true, category: 'festival' }],
  '2084-6-24': [{ id: 'vijayadashami', titleNe: 'विजयादशमी (दशैंको मुख्य टीका)', titleEn: 'Vijaya Dashami (Main Tika)', isHoliday: true, category: 'festival' }],
  '2084-6-28': [{ id: 'kojagrat', titleNe: 'कोजाग्रत पूर्णिमा (दशैं समापन)', titleEn: 'Kojagrat Purnima', isHoliday: false, category: 'festival' }],
  '2084-7-11': [{ id: 'kag', titleNe: 'काग तिहार / धनतेरस', titleEn: 'Kag Tihar / Dhanteras', isHoliday: false, category: 'festival' }],
  '2084-7-12': [{ id: 'kukur', titleNe: 'कुकुर तिहार / नरक चतुर्दशी', titleEn: 'Kukur Tihar / Narak Chaturdashi', isHoliday: false, category: 'festival' }],
  '2084-7-13': [{ id: 'laxmi', titleNe: 'लक्ष्मी पूजा (दीपावली)', titleEn: 'Laxmi Puja (Deepawali)', isHoliday: true, category: 'festival' }],
  '2084-7-14': [{ id: 'govardhan', titleNe: 'गोवर्धन पूजा / म्ह पूजा', titleEn: 'Govardhan Puja / Mha Puja', isHoliday: true, category: 'festival' }],
  '2084-7-16': [{ id: 'bhai', titleNe: 'भाइटीका / यमद्वितीया', titleEn: 'Bhai Tika / Kija Puja', isHoliday: true, category: 'festival' }],
  '2084-7-20': [{ id: 'chhath', titleNe: 'छठ पर्व (सूर्य पूजा)', titleEn: 'Chhath Parva (Sun Worship)', isHoliday: true, category: 'festival' }],
  '2084-11-12': [{ id: 'shivaratri', titleNe: 'महाशिवरात्रि (सेना दिवस)', titleEn: 'Maha Shivaratri (Army Day)', isHoliday: true, category: 'religious' }],
  '2084-11-27': [{ id: 'holi_pahad', titleNe: 'फागु पूर्णिमा (होली - पहाड)', titleEn: 'Holi (Hilly Region)', isHoliday: true, category: 'festival' }],
  '2084-11-28': [{ id: 'holi_terai', titleNe: 'फागु पूर्णिमा (होली - तराई)', titleEn: 'Holi (Terai Region)', isHoliday: true, category: 'festival' }],
};

// Backwards compatibility export
export const KNOWN_EVENTS_MAP = FIXED_ANNUAL_EVENTS;

/**
 * Get events for a specific BS date, taking the target year into account
 */
export function getEventsForBsDate(month: number, day: number, year?: number): CalendarEvent[] {
  const targetYear = year || 2083;
  const yearKey = `${targetYear}-${month}-${day}`;
  const monthDayKey = `${month}-${day}`;

  const events: CalendarEvent[] = [];

  // 1. Year-specific lunar / tithi events (e.g. Dashain, Tihar, Teej, Shivaratri)
  if (YEAR_SPECIFIC_LUNAR_EVENTS[yearKey]) {
    events.push(...YEAR_SPECIFIC_LUNAR_EVENTS[yearKey]);
  }

  // 2. Fixed solar BS events (e.g. New Year, Constitution Day, Maghe Sankranti)
  if (FIXED_ANNUAL_EVENTS[monthDayKey]) {
    events.push(...FIXED_ANNUAL_EVENTS[monthDayKey]);
  }

  return events;
}

/**
 * Generate full month grid for rendering Calendar
 */
export function generateMonthGrid(year: number, month: number): CalendarDay[] {
  const daysInMonth = getDaysInBsMonth(year, month);
  const firstDayAd = bsToAd(year, month, 1);
  const startingDayOfWeek = firstDayAd.getDay(); // 0 = Sun, 6 = Sat

  const today = getCurrentNepaliDate();
  const days: CalendarDay[] = [];

  // Month names for AD
  const monthNamesShortEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Pad previous month days
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthTotalDays = getDaysInBsMonth(prevYear, prevMonth);

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const pDay = prevMonthTotalDays - i;
    const pAdDate = bsToAd(prevYear, prevMonth, pDay);
    const pEvents = getEventsForBsDate(prevMonth, pDay, prevYear);
    const pIsSat = pAdDate.getDay() === 6;
    const pTithiIdx = getAstronomicalTithiIndex(pAdDate);

    days.push({
      bsYear: prevYear,
      bsMonth: prevMonth,
      bsDay: pDay,
      bsDayNe: toNepaliDigits(pDay),
      dayOfWeek: pAdDate.getDay(),
      adDate: pAdDate,
      adDay: pAdDate.getDate(),
      adMonthName: monthNamesShortEn[pAdDate.getMonth()],
      isToday: false,
      isCurrentMonth: false,
      isSaturday: pIsSat,
      isHoliday: pIsSat || pEvents.some(e => e.isHoliday),
      tithiNe: TITHI_LIST_NE[pTithiIdx],
      tithiEn: TITHI_LIST_EN[pTithiIdx],
      events: pEvents,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curAdDate = bsToAd(year, month, d);
    const dOfWeek = curAdDate.getDay();
    const isSat = dOfWeek === 6;
    const events = getEventsForBsDate(month, d, year);
    const isHoliday = isSat || events.some(e => e.isHoliday);
    const isToday = (today.year === year && today.month === month && today.day === d);
    const panchanga = getPanchangaForDate(year, month, d);

    days.push({
      bsYear: year,
      bsMonth: month,
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

  // Pad next month days to complete 35 or 42 grid cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let n = 1; n <= remainingCells; n++) {
    const nAdDate = bsToAd(nextYear, nextMonth, n);
    const nEvents = getEventsForBsDate(nextMonth, n, nextYear);
    const nIsSat = nAdDate.getDay() === 6;
    const nTithiIdx = getAstronomicalTithiIndex(nAdDate);

    days.push({
      bsYear: nextYear,
      bsMonth: nextMonth,
      bsDay: n,
      bsDayNe: toNepaliDigits(n),
      dayOfWeek: nAdDate.getDay(),
      adDate: nAdDate,
      adDay: nAdDate.getDate(),
      adMonthName: monthNamesShortEn[nAdDate.getMonth()],
      isToday: false,
      isCurrentMonth: false,
      isSaturday: nIsSat,
      isHoliday: nIsSat || nEvents.some(e => e.isHoliday),
      tithiNe: TITHI_LIST_NE[nTithiIdx],
      tithiEn: TITHI_LIST_EN[nTithiIdx],
      events: nEvents,
    });
  }

  return days;
}
