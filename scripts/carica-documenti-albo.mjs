#!/usr/bin/env node
/**
 * Carica i PDF dei moduli nel Media Manager (cartella `sito-documenti`) e crea le righe
 * della collection `Documenti` — l'albo di gara del Rally Colli Euganei.
 *
 * Uso, dalla cartella SITO_WIX, in un Terminale (NON dal watcher, NON da Cowork:
 * da lì la rete verso wixapis.com è chiusa):
 *   cd ~/Desktop/INVERSIONE_AU/NUOVO_SITO_INVERSIONE_AU/SITO_WIX
 *   node scripts/carica-documenti-albo.mjs          → simulazione: non scrive nulla
 *   node scripts/carica-documenti-albo.mjs --run    → carica i file e scrive nel CMS
 *   node scripts/carica-documenti-albo.mjs --pesi   → risistema solo tipo e peso delle righe già in albo
 *   node scripts/carica-documenti-albo.mjs --date   → allinea solo la data di pubblicazione delle righe già in albo
 *
 * Resoconto sempre in .trigger/albo-report.txt (che leggo io dalla sessione).
 * Le credenziali arrivano da .env.local e non escono da qui.
 *
 * Regola dell'albo: una revisione NON sovrascrive il file precedente. Si aggiunge una
 * riga nuova e sulla vecchia si mette `superato` = Sì + `superatoDa`. Questo script
 * crea righe nuove e si ferma se un `numero` esiste già.
 *
 * Unica eccezione, `sostituisci: true`: una riga **non ancora pubblicata** (pubblicatoIl
 * nel futuro, quindi invisibile sul sito) può ricevere un file nuovo al posto del
 * precedente. Nessun link è ancora in giro, quindi non c'è niente da proteggere e
 * l'albo non si riempie di versioni di un documento mai uscito. Se la riga è già
 * pubblica lo script rifiuta e lo dice: lì vale la regola della revisione.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';

const RUN = process.argv.includes('--run');
/** --pesi: non carica nulla, risistema solo il campo `nomeFile` (tipo e peso) delle righe già in albo. */
const PESI = process.argv.includes('--pesi');
/** --date: non carica nulla, allinea solo `pubblicatoIl` delle righe gia in albo al campo `quando`. */
const DATE = process.argv.includes('--date');
const API = 'https://www.wixapis.com';
const SITE_ID = '0fa841cd-37c1-4afa-98a8-07cd3feb9f54';
const CARTELLA_FILE = '/Users/fabio/Desktop/INVERSIONE_AU/EVENTI/2026/21-22_NOVEMBRE_1_RALLY_COLLI_EUGANEI/MODULI/CARICATI_ONLINE';
/** Un PDF già nella cartella `sito-documenti`: serve solo a ricavare la cartella di destinazione. */
const RIFERIMENTO = '2be2d6_c5f6450bccd149b59725d618cf7bc712.pdf';
/** Data di pubblicazione in albo (campo `pubblicatoIl`, formato AAAA-MM-GG). */
const OGGI = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });

/* ---------- cosa pubblicare ----------
 * numero:  numerazione d'albo progressiva (3 = modulistica, 4 = allegati tecnici)
 * gruppo:  deve esistere in `gruppiAlbo` dentro src/data/rally.ts, altrimenti la riga
 *          non compare nella tabella
 * scarica: nome proposto al download, in minuscolo con i trattini
 * quando:  data di pubblicazione in albo (AAAA-MM-GG). Si può omettere: vale oggi.
 *          Con una data futura il documento resta nascosto sul sito fino a quel giorno
 *          (il filtro sta in src/lib/contenuti.ts), così si carica in anticipo e esce da solo.
 */
const LAVORI = [
  // 1.1 Regolamento Particolare di Gara: depositato il 28 ottobre 2026, firmato
  // dall'Organizzatore e visto dalla Delegazione Regionale, ancora senza numero di
  // approvazione ACI Sport. La pillola «In approvazione» in pagina arriva da
  // `documentiInApprovazione` in src/data/rally.ts, non da qui.
  { numero: '1.1', file: 'RPG_1_RALLY_COLLI_EUGANEI.pdf', titolo: 'Regolamento particolare di gara', gruppo: 'Regolamento e programma', scarica: 'regolamento-particolare-di-gara.pdf', quando: '2026-10-28', sostituisci: true },
  { numero: '1.2', file: 'PROGRAMMA_A.pdf', titolo: 'Programma', gruppo: 'Regolamento e programma', scarica: 'programma.pdf', quando: '2026-10-22', sostituisci: true },
  { numero: '1.4', file: 'TABELLA_DISTANZE_E_TEMPI_V3.pdf', titolo: 'Tabella distanze e tempi', gruppo: 'Regolamento e programma', scarica: 'tabella-distanze-e-tempi.pdf', quando: '2026-10-22', sostituisci: true },
  { numero: '1.3', file: 'CARTINA_PERCORSO_PS_E_SHAKEDOWN_V2.pdf', titolo: 'Cartina percorso PS 1-2-3-4-5-6 e shakedown', gruppo: 'Regolamento e programma', scarica: 'cartina-percorso-ps-1-2-3-4-5-6-e-shakedown.pdf', quando: '2026-10-22', sostituisci: true },
  { numero: '1.5', file: 'TASSE_DI_ISCRIZIONE_V1.pdf', titolo: 'Tasse di iscrizione', gruppo: 'Regolamento e programma', scarica: 'tasse-di-iscrizione.pdf', quando: '2026-10-22', sostituisci: true },
  { numero: '3.1', file: 'DICHIARAZIONE_2_CONDUTTORE.pdf', titolo: 'Dichiarazione 2° conduttore (MOD. 01)', gruppo: 'Modulistica', scarica: 'mod-01-dichiarazione-2-conduttore.pdf' },
  { numero: '3.2', file: 'DICHIARAZIONE_2_CONDUTTORE_NON_UNDER_23.pdf', titolo: 'Dichiarazione 2° conduttore non Under 23 (MOD. 02)', gruppo: 'Modulistica', scarica: 'mod-02-dichiarazione-2-conduttore-non-under-23.pdf' },
  { numero: '3.3', file: 'DICHIARAZIONE_1_CONDUTTORE_NEOPATENTATO.pdf', titolo: 'Dichiarazione 1° conduttore neopatentato (MOD. 03)', gruppo: 'Modulistica', scarica: 'mod-03-dichiarazione-1-conduttore-neopatentato.pdf' },
  { numero: '3.4', file: 'DICHIARAZIONE_VETTURA_RICOGNIZIONI.pdf', titolo: 'Dichiarazione vettura per ricognizioni (MOD. 04)', gruppo: 'Modulistica', scarica: 'mod-04-dichiarazione-vettura-ricognizioni.pdf' },
  { numero: '3.5', file: 'DICHIARAZIONE_MONTAGGIO_CAMERA_CAR.pdf', titolo: 'Dichiarazione montaggio camera car (MOD. 05)', gruppo: 'Modulistica', scarica: 'mod-05-dichiarazione-montaggio-camera-car.pdf' },
  { numero: '3.6', file: 'DICHIARAZIONE_CONFORMITA_ABBIGLIAMENTO_SICUREZZA.pdf', titolo: 'Dichiarazione conformità abbigliamento di sicurezza (mod. B ACI Sport)', gruppo: 'Modulistica', scarica: 'mod-b-dichiarazione-conformita-abbigliamento-di-sicurezza.pdf' },
  { numero: '3.7', file: 'MOD_06_RICHIESTA_SPAZIO_PARCO_ASSISTENZA_V5.pdf', titolo: 'Richiesta spazio parco assistenza (MOD. 06)', gruppo: 'Modulistica', scarica: 'mod-06-richiesta-spazio-parco-assistenza.pdf', quando: '2026-10-22', sostituisci: true },
  { numero: '3.8', file: 'MOD_07_DOMANDA_ISCRIZIONE_EQUIPAGGI_ESTERI_V7.pdf', titolo: 'Domanda di iscrizione equipaggi esteri (MOD. 07)', gruppo: 'Modulistica', scarica: 'mod-07-domanda-iscrizione-equipaggi-esteri.pdf', quando: '2026-10-22', sostituisci: true },
  { numero: '3.9', file: 'MOD_08_SCHEDA_ISCRIZIONE_RICOGNITORI_V4.pdf', titolo: 'Scheda iscrizione ricognitori (MOD. 08)', gruppo: 'Modulistica', scarica: 'mod-08-scheda-iscrizione-ricognitori.pdf', quando: '2026-10-22', sostituisci: true },
  { numero: '4.1', file: 'GUIDA_TRACKING_EQUIPAGGI.pdf', titolo: 'Guida al sistema di tracking — equipaggi', gruppo: 'Allegati tecnici', scarica: 'guida-tracking-equipaggi.pdf' },
  { numero: '4.2', file: 'GUIDA_TRACKING_MECCANICI_MONTAGGIO.pdf', titolo: 'Guida al sistema di tracking — meccanici, istruzioni di montaggio', gruppo: 'Allegati tecnici', scarica: 'guida-tracking-meccanici-montaggio.pdf' },
];

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
  writeFileSync('.trigger/albo-report.txt', righe.join('\n') + '\n');
}
const kb = (n) => (n >= 1024 * 1000 ? `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.round(n / 1024)} KB`);

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

/* ---------- esecuzione ---------- */
const MODO = PESI ? 'ALLINEAMENTO PESI (scrive)' : DATE ? 'ALLINEAMENTO DATE (scrive)' : RUN ? 'ESECUZIONE' : 'simulazione (nessuna scrittura)';
log(`Albo di gara — ${MODO} — ${new Date().toLocaleString('it-IT')}`);
log(`Data di pubblicazione: ${OGGI}`);
log('');

await token();

// 1 · cartella di destinazione, ricavata da un PDF già caricato
let cartella = '';
for (const id of [RIFERIMENTO, RIFERIMENTO.replace(/\.pdf$/, '')]) {
  const rif = await api(`/site-media/v1/files/${encodeURIComponent(id)}`, undefined, 'GET');
  if (!rif.ok) continue;
  const d = JSON.parse(rif.corpo).file ?? JSON.parse(rif.corpo);
  cartella = d.parentFolderId;
  log(`Cartella di destinazione: ${cartella}  (dedotta da ${d.displayName ?? id})`);
  break;
}
if (!cartella) {
  log('Non sono riuscito a leggere il file di riferimento: i PDF andranno nella cartella radice del Media Manager.');
  log('Non è un problema per il sito (i link sono assoluti), solo per l\'ordine del pannello.');
}

// 2 · righe già presenti nell'albo
const q = await api('/wix-data/v2/items/query', { dataCollectionId: 'Documenti', query: { paging: { limit: 200 } }, returnTotalCount: false });
if (!q.ok) { log(`ERRORE lettura collection Documenti (${q.status}): ${q.corpo.slice(0, 300)}`); salva(); process.exit(1); }
const items = JSON.parse(q.corpo).dataItems ?? [];
log(`Collection Documenti: ${items.length} righe già presenti`);
log('');

if (PESI) {
  let sistemati = 0;
  for (const L of LAVORI) {
    const percorso = `${CARTELLA_FILE}/${L.file}`;
    const riga = items.find(i => String(i.data?.numero ?? '') === L.numero && String(i.data?.evento ?? '') === 'rally');
    if (!riga || !existsSync(percorso)) continue;
    const nomeFile = `PDF · ${kb(statSync(percorso).size)}`;
    if (riga.data.nomeFile === nomeFile) continue;
    const id = riga.id ?? riga.data._id;
    const esito = await api(`/wix-data/v2/items/${id}`, { dataCollectionId: 'Documenti', dataItem: { id, data: { ...riga.data, nomeFile } } }, 'PUT');
    log(`— ${L.numero}  "${riga.data.nomeFile}" → "${nomeFile}"${esito.ok ? '' : `  ! fallito (${esito.status}): ${esito.corpo.slice(0, 200)}`}`);
    if (esito.ok) sistemati++;
  }
  log('');
  log(`Fatto: ${sistemati} righe sistemate.`);
  salva();
  process.exit(0);
}

/* --date: sposta la data di uscita di una riga gia creata.
 * Lo script normale non tocca le righe esistenti, quindi cambiare `quando` in LAVORI
 * non basta: serve questo passaggio. Una riga gia pubblica (data non futura) non si
 * sposta, perche il documento e gia in giro: li vale la regola della revisione. */
if (DATE) {
  let spostate = 0;
  for (const L of LAVORI) {
    if (!L.quando) continue;
    const riga = items.find(i => String(i.data?.numero ?? '') === L.numero && String(i.data?.evento ?? '') === 'rally');
    if (!riga) { log(`— ${L.numero}  nessuna riga in albo: la crea lo script normale`); continue; }
    const attuale = String(riga.data?.pubblicatoIl ?? '').slice(0, 10);
    if (attuale === L.quando) { log(`— ${L.numero}  gia a posto (${attuale})`); continue; }
    if (attuale && attuale <= OGGI) {
      log(`— ${L.numero}  ! gia pubblica dal ${attuale}: non la sposto, vale la regola della revisione`);
      continue;
    }
    const id = riga.id ?? riga.data._id;
    const esito = await api(`/wix-data/v2/items/${id}`, { dataCollectionId: 'Documenti', dataItem: { id, data: { ...riga.data, pubblicatoIl: L.quando } } }, 'PUT');
    log(`— ${L.numero}  ${attuale || '(vuota)'} → ${L.quando}${esito.ok ? '' : `  ! fallito (${esito.status}): ${esito.corpo.slice(0, 200)}`}`);
    if (esito.ok) spostate++;
  }
  log('');
  log(`Fatto: ${spostate} date spostate.`);
  salva();
  process.exit(0);
}

let fatti = 0;
for (const L of LAVORI) {
  const percorso = `${CARTELLA_FILE}/${L.file}`;
  log(`— ${L.numero}  ${L.titolo}`);
  if (!existsSync(percorso)) { log(`  ! file mancante: ${percorso}`); continue; }
  const buf = readFileSync(percorso);
  const peso = kb(statSync(percorso).size);
  log(`  file: ${L.file} · ${peso}`);

  const doppio = items.find(i => String(i.data?.numero ?? '') === L.numero && String(i.data?.evento ?? '') === 'rally');
  const quando = L.quando ?? OGGI;
  const uscita = doppio ? String(doppio.data?.pubblicatoIl ?? '').slice(0, 10) : '';
  const giaPubblico = !!doppio && uscita <= OGGI;
  if (doppio && (!L.sostituisci || giaPubblico)) {
    log(`  ! esiste già una riga con numero ${L.numero} ("${doppio.data?.titolo}"): la salto, non sovrascrivo l'albo`);
    if (L.sostituisci && giaPubblico) log(`    (è già pubblica dal ${uscita}: una modifica va pubblicata come versione nuova, riga nuova + "superato" sulla vecchia)`);
    continue;
  }
  if (doppio) log(`  riga già in albo ma non ancora pubblicata (esce il ${uscita}): sostituisco il file, nessun link è ancora in giro`);
  if (quando > OGGI) log(`  pubblicazione datata ${quando}: resta nascosto sul sito fino a quel giorno`);
  if (!RUN) { log(`  → in esecuzione caricherebbe il PDF e ${doppio ? 'sostituirebbe il file nella riga' : 'creerebbe la riga'} (gruppo "${L.gruppo}", ${quando})`); continue; }

  // 2a · indirizzo di caricamento
  const corpoGen = { mimeType: 'application/pdf', fileName: L.scarica };
  if (cartella) corpoGen.parentFolderId = cartella;
  const gen = await api('/site-media/v1/files/generate-upload-url', corpoGen);
  if (!gen.ok) {
    log(`  ! generate-upload-url fallita (${gen.status}): ${gen.corpo.slice(0, 300)}`);
    if (gen.status === 403) log("    (l'app OAuth non ha i permessi sul Media Manager: carica i PDF dal pannello Wix, cartella sito-documenti, e avvisami)");
    continue;
  }
  const u = new URL(JSON.parse(gen.corpo).uploadUrl); u.searchParams.set('filename', L.scarica);

  // 2b · caricamento binario
  const up = await fetch(u, { method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body: buf });
  const upTesto = await up.text();
  if (!up.ok) { log(`  ! caricamento fallito (${up.status}): ${upTesto.slice(0, 300)}`); continue; }
  const f = JSON.parse(upTesto).file ?? JSON.parse(upTesto);
  const fileId = f.id ?? f.fileId;
  if (!fileId) { log(`  ! risposta senza id file: ${upTesto.slice(0, 300)}`); continue; }

  // 2c · indirizzo pubblico del PDF (?dn= = nome proposto al download)
  const base = f.url && /^https?:/.test(f.url)
    ? f.url
    : `https://${SITE_ID}.usrfiles.com/ugd/${fileId.endsWith('.pdf') ? fileId : fileId + '.pdf'}`;
  const href = `${base}${base.includes('?') ? '&' : '?'}dn=${L.scarica}`;
  log(`  caricato: ${fileId}`);
  log(`  indirizzo: ${href}`);

  // 2d · verifica che il link risponda davvero prima di scriverlo in albo
  try {
    const h = await fetch(href, { method: 'HEAD' });
    log(`  verifica link: ${h.status}${h.ok ? ' ok' : ' — ATTENZIONE: il link non risponde'}`);
  } catch (e) { log(`  verifica link non riuscita: ${String(e).slice(0, 120)}`); }

  // 2e · riga in albo: sostituzione del file se la riga c'è già e non è ancora uscita
  let esito;
  if (doppio) {
    const id = doppio.id ?? doppio.data._id;
    const data = { ...doppio.data, titolo: L.titolo, gruppo: L.gruppo, pubblicatoIl: quando, file: href, nomeFile: `PDF · ${peso}` };
    esito = await api(`/wix-data/v2/items/${id}`, { dataCollectionId: 'Documenti', dataItem: { id, data } }, 'PUT');
  } else {
    const data = {
      evento: 'rally', numero: L.numero, titolo: L.titolo, gruppo: L.gruppo,
      versione: '1', pubblicatoIl: quando, file: href, nomeFile: `PDF · ${peso}`,
      superato: false,
    };
    esito = await api('/wix-data/v2/items', { dataCollectionId: 'Documenti', dataItem: { data } });
  }
  if (!esito.ok) { log(`  ! scrittura nel CMS fallita (${esito.status}): ${esito.corpo.slice(0, 300)}`); continue; }
  log(doppio ? '  file sostituito nella riga esistente' : '  riga creata in albo');
  fatti++;
}

log('');
log(RUN ? `Fatto: ${fatti} documenti su ${LAVORI.length}.` : 'Simulazione conclusa. Rilancia con --run per applicare.');
log('Il sito legge il CMS con una cache di 5 minuti: i documenti compaiono entro pochi minuti, senza release.');
salva();
