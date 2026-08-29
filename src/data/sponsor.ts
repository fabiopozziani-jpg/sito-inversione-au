/** Sponsor — partner di stagione (annuali) e sponsor di singolo evento. Loghi bianchi su trasparente. */
export type Sponsor = { name: string; logo: string; url?: string; w?: number; h?: number };
/** Dimensioni dei PNG in public/img/sponsor (per width/height sugli <img>, niente CLS). */
const DIM: Record<string, [number, number]> = { 'abano-ghiaccio': [383,180], 'auto-landi': [303,180], 'auto31': [440,90], 'autoservizi-cavinato': [440,79], 'baap-bergamaschi': [440,173], 'bellavista': [259,180], 'bull-barber': [331,180], 'caneva-car': [440,62], 'carrozzeria-angela': [440,110], 'cattelan': [184,180], 'centro-del-piede': [388,180], 'cesaro-group': [440,89], 'datex': [440,174], 'dealernet': [215,180], 'ecosider': [402,180], 'gemini': [440,73], 'gruppo-s2': [440,59], 'labor': [321,180], 'locanda-al-colle': [440,101], 'lovato': [440,168], 'marchioro': [440,155], 'metal-nord': [440,98], 'polo-cucine': [440,114], 'race-shop': [440,69], 'rally-bar': [440,147], 'rally-team': [440,179], 'ricambi-americani': [440,132], 'siderurgica-veneta': [327,180], 'sky-motors': [440,94], 'donolauto': [600,219], 'ctrlg': [600,422] };
const s = (slug: string, name: string): Sponsor => ({ name, logo: `/img/sponsor/${slug}.png`, w: DIM[slug]?.[0], h: DIM[slug]?.[1] });

export const annuali: Sponsor[] = [
  s('ricambi-americani', 'Ricambi Americani'),
  s('baap-bergamaschi', 'BAAP Bergamaschi'),
  s('cesaro-group', 'Cesaro Group'),
  s('rally-team', 'Rally Team'),
  s('sky-motors', 'Sky Motors'),
  s('metal-nord', 'Metal Nord Rottami'),
  s('ecosider', 'Ecosider'),
  s('siderurgica-veneta', 'Siderurgica Veneta'),
  s('labor', 'Labor F.lli Corazzari'),
  s('marchioro', 'Marchioro Scavi e Demolizioni'),
  s('dealernet', 'Dealernet'),
  { ...s('ctrlg', 'Ctrl+G'), url: 'https://www.ctrlg.it/' },
];
export const rally: Sponsor[] = [];
export const polo: Sponsor[] = [
  s('polo-cucine','POLO · insieme a te in cucina'), s('bull-barber','Bull Barber'), s('caneva-car','Caneva Car'), s('abano-ghiaccio','Abano Ghiaccio'), s('bellavista','Bellavista'),
  s('gemini','Gemini Carrozzeria'), s('race-shop','Race-Shop'), s('auto-landi','Auto Landi'), s('metal-nord','Metal Nord Rottami'),
  s('ecosider','Ecosider'), s('siderurgica-veneta','Siderurgica Veneta'), s('autoservizi-cavinato','Autoservizi Cavinato'),
  s('gruppo-s2','Gruppo S2 Automobili'), s('locanda-al-colle','Locanda al Colle'), s('carrozzeria-angela','Autocarrozzeria Angela'),
  s('sky-motors','Sky Motors'), s('marchioro','Marchioro Scavi e Demolizioni'), s('cattelan','Cattelan Auto'), s('dealernet','Dealernet'),
  s('labor','Labor F.lli Corazzari'), s('rally-bar','Rally Bar'), s('auto31','Auto 31 Service'), s('datex','Datex'),
  s('centro-del-piede','Centrodelpiede.it'), s('lovato','Costruzioni Lovato'),
];
/** Riserva statica: i loghi veri stanno nel CMS (Media Manager). Senza logo SponsorBlock scrive il nome. */
export const legnaro: Sponsor[] = [ s('baap-bergamaschi','BAAP Bergamaschi'), s('centro-del-piede','Centrodelpiede.it'), s('dealernet','Dealernet'), s('donolauto','Donolauto'), { name: 'Pit Stop Centro Revisioni', logo: '' }, { name: 'Belluco Farm', logo: '' } ];

const perEvento: Record<string, Sponsor[]> = { rally, polo, legnaro };
/** Sponsor propri dell'evento, esclusi i partner di stagione (che si mostrano a parte). */
export const sponsorEvento = (evento: string) => {
  const ann = new Set(annuali.map(a => a.logo));
  return (perEvento[evento] ?? []).filter(x => !ann.has(x.logo));
};

/**
 * Seguito sui canali dell'associazione — fonte: presentazione eventi 2026.
 * Quasi nessun organizzatore di rally pubblica questi numeri: per uno sponsor sono
 * la parte che pesa di più, perché misurano la visibilità fuori dai due giorni di evento.
 */
export type Canale = { rete: string; handle: string; url: string; valore: string; nota?: string };
export const canali: Canale[] = [
  { rete: 'Instagram', handle: '@inversione.au', url: 'https://www.instagram.com/inversione.au/', valore: '13.800', nota: 'follower' },
  { rete: 'Facebook', handle: 'inversione.au', url: 'https://www.facebook.com/inversione.au', valore: '4.800', nota: 'follower' },
  { rete: 'TikTok', handle: '@inversione.au', url: 'https://www.tiktok.com/@inversione.au', valore: '3.300', nota: 'follower · 70.000 “mi piace”' },
  { rete: 'Threads', handle: '@inversione.au', url: 'https://www.threads.net/@inversione.au', valore: '2.250', nota: 'iscritti' },
  { rete: 'YouTube', handle: '@InversioneAU', url: 'https://www.youtube.com/@InversioneAU', valore: '1.300', nota: 'iscritti' },
  { rete: 'Facebook', handle: 'polomotorshow.teolo', url: 'https://www.facebook.com/polomotorshow.teolo', valore: '3.800', nota: 'follower del Polo Motor Show' },
];
/** Somma dei canali sopra, arrotondata per difetto. */
export const seguitoTotale = '29.000+';
