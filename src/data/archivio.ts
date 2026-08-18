/** Archivio edizioni — dal più recente. FASE 4: collection "Edizioni". */
export type Edizione = { data: string; luogo: string; accent: string; nome: string; testo: string; numeri: string; href: string; cta: string };
export const edizioni: Edizione[] = [
  { data: '21–22 NOV 2026', luogo: 'Colli Euganei', accent: '#00BA89', nome: '1° Rally Colli Euganei ACI Sport', testo: 'Prima edizione: il rally torna sui Colli dopo più di trent’anni, con titolazione ACI Sport.', numeri: 'In programma · iscrizioni in autunno', href: '/rally-colli-euganei/', cta: 'Apri la pagina del rally' },
  { data: '13–14 GIU 2026', luogo: 'Selve di Teolo', accent: '#6FC7DB', nome: 'Polo Motor Show 2026', testo: 'Due giorni di drift, rally show e raduno sul circuito cittadino.', numeri: '15.000+ spettatori · circa 100 equipaggi · 300+ auto esposte', href: '/foto-e-video/polo-motor-show-2026/', cta: 'Guarda le foto' },
  { data: '15 MAR 2026', luogo: 'Legnaro', accent: '#A8D8B4', nome: 'Legnaro Motori 2026', testo: 'Prima edizione del format fuori dai Colli: drift e raduno in una giornata.', numeri: '1ª edizione · 1 giorno', href: '/foto-e-video/legnaro-motori-2026/', cta: 'Guarda le foto' },
  { data: '2025', luogo: 'Selve di Teolo', accent: '#6FC7DB', nome: 'Polo Motor Show 2025', testo: 'L’edizione che ha portato il circuito cittadino ai numeri attuali.', numeri: 'Numeri in verifica', href: '/contatti/', cta: 'Chiedi le foto' },
  { data: '2024', luogo: 'Selve di Teolo', accent: '#6FC7DB', nome: 'Polo Motor Show 2024', testo: 'Prima edizione del Polo Motor Show organizzata come ASD.', numeri: 'Numeri in verifica', href: '/contatti/', cta: 'Chiedi le foto' },
  { data: '2017–2023', luogo: 'Veneto', accent: '#8C8C8C', nome: 'Le stagioni del team drift', testo: 'Gli anni delle prime esibizioni, prima della costituzione dell’associazione.', numeri: 'Archivio fotografico in ricostruzione', href: '/associazione/', cta: 'La nostra storia' },
];
