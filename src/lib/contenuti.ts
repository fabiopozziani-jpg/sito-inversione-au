/**
 * Contenuti del sito: CMS Wix prima, dati statici di src/data/ come riserva.
 * Ogni loader restituisce la stessa forma dei moduli statici, così le pagine non cambiano struttura.
 * Regola: se la collection non risponde o è vuota, si usa la versione statica (il sito non resta mai senza contenuti).
 */
import { query } from './cms';
import { wixFill, wixFit } from '../data/media';
import { posts as postsStatici, type Post, type EventoNews, type Chi } from '../data/news';
import { gallerie as gallerieStatiche, type Galleria, type Foto } from '../data/gallerie';
import { annuali as annualiStatici, rally as sponsorRallyStatici, polo as sponsorPoloStatici, legnaro as sponsorLegnaroStatici, type Sponsor } from '../data/sponsor';
import { eventi as eventiStatici, type Evento, type Stato } from '../data/eventi';
import { edizioni as edizioniStatiche, type Edizione } from '../data/archivio';
import { hubs as hubsStatici, type Hub } from '../data/hub';
import * as R from '../data/rally';

/* ---------- utilità ---------- */

type WixImg = { id: string; name: string; w: number; h: number };
/** `wix:image://v1/<id>/<nome>#originWidth=W&originHeight=H` → parti. */
export function wixImg(v: unknown): WixImg | null {
  if (typeof v !== 'string' || !v.startsWith('wix:image://')) return null;
  const m = v.match(/^wix:image:\/\/v1\/([^/]+)\/([^#]+)(?:#(.*))?$/);
  if (!m) return null;
  const q = new URLSearchParams(m[3] ?? '');
  return { id: m[1], name: decodeURIComponent(m[2]), w: Number(q.get('originWidth')) || 0, h: Number(q.get('originHeight')) || 0 };
}
/** URL ritagliata w×h dal Media Manager; se il campo è vuoto o non è un'immagine Wix, ritorna `fallback`. */
export const imgFill = (v: unknown, w: number, h: number, fallback = ''): string => {
  const i = wixImg(v); if (i) return wixFill(i.id, i.name, w, h);
  return typeof v === 'string' && v.startsWith('http') ? v : fallback;
};
export const imgFit = (v: unknown, max: number, fallback = ''): string => {
  const i = wixImg(v); if (i) return wixFit(i.id, i.name, max);
  return typeof v === 'string' && v.startsWith('http') ? v : fallback;
};
/** URL assoluta del dominio → relativa (i link interni restano validi anche in anteprima). */
export const rel = (u: unknown): string => typeof u === 'string' ? u.replace(/^https?:\/\/(www\.)?inversioneau\.com/, '') : '';
const MESI = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
const MESI_ESTESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
/** '2026-09-25' → '25 SET 2026' */
export const dataBreve = (iso: string) => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return d && m ? `${String(d).padStart(2, '0')} ${MESI[m - 1]} ${y}` : ''; };
const righe = (s: unknown) => (typeof s === 'string' ? s.split('\n').map(x => x.trim()).filter(Boolean) : []);
const s = (v: unknown, d = '') => (typeof v === 'string' && v.trim() ? v : d);
const pieno = <T,>(cms: T[] | null, statico: T[]) => (cms && cms.length ? cms : statico);

/* ---------- News ---------- */

type NewsCms = { titolo: string; slug: string; sommario?: string; data?: string; evento?: string; chi?: string; tipo?: string; immagine?: string; immagineAlt?: string; lead?: string; credito?: string; corpo?: string; ctaLabel?: string; ctaUrl?: string; cta2Label?: string; cta2Url?: string; pubblicato?: boolean };
const CATEGORIA: Record<string, string> = { 'Rally Colli Euganei': 'Rally', 'Polo Motor Show': 'Polo Motor Show', 'Legnaro Motori': 'Legnaro Motori', 'Associazione': 'Associazione' };
const IMG_EVENTO: Record<string, string> = { 'Rally Colli Euganei': '/img/social/rally-colli-euganei.jpg', 'Polo Motor Show': '/img/social/polo-motor-show.jpg', 'Legnaro Motori': '/img/social/legnaro-motori.jpg', 'Associazione': '/img/social/inversione-au.jpg' };

function postDaCms(n: NewsCms & { _id: string }): Post {
  const statico = postsStatici.find(p => p.slug === n.slug);
  const iso = s(n.data, statico?.iso ?? '').slice(0, 10);
  const event = (s(n.evento, statico?.event ?? 'Associazione')) as EventoNews;
  const image = imgFill(n.immagine, 1600, 1067, statico?.image ?? IMG_EVENTO[event] ?? IMG_EVENTO.Associazione);
  const corpo: Post['corpo'] = n.corpo ? [{ t: 'html', html: n.corpo }] : (statico?.corpo ?? []);
  return {
    slug: n.slug, title: n.titolo, excerpt: s(n.sommario, statico?.excerpt ?? ''), iso, date: dataBreve(iso),
    category: CATEGORIA[event] ?? event, event, chi: (s(n.chi, statico?.chi ?? 'Per il pubblico')) as Chi,
    image, imageAlt: s(n.immagineAlt, statico?.imageAlt ?? ''),
    tipo: (s(n.tipo, statico?.tipo ?? 'aggiornamento')) as Post['tipo'],
    lead: s(n.lead, statico?.lead ?? ''), credito: s(n.credito, statico?.credito ?? ''), corpo,
    cta: n.ctaLabel && n.ctaUrl ? { label: n.ctaLabel, href: rel(n.ctaUrl), esterno: /^https?:/.test(rel(n.ctaUrl)) } : statico?.cta,
    cta2: n.cta2Label && n.cta2Url ? { label: n.cta2Label, href: rel(n.cta2Url) } : statico?.cta2,
  };
}
/** Tutte le news pubblicate (CMS) o quelle statiche. */
export async function caricaPosts(): Promise<Post[]> {
  const cms = await query<NewsCms>('News', { filter: { pubblicato: true }, sort: [{ fieldName: 'data', order: 'DESC' }], limit: 200 });
  return pieno(cms?.filter(n => n.slug && n.titolo).map(postDaCms) ?? null, postsStatici);
}
const rank: Record<string, number> = { 'Rally Colli Euganei': 0, 'Polo Motor Show': 1, 'Legnaro Motori': 2, 'Associazione': 3 };
export const ordinaPerEvento = (p: Post[]) => [...p].sort((a, b) => (rank[a.event] ?? 9) - (rank[b.event] ?? 9) || (a.iso < b.iso ? 1 : -1));
export const ordinaPerData = (p: Post[]) => [...p].sort((a, b) => (a.iso < b.iso ? 1 : -1));

/* ---------- Gallerie e foto ---------- */

type GalleriaCms = { evento: string; nome: string; anno: string; slug: string; stato: string; notaVuota?: string; credito?: string; copertina?: string; copertinaAlt?: string };
type FotoCms = { galleria: string; immagine: string; alt?: string; ordine?: number };
const ACCENT: Record<string, string> = { polo: '#6FC7DB', legnaro: '#A8D8B4', rally: '#00BA89' };
const NOME_EVENTO: Record<string, string> = { polo: 'Polo Motor Show', legnaro: 'Legnaro Motori', rally: '1° Rally Colli Euganei' };

/** Gallerie con le foto dal Media Manager (collection Gallerie + Foto) o quelle statiche. */
export async function caricaGallerie(): Promise<Galleria[]> {
  const [g, f] = await Promise.all([
    query<GalleriaCms>('Gallerie', { limit: 50 }),
    query<FotoCms>('Foto', { sort: [{ fieldName: 'ordine' }], limit: 1000 }),
  ]);
  if (!g || !g.length) return gallerieStatiche;
  const perGalleria = new Map<string, Foto[]>();
  for (const x of f ?? []) {
    const i = wixImg(x.immagine); if (!i) continue;
    const arr = perGalleria.get(x.galleria) ?? [];
    arr.push({ src: wixFill(i.id, i.name, 400, 267), src800: wixFill(i.id, i.name, 800, 533), srcLarge: wixFit(i.id, i.name, 1600), alt: s(x.alt), w: 400, h: 267 });
    perGalleria.set(x.galleria, arr);
  }
  const ordine = ['polo', 'legnaro', 'rally'];
  return g.map(x => {
    const statica = gallerieStatiche.find(y => y.slug === x.slug);
    const foto = perGalleria.get(x.slug) ?? statica?.foto ?? [];
    return {
      evento: (x.evento as Galleria['evento']) ?? 'polo', nomeEvento: s(x.nome, NOME_EVENTO[x.evento] ?? x.evento), anno: s(x.anno, statica?.anno ?? ''),
      accent: ACCENT[x.evento] ?? '#fff', slug: x.slug,
      stato: (x.stato === 'pubblicata' && foto.length ? 'pubblicata' : 'in-attesa'), notaVuota: s(x.notaVuota, statica?.notaVuota ?? ''), credito: s(x.credito, statica?.credito ?? ''),
      copertina: { src: imgFill(x.copertina, 800, 533, statica?.copertina.src ?? foto[0]?.src800 ?? ''), alt: s(x.copertinaAlt, statica?.copertina.alt ?? '') },
      foto,
    } satisfies Galleria;
  }).sort((a, b) => ordine.indexOf(a.evento) - ordine.indexOf(b.evento));
}
export function fotoRecentiDa(gallerie: Galleria[], n = 8): (Foto & { evento: string })[] {
  const src = gallerie.filter(g => g.stato === 'pubblicata');
  const out: (Foto & { evento: string })[] = [];
  for (let i = 0; out.length < n && i < 40; i++) for (const g of src) if (g.foto[i] && out.length < n) out.push({ ...g.foto[i], evento: g.evento });
  return out;
}

/* ---------- Sponsor ---------- */

type SponsorCms = { nome: string; logo?: string; url?: string; livello?: string; evento?: string; ordine?: number; attivo?: boolean };
const tuttiStatici = [...annualiStatici, ...sponsorRallyStatici, ...sponsorPoloStatici, ...sponsorLegnaroStatici];
const staticoPerNome = (nome: string) => tuttiStatici.find(x => x.name.toLowerCase() === nome.toLowerCase());
const logoStatico = (nome: string) => staticoPerNome(nome)?.logo ?? '';
/** { annuali, perEvento(chiave) } — dal CMS o statici. */
export async function caricaSponsor() {
  const cms = await query<SponsorCms>('Sponsor', { sort: [{ fieldName: 'ordine' }], limit: 300 });
  if (!cms || !cms.length) return { annuali: annualiStatici, perEvento: (k: string) => ({ rally: sponsorRallyStatici, polo: sponsorPoloStatici, legnaro: sponsorLegnaroStatici }[k] ?? []) };
  const attivi = cms.filter(x => x.attivo !== false && x.nome);
  const conv = (x: SponsorCms): Sponsor => {
    const i = wixImg(x.logo); const st = staticoPerNome(x.nome);
    // imgFit(…, 400) ridimensiona nel riquadro 400×400: le dimensioni rese seguono il lato lungo
    const k = i ? 400 / Math.max(i.w, i.h, 1) : 0;
    return { name: x.nome, logo: imgFit(x.logo, 400, logoStatico(x.nome)), url: x.url || undefined, w: i ? Math.round(i.w * k) : st?.w, h: i ? Math.round(i.h * k) : st?.h };
  };
  const annuali = attivi.filter(x => x.livello === 'stagione').map(conv);
  const perEvento = (k: string) => attivi.filter(x => x.livello !== 'stagione' && (x.evento ?? '').split(/[,\s]+/).includes(k)).map(conv);
  return { annuali, perEvento };
}
/** Sponsor dell'evento senza i partner di stagione (che si mostrano a parte). */
export const senzaAnnuali = (lista: Sponsor[], annuali: Sponsor[]) => { const n = new Set(annuali.map(a => a.name.toLowerCase())); return lista.filter(x => !n.has(x.name.toLowerCase())); };

/* ---------- Eventi (card, calendario) ---------- */

type EventoCms = { nome: string; chiave: string; slug?: string; anno?: string; dataInizio?: string; dataFine?: string; dataLabel?: string; luogo?: string; stato?: string; ordine?: number; claim?: string; testoCard?: string; ctaCard?: string; hero?: string; logo?: string; introTitolo?: string; introTesto1?: string; introTesto2?: string; mappa?: string; mappaTitolo?: string; mappaTesto?: string; mappaAree?: string; comeArrivare?: string; pilotiTesto?: string; pilotiVoci?: string; pilotiNota?: string; pilotiImmagine?: string; pilotiDidascalia?: string; sponsorIntro?: string; ticketUrl?: string; whatsapp?: string; sportityPassword?: string; moduloIscrizione?: string; statoIscrizioni?: string; mappaPercorso?: string; mappaZone?: string };
const HREF: Record<string, string> = { rally: '/rally-colli-euganei/', polo: '/eventi/polo-motor-show/', legnaro: '/eventi/legnaro-motori/' };
let _eventi: Promise<(EventoCms & { _id: string })[] | null> | null = null;
const eventiCms = () => (_eventi ??= query<EventoCms>('Eventi', { sort: [{ fieldName: 'ordine' }], limit: 20 }).then(r => { setTimeout(() => (_eventi = null), 60_000); return r; }));

export async function caricaEventi(): Promise<Evento[]> {
  const cms = await eventiCms();
  if (!cms || !cms.length) return eventiStatici;
  return cms.filter(x => x.chiave && x.nome).map((x, i) => {
    const st = eventiStatici.find(e => e.key === x.chiave);
    return {
      key: x.chiave as Evento['key'], nome: x.nome, slug: s(x.slug, st?.slug ?? x.chiave), href: HREF[x.chiave] ?? `/eventi/${s(x.slug, x.chiave)}/`,
      accent: st?.accent ?? '#fff', accentDark: st?.accentDark ?? '#333',
      dataLabel: s(x.dataLabel, st?.dataLabel ?? ''), luogo: s(x.luogo, st?.luogo ?? ''), dataIso: s(x.dataInizio, st?.dataIso ?? '').slice(0, 10),
      stato: (s(x.stato, st?.stato ?? 'annuncio')) as Stato, ordine: x.ordine ?? i,
      testoCard: s(x.testoCard, st?.testoCard ?? ''), ctaCard: s(x.ctaCard, st?.ctaCard ?? 'Apri la pagina'),
      cover: imgFill(x.hero, 1200, 750, st?.cover ?? ''), coverAlt: st?.coverAlt ?? '',
    } satisfies Evento;
  }).sort((a, b) => a.ordine - b.ordine);
}

/* ---------- Hub evento (Polo, Legnaro) ---------- */

type ProgrammaCms = { evento: string; giorno?: string; ordine?: number; ora?: string; primaVettura?: string; titolo: string; nota?: string };
const dataEstesa = (iso: string) => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return d ? `${d} ${MESI_ESTESI[m - 1]} ${y}` : ''; };

export async function caricaHub(key: 'polo' | 'legnaro'): Promise<Hub> {
  const base = hubsStatici[key];
  const [ev, prog] = await Promise.all([eventiCms(), query<ProgrammaCms>('Programma', { filter: { evento: key }, sort: [{ fieldName: 'ordine' }], limit: 100 })]);
  const x = ev?.find(e => e.chiave === key);
  if (!x) return base;
  const aree = righe(x.mappaAree).map(r => { const [nome, ...t] = r.split(' — '); return { nome: nome.trim(), testo: t.join(' — ').trim() }; }).filter(a => a.testo);
  let dataInizio = base.dataInizio, dataFine = base.dataFine;
  if (x.dataInizio) {
    const [y1, m1, d1] = x.dataInizio.slice(0, 10).split('-').map(Number);
    const fine = x.dataFine ?? x.dataInizio; const [, m2] = fine.slice(0, 10).split('-').map(Number);
    if (fine === x.dataInizio) { dataInizio = ''; dataFine = dataEstesa(x.dataInizio); }
    else if (m1 === m2) { dataInizio = String(d1); dataFine = dataEstesa(fine); }
    else { dataInizio = `${d1} ${MESI_ESTESI[m1 - 1]}`; dataFine = dataEstesa(fine); }
    void y1;
  }
  const programma = prog && prog.length ? prog.map(p => ({ time: [s(p.giorno), s(p.ora)].filter(Boolean).join(' · '), title: p.titolo, text: s(p.nota) || undefined })) : base.programma;
  return {
    ...base,
    nome: s(x.nome, base.nome), anno: s(x.anno, base.anno), annoProx: String(Number(s(x.anno, base.anno)) + 1),
    logo: imgFit(x.logo, 900, base.logo), hero: imgFill(x.hero, 1920, 1080, base.hero), claim: s(x.claim, base.claim),
    dataInizio, dataFine, dataIso: s(x.dataInizio, base.dataIso).slice(0, 10), luogo: s(x.luogo, base.luogo),
    stato: (s(x.stato, base.stato)) as Stato, ticketUrl: s(x.ticketUrl, base.ticketUrl),
    introTitolo: s(x.introTitolo, base.introTitolo), introTesto1: s(x.introTesto1, base.introTesto1), introTesto2: s(x.introTesto2, base.introTesto2),
    programma,
    mappa: imgFit(x.mappa, 1600, base.mappa), mappaTitolo: s(x.mappaTitolo, base.mappaTitolo), mappaTesto: s(x.mappaTesto, base.mappaTesto),
    mappaAree: aree.length ? aree : base.mappaAree, comeArrivare: s(x.comeArrivare, base.comeArrivare),
    pilotiTesto: s(x.pilotiTesto, base.pilotiTesto), pilotiVoci: righe(x.pilotiVoci).length ? righe(x.pilotiVoci) : base.pilotiVoci, pilotiNota: s(x.pilotiNota, base.pilotiNota),
    pilotiImage: imgFill(x.pilotiImmagine, 1200, 800, base.pilotiImage), pilotiCaption: s(x.pilotiDidascalia, base.pilotiCaption),
    sponsorIntro: s(x.sponsorIntro, base.sponsorIntro),
  };
}

/* ---------- Rally Colli Euganei ---------- */

type ProvaCms = { evento: string; sigla: string; nome: string; km?: string; chiusura?: string; primaVettura?: string; zonaPubblico?: string; mapsUrl?: string; mappa?: string; ordine?: number };
type ScadenzaCms = { evento: string; fase: string; data?: string; ora?: string; ordine?: number };
type IscrittoCms = { evento: string; numero?: string; equipaggio: string; vettura?: string; classe?: string; ordine?: number };
type DocumentoCms = { evento: string; numero?: string; titolo: string; gruppo?: string; versione?: string; pubblicatoIl?: string; file?: string; nomeFile?: string; versionePrecedente?: string; dataVersionePrecedente?: string; superato?: boolean; superatoDa?: string };

export async function caricaRally() {
  const [ev, prove, scadenze, iscritti, documenti, prog] = await Promise.all([
    eventiCms(),
    query<ProvaCms>('ProveSpeciali', { filter: { evento: 'rally' }, sort: [{ fieldName: 'ordine' }], limit: 50 }),
    query<ScadenzaCms>('Scadenze', { filter: { evento: 'rally' }, sort: [{ fieldName: 'ordine' }], limit: 50 }),
    query<IscrittoCms>('Iscritti', { filter: { evento: 'rally' }, sort: [{ fieldName: 'ordine' }], limit: 300 }),
    query<DocumentoCms>('Documenti', { filter: { evento: 'rally' }, sort: [{ fieldName: 'pubblicatoIl', order: 'DESC' }], limit: 200 }),
    query<ProgrammaCms>('Programma', { filter: { evento: 'rally' }, sort: [{ fieldName: 'ordine' }], limit: 100 }),
  ]);
  const x = ev?.find(e => e.chiave === 'rally');
  const rally = {
    ...R.rally,
    nome: s(x?.nome, R.rally.nome), luogo: s(x?.luogo, R.rally.luogo),
    statoIscrizioni: (s(x?.statoIscrizioni, R.rally.statoIscrizioni)) as typeof R.rally.statoIscrizioni,
    moduloUrl: s(x?.moduloIscrizione, R.rally.moduloUrl),
    sportity: { ...R.rally.sportity, password: s(x?.sportityPassword, R.rally.sportity.password) },
    whatsapp: s(x?.whatsapp, R.rally.whatsapp),
    mappaPercorso: imgFit(x?.mappaPercorso, 1600, R.rally.mappaPercorso), mappaZone: imgFit(x?.mappaZone, 1600, R.rally.mappaZone),
    hero: imgFill(x?.hero, 1920, 1080, R.rally.hero),
    stato: s(x?.stato, 'annuncio') as Stato,
  };
  const proveOut = prove && prove.length ? prove.map(p => ({ sigla: p.sigla, nome: p.nome, km: s(p.km), chiusura: s(p.chiusura, '— · da definire'), prima: s(p.primaVettura, '— · da definire'), pubblico: s(p.zonaPubblico), maps: s(p.mapsUrl), mappa: imgFit(p.mappa, 1600) })) : R.prove;
  const scadenzeOut = scadenze && scadenze.length ? scadenze.map(z => ({ fase: z.fase, data: s(z.data, 'Da definire'), ora: s(z.ora, '—') })) : R.scadenze;
  const iscrittiOut: R.Iscritto[] = iscritti && iscritti.length ? iscritti.map(i => ({ num: s(i.numero), equipaggio: i.equipaggio, vettura: s(i.vettura), classe: s(i.classe) })) : R.iscritti;
  const documentiOut: R.Documento[] = documenti && documenti.length ? documenti.map(d => ({
    num: s(d.numero), title: d.titolo, iso: s(d.pubblicatoIl).slice(0, 10), file: s(d.nomeFile, 'PDF'), href: s(d.file), rev: s(d.versione) || undefined,
    gruppo: (s(d.gruppo) || undefined) as R.Documento['gruppo'], revPrev: s(d.versionePrecedente) || undefined, revPrevIso: s(d.dataVersionePrecedente).slice(0, 10) || undefined,
    superato: !!d.superato, superatoDa: s(d.superatoDa) || undefined,
  })) : R.documenti;
  let programmaOut = R.programma;
  if (prog && prog.length) {
    const gruppi = new Map<string, { ora: string; titolo: string; nota: string; prima?: string }[]>();
    for (const p of prog) { const g = s(p.giorno, 'Programma'); const arr = gruppi.get(g) ?? []; arr.push({ ora: s(p.ora, 'Da definire'), titolo: p.titolo, nota: s(p.nota), prima: s(p.primaVettura) ? 'Prima vettura: ' + p.primaVettura : undefined }); gruppi.set(g, arr); }
    programmaOut = [...gruppi].map(([titolo, voci]) => ({ titolo, voci })) as typeof R.programma;
  }
  const ultimoAgg = iscritti && iscritti.length ? (iscritti as any[]).map(i => i._updatedDate?.$date ?? i._updatedDate ?? '').sort().pop() : '';
  return { rally, prove: proveOut, scadenze: scadenzeOut, iscritti: iscrittiOut, iscrittiAggiornatoAl: ultimoAgg ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', timeZone: 'Europe/Rome' }).format(new Date(ultimoAgg)) : R.iscrittiAggiornatoAl, iscrittiPdf: R.iscrittiPdf, documenti: documentiOut, programma: programmaOut };
}

/* ---------- Edizioni e direttivo ---------- */

type EdizioneCms = { nome: string; data?: string; luogo?: string; accent?: string; testo?: string; numeri?: string; url?: string; cta?: string; ordine?: number };
export async function caricaEdizioni(): Promise<Edizione[]> {
  const cms = await query<EdizioneCms>('Edizioni', { sort: [{ fieldName: 'ordine' }], limit: 100 });
  return pieno(cms?.filter(e => e.nome).map(e => ({ nome: e.nome, data: s(e.data), luogo: s(e.luogo), accent: s(e.accent, '#8C8C8C'), testo: s(e.testo), numeri: s(e.numeri), href: rel(e.url) || '/eventi/', cta: s(e.cta, 'Apri') })) ?? null, edizioniStatiche);
}
type TeamCms = { nome: string; ruolo?: string; nota?: string; ordine?: number };
export async function caricaTeam(): Promise<{ nome: string; ruolo: string; nota: string }[] | null> {
  const cms = await query<TeamCms>('Team', { sort: [{ fieldName: 'ordine' }], limit: 50 });
  return cms && cms.length ? cms.map(t => ({ nome: t.nome, ruolo: s(t.ruolo), nota: s(t.nota) })) : null;
}
