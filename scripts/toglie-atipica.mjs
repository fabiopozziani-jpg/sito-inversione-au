#!/usr/bin/env node
/**
 * Toglie la dicitura «atipico/atipica sperimentale» da tutti i testi del CMS Wix.
 * Decisione di Fabio del 13 ottobre 2026: sul sito la gara si presenta solo come
 * «Rally Sprint». La classificazione ACI Sport resta quella dei documenti ufficiali
 * (RPG, albo di gara), ma non compare più nei testi pubblici.
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale sul Mac (NON dal watcher):
 *   node scripts/toglie-atipica.mjs          → simulazione: non scrive nulla
 *   node scripts/toglie-atipica.mjs --run    → applica le modifiche
 *
 * Resoconto in .trigger/cms-report-atipica.txt
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const RUN = process.argv.includes('--run');
const API = 'https://www.wixapis.com';

const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '';
const leggi = (k) => (env.match(new RegExp('^' + k + '=("?)([^"\\n]+)\\1', 'm')) || [])[2] || '';
const clientId = leggi('WIX_CLIENT_ID');
const clientSecret = leggi('WIX_CLIENT_SECRET');
if (!clientId || !clientSecret) { console.error('Mancano WIX_CLIENT_ID / WIX_CLIENT_SECRET in .env.local'); process.exit(1); }

const righe = [];
const log = (s = '') => { righe.push(s); console.log(s); };
const salva = () => {
  if (!existsSync('.trigger')) mkdirSync('.trigger');
  writeFileSync('.trigger/cms-report-atipica.txt', righe.join('\n') + '\n');
};

/* ---------- sostituzioni, dalla più lunga alla più corta ---------- */
const COPPIE = [
  ['ACI Sport ha iscritto la manifestazione a calendario come <strong>atipica sperimentale</strong> del settore rally, nella formula del <strong>Rally Sprint</strong>',
   'ACI Sport ha iscritto la manifestazione a calendario nella formula del <strong>Rally Sprint</strong>'],
  ['ACI Sport ha iscritto la manifestazione a calendario come atipica sperimentale del settore rally, nella formula del Rally Sprint',
   'ACI Sport ha iscritto la manifestazione a calendario nella formula del Rally Sprint'],
  ['Rally Sprint · manifestazione atipica sperimentale a calendario ACI Sport', 'Rally Sprint · a calendario ACI Sport'],
  ['Rally Sprint · atipico sperimentale · a calendario ACI Sport', 'Rally Sprint · a calendario ACI Sport'],
  ['Rally Sprint · atipica sperimentale · a calendario ACI Sport', 'Rally Sprint · a calendario ACI Sport'],
  ['Rally Sprint · atipica sperimentale ACI Sport', 'Rally Sprint · a calendario ACI Sport'],
  ['Rally Sprint · atipico sperimentale ACI Sport', 'Rally Sprint · a calendario ACI Sport'],
  ['Rally Sprint · Atipico Sperimentale', 'Rally Sprint'],
  ['Rally Sprint · Atipica Sperimentale', 'Rally Sprint'],
  ['Rally Sprint · atipico sperimentale', 'Rally Sprint'],
  ['Rally Sprint · atipica sperimentale', 'Rally Sprint'],
  ['manifestazione atipica sperimentale a calendario ACI Sport', 'manifestazione a calendario ACI Sport'],
  ['atipica sperimentale ACI Sport', 'a calendario ACI Sport'],
  ['atipico sperimentale ACI Sport', 'a calendario ACI Sport'],
];
const RESIDUO = /atipic|sperimental/i;

/* ---------- API ---------- */
let TOKEN = '', SCHEMA = 'Bearer ';
const r0 = await fetch(`${API}/oauth2/token`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clientId, clientSecret, grantType: 'client_credentials' }),
});
if (!r0.ok) { log(`ERRORE token ${r0.status}: ${(await r0.text()).slice(0, 300)}`); salva(); process.exit(1); }
TOKEN = (await r0.json()).access_token;

async function api(path, body, metodo = 'POST') {
  for (const schema of [SCHEMA, SCHEMA === 'Bearer ' ? '' : 'Bearer ']) {
    const r = await fetch(API + path, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', Authorization: schema + TOKEN },
      body: JSON.stringify(body),
    });
    if (r.status === 401 || r.status === 403) { SCHEMA = schema === 'Bearer ' ? '' : 'Bearer '; continue; }
    return { ok: r.ok, status: r.status, corpo: await r.text() };
  }
  return { ok: false, status: 401, corpo: 'autenticazione rifiutata con e senza "Bearer"' };
}
const leggiTutti = async (coll) => {
  const out = [];
  for (let offset = 0; ; offset += 100) {
    const r = await api('/wix-data/v2/items/query', { dataCollectionId: coll, query: { paging: { limit: 100, offset } } });
    if (!r.ok) { log(`  ! lettura ${coll} fallita (${r.status}): ${r.corpo.slice(0, 200)}`); return null; }
    const items = JSON.parse(r.corpo).dataItems ?? [];
    out.push(...items);
    if (items.length < 100) return out;
  }
};
const aggiorna = (coll, item) => api(`/wix-data/v2/items/${item.id}`, { dataCollectionId: coll, dataItem: { id: item.id, data: item.data } }, 'PUT');

/* ---------- esecuzione ---------- */
const COLLEZIONI = ['Eventi', 'Programma', 'ProveSpeciali', 'Scadenze', 'Documenti', 'News', 'Gallerie', 'Sponsor', 'Edizioni', 'Team', 'Foto', 'Video', 'Social'];

log(`# CMS · via «atipico sperimentale» · ${new Date().toISOString().slice(0, 19).replace('T', ' ')} · ${RUN ? 'MODIFICHE APPLICATE' : 'SIMULAZIONE (nessuna scrittura)'}`);
log('');

let scritture = 0, errori = 0;
const residui = [];

for (const coll of COLLEZIONI) {
  const items = await leggiTutti(coll);
  if (!items) { errori++; continue; }
  let toccate = 0;
  for (const item of items) {
    const campi = [];
    for (const [campo, val] of Object.entries(item.data)) {
      if (typeof val !== 'string' || campo.startsWith('_')) continue;
      let nuovo = val;
      for (const [a, b] of COPPIE) if (nuovo.includes(a)) nuovo = nuovo.split(a).join(b);
      if (nuovo !== val) { item.data[campo] = nuovo; campi.push(campo); }
      if (RESIDUO.test(item.data[campo])) {
        for (const f of String(item.data[campo]).split(/(?<=[.>])\s+/)) {
          if (RESIDUO.test(f)) residui.push(`${coll} · ${item.id} · ${campo} → ${f.trim().slice(0, 200)}`);
        }
      }
    }
    if (!campi.length) continue;
    toccate++;
    log(`## ${coll} · ${item.data.slug ?? item.data.titolo ?? item.id} → ${campi.join(', ')}`);
    if (RUN) {
      const r = await aggiorna(coll, item);
      if (r.ok) scritture++;
      else { errori++; log(`  ! scrittura fallita (${r.status}): ${r.corpo.slice(0, 200)}`); }
    }
  }
  if (!toccate) log(`## ${coll} — nessuna riga da correggere (${items.length} righe)`);
}

log('');
if (residui.length) {
  log('## Da guardare a mano (la dicitura è rimasta, in una forma non prevista)');
  for (const r of residui) log(`- ${r}`);
} else {
  log('## Nessun residuo: la dicitura non compare più in nessun campo.');
}
log('');
log(`Righe scritte: ${scritture} · errori: ${errori}${RUN ? '' : ' · simulazione, nessuna scrittura'}`);
salva();
