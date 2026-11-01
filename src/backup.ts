import { COMPETITIONS, MAX_GOALS, type Competition, type Game } from './model';

interface BackupFile {
  app: 'stadionheft';
  version: 1;
  exportedAt: string;
  games: Game[];
}

export async function exportGames(games: Game[]): Promise<void> {
  const data: BackupFile = { app: 'stadionheft', version: 1, exportedAt: new Date().toISOString(), games };
  const name = `stadionheft-backup-${data.exportedAt.slice(0, 10)}.json`;
  const file = new File([JSON.stringify(data, null, 2)], name, { type: 'application/json' });

  // Auf dem Handy (v. a. iOS als Home-Bildschirm-App) klappt Teilen zuverlässiger als ein Download
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Stadionheft-Backup' });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isGoals = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= MAX_GOALS;

/** Liest eine Backup-Datei; wirft einen Fehler mit deutscher Meldung, wenn sie ungültig ist. */
export function parseBackup(text: string): Game[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Die Datei ist keine gültige JSON-Datei.');
  }
  const list = Array.isArray(data) ? data : (data as Partial<BackupFile> | null)?.games;
  if (!Array.isArray(list)) throw new Error('In der Datei wurden keine Spiele gefunden.');

  return list.map((raw, i) => {
    const g = raw as Partial<Game>;
    const ok =
      typeof g.id === 'string' && g.id !== '' &&
      isDate(g.date) &&
      COMPETITIONS.includes(g.competition as Competition) &&
      typeof g.home === 'boolean' &&
      typeof g.opponent === 'string' && g.opponent.trim() !== '' &&
      isGoals(g.goalsBayern) && isGoals(g.goalsOpponent);
    if (!ok) throw new Error(`Eintrag ${i + 1} in der Datei ist ungültig.`);
    return {
      id: g.id!, date: g.date!, competition: g.competition!, home: g.home!,
      opponent: g.opponent!.trim(), goalsBayern: g.goalsBayern!, goalsOpponent: g.goalsOpponent!
    };
  });
}
