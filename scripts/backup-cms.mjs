#!/usr/bin/env node
/**
 * Copia di sicurezza del CMS.
 *
 *   npm run backup              → usa l'ultima anteprima scritta dal watcher in .trigger/result.txt
 *   npm run backup -- <url>     → usa un indirizzo preciso (es. https://www.inversioneau.com)
 *
 * Scrive backup/cms-AAAA-MM-GG.json. Va committato: così la copia finisce anche su origin.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const CHIAVE = '7ed26d0a05dd7388b4fd05c6';

function base() {
  const arg = process.argv[2];
  if (arg) return arg.replace(/\/+$/, '');
  const res = existsSync('.trigger/result.txt') ? readFileSync('.trigger/result.txt', 'utf8') : '';
  const url = (res.match(/preview:\s*(\S+)/) || [])[1];
  if (!url || !url.startsWith('http')) {
    console.error('Nessun indirizzo. Lancia una build col watcher, oppure: npm run backup -- https://www.inversioneau.com');
    process.exit(1);
  }
  return url.replace(/\/+$/, '');
}

const url = `${base()}/servizio/backup-cms.json?k=${CHIAVE}`;
const r = await fetch(url);
if (!r.ok) { console.error(`Errore ${r.status} su ${base()}/servizio/backup-cms.json`); process.exit(1); }
const testo = await r.text();

let dati;
try { dati = JSON.parse(testo); } catch { console.error('Risposta non valida (non è JSON).'); process.exit(1); }

if (!existsSync('backup')) mkdirSync('backup');
const oggi = new Date().toISOString().slice(0, 10);
const file = `backup/cms-${oggi}.json`;
writeFileSync(file, testo);

const righe = Object.entries(dati.conteggio || {});
const totale = righe.reduce((n, [, v]) => n + (typeof v === 'number' ? v : 0), 0);
console.log(`\n✔ ${file} — ${(testo.length / 1024).toFixed(0)} KB · ${totale} righe in ${righe.length} collection`);
for (const [c, n] of righe) console.log(`  ${String(n).padStart(5)}  ${c}`);
const rotte = righe.filter(([, v]) => typeof v !== 'number');
if (rotte.length) console.log(`\n⚠ non lette: ${rotte.map(([c]) => c).join(', ')}`);
console.log('\nRicordati di committare la cartella backup/.\n');
