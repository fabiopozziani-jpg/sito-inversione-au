/**
 * Media Manager Wix — URL con trasformazioni (ridimensiona, ritaglia, formato automatico WebP/AVIF).
 * id = "2be2d6_…~mv2.jpg", name = nome file leggibile (SEO). Nessun upload a mano: gli id vengono da src/data/media/*.json.
 */
export type WixFoto = { n: number; id: string; name: string; alt: string; w: number; h: number };
const BASE = 'https://static.wixstatic.com/media/';
/** ritaglio a riempire (fill) — per griglie con proporzione fissa */
export const wixFill = (id: string, name: string, w: number, h: number, q = 80) => `${BASE}${id}/v1/fill/w_${w},h_${h},al_c,q_${q},enc_auto/${name}`;
/** adatta dentro (fit) — per lightbox e viste intere */
export const wixFit = (id: string, name: string, max: number, q = 82) => `${BASE}${id}/v1/fit/w_${max},h_${max},q_${q},enc_auto/${name}`;
/** valore da salvare nei campi IMAGE del CMS */
export const wixRef = (id: string, name: string, w: number, h: number) => `wix:image://v1/${id}/${name}#originWidth=${w}&originHeight=${h}`;
/**
 * srcset per un URL "fill" già costruito: riscrive w_/h_ mantenendo le proporzioni.
 * Serve alle hero, che finora scaricavano 1920px anche su un telefono da 390.
 * Se l'URL non è una trasformazione fill restituisce '' (l'attributo viene omesso).
 */
export function srcsetFill(url: string, larghezze: number[] = [640, 960, 1280, 1600, 1920]): string {
  const m = url.match(/\/v1\/fill\/w_(\d+),h_(\d+)/);
  if (!m) return '';
  const w0 = Number(m[1]), h0 = Number(m[2]);
  const set = larghezze.filter(L => L <= w0)
    .map(L => `${url.replace(/w_\d+,h_\d+/, `w_${L},h_${Math.round(h0 * L / w0)}`)} ${L}w`);
  return set.length > 1 ? set.join(', ') : '';
}
