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
