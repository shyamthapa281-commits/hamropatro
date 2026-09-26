// Cloudflare Pages Function: Neural / Google Translate Proxy Endpoint
export const onRequestPost = async (context: { request: Request }) => {
  try {
    const body: any = await context.request.json();
    const { text, from = 'ne', to = 'en' } = body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const sl = from === 'ne' ? 'ne' : 'en';
    const tl = to === 'ne' ? 'ne' : 'en';

    // 1. Try Google Translate endpoint from Edge
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&dt=rm&dt=bd&q=${encodeURIComponent(text.trim())}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      });

      if (response.ok) {
        const data: any = await response.json();
        let translatedText = '';
        let transliteration = '';

        if (Array.isArray(data[0])) {
          for (const seg of data[0]) {
            if (seg[0]) translatedText += seg[0];
            if (seg[2] || seg[3]) {
              transliteration = seg[2] || seg[3] || transliteration;
            }
          }
        }

        if (translatedText.trim()) {
          return new Response(
            JSON.stringify({
              success: true,
              provider: 'Google Translate',
              result: {
                translatedText: translatedText.trim(),
                transliteration: transliteration.trim(),
                wordBreakdown: [],
                grammarNote: `${sl === 'ne' ? 'Nepali' : 'English'} to ${tl === 'ne' ? 'Nepali' : 'English'} translation by Google Translate.`,
                exampleUsage: `Original: ${text.trim()} -> Translated: ${translatedText.trim()}`,
                sourceText: text.trim(),
                fromLang: sl,
                toLang: tl,
              },
            }),
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }
      }
    } catch {}

    // 2. Try MyMemory Translation API from Edge
    const langpair = `${sl}|${tl}`;
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${encodeURIComponent(langpair)}`;
    const mmRes = await fetch(myMemoryUrl);
    if (mmRes.ok) {
      const mmData: any = await mmRes.json();
      const translated = mmData?.responseData?.translatedText;
      if (translated && typeof translated === 'string' && translated.trim()) {
        return new Response(
          JSON.stringify({
            success: true,
            provider: 'MyMemory Neural Engine',
            result: {
              translatedText: translated.trim(),
              transliteration: '',
              wordBreakdown: [],
              grammarNote: `Neural Translation (${sl.toUpperCase()} → ${tl.toUpperCase()})`,
              exampleUsage: `Original: ${text.trim()} -> Translated: ${translated.trim()}`,
              sourceText: text.trim(),
              fromLang: sl,
              toLang: tl,
            },
          }),
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Translation error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response(JSON.stringify({ error: 'Translation failed' }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
