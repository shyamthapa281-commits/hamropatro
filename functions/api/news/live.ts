// Cloudflare Pages Function: Live Nepali News Feed Aggregator
// Aggregates OnlineKhabar, Ratopati, Setopati, and BBC Nepali RSS feeds at the Cloudflare Edge

interface CloudflareEnv {}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageUrl(itemXml: string): string {
  // Check media:content
  const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];

  // Check enclosure
  const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (encMatch) return encMatch[1];

  // Check <img> in description or content:encoded
  const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';
}

function parseRssXml(xml: string, sourceName: string, lang: 'ne' | 'en' = 'ne') {
  const articles: any[] = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  let match;

  let count = 0;
  while ((match = itemRegex.exec(xml)) !== null && count < 8) {
    const itemXml = match[0];
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    const pubDateMatch = itemXml.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);

    const title = titleMatch ? stripHtml(titleMatch[1]) : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    const desc = descMatch ? stripHtml(descMatch[1]) : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
    const imageUrl = extractImageUrl(itemXml);

    if (title && link) {
      let publishedFormatted = 'भर्खरै';
      try {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) {
          const diffMinutes = Math.floor((Date.now() - d.getTime()) / (1000 * 60));
          if (diffMinutes < 60) {
            publishedFormatted = `${Math.max(1, diffMinutes)} मिनेट अगाडि`;
          } else if (diffMinutes < 1440) {
            publishedFormatted = `${Math.floor(diffMinutes / 60)} घण्टा अगाडि`;
          } else {
            publishedFormatted = `${Math.floor(diffMinutes / 1440)} दिन अगाडि`;
          }
        }
      } catch {}

      // Category detection
      let category = 'national';
      const textForCategory = (title + ' ' + desc).toLowerCase();
      if (/मन्त्री|सरकार|पार्टी|कांग्रेस|एमाले|माओवादी|प्रधानमन्त्री|संसद|चुनाव|नेता|राजनीति/.test(textForCategory)) {
        category = 'politics';
      } else if (/खेल|क्रिकेट|फुटबल|क्यान|मेस्सी|रोनाल्डो|च्याम्पियन|पदक|जित/.test(textForCategory)) {
        category = 'sports';
      } else if (/अर्थ|बैंक|सेयर|नेप्से|डलर|बजेट|मुद्रास्फीति|राजस्व|उद्योग/.test(textForCategory)) {
        category = 'economy';
      } else if (/प्रविधि|स्मार्टफोन|एआई|इन्टरनेट|फेसबुक|गुगल|एप/.test(textForCategory)) {
        category = 'technology';
      } else if (/फिल्म|अभिनेता|नायिका|गीत|सिनेमा|गायक|सांस्कृतिक/.test(textForCategory)) {
        category = 'entertainment';
      } else if (/विश्व|अमेरिका|चीन|भारत|युक्रेन|रसिया|गाजा|ट्रम्प/.test(textForCategory)) {
        category = 'world';
      }

      articles.push({
        id: `cf-news-${sourceName.toLowerCase()}-${count}-${Date.now()}`,
        titleNe: title,
        titleEn: title,
        summaryNe: desc.slice(0, 160) + (desc.length > 160 ? '...' : ''),
        summaryEn: desc.slice(0, 160) + (desc.length > 160 ? '...' : ''),
        contentNe: desc,
        contentEn: desc,
        category,
        source: sourceName,
        sourceUrl: link,
        publishedAt: publishedFormatted,
        author: sourceName,
        imageUrl,
        readTimeMin: Math.max(2, Math.min(6, Math.ceil(desc.length / 250))),
        tags: ['नेपाल', sourceName, category],
        isBreaking: count === 0,
        rawPubDate: pubDate,
        isLive: true,
      });
      count++;
    }
  }

  return articles;
}

export const onRequestGet = async () => {
  const feeds = [
    { url: 'https://www.onlinekhabar.com/feed', name: 'OnlineKhabar', lang: 'ne' as const },
    { url: 'https://www.ratopati.com/feed', name: 'Ratopati', lang: 'ne' as const },
    { url: 'https://www.setopati.com/feed', name: 'Setopati', lang: 'ne' as const },
    { url: 'https://feeds.bbci.co.uk/nepali/rss.xml', name: 'BBC Nepali', lang: 'ne' as const },
  ];

  try {
    const fetchPromises = feeds.map(async (f) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(f.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HamroPatroLive/1.0',
            'Accept': 'application/rss+xml, application/xml, text/xml',
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) return [];
        const xml = await res.text();
        return parseRssXml(xml, f.name, f.lang);
      } catch {
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    const allArticles: any[] = [];
    results.forEach((r) => {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        allArticles.push(...r.value);
      }
    });

    // Shuffle & sort
    if (allArticles.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          count: allArticles.length,
          lastUpdated: new Date().toISOString(),
          articles: allArticles,
        }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=180',
          },
        }
      );
    }
  } catch (err: any) {
    // Return empty or fallback response
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Failed to aggregate feeds',
      articles: [],
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
