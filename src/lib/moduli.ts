/**
 * Moduli del sito → Wix Forms (app installata sul progetto headless, 19/8/2026).
 * Piano attuale (Free): massimo 4 moduli da 10 campi → quattro schemi condivisi:
 *   richieste  = contatti, richieste dagli hub evento, rally, tessera (campo `contesto` distingue la provenienza)
 *   sponsor    = diventa sponsor
 *   accrediti  = accrediti stampa (i dettagli secondari sono riassunti nel campo `dettagli`)
 *   avvisami   = avviso apertura iscrizioni rally
 * Con il piano Core i moduli si possono separare e i campi sdoppiare senza toccare il markup (cambia solo questa mappa).
 * L'invio passa dal server (src/pages/api/modulo.ts) con l'autenticazione ambientale di @wix/astro (visitor).
 * Ogni invio arriva nel pannello Wix (Forms → Submissions), crea/aggiorna il contatto (nome, email, azienda)
 * e può notificare via email lo staff (impostazione dal pannello: Automazioni).
 */
import { httpClient } from '@wix/essentials';

export type ChiaveModulo = 'richieste' | 'sponsor' | 'accrediti' | 'avvisami';
export const MODULI: Record<ChiaveModulo, { formId: string; campi: string[]; obbligatori: string[] }> = {
  richieste: { formId: '58be8c4a-37c4-4da2-ba7d-83b6ed700efd', campi: ['contesto', 'nome', 'email', 'telefono', 'motivo', 'messaggio', 'privacy'], obbligatori: ['contesto', 'nome', 'email'] },
  sponsor:   { formId: 'ad28a62b-17e3-49a7-9748-3d97f132f7e0', campi: ['azienda', 'referente', 'email', 'telefono', 'evento', 'pacchetto', 'budget', 'note', 'privacy'], obbligatori: ['azienda', 'referente', 'email', 'privacy'] },
  accrediti: { formId: 'a4d9ce0f-842e-4002-bf32-f424e29c0689', campi: ['evento', 'ruolo', 'nome', 'testata', 'email', 'cellulare', 'dettagli', 'privacy'], obbligatori: ['evento', 'ruolo', 'nome', 'testata', 'email', 'cellulare', 'privacy'] },
  avvisami:  { formId: '4e7b8a9b-439b-4792-a0f1-70a6cd117f60', campi: ['email', 'evento'], obbligatori: ['email'] },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const s = (v: unknown) => (typeof v === 'string' ? v.trim() : v === true ? 'sì' : '');
const si = (v: unknown) => v === true || v === 'on' || v === 'true' || v === 'sì';

/** Dal payload del sito (campi del markup) ai campi dello schema Wix. Restituisce errori in italiano se qualcosa manca. */
export function prepara(modulo: ChiaveModulo, d: Record<string, unknown>): { valori: Record<string, unknown>; errori: string[] } {
  const errori: string[] = [];
  let valori: Record<string, unknown> = {};
  if (modulo === 'richieste') {
    const contesto = s(d.contesto) || 'sito';
    let motivo = s(d.motivo);
    if (contesto === 'tessera') motivo = ['Tessera', s(d.tessera)].filter(Boolean).join(': ');
    valori = { contesto, nome: s(d.nome), email: s(d.email), telefono: s(d.telefono), motivo, messaggio: s(d.messaggio), privacy: si(d.privacy) };
    if (!si(d.privacy)) errori.push('Consenso privacy: è obbligatorio');
    if (contesto !== 'tessera' && !valori.messaggio) errori.push('Messaggio: è obbligatorio');
  } else if (modulo === 'sponsor') {
    const note = [s(d.settore) && `Settore: ${s(d.settore)}`, si(d.presentazione) && 'Vuole ricevere la presentazione sponsor in PDF', s(d.note)].filter(Boolean).join('\n');
    valori = { azienda: s(d.azienda), referente: s(d.referente), email: s(d.email), telefono: s(d.telefono), evento: s(d.evento), pacchetto: s(d.pacchetto), budget: s(d.budget), note, privacy: si(d.privacy) };
  } else if (modulo === 'accrediti') {
    const giorni = ['sabato', 'domenica'].filter(g => si(d[g]));
    const mezzi = ['fotocamera', 'videocamera', 'drone'].filter(m => si(d[m]));
    if (!giorni.length) errori.push('Giorni di presenza: seleziona almeno una voce');
    if (!si(d.regolamento)) errori.push('Regolamento di sicurezza: è obbligatorio');
    if (si(d.drone) && !s(d.enac)) errori.push('Registrazione ENAC del drone: è obbligatoria se porti il drone');
    const dettagli = [
      s(d.tessera) && `Tessera / documento: ${s(d.tessera)}`,
      s(d.operatori) && `Operatori: ${s(d.operatori)}${s(d.altri_operatori) ? ` (${s(d.altri_operatori)})` : ''}`,
      `Giorni: ${giorni.join(', ') || '—'}`,
      `Mezzi: ${mezzi.join(', ') || '—'}${si(d.drone) ? ` · ENAC/d-Flight: ${s(d.enac)}` : ''}`,
      (s(d.targa) || s(d.veicolo)) && `Veicolo: ${[s(d.veicolo), s(d.targa)].filter(Boolean).join(' · targa ')}`,
      `Regolamento di sicurezza accettato: ${si(d.regolamento) ? 'sì' : 'no'}`,
      s(d.note) && `Note: ${s(d.note)}`,
    ].filter(Boolean).join('\n');
    valori = { evento: s(d.evento), ruolo: s(d.ruolo), nome: s(d.nome), testata: s(d.testata), email: s(d.email), cellulare: s(d.cellulare), dettagli, privacy: si(d.privacy) };
  } else if (modulo === 'avvisami') {
    valori = { email: s(d.email), evento: s(d.evento) || 'Rally Colli Euganei 2026' };
  }
  const m = MODULI[modulo];
  for (const k of m.obbligatori) { const v = valori[k]; if (v === '' || v === undefined || v === false) errori.push(`${ETICHETTE[k] ?? k}: è obbligatorio`); }
  if (valori.email && !EMAIL_RE.test(String(valori.email))) errori.push('Email: non è valida');
  // niente campi vuoti verso Wix (stringhe vuote su campi opzionali sono accettate, ma teniamo pulito il pannello)
  for (const k of Object.keys(valori)) if (valori[k] === '' || valori[k] === false) delete valori[k];
  return { valori, errori: [...new Set(errori)] };
}
const ETICHETTE: Record<string, string> = { contesto: 'Provenienza', nome: 'Nome e cognome', email: 'Email', azienda: 'Azienda', referente: 'Referente', privacy: 'Consenso privacy', evento: 'Evento', ruolo: 'Ruolo', testata: 'Testata', cellulare: 'Cellulare', messaggio: 'Messaggio' };

/** Invia a Wix Forms. Lancia un errore con messaggio leggibile se Wix rifiuta. */
export async function inviaWix(modulo: ChiaveModulo, valori: Record<string, unknown>): Promise<string> {
  const r = await httpClient.fetchWithAuth('https://www.wixapis.com/form-submission-service/v4/submissions', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submission: { formId: MODULI[modulo].formId, submissions: valori } }),
  });
  if (!r.ok) { const t = await r.text(); console.error('[moduli]', modulo, r.status, t.slice(0, 300)); throw new Error('wix ' + r.status); }
  const j = await r.json();
  return j.submission?.id ?? '';
}
