/** News — FASE 4: collection CMS "News". Ordine: per evento (rally, polo, legnaro, associazione) e data decrescente. */
export type Chi = 'Per il pubblico' | 'Per i concorrenti';
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
  { slug: 'iscrizioni-aperte-rally-colli-euganei', title: 'Aperte le iscrizioni al 1° Rally Colli Euganei', excerpt: 'Regolamento e modulistica nell’albo di gara. Chiusura delle iscrizioni da confermare.',
    date: '25 SET 2026', iso: '2026-09-25', category: 'Rally', event: 'Rally Colli Euganei', chi: 'Per i concorrenti', image: '/foto/fabia_skoda_bosco_02.jpg', imageAlt: '', tipo: 'comunicato stampa',
    lead: 'Da oggi i concorrenti possono iscriversi alla prima edizione, in programma il 21 e 22 novembre 2026. Le iscrizioni chiudono in una data ancora da confermare.', credito: 'Foto: archivio Inversione A U',
    corpo: [
      { t: 'p', html: "Il 1° Rally Colli Euganei apre le iscrizioni. La gara si corre il 21 e 22 novembre 2026, con partenza e arrivo a Teolo e tre prove speciali tra Castelnuovo, Galzignano Terme e Teolo. È il ritorno di un rally su queste strade dopo più di trent'anni." },
      { t: 'h2', testo: 'Come iscriversi' },
      { t: 'p', html: "Il modulo d'iscrizione, il regolamento particolare di gara e il programma sono pubblicati nell'<a href=\"/rally-colli-euganei/documenti/\">albo di gara digitale</a>. Le domande vanno inviate complete di tutti gli allegati." },
      { t: 'p', html: "Il numero massimo di vetture ammesse è ancora da confermare. Fa fede l'ordine di ricezione delle domande complete." },
      { t: 'h2', testo: 'Chi può partecipare' },
      { t: 'p', html: 'La gara ha titolazione ACI Sport ed è aperta alle vetture moderne dalle Rally2 alle Rally5 e alle vetture storiche in regolarità sport.' },
      { t: 'p', html: 'Servono licenza e tessera in corso di validità per il pilota e per il navigatore. I requisiti completi sono nel regolamento particolare di gara.' },
      { t: 'quote', testo: "«Riportare un rally su queste strade dopo più di trent'anni è il motivo per cui è nata l'associazione. Ora tocca ai concorrenti.»", cite: 'Il direttivo di Inversione A U' },
      { t: 'h2', testo: 'Le date da segnare' },
      { t: 'dl', righe: [['Apertura iscrizioni', '25 SET 2026'], ['Chiusura iscrizioni', 'Da confermare'], ['Ricognizioni', 'Da confermare'], ['Gara', '21–22 NOV 2026']] },
      { t: 'p', html: 'Per informazioni: <a href="mailto:inversione.au3@gmail.com">inversione.au3@gmail.com</a>.' },
    ],
    cta: { label: 'Vai alla pagina concorrenti', href: '/rally-colli-euganei/concorrenti/' }, cta2: { label: 'Scarica i documenti di gara', href: '/rally-colli-euganei/documenti/' } },
  { slug: 'rally-zone-pubblico', title: 'Zone pubblico: dove vedere il rally', excerpt: 'Le aree consigliate lungo le tre prove speciali, con parcheggi e orari.',
    date: '03 LUG 2026', iso: '2026-07-03', category: 'Rally', event: 'Rally Colli Euganei', chi: 'Per il pubblico', image: '/foto/polo_pubblico_sera.jpg', imageAlt: '', tipo: 'aggiornamento',
    lead: 'Le zone pubblico del 1° Rally Colli Euganei saranno pubblicate dopo l’omologazione del percorso, entro il 30 settembre 2026. Intanto, come funzionano.', credito: 'Foto: Inversione A U',
    corpo: [
      { t: 'p', html: 'Le zone pubblico sono aree scelte dall’organizzazione, delimitate e presidiate dai commissari. Hanno buona visuale, un percorso di accesso a piedi e un parcheggio indicato.' },
      { t: 'p', html: 'Tutte le informazioni per chi viene a vedere la gara — programma, regole di sicurezza, come arrivare — sono nella <a href="/rally-colli-euganei/spettatori/">pagina spettatori</a>.' },
    ], cta: { label: 'Apri le informazioni per il pubblico', href: '/rally-colli-euganei/spettatori/' } },
  { slug: 'rally-ricognizioni-date-regole', title: 'Ricognizioni: date e regole', excerpt: 'Due passaggi per prova speciale, velocità da codice della strada.',
    date: '28 GIU 2026', iso: '2026-06-28', category: 'Rally', event: 'Rally Colli Euganei', chi: 'Per i concorrenti', image: '/foto/fabia_skoda_bosco.jpg', imageAlt: '', tipo: 'aggiornamento',
    lead: 'Le ricognizioni del percorso si svolgono nelle date indicate nel programma di gara, con due passaggi per prova speciale e velocità da codice della strada.', credito: 'Foto: archivio Inversione A U',
    corpo: [ { t: 'p', html: 'Le date confermate vengono pubblicate nell’<a href="/rally-colli-euganei/documenti/">albo di gara</a> insieme al regolamento particolare.' } ],
    cta: { label: 'Apri l’albo di gara', href: '/rally-colli-euganei/documenti/' } },
  { slug: 'rally-colli-euganei-ufficiale', title: 'Il 1° Rally Colli Euganei è ufficiale: 21–22 novembre', excerpt: 'Titolazione ACI Sport confermata. Percorso in fase di approvazione e omologazione.',
    date: '12 LUG 2026', iso: '2026-07-12', category: 'Rally', event: 'Rally Colli Euganei', chi: 'Per il pubblico', image: '/foto/fabia_skoda_bosco_02.jpg', imageAlt: '', tipo: 'comunicato stampa',
    lead: 'Il 1° Rally Colli Euganei ACI Sport si correrà il 21 e 22 novembre 2026. Percorso in fase di approvazione; iscrizioni in apertura in autunno.', credito: 'Foto: archivio Inversione A U',
    corpo: [ { t: 'p', html: 'Tutte le informazioni sono nella <a href="/rally-colli-euganei/">pagina del rally</a>: concorrenti, spettatori, percorso e documenti di gara.' } ],
    cta: { label: 'Apri la pagina del rally', href: '/rally-colli-euganei/' } },
  { slug: 'polo-motor-show-2026-numeri', title: 'Polo Motor Show 2026: i numeri dell’edizione', excerpt: 'Due giorni di drift, rally show e raduno a Selve di Teolo. Il resoconto.',
    date: '18 GIU 2026', iso: '2026-06-18', category: 'Polo Motor Show', event: 'Polo Motor Show', chi: 'Per il pubblico', image: '/foto/polo_sierra_fina_drift.jpg', imageAlt: '', tipo: 'comunicato stampa',
    lead: 'Oltre 15.000 spettatori, circa 100 equipaggi in pista, più di 300 auto esposte: i numeri dell’edizione 2026 del Polo Motor Show.', credito: 'Foto: Inversione A U',
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
  { slug: 'tesseramento-2026', title: 'Tesseramento 2026 aperto', excerpt: 'Come diventare socio e sostenere l’attività dell’associazione.',
    date: '02 GEN 2026', iso: '2026-01-02', category: 'Associazione', event: 'Associazione', chi: 'Per il pubblico', image: '/foto/inversione_au_e36_hay.jpg', imageAlt: '', tipo: 'aggiornamento',
    lead: 'Il tesseramento 2026 è aperto: socio ordinario, socio operativo o sostenitore. La tessera vale per l’anno solare.', credito: 'Foto: Inversione A U',
    corpo: [ { t: 'p', html: 'Come si richiede la tessera e cosa comprende: <a href="/associazione/#tesseramento">pagina dell’associazione</a>.' } ],
    cta: { label: 'Richiedi la tessera', href: '/associazione/#tesseramento' } },
];

const rank: Record<EventoNews, number> = { 'Rally Colli Euganei': 0, 'Polo Motor Show': 1, 'Legnaro Motori': 2, 'Associazione': 3 };
export const postsOrdinati = () => [...posts].sort((a, b) => rank[a.event] - rank[b.event] || (a.iso < b.iso ? 1 : -1));
export const postsRecenti = (n = 3) => [...posts].sort((a, b) => (a.iso < b.iso ? 1 : -1)).slice(0, n);
export const getPost = (slug: string) => posts.find(p => p.slug === slug) ?? null;
export const eventoKey = (e: EventoNews) => ({ 'Rally Colli Euganei': 'rally', 'Polo Motor Show': 'polo', 'Legnaro Motori': 'legnaro', 'Associazione': '' }[e]);
