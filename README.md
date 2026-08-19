# Sito Inversione A U — Astro + Wix (headless)

Sito ufficiale di Inversione A U A.S.D. Costruito con **Astro 5** e l'integrazione **Wix headless** (`@wix/astro`), pubblicato su hosting Wix.

## Requisiti
- Node ≥ 20.11 (consigliato 22, vedi `.nvmrc`)
- Accesso Wix (`npx wix login`) — il file `.env.local` con `WIX_CLIENT_SECRET` non va mai in git

## Comandi
| Comando | Cosa fa |
|---|---|
| `npm install` | dipendenze |
| `npm run build` | build di produzione |
| `npm run preview` | build + anteprima su URL temporaneo Wix |
| `npm run release` | **pubblicazione** sul sito Wix collegato (solo a mano, dopo collaudo) |
| `node scripts/watch.mjs` | ponte cloud↔Mac: ascolta `.trigger/deploy`, fa build + preview + commit + push, scrive `.trigger/result.txt` |

## Struttura
- `src/pages/` — route (una cartella = un URL pulito; `[slug].astro` per news e gallerie)
- `src/components/` — componenti (header, footer, hub evento, sub-nav, gallerie, lightbox, tabelle…)
- `src/data/` — contenuti statici in attesa del CMS (`rally.ts`, `hub.ts`, `news.ts`, `gallerie.ts`, `sponsor.ts`, `archivio.ts`, `eventi.ts`)
- `src/styles/` — token del design system (`tokens/`), `global.css`, `movimento.css`, `hub.css`
- `src/scripts/` — `movimento.js` (reveal), `mailform.ts` (moduli)
- `public/` — foto (interim, poi Media Manager), loghi, media kit, documenti, immagini social

## Regole
- Testi e dati: mai inventati; ciò che non è confermato resta vuoto e le pagine mostrano "in pubblicazione".
- Email unica: `inversione.au3@gmail.com`.
- Nessun `href="#"`; link esterni con `target="_blank" rel="noopener"`.
- Solo `transform`/`opacity` nelle animazioni; `prefers-reduced-motion` rispettato.

## Come tornare indietro
`git log --oneline` per trovare il commit buono, `git checkout <commit>`, poi `npm run preview` per verificare e `npm run release` per ripubblicare. Il repository remoto è su GitHub (`origin`).
