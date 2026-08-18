/**
 * Moduli "mailto" (FASE 2): validazione lato client, elenco errori accessibile, apertura del client di posta
 * con oggetto e testo compilati. FASE 5: sostituiti da Wix Forms (stesso markup, cambia solo l'invio).
 */
const label = (el: HTMLElement) => {
  const l = el.closest('label')?.querySelector('.lab, .field > span, span')?.textContent?.replace('*', '').trim();
  return l || el.getAttribute('name') || 'Campo';
};
document.querySelectorAll<HTMLFormElement>('form[data-mailform]').forEach(f => {
  const errBox = f.querySelector<HTMLElement>('[data-errors]');
  const msg = f.querySelector<HTMLElement>('.form-msg');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const fields = Array.from(f.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'));
    const errors: string[] = [];
    fields.forEach(el => {
      el.removeAttribute('aria-invalid');
      if (!el.checkValidity()) {
        el.setAttribute('aria-invalid', 'true');
        const why = el.validity.valueMissing ? (el.type === 'checkbox' ? 'è obbligatorio' : 'è obbligatorio') : el.validity.typeMismatch ? 'non è valido' : 'non è valido';
        errors.push(`${label(el)}: ${why}`);
      }
    });
    // gruppi di caselle: almeno una
    f.querySelectorAll<HTMLElement>('[data-almeno-una]').forEach(g => {
      const any = Array.from(g.querySelectorAll<HTMLInputElement>('input[type=checkbox]')).some(c => c.checked);
      if (!any) errors.push(`${g.dataset.almenoUna}: seleziona almeno una voce`);
    });
    if (errors.length) {
      if (errBox) { errBox.hidden = false; errBox.innerHTML = '<span class="err">Controlla questi campi:</span>' + errors.map(x => `<span>${x}</span>`).join(''); errBox.focus?.(); }
      else if (msg) msg.textContent = 'Controlla i campi evidenziati.';
      f.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    if (errBox) errBox.hidden = true;
    const d = new FormData(f);
    const rows: string[] = [];
    let testo = '';
    for (const [k, v] of d.entries()) {
      if (k === 'messaggio' || k === 'note') { testo = String(v); continue; }
      const el = f.querySelector<HTMLElement>(`[name="${k}"]`);
      rows.push(`${el ? label(el) : k}: ${v === 'on' ? 'sì' : v}`);
    }
    const body = rows.join('\n') + (testo ? '\n\n' + testo : '');
    location.href = `mailto:${f.dataset.to}?subject=${encodeURIComponent(f.dataset.subject ?? '')}&body=${encodeURIComponent(body)}`;
    if (msg) msg.textContent = 'Si apre il tuo programma di posta con la richiesta già scritta. Se non succede, scrivi a ' + f.dataset.to + '.';
  });
  f.addEventListener('input', e => { (e.target as HTMLElement).removeAttribute('aria-invalid'); });
});
