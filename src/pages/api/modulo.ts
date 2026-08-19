/**
 * POST /api/modulo — riceve i moduli del sito (JSON o form-data) e li inoltra a Wix Forms.
 * Difese: stessa origine, honeypot (`sito_web` deve restare vuoto), limite di 6 invii ogni 10 minuti per IP, validazione server.
 * Risposta JSON: { ok: true, messaggio } oppure { ok: false, errori: [] }.
 */
import type { APIRoute } from 'astro';
import { MODULI, prepara, inviaWix, type ChiaveModulo } from '../../lib/moduli';

const GRAZIE: Record<ChiaveModulo, string> = {
  richieste: 'Grazie, abbiamo ricevuto il messaggio. Rispondiamo entro 3 giorni lavorativi a ',
  sponsor: 'Grazie, abbiamo ricevuto la richiesta. Ti ricontattiamo entro 3 giorni lavorativi a ',
  accrediti: 'Richiesta di accredito ricevuta. Confermiamo via email prima dell\'evento a ',
  avvisami: 'Fatto: ti avvisiamo all\'apertura delle iscrizioni a ',
};
const finestra = new Map<string, number[]>(); // ip → timestamp invii
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  // stessa origine (il modulo è inviato dalle pagine del sito)
  const origin = request.headers.get('origin'); const host = request.headers.get('host');
  if (origin && host && !origin.endsWith('//' + host)) return json({ ok: false, errori: ['Richiesta non valida.'] }, 403);
  // lettura corpo
  let d: Record<string, unknown> = {};
  const ct = request.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) d = await request.json();
    else { const fd = await request.formData(); fd.forEach((v, k) => { d[k] = typeof v === 'string' ? v : ''; }); }
  } catch { return json({ ok: false, errori: ['Dati non leggibili.'] }, 400); }
  const modulo = String(d.modulo || '') as ChiaveModulo;
  if (!MODULI[modulo]) return json({ ok: false, errori: ['Modulo sconosciuto.'] }, 400);
  if (String(d.sito_web || '').trim()) return json({ ok: true, messaggio: 'Grazie.' }); // honeypot: rispondiamo ok senza inviare
  // limite per IP
  let ip = 'x'; try { ip = ctx.clientAddress; } catch { ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'x'; } // clientAddress può non essere disponibile sull'hosting Wix
  const ora = Date.now(); const rec = (finestra.get(ip) || []).filter(t => ora - t < 600_000);
  if (rec.length >= 6) return json({ ok: false, errori: ['Troppi invii in pochi minuti: riprova più tardi o scrivi a inversione.au3@gmail.com.'] }, 429);
  const { valori, errori } = prepara(modulo, d);
  if (errori.length) return json({ ok: false, errori }, 422);
  try {
    await inviaWix(modulo, valori);
    rec.push(ora); finestra.set(ip, rec);
    return json({ ok: true, messaggio: GRAZIE[modulo] + String(valori.email || '') + '.' });
  } catch {
    return json({ ok: false, errori: ['Invio non riuscito in questo momento. Riprova tra poco o scrivi a inversione.au3@gmail.com.'], fallback: true }, 502);
  }
};
export const GET: APIRoute = () => json({ ok: false, errori: ['Usa POST.'] }, 405);
