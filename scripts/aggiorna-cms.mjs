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

/* ---------- news del rally: ne resta una sola, riscritta ---------- */
const NEWS_VIA = ['iscrizioni-aperte-rally-colli-euganei', 'rally-zone-pubblico', 'rally-ricognizioni-date-regole'];
const NEWS_UFFICIALE = {
  sommario: `Formula Rally Sprint, due prove speciali con tre passaggi ciascuna, 20–35 km cronometrati. Dopo più di 35 anni un rally torna nel Padovano.`,
  lead: `Il 1° Rally Colli Euganei ACI Sport si corre il 21 e 22 novembre 2026 sulle strade dei Colli Euganei. Gara a cronometro su strade chiuse, ingresso libero per il pubblico.`,
  data: '2026-08-28',
  credito: 'Foto: Inversione A U',
  cta2Label: 'Informazioni per il pubblico',
  cta2Url: 'https://www.inversioneau.com/rally-colli-euganei/spettatori/',
  corpo: `<p>Il 1° Rally Colli Euganei ACI Sport si corre <strong>sabato 21 e domenica 22 novembre 2026</strong>, sulle strade dei Colli Euganei, in provincia di Padova. Lo organizza Inversione A U A.S.D. Dopo più di trentacinque anni un rally torna a correre nel Padovano.</p>
<p>Non è una rievocazione e non è un raduno: è una gara a cronometro su strade chiuse al traffico, con licenze, ufficiali di gara, classifica e regolamento particolare depositato.</p>
<h2>La formula</h2>
<p>ACI Sport ha iscritto la manifestazione a calendario come <strong>atipica sperimentale</strong> del settore rally, nella formula del <strong>Rally Sprint</strong>: poche prove speciali ripetute più volte, tutte nella stessa area, invece di una gara distesa su lunghi trasferimenti. Il sabato è dedicato alle verifiche sportive e tecniche e allo shakedown; la gara si corre la domenica.</p>
<p>Il percorso prevede <strong>due prove speciali con tre passaggi ciascuna</strong>: sei tratti cronometrati, per 20–35 chilometri contro il tempo. Tracciato, chilometraggi esatti e orari di passaggio si pubblicano con i documenti di gara, un mese prima della gara.</p>
<h2>Dove si corre</h2>
<p>Si corre dentro un parco regionale: 18.694 ettari su quindici comuni, un centinaio di rilievi di origine vulcanica in mezzo alla pianura. È un contesto che impone delle regole, e le abbiamo scritte per tempo: strade chiuse solo per le ore necessarie, zone pubblico delimitate e presidiate dai commissari, nessun fuoco e nessun fumogeno lungo il percorso, rispetto di vigne, coltivi e proprietà private.</p>
<p>Chi abita o lavora sulle strade interessate trova nella <a href="/rally-colli-euganei/residenti/">pagina dedicata ai residenti</a> gli orari di chiusura, cosa succede il giorno di gara e un contatto diretto per le necessità particolari. Chiediamo di segnalarle prima, non la mattina della gara: quasi tutto si risolve con una telefonata fatta per tempo.</p>
<h2>Per i concorrenti</h2>
<p>Le iscrizioni aprono a breve: la data viene annunciata su questo sito e nell'<a href="/rally-colli-euganei/documenti/">albo di gara</a>. La chiusura è prevista per il 6 novembre 2026 e sarà confermata dal regolamento particolare.</p>
<p>Licenze ammesse, vetture e requisiti seguono le disposizioni ACI Sport per questo evento: la validità della propria licenza si verifica sul <a href="https://www.acisport.it/it/acisport" target="_blank" rel="noopener">sito ACI Sport</a>. Il resto — scheda gara, scadenze, documenti in evidenza, elenco iscritti — è nell'<a href="/rally-colli-euganei/concorrenti/">area concorrenti</a>.</p>
<h2>Per il pubblico</h2>
<p>L'ingresso è libero. Le zone da cui si assiste alla gara sono scelte dall'organizzazione, delimitate e presidiate, con un accesso a piedi e un punto dove lasciare l'auto: vengono pubblicate insieme alla mappa del percorso. Programma, regole di sicurezza e come arrivare sono nella <a href="/rally-colli-euganei/spettatori/">pagina spettatori</a>.</p>
<dl>
<dt>Data</dt><dd>21–22 novembre 2026</dd>
<dt>Dove</dt><dd>Colli Euganei, provincia di Padova</dd>
<dt>Formula</dt><dd>Rally Sprint · atipica sperimentale ACI Sport</dd>
<dt>Prove speciali</dt><dd>2 prove, 3 passaggi ciascuna</dd>
<dt>Km cronometrati</dt><dd>20–35 km</dd>
<dt>Ingresso</dt><dd>Libero</dd>
</dl>
<p>Informazioni sulla gara: <a href="mailto:rallycollieuganei@gmail.com">rallycollieuganei@gmail.com</a> · organizzazione: <a href="mailto:inversione.au3@gmail.com">inversione.au3@gmail.com</a>.</p>`,
};

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
    if (coll === 'Sponsor' && String(item.data.nome ?? '').trim().toLowerCase() === 'ctrl+g' && item.data.logo) {
      // il marchio nuovo sta nel repository (public/img/sponsor/ctrlg.png): libero il campo del Media Manager
      item.data.logo = '';
      campi.push('logo→statico (marchio nuovo)');
    }
    if (coll === 'Sponsor' && String(item.data.nome ?? '').trim().toLowerCase() === 'duo') {
      // il file duo.png non esiste più nel Media Manager: si passa al logo statico del repository
      item.data.nome = 'Donolauto';
      item.data.logo = '';
      campi.push('nome→Donolauto · logo→statico');
    }
    if (coll === 'News') {
      const slug = String(item.data.slug ?? '');
      if (NEWS_VIA.includes(slug) && item.data.pubblicato !== false) {
        item.data.pubblicato = false; campi.push('pubblicato→no (news archiviata)');
      }
      if (slug === 'rally-colli-euganei-ufficiale') {
        for (const [k, v] of Object.entries(NEWS_UFFICIALE)) if (item.data[k] !== v) { item.data[k] = v; campi.push(k); }
      }
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
