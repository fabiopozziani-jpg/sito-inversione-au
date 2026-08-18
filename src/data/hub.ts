/**
 * Contenuti degli hub evento (Polo Motor Show, Legnaro Motori). FASE 4: collection "Eventi" + "Programma".
 * Il Rally ha pagine proprie (src/pages/rally-colli-euganei/).
 */
import type { Stato } from './eventi';

export type Hub = {
  key: 'polo' | 'legnaro';
  nome: string; anno: string; annoProx: string;
  href: string; logo: string; hero: string; claim: string;
  dataInizio: string; dataFine: string; dataIso: string; luogo: string;
  stato: Stato; ticketUrl: string;
  introTitolo: string; introTesto1: string; introTesto2: string;
  stats: { value: string; label: string }[];
  programma: { time: string; title: string; text?: string }[];
  mappa: string; mappaTitolo: string; mappaTesto: string;
  mappaAree: { nome: string; testo: string }[]; comeArrivare: string;
  pilotiTesto: string; pilotiVoci: string[]; pilotiNota: string; pilotiImage: string; pilotiCaption: string;
  sponsorIntro: string;
  motivi: string[];
};

const motiviBase = ['Informazioni sull’evento', 'Voglio esporre la mia auto', 'Voglio correre', 'Sono un’azienda', 'Voglio dare una mano come volontario', 'Sono un giornalista'];

export const hubs: Record<'polo' | 'legnaro', Hub> = {
  polo: {
    key: 'polo', nome: 'Polo Motor Show', anno: '2026', annoProx: '2027',
    href: '/eventi/polo-motor-show/', logo: '/img/logo_polo_2026.png', hero: '/foto/bmw_m3_e30_ricambi.jpg',
    claim: 'Drift, rally show ed esposizione sul circuito cittadino dei Colli',
    dataInizio: '13', dataFine: '14 giugno 2026', dataIso: '2026-06-13', luogo: 'Selve di Teolo',
    stato: 'conclusa', ticketUrl: '',
    introTitolo: "Che cos'è il Polo Motor Show",
    introTesto1: 'Due giorni di esibizioni drift, rally show ed esposizione di auto. Le strade di Selve di Teolo diventano circuito e paddock, con il pubblico a pochi metri dalla pista.',
    introTesto2: "L'edizione 2026 si è chiusa domenica 14 giugno con oltre 15.000 spettatori. La prossima è in preparazione.",
    stats: [{ value: '15.000+', label: 'spettatori' }, { value: '100', label: 'equipaggi in pista' }, { value: '300+', label: 'auto esposte' }, { value: '23', label: 'sponsor' }],
    programma: [
      { time: 'SAB 13 GIU · 09:00', title: 'Apertura esposizione e paddock', text: 'Raduno statico nel centro di Selve' },
      { time: 'SAB 13 GIU · 11:00', title: 'Sessioni drift', text: 'Turni fino alle 19:00 sul circuito cittadino' },
      { time: 'DOM 14 GIU · 10:00', title: 'Rally show', text: 'Passaggi dimostrativi con equipaggi ospiti' },
      { time: 'DOM 14 GIU · 18:00', title: 'Premiazioni e chiusura', text: 'Palco centrale, piazza di Selve' },
    ],
    mappa: '', mappaTitolo: 'Il circuito cittadino di Selve di Teolo',
    mappaTesto: "Per due giorni le strade del paese diventano circuito. Il pubblico si muove a piedi tra le aree; l'accesso alla pista è riservato a piloti e commissari.",
    mappaAree: [
      { nome: 'Pista', testo: 'il circuito cittadino. Accesso vietato al pubblico, si guarda dalle aree recintate.' },
      { nome: 'Area espositori', testo: 'oltre 300 auto in mostra e gli stand dei partner.' },
      { nome: 'Area food', testo: 'due punti ristoro, aperti per tutta la durata dell’evento.' },
      { nome: 'Raduni', testo: 'dove arrivano e sostano le auto dei visitatori.' },
      { nome: 'Parcheggi', testo: 'parcheggio pubblico gratuito nelle vicinanze del centro.' },
    ],
    comeArrivare: 'https://www.google.com/maps/search/?api=1&query=Selve+di+Teolo',
    pilotiTesto: "Le iscrizioni piloti per il 2027 non sono ancora aperte. Gli espositori possono già candidarsi per il raduno e per l'area espositiva.",
    pilotiVoci: ['Drift — sessioni su iscrizione, briefing obbligatorio', 'Rally show — passaggi dimostrativi su invito', 'Esposizione — raduno statico, tutte le epoche'],
    pilotiNota: 'Iscrizioni piloti 2027: non ancora aperte',
    pilotiImage: '/foto/polo_e30_turchese_drift.jpg', pilotiCaption: 'Polo Motor Show · rally show sul tracciato cittadino',
    sponsorIntro: 'Le 23 aziende che hanno sostenuto l’edizione 2026.',
    motivi: motiviBase,
  },
  legnaro: {
    key: 'legnaro', nome: 'Legnaro Motori', anno: '2026', annoProx: '2027',
    href: '/eventi/legnaro-motori/', logo: '/img/logo_legnaro_2026.png', hero: '/foto/inversione_au_e36_pan.jpg',
    claim: 'Drift e raduno — la prima edizione',
    dataInizio: '15 marzo 2026', dataFine: '15 marzo 2026', dataIso: '2026-03-15', luogo: 'Legnaro',
    stato: 'conclusa', ticketUrl: '',
    introTitolo: "Che cos'è Legnaro Motori",
    introTesto1: "Una giornata di esibizioni drift e raduno di auto. È la versione compatta del format: un solo giorno, un'unica area, tutto raggiungibile a piedi.",
    introTesto2: 'La prima edizione si è svolta domenica 15 marzo 2026. La seconda è in preparazione.',
    stats: [{ value: '1ª', label: 'edizione' }, { value: '1', label: 'giorno di evento' }, { value: '15 MAR', label: 'data 2026' }, { value: '2027', label: 'in preparazione' }],
    programma: [
      { time: 'DOM 15 MAR · 09:00', title: 'Apertura raduno', text: 'Esposizione statica e paddock' },
      { time: 'DOM 15 MAR · 11:00', title: 'Sessioni drift', text: 'Turni per tutta la giornata' },
      { time: 'DOM 15 MAR · 18:00', title: 'Chiusura', text: 'Saluti e arrivederci al 2027' },
    ],
    mappa: '', mappaTitolo: "L'area evento di Legnaro",
    mappaTesto: "Tutto si svolge in un'unica area, in una sola giornata. Il tracciato drift è recintato; raduno, stand e ristoro sono intorno, raggiungibili a piedi.",
    mappaAree: [
      { nome: 'Pista', testo: 'il tracciato drift, recintato. Si guarda dalle aree per il pubblico.' },
      { nome: 'Raduno', testo: 'dove arrivano e sostano le auto dei visitatori.' },
      { nome: 'Area espositori', testo: 'gli stand dei partner e le auto in mostra.' },
      { nome: 'Ristoro', testo: 'un punto ristoro, aperto per tutta la giornata.' },
      { nome: 'Parcheggi', testo: 'parcheggio pubblico gratuito accanto all’area evento.' },
    ],
    comeArrivare: 'https://www.google.com/maps/search/?api=1&query=Legnaro+Padova',
    pilotiTesto: "Le iscrizioni piloti per il 2027 non sono ancora aperte. Gli espositori possono già candidarsi per il raduno e per l'area espositiva.",
    pilotiVoci: ['Drift — sessioni su iscrizione, briefing obbligatorio', 'Esposizione — raduno statico, tutte le epoche'],
    pilotiNota: 'Iscrizioni piloti 2027: non ancora aperte',
    pilotiImage: '/foto/raduno_expo.jpg', pilotiCaption: 'Legnaro Motori 2026 · raduno ed esposizione',
    sponsorIntro: 'Le aziende che hanno sostenuto Legnaro Motori 2026.',
    motivi: motiviBase,
  },
};

/** Testi che dipendono dallo stato dell'edizione (V4 EventHub). */
export function testiStato(h: Hub, galleryUrl: string) {
  const s = h.stato;
  const giorni = Math.max(0, Math.ceil((new Date(h.dataIso + 'T08:00:00+01:00').getTime() - Date.now()) / 864e5));
  const mancano = giorni > 1 ? `Mancano ${giorni} giorni` : 'Manca 1 giorno';
  const label: Record<Stato, string> = { annuncio: 'annuncio', 'iscrizioni-aperte': 'iscrizioni aperte', imminente: 'tra pochi giorni', 'in-corso': 'in corso', conclusa: 'edizione conclusa' };
  const cta: Record<Stato, [string, string][]> = {
    annuncio: [['Vedi il calendario 2026', '/eventi/'], ['Ricevi gli aggiornamenti', '/contatti/']],
    'iscrizioni-aperte': [['Compra il biglietto ↗', h.ticketUrl || '/contatti/'], ['Guarda il programma', '#programma']],
    imminente: [['Compra il biglietto ↗', h.ticketUrl || '/contatti/'], ['Guarda come arrivare', '#mappa']],
    'in-corso': [['Guarda gli orari di oggi', '#programma'], ['Guarda le aree del pubblico', '#mappa']],
    conclusa: [[`Guarda le foto ${h.anno}`, galleryUrl], ['Vedi le edizioni precedenti', '/eventi/archivio/']],
  };
  const band: Record<Stato, [string, string, string, string]> = {
    annuncio: ['In programma', 'La data è confermata. Programma, orari e iscrizioni saranno pubblicati appena definiti.', 'Vedi il calendario 2026', '/eventi/'],
    'iscrizioni-aperte': ['Iscrizioni aperte', 'Iscrizioni aperte. Regolamento e modulo nella sezione piloti ed espositori.', 'Guarda il programma', '#programma'],
    imminente: [mancano, 'Programma, aree del pubblico e parcheggi sono già online. Conviene comprare il biglietto prima di arrivare: alle casse si fa fila.', 'Guarda come arrivare', '#mappa'],
    'in-corso': ['Oggi in pista', 'Evento in corso. Su questa pagina aggiorniamo orari, aree aperte e comunicazioni durante la giornata.', 'Guarda gli orari di oggi', '#programma'],
    conclusa: ['Edizione conclusa', `Le foto ufficiali della giornata sono online. L’edizione ${h.annoProx} è in preparazione: le date arrivano su questa pagina.`, `Guarda le foto ${h.anno}`, galleryUrl],
  };
  const programmaTit: Record<Stato, string> = { annuncio: 'Programma in definizione', 'iscrizioni-aperte': 'Il programma', imminente: 'Il programma delle giornate', 'in-corso': 'Gli orari di oggi', conclusa: `Com’è andata: il programma ${h.anno}` };
  const partecipaTit: Record<Stato, string> = { annuncio: 'Correre o esporre', 'iscrizioni-aperte': 'Iscriviti come pilota o espositore', imminente: 'Piloti ed espositori', 'in-corso': 'Piloti ed espositori', conclusa: `Correre o esporre nel ${h.annoProx}` };
  const conclusa = s === 'conclusa';
  return {
    statoLabel: label[s], cta: cta[s], band: band[s],
    programmaTitolo: programmaTit[s], partecipaTitolo: partecipaTit[s],
    showGallery: conclusa || s === 'in-corso',
    showMappa: s !== 'annuncio',
    showPiloti: s !== 'annuncio' && s !== 'in-corso',
    pilotiKicker: conclusa ? `Edizione ${h.annoProx}` : `Edizione ${h.anno}`,
    pilotiCta: conclusa ? 'Candidati come espositore' : 'Iscriviti come pilota',
    periodo: h.dataFine && h.dataFine !== h.dataInizio ? `${h.dataInizio}–${h.dataFine}` : h.dataInizio,
  };
}
