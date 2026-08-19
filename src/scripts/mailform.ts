/**
 * Moduli del sito: validazione lato client, elenco errori accessibile, invio a /api/modulo (→ Wix Forms).
 * Stati: invio in corso (pulsante disabilitato), conferma (role=status), errore con riserva "mailto" (non si perde mai un messaggio).
 * Attributi: form[data-mailform data-modulo data-to data-subject]; [data-errors] riquadro errori; [data-almeno-una] gruppi di caselle.
 */
const NOMI: Record<string, string> = { privacy: 'Consenso privacy', regolamento: 'Regolamento di sicurezza', presentazione: 'Presentazione sponsor' };
const label = (el: HTMLElement) => {
  const name = el.getAttribute('name') || '';
  if (NOMI[name]) return NOMI[name];
  const l = el.closest('label')?.querySelector('.lab, .field > span, span')?.textContent?.replace('*', '').split('—')[0].trim();
  return l || name || 'Campo';
};
const mailtoDi = (f: HTMLFormElement) => {
  const d = new FormData(f); const rows: string[] = []; let testo = '';
  for (const [k, v] of d.entries()) {
    if (k === 'sito_web') continue;
    if (k === 'messaggio' || k === 'note') { testo = String(v); continue; }
    const el = f.querySelector<HTMLElement>(`[name="${k}"]`);
    rows.push(`${el ? label(el) : k}: ${v === 'on' ? 'sì' : v}`);
  }
  return `mailto:${f.dataset.to}?subject=${encodeURIComponent(f.dataset.subject ?? '')}&body=${encodeURIComponent(rows.join('\n') + (testo ? '\n\n' + testo : ''))}`;
};
document.querySelectorAll<HTMLFormElement>('form[data-mailform]').forEach(f => {
  const errBox = f.querySelector<HTMLElement>('[data-errors]');
  const msg = f.querySelector<HTMLElement>('.form-msg');
  const btn = f.querySelector<HTMLButtonElement>('button[type=submit]');
  // honeypot: campo invisibile che i visitatori non compilano
  const hp = document.createElement('input'); hp.type = 'text'; hp.name = 'sito_web'; hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true');
  hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0'; f.appendChild(hp);
  const mostraErrori = (errors: string[]) => {
    if (errBox) { errBox.hidden = false; errBox.innerHTML = '<span class="err">Controlla questi campi:</span>' + errors.map(x => `<span>${x}</span>`).join(''); errBox.focus?.(); }
    else if (msg) msg.textContent = errors.length === 1 ? errors[0] : 'Controlla i campi evidenziati.';
  };
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const fields = Array.from(f.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'));
    const errors: string[] = [];
    fields.forEach(el => {
      el.removeAttribute('aria-invalid');
      if (!el.checkValidity()) { el.setAttribute('aria-invalid', 'true'); errors.push(`${label(el)}: ${el.validity.valueMissing ? 'è obbligatorio' : 'non è valido'}`); }
    });
    f.querySelectorAll<HTMLElement>('[data-almeno-una]').forEach(g => {
      const any = Array.from(g.querySelectorAll<HTMLInputElement>('input[type=checkbox]')).some(c => c.checked);
      if (!any) errors.push(`${g.dataset.almenoUna}: seleziona almeno una voce`);
    });
    if (errors.length) { mostraErrori(errors); f.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
    if (errBox) errBox.hidden = true;
    if (!f.dataset.modulo) { location.href = mailtoDi(f); return; }
    // invio al server
    const dati: Record<string, string | boolean> = { modulo: f.dataset.modulo };
    for (const el of fields) {
      if (!el.name) continue;
      if (el instanceof HTMLInputElement && el.type === 'checkbox') dati[el.name] = el.checked;
      else dati[el.name] = el.value;
    }
    const testoBtn = btn?.textContent ?? '';
    if (btn) { btn.disabled = true; btn.textContent = 'Invio in corso…'; }
    if (msg) msg.textContent = '';
    try {
      const r = await fetch('/api/modulo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dati) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        // conferma: nascondo i campi, mostro il messaggio (resta leggibile anche da screen reader)
        const ok = document.createElement('div'); ok.className = 'form-ok'; ok.setAttribute('role', 'status'); ok.setAttribute('tabindex', '-1');
        ok.innerHTML = `<strong>Richiesta inviata.</strong> ${j.messaggio ?? 'Grazie.'}`;
        Array.from(f.children).forEach(c => { if (c !== ok) (c as HTMLElement).hidden = true; });
        f.appendChild(ok); ok.focus();
        return;
      }
      if (r.status === 422 && Array.isArray(j.errori)) { mostraErrori(j.errori); return; }
      const link = `<a href="${mailtoDi(f)}">scrivici via email</a>`;
      if (msg) { msg.innerHTML = `${(j.errori && j.errori[0]) || 'Invio non riuscito.'} In alternativa ${link}.`; }
    } catch {
      if (msg) msg.innerHTML = `Connessione assente o instabile. Riprova, oppure <a href="${mailtoDi(f)}">scrivici via email</a>.`;
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = testoBtn; }
    }
  });
  f.addEventListener('input', e => { (e.target as HTMLElement).removeAttribute('aria-invalid'); });
});
