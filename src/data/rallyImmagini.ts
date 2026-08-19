/**
 * Immagini del Rally Colli Euganei servite dal Media Manager Wix (cartella sito-immagini/rally-colli-euganei).
 * Sono immagini realizzate con IA: auto senza livree, targhe e sponsor, mood autunnale. Non sono foto di gara.
 * Riserva statica per le pagine: nel CMS gli stessi file sono nei campi Eventi.hero (rally) e News.immagine.
 */
import { wixFill, wixRef } from './media';
import m from './media/rally-colli-euganei-2026.json';

const f = (n: number) => m.foto[n - 1];
/** URL ritagliata w×h della foto n (1–15). */
export const rallyImg = (n: number, w: number, h: number) => wixFill(f(n).id, f(n).name, w, h);
export const rallyAlt = (n: number) => f(n).alt;
/** Riferimento `wix:image://…` della foto n (per i campi IMAGE del CMS). */
export const rallyRef = (n: number) => wixRef(f(n).id, f(n).name, f(n).w, f(n).h);

/** Scelte editoriali (stessa numerazione dei file). */
export const RALLY_IMG = {
  heroHome: 10,      // hero della home: strada forestale, auto a destra
  heroRally: 3,      // hero dell'hub rally e cover della card evento
  heroSpettatori: 11,
  newsIscrizioni: 7,
  newsRicognizioni: 4,
  newsUfficiale: 12,
  newsZonePubblico: 5,
} as const;
