/**
 * Gallerie fotografiche — un oggetto per edizione.
 * FASE 2: i file stanno in /public/foto (t400, t800, originale 1600).
 * FASE 3: le stesse voci arriveranno dalla collection CMS "Media" con URL Wix; l'interfaccia resta identica.
 */
export type Foto = { src: string; src800: string; srcLarge: string; alt: string; w: number; h: number };
export type Galleria = {
  evento: 'polo' | 'legnaro' | 'rally';
  nomeEvento: string; anno: string; accent: string; slug: string;
  stato: 'pubblicata' | 'in-attesa'; notaVuota: string; credito: string;
  copertina: { src: string; alt: string };
  foto: Foto[];
};

const T = '/foto/t400/', M = '/foto/t800/', L = '/foto/';
const foto = (list: [string, string][]): Foto[] =>
  list.map(([f, alt]) => ({ src: `${T}${f}.jpg`, src800: `${M}${f}.jpg`, srcLarge: `${L}${f}.jpg`, alt, w: 400, h: 267 }));

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
const LEGNARO: [string, string][] = [
  ['legnaro_e36_nera_drift', 'BMW E36 nera in drift tra le barriere del piazzale di Legnaro'],
  ['legnaro_drift_pubblico', 'Pubblico dietro le reti di protezione mentre un’auto passa in traverso'],
  ['legnaro_e36_fumo', 'BMW E36 in drift con una densa nuvola di fumo dalle gomme posteriori'],
  ['legnaro_e36_verde_drift', 'BMW E36 verde in drift sul piazzale di Legnaro Motori'],
  ['legnaro_verde_traverso', 'Auto verde in traverso completo con le ruote anteriori controsterzate'],
  ['legnaro_e36_verde_terra', 'BMW E36 verde che alza terra e polvere all’uscita della curva'],
  ['legnaro_drift_polvere', 'Auto in drift dentro la nuvola di polvere alzata dalle gomme'],
  ['legnaro_coupe_giallo', 'Coupé gialla in esposizione all’area raduno di Legnaro Motori'],
];

export const gallerie: Galleria[] = [
  { evento: 'polo', nomeEvento: 'Polo Motor Show', anno: '2026', accent: '#6FC7DB', slug: 'polo-motor-show-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: [NOME] / Inversione A U',
    copertina: { src: `${M}polo_m3_arancione.jpg`, alt: 'BMW M3 arancione in drift al Polo Motor Show 2026' }, foto: foto(POLO) },
  { evento: 'legnaro', nomeEvento: 'Legnaro Motori', anno: '2026', accent: '#A8D8B4', slug: 'legnaro-motori-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: [NOME] / Inversione A U',
    copertina: { src: `${M}legnaro_drift_pubblico.jpg`, alt: 'Pubblico dietro le reti a Legnaro Motori 2026' }, foto: foto(LEGNARO) },
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
