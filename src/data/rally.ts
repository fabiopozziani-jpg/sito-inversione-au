/**
 * 1° Rally Colli Euganei ACI Sport — dati dell'evento (FASE 2: statici; FASE 4: collection CMS).
 * Regola: quello che non è confermato resta "da definire" — nessun dato inventato.
 */
import { rallyImg, rallyAlt, RALLY_IMG, IMMAGINI, imgFit } from './rallyImmagini';
export type Stato = 'pre' | 'in' | 'post';

export const rally = {
  nome: '1° Rally Colli Euganei ACI Sport',
  /** Titolo mostrato nell'hero: senza la titolazione (scelta di Fabio, 19/8). */
  titoloHero: '1° Rally Colli Euganei',
  breve: 'Rally Colli Euganei',
  base: '/rally-colli-euganei/',
  inizio: '2026-11-21T08:00:00+01:00',
  fine: '2026-11-22T20:00:00+01:00',
  dataLabel: '21–22 novembre 2026',
  dataIso: '2026-11-21',
  luogo: 'Colli Euganei, Padova',
  email: 'inversione.au3@gmail.com',
  /** Casella dedicata alle informazioni sulla gara. */
  emailInfo: 'rallycollieuganei@gmail.com',
  telefoni: [
    { label: 'Segreteria', num: '+39 348 570 1233', tel: '+393485701233' },
    { label: 'Organizzazione', num: '+39 348 904 9212', tel: '+393489049212' },
  ],
  /** Iscrizioni: lo stato lo decidono le date qui sotto (vedi `statoIscrizioniOra`).
   *  Questo campo, e il campo `statoIscrizioni` dell'evento nel CMS, servono solo a
   *  forzarlo a mano — per esempio per chiudere in anticipo. Vuoto = automatico. */
  statoIscrizioni: '' as '' | 'non-aperte' | 'aperte' | 'chiuse',
  aperturaIscrizioni: '2026-10-22T22:00:00+02:00',
  chiusuraIscrizioniIso: '2026-11-16T23:59:59+01:00',
  moduloUrl: 'https://www.acisport.it',
  /** Scheda nel calendario ACI Sport. NON linkata sul sito: quella pagina risponde spesso in errore (scelta di Fabio, 29/8). */
  aciUrl: 'https://www.acisport.it/it/acisport/dettaglio-calendari/7506131/1%C2%B0-rally-colli-euganei',
  chiusuraIscrizioni: '16 novembre 2026',
  chiusuraIscrizioniOra: '23:59',
  aperturaPrevista: 'il 22 ottobre alle 23:59',
  /** Sportity: password del canale (vuota = non ancora pubblicata) */
  sportity: {
    password: 'RALLYEUGANEI2026',
    ios: 'https://apps.apple.com/app/sportity/id1450246005',
    android: 'https://play.google.com/store/apps/details?id=com.sportity.app',
    /** Stesso canale dal browser, senza installare l'app e senza notifiche (vuoto = non attivo). */
    web: 'https://webapp.sportity.com/event/RALLYEUGANEI2026/038c2bd8-7f05-4274-a5f3-c28005cecc46',
  },
  /** Canale WhatsApp per gli avvisi al pubblico (vuoto = non ancora attivo) */
  whatsapp: '',
  /** Mappe: percorso e zone pubblico (vuote = in pubblicazione) */
  mappaPercorso: '',
  mappaZone: '',
  /** Mappa navigabile del percorso su Google My Maps (vuote = blocco non mostrato).
   *  `embed` NON si carica da sola: l'iframe viene inserito solo quando l'utente tocca il
   *  pulsante, così nessun contenuto di Google parte al caricamento della pagina e non
   *  servono banner. `view` apre la mappa su Google in una nuova pagina.
   *  La mappa deve essere condivisa in sola lettura con «chiunque abbia il link»,
   *  altrimenti ai visitatori compare la richiesta di accesso a Google. */
  myMaps: {
    view: 'https://www.google.com/maps/d/viewer?mid=1V5JGRtHSxao8F74aiVyrG3Y63R7f7Vo',
    embed: 'https://www.google.com/maps/d/embed?mid=1V5JGRtHSxao8F74aiVyrG3Y63R7f7Vo&ll=45.347664%2C11.703039&z=12',
  },
  hero: rallyImg(RALLY_IMG.heroRally, 1920, 1080), heroAlt: rallyAlt(RALLY_IMG.heroRally),
  targa: imgFit(IMMAGINI.targaRally, 1400),
  targaW: 1400,
  targaH: 643,
  /** Live timing e classifiche del servizio di cronometraggio (FICR).
   *  Il collegamento si accende da solo una settimana prima della gara: il sito è SSR,
   *  quindi la data viene letta a ogni richiesta e non serve pubblicare nulla quel giorno. */
  classificheUrl: 'https://rally.ficr.it/#/RAL/generalschedule/2026/*/*',
  classificheDa: '2026-11-14T00:00:00+01:00',
};

/**
 * Regola dell'organizzazione: i documenti di gara escono un mese prima della gara.
 * Nei testi pubblici però non si scrive più «un mese prima», che dal 23 ottobre non vuol
 * dire più niente: quello che manca si segna sempre e solo **«in arrivo»**.
 */

/** Date che aprono da sole una parte del sito. Ora italiana, lette a ogni richiesta.
 *  — `unMesePrima` apre programma provvisorio e link all'area riservata ACI Sport
 *  — una settimana prima compare il live timing
 *  — il lunedì dopo la gara torna la galleria foto e video
 *
 *  `unMesePrima` nasce dalla regola «i documenti escono un mese prima della gara», che
 *  cadeva il 22 ottobre. Il 20 ottobre è stata spostata alla notte fra il 22 e il 23,
 *  per non far uscire programma e link prima che le iscrizioni aprano (22 alle 23:59).
 *  La modulistica in albo non dipende da qui: la decide `pubblicatoIl` nel CMS, anch'essa
 *  portata al 23 ottobre. */
export const DATE = {
  unMesePrima: '2026-10-22T22:00:00+02:00',
  liveTiming: '2026-11-14T00:00:00+01:00',
  fotoVideo: '2026-11-23T00:00:00+01:00',
};
const da = (quando: string, now: number) => now >= Date.parse(quando);
export const unMesePrima = (now = Date.now()) => da(DATE.unMesePrima, now);
export const liveTimingAttivo = (now = Date.now()) => !!rally.classificheUrl && da(rally.classificheDa, now);

/** Le tre domande online (moduli Google dell'associazione, creati il 3/10/2026).
 *  Compaiono nel riquadro iscrizioni quando le iscrizioni sono aperte. I due moduli in
 *  PDF accanto a queste (equipaggi esteri e ricognitori) arrivano dall'albo di gara,
 *  così il collegamento è sempre quello dell'ultima versione pubblicata. */
export const domandeOnline = [
  { nome: 'Domanda di iscrizione', url: 'https://forms.gle/qPWdPfxWn8JsNdBQ7', nota: 'Equipaggi italiani · concorrente, conduttori, vettura, assistenza' },
  { nome: 'Iscrizione ricognitori', url: 'https://forms.gle/WWKdyoGv4pntgwde9', nota: 'Equipaggio ricognitore e vettura di ricognizione' },
  { nome: 'Dati per la fattura', url: 'https://forms.gle/1jdeQxLNBSwDYuxS6', nota: 'Pagamento e dati di fatturazione elettronica' },
];
/** Numeri d'albo dei due moduli in PDF da mostrare accanto alle domande online. */
export const moduliIscrizionePdf = ['3.8', '3.9'];
/** Numero d'albo del foglio delle tasse di iscrizione: compare nel riquadro iscrizioni
 *  accanto ai moduli, ma non è modulistica da compilare, quindi non sta in `moduliIscrizionePdf`. */
export const tasseIscrizioneAlbo = '1.5';
/** Numero d'albo della cartina del percorso: la pagina Percorso la pesca da lì, così il
 *  link punta sempre all'ultima versione pubblicata e si accende da solo quando esce. */
export const cartinaPercorsoAlbo = '1.3';
/** Numeri d'albo del programma ufficiale e della tabella distanze e tempi: le pagine li
 *  pescano dall'albo, così il link punta sempre all'ultima versione pubblicata. */
export const programmaAlbo = '1.2';
export const tabellaTempiAlbo = '1.4';

export type StatoIscrizioni = 'non-aperte' | 'aperte' | 'chiuse';
/** Stato delle iscrizioni ricavato dalle date: apertura 22 ottobre ore 23:59,
 *  chiusura 16 novembre alle 23:59 (programma ufficiale del 22/10/2026).
 *  Nessuno deve ricordarsi di cambiarlo a mano. */
export function statoIscrizioniOra(now = Date.now()): StatoIscrizioni {
  if (da(rally.chiusuraIscrizioniIso, now)) return 'chiuse';
  if (da(rally.aperturaIscrizioni, now)) return 'aperte';
  return 'non-aperte';
}

/** Voci del menù del rally. È una funzione, non un elenco fisso: le voci a tempo
 *  (live timing, foto e video) si accendono da sole alla data giusta. */
export function subnav(now = Date.now()) {
  const voci: { label: string; href: string; esterno?: boolean }[] = [
    { label: 'Il rally', href: '/rally-colli-euganei/' },
    { label: 'Percorso e prove speciali', href: '/rally-colli-euganei/percorso/' },
    { label: 'Concorrenti', href: '/rally-colli-euganei/concorrenti/' },
    { label: 'Spettatori', href: '/rally-colli-euganei/spettatori/' },
    { label: 'Residenti', href: '/rally-colli-euganei/residenti/' },
    { label: 'Documenti di gara', href: '/rally-colli-euganei/documenti/' },
    { label: 'Stampa e accrediti', href: '/stampa/accrediti/' },
  ];
  // quarta voce, fra Concorrenti e Spettatori: una volta comparsa resta
  if (liveTimingAttivo(now)) voci.splice(3, 0, { label: 'Live timing', href: rally.classificheUrl, esterno: true });
  // la galleria del rally torna nel menù il lunedì dopo la gara
  if (da(DATE.fotoVideo, now)) voci.push({ label: 'Foto e video', href: '/foto-e-video/rally-colli-euganei-2026/' });
  return voci;
}

export function statoRally(now = Date.now()): { stato: Stato; giorni: number } {
  const a = new Date(rally.inizio).getTime(), b = new Date(rally.fine).getTime();
  const giorni = Math.ceil((a - now) / 864e5);
  return { stato: now > b ? 'post' : now >= a ? 'in' : 'pre', giorni };
}

const TBD = '— · da definire';
/** Vale su tutte le prove, anche prima dell'ordinanza comunale. */
const CHIUSURA = 'Un\u2019ora prima del passaggio della prima vettura';
/** Prove speciali come si vedono PRIMA del 23 ottobre: nessun dato di percorso.
 *  Il passaggio fra questa e `prove` lo decide `unMesePrima()`, in contenuti.ts. */
export const provePrima = [
  { sigla: 'Passaggi 1 · 3 · 5', nome: 'Prova speciale 1', km: '— · in arrivo', chiusura: TBD, prima: TBD, pubblico: TBD, maps: '', mappa: '' },
  { sigla: 'Passaggi 2 · 4 · 6', nome: 'Prova speciale 2', km: '— · in arrivo', chiusura: TBD, prima: TBD, pubblico: TBD, maps: '', mappa: '' },
];
/** Prove speciali. Dati dalla tabella distanze e tempi V3 (definitiva, 22/10/2026) e dalla
 *  cartina del 15/10/2026.
 *  `prima` = orari teorici della prima vettura sui tre passaggi.
 *  Le zone pubblico restano aperte: dipendono dall'ordinanza comunale. */
export const prove = [
  { sigla: 'PS 1 · 3 · 5', nome: 'Teolo', km: '3,00 km', chiusura: CHIUSURA, prima: '07:48 · 11:36 · 15:14', pubblico: TBD, maps: '', mappa: '/img/rally/ps-1-teolo.png' },
  { sigla: 'PS 2 · 4 · 6', nome: 'Roccolo – Cingolina', km: '4,12 km', chiusura: CHIUSURA, prima: '08:11 · 11:59 · 15:37', pubblico: TBD, maps: '', mappa: '/img/rally/ps-2-roccolo-cingolina.png' },
];

/**
 * Chiusure strade per i residenti. Si popola quando l'ordinanza comunale è firmata:
 * finché è vuoto la pagina mostra lo stato "in pubblicazione".
 * comune, tratto = descrizione leggibile della strada; chiude/riapre = orari indicativi.
 */
export type Chiusura = { comune: string; tratto: string; giorno: string; chiude: string; riapre: string; prova: string };
export const chiusure: Chiusura[] = [];

/** Strade interessate dalle chiusure, per prova. `chiude` nasce dalla regola «un'ora prima
 *  del passaggio della prima vettura» applicata agli orari della tabella tempi V3. La
 *  riapertura dipende dal passaggio della vettura scopa, quindi dal numero di equipaggi
 *  ammessi: finché non è deciso, non si pubblica un orario di riapertura.
 *  Una riga per passaggio, non per prova: la strada riapre fra un giro e l'altro e
 *  richiude un'ora prima del passaggio successivo (confermato da Fabio il 22/10/2026).
 *  Attenzione al lessico: la PROVA si chiama «Cingolina» con la i, la VIA si scrive
 *  «Cengolina» con la e. Le due grafie convivono di proposito: nessuna delle due è
 *  un errore da correggere. */
export const stradeChiuse = [
  { prova: 'PS 1 — Teolo', strade: 'via Gazzo · via Bettone', chiude: 'Dalle 06:48' },
  { prova: 'PS 2 — Roccolo – Cingolina', strade: 'via Roccolo · via Cengolina', chiude: 'Dalle 07:11' },
  { prova: 'PS 3 — Teolo', strade: 'via Gazzo · via Bettone', chiude: 'Dalle 10:36' },
  { prova: 'PS 4 — Roccolo – Cingolina', strade: 'via Roccolo · via Cengolina', chiude: 'Dalle 10:59' },
  { prova: 'PS 5 — Teolo', strade: 'via Gazzo · via Bettone', chiude: 'Dalle 14:14' },
  { prova: 'PS 6 — Roccolo – Cingolina', strade: 'via Roccolo · via Cengolina', chiude: 'Dalle 14:37' },
];

/**
 * Scheda gara — le voci che un concorrente cerca prima di iscriversi, nell'ordine
 * standard usato dai rally italiani (riferimento: Rally Città di Pistoia).
 * `valore` vuoto = "Da definire": la riga resta, così si vede che è prevista.
 */
export type VoceScheda = { voce: string; valore: string; nota?: string };
/** Scheda gara come si vedeva PRIMA del 23 ottobre: le voci ci sono, i valori no.
 *  La pagina Concorrenti sceglie fra questa e `schedaGara` con `unMesePrima()`. */
export const schedaGaraPrima: VoceScheda[] = [
  { voce: 'Apertura iscrizioni', valore: '22 ottobre 2026', nota: 'ore 23:59' },
  { voce: 'Chiusura iscrizioni', valore: '16 novembre 2026', nota: 'ore 23:59' },
  { voce: 'Consegna road book', valore: '' },
  { voce: 'Ricognizioni con vetture di serie', valore: '' },
  { voce: 'Targhe e numeri di gara', valore: '' },
  { voce: 'Verifiche sportive ante gara', valore: '' },
  { voce: 'Verifiche tecniche ante gara', valore: '' },
  { voce: 'Shakedown', valore: '' },
  { voce: 'Caratteristiche del percorso', valore: '2 prove speciali, 3 passaggi ciascuna', nota: '20–35 km cronometrati' },
  { voce: 'Parco assistenza', valore: '' },
  { voce: 'Albo di gara e classifiche', valore: '', nota: 'App Sportity · password in arrivo' },
  { voce: 'Parco partenza', valore: '' },
  { voce: 'Partenza prima vettura', valore: '' },
  { voce: 'Arrivo prima vettura', valore: '' },
  { voce: 'Premiazione', valore: '' },
  { voce: 'Pubblicazione classifiche', valore: '' },
  { voce: 'Direzione gara e segreteria', valore: '' },
  { voce: 'Sala stampa e accrediti', valore: '' },
  { voce: 'Parco chiuso', valore: '' },
];
export const schedaGara: VoceScheda[] = [
  { voce: 'Apertura iscrizioni', valore: '22 ottobre 2026', nota: 'ore 23:59' },
  { voce: 'Chiusura iscrizioni', valore: '16 novembre 2026', nota: 'ore 23:59' },
  { voce: 'Consegna road book', valore: 'Venerdì 20 novembre, 18:00 – 22:00', nota: 'Distribuzione road book e controllo dei documenti sportivi pre gara · sede in arrivo' },
  { voce: 'Ricognizioni con vetture di serie', valore: 'Sabato 21 novembre, 07:20 – 11:20', nota: 'Massimo 3 passaggi per prova · limite 50 km/h sulle prove speciali' },
  { voce: 'Targhe e numeri di gara', valore: 'Consegna alle verifiche sportive' },
  { voce: 'Verifiche sportive ante gara', valore: 'Sabato 21 novembre, 11:00 – 13:00 con shakedown · 13:00 – 15:00 senza shakedown', nota: 'Piazza Mercato, Bresseo (PD)' },
  { voce: 'Verifiche tecniche ante gara', valore: 'Sabato 21 novembre, 11:30 – 13:30 con shakedown · 13:30 – 15:30 senza shakedown', nota: 'Via A. Volta, Selve di Teolo (PD)' },
  { voce: 'Shakedown', valore: 'Sabato 21 novembre, 13:00 – 16:45', nota: 'Facoltativo, massimo 3 passaggi' },
  { voce: 'Caratteristiche del percorso', valore: '2 prove speciali, 3 passaggi ciascuna', nota: 'PS 1·3·5 «Teolo» 3,00 km · PS 2·4·6 «Roccolo – Cingolina» 4,12 km · 21,36 km cronometrati su 109,26 km totali' },
  { voce: 'Parco assistenza', valore: 'Selve di Teolo (PD), via A. Volta 24', nota: 'Ingresso team sabato 21 novembre, 08:00 – 12:00 · spazio su richiesta con il MOD. 06' },
  { voce: 'Elenco verificati e ordine di partenza', valore: 'Sabato 21 novembre, ore 16:30', nota: 'In albo di gara, insieme all’orario individuale della cerimonia di presentazione' },
  { voce: 'Albo di gara e classifiche', valore: 'Albo di gara sul sito · comunicazioni del Direttore di Gara su Sportity', nota: 'Canale Sportity attivo · password RALLYEUGANEI2026' },
  { voce: 'Parco partenza', valore: 'Piazza Mercato, Bresseo (PD)', nota: 'Ingresso al palco sabato 21 novembre, 17:30 – 18:00 · cerimonia di presentazione degli equipaggi alle 18:30' },
  { voce: 'Partenza prima vettura', valore: 'Domenica 22 novembre, ore 07:30', nota: 'Selve di Teolo — uscita del parco assistenza' },
  { voce: 'Arrivo prima vettura', valore: 'Domenica 22 novembre, ore 16:15', nota: 'Treponti — Via Alcide De Gasperi · pedana arrivo in Piazza Mercato alle 16:30' },
  { voce: 'Elenco vetture in verifica', valore: 'Domenica 22 novembre, ore 16:00', nota: 'Vetture convocate alle verifiche tecniche dopo la gara · in albo di gara' },
  { voce: 'Premiazione', valore: 'Domenica 22 novembre, dalle 16:30', nota: 'Treponti — Piazza Mercato · insieme all’arrivo in pedana · ingresso libero' },
  { voce: 'Pubblicazione classifiche', valore: 'Classifiche finali domenica 22 novembre, ore 18:00', nota: 'In albo di gara · live timing su rally.ficr.it' },
  { voce: 'Sala stampa e accrediti', valore: 'Accrediti con il modulo online sul sito' },
];

/**
 * Link rapidi ai documenti che i concorrenti cercano per primi.
 * `href` vuoto = non ancora pubblicato: la scheda resta, con lo stato "coming soon".
 */
export type LinkDoc = { nome: string; nota?: string; href: string; albo?: string };
export const documentiRapidi: LinkDoc[] = [
  { nome: 'Regolamento particolare di gara', nota: 'RPG · in fase di approvazione', href: '' },
  { nome: 'Programma', href: '', albo: programmaAlbo },
  { nome: 'Cartina generale', href: '', albo: cartinaPercorsoAlbo },
  { nome: 'Tabella distanze e tempi', nota: 'TDT', href: '', albo: tabellaTempiAlbo },
];

/** Scadenze come si vedono PRIMA del 23 ottobre: solo apertura e chiusura iscrizioni. */
export const scadenzePrima = [
  { fase: 'Apertura iscrizioni', data: '22 ottobre 2026', ora: '23:59' },
  { fase: 'Chiusura iscrizioni', data: '16 novembre 2026', ora: '23:59' },
  { fase: 'Ricognizioni del percorso', data: 'Da definire', ora: '—' },
  { fase: 'Verifiche sportive e tecniche', data: 'Da definire', ora: '—' },
  { fase: 'Shakedown', data: 'Da definire', ora: '—' },
];
export const scadenze = [
  { fase: 'Apertura iscrizioni', data: '22 ottobre 2026', ora: '23:59' },
  { fase: 'Chiusura iscrizioni', data: '16 novembre 2026', ora: '23:59' },
  { fase: 'Consegna road book', data: '20 novembre 2026', ora: '18:00 – 22:00' },
  { fase: 'Ricognizioni del percorso', data: '21 novembre 2026', ora: '07:20 – 11:20' },
  { fase: 'Verifiche sportive e tecniche', data: '21 novembre 2026', ora: '11:00 – 15:30' },
  { fase: 'Shakedown', data: '21 novembre 2026', ora: '13:00 – 16:45' },
];

export type Iscritto = { num: string; equipaggio: string; vettura: string; classe: string };
export const classi = ['Rally2', 'Rally4', 'Rally5', 'Storiche'];
/** Elenco iscritti: si popola nella settimana di gara (FASE 4: collection). Vuoto = stato "in pubblicazione". */
export const iscritti: Iscritto[] = [];
export const iscrittiAggiornatoAl = '';
export const iscrittiPdf = '';

export type Documento = {
  num: string; title: string; iso: string; file: string; href: string; rev?: string;
  gruppo?: 'Regolamento e programma' | 'Comunicazioni del direttore di gara' | 'Modulistica' | 'Allegati tecnici';
  revPrev?: string; revPrevIso?: string; superato?: boolean; superatoDa?: string;
};
/** Albo di gara — vuoto fino alla pubblicazione ufficiale. */
export const documenti: Documento[] = [];
export const gruppiAlbo = ['Regolamento e programma', 'Comunicazioni del direttore di gara', 'Modulistica', 'Allegati tecnici'] as const;

const TBD2 = 'Da definire';
/** Programma pubblicato prima del 23 ottobre: solo le fasi, senza orari. */
export const programmaPrima = [
  { titolo: 'Sabato 21 novembre', voci: [
    { ora: TBD2, titolo: 'Verifiche sportive e tecniche', nota: 'Le vetture passano al controllo prima della partenza. Si possono vedere da vicino, a piedi.' },
    { ora: TBD2, titolo: 'Shakedown', nota: 'Prova di messa a punto su un tratto breve. È la prima occasione per vedere le auto in azione.' },
  ] },
  { titolo: 'Domenica 22 novembre', voci: [
    { ora: TBD2, titolo: 'Partenza e prove speciali', nota: 'Sei passaggi cronometrati sulle due prove' },
    { ora: TBD2, titolo: 'Arrivo e premiazioni', nota: 'Palco arrivo · ingresso libero' },
  ] },
];
/** Programma ufficiale (documento «Programma A» del 22/10/2026), in linea dal 23 ottobre.
 *  Riserva statica: gli stessi orari stanno nella collection `Programma`, che ha la
 *  precedenza. Si allineano con `node scripts/programma-rally.mjs --run`. */
export const programma = [
  { titolo: 'Sabato 21 novembre', voci: [
    { ora: '07:20 – 11:20', titolo: 'Ricognizioni autorizzate del percorso', nota: 'Gli equipaggi percorrono le prove con vetture di serie, a velocità di codice.' },
    { ora: '08:00 – 12:00', titolo: 'Ingresso team in parco assistenza', nota: 'I team prendono posizione a Selve di Teolo.' },
    { ora: '11:00 – 15:00', titolo: 'Verifiche sportive', nota: 'Fino alle 13:00 gli equipaggi iscritti allo shakedown, dalle 13:00 tutti gli altri.' },
    { ora: '11:30 – 15:30', titolo: 'Verifiche tecniche', nota: 'Controllo delle vetture. Fino alle 13:30 gli equipaggi iscritti allo shakedown, dalle 13:30 tutti gli altri.' },
    { ora: '13:00 – 16:45', titolo: 'Shakedown', nota: 'Messa a punto su un tratto breve, massimo tre passaggi. La prima occasione per vedere le auto in azione.' },
    { ora: '16:30', titolo: 'Elenco verificati e ordine di partenza', nota: 'Pubblicazione in albo di gara, insieme all’orario individuale della cerimonia di presentazione.' },
    { ora: '17:30 – 18:00', titolo: 'Ingresso palco partenza', nota: 'Le vetture si incolonnano verso il palco.' },
    { ora: '18:30', titolo: 'Cerimonia di presentazione degli equipaggi', nota: 'Le vetture salgono sul palco in ordine inverso di numero. Ingresso libero.' },
  ] },
  { titolo: 'Domenica 22 novembre', voci: [
    { ora: '07:30', titolo: 'Partenza, prima vettura', nota: 'Selve di Teolo — uscita del parco assistenza. Le vetture partono a un minuto di distanza.' },
    { ora: '07:48', titolo: 'PS 1 · Teolo', nota: 'Primo passaggio. Prova di 3,00 km.' },
    { ora: '08:11', titolo: 'PS 2 · Roccolo – Cingolina', nota: 'Primo passaggio. Prova di 4,12 km.' },
    { ora: '08:48 – 10:33', titolo: 'Riordino', nota: 'Treponti — Piazza Mercato.' },
    { ora: '10:48 – 11:18', titolo: 'Parco assistenza A', nota: 'Selve di Teolo. Trenta minuti di assistenza alle vetture.' },
    { ora: '11:36', titolo: 'PS 3 · Teolo', nota: 'Secondo passaggio.' },
    { ora: '11:59', titolo: 'PS 4 · Roccolo – Cingolina', nota: 'Secondo passaggio.' },
    { ora: '12:36 – 14:11', titolo: 'Riordino', nota: 'Treponti — Piazza Mercato.' },
    { ora: '14:26 – 14:56', titolo: 'Parco assistenza B', nota: 'Selve di Teolo. Ultimo intervento prima del terzo giro.' },
    { ora: '15:14', titolo: 'PS 5 · Teolo', nota: 'Terzo e ultimo passaggio.' },
    { ora: '15:37', titolo: 'PS 6 · Roccolo – Cingolina', nota: 'Terzo e ultimo passaggio.' },
    { ora: '16:00', titolo: 'Elenco vetture in verifica', nota: 'Pubblicazione in albo di gara delle vetture convocate alle verifiche tecniche dopo la gara.' },
    { ora: '16:15', titolo: 'Arrivo, prima vettura', nota: 'Treponti — Via Alcide De Gasperi.' },
    { ora: '16:30', titolo: 'Pedana arrivo e premiazioni', nota: 'Treponti — Piazza Mercato · ingresso libero.' },
    { ora: '18:00', titolo: 'Classifiche finali', nota: 'Pubblicazione in albo di gara.' },
  ] },
];

/**
 * Elenco svuotato il 22 ottobre 2026: la tabella distanze e tempi V3 è definitiva, quindi
 * gli orari di passaggio sono pubblici e il programma si mostra intero. Il meccanismo
 * resta in piedi (il filtro è in `src/lib/contenuti.ts`): basta rimettere dei titoli qui
 * dentro per nascondere di nuovo quelle voci e sostituirle con `vocePerOrariMancanti`.
 */
export const vociOrariNascoste: string[] = [];
/**
 * Voci che la pagina Spettatori non mostra perché riguardano solo gli equipaggi
 * (scelta di Fabio, 20 ottobre 2026). Restano nella scheda gara di Concorrenti,
 * che è una struttura diversa (`schedaGara`), e restano nel CMS: qui si nascondono
 * soltanto dal programma pubblico. Si tolgono, senza riga sostitutiva.
 */
export const vociNascosteSpettatori = [
  'Ricognizioni autorizzate del percorso',
  'Ingresso team in parco assistenza',
  'Verifiche sportive',
  'Verifiche tecniche',
];
export const vocePerOrariMancanti = {
  ora: 'In arrivo',
  titolo: 'Prove speciali, riordini e assistenza',
  nota: 'Sei passaggi cronometrati sulle due prove, due riordini a Treponti e due parchi assistenza a Selve di Teolo. Gli orari escono con la tabella tempi e distanze.',
};

export const consentito = [
  'Sostare nelle zone pubblico segnalate, dietro reti e nastri.',
  'Raggiungere le zone a piedi dai percorsi indicati.',
  'Arrivare almeno un’ora prima del passaggio della prima vettura.',
  'Chiedere indicazioni ai commissari: sono lì per questo.',
];
export const vietato = [
  'Sostare fuori dalle zone pubblico, all’esterno delle curve e nelle vie di fuga.',
  'Attraversare la strada dopo la chiusura al traffico.',
  'Scavalcare reti, nastri e transenne.',
  'Lasciare bambini e cani liberi vicino alla sede stradale.',
  'Accendere fuochi, fumogeni, torce, bengala, petardi o inneschi di qualsiasi tipo.',
  'Far volare droni sopra il percorso e sulle zone pubblico.',
];

const MESI = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
/** "12 LUG 2026" oppure "12 LUG 2026, 18:30" — orario Europe/Rome */
export function fmtData(iso: string, withTime = false): string {
  const d = new Date(iso);
  const p = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const g = (t: string) => p.find(x => x.type === t)?.value ?? '';
  const base = `${g('day')} ${MESI[Number(g('month')) - 1]} ${g('year')}`;
  return withTime ? `${base}, ${g('hour')}:${g('minute')}` : base;
}
