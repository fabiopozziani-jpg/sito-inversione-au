#!/usr/bin/env node
/**
 * Programma del Rally Colli Euganei nel CMS (collection `Programma`, evento `rally`).
 *
 * Porta le righe del CMS a combaciare con l'elenco VOCI qui sotto: aggiorna quelle che
 * ci sono, crea quelle che mancano e segnala quelle che avanzano (non cancella niente).
 * La riserva statica equivalente sta in `src/data/rally.ts` → `programma`: vanno tenute
 * uguali, perché il CMS ha la precedenza ma il sito ricade sui dati statici se non risponde.
 *
 * Il programma provvisorio diventa visibile sul sito il 22 ottobre (un mese prima della
 * gara): la data sta in `DATE.unMesePrima` dentro src/data/rally.ts, quindi si può
 * scrivere nel CMS da subito senza che compaia prima del tempo.
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale (NON dal watcher, NON da Cowork:
 * da lì la rete verso wixapis.com è chiusa):
 *   node scripts/programma-rally.mjs           → simulazione: non scrive nulla
 *   node scripts/programma-rally.mjs --run     → applica
 *
 * Resoconto sempre in .trigger/programma-report.txt.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const RUN = process.argv.includes('--run');
const API = 'https://www.wixapis.com';

/* ---------- il programma, nell'ordine in cui deve comparire ---------- */
const SAB = 'Sabato 21 novembre', DOM = 'Domenica 22 novembre', TBD = 'Da definire';
const VOCI = [
  { giorno: SAB, ora: '07:20 – 11:20', titolo: 'Ricognizioni autorizzate del percorso', nota: 'Gli equipaggi percorrono le prove con vetture di serie, a velocità di codice.' },
  { giorno: SAB, ora: '08:00 – 12:00', titolo: 'Ingresso team in parco assistenza', nota: 'I team prendono posizione a Selve di Teolo.' },
  { giorno: SAB, ora: '11:00 – 15:00', titolo: 'Verifiche sportive', nota: 'Fino alle 13:00 gli equipaggi iscritti allo shakedown, dalle 13:00 tutti gli altri.' },
  { giorno: SAB, ora: '11:30 – 15:30', titolo: 'Verifiche tecniche', nota: 'Controllo delle vetture. Fino alle 13:30 gli equipaggi iscritti allo shakedown, dalle 13:30 tutti gli altri.' },
  { giorno: SAB, ora: '13:00 – 16:45', titolo: 'Shakedown', nota: 'Messa a punto su un tratto breve, massimo tre passaggi. La prima occasione per vedere le auto in azione.' },
  { giorno: SAB, ora: '16:30', titolo: 'Elenco verificati e ordine di partenza', nota: 'Pubblicazione in albo di gara, insieme all’orario individuale della cerimonia di presentazione.' },
  { giorno: SAB, ora: '17:30 – 18:00', titolo: 'Ingresso palco partenza', nota: 'Le vetture si incolonnano verso il palco.' },
  { giorno: SAB, ora: '18:30', titolo: 'Cerimonia di presentazione degli equipaggi', nota: 'Le vetture salgono sul palco in ordine inverso di numero. Ingresso libero.' },
  { giorno: DOM, ora: '07:30', titolo: 'Partenza, prima vettura', nota: 'Selve di Teolo — uscita del parco assistenza. Le vetture partono a un minuto di distanza.' },
  { giorno: DOM, ora: '07:48', titolo: 'PS 1 · Teolo', nota: 'Primo passaggio. Prova di 3,00 km.' },
  { giorno: DOM, ora: '08:11', titolo: 'PS 2 · Roccolo – Cingolina', nota: 'Primo passaggio. Prova di 4,12 km.' },
  { giorno: DOM, ora: '08:48 – 10:33', titolo: 'Riordino', nota: 'Treponti — Piazza Mercato.' },
  { giorno: DOM, ora: '10:48 – 11:18', titolo: 'Parco assistenza A', nota: 'Selve di Teolo. Trenta minuti di assistenza alle vetture.' },
  { giorno: DOM, ora: '11:36', titolo: 'PS 3 · Teolo', nota: 'Secondo passaggio.' },
  { giorno: DOM, ora: '11:59', titolo: 'PS 4 · Roccolo – Cingolina', nota: 'Secondo passaggio.' },
  { giorno: DOM, ora: '12:36 – 14:11', titolo: 'Riordino', nota: 'Treponti — Piazza Mercato.' },
  { giorno: DOM, ora: '14:26 – 14:56', titolo: 'Parco assistenza B', nota: 'Selve di Teolo. Ultimo intervento prima del terzo giro.' },
  { giorno: DOM, ora: '15:14', titolo: 'PS 5 · Teolo', nota: 'Terzo e ultimo passaggio.' },
  { giorno: DOM, ora: '15:37', titolo: 'PS 6 · Roccolo – Cingolina', nota: 'Terzo e ultimo passaggio.' },
  { giorno: DOM, ora: '16:00', titolo: 'Elenco vetture in verifica', nota: 'Pubblicazione in albo di gara delle vetture convocate alle verifiche tecniche dopo la gara.' },
  { giorno: DOM, ora: '16:15', titolo: 'Arrivo, prima vettura', nota: 'Treponti — Via Alcide De Gasperi.' },
  { giorno: DOM, ora: '16:30', titolo: 'Pedana arrivo e premiazioni', nota: 'Treponti — Piazza Mercato · ingresso libero.' },
  { giorno: DOM, ora: '18:00', titolo: 'Classifiche finali', nota: 'Pubblicazione in albo di gara.' },
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
  writeFileSync('.trigger/programma-report.txt', righe.join('\n') + '\n');
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
log(`Programma rally — ${RUN ? 'ESECUZIONE' : 'simulazione (nessuna scrittura)'} — ${new Date().toLocaleString('it-IT')}`);
log('');
await token();

const q = await api('/wix-data/v2/items/query', { dataCollectionId: 'Programma',
  query: { filter: { evento: 'rally' }, paging: { limit: 100 }, sort: [{ fieldName: 'ordine' }] } });
if (!q.ok) { log(`ERRORE lettura Programma (${q.status}): ${q.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const esistenti = JSON.parse(q.corpo).dataItems ?? [];
log(`Righe rally nel CMS: ${esistenti.length}`);
for (const i of esistenti) log(`  ${String(i.data?.ordine ?? '').padStart(2)} · ${(i.data?.giorno ?? '-').padEnd(22)} · ${(i.data?.ora ?? '').padEnd(14)} · ${i.data?.titolo}`);
log('');

let aggiornate = 0, create = 0;
for (let n = 0; n < VOCI.length; n++) {
  const v = VOCI[n], riga = esistenti[n], ordine = n + 1;
  const dati = { evento: 'rally', giorno: v.giorno, ora: v.ora, titolo: v.titolo, nota: v.nota, ordine, primaVettura: v.primaVettura ?? '' };
  if (riga) {
    const uguale = ['giorno', 'ora', 'titolo', 'nota'].every(k => (riga.data?.[k] ?? '') === dati[k]) && Number(riga.data?.ordine) === ordine;
    log(`${String(ordine).padStart(2)} · ${v.ora.padEnd(14)} · ${v.titolo}${uguale ? '   (già a posto)' : `   (era: ${riga.data?.ora ?? '—'} · ${riga.data?.titolo ?? '—'})`}`);
    if (uguale || !RUN) { if (!uguale) aggiornate++; continue; }
    const esito = await api(`/wix-data/v2/items/${idDi(riga)}`, { dataCollectionId: 'Programma', dataItem: { id: idDi(riga), data: { ...riga.data, ...dati } } }, 'PUT');
    if (!esito.ok) { log(`     ! aggiornamento fallito (${esito.status}): ${esito.corpo.slice(0, 200)}`); continue; }
    aggiornate++;
  } else {
    log(`${String(ordine).padStart(2)} · ${v.ora.padEnd(14)} · ${v.titolo}   (riga nuova)`);
    if (!RUN) { create++; continue; }
    const esito = await api('/wix-data/v2/items', { dataCollectionId: 'Programma', dataItem: { data: dati } });
    if (!esito.ok) { log(`     ! creazione fallita (${esito.status}): ${esito.corpo.slice(0, 200)}`); continue; }
    create++;
  }
}

const avanzate = esistenti.slice(VOCI.length);
if (avanzate.length) {
  log('');
  log('Righe che avanzano (NON toccate: vanno eliminate a mano dal pannello Wix se non servono):');
  for (const i of avanzate) log(`  ${String(i.data?.ordine ?? '').padStart(2)} · ${i.data?.giorno ?? '-'} · ${i.data?.titolo}`);
}

log('');
log(RUN ? `Fatto: ${aggiornate} righe aggiornate, ${create} create.` : `Simulazione conclusa: ${aggiornate} da aggiornare, ${create} da creare. Rilancia con --run per applicare.`);
log('Il programma resta nascosto sul sito fino al 22 ottobre (DATE.unMesePrima in src/data/rally.ts).');
salva();
