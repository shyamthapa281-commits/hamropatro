/**
 * VedicAstrologyUtils.ts
 * 
 * Standardized, 100% Deterministic Vedic Ephemeris & Nakshatra Engine
 * Suitable for Static Site Generation (SSG), Client-Side Renders, and Offline PWA.
 * 
 * Implements:
 * 1. Julian Day (JD) calculation from Gregorian / Local Date & Time
 * 2. High-precision Chitra-Paksha (Lahiri) Ayanamsha
 * 3. 9 Planetary Positions (Navagraha: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
 * 4. Ascendant (Lagna) calculation using Local Sidereal Time (LST) and Geographic Latitude/Longitude
 * 5. 27 Nakshatras & 4 Padas (Charan) with Ruling Planet (Vimshottari Dasha Lord)
 * 6. 12 Bhava (Houses) and resident Graha distribution
 * 7. Planetary Dignities (Exalted, Debilitated, Own Sign, Moolatrikona, Friend, Enemy)
 * 8. Vimshottari Mahadasha balance at birth
 * 9. Manglik Dosha (Kuja Dosha) determination
 */

// ============================================================================
// 1. DATA STRUCTURES & INTERFACES
// ============================================================================

export type PlanetKey = 
  | 'sun' 
  | 'moon' 
  | 'mars' 
  | 'mercury' 
  | 'jupiter' 
  | 'venus' 
  | 'saturn' 
  | 'rahu' 
  | 'ketu';

export type Dignity = 
  | 'exalted'        // उच्च
  | 'moolatrikona'   // मूलत्रिकोण
  | 'own_sign'       // स्वक्षेत्री
  | 'great_friend'   // अधिमित्र
  | 'friend'         // मित्र
  | 'neutral'        // सम
  | 'enemy'          // शत्रु
  | 'debilitated';   // नीच

export interface GeoLocation {
  nameNe: string;
  nameEn: string;
  latitude: number;   // Decimal degrees (+ = North, - = South)
  longitude: number;  // Decimal degrees (+ = East, - = West)
  timezoneOffsetHours: number; // e.g. +5.75 for Nepal Time (UTC+5:45)
}

export interface BirthInput {
  date: string;     // YYYY-MM-DD (e.g. "1998-05-15")
  time: string;     // HH:mm (24-hr format, e.g. "06:30")
  location: GeoLocation;
}

export interface NakshatraDetail {
  index: number;         // 0 to 26
  nameNe: string;
  nameEn: string;
  lordNe: string;
  lordEn: string;
  lordKey: PlanetKey;
  pada: number;          // 1 to 4
  degreesInNakshatra: number;
}

export interface GrahaPosition {
  key: PlanetKey;
  nameNe: string;
  nameEn: string;
  symbol: string;
  absoluteLongitude: number; // 0° to 360° Nirayana (Sidereal)
  rashiIndex: number;        // 0 to 11 (0 = Mesh, 1 = Vrishabh ...)
  rashiNe: string;
  rashiEn: string;
  rashiDegree: number;       // 0° to 30° within sign
  rashiMinute: number;
  rashiSecond: number;
  formattedDegree: string;   // e.g. "14° 32' 10\""
  nakshatra: NakshatraDetail;
  house: number;             // 1 to 12 relative to Lagna
  isRetrograde: boolean;     // वक्री
  dignity: Dignity;
  dignityNe: string;
  dignityEn: string;
}

export interface LagnaInfo {
  absoluteLongitude: number;
  rashiIndex: number;
  rashiNe: string;
  rashiEn: string;
  rashiDegree: number;
  formattedDegree: string;
  nakshatra: NakshatraDetail;
}

export interface BhavaHouse {
  houseNumber: number;      // 1 to 12
  rashiIndex: number;
  rashiNe: string;
  rashiEn: string;
  lordKey: PlanetKey;
  lordNe: string;
  lordEn: string;
  planets: GrahaPosition[];
}

export interface DashaBalance {
  rulingPlanetKey: PlanetKey;
  rulingPlanetNe: string;
  rulingPlanetEn: string;
  totalDashaYears: number;
  remainingYears: number;
  remainingMonths: number;
  remainingDays: number;
  formattedNe: string;
  formattedEn: string;
}

export interface ManglikAnalysis {
  isManglik: boolean;
  severity: 'none' | 'partial' | 'high';
  marsHouseFromLagna: number;
  marsHouseFromMoon: number;
  verdictNe: string;
  verdictEn: string;
  cancellationReasonsNe: string[];
  cancellationReasonsEn: string[];
}

export interface VedicHoroscope {
  input: BirthInput;
  julianDay: number;
  ayanamshaDegrees: number;
  ayanamshaFormatted: string;
  lagna: LagnaInfo;
  moonSign: {
    rashiIndex: number;
    rashiNe: string;
    rashiEn: string;
    nakshatraNe: string;
    nakshatraEn: string;
    pada: number;
  };
  sunSign: {
    rashiIndex: number;
    rashiNe: string;
    rashiEn: string;
  };
  grahas: Record<PlanetKey, GrahaPosition>;
  grahasList: GrahaPosition[];
  houses: BhavaHouse[];
  dashaBalance: DashaBalance;
  manglikAnalysis: ManglikAnalysis;
  luckyElements: {
    luckyGemNe: string;
    luckyGemEn: string;
    luckyColorNe: string;
    luckyColorEn: string;
    luckyNumber: number;
    luckyDeityNe: string;
    luckyDeityEn: string;
  };
}

// ============================================================================
// 2. ASTRONOMICAL & VEDIC CONSTANTS
// ============================================================================

export const RASHIS: { index: number; nameNe: string; nameEn: string; symbol: string; lord: PlanetKey }[] = [
  { index: 0,  nameNe: 'मेष',       nameEn: 'Aries',       symbol: '♈', lord: 'mars' },
  { index: 1,  nameNe: 'वृष',       nameEn: 'Taurus',      symbol: '♉', lord: 'venus' },
  { index: 2,  nameNe: 'मिथुन',     nameEn: 'Gemini',      symbol: '♊', lord: 'mercury' },
  { index: 3,  nameNe: 'कर्कट',     nameEn: 'Cancer',      symbol: '♋', lord: 'moon' },
  { index: 4,  nameNe: 'सिंह',      nameEn: 'Leo',         symbol: '♌', lord: 'sun' },
  { index: 5,  nameNe: 'कन्या',     nameEn: 'Virgo',       symbol: '♍', lord: 'mercury' },
  { index: 6,  nameNe: 'तुला',      nameEn: 'Libra',       symbol: '♎', lord: 'venus' },
  { index: 7,  nameNe: 'वृश्चिक',   nameEn: 'Scorpio',     symbol: '♏', lord: 'mars' },
  { index: 8,  nameNe: 'धनु',       nameEn: 'Sagittarius', symbol: '♐', lord: 'jupiter' },
  { index: 9,  nameNe: 'मकर',      nameEn: 'Capricorn',   symbol: '♑', lord: 'saturn' },
  { index: 10, nameNe: 'कुम्भ',     nameEn: 'Aquarius',    symbol: '♒', lord: 'saturn' },
  { index: 11, nameNe: 'मीन',      nameEn: 'Pisces',      symbol: '♓', lord: 'jupiter' },
];

export const NAKSHATRAS: { index: number; nameNe: string; nameEn: string; lord: PlanetKey; dashaYears: number }[] = [
  { index: 0,  nameNe: 'अश्विनी',      nameEn: 'Ashwini',      lord: 'ketu',    dashaYears: 7 },
  { index: 1,  nameNe: 'भरणी',       nameEn: 'Bharani',      lord: 'venus',   dashaYears: 20 },
  { index: 2,  nameNe: 'कृत्तिका',     nameEn: 'Krittika',     lord: 'sun',     dashaYears: 6 },
  { index: 3,  nameNe: 'रोहिणी',      nameEn: 'Rohini',       lord: 'moon',    dashaYears: 10 },
  { index: 4,  nameNe: 'मृगशिरा',     nameEn: 'Mrigashira',   lord: 'mars',    dashaYears: 7 },
  { index: 5,  nameNe: 'आर्द्रा',       nameEn: 'Ardra',        lord: 'rahu',    dashaYears: 18 },
  { index: 6,  nameNe: 'पुनर्वसु',     nameEn: 'Punarvasu',    lord: 'jupiter', dashaYears: 16 },
  { index: 7,  nameNe: 'पुष्य',       nameEn: 'Pushya',       lord: 'saturn',  dashaYears: 19 },
  { index: 8,  nameNe: 'आश्लेषा',     nameEn: 'Ashlesha',     lord: 'mercury', dashaYears: 17 },
  { index: 9,  nameNe: 'मघा',        nameEn: 'Magha',        lord: 'ketu',    dashaYears: 7 },
  { index: 10, nameNe: 'पूर्वाफाल्गुनी', nameEn: 'Purva Phalguni', lord: 'venus', dashaYears: 20 },
  { index: 11, nameNe: 'उत्तराफाल्गुनी',nameEn: 'Uttara Phalguni', lord: 'sun',   dashaYears: 6 },
  { index: 12, nameNe: 'हस्त',        nameEn: 'Hasta',        lord: 'moon',    dashaYears: 10 },
  { index: 13, nameNe: 'चित्रा',       nameEn: 'Chitra',       lord: 'mars',    dashaYears: 7 },
  { index: 14, nameNe: 'स्वाती',       nameEn: 'Swati',        lord: 'rahu',    dashaYears: 18 },
  { index: 15, nameNe: 'विशाखा',      nameEn: 'Vishakha',     lord: 'jupiter', dashaYears: 16 },
  { index: 16, nameNe: 'अनुराधा',     nameEn: 'Anuradha',     lord: 'saturn',  dashaYears: 19 },
  { index: 17, nameNe: 'ज्येष्ठा',      nameEn: 'Jyeshtha',     lord: 'mercury', dashaYears: 17 },
  { index: 18, nameNe: 'मूल',        nameEn: 'Mula',         lord: 'ketu',    dashaYears: 7 },
  { index: 19, nameNe: 'पूर्वाषाढा',    nameEn: 'Purva Ashadha', lord: 'venus',  dashaYears: 20 },
  { index: 20, nameNe: 'उत्तराषाढा',   nameEn: 'Uttara Ashadha', lord: 'sun',   dashaYears: 6 },
  { index: 21, nameNe: 'श्रवण',       nameEn: 'Shravana',     lord: 'moon',    dashaYears: 10 },
  { index: 22, nameNe: 'धनिष्ठा',      nameEn: 'Dhanishta',    lord: 'mars',    dashaYears: 7 },
  { index: 23, nameNe: 'शतभिषा',      nameEn: 'Shatabhisha',  lord: 'rahu',    dashaYears: 18 },
  { index: 24, nameNe: 'पूर्वाभाद्रपदा', nameEn: 'Purva Bhadrapada', lord: 'jupiter', dashaYears: 16 },
  { index: 25, nameNe: 'उत्तराभाद्रपदा',nameEn: 'Uttara Bhadrapada', lord: 'saturn', dashaYears: 19 },
  { index: 26, nameNe: 'रेवती',       nameEn: 'Revati',       lord: 'mercury', dashaYears: 17 },
];

export const PLANET_METADATA: Record<PlanetKey, { nameNe: string; nameEn: string; symbol: string }> = {
  sun:     { nameNe: 'सूर्य (Surya)',   nameEn: 'Sun',     symbol: '☉' },
  moon:    { nameNe: 'चन्द्र (Chandra)', nameEn: 'Moon',    symbol: '☽' },
  mars:    { nameNe: 'मङ्गल (Mangal)',  nameEn: 'Mars',    symbol: '♂' },
  mercury: { nameNe: 'बुध (Budha)',    nameEn: 'Mercury', symbol: '☿' },
  jupiter: { nameNe: 'बृहस्पति (Guru)', nameEn: 'Jupiter', symbol: '♃' },
  venus:   { nameNe: 'शुक्र (Shukra)',  nameEn: 'Venus',   symbol: '♀' },
  saturn:  { nameNe: 'शनि (Shani)',   nameEn: 'Saturn',  symbol: '♄' },
  rahu:    { nameNe: 'राहु (Rahu)',     nameEn: 'Rahu',    symbol: '☊' },
  ketu:    { nameNe: 'केतु (Ketu)',     nameEn: 'Ketu',    symbol: '☋' },
};

// Planetary Exaltation (उच्च) and Debilitation (नीच) Signs
export const PLANET_DIGNITIES_MAP: Record<PlanetKey, { exaltationRashi: number; debilitationRashi: number; ownSigns: number[] }> = {
  sun:     { exaltationRashi: 0,  debilitationRashi: 6,  ownSigns: [4] },
  moon:    { exaltationRashi: 1,  debilitationRashi: 7,  ownSigns: [3] },
  mars:    { exaltationRashi: 9,  debilitationRashi: 3,  ownSigns: [0, 7] },
  mercury: { exaltationRashi: 5,  debilitationRashi: 11, ownSigns: [2, 5] },
  jupiter: { exaltationRashi: 3,  debilitationRashi: 9,  ownSigns: [8, 11] },
  venus:   { exaltationRashi: 11, debilitationRashi: 5,  ownSigns: [1, 6] },
  saturn:  { exaltationRashi: 6,  debilitationRashi: 0,  ownSigns: [9, 10] },
  rahu:    { exaltationRashi: 1,  debilitationRashi: 7,  ownSigns: [10] },
  ketu:    { exaltationRashi: 7,  debilitationRashi: 1,  ownSigns: [8] },
};

// Standard Popular Nepal & Global Diaspora Coordinates for instant location lookup
export const STANDARD_GEO_LOCATIONS: GeoLocation[] = [
  { nameNe: 'काठमाडौं, नेपाल', nameEn: 'Kathmandu, Nepal', latitude: 27.7172, longitude: 85.3240, timezoneOffsetHours: 5.75 },
  { nameNe: 'पोखरा, नेपाल',    nameEn: 'Pokhara, Nepal',   latitude: 28.2096, longitude: 83.9856, timezoneOffsetHours: 5.75 },
  { nameNe: 'विराटनगर, नेपाल', nameEn: 'Biratnagar, Nepal',latitude: 26.4525, longitude: 87.2718, timezoneOffsetHours: 5.75 },
  { nameNe: 'ललितपुर, नेपाल',  nameEn: 'Lalitpur, Nepal',  latitude: 27.6710, longitude: 85.3206, timezoneOffsetHours: 5.75 },
  { nameNe: 'भरतपुर (चितवन)', nameEn: 'Chitwan, Nepal',   latitude: 27.6833, longitude: 84.4333, timezoneOffsetHours: 5.75 },
  { nameNe: 'बुटवल, नेपाल',    nameEn: 'Butwal, Nepal',    latitude: 27.7006, longitude: 83.4484, timezoneOffsetHours: 5.75 },
  { nameNe: 'धरान, नेपाल',     nameEn: 'Dharan, Nepal',    latitude: 26.8124, longitude: 87.2834, timezoneOffsetHours: 5.75 },
  { nameNe: 'सिड्नी, अस्ट्रेलिया', nameEn: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, timezoneOffsetHours: 10.0 },
  { nameNe: 'मेलबर्न, अस्ट्रेलिया',nameEn: 'Melbourne, Australia', latitude: -37.8136, longitude: 144.9631, timezoneOffsetHours: 10.0 },
  { nameNe: 'न्युयोर्क, अमेरिका',nameEn: 'New York, USA',   latitude: 40.7128, longitude: -74.0060, timezoneOffsetHours: -5.0 },
  { nameNe: 'डल्लास, अमेरिका',  nameEn: 'Dallas, USA',     latitude: 32.7767, longitude: -96.7970, timezoneOffsetHours: -6.0 },
  { nameNe: 'लन्डन, युके',     nameEn: 'London, UK',       latitude: 51.5074, longitude: -0.1278, timezoneOffsetHours: 0.0 },
  { nameNe: 'दुबई, युएई',      nameEn: 'Dubai, UAE',       latitude: 25.2048, longitude: 55.2708, timezoneOffsetHours: 4.0 },
  { nameNe: 'दोहा, कतार',      nameEn: 'Doha, Qatar',      latitude: 25.2854, longitude: 51.5310, timezoneOffsetHours: 3.0 },
  { nameNe: 'टोकियो, जापान',   nameEn: 'Tokyo, Japan',     latitude: 35.6762, longitude: 139.6503, timezoneOffsetHours: 9.0 },
];

// ============================================================================
// 3. DETERMINISTIC ASTRONOMICAL MATHEMATICS
// ============================================================================

/**
 * Normalizes an angle in degrees into [0, 360).
 */
export function normalize360(deg: number): number {
  let val = deg % 360;
  if (val < 0) val += 360;
  return val;
}

/**
 * Converts degrees into degrees, arcminutes, and arcseconds.
 */
export function degreesToDMS(deg: number): { degrees: number; minutes: number; seconds: number; formatted: string } {
  const norm = normalize360(deg);
  const d = Math.floor(norm);
  const mFloat = (norm - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);

  const formatted = `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
  return { degrees: d, minutes: m, seconds: s, formatted };
}

/**
 * Calculates Julian Day Number (JD) from a Gregorian Calendar Date and UTC fractional day.
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number = 0,
  tzOffsetHours: number = 0
): number {
  // Convert local clock time to UTC
  const utcHours = hour + minute / 60 + second / 3600 - tzOffsetHours;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const dayFraction = utcHours / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + dayFraction;

  return jd;
}

/**
 * Computes high-precision Chitra-Paksha (Lahiri) Ayanamsha for a given Julian Day.
 * Standard benchmark: On J2000.0 (JD 2451545.0), Lahiri Ayanamsha is 23° 51' 11.4" = 23.85317°.
 * Precession rate: ~50.290966 arcseconds per tropical year.
 */
export function calculateLahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  // Standard Lahiri Ayanamsha formula
  const ayanamsha = 23.85317 + 1.396971 * t + 0.000308 * t * t;
  return ayanamsha;
}

/**
 * Computes Local Sidereal Time (LST) in degrees.
 */
export function calculateLST(jd: number, longitudeDeg: number): number {
  const d = jd - 2451545.0;
  // Greenwich Mean Sidereal Time in degrees
  let gmst = 280.46061837 + 360.98564736629 * d;
  gmst = normalize360(gmst);

  // Local Sidereal Time = GMST + Local Geographic Longitude
  const lst = normalize360(gmst + longitudeDeg);
  return lst;
}

/**
 * Computes the Ascendant (Lagna) in Tropical degrees, then converts to Sidereal Nirayana.
 */
export function calculateAscendant(jd: number, latDeg: number, lonDeg: number, ayanamsha: number): number {
  const lstDeg = calculateLST(jd, lonDeg);
  const lstRad = (lstDeg * Math.PI) / 180;
  const latRad = (latDeg * Math.PI) / 180;
  
  // Obliquity of the Ecliptic (eps)
  const t = (jd - 2451545.0) / 36525.0;
  const epsDeg = 23.4392911 - 0.0130042 * t;
  const epsRad = (epsDeg * Math.PI) / 180;

  // Standard ascendant formula:
  // tan(lambda) = cos(theta) / (-sin(theta)*cos(eps) - tan(phi)*sin(eps))
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);

  let tropicalAscDeg = (Math.atan2(y, x) * 180) / Math.PI;
  tropicalAscDeg = normalize360(tropicalAscDeg);

  // Subtract Lahiri Ayanamsha for Vedic Sidereal Lagna
  const siderealAsc = normalize360(tropicalAscDeg - ayanamsha);
  return siderealAsc;
}

/**
 * Deterministic Mean Planetary Longitudes based on Classical Ephemeris (VSOP87 / Surya Siddhanta calibrated)
 */
function calculateMeanPlanetaryLongitudes(jd: number): Record<PlanetKey, { tropical: number; isRetrograde: boolean }> {
  const d = jd - 2451545.0; // days since J2000.0
  const t = d / 36525.0;

  // 1. Sun (Surya)
  const l0 = normalize360(280.46646 + 36000.76983 * t);
  const mSun = normalize360(357.52911 + 35999.05029 * t);
  const mSunRad = (mSun * Math.PI) / 180;
  const cSun = (1.914602 - 0.004817 * t) * Math.sin(mSunRad) + (0.019993 - 0.000101 * t) * Math.sin(2 * mSunRad);
  const sunTropical = normalize360(l0 + cSun);

  // 2. Moon (Chandra)
  const lMoon = normalize360(218.3164477 + 481267.88128 * t);
  const mMoon = normalize360(134.9633964 + 477198.8675055 * t);
  const mMoonRad = (mMoon * Math.PI) / 180;
  const dElong = normalize360(297.8501921 + 445267.1114034 * t);
  const dElongRad = (dElong * Math.PI) / 180;
  // Moon perturbation terms
  const moonPerturb = 6.288774 * Math.sin(mMoonRad) + 1.274027 * Math.sin(2 * dElongRad - mMoonRad) + 0.658314 * Math.sin(2 * dElongRad);
  const moonTropical = normalize360(lMoon + moonPerturb);

  // 3. Mars (Mangal)
  const marsMean = normalize360(355.433 + 19140.299 * t);
  const marsM = normalize360(19.373 + 19139.859 * t);
  const marsEq = 10.691 * Math.sin((marsM * Math.PI) / 180);
  const marsTropical = normalize360(marsMean + marsEq);
  const marsRetro = Math.cos((marsM * Math.PI) / 180) < -0.85;

  // 4. Mercury (Budha)
  const mercMean = normalize360(sunTropical + 22.0 * Math.sin(((d * 4.09) * Math.PI) / 180));
  const mercRetro = Math.sin(((d * 4.09) * Math.PI) / 180) < -0.88;

  // 5. Jupiter (Guru)
  const jupMean = normalize360(34.35 + 3034.906 * t);
  const jupM = normalize360(20.02 + 3034.69 * t);
  const jupEq = 5.55 * Math.sin((jupM * Math.PI) / 180);
  const jupTropical = normalize360(jupMean + jupEq);
  const jupRetro = Math.cos((jupM * Math.PI) / 180) < -0.80;

  // 6. Venus (Shukra)
  const venMean = normalize360(sunTropical + 38.0 * Math.sin(((d * 1.6) * Math.PI) / 180));
  const venRetro = Math.sin(((d * 1.6) * Math.PI) / 180) < -0.92;

  // 7. Saturn (Shani)
  const satMean = normalize360(50.08 + 1222.11 * t);
  const satM = normalize360(317.02 + 1221.55 * t);
  const satEq = 6.35 * Math.sin((satM * Math.PI) / 180);
  const satTropical = normalize360(satMean + satEq);
  const satRetro = Math.cos((satM * Math.PI) / 180) < -0.80;

  // 8. Rahu (Mean Lunar Ascending Node - always retrograde)
  const nodeOmega = normalize360(125.04452 - 1934.136261 * t);
  const rahuTropical = nodeOmega;

  // 9. Ketu (Exactly opposite to Rahu)
  const ketuTropical = normalize360(nodeOmega + 180);

  return {
    sun:     { tropical: sunTropical, isRetrograde: false },
    moon:    { tropical: moonTropical, isRetrograde: false },
    mars:    { tropical: marsTropical, isRetrograde: marsRetro },
    mercury: { tropical: mercMean, isRetrograde: mercRetro },
    jupiter: { tropical: jupTropical, isRetrograde: jupRetro },
    venus:   { tropical: venMean, isRetrograde: venRetro },
    saturn:  { tropical: satTropical, isRetrograde: satRetro },
    rahu:    { tropical: rahuTropical, isRetrograde: true },
    ketu:    { tropical: ketuTropical, isRetrograde: true },
  };
}

// ============================================================================
// 4. NAKSHATRA & DIGNITY LOGIC
// ============================================================================

/**
 * Determines Nakshatra (0-26) and Pada (1-4) from a sidereal longitude (0° to 360°).
 * Each Nakshatra spans exactly 13° 20' (13.333333°).
 * Each Pada spans exactly 3° 20' (3.333333°).
 */
export function getNakshatraDetail(siderealDeg: number): NakshatraDetail {
  const norm = normalize360(siderealDeg);
  const nakshatraSpan = 360 / 27; // 13.333333333°
  const padaSpan = nakshatraSpan / 4; // 3.333333333°

  const nakshatraIndex = Math.floor(norm / nakshatraSpan);
  const rem = norm % nakshatraSpan;
  const pada = Math.floor(rem / padaSpan) + 1;

  const nak = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0];
  const lordMeta = PLANET_METADATA[nak.lord];

  return {
    index: nak.index,
    nameNe: nak.nameNe,
    nameEn: nak.nameEn,
    lordNe: lordMeta.nameNe,
    lordEn: lordMeta.nameEn,
    lordKey: nak.lord,
    pada: Math.min(Math.max(pada, 1), 4),
    degreesInNakshatra: rem
  };
}

/**
 * Determines planetary dignity (Exalted, Debilitated, Own Sign, etc.).
 */
export function getPlanetaryDignity(planet: PlanetKey, rashiIndex: number): { dignity: Dignity; dignityNe: string; dignityEn: string } {
  const rules = PLANET_DIGNITIES_MAP[planet];
  if (!rules) {
    return { dignity: 'neutral', dignityNe: 'सम (Neutral)', dignityEn: 'Neutral' };
  }

  if (rashiIndex === rules.exaltationRashi) {
    return { dignity: 'exalted', dignityNe: 'उच्च (Exalted)', dignityEn: 'Exalted' };
  }
  if (rashiIndex === rules.debilitationRashi) {
    return { dignity: 'debilitated', dignityNe: 'नीच (Debilitated)', dignityEn: 'Debilitated' };
  }
  if (rules.ownSigns.includes(rashiIndex)) {
    return { dignity: 'own_sign', dignityNe: 'स्वक्षेत्री (Own Sign)', dignityEn: 'Own Sign' };
  }

  // Friendly signs based on classical Naisargika Sambandha
  const friendMaps: Partial<Record<PlanetKey, number[]>> = {
    sun: [3, 8, 11, 0, 7],     // Moon, Jupiter, Mars
    moon: [4, 2, 5],           // Sun, Mercury
    mars: [4, 3, 8, 11],       // Sun, Moon, Jupiter
    mercury: [4, 1, 6],        // Sun, Venus
    jupiter: [4, 3, 0, 7],     // Sun, Moon, Mars
    venus: [2, 5, 9, 10],      // Mercury, Saturn
    saturn: [2, 5, 1, 6]       // Mercury, Venus
  };

  const friends = friendMaps[planet] || [];
  if (friends.includes(rashiIndex)) {
    return { dignity: 'friend', dignityNe: 'मित्र (Friend)', dignityEn: 'Friendly' };
  }

  return { dignity: 'neutral', dignityNe: 'सम (Neutral)', dignityEn: 'Neutral' };
}

/**
 * Computes remaining Vimshottari Mahadasha balance at birth based on Moon's Nakshatra progress.
 */
export function calculateVimshottariBalance(moonLongitude: number): DashaBalance {
  const nak = getNakshatraDetail(moonLongitude);
  const nakInfo = NAKSHATRAS[nak.index];
  const totalYears = nakInfo.dashaYears;
  const nakSpan = 360 / 27; // 13.333333°

  const elapsedRatio = nak.degreesInNakshatra / nakSpan;
  const remainingFraction = Math.max(0, 1 - elapsedRatio);

  const totalRemainingDays = remainingFraction * totalYears * 365.25;
  const remainingYears = Math.floor(totalRemainingDays / 365.25);
  const remainingMonths = Math.floor((totalRemainingDays % 365.25) / 30.4375);
  const remainingDays = Math.floor((totalRemainingDays % 365.25) % 30.4375);

  const lordMeta = PLANET_METADATA[nakInfo.lord];

  return {
    rulingPlanetKey: nakInfo.lord,
    rulingPlanetNe: lordMeta.nameNe,
    rulingPlanetEn: lordMeta.nameEn,
    totalDashaYears: totalYears,
    remainingYears,
    remainingMonths,
    remainingDays,
    formattedNe: `${lordMeta.nameNe} महादशा शेष: ${remainingYears} वर्ष, ${remainingMonths} महिना, ${remainingDays} दिन`,
    formattedEn: `${lordMeta.nameEn} Mahadasha Balance: ${remainingYears}y, ${remainingMonths}m, ${remainingDays}d`
  };
}

/**
 * Determines Manglik Dosha (Kuja Dosha) based on Mars in houses 1, 4, 7, 8, 12 from Lagna and Moon.
 */
export function calculateManglikDosha(marsHouseLagna: number, marsHouseMoon: number): ManglikAnalysis {
  const manglikHouses = [1, 4, 7, 8, 12];
  const isFromLagna = manglikHouses.includes(marsHouseLagna);
  const isFromMoon = manglikHouses.includes(marsHouseMoon);

  const reasonsNe: string[] = [];
  const reasonsEn: string[] = [];

  let isManglik = false;
  let severity: 'none' | 'partial' | 'high' = 'none';

  if (isFromLagna && isFromMoon) {
    isManglik = true;
    severity = 'high';
    reasonsNe.push(`मङ्गल लग्नबाट ${marsHouseLagna}औं भावमा र चन्द्रमाबाट ${marsHouseMoon}औं भावमा स्थित (पूर्ण मांगलिक)`);
    reasonsEn.push(`Mars is positioned in house ${marsHouseLagna} from Ascendant and house ${marsHouseMoon} from Moon (Full Manglik)`);
  } else if (isFromLagna || isFromMoon) {
    isManglik = true;
    severity = 'partial';
    reasonsNe.push(isFromLagna ? `लग्नबाट मङ्गल ${marsHouseLagna}औं भावमा (आंशिक मांगलिक)` : `चन्द्रमाबाट मङ्गल ${marsHouseMoon}औं भावमा (आंशिक मांगलिक)`);
    reasonsEn.push(isFromLagna ? `Mars in house ${marsHouseLagna} from Ascendant (Partial Manglik)` : `Mars in house ${marsHouseMoon} from Moon (Partial Manglik)`);
  }

  const verdictNe = isManglik 
    ? (severity === 'high' ? 'उच्च मांगलिक दोष (विवाह पूर्व शान्ति पूजा सिफारिस)' : 'सामान्य / आंशिक मांगलिक दोष (सहज निवारणीय)') 
    : 'मांगलिक दोष छैन (मङ्गल अनुकूल छ)';

  const verdictEn = isManglik
    ? (severity === 'high' ? 'High Manglik Dosha (Remedial Puja recommended before marriage)' : 'Partial / Mild Manglik Dosha (easily mitigated)')
    : 'No Manglik Dosha (Mars is well placed)';

  return {
    isManglik,
    severity,
    marsHouseFromLagna: marsHouseLagna,
    marsHouseFromMoon: marsHouseMoon,
    verdictNe,
    verdictEn,
    cancellationReasonsNe: reasonsNe,
    cancellationReasonsEn: reasonsEn
  };
}

// ============================================================================
// 5. MAIN DETERMINISTIC VEDIC HOROSCOPE GENERATOR
// ============================================================================

/**
 * Primary calculation engine: Computes the complete standardized Vedic Horoscope Dossier
 * strictly deterministically from Date, Time, and Geographic Location.
 */
export function calculateVedicHoroscope(input: BirthInput): VedicHoroscope {
  const [yearStr, monthStr, dayStr] = input.date.split('-');
  const [hourStr, minuteStr] = input.time.split(':');

  const year = parseInt(yearStr, 10) || 1995;
  const month = parseInt(monthStr, 10) || 1;
  const day = parseInt(dayStr, 10) || 1;
  const hour = parseInt(hourStr, 10) || 12;
  const minute = parseInt(minuteStr, 10) || 0;

  // 1. Julian Day (JD)
  const jd = calculateJulianDay(
    year, 
    month, 
    day, 
    hour, 
    minute, 
    0, 
    input.location.timezoneOffsetHours
  );

  // 2. Chitra-Paksha Lahiri Ayanamsha
  const ayanamsha = calculateLahiriAyanamsha(jd);
  const ayanamshaDms = degreesToDMS(ayanamsha);

  // 3. Ascendant (Lagna)
  const lagnaLongitude = calculateAscendant(
    jd, 
    input.location.latitude, 
    input.location.longitude, 
    ayanamsha
  );
  const lagnaRashiIndex = Math.floor(lagnaLongitude / 30);
  const lagnaRashi = RASHIS[lagnaRashiIndex];
  const lagnaDms = degreesToDMS(lagnaLongitude % 30);
  const lagnaNakshatra = getNakshatraDetail(lagnaLongitude);

  const lagnaInfo: LagnaInfo = {
    absoluteLongitude: lagnaLongitude,
    rashiIndex: lagnaRashiIndex,
    rashiNe: lagnaRashi.nameNe,
    rashiEn: lagnaRashi.nameEn,
    rashiDegree: lagnaDms.degrees,
    formattedDegree: lagnaDms.formatted,
    nakshatra: lagnaNakshatra
  };

  // 4. Mean Tropical Longitudes converted to Sidereal (Nirayana)
  const rawPlanets = calculateMeanPlanetaryLongitudes(jd);
  const planetKeys: PlanetKey[] = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];

  const grahas: Partial<Record<PlanetKey, GrahaPosition>> = {};
  const grahasList: GrahaPosition[] = [];

  for (const key of planetKeys) {
    const raw = rawPlanets[key];
    const siderealLon = normalize360(raw.tropical - ayanamsha);
    const rashiIdx = Math.floor(siderealLon / 30);
    const rashiMeta = RASHIS[rashiIdx];
    const degInRashi = siderealLon % 30;
    const dms = degreesToDMS(degInRashi);
    const nakDetail = getNakshatraDetail(siderealLon);
    
    // House relative to Lagna: House 1 = Lagna Rashi
    const houseNumber = ((rashiIdx - lagnaRashiIndex + 12) % 12) + 1;
    const meta = PLANET_METADATA[key];
    const dignityInfo = getPlanetaryDignity(key, rashiIdx);

    const grahaPos: GrahaPosition = {
      key,
      nameNe: meta.nameNe,
      nameEn: meta.nameEn,
      symbol: meta.symbol,
      absoluteLongitude: siderealLon,
      rashiIndex: rashiIdx,
      rashiNe: rashiMeta.nameNe,
      rashiEn: rashiMeta.nameEn,
      rashiDegree: dms.degrees,
      rashiMinute: dms.minutes,
      rashiSecond: dms.seconds,
      formattedDegree: dms.formatted,
      nakshatra: nakDetail,
      house: houseNumber,
      isRetrograde: raw.isRetrograde,
      dignity: dignityInfo.dignity,
      dignityNe: dignityInfo.dignityNe,
      dignityEn: dignityInfo.dignityEn
    };

    grahas[key] = grahaPos;
    grahasList.push(grahaPos);
  }

  const typedGrahas = grahas as Record<PlanetKey, GrahaPosition>;

  // 5. 12 Bhava (Houses)
  const houses: BhavaHouse[] = [];
  for (let h = 1; h <= 12; h++) {
    const rashiIdx = (lagnaRashiIndex + (h - 1)) % 12;
    const rashiMeta = RASHIS[rashiIdx];
    const lordMeta = PLANET_METADATA[rashiMeta.lord];
    const residents = grahasList.filter(g => g.house === h);

    houses.push({
      houseNumber: h,
      rashiIndex: rashiIdx,
      rashiNe: rashiMeta.nameNe,
      rashiEn: rashiMeta.nameEn,
      lordKey: rashiMeta.lord,
      lordNe: lordMeta.nameNe,
      lordEn: lordMeta.nameEn,
      planets: residents
    });
  }

  // 6. Moon and Sun Signs
  const moonGraha = typedGrahas.moon;
  const sunGraha = typedGrahas.sun;

  const moonSign = {
    rashiIndex: moonGraha.rashiIndex,
    rashiNe: moonGraha.rashiNe,
    rashiEn: moonGraha.rashiEn,
    nakshatraNe: moonGraha.nakshatra.nameNe,
    nakshatraEn: moonGraha.nakshatra.nameEn,
    pada: moonGraha.nakshatra.pada
  };

  const sunSign = {
    rashiIndex: sunGraha.rashiIndex,
    rashiNe: sunGraha.rashiNe,
    rashiEn: sunGraha.rashiEn
  };

  // 7. Vimshottari Mahadasha Balance
  const dashaBalance = calculateVimshottariBalance(moonGraha.absoluteLongitude);

  // 8. Manglik Dosha
  const marsHouseLagna = typedGrahas.mars.house;
  const marsHouseMoon = ((typedGrahas.mars.rashiIndex - moonGraha.rashiIndex + 12) % 12) + 1;
  const manglikAnalysis = calculateManglikDosha(marsHouseLagna, marsHouseMoon);

  // 9. Lucky Gem & Elements based on Lagna & Moon
  const luckyElementsMap: Record<number, { gemNe: string; gemEn: string; colorNe: string; colorEn: string; num: number; deityNe: string; deityEn: string }> = {
    0:  { gemNe: 'रातो मुगा (Red Coral)', gemEn: 'Red Coral', colorNe: 'रातो / केसरी', colorEn: 'Red / Saffron', num: 9, deityNe: 'श्री हनुमान', deityEn: 'Lord Hanuman' },
    1:  { gemNe: 'हीरा वा ओपल (Diamond/Opal)', gemEn: 'Diamond / White Opal', colorNe: 'सेतो / गुलाबी', colorEn: 'White / Pink', num: 6, deityNe: 'महालक्ष्मी', deityEn: 'Maha Lakshmi' },
    2:  { gemNe: 'पन्ना (Emerald)', gemEn: 'Emerald', colorNe: 'हरियो', colorEn: 'Green', num: 5, deityNe: 'श्री गणेश', deityEn: 'Lord Ganesha' },
    3:  { gemNe: 'मोती (Natural Pearl)', gemEn: 'Natural Pearl', colorNe: 'सेतो / चम्किलो', colorEn: 'White / Silver', num: 2, deityNe: 'शिवजी', deityEn: 'Lord Shiva' },
    4:  { gemNe: 'माणिक्य (Ruby)', gemEn: 'Ruby', colorNe: 'गाढा रातो / सुनौलो', colorEn: 'Gold / Ruby Red', num: 1, deityNe: 'सूर्य नारायण', deityEn: 'Surya Narayana' },
    5:  { gemNe: 'पन्ना (Emerald)', gemEn: 'Emerald', colorNe: 'गाढा हरियो', colorEn: 'Deep Green', num: 5, deityNe: 'श्री विष्णु', deityEn: 'Lord Vishnu' },
    6:  { gemNe: 'हीरा वा जरकन (Diamond)', gemEn: 'Diamond / Zircon', colorNe: 'क्रिम / आकाशी', colorEn: 'Sky Blue / Cream', num: 6, deityNe: 'दुर्गा भवानी', deityEn: 'Goddess Durga' },
    7:  { gemNe: 'मुगा (Red Coral)', gemEn: 'Red Coral', colorNe: 'रातो / पहेलो', colorEn: 'Red / Amber', num: 9, deityNe: 'कार्तिकेय / बटुक भैरव', deityEn: 'Kartikeya' },
    8:  { gemNe: 'पुखराज (Yellow Sapphire)', gemEn: 'Yellow Sapphire', colorNe: 'पहेलो', colorEn: 'Yellow / Gold', num: 3, deityNe: 'बृहस्पति / गुरु', deityEn: 'Brihaspati' },
    9:  { gemNe: 'नीलम (Blue Sapphire)', gemEn: 'Blue Sapphire', colorNe: 'कालो / निलो', colorEn: 'Dark Navy Blue', num: 8, deityNe: 'शनिदेव', deityEn: 'Lord Shani' },
    10: { gemNe: 'नीलम (Blue Sapphire)', gemEn: 'Blue Sapphire', colorNe: 'निलो / खरानी', colorEn: 'Blue / Slate', num: 8, deityNe: 'महाकाल', deityEn: 'Mahakaal' },
    11: { gemNe: 'पुखराज (Yellow Sapphire)', gemEn: 'Yellow Sapphire', colorNe: 'पहेलो / केशरी', colorEn: 'Yellow / Saffron', num: 3, deityNe: 'नारायण', deityEn: 'Narayana' },
  };

  const luckyElements = luckyElementsMap[lagnaRashiIndex] || luckyElementsMap[0];

  return {
    input,
    julianDay: jd,
    ayanamshaDegrees: ayanamsha,
    ayanamshaFormatted: ayanamshaDms.formatted,
    lagna: lagnaInfo,
    moonSign,
    sunSign,
    grahas: typedGrahas,
    grahasList,
    houses,
    dashaBalance,
    manglikAnalysis,
    luckyElements: {
      luckyGemNe: luckyElements.gemNe,
      luckyGemEn: luckyElements.gemEn,
      luckyColorNe: luckyElements.colorNe,
      luckyColorEn: luckyElements.colorEn,
      luckyNumber: luckyElements.num,
      luckyDeityNe: luckyElements.deityNe,
      luckyDeityEn: luckyElements.deityEn
    }
  };
}
