#!/usr/bin/env node
/**
 * Loghi e livelli degli sponsor nel CMS.
 *
 * Fa tre cose, in quest'ordine:
 *   1. carica nel Media Manager i file nuovi indicati in LAVORI (campo `file`);
 *   2. sistema le righe della collection `Sponsor`: logo, livello, url.
 *      Una riga che non esiste viene creata; una che esiste viene aggiornata
 *      (è il caso dello sponsor di evento promosso a partner di stagione);
 *      senza `file` il logo già caricato resta quello che è;
 *   3. rinumera il campo `ordine` di TUTTI i partner di stagione seguendo
 *      ORDINE_STAGIONE: è l'ordine con cui compaiono in home, su /sponsor e
 *      negli hub evento. I primi quattro sono i partner principali, che nelle
 *      griglie di home e /sponsor occupano una cella doppia.
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale (NON dal watcher):
 *   cd ~/Desktop/INVERSIONE_AU/NUOVO_SITO_INVERSIONE_AU/SITO_WIX
 *   node scripts/carica-loghi-sponsor.mjs           → simulazione: non scrive nulla
 *   node scripts/carica-loghi-sponsor.mjs --run     → carica i file e scrive nel CMS
 *
 * La simulazione stampa anche l'inventario completo della collection.
 * Resoconto sempre in .trigger/loghi-report.txt (che leggo io dalla sessione).
 * Le credenziali arrivano da .env.local e non escono da qui.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const RUN = process.argv.includes('--run');
const API = 'https://www.wixapis.com';

/* ---------- cosa fare ----------
 * file:    nome del PNG dentro CARTELLA_FILE. Si può omettere: in quel caso il logo
 *          già presente nel Media Manager resta invariato e si cambia solo il livello
 * nome:    valore del campo `nome` nella collection Sponsor. Se non esiste, la riga viene creata
 * livello: 'stagione' = partner annuale (home, fascia sotto la hero, /sponsor, ogni hub evento)
 *          qualsiasi altro valore = sponsor del solo evento indicato in `evento`
 *          si può omettere: il livello resta quello che è
 * attivo:  false toglie il logo dal sito senza cancellare la riga (si rimette con true,
 *          anche dal pannello Wix). È il modo per sospendere uno sponsor
 * evento:  solo per le righe nuove: 'rally', 'polo', 'legnaro' (anche più d'uno separato da spazio)
 * url:     sito da linkare, o null per lasciare il campo vuoto
 * L'ordine non si mette qui: lo decide ORDINE_STAGIONE.
 */
const LAVORI = [
  /* Applicati il 17/10/2026: Zanon e Euganeus 2000 creati, Abano Ghiaccio e
     Locanda al Colle promossi da sponsor Polo a partner di stagione.
     Rimetterli qui li farebbe ricaricare da capo: si lascia l'elenco pulito. */
  { nome: 'Gruppo S2 Automobili', attivo: false },
  /* Nuovi partner di stagione del 20/10/2026, loghi ricaricati nel pomeriggio.
     ATTENZIONE: la fascia sponsor ha il fondo NERO (.spb__cell{background:var(--nero)} in
     SponsorBlock.astro, e nessuna pagina passa `light`). I loghi bianchi su trasparente
     sono quelli giusti e non vanno ricolorati: una prima versione nera di Trivellato era
     invisibile. Dei file qui sotto si fa solo il ritaglio sull'alfa, mai un ritocco. */
  { file: 'TRIVELLATO_NEW_PADOVA_STAR.png', nome: 'Trivellato New Padova Star', livello: 'stagione', evento: 'rally' },
  { file: 'CONCA_DORO_SITO.png', nome: "Pizzeria Conca d'Oro", livello: 'stagione', evento: 'rally' },
];

/** Ordine dei partner di stagione. I primi quattro sono i partner principali.
 *  Le righe sospese (attivo: falso) non entrano nella numerazione.
 *  Un nome senza riga di livello "stagione" attiva viene semplicemente saltato;
 *  una riga "stagione" non elencata qui finisce in coda. */
const ORDINE_STAGIONE = [
  'Datex', 'Cesaro Group', 'Gemini Carrozzeria', 'Zanon',
  'BAAP Bergamaschi', 'Rally Team', 'Ctrl+G',
  'Sky Motors', 'Metal Nord Rottami', 'Ecosider', 'Siderurgica Veneta',
  'Labor F.lli Corazzari', 'Marchioro Scavi e Demolizioni', 'Dealernet',
  'Bull Barber', 'Bar Café Noir',
  // 'Gruppo S2 Automobili' — sospeso il 17/10/2026: riattivandolo torna qui
  'Gruppo S2 Automobili',
  'Abano Ghiaccio', 'Locanda al Colle', 'Euganeus 2000',
  'Trivellato New Padova Star', "Pizzeria Conca d'Oro",
];

const CARTELLA_FILE = '/Users/fabio/Desktop/INVERSIONE_AU/NUOVO_SITO_INVERSIONE_AU/LOGHI/ANNUALI';
/** Un logo già nel Media Manager: serve solo a ricavare la cartella di destinazione. */
const RIFERIMENTO = '2be2d6_1ebd26445925405e84ac71f6cc564375~mv2.png';

/* ---------- credenziali ---------- */
const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '';
const leggi = (k) => (env.match(new RegExp('^' + k + '=("?)([^"\n]+)\\1', 'm')) || [])[2] || '';
const clientId = leggi('WIX_CLIENT_ID');
const clientSecret = leggi('WIX_CLIENT_SECRET');
if (!clientId || !clientSecret) { console.error('Mancano WIX_CLIENT_ID / WIX_CLIENT_SECRET in .env.local'); process.exit(1); }

const righe = [];
const log = (s = '') => { righe.push(s); console.log(s); };
function salva() {
  if (!existsSync('.trigger')) mkdirSync('.trigger');
  writeFileSync('.trigger/loghi-report.txt', righe.join('\n') + '\n');
}
/** Confronto dei nomi tollerante: ignora maiuscole, accenti e spazi doppi, così
 *  «Bar Café Noir» ritrova una riga scritta «Bar Cafe Noir» invece di fare un doppione. */
const chiave = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/* ---------- API ---------- */
let TOKEN = '', SCHEMA = 'Bearer ';
async function token() {
  const r = await fetch(`${API}/oauth2/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret, grantType: 'client_credentials' }),
  });
  const t = await r.text();
  if (!r.ok) { log(`ERRORE token ${r.status}: ${t.slice(0, 300)}`); salva(); process.exit(1); }
  TOKEN = JSON.parse(t).access_token;
}
async function api(path, body, metodo = 'POST') {
  for (const schema of [SCHEMA, SCHEMA === 'Bearer ' ? '' : 'Bearer ']) {
    const r = await fetch(API + path, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', Authorization: schema + TOKEN },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (r.status === 401 || r.status === 403) { SCHEMA = schema === 'Bearer ' ? '' : 'Bearer '; continue; }
    const t = await r.text();
    return { ok: r.ok, status: r.status, corpo: t };
  }
  return { ok: false, status: 401, corpo: 'autenticazione rifiutata con e senza "Bearer"' };
}
const idDi = (riga) => riga.id ?? riga.data?._id;

/* ---------- dimensioni reali di un PNG (senza dipendenze) ---------- */
function dimensioniPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('non è un PNG');
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/* ---------- esecuzione ---------- */
log(`Loghi sponsor — ${RUN ? 'ESECUZIONE' : 'simulazione (nessuna scrittura)'} — ${new Date().toLocaleString('it-IT')}`);
log('');

await token();

// 1 · cartella di destinazione, ricavata da un logo già caricato
const rif = await api(`/site-media/v1/files/${encodeURIComponent(RIFERIMENTO)}`, undefined, 'GET');
if (!rif.ok) { log(`ERRORE lettura file di riferimento (${rif.status}): ${rif.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const desc = JSON.parse(rif.corpo).file ?? JSON.parse(rif.corpo);
const cartella = desc.parentFolderId;
log(`Cartella di destinazione: ${cartella}  (dedotta da ${desc.displayName ?? RIFERIMENTO})`);

// 2 · righe Sponsor
const q = await api('/wix-data/v2/items/query', { dataCollectionId: 'Sponsor', query: { paging: { limit: 300 }, sort: [{ fieldName: 'ordine' }] }, returnTotalCount: false });
if (!q.ok) { log(`ERRORE lettura collection Sponsor (${q.status}): ${q.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const items = JSON.parse(q.corpo).dataItems ?? [];
log(`Collection Sponsor: ${items.length} righe · ${items.filter(i => i.data?.livello === 'stagione').length} partner di stagione`);
log('');
log('Inventario attuale (ordine · livello · evento · nome):');
for (const i of items) {
  const d = i.data ?? {};
  log(`  ${String(d.ordine ?? '').padStart(3)} · ${(d.livello ?? '').padEnd(9)} · ${(d.evento || '-').padEnd(14)} · ${d.nome}${d.attivo === false ? '   [NON ATTIVO]' : ''}`);
}
log('');

/* ---------- 3 · lavori: file, livello, url ---------- */
let fatti = 0;
for (const L of LAVORI) {
  log(`— ${L.nome}`);
  const riga = items.find(i => chiave(i.data?.nome) === chiave(L.nome));
  let buf = null, w = 0, h = 0;

  if (L.file) {
    const percorso = `${CARTELLA_FILE}/${L.file}`;
    if (!existsSync(percorso)) { log(`  ! file mancante: ${percorso}`); continue; }
    buf = readFileSync(percorso);
    ({ w, h } = dimensioniPng(buf));
    log(`  file: ${basename(percorso)} · ${w}×${h} px · ${(buf.length / 1024).toFixed(0)} KB`);
  } else if (riga) {
    log('  nessun file nuovo: resta il logo già caricato');
  } else {
    log('  ! riga inesistente e nessun file: serve il logo per crearla');
    continue;
  }

  const livello = L.livello ?? riga?.data?.livello;
  const attivo = L.attivo ?? riga?.data?.attivo ?? true;
  if (riga) log(`  riga esistente: livello "${riga.data.livello}" · evento "${riga.data.evento ?? ''}" → livello "${livello}"${L.attivo === false ? ' · SOSPESA (attivo: falso)' : ''}${L.attivo === true ? ' · riattivata' : ''}`);
  else      log(`  nessuna riga con questo nome: verrà creata (livello "${livello}")`);

  if (!RUN) {
    log('  → in esecuzione aggiornerebbe il CMS' + (L.file ? ' e caricherebbe il file' : ''));
    // in simulazione il cambio resta solo qui dentro, così l'ordine stampato sotto è quello vero
    if (riga) riga.data = { ...riga.data, livello, attivo };
    else items.push({ id: '(nuova)', data: { nome: L.nome, livello, attivo, ordine: 900 } });
    continue;
  }

  let logo = riga?.data?.logo;
  if (buf) {
    // 3a · indirizzo di caricamento
    const gen = await api('/site-media/v1/files/generate-upload-url', { mimeType: 'image/png', fileName: L.file, parentFolderId: cartella });
    if (!gen.ok) {
      log(`  ! generate-upload-url fallita (${gen.status}): ${gen.corpo.slice(0, 300)}`);
      if (gen.status === 403) log("    (l'app OAuth non ha i permessi sul Media Manager: carica i file dal pannello Wix, cartella sito-loghi-sponsor, e avvisami)");
      continue;
    }
    const u = new URL(JSON.parse(gen.corpo).uploadUrl); u.searchParams.set('filename', L.file);

    // 3b · caricamento binario
    const up = await fetch(u, { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: buf });
    const upTesto = await up.text();
    if (!up.ok) { log(`  ! caricamento fallito (${up.status}): ${upTesto.slice(0, 300)}`); continue; }
    const f = JSON.parse(upTesto).file ?? JSON.parse(upTesto);
    const fileId = f.id ?? f.fileId;
    if (!fileId) { log(`  ! risposta senza id file: ${upTesto.slice(0, 300)}`); continue; }
    log(`  caricato nel Media Manager: ${fileId}`);
    // 3c · riferimento immagine nel formato usato dalle altre righe
    logo = `wix:image://v1/${fileId}/${L.file}#originWidth=${w}&originHeight=${h}`;
  }

  // 3d · scrittura nel CMS. Il PUT sostituisce la riga: si riscrivono tutti i campi.
  let esito;
  if (riga) {
    const data = { ...riga.data, logo, livello, attivo };
    if (L.url) data.url = L.url;
    esito = await api(`/wix-data/v2/items/${idDi(riga)}`, { dataCollectionId: 'Sponsor', dataItem: { id: idDi(riga), data } }, 'PUT');
    if (esito.ok) riga.data = data;
  } else {
    const data = { nome: L.nome, logo, livello, ordine: 900, attivo, evento: L.evento ?? '' };
    if (L.url) data.url = L.url;
    esito = await api('/wix-data/v2/items', { dataCollectionId: 'Sponsor', dataItem: { data } });
    if (esito.ok) {
      const creata = JSON.parse(esito.corpo).dataItem ?? JSON.parse(esito.corpo);
      items.push({ id: creata.id ?? creata.data?._id, data: creata.data ?? data });
    }
  }
  if (!esito.ok) { log(`  ! scrittura nel CMS fallita (${esito.status}): ${esito.corpo.slice(0, 300)}`); continue; }
  log(`  riga ${riga ? 'aggiornata' : 'creata'}: livello "${livello}" · attivo ${attivo}${buf ? ' · logo nuovo' : ''}`);
  fatti++;
}

/* ---------- 4 · riordino dei partner di stagione ---------- */
log('');
log('Ordine dei partner di stagione:');
const stagione = items.filter(i => i.data?.livello === 'stagione' && i.data?.attivo !== false);
const elencati = ORDINE_STAGIONE.map(n => stagione.find(i => chiave(i.data?.nome) === chiave(n))).filter(Boolean);
const restanti = stagione.filter(i => !elencati.includes(i)).sort((a, b) => (Number(a.data?.ordine) || 0) - (Number(b.data?.ordine) || 0));
const mancanti = ORDINE_STAGIONE.filter(n => !stagione.some(i => chiave(i.data?.nome) === chiave(n)));

let n = 0, riordinate = 0;
for (const riga of [...elencati, ...restanti]) {
  n++;
  const prima = Number(riga.data?.ordine);
  const segno = n <= 4 ? '★' : ' ';
  const coda = restanti.includes(riga) ? '   [non in elenco: finisce in coda]' : '';
  if (prima === n) { log(`  ${segno} ${String(n).padStart(2)} · ${riga.data.nome}${coda}`); continue; }
  log(`  ${segno} ${String(n).padStart(2)} · ${riga.data.nome}   (era ${prima})${coda}`);
  if (!RUN) { riordinate++; continue; }
  const data = { ...riga.data, ordine: n };
  const esito = await api(`/wix-data/v2/items/${idDi(riga)}`, { dataCollectionId: 'Sponsor', dataItem: { id: idDi(riga), data } }, 'PUT');
  if (!esito.ok) { log(`     ! riordino fallito (${esito.status}): ${esito.corpo.slice(0, 200)}`); continue; }
  riga.data = data; riordinate++;
}
if (mancanti.length) log(`  Nomi in ORDINE_STAGIONE senza riga di livello "stagione": ${mancanti.join(', ')}`);
log(`  ★ = partner principale (cella doppia in home e su /sponsor)`);

log('');
log(RUN ? `Fatto: ${fatti} riga/righe su ${LAVORI.length} · ${riordinate} posizioni sistemate.` : `Simulazione conclusa: ${LAVORI.length} righe da sistemare, ${riordinate} posizioni da cambiare. Rilancia con --run per applicare.`);
log('Il sito legge il CMS con una cache di 5 minuti: la modifica compare entro pochi minuti, senza release.');
salva();
