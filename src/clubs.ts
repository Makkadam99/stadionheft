import fcbLogo from '../assets/fcb.png';

// Offizielle Vereinsnamen (Stand Saison 26/27) mit gängigen Schreibweisen als Aliasse.
// Die Wappen liegen in assets/clubs/<slug>.png (Quelle: Wikipedia, verkleinert mit scripts/club-logos.mjs).

export type League = 'bl' | 'bl2' | 'pl' | 'sa' | 'int';

export interface Club {
  name: string;
  league: League;
  aliases: string[];
  logo?: string;
}

const RAW: [string, League, string[]?][] = [
  // Bundesliga
  ['Borussia Dortmund', 'bl', ['BVB', 'Dortmund']],
  ['Sport-Club Freiburg', 'bl', ['SC Freiburg', 'Freiburg']],
  ['RB Leipzig', 'bl', ['Leipzig', 'RasenBallsport Leipzig']],
  ['SV Werder Bremen', 'bl', ['Werder Bremen', 'Werder', 'Bremen']],
  ['Bayer 04 Leverkusen', 'bl', ['Bayer Leverkusen', 'Leverkusen']],
  ['SV Elversberg', 'bl', ['Elversberg']],
  ['Eintracht Frankfurt', 'bl', ['Frankfurt', 'SGE']],
  ['1. FSV Mainz 05', 'bl', ['Mainz 05', 'FSV Mainz', 'Mainz']],
  ['FC Augsburg', 'bl', ['Augsburg']],
  ['VfB Stuttgart', 'bl', ['Stuttgart']],
  ['TSG Hoffenheim', 'bl', ['Hoffenheim', 'TSG 1899 Hoffenheim']],
  ['1. FC Köln', 'bl', ['FC Köln', 'Köln']],
  ['SC Paderborn 07', 'bl', ['SC Paderborn', 'Paderborn']],
  ['Hamburger SV', 'bl', ['HSV', 'Hamburg']],
  ['1. FC Union Berlin', 'bl', ['Union Berlin']],
  ['FC Schalke 04', 'bl', ['Schalke 04', 'Schalke']],
  ['Borussia Mönchengladbach', 'bl', ['Mönchengladbach', 'Gladbach']],
  // 2. Bundesliga
  ['Hertha BSC', 'bl2', ['Hertha', 'Hertha Berlin']],
  ['1. FC Nürnberg', 'bl2', ['FC Nürnberg', 'Nürnberg']],
  ['VfL Wolfsburg', 'bl2', ['Wolfsburg']],
  ['1. FC Kaiserslautern', 'bl2', ['FC Kaiserslautern', 'Kaiserslautern']],
  ['1. FC Magdeburg', 'bl2', ['FC Magdeburg', 'Magdeburg']],
  ['1. FC Heidenheim 1846', 'bl2', ['1. FC Heidenheim', 'FC Heidenheim', 'Heidenheim']],
  ['DSC Arminia Bielefeld', 'bl2', ['Arminia Bielefeld', 'Bielefeld']],
  ['FC St. Pauli', 'bl2', ['St. Pauli']],
  ['SpVgg Greuther Fürth', 'bl2', ['Greuther Fürth', 'Fürth']],
  ['VfL Osnabrück', 'bl2', ['Osnabrück']],
  ['VfL Bochum 1848', 'bl2', ['VfL Bochum', 'Bochum']],
  ['Hannover 96', 'bl2', ['Hannover']],
  ['Karlsruher SC', 'bl2', ['KSC', 'Karlsruhe']],
  ['FC Energie Cottbus', 'bl2', ['Energie Cottbus', 'Cottbus']],
  ['Eintracht Braunschweig', 'bl2', ['Braunschweig']],
  ['SV Darmstadt 98', 'bl2', ['Darmstadt 98', 'Darmstadt']],
  ['Holstein Kiel', 'bl2', ['Kiel']],
  ['SG Dynamo Dresden', 'bl2', ['Dynamo Dresden', 'Dresden']],
  // Premier League
  ['Arsenal', 'pl', ['Arsenal London', 'FC Arsenal']],
  ['Aston Villa', 'pl'],
  ['AFC Bournemouth', 'pl', ['Bournemouth']],
  ['Brentford', 'pl', ['FC Brentford']],
  ['Brighton & Hove Albion', 'pl', ['Brighton']],
  ['Chelsea', 'pl', ['FC Chelsea', 'Chelsea London']],
  ['Coventry City', 'pl', ['Coventry']],
  ['Crystal Palace', 'pl'],
  ['Everton', 'pl', ['FC Everton']],
  ['Fulham', 'pl', ['FC Fulham']],
  ['Hull City', 'pl', ['Hull']],
  ['Ipswich Town', 'pl', ['Ipswich']],
  ['Leeds United', 'pl', ['Leeds']],
  ['Liverpool', 'pl', ['FC Liverpool']],
  ['Manchester City', 'pl', ['Man City']],
  ['Manchester United', 'pl', ['Man United', 'Man Utd']],
  ['Newcastle United', 'pl', ['Newcastle']],
  ['Nottingham Forest', 'pl', ['Nottingham']],
  ['Sunderland', 'pl', ['AFC Sunderland']],
  ['Tottenham Hotspur', 'pl', ['Tottenham', 'Spurs']],
  // Serie A
  ['Lazio', 'sa', ['Lazio Rom', 'SS Lazio']],
  ['Inter', 'sa', ['Inter Mailand', 'Inter Milan', 'Internazionale']],
  ['Roma', 'sa', ['AS Rom', 'AS Roma']],
  ['Como', 'sa', ['Como 1907']],
  ['Milan', 'sa', ['AC Mailand', 'AC Milan']],
  ['Frosinone', 'sa', ['Frosinone Calcio']],
  ['Juventus', 'sa', ['Juventus Turin', 'Juve']],
  ['Napoli', 'sa', ['SSC Neapel', 'Neapel', 'SSC Napoli']],
  ['Bologna', 'sa', ['FC Bologna']],
  ['Torino', 'sa', ['FC Turin', 'Torino FC']],
  ['Genoa', 'sa', ['CFC Genua', 'Genua']],
  ['Cagliari', 'sa', ['Cagliari Calcio']],
  ['Atalanta', 'sa', ['Atalanta Bergamo']],
  ['Lecce', 'sa', ['US Lecce']],
  ['Sassuolo', 'sa', ['US Sassuolo']],
  ['Monza', 'sa', ['AC Monza']],
  ['Fiorentina', 'sa', ['AC Florenz', 'Florenz']],
  ['Parma', 'sa', ['Parma Calcio']],
  ['Udinese', 'sa', ['Udinese Calcio']],
  ['Venezia', 'sa', ['FC Venedig', 'Venedig']],
  // Weitere Champions-League-Vereine
  ['Real Madrid', 'int'],
  ['FC Barcelona', 'int', ['Barcelona', 'Barça']],
  ['Atlético de Madrid', 'int', ['Atlético Madrid', 'Atletico Madrid']],
  ['Paris Saint-Germain', 'int', ['PSG', 'Paris SG']],
  ['Olympique de Marseille', 'int', ['Olympique Marseille', 'Marseille']],
  ['SL Benfica', 'int', ['Benfica Lissabon', 'Benfica']],
  ['Sporting CP', 'int', ['Sporting Lissabon']],
  ['FC Porto', 'int', ['Porto']],
  ['Celtic', 'int', ['Celtic Glasgow']],
  ['Galatasaray', 'int', ['Galatasaray Istanbul']],
  ['Ajax', 'int', ['Ajax Amsterdam']],
  ['PSV', 'int', ['PSV Eindhoven']],
  ['Feyenoord', 'int', ['Feyenoord Rotterdam']],
  ['Club Brugge', 'int', ['FC Brügge', 'Club Brügge']],
  ['FC Salzburg', 'int', ['RB Salzburg', 'Red Bull Salzburg']]
];

const LOGOS = import.meta.glob<string>('../assets/clubs/*.png', { eager: true, import: 'default' });

export function slugOf(name: string): string {
  return name.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/é/g, 'e').replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Für Vergleiche: klein, ohne Akzente/Umlaute-Varianten und Satzzeichen */
export function normalize(s: string): string {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export const CLUBS: Club[] = RAW.map(([name, league, aliases = []]) => ({
  name, league, aliases, logo: LOGOS[`../assets/clubs/${slugOf(name)}.png`]
}));

const BY_KEY = new Map<string, Club>();
for (const c of CLUBS) for (const k of [c.name, ...c.aliases]) BY_KEY.set(normalize(k), c);

/** Findet einen Verein über seinen offiziellen Namen oder eine gängige Schreibweise */
export function findClub(name: string): Club | undefined {
  return BY_KEY.get(normalize(name));
}

/** Offizieller Name, falls bekannt – sonst die Eingabe unverändert (getrimmt) */
export function canonicalName(name: string): string {
  return findClub(name)?.name ?? name.trim();
}

export const BAYERN_LOGO = fcbLogo;

// Trennstellen für lange Wörter, damit Namen nur an Wortfugen umbrechen („Mönchen-gladbach“)
const SPLITS: Record<string, string> = {
  bournemouth: 'Bourne|mouth',
  braunschweig: 'Braun|schweig',
  fiorentina: 'Fioren|tina',
  internazionale: 'Inter|nazionale',
  manchester: 'Man|chester',
  nottingham: 'Notting|ham',
  leverkusen: 'Lever|kusen'
};
const SUFFIX = /(gladbach|lautern|kirchen|hausen|münster|heim|berg|burg|bach|dorf|feld|stadt|brück)$/i;
const SHY = '­';

/** Name mit weichen Trennstellen (nur sichtbar, wenn dort umgebrochen wird) */
export function breakableName(name: string): string {
  return name.split(' ').map((w) => {
    if (w.length < 10) return w;
    const split = SPLITS[w.toLowerCase()];
    if (split) return split.replace('|', SHY);
    const m = SUFFIX.exec(w);
    return m && m.index >= 4 ? w.slice(0, m.index) + SHY + w.slice(m.index) : w;
  }).join(' ');
}

/** Kürzel für Vereine ohne Wappen, z. B. „Hansa Rostock“ → „HR“, „TSV 1860 München“ → „T1M“ */
export function initialsOf(name: string): string {
  const all = name.split(/[\s-]+/).filter((w) => /^[A-Za-zÄÖÜäöü0-9]/.test(w));
  // Vereinskürzel wie „FC“ oder Jahreszahlen nur nehmen, wenn sonst zu wenig übrig bleibt
  const core = all.filter((w) => /^[A-Za-zÄÖÜäöü]/.test(w) && !/^(FC|SV|SC|TSV|VfB|VfL|SpVgg|SG|FSV|TSG|AFC|AC|AS|US|SSC|CF|FK|SK|KV|de|of)$/i.test(w));
  const source = core.length >= 2 ? core : all;
  return source.slice(0, 3).map((w) => w[0].toUpperCase()).join('') || '?';
}

/** Vorschläge für die Gegner-Eingabe: eigene frühere Gegner zuerst, dann bekannte Vereine */
export function suggestClubs(query: string, previous: string[], limit = 6): string[] {
  const q = normalize(query);
  if (!q) return [];
  const score = (keys: string[]) => {
    let best = -1;
    for (const k of keys.map(normalize)) {
      if (k === q) best = Math.max(best, 3);
      else if (k.startsWith(q)) best = Math.max(best, 2);
      else if (k.split(' ').some((w) => w.startsWith(q))) best = Math.max(best, 1);
      else if (k.includes(q)) best = Math.max(best, 0);
    }
    return best;
  };

  const seen = new Set<string>();
  const hits: { name: string; s: number; own: boolean }[] = [];
  for (const p of previous) {
    const club = findClub(p);
    const name = club?.name ?? p;
    if (seen.has(name)) continue;
    seen.add(name);
    const s = score(club ? [club.name, ...club.aliases] : [p]);
    if (s >= 0) hits.push({ name, s, own: true });
  }
  for (const c of CLUBS) {
    if (seen.has(c.name)) continue;
    const s = score([c.name, ...c.aliases]);
    if (s >= 0) hits.push({ name: c.name, s, own: false });
  }
  return hits
    .sort((a, b) => b.s - a.s || Number(b.own) - Number(a.own) || a.name.localeCompare(b.name, 'de'))
    .filter((h) => normalize(h.name) !== q)
    .slice(0, limit)
    .map((h) => h.name);
}
