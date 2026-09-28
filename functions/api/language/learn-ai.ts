// Cloudflare Pages Function: AI Language Assistant
interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const { phrase = '', sourceLang = 'English', targetLang = 'Nepali' } = body;

    const responseText = `### 🗣️ नेपाली सिकाई (Nepali Learning)
- **मूल वाक्यांश:** "${phrase}"
- **उच्चारण (Phonetic):** ${phrase}
- **व्याकरण विश्लेषण:** यस वाक्यांशमा दैनिक बोलीचालीमा प्रयोग हुने सहज शब्दावली समावेश गरिएको छ।
- **व्यावहारिक उदाहरण:** नेपाली समाजमा आदरार्थी भाषा प्रयोग गर्दा 'तपाईं' वा 'हजुर' भन्नु उपयुक्त हुन्छ।`;

    return new Response(
      JSON.stringify({
        success: true,
        result: responseText,
        sourceLang,
        targetLang,
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
