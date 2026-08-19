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
const LEGNARO: [string, string][] = [
  ['legnaro-motori-2026-01', 'BMW E36 nera con grafica a stelle in traverso accanto alle balle di fieno'],
  ['legnaro-motori-2026-02', 'Muso di una BMW E36 rossa ribassata parcheggiata sul piazzale del raduno'],
  ['legnaro-motori-2026-03', 'BMW E36 bordeaux e altre auto allineate nell’area raduno di Legnaro Motori'],
  ['legnaro-motori-2026-04', 'BMW E36 nera in drift tra le balle di fieno del tracciato di Legnaro'],
  ['legnaro-motori-2026-05', 'BMW E36 viola in traverso lungo le protezioni di fieno'],
  ['legnaro-motori-2026-06', 'Auto in drift sul piazzale con i segni di gomma sull’asfalto'],
  ['legnaro-motori-2026-07', 'Dettaglio del cerchio e del parafango di una BMW E36 rossa nell’area raduno'],
  ['legnaro-motori-2026-08', 'BMW E36 nera in drift con il posteriore in scivolata davanti alle balle'],
  ['legnaro-motori-2026-09', 'BMW E36 bordeaux ribassata vista dall’alto nell’area raduno'],
  ['legnaro-motori-2026-10', 'BMW E36 nera in derapata tra i cordoli e le balle di fieno'],
  ['legnaro-motori-2026-11', 'BMW E36 nera in traverso ripresa in panning sul rettilineo del tracciato'],
  ['legnaro-motori-2026-12', 'Coupé giallo e auto viola in pista viste dall’abitacolo di un’altra vettura'],
  ['legnaro-motori-2026-13', 'BMW E36 viola in drift con il posteriore verso le balle di fieno'],
  ['legnaro-motori-2026-14', 'BMW E36 nera in drift avvolta dal fumo delle gomme davanti al capannone'],
  ['legnaro-motori-2026-15', 'Due auto in drift ravvicinato con i segni delle gomme sull’asfalto'],
  ['legnaro-motori-2026-16', 'Auto allineate al raduno e dettaglio del cerchio di una BMW rossa'],
  ['legnaro-motori-2026-17', 'BMW E36 viola in traverso ripresa in panning'],
  ['legnaro-motori-2026-18', 'BMW E36 con livrea da gara in traverso tra le balle di fieno del tracciato'],
  ['legnaro-motori-2026-19', 'Pilota nell’abitacolo con roll-bar prima della sessione drift'],
  ['legnaro-motori-2026-20', 'Dettaglio del frontale di una BMW nera con adesivi Zero Grip Drift Team'],
  ['legnaro-motori-2026-21', 'Dettaglio del cofano di una BMW nera del team Zero Grip'],
  ['legnaro-motori-2026-22', 'Auto in drift avvolta da fumo colorato davanti alle balle di fieno'],
  ['legnaro-motori-2026-23', 'BMW E36 con livrea da gara in drift sul tracciato di Legnaro'],
  ['legnaro-motori-2026-24', 'BMW nera con adesivi degli sponsor in traverso tra le protezioni'],
  ['legnaro-motori-2026-25', 'BMW E46 nera del team Kebek in sosta nel paddock del raduno'],
  ['legnaro-motori-2026-26', 'Due auto in drift ravvicinato con la nuvola di fumo delle gomme'],
  ['legnaro-motori-2026-27', 'BMW nera in traverso davanti alle barriere rosse e bianche'],
  ['legnaro-motori-2026-28', 'Cassetta degli attrezzi e ruota di scorta nel paddock di Legnaro Motori'],
  ['legnaro-motori-2026-29', 'BMW E36 bianca e verde in drift sul piazzale'],
  ['legnaro-motori-2026-30', 'BMW nera in drift con il fumo delle gomme davanti al muro'],
  ['legnaro-motori-2026-31', 'BMW E36 con livrea multicolore in drift davanti al pubblico'],
  ['legnaro-motori-2026-32', 'Abitacolo da gara con volante sportivo e paddock con gazebo del team'],
  ['legnaro-motori-2026-33', 'BMW E36 nera e verde in traverso ripresa in panning'],
  ['legnaro-motori-2026-34', 'BMW E36 gialla con numero 06 in drift lungo le balle di fieno'],
  ['legnaro-motori-2026-35', 'BMW E36 rossa in traverso davanti alle protezioni'],
  ['legnaro-motori-2026-36', 'BMW E36 del team Kebek in drift con il fumo delle gomme'],
  ['legnaro-motori-2026-37', 'Mazda MX-5 bianca in traverso sul piazzale di Legnaro'],
  ['legnaro-motori-2026-38', 'BMW E30 verde in derapata ravvicinata con un’altra vettura'],
  ['legnaro-motori-2026-39', 'BMW E30 verde numero 27 in traverso lungo le barriere'],
  ['legnaro-motori-2026-40', 'Auto in drift dentro la nuvola di fumo, ripresa dietro le balle di fieno'],
  ['legnaro-motori-2026-41', 'BMW E30 verde in drift con il posteriore in scivolata'],
  ['legnaro-motori-2026-42', 'BMW E30 verde in traverso ripresa in panning tra le protezioni'],
  ['legnaro-motori-2026-43', 'BMW E30 verde numero 27 in derapata sul piazzale'],
  ['legnaro-motori-2026-44', 'BMW E30 verde in drift con il fumo delle gomme davanti alle balle'],
  ['legnaro-motori-2026-45', 'BMW E30 verde in traverso ripresa da dietro le balle di fieno'],
];

export const gallerie: Galleria[] = [
  { evento: 'polo', nomeEvento: 'Polo Motor Show', anno: '2026', accent: '#6FC7DB', slug: 'polo-motor-show-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: [NOME] / Inversione A U',
    copertina: { src: `${M}polo_m3_arancione.jpg`, alt: 'BMW M3 arancione in drift al Polo Motor Show 2026' }, foto: foto(POLO) },
  { evento: 'legnaro', nomeEvento: 'Legnaro Motori', anno: '2026', accent: '#A8D8B4', slug: 'legnaro-motori-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: Garage Hub, GR Visuals / Inversione A U',
    copertina: { src: '/foto/legnaro-motori-2026/t800/legnaro-motori-2026-36.jpg', alt: 'BMW E36 del team Kebek in drift a Legnaro Motori 2026' }, foto: foto(LEGNARO, '/foto/legnaro-motori-2026', 400, 500) },
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
