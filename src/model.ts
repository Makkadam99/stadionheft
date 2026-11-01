import blLogo from '../assets/bl.png';
import dfbLogo from '../assets/dfb.png';
import clLogo from '../assets/cl.png';

export type Competition = 'bundesliga' | 'dfb-pokal' | 'champions-league';

export interface Game {
  id: string;
  date: string; // ISO-Datum, z. B. 2026-10-25
  competition: Competition;
  home: boolean; // Heim = Allianz Arena
  opponent: string;
  goalsBayern: number;
  goalsOpponent: number;
}

export type Result = 'w' | 'd' | 'l';

export const COMPETITIONS: Competition[] = ['bundesliga', 'dfb-pokal', 'champions-league'];

export const COMP_INFO: Record<Competition, { label: string; short: string; logo: string }> = {
  bundesliga: { label: 'Bundesliga', short: 'Bundesliga', logo: blLogo },
  'dfb-pokal': { label: 'DFB-Pokal', short: 'DFB-Pokal', logo: dfbLogo },
  'champions-league': { label: 'Champions League', short: 'Champions L.', logo: clLogo }
};

export const RESULT_INFO: Record<Result, { label: string; letter: string }> = {
  w: { label: 'Sieg', letter: 'S' },
  d: { label: 'Remis', letter: 'U' },
  l: { label: 'Niederlage', letter: 'N' }
};

export const MAX_GOALS = 20;

export function resultOf(g: Pick<Game, 'goalsBayern' | 'goalsOpponent'>): Result {
  if (g.goalsBayern > g.goalsOpponent) return 'w';
  return g.goalsBayern === g.goalsOpponent ? 'd' : 'l';
}

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const pad = (n: number) => String(n).padStart(2, '0');

/** „Sa 25.10.2026“ */
export function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return `${WEEKDAYS[d.getDay()]} ${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Saison läuft Juli–Juni; zurückgegeben wird das Startjahr (2026 = Saison 26/27). */
export function seasonOf(iso: string): number {
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7));
  return month >= 7 ? year : year - 1;
}

export function seasonLabel(startYear: number): string {
  return `${pad(startYear % 100)}/${pad((startYear + 1) % 100)}`;
}

/** Neueste zuerst */
export function sortGames(games: Game[]): Game[] {
  return games.slice().sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : a.date < b.date ? 1 : -1));
}

export interface Stats {
  n: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
}

export function statsOf(games: Game[]): Stats {
  const s: Stats = { n: games.length, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  for (const g of games) {
    s[resultOf(g)]++;
    s.gf += g.goalsBayern;
    s.ga += g.goalsOpponent;
  }
  return s;
}

export function newId(): string {
  // Zeitstempel vorne, damit die ID bei gleichem Datum die Eingabereihenfolge abbildet
  return Date.now().toString(36).padStart(9, '0') + '-' + Math.random().toString(36).slice(2, 8);
}
