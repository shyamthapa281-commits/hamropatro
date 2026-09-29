// Cloudflare Pages Function: AI Vedic Astrology & Kundali Consultation
// Works automatically on Cloudflare Pages with zero configuration

interface Env {
  GEMINI_API_KEY?: string;
}

const RASHI_DATA: Record<string, { nameNe: string; nameEn: string; lordNe: string; lordEn: string; elementNe: string; gemstoneNe: string; gemstoneEn: string; mantra: string; luckyColorNe: string; luckyColorEn: string; luckyNumber: number }> = {
  mesh: { nameNe: 'मेष', nameEn: 'Aries', lordNe: 'मंगल (Mars)', lordEn: 'Mars', elementNe: 'अग्नि', gemstoneNe: 'मुगा (Red Coral)', gemstoneEn: 'Red Coral', mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', luckyColorNe: 'रातो र सुनौलो', luckyColorEn: 'Ruby Red & Gold', luckyNumber: 9 },
  vrishabha: { nameNe: 'वृष', nameEn: 'Taurus', lordNe: 'शुक्र (Venus)', lordEn: 'Venus', elementNe: 'पृथ्वी', gemstoneNe: 'हीरा / ओपल', gemstoneEn: 'Diamond / Opal', mantra: 'ॐ शुं शुक्राय नमः', luckyColorNe: 'सेतो र गुलाबी', luckyColorEn: 'White & Pink', luckyNumber: 6 },
  mithun: { nameNe: 'मिथुन', nameEn: 'Gemini', lordNe: 'बुध (Mercury)', lordEn: 'Mercury', elementNe: 'वायु', gemstoneNe: 'पन्ना (Emerald)', gemstoneEn: 'Emerald', mantra: 'ॐ बुं बुधाय नमः', luckyColorNe: 'हरियो र पहेँलो', luckyColorEn: 'Emerald Green & Yellow', luckyNumber: 5 },
  karkat: { nameNe: 'कर्कट', nameEn: 'Cancer', lordNe: 'चन्द्रमा (Moon)', lordEn: 'Moon', elementNe: 'जल', gemstoneNe: 'मोती (Pearl)', gemstoneEn: 'Natural Pearl', mantra: 'ॐ सों सोमाय नमः', luckyColorNe: 'मोती सेतो र चाँदी', luckyColorEn: 'Pearl White & Silver', luckyNumber: 2 },
  simha: { nameNe: 'सिंह', nameEn: 'Leo', lordNe: 'सूर्य (Sun)', lordEn: 'Sun', elementNe: 'अग्नि', gemstoneNe: 'माणिक्य (Ruby)', gemstoneEn: 'Ruby', mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', luckyColorNe: 'सुनौलो र रातो', luckyColorEn: 'Gold & Crimson', luckyNumber: 1 },
  kanya: { nameNe: 'कन्या', nameEn: 'Virgo', lordNe: 'बुध (Mercury)', lordEn: 'Mercury', elementNe: 'पृथ्वी', gemstoneNe: 'पन्ना (Emerald)', gemstoneEn: 'Emerald', mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', luckyColorNe: 'गाढा हरियो', luckyColorEn: 'Dark Green', luckyNumber: 5 },
  tula: { nameNe: 'तुला', nameEn: 'Libra', lordNe: 'शुक्र (Venus)', lordEn: 'Venus', elementNe: 'वायु', gemstoneNe: 'हीरा वा ओपल', gemstoneEn: 'Diamond / Opal', mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', luckyColorNe: 'हल्का नीलो र सेतो', luckyColorEn: 'Light Blue & White', luckyNumber: 6 },
  vrischika: { nameNe: 'वृश्चिक', nameEn: 'Scorpio', lordNe: 'मंगल (Mars)', lordEn: 'Mars', elementNe: 'जल', gemstoneNe: 'मुगा (Red Coral)', gemstoneEn: 'Red Coral', mantra: 'ॐ अं अङ्गारकाय नमः', luckyColorNe: 'सिन्दूरे र रातो', luckyColorEn: 'Scarlet & Red', luckyNumber: 9 },
  dhanu: { nameNe: 'धनु', nameEn: 'Sagittarius', lordNe: 'बृहस्पति (Jupiter)', lordEn: 'Jupiter', elementNe: 'अग्नि', gemstoneNe: 'पुखराज (Yellow Sapphire)', gemstoneEn: 'Yellow Sapphire', mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', luckyColorNe: 'पहेँलो र केशर', luckyColorEn: 'Bright Yellow & Saffron', luckyNumber: 3 },
  makar: { nameNe: 'मकर', nameEn: 'Capricorn', lordNe: 'शनि (Saturn)', lordEn: 'Saturn', elementNe: 'पृथ्वी', gemstoneNe: 'नीलम (Blue Sapphire)', gemstoneEn: 'Blue Sapphire', mantra: 'ॐ शं शनैश्चराय नमः', luckyColorNe: 'नीलो र कालो', luckyColorEn: 'Deep Blue & Navy', luckyNumber: 8 },
  kumbha: { nameNe: 'कुम्भ', nameEn: 'Aquarius', lordNe: 'शनि (Saturn)', lordEn: 'Saturn', elementNe: 'वायु', gemstoneNe: 'नीलम वा एमेथिस्ट', gemstoneEn: 'Blue Sapphire / Amethyst', mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', luckyColorNe: 'आसमानी र बैजनी', luckyColorEn: 'Sky Blue & Violet', luckyNumber: 8 },
  meen: { nameNe: 'मीन', nameEn: 'Pisces', lordNe: 'बृहस्पति (Jupiter)', lordEn: 'Jupiter', elementNe: 'जल', gemstoneNe: 'पुखराज वा मुक्ता', gemstoneEn: 'Yellow Sapphire / Pearl', mantra: 'ॐ बृं बृहस्पतये नमः', luckyColorNe: 'हल्दी पहेँलो र सुनौलो', luckyColorEn: 'Golden Yellow', luckyNumber: 3 },
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const {
      rashiId = 'mesh',
      birthDate = '',
      birthTime = '',
      birthPlace = 'नेपाल',
      question = '',
      category = 'general',
      language = 'ne'
    } = body;

    if (!question || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rashiKey = rashiId.toLowerCase();
    const info = RASHI_DATA[rashiKey] || RASHI_DATA.mesh;
    const isNe = language === 'ne';

    // High quality deterministic Vedic Jyotish reading (Brihat Parashara Hora Shastra)
    let answer = '';
    if (isNe) {
      answer = `### 🕉️ वैदिक ज्योतिष परामर्श तथा कुण्डली विश्लेषण

**नमस्ते! हाम्रो वैदिक ज्योतिष परामर्शमा स्वागत छ।**
तपाईंको राशि **${info.nameNe} (${info.nameEn})**, स्वामी ग्रह **${info.lordNe}** तथा तत्व **${info.elementNe}** रहेको छ।

---

#### १. वर्तमान ग्रह गोचर तथा दशा प्रभाव:
यस समयमा गोचर कुण्डलीमा चन्द्रमा र देवगुरु बृहस्पतिको स्थिति तपाईंको लागि अनुकूल रहेको छ। कर्म भाव र लाभ भावमा शुभ ग्रहहरूको दृष्टि परेकाले रोकिएका योजनाहरू पुनः चलायमान हुने शुभ संकेत देखिन्छ।

#### २. तपाईंको प्रश्नको ज्योतिषीय उत्तर:
**सोधिएको प्रश्न:** "${question}"
तपाईंको ग्रह स्थिति अनुसार यो विषयमा धैर्यता र एकाग्रता अपनाउनु फलदायी हुनेछ। कार्यक्षेत्र वा निर्णय प्रक्रियामा अग्रसर हुँदा अनुभवी व्यक्तिहरूको मार्गदर्शन लिनुहोस्। आगामी केही हप्ताभित्र सकारात्मक नतिजा आउने योग छ।

#### ३. शुभ तत्वहरू (Auspicious Elements):
- 🎨 **शुभ रङ्ग:** ${info.luckyColorNe}
- 🔢 **शुभ अङ्क:** ${info.luckyNumber}
- 🧭 **शुभ दिशा:** पूर्व वा उत्तर-पूर्व (ईशान)

#### ४. वैदिक उपाय तथा शान्ति (Vedic Remedies):
- **दैनिक मन्त्र:** \`${info.mantra}\` (बिहान स्नान पश्चात १०८ पटक जप गर्नुहोस्)
- **दान धर्म:** पहेँलो वा सेतो अन्न/मिष्ठान्न गरिब वा मन्दिरमा अर्पण गर्नुहोस्।
- **रत्न सिफारिस:** ${info.gemstoneNe}

*शुभम् भवतु! सकारात्मक सोच र सत्कर्मले जीवनमा सधैँ विजय दिलाउँछ।*`;
    } else {
      answer = `### 🕉️ Vedic Astrological Reading & Kundali Insights

**Welcome to Hamro Jyotish Consultation.**
Your zodiac sign is **${info.nameEn}**, ruled by **${info.lordEn}** (${info.elementNe} element).

---

#### 1. Planetary Alignment & Transit Insights:
Favorable planetary transits of the Moon and Jupiter present constructive opportunities for your path. The 10th (Career) and 11th (Gains) houses show supportive aspects.

#### 2. Astrological Guidance for Your Question:
**Question:** "${question}"
Your celestial positioning suggests disciplined focus and deliberate planning will overcome current obstacles. Important breakthroughs will manifest in the coming cycles.

#### 3. Auspicious Elements:
- 🎨 **Lucky Color:** ${info.luckyColorEn}
- 🔢 **Lucky Number:** ${info.luckyNumber}
- 🧭 **Auspicious Direction:** North-East

#### 4. Vedic Remedies (Upaya):
- **Sacred Chant:** \`${info.mantra}\` (108 repetitions in the morning)
- **Charity:** Support people in need with food or clothing.
- **Recommended Gemstone:** ${info.gemstoneEn}

*May prosperity and divine peace guide your path.*`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        answer,
        rashiId,
        isFallback: true,
        timestamp: new Date().toISOString(),
      }),
      { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
