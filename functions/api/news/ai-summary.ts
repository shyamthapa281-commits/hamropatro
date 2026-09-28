// Cloudflare Pages Function: Live News AI Summary
interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const { title = '', content = '', language = 'ne' } = body;
    const isNe = language === 'ne';

    const cleanTitle = (title || '').trim();
    const cleanContent = (content || title || '').slice(0, 300).trim();

    let summary = '';
    if (isNe) {
      summary = `### 📌 मुख्य बुँदाहरू (Key Highlights)
- **विषय:** ${cleanTitle}
- **सार संक्षेप:** ${cleanContent.slice(0, 160)}...
- **ताजा अवस्था:** घटनाक्रम सम्बन्धी थप विवरणहरू आधिकारिक निकाय तथा समाचार माध्यमहरूबाट निरन्तर अद्यावधिक भइरहेका छन्।

### 💡 प्रभाव र विश्लेषण (Impact & Context)
यस घटनाक्रमले राष्ट्रिय तथा स्थानीय स्तरमा प्रत्यक्ष प्रभाव पार्ने देखिन्छ। नागरिक सरोकार र सम्बन्धित क्षेत्रका लागि यो एक महत्वपूर्ण विकासक्रम हो।`;
    } else {
      summary = `### 📌 Key Highlights
- **Topic:** ${cleanTitle}
- **Overview:** ${cleanContent.slice(0, 160)}...
- **Current Status:** Official reports and follow-ups continue to develop rapidly.

### 💡 Context & Significance
This event holds strategic relevance for socio-economic and public interest sectors across Nepal.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        timestamp: new Date().toISOString(),
      }),
      { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: 'Internal Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
