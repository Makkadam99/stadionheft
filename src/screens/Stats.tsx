import { useRef, useState } from 'react';
import { LogoBox } from '../components/Chrome';
import { COMPETITIONS, COMP_INFO, RESULT_INFO, formatDate, resultOf, seasonLabel, seasonOf, statsOf, type Game } from '../model';

export type SeasonFilter = 'all' | number;

interface Props {
  games: Game[]; // bereits sortiert, neueste zuerst
  seasons: number[]; // absteigend
  season: SeasonFilter;
  onSeason: (s: SeasonFilter) => void;
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<number>;
}

const pct = (part: number, n: number) => (n ? (part / n) * 100 : 0) + '%';

export function Stats({ games, seasons, season, onSeason, onExport, onImport }: Props) {
  const list = season === 'all' ? games : games.filter((g) => seasonOf(g.date) === season);
  const total = statsOf(list);
  const lastFive = list.slice(0, 5);

  return (
    <>
      <div className="field">
        <label htmlFor="s-season" className="field__label">Saison</label>
        <select
          id="s-season"
          className="input"
          value={String(season)}
          onChange={(e) => onSeason(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">Alle Saisons</option>
          {seasons.map((s) => <option key={s} value={s}>Saison {seasonLabel(s)}</option>)}
        </select>
      </div>

      <div className="big-tiles">
        <div className="big-tile big-tile--red">
          <span className="big-tile__label">Siegquote</span>
          <span className="big-tile__num">{total.n ? Math.round((total.w / total.n) * 100) + ' %' : '–'}</span>
          <span className="big-tile__sub">{total.w} von {total.n} Spielen</span>
        </div>
        <div className="big-tile big-tile--navy">
          <span className="big-tile__label">Torbilanz</span>
          <span className="big-tile__num">{total.gf}:{total.ga}</span>
          <span className="big-tile__sub">{total.n ? (total.gf / total.n).toFixed(1).replace('.', ',') : '0'} Tore pro Spiel</span>
        </div>
      </div>

      <section className="panel">
        <h2 className="panel__title">Letzte Spiele</h2>
        {lastFive.length > 0 ? (
          <>
            <div className="form-row">
              {lastFive.map((g) => {
                const r = resultOf(g);
                const title = `${formatDate(g.date)} – ${g.opponent} ${g.goalsBayern}:${g.goalsOpponent} (${RESULT_INFO[r].label})`;
                return (
                  <span key={g.id} className={`form-dot res-${r}`} title={title} aria-label={title}>
                    {RESULT_INFO[r].letter}
                  </span>
                );
              })}
            </div>
            <span className="hint">Neuestes Spiel links</span>
          </>
        ) : (
          <span className="hint">Noch keine Spiele in dieser Auswahl.</span>
        )}
      </section>

      <section className="panel comp-list">
        <h2 className="panel__title">Nach Wettbewerb</h2>
        {COMPETITIONS.map((c) => {
          const s = statsOf(list.filter((g) => g.competition === c));
          return (
            <div key={c} className="comp">
              <div className="comp__head">
                <span className="comp__name">
                  <LogoBox src={COMP_INFO[c].logo} size="bar" />
                  {COMP_INFO[c].label}
                </span>
                <span className="comp__nums">{s.n} Sp. · {s.w}-{s.d}-{s.l} · {s.gf}:{s.ga}</span>
              </div>
              <div className="bar" role="img" aria-label={`${s.w} Siege, ${s.d} Remis, ${s.l} Niederlagen`}>
                <span className="bar__w" style={{ width: pct(s.w, s.n) }} />
                <span className="bar__d" style={{ width: pct(s.d, s.n) }} />
                <span className="bar__l" style={{ width: pct(s.l, s.n) }} />
              </div>
            </div>
          );
        })}
        <div className="legend">
          <span><i className="bar__w" />Sieg</span>
          <span><i className="bar__d" />Remis</span>
          <span><i className="bar__l" />Niederlage</span>
        </div>
      </section>

      <Backup count={games.length} onExport={onExport} onImport={onImport} />
    </>
  );
}

function Backup({ count, onExport, onImport }: { count: number; onExport: Props['onExport']; onImport: Props['onImport'] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const doExport = async () => {
    try {
      await onExport();
      setMsg(null);
    } catch {
      setMsg({ text: 'Export fehlgeschlagen.', error: true });
    }
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const n = await onImport(file);
      setMsg({ text: `${n} ${n === 1 ? 'Spiel' : 'Spiele'} importiert.` });
    } catch (e) {
      setMsg({ text: (e as Error).message || 'Import fehlgeschlagen.', error: true });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <section className="panel">
      <h2 className="panel__title">Backup</h2>
      <span className="hint">
        Die Spiele liegen nur auf diesem Gerät. Sichere sie ab und zu als JSON-Datei. Beim Import werden vorhandene Spiele ergänzt bzw. aktualisiert.
      </span>
      <div className="backup-actions">
        <button type="button" className="btn btn--small" onClick={doExport} disabled={count === 0}>Exportieren</button>
        <button type="button" className="btn btn--small" onClick={() => fileRef.current?.click()}>Importieren</button>
      </div>
      <input
        ref={fileRef}
        className="sr-only"
        type="file"
        accept="application/json,.json"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => doImport(e.target.files?.[0])}
      />
      {msg && <p className={'message' + (msg.error ? ' message--error' : '')} role="status">{msg.text}</p>}
    </section>
  );
}
