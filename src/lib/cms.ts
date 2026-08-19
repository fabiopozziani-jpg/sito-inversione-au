/**
 * Accesso in lettura alle collection CMS di Wix (Wix Data v2) lato server.
 * Usa l'autenticazione ambientale di @wix/astro (visitor token): le collection sono in lettura pubblica.
 * Ogni loader restituisce `null` in caso di errore così le pagine possono ricadere sui dati statici di src/data/.
 */
import { httpClient } from '@wix/essentials';

export type Filtro = Record<string, unknown>;
export type Ordine = { fieldName: string; order?: 'ASC' | 'DESC' }[];

type RispostaQuery<T> = { dataItems: { id: string; data: T }[]; pagingMetadata?: { count: number; total?: number; hasNext?: boolean } };

const API = 'https://www.wixapis.com/wix-data/v2/items/query';
const cache = new Map<string, { t: number; v: unknown }>();
const TTL = 60_000; // 1 minuto in memoria per processo: alleggerisce le richieste ripetute

/** Interroga una collection e restituisce gli item (campo `_id` incluso). `null` se la richiesta fallisce. */
export async function query<T = Record<string, unknown>>(collection: string, opts: { filter?: Filtro; sort?: Ordine; limit?: number; skip?: number } = {}): Promise<(T & { _id: string })[] | null> {
  const key = collection + JSON.stringify(opts);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v as (T & { _id: string })[];
  try {
    const out: (T & { _id: string })[] = [];
    let skip = opts.skip ?? 0;
    const limit = Math.min(opts.limit ?? 100, 1000);
    for (;;) {
      const r = await httpClient.fetchWithAuth(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataCollectionId: collection, query: { filter: opts.filter ?? {}, sort: opts.sort ?? [], paging: { limit: Math.min(limit - out.length, 100), offset: skip } }, returnTotalCount: false }),
      });
      if (!r.ok) { console.error('[cms]', collection, r.status, (await r.text()).slice(0, 200)); return null; }
      const j = (await r.json()) as RispostaQuery<T>;
      for (const it of j.dataItems ?? []) out.push({ ...(it.data as T), _id: it.id });
      const n = j.dataItems?.length ?? 0;
      if (n < 100 || out.length >= limit) break;
      skip += n;
    }
    cache.set(key, { t: Date.now(), v: out });
    return out;
  } catch (e) {
    console.error('[cms]', collection, e);
    return null;
  }
}

/** Primo item che soddisfa il filtro, o `null`. */
export async function uno<T = Record<string, unknown>>(collection: string, filter: Filtro): Promise<(T & { _id: string }) | null> {
  const r = await query<T>(collection, { filter, limit: 1 });
  return r?.[0] ?? null;
}
