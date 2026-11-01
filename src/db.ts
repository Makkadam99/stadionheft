import Dexie, { type EntityTable } from 'dexie';
import type { Game } from './model';

const db = new Dexie('stadionheft') as Dexie & { games: EntityTable<Game, 'id'> };

db.version(1).stores({ games: 'id, date, competition' });

export const loadGames = () => db.games.toArray();
export const saveGame = (game: Game) => db.games.put(game);
export const deleteGame = (id: string) => db.games.delete(id);
export const putGames = (games: Game[]) => db.games.bulkPut(games);

/** Bittet den Browser, die Daten nicht automatisch zu löschen. */
export function requestPersistence() {
  navigator.storage?.persist?.().catch(() => undefined);
}
