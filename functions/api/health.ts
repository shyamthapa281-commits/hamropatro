// Cloudflare Pages Function: Health Check
export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      platform: 'Cloudflare Pages Functions',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
