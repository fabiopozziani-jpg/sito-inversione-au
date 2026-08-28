/**
 * File del media kit e documenti dell'associazione serviti dal Media Manager Wix
 * (cartelle `sito-mediakit` e `sito-documenti`). I PDF stanno su usrfiles.com, immagini e SVG su static.wixstatic.com.
 * `?dn=` = nome file proposto al download.
 */
const DOC = 'https://0fa841cd-37c1-4afa-98a8-07cd3feb9f54.usrfiles.com/ugd/';
const IMG = 'https://static.wixstatic.com/media/';
const SVG = 'https://static.wixstatic.com/shapes/';
const pdf = (id: string, nome: string) => `${DOC}${id}.pdf?dn=${nome}`;

export const mediakit = {
  'brand-book-inversione-a-u.pdf': pdf('2be2d6_2d27277216fd472da788d1f3b740164c', 'brand-book-inversione-a-u.pdf'),
  'logo-inversione-bianco.png': `${IMG}2be2d6_9b5c468aa2284fa2ba9c1b2d9af3df3a~mv2.png`,
  'logo-inversione-nero.png': `${IMG}2be2d6_c8d4c572e3644c69ba6f10cc921ad5eb~mv2.png`,
  'logo-inversione-vettoriale.pdf': pdf('2be2d6_9757ac38ac5d49c0b7f0aaf32c5747f5', 'logo-inversione-vettoriale.pdf'),
  'logo-legnaro-2026-1.png': `${IMG}2be2d6_f2351bf2a70742fdb0792ec25e4f35cd~mv2.png`,
  'logo-legnaro-2026-2.png': `${IMG}2be2d6_13add9529d044780b52cd4d73bd8c162~mv2.png`,
  'logo-legnaro-2026-vettoriale.pdf': pdf('2be2d6_bdc9745c562b4bebb782cbed00c93695', 'logo-legnaro-2026-vettoriale.pdf'),
  'logo-polo-2026-bianco.png': `${IMG}2be2d6_6da7381275ff410da8ee7f780aada8fb~mv2.png`,
  'logo-polo-2026-bianco.svg': '/mediakit/logo-polo-2026-bianco.svg', // SVG da 2 MB: il Media Manager non lo accetta, resta nel sito
  'logo-polo-2026-nero.png': `${IMG}2be2d6_5d8efee82a2e42999cc0720dd90cb954~mv2.png`,
  'logo-polo-2026-nero.svg': '/mediakit/logo-polo-2026-nero.svg',
  'targa-rally-colli-euganei.png': `${IMG}2be2d6_a5e3f110c33f484bb3482581bd4da470~mv2.png`,
  'targa-rally-colli-euganei.svg': `${SVG}2be2d6_362e803bc11c4149bd05977735b7864d.svg`,
} as const;
export const mk = (nome: keyof typeof mediakit) => mediakit[nome];

/** Presentazione commerciale per sponsor ed espositori (aggiornata a febbraio 2026). */
export const presentazione = pdf('2be2d6_9bd576f53b674070bdc241aceadffa09', 'presentazione-eventi-inversione-a-u-2026.pdf');
export const presentazionePeso = '8 MB';

/**
 * I due documenti safeguarding sono serviti da `public/documenti/` e non dal Media Manager:
 * pesano poco e devono restare raggiungibili con un indirizzo stabile.
 * Il verbale di approvazione NON si pubblica: contiene codice fiscale, data di nascita e
 * indirizzi di residenza (scelta di Fabio, 28/8). In pagina resta la data di approvazione.
 */
export const documenti = {
  safeguardingModello: '/documenti/modello-organizzativo-safeguarding-inversione-a-u.pdf',
  safeguardingCodice: '/documenti/codice-di-condotta-inversione-a-u.pdf',
  statuto: pdf('2be2d6_c5f6450bccd149b59725d618cf7bc712', 'atto-costitutivo-e-statuto-inversione-a-u-asd.pdf'),
  codiceFiscale: pdf('2be2d6_a7367f4067cd4c4496203ecea37d902a', 'certificato-codice-fiscale-inversione-a-u-asd.pdf'),
  partitaIva: pdf('2be2d6_deadaa4faa2340dca8c4a102fa136f32', 'certificato-partita-iva-inversione-a-u-asd.pdf'),
} as const;
