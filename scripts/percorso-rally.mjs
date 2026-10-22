#!/usr/bin/env node
/**
 * Prove speciali del Rally Colli Euganei nel CMS (collection `ProveSpeciali`, evento `rally`).
 *
 * Porta le due righe del CMS a combaciare con l'elenco PROVE qui sotto, che è la stessa cosa
 * scritta in `src/data/rally.ts` -> `prove` (riserva statica): vanno tenute uguali, perché il
 * CMS ha la precedenza campo per campo e il sito ricade sulla riserva dove il CMS è vuoto.
 * Aggiorna le righe che ci sono, crea quelle che mancano, non cancella niente.
 *
 * Dati: tabella distanze e tempi V3 (definitiva, 22/10/2026) e cartina del 15/10/2026.
 * `chiusura` e `zonaPubblico` restano vuote di proposito: dipendono dall'ordinanza comunale,
 * e finché sono vuote il sito scrive «— · da definire».
 * Il tracciato (campo `mappa`) non si tocca da qui: le due immagini stanno nel repository,
 * in `public/img/rally/`, e arrivano dalla riserva statica.
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale (NON dal watcher, NON da Cowork:
 * da lì la rete verso wixapis.com è chiusa):
 *   node scripts/percorso-rally.mjs           -> simulazione: non scrive nulla
 *   node scripts/percorso-rally.mjs --run     -> applica
 *
 * Resoconto sempre in .trigger/percorso-report.txt.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const RUN = process.argv.includes('--run');
const API = 'https://www.wixapis.com';

/* ---------- le due prove, nell'ordine in cui devono comparire ---------- */
const CHIUSURA = 'Un’ora prima del passaggio della prima vettura';
const PROVE = [
  { sigla: 'PS 1 · 3 · 5', nome: 'Teolo', km: '3,00 km', primaVettura: '07:48 · 11:36 · 15:14', chiusura: CHIUSURA },
  { sigla: 'PS 2 · 4 · 6', nome: 'Roccolo – Cingolina', km: '4,12 km', primaVettura: '08:11 · 11:59 · 15:37', chiusura: CHIUSURA },
];

/* ---------- credenziali ---------- */
const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '';
const leggi = (k) => (env.match(new RegExp('^' + k + '=("?)([^"\n]+)\\1', 'm')) || [])[2] || '';
const clientId = leggi('WIX_CLIENT_ID'), clientSecret = leggi('WIX_CLIENT_SECRET');
if (!clientId || !clientSecret) { console.error('Mancano WIX_CLIENT_ID / WIX_CLIENT_SECRET in .env.local'); process.exit(1); }

const righe = [];
const log = (s = '') => { righe.push(s); console.log(s); };
function salva() {
  if (!existsSync('.trigger')) mkdirSync('.trigger');
  writeFileSync('.trigger/percorso-report.txt', righe.join('\n') + '\n');
}

let TOKEN = '', SCHEMA = 'Bearer ';
async function token() {
  const r = await fetch(`${API}/oauth2/token`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret, grantType: 'client_credentials' }) });
  const t = await r.text();
  if (!r.ok) { log(`ERRORE token ${r.status}: ${t.slice(0, 300)}`); salva(); process.exit(1); }
  TOKEN = JSON.parse(t).access_token;
}
async function api(path, body, metodo = 'POST') {
  for (const schema of [SCHEMA, SCHEMA === 'Bearer ' ? '' : 'Bearer ']) {
    const r = await fetch(API + path, { method: metodo,
      headers: { 'Content-Type': 'application/json', Authorization: schema + TOKEN },
      body: body === undefined ? undefined : JSON.stringify(body) });
    if (r.status === 401 || r.status === 403) { SCHEMA = schema === 'Bearer ' ? '' : 'Bearer '; continue; }
    const t = await r.text();
    return { ok: r.ok, status: r.status, corpo: t };
  }
  return { ok: false, status: 401, corpo: 'autenticazione rifiutata con e senza "Bearer"' };
}
const idDi = (riga) => riga.id ?? riga.data?._id;

/* ---------- esecuzione ---------- */
log(`Prove speciali rally — ${RUN ? 'ESECUZIONE' : 'simulazione (nessuna scrittura)'} — ${new Date().toLocaleString('it-IT')}`);
log('');
await token();

const q = await api('/wix-data/v2/items/query', { dataCollectionId: 'ProveSpeciali',
  query: { filter: { evento: 'rally' }, paging: { limit: 50 }, sort: [{ fieldName: 'ordine' }] } });
if (!q.ok) { log(`ERRORE lettura ProveSpeciali (${q.status}): ${q.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const esistenti = JSON.parse(q.corpo).dataItems ?? [];
log(`Righe rally nel CMS: ${esistenti.length}`);
for (const i of esistenti) log(`  ${String(i.data?.ordine ?? '').padStart(2)} · ${(i.data?.sigla ?? '-').padEnd(16)} · ${(i.data?.nome ?? '-').padEnd(24)} · ${i.data?.km ?? '—'}`);
log('');

let aggiornate = 0, create = 0;
for (let n = 0; n < PROVE.length; n++) {
  const v = PROVE[n], riga = esistenti[n], ordine = n + 1;
  const dati = { evento: 'rally', sigla: v.sigla, nome: v.nome, km: v.km, primaVettura: v.primaVettura, chiusura: v.chiusura, ordine };
  if (riga) {
    const uguale = ['sigla', 'nome', 'km', 'primaVettura', 'chiusura'].every(k => (riga.data?.[k] ?? '') === dati[k]) && Number(riga.data?.ordine) === ordine;
    log(`${ordine} · ${v.sigla} · ${v.nome} · ${v.km}${uguale ? '   (già a posto)' : `   (era: ${riga.data?.nome ?? '—'} · ${riga.data?.km ?? '—'})`}`);
    if (uguale || !RUN) { if (!uguale) aggiornate++; continue; }
    const esito = await api(`/wix-data/v2/items/${idDi(riga)}`, { dataCollectionId: 'ProveSpeciali', dataItem: { id: idDi(riga), data: { ...riga.data, ...dati } } }, 'PUT');
    if (!esito.ok) { log(`     ! aggiornamento fallito (${esito.status}): ${esito.corpo.slice(0, 200)}`); continue; }
    aggiornate++;
  } else {
    log(`${ordine} · ${v.sigla} · ${v.nome} · ${v.km}   (riga nuova)`);
    if (!RUN) { create++; continue; }
    const esito = await api('/wix-data/v2/items', { dataCollectionId: 'ProveSpeciali', dataItem: { data: dati } });
    if (!esito.ok) { log(`     ! creazione fallita (${esito.status}): ${esito.corpo.slice(0, 200)}`); continue; }
    create++;
  }
}

const avanzate = esistenti.slice(PROVE.length);
if (avanzate.length) {
  log('');
  log('Righe che avanzano (NON toccate: vanno eliminate a mano dal pannello Wix se non servono):');
  for (const i of avanzate) log(`  ${String(i.data?.ordine ?? '').padStart(2)} · ${i.data?.sigla ?? '-'} · ${i.data?.nome ?? '-'}`);
}

log('');
log(RUN ? `Fatto: ${aggiornate} righe aggiornate, ${create} create.` : `Simulazione conclusa: ${aggiornate} da aggiornare, ${create} da creare. Rilancia con --run per applicare.`);
log('La zona pubblico resta vuota: la scrive l\'ordinanza comunale, non questo script.');
salva();
