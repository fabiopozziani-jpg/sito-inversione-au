#!/usr/bin/env node
/**
 * Carica uno o più loghi nel Media Manager (cartella dei loghi sponsor) e sistema
 * le righe della collection `Sponsor`: logo, livello, ordine, url.
 *
 * Se non esiste una riga con quel nome, lo sponsor è nuovo e la riga viene creata.
 * Se esiste, viene aggiornata: è il caso di uno sponsor di evento promosso a partner
 * di stagione, che è poi il motivo per cui questo script è nato (settembre 2026).
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale (NON dal watcher):
 *   cd ~/Desktop/INVERSIONE_AU/NUOVO_SITO_INVERSIONE_AU/SITO_WIX
 *   node scripts/carica-loghi-sponsor.mjs           → simulazione: non scrive nulla
 *   node scripts/carica-loghi-sponsor.mjs --run     → carica i file e scrive nel CMS
 *
 * Resoconto sempre in .trigger/loghi-report.txt (che leggo io dalla sessione).
 * Le credenziali arrivano da .env.local e non escono da qui.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const RUN = process.argv.includes('--run');
const API = 'https://www.wixapis.com';

/* ---------- cosa fare ----------
 * file:    nome del PNG dentro CARTELLA_FILE
 * nome:    valore del campo `nome` nella collection Sponsor. Se non esiste, la riga viene creata
 * livello: 'stagione' = partner annuale (home, fascia sotto la hero, /sponsor, ogni hub evento)
 *          qualsiasi altro valore = sponsor del solo evento indicato in `evento`
 * evento:  solo per le righe nuove: 'rally', 'polo', 'legnaro' (anche più d'uno separato da spazio)
 * ordine:  posizione nella sequenza della collection. Con null va in coda ai partner
 *          di stagione già presenti: è quasi sempre quello che serve
 * url:     sito da linkare, o null per lasciare il campo vuoto
 */
const LAVORI = [
  { file: 'BULL_BARBER_2026.png', nome: 'Bull Barber', livello: 'stagione', ordine: null, url: null },
  { file: 'CAFFE_NOIR_2026.png', nome: 'Bar Café Noir', livello: 'stagione', ordine: null, url: null, evento: '' },
  { file: 'GRUPPO_S2_2026.png', nome: 'Gruppo S2 Automobili', livello: 'stagione', ordine: null, url: null },
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
const q = await api('/wix-data/v2/items/query', { dataCollectionId: 'Sponsor', query: { paging: { limit: 200 } }, returnTotalCount: false });
if (!q.ok) { log(`ERRORE lettura collection Sponsor (${q.status}): ${q.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const items = JSON.parse(q.corpo).dataItems ?? [];
const annuali = items.filter(i => i.data?.livello === 'stagione');
let coda = Math.max(0, ...annuali.map(i => Number(i.data?.ordine) || 0));
log(`Collection Sponsor: ${items.length} righe · ${annuali.length} partner di stagione · ultimo ordine ${coda}`);
log('');

let fatti = 0;
for (const L of LAVORI) {
  const percorso = `${CARTELLA_FILE}/${L.file}`;
  log(`— ${L.nome}`);
  if (!existsSync(percorso)) { log(`  ! file mancante: ${percorso}`); continue; }
  const buf = readFileSync(percorso);
  const { w, h } = dimensioniPng(buf);
  log(`  file: ${basename(percorso)} · ${w}×${h} px · ${(buf.length / 1024).toFixed(0)} KB`);

  const riga = items.find(i => chiave(i.data?.nome) === chiave(L.nome));
  const ordine = L.ordine ?? ++coda;
  if (riga) log(`  riga esistente: livello "${riga.data.livello}" · evento "${riga.data.evento ?? ''}" · ordine ${riga.data.ordine} → diventa livello "${L.livello}" · ordine ${ordine}`);
  else      log(`  nessuna riga con questo nome: verrà creata (livello "${L.livello}" · ordine ${ordine})`);

  if (!RUN) { log('  → in esecuzione caricherebbe il file e scriverebbe nel CMS'); continue; }

  // 2a · indirizzo di caricamento
  const gen = await api('/site-media/v1/files/generate-upload-url', { mimeType: 'image/png', fileName: L.file, parentFolderId: cartella });
  if (!gen.ok) {
    log(`  ! generate-upload-url fallita (${gen.status}): ${gen.corpo.slice(0, 300)}`);
    if (gen.status === 403) log("    (l'app OAuth non ha i permessi sul Media Manager: carica i file dal pannello Wix, cartella sito-loghi-sponsor, e avvisami)");
    continue;
  }
  const u = new URL(JSON.parse(gen.corpo).uploadUrl); u.searchParams.set('filename', L.file);

  // 2b · caricamento binario
  const up = await fetch(u, { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: buf });
  const upTesto = await up.text();
  if (!up.ok) { log(`  ! caricamento fallito (${up.status}): ${upTesto.slice(0, 300)}`); continue; }
  const f = JSON.parse(upTesto).file ?? JSON.parse(upTesto);
  const fileId = f.id ?? f.fileId;
  if (!fileId) { log(`  ! risposta senza id file: ${upTesto.slice(0, 300)}`); continue; }
  log(`  caricato nel Media Manager: ${fileId}`);

  // 2c · riferimento immagine nel formato usato dalle altre righe
  const logo = `wix:image://v1/${fileId}/${L.file}#originWidth=${w}&originHeight=${h}`;

  // 2d · scrittura nel CMS. Il PUT sostituisce la riga: si riscrivono tutti i campi.
  let esito;
  if (riga) {
    const data = { ...riga.data, logo, livello: L.livello, ordine };
    if (L.url) data.url = L.url;
    esito = await api(`/wix-data/v2/items/${riga.id ?? riga.data._id}`, { dataCollectionId: 'Sponsor', dataItem: { id: riga.id ?? riga.data._id, data } }, 'PUT');
  } else {
    const data = { nome: L.nome, logo, livello: L.livello, ordine, attivo: true, evento: L.evento ?? '' };
    if (L.url) data.url = L.url;
    esito = await api('/wix-data/v2/items', { dataCollectionId: 'Sponsor', dataItem: { data } });
  }
  if (!esito.ok) { log(`  ! scrittura nel CMS fallita (${esito.status}): ${esito.corpo.slice(0, 300)}`); continue; }
  log(`  riga ${riga ? 'aggiornata' : 'creata'}: livello "${L.livello}" · ordine ${ordine} · logo nuovo`);
  fatti++;
}

log('');
log(RUN ? `Fatto: ${fatti} logo/loghi su ${LAVORI.length}.` : 'Simulazione conclusa. Rilancia con --run per applicare.');
log('Il sito legge il CMS con una cache di 5 minuti: la modifica compare entro pochi minuti, senza release.');
salva();
