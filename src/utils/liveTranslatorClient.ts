// Multi-Tier Resilient Neural Translation Client Engine
// Works 100% in client-side static environments (Cloudflare Pages), edge functions, and offline.

import { TranslationResult, translateOffline } from './nepaliTranslator';

/**
 * Translates text with multi-tier failover:
 * Tier 1: Direct In-Browser MyMemory Neural Translation (Free, Public, CORS-enabled)
 * Tier 2: Edge / Local Proxy Route `/api/translate/google` (if available)
 * Tier 3: High-Accuracy Offline Linguistic Engine (Always available, zero latency)
 */
export async function translateTextLive(
  text: string,
  from: 'ne' | 'en',
  to: 'ne' | 'en'
): Promise<TranslationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      translatedText: '',
      transliteration: '',
      wordBreakdown: [],
      grammarNote: '',
      exampleUsage: '',
      sourceText: '',
      fromLang: from,
      toLang: to,
    };
  }

  // Tier 1: Direct In-Browser MyMemory Neural Translation (Fastest & 100% CORS-friendly on Cloudflare Pages)
  try {
    const langpair = `${from === 'ne' ? 'ne' : 'en'}|${to === 'ne' ? 'ne' : 'en'}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${encodeURIComponent(langpair)}`;
    
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (
        translated && 
        typeof translated === 'string' && 
        translated.trim() && 
        !translated.toUpperCase().includes('MYMEMORY WARNING') &&
        !translated.toUpperCase().includes('QUERY LENGTH LIMIT')
      ) {
        // Generate offline analysis for transliteration and grammar enrichment
        const offlineHelper = translateOffline(trimmed, from, to);

        return {
          translatedText: translated.trim(),
          transliteration: offlineHelper.transliteration || '',
          wordBreakdown: offlineHelper.wordBreakdown.length > 0 
            ? offlineHelper.wordBreakdown 
            : [{ word: trimmed, meaning: translated.trim(), partOfSpeech: 'Neural Translation' }],
          grammarNote: from === 'ne'
            ? `न्युरल अनुवाद (Nepali → English)`
            : `Neural Machine Translation (English → Nepali)`,
          exampleUsage: `"${trimmed}" ➔ "${translated.trim()}"`,
          sourceText: trimmed,
          fromLang: from,
          toLang: to,
        };
      }
    }
  } catch (err) {
    // Proceed to edge/fallback
  }

  // Tier 2: Attempt Edge / Local Proxy Route (if running on full-stack server or Cloudflare Pages Functions)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('/api/translate/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text: trimmed, from, to }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data?.success && data?.result?.translatedText) {
        return {
          ...data.result,
          sourceText: trimmed,
          fromLang: from,
          toLang: to,
        };
      }
    }
  } catch {}

  // Tier 3: High-Accuracy Offline Linguistic Engine (Instant, verified grammar & phrases)
  return translateOffline(trimmed, from, to);
}
