/** Sponsor — partner di stagione (annuali) e sponsor di singolo evento. Loghi bianchi su trasparente. */
export type Sponsor = { name: string; logo: string; url?: string };
const s = (slug: string, name: string): Sponsor => ({ name, logo: `/img/sponsor/${slug}.png` });

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
