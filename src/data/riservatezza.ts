/**
 * Interruttori di riservatezza — 4 ottobre 2026.
 *
 * Richiesta dell'associazione: ridurre l'esposizione personale dei componenti del
 * direttivo e della sede privata, dopo l'attenzione pubblica sul 1° Rally Colli Euganei.
 *
 * TUTTE le modifiche sono reversibili da qui: nessun contenuto è stato cancellato.
 * Per tornare allo stato precedente al 4 ottobre 2026 rimettere i quattro valori
 * indicati come «prima» e rilanciare build + release. La riga `Team` nel CMS,
 * i nomi e l'indirizzo restano scritti qui sotto e nelle collection: non si riscrive nulla.
 */

/** Sezione «Il consiglio direttivo» su /associazione/ (nomi, ruoli e note dei cinque componenti). */
export const MOSTRA_CONSIGLIO_DIRETTIVO = false; // prima: true

/** Nome e cognome della responsabile safeguarding nella scheda dati. Il ruolo e la casella restano sempre pubblici. */
export const MOSTRA_NOME_RESPONSABILE_SAFEGUARDING = false; // prima: true

/** Via e numero civico della sede legale, in pagina e nei dati strutturati. Il Comune resta sempre pubblico. */
export const MOSTRA_INDIRIZZO_COMPLETO = false; // prima: true

/** Documenti dell'associazione e safeguarding: card senza link diretto al PDF, consegna dopo richiesta via modulo. */
export const DOCUMENTI_SOLO_SU_RICHIESTA = true; // prima: false

/* ---------- Valori derivati: si usano nelle pagine, non si duplicano le stringhe ---------- */

export const SEDE_COMPLETA = 'Via Selve 46/B · Saccolongo (PD)';
export const SEDE_RIDOTTA = 'Saccolongo (PD)';
/** Riga «Sede legale» di /associazione/ e /contatti/. */
export const sedeLegale = MOSTRA_INDIRIZZO_COMPLETO ? SEDE_COMPLETA : SEDE_RIDOTTA;

/** Blocco indirizzo del footer, su due righe. */
export const sedeFooter = MOSTRA_INDIRIZZO_COMPLETO ? 'Via Selve 46/B · Saccolongo (PD)' : 'Saccolongo (PD)';

/** Come compare la sede dentro una frase (informativa privacy). */
export const sedeInFrase = MOSTRA_INDIRIZZO_COMPLETO ? 'in Via Selve 46/B a Saccolongo (PD)' : 'a Saccolongo (PD)';

/** PostalAddress dei dati strutturati: senza via resta un indirizzo valido a livello di Comune. */
export const indirizzoStrutturato = {
  '@type': 'PostalAddress',
  ...(MOSTRA_INDIRIZZO_COMPLETO ? { streetAddress: 'Via Selve 46/B' } : {}),
  addressLocality: 'Saccolongo',
  addressRegion: 'PD',
  postalCode: '35030',
  addressCountry: 'IT',
} as const;

/** Responsabile safeguarding: nome in chiaro solo se l'interruttore è acceso. */
export const NOME_RESPONSABILE_SAFEGUARDING = 'Sara De Bastiani';
export const responsabileSafeguarding = MOSTRA_NOME_RESPONSABILE_SAFEGUARDING ? NOME_RESPONSABILE_SAFEGUARDING : '';
