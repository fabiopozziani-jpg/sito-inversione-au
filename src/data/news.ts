/** News — FASE 4: collection CMS "News". Ordine: per evento (rally, polo, legnaro, associazione) e data decrescente. */
import { rallyImg, rallyAlt, RALLY_IMG } from './rallyImmagini';
export type Chi = 'Per il pubblico' | 'Per i concorrenti' | 'Per il pubblico e per i concorrenti';
export type EventoNews = 'Rally Colli Euganei' | 'Polo Motor Show' | 'Legnaro Motori' | 'Associazione';
export type Blocco =
  | { t: 'p'; html: string }
  | { t: 'h2'; testo: string }
  | { t: 'quote'; testo: string; cite: string }
  | { t: 'dl'; righe: [string, string][] }
  | { t: 'html'; html: string }; // corpo intero in HTML (dal CMS)
export type Post = {
  slug: string; title: string; excerpt: string; date: string; iso: string;
  category: string; event: EventoNews; chi: Chi; image: string; imageAlt: string;
  tipo: 'comunicato stampa' | 'aggiornamento';
  lead: string; credito: string; corpo: Blocco[];
  cta?: { label: string; href: string; esterno?: boolean }; cta2?: { label: string; href: string };
};

export const posts: Post[] = [
  { slug: 'rally-colli-euganei-tutte-le-informazioni', title: 'Il motorsport ritorna nel Padovano', excerpt: 'La nuova gara organizzata da Inversione A U riporta i rally nel Padovano dopo 37 anni. Il percorso, gli orari e le date da segnare.',
    date: '28 OTT 2026', iso: '2026-10-28', category: 'Rally', event: 'Rally Colli Euganei', chi: 'Per il pubblico e per i concorrenti', image: rallyImg(RALLY_IMG.newsUfficiale, 1600, 1067), imageAlt: 'La targa del 1° Rally Colli Euganei 2026 su una strada dei Colli Euganei in autunno', tipo: 'comunicato stampa',
    lead: 'Il 1° Rally Colli Euganei si corre sabato 21 e domenica 22 novembre 2026 sulle strade dei Colli Euganei. Il percorso, il programma del fine settimana e le scadenze per i concorrenti.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'html', html: `<p><strong>Teolo (PD), 28 ottobre 2026</strong> — Dopo 37 anni di attesa, i rally tornano a Padova. Succederà sabato 21 e domenica 22 novembre, quando prenderà vita il 1° Rally Colli Euganei organizzato dalla neonata Inversione A U A.S.D., associazione composta da giovani appassionati che vivono e operano sul territorio dei colli.</p><p>Dopo un lungo e certosino lavoro preparatorio, volto a garantire il divertimento e soprattutto la sicurezza agli equipaggi che parteciperanno e al pubblico che assisterà alla gara, la corsa automobilistica è ormai pronta a entrare nel suo vivo. Le iscrizioni si sono aperte giovedì 22 ottobre e si chiuderanno lunedì 16 novembre alle 23:59. Pochi giorni dopo verrà pubblicato l’elenco iscritti e venerdì 20 novembre, dalle 18:00 alle 22:00, gli equipaggi saranno attesi al Rally Village di Piazza Mercato, a Treponti, per il ritiro del road book e il controllo dei documenti sportivi.</p><h2>Sabato 21: ricognizioni, verifiche e shakedown</h2><p>Nella giornata di sabato 21, fra le 7:20 e le 11:20, gli equipaggi effettueranno le ricognizioni delle prove speciali con vetture di serie: dovranno rispettare il Codice della strada. Verifiche sportive e tecniche si svolgeranno entrambe al Rally Village di Piazza Mercato, a Treponti: le sportive dalle 11:00 alle 13:00 per gli equipaggi iscritti allo shakedown e dalle 13:00 alle 15:00 per tutti gli altri, le tecniche dalle 11:30 alle 13:30 e dalle 13:30 alle 15:30. Nella stessa sede e negli stessi orari vengono distribuiti targhe e numeri di gara.</p><p>L’azione scatta alle 13:00, quando inizierà lo shakedown: piloti e navigatori sfrutteranno la prima prova speciale dell’indomani per provare le proprie vetture da gara, fino alle 16:45. Alle 16:30 escono in albo di gara l’elenco dei verificati e l’ordine di partenza; dalle 17:30 le vetture si incolonnano verso il palco di Piazza Mercato, dove alle 18:30 si tiene la cerimonia di presentazione degli equipaggi.</p><h2>Domenica 22: si corre</h2><p>La gara scatterà ufficialmente alle 7:30 di domenica 22 novembre, quando la prima vettura uscirà dal parco assistenza allestito nella zona industriale di Selve di Teolo per dirigersi verso la prima prova speciale. I tratti cronometrati saranno due, da ripetere per tre volte: si inizia con la prova di Teolo (3,00 km) per proseguire con la Roccolo-Cingolina (4,12 km), per un totale di 21,36 km contro il tempo sui 109,26 km complessivi del percorso.</p><p>Al termine dei primi due giri di prove speciali, piloti e navigatori saranno chiamati a presentarsi al riordino di Piazza Mercato a Treponti e quindi all’assistenza di Selve di Teolo, prima di ripartire. L’arrivo della prima vettura è previsto alle 16:15 in via Alcide De Gasperi, a Treponti, con pedana di arrivo e premiazioni alle 16:30 in Piazza Mercato.</p><dl><dt>Data</dt><dd>21–22 novembre 2026</dd><dt>Dove</dt><dd>Colli Euganei, provincia di Padova</dd><dt>Formula</dt><dd>Rally Sprint · a calendario ACI Sport</dd><dt>Prove speciali</dt><dd>2 prove, 3 passaggi ciascuna</dd><dt>Km cronometrati</dt><dd>21,36 km</dd><dt>Chiusura iscrizioni</dt><dd>16 novembre 2026, ore 23:59</dd><dt>Ingresso</dt><dd>Libero</dd></dl><p>Programma completo, zone del pubblico e orari di chiusura delle strade sono nella pagina spettatori; moduli, scadenze e albo di gara nell’<a href="/rally-colli-euganei/concorrenti/">area concorrenti</a>.</p><p>Ufficio stampa del 1° Rally Colli Euganei: Niccolò Budoia · <a href="mailto:rallycollieuganei@gmail.com">rallycollieuganei@gmail.com</a>.</p>` } ],
    cta: { label: 'Apri la pagina del rally', href: '/rally-colli-euganei/' }, cta2: { label: 'Area concorrenti', href: '/rally-colli-euganei/concorrenti/' } },
  { slug: 'rally-colli-euganei-ufficiale', title: 'Il 1° Rally Colli Euganei: 21–22 novembre', excerpt: 'Formula Rally Sprint, due prove speciali con tre passaggi ciascuna, 21,36 km cronometrati. Dopo più di 35 anni un rally torna nel Padovano.',
    date: '28 AGO 2026', iso: '2026-08-28', category: 'Rally', event: 'Rally Colli Euganei', chi: 'Per il pubblico', image: rallyImg(RALLY_IMG.newsUfficiale, 1600, 1067), imageAlt: rallyAlt(RALLY_IMG.newsUfficiale), tipo: 'comunicato stampa',
    lead: 'Il 1° Rally Colli Euganei ACI Sport si corre il 21 e 22 novembre 2026 sulle strade dei Colli Euganei. Gara a cronometro su strade chiuse, ingresso libero per il pubblico.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'html', html: `<p>Il 1° Rally Colli Euganei ACI Sport si corre <strong>sabato 21 e domenica 22 novembre 2026</strong>, sulle strade dei Colli Euganei, in provincia di Padova. Lo organizza Inversione A U A.S.D. Dopo più di trentacinque anni un rally torna a correre nel Padovano.</p>
<p>Non è una rievocazione e non è un raduno: è una gara a cronometro su strade chiuse al traffico, con licenze, ufficiali di gara, classifica e regolamento particolare depositato.</p>
<h2>La formula</h2>
<p>ACI Sport ha iscritto la manifestazione a calendario nella formula del <strong>Rally Sprint</strong>: poche prove speciali ripetute più volte, tutte nella stessa area, invece di una gara distesa su lunghi trasferimenti. Il sabato è dedicato alle verifiche sportive e tecniche e allo shakedown; la gara si corre la domenica.</p>
<p>Il percorso prevede <strong>due prove speciali con tre passaggi ciascuna</strong>: sei tratti cronometrati, per 21,36 chilometri contro il tempo, su 109,26 km di percorso totale. Tracciato, chilometraggi e orari di passaggio della prima vettura sono pubblicati nella pagina del percorso e nell’albo di gara.</p>
<h2>Dove si corre</h2>
<p>Si corre dentro un parco regionale: 18.694 ettari su quindici comuni, un centinaio di rilievi di origine vulcanica in mezzo alla pianura. È un contesto che impone delle regole, e le abbiamo scritte per tempo: strade chiuse solo per le ore necessarie, zone pubblico delimitate e presidiate dai commissari, nessun fuoco e nessun fumogeno lungo il percorso, rispetto di vigne, coltivi e proprietà private.</p>
<p>Chi abita o lavora sulle strade interessate trova nella pagina dedicata ai residenti gli orari di chiusura, cosa succede il giorno di gara e un contatto diretto per le necessità particolari. Chiediamo di segnalarle prima, non la mattina della gara: quasi tutto si risolve con una telefonata fatta per tempo.</p>
<h2>Per i concorrenti</h2>
<p>Le iscrizioni aprono il 22 ottobre 2026 alle 23:59 e chiudono il 16 novembre alle 23:59. I moduli sono nell'<a href="/rally-colli-euganei/concorrenti/">area concorrenti</a> e nell'<a href="/rally-colli-euganei/documenti/">albo di gara</a>.</p>
<p>Licenze ammesse, vetture e requisiti seguono le disposizioni ACI Sport per questo evento: la validità della propria licenza si verifica sul <a href="https://www.acisport.it/it/acisport" target="_blank" rel="noopener">sito ACI Sport</a>. Il resto — scheda gara, scadenze, documenti in evidenza, elenco iscritti — è nell'<a href="/rally-colli-euganei/concorrenti/">area concorrenti</a>.</p>
<h2>Per il pubblico</h2>
<p>L'ingresso è libero. Le zone da cui si assiste alla gara sono scelte dall'organizzazione, delimitate e presidiate, con un accesso a piedi e un punto dove lasciare l'auto: vengono pubblicate insieme alla mappa del percorso. Programma, regole di sicurezza e come arrivare sono nella pagina spettatori.</p>
<dl>
<dt>Data</dt><dd>21–22 novembre 2026</dd>
<dt>Dove</dt><dd>Colli Euganei, provincia di Padova</dd>
<dt>Formula</dt><dd>Rally Sprint · a calendario ACI Sport</dd>
<dt>Prove speciali</dt><dd>2 prove, 3 passaggi ciascuna</dd>
<dt>Km cronometrati</dt><dd>21,36 km</dd>
<dt>Ingresso</dt><dd>Libero</dd>
</dl>
<p>Informazioni sulla gara: <a href="mailto:rallycollieuganei@gmail.com">rallycollieuganei@gmail.com</a> · organizzazione: <a href="mailto:inversione.au3@gmail.com">inversione.au3@gmail.com</a>.</p>` } ],
    cta: { label: 'Apri la pagina del rally', href: '/rally-colli-euganei/' } },
  { slug: 'polo-motor-show-2026-numeri', title: 'Polo Motor Show 2026: i numeri dell’edizione', excerpt: 'Due giorni di drift, rally show e raduno a Selve di Teolo. Il resoconto.',
    date: '18 GIU 2026', iso: '2026-06-18', category: 'Polo Motor Show', event: 'Polo Motor Show', chi: 'Per il pubblico', image: '/foto/polo_sierra_fina_drift.jpg', imageAlt: '', tipo: 'comunicato stampa',
    lead: 'Oltre 10.000 spettatori, circa 100 equipaggi in pista, più di 400 auto esposte: i numeri dell’edizione 2026 del Polo Motor Show.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'p', html: 'Le foto ufficiali sono nella <a href="/foto-e-video/polo-motor-show-2026/">galleria dell’edizione</a>. L’edizione 2027 è in preparazione.' } ],
    cta: { label: 'Guarda le foto', href: '/foto-e-video/polo-motor-show-2026/' } },
  { slug: 'foto-ufficiali-polo-motor-show-2026', title: 'Le foto ufficiali del Polo Motor Show', excerpt: 'Gli scatti dei fotografi accreditati, liberi per la stampa con credit.',
    date: '15 GIU 2026', iso: '2026-06-15', category: 'Polo Motor Show', event: 'Polo Motor Show', chi: 'Per il pubblico', image: '/foto/polo_e30_verde_rally.jpg', imageAlt: '', tipo: 'aggiornamento',
    lead: 'La galleria ufficiale dell’edizione 2026 è online. Le foto sono libere per la stampa con il credit indicato.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'p', html: 'Per il materiale in alta risoluzione: <a href="/stampa/">area stampa</a>.' } ],
    cta: { label: 'Apri la galleria', href: '/foto-e-video/polo-motor-show-2026/' } },
  { slug: 'legnaro-motori-prima-edizione', title: 'Legnaro Motori, la prima volta', excerpt: 'Drift e raduno per la prima edizione. Le foto ufficiali della giornata.',
    date: '20 MAR 2026', iso: '2026-03-20', category: 'Legnaro Motori', event: 'Legnaro Motori', chi: 'Per il pubblico', image: '/foto/legnaro_verde_traverso.jpg', imageAlt: '', tipo: 'comunicato stampa',
    lead: 'Domenica 15 marzo 2026 si è svolta la prima edizione di Legnaro Motori: una giornata di drift e raduno in un’unica area.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'p', html: 'Le foto ufficiali sono nella <a href="/foto-e-video/legnaro-motori-2026/">galleria della giornata</a>. La seconda edizione è in preparazione.' } ],
    cta: { label: 'Guarda le foto', href: '/foto-e-video/legnaro-motori-2026/' } },
  { slug: 'calendario-2026', title: 'Il calendario 2026 di Inversione A U', excerpt: 'Tre eventi: Legnaro Motori, Polo Motor Show e il ritorno del rally.',
    date: '10 GEN 2026', iso: '2026-01-10', category: 'Associazione', event: 'Associazione', chi: 'Per il pubblico', image: '/foto/bmw_m3_e30_fumo.jpg', imageAlt: '', tipo: 'comunicato stampa',
    lead: 'Tre eventi in provincia di Padova: Legnaro Motori il 15 marzo, Polo Motor Show il 13 e 14 giugno, 1° Rally Colli Euganei il 21 e 22 novembre.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'p', html: 'Il calendario completo è nella <a href="/eventi/">pagina eventi</a>.' } ],
    cta: { label: 'Vedi il calendario', href: '/eventi/' } },
  { slug: 'tesseramento-2026', title: 'Tesseramento 2026 aperto', excerpt: 'Come tesserarsi e sostenere l’attività dell’associazione.',
    date: '02 GEN 2026', iso: '2026-01-02', category: 'Associazione', event: 'Associazione', chi: 'Per il pubblico', image: '/foto/inversione_au_e36_hay.jpg', imageAlt: '', tipo: 'aggiornamento',
    lead: 'Il tesseramento 2026 è aperto: nuovo tesseramento o rinnovo. La tessera vale per l’anno solare.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'p', html: 'Come si richiede la tessera e cosa comprende: <a href="/associazione/#tesseramento">pagina dell’associazione</a>.' } ],
    cta: { label: 'Richiedi la tessera', href: '/associazione/#tesseramento' } },
];

const rank: Record<EventoNews, number> = { 'Rally Colli Euganei': 0, 'Polo Motor Show': 1, 'Legnaro Motori': 2, 'Associazione': 3 };
export const postsOrdinati = () => [...posts].sort((a, b) => rank[a.event] - rank[b.event] || (a.iso < b.iso ? 1 : -1));
export const postsRecenti = (n = 3) => [...posts].sort((a, b) => (a.iso < b.iso ? 1 : -1)).slice(0, n);
export const getPost = (slug: string) => posts.find(p => p.slug === slug) ?? null;
export const eventoKey = (e: EventoNews) => ({ 'Rally Colli Euganei': 'rally', 'Polo Motor Show': 'polo', 'Legnaro Motori': 'legnaro', 'Associazione': '' }[e]);
