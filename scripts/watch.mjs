#!/usr/bin/env node
/**
 * Ponte tra la sessione cloud e il Mac.
 * Resta in ascolto su .trigger/deploy: quando il file cambia, esegue build → preview → commit
 * e scrive l'esito in .trigger/result.txt (che la sessione cloud legge dal ponte).
 * Non lancia MAI `wix release`.
 *
 * Avvio:  node scripts/watch.mjs      (da lasciare aperto in un Terminale)
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, appendFileSync } from 'node:fs';

const DIR = '.trigger';
const TRIG = `${DIR}/deploy`, RES = `${DIR}/result.txt`, LOG = `${DIR}/log.txt`;
if (!existsSync(DIR)) mkdirSync(DIR);
if (!existsSync(TRIG)) writeFileSync(TRIG, '');
let last = statSync(TRIG).mtimeMs;
let busy = false;

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', shell: process.platform === 'win32', maxBuffer: 50 * 1024 * 1024 });
  const out = (r.stdout || '') + (r.stderr || '');
  appendFileSync(LOG, `\n$ ${cmd} ${args.join(' ')}\n${out}\n`);
  return { ok: r.status === 0, out };
};
const stamp = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

function deploy() {
  if (busy) return; busy = true;
  const msg = (readFileSync(TRIG, 'utf8').trim() || 'Aggiornamento').split('\n')[0].slice(0, 120);
  writeFileSync(RES, `IN CORSO ${stamp()}\nmessaggio: ${msg}\n`);
  writeFileSync(LOG, `=== ${stamp()} · ${msg} ===\n`);
  console.log(`\n▶ ${stamp()} · ${msg}`);

  const b = run('npm', ['run', 'build']);
  if (!b.ok) {
    const err = b.out.split('\n').filter(l => /error|Error|ERR|✘|\[vite\]|astro/i.test(l)).slice(0, 25).join('\n');
    writeFileSync(RES, `ERRORE BUILD ${stamp()}\nmessaggio: ${msg}\n\n${err || b.out.slice(-3000)}\n`);
    console.log('✘ build fallita — dettagli in .trigger/log.txt'); busy = false; return;
  }
  const p = run('npm', ['run', 'preview']);
  const url = (p.out.match(/https?:\/\/[^\s"'<>]+wix-site-host\.com[^\s"'<>]*/) || [])[0] || '';
  let git = 'nessuna modifica da committare';
  const st = run('git', ['status', '--porcelain']);
  if (st.out.trim()) {
    run('git', ['add', '-A']);
    const c = run('git', ['commit', '-m', msg]);
    git = c.ok ? (c.out.match(/\[[^\]]+\]/) || ['commit ok'])[0] : 'commit FALLITO';
  }
  const res = `${p.ok && url ? 'OK' : 'ERRORE PREVIEW'} ${stamp()}\nmessaggio: ${msg}\npreview: ${url || '(nessun URL trovato)'}\ngit: ${git}\n`;
  writeFileSync(RES, res);
  console.log(res);
  busy = false;
}

console.log('In ascolto su .trigger/deploy — Ctrl+C per fermare. Non lancio mai release.');
setInterval(() => {
  try {
    const m = statSync(TRIG).mtimeMs;
    if (m !== last) { last = m; deploy(); }
  } catch {}
}, 1500);
