/**
 * Immagini del Rally Colli Euganei servite dal Media Manager Wix (cartella sito-immagini/rally-colli-euganei).
 * Sono immagini realizzate con IA: auto senza livree, targhe e sponsor, mood autunnale. Non sono foto di gara.
 * Riserva statica per le pagine: nel CMS gli stessi file sono nei campi Eventi.hero (rally) e News.immagine.
 */
import { wixFill, wixFit, wixRef } from './media';
import m from './media/rally-colli-euganei-2026.json';

const f = (n: number) => m.foto[n - 1];
/** URL ritagliata w×h della foto n (1–15). */
export const rallyImg = (n: number, w: number, h: number) => wixFill(f(n).id, f(n).name, w, h);
export const rallyAlt = (n: number) => f(n).alt;
/** Riferimento `wix:image://…` della foto n (per i campi IMAGE del CMS). */
export const rallyRef = (n: number) => wixRef(f(n).id, f(n).name, f(n).w, f(n).h);

/** Scelte editoriali (stessa numerazione dei file). */
export const RALLY_IMG = {
  heroHome: 16,      // hero della home (scelta di Fabio, 19/8)
  heroRally: 17,     // hero dell'hub rally e cover della card evento (scelta di Fabio, 19/8)
  heroSpettatori: 18,
  newsIscrizioni: 7,
  newsRicognizioni: 4,
  newsUfficiale: 12,
  newsZonePubblico: 10,
} as const;

/** Immagini singole caricate nel Media Manager (cartella sito-immagini). */
export const IMMAGINI = {
  /** Mappa delle aree del Polo Motor Show 2026 (fornita da Inversione A U). */
  mappaPolo: { id: '2be2d6_e1959ebe25174b298e63189695bc01cc~mv2.jpg', name: 'mappa-polo-motor-show.jpg', w: 1600, h: 1584,
    alt: 'Mappa delle aree del Polo Motor Show a Selve di Teolo: circuito, aree pubblico, food, paddock e parcheggi' },
  /** Mappa delle aree di Legnaro Motori 2026. */
  mappaLegnaro: { id: '2be2d6_ad567159f3e24fee9c10c999e070ac8a~mv2.jpg', name: 'mappa-legnaro-motori.jpg', w: 1000, h: 1000,
    alt: 'Mappa di Legnaro Motori: pista drift, area pubblico, raduno auto sportive e paddock in Viale dello Sport' },
  /** Foto d'epoca: rally in provincia di Padova, 1986. */
  guest2026: { id: '2be2d6_cc1eda643dc44c2aa3ed203f240ebecd~mv2.png', name: 'special-guest-2026-danny-lazzarin.png', w: 1200, h: 1158, alt: 'Danny Lazzarin a braccia conserte accanto al logo Shark Garage' },
  guest2025: { id: '2be2d6_9c0092e2192149d4b4f4cb579db94b8c~mv2.png', name: 'special-guest-2025-hot-wheels-carmagheddon.png', w: 961, h: 652, alt: 'I tre Carmagheddon sotto i loghi Carmagheddon e Hot Wheels Legends Tour' },
  targaRally: { id: '2be2d6_ddf434f20cce4cacbe7de9eb93254364~mv2.png', name: 'targa-rally-colli-euganei-2026.png', w: 1400, h: 643, alt: 'Targa del 1° Rally Colli Euganei 2026' },
  staff: { id: '2be2d6_5ab20ad3a8d14ed980b68ae9e17ed1fc~mv2.jpg', name: 'inversione-au-staff-polo-motor-show.jpg', w: 1920, h: 921, alt: 'Lo staff di Inversione A U davanti al capannone del Polo Motor Show' },
  twinDrift: { id: '2be2d6_46a23c9227e9424cbfe135657264a986~mv2.jpg', name: 'inversione-au-twin-drift-pozziani-dalberto.jpg', w: 1580, h: 1404, alt: 'Due vetture di Inversione A U in drift affiancate sul circuito' },
  ctrlg: { id: '2be2d6_319202b4949947d2864af6ba6e8a96d6~mv2.png', name: 'ctrlg.png', w: 600, h: 440, alt: 'Ctrl+G' },
  stemmaLegnaro: { id: '2be2d6_2ed52aee8d6f42c2bf4f88af1b9f5c53~mv2.png', name: 'comune-di-legnaro.png', w: 373, h: 340, alt: 'Stemma del Comune di Legnaro' },
  santo1986: { id: '2be2d6_ed6a4ccb07374db59c38ea97dccedb08~mv2.jpg', name: 'rally-padova-1986.jpg', w: 735, h: 499,
    alt: 'Lancia 037 numero 8 in gara in provincia di Padova nel 1986, con il pubblico a bordo strada' },
} as const;
export const imgFill = (i: { id: string; name: string }, w: number, h: number) => wixFill(i.id, i.name, w, h);
export const imgFit = (i: { id: string; name: string }, max: number) => wixFit(i.id, i.name, max);
