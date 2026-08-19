/**
 * 1° Rally Colli Euganei ACI Sport — dati dell'evento (FASE 2: statici; FASE 4: collection CMS).
 * Regola: quello che non è confermato resta "da definire" — nessun dato inventato.
 */
import { rallyImg, rallyAlt, RALLY_IMG } from './rallyImmagini';
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
  telefoni: [
    { label: 'Segreteria', num: '+39 348 570 1233', tel: '+393485701233' },
    { label: 'Organizzazione', num: '+39 348 904 9212', tel: '+393489049212' },
  ],
  /** Iscrizioni: 'non-aperte' | 'aperte' | 'chiuse' */
  statoIscrizioni: 'non-aperte' as 'non-aperte' | 'aperte' | 'chiuse',
  moduloUrl: 'https://www.acisport.it',
  /** Scheda dell'evento nel calendario ufficiale ACI Sport */
  aciUrl: 'https://www.acisport.it/it/acisport/dettaglio-calendari/7506131/1%C2%B0-rally-colli-euganei',
  chiusuraIscrizioni: '6 novembre 2026',
  /** Testo vago finché non c'è una data ufficiale (scelta di Fabio, 19/8). */
  aperturaPrevista: 'a breve',
  /** Sportity: password del canale (vuota = non ancora pubblicata) */
  sportity: {
    password: '',
    ios: 'https://apps.apple.com/app/sportity/id1450246005',
    android: 'https://play.google.com/store/apps/details?id=com.sportity.app',
  },
  /** Canale WhatsApp per gli avvisi al pubblico (vuoto = non ancora attivo) */
  whatsapp: '',
  /** Mappe: percorso e zone pubblico (vuote = in pubblicazione) */
  mappaPercorso: '',
  mappaZone: '',
  hero: rallyImg(RALLY_IMG.heroRally, 1920, 1080), heroAlt: rallyAlt(RALLY_IMG.heroRally),
  targa: '/img/rally/targa_2026.png',
};

export const subnav = [
  { label: 'Il rally', href: '/rally-colli-euganei/' },
  { label: 'Percorso e prove speciali', href: '/rally-colli-euganei/percorso/' },
  { label: 'Concorrenti', href: '/rally-colli-euganei/concorrenti/' },
  { label: 'Spettatori', href: '/rally-colli-euganei/spettatori/' },
  { label: 'Documenti di gara', href: '/rally-colli-euganei/documenti/' },
  { label: 'Stampa e accrediti', href: '/stampa/accrediti/' },
  { label: 'Foto e video', href: '/foto-e-video/rally-colli-euganei-2026/' },
  { label: 'Edizioni precedenti', href: '/eventi/archivio/' },
];

export function statoRally(now = Date.now()): { stato: Stato; giorni: number } {
  const a = new Date(rally.inizio).getTime(), b = new Date(rally.fine).getTime();
  const giorni = Math.ceil((a - now) / 864e5);
  return { stato: now > b ? 'post' : now >= a ? 'in' : 'pre', giorni };
}

const TBD = '— · da definire';
export const prove = [
  { sigla: 'Passaggi 1 · 3 · 5', nome: 'Prova speciale 1', km: 'Coming soon', chiusura: TBD, prima: TBD, pubblico: TBD, maps: '', mappa: '' },
  { sigla: 'Passaggi 2 · 4 · 6', nome: 'Prova speciale 2', km: 'Coming soon', chiusura: TBD, prima: TBD, pubblico: TBD, maps: '', mappa: '' },
];

export const scadenze = [
  { fase: 'Apertura iscrizioni', data: 'Da definire', ora: '—' },
  { fase: 'Chiusura iscrizioni', data: 'Da definire', ora: '—' },
  { fase: 'Ricognizioni del percorso', data: 'Da definire', ora: '—' },
  { fase: 'Verifiche sportive e tecniche', data: 'Da definire', ora: '—' },
  { fase: 'Shakedown', data: 'Da definire', ora: '—' },
];

export const requisiti = [
  'Primo conduttore — licenza C Nazionale o superiore',
  'Secondo conduttore — licenza C Nazionale, C-R o Navigatore',
  'Certificato medico agonistico in corso di validità',
  'Vettura conforme al Regolamento di Settore Rally, con passaporto tecnico',
];

export type Iscritto = { num: string; equipaggio: string; vettura: string; classe: string };
export const classi = ['Rally2', 'Rally4', 'Rally5', 'Storiche'];
/** Elenco iscritti: si popola nella settimana di gara (FASE 4: collection). Vuoto = stato "in pubblicazione". */
export const iscritti: Iscritto[] = [];
export const iscrittiAggiornatoAl = '';
export const iscrittiPdf = '';

export type Documento = {
  num: string; title: string; iso: string; file: string; href: string; rev?: string;
  gruppo?: 'Regolamento e programma' | 'Comunicazioni del direttore di gara' | 'Modulistica';
  revPrev?: string; revPrevIso?: string; superato?: boolean; superatoDa?: string;
};
/** Albo di gara — vuoto fino alla pubblicazione ufficiale. */
export const documenti: Documento[] = [];
export const gruppiAlbo = ['Regolamento e programma', 'Comunicazioni del direttore di gara', 'Modulistica'] as const;

const TBD2 = 'Da definire';
export const programma = [
  { titolo: 'Sabato 21 novembre', voci: [
    { ora: TBD2, titolo: 'Verifiche sportive e tecniche', nota: 'Le vetture passano al controllo prima della partenza. Si possono vedere da vicino, a piedi.' },
    { ora: TBD2, titolo: 'Shakedown', nota: 'Prova di messa a punto su un tratto breve. È la prima occasione per vedere le auto in azione.' },
  ] },
  { titolo: 'Domenica 22 novembre', voci: [
    { ora: TBD2, titolo: 'Partenza', nota: 'Cerimoniale di partenza · luogo da definire' },
    { ora: TBD2, prima: 'Prima vettura: ' + TBD2, titolo: 'PS 01', nota: 'Primo passaggio sulla prima prova speciale' },
    { ora: TBD2, titolo: 'Arrivo e premiazioni', nota: 'Palco arrivo · ingresso libero' },
  ] },
];

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
  'Far volare droni sopra il percorso e accendere fuochi.',
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
