// Cloudflare Pages Function: Custom Prediction & Kundali Reading

export const onRequestPost = async (context: { request: Request }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const { rashiName = 'मेष', period = 'daily', language = 'ne' } = body;

    const hash = (rashiName + period).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const careerScore = 75 + (hash % 21);
    const loveScore = 70 + ((hash * 3) % 25);
    const financeScore = 72 + ((hash * 7) % 23);
    const healthScore = 78 + ((hash * 5) % 18);
    const luckyNum = (hash % 9) + 1;

    let prediction = '';
    if (language === 'ne') {
      prediction = `### 🌟 ${rashiName} - ${period === 'daily' ? 'दैनिक' : period === 'weekly' ? 'साप्ताहिक' : 'मासिक'} गोचर फलादेश

#### 📊 अनुकूलता सूचकांक:
- 💼 **कार्यक्षेत्र र व्यवसाय (Career):** ${careerScore}%
- ❤️ **प्रेम तथा सम्बन्ध (Love):** ${loveScore}%
- 💰 **आर्थिक लाभ (Finance):** ${financeScore}%
- 🌿 **स्वास्थ्य (Health):** ${healthScore}%

#### 🪐 ग्रह गोचर फल:
यस समयावधिमा चन्द्रमा र बृहस्पतिको अनुकूल दृष्टि रहेकाले नयाँ अवसरहरू सिर्जना हुनेछन्। आत्मविश्वासका साथ अगाडि बढ्नुहोला।

#### 🍀 शुभ तत्त्वहरू:
- 🔢 **शुभ अङ्क:** ${luckyNum}
- 🎨 **शुभ रङ्ग:** सुनौलो वा हल्का रातो
- 🪔 **वैदिक उपाय:** प्रातःकालमा सूर्य नमस्कार गरी ॐ नमः शिवाय मन्त्र जप गर्नुहोस्।`;
    } else {
      prediction = `### 🌟 ${rashiName} - ${period.toUpperCase()} Vedic Prediction

#### 📊 Astrological Index:
- 💼 **Career & Business:** ${careerScore}%
- ❤️ **Love & Relationships:** ${loveScore}%
- 💰 **Financial Prosperity:** ${financeScore}%
- 🌿 **Health & Vitality:** ${healthScore}%

#### 🪐 Planetary Highlights:
Constructive planetary transits bring favorable outcomes in ventures. Trust focused execution and maintain harmony with peers.

#### 🍀 Auspicious Essentials:
- 🔢 **Lucky Number:** ${luckyNum}
- 🎨 **Lucky Color:** Golden Yellow / Soft Amber
- 🪔 **Daily Remedy:** Recite Gayatri Mantra and offer morning prayers.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        prediction,
      }),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
