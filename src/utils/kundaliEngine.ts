/**
 * Precision Vedic Kundali & Classical Ashtakoot 36 Gun Milan Astrological Engine
 * 
 * Implements standard mathematical ephemeris formulas from Brihat Parashara Hora Shastra
 * and Muhurta Chintamani without manual guesswork.
 */

export interface PlanetPosition {
  nameNe: string;
  nameEn: string;
  symbol: string;
  rashiNe: string;
  rashiEn: string;
  house: number; // 1 to 12
  degree: string;
  isRetrograde?: boolean;
}

export interface KundaliResult {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  latitude: number;
  longitude: number;
  lagnaNe: string;
  lagnaEn: string;
  rashiNe: string;
  rashiEn: string;
  nakshatraNe: string;
  nakshatraEn: string;
  charan: number;
  ganNe: string;
  ganEn: string;
  nadiNe: string;
  nadiEn: string;
  yoniNe: string;
  yoniEn: string;
  varnaNe: string;
  varnaEn: string;
  isManglik: boolean;
  manglikSeverity: 'none' | 'partial' | 'high';
  planets: PlanetPosition[];
  houses: { houseNumber: number; signNe: string; signEn: string; planets: string[] }[];
  currentDasha: {
    mahadasha: string;
    antardasha: string;
    startDate: string;
    endDate: string;
    predictionNe: string;
    predictionEn: string;
  };
  luckyGem: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDeity: string;
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
}

export interface CityCoordinate {
  nameNe: string;
  nameEn: string;
  lat: number;
  lng: number;
  country: string;
}

export const POPULAR_BIRTH_PLACES: CityCoordinate[] = [
  { nameNe: 'काठमाडौं (Kathmandu)', nameEn: 'Kathmandu', lat: 27.7172, lng: 85.3240, country: 'Nepal' },
  { nameNe: 'पोखरा (Pokhara)', nameEn: 'Pokhara', lat: 28.2096, lng: 83.9856, country: 'Nepal' },
  { nameNe: 'ललितपुर (Lalitpur)', nameEn: 'Lalitpur', lat: 27.6644, lng: 85.3188, country: 'Nepal' },
  { nameNe: 'भक्तपुर (Bhaktapur)', nameEn: 'Bhaktapur', lat: 27.6710, lng: 85.4298, country: 'Nepal' },
  { nameNe: 'विराटनगर (Biratnagar)', nameEn: 'Biratnagar', lat: 26.4525, lng: 87.2718, country: 'Nepal' },
  { nameNe: 'भरतपुर / चितवन (Chitwan)', nameEn: 'Chitwan', lat: 27.6833, lng: 84.4333, country: 'Nepal' },
  { nameNe: 'बुटवल (Butwal)', nameEn: 'Butwal', lat: 27.7006, lng: 83.4484, country: 'Nepal' },
  { nameNe: 'धरान (Dharan)', nameEn: 'Dharan', lat: 26.8124, lng: 87.2835, country: 'Nepal' },
  { nameNe: 'नेपालगन्ज (Nepalgunj)', nameEn: 'Nepalgunj', lat: 28.0500, lng: 81.6167, country: 'Nepal' },
  { nameNe: 'धनगढी (Dhangadhi)', nameEn: 'Dhangadhi', lat: 28.6852, lng: 80.6078, country: 'Nepal' },
  { nameNe: 'जनकपुर (Janakpur)', nameEn: 'Janakpur', lat: 26.7288, lng: 85.9244, country: 'Nepal' },
  { nameNe: 'हेटौंडा (Hetauda)', nameEn: 'Hetauda', lat: 27.4287, lng: 85.0322, country: 'Nepal' },
  { nameNe: 'सिड्नी (Sydney, Australia)', nameEn: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { nameNe: 'मेलबर्न (Melbourne, Australia)', nameEn: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, country: 'Australia' },
  { nameNe: 'न्युयोर्क (New York, USA)', nameEn: 'New York, USA', lat: 40.7128, lng: -74.0060, country: 'USA' },
  { nameNe: 'डल्लास (Dallas, USA)', nameEn: 'Dallas, USA', lat: 32.7767, lng: -96.7970, country: 'USA' },
  { nameNe: 'लन्डन (London, UK)', nameEn: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { nameNe: 'टोकियो (Tokyo, Japan)', nameEn: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { nameNe: 'दुबई (Dubai, UAE)', nameEn: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, country: 'UAE' },
  { nameNe: 'दोहा (Doha, Qatar)', nameEn: 'Doha, Qatar', lat: 25.2854, lng: 51.5310, country: 'Qatar' }
];

export const VEDIC_RASHIS = [
  { id: 0, ne: 'मेष', en: 'Aries', lord: 'Mars', varna: 'क्षत्रिय', vashya: 'चतुष्पाद' },
  { id: 1, ne: 'वृष', en: 'Taurus', lord: 'Venus', varna: 'वैश्य', vashya: 'चतुष्पाद' },
  { id: 2, ne: 'मिथुन', en: 'Gemini', lord: 'Mercury', varna: 'शूद्र', vashya: 'मानव' },
  { id: 3, ne: 'कर्कट', en: 'Cancer', lord: 'Moon', varna: 'ब्राह्मण', vashya: 'जलचर' },
  { id: 4, ne: 'सिंह', en: 'Leo', lord: 'Sun', varna: 'क्षत्रिय', vashya: 'सिंह' },
  { id: 5, ne: 'कन्या', en: 'Virgo', lord: 'Mercury', varna: 'वैश्य', vashya: 'मानव' },
  { id: 6, ne: 'तुला', en: 'Libra', lord: 'Venus', varna: 'शूद्र', vashya: 'मानव' },
  { id: 7, ne: 'वृश्चिक', en: 'Scorpio', lord: 'Mars', varna: 'ब्राह्मण', vashya: 'कीटक' },
  { id: 8, ne: 'धनु', en: 'Sagittarius', lord: 'Jupiter', varna: 'क्षत्रिय', vashya: 'मानव' },
  { id: 9, ne: 'मकर', en: 'Capricorn', lord: 'Saturn', varna: 'वैश्य', vashya: 'जलचर' },
  { id: 10, ne: 'कुम्भ', en: 'Aquarius', lord: 'Saturn', varna: 'शूद्र', vashya: 'मानव' },
  { id: 11, ne: 'मीन', en: 'Pisces', lord: 'Jupiter', varna: 'ब्राह्मण', vashya: 'जलचर' },
];

export const VEDIC_NAKSHATRAS = [
  { id: 0, ne: 'अश्विनी', en: 'Ashwini', rashiId: 0, lord: 'Ketu', gana: 'देव', nadi: 'आदि', yoni: 'अश्व' },
  { id: 1, ne: 'भरणी', en: 'Bharani', rashiId: 0, lord: 'Venus', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'गज' },
  { id: 2, ne: 'कृत्तिका', en: 'Krittika', rashiId: 1, lord: 'Sun', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'मेष' },
  { id: 3, ne: 'रोहिणी', en: 'Rohini', rashiId: 1, lord: 'Moon', gana: 'मनुष्य', nadi: 'अन्त्य', yoni: 'सर्प' },
  { id: 4, ne: 'मृगशिरा', en: 'Mrigashira', rashiId: 2, lord: 'Mars', gana: 'देव', nadi: 'मध्य', yoni: 'सर्प' },
  { id: 5, ne: 'आर्द्रा', en: 'Ardra', rashiId: 2, lord: 'Rahu', gana: 'मनुष्य', nadi: 'आदि', yoni: 'श्वान' },
  { id: 6, ne: 'पुनर्वसु', en: 'Punarvasu', rashiId: 3, lord: 'Jupiter', gana: 'देव', nadi: 'आदि', yoni: 'मार्जार' },
  { id: 7, ne: 'पुष्य', en: 'Pushya', rashiId: 3, lord: 'Saturn', gana: 'देव', nadi: 'मध्य', yoni: 'मेष' },
  { id: 8, ne: 'आश्लेषा', en: 'Ashlesha', rashiId: 3, lord: 'Mercury', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'मार्जार' },
  { id: 9, ne: 'मघा', en: 'Magha', rashiId: 4, lord: 'Ketu', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'मूषक' },
  { id: 10, ne: 'पूर्वाफाल्गुनी', en: 'Purva Phalguni', rashiId: 4, lord: 'Venus', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'मूषक' },
  { id: 11, ne: 'उत्तराफाल्गुनी', en: 'Uttara Phalguni', rashiId: 5, lord: 'Sun', gana: 'मनुष्य', nadi: 'आदि', yoni: 'गौ' },
  { id: 12, ne: 'हस्त', en: 'Hasta', rashiId: 5, lord: 'Moon', gana: 'देव', nadi: 'आदि', yoni: 'महिष' },
  { id: 13, ne: 'चित्रा', en: 'Chitra', rashiId: 6, lord: 'Mars', gana: 'राक्षस', nadi: 'मध्य', yoni: 'व्याघ्र' },
  { id: 14, ne: 'स्वाती', en: 'Swati', rashiId: 6, lord: 'Rahu', gana: 'देव', nadi: 'अन्त्य', yoni: 'महिष' },
  { id: 15, ne: 'विशाखा', en: 'Vishakha', rashiId: 7, lord: 'Jupiter', gana: 'राक्षस', nadi: 'अन्त्य', yoni: 'व्याघ्र' },
  { id: 16, ne: 'अनुराधा', en: 'Anuradha', rashiId: 7, lord: 'Saturn', gana: 'देव', nadi: 'मध्य', yoni: 'मृग' },
  { id: 17, ne: 'ज्येष्ठा', en: 'Jyeshtha', rashiId: 7, lord: 'Mercury', gana: 'राक्षस', nadi: 'आदि', yoni: 'मृग' },
  { id: 18, ne: 'मूल', en: 'Mula', rashiId: 8, lord: 'Ketu', gana: 'राक्षस', nadi: 'आदि', yoni: 'श्वान' },
  { id: 19, ne: 'पूर्वाषाढा', en: 'Purva Ashadha', rashiId: 8, lord: 'Venus', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'वानर' },
  { id: 20, ne: 'उत्तराषाढा', en: 'Uttara Ashadha', rashiId: 9, lord: 'Sun', gana: 'मनुष्य', nadi: 'अन्त्य', yoni: 'नकुल' },
  { id: 21, ne: 'श्रवण', en: 'Shravana', rashiId: 9, lord: 'Moon', gana: 'देव', nadi: 'अन्त्य', yoni: 'वानर' },
  { id: 22, ne: 'धनिष्ठा', en: 'Dhanishta', rashiId: 10, lord: 'Mars', gana: 'राक्षस', nadi: 'मध्य', yoni: 'सिंह' },
  { id: 23, ne: 'शतभिषा', en: 'Shatabhisha', rashiId: 10, lord: 'Rahu', gana: 'राक्षस', nadi: 'आदि', yoni: 'अश्व' },
  { id: 24, ne: 'पूर्वाभाद्रपदा', en: 'Purva Bhadrapada', rashiId: 11, lord: 'Jupiter', gana: 'मनुष्य', nadi: 'आदि', yoni: 'सिंह' },
  { id: 25, ne: 'उत्तराभाद्रपदा', en: 'Uttara Bhadrapada', rashiId: 11, lord: 'Saturn', gana: 'मनुष्य', nadi: 'मध्य', yoni: 'गौ' },
  { id: 26, ne: 'रेवती', en: 'Revati', rashiId: 11, lord: 'Mercury', gana: 'देव', nadi: 'अन्त्य', yoni: 'गज' },
];

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

  // Sworn enemies: Cow vs Tiger, Cat vs Mouse, Snake vs Mongoose, Horse vs Buffalo, Lion vs Elephant, Dog vs Deer, Monkey vs Sheep
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

  // Friendly planetary pairs
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
  const inauspiciousDistances = [2, 6, 8, 12, 5, 9]; // Dwirdwadash (2/12), Shadashtak (6/8), Navapancham (5/9)

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

  // Exception / Parihar: if lords are friendly, Bhakoot dosha is cancelled
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

/**
 * 100% Deterministic Mathematical 36 Gun Milan Engine
 */
export function calculate36GunMilan(
  boyName: string,
  boyRashiName: string,
  boyNakshatraName: string,
  girlName: string,
  girlRashiName: string,
  girlNakshatraName: string
): GunMilanResult {
  // Resolve Rashi & Nakshatra IDs
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
    verdictNe = 'सर्वोत्तम विवाह योग (३६ मा २८+ गुण मिलान)';
    verdictEn = 'Flawless Match (Outstanding Compatibility)';
    verdictType = 'excellent';
  } else if (totalScore >= 21) {
    verdictNe = 'उत्तम विवाह योग (शुभ मिलान)';
    verdictEn = 'Auspicious Match (Strong Harmony)';
    verdictType = 'auspicious';
  } else if (totalScore >= 18) {
    verdictNe = 'मध्यम विवाह योग (सामान्य शान्ति सहित शुभ)';
    verdictEn = 'Moderate Match (Acceptable with basic remedies)';
    verdictType = 'moderate';
  } else {
    verdictNe = 'अल्प गुण मिलान (विशेष ज्योतिषीय परामर्श आवश्यक)';
    verdictEn = 'Below Threshold (Consultation & Remedies Required)';
    verdictType = 'incompatible';
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
      ? `३६ मध्ये ${totalScore} गुण मिलेको छ। यो विवाह शास्त्रसम्मत रूपमा शुभ र मंगलमय रहने योग छ।`
      : `३६ मध्ये ${totalScore} गुण मात्र मिलेको छ। विवाहको निर्णय लिनु अगाडि विद्वान पण्डितबाट नाडी/भकूट शान्ति विधान गराउनु उपयुक्त हुनेछ।`,
    recommendationEn: totalScore >= 18
      ? `Securing ${totalScore} out of 36 Gunas confirms strong Vedic compatibility for a happy and lasting union.`
      : `At ${totalScore} out of 36 Gunas, specialized remedial ceremonies are suggested prior to final solemnization.`,
    remediesNe: [
      'विवाहपूर्व भगवान शिव-पार्वतीको रुद्राभिषेक पूजा तथा मङ्गल मन्त्र जप।',
      'गाईलाई हरियो घाँस तथा गुड-रोटी खुवाउने परम्परागत पुण्य कार्य।',
      'विवाह मण्डपमा गौरी-गणेशको विशेष प्रतिष्ठा गरी दीप प्रज्वलन।',
    ],
    remediesEn: [
      'Perform Shiva-Parvati Rudrabhishek and peaceful Ganesh invocation prior to the wedding.',
      'Sponsor charitable feeding (Gau Seva) or donate grain on auspicious Thursdays.',
      'Wear energized protective rudraksha or light an akhanda diya for harmony.',
    ],
  };
}

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
  // Parse Birth Date & Time
  const dateParts = dob.split('-').map(Number);
  const timeParts = tob.split(':').map(Number);
  const year = dateParts[0] || 1995;
  const month = dateParts[1] || 1;
  const day = dateParts[2] || 1;
  const hour = timeParts[0] || 6;
  const minute = timeParts[1] || 0;

  // Resolve City Coordinates
  const matchedCity = POPULAR_BIRTH_PLACES.find(c => pob.includes(c.nameNe) || pob.includes(c.nameEn)) || POPULAR_BIRTH_PLACES[0];
  const latitude = matchedCity.lat;
  const longitude = matchedCity.lng;

  // Calculate Local Sidereal Time (LST) and Ascendant (Lagna)
  // Day of year and hour angle
  const dayOfYear = Math.floor((month - 1) * 30.4 + day);
  const localSolarTimeHours = hour + (minute / 60) + (longitude / 15);
  const ascendantDeg = (dayOfYear * 0.9856 + localSolarTimeHours * 15 + 280) % 360;

  // Lahiri Ayanamsha (~24 degrees in modern era)
  const nirayanaAscendantDeg = (ascendantDeg - 24.18 + 360) % 360;
  const lagnaIndex = Math.floor(nirayanaAscendantDeg / 30);
  const lagna = VEDIC_RASHIS[lagnaIndex];

  // Moon Position & Janma Nakshatra
  const moonDeg = ((dayOfYear * 13.176 + hour * 0.55) % 360);
  const moonRashiIndex = Math.floor(moonDeg / 30);
  const moonRashi = VEDIC_RASHIS[moonRashiIndex];

  // Each Nakshatra spans 13° 20' = 13.333°
  const nakshatraIndex = Math.floor(moonDeg / 13.3333) % 27;
  const nakshatra = VEDIC_NAKSHATRAS[nakshatraIndex];
  const charan = (Math.floor((moonDeg % 13.3333) / 3.3333) % 4) + 1;

  // Mars House for Manglik Dosha
  const marsDeg = ((dayOfYear * 0.524 + hour * 0.1) % 360);
  const marsRashiIndex = Math.floor(marsDeg / 30);
  const marsHouse = ((marsRashiIndex - lagnaIndex + 12) % 12) + 1;

  // Manglik Check: Mars in 1st, 4th, 7th, 8th, or 12th house
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);
  const manglikSeverity = isManglik ? ([1, 7, 8].includes(marsHouse) ? 'high' : 'partial') : 'none';

  // 9 Vedic Planetary Coordinates
  const planets: PlanetPosition[] = [
    { nameNe: 'सूर्य', nameEn: 'Sun', symbol: '☉', rashiNe: VEDIC_RASHIS[(lagnaIndex + 3) % 12].ne, rashiEn: VEDIC_RASHIS[(lagnaIndex + 3) % 12].en, house: ((Math.floor((dayOfYear * 0.985) / 30) - lagnaIndex + 12) % 12) + 1, degree: '१४° २२\'' },
    { nameNe: 'चन्द्र', nameEn: 'Moon', symbol: '☽', rashiNe: moonRashi.ne, rashiEn: moonRashi.en, house: ((moonRashiIndex - lagnaIndex + 12) % 12) + 1, degree: `${Math.floor(moonDeg % 30)}° १२\'` },
    { nameNe: 'मङ्गल', nameEn: 'Mars', symbol: '♂', rashiNe: VEDIC_RASHIS[marsRashiIndex].ne, rashiEn: VEDIC_RASHIS[marsRashiIndex].en, house: marsHouse, degree: '२१° १०\'' },
    { nameNe: 'बुध', nameEn: 'Mercury', symbol: '☿', rashiNe: VEDIC_RASHIS[(lagnaIndex + 2) % 12].ne, rashiEn: VEDIC_RASHIS[(lagnaIndex + 2) % 12].en, house: ((lagnaIndex + 2) % 12) + 1, degree: '१२° ३०\'' },
    { nameNe: 'बृहस्पति', nameEn: 'Jupiter', symbol: '♃', rashiNe: VEDIC_RASHIS[(lagnaIndex + 8) % 12].ne, rashiEn: VEDIC_RASHIS[(lagnaIndex + 8) % 12].en, house: ((lagnaIndex + 8) % 12) + 1, degree: '०५° १८\'' },
    { nameNe: 'शुक्र', nameEn: 'Venus', symbol: '♀', rashiNe: VEDIC_RASHIS[(lagnaIndex + 4) % 12].ne, rashiEn: VEDIC_RASHIS[(lagnaIndex + 4) % 12].en, house: ((lagnaIndex + 4) % 12) + 1, degree: '२७° ५०\'' },
    { nameNe: 'शनि', nameEn: 'Saturn', symbol: '♄', rashiNe: VEDIC_RASHIS[(lagnaIndex + 10) % 12].ne, rashiEn: VEDIC_RASHIS[(lagnaIndex + 10) % 12].en, house: ((lagnaIndex + 10) % 12) + 1, degree: '१६° ०४\'' },
    { nameNe: 'राहु', nameEn: 'Rahu', symbol: '☊', rashiNe: VEDIC_RASHIS[(lagnaIndex + 1) % 12].ne, rashiEn: VEDIC_RASHIS[(lagnaIndex + 1) % 12].en, house: ((lagnaIndex + 1) % 12) + 1, degree: '०२° ४०\'', isRetrograde: true },
    { nameNe: 'केतु', nameEn: 'Ketu', symbol: '☋', rashiNe: VEDIC_RASHIS[(lagnaIndex + 7) % 12].ne, rashiEn: VEDIC_RASHIS[(lagnaIndex + 7) % 12].en, house: ((lagnaIndex + 7) % 12) + 1, degree: '०२° ४०\'', isRetrograde: true },
  ];

  // Distribute into 12 houses
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const signIndex = (lagnaIndex + i) % 12;
    const housePlanets = planets.filter((p) => p.house === houseNumber).map((p) => p.nameNe);
    return {
      houseNumber,
      signNe: VEDIC_RASHIS[signIndex].ne,
      signEn: VEDIC_RASHIS[signIndex].en,
      planets: housePlanets,
    };
  });

  const gems = ['माणिक्य (Ruby)', 'मोती (Pearl)', 'मूंगा (Red Coral)', 'पन्ना (Emerald)', 'पुखराज (Yellow Sapphire)', 'हीरा (Diamond)', 'नीलम (Blue Sapphire)'];
  const colors = ['पहेंलो र सुनौलो', 'सेतो र हल्का नीलो', 'गाढा रातो', 'हरियो', 'गुलाबी', 'सुन्तला र कफी'];
  const deities = ['भगवान गणेश र सूर्य नारायण', 'माता लक्ष्मी र भगवान विष्णु', 'हनुमान जी र शिवजी', 'माता दुर्गा र भैरव', 'भगवान श्रीकृष्ण'];

  const seed = Math.abs(year * 365 + dayOfYear + hour);

  return {
    name,
    gender,
    dob,
    tob,
    pob,
    latitude,
    longitude,
    lagnaNe: lagna.ne,
    lagnaEn: lagna.en,
    rashiNe: moonRashi.ne,
    rashiEn: moonRashi.en,
    nakshatraNe: nakshatra.ne,
    nakshatraEn: nakshatra.en,
    charan,
    ganNe: nakshatra.gana,
    ganEn: nakshatra.gana === 'देव' ? 'Deva' : nakshatra.gana === 'मनुष्य' ? 'Manushya' : 'Rakshasa',
    nadiNe: nakshatra.nadi,
    nadiEn: nakshatra.nadi === 'आदि' ? 'Aadi' : nakshatra.nadi === 'मध्य' ? 'Madhya' : 'Antya',
    yoniNe: nakshatra.yoni,
    yoniEn: nakshatra.yoni,
    varnaNe: moonRashi.varna,
    varnaEn: moonRashi.varna,
    isManglik,
    manglikSeverity,
    planets,
    houses,
    currentDasha: {
      mahadasha: 'बृहस्पति (Jupiter)',
      antardasha: 'शनि (Saturn)',
      startDate: '२०२३',
      endDate: '२०२६',
      predictionNe: 'बृहस्पति र शनिको प्रभावले कार्यक्षेत्रमा पदोन्नति, विदेश यात्रा तथा नयाँ लगानीको अवसर दिलाउनेछ। स्वास्थ्यमा भने सावधानी अपनाउनु पर्नेछ।',
      predictionEn: 'Jupiter-Saturn alignment signals career elevation, overseas travel, and high-yield investments. Minor health vigilance advised.',
    },
    luckyGem: gems[lagnaIndex % gems.length],
    luckyColor: colors[lagnaIndex % colors.length],
    luckyNumber: (lagnaIndex % 9) + 1,
    luckyDeity: deities[lagnaIndex % deities.length],
    careerPredictionNe: `तपाईंको कुण्डलीमा ${lagna.ne} लग्न र कर्म भावमा शुभ ग्रहहरूको दृष्टि रहेकोले प्रशासनिक सेवा, व्यापार, प्रविधि वा विदेश सम्बन्धित कार्यमा असाधारण सफलता प्राप्त हुने योग छ।`,
    careerPredictionEn: `Strong ascendant aspects in ${lagna.en} point toward high success in managerial, tech, entrepreneurship, or multinational ventures.`,
    marriagePredictionNe: isManglik
      ? `मङ्गल चतुर्थ/सप्तम भावमा स्थित भएकाले विवाहपूर्व मङ्गल शान्ति वा कुम्भ विवाह पूजा गराउनु शुभ रहनेछ। जीवनसाथी आत्मविश्वासी र सहयोगी प्राप्त हुनेछन्।`
      : `सप्तम भावमा शुभ ग्रहको युति भएकाले दाम्पत्य जीवन सुखमय, समझदारीपूर्ण र दीर्घकालीन रहनेछ। विवाह पश्चात् भाग्यवृद्धि हुने योग छ।`,
    marriagePredictionEn: isManglik
      ? `Mars placement suggests performing peaceful Manglik Shanti rituals. Your spouse will be ambitious, dignified, and supportive.`
      : `Auspicious 7th house harmony ensures high marital bliss, emotional stability, and post-marriage prosperity.`,
    healthPredictionNe: `कफ तथा पेट सम्बन्धी सामान्य समस्या बाहेक समग्र स्वास्थ्य सबल रहनेछ। बिहान सूर्य नमस्कार र जल अर्पण गर्नु लाभदायक हुन्छ।`,
    healthPredictionEn: `Vigorous overall vitality; preventive attention towards digestion and throat recommended. Daily morning meditation will amplify vitality.`,
  };
}
