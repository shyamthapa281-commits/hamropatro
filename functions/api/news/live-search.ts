// Cloudflare Pages Function: Live News Search
export const onRequestPost = async (context: { request: Request }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const { query = '' } = body;

    return new Response(
      JSON.stringify({
        success: true,
        query,
        articles: [],
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
