/**
 * Vedic Panchanga Detail Helpers
 * Provides comprehensive metadata and explanations for Tithi, Yoga, and Karana.
 */

export interface TithiDetail {
  nameNe: string;
  nameEn: string;
  pakshaNe: string;
  pakshaEn: string;
  categoryNe: 'नन्दा' | 'भद्रा' | 'जया' | 'रिक्ता' | 'पूर्णा';
  categoryEn: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Purna';
  deityNe: string;
  deityEn: string;
  significanceNe: string;
  significanceEn: string;
  isFavorable: boolean;
}

export interface YogaDetail {
  nameNe: string;
  nameEn: string;
  type: 'shubh' | 'ashubh' | 'neutral';
  typeNe: 'शुभ योग' | 'अशुभ / सतर्क' | 'सामान्य';
  typeEn: 'Auspicious' | 'Inauspicious / Caution' | 'Neutral';
  deityNe: string;
  deityEn: string;
  guidanceNe: string;
  guidanceEn: string;
}

export interface KaranaDetail {
  nameNe: string;
  nameEn: string;
  category: 'chara' | 'sthira';
  categoryNe: 'चर करण (चलायमान)' | 'स्थिर करण (अचल)';
  categoryEn: 'Chara (Movable)' | 'Sthira (Fixed)';
  isBhadra: boolean;
  deityNe: string;
  deityEn: string;
  guidanceNe: string;
  guidanceEn: string;
}

// 30 Tithi metadata
export function getTithiDetails(tithiName: string): TithiDetail {
  const isKrishna = tithiName.includes('कृष्ण') || tithiName.includes('Krishna');
  const cleanName = tithiName.replace(/\(कृष्ण\)|\(शुक्ल\)/g, '').trim();

  let categoryNe: 'नन्दा' | 'भद्रा' | 'जया' | 'रिक्ता' | 'पूर्णा' = 'पूर्णा';
  let categoryEn: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Purna' = 'Purna';
  let deityNe = 'विष्णु';
  let deityEn = 'Lord Vishnu';
  let isFavorable = true;

  if (cleanName.includes('प्रतिपदा') || cleanName.includes('षष्ठी') || cleanName.includes('एकादशी')) {
    categoryNe = 'नन्दा';
    categoryEn = 'Nanda';
    deityNe = 'अग्नि / कार्तिकेय / विष्णु';
    deityEn = 'Agni / Kartikeya / Vishnu';
  } else if (cleanName.includes('द्वितीया') || cleanName.includes('सप्तमी') || cleanName.includes('द्वादशी')) {
    categoryNe = 'भद्रा';
    categoryEn = 'Bhadra';
    deityNe = 'ब्रह्मा / सूर्य / विष्णु';
    deityEn = 'Brahma / Surya / Vishnu';
  } else if (cleanName.includes('तृतीया') || cleanName.includes('अष्टमी') || cleanName.includes('त्रयोदशी')) {
    categoryNe = 'जया';
    categoryEn = 'Jaya';
    deityNe = 'गौरी / शिव / कामदेव';
    deityEn = 'Gauri / Shiva / Kamadeva';
  } else if (cleanName.includes('चतुर्थी') || cleanName.includes('नवमी') || cleanName.includes('चतुर्दशी')) {
    categoryNe = 'रिक्ता';
    categoryEn = 'Rikta';
    deityNe = 'गणेश / दुर्गा / यमराज';
    deityEn = 'Ganesha / Durga / Yama';
    isFavorable = false;
  } else {
    categoryNe = 'पूर्णा';
    categoryEn = 'Purna';
    deityNe = 'चन्द्र / पितृ / सूर्य';
    deityEn = 'Chandra / Pitris / Surya';
  }

  const pakshaNe = isKrishna ? 'कृष्ण पक्ष (अँध्यारो पक्ष)' : 'शुक्ल पक्ष (उज्यालो पक्ष)';
  const pakshaEn = isKrishna ? 'Krishna Paksha (Waning Moon)' : 'Shukla Paksha (Waxing Moon)';

  let significanceNe = 'धार्मिक अनुष्ठान, दान र सत्कर्मका लागि उत्तम समय।';
  let significanceEn = 'Favorable for auspicious beginnings and spiritual ceremonies.';

  if (categoryNe === 'नन्दा') {
    significanceNe = 'नन्दा तिथि: आनन्द, सुख, नयाँ वस्त्र, गृह प्रवेश र नयाँ कार्य थालनीका लागि शुभ।';
    significanceEn = 'Nanda Tithi: Highly auspicious for prosperity, joy, and new ventures.';
  } else if (categoryNe === 'भद्रा') {
    significanceNe = 'भद्रा तिथि: यात्रा, विद्यारम्भ, व्यापार तथा सन्तान सम्बन्धी कार्यका लागि अनुकूल।';
    significanceEn = 'Bhadra Tithi: Excellent for education, commerce, and journeys.';
  } else if (categoryNe === 'जया') {
    significanceNe = 'जया तिथि: विजय, कानुनी निर्णय, पराक्रम र रोकिएका कार्य सम्पन्न गर्न श्रेष्ठ।';
    significanceEn = 'Jaya Tithi: Bestows victory, courage, and successful completion.';
  } else if (categoryNe === 'रिक्ता') {
    significanceNe = 'रिक्ता तिथि: मांगलिक कार्य र नयाँ सम्झौता निषेध; ऋण मोचन र साधनाका लागि मात्र उपयोगी।';
    significanceEn = 'Rikta Tithi: Caution advised for weddings and contracts; good for meditation.';
  } else if (categoryNe === 'पूर्णा') {
    significanceNe = 'पूर्णा तिथि: सम्पूर्ण मनोकामना पूर्ण हुने, महापूजा, व्रत तथा तीर्थाटनका लागि सर्वोत्कृष्ट।';
    significanceEn = 'Purna Tithi: Culmination of spiritual merit and complete fulfillment.';
  }

  return {
    nameNe: tithiName,
    nameEn: tithiName,
    pakshaNe,
    pakshaEn,
    categoryNe,
    categoryEn,
    deityNe,
    deityEn,
    significanceNe,
    significanceEn,
    isFavorable,
  };
}

// 27 Yoga metadata
const YOGA_CATALOG: Record<string, { type: 'shubh' | 'ashubh' | 'neutral'; deityNe: string; deityEn: string; guidanceNe: string; guidanceEn: string }> = {
  'विष्कुम्भ': { type: 'ashubh', deityNe: 'यमराज', deityEn: 'Yama', guidanceNe: 'प्रारम्भिक कार्यमा अवरोध आउन सक्ने भएकाले संयम राख्नुहोला।', guidanceEn: 'Minor obstacles in early phases; exercise patience.' },
  'प्रीति': { type: 'shubh', deityNe: 'विष्णु', deityEn: 'Vishnu', guidanceNe: 'प्रेम, पारिवारिक मेलमिलाप र नयाँ सहकार्यका लागि अति उत्तम योग।', guidanceEn: 'Fosters affection, harmony, and cooperative partnerships.' },
  'आयुष्मान्': { type: 'shubh', deityNe: 'चन्द्रमा', deityEn: 'Moon', guidanceNe: 'दीर्घायु, स्वास्थ्य लाभ र नयाँ औषधोपचार आरम्भ गर्न शुभ।', guidanceEn: 'Promotes longevity, vitality, and health recovery.' },
  'सौभाग्य': { type: 'shubh', deityNe: 'ब्रह्मा', deityEn: 'Brahma', guidanceNe: 'सर्वतोमुखी सौभाग्य, वैवाहिक कार्य र ऐश्वर्य वृद्धिका लागि श्रेष्ठ।', guidanceEn: 'Brings all-round prosperity, marital happiness, and fortune.' },
  'शोभन': { type: 'shubh', deityNe: 'बृहस्पति', deityEn: 'Jupiter', guidanceNe: 'सत्कार्य, धार्मिक अनुष्ठान र अध्ययन-अध्यापनका लागि फलदायी।', guidanceEn: 'Excellent for study, noble deeds, and cultural events.' },
  'अतिगण्ड': { type: 'ashubh', deityNe: 'वायु', deityEn: 'Vayu', guidanceNe: 'जोखिमपूर्ण यात्रा र ठूलो आर्थिक लगानी गर्दा सतर्कता आवश्यक।', guidanceEn: 'Avoid high-risk travel and speculative financial investments.' },
  'सुकर्मा': { type: 'shubh', deityNe: 'इन्द्र', deityEn: 'Indra', guidanceNe: 'नयाँ जागिर, पदभार ग्रहण र सत्कर्मका लागि अत्यन्त प्रभावशाली।', guidanceEn: 'Highly supportive for career moves and righteous pursuits.' },
  'धृति': { type: 'shubh', deityNe: 'जल (वरुण)', deityEn: 'Varuna', guidanceNe: 'धैर्य, शिलान्यास, घर निर्माण र स्थिर प्रकृतिका कार्यका लागि उत्तम।', guidanceEn: 'Builds fortitude; ideal for foundation-laying and construction.' },
  'शूल': { type: 'ashubh', deityNe: 'सर्प', deityEn: 'Sarpa', guidanceNe: 'विवाद र तर्कवितर्कबाट बच्नुहोस्; शान्ति पाठ लाभदायक।', guidanceEn: 'Refrain from disputes and confrontations; maintain inner calm.' },
  'गण्ड': { type: 'ashubh', deityNe: 'अग्नि', deityEn: 'Agni', guidanceNe: 'महत्वपूर्ण निर्णयमा दोधार हुन सक्ने भएकाले अग्रजको सल्लाह लिनुहोस्।', guidanceEn: 'Seek elder counsel before making critical life choices.' },
  'वृद्धि': { type: 'shubh', deityNe: 'सूर्य', deityEn: 'Surya', guidanceNe: 'व्यापार, सम्पत्ति खरिद र धन वृद्धि सम्बन्धी कार्यमा शुभ फल मिल्छ।', guidanceEn: 'Empowers commercial expansion, asset growth, and profits.' },
  'ध्रुव': { type: 'shubh', deityNe: 'भूमि', deityEn: 'Prithvi', guidanceNe: 'स्थिर सम्पत्ति, प्रशासनिक काम र दीर्घकालीन योजनाका लागि सर्वोत्तम।', guidanceEn: 'Ideal for permanent endeavors, governance, and long-term plans.' },
  'व्याघात': { type: 'ashubh', deityNe: 'रुद्र', deityEn: 'Rudra', guidanceNe: 'आवेश र हतारमा काम नगर्नुहोला; नियमित पूजाआजामा ध्यान दिनुहोस्।', guidanceEn: 'Guard against haste and impulsive reactions; stay reflective.' },
  'हर्षण': { type: 'shubh', deityNe: 'सूर्य', deityEn: 'Surya', guidanceNe: 'हर्षोल्लास, उत्सव, सम्मान प्राप्ति र साथीभाइसँग भेटघाटको योग।', guidanceEn: 'Inspires celebration, public recognition, and celebratory gatherings.' },
  'वज्र': { type: 'ashubh', deityNe: 'वरुण', deityEn: 'Varuna', guidanceNe: 'कठिन कार्यहरूमा संयम राख्नुहोला; साहसिक खेल र यात्रामा सावधानी।', guidanceEn: 'Practice caution in physically demanding tasks.' },
  'सिद्धि': { type: 'shubh', deityNe: 'गणेश', deityEn: 'Ganesha', guidanceNe: 'सबै प्रकारका कार्य सिद्धि, मन्त्र जप र योजनाबद्ध सफलताको श्रेष्ठ योग।', guidanceEn: 'Supreme yoga for accomplishment, mastery, and success.' },
  'व्यतीपात': { type: 'ashubh', deityNe: 'यम', deityEn: 'Yama', guidanceNe: 'मांगलिक कार्य नगर्नुहोला; दान, तर्पण र मन्त्र जपका लागि मात्र उत्तम।', guidanceEn: 'Inauspicious for celebrations; excellent for charity and meditation.' },
  'वरीयान्': { type: 'shubh', deityNe: 'कुबेर', deityEn: 'Kubera', guidanceNe: 'धन लाभ, पदोन्नति र सुख-सुविधा वृद्धिका लागि फलदायी।', guidanceEn: 'Auspicious for wealth inflow, advancement, and comfort.' },
  'परिघ': { type: 'ashubh', deityNe: 'विश्वकर्मा', deityEn: 'Vishwakarma', guidanceNe: 'शत्रु बाधा निवारणका लागि अनुकूल; सामान्य यात्रामा सतर्कता राख्नुहोस्।', guidanceEn: 'Favorable for clearing hindrances; cautious in travel.' },
  'शिव': { type: 'shubh', deityNe: 'महादेव शिव', deityEn: 'Lord Shiva', guidanceNe: 'अध्यात्म, मन्दिर दर्शन, ज्ञानोपार्जन र समग्र कल्याणको योग।', guidanceEn: 'Divine blessings for spiritual upliftment, wisdom, and peace.' },
  'सिद्ध': { type: 'shubh', deityNe: 'कार्तिकेय', deityEn: 'Kartikeya', guidanceNe: 'कला, सीप, प्रविधि र परीक्षामा उच्चतम सफलता दिने योग।', guidanceEn: 'Brings outstanding success in arts, exams, and technical work.' },
  'साध्य': { type: 'shubh', deityNe: 'साध्यगण', deityEn: 'Sadhyas', guidanceNe: 'असाध्य काम पनि सहकार्य र निरन्तर प्रयासले सम्भव हुने योग।', guidanceEn: 'Enables breakthroughs in tough challenges through perseverance.' },
  'शुभ': { type: 'shubh', deityNe: 'लक्ष्मी', deityEn: 'Lakshmi', guidanceNe: 'सद्भावना, आर्थिक कारोबार र नयाँ सम्बन्ध गाँस्नका लागि अत्यन्त शुभ।', guidanceEn: 'Radiates good fortune, harmonious bonds, and financial ease.' },
  'शुक्ल': { type: 'shubh', deityNe: 'पार्वती', deityEn: 'Parvati', guidanceNe: 'पवित्र विचार, सत्सङ्ग र मनको शान्ति प्राप्त हुने योग।', guidanceEn: 'Brings mental clarity, virtue, and joyful inner calm.' },
  'ब्रह्म': { type: 'shubh', deityNe: 'ब्रह्मा', deityEn: 'Brahma', guidanceNe: 'अध्ययन, अनुसन्धान, मन्त्र दीक्षा र बौद्धिक कार्यमा सर्वोच्च फल।', guidanceEn: 'Ideal for academic study, research, and philosophical insight.' },
  'इन्द्र': { type: 'shubh', deityNe: 'इन्द्र देव', deityEn: 'Indra', guidanceNe: 'नेतृत्व, संगठन, विजय र प्रतिष्ठित व्यक्तित्वसँगको भेटघाटमा शुभ।', guidanceEn: 'Elevates leadership qualities, organizational success, and honors.' },
  'वैधृति': { type: 'ashubh', deityNe: 'अदिति', deityEn: 'Aditi', guidanceNe: 'नयाँ सम्झौता र महत्वपूर्ण यात्रा स्थगित गर्नु उचित; ईश्वर ध्यान गर्नुहोला।', guidanceEn: 'Avoid signing major contracts or traveling; good for introspection.' },
};

export function getYogaDetails(yogaName: string): YogaDetail {
  const match = Object.keys(YOGA_CATALOG).find(k => yogaName.includes(k));
  const data = match ? YOGA_CATALOG[match] : YOGA_CATALOG['सिद्धि'];

  const typeNe = data.type === 'shubh' ? 'शुभ योग' : data.type === 'ashubh' ? 'अशुभ / सतर्क' : 'सामान्य';
  const typeEn = data.type === 'shubh' ? 'Auspicious' : data.type === 'ashubh' ? 'Inauspicious / Caution' : 'Neutral';

  return {
    nameNe: yogaName,
    nameEn: match || yogaName,
    type: data.type,
    typeNe,
    typeEn,
    deityNe: data.deityNe,
    deityEn: data.deityEn,
    guidanceNe: data.guidanceNe,
    guidanceEn: data.guidanceEn,
  };
}

// 11 Karana metadata
const KARANA_CATALOG: Record<string, { category: 'chara' | 'sthira'; isBhadra: boolean; deityNe: string; deityEn: string; guidanceNe: string; guidanceEn: string }> = {
  'बव': {
    category: 'chara',
    isBhadra: false,
    deityNe: 'इन्द्र (सिंह प्रतीक)',
    deityEn: 'Indra (Lion)',
    guidanceNe: 'शुभ करण: धार्मिक काम, आरोग्य र शक्ति सञ्चयका लागि उत्तम।',
    guidanceEn: 'Auspicious Karana: Excellent for health, rituals, and enterprise.',
  },
  'बालव': {
    category: 'chara',
    isBhadra: false,
    deityNe: 'ब्रह्मा (चितुवा प्रतीक)',
    deityEn: 'Brahma (Leopard)',
    guidanceNe: 'शुभ करण: विद्यारम्भ, यज्ञ र परोपकारी कार्यका लागि श्रेष्ठ।',
    guidanceEn: 'Auspicious Karana: Favors learning, charity, and rites.',
  },
  'कौलव': {
    category: 'chara',
    isBhadra: false,
    deityNe: 'सूर्य (बँदेल प्रतीक)',
    deityEn: 'Surya (Boar)',
    guidanceNe: 'शुभ करण: मित्रता, प्रेम सम्बन्ध र व्यापार सम्झौताका लागि अनुकूल।',
    guidanceEn: 'Auspicious Karana: Enhances friendship, commerce, and treaties.',
  },
  'तैतिल': {
    category: 'chara',
    isBhadra: false,
    deityNe: 'विश्वकर्मा (गधा प्रतीक)',
    deityEn: 'Vishwakarma (Donkey)',
    guidanceNe: 'शुभ करण: निर्माण, हस्तकला, गहना खरिद र सौन्दर्य कार्यमा उपयोगी।',
    guidanceEn: 'Auspicious Karana: Good for construction, jewelry, and styling.',
  },
  'गर': {
    category: 'chara',
    isBhadra: false,
    deityNe: 'भूमि (हात्ती प्रतीक)',
    deityEn: 'Prithvi (Elephant)',
    guidanceNe: 'शुभ करण: कृषि, वृक्षारोपण, घर निर्माण र घरायसी कार्यका लागि उत्तम।',
    guidanceEn: 'Auspicious Karana: Best for farming, gardening, and real estate.',
  },
  'वणिज': {
    category: 'chara',
    isBhadra: false,
    deityNe: 'लक्ष्मी (गोरु प्रतीक)',
    deityEn: 'Lakshmi (Ox)',
    guidanceNe: 'शुभ करण: व्यापार, वित्तीय लेनदेन, बिक्री र यात्राका लागि अत्यन्त शुभ।',
    guidanceEn: 'Auspicious Karana: Ideal for trade, retail sales, and finance.',
  },
  'विष्टि': {
    category: 'chara',
    isBhadra: true,
    deityNe: 'यमराज / भद्रा (कुकुर प्रतीक)',
    deityEn: 'Yama / Bhadra (Hound)',
    guidanceNe: '⚠️ विष्टि (भद्रा) करण: मांगलिक कार्य, विवाह र यात्रा निषेध। कोर्ट, शत्रु दमन र रक्षा कार्यमा मात्र उपयोगी।',
    guidanceEn: '⚠️ Vishti (Bhadra) Karana: Avoid weddings and travels. Useful only for defense and litigation.',
  },
  'शकुनि': {
    category: 'sthira',
    isBhadra: false,
    deityNe: 'कलिपुरुष (चिल प्रतीक)',
    deityEn: 'Kali (Eagle)',
    guidanceNe: 'स्थिर करण: औषधि निर्माण, उपचार र मन्त्र साधनाका लागि उपयुक्त।',
    guidanceEn: 'Fixed Karana: Helpful for medicine preparation and remedy work.',
  },
  'चतुष्पाद': {
    category: 'sthira',
    isBhadra: false,
    deityNe: 'वृषेश्वर (पशु प्रतीक)',
    deityEn: 'Vrishabha (Cattle)',
    guidanceNe: 'स्थिर करण: गाईवस्तु पालन, पितृ श्राद्ध र दान कर्ममा फलदायी।',
    guidanceEn: 'Fixed Karana: Favorable for livestock, ancestral rituals, and charity.',
  },
  'नाग': {
    category: 'sthira',
    isBhadra: false,
    deityNe: 'नागदेवता (सर्प प्रतीक)',
    deityEn: 'Naga Deva (Serpent)',
    guidanceNe: 'स्थिर करण: गुप्त विद्या, विषहरण र साहसिक कार्यका लागि उपयुक्त।',
    guidanceEn: 'Fixed Karana: Supportive of secret lore, detox, and courageous tasks.',
  },
  'किंस्तुघ्न': {
    category: 'sthira',
    isBhadra: false,
    deityNe: 'वायु (कीरा प्रतीक)',
    deityEn: 'Vayu (Insect)',
    guidanceNe: 'स्थिर करण: मंगल कार्य, शान्ति पाठ र नयाँ उद्यमका लागि शुभ।',
    guidanceEn: 'Fixed Karana: Favorable for peace chants and auspicious initiatives.',
  },
};

export function getKaranaDetails(karanaName: string): KaranaDetail {
  const match = Object.keys(KARANA_CATALOG).find(k => karanaName.includes(k));
  const data = match ? KARANA_CATALOG[match] : KARANA_CATALOG['बव'];

  return {
    nameNe: karanaName,
    nameEn: match || karanaName,
    category: data.category,
    categoryNe: data.category === 'chara' ? 'चर करण (चलायमान)' : 'स्थिर करण (अचल)',
    categoryEn: data.category === 'chara' ? 'Chara (Movable)' : 'Sthira (Fixed)',
    isBhadra: data.isBhadra,
    deityNe: data.deityNe,
    deityEn: data.deityEn,
    guidanceNe: data.guidanceNe,
    guidanceEn: data.guidanceEn,
  };
}
