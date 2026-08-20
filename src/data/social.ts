/**
 * Post social scelti a mano. Fonte: collection "Social" del CMS (campo "Mostra in home").
 * Scelta di Fabio, 20/8: niente feed automatico di Instagram — costa un abbonamento,
 * carica script di terze parti, installa cookie e fa entrare in home contenuti non scelti.
 * Qui i post li decide lo staff dal pannello, e restano finché non li cambia.
 */
export type PostSocial = { didascalia: string; img: string; alt: string; url: string; rete?: string };

/** Riserva statica: vuota. Se la collection è vuota, la sezione non compare. */
export const postSocial: PostSocial[] = [];

/** Canali mostrati accanto al titolo della striscia. */
export const CANALI_PRINCIPALI = [
  { rete: 'Instagram', url: 'https://www.instagram.com/inversione.au/' },
  { rete: 'Facebook', url: 'https://www.facebook.com/inversione.au' },
  { rete: 'TikTok', url: 'https://www.tiktok.com/@inversione.au' },
  { rete: 'YouTube', url: 'https://www.youtube.com/@InversioneAU' },
] as const;
