#!/usr/bin/env node
/**
 * Iscrizioni del Rally Colli Euganei: date nel CMS e stato automatico.
 *
 * Fa due cose:
 *   1. scrive nelle righe `Scadenze` dell'evento rally le date di apertura e chiusura
 *      iscrizioni (le altre righe non vengono toccate);
 *   2. svuota il campo `statoIscrizioni` della riga `Eventi` del rally. Vuoto significa
 *      «decidono le date»: il sito è SSR e calcola lo stato a ogni richiesta
 *      (`statoIscrizioniOra` in src/data/rally.ts). Scrivendoci dentro 'non-aperte',
 *      'aperte' o 'chiuse' si torna a comandare a mano, per esempio per chiudere prima.
 *
 * Le date stanno in src/data/rally.ts: apertura 22 ottobre 2026 ore 23:59,
 * chiusura 16 novembre 2026 alle 23:59. Qui sotto vanno tenute uguali.
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale (NON dal watcher, NON da Cowork:
 * da lì la rete verso wixapis.com è chiusa):
 *   node scripts/iscrizioni-rally.mjs           → simulazione: non scrive nulla
 *   node scripts/iscrizioni-rally.mjs --run     → applica
 *
 * Resoconto sempre in .trigger/iscrizioni-report.txt.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const RUN = process.argv.includes('--run');
const API = 'https://www.wixapis.com';

/** Righe `Scadenze` da sistemare, riconosciute dal campo `fase`. */
const DATE = [
  { fase: 'Apertura iscrizioni', data: '22 ottobre 2026', ora: '23:59' },
  { fase: 'Chiusura iscrizioni', data: '16 novembre 2026', ora: '23:59' },
  { fase: 'Consegna road book', data: '20 novembre 2026', ora: '18:00 – 22:00' },
  { fase: 'Ricognizioni del percorso', data: '21 novembre 2026', ora: '07:20 – 11:20' },
  { fase: 'Verifiche sportive e tecniche', data: '21 novembre 2026', ora: '11:00 – 15:30' },
  { fase: 'Shakedown', data: '21 novembre 2026', ora: '13:00 – 16:45' },
];

const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '';
const leggi = (k) => (env.match(new RegExp('^' + k + '=("?)([^"\n]+)\\1', 'm')) || [])[2] || '';
const clientId = leggi('WIX_CLIENT_ID'), clientSecret = leggi('WIX_CLIENT_SECRET');
if (!clientId || !clientSecret) { console.error('Mancano WIX_CLIENT_ID / WIX_CLIENT_SECRET in .env.local'); process.exit(1); }

const righe = [];
const log = (s = '') => { righe.push(s); console.log(s); };
function salva() {
  if (!existsSync('.trigger')) mkdirSync('.trigger');
  writeFileSync('.trigger/iscrizioni-report.txt', righe.join('\n') + '\n');
}
const chiave = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

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

log(`Iscrizioni rally — ${RUN ? 'ESECUZIONE' : 'simulazione (nessuna scrittura)'} — ${new Date().toLocaleString('it-IT')}`);
log('');
await token();

/* ---------- 1 · date da segnare ---------- */
const q = await api('/wix-data/v2/items/query', { dataCollectionId: 'Scadenze',
  query: { filter: { evento: 'rally' }, paging: { limit: 50 }, sort: [{ fieldName: 'ordine' }] } });
if (!q.ok) { log(`ERRORE lettura Scadenze (${q.status}): ${q.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const scadenze = JSON.parse(q.corpo).dataItems ?? [];
log(`Righe Scadenze del rally: ${scadenze.length}`);
for (const i of scadenze) log(`  ${String(i.data?.ordine ?? '').padStart(2)} · ${(i.data?.fase ?? '').padEnd(32)} · ${(i.data?.data ?? '').padEnd(18)} · ${i.data?.ora ?? ''}`);
log('');

let fatte = 0;
// `ordine` segue la posizione in DATE: così una fase aggiunta in mezzo (la consegna del
// road book, 22/10/2026) si incastra al posto giusto senza risistemare le altre a mano.
for (let n = 0; n < DATE.length; n++) {
  const D = DATE[n], ordine = n + 1;
  const riga = scadenze.find(i => chiave(i.data?.fase) === chiave(D.fase));
  if (!riga) {
    log(`— ${D.fase}: riga nuova  →  ${D.data} · ${D.ora}`);
    if (!RUN) { fatte++; continue; }
    const esito = await api('/wix-data/v2/items', { dataCollectionId: 'Scadenze', dataItem: { data: { evento: 'rally', fase: D.fase, data: D.data, ora: D.ora, ordine } } });
    if (!esito.ok) { log(`  ! creazione fallita (${esito.status}): ${esito.corpo.slice(0, 200)}`); continue; }
    fatte++; continue;
  }
  if ((riga.data?.data ?? '') === D.data && (riga.data?.ora ?? '') === D.ora && Number(riga.data?.ordine) === ordine) { log(`— ${D.fase}: già a posto (${D.data} · ${D.ora})`); continue; }
  log(`— ${D.fase}: ${riga.data?.data ?? '—'} · ${riga.data?.ora ?? '—'}  →  ${D.data} · ${D.ora}`);
  if (!RUN) { fatte++; continue; }
  const data = { ...riga.data, data: D.data, ora: D.ora, ordine };
  const esito = await api(`/wix-data/v2/items/${idDi(riga)}`, { dataCollectionId: 'Scadenze', dataItem: { id: idDi(riga), data } }, 'PUT');
  if (!esito.ok) { log(`  ! scrittura fallita (${esito.status}): ${esito.corpo.slice(0, 200)}`); continue; }
  fatte++;
}

/* ---------- 2 · stato delle iscrizioni: lo decidono le date ---------- */
log('');
const qe = await api('/wix-data/v2/items/query', { dataCollectionId: 'Eventi', query: { filter: { chiave: 'rally' }, paging: { limit: 5 } } });
if (!qe.ok) { log(`ERRORE lettura Eventi (${qe.status}): ${qe.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const evento = (JSON.parse(qe.corpo).dataItems ?? [])[0];
let statoFatto = false;
if (!evento) log('Riga Eventi del rally non trovata: campo statoIscrizioni non toccato.');
else {
  const attuale = evento.data?.statoIscrizioni ?? '';
  log(`Evento rally · statoIscrizioni nel CMS: "${attuale}"`);
  if (!attuale) log('  già vuoto: lo stato lo decidono le date');
  else {
    log('  → va svuotato, altrimenti continua a forzare lo stato a mano');
    if (RUN) {
      const esito = await api(`/wix-data/v2/items/${idDi(evento)}`, { dataCollectionId: 'Eventi', dataItem: { id: idDi(evento), data: { ...evento.data, statoIscrizioni: '' } } }, 'PUT');
      if (!esito.ok) log(`  ! scrittura fallita (${esito.status}): ${esito.corpo.slice(0, 200)}`);
      else { log('  svuotato'); statoFatto = true; }
    } else statoFatto = true;
  }
}

log('');
log(RUN ? `Fatto: ${fatte} date sistemate${statoFatto ? ' · stato iscrizioni ora automatico' : ''}.`
        : `Simulazione conclusa: ${fatte} date da sistemare${statoFatto ? ' · statoIscrizioni da svuotare' : ''}. Rilancia con --run per applicare.`);
log('Da quel momento: iscrizioni aperte il 22 ottobre alle 23:59, chiuse il 16 novembre alle 23:59, senza interventi.');
salva();
