/**
 * Copia di sicurezza del CMS in un solo file JSON.
 *
 * A cosa serve: le collection vivono su Wix, non nel repository. Se una riga viene
 * cancellata per errore dal pannello non c'è un «annulla». Questo endpoint scarica
 * tutto il contenuto in un file che si committa nel repo, quindi finisce anche su origin.
 *
 * Uso (dal Mac, con il watcher acceso):
 *   npm run backup
 * oppure a mano:
 *   curl -s "<indirizzo del sito>/servizio/backup-cms.json?k=CHIAVE" -o backup/cms-AAAA-MM-GG.json
 *
 * Senza la chiave risponde 404. Non è linkato da nessuna parte, non è nella sitemap
 * ed esce con `x-robots-tag: noindex`.
 */
import type { APIRoute } from 'astro';
import { query } from '../../lib/cms';

const CHIAVE = '7ed26d0a05dd7388b4fd05c6';

/** Tutte le collection del progetto. Aggiungerne una qui quando se ne crea una nuova. */
const COLLECTIONS = [
  'Eventi', 'Programma', 'ProveSpeciali', 'Scadenze', 'Iscritti', 'Documenti',
  'News', 'Gallerie', 'Foto', 'Sponsor', 'Edizioni', 'Team', 'Social',
] as const;

export const GET: APIRoute = async ({ url }) => {
  if (url.searchParams.get('k') !== CHIAVE) return new Response('Not found', { status: 404 });

  const collezioni: Record<string, unknown> = {};
  const conteggio: Record<string, number | string> = {};
  for (const c of COLLECTIONS) {
    const righe = await query(c, { limit: 1000 });
    collezioni[c] = righe ?? null;
    conteggio[c] = righe ? righe.length : 'errore di lettura';
  }

  const corpo = JSON.stringify({ generato: new Date().toISOString(), sito: url.origin, conteggio, collezioni }, null, 2);
  return new Response(corpo, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': 'attachment; filename="backup-cms.json"',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
};
