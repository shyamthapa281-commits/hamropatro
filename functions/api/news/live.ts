// Cloudflare Pages Function: Live Nepali News Feed Aggregator
// Aggregates OnlineKhabar, Ratopati, Setopati, BBC Nepali, Kathmandu Post, and Google News Nepal at Cloudflare Edge

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
  // Check media:content url
  const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];

  // Check media:thumbnail
  const thumbMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (thumbMatch) return thumbMatch[1];

  // Check enclosure
  const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (encMatch) return encMatch[1];

  // Check <img> tag in description or content:encoded
  const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';
}

function categorizeNews(title: string, summary: string): string {
  const text = (title + ' ' + summary).toLowerCase();
  if (
    text.includes('politics') || text.includes('election') || text.includes('parliament') ||
    text.includes('नेता') || text.includes('सरकार') || text.includes('मन्त्री') ||
    text.includes('पार्टी') || text.includes('कांग्रेस') || text.includes('एमाले') ||
    text.includes('माओवादी') || text.includes('संसद') || text.includes('प्रधानमन्त्री') ||
    text.includes('निर्वाचन') || text.includes('राजनीति') || text.includes('रास्वपा')
  ) {
    return 'politics';
  }
  if (
    text.includes('sports') || text.includes('cricket') || text.includes('football') ||
    text.includes('खेल') || text.includes('क्रिकेट') || text.includes('फुटबल') ||
    text.includes('क्यान') || text.includes('च्याम्पियन') || text.includes('मेस्सी') ||
    text.includes('रोनाल्डो') || text.includes('लिग') || text.includes('प्रतियोगिता') ||
    text.includes('खेलाडी') || text.includes('विश्वकप')
  ) {
    return 'sports';
  }
  if (
    text.includes('economy') || text.includes('market') || text.includes('finance') || text.includes('banking') ||
    text.includes('share') || text.includes('stock') || text.includes('nepse') || text.includes('inflation') ||
    text.includes('अर्थ') || text.includes('अर्थतन्त्र') || text.includes('बजेट') || text.includes('बैंक') ||
    text.includes('नेप्से') || text.includes('शेयर') || text.includes('सुन') || text.includes('चाँदी') ||
    text.includes('डलर') || text.includes('मुद्रा') || text.includes('राजस्व') || text.includes('लगानी') ||
    text.includes('वाणिज्य') || text.includes('उद्योग') || text.includes('धितोपत्र')
  ) {
    return 'economy';
  }
  if (
    text.includes('technology') || text.includes('tech') || text.includes('ai') || text.includes('digital') ||
    text.includes('प्रविधि') || text.includes('स्मार्टफोन') || text.includes('इन्टरनेट') || text.includes('एआई') ||
    text.includes('साइबर') || text.includes('दूरसञ्चार') || text.includes('मोबाइल') || text.includes('एप')
  ) {
    return 'technology';
  }
  if (
    text.includes('entertainment') || text.includes('cinema') || text.includes('movie') || text.includes('film') ||
    text.includes('सिनेमा') || text.includes('चलचित्र') || text.includes('अभिनेता') || text.includes('अभिनेत्री') ||
    text.includes('गीत') || text.includes('संगीत') || text.includes('कलाकार') || text.includes('गायक') ||
    text.includes('गायिका') || text.includes('नाटक') || text.includes('फेस्टिभल')
  ) {
    return 'entertainment';
  }
  if (
    text.includes('international') || text.includes('world') || text.includes('global') ||
    text.includes('विश्व') || text.includes('अन्तर्राष्ट्रिय') || text.includes('अमेरिका') || text.includes('भारत') ||
    text.includes('चीन') || text.includes('रुस') || text.includes('युक्रेन') || text.includes('गाजा') ||
    text.includes('इजरायल') || text.includes('trump') || text.includes('biden') || text.includes('modi')
  ) {
    return 'world';
  }
  return 'national';
}

function parseRssXml(xml: string, sourceName: string, defaultLanguage: 'ne' | 'en' = 'ne') {
  const articles: any[] = [];
  // Match both RSS <item> and Atom <entry>
  const itemRegex = /<(?:item|entry)[\s\S]*?<\/(?:item|entry)>/gi;
  let match;

  let count = 0;
  // Allow up to 18 articles per feed for rich coverage
  while ((match = itemRegex.exec(xml)) !== null && count < 18) {
    const itemXml = match[0];
    const titleMatch = itemXml.match(/<title(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = itemXml.match(/<link(?:[^>]*href=["']([^"']+)["']|>)(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?(?:<\/link>)?/i);
    const descMatch = itemXml.match(/<(?:description|summary|content:encoded|content)(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:description|summary|content:encoded|content)>/i);
    const pubDateMatch = itemXml.match(/<(?:pubDate|published|updated|dc:date)(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:pubDate|published|updated|dc:date)>/i);

    const title = titleMatch ? stripHtml(titleMatch[1]) : '';
    let link = '';
    if (linkMatch) {
      link = (linkMatch[1] || linkMatch[2] || '').trim();
    }
    const desc = descMatch ? stripHtml(descMatch[1]) : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
    const imageUrl = extractImageUrl(itemXml);

    if (title && (link || title.length > 8)) {
      let publishedFormatted = 'भर्खरै';
      let publishedFormattedEn = 'Just now';
      try {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) {
          const diffMinutes = Math.floor((Date.now() - d.getTime()) / (1000 * 60));
          if (diffMinutes < 60) {
            publishedFormatted = `${Math.max(1, diffMinutes)} मिनेट अगाडि`;
            publishedFormattedEn = `${Math.max(1, diffMinutes)}m ago`;
          } else if (diffMinutes < 1440) {
            publishedFormatted = `${Math.floor(diffMinutes / 60)} घण्टा अगाडि`;
            publishedFormattedEn = `${Math.floor(diffMinutes / 60)}h ago`;
          } else {
            publishedFormatted = `${Math.floor(diffMinutes / 1440)} दिन अगाडि`;
            publishedFormattedEn = `${Math.floor(diffMinutes / 1440)}d ago`;
          }
        }
      } catch {}

      const category = categorizeNews(title, desc);
      const summaryText = desc.slice(0, 200) + (desc.length > 200 ? '...' : '');

      articles.push({
        id: `cf-news-${sourceName.toLowerCase().replace(/\s+/g, '-')}-${count}-${Date.now().toString().slice(-4)}`,
        titleNe: title,
        titleEn: title,
        summaryNe: summaryText,
        summaryEn: summaryText,
        contentNe: desc.length > 40 ? `${desc}...` : title,
        contentEn: desc.length > 40 ? `${desc}...` : title,
        category,
        source: sourceName,
        sourceUrl: link || 'https://onlinekhabar.com',
        publishedAt: publishedFormatted,
        publishedAtEn: publishedFormattedEn,
        author: sourceName,
        imageUrl,
        readTimeMin: Math.max(2, Math.min(6, Math.ceil(desc.length / 250))),
        tags: [sourceName, category, 'ताजा समाचार'],
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
  // Complete list of 6 authentic news RSS feeds identical to the backend server
  const feeds = [
    { url: 'https://www.onlinekhabar.com/feed', name: 'OnlineKhabar', lang: 'ne' as const },
    { url: 'https://www.ratopati.com/feed', name: 'Ratopati', lang: 'ne' as const },
    { url: 'https://www.setopati.com/feed', name: 'Setopati', lang: 'ne' as const },
    { url: 'https://feeds.bbci.co.uk/nepali/rss.xml', name: 'BBC Nepali', lang: 'ne' as const },
    { url: 'https://kathmandupost.com/rss', name: 'Kathmandu Post', lang: 'en' as const },
    { url: 'https://news.google.com/rss/search?q=Nepal&hl=ne&gl=NP&ceid=NP:ne', name: 'Google News Nepal', lang: 'ne' as const },
  ];

  try {
    const fetchPromises = feeds.map(async (f) => {
      try {
        let targetUrl = f.url;
        // Normalize Setopati SSL subdomain
        if (targetUrl.includes('setopati.com') && !targetUrl.includes('www.setopati.com')) {
          targetUrl = targetUrl.replace('https://setopati.com', 'https://www.setopati.com');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);
        const res = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HamroPatroLive/1.0',
            'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
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

    // Remove duplicates based on normalized titles
    const seenTitles = new Set<string>();
    const uniqueArticles = allArticles.filter((art) => {
      if (!art.titleNe || art.titleNe.length < 5) return false;
      const normalized = art.titleNe.slice(0, 30).toLowerCase();
      if (seenTitles.has(normalized)) return false;
      seenTitles.add(normalized);
      return true;
    });

    // Sort chronologically (newest first)
    uniqueArticles.sort((a, b) => {
      const timeA = new Date(a.rawPubDate || 0).getTime();
      const timeB = new Date(b.rawPubDate || 0).getTime();
      return timeB - timeA;
    });

    // Mark top 3 as breaking news
    uniqueArticles.forEach((art, idx) => {
      if (idx < 3) art.isBreaking = true;
    });

    if (uniqueArticles.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          count: uniqueArticles.length,
          lastUpdated: new Date().toISOString(),
          articles: uniqueArticles,
        }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=120, s-maxage=120',
          },
        }
      );
    }
  } catch (err: any) {
    // Return empty fallback
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
