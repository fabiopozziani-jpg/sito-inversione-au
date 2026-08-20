/**
 * Archivio edizioni — la scheda di ogni edizione dei nostri eventi.
 *
 * Non è un elenco di link: è il contenitore che si riempie edizione dopo edizione.
 * Ogni edizione ha sempre le stesse voci (numeri, albo, materiali); quelle vuote
 * semplicemente non compaiono. È l'unico capitolo del sito che non si può recuperare
 * dopo: quello che non viene archiviato adesso, fra cinque anni non esiste più.
 *
 * CMS: collection "Edizioni (archivio)". I campi link accettano un URL interno
 * (/foto-e-video/...) o un PDF del Media Manager. Vuoto = la voce non compare.
 */

export type EventoArchivio = 'rally' | 'polo' | 'legnaro' | 'team';

/** Un materiale scaricabile o consultabile di quell'edizione. */
export type Materiale = { etichetta: string; href: string };

export type Edizione = {
  slug: string;
  nome: string;
  evento: EventoArchivio;
  /** Etichetta di raggruppamento: '2026', '2025', '2017–2023'. */
  anno: string;
  /** Data estesa in mono: '21–22 NOV 2026'. */
  data: string;
  luogo: string;
  accent: string;
  stato: 'in-programma' | 'conclusa';
  testo: string;
  /** Una voce per numero, nella forma «10.000+ spettatori». Il valore viene isolato in fase di render. */
  numeri: string[];
  /** Seme dell'albo d'oro: vincitore per il rally, ospite per gli show. */
  albo?: { voce: string; nome: string };
  /** Locandina ufficiale dell'edizione, formato verticale. Vuota = non compare. */
  locandina?: { src: string; alt: string };
  materiali: Materiale[];
  /** Riga di servizio: cosa manca e perché. */
  nota?: string;
};

/** «10.000+ spettatori» → valore e etichetta separati. Se non riconosce un numero, tutto diventa etichetta. */
export function numero(v: string): { valore: string; etichetta: string } {
  const m = v.trim().match(/^((?:circa\s+|oltre\s+|più di\s+)?[\d.,]+\s*(?:\+|ª|°)?)\s+(.+)$/i);
  return m ? { valore: m[1].trim(), etichetta: m[2].trim() } : { valore: '', etichetta: v.trim() };
}

export const STATO_LABEL: Record<Edizione['stato'], string> = { 'in-programma': 'In programma', conclusa: 'Conclusa' };

export const edizioni: Edizione[] = [
  {
    slug: 'rally-colli-euganei-2026',
    nome: '1° Rally Colli Euganei ACI Sport',
    evento: 'rally', anno: '2026', data: '21–22 NOV 2026', luogo: 'Colli Euganei', accent: '#00BA89',
    stato: 'in-programma',
    testo: 'Prima edizione: il rally torna sui Colli dopo più di trent’anni, con titolazione ACI Sport.',
    numeri: ['1ª edizione', '2 giorni di gara'],
    materiali: [
      { etichetta: 'Pagina del rally', href: '/rally-colli-euganei/' },
      { etichetta: 'Albo di gara', href: '/rally-colli-euganei/documenti/' },
    ],
    nota: 'Iscrizioni in autunno. Classifiche, foto e comunicato finale compaiono qui dopo la gara.',
  },
  {
    slug: 'polo-motor-show-2026',
    nome: 'Polo Motor Show 2026',
    evento: 'polo', anno: '2026', data: '13–14 GIU 2026', luogo: 'Selve di Teolo', accent: '#6FC7DB',
    stato: 'conclusa',
    testo: 'Due giorni di drift, rally show e raduno sul circuito cittadino delle Selve.',
    numeri: ['10.000+ spettatori', 'circa 100 equipaggi', '400+ auto esposte', '23 sponsor'],
    albo: { voce: 'Special guest', nome: 'Danny Lazzarin — Shark Garage' },
    materiali: [
      { etichetta: 'Guarda le foto', href: '/foto-e-video/polo-motor-show-2026/' },
      { etichetta: 'Pagina dell’evento', href: '/eventi/polo-motor-show/' },
    ],
  },
  {
    slug: 'legnaro-motori-2026',
    nome: 'Legnaro Motori 2026',
    evento: 'legnaro', anno: '2026', data: '15 MAR 2026', luogo: 'Legnaro', accent: '#A8D8B4',
    stato: 'conclusa',
    testo: 'Prima edizione del format fuori dai Colli: drift e raduno in una sola giornata.',
    numeri: ['1ª edizione', '1 giorno di evento'],
    materiali: [
      { etichetta: 'Guarda le foto', href: '/foto-e-video/legnaro-motori-2026/' },
      { etichetta: 'Pagina dell’evento', href: '/eventi/legnaro-motori/' },
    ],
  },
  {
    slug: 'polo-motor-show-2025',
    nome: 'Polo Motor Show 2025',
    evento: 'polo', anno: '2025', data: '2025', luogo: 'Selve di Teolo', accent: '#6FC7DB',
    stato: 'conclusa',
    testo: 'L’edizione che ha ospitato la finale italiana dell’Hot Wheels Legends Tour e ha portato il circuito cittadino ai numeri attuali.',
    numeri: [],
    albo: { voce: 'Special guest', nome: 'Hot Wheels Legends Tour — finale italiana, con i Carmagheddon' },
    materiali: [{ etichetta: 'Chiedi le foto', href: '/contatti/' }],
    nota: 'Numeri e galleria in verifica.',
  },
  {
    slug: 'polo-motor-show-2024',
    nome: 'Polo Motor Show 2024',
    evento: 'polo', anno: '2024', data: '2024', luogo: 'Selve di Teolo', accent: '#6FC7DB',
    stato: 'conclusa',
    testo: 'Prima edizione del Polo Motor Show organizzata dall’associazione.',
    numeri: [],
    materiali: [{ etichetta: 'Chiedi le foto', href: '/contatti/' }],
    nota: 'Numeri e galleria in verifica.',
  },
  {
    slug: 'team-drift-2017-2023',
    nome: 'Le stagioni del team drift',
    evento: 'team', anno: '2017–2023', data: '2017–2023', luogo: 'Veneto', accent: '#8C8C8C',
    stato: 'conclusa',
    testo: 'Gli anni delle prime esibizioni e dei primi eventi statici, prima della costituzione dell’associazione.',
    numeri: [],
    materiali: [{ etichetta: 'La nostra storia', href: '/associazione/' }],
    nota: 'Archivio fotografico in ricostruzione.',
  },
];
