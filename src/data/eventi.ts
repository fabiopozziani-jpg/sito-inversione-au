/** Eventi della stagione — la fonte per card, calendario e hub. FASE 4: collection CMS "Eventi". */
import { rallyImg, rallyAlt, RALLY_IMG } from './rallyImmagini';
export type Stato = 'annuncio' | 'iscrizioni-aperte' | 'imminente' | 'in-corso' | 'conclusa';
export type Evento = {
  key: 'rally' | 'polo' | 'legnaro';
  nome: string; slug: string; href: string;
  accent: string; accentDark: string;
  dataLabel: string; luogo: string; dataIso: string;
  stato: Stato; ordine: number;
  testoCard: string; ctaCard: string; cover: string; coverAlt: string;
};
export const eventi: Evento[] = [
  { key: 'rally', nome: '1° Rally Colli Euganei', slug: 'rally-colli-euganei', href: '/rally-colli-euganei/',
    accent: '#00BA89', accentDark: '#006C7C', dataLabel: '21–22 NOV 2026', luogo: 'Colli Euganei', dataIso: '2026-11-21',
    stato: 'annuncio', ordine: 0,
    testoCard: 'Dopo più di 30 anni torna il rally sui Colli Euganei a Padova. Scopri tutte le informazioni.',
    ctaCard: 'Apri la pagina del rally', cover: rallyImg(RALLY_IMG.heroRally, 1200, 750), coverAlt: rallyAlt(RALLY_IMG.heroRally) },
  { key: 'polo', nome: 'Polo Motor Show', slug: 'polo-motor-show', href: '/eventi/polo-motor-show/',
    accent: '#6FC7DB', accentDark: '#1E7A91', dataLabel: '13–14 GIU 2026', luogo: 'Selve di Teolo', dataIso: '2026-06-13',
    stato: 'conclusa', ordine: 1,
    testoCard: 'Il nostro evento più grande: due giorni di gare, auto in esposizione e area food.',
    ctaCard: 'Apri la pagina del Polo Motor Show', cover: '/foto/bmw_m3_e30_ricambi.jpg', coverAlt: '' },
  { key: 'legnaro', nome: 'Legnaro Motori', slug: 'legnaro-motori', href: '/eventi/legnaro-motori/',
    accent: '#A8D8B4', accentDark: '#3C5490', dataLabel: '15 MAR 2026', luogo: 'Legnaro', dataIso: '2026-03-15',
    stato: 'conclusa', ordine: 2,
    testoCard: 'Una giornata di drifting e raduni di auto sportive.',
    ctaCard: 'Apri la pagina di Legnaro Motori', cover: '/foto/inversione_au_e36_drift.jpg', coverAlt: '' },
];
export const numeri = [
  { value: '15.000+', label: 'spettatori nelle ultime edizioni' },
  { value: 'circa 100', label: 'equipaggi in due giorni' },
  { value: '300+', label: 'auto esposte' },
  { value: '30+', label: 'persone nello staff' },
];
