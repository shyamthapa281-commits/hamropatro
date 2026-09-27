/**
 * Authentic Nepali Vedic Horoscope & Planetary Transit Engine
 * Generates dynamic Daily, Weekly, Monthly, and Yearly Rashifal for all 12 Rashis.
 */
import { RashiId, HoroscopePeriod, DailyHoroscope, NepaliDate, Language } from '../types';
import { RASHIS_DATA } from '../data/mockAstrology';
import { toNepaliDigits, adToBs, BS_MONTH_NAMES_NE, BS_MONTH_NAMES_EN } from './nepaliCalendar';

interface PlanetaryDayInfo {
  rulingPlanetNe: string;
  rulingPlanetEn: string;
  auspiciousTime: string;
  rahuKaal: string;
}

const WEEKDAY_PLANETS: PlanetaryDayInfo[] = [
  { rulingPlanetNe: 'सूर्य (Sun)', rulingPlanetEn: 'Sun (Surya)', auspiciousTime: '०८:१५ AM - १०:०० AM', rahuKaal: '०४:३० PM - ०६:०० PM' }, // Sun
  { rulingPlanetNe: 'चन्द्रमा (Moon)', rulingPlanetEn: 'Moon (Chandra)', auspiciousTime: '०९:०० AM - १०:४५ AM', rahuKaal: '०७:३० AM - ०९:०० AM' }, // Mon
  { rulingPlanetNe: 'मङ्गल (Mars)', rulingPlanetEn: 'Mars (Mangal)', auspiciousTime: '१०:३० AM - १२:१५ PM', rahuKaal: '०३:०० PM - ०४:३० PM' }, // Tue
  { rulingPlanetNe: 'बुध (Mercury)', rulingPlanetEn: 'Mercury (Budha)', auspiciousTime: '०७:४५ AM - ०९:३० AM', rahuKaal: '१२:०० PM - ०१:३० PM' }, // Wed
  { rulingPlanetNe: 'बृहस्पति (Jupiter)', rulingPlanetEn: 'Jupiter (Guru)', auspiciousTime: '०८:३० AM - १०:१५ AM', rahuKaal: '०१:३० PM - ०३:०० PM' }, // Thu
  { rulingPlanetNe: 'शुक्र (Venus)', rulingPlanetEn: 'Venus (Shukra)', auspiciousTime: '०९:१५ AM - ११:०० AM', rahuKaal: '१०:३० AM - १२:०० PM' }, // Fri
  { rulingPlanetNe: 'शनि (Saturn)', rulingPlanetEn: 'Saturn (Shani)', auspiciousTime: '११:०० AM - १२:४५ PM', rahuKaal: '०९:०० AM - १०:३० AM' }, // Sat
];

// Rich astrological templates for each period and sign
interface RashiForecastBase {
  luckyColorNe: string;
  luckyColorEn: string;
  luckyNumber: number;
  luckyDirectionNe: string;
  luckyDirectionEn: string;
  gemstoneNe: string;
  gemstoneEn: string;
  mantraNe: string;
  dailyBase: {
    predictionNe: string;
    predictionEn: string;
    remedyNe: string;
    remedyEn: string;
  };
  weeklyBase: {
    predictionNe: string;
    predictionEn: string;
    remedyNe: string;
    remedyEn: string;
  };
  monthlyBase: {
    predictionNe: string;
    predictionEn: string;
    remedyNe: string;
    remedyEn: string;
  };
  yearlyBase: {
    predictionNe: string;
    predictionEn: string;
    remedyNe: string;
    remedyEn: string;
  };
}

const RASHI_FORECAST_BANK: Record<RashiId, RashiForecastBase> = {
  mesh: {
    luckyColorNe: 'रातो र पहेंलो',
    luckyColorEn: 'Crimson Red & Amber',
    luckyNumber: 9,
    luckyDirectionNe: 'पूर्व',
    luckyDirectionEn: 'East',
    gemstoneNe: 'मुगा (Red Coral)',
    gemstoneEn: 'Red Coral',
    mantraNe: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    dailyBase: {
      predictionNe: 'आजको दिन आत्मविश्वास र उच्च ऊर्जाले भरिपूर्ण रहनेछ। रोकिएका कार्यहरू सहज रूपमा सम्पन्न हुनेछन्। नयाँ व्यापारिक योजना अगाडि बढाउन उत्तम समय छ। मान्यजन तथा सहकर्मीहरूको पूर्ण सहयोग प्राप्त हुनेछ। बोलीमा भने संयम राख्नुहोला।',
      predictionEn: 'Today brings high vitality and boosted self-confidence. Stalled projects will gain smooth momentum. Favorable day for business ventures and career advancements. Maintain polite communication with colleagues.',
      remedyNe: 'सूर्य नमस्कार गरी हनुमान चालिसा पाठ गर्नुहोस्।',
      remedyEn: 'Perform Surya Namaskar and recite Hanuman Chalisa in the morning.',
    },
    weeklyBase: {
      predictionNe: 'यो साता पराक्रम र व्यावसायिक प्रतिष्ठामा उल्लेखनीय वृद्धि हुनेछ। साताको मध्यभागमा आर्थिक लगानीका नयाँ अवसर खुल्नेछन्। पारिवारिक जमघट तथा मांगलिक कार्यमा सहभागी हुने अवसर जुट्नेछ। प्रतियोगितात्मक परीक्षामा सफलता मिल्नेछ।',
      predictionEn: 'This week highlights courageous leadership and notable career advancements. Mid-week opens promising doors for financial investments. Enjoy warm family reunions and celebratory moments.',
      remedyNe: 'मंगलबार गरिबलाई रातो फलफूल वा मीठो भोजन दान गर्नुहोस्।',
      remedyEn: 'Offer red fruits or warm food to someone in need on Tuesday.',
    },
    monthlyBase: {
      predictionNe: 'चालू महिना कार्यक्षेत्रमा पदोन्नति र नयाँ जिम्मेवारीको बलियो योग रहेको छ। भूमि, वाहन वा अचल सम्पत्ति जोड्ने योजना सफल हुनेछ। स्वास्थ्यमा मौसमी सुधार देखिनेछ। वैवाहिक जीवनमा प्रेम र आपसी समझदारी बढ्नेछ।',
      predictionEn: 'This month brings strong planetary alignments for promotions, land purchases, and vehicle acquisitions. Health remains robust. Harmonious mutual understanding blesses domestic life.',
      remedyNe: 'महिनाको पहिलो मंगलबार गणेश मन्दिरमा लड्डु अर्पण गर्नुहोस्।',
      remedyEn: 'Offer sweet laddoos at a Lord Ganesha shrine on the first Tuesday.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल मेष राशिका लागि अभूतपूर्व प्रगति, धनलाभ र विदेश यात्राको वर्ष साबित हुनेछ। बृहस्पतिको शुभ दृष्टिले अध्ययन र अनुसन्धानमा सफलता मिल्नेछ। वर्षको उत्तरार्धमा ठूला लगानीबाट दीर्घकालीन प्रतिफल हासिल हुनेछ।',
      predictionEn: 'Bikram Sambat 2083 marks a breakthrough year for Aries with substantial financial gains, international travels, and academic accolades supported by favorable Jupiter transits.',
      remedyNe: 'वर्षभरि नित्य गायत्री मन्त्र जप गर्नुहोस् र तामाको भाँडोबाट जल पिउनुहोस्।',
      remedyEn: 'Chant the Gayatri Mantra daily and drink water from a copper vessel.',
    },
  },

  vrishabha: {
    luckyColorNe: 'सेतो र हल्का गुलाबी',
    luckyColorEn: 'Pearl White & Soft Pink',
    luckyNumber: 6,
    luckyDirectionNe: 'दक्षिण-पूर्व',
    luckyDirectionEn: 'South-East',
    gemstoneNe: 'हीरा वा ओपल (Diamond/Opal)',
    gemstoneEn: 'Diamond or Opal',
    mantraNe: 'ॐ शुं शुक्राय नमः',
    dailyBase: {
      predictionNe: 'आर्थिक लाभको बलियो योग बनेको छ। कला, सौन्दर्य र सिर्जनात्मक क्षेत्रमा विशिष्ट सफलता मिल्नेछ। जीवनसाथीसँगको सम्बन्धमा प्रगाढता आउनेछ। स्वादिष्ट भोजन र उपहार प्राप्त हुने सम्भावना छ। लगानीबाट मनग्य प्रतिफल हात पर्नेछ।',
      predictionEn: 'A prosperous day with strong financial gains. Creativity and artistic pursuits will shine brightly. Deep harmony in romantic relationships. Pleasant gifts and culinary delights await.',
      remedyNe: 'लक्ष्मी माताको आरधना गरी सेतो मिठाई प्रसाद चढाउनुहोस्।',
      remedyEn: 'Worship Goddess Lakshmi and offer white sweets as prasad.',
    },
    weeklyBase: {
      predictionNe: 'साताभर भौतिक सुखसुविधाका साधन जुटाउन अनुकूल वातावरण रहनेछ। साझेदारी व्यापारमा पारदर्शिता अपनाउँदा उल्लेख्य नाफा हुनेछ। साताको अन्त्यतिर आध्यात्मिक तथा पर्यटकीय यात्राको योजना बन्नेछ।',
      predictionEn: 'A week focused on luxury, domestic comforts, and thriving partnerships. Financial transparency yields handsome dividends. Weekend promises peaceful spiritual travel.',
      remedyNe: 'शुक्रबार सेतो चामल वा खीर गरिबलाई दान गर्नुहोस्।',
      remedyEn: 'Donate white rice or sweet milk kheer to the needy on Friday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना रोकिएका धन संकलन हुनेछन् भने बचतमा वृद्धि हुनेछ। व्यापार-व्यवसायको दायरा फराकिलो बन्नेछ। घरमा शुभ कार्य वा धार्मिक अनुष्ठानको आयोजना हुनेछ। सन्तान पक्षबाट खुसीको खबर सुन्न पाइनेछ।',
      predictionEn: 'This month facilitates outstanding financial recoveries and savings growth. Expansion in business horizons. Auspicious family ceremonies and proud news from children.',
      remedyNe: 'शुक्रबार शिवलिंगमा कच्चा दूध अर्पण गर्नुहोस्।',
      remedyEn: 'Offer fresh milk onto the sacred Shiva Lingam on Fridays.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल वृष राशिका लागि ऐश्वर्य, स्थिर सम्पत्ति र सामाजिक प्रतिष्ठा अभिवृद्धिको सुखद वर्ष रहनेछ। व्यवसायमा नयाँ उचाइ हासिल हुनेछ। वैवाहिक बन्धनमा बाँधिने सुयोग बन्नेछ।',
      predictionEn: 'Bikram Sambat 2083 is an opulent and fulfilling year for Taurus, marked by asset acquisition, social prestige, and auspicious wedding bells for singles.',
      remedyNe: 'श्रीसूक्त पाठ गर्नुहोस् र गाईलाई नियमित हरियो घाँस खुवाउनुहोस्।',
      remedyEn: 'Recite Sri Suktam and feed green grass to sacred cows regularly.',
    },
  },

  mithun: {
    luckyColorNe: 'हरियो र सुन्तला',
    luckyColorEn: 'Emerald Green & Amber',
    luckyNumber: 5,
    luckyDirectionNe: 'उत्तर',
    luckyDirectionEn: 'North',
    gemstoneNe: 'पन्ना (Emerald)',
    gemstoneEn: 'Emerald',
    mantraNe: 'ॐ बुं बुधाय नमः',
    dailyBase: {
      predictionNe: 'बौद्धिक क्षमता र सञ्चार कलाको चौतर्फी प्रशंसा हुनेछ। विद्यार्थीहरूका लागि परीक्षा तथा नयाँ सीप सिक्न उत्तम समय छ। छोटो दूरीको फलदायी यात्रा हुन सक्छ। मित्रवर्गसँगको भेटघाटले मन प्रफुल्लित बनाउनेछ।',
      predictionEn: 'Outstanding day for communication, intellect, and negotiations. Students will excel in studies and creative pursuits. Profitable short-distance travel and lively gatherings with friends.',
      remedyNe: 'गणेशजीलाई २१ मुठा हरियो दुबो अर्पण गर्नुहोस्।',
      remedyEn: 'Offer 21 holy Dubo blades to Lord Ganesha in the morning.',
    },
    weeklyBase: {
      predictionNe: 'साताभर कार्यक्षेत्रमा नयाँ रणनीतिक योजनाहरू कार्यान्वयन गर्न सकिनेछ। सूचना प्रविधि, मिडिया, परामर्श र लेखन क्षेत्रमा आबद्ध व्यक्तिहरूलाई विशेष पहिचान मिल्नेछ। अनावश्यक खर्च नियन्त्रण गर्नुपर्नेछ।',
      predictionEn: 'A dynamic week for strategic planning and execution. Professionals in IT, media, and consulting will receive prestigious accolades. Keep a mindful eye on impulse spending.',
      remedyNe: 'बुधबार हरियो मुगको दाल दान गर्नुहोस्।',
      remedyEn: 'Donate green Moong lentils on Wednesday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना नयाँ व्यावसायिक सम्झौता र बौद्धिक कार्यमा ठूलो सफलता मिल्नेछ। पुराना मतभेदहरू सुल्झिनेछन्। विदेश अध्ययन वा रोजगारीका अवसरहरू बलियो बन्नेछन्। स्वास्थ्य सामान्यतया अनुकूल रहनेछ।',
      predictionEn: 'Remarkable progress in contractual agreements, academic honors, and foreign visas. Past misunderstandings with close ones will dissolve amicably.',
      remedyNe: 'घरमा हरियो तुलसीको बोट रोप्नुहोस् र नित्य जल चढाउनुहोस्।',
      remedyEn: 'Plant a holy Basil (Tulsi) plant at home and water it daily.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल मिथुन राशिका लागि ज्ञान, सीप र आर्थिक स्वावलम्बनको सुनौलो वर्ष साबित हुनेछ। व्यावसायिक साझेदारीमा लाभ हुनेछ र लामो समयदेखि थाँती रहेका योजनाहरू मूर्तरूप लिनेछन्।',
      predictionEn: 'Bikram Sambat 2083 unfolds as a golden chapter for Gemini with intellectual triumphs, thriving entrepreneurship, and solid financial security.',
      remedyNe: 'विष्णु सहस्रनाम पाठ गर्नुहोस् वा बुध मन्त्र नियमित जप गर्नुहोस्।',
      remedyEn: 'Chant the Vishnu Sahasranama or recite the Budha Beej Mantra regularly.',
    },
  },

  karkat: {
    luckyColorNe: 'दूधे सेतो र चाँदी',
    luckyColorEn: 'Milky White & Silver',
    luckyNumber: 2,
    luckyDirectionNe: 'उत्तर-पश्चिम',
    luckyDirectionEn: 'North-West',
    gemstoneNe: 'मोती (Pearl)',
    gemstoneEn: 'Natural Pearl',
    mantraNe: 'ॐ सों सोमाय नमः',
    dailyBase: {
      predictionNe: 'माता वा मातृपक्षबाट विशेष स्नेह र आशिर्वाद प्राप्त हुनेछ। घर-परिवारमा शान्ति र आनन्दको वातावरण छाउनेछ। जलसम्बन्धी व्यवसाय र कृषि कार्यमा लाभ हुनेछ। आफ्ना भावनाहरूलाई सन्तुलनमा राख्नु लाभदायी हुनेछ।',
      predictionEn: 'Deep emotional fulfillment and blessings from maternal elders. Peace and comfort prevail in domestic life. Favorable gains in hospitality, water ventures, and family businesses.',
      remedyNe: 'चाँदीको भाँडोबाट जल पिउनुहोस् वा शिवजीलाई जलधारा अर्पण गर्नुहोस्।',
      remedyEn: 'Drink water from a silver cup and offer holy water to Lord Shiva.',
    },
    weeklyBase: {
      predictionNe: 'साताभर पारिवारिक सद्भाव र आन्तरिक आत्मसन्तुष्टि उच्च रहनेछ। घरको साजसज्जा र नवीकरणमा समय बित्नेछ। पेशागत जिम्मेवारी कुशलतापूर्वक सम्पन्न गर्दा हाकिमको विश्वास जित्न सकिनेछ।',
      predictionEn: 'A comforting week overflowing with warmth and familial solidarity. Home improvement projects will progress smoothly. Superiors will recognize your meticulous dedication.',
      remedyNe: 'सोमबार सेतो फूल शिव मन्दिरमा चढाउनुहोस्।',
      remedyEn: 'Offer fragrant white flowers at a Shiva shrine on Monday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना मानसिक शान्ति र भाग्यको पूर्ण साथ मिल्नेछ। रोकिएका आर्थिक कारोबारहरू सुल्झिनेछन्। धार्मिक यात्रा र परोपकारी कार्यमा मन जानेछ। नयाँ सवारी साधन वा घरजग्गा खरिदको सम्भावना छ।',
      predictionEn: 'An auspicious month bringing serenity, fortune, and resolution of financial hurdles. Favorable timing for purchasing a vehicle or residential property.',
      remedyNe: 'पूर्णिमाका दिन चन्द्रमालाई अर्घ्य दिनुहोस्।',
      remedyEn: 'Offer sacred water (Arghya) to the full moon on Purnima night.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल कर्कट राशिका लागि आध्यात्मिक उन्नति, पारिवारिक सुख र दीर्घकालीन लगानीमा सफलताको वर्ष हुनेछ। स्वास्थ्यमा उल्लेख्य सुधार आउनेछ भने सामाजिक प्रतिष्ठा नयाँ उचाइमा पुग्नेछ।',
      predictionEn: 'Bikram Sambat 2083 heralds spiritual ascension, loving domestic harmony, and fruitful long-term investments for Cancer natives.',
      remedyNe: 'नित्य शिव पञ्चाक्षर मन्त्र (ॐ नमः शिवाय) जप गर्नुहोस्।',
      remedyEn: 'Chant Om Namah Shivaya 108 times every morning.',
    },
  },

  simha: {
    luckyColorNe: 'सुनौलो र गाढा सुन्तला',
    luckyColorEn: 'Golden Yellow & Royal Saffron',
    luckyNumber: 1,
    luckyDirectionNe: 'पूर्व',
    luckyDirectionEn: 'East',
    gemstoneNe: 'माणिक्य (Ruby)',
    gemstoneEn: 'Ruby',
    mantraNe: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    dailyBase: {
      predictionNe: 'नेतृत्व क्षमताको कदर हुनेछ र प्रशासनिक क्षेत्रमा प्रभुत्व बढ्नेछ। सरकारी काममा रहेका अड्चनहरू हट्नेछन्। मान-सम्मान र प्रतिष्ठामा बढोत्तरी हुनेछ। पिताको सहयोगले महत्त्वपूर्ण निर्णय लिन सहज हुनेछ।',
      predictionEn: 'Dynamic leadership and executive dominance in professional affairs. Bureaucratic and governmental approvals will move swiftly. Honor and respect from community leaders.',
      remedyNe: 'तामाको लोटाबाट उदाउँदो सूर्यलाई अर्घ्य अर्पण गर्नुहोस्।',
      remedyEn: 'Offer holy water to the rising sun from a clean copper vessel.',
    },
    weeklyBase: {
      predictionNe: 'साताभर उच्च पदस्थ अधिकारीहरूसँगको सम्बन्ध मजबुत बन्नेछ। नयाँ परियोजनाको नेतृत्व गर्ने जिम्मेवारी मिल्न सक्छ। आर्थिक स्थिति सबल रहनेछ। अहंकारबाट टाढा रही टिमवर्कमा जोड दिनु बुद्धिमानी हुनेछ।',
      predictionEn: 'A high-impact week forging powerful alliances with senior executives. Financial momentum remains resilient. Embrace humility and cooperative team synergy.',
      remedyNe: 'आइतबार रातो चन्दन वा केशरको टीका लगाउनुहोस्।',
      remedyEn: 'Apply a tilak of red sandalwood or saffron on Sunday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना व्यवसायमा उल्लेखनीय विस्तार र नयाँ कीर्तिमान कायम हुनेछ। प्रतिस्पर्धीहरू पछि पर्नेछन्। सन्तानको प्रगतिले गौरव बढाउनेछ। वैदेशिक सम्पर्कबाट उच्च लाभ हासिल हुनेछ।',
      predictionEn: 'An empowering month setting new milestones in business and public service. Competitors will be outmaneuvered. Outstanding news from children bring pride.',
      remedyNe: 'आदित्य हृदय स्तोत्रको नित्य पाठ गर्नुहोस्।',
      remedyEn: 'Recite the sacred Aditya Hridaya Stotram daily at sunrise.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल सिंह राशिका लागि शक्ति, सत्ता, पदोन्नति र विजयको ऐतिहासिक वर्ष रहनेछ। कार्यक्षेत्रमा शीर्ष स्थानमा पुग्ने अवसरहरू मिल्नेछन्। ठूला उद्योग वा उद्यमको थालनी सफल हुनेछ।',
      predictionEn: 'Bikram Sambat 2083 represents a triumphant year of authority, career breakthroughs, and monumental enterprise development for Leo.',
      remedyNe: 'वर्षभरि सूर्य उपासना र माता-पिताको चरण स्पर्श गरी आशीर्वाद लिनुहोस्।',
      remedyEn: 'Touch your parents’ feet daily for divine blessings and honor the Sun.',
    },
  },

  kanya: {
    luckyColorNe: 'गाढा हरियो र पहेँलो',
    luckyColorEn: 'Forest Green & Mustard Yellow',
    luckyNumber: 5,
    luckyDirectionNe: 'उत्तर',
    luckyDirectionEn: 'North',
    gemstoneNe: 'पन्ना वा पेरिडोट (Emerald)',
    gemstoneEn: 'Emerald / Peridot',
    mantraNe: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    dailyBase: {
      predictionNe: 'विश्लेषणात्मक क्षमता र सूक्ष्म योजनाले सफलता दिलाउनेछ। आर्थिक हिसाबकिताब र अडिटसम्बन्धी काम सहज बन्नेछ। स्वास्थ्यप्रति सचेत रहनुहोला, खानपानमा शुद्धता अपनाउनुहोस्। मामाघरबाट सहयोग मिल्नेछ।',
      predictionEn: 'Sharp analytical skills and detail-oriented planning bring impressive victory. Accounting and financial reconciliations will settle seamlessly. Maintain balanced dietary hygiene.',
      remedyNe: 'गाईलाई हरियो घाँस वा पालक खुवाउनुहोस्।',
      remedyEn: 'Feed fresh green grass or spinach to a cow in the morning.',
    },
    weeklyBase: {
      predictionNe: 'साताभर कार्यसम्पादनमा शुद्धता र प्रभावकारिता देखिनेछ। नयाँ प्राविधिक सीप सिक्ने अनुकूल अवसर जुर्नेछ। कानुनी वा प्रशासनिक झमेलाहरू समाधानको दिशामा अघि बढ्नेछन्।',
      predictionEn: 'Precision and high efficiency characterize this week. Splendid timing to master technical proficiencies. Legal or bureaucratic bottlenecks will untangle.',
      remedyNe: 'बुधबार हरियो वस्त्र धारण गरी गणेश स्तोत्र पाठ गर्नुहोस्।',
      remedyEn: 'Wear green apparel on Wednesday and recite Ganesha Stotram.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना कर्जा चुक्ता गर्न र आर्थिक भार कम गर्न सकिनेछ। जागिरमा स्थायित्व र नयाँ अवसरको आगमन हुनेछ। स्वास्थ्यमा स्फूर्ति बढ्नेछ। मित्रहरूको सल्लाह लाभदायक साबित हुनेछ।',
      predictionEn: 'A month ideal for debt clearance and consolidation of wealth. Career stability alongside lucrative job offers. Fresh enthusiasm in lifestyle habits.',
      remedyNe: 'विष्णु भगवानलाई तुलसीपत्र चढाउनुहोस्।',
      remedyEn: 'Offer fresh Tulsi leaves to Lord Vishnu on Ekadashis.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल कन्या राशिका लागि आर्थिक स्थिरता, बौद्धिक पहिचान र पारिवारिक सुखको कल्याणकारी वर्ष साबित हुनेछ। विदेश यात्राका अवसर खुल्नेछन् र बचतमा उल्लेखनीय वृद्धि हुनेछ।',
      predictionEn: 'Bikram Sambat 2083 delivers financial equilibrium, intellectual eminence, and domestic tranquility for Virgo natives.',
      remedyNe: 'गणेश अथर्वशीर्ष पाठ गर्नुहोस् र असहाय विद्यार्थीलाई शैक्षिक सामग्री दिनुहोस्।',
      remedyEn: 'Recite Ganapati Atharvashirsha and donate stationery to underprivileged children.',
    },
  },

  tula: {
    luckyColorNe: 'आकासे नीलो र चाँदी',
    luckyColorEn: 'Sky Blue & Silver',
    luckyNumber: 6,
    luckyDirectionNe: 'पश्चिम',
    luckyDirectionEn: 'West',
    gemstoneNe: 'हीरा वा ओपल (Diamond)',
    gemstoneEn: 'Diamond / White Zircon',
    mantraNe: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    dailyBase: {
      predictionNe: 'व्यापारिक साझेदारी र दाम्पत्य जीवनमा सुमधुर सम्बन्ध कायम हुनेछ। कानुनी मामिलामा तपाईंको पक्ष सबल बन्नेछ। कला, डिजाइन र फेशन क्षेत्रमा नयाँ ग्राहक वा अवसर मिल्नेछ। सार्वजनिक कार्यक्रममा आकर्षणको केन्द्र बन्नुहुनेछ।',
      predictionEn: 'Charming diplomacy and delightful harmony in marriage and business alliances. Legal and regulatory negotiations lean in your favor. Artistic and creative pursuits will dazzle.',
      remedyNe: 'महालक्ष्मीलाई कमलको फूल वा सेतो मिठाई अर्पण गर्नुहोस्।',
      remedyEn: 'Offer a fragrant lotus or white sweets to Goddess Mahalakshmi.',
    },
    weeklyBase: {
      predictionNe: 'साताभर सामाजिक सम्बन्धहरू विस्तार हुनेछन्। नयाँ व्यावसायिक सम्झौतामा हस्ताक्षर हुन सक्छ। जीवनसाथीसँग रोमान्टिक भ्रमणको योग छ। स्वास्थ्यमा सन्तुलन कायम रहनेछ।',
      predictionEn: 'An enchanting week expanding your elite social circle. Potential signing of lucrative commercial pacts. Romantic weekend escapades bring deep joy.',
      remedyNe: 'शुक्रबार सुगन्धित अत्तर (इत्र) प्रयोग गर्नुहोस्।',
      remedyEn: 'Use natural fragrant sandalwood or rose attar on Fridays.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना आर्थिक लाभ र व्यावसायिक प्रतिष्ठामा तीव्र वृद्धि हुनेछ। घरमा नयाँ विलासी सामान भित्र्याउन सकिनेछ। अविवाहितहरूका लागि विवाहको कुरा अगाडि बढ्नेछ।',
      predictionEn: 'A month of flourishing income streams and heightened social prestige. Acquisition of refined home decor. Highly favorable for engagement or wedding talks.',
      remedyNe: 'शुक्रबार कन्याहरूलाई खीर वा सेतो मिष्ठान्न खुवाउनुहोस्।',
      remedyEn: 'Feed sweet milk pudding (Kheer) to young girls on Friday.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल तुला राशिका लागि प्रेम, विवाह, साझेदारी र ऐश्वर्यको स्वर्णिम वर्ष बन्नेछ। बृहस्पतिको अनुकूलताले सबै प्रयासहरू सार्थक हुनेछन् र जीवनमा नयाँ उमङ्ग छाउनेछ।',
      predictionEn: 'Bikram Sambat 2083 radiates as a banner year of romance, triumphant partnerships, and luxury for Libra.',
      remedyNe: 'कनकधारा स्तोत्र नियमित पाठ गर्नुहोस्।',
      remedyEn: 'Chant Kanakadhara Stotram regularly on Friday evenings.',
    },
  },

  vrischika: {
    luckyColorNe: 'गाढा रातो र मरून',
    luckyColorEn: 'Maroon & Deep Crimson',
    luckyNumber: 9,
    luckyDirectionNe: 'उत्तर',
    luckyDirectionEn: 'North',
    gemstoneNe: 'मुगा (Red Coral)',
    gemstoneEn: 'Red Coral',
    mantraNe: 'ॐ अं अङ्गारकाय नमः',
    dailyBase: {
      predictionNe: 'शत्रु तथा प्रतिस्पर्धीहरूमाथि सहज विजय प्राप्त हुनेछ। अनुसन्धान, गुप्त विद्या र प्राविधिक काममा सफलता मिल्नेछ। आकस्मिक धनलाभको सम्भावना छ। स्वास्थ्यमा ऊर्जा र स्फूर्ति कायम रहनेछ।',
      predictionEn: 'Swift triumph over adversaries and competitors. Breakthrough insights in research, technology, and analytics. Unexpected monetary windfalls and vibrant stamina.',
      remedyNe: 'हनुमानजीलाई सिन्दूर र चमेलीको तेल अर्पण गर्नुहोस्।',
      remedyEn: 'Offer vermilion (Sindoor) and jasmine oil at a Hanuman temple.',
    },
    weeklyBase: {
      predictionNe: 'साताभर दृढ संकल्प र पराक्रमले असम्भव जस्ता लाग्ने कामहरू पनि फत्ते हुनेछन्। कर्जा चुक्ता गर्ने रणनीति सफल हुनेछ। गोप्य योजनाहरू गोप्य नै राख्दा अधिकतम लाभ हुनेछ।',
      predictionEn: 'Iron willpower and fierce focus conquer challenging hurdles. Strategic debt relief milestones. Keeping future moves confidential guarantees maximum leverage.',
      remedyNe: 'मंगलबार सुन्दरकाण्ड पाठ गर्नुहोस्।',
      remedyEn: 'Recite Sundarkand verses on Tuesday evening.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना कार्यक्षेत्रमा ठूलो परिवर्तन वा नयाँ पदभार सम्हाल्ने अवसर मिल्नेछ। रोकिएको पैतृक सम्पत्ति हात लाग्नेछ। स्वास्थ्यमा पुरानो रोगबाट मुक्ति मिल्नेछ।',
      predictionEn: 'A transformative month marked by executive promotions or pivotal career transitions. Resolution of ancestral inheritance. Remarkable recovery in overall health.',
      remedyNe: 'महिनाको पहिलो मंगलबार रातो दाल वा गुड दान गर्नुहोस्।',
      remedyEn: 'Donate red lentils or jaggery on the first Tuesday of the month.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल वृश्चिक राशिका लागि शक्ति, साधना, रोगमुक्ति र आर्थिक समृद्धिको विशेष वर्ष हुनेछ। लामो समयदेखिका चुनौतीहरू परास्त हुनेछन् र आत्मबल नयाँ शिखरमा पुग्नेछ।',
      predictionEn: 'Bikram Sambat 2083 is a year of empowerment, spiritual mastery, robust immunity, and financial abundance for Scorpio.',
      remedyNe: 'हनुमान बाहुक पाठ गर्नुहोस् र मंगलबार तामसिक भोजन त्याग गर्नुहोस्।',
      remedyEn: 'Recite Hanuman Bahuka and observe vegetarian discipline on Tuesdays.',
    },
  },

  dhanu: {
    luckyColorNe: 'पहेँलो र सुनौलो',
    luckyColorEn: 'Saffron & Imperial Gold',
    luckyNumber: 3,
    luckyDirectionNe: 'उत्तर-पूर्व (ईशान)',
    luckyDirectionEn: 'North-East',
    gemstoneNe: 'पुखराज (Yellow Sapphire)',
    gemstoneEn: 'Yellow Sapphire',
    mantraNe: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    dailyBase: {
      predictionNe: 'धार्मिक तथा आध्यात्मिक कार्यमा मन रमाउनेछ। गुरुजन र मान्यजनको मार्गदर्शनले जीवनमा नयाँ बाटो देखाउनेछ। उच्च शिक्षा र अनुसन्धानमा प्रगति हुनेछ। सन्तानबाट सुखद समाचार प्राप्त हुनेछ।',
      predictionEn: 'Spiritual upliftment and divine wisdom illuminate the day. Guidance from respected mentors reveals clear directions. Academic triumphs and joyous tidings from children.',
      remedyNe: 'बृहस्पति भगवानको ध्यान गरी निधारमा केशरको टीका लगाउनुहोस्।',
      remedyEn: 'Meditate on Lord Brihaspati and apply a saffron or turmeric tilak.',
    },
    weeklyBase: {
      predictionNe: 'साताभर भाग्यको दरिलो साथ मिल्नेछ। तीर्थयात्रा वा लामो दूरीको यात्राको योजना बन्नेछ। विश्वविद्यालय, कानुन वा अन्तर्राष्ट्रिय संस्थामा आबद्ध व्यक्तिहरूलाई ठूलो ख्याति प्राप्त हुनेछ।',
      predictionEn: 'Good fortune attends your endeavors throughout the week. Travel plans to sacred sites will materialize. Splendid recognition in academia, law, and diplomacy.',
      remedyNe: 'बिहीबार गाईलाई चनाको दाल र गुड खुवाउनुहोस्।',
      remedyEn: 'Feed soaked chana dal and golden jaggery to a cow on Thursday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना नयाँ ज्ञान, सीप र आर्थिक संकलनमा उच्च उपलब्धि हासिल हुनेछ। लगानी विस्तार गर्ने उत्तम समय छ। घरमा मांगलिक कार्य सम्पन्न हुनेछ। समाजमा प्रतिष्ठा बढ्नेछ।',
      predictionEn: 'Exceptional intellectual breakthroughs and solid wealth accumulation this month. Auspicious timeline for expanding investments and hosting sacred home rituals.',
      remedyNe: 'बिहीबार पहेँलो वस्त्र वा पहेँलो फलफूल दान गर्नुहोस्।',
      remedyEn: 'Donate yellow garments or golden fruits to an elder on Thursday.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल धनु राशिका लागि भाग्यवृद्धि, सन्तान सुख, उच्च शिक्षा र विदेश यात्राको अत्यन्त शुभ वर्ष साबित हुनेछ। बृहस्पतिको अनुकूलताले जीवनका हरेक क्षेत्रमा विजय हासिल हुनेछ।',
      predictionEn: 'Bikram Sambat 2083 shines as an extraordinary year of fortune, academic glory, progeny blessings, and international recognition for Sagittarius.',
      remedyNe: 'विष्णु सहस्रनाम नियमित पाठ गर्नुहोस् र गुरुको सम्मान गर्नुहोस्।',
      remedyEn: 'Recite Vishnu Sahasranama regularly and honor your mentors.',
    },
  },

  makar: {
    luckyColorNe: 'नीलो र कालो',
    luckyColorEn: 'Navy Blue & Charcoal',
    luckyNumber: 8,
    luckyDirectionNe: 'पश्चिम',
    luckyDirectionEn: 'West',
    gemstoneNe: 'नीलम (Blue Sapphire)',
    gemstoneEn: 'Blue Sapphire / Amethyst',
    mantraNe: 'ॐ शं शनैश्चराय नमः',
    dailyBase: {
      predictionNe: 'कठोर परिश्रम र धैर्यको मीठो फल मिल्नेछ। कार्यक्षेत्रमा नयाँ जिम्मेवारी वा पदोन्नतिको सम्भावना छ। जग्गा-जमिन र अचल सम्पत्तिसम्बन्धी काम सहज बन्नेछ। पिता तथा वरिष्ठहरूको अनुभव उपयोगी हुनेछ।',
      predictionEn: 'Steadfast perseverance bears delicious fruit today. Potential promotions and executive responsibilities. Real estate and construction transactions will conclude favorably.',
      remedyNe: 'शनिदेवलाई तोरीको तेलको दियो बाल्नुहोस्।',
      remedyEn: 'Light an earthen mustard oil lamp dedicated to Lord Shani.',
    },
    weeklyBase: {
      predictionNe: 'साताभर कार्यक्षेत्रमा अनुशासन र समर्पणको प्रशंसा हुनेछ। पुराना समस्याहरू क्रमबद्ध रूपमा समाधान हुँदै जानेछन्। आर्थिक मामिलामा दीर्घकालीन योजना बनाउनु लाभदायक हुनेछ।',
      predictionEn: 'Your disciplined diligence wins widespread admiration this week. Complex systemic issues resolve step by step. Solid foundation for long-term investments.',
      remedyNe: 'शनिबार कालो तिल वा फलामको वस्तु दान गर्नुहोस्।',
      remedyEn: 'Donate black sesame seeds or iron utensils on Saturday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना करियरमा ऐतिहासिक फड्को मार्न सकिनेछ। प्रशासनिक अड्चनहरू समाप्त हुनेछन्। परिवारमा आर्थिक सुरक्षाको प्रत्याभूति हुनेछ। स्वास्थ्यमा क्रमशः सुधार आउनेछ।',
      predictionEn: 'A milestone month for career leaps and structural breakthroughs. Regulatory red tape evaporates. Family enjoys resilient financial safety and peace.',
      remedyNe: 'शनिबार पिपलको रूखमा जल चढाउनुहोस् र परिक्रमा गर्नुहोस्।',
      remedyEn: 'Water the sacred Peepal tree and circumambulate it seven times on Saturday.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल मकर राशिका लागि साढेसातीको अन्तिम प्रभाव समाप्त हुँदै जाने र नयाँ आर्थिक समृद्धिको युग सुरु हुने वर्ष हो। ठूला उद्योग र व्यावसायिक लगानीमा ऐतिहासिक लाभ मिल्नेछ।',
      predictionEn: 'Bikram Sambat 2083 heralds liberation from heavy transits and ushers in a magnificent dawn of wealth, stability, and executive power for Capricorn.',
      remedyNe: 'हनुमान चालिसा र दशरथकृत शनि स्तोत्र नियमित पाठ गर्नुहोस्।',
      remedyEn: 'Recite Hanuman Chalisa and Dasharatha Shani Stotram every Saturday.',
    },
  },

  kumbha: {
    luckyColorNe: 'आकासे नीलो र बैजनी',
    luckyColorEn: 'Electric Blue & Violet',
    luckyNumber: 8,
    luckyDirectionNe: 'पश्चिम',
    luckyDirectionEn: 'West',
    gemstoneNe: 'नीलम वा जामुनिया (Blue Sapphire/Amethyst)',
    gemstoneEn: 'Blue Sapphire / Amethyst',
    mantraNe: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    dailyBase: {
      predictionNe: 'नयाँ र क्रान्तिकारी विचारहरूले कार्यक्षेत्रमा नयाँ दिशा दिनेछ। सामाजिक तथा परोपकारी कार्यमा संलग्न हुँदा आत्मसन्तुष्टि मिल्नेछ। प्राविधिक अनुसन्धान र वैज्ञानिक खोजमा सफलता मिल्नेछ। मित्रहरूको भरपुर सहयोग प्राप्त हुनेछ।',
      predictionEn: 'Innovative and visionary ideas break fresh ground in your career. Philanthropic contributions bring profound fulfillment. Breakthroughs in technology, science, and community leadership.',
      remedyNe: 'अनाथ वा असहाय व्यक्तिलाई कालो कम्बल वा न्यानो कपडा दान गर्नुहोस्।',
      remedyEn: 'Donate warm clothes or blankets to the homeless.',
    },
    weeklyBase: {
      predictionNe: 'साताभर बौद्धिक मञ्च र सामूहिक परियोजनाहरूमा तपाईंको आवाज प्रभावकारी रहनेछ। आर्थिक लाभका नयाँ स्रोतहरू पहिचान हुनेछन्। स्वास्थ्यमा नियमित व्यायामले स्फूर्ति दिनेछ।',
      predictionEn: 'Your progressive voice commands profound respect across panels and collaborative projects. Emerging income channels open up. Maintain holistic physical workouts.',
      remedyNe: 'शनिबार काग र कालो कुकुरलाई रोटी खुवाउनुहोस्।',
      remedyEn: 'Feed bread and biscuits to crows and dogs on Saturday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना नयाँ प्रविधि, स्टार्टअप र सामाजिक संस्थामा ठूलो सफलता मिल्नेछ। पुराना ऋणहरूबाट मुक्ति मिल्ने संकेत छ। लामो यात्रा सुखद र फलदायी रहनेछ।',
      predictionEn: 'Spectacular achievements in technological startups, innovation, and NGO initiatives. Debt obligations diminish substantially. Rewarding global travel.',
      remedyNe: 'शनि मन्दिरमा तोरीको तेल र कालो मास दान गर्नुहोस्।',
      remedyEn: 'Offer mustard oil and black grams at a Shani temple.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल कुम्भ राशिका लागि आत्म-अन्वेषण, सामाजिक नेतृत्व र आर्थिक पुनरुत्थानको वर्ष हुनेछ। कडा मेहनतको भरपुर मूल्यांकन हुनेछ र दीर्घकालीन प्रतिष्ठा स्थापित हुनेछ।',
      predictionEn: 'Bikram Sambat 2083 brings visionary social leadership, financial resurgence, and profound self-actualization for Aquarius.',
      remedyNe: 'महामृत्युञ्जय मन्त्र नित्य जप गर्नुहोस् र गरिबको सेवा गर्नुहोस्।',
      remedyEn: 'Chant the Maha Mrityunjaya Mantra daily and serve the needy.',
    },
  },

  meen: {
    luckyColorNe: 'पहेंलो र समुद्र निलो',
    luckyColorEn: 'Golden Yellow & Aqua Blue',
    luckyNumber: 3,
    luckyDirectionNe: 'उत्तर-पूर्व (ईशान)',
    luckyDirectionEn: 'North-East',
    gemstoneNe: 'पुखराज वा मुक्ता (Yellow Sapphire/Pearl)',
    gemstoneEn: 'Yellow Sapphire / Pearl',
    mantraNe: 'ॐ बृं बृहस्पतये नमः',
    dailyBase: {
      predictionNe: 'अन्तर्ज्ञान र आध्यात्मिक चेतना उच्च रहनेछ। कला, साहित्य, संगीत र ध्यानमा विशेष रुचि जाग्नेछ। वैदेशिक सम्पर्क र परोपकारी कामबाट सन्तुष्टि मिल्नेछ। आर्थिक स्थितिमा सुधारका संकेतहरू देखिनेछन्।',
      predictionEn: 'Intuition and spiritual sensitivity reach their zenith. Splendid creativity in literature, arts, music, and meditation. Beneficial foreign contacts and inner peace.',
      remedyNe: 'केराको रूखमा जल चढाउनुहोस् र भगवान नारायणको ध्यान गर्नुहोस्।',
      remedyEn: 'Water a sacred banana tree and meditate on Lord Narayana.',
    },
    weeklyBase: {
      predictionNe: 'साताभर परोपकार र मानवीय सेवामा संलग्न हुने सुअवसर मिल्नेछ। विदेश अध्ययन वा अध्यात्मसम्बन्धी योजनाहरू अघि बढ्नेछन्। खर्चमा थोरै नियन्त्रण राख्दा बचत सन्तोषजनक हुनेछ।',
      predictionEn: 'A spiritually enriching week immersed in charitable works and noble aspirations. International travel and study visas progress favorably. Mindful budgeting keeps finances strong.',
      remedyNe: 'बिहीबार मन्दिरमा पहेँलो फूल र फलफूल अर्पण गर्नुहोस्।',
      remedyEn: 'Offer yellow flowers and sweet fruits at a temple on Thursday.',
    },
    monthlyBase: {
      predictionNe: 'यस महिना ज्ञान, विवेक र धर्म-कर्ममा विशेष अभिरुचि बढ्नेछ। सन्तानको उच्च शिक्षामा सफलता मिल्नेछ। रोकिएका कार्यहरू देवकृपाले सम्पन्न हुनेछन्। पारिवारिक सुखमा बढोत्तरी हुनेछ।',
      predictionEn: 'A blessed month fostering wisdom, divine grace, and spiritual elevation. Progeny achieves prestigious academic success. Family life blossoms with harmony.',
      remedyNe: 'बिहीबार पहेँलो चन्दन घोटेर विष्णु भगवानलाई चढाउनुहोस्।',
      remedyEn: 'Offer fragrant yellow sandalwood paste to Lord Vishnu.',
    },
    yearlyBase: {
      predictionNe: 'वि.सं. २०८३ साल मीन राशिका लागि आध्यात्मिक सिद्धि, वैदेशिक सफलता र आर्थिक सुदृढीकरणको सुखद वर्ष साबित हुनेछ। बृहस्पतिको शुभ अनुकम्पाले सबै मनोकामनाहरू पूर्ण हुनेछन्।',
      predictionEn: 'Bikram Sambat 2083 manifests as a sublime year of spiritual enlightenment, international accomplishments, and deep financial stability for Pisces.',
      remedyNe: 'गुरु मन्त्र नित्य जप गर्नुहोस् र साधु-सन्तको सेवा गर्नुहोस्।',
      remedyEn: 'Chant your Guru Mantra daily and honor spiritual saints.',
    },
  },
};

/**
 * Generate dynamic, live horoscope for any Rashi, period, and date
 */
export function getDynamicHoroscope(
  rashiId: RashiId,
  period: HoroscopePeriod,
  todayBs?: NepaliDate,
  lang: Language = 'ne'
): DailyHoroscope {
  const currentBs = todayBs || adToBs(new Date());
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat
  const dayPlanetInfo = WEEKDAY_PLANETS[dayOfWeek] || WEEKDAY_PLANETS[0];
  const bank = RASHI_FORECAST_BANK[rashiId] || RASHI_FORECAST_BANK.mesh;

  // Pseudo-random deterministic day seed based on date and rashi to generate fluctuating scores
  const daySeed = (currentBs.year * 365 + currentBs.month * 31 + currentBs.day + rashiId.charCodeAt(0)) % 100;
  const baseRating = 4 + (daySeed % 2); // 4 or 5 stars

  const scores = {
    love: 75 + ((daySeed * 7) % 23),
    career: 78 + ((daySeed * 11) % 21),
    finance: 72 + ((daySeed * 13) % 26),
    health: 76 + ((daySeed * 17) % 22),
    travel: 70 + ((daySeed * 19) % 28),
  };

  // Date formatting per period
  let dateTitle = '';
  let predictionNe = '';
  let predictionEn = '';
  let remedyNe = '';
  let remedyEn = '';

  const monthNameNe = BS_MONTH_NAMES_NE[currentBs.month - 1] || 'असोज';
  const monthNameEn = BS_MONTH_NAMES_EN[currentBs.month - 1] || 'Ashwin';
  const yearBsDigits = toNepaliDigits(currentBs.year);

  if (period === 'daily') {
    dateTitle = lang === 'ne' 
      ? `दैनिक राशिफल • ${toNepaliDigits(currentBs.day)} ${monthNameNe} ${yearBsDigits}`
      : `Daily Horoscope • ${currentBs.day} ${monthNameEn} ${currentBs.year} BS`;
    predictionNe = bank.dailyBase.predictionNe;
    predictionEn = bank.dailyBase.predictionEn;
    remedyNe = bank.dailyBase.remedyNe;
    remedyEn = bank.dailyBase.remedyEn;
  } else if (period === 'weekly') {
    const weekNum = Math.ceil(currentBs.day / 7);
    const weekNumNe = weekNum === 1 ? 'पहिलो' : weekNum === 2 ? 'दोस्रो' : weekNum === 3 ? 'तेस्रो' : 'चौथो';
    dateTitle = lang === 'ne'
      ? `साप्ताहिक राशिफल • ${monthNameNe} ${weekNumNe} हप्ता (${yearBsDigits})`
      : `Weekly Horoscope • ${monthNameEn} Week ${weekNum} (${currentBs.year} BS)`;
    predictionNe = bank.weeklyBase.predictionNe;
    predictionEn = bank.weeklyBase.predictionEn;
    remedyNe = bank.weeklyBase.remedyNe;
    remedyEn = bank.weeklyBase.remedyEn;
  } else if (period === 'monthly') {
    dateTitle = lang === 'ne'
      ? `मासिक राशिफल • ${monthNameNe} महिनाको पूर्ण फलादेश (${yearBsDigits})`
      : `Monthly Horoscope • Month of ${monthNameEn} (${currentBs.year} BS)`;
    predictionNe = bank.monthlyBase.predictionNe;
    predictionEn = bank.monthlyBase.predictionEn;
    remedyNe = bank.monthlyBase.remedyNe;
    remedyEn = bank.monthlyBase.remedyEn;
  } else {
    // Yearly
    dateTitle = lang === 'ne'
      ? `वार्षिक राशिफल • वि.सं. ${yearBsDigits} (सन् ${now.getFullYear()}-${now.getFullYear() + 1})`
      : `Yearly Horoscope • BS ${currentBs.year} (AD ${now.getFullYear()}-${now.getFullYear() + 1})`;
    predictionNe = bank.yearlyBase.predictionNe;
    predictionEn = bank.yearlyBase.predictionEn;
    remedyNe = bank.yearlyBase.remedyNe;
    remedyEn = bank.yearlyBase.remedyEn;
  }

  return {
    rashiId,
    date: dateTitle,
    rating: baseRating,
    scores,
    predictionNe,
    predictionEn,
    luckyColorNe: bank.luckyColorNe,
    luckyColorEn: bank.luckyColorEn,
    luckyNumber: bank.luckyNumber,
    luckyDirectionNe: bank.luckyDirectionNe,
    luckyDirectionEn: bank.luckyDirectionEn,
    favorableTime: dayPlanetInfo.auspiciousTime,
    unfavorableTime: dayPlanetInfo.rahuKaal,
    remedyNe,
    remedyEn,
    gemstoneNe: bank.gemstoneNe,
    gemstoneEn: bank.gemstoneEn,
    mantraNe: bank.mantraNe,
  };
}
