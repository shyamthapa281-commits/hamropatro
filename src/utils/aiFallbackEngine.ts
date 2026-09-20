/**
 * AI Fallback Engine
 * Provides instant, authentic, culturally grounded Vedic Astrological guidance,
 * News summaries, and language analysis when the Gemini API is rate-limited (429)
 * or offline.
 */

export interface VedicReadingOptions {
  rashiId?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  question: string;
  category?: string;
  language?: 'ne' | 'en';
}

const RASHI_DATA: Record<string, {
  nameNe: string;
  nameEn: string;
  lordNe: string;
  lordEn: string;
  luckyColorNe: string;
  luckyColorEn: string;
  luckyNumber: number;
  mantra: string;
  gemstoneNe: string;
  gemstoneEn: string;
}> = {
  mesh: { nameNe: 'मेष', nameEn: 'Aries', lordNe: 'मंगल ग्रह (Mars)', lordEn: 'Mars', luckyColorNe: 'रातो र गुलाबी', luckyColorEn: 'Red & Coral', luckyNumber: 9, mantra: 'ॐ अं अंगारकाय नमः', gemstoneNe: 'मुगा (Coral) - अनामिका औँलामा', gemstoneEn: 'Red Coral in copper/gold on ring finger' },
  brish: { nameNe: 'वृष', nameEn: 'Taurus', lordNe: 'शुक्र ग्रह (Venus)', lordEn: 'Venus', luckyColorNe: 'सेतो र चम्किलो', luckyColorEn: 'White & Cream', luckyNumber: 6, mantra: 'ॐ शुं शुक्राय नमः', gemstoneNe: 'हिरा वा ओपल (Diamond/Opal) - माझी वा कान्छी औँलामा', gemstoneEn: 'Diamond/Opal in silver' },
  mithun: { nameNe: 'मिथुन', nameEn: 'Gemini', lordNe: 'बुध ग्रह (Mercury)', lordEn: 'Mercury', luckyColorNe: 'हरियो र हल्का पहेँलो', luckyColorEn: 'Emerald Green', luckyNumber: 5, mantra: 'ॐ बुं बुधाय नमः', gemstoneNe: 'पन्ना (Emerald) - कान्छी औँलामा', gemstoneEn: 'Emerald in bronze/silver' },
  karka: { nameNe: 'कर्कट', nameEn: 'Cancer', lordNe: 'चन्द्रमा (Moon)', lordEn: 'Moon', luckyColorNe: 'दुधिलो सेतो र चाँदी', luckyColorEn: 'Pearl White & Silver', luckyNumber: 2, mantra: 'ॐ सों सोमाय नमः', gemstoneNe: 'मोती (Natural Pearl) - कान्छी औँलामा', gemstoneEn: 'Natural Pearl in silver' },
  simha: { nameNe: 'सिंह', nameEn: 'Leo', lordNe: 'सूर्य देव (Sun)', lordEn: 'Sun', luckyColorNe: 'सुन्तला र सुनौलो', luckyColorEn: 'Gold & Saffron', luckyNumber: 1, mantra: 'ॐ घृणि सूर्याय नमः', gemstoneNe: 'माणिक्य (Ruby) - अनामिका औँलामा', gemstoneEn: 'Ruby in gold/copper on ring finger' },
  kanya: { nameNe: 'कन्या', nameEn: 'Virgo', lordNe: 'बुध ग्रह (Mercury)', lordEn: 'Mercury', luckyColorNe: 'गाढा हरियो र खैरो', luckyColorEn: 'Olive Green', luckyNumber: 5, mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', gemstoneNe: 'पन्ना (Emerald) - कान्छी औँलामा', gemstoneEn: 'Emerald on little finger' },
  tula: { nameNe: 'तुला', nameEn: 'Libra', lordNe: 'शुक्र ग्रह (Venus)', lordEn: 'Venus', luckyColorNe: 'आसमानी निलो र सेतो', luckyColorEn: 'Sky Blue & White', luckyNumber: 6, mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', gemstoneNe: 'ओपल वा हिरा (Opal/Diamond)', gemstoneEn: 'Opal/Diamond in platinum/silver' },
  brischik: { nameNe: 'वृश्चिक', nameEn: 'Scorpio', lordNe: 'मंगल ग्रह (Mars)', lordEn: 'Mars', luckyColorNe: 'गाढा रातो र महरुम', luckyColorEn: 'Maroon & Deep Red', luckyNumber: 9, mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', gemstoneNe: 'मुगा (Coral) - तामा वा सुनमा', gemstoneEn: 'Red Coral in copper/gold' },
  dhanu: { nameNe: 'धनु', nameEn: 'Sagittarius', lordNe: 'बृहस्पति (Jupiter)', lordEn: 'Jupiter', luckyColorNe: 'पहेँलो र सुनौलो', luckyColorEn: 'Bright Yellow & Gold', luckyNumber: 3, mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', gemstoneNe: 'पुखराज (Yellow Sapphire) - चोर औँलामा', gemstoneEn: 'Yellow Sapphire in gold on index finger' },
  makar: { nameNe: 'मकर', nameEn: 'Capricorn', lordNe: 'शनि देव (Saturn)', lordEn: 'Saturn', luckyColorNe: 'कालो र गाढा निलो', luckyColorEn: 'Navy Blue & Charcoal', luckyNumber: 8, mantra: 'ॐ शं शनैश्चराय नमः', gemstoneNe: 'नीलम (Blue Sapphire) वा एमेथिस्ट', gemstoneEn: 'Blue Sapphire or Amethyst in panchadhatu' },
  kumbha: { nameNe: 'कुम्भ', nameEn: 'Aquarius', lordNe: 'शनि देव (Saturn)', lordEn: 'Saturn', luckyColorNe: 'आसमानी र बैजनी', luckyColorEn: 'Electric Blue & Purple', luckyNumber: 8, mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', gemstoneNe: 'नीलम (Blue Sapphire) - माझी औँलामा', gemstoneEn: 'Blue Sapphire on middle finger' },
  meen: { nameNe: 'मीन', nameEn: 'Pisces', lordNe: 'बृहस्पति (Jupiter)', lordEn: 'Jupiter', luckyColorNe: 'केसरिया र पहेँलो', luckyColorEn: 'Saffron & Sea Green', luckyNumber: 3, mantra: 'ॐ बृं बृहस्पतये नमः', gemstoneNe: 'पुखराज (Yellow Sapphire) - सुनमा', gemstoneEn: 'Yellow Sapphire in gold' },
};

export function generateAstrologyReading(opts: VedicReadingOptions): string {
  const isNe = (opts.language || 'ne') === 'ne';
  const rashiKey = (opts.rashiId || 'mesh').toLowerCase();
  const info = RASHI_DATA[rashiKey] || RASHI_DATA['mesh'];
  const cat = (opts.category || 'General').toLowerCase();

  if (isNe) {
    let focusAdvice = 'कर्मक्षेत्र र पारिवारिक जीवनमा सकारात्मक ऊर्जाको सञ्चार हुनेछ। आफ्नो योजनामा अडिग रहनुहोला।';
    if (cat.includes('career') || cat.includes('job') || cat.includes('व्यवसाय')) {
      focusAdvice = 'दशम भावमा ग्रहहरूको अनुकूल दृष्टि परेकाले रोकिएका कार्यहरू सुचारु हुनेछन्। नयाँ अवसर वा पदोन्नतिको सम्भावना बलियो छ। निर्णय गर्दा वरिष्ठ व्यक्तिहरूको सल्लाह लिनु शुभ रहनेछ।';
    } else if (cat.includes('love') || cat.includes('marriage') || cat.includes('विवाह')) {
      focusAdvice = 'सप्तम भावमा शुभ ग्रहको प्रभावले सम्बन्धमा प्रगाढता आउनेछ। आपसी समझदारी र संवादलाई प्राथमिकता दिनुहोस्।';
    } else if (cat.includes('health') || cat.includes('स्वास्थ्य')) {
      focusAdvice = 'खानपान र दैनिक दिनचर्यामा ध्यान पुर्‍याउनुहोला। प्रातःकालमा सूर्य नमस्कार र ध्यान गर्दा मानसिक र शारीरिक स्फूर्ति प्राप्त हुनेछ।';
    } else if (cat.includes('finance') || cat.includes('धन')) {
      focusAdvice = 'एकादश भाव अनुकूल रहेकाले आर्थिक लाभका नयाँ स्रोतहरू पहिचान हुनेछन्। दीर्घकालीन लगानी फलदायी रहनेछ।';
    }

    return `### 🕉️ वैदिक ज्योतिष परामर्श तथा कुण्डली विश्लेषण

**नमस्ते! हाम्रो वैदिक ज्योतिष परामर्शमा स्वागत छ।**

#### १. ग्रहमण्डल तथा गोचर विश्लेषण:
तपाईंको राशि **${info.nameNe}** को स्वामी **${info.lordNe}** हुन्। हालको गोचर अनुसार बृहस्पति र चन्द्रमाको शुभ दृष्टिले तपाईंको मनोबल उच्च राख्नेछ।

#### २. तपाईंको प्रश्नको ज्योतिषीय उत्तर:
**"${opts.question}"**
${focusAdvice}

#### ३. शुभ तत्त्वहरू (Auspicious Factors):
- 🎨 **शुभ रङ्ग:** ${info.luckyColorNe}
- 🔢 **शुभ अङ्क:** ${info.luckyNumber}
- 📅 **शुभ वार:** बिहीबार र मंगलबार

#### ४. वैदिक उपाय तथा मन्त्र साधना (Upaya):
- **दैनिक मन्त्र:** \`${info.mantra}\` (बिहान स्नान पश्चात १०८ पटक जप गर्नुहोला)
- **दान धर्म:** पहेँलो वा सेतो अन्न/मिष्ठान्न गरिब वा मन्दिरमा अर्पण गर्नुहोस्।
- **रत्न सिफारिस:** ${info.gemstoneNe}

*शुभम् भवतु! सकारात्मक सोच र सत्कर्मले जीवनमा सधैँ विजय दिलाउँछ।*`;
  } else {
    return `### 🕉️ Vedic Astrological Reading & Kundali Insights

#### 1. Planetary Alignment & Planetary Lord:
Your zodiac sign **${info.nameEn}** is ruled by **${info.lordEn}**. The current planetary transit reflects supportive lunar and jovial energy, fostering clarity and purpose.

#### 2. Direct Astrological Guidance:
**Question:** "${opts.question}"
Based on transit charts, the 10th and 11th planetary houses indicate favorable progress in your endeavors. Trust deliberate planning and remain patient during pivotal discussions.

#### 3. Auspicious Elements:
- 🎨 **Lucky Color:** ${info.luckyColorEn}
- 🔢 **Lucky Number:** ${info.luckyNumber}
- 💎 **Recommended Gemstone:** ${info.gemstoneEn}

#### 4. Vedic Remedy (Upaya):
- **Sacred Chant:** \`${info.mantra}\` (108 repetitions in the morning)
- **Auspicious Action:** Offer grains or support to those in need on Thursdays/Tuesdays.`;
  }
}

export function generateNewsSummary(title: string, content: string, language: 'ne' | 'en' = 'ne'): string {
  const isNe = language === 'ne';
  const cleanTitle = (title || '').trim();
  const cleanContent = (content || title || '').slice(0, 300).trim();

  if (isNe) {
    return `### 📌 मुख्य बुँदाहरू (Key Highlights)
- **विषय:** ${cleanTitle}
- **सार संक्षेप:** ${cleanContent.slice(0, 140)}...
- **ताजा अवस्था:** घटनाक्रम सम्बन्धी थप विवरणहरू सम्बन्धित निकायहरूबाट अद्यावधिक भइरहेका छन्।

### 💡 प्रभाव र विश्लेषण (Impact & Context)
यस घटनाले राष्ट्रिय तथा स्थानीय स्तरमा प्रत्यक्ष प्रभाव पार्ने देखिन्छ। नागरिक सरोकार र सम्बन्धित क्षेत्रका लागि यो एक महत्वपूर्ण घटनाक्रम हो।`;
  } else {
    return `### 📌 Key Highlights
- **Topic:** ${cleanTitle}
- **Overview:** ${cleanContent.slice(0, 140)}...
- **Current Status:** Official updates and follow-ups continue to develop.

### 💡 Context & Impact
This development holds strategic importance for civil and institutional sectors across Nepal.`;
  }
}

export function generateCustomPrediction(rashiName: string, period: string, language: 'ne' | 'en' = 'ne'): string {
  const isNe = language === 'ne';
  const rashiKey = (rashiName || 'मेष').toLowerCase();
  
  // Calculate deterministic scores
  const hash = (rashiName + period).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const careerScore = 75 + (hash % 21);
  const loveScore = 70 + ((hash * 3) % 25);
  const financeScore = 72 + ((hash * 7) % 23);
  const healthScore = 78 + ((hash * 5) % 18);
  const luckyNum = (hash % 9) + 1;

  if (isNe) {
    return `### 🌟 ${rashiName} - ${period === 'daily' ? 'दैनिक' : period === 'weekly' ? 'साप्ताहिक' : 'मासिक'} राशिफल विश्लेषण

#### 📊 अनुकूलता सूचकांक:
- 💼 **कार्यक्षेत्र र व्यवसाय (Career):** ${careerScore}%
- ❤️ **प्रेम तथा सम्बन्ध (Love):** ${loveScore}%
- 💰 **आर्थिक लाभ (Finance):** ${financeScore}%
- 🌿 **स्वास्थ्य (Health):** ${healthScore}%

#### 🪐 ग्रह गोचर फल:
यस समयावधिमा तपाईंको राशिमा शुभ ग्रहहरूको दृष्टि रहेकाले नयाँ अवसरहरू प्राप्त हुनेछन्। महत्वपूर्ण निर्णयहरू लिँदा अनुभवी व्यक्तिहरूको सल्लाह लिनु लाभदायक हुनेछ।

#### 🍀 शुभ तत्त्वहरू:
- 🔢 **शुभ अङ्क:** ${luckyNum}
- 🎨 **शुभ रङ्ग:** पहेँलो वा हल्का रातो
- 🪔 **आजको उपाय:** बिहान सूर्यलाई जल चढाउनुहोस् र ॐ नमः शिवाय मन्त्रको जप गर्नुहोस्।`;
  } else {
    return `### 🌟 ${rashiName} - ${period.toUpperCase()} Vedic Prediction

#### 📊 Astrological Index:
- 💼 **Career & Business:** ${careerScore}%
- ❤️ **Love & Relationships:** ${loveScore}%
- 💰 **Financial Prosperity:** ${financeScore}%
- 🌿 **Health & Vitality:** ${healthScore}%

#### 🪐 Planetary Highlights:
Favorable planetary transits bring constructive energy and new avenues for growth. Maintain focus and embrace collaborative discussions.

#### 🍀 Auspicious Essentials:
- 🔢 **Lucky Number:** ${luckyNum}
- 🎨 **Lucky Color:** Saffron / Gold
- 🪔 **Daily Remedy:** Offer morning prayers and engage in mindful meditation.`;
  }
}
