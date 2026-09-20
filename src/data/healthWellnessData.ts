import { Language } from '../types';

export interface YogaPose {
  id: string;
  nameNe: string;
  nameEn: string;
  sanskritName: string;
  category: 'flexibility' | 'strength' | 'relaxation' | 'digestion' | 'breathing';
  categoryNe: string;
  categoryEn: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  levelNe: string;
  levelEn: string;
  durationMinutes: number;
  seasonAffinity: string[]; // ['sharad', 'barsha', 'hemanta', etc.]
  targetAreaNe: string;
  targetAreaEn: string;
  benefitsNe: string[];
  benefitsEn: string[];
  stepsNe: string[];
  stepsEn: string[];
  precautionsNe: string[];
  precautionsEn: string[];
  iconType: 'sun' | 'lotus' | 'wind' | 'heart' | 'body' | 'mountain';
}

export interface NepaliSeasonWellness {
  id: string; // 'basanta' | 'grishma' | 'barsha' | 'sharad' | 'hemanta' | 'shishir'
  nameNe: string;
  nameEn: string;
  sanskritTitle: string;
  monthsNe: string;
  monthsEn: string;
  monthNumbers: number[]; // 1 to 12
  climateSummaryNe: string;
  climateSummaryEn: string;
  doshaNe: string;
  doshaEn: string;
  doshaStateNe: string;
  doshaStateEn: string;
  elementNe: string;
  elementEn: string;
  themeColor: string;
  accentBg: string;
  accentBorder: string;
  taglineNe: string;
  taglineEn: string;
  dietRecommendations: {
    favorableNe: string[];
    favorableEn: string[];
    avoidNe: string[];
    avoidEn: string[];
  };
  dailyRitucharyaNe: string[];
  dailyRitucharyaEn: string[];
  herbalRemedy: {
    nameNe: string;
    nameEn: string;
    ingredientsNe: string;
    ingredientsEn: string;
    instructionsNe: string;
    instructionsEn: string;
    benefitNe: string;
    benefitEn: string;
  };
  climateRisksNe: string[];
  climateRisksEn: string[];
  recommendedPoses: string[]; // Yoga Pose IDs
  recommendedPranayama: {
    nameNe: string;
    nameEn: string;
    descriptionNe: string;
    descriptionEn: string;
    ratio: string;
  };
}

export interface PranayamaPractice {
  id: string;
  nameNe: string;
  nameEn: string;
  sanskritName: string;
  taglineNe: string;
  taglineEn: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
  benefitsNe: string[];
  benefitsEn: string[];
  suitableForSeason: string[];
  contraindicationsNe: string;
  contraindicationsEn: string;
}

export const NEPALI_SEASONS_WELLNESS: NepaliSeasonWellness[] = [
  {
    id: 'basanta',
    nameNe: 'वसन्त ऋतु',
    nameEn: 'Basanta Ritu (Spring)',
    sanskritTitle: 'ऋतुराज वसन्त',
    monthsNe: 'चैत्र र वैशाख (मध्य मार्च - मध्य मे)',
    monthsEn: 'Chaitra & Baishakh (Mid Mar - Mid May)',
    monthNumbers: [12, 1],
    climateSummaryNe: 'न्यानो घाम, फूल फुल्ने मौसम, हल्का बतास र जाडो सकिएर मौसममा नयाँ ऊर्जा आउने समय।',
    climateSummaryEn: 'Mild blossoming weather, pleasant warmth, gentle breezes, and natural vitality following winter thaw.',
    doshaNe: 'कफ दोष (Kapha)',
    doshaEn: 'Kapha Aggravation',
    doshaStateNe: 'जाडोमा जमेको कफ घामको रापले पग्लिएर छाती र घाँटीमा समस्या आउन सक्ने अवस्था।',
    doshaStateEn: 'Winter accumulated Kapha liquefies with spring warmth, potentially causing congestion and allergies.',
    elementNe: 'जल र पृथ्वी (Water & Earth)',
    elementEn: 'Water & Earth',
    themeColor: 'emerald',
    accentBg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20',
    accentBorder: 'border-emerald-200 dark:border-emerald-800',
    taglineNe: 'कफ शुद्धिकरण, ताजा व्यायाम र शरीरमा नयाँ ऊर्जा सञ्चार गर्ने ऋतु।',
    taglineEn: 'Time for Kapha detoxification, brisk movement, and revitalizing fresh vitality.',
    dietRecommendations: {
      favorableNe: [
        'जौ, कोदो, फापर र मकैका हलुका परिकार',
        'अमला, कागती, सुकेको अदुवा, मह (Honey)',
        'तितो र पिरो स्वाद भएका तरकारी (करेला, मेथी, रायो)',
        'उमालेको मनतातो पानी र दालचिनी-तुलसी चिया'
      ],
      favorableEn: [
        'Light whole grains: Barley, millet, buckwheat, and roasted corn',
        'Amala (Indian Gooseberry), raw honey, dry ginger, and lemon',
        'Bitter & pungent greens (bitter gourd, fenugreek, mustard leaves)',
        'Boiled lukewarm water with cinnamon and holy basil (Tulsi)'
      ],
      avoidNe: [
        'दिउँसो सुत्ने बानी (दिवास्वप्नले कफ बढाउँछ)',
        'अत्यधिक चिल्लो, घिउ र गुलियो परिकार',
        'चिसो पानी, आइसक्रिम र दहीको बढी सेवन'
      ],
      avoidEn: [
        'Daytime napping (aggravates Kapha and heaviness)',
        'Heavy oily, deep-fried snacks and dense pastries',
        'Chilled drinks, ice cream, and unctuous curd at night'
      ]
    },
    dailyRitucharyaNe: [
      'सूर्योदयभन्दा अगाडि उठ्ने र मनतातो पानीमा मह मिलाएर पिउने',
      'बिहान २० मिनेट पसिना आउने गरी योगासन वा छिटो हिँडाइ गर्ने',
      'नाकमा तोरीको तेल वा घ्यूको दुई थोपा हाल्ने (प्रतिमर्श नस्य)',
      'रुखो मालिस (उद्वर्तन) गरेर कफ र मोटोपन घटाउने'
    ],
    dailyRitucharyaEn: [
      'Wake before sunrise; drink lukewarm water with raw honey',
      'Practice 20 minutes of dynamic yoga or brisk aerobic walking',
      'Nasya: Apply 2 drops of sesame oil/ghee in nostrils to prevent pollens',
      'Udvartana: Dry herbal powder body massage to boost lymphatic flow'
    ],
    herbalRemedy: {
      nameNe: 'वसन्त कफ-शोधक काढा',
      nameEn: 'Spring Kapha Detox Decoction',
      ingredientsNe: 'तुलसी ५ पात, सुकेको अदुवा (सुठो) आधा चम्चा, मरिच ३ दाना, मह १ चम्चा',
      ingredientsEn: '5 Tulsi leaves, 1/2 tsp dry ginger powder (Suntho), 3 black peppercorns, 1 tsp raw honey',
      instructionsNe: 'डेढ कप पानीमा सुठो, तुलसी र मरिच उमालेर एक कप बनाउने; मनतातो भएपछि मह मिलाएर बिहान पिउने।',
      instructionsEn: 'Simmer ingredients in 1.5 cups of water until reduced to 1 cup. Strain, cool to warm, stir in honey, and sip in the morning.',
      benefitNe: 'छातीको कफ सफा गर्छ, मौसमी रुघाखोकी रोक्छ र अल्छीपन हटाउँछ।',
      benefitEn: 'Clears bronchial congestion, halts seasonal allergic coughs, and dispels spring fatigue.'
    },
    climateRisksNe: ['मौसमी एलर्जी र परागकण (Pollen Allergy)', 'सुख्खा खोकी र घाँटी खसखस', 'सुस्तता र पाचन कमजोरी'],
    climateRisksEn: ['Seasonal pollen allergies', 'Dry cough & scratchy throat', 'Metabolic sluggishness'],
    recommendedPoses: ['surya-namaskar', 'virabhadrasana', 'ustrasana', 'kapalbhati'],
    recommendedPranayama: {
      nameNe: 'कपालभाति तथा भस्त्रिका प्राणायाम',
      nameEn: 'Kapalabhati & Bhastrika Breath',
      descriptionNe: 'फोक्सोमा अक्सिजनको प्रवाह बढाउने, कफ पगाल्ने र शरीरको ऊर्जा सक्रिय गर्ने तीक्ष्ण श्वासप्रश्वास।',
      descriptionEn: 'Rhythmic diaphragmatic expulsion that clears sinuses, dissolves Kapha, and oxygenates tissues.',
      ratio: 'तीव्र रेचक (Rapid Exhalations)'
    }
  },
  {
    id: 'grishma',
    nameNe: 'ग्रीष्म ऋतु',
    nameEn: 'Grishma Ritu (Summer)',
    sanskritTitle: 'तापवर्धक ग्रीष्म',
    monthsNe: 'ज्येष्ठ र आषाढ (मध्य मे - मध्य जुलाई)',
    monthsEn: 'Jestha & Ashadh (Mid May - Mid July)',
    monthNumbers: [2, 3],
    climateSummaryNe: 'तीव्र घाम, अत्यधिक गर्मी, सुख्खा तातो हावा (तराईमा लू) र शरीरमा पानीको कमी हुने समय।',
    climateSummaryEn: 'Intense dry sunshine, peak heat, scorching winds (Loo in Terai), and rapid moisture depletion.',
    doshaNe: 'पित्त सञ्चय र वात वृद्धि (Pitta accumulation)',
    doshaEn: 'Pitta Accumulation & Vata Aggravation',
    doshaStateNe: 'सूर्यको तीव्र किरणले शरीरको बल र रस सोस्ने, डिहाइड्रेसन र रिस/दाह बढ्ने अवस्था।',
    doshaStateEn: 'Solar intensity depletes bodily fluids (Ojas), triggering dehydration, inflammation, and heat fatigue.',
    elementNe: 'अग्नि र वायु (Fire & Air)',
    elementEn: 'Fire & Air',
    themeColor: 'amber',
    accentBg: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
    accentBorder: 'border-amber-200 dark:border-amber-800',
    taglineNe: 'शीतलता संरक्षण, पर्याप्त जलपान र शरीरलाई शीत प्रदान गर्ने ऋतु।',
    taglineEn: 'Preserving inner moisture, deep hydration, and keeping body and mind naturally cool.',
    dietRecommendations: {
      favorableNe: [
        'काँक्रो, खरबुजा, तरबुजा, लिची र पाकेको आँप',
        'गाईको दूध, घरमै बनाएको मोही (छाछ), बेलको सर्बत',
        'सातु, जौको पिठो र चामलको जाउलो',
        'पुदिना, धनियाँ, सौंफ र कागती-पानी'
      ],
      favorableEn: [
        'Hydrating fruits: Watermelon, cucumber, lychee, and sweet ripe mangoes',
        'Cooling drinks: Fresh churned buttermilk (Mahi), Bael sherbet, tender coconut',
        'Nutritious sattu (roasted chickpea flour), light rice kanji',
        'Mint leaves, coriander, fennel seed water, and fresh lime'
      ],
      avoidNe: [
        'अत्यधिक खुर्सानी, पिरो, अमिलो र नुनिलो खाना',
        'दिउँसो चर्को घाममा लामो समय बस्ने वा कडा परिश्रम गर्ने',
        'रक्सी, चिया-कफीको अत्यधिक सेवन जसले डिहाइड्रेसन गराउँछ'
      ],
      avoidEn: [
        'Excess red chilies, pungent curries, and vinegar-heavy pickles',
        'Prolonged direct midday sun exposure (11 AM - 3 PM)',
        'Excessive dehydrating stimulants like heavy tea, coffee, and alcohol'
      ]
    },
    dailyRitucharyaNe: [
      'हल्का, सेतो वा खुकुलो सुती (कपास) को लुगा लगाउने',
      'दिनभर कम्तीमा ३-४ लिटर पानी, मोही वा सर्बत पिउने',
      'दिउँसो छायाँमा छोटो विश्राम (१५-२० मिनेट) लिन सकिने',
      'बेलुका चन्द्रमाको शीतल किरणमा टहल्ने'
    ],
    dailyRitucharyaEn: [
      'Wear loose, breathable white or light-colored natural cotton fabrics',
      'Maintain continuous hydration with at least 3-4 liters of fluids',
      'Short restful afternoon power nap in a cool airy space',
      'Pleasant moonlit evening strolls to calm internal heat'
    ],
    herbalRemedy: {
      nameNe: 'सौंफ-पुदिना शीतल सर्बत',
      nameEn: 'Cooling Fennel-Mint Elixir',
      ingredientsNe: 'सौंफ १ चम्चा, पुदिना १० पात, मिश्री आधा चम्चा, कागती आधा टुक्रा',
      ingredientsEn: '1 tbsp fennel seeds, 10 fresh mint leaves, 1/2 tsp unrefined rock sugar (Mishri), 1/2 lemon',
      instructionsNe: 'सौंफलाई रातभर पानीमा भिजाउने; बिहान पुदिना र मिश्रीसँग मिचेर कागती निचोरी पिउने।',
      instructionsEn: 'Soak fennel overnight in a glass of water. In the morning, blend gently with mint and rock sugar, strain, add lemon, and sip cold.',
      benefitNe: 'शरीरको भित्री गर्मी शान्त गर्छ, पेट पोल्न दिँदैन र लू लाग्नबाट जोगाउँछ।',
      benefitEn: 'Neutralizes excess internal heat, shields against heat exhaustion, and cools gastric acidity.'
    },
    climateRisksNe: ['लू (Heatstroke) र डिहाइड्रेसन', 'आँखा पोल्ने र छाला डढ्ने समस्या', 'हैजा र पेटको संक्रमण'],
    climateRisksEn: ['Heatstroke & critical dehydration', 'Ocular irritation & sunburn', 'Enteric infections & food spoilage'],
    recommendedPoses: ['sheetali-pranayama', 'chandra-namaskar', 'vrikshasana', 'shavasana'],
    recommendedPranayama: {
      nameNe: 'शीतली तथा सीत्कारी प्राणायाम',
      nameEn: 'Sheetali & Sitkari Cooling Breath',
      descriptionNe: 'जिभ्रोलाई नली जस्तो बनाएर चिसो हावा मुखबाट तान्ने र नाकबाट फाल्ने प्राकृतिक शीतलीकरण।',
      descriptionEn: 'Inhaling through a curled tongue or closed teeth to rapidly drop core body temperature and soothe anger.',
      ratio: 'शीतकारी रेचक (Cooling Inhale)'
    }
  },
  {
    id: 'barsha',
    nameNe: 'वर्षा ऋतु',
    nameEn: 'Barsha Ritu (Monsoon)',
    sanskritTitle: 'मेघमाला वर्षा',
    monthsNe: 'श्रावण र भाद्र (मध्य जुलाई - मध्य सेप्टेम्बर)',
    monthsEn: 'Shrawan & Bhadra (Mid July - Mid Sep)',
    monthNumbers: [4, 5],
    climateSummaryNe: 'अविरल झरी, ओसिलो हावा, हिलो र बाढी, उच्च आर्द्रता तथा जीवाणु र लामखुट्टेको तीव्र वृद्धि हुने मौसम।',
    climateSummaryEn: 'Persistent monsoon rains, high atmospheric humidity, dampness, and bacterial/vector proliferation.',
    doshaNe: 'वात प्रकोप र मन्दाग्नि (Vata Aggravation & Weak Digestion)',
    doshaEn: 'Vata Aggravation & Sluggish Agni',
    doshaStateNe: 'ओसिलो वातावरणले जठराग्नि (पाचन शक्ति) कमजोर हुने र जोर्नी दुखाइ तथा ग्यास बढ्ने अवस्था।',
    doshaStateEn: 'High humidity dampens digestive fire (Agni); water stagnation breeds vector-borne fevers.',
    elementNe: 'जल र अग्नि (Water & Fire)',
    elementEn: 'Water & Fire',
    themeColor: 'blue',
    accentBg: 'from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20',
    accentBorder: 'border-sky-200 dark:border-sky-800',
    taglineNe: 'पाचन अग्नि संरक्षण, उमालेको शुद्ध पानी र लामखुट्टेबाट सतर्कता।',
    taglineEn: 'Safeguarding digestive Agni, drinking 100% boiled water, and dengue vigilance.',
    dietRecommendations: {
      favorableNe: [
        'सधैँ उमालेको वा फिल्टर गरेको तातो पानी मात्र पिउने',
        'ताजा, हल्का र तातो सुप (क्वाँटी, मुङको दाल, लसुन सुप)',
        'हिंग, अदुवा, मरिच, जिरा र मेथीको बढी प्रयोग',
        'अलि पुरानो चामल, गहुँ र मह'
      ],
      favorableEn: [
        'Strictly drink rolling-boiled or sterilized warm water',
        'Warm, fresh light soups: Sprouted mixed beans (Kwati), Moong dal, garlic broth',
        'Digestive spices: Hing (Asafoetida), fresh ginger, black pepper, cumin, and fenugreek',
        'Aged basmati rice, roasted whole grains, and a spoon of raw honey'
      ],
      avoidNe: [
        'काँचो सलाद र बाहिर खुला राखिएका सडकका खाना',
        'नदी वा मूलको नउमालेको पानी (हैजा, टाइफाइडको डर)',
        'वर्षाको पानीमा धेरै रुझ्ने र चिसो ओसिलो लुगा लगाउने'
      ],
      avoidEn: [
        'Raw salads and exposed street food liable to bacterial contamination',
        'Untreated tap or stream water (cholera, typhoid, hepatitis risks)',
        'Sitting in damp, soggy clothing or waterlogged shoes'
      ]
    },
    dailyRitucharyaNe: [
      'घर वरिपरि पानी जम्न नदिई लामखुट्टेको बासस्थान नष्ट गर्ने (डेंगी रोकथाम)',
      'खानपान अगाडि अनिवार्य साबुनपानीले हात धुने',
      'हल्का तेल मालिस गरेर ओस र जोर्नी दुखाइ घटाउने',
      'कोठामा गुग्गुल वा धूप बालेर ओस र कीटाणु भगाउने'
    ],
    dailyRitucharyaEn: [
      'Eliminate standing stagnant water around the home to arrest Dengue mosquitoes',
      'Meticulous hand hygiene before every meal preparation and consumption',
      'Warm sesame oil self-massage to relieve joint stiffness and damp chills',
      'Fumigate living quarters with natural camphor or Guggulu incense'
    ],
    herbalRemedy: {
      nameNe: 'वर्षा प्रतिरक्षा तुलसी-अदुवा काढा',
      nameEn: 'Monsoon Immunity Armor Tea',
      ingredientsNe: 'तुलसी ७ पात, ताजा अदुवा १ इन्च, ल्वाङ २ वटा, बेसार आधा चम्चा',
      ingredientsEn: '7 fresh Tulsi leaves, 1 inch crushed fresh ginger, 2 cloves, 1/2 tsp organic turmeric',
      instructionsNe: 'दुई कप पानीमा यी सबै सामग्री राखेर आधा नहुन्जेल उमाल्ने; छानेर दिनमा दुई पटक पिउने।',
      instructionsEn: 'Boil all ingredients in 2 cups of water until reduced to 1 cup. Strain and drink hot twice daily after meals.',
      benefitNe: 'पाचन बलियो बनाउँछ, भाइरल ज्वरो र डेंगी विरुद्ध शरीरको रोग प्रतिरोधात्मक क्षमता बढाउँछ।',
      benefitEn: 'Bolsters digestive Agni, wards off monsoon viral fevers, and alleviates respiratory chills.'
    },
    climateRisksNe: ['डेंगी र भाइरल ज्वरो (Dengue Outbreaks)', 'हैजा, झाडापखाला र टाइफाइड', 'दाद, चिलाउने र फङ्गल इन्फेक्सन'],
    climateRisksEn: ['Dengue & seasonal viral fevers', 'Waterborne gastroenteritis & typhoid', 'Fungal skin rashes from dampness'],
    recommendedPoses: ['pavanamuktasana', 'bhujangasana', 'gomukhasana', 'nadi-shodhana'],
    recommendedPranayama: {
      nameNe: 'नाडी शोधन (अनुलोम-विलोम)',
      nameEn: 'Nadi Shodhana (Alternate Nostril)',
      descriptionNe: 'दुवै नासिकाबाट पालैपालो सन्तुलित श्वास फेरेर वात दोष शान्त गर्ने र मनलाई स्थिरता दिने ध्यान।',
      descriptionEn: 'Harmonizes the left (Ida) and right (Pingala) nadis, grounding nervous anxiety and calming agitated Vata.',
      ratio: '४:४:४ सन्तुलन (Equalized Breath)'
    }
  },
  {
    id: 'sharad',
    nameNe: 'शरद् ऋतु',
    nameEn: 'Sharad Ritu (Autumn)',
    sanskritTitle: 'शारदीय कौमुदी',
    monthsNe: 'आश्विन र कार्तिक (मध्य सेप्टेम्बर - मध्य नोभेम्बर)',
    monthsEn: 'Ashwin & Kartik (Mid Sep - Mid Nov)',
    monthNumbers: [6, 7],
    climateSummaryNe: 'सफा नीलो आकाश, हँसिलो घाम, हल्का चिसो बिहानी र साँझ, चाडपर्व (दशैं, तिहार, छठ) को रौनकमय मौसम।',
    climateSummaryEn: 'Crisp azure skies, golden sunshine, cool refreshing mornings, and celebratory festival atmospheres.',
    doshaNe: 'पित्त प्रकोप (Pitta Aggravation)',
    doshaEn: 'Pitta Flare-up',
    doshaStateNe: 'वर्षामा सञ्चित भएको पित्त शरद्को तीखो घामले बाहिर निस्किएर एसिडिटी, छालाको समस्या र टाउको दुखाइ निम्त्याउने समय।',
    doshaStateEn: 'Monsoon-accumulated bile/Pitta peaks under clear autumn sun, causing acidity and inflammatory flare-ups.',
    elementNe: 'जल र अग्नि (Water & Fire)',
    elementEn: 'Water & Fire',
    themeColor: 'rose',
    accentBg: 'from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20',
    accentBorder: 'border-rose-200 dark:border-rose-800',
    taglineNe: 'पित्त समन, चाडपर्वमा सन्तुलित खानपान र स्वच्छ वातावरणको आनन्द।',
    taglineEn: 'Balancing Pitta, mindful festival feasting, and enjoying pristine mountain air.',
    dietRecommendations: {
      favorableNe: [
        'शुद्ध गाईको घ्यू (पित्त शान्त पार्ने सर्वोत्कृष्ट औषधि)',
        'मधुर (गुलियो), तिक्त (तितो) र कषाय (कसैलो) स्वादका खानेकुरा',
        'अमला, अनार (दारिम), स्याउ, किसमिस र सुन्तला',
        'काउली, घिरौंला, लौका, मुङको दाल र काँक्रो'
      ],
      favorableEn: [
        'Pure cow ghee (the supreme Ayurvedic medicine to extinguish aggravated Pitta)',
        'Naturally sweet, bitter, and astringent foods',
        'Seasonal fruits: Pomegranates, amala, apples, sweet raisins, and local oranges',
        'Cooling vegetables: Bottle gourd (Lauka), sponge gourd (Ghiramla), and yellow moong dal'
      ],
      avoidNe: [
        'दशैं-तिहारमा अत्यधिक खसीको मासु, तेलमा तारेको चिल्लो र मदिरा',
        'बासी खाना, धेरै पिरो खुर्सानी र तोरीको तेलको अधिक प्रयोग',
        'मध्यदिउँसोको चर्को घाममा सिधै खाली टाउको हिँड्ने'
      ],
      avoidEn: [
        'Over-indulging in heavy greasy festival meats, spicy gravies, and alcohol',
        'Stale festival leftovers, excess red chili powder, and pungent mustard oil',
        'Walking unprotected under intense direct afternoon solar glare'
      ]
    },
    dailyRitucharyaNe: [
      'बिहान हल्का घाममा बसेर प्राणायाम गर्ने र साँझ चन्द्रमाको उज्यालो हेर्ने (चन्द्र दर्शन)',
      'चाडपर्वको भोजमा थोरै अमला वा कागती प्रयोग गरेर पाचन सन्तुलन मिलाउने',
      'हप्तामा एक दिन घ्यूकुमारी (Aloe vera) वा मुङको जाउलो खाएर पेटलाई विश्राम दिने',
      'दैनिक १० मिनेट शान्त भएर ध्यान (Meditation) बस्ने'
    ],
    dailyRitucharyaEn: [
      'Morning breathwork under soft sun, followed by moon gazing (Chandra Darshan) at night',
      'Temper rich Dashain/Tihar festival feasts with amala, cumin, or a touch of lemon',
      'Periodic weekly light fasting or Moong dal khichdi to reset hepatic metabolism',
      'Daily 10-15 minute evening mindfulness to harmonize festival excitement'
    ],
    herbalRemedy: {
      nameNe: 'शारदीय पित्त-शामक अमला रस',
      nameEn: 'Autumn Pitta-Pacifying Amala Elixir',
      ingredientsNe: 'ताजा अमला २ वटा (वा अमला धुलो १ चम्चा), मिश्री आधा चम्चा, घ्यू १/२ चम्चा',
      ingredientsEn: '2 fresh Amalas (or 1 tsp organic Amalaki powder), 1/2 tsp rock sugar (Mishri), 1/2 tsp cow ghee',
      instructionsNe: 'अमलाको रस निकालेर मिश्री र घ्यूसँग मिलाई बिहान खाली पेटमा सेवन गर्ने।',
      instructionsEn: 'Mix freshly extracted amala juice (or powder in warm water) with mishri and melted ghee. Take on an empty stomach.',
      benefitNe: 'एसिडिटी र छातीको जलन शान्त गर्छ, कलेजो बलियो बनाउँछ र रगत सफा राख्छ।',
      benefitEn: 'Cools severe acid reflux, detoxifies the liver after festive meals, and enhances radiant skin.'
    },
    climateRisksNe: ['एसिडिटी, ग्यास्ट्रिक र छाती जलन (Hyperacidity)', 'चाडपर्वको चिल्लोले कलेजो र कोलेस्ट्रोलमा दबाब', 'मौसमी भाइरल आँखा पाक्ने रोग'],
    climateRisksEn: ['Acid reflux & festival indigestion', 'Hepatic overload from rich meats & sweets', 'Viral eye conjunctivitis outbreaks'],
    recommendedPoses: ['paschimottanasana', 'sarvangasana', 'matsyasana', 'sheetali-pranayama'],
    recommendedPranayama: {
      nameNe: 'चन्द्र भेदन तथा शीतली प्राणायाम',
      nameEn: 'Chandra Bhedana & Sheetali Breath',
      descriptionNe: 'बायाँ नाक (इडा नाडी) बाट सास तानेर दायाँबाट फाल्ने अभ्यास जसले शरीरको तापक्रम र पित्तलाई तत्काल शान्त गर्छ।',
      descriptionEn: 'Inhaling through the left nostril activates lunar, soothing pathways to lower arterial tension and pacify Pitta.',
      ratio: '४:४:४ शितल प्रवाह (Lunar Flow)'
    }
  },
  {
    id: 'hemanta',
    nameNe: 'हेमन्त ऋतु',
    nameEn: 'Hemanta Ritu (Pre-Winter)',
    sanskritTitle: 'तुषारमय हेमन्त',
    monthsNe: 'मंसिर र पौष (मध्य नोभेम्बर - मध्य जनवरी)',
    monthsEn: 'Mangsir & Poush (Mid Nov - Mid Jan)',
    monthNumbers: [8, 9],
    climateSummaryNe: 'चिसो सिरेटो, बिहानीपख बाक्लो तुषारो र हुस्सु, छोटा दिन तथा घामको मीठो न्यानोपनको समय।',
    climateSummaryEn: 'Crisp morning frosts, chilly northern breezes, dense valley mist, and short sunny days.',
    doshaNe: 'वात सञ्चय तर जठराग्नि प्रदीप्त (High Digestive Fire)',
    doshaEn: 'Vata Rising with Peak Digestive Agni',
    doshaStateNe: 'बाहिर चिसो भए पनि भित्र पाचन शक्ति (जठराग्नि) सबैभन्दा बलियो हुने भएकाले पोसिलो खाना पचाउन सक्ने ऋतु।',
    doshaStateEn: 'External cold constricts peripheral vessels, concentrating supreme metabolic fire (Jatharagni) in the gut.',
    elementNe: 'पृथ्वी र वायु (Earth & Air)',
    elementEn: 'Earth & Air',
    themeColor: 'indigo',
    accentBg: 'from-indigo-50 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/40',
    accentBorder: 'border-indigo-200 dark:border-indigo-800',
    taglineNe: 'पोसिलो खानपान, तोरीको तेल मालिस र बिहानी घाम ताप्ने उत्तम समय।',
    taglineEn: 'Deep nourishment, warming oil massages, and morning solar therapy.',
    dietRecommendations: {
      favorableNe: [
        'तातो गेडागुडीको झोल, क्वाँटी, सिमी र मासको दाल',
        'घ्यू, चाकु, तिलको लड्डु, तरुल र सखरखण्ड',
        'ओखर, बदाम, काजु र छोकडा',
        'तातो दूधमा बेसार, ल्वाङ, सुकुमेल र अदुवा'
      ],
      favorableEn: [
        'Steaming hearty bean stews, Kwati, black lentil soup with ghee',
        'Traditional warming foods: Chaku (molasses), sesame laddoos, sweet potato, and yams',
        'Nuts and dried fruits: Walnuts, soaked almonds, cashews, and dates',
        'Golden milk: Warm cow milk infused with turmeric, ginger, cardamom, and clove'
      ],
      avoidNe: [
        'चिसो र सुक्खा खाना जसले वात बढाउँछ',
        'बिहान खाली पेटमा चिसो पानी वा फ्रिजको फलफूल',
        'शरीरलाई चिसोमा खुला राख्ने (विशेषगरी कान, घाँटी र पैताला)'
      ],
      avoidEn: [
        'Dry, crunchy, cold raw salads that aggravate dry Vata',
        'Ice-cold drinks straight from refrigeration on empty stomach',
        'Exposing head, ears, throat, and feet to freezing drafts'
      ]
    },
    dailyRitucharyaNe: [
      'बिहान तोरीको मनतातो तेलले शरीरभर मालिस (अभ्यङ्ग) गर्ने',
      'बिहानको पारिलो घाममा बसेर १५-२० मिनेट घाम ताप्ने (भिटामिन D)',
      'तातो पानीले नुहाउने र ऊनी वा न्यानो कपडाले कान-घाँटी ढाक्ने',
      'बेलुका सुत्नुअघि पैतालामा तोरीको तेल घस्ने'
    ],
    dailyRitucharyaEn: [
      'Abhyanga: Full-body warm mustard oil self-massage before warm bath',
      'Sunbathing: 15-20 minutes of golden morning sun for natural Vitamin D',
      'Dress warmly in woolens; shield neck, ears, and chest from mountain drafts',
      'Pada Abhyanga: Rub warm oil onto the soles of feet before bed for deep sleep'
    ],
    herbalRemedy: {
      nameNe: 'स्वर्ण बेसार-अदुवा तातो दूध',
      nameEn: 'Golden Winter Turmeric-Ginger Elixir',
      ingredientsNe: 'गाईको दूध १ गिलास, बेसार आधा चम्चा, सुठो/अदुवा १/४ चम्चा, मरिच १ चिम्टी, सखर १ चम्चा',
      ingredientsEn: '1 glass cow milk, 1/2 tsp organic turmeric, 1/4 tsp ginger powder, 1 pinch black pepper, 1 tsp jaggery',
      instructionsNe: 'दूधमा बेसार, अदुवा र मरिच उमाल्ने; आगोबाट निकालेपछि सखर मिलाएर राती सुत्नुअघि तातोतातो पिउने।',
      instructionsEn: 'Simmer milk with turmeric, ginger, and black pepper for 3 minutes. Stir in jaggery off the heat and drink warm before sleeping.',
      benefitNe: 'जोर्नी दुखाइ कम गर्छ, छातीमा चिसो पस्न दिँदैन र गहिरो मीठो निद्रा ल्याउँछ।',
      benefitEn: 'Soothes joint inflammation, seals bronchial immunity against winter drafts, and induces restorative sleep.'
    },
    climateRisksNe: ['सुख्खा छाला र ओठ फुट्ने समस्या', 'जोर्नी र ढाडको बाथ दुखाइ', 'काठमाडौँ उपत्यकाको बिहानी धुँवा र वायु प्रदूषण (AQI Smog)'],
    climateRisksEn: ['Dry cracked skin & chapped lips', 'Rheumatic joint & lumbar stiffness', 'Valley smog & hazardous morning particulate AQI'],
    recommendedPoses: ['surya-namaskar', 'dhanurasana', 'setu-bandhasana', 'bhastrika'],
    recommendedPranayama: {
      nameNe: 'सूर्य भेदन तथा भस्त्रिका प्राणायाम',
      nameEn: 'Surya Bhedana & Bhastrika (Solar Breath)',
      descriptionNe: 'दायाँ नाकबाट तातो श्वास तानेर शरीरको आन्तरिक ताप बढाउने र चिसो भगाउने अभ्यास।',
      descriptionEn: 'Breathing predominantly through the right solar nostril stokes internal thermal energy and drives out cold chills.',
      ratio: 'सूर्य नाडी सक्रियता (Solar Activation)'
    }
  },
  {
    id: 'shishir',
    nameNe: 'शिशिर ऋतु',
    nameEn: 'Shishir Ritu (Winter)',
    sanskritTitle: 'हिमशीतल शिशिर',
    monthsNe: 'माघ र फाल्गुन (मध्य जनवरी - मध्य मार्च)',
    monthsEn: 'Magh & Falgun (Mid Jan - Mid Mar)',
    monthNumbers: [10, 11],
    climateSummaryNe: 'वर्षकै सबैभन्दा बढी ठन्डी, हिमालमा बाक्लो हिमपात, तराईमा शीतलहर र बिहानीपख सिरेटो चल्ने समय।',
    climateSummaryEn: 'Peak freezing temperatures, heavy Himalayan snowfalls, dense Terai cold waves (Sheetlahar), and icy breezes.',
    doshaNe: 'कफ सञ्चय र वात प्रकोप (Severe Cold & Kapha Accumulation)',
    doshaEn: 'Vata Aggravation & Kapha Accumulation',
    doshaStateNe: 'अत्यधिक चिसोले शरीरका नशाहरू खुम्चिने, रक्तसञ्चार ढिलो हुने र छातीमा चिसो जम्ने अवस्था।',
    doshaStateEn: 'Freezing weather constricts peripheral micro-vessels, slows circulation, and risks hypothermia.',
    elementNe: 'वायु र आकाश (Air & Ether)',
    elementEn: 'Air & Ether',
    themeColor: 'cyan',
    accentBg: 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/20',
    accentBorder: 'border-cyan-200 dark:border-cyan-800',
    taglineNe: 'न्यानोपनाको सुरक्षा, तिल-चाकुको ऊर्जा र शीतलहरबाट बच्ने सावधानी।',
    taglineEn: 'Vigilant thermal protection, sesame-chaku energy, and shielding against cold waves.',
    dietRecommendations: {
      favorableNe: [
        'माघे संक्रान्तिका परिकार: घ्यू, चाकु, तिलको लड्डु, तरुल, पिँडालु',
        'तातो बाक्लो सुप (सिस्नोको सुप, क्वाँटी, लसुनको झोल)',
        'मह, च्यवनप्राश, अदुवा, ल्वाङ र कालो मरिच',
        'तातो पानी वा जडीबुटी चिया मात्र पिउने बानी'
      ],
      favorableEn: [
        'Makar Sankranti delicacies: Molasses (Chaku), sesame laddoos, root yams (Tarul)',
        'Hot nourishing soups: Stinging nettle (Sisnu) soup, garlic broth, mutton bone broth',
        'Chyawanprash, raw honey, crushed cloves, and ginger infusions',
        'Exclusively drink warm or thermos-stored herbal water throughout the day'
      ],
      avoidNe: [
        'चिसो, बासी, फ्रिजको खाना र आइसक्रिम',
        'बिहान धेरै चिसोमा बिना पञ्जा र मोजा बाहिर निस्कने',
        'तराईमा शीतलहरको समयमा बालबालिका र वृद्धवृद्धालाई चिसोमा राख्ने'
      ],
      avoidEn: [
        'Chilled, unheated foods or iced liquids',
        'Exposing extremities (hands/feet) without insulating gloves and socks',
        'Leaving elderly and infants exposed during Terai cold wave spells'
      ]
    },
    dailyRitucharyaNe: [
      'बिहान शरीरलाई राम्रोसँग तताएर मात्र हल्का योग वा हिँडडुल गर्ने',
      'बन्द कोठामा कोइला वा ग्यास हिटर बाल्दा भेन्टिलेसन (हावा ओहोरदोहोर) खुला राख्ने (कार्बन मोनोअक्साइडबाट जोगिने)',
      'दैनिक १ चम्चा च्यवनप्राश मनतातो दूधसँग खाने',
      'राति सुत्दा कान र पैताला न्यानो राख्ने'
    ],
    dailyRitucharyaEn: [
      'Warm up joints thoroughly indoors before stepping out into freezing morning air',
      'CRITICAL: Ensure adequate ventilation when using charcoal burners/gas heaters to prevent carbon monoxide poisoning',
      'Take 1 teaspoon of authentic Chyawanprash with warm milk daily',
      'Keep head and feet snug with woolen cap and insulated socks at night'
    ],
    herbalRemedy: {
      nameNe: 'शिशिर तातो काढा (त्रिकटु अमृत)',
      nameEn: 'Winter Trikatu Warming Brew',
      ingredientsNe: 'मरिच २ दाना, पिपला १ टुक्रा, सुठो १/४ चम्चा, तुलसी ५ पात, सखर १ चम्चा',
      ingredientsEn: '2 black peppercorns, 1 small piece long pepper (Pippali), 1/4 tsp dry ginger, 5 Tulsi leaves, 1 tsp jaggery',
      instructionsNe: 'सबैलाई डेढ कप पानीमा उमालेर १ कप बनाउने र दिनमा एकपटक बिहान तातोतातो पिउने।',
      instructionsEn: 'Simmer Trikatu spices in 1.5 cups of water until reduced to 1 cup. Sweeten with jaggery and drink steaming hot.',
      benefitNe: 'छातीको कफ पगाल्छ, शरीरमा भित्री ताप ल्याउँछ र शीतलहरको चिसोबाट बचाउँछ।',
      benefitEn: 'Dissolves deep chest congestion, activates core thermal metabolic heat, and shields against cold wave pneumonia.'
    },
    climateRisksNe: ['तराईमा शीतलहर (Cold Wave / Hypothermia)', 'मुटु र रक्तचापका बिरामीमा स्ट्रोकको जोखिम', 'कोइलाको धुँवाले निसासिने (Carbon Monoxide Hazard)'],
    climateRisksEn: ['Severe Terai cold waves & hypothermia', 'Spikes in hypertension & cardiovascular strain', 'Indoor carbon monoxide asphyxiation from open heaters'],
    recommendedPoses: ['surya-namaskar', 'trikonasana', 'agnisara', 'balasana'],
    recommendedPranayama: {
      nameNe: 'भस्त्रिका प्राणायाम',
      nameEn: 'Bhastrika (Bellows Breath)',
      descriptionNe: 'धौंकनी जस्तै फोक्सोबाट तीव्र गतिमा सास लिने र फाल्ने अभ्यास जसले तत्काल शरीरलाई भित्रबाट न्यानो बनाउँछ।',
      descriptionEn: 'Rapid forceful bellows-like respiration generating instant internal heat and clearing sinuses.',
      ratio: 'तीव्र उर्जावान रेचक (Bellows Rhythm)'
    }
  }
];

export const YOGA_POSES_DATABASE: YogaPose[] = [
  {
    id: 'surya-namaskar',
    nameNe: 'सूर्य नमस्कार (१२ चरण)',
    nameEn: 'Surya Namaskar (Sun Salutation)',
    sanskritName: 'सूर्य नमस्कार (Surya Namaskara)',
    category: 'strength',
    categoryNe: 'समग्र शक्ति र ऊर्जा',
    categoryEn: 'Full-body Strength & Vitality',
    level: 'beginner',
    levelNe: 'शुरुवाती / मध्यम',
    levelEn: 'Beginner / Intermediate',
    durationMinutes: 10,
    seasonAffinity: ['basanta', 'hemanta', 'shishir'],
    targetAreaNe: 'सम्पूर्ण शरीर, मेरुदण्ड र मुटु',
    targetAreaEn: 'Full body, spine, and cardiovascular flow',
    benefitsNe: [
      'सम्पूर्ण शरीरको रक्तसञ्चार र लचकता तत्काल बढाउँछ',
      'पाचन अग्नि सक्रिय गरी जाडो र वसन्तको अल्छीपन हटाउँछ',
      'तनाव कम गर्छ र एकाग्रता मजबुत बनाउँछ'
    ],
    benefitsEn: [
      'Boosts full-body circulation and muscle flexibility immediately',
      'Stokes digestive Agni, dispelling winter sluggishness and lethargy',
      'Promotes mental clarity, stamina, and cardiovascular rhythm'
    ],
    stepsNe: [
      '१. प्रणामासन: सिधा उभिएर छाती अगाडि हात जोड्ने',
      '२. हस्तउत्तानासन: सास तान्दै हात माथि लगेर पछाडि झुक्ने',
      '३. पादहस्तासन: सास फाल्दै अगाडि झुकेर हातले भुइँ छुने',
      '४. अश्वसञ्चालनासन: दायाँ खुट्टा पछाडि लगेर अगाडि हेर्ने',
      '५. पर्वतासन/दण्डासन: दुवै खुट्टा पछाडि लगेर शरीर तन्काउने',
      '६. अष्टाङ्ग नमस्कार: घुँडा, छाती र चिउँडो भुइँमा राख्ने',
      '७. भुजङ्गासन: छाती उठाएर आकाशतिर हेर्ने',
      '८. अधोमुख श्वानासन: कम्मर माथि उठाएर भी (V) आकार बनाउने'
    ],
    stepsEn: [
      '1. Pranamasana: Stand tall with palms joined in front of the heart',
      '2. Hastauttanasana: Inhale, reach arms overhead and gently arch back',
      '3. Padahastasana: Exhale, fold forward and touch palms to floor',
      '4. Ashwa Sanchalanasana: Step right leg back, chest open, look upward',
      '5. Parvatasana / Plank: Step both feet back, body in a straight diagonal line',
      '6. Ashtanga Namaskara: Gently lower knees, chest, and chin to earth',
      '7. Bhujangasana: Inhale, glide forward and lift chest like a cobra',
      '8. Adho Mukha Svanasana: Exhale, lift hips high into inverted V'
    ],
    precautionsNe: [
      'उच्च रक्तचाप वा कम्मरको कडा दुखाइ भएमा धेरै पछाडि नझुक्ने',
      'गर्भवती महिलाहरूले पेटमा दबाब पर्ने आसन नगर्ने'
    ],
    precautionsEn: [
      'Avoid deep backbends if managing severe hypertension or acute disc herniation',
      'Pregnant practitioners should adopt gentle modified variations'
    ],
    iconType: 'sun'
  },
  {
    id: 'chandra-namaskar',
    nameNe: 'चन्द्र नमस्कार',
    nameEn: 'Chandra Namaskar (Moon Salutation)',
    sanskritName: 'चन्द्र नमस्कार (Chandra Namaskara)',
    category: 'relaxation',
    categoryNe: 'शीतलता र मानसिक शान्ति',
    categoryEn: 'Cooling & Calming Flow',
    level: 'beginner',
    levelNe: 'सबैका लागि उपयुक्त',
    levelEn: 'All Levels',
    durationMinutes: 8,
    seasonAffinity: ['grishma', 'sharad'],
    targetAreaNe: 'कम्मर, तिघ्रा, स्नायु प्रणाली र पित्त सन्तुलन',
    targetAreaEn: 'Pelvis, hips, parasympathetic nervous system',
    benefitsNe: [
      'ग्रीष्म र शरद ऋतुको अत्यधिक शारीरिक गर्मी र पित्त शान्त गर्छ',
      'मानसिक तनाव, रिस र अनिद्रा कम गर्छ',
      'शरीरका हर्मोनहरूलाई सन्तुलनमा राख्न सहयोग गर्छ'
    ],
    benefitsEn: [
      'Pacifies excess Pitta heat during summer and autumn seasons',
      'Relieves psychological irritability, high stress, and sleeplessness',
      'Soothes female reproductive cycle and pelvic tension'
    ],
    stepsNe: [
      '१. शान्त मुद्रामा उभिएर श्वासलाई गहिरो र शीतल बनाउने',
      '२. चन्द्र नमस्कारका पार्श्व मुद्रा (उर्ध्व हस्त, तारासन, देवी मुद्रा) क्रमशः गर्ने',
      '३. आँखा बन्द गरी चिसो चाँदीको चन्द्रमाको प्रकाश कल्पना गर्ने'
    ],
    stepsEn: [
      '1. Stand in steady mountain pose, cultivating soft, tranquil breath',
      '2. Flow laterally through crescent moon, star pose, and goddess squatted stance',
      '3. Envision calming silvery moonlight bathing the spine and nervous system'
    ],
    precautionsNe: ['धेरै चिसो मौसममा शरीर नतताई सिधै नगर्ने'],
    precautionsEn: ['Ensure gentle warm-up before deep lateral hip openers'],
    iconType: 'lotus'
  },
  {
    id: 'paschimottanasana',
    nameNe: 'पश्चिमोत्तानासन (अगाडि झुक्ने आसन)',
    nameEn: 'Paschimottanasana (Seated Forward Bend)',
    sanskritName: 'पश्चिमोत्तानासन',
    category: 'digestion',
    categoryNe: 'पाचन र ढाडको लचकता',
    categoryEn: 'Digestive Fire & Spinal Health',
    level: 'beginner',
    levelNe: 'शुरुवाती',
    levelEn: 'Beginner',
    durationMinutes: 5,
    seasonAffinity: ['sharad', 'barsha'],
    targetAreaNe: 'पेटका भित्री अङ्गहरू, मेरुदण्ड र ह्यामस्ट्रिङ',
    targetAreaEn: 'Abdominal organs, lumbar spine, hamstrings',
    benefitsNe: [
      'शरद ऋतुको एसिडिटी, अपच र कब्जियत हटाउँछ',
      'कलेजो (Liver) र मृगौला (Kidney) को कार्यक्षमता बढाउँछ',
      'मेरुदण्ड तन्काएर दिमागलाई गहिरो शान्ति दिन्छ'
    ],
    benefitsEn: [
      'Soothes festival hyperacidity and promotes peristalsis',
      'Gently massages liver, pancreas, and renal organs',
      'Stretches entire posterior chain, inducing mental calm'
    ],
    stepsNe: [
      '१. भुइँमा दुवै खुट्टा अगाडि सिधा पसारेर बस्ने (दण्डासन)',
      '२. सास तान्दै दुवै हात आकाशतिर सिधा माथि उठाउने',
      '३. सास फाल्दै कम्मरबाट अगाडि झुकेर खुट्टाका औंलाहरू समात्ने',
      '४. निधारलाई घुँडातर्फ लैजाने र सामान्य श्वासमा ३० सेकेन्ड अडिने'
    ],
    stepsEn: [
      '1. Sit upright on yoga mat with legs extended straight in Dandasana',
      '2. Inhale deeply, extending spine and reaching both arms upward',
      '3. Exhale from the hip hinge, reaching forward to clasp big toes or shins',
      '4. Draw forehead toward knees, breathing smoothly for 30 to 60 seconds'
    ],
    precautionsNe: ['स्लिप डिस्क वा कम्मरको गम्भीर समस्या भएमा जबरजस्ती नझुक्ने'],
    precautionsEn: ['Avoid aggressive rounding if suffering from acute lumbar disc bulge'],
    iconType: 'body'
  },
  {
    id: 'bhujangasana',
    nameNe: 'भुजङ्गासन (कोब्रा आसन)',
    nameEn: 'Bhujangasana (Cobra Pose)',
    sanskritName: 'भुजङ्गासन',
    category: 'flexibility',
    categoryNe: 'छाती र फोक्सोको खुलापन',
    categoryEn: 'Chest & Bronchial Expansion',
    level: 'beginner',
    levelNe: 'सजिलो',
    levelEn: 'Beginner',
    durationMinutes: 4,
    seasonAffinity: ['barsha', 'basanta', 'shishir'],
    targetAreaNe: 'छाती, घाँटी, काँध र पेटको मांसपेशी',
    targetAreaEn: 'Chest, lungs, shoulders, abdominal wall',
    benefitsNe: [
      'वर्षा र जाडोमा छातीमा जम्ने कफ हटाएर श्वासप्रश्वास सहज बनाउँछ',
      'कम्प्युटर र मोबाइल चलाउँदा कुप्रिने ढाडलाई सिधा बनाउँछ',
      'पेटका भित्री ग्रन्थीहरू सक्रिय गरी पाचन सुधार्छ'
    ],
    benefitsEn: [
      'Expands thoracic lung capacity to combat seasonal respiratory stagnation',
      'Corrects desk-hunch posture and strengthens erector spinae muscles',
      'Gently compresses kidneys and adrenal glands, invigorating energy'
    ],
    stepsNe: [
      '१. भुइँमा पेटको बलले घोप्टो परेर सुत्ने',
      '२. दुवै हात छातीको दायाँ-बायाँ भुइँमा राख्ने',
      '३. सास तान्दै नाभीसम्मको भाग बिस्तारै माथि उठाउने',
      '४. काँधलाई कानबाट टाढा राख्दै आकाशतिर हेर्ने'
    ],
    stepsEn: [
      '1. Lie prone on belly with tops of feet pressed into the mat',
      '2. Place palms on floor under shoulders, elbows tucked close to ribs',
      '3. Inhale, gently pressing through palms to lift chest up to navel',
      '4. Roll shoulders back and down away from ears, looking softly upward'
    ],
    precautionsNe: ['पेटको शल्यक्रिया भएको वा हर्निया भएमा यो आसन नगर्ने'],
    precautionsEn: ['Contraindicated for recent abdominal surgery or hernia'],
    iconType: 'mountain'
  },
  {
    id: 'pavanamuktasana',
    nameNe: 'पवनमुक्तासन (ग्यास निष्कासन आसन)',
    nameEn: 'Pavanamuktasana (Wind-Relieving Pose)',
    sanskritName: 'पवनमुक्तासन',
    category: 'digestion',
    categoryNe: 'पेटको ग्यास र वात समन',
    categoryEn: 'Gastric Decompression & Vata Relief',
    level: 'beginner',
    levelNe: 'सबैका लागि',
    levelEn: 'All Levels',
    durationMinutes: 5,
    seasonAffinity: ['barsha', 'sharad', 'hemanta'],
    targetAreaNe: 'ठूलो आन्द्रा, कम्मर र कम्मरको जोर्नी',
    targetAreaEn: 'Ascending/descending colon, sacrum, hip flexors',
    benefitsNe: [
      'वर्षा र चाडपर्वमा हुने पेट फुल्ने, ग्यास र कब्जियत तत्काल कम गर्छ',
      'कम्मरको तल्लो भागको दुखाइ र तनाव शान्त पार्छ',
      'आन्द्रामा रक्तसञ्चार सुधार गर्छ'
    ],
    benefitsEn: [
      'Rapidly releases trapped intestinal gas and alleviates bloating',
      'Releases lumbar sacral compression after prolonged sitting',
      'Stimulates healthy digestive peristalsis and visceral detox'
    ],
    stepsNe: [
      '१. उत्तानो परेर भुइँमा सुत्ने र दुवै घुँडा खुम्च्याउने',
      '२. दुवै हातले घुँडालाई बेरेर छातीतर्फ दबाउने',
      '३. सास फाल्दै टाउको उठाएर नाक वा चिउँडोले घुँडा छुने प्रयास गर्ने',
      '४. २०-३० सेकेन्डसम्म सामान्य श्वासमा रोकेर बिस्तारै सिधा हुने'
    ],
    stepsEn: [
      '1. Lie flat on your back on a cushioned mat',
      '2. Bend both knees and draw them toward your chest',
      '3. Wrap your arms around shins, clasping wrists or elbows',
      '4. Exhale, gently lift head and bring nose toward knees; breathe deeply for 30s'
    ],
    precautionsNe: ['गर्दनमा कडा दुखाइ (सर्भाइकल) भएमा टाउको नउठाउने, केवल घुँडा मात्र दबाउने'],
    precautionsEn: ['Keep head rested on floor if suffering from cervical spondylosis'],
    iconType: 'wind'
  },
  {
    id: 'vrikshasana',
    nameNe: 'वृक्षासन (रूख आसन)',
    nameEn: 'Vrikshasana (Tree Pose)',
    sanskritName: 'वृक्षासन',
    category: 'relaxation',
    categoryNe: 'सन्तुलन र मानसिक एकाग्रता',
    categoryEn: 'Neuromuscular Balance & Mental Focus',
    level: 'beginner',
    levelNe: 'शुरुवाती',
    levelEn: 'Beginner',
    durationMinutes: 4,
    seasonAffinity: ['basanta', 'grishma', 'sharad'],
    targetAreaNe: 'खुट्टाको जोर्नी, तिघ्रा र स्नायु प्रणाली',
    targetAreaEn: 'Ankles, calves, pelvic girdle, inner equilibrium',
    benefitsNe: [
      'मनलाई तत्काल शान्त, स्थिर र केन्द्रित बनाउँछ',
      'खुट्टाका मांसपेशी र जोर्नी बलियो बनाउँछ',
      'शारीरिक सन्तुलन र स्नायु समन्वयमा सुधार गर्छ'
    ],
    benefitsEn: [
      'Cultivates grounded, unflappable mental tranquility',
      'Tones ankles, calves, and stabilizing knee ligaments',
      'Develops somatic poise and neuro-muscular harmony'
    ],
    stepsNe: [
      '१. सीधा उभिएर आँखालाई अगाडिको कुनै स्थिर बिन्दुमा केन्द्रित गर्ने',
      '२. दायाँ खुट्टा उठाएर पैतालालाई बायाँ तिघ्राको भित्री भागमा अड्याउने',
      '३. दुवै हात छाती अगाडि वा टाउको माथि लगेर नमस्ते मुद्रा बनाउने',
      '४. ३० सेकेन्ड सन्तुलन कायम राखेपछि अर्को खुट्टाबाट दोहोर्याउने'
    ],
    stepsEn: [
      '1. Stand tall in Mountain pose, fixing gaze upon an unmoving focal point (Drishti)',
      '2. Shift weight to left foot; place sole of right foot against inner left thigh or calf',
      '3. Bring palms together at heart center or stretch arms overhead like tree branches',
      '4. Hold for 5-8 steady breaths; switch sides mindfully'
    ],
    precautionsNe: ['पैतालालाई घुँडाको जोर्नीमा कहिल्यै नअड्याउने (तिघ्रा वा पिँडुलामा मात्र राख्ने)'],
    precautionsEn: ['Never press foot directly against side of knee joint; place above or below'],
    iconType: 'lotus'
  },
  {
    id: 'shavasana',
    nameNe: 'शवासन (पूर्ण विश्राम आसन)',
    nameEn: 'Shavasana (Corpse Pose)',
    sanskritName: 'शवासन',
    category: 'relaxation',
    categoryNe: 'गहिरो विश्राम र ध्यान',
    categoryEn: 'Deep Systematic Rejuvenation',
    level: 'beginner',
    levelNe: 'सबैका लागि',
    levelEn: 'All Levels',
    durationMinutes: 10,
    seasonAffinity: ['grishma', 'sharad', 'barsha', 'basanta', 'hemanta', 'shishir'],
    targetAreaNe: 'सम्पूर्ण स्नायु प्रणाली, मस्तिष्क र मुटु',
    targetAreaEn: 'Entire central nervous system, brainwaves, cardiovascular tone',
    benefitsNe: [
      'तनाव, चिन्ता र उच्च रक्तचापलाई तत्काल घटाउँछ',
      'योग अभ्यासपछिको ऊर्जालाई शरीरका प्रत्येक कोषमा सञ्चार गर्छ',
      'मानसिक शान्ति र आनन्दको अनुभूति गराउँछ'
    ],
    benefitsEn: [
      'Downregulates sympathetic fight-or-flight nervous tone rapidly',
      'Integrates energetic benefits of preceding asanas throughout all cells',
      'Restores hormonal balance and deeply recharges vitality'
    ],
    stepsNe: [
      '१. भुइँमा उत्तानो परेर सुत्ने, खुट्टाहरू हल्का खुला राख्ने',
      '२. हातहरू शरीरबाट केही पर हत्केला आकाशतिर फर्काएर राख्ने',
      '३. आँखा बन्द गरी खुट्टाका औंलादेखि टाउकोसम्म शरीरका सबै अङ्गलाई खुकुलो छाड्ने',
      '४. ५ देखि १० मिनेटसम्म केवल श्वासको आउजाउलाई साक्षी भावले हेर्ने'
    ],
    stepsEn: [
      '1. Lie flat on your back, separating feet comfortably mat-width apart',
      '2. Rest arms alongside body, palms facing naturally upward',
      '3. Close eyes softly; consciously release tension from toes to scalp',
      '4. Rest passively for 8-10 minutes, observing quiet breath without interference'
    ],
    precautionsNe: ['निदाउनबाट बच्न मनमा हल्का सजगता कायम राख्ने'],
    precautionsEn: ['Maintain subtle inner witness consciousness rather than falling asleep'],
    iconType: 'heart'
  }
];

export const PRANAYAMA_EXERCISES: PranayamaPractice[] = [
  {
    id: 'nadi-shodhana',
    nameNe: 'नाडी शोधन प्राणायाम (अनुलोम-विलोम)',
    nameEn: 'Nadi Shodhana (Alternate Nostril Breathing)',
    sanskritName: 'नाडी शोधन',
    taglineNe: 'मनलाई शान्त पार्ने, मस्तिष्कका दुवै भाग सन्तुलित गर्ने र वात दोष हटाउने उत्तम अभ्यास।',
    taglineEn: 'Master balancing breath for nervous equilibrium, brain hemisphere harmony, and stress dissolution.',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 2,
    },
    benefitsNe: [
      'तनाव, चिन्ता र रक्तचाप तत्काल कम गर्छ',
      'फोक्सोको क्षमता बढाउँछ र अक्सिजन आपूर्ति सुधार्छ',
      'मनलाई ध्यान (Meditation) का लागि तयार गर्छ'
    ],
    benefitsEn: [
      'Lowers heart rate, cortisol, and autonomic stress spikes',
      'Equalizes airflow and oxygenation through both cerebral hemispheres',
      'Prime gateway to deeper meditative absorption'
    ],
    suitableForSeason: ['barsha', 'sharad', 'basanta', 'hemanta'],
    contraindicationsNe: 'रुघाले दुवै नाक पूर्ण बन्द भएको बेला जबरजस्ती नगर्ने।',
    contraindicationsEn: 'Do not force breath if nasal passages are acutely congested.'
  },
  {
    id: 'sheetali',
    nameNe: 'शीतली तथा सीत्कारी प्राणायाम (शीतल श्वास)',
    nameEn: 'Sheetali Pranayama (Cooling Breath)',
    sanskritName: 'शीतली प्राणायाम',
    taglineNe: 'गर्मी र शरद ऋतुमा शरीरको भित्री राप, एसिडिटी र रिसलाई तुरुन्तै शीतल बनाउने विधि।',
    taglineEn: 'Rapidly extinguishes excess internal metabolic heat, acute acidity, and emotional agitation.',
    pattern: {
      inhale: 4,
      hold: 2,
      exhale: 6,
      pause: 0,
    },
    benefitsNe: [
      'शरीरको भित्री तापक्रम घटाउँछ र प्यास शान्त गर्छ',
      'एसिडिटी, छाती जलन र छालाको पोलाइ कम गर्छ',
      'रिस र मानसिक उत्तेजनालाई तत्काल शान्त गर्छ'
    ],
    benefitsEn: [
      'Cools physical body temperature and quenches intense thirst',
      'Alleviates acid reflux, bile flare-ups, and skin heat',
      'Soothes hot-tempered moods and mental agitation'
    ],
    suitableForSeason: ['grishma', 'sharad'],
    contraindicationsNe: 'जाडो महिनामा वा कडा रुघाखोकी लागेको बेला यो अभ्यास नगर्ने।',
    contraindicationsEn: 'Avoid during freezing winter months or if suffering from phlegmy bronchial colds.'
  },
  {
    id: 'box-breathing',
    nameNe: 'साम्य प्राणायाम (४-४-४-४ बक्स ब्रिदिंग)',
    nameEn: 'Box Breathing (Equal Ratio 4-4-4-4)',
    sanskritName: 'साम्य वृत्ति प्राणायाम',
    taglineNe: 'कामको तनाव, परीक्षाको डर वा आत्तिने बानीलाई २ मिनेटमै शान्त बनाउने वैज्ञानिक विधि।',
    taglineEn: 'Clinically proven parasympathetic reset used by high-performance professionals and yogis.',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 4,
    },
    benefitsNe: [
      'मुटुको धड्कन नियन्त्रण गरी तत्काल मन स्थिर बनाउँछ',
      'निर्णय क्षमता र कार्यकुशलता बढाउँछ',
      'मस्तिष्कमा अक्सिजन र कार्बनडाइअक्साइडको सन्तुलन मिलाउँछ'
    ],
    benefitsEn: [
      'Regulates cardiac rhythm, arresting panic and acute anxiety',
      'Enhances executive focus and situational composure',
      'Optimizes gas exchange and vagal tone'
    ],
    suitableForSeason: ['basanta', 'grishma', 'barsha', 'sharad', 'hemanta', 'shishir'],
    contraindicationsNe: 'गर्भवती वा मुटुका गम्भीर बिरामीले श्वास धेरै बेर नरोक्ने।',
    contraindicationsEn: 'Keep retention comfortable; pregnant practitioners should omit breath holding.'
  },
  {
    id: 'bhramari',
    nameNe: 'भ्रामरी प्राणायाम (भमरा जस्तो गुञ्जन)',
    nameEn: 'Bhramari (Humming Bee Breath)',
    sanskritName: 'भ्रामरी प्राणायाम',
    taglineNe: 'कान बन्द गरेर भमरा जस्तो गुञ्जन गर्दा मस्तिष्कका नशाहरूमा गहिरो शान्ति र आनन्द छाउने अभ्यास।',
    taglineEn: 'Vibrational humming frequency stimulating nitric oxide release and pineal relaxation.',
    pattern: {
      inhale: 4,
      hold: 0,
      exhale: 6,
      pause: 2,
    },
    benefitsNe: [
      'टाउको दुखाइ, माइग्रेन र तनाव तुरुन्तै हटाउँछ',
      'राति निद्रा नपर्ने समस्या (Insomnia) मा रामबाण सिद्ध हुन्छ',
      'उच्च रक्तचाप घटाउन र ध्यानमा गहिरिन सहयोग गर्छ'
    ],
    benefitsEn: [
      'Soothes tension headaches and chronic cranial tightness',
      'Exceptional evening remedy for insomnia and racing thoughts',
      'Spurs nitric oxide production, expanding microvascular airways'
    ],
    suitableForSeason: ['basanta', 'grishma', 'barsha', 'sharad', 'hemanta', 'shishir'],
    contraindicationsNe: 'कानमा कडा संक्रमण वा पिप बगिरहेको भए कान नथिच्ने।',
    contraindicationsEn: 'Avoid plugging ears firmly if suffering from active middle ear infection.'
  }
];

export interface RegionHealthGuide {
  id: 'terai' | 'pahad' | 'himal';
  titleNe: string;
  titleEn: string;
  geographyNe: string;
  geographyEn: string;
  elevation: string;
  climateAttributesNe: string[];
  climateAttributesEn: string[];
  seasonalRisksNe: string[];
  seasonalRisksEn: string[];
  lifestyleTipsNe: string[];
  lifestyleTipsEn: string[];
}

export const REGION_HEALTH_GUIDES: RegionHealthGuide[] = [
  {
    id: 'pahad',
    titleNe: 'पहाड तथा काठमाडौँ उपत्यका',
    titleEn: 'Hills & Kathmandu Valley',
    geographyNe: 'मध्य पहाडी भूभाग, उपत्यका र महाभारत पर्वत शृङ्खला',
    geographyEn: 'Mid-Hill valleys, ridge settlements, and Mahabharat range',
    elevation: '१,००० - २,५०० मिटर',
    climateAttributesNe: [
      'मध्यम र रमाइलो मौसम तर बिहानी र साँझमा चिसो सिरेटो',
      'उपत्यकाको भौगोलिक बनोटले गर्दा हिउँदमा बिहान बाक्लो हुस्सु र वायु प्रदूषण (Smog)',
      'मौसम परिवर्तन हुँदा भाइरल फ्लु र घाँटीको संक्रमण'
    ],
    climateAttributesEn: [
      'Temperate, pleasant climate with brisk morning/evening chills',
      'Bowl-shaped topography trapping winter valley smog and fine particulate matter',
      'Rapid seasonal transitions inducing common flu and bronchial irritation'
    ],
    seasonalRisksNe: [
      'हिउँदमा वायु प्रदूषण (High AQI) बाट दम र खोकी',
      'पानीको मुहान प्रदूषित भएर जण्डिस र टाइफाइड',
      'बिहानीपख चिसोमा हिँड्दा साइनस र माइग्रेन'
    ],
    seasonalRisksEn: [
      'Winter PM2.5 smog triggering asthma and chronic bronchitis',
      'Water contamination during monsoons causing hepatitis A and enteric fever',
      'Sinusitis and tension headaches from cold valley drafts'
    ],
    lifestyleTipsNe: [
      'प्रदूषण बढी भएको बिहान मास्क लगाउने र घरभित्र योग/व्यायाम गर्ने',
      'दैनिक मनतातो पानीमा अदुवा-तुलसी उमालेर पिउने बानी बसाल्ने',
      'हप्तामा एकपटक नाकमा तेल हाल्ने (नस्य) जसले धुलो छेक्छ'
    ],
    lifestyleTipsEn: [
      'Wear high-filtration masks outdoors during high morning AQI spikes; exercise indoors',
      'Sip warm boiled water infused with ginger and Tulsi throughout the day',
      'Apply protective sesame oil in nasal vestibules (Nasya) to trap atmospheric particulates'
    ]
  },
  {
    id: 'terai',
    titleNe: 'तराई तथा भित्री मधेश',
    titleEn: 'Terai & Inner Plains',
    geographyNe: 'नेपालको अन्न भण्डार, समथर मैदान र चुरे फेदी',
    geographyEn: 'Southern alluvial plains, grain heartland, and Chure foothills',
    elevation: '६० - ६०० मिटर',
    climateAttributesNe: [
      'गर्मीमा अत्यधिक तापक्रम (४०°C सम्म) र तातो हावा (लू)',
      'वर्षामा भारी वर्षा, उच्च आर्द्रता र बाढीको सम्भावना',
      'हिउँदमा सूर्य नदेखिने गरी लामो समय चल्ने शीतलहर'
    ],
    climateAttributesEn: [
      'Severe summer heatwaves exceeding 40°C with scorching Loo winds',
      'High tropical humidity and heavy precipitation during monsoons',
      'Protracted winter cold wave (Sheetlahar) with zero sunlight for weeks'
    ],
    seasonalRisksNe: [
      'गर्मीमा लू (Heatstroke) र पानीको कमी (Dehydration)',
      'लामखुट्टेबाट सर्ने डेंगी, मलेरिया र कालाजार',
      'हिउँदको शीतलहरमा हाइपोथर्मिया र निमोनिया',
      'गर्मीमा सर्पदंश (Snakebite) को जोखिम'
    ],
    seasonalRisksEn: [
      'Heat exhaustion and fatal heatstroke during summer agricultural peaks',
      'Vector-borne diseases: Dengue, Malaria, and Japanese Encephalitis',
      'Severe winter Sheetlahar hypothermia among vulnerable elders and children',
      'Heightened snakebite risk during monsoon farm work'
    ],
    lifestyleTipsNe: [
      'गर्मीमा घरमै बनाएको मोही, बेलको सर्बत र सातु पर्याप्त पिउने',
      'सुत्दा अनिवार्य झुल (Mosquito Net) को प्रयोग गर्ने र घर वरिपरि पानी जम्न नदिने',
      'शीतलहरमा न्यानो लुगा लगाउने र कोठा तताउँदा पर्याप्त हावा आवतजावत राख्ने'
    ],
    lifestyleTipsEn: [
      'Consume traditional electrolytes: Fresh Mahi (buttermilk), Bael juice, and sattu',
      'Sleep under insecticide-treated bed nets; aggressively drain stagnant pools',
      'Layer warm clothing in Sheetlahar; ensure safe ventilation with heating fuels'
    ]
  },
  {
    id: 'himal',
    titleNe: 'हिमाली तथा उच्च पर्वतीय क्षेत्र',
    titleEn: 'High Himalayas & Alpine Mountain',
    geographyNe: 'उच्च भूभाग, हिमालका फेदी, पदमार्ग र शेर्पा बस्तीहरू',
    geographyEn: 'High alpine plateaus, trekking routes, and Himalayan passes',
    elevation: '२,५०० - ८,८४८ मिटर',
    climateAttributesNe: [
      'सधैँ चिसो, सुख्खा र पातलो हावा (अक्सिजनको मात्रा कम)',
      'तीव्र परावैजनी किरण (UV Radiation) र कडा सिरेटो',
      'लामो र कडा हिउँद'
    ],
    climateAttributesEn: [
      'Year-round cold, dry, thin atmospheric air with reduced oxygen pressure',
      'Intense high-altitude UV radiation reflected off snow and ice',
      'Protracted harsh sub-zero freezing winters'
    ],
    seasonalRisksNe: [
      'लेक लाग्ने समस्या (Acute Mountain Sickness - AMS / HAPE / HACE)',
      'कडा चिसोबाट हातखुट्टा जम्ने (Frostbite) र सुख्खा छाला',
      'आँखामा हिउँको परावर्तनले असर (Snow Blindness)'
    ],
    seasonalRisksEn: [
      'High altitude sickness (AMS, HAPE, HACE) from rapid ascent',
      'Peripheral frostbite, chilblains, and deep cutaneous cracking',
      'Snow blindness (Photokeratitis) from unfiltered alpine reflection'
    ],
    lifestyleTipsNe: [
      'माथि चढ्दा बिस्तारै उचाइ अनुकूलन (Acclimatization) गर्ने र लसुन सुप पिउने',
      'दिनमा कम्तीमा ४-५ लिटर मनतातो पानी पिउने (सुख्खा हावाले छिटो डिहाइड्रेसन गराउँछ)',
      'गुणस्तरीय घामको चश्मा (UV Sunglasses) र छालामा घ्यू वा चिल्लो मोइस्चराइजर लगाउने'
    ],
    lifestyleTipsEn: [
      'Ascend gradually adhering to strict acclimatization schedules; drink garlic soup',
      'Force hydration with 4-5 liters of hot liquids daily against arid alpine respiration',
      'Wear certified UV400 glacier glasses and protect skin with rich lipids/ghee'
    ]
  }
];

export const DAILY_WELLNESS_QUOTES = [
  {
    quoteNe: 'हिताहितं सुखं दुःखमायुस्तस्य हिताहितम्। मानं च तच्च यत्रोक्तमायुर्वेदः स उच्यते॥',
    quoteEn: 'Ayurveda is that science which describes what is wholesome and unwholesome, happy and sorrowful in life.',
    author: 'चरक संहिता (Charaka Samhita)',
  },
  {
    quoteNe: 'शरीरमाद्यं खलु धर्मसाधनम् — सबै कर्तव्य, कर्म र धर्म पूरा गर्ने पहिलो माध्यम यो पवित्र शरीर नै हो।',
    quoteEn: 'The physical body is verily the primary instrument for fulfilling all virtues and aspirations.',
    author: 'कालिदास (Kalidasa)',
  },
  {
    quoteNe: 'योगश्चित्तवृत्तिनिरोधः — मनका चञ्चल तरङ्गहरूलाई शान्त र स्थिर बनाउनु नै वास्तविक योग हो।',
    quoteEn: 'Yoga is the tranquil stilling of the fluctuating modifications of the mind.',
    author: 'महर्षि पतञ्जलि (Patanjali)',
  },
  {
    quoteNe: 'ऋतु अनुसारको खानपान र सन्तुलित दिनचर्या नै कुनै पनि औषधीभन्दा ठूलो आरोग्यको स्रोत हो।',
    quoteEn: 'Seasonal nourishment and a disciplined daily routine are greater sources of wellness than any medicine.',
    author: 'आयुर्वेदिक आचरण (Vedic Wellness)',
  },
];
