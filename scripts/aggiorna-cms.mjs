#!/usr/bin/env node
/**
 * Allinea il CMS Wix alle correzioni applicate al codice (documento del 28 agosto 2026).
 *
 * Il CMS ha la precedenza sui dati statici di src/data/: finché una riga non viene
 * corretta anche qui, il sito continua a mostrare il testo vecchio.
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale (NON dal watcher):
 *   node scripts/aggiorna-cms.mjs           → simulazione: non scrive nulla
 *   node scripts/aggiorna-cms.mjs --run     → applica le modifiche
 *
 * Scrive sempre il resoconto in .trigger/cms-report.txt (che leggo io dalla sessione).
 * Le credenziali arrivano da .env.local e non escono da qui.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const RUN = process.argv.includes('--run');
const API = 'https://www.wixapis.com';

/* ---------- credenziali ---------- */
const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '';
const leggi = (k) => (env.match(new RegExp('^' + k + '=("?)([^"\\n]+)\\1', 'm')) || [])[2] || '';
const clientId = leggi('WIX_CLIENT_ID');
const clientSecret = leggi('WIX_CLIENT_SECRET');
if (!clientId || !clientSecret) { console.error('Mancano WIX_CLIENT_ID / WIX_CLIENT_SECRET in .env.local'); process.exit(1); }

const righe = [];
const log = (s = '') => { righe.push(s); console.log(s); };

/* ---------- sostituzioni di testo (valgono su ogni campo testuale) ---------- */
const COPPIE = [
  ["Prima edizione: il rally torna sui Colli dopo più di trent'anni", 'Prima edizione: dopo più di 35 anni torna un rally nel Padovano'],
  ['Dopo più di 30 anni torna il rally sui Colli Euganei a Padova.', 'Dopo più di 35 anni torna un rally nel Padovano.'],
  ["Il rally torna sui Colli dopo più di trent'anni", 'Dopo più di 35 anni torna un rally nel Padovano'],
  ["È il ritorno di un rally su queste strade dopo più di trent'anni.", 'È il ritorno di un rally nel Padovano dopo più di 35 anni.'],
  ["Riportare un rally su queste strade dopo più di trent'anni", 'Riportare un rally nel Padovano dopo più di 35 anni'],
  ["il rally torna sui Colli dopo più di trent'anni", 'dopo più di 35 anni torna un rally nel Padovano'],
  ["il primo rally sui Colli dopo più di trent'anni", 'il primo rally nel Padovano dopo più di 35 anni'],
  ["Come diventare socio e sostenere", 'Come tesserarsi e sostenere'],
  ['socio ordinario, socio operativo o sostenitore', 'nuovo tesseramento o rinnovo'],
  ['Diventa socio', 'Diventa Tesserato'],
  ['diventare socio', 'tesserarsi'],
  ['Nel 2019 abbiamo organizzato i primi raduni', 'Nel 2018 abbiamo organizzato i primi raduni'],
  ['30–40 km', '20–35 km'],
  ['30-40 km', '20–35 km'],
  ['2 prove speciali ripetute 3 volte', '2 prove speciali, 3 passaggi ciascuna'],
  ['due prove speciali ripetute tre volte', 'due prove speciali con tre passaggi ciascuna'],
];
/** ogni coppia vale sia con l'apostrofo dritto sia con quello tipografico */
const TUTTE = [];
for (const [a, b] of COPPIE) {
  TUTTE.push([a, b]);
  if (a.includes("'")) TUTTE.push([a.replace(/'/g, '’'), b.replace(/'/g, '’')]);
}
/** segnalazioni: non si toccano da sole, le guardiamo a mano */
const DA_GUARDARE = [/rally del santo/i, /citt[àa] del santo/i, /pettorina/i, /requisiti di licenza/i, /drone/i];

/* ---------- sponsor: chi passa a partner di stagione ---------- */
const A_STAGIONE = ['sky motors', 'metal nord', 'ecosider', 'siderurgica veneta', 'labor', 'marchioro', 'dealernet'];
const A_EVENTO_POLO = ['polo'];   // POLO · insieme a te in cucina → solo sull'evento Polo

const COLLEZIONI = ['Eventi', 'Programma', 'ProveSpeciali', 'Scadenze', 'Documenti', 'News', 'Gallerie', 'Sponsor', 'Edizioni', 'Team'];

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
      body: JSON.stringify(body),
    });
    if (r.status === 401 || r.status === 403) { SCHEMA = schema === 'Bearer ' ? '' : 'Bearer '; continue; }
    const t = await r.text();
    return { ok: r.ok, status: r.status, corpo: t };
  }
  return { ok: false, status: 401, corpo: 'autenticazione rifiutata con e senza "Bearer"' };
}
const leggiTutti = async (coll) => {
  const out = [];
  for (let offset = 0; ; offset += 100) {
    const r = await api('/wix-data/v2/items/query', { dataCollectionId: coll, query: { paging: { limit: 100, offset } }, returnTotalCount: false });
    if (!r.ok) { log(`  ! lettura ${coll} fallita (${r.status}): ${r.corpo.slice(0, 200)}`); return null; }
    const items = (JSON.parse(r.corpo).dataItems ?? []);
    out.push(...items);
    if (items.length < 100) return out;
  }
};
const aggiorna = (coll, item) => api(`/wix-data/v2/items/${item.id}`, { dataCollectionId: coll, dataItem: { id: item.id, data: item.data } }, 'PUT');

/* ---------- esecuzione ---------- */
function correggiTesti(data) {
  const cambi = [];
  for (const [campo, val] of Object.entries(data)) {
    if (typeof val !== 'string' || campo.startsWith('_')) continue;
    let nuovo = val;
    for (const [a, b] of TUTTE) if (nuovo.includes(a)) nuovo = nuovo.split(a).join(b);
    if (nuovo !== val) { data[campo] = nuovo; cambi.push(campo); }
  }
  return cambi;
}
function segnala(coll, item) {
  const fuori = [];
  for (const [campo, val] of Object.entries(item.data)) {
    if (typeof val !== 'string' || campo.startsWith('_')) continue;
    for (const re of DA_GUARDARE) if (re.test(val)) fuori.push(`${campo} (${re.source})`);
  }
  return fuori;
}

function salva() {
  if (!existsSync('.trigger')) mkdirSync('.trigger');
  writeFileSync('.trigger/cms-report.txt', righe.join('\n') + '\n');
}

await token();
log(`# Allineamento CMS · ${new Date().toISOString().slice(0, 19).replace('T', ' ')} · ${RUN ? 'MODIFICHE APPLICATE' : 'SIMULAZIONE (nessuna scrittura)'}`);
log('');

let scritture = 0, errori = 0;
const daGuardare = [];

for (const coll of COLLEZIONI) {
  const items = await leggiTutti(coll);
  if (!items) { errori++; continue; }
  log(`## ${coll} — ${items.length} righe`);
  for (const item of items) {
    const prima = JSON.stringify(item.data);
    const campi = correggiTesti(item.data);

    if (coll === 'Sponsor') {
      const nome = String(item.data.nome ?? '').toLowerCase();
      if (A_STAGIONE.some(n => nome.includes(n)) && item.data.livello !== 'stagione') {
        item.data.livello = 'stagione'; campi.push('livello→stagione');
      }
      if (A_EVENTO_POLO.some(n => nome.startsWith(n)) && item.data.livello === 'stagione') {
        item.data.livello = 'evento';
        if (!String(item.data.evento ?? '').includes('polo')) item.data.evento = 'polo';
        campi.push('livello→evento · evento→polo');
      }
    }
    if (coll === 'Sponsor' && String(item.data.nome ?? '').trim().toLowerCase() === 'duo') {
      // il file duo.png non esiste più nel Media Manager: si passa al logo statico del repository
      item.data.nome = 'Donolauto';
      item.data.logo = '';
      campi.push('nome→Donolauto · logo→statico');
    }
    if (coll === 'ProveSpeciali' && String(item.data.km ?? '').trim().toLowerCase() === 'coming soon') {
      item.data.km = '— · un mese prima della gara'; campi.push('km');
    }

    const note = segnala(coll, item);
    if (note.length) daGuardare.push(`  ${coll} · ${String(item.data.nome ?? item.data.titolo ?? item.data.slug ?? item.id)} → ${note.join(', ')}`);

    if (!campi.length || JSON.stringify(item.data) === prima) continue;
    const eti = String(item.data.nome ?? item.data.titolo ?? item.data.slug ?? item.id);
    log(`  · ${eti} → ${campi.join(', ')}`);
    if (RUN) {
      const r = await aggiorna(coll, item);
      if (r.ok) scritture++;
      else { errori++; log(`    ! scrittura fallita (${r.status}): ${r.corpo.slice(0, 200)}`); }
    } else scritture++;
  }
  log('');
}

if (daGuardare.length) { log('## Da guardare a mano (non toccati)'); daGuardare.forEach(r => log(r)); log(''); }
log(`Totale: ${scritture} righe ${RUN ? 'aggiornate' : 'da aggiornare'}, ${errori} errori.`);
if (!RUN) log('Per applicare: node scripts/aggiorna-cms.mjs --run');
salva();
