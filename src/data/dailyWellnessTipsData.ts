import { NepaliDate } from '../types';
import { getCurrentNepaliDate } from '../utils/nepaliCalendar';

export type WellnessTipType = 'ayurveda' | 'yoga' | 'herbal' | 'pranayama';

export interface SeasonalWellnessTip {
  id: string;
  seasonId: 'basanta' | 'grishma' | 'barsha' | 'sharad' | 'hemanta' | 'shishir';
  seasonNameNe: string;
  seasonNameEn: string;
  sanskritSeason: string;
  type: WellnessTipType;
  typeNe: string;
  typeEn: string;
  titleNe: string;
  titleEn: string;
  sanskritName?: string;
  doshaFocusNe: string;
  doshaFocusEn: string;
  shortSummaryNe: string;
  shortSummaryEn: string;
  practiceTimingNe: string;
  practiceTimingEn: string;
  durationMinutes?: number;
  stepsNe: string[];
  stepsEn: string[];
  benefitsNe: string[];
  benefitsEn: string[];
  cautionsNe?: string[];
  cautionsEn?: string[];
  herbalIngredientsNe?: string;
  herbalIngredientsEn?: string;
  tags: string[];
}

export const SEASONAL_WELLNESS_TIPS: SeasonalWellnessTip[] = [
  // ==========================================
  // 1. शरद ऋतु (Sharad - Autumn / Ashoj & Kartik - Months 6, 7)
  // Dosha Focus: Pitta Pacification (पित्त शमन)
  // ==========================================
  {
    id: 'sharad-tip-1',
    seasonId: 'sharad',
    seasonNameNe: 'शरद ऋतु',
    seasonNameEn: 'Sharad Ritu (Autumn)',
    sanskritSeason: 'शरद् ऋतु (पित्त प्रशमन)',
    type: 'ayurveda',
    typeNe: 'आयुर्वेदिक दिनचर्या',
    typeEn: 'Ayurvedic Practice',
    titleNe: 'घृतपान र त्रिफला सेवन (पित्त शमन)',
    titleEn: 'Morning Cow Ghee & Triphala (Pitta Soothing)',
    sanskritName: 'घृतप्राशन व त्रिफला सेवनम्',
    doshaFocusNe: 'पित्त दोष शान्ति (Pitta Balance)',
    doshaFocusEn: 'Pitta Pacification & Liver Care',
    shortSummaryNe: 'शरद ऋतुमा वर्षाको ओसपछि चर्को घाम लाग्दा पित्त सञ्चय हुने हुँदा बिहान शुद्ध गाईको घ्यू र राति त्रिफला सेवनले शरीरको आन्तरिक दाह शान्त पार्छ।',
    shortSummaryEn: 'In autumn, intense sun following monsoon dampness flares internal Pitta; morning cow ghee and evening Triphala soothe acidity and body heat.',
    practiceTimingNe: 'बिहान खाली पेट वा राति सुत्नुअघि',
    practiceTimingEn: 'Early morning empty stomach or at bedtime',
    durationMinutes: 5,
    stepsNe: [
      '१. बिहान १ गिलास मनतातो पानीमा १ चम्चा शुद्ध गाईको घ्यू घोलेर पिउने बानी गर्नुहोस्।',
      '२. घ्यू खान नसक्नेले राति सुत्नुअघि १/२ चम्चा त्रिफला चूर्ण मनतातो पानीसँग लिनुहोस्।',
      '३. दिनभर अत्यधिक पिरो, चिल्लो र अमिलो खाना त्यागेर गुलियो, तीतो र कषाय (टरो) रसयुक्त ताजा भोजन गर्नुहोस्।'
    ],
    stepsEn: [
      '1. Sip 1 teaspoon of pure warm cow ghee dissolved in half a glass of warm water early morning.',
      '2. Alternatively, consume 1/2 tsp Triphala powder with warm water before sleeping to gently detoxify the gut.',
      '3. Reduce excessively spicy, fried, and fermented foods; embrace naturally sweet, bitter, and astringent seasonal produce.'
    ],
    benefitsNe: [
      'पेटको जलन, एसिडिटी र मुखमा आउने घाउ कम गर्छ',
      'कलेजोको कार्यक्षमता सुधार्छ र आँखाको ज्योति तेजिलो बनाउँछ',
      'छालाको चमक बढाउँछ र शरद ऋतुको डण्डिफोर तथा एलर्जी नियन्त्रण गर्छ'
    ],
    benefitsEn: [
      'Relieves gastric hyperacidity, heartburn, and aphthous ulcers',
      'Rejuvenates hepatic liver metabolism and enhances visual clarity',
      'Restores radiant skin luster and calms autumn breakouts'
    ],
    cautionsNe: [
      'अत्यधिक कफ वा उच्च कोलेस्ट्रोल भएका व्यक्तिहरूले घ्यूको मात्रा चिकित्सकसँग सल्लाह गरेर मात्र लिनुहोस्।'
    ],
    cautionsEn: [
      'Individuals with severe Kapha blockages or untreated hyperlipidemia should moderate ghee intake.'
    ],
    tags: ['पित्त', 'घ्यू', 'त्रिफला', 'एसिडिटी', 'शरद']
  },
  {
    id: 'sharad-tip-2',
    seasonId: 'sharad',
    seasonNameNe: 'शरद ऋतु',
    seasonNameEn: 'Sharad Ritu (Autumn)',
    sanskritSeason: 'शरद् ऋतु (योगासन)',
    type: 'yoga',
    typeNe: 'ऋतु अनुकूल योगासन',
    typeEn: 'Seasonal Yoga Pose',
    titleNe: 'भुजङ्गासन (सर्पासन / Cobra Pose)',
    titleEn: 'Bhujangasana (Cobra Pose)',
    sanskritName: 'भुजङ्गासन (Bhujangasana)',
    doshaFocusNe: 'पित्त र वात सन्तुलन',
    doshaFocusEn: 'Pitta & Vata Harmonization',
    shortSummaryNe: 'पेटका भित्री अङ्गहरू, कलेजो र फियोलाई सक्रिय बनाई शरद ऋतुको मन्द पाचन र एसिडिटी सन्तुलनमा ल्याउने सरल तर शक्तिशाली आसन।',
    shortSummaryEn: 'Gently massages internal abdominal organs, stimulates the liver and spleen, and neutralizes autumn metabolic sluggishness.',
    practiceTimingNe: 'बिहान शौचपछि खाली पेट (५ देखि १० मिनेट)',
    practiceTimingEn: 'Morning empty stomach after freshening up (5-10 mins)',
    durationMinutes: 8,
    stepsNe: [
      '१. म्याटमा पेटको भरमा घोप्टो परेर सुत्नुहोस् र दुवै खुट्टालाई पछाडि जोड्नुहोस्।',
      '२. दुवै हातका हत्केला छातीको दायाँ-बायाँ जमिनमा राख्नुहोस्, कुहिनो शरीर नजिक रहोस्।',
      '३. लामो सास तान्दै नाभीसम्मको शरीरलाई बिस्तारै माथि उठाउनुहोस् र नजर आकाशतर्फ लैजानुहोस्।',
      '४. १५-३० सेकेन्ड सामान्य श्वासप्रश्वासमा यही स्थितिमा बस्नुहोस् र सास फाल्दै पूर्ववत अवस्थामा फर्कनुहोस् (३ पटक दोहोर्याउनुहोस्)।'
    ],
    stepsEn: [
      '1. Lie flat on your stomach with legs extended and feet together.',
      '2. Position your palms on the floor directly beneath your shoulders, elbows close to your torso.',
      '3. Inhale deeply and smoothly lift your chest up to the navel level, gazing gently upward.',
      '4. Hold for 15-30 seconds with calm nasal breathing, then exhale slowly to lower down. Repeat 3 cycles.'
    ],
    benefitsNe: [
      'कलेजो र पाचन ग्रन्थीहरू सक्रिय पारी एसिडिटी र अपच हटाउँछ',
      'ढाड र मेरुदण्डको लचकता बढाउँछ र दिनभरको थकान मेटाउँछ',
      'फोक्सो चौडा बनाई अक्सिजन ग्रहण गर्ने क्षमता बढाउँछ'
    ],
    benefitsEn: [
      'Stimulates hepatic enzymes, reducing acid reflux and indigestion',
      'Relieves lumbar tension and strengthens the thoracic spine',
      'Expands lung volume, elevating daily cellular oxygenation'
    ],
    cautionsNe: [
      'हर्निया, भर्खरै पेटको शल्यक्रिया भएका वा गर्भवती महिलाहरूले यो आसन नगर्नुहोस्।'
    ],
    cautionsEn: [
      'Avoid if having acute abdominal hernia, recent surgery, or pregnancy.'
    ],
    tags: ['योग', 'भुजङ्गासन', 'कलेजो', 'ढाड', 'शरद']
  },
  {
    id: 'sharad-tip-3',
    seasonId: 'sharad',
    seasonNameNe: 'शरद ऋतु',
    seasonNameEn: 'Sharad Ritu (Autumn)',
    sanskritSeason: 'शरद् ऋतु (प्राणायाम)',
    type: 'pranayama',
    typeNe: 'शीतल प्राणायाम',
    typeEn: 'Cooling Breathwork',
    titleNe: 'शीतली र शीतकारी प्राणायाम',
    titleEn: 'Sheetali & Sitkari (Cooling Breath)',
    sanskritName: 'शीतली प्राणायाम (Sheetali Pranayama)',
    doshaFocusNe: 'पित्त दोष शमन र मानसिक शान्ति',
    doshaFocusEn: 'Direct Pitta Cooling & Nervous Soothing',
    shortSummaryNe: 'जिब्रोलाई नलीको आकार बनाएर शीतल हावा भित्र तान्ने अभ्यास, जसले शरद ऋतुको आन्तरिक गर्मी, रिस र तिर्खा तत्काल शान्त पार्छ।',
    shortSummaryEn: 'A pristine yogic practice drawing cooled air through a curled tongue, immediately dropping core body heat and calming irritability.',
    practiceTimingNe: 'दिउँसो घामको समय वा बिहान-साँझ (५ मिनेट)',
    practiceTimingEn: 'Morning or late afternoon when feeling internal heat (5 mins)',
    durationMinutes: 5,
    stepsNe: [
      '१. सुखासन वा कुर्सीमा मेरुदण्ड सिधा पारेर बस्नुहोस् र आँखा बन्द गर्नुहोस्।',
      '२. जिब्रोलाई ओठ बाहिर निकालेर नली (Tube) जस्तो घुमाउनुहोस्।',
      '३. जिब्रोको नलीबाट बिस्तारै चिसो हावा भित्र तान्नुहोस् (जिब्रोमा शीतलता महसुस गर्नुहोस्)।',
      '४. मुख बन्द गरी दुवै नाकका प्वालबाट विस्तारै तातो हावा बाहिर फाल्नुहोस् (१० देखि १५ चक्र गर्नुहोस्)।'
    ],
    stepsEn: [
      '1. Sit upright comfortably in Sukhasana with spine elongated and eyes closed.',
      '2. Extend the tongue slightly and curl its outer edges into a straw/tube shape.',
      '3. Inhale deeply and steadily through the curled tongue, feeling pure coolness enter the throat.',
      '4. Close your mouth and exhale warm air slowly through both nostrils. Repeat 10-15 rounds.'
    ],
    benefitsNe: [
      'शरीरको तापक्रम तत्काल सन्तुलनमा ल्याउँछ र अत्यधिक तिर्खा मेटाउँछ',
      'रक्तचाप नियन्त्रण गर्न र क्रोध वा तनाव शान्त पार्न मद्दत गर्छ',
      'छालाको रातोपना र शरद ऋतुको डण्डिफोर कम गर्छ'
    ],
    benefitsEn: [
      'Naturally cools core body temperature and quenches cellular thirst',
      'Stabilizes arterial pressure and disperses frustration or anger',
      'Calms skin inflammation and seasonal autumnal erythema'
    ],
    cautionsNe: [
      'रुघाखोकी, टन्सिल वा दमका बिरामीले अत्यधिक चिसो मौसममा यो अभ्यास नगर्नुहोस्।'
    ],
    cautionsEn: [
      'Contraindicated during active upper respiratory infections, bronchitis, or winter chills.'
    ],
    tags: ['प्राणायाम', 'शीतली', 'पित्त', 'तनाव', 'शरद']
  },
  {
    id: 'sharad-tip-4',
    seasonId: 'sharad',
    seasonNameNe: 'शरद ऋतु',
    seasonNameEn: 'Sharad Ritu (Autumn)',
    sanskritSeason: 'शरद् ऋतु (हर्बल पेय)',
    type: 'herbal',
    typeNe: 'घरेलु आयुर्वेदिक पेय',
    typeEn: 'Herbal Elixir',
    titleNe: 'धनिया, सौंफ र मिश्रीको शीतल जल',
    titleEn: 'Coriander & Fennel Infused Cooling Water',
    sanskritName: 'धान्यक-हिमकषायम्',
    doshaFocusNe: 'पित्त र आमाशय शान्ति',
    doshaFocusEn: 'Stomach & Urinary Tract Soothing',
    shortSummaryNe: 'साबुत धनिया र सौंफलाई रातभर पानीमा भिजाएर बिहान मिश्री मिसाई पिउँदा शरद ऋतुको आन्तरिक दाह र पिसाबको पोलाइ तुरुन्त निको हुन्छ।',
    shortSummaryEn: 'Cold infusion of whole coriander seeds and fennel with rock sugar, revered in Ayurveda for resolving autumn urinary heat and acidity.',
    practiceTimingNe: 'बिहान खाली पेट वा दिउँसो खाजापछि',
    practiceTimingEn: 'Morning empty stomach or mid-afternoon',
    durationMinutes: 3,
    stepsNe: [
      '१. राति १ गिलास पानीमा १ चम्चा साबुत धनिया र १ चम्चा सौंफ हालेर ढाकेर राख्नुहोस्।',
      '२. बिहान यसलाई छानेर थोरै धागोवाला मिश्री (Rock Sugar) मिसाउनुहोस्।',
      '३. बिस्तारै घुट्को-घुट्को गरेर पिउनुहोस्।'
    ],
    stepsEn: [
      '1. Soak 1 tsp whole coriander seeds and 1 tsp fennel seeds in a glass of water overnight.',
      '2. Strain in the morning and sweeten with a small crystal of natural raw rock sugar (Mishri).',
      '3. Sip slowly and mindfully at ambient room temperature.'
    ],
    benefitsNe: [
      'पिसाब पोल्ने र शरद ऋतुको डिहाइड्रेशन निको पार्छ',
      'कलेजो र मिर्गौलालाई प्राकृतिक रूपमा फ्लस गर्छ',
      'आन्द्राको गर्मी शान्त पारी छाला सफा राख्छ'
    ],
    benefitsEn: [
      'Clears dysuria and soothes seasonal dehydration',
      'Gently detoxifies kidneys and liver pathways',
      'Promotes digestive calm and clear skin complexion'
    ],
    herbalIngredientsNe: 'साबुत धनिया १ चम्चा, सौंफ १ चम्चा, मिश्री आधा चम्चा, १ गिलास पानी',
    herbalIngredientsEn: '1 tsp coriander seeds, 1 tsp fennel seeds, 1/2 tsp rock sugar, 1 glass pure water',
    tags: ['धनिया', 'सौंफ', 'मिश्री', 'पिसाब', 'शरद']
  },

  // ==========================================
  // 2. हेमन्त ऋतु (Hemanta - Pre-Winter / Mangsir & Poush - Months 8, 9)
  // Dosha Focus: Vata Aggravation & Digestive Fire Stimulation (वात शान्ति र जठराग्नि)
  // ==========================================
  {
    id: 'hemanta-tip-1',
    seasonId: 'hemanta',
    seasonNameNe: 'हेमन्त ऋतु',
    seasonNameEn: 'Hemanta Ritu (Early Winter)',
    sanskritSeason: 'हेमन्त ऋतु (अभ्यङ्ग)',
    type: 'ayurveda',
    typeNe: 'आयुर्वेदिक दिनचर्या',
    typeEn: 'Ayurvedic Practice',
    titleNe: 'अभ्यङ्ग (मनतातो तोरी वा तिलको तेल मालिस)',
    titleEn: 'Abhyanga (Warm Sesame / Mustard Oil Massage)',
    sanskritName: 'अभ्यङ्गम् (स्नेहन)',
    doshaFocusNe: 'वात दोष शान्ति र जोर्नीको सुरक्षा',
    doshaFocusEn: 'Vata Pacification & Joint Lubrication',
    shortSummaryNe: 'जाडो बढ्दै जाँदा हावाले छाला र नशाहरू सुक्खा बनाउँछ। नुहाउनुअघि मनतातो तोरी वा तिलको तेलले शरीर मालिस गर्दा वात रोगबाट शतप्रतिशत जोगिन सकिन्छ।',
    shortSummaryEn: 'As cold winds rise, dry Vata depletes skin and joints; pre-bath warm sesame or mustard oil abhyanga insulates nerves and protects flexibility.',
    practiceTimingNe: 'बिहान नुहाउनु भन्दा १५ मिनेट अगाडि',
    practiceTimingEn: '15-20 minutes before a warm morning bath',
    durationMinutes: 15,
    stepsNe: [
      '१. शुद्ध तोरी वा तिलको तेललाई हल्का मनतातो बनाउनुहोस् (चाहिएमा २ पोटी लसुन पकाएर हाल्न सकिन्छ)।',
      '२. पैताला, घुँडा, ढाड र गर्दनका जोर्नीहरूमा गोलो-गोलो गरी हल्का दबाब दिँदै मालिस गर्नुहोस्।',
      '३. १५ मिनेट तेललाई छालामा सोस्न दिनुहोस् र मनतातो पानीले स्नान गर्नुहोस्।'
    ],
    stepsEn: [
      '1. Warm cold-pressed sesame or mustard oil gently in a bowl (optional: infuse with 2 garlic cloves).',
      '2. Massage with circular strokes on joints (knees, ankles, shoulders) and long strokes on limbs.',
      '3. Allow oil to penetrate the skin for 15 minutes before washing with warm water.'
    ],
    benefitsNe: [
      'जाडोमा हुने जोर्नी दुखाइ, ढाड दुखाइ र नशा खुम्चिने समस्या रोक्छ',
      'छालाको सुक्खापन हटाएर नरम, चम्किलो र स्वस्थ बनाउँछ',
      'गहिरो निद्रा लगाउँछ र स्नायु प्रणालीलाई बलियो बनाउँछ'
    ],
    benefitsEn: [
      'Prevents seasonal arthritis, lumbar stiffness, and sciatica flare-ups',
      'Eliminates winter xerosis, nourishing deep cutaneous tissues',
      'Induces restorative sleep and grounds nervous system stability'
    ],
    tags: ['अभ्यङ्ग', 'तेल मालिस', 'वात', 'जोर्नी', 'हेमन्त']
  },
  {
    id: 'hemanta-tip-2',
    seasonId: 'hemanta',
    seasonNameNe: 'हेमन्त ऋतु',
    seasonNameEn: 'Hemanta Ritu (Early Winter)',
    sanskritSeason: 'हेमन्त ऋतु (योगासन)',
    type: 'yoga',
    typeNe: 'ऋतु अनुकूल योगासन',
    typeEn: 'Seasonal Yoga Pose',
    titleNe: 'सूर्य नमस्कार (१२ चरण ऊर्जा साधना)',
    titleEn: 'Surya Namaskar (Sun Salutation 12 Steps)',
    sanskritName: 'सूर्य नमस्कार (Surya Namaskara)',
    doshaFocusNe: 'पाचन अग्नि र रक्तसञ्चार प्रदीप्त',
    doshaFocusEn: 'Stimulating Agni & Metabolic Circulation',
    shortSummaryNe: 'हेमन्त ऋतुको बिहानी जाडोमा शरीरको रक्तसञ्चार बढाउन, मुटुलाई न्यानो राख्न र अल्छीपन हटाउन ५ देखि १२ चक्र सूर्य नमस्कार सर्वोत्तम हो।',
    shortSummaryEn: 'Awakens peripheral blood flow in chilly mornings, elevates baseline metabolism, and builds winter endurance through 5-12 mindful rounds.',
    practiceTimingNe: 'बिहान सूर्योदयको समयमा (१० देखि १५ मिनेट)',
    practiceTimingEn: 'At sunrise on an empty stomach (10-15 mins)',
    durationMinutes: 12,
    stepsNe: [
      '१. प्रणामासनबाट सुरु गरी सास तान्दै हस्तउत्तानासनमा शरीर पछाडि झुकाउनुहोस्।',
      '२. सास फाल्दै पादहस्तासनमा भुइँ छुने र पालैपालो अश्वसञ्चालन तथा पर्वतासन गर्नुहोस्।',
      '३. साष्टाङ्ग प्रणाम, भुजङ्गासन हुँदै १२ वटै चरण पालना गरी विश्राम लिनुहोस् (५ देखि १२ चक्र)।'
    ],
    stepsEn: [
      '1. Begin in Pranamasana; inhale into Hastauttanasana arching backward with extended arms.',
      '2. Exhale into Padahastasana, then flow through Ashwa Sanchalanasana, Dandasana, and Parvatasana.',
      '3. Complete through Ashtanga Namaskara, Bhujangasana, and reverse back. Practice 5-12 rounds.'
    ],
    benefitsNe: [
      'सम्पूर्ण शरीरमा तत्काल ताप र रक्तसञ्चार पैदा गर्छ',
      'हेमन्त ऋतुमा उच्च हुने पाचन शक्तिलाई सन्तुलित रूपमा उपयोग गर्छ',
      'प्रतिरोधात्मक क्षमता (इम्युनिटी) बढाएर जाडोको रोगबाट जोगाउँछ'
    ],
    benefitsEn: [
      'Generates instantaneous systemic thermal circulation',
      'Channelizes winter’s peaked digestive fire (Jatharagni) healthily',
      'Fortifies immune defenses against cold weather viruses'
    ],
    cautionsNe: [
      'उच्च रक्तचाप वा मुटुका गम्भीर बिरामीले छिटो-छिटो नगरी बिस्तारै सामान्य गतिमा गर्नुहोस्।'
    ],
    cautionsEn: [
      'Practice at a gentle moderate cadence if having chronic hypertension or cardiac fatigue.'
    ],
    tags: ['सूर्य नमस्कार', 'योग', 'जाडो', 'ऊर्जा', 'हेमन्त']
  },
  {
    id: 'hemanta-tip-3',
    seasonId: 'hemanta',
    seasonNameNe: 'हेमन्त ऋतु',
    seasonNameEn: 'Hemanta Ritu (Early Winter)',
    sanskritSeason: 'हेमन्त ऋतु (हर्बल पेय)',
    type: 'herbal',
    typeNe: 'घरेलु आयुर्वेदिक पेय',
    typeEn: 'Herbal Elixir',
    titleNe: 'अदुवा, तुलसी र दालचिनीको न्यानो काढा',
    titleEn: 'Ginger, Tulsi & Cinnamon Warming Brew',
    sanskritName: 'आर्द्रक-तुलसी-त्वक् क्वाथम्',
    doshaFocusNe: 'कफ निवारण र फोक्सोको न्यानोपन',
    doshaFocusEn: 'Respiratory Warmth & Immunity',
    shortSummaryNe: 'बिहान-बिहान कलेजो र घाँटीमा चिसो पस्न नदिन अदुवा, तुलसी र दालचिनी उमालेर मह वा सखर मिसाई पिउँदा दिनभर स्फूर्ति रहन्छ।',
    shortSummaryEn: 'A comforting morning herbal decoction of crushed ginger, holy basil, and Ceylon cinnamon to guard vocal cords and prevent winter chills.',
    practiceTimingNe: 'बिहानी चियाको साटो वा साँझ (५ मिनेट)',
    practiceTimingEn: 'Morning breakfast alternative or dusk tea time',
    durationMinutes: 5,
    stepsNe: [
      '१. डेढ कप पानीमा १ टुक्रा अदुवा कुटेर, ५ वटा तुलसीको पात र सानो टुक्रा दालचिनी हाल्नुहोस्।',
      '२. पानी आधा घटेर १ कप नभएसम्म मन्द आँचमा उमाल्नुहोस्।',
      '३. मनतातो भएपछि १ चम्चा शुद्ध मह वा सखर मिसाएर चुस्की लिएर पिउनुहोस्।'
    ],
    stepsEn: [
      '1. Simmer 1.5 cups water with 1 inch crushed ginger, 5 fresh holy basil leaves, and 1 cinnamon stick.',
      '2. Reduce heat until liquid evaporates to 1 cup.',
      '3. Strain, let cool slightly to warm temperature, and stir in raw honey or jaggery.'
    ],
    benefitsNe: [
      'घाँटी खसखस हुने, टन्सिल सुन्निने र छातीमा चिसो बस्न दिँदैन',
      'शरीरको मेटाबोलिजम र प्राकृतिक ऊर्जा स्तर बढाउँछ',
      'रक्तसञ्चारमा सुधार ल्याई हातगोडा चिसो हुनबाट बचाउँछ'
    ],
    benefitsEn: [
      'Soothes pharyngeal tickles, tonisl congestion, and bronchitis onset',
      'Revitalizes sluggish baseline metabolism and immune vigor',
      'Enhances peripheral circulation to warm cold hands and feet'
    ],
    herbalIngredientsNe: 'अदुवा १ टुक्रा, तुलसी ५ पात, दालचिनी १ टुक्रा, मह १ चम्चा',
    herbalIngredientsEn: '1 inch fresh ginger, 5 Tulsi leaves, 1 cinnamon bark, 1 tsp raw honey',
    tags: ['अदुवा', 'तुलसी', 'दालचिनी', 'काढा', 'हेमन्त']
  },

  // ==========================================
  // 3. शिशिर ऋतु (Shishir - Deep Winter / Magh & Falgun - Months 10, 11)
  // Dosha Focus: Severe Vata Cold Waves & Kapha Accumulation (शीतलहर र कफ सञ्चय)
  // ==========================================
  {
    id: 'shishir-tip-1',
    seasonId: 'shishir',
    seasonNameNe: 'शिशिर ऋतु',
    seasonNameEn: 'Shishir Ritu (Late Winter)',
    sanskritSeason: 'शिशिर ऋतु (आहार रस)',
    type: 'ayurveda',
    typeNe: 'आयुर्वेदिक दिनचर्या',
    typeEn: 'Ayurvedic Practice',
    titleNe: 'तिल, चाकु र च्यवनप्राशको ऊर्जा सेवन',
    titleEn: 'Sesame, Chaku (Molasses) & Chyawanprash Care',
    sanskritName: 'तिल-गुड-च्यवनप्राश प्राशनम्',
    doshaFocusNe: 'वात-कफ सन्तुलन र भित्री ताप',
    doshaFocusEn: 'Vata Insulation & Ojas Fortification',
    shortSummaryNe: 'माघको मुटु काम्ने चिसो र शीतलहरबाट बच्न तिल, चाकु, घ्यू र च्यवनप्राशको नियमित सेवनले शरीरको आन्तरिक प्रतिरक्षा (ओजस) मजबुत बनाउँछ।',
    shortSummaryEn: 'Traditional Maghe Sankranti wisdom: sesame, molasses, and herbal Chyawanprash ignite deep internal heat against frostbites and cold waves.',
    practiceTimingNe: 'बिहानको नास्तापछि वा साँझ',
    practiceTimingEn: 'Morning after breakfast or early evening',
    durationMinutes: 3,
    stepsNe: [
      '१. बिहान १ चम्चा च्यवनप्राश मनतातो दूध वा तातो पानीसँग सेवन गर्नुहोस्।',
      '२. दिउँसो वा नास्तामा तिलको लड्डु, बदाम र सानो टुक्रा चाकु खाने बानी बसाल्नुहोस्।',
      '३. साँझ सुत्नुअघि पैतालामा तोरीको तेल दलेर न्यानो मोजा लगाउनुहोस्।'
    ],
    stepsEn: [
      '1. Take 1 teaspoon of authentic Chyawanprash with warm milk or lukewarm water in the morning.',
      '2. Incorporate sesame balls (Til ko laddu), walnuts, and a cube of jaggery/chaku with daytime meals.',
      '3. Rub mustard oil on foot soles before bedtime and wear insulated woolen socks.'
    ],
    benefitsNe: [
      'मुटु र फोक्सोलाई चिसोको कडा असरबाट सुरक्षित राख्छ',
      'शरीरमा क्याल्सियम, आइरन र प्राकृतिक तातोपन थप्दछ',
      'वृद्धवृद्धा र बालबालिकामा शीतलहरबाट हुने हाइपोथर्मिया रोक्छ'
    ],
    benefitsEn: [
      'Shields cardiovascular system and bronchial airways from severe frost',
      'Supplies natural plant iron, calcium, and sustained thermogenic calories',
      'Protects vulnerable seniors and children against winter hypothermia'
    ],
    tags: ['चाकु', 'तिल', 'च्यवनप्राश', 'शीतलहर', 'शिशिर']
  },
  {
    id: 'shishir-tip-2',
    seasonId: 'shishir',
    seasonNameNe: 'शिशिर ऋतु',
    seasonNameEn: 'Shishir Ritu (Late Winter)',
    sanskritSeason: 'शिशिर ऋतु (प्राणायाम)',
    type: 'pranayama',
    typeNe: 'ऊर्जावान प्राणायाम',
    typeEn: 'Energizing Breathwork',
    titleNe: 'भस्त्रिका प्राणायाम (धौंकनी श्वास)',
    titleEn: 'Bhastrika (Bellows Breath)',
    sanskritName: 'भस्त्रिका प्राणायाम (Bhastrika)',
    doshaFocusNe: 'कफ निवारण र फोक्सोको न्यानोपन',
    doshaFocusEn: 'Kapha Clearance & Core Heat Generation',
    shortSummaryNe: 'धौंकनी जस्तै फोक्सोबाट तीव्र गतिमा सास लिने र फाल्ने अभ्यास, जसले जाडोमा जमेको सिँगान, कफ र छातीको भारीपन २ मिनेटमै खुलाउँछ।',
    shortSummaryEn: 'Rapid, rhythmic bellows-style respiration that torches bronchial phlegm and creates spontaneous core body warmth.',
    practiceTimingNe: 'बिहान खाली पेट घरभित्र न्यानो ठाउँमा (३ देखि ५ मिनेट)',
    practiceTimingEn: 'Morning indoors in a warm, sheltered spot (3-5 mins)',
    durationMinutes: 5,
    stepsNe: [
      '१. सिधा ढाड पारेर बस्नुहोस् र दुवै हात घुँडामा राख्नुहोस्।',
      '२. दुवै नाकबाट बलपूर्वक लामो सास तान्नुहोस् र तत्काल बलपूर्वक बाहिर फाल्नुहोस्।',
      '३. मध्यम गतिमा लगातार २० पटक सास लिने र फाल्ने (१ चक्र) गर्नुहोस्।',
      '४. ३ चक्रपछि लामो गहिरो सास तानेर बिस्तारै छाड्नुहोस्।'
    ],
    stepsEn: [
      '1. Sit comfortably upright with spine tall and palms on your knees.',
      '2. Inhale forcefully through both nostrils and exhale with equal force and rhythm.',
      '3. Maintain a continuous rhythmic bellows motion for 20 rapid breaths (1 round).',
      '4. Complete 3 rounds, resting with calm diaphragmatic breath between sets.'
    ],
    benefitsNe: [
      'साइनस, नाक बन्द हुने र छातीको कफ तत्काल खुलाउँछ',
      'शरीरमा अक्सिजनको स्तर बढाई जाडोको आलस्य भगाउँछ',
      'फोक्सोको कार्यक्षमता मजबुत पारी चिसोको संक्रमण रोक्छ'
    ],
    benefitsEn: [
      'Clears sinus blockages and chest catarrh almost instantly',
      'Floods blood with rich oxygen, banishing morning grogginess',
      'Strengthens respiratory resistance against winter viral colds'
    ],
    cautionsNe: [
      'उच्च रक्तचाप, मुटुरोग, हर्निया वा गर्भावस्थामा भस्त्रिकाको सट्टा अनुलोम-विलोम मात्र गर्नुहोस्।'
    ],
    cautionsEn: [
      'Contraindicated in uncontrolled hypertension, heart disorders, or pregnancy; practice gentle alternate nostril breathing instead.'
    ],
    tags: ['भस्त्रिका', 'प्राणायाम', 'कफ', 'फोक्सो', 'शिशिर']
  },
  {
    id: 'shishir-tip-3',
    seasonId: 'shishir',
    seasonNameNe: 'शिशिर ऋतु',
    seasonNameEn: 'Shishir Ritu (Late Winter)',
    sanskritSeason: 'शिशिर ऋतु (योगासन)',
    type: 'yoga',
    typeNe: 'ऋतु अनुकूल योगासन',
    typeEn: 'Seasonal Yoga Pose',
    titleNe: 'त्रिकोणासन (Triangle Pose)',
    titleEn: 'Trikonasana (Extended Triangle Pose)',
    sanskritName: 'उत्थित त्रिकोणासन (Trikonasana)',
    doshaFocusNe: 'नशा खुम्चिन नदिने र जोर्नीको लचकता',
    doshaFocusEn: 'Hamstring & Spinal Flexibility in Cold Weather',
    shortSummaryNe: 'जाडोमा नशाहरू खुम्चिएर ढाड, कम्मर र खुट्टा कडा हुने समस्या हटाउन त्रिकोणासनले शरीरका दुवै पाटोलाई गहिरो स्ट्रेच दिन्छ।',
    shortSummaryEn: 'Prevents vascular and muscular constriction from severe cold, delivering deep lateral flexibility to the waist, hips, and chest.',
    practiceTimingNe: 'बिहान हल्का वार्म-अप पछि (५-७ मिनेट)',
    practiceTimingEn: 'Morning after mild indoor joint warm-up (5-7 mins)',
    durationMinutes: 7,
    stepsNe: [
      '१. दुवै खुट्टालाई ३ देखि ४ फिट चौडा पारेर उभिनुहोस्। दायाँ खुट्टाको औंला ९० डिग्री बाहिर फर्काउनुहोस्।',
      '२. दुवै हात काँधको सिधा फिँजाउनुहोस् र सास फाल्दै दायाँतर्फ कम्मरबाट झुक्नुहोस्।',
      '३. दायाँ हात दायाँ खुट्टाको गोलीगाँठो वा जमिनमा राख्नुहोस्, बायाँ हात सिधा आकाशतर्फ उठाउनुहोस्।',
      '४. माथिल्लो हातको औंलातर्फ हेर्दै २० सेकेन्ड बस्नुहोस्। त्यसपछि बायाँतर्फ पनि दोहोर्याउनुहोस्।'
    ],
    stepsEn: [
      '1. Stand with feet 3-4 feet apart; turn your right foot outward 90 degrees.',
      '2. Extend arms parallel to the floor; exhale and bend sideways at the hip toward the right.',
      '3. Place your right hand on the shin, ankle, or floor, reaching the left arm straight upward.',
      '4. Gaze toward your raised hand for 20 seconds, maintaining steady breathing. Alternate sides.'
    ],
    benefitsNe: [
      'जाडोमा हुने कम्मर दुखाइ, साइटिका र घुँडाको कडापन हटाउँछ',
      'पाचन प्रणालीका अङ्गहरूलाई दबाब दिई कब्जियत हुन दिँदैन',
      'खुट्टा र छातीका मांसपेशीलाई बलियो र सक्रिय बनाउँछ'
    ],
    benefitsEn: [
      'Alleviates lumbar stiffness, sciatica pain, and knee rigidity in cold weather',
      'Stimulates peristalsis in pelvic organs, preventing winter constipation',
      'Fosters balanced lateral stamina throughout thighs and thorax'
    ],
    tags: ['त्रिकोणासन', 'योग', 'कम्मर', 'लचकता', 'शिशिर']
  },

  // ==========================================
  // 4. वसन्त ऋतु (Basanta - Spring / Chaitra & Baishakh - Months 12, 1)
  // Dosha Focus: Kapha Liquefaction & Allergy Prevention (कफ पग्लिने र एलर्जी नियन्त्रण)
  // ==========================================
  {
    id: 'basanta-tip-1',
    seasonId: 'basanta',
    seasonNameNe: 'वसन्त ऋतु',
    seasonNameEn: 'Basanta Ritu (Spring)',
    sanskritSeason: 'वसन्त ऋतु (कफ शोधन)',
    type: 'ayurveda',
    typeNe: 'आयुर्वेदिक दिनचर्या',
    typeEn: 'Ayurvedic Practice',
    titleNe: 'मनतातो पानीमा मह र कागती (प्राकृतिक डिटक्स)',
    titleEn: 'Warm Water with Raw Honey & Lemon (Spring Detox)',
    sanskritName: 'मधूदक प्राशनम् (लेखन कर्म)',
    doshaFocusNe: 'कफ शोधन र अतिरिक्त बोसो निवारण',
    doshaFocusEn: 'Kapha Scraping (Lekhana) & Gentle Detox',
    shortSummaryNe: 'जाडोमा जमेको कफ वसन्तको घामले पग्लिँदा रुघाखोकी र एलर्जी बढ्छ। बिहान मनतातो पानीमा मह र कागती सेवनले कफलाई छातीबाट बाहिर निकाल्छ।',
    shortSummaryEn: 'Winter-accumulated Kapha melts under spring sun, causing seasonal sneezes; warm water with raw honey naturally clears mucosal channels.',
    practiceTimingNe: 'बिहान उठ्नासाथ खाली पेट (३ मिनेट)',
    practiceTimingEn: 'First thing upon waking on an empty stomach (3 mins)',
    durationMinutes: 3,
    stepsNe: [
      '१. एक गिलास पानीलाई हल्का मनतातो (अति तातो नभएको) बनाउनुहोस्।',
      '२. आधा कागतीको ताजा रस निचोर्नुहोस्।',
      '३. १ चम्चा शुद्ध मह राम्रोसँग घोलेर बिस्तारै घुट्को-घुट्को गरी पिउनुहोस्। (ध्यान दिनुहोस्: महलाई कहिल्यै उम्लिरहेको तातो पानीमा नहाल्नुहोस्)।'
    ],
    stepsEn: [
      '1. Heat 1 glass of drinking water until warm (not boiling hot).',
      '2. Squeeze in fresh juice from half a lemon.',
      '3. Stir in 1 tsp pure raw honey thoroughly and sip slowly. (Never mix honey in boiling water).'
    ],
    benefitsNe: [
      'छाती र घाँटीको कफ सफा गर्छ र बिहानी अल्छीपन हटाउँछ',
      'मेटाबोलिजम सक्रिय पारी जाडोमा बढेको अतिरिक्त तौल घटाउन मद्दत गर्छ',
      'कलेजो डिटक्सिफाई गर्छ र वसन्तकालीन छालाको चमक बढाउँछ'
    ],
    benefitsEn: [
      'Liquefies respiratory Kapha and dispels morning heaviness',
      'Accelerates basal metabolism to trim winter-gained weight',
      'Detoxifies lymphatic channels for clear, revitalized skin'
    ],
    tags: ['मह', 'कागती', 'डिटक्स', 'कफ', 'वसन्त']
  },
  {
    id: 'basanta-tip-2',
    seasonId: 'basanta',
    seasonNameNe: 'वसन्त ऋतु',
    seasonNameEn: 'Basanta Ritu (Spring)',
    sanskritSeason: 'वसन्त ऋतु (योगासन)',
    type: 'yoga',
    typeNe: 'ऋतु अनुकूल योगासन',
    typeEn: 'Seasonal Yoga Pose',
    titleNe: 'सेतु बन्धासन (Bridge Pose / छाती विस्तार)',
    titleEn: 'Setu Bandhasana (Bridge Pose)',
    sanskritName: 'सेतु बन्धासन (Setu Bandhasana)',
    doshaFocusNe: 'कफ निवारण, फोक्सो र थाइरोइड सक्रिय',
    doshaFocusEn: 'Thoracic Expansion & Thyroid Harmony',
    shortSummaryNe: 'छाती चौडा पारी फोक्सोका सम्पूर्ण कोष्ठकहरू खोल्ने र वसन्त ऋतुको मौसमी रुघाखोकी तथा एलर्जीबाट बचाउने उत्तम आसन।',
    shortSummaryEn: 'Opens the anterior thoracic cage, clears congested pulmonary alveoli, and energizes the thyroid gland to beat seasonal allergies.',
    practiceTimingNe: 'बिहान शौचपछि (६ देखि ८ मिनेट)',
    practiceTimingEn: 'Morning on an empty stomach (6-8 mins)',
    durationMinutes: 8,
    stepsNe: [
      '१. म्याटमा ढाडको भरमा उत्तानो परेर सुत्नुहोस्, घुँडा मोडेर कुर्कुच्चा कम्मर नजिक ल्याउनुहोस्।',
      '२. दुवै हात शरीर छेउ भुइँमा राख्नुहोस् वा सम्भव भए गोलीगाँठो समात्नुहोस्।',
      '३. सास तान्दै कम्मर, नितम्ब र ढाडलाई जमिनबाट माथि उठाउनुहोस् (छाती चिउँडोसम्म पुगोस्)।',
      '४. यो स्थितिमा २०-३० सेकेन्ड गहिरो सास लिनुहोस् र विस्तारै कम्मर तल झार्नुहोस् (३ पटक गर्नुहोस्)।'
    ],
    stepsEn: [
      '1. Lie flat on your back; bend knees and walk feet hip-width apart toward your glutes.',
      '2. Rest arms beside the body with palms pressing down (or clasp ankles).',
      '3. Inhale deeply, pressing through heels to lift hips and spine skyward toward the chin.',
      '4. Hold for 20-30 seconds with calm chest breathing; slowly roll the spine down. Repeat 3 times.'
    ],
    benefitsNe: [
      'फोक्सो चौडा बनाई वसन्तको मौसमी एलर्जी र दमको असर कम गर्छ',
      'थाइरोइड ग्रन्थीलाई सन्तुलित पारी हार्मोनल सन्तुलन मिलाउँछ',
      'ढाडका मांसपेशी बलियो बनाउँछ र मानसिक तनाव हटाउँछ'
    ],
    benefitsEn: [
      'Expands bronchial capacity, mitigating seasonal pollen allergies and asthma',
      'Compresses and massages the thyroid gland, regulating metabolic hormones',
      'Tones the gluteal and spinal extensors while dissipating nervous anxiety'
    ],
    tags: ['सेतु बन्धासन', 'योग', 'छाती', 'एलर्जी', 'वसन्त']
  },
  {
    id: 'basanta-tip-3',
    seasonId: 'basanta',
    seasonNameNe: 'वसन्त ऋतु',
    seasonNameEn: 'Basanta Ritu (Spring)',
    sanskritSeason: 'वसन्त ऋतु (नस्य कर्म)',
    type: 'ayurveda',
    typeNe: 'आयुर्वेदिक दिनचर्या',
    typeEn: 'Ayurvedic Practice',
    titleNe: 'नस्य क्रिया (नाकमा तिल वा बदामको तेल)',
    titleEn: 'Nasya Care (Herbal Nasal Lubrication)',
    sanskritName: 'प्रतिमर्श नस्यम् (शिरोविरेचन)',
    doshaFocusNe: 'धुलो, परागकण (Pollen) र एलर्जी सुरक्षा',
    doshaFocusEn: 'Allergen Defense & Sinus Barrier Protection',
    shortSummaryNe: 'वसन्त ऋतुमा हावामा उड्ने धुलो र फूलका परागकण (Pollen) ले हुने हाच्छिउँ र एलर्जीबाट बच्न नाकका दुवै प्वालमा २-२ थोपा तोरी, तिल वा बदामको तेल हाल्ने विधि।',
    shortSummaryEn: 'Applying 2 drops of lukewarm sesame or Anu oil in each nostril forms a protective biological barrier against spring pollens and airborne dust.',
    practiceTimingNe: 'बिहान मुख धोएपछि वा बाहिर निस्कनुअघि',
    practiceTimingEn: 'Morning after washing face or before stepping outside',
    durationMinutes: 4,
    stepsNe: [
      '१. थोरै तिल वा बदामको तेललाई सफा चम्चामा हल्का मनतातो बनाउनुहोस्।',
      '२. ओछ्यानमा टाउको हल्का पछाडि झुकाएर सुत्नुहोस्।',
      '३. कान्छी औंला वा ड्रपरले नाकका दुवै प्वालमा २-२ थोपा तेल हाल्नुहोस् र हल्का सास भित्र तान्नुहोस्।'
    ],
    stepsEn: [
      '1. Warm a tiny drop of pure sesame, almond, or Anu oil in a clean spoon.',
      '2. Recline comfortably with the head tilted slightly back.',
      '3. Administer 2 drops in each nostril using a dropper or clean fingertip, sniffing gently inward.'
    ],
    benefitsNe: [
      'वसन्त ऋतुको परागकण एलर्जी (Allergic Rhinitis) र हाच्छिउँ रोक्छ',
      'टाउको भारी हुने र बिहानी पिनास (Sinusitis) बाट मुक्ति दिन्छ',
      'स्मरणशक्ति तेजिलो बनाउँछ र आँखाको थकान मेटाउँछ'
    ],
    benefitsEn: [
      'Blocks pollen penetration, averting allergic rhinitis and incessant sneezing',
      'Clears sinus heaviness, ocular strain, and fronto-temporal tension',
      'Sharpen sensory acuity and nourishes cranial micro-channels'
    ],
    tags: ['नस्य', 'नाक', 'एलर्जी', 'परागकण', 'वसन्त']
  },

  // ==========================================
  // 5. ग्रीष्म ऋतु (Grishma - Summer / Jestha & Ashadh - Months 2, 3)
  // Dosha Focus: Severe Dehydration & Pitta-Vata Overheating (लू र तापक्रम सन्तुलन)
  // ==========================================
  {
    id: 'grishma-tip-1',
    seasonId: 'grishma',
    seasonNameNe: 'ग्रीष्म ऋतु',
    seasonNameEn: 'Grishma Ritu (Summer)',
    sanskritSeason: 'ग्रीष्म ऋतु (शीतल पान)',
    type: 'herbal',
    typeNe: 'घरेलु आयुर्वेदिक पेय',
    typeEn: 'Herbal Elixir',
    titleNe: 'बेलको सर्बत र पुदिना शीतल पेय (लू सुरक्षा)',
    titleEn: 'Bael (Wood Apple) & Fresh Mint Sherbet',
    sanskritName: 'बिल्व फल पानकम् (लू-निवारक)',
    doshaFocusNe: 'पित्त दोष शान्ति, आन्द्राको सुरक्षा र लू (Heatstroke) नियन्त्रण',
    doshaFocusEn: 'Heatstroke Prevention & Intestinal Cooling',
    shortSummaryNe: 'जेठ-असारको डढ्ने घाम र लूबाट बच्न पाकेको बेलको गुदीबाट बनेको सर्बत वा पुदिना-कागती पानीले शरीरमा चिस्यान र इलेक्ट्रोलाइट कायम राख्छ।',
    shortSummaryEn: 'Ripe Bael fruit sherbet infused with fresh mint leaves protects against summer heat exhaustion, dehydration, and summer diarrhea.',
    practiceTimingNe: 'दिउँसो १२ देखि ३ बजेको चर्को घामको समय',
    practiceTimingEn: 'Midday between 12 PM - 3 PM during peak solar heat',
    durationMinutes: 5,
    stepsNe: [
      '१. पाकेको बेलको भित्री गुदीलाई १ कचौरा पानीमा मिचेर बीउ र रेसा छानेर फाल्नुहोस्।',
      '२. यसमा थोरै मिश्री र ताजा पुदिनाका पात कुटेर मिसाउनुहोस्।',
      '३. माटोको भाँडोमा राखेको चिसो पानी मिसाएर दिउँसो एक गिलास पिउनुहोस्।'
    ],
    stepsEn: [
      '1. Scoop ripe Bael fruit pulp, mash gently in water, and strain fibrous seeds.',
      '2. Stir in a touch of raw crystal sugar (Mishri) and crushed fresh mint leaves.',
      '3. Mix with naturally chilled clay-pot water and sip during high midday heat.'
    ],
    benefitsNe: [
      'घाममा लाग्ने लू (Heatstroke) र चक्कर लाग्ने समस्याबाट पूर्ण बचाउँछ',
      'आन्द्राको गर्मी निको पारी झाडापखाला र आउँ पर्न दिँदैन',
      'शरीरमा प्राकृतिक मिनरल्स र ग्लुकोजको भण्डार भर्छ'
    ],
    benefitsEn: [
      'Provides clinical-grade defense against heatstroke and solar syncope',
      'Soothes hyperactive gut mucosa, preventing summer enteritis',
      'Recharges natural electrolytes, quenching systemic cellular thirst'
    ],
    herbalIngredientsNe: 'पाकेको बेल १ दाना वा पुदिना १० पात, मिश्री १ चम्चा, माटोको भाँडोको पानी',
    herbalIngredientsEn: '1 ripe Bael fruit (or 10 mint leaves), 1 tsp rock sugar, clay-pot water',
    tags: ['बेल', 'सर्बत', 'पुदिना', 'लू', 'ग्रीष्म']
  },
  {
    id: 'grishma-tip-2',
    seasonId: 'grishma',
    seasonNameNe: 'ग्रीष्म ऋतु',
    seasonNameEn: 'Grishma Ritu (Summer)',
    sanskritSeason: 'ग्रीष्म ऋतु (योगासन)',
    type: 'yoga',
    typeNe: 'ऋतु अनुकूल योगासन',
    typeEn: 'Seasonal Yoga Pose',
    titleNe: 'शवासन र योग निद्रा (गहिरो शीतलता)',
    titleEn: 'Shavasana & Guided Yoga Nidra',
    sanskritName: 'शवासनम् (परम विश्रान्ति)',
    doshaFocusNe: 'अत्यधिक गर्मीबाट हुने थकान र तनाव शान्ति',
    doshaFocusEn: 'Exhaustion Relief & Autonomic Reset',
    shortSummaryNe: 'गर्मीका कारण शरीरको ऊर्जा खेर जाने र चिडचिडापन बढ्ने हुँदा म्याटमा सुतेर १५ मिनेट शवासनमा बस्दा स्नायु प्रणाली शान्त भई नयाँ ऊर्जा भरिन्छ।',
    shortSummaryEn: 'Summer heat rapidly drains physical stamina; 15 minutes of conscious Shavasana grounds heart rate, cools skin surface, and refreshes the mind.',
    practiceTimingNe: 'दिउँसोको चर्को घामपछि वा साँझ (१० देखि १५ मिनेट)',
    practiceTimingEn: 'Late afternoon after daytime heat or dusk (10-15 mins)',
    durationMinutes: 15,
    stepsNe: [
      '१. न्यानो-शीतल शान्त कोठामा म्याटमा उत्तानो परेर आरामसँग सुत्नुहोस्।',
      '२. दुवै खुट्टालाई काँध जति चौडा राखी हातलाई शरीरभन्दा थोरै टाढा, हत्केला आकाशतर्फ राख्नुहोस्।',
      '३. आँखा बन्द गर्नुहोस् र पैतालादेखि टाउकोसम्मका प्रत्येक मांसपेशीलाई ढिला छोड्नुहोस्।',
      '४. सासको आउजाउलाई मात्र हेरिरहनुहोस् र शरीर पूर्ण रूपमा शीतल भएको कल्पना गर्नुहोस्।'
    ],
    stepsEn: [
      '1. Recline flat on your back in a cool, quiet, well-ventilated space.',
      '2. Keep feet apart naturally and arms resting alongside torso with palms facing upwards.',
      '3. Softly close eyes; systematically release micro-tensions from toes up to the crown of your head.',
      '4. Observe the natural rhythm of breath without forcing, visualizing cooling lunar light soothing your core.'
    ],
    benefitsNe: [
      'गर्मीले हुने उच्च रक्तचाप, मुटुको धड्कन र बेचैनी घटाउँछ',
      'शारीरिक र मानसिक थकानलाई शून्य स्तरमा झारेर स्फूर्ति दिन्छ',
      'रातको अनिद्रा (Insomnia) हटाउन मद्दत गर्छ'
    ],
    benefitsEn: [
      'Moderates heat-induced tachycardia, hypertension, and restlessness',
      'Resets sympathetic nervous overdrive, restoring baseline mental equilibrium',
      'Resolves summer insomnia, facilitating deep restorative sleep'
    ],
    tags: ['शवासन', 'योग निद्रा', 'विश्राम', 'गर्मी', 'ग्रीष्म']
  },

  // ==========================================
  // 6. वर्षा ऋतु (Barsha - Monsoon / Shrawan & Bhadra - Months 4, 5)
  // Dosha Focus: Weakened Digestive Agni & Dampness Vata-Pitta (मन्द जठराग्नि र ओस)
  // ==========================================
  {
    id: 'barsha-tip-1',
    seasonId: 'barsha',
    seasonNameNe: 'वर्षा ऋतु',
    seasonNameEn: 'Barsha Ritu (Monsoon)',
    sanskritSeason: 'वर्षा ऋतु (अग्नि दीपन)',
    type: 'ayurveda',
    typeNe: 'आयुर्वेदिक दिनचर्या',
    typeEn: 'Ayurvedic Practice',
    titleNe: 'उमालेको पानी र ज्वानो-मेथी सुप (मन्द अग्नि रक्षा)',
    titleEn: 'Boiled Ginger-Ajwain Water & Digestive Soup',
    sanskritName: 'उष्णोदक व यवानी-मेथी क्वाथम्',
    doshaFocusNe: 'पाचन अग्नि संरक्षण र पानीजन्य रोगबाट मुक्ति',
    doshaFocusEn: 'Preserving Agni & Water-Borne Disease Shield',
    shortSummaryNe: 'वर्षायाममा वातावरणको ओसले शरीरको पाचन अग्नि अत्यन्त कमजोर हुन्छ। सधैं उमालेको मनतातो पानी पिउने र ज्वानो-मेथीको झोल खानाले हैजा र अपचबाट बचिन्छ।',
    shortSummaryEn: 'Monsoon dampness depresses metabolic digestive fire (Agni); drinking exclusively warm boiled water with ajwain preserves immunity against cholera and dysentery.',
    practiceTimingNe: 'दिनभर सधैं उमालेको पानी र खानासँगै ज्वानो झोल',
    practiceTimingEn: 'Sipped warm throughout the day; soup with main meal',
    durationMinutes: 5,
    stepsNe: [
      '१. पिउने पानीलाई कम्तीमा १० मिनेट उमाल्नुहोस् र थर्मसमा राखेर दिनभर मनतातो मात्र पिउनुहोस्।',
      '२. हप्तामा २-३ पटक ज्वानो, मेथी, लसुन र अदुवा झानेर बाक्लो तातो सुप वा झोल बनाएर खानुहोस्।',
      '३. हरियो काँचो सलाद, खुला बासी खाना र बाटोको पानी पूर्ण रूपमा बन्द गर्नुहोस्।'
    ],
    stepsEn: [
      '1. Boil all drinking water vigorously for 10 minutes; store in an insulated thermos and sip warm.',
      '2. Prepare a warm tempered broth infused with carom seeds (Ajwain), fenugreek, and crushed garlic 2-3 times weekly.',
      '3. Strictly avoid raw unwashed salads, street food, and contaminated monsoon well-water.'
    ],
    benefitsNe: [
      'टाइफाइड, हैजा, जन्डिस र झाडापखालाबाट शतप्रतिशत बचाउँछ',
      'पेट फुल्ने, ग्यास भरिने र अपच हुने समस्या निर्मूल गर्छ',
      'वर्षायामको चिसो-ओसले जोर्नी दुख्न दिँदैन'
    ],
    benefitsEn: [
      'Guards against waterborne pathogens (typhoid, giardiasis, viral hepatitis)',
      'Dispels monsoon abdominal flatulence, bloating, and dyspepsia',
      'Protects peripheral joints from dampness-induced arthritic swelling'
    ],
    tags: ['ज्वानो', 'उमालेको पानी', 'पाचन', 'मनसुन', 'वर्षा']
  },
  {
    id: 'barsha-tip-2',
    seasonId: 'barsha',
    seasonNameNe: 'वर्षा ऋतु',
    seasonNameEn: 'Barsha Ritu (Monsoon)',
    sanskritSeason: 'वर्षा ऋतु (योगासन)',
    type: 'yoga',
    typeNe: 'ऋतु अनुकूल योगासन',
    typeEn: 'Seasonal Yoga Pose',
    titleNe: 'पवनमुक्तासन (ग्यास तथा पेट हलुका बनाउने आसन)',
    titleEn: 'Pawanmuktasana (Wind-Relieving Pose)',
    sanskritName: 'पवनमुक्तासन (Pawanmuktasana)',
    doshaFocusNe: 'अपान वात सन्तुलन र पेटको ग्यास निवारण',
    doshaFocusEn: 'Apana Vata Regulation & Gas Expulsion',
    shortSummaryNe: 'मनसुनमा आन्द्रामा जम्ने दूषित ग्यास र भारीपन हटाउन, ढाडको तल्लो भागलाई आराम दिन र पाचन यन्त्र सक्रिय पार्न उत्तम आसन।',
    shortSummaryEn: 'Gently presses the ascending and descending colon, venting trapped monsoon flatulence and comforting the lumbar spine.',
    practiceTimingNe: 'बिहान खाली पेट (५ देखि ७ मिनेट)',
    practiceTimingEn: 'Morning empty stomach on a dry mat (5-7 mins)',
    durationMinutes: 7,
    stepsNe: [
      '१. म्याटमा उत्तानो परेर सुत्नुहोस् र लामो सास तान्नुहोस्।',
      '२. सास फाल्दै दायाँ घुँडालाई छाती नजिक ल्याउनुहोस् र दुवै हातले बाँधेर च्याप्नुहोस्।',
      '३. सम्भव भए टाउको उठाएर नाकले घुँडा छुनुहोस् र २० सेकेन्ड सामान्य सास लिनुहोस्।',
      '४. त्यसपछि बायाँ खुट्टा र अन्त्यमा दुवै खुट्टा एकैसाथ मोडेर छातीमा च्याप्नुहोस्।'
    ],
    stepsEn: [
      '1. Lie comfortably on your back on a dry cushioned mat.',
      '2. Exhale deeply and fold your right knee close toward your chest, clasping shins with both hands.',
      '3. Gently lift your head to touch chin/nose to the knee; hold for 20 seconds with rhythmic breathing.',
      '4. Repeat with the left leg, and finally hug both knees together to compress the abdominal wall.'
    ],
    benefitsNe: [
      'पेटमा जमेको ग्यास, भारीपन र कब्जियत तुरुन्तै खुलाउँछ',
      'कम्मर र ढाडको तल्लो भागको दुखाइ हटाउँछ',
      'कलेजो र आन्द्राको कार्यक्षमता मजबुत बनाउँछ'
    ],
    benefitsEn: [
      'Vents stagnant intestinal gas, relieving monsoon abdominal colic',
      'Decompresses lumbar vertebrae and relieves lower back tension',
      'Stimulates abdominal peristalsis, promoting clean morning bowel movements'
    ],
    tags: ['पवनमुक्तासन', 'ग्यास', 'पेट', 'पाचन', 'वर्षा']
  },
  {
    id: 'barsha-tip-3',
    seasonId: 'barsha',
    seasonNameNe: 'वर्षा ऋतु',
    seasonNameEn: 'Barsha Ritu (Monsoon)',
    sanskritSeason: 'वर्षा ऋतु (आसन)',
    type: 'yoga',
    typeNe: 'ऋतु अनुकूल योगासन',
    typeEn: 'Seasonal Yoga Pose',
    titleNe: 'वज्रासन (खानापछिको पाचन आसन)',
    titleEn: 'Vajrasana (Thunderbolt Digestive Pose)',
    sanskritName: 'वज्रासनम् (वज्रवत् दृढता)',
    doshaFocusNe: 'जठराग्नि प्रदीप्त र अपच नियन्त्रण',
    doshaFocusEn: 'Stimulating Blood Flow to Lower Digestive Organs',
    shortSummaryNe: 'खाना खाएपछि गर्न मिल्ने एकमात्र आसन, जसले वर्षा ऋतुमा मन्द भएको पाचन शक्तिलाई तुरून्त गति प्रदान गर्दछ।',
    shortSummaryEn: 'The only yogic posture safe immediately post-meal; redirects femoral arterial circulation to the stomach to digest heavy monsoon meals.',
    practiceTimingNe: 'खाना खाएलगत्तै ५ देखि १० मिनेट',
    practiceTimingEn: 'Immediately after lunch or dinner for 5-10 minutes',
    durationMinutes: 10,
    stepsNe: [
      '१. घुँडा टेकेर बस्नुहोस् र दुवै कुर्कुच्चा बाहिर पारेर नितम्बलाई पैतालाको कापमा राख्नुहोस्।',
      '२. मेरुदण्ड, गर्दन र टाउकोलाई पूर्ण सिधा राख्नुहोस्।',
      '३. दुवै हात घुँडामाथि राख्नुहोस् र आँखा बन्द गरी सामान्य सास फेर्नुहोस् (५-१० मिनेट बस्नुहोस्)।'
    ],
    stepsEn: [
      '1. Kneel on the mat; spread your heels apart and sit comfortably with hips nestled in the arches of your feet.',
      '2. Keep spine, neck, and head erect in vertical alignment.',
      '3. Rest palms flat on knees, close eyes, and breathe calmly for 5-10 minutes.'
    ],
    benefitsNe: [
      'खाना सजिलै पचाउँछ र मनसुनमा हुने अमिलो डकार रोक्छ',
      'पैताला र खुट्टाका नसाहरूलाई बलियो बनाउँछ',
      'मनलाई शान्त पारी खानाबाट पूर्ण पोषण ग्रहण गर्न मद्दत गर्छ'
    ],
    benefitsEn: [
      'Expedites gastric transit, preventing sour acid belching and heaviness',
      'Strengthens quadriceps and ankle tendons',
      'Fosters parasympathetic calmness, boosting nutrient assimilation'
    ],
    tags: ['वज्रासन', 'पाचन', 'खाना', 'अपच', 'वर्षा']
  }
];

/**
 * Returns the season ID corresponding to a given Nepali month (1=Baishakh to 12=Chaitra).
 */
export function getSeasonIdForMonth(month: number): 'basanta' | 'grishma' | 'barsha' | 'sharad' | 'hemanta' | 'shishir' {
  if (month === 12 || month === 1) return 'basanta'; // Chaitra & Baishakh
  if (month === 2 || month === 3) return 'grishma';  // Jestha & Ashadh
  if (month === 4 || month === 5) return 'barsha';   // Shrawan & Bhadra
  if (month === 6 || month === 7) return 'sharad';   // Ashwin & Kartik
  if (month === 8 || month === 9) return 'hemanta';  // Mangsir & Poush
  return 'shishir';                                  // Magh & Falgun (10, 11)
}

/**
 * Returns the current season metadata and its curated seasonal tips.
 */
export function getSeasonalTipsForDate(todayBs?: NepaliDate) {
  const date = todayBs || getCurrentNepaliDate();
  const seasonId = getSeasonIdForMonth(date.month);
  const seasonalPool = SEASONAL_WELLNESS_TIPS.filter((t) => t.seasonId === seasonId);

  return {
    seasonId,
    date,
    pool: seasonalPool.length > 0 ? seasonalPool : SEASONAL_WELLNESS_TIPS.slice(0, 4)
  };
}

/**
 * Deterministically selects today's daily wellness tip for the current season.
 */
export function getDailyWellnessTip(todayBs?: NepaliDate): {
  tip: SeasonalWellnessTip;
  index: number;
  total: number;
  seasonId: string;
} {
  const { seasonId, date, pool } = getSeasonalTipsForDate(todayBs);
  const dateSeed = (date.year * 372) + (date.month * 31) + date.day;
  const index = Math.abs(dateSeed) % pool.length;

  return {
    tip: pool[index] || pool[0],
    index,
    total: pool.length,
    seasonId
  };
}
