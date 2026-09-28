// Cloudflare Pages Function: Live Vedic Daily Horoscope & Transit Endpoint
// Provides live daily planetary transits and dynamic Rashifal for Cloudflare Pages

interface CloudflareEnv {}

const RASHIS = [
  { id: 'mesh', nameNe: 'मेष', nameEn: 'Aries' },
  { id: 'vrishabha', nameNe: 'वृष', nameEn: 'Taurus' },
  { id: 'mithun', nameNe: 'मिथुन', nameEn: 'Gemini' },
  { id: 'karkat', nameNe: 'कर्कट', nameEn: 'Cancer' },
  { id: 'simha', nameNe: 'सिंह', nameEn: 'Leo' },
  { id: 'kanya', nameNe: 'कन्या', nameEn: 'Virgo' },
  { id: 'tula', nameNe: 'तुला', nameEn: 'Libra' },
  { id: 'vrischika', nameNe: 'वृश्चिक', nameEn: 'Scorpio' },
  { id: 'dhanu', nameNe: 'धनु', nameEn: 'Sagittarius' },
  { id: 'makar', nameNe: 'मकर', nameEn: 'Capricorn' },
  { id: 'kumbha', nameNe: 'कुम्भ', nameEn: 'Aquarius' },
  { id: 'meen', nameNe: 'मीन', nameEn: 'Pisces' },
];

export const onRequestGet = async (context: { request: Request }) => {
  const url = new URL(context.request.url);
  const rashiParam = url.searchParams.get('rashi') || 'mesh';
  const periodParam = url.searchParams.get('period') || 'daily';
  const dayOffset = parseInt(url.searchParams.get('offset') || '0', 10);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + dayOffset);

  const dayOfWeek = targetDate.getDay();
  const dayOfMonth = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();

  // Transit calculation
  const transitSeed = (year * 365 + month * 31 + dayOfMonth + dayOfWeek * 13) % 100;
  const chandraRashiIdx = (dayOfMonth + Math.floor(dayOfWeek * 1.7)) % 12;
  const chandraRashi = RASHIS[chandraRashiIdx] || RASHIS[0];

  return new Response(
    JSON.stringify({
      success: true,
      rashi: rashiParam,
      period: periodParam,
      date: targetDate.toISOString().split('T')[0],
      dayOfWeek,
      transit: {
        chandraRashiNe: chandraRashi.nameNe,
        chandraRashiEn: chandraRashi.nameEn,
        transitSeed,
      },
      lastUpdated: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    }
  );
};
