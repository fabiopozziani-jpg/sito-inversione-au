/**
 * Sitemap dei contenuti dinamici (news + gallerie dal CMS) e delle route fisse.
 * Wix serve già /sitemap.xml e /robots.txt dalle pagine registrate nel pannello; questa sitemap aggiuntiva va indicata
 * nel Robots.txt Editor di Wix (riga `Sitemap: https://www.inversioneau.com/sitemap-contenuti.xml`).
 */
import type { APIRoute } from 'astro';
import { caricaPosts, caricaGallerie } from '../lib/contenuti';

const FISSE = ['/', '/eventi/', '/eventi/polo-motor-show/', '/eventi/legnaro-motori/', '/eventi/archivio/',
  '/rally-colli-euganei/', '/rally-colli-euganei/percorso/', '/rally-colli-euganei/concorrenti/', '/rally-colli-euganei/spettatori/', '/rally-colli-euganei/documenti/',
  '/news/', '/foto-e-video/', '/sponsor/', '/sponsor/diventa-sponsor/', '/stampa/', '/stampa/accrediti/', '/associazione/', '/contatti/', '/privacy/'];

export const GET: APIRoute = async ({ site, url }) => {
  const origin = (site ?? url).origin;
  const [posts, gallerie] = await Promise.all([caricaPosts(), caricaGallerie()]);
  const righe: string[] = [];
  const add = (path: string, lastmod?: string) => righe.push(`<url><loc>${origin}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`);
  for (const p of FISSE) add(p);
  for (const p of posts) add(`/news/${p.slug}/`, p.iso || undefined);
  for (const g of gallerie) add(`/foto-e-video/${g.slug}/`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${righe.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
};
