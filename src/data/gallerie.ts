/**
 * Gallerie fotografiche — un oggetto per edizione.
 * Le foto delle gallerie stanno nel Media Manager Wix (cartella sito-gallerie/<slug>) e nella collection CMS "Foto";
 * gli id/alt sono in src/data/media/<slug>.json. Le URL sono generate da wixFill/wixFit (ritaglio, qualità, formato automatici).
 */
import { wixFill, wixFit, type WixFoto } from './media';
import legnaroMedia from './media/legnaro-motori-2026.json';
import poloMedia from './media/polo-motor-show-2026.json';

export type Foto = { src: string; src800: string; srcLarge: string; alt: string; w: number; h: number };
export type Galleria = {
  evento: 'polo' | 'legnaro' | 'rally';
  nomeEvento: string; anno: string; accent: string; slug: string;
  stato: 'pubblicata' | 'in-attesa'; notaVuota: string; credito: string;
  copertina: { src: string; alt: string };
  foto: Foto[];
};

/** Foto dal Media Manager Wix (griglia 3:2 ritagliata, lightbox intera). */
const fotoWix = (list: WixFoto[]): Foto[] =>
  list.map(f => ({ src: wixFill(f.id, f.name, 400, 267), src800: wixFill(f.id, f.name, 800, 533), srcLarge: wixFit(f.id, f.name, 1600), alt: f.alt, w: 400, h: 267 }));

// Polo Motor Show 2026 e Legnaro Motori 2026: foto e alt nei JSON di src/data/media/ (Media Manager Wix)

export const gallerie: Galleria[] = [
  { evento: 'polo', nomeEvento: 'Polo Motor Show', anno: '2026', accent: '#6FC7DB', slug: 'polo-motor-show-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: Inversione A U',
    copertina: { src: wixFill(poloMedia.foto[79].id, poloMedia.foto[79].name, 800, 533), alt: 'BMW M3 arancione in drift davanti al pubblico al Polo Motor Show 2026' }, foto: fotoWix(poloMedia.foto as WixFoto[]) },
  { evento: 'legnaro', nomeEvento: 'Legnaro Motori', anno: '2026', accent: '#A8D8B4', slug: 'legnaro-motori-2026',
    stato: 'pubblicata', notaVuota: '', credito: 'Foto: Garage Hub, GR Visuals / Inversione A U',
    copertina: { src: wixFill(legnaroMedia.foto[35].id, legnaroMedia.foto[35].name, 800, 533), alt: 'BMW E36 del team Kebek in drift a Legnaro Motori 2026' }, foto: fotoWix(legnaroMedia.foto as WixFoto[]) },
  { evento: 'rally', nomeEvento: '1° Rally Colli Euganei', anno: '2026', accent: '#00BA89', slug: 'rally-colli-euganei-2026',
    stato: 'in-attesa', notaVuota: 'Le foto ufficiali saranno online nei giorni dopo la gara.',
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
