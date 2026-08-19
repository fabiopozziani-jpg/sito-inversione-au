/**
 * Gallerie fotografiche — un oggetto per edizione.
 * FASE 2: i file stanno in /public/foto (t400, t800, originale 1600).
 * FASE 3: le stesse voci arriveranno dalla collection CMS "Media" con URL Wix; l'interfaccia resta identica.
 */
import { wixFill, wixFit, type WixFoto } from './media';
import legnaroMedia from './media/legnaro-motori-2026.json';

export type Foto = { src: string; src800: string; srcLarge: string; alt: string; w: number; h: number };
export type Galleria = {
  evento: 'polo' | 'legnaro' | 'rally';
  nomeEvento: string; anno: string; accent: string; slug: string;
  stato: 'pubblicata' | 'in-attesa'; notaVuota: string; credito: string;
  copertina: { src: string; alt: string };
  foto: Foto[];
};

const T = '/foto/t400/', M = '/foto/t800/', L = '/foto/';
/** Foto dal Media Manager Wix (griglia 3:2 ritagliata, lightbox intera). */
const fotoWix = (list: WixFoto[]): Foto[] =>
  list.map(f => ({ src: wixFill(f.id, f.name, 400, 267), src800: wixFill(f.id, f.name, 800, 533), srcLarge: wixFit(f.id, f.name, 1600), alt: f.alt, w: 400, h: 267 }));
const foto = (list: [string, string][], dir = '/foto', w = 400, h = 267): Foto[] =>
  list.map(([f, alt]) => ({ src: `${dir}/t400/${f}.jpg`, src800: `${dir}/t800/${f}.jpg`, srcLarge: `${dir}/${f}.jpg`, alt, w, h }));

const POLO: [string, string][] = [
  ['polo_m3_arancione', 'BMW M3 arancione in drift lungo le transenne del circuito cittadino di Selve di Teolo'],
  ['inversione_au_e36_pan', 'BMW E36 di Inversione A U in drift, ripresa in panning dentro il fumo delle gomme'],
  ['polo_lancia_delta', 'Lancia Delta bianca in azione durante il rally show del Polo Motor Show'],
  ['polo_porsche_911', 'Porsche 911 gialla in curva sul tracciato del Polo Motor Show'],
  ['polo_drift_fumo_blu', 'Auto in drift dentro una nuvola di fumo blu davanti al pubblico'],
  ['polo_esposizione_auto', 'File di auto sportive in esposizione nell’area raduno del Polo Motor Show'],
  ['polo_m3_e30_rotoballe', 'BMW M3 E30 in traverso accanto alle rotoballe di protezione'],
  ['polo_pubblico_sera', 'Pubblico e stand illuminati nell’area del paddock alla sera'],
  ['inversione_au_e36_drift', 'BMW E36 di Inversione A U in drift all’uscita di curva sul circuito cittadino'],
  ['polo_e30_turchese_drift', 'BMW E30 turchese in drift con il posteriore fuori traiettoria'],
  ['polo_sierra_fina_drift', 'Ford Sierra in drift con il posteriore in scivolata sull’asfalto'],
  ['inversione_au_e36_hay', 'BMW E36 di Inversione A U in traverso davanti alle balle di fieno'],
  ['polo_amg_gt', 'Mercedes AMG GT grigia esposta nel paddock del Polo Motor Show'],
  ['bmw_m3_e30_fumo', 'BMW M3 E30 in drift avvolta dal fumo delle gomme posteriori'],
  ['polo_e30_verde_rally', 'BMW E30 verde in assetto rally in azione sul tratto sterrato'],
  ['polo_lexus_gazebo', 'Lexus sotto i gazebo dell’area assistenza del Polo Motor Show'],
  ['bmw_m3_e30_ricambi', 'BMW M3 E30 in assistenza con ricambi e attrezzi appoggiati a terra'],
  ['raduno_expo', 'Area raduno con le auto allineate e i visitatori che passano tra le vetture'],
];
// Legnaro Motori 2026: foto e alt in src/data/media/legnaro-motori-2026.json (Media Manager Wix)

export const gallerie: Galleria[] = [
  { evento: 'polo', nomeEvento: 'Polo Motor Show', anno: '2026', accent: '#6FC7DB', slug: 'polo-motor-show-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: [NOME] / Inversione A U',
    copertina: { src: `${M}polo_m3_arancione.jpg`, alt: 'BMW M3 arancione in drift al Polo Motor Show 2026' }, foto: foto(POLO) },
  { evento: 'legnaro', nomeEvento: 'Legnaro Motori', anno: '2026', accent: '#A8D8B4', slug: 'legnaro-motori-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: Garage Hub, GR Visuals / Inversione A U',
    copertina: { src: wixFill(legnaroMedia.foto[35].id, legnaroMedia.foto[35].name, 800, 533), alt: 'BMW E36 del team Kebek in drift a Legnaro Motori 2026' }, foto: fotoWix(legnaroMedia.foto as WixFoto[]) },
  { evento: 'rally', nomeEvento: '1° Rally Colli Euganei', anno: '2026', accent: '#00BA89', slug: 'rally-colli-euganei-2026',
    stato: 'in-attesa', notaVuota: 'Le foto ufficiali saranno online entro il 24 novembre 2026, dopo la gara.',
    credito: 'Foto: [NOME] / Inversione A U', copertina: { src: '', alt: '' }, foto: [] },
];

export const getGalleria = (evento: string) => gallerie.find(g => g.evento === evento) ?? null;
export const galleriaPerSlug = (slug: string) => gallerie.find(g => g.slug === slug) ?? null;

/** Le prime n foto delle edizioni pubblicate più recenti, alternate. */
export function fotoRecenti(n = 8): (Foto & { evento: string })[] {
  const src = gallerie.filter(g => g.stato === 'pubblicata');
  const out: (Foto & { evento: string })[] = [];
  for (let i = 0; out.length < n && i < 40; i++)
    for (const g of src) if (g.foto[i] && out.length < n) out.push({ ...g.foto[i], evento: g.evento });
  return out;
}
