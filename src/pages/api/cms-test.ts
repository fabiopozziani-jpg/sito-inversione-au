import type { APIRoute } from 'astro';
import { query } from '../../lib/cms';
export const GET: APIRoute = async () => {
  const news = await query('News', { limit: 3, sort: [{ fieldName: 'data', order: 'DESC' }] });
  const foto = await query('Foto', { filter: { galleria: 'polo-motor-show-2026' }, limit: 2, sort: [{ fieldName: 'ordine' }] });
  return new Response(JSON.stringify({ news: news?.map(n => ({ _id: n._id, slug: n.slug, titolo: n.titolo })), foto }), { headers: { 'content-type': 'application/json' } });
};
