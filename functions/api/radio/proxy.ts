// Cloudflare Pages Function: Live Audio Stream Proxy
export const onRequestGet = async (context: { request: Request }) => {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing stream URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const streamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: '*/*',
      },
    });

    const headers = new Headers();
    headers.set('Content-Type', streamRes.headers.get('content-type') || 'audio/mpeg');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'no-cache, no-store');

    return new Response(streamRes.body, {
      status: streamRes.status,
      headers,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to stream audio' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
