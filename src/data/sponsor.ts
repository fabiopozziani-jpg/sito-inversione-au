/** Sponsor — partner di stagione (annuali) e sponsor di singolo evento. Loghi bianchi su trasparente. */
export type Sponsor = { name: string; logo: string; url?: string; w?: number; h?: number };
/** Dimensioni dei PNG in public/img/sponsor (per width/height sugli <img>, niente CLS). */
const DIM: Record<string, [number, number]> = { 'abano-ghiaccio': [383,180], 'auto-landi': [303,180], 'auto31': [440,90], 'autoservizi-cavinato': [440,79], 'baap-bergamaschi': [440,173], 'bellavista': [259,180], 'bull-barber': [331,180], 'caneva-car': [440,62], 'carrozzeria-angela': [440,110], 'cattelan': [184,180], 'centro-del-piede': [388,180], 'cesaro-group': [440,89], 'datex': [440,174], 'dealernet': [215,180], 'ecosider': [402,180], 'gemini': [440,73], 'gruppo-s2': [440,59], 'labor': [321,180], 'locanda-al-colle': [440,101], 'lovato': [440,168], 'marchioro': [440,155], 'metal-nord': [440,98], 'polo-cucine': [440,114], 'race-shop': [440,69], 'rally-bar': [440,147], 'rally-team': [440,179], 'ricambi-americani': [440,132], 'siderurgica-veneta': [327,180], 'sky-motors': [440,94] };
const s = (slug: string, name: string): Sponsor => ({ name, logo: `/img/sponsor/${slug}.png`, w: DIM[slug]?.[0], h: DIM[slug]?.[1] });

export const annuali: Sponsor[] = [
  s('polo-cucine', 'POLO · insieme a te in cucina'),
  s('ricambi-americani', 'Ricambi Americani'),
  s('baap-bergamaschi', 'BAAP Bergamaschi'),
  s('cesaro-group', 'Cesaro Group'),
  s('rally-team', 'Rally Team'),
];
export const rally: Sponsor[] = [];
export const polo: Sponsor[] = [
  s('bull-barber','Bull Barber'), s('caneva-car','Caneva Car'), s('abano-ghiaccio','Abano Ghiaccio'), s('bellavista','Bellavista'),
  s('gemini','Gemini Carrozzeria'), s('race-shop','Race-Shop'), s('auto-landi','Auto Landi'), s('metal-nord','Metal Nord Rottami'),
  s('ecosider','Ecosider'), s('siderurgica-veneta','Siderurgica Veneta'), s('autoservizi-cavinato','Autoservizi Cavinato'),
  s('gruppo-s2','Gruppo S2 Automobili'), s('locanda-al-colle','Locanda al Colle'), s('carrozzeria-angela','Autocarrozzeria Angela'),
  s('sky-motors','Sky Motors'), s('marchioro','Marchioro Scavi e Demolizioni'), s('cattelan','Cattelan Auto'), s('dealernet','Dealernet'),
  s('labor','Labor F.lli Corazzari'), s('rally-bar','Rally Bar'), s('auto31','Auto 31 Service'), s('datex','Datex'),
  s('centro-del-piede','Centrodelpiede.it'), s('lovato','Costruzioni Lovato'),
];
export const legnaro: Sponsor[] = [ s('baap-bergamaschi','BAAP Bergamaschi'), s('centro-del-piede','Centrodelpiede.it') ];

const perEvento: Record<string, Sponsor[]> = { rally, polo, legnaro };
/** Sponsor propri dell'evento, esclusi i partner di stagione (che si mostrano a parte). */
export const sponsorEvento = (evento: string) => {
  const ann = new Set(annuali.map(a => a.logo));
  return (perEvento[evento] ?? []).filter(x => !ann.has(x.logo));
};
