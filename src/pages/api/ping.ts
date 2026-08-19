import type { APIRoute } from 'astro';
export const POST: APIRoute = async ({ request, url }) => {
  const fase = url.searchParams.get('f') || '0';
  let info: any = { fase, method: request.method, ct: request.headers.get('content-type') };
  try {
    if (fase === '1') info.text = (await request.text()).slice(0, 100);
    if (fase === '2') info.json = await request.json();
    if (fase === '3') { const { MODULI } = await import('../../lib/moduli'); info.moduli = Object.keys(MODULI); }
  } catch (e) { info.err = String(e).slice(0, 300); }
  return new Response(JSON.stringify(info), { headers: { 'content-type': 'application/json' } });
};
