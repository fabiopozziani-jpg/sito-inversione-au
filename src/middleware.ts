/**
 * Rinvio del 18/11/2026 — regola di Fabio:
 *  · le date del rally («21–22 novembre», «21 e 22 novembre», «sabato 21 e domenica 22 novembre»)
 *    si barrano in rosso e ci si affianca «Rinviato» in rosso, su tutto il sito;
 *  · le date dei singoli momenti di gara («sabato 21 novembre», «domenica 22 novembre»…) si barrano
 *    soltanto (anche fuori dalle pagine del rally, es. /stampa/accrediti/). Gli orari si barrano nei template (percorso, concorrenti).
 * Si spegne con `rinvio.attivo = false` in src/data/rally.ts.
 * Tocca solo il testo visibile: mai attributi, <head>, <script>, <style>, <svg>, <textarea>, <select>,
 * né il testo già barrato (<s>). Esclusi gli articoli /news/<slug>/: sono comunicati datati.
 */
import { defineMiddleware } from 'astro:middleware';
import { rinvio } from './data/rally';

const RANGE = String.raw`\b(?:sabato\s+)?21(?:\s*(?:–|-|&ndash;|&#8211;)\s*|\s+e\s+(?:domenica\s+)?)22\s+nov(?:embre(?![a-z])|\.|(?![a-z]))(?:\s+2026)?`;
const GIORNO = String.raw`\b(?:(?:venerd(?:ì|i|&igrave;)|sabato|domenica)\s+)?(?:20|21|22)\s+nov(?:embre(?![a-z])|\.|(?![a-z]))(?:\s+2026)?(?!\s*\d)`;
const SOLO_RANGE = new RegExp(`(${RANGE})`, 'gi');
const CON_GIORNI = new RegExp(`(${RANGE})|(${GIORNO})`, 'gi');
const SALTA = new Set(['head', 'script', 'style', 'svg', 'textarea', 'select', 'noscript', 'title', 's']);

const conTag = (d: string) => `<span class="rinvio-data"><s>${d}</s> <span class="rinvio-data__tag">Rinviato</span></span>`;
const soloBarra = (d: string) => `<span class="rinvio-data"><s>${d}</s></span>`;

export function barraDate(html: string, giorni = false): string {
  const re = giorni ? CON_GIORNI : SOLO_RANGE;
  const parti = html.split(/(<[^>]*>)/);
  let salta: string | null = null;
  for (let i = 0; i < parti.length; i++) {
    const p = parti[i];
    if (p.startsWith('<')) {
      const m = /^<(\/?)([a-zA-Z][\w-]*)/.exec(p);
      if (!m) continue;
      const nome = m[2].toLowerCase();
      if (salta) { if (m[1] && nome === salta) salta = null; continue; }
      if (!m[1] && SALTA.has(nome) && !p.endsWith('/>')) salta = nome;
      continue;
    }
    if (salta || !p) continue;
    re.lastIndex = 0;
    if (!re.test(p)) continue;
    re.lastIndex = 0;
    parti[i] = p.replace(re, (d: string, r?: string) => (r ? conTag(d) : soloBarra(d)));
  }
  return parti.join('');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const res = await next();
  if (!rinvio.attivo) return res;
  const path = context.url.pathname;
  if (/^\/news\/[^/]+/.test(path)) return res;
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) return res;
  const html = await res.text();
  const headers = new Headers(res.headers);
  headers.delete('content-length');
  return new Response(barraDate(html, true), { status: res.status, statusText: res.statusText, headers });
});
