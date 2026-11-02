import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header, TabBar } from './components/Chrome';
import { DebugInfo } from './components/DebugInfo';
import { GameList, type Filter } from './screens/GameList';
import { GameForm } from './screens/GameForm';
import { Stats, type SeasonFilter } from './screens/Stats';
import { deleteGame, loadGames, putGames, requestPersistence, saveGame } from './db';
import { exportGames, parseBackup } from './backup';
import { canonicalName } from './clubs';
import { seasonLabel, seasonOf, sortGames, todayIso, type Game } from './model';

type Screen = { name: 'list' } | { name: 'form'; game?: Game } | { name: 'stats' };

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [screen, setScreen] = useState<Screen>({ name: 'list' });
  const [filter, setFilter] = useState<Filter>('all');
  const [season, setSeason] = useState<SeasonFilter | null>(null);
  const [debug, setDebug] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const reload = useCallback(async () => {
    const all = await loadGames();
    // Frei getippte Gegner (auch aus Backups) auf den offiziellen Vereinsnamen umstellen
    const renamed = all
      .filter((g) => canonicalName(g.opponent) !== g.opponent)
      .map((g) => ({ ...g, opponent: canonicalName(g.opponent) }));
    if (renamed.length) await putGames(renamed);
    const byId = new Map(renamed.map((g) => [g.id, g]));
    setGames(sortGames(all.map((g) => byId.get(g.id) ?? g)));
  }, []);

  useEffect(() => {
    requestPersistence();
    reload();
  }, [reload]);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [screen]);

  const currentSeason = seasonOf(todayIso());
  // Standard: Saison des zuletzt eingetragenen Spiels
  const activeSeason: SeasonFilter = season ?? (games[0] ? seasonOf(games[0].date) : currentSeason);

  const seasons = useMemo(() => {
    const set = new Set(games.map((g) => seasonOf(g.date)));
    if (activeSeason !== 'all') set.add(activeSeason);
    return [...set].sort((a, b) => b - a);
  }, [games, activeSeason]);

  const opponents = useMemo(
    () => [...new Set(games.map((g) => g.opponent))].sort((a, b) => a.localeCompare(b, 'de')),
    [games]
  );

  const handleSave = async (g: Game) => {
    await saveGame(g);
    await reload();
    // Neues Spiel: Filter zurücksetzen, damit es sicher in der Liste auftaucht
    if (screen.name === 'form' && !screen.game) setFilter('all');
    setScreen({ name: 'list' });
  };

  const handleDelete = async (g: Game) => {
    await deleteGame(g.id);
    await reload();
    setScreen({ name: 'list' });
  };

  const handleImport = async (file: File) => {
    const imported = parseBackup(await file.text());
    await putGames(imported);
    await reload();
    return imported.length;
  };

  const sub =
    screen.name === 'form'
      ? screen.game ? 'Spiel bearbeiten' : 'Spiel eintragen'
      : screen.name === 'stats'
        ? 'Bilanz · ' + (activeSeason === 'all' ? 'Alle Saisons' : 'Saison ' + seasonLabel(activeSeason))
        : 'Meine Spiele · Saison ' + seasonLabel(currentSeason);

  return (
    <div className="app">
      <Header sub={sub} onSecret={() => setDebug(true)} />
      {debug && <DebugInfo onClose={() => setDebug(false)} />}
      <main className="main" ref={mainRef}>
        {screen.name === 'list' && (
          <GameList games={games} filter={filter} onFilter={setFilter} onOpen={(g) => setScreen({ name: 'form', game: g })} />
        )}
        {screen.name === 'form' && (
          <GameForm
            key={screen.game?.id ?? 'new'}
            initial={screen.game}
            defaults={{ competition: games[0]?.competition ?? 'bundesliga' }}
            opponents={opponents}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={() => setScreen({ name: 'list' })}
          />
        )}
        {screen.name === 'stats' && (
          <Stats
            games={games}
            seasons={seasons}
            season={activeSeason}
            onSeason={setSeason}
            onExport={() => exportGames(games)}
            onImport={handleImport}
          />
        )}
      </main>
      <TabBar
        active={screen.name === 'form' ? null : screen.name}
        onList={() => setScreen({ name: 'list' })}
        onAdd={() => setScreen({ name: 'form' })}
        onStats={() => setScreen({ name: 'stats' })}
      />
    </div>
  );
}
