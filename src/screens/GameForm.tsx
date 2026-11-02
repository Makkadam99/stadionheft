import { useMemo, useState, type ReactNode } from 'react';
import { ClubCrest, LogoBox } from '../components/Chrome';
import { canonicalName, suggestClubs } from '../clubs';
import { COMPETITIONS, COMP_INFO, MAX_GOALS, RESULT_INFO, newId, resultOf, todayIso, type Game } from '../model';

interface Props {
  initial?: Game; // gesetzt = Bearbeiten
  defaults: Pick<Game, 'competition'>;
  opponents: string[]; // bereits eingetragene Gegner, alphabetisch
  onSave: (g: Game) => void;
  onDelete: (g: Game) => void;
  onCancel: () => void;
}

export function GameForm({ initial, defaults, opponents, onSave, onDelete, onCancel }: Props) {
  const [form, setForm] = useState<Game>(
    () => initial ?? { id: newId(), date: todayIso(), competition: defaults.competition, home: true, opponent: '', goalsBayern: 0, goalsOpponent: 0 }
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const patch = (p: Partial<Game>) => setForm((f) => ({ ...f, ...p }));
  const step = (key: 'goalsBayern' | 'goalsOpponent', d: number) =>
    setForm((f) => ({ ...f, [key]: Math.max(0, Math.min(MAX_GOALS, f[key] + d)) }));

  const opp = form.opponent.trim();
  const canSave = opp !== '' && form.date !== '';
  const res = resultOf(form);

  const suggestions = useMemo(() => suggestClubs(opp, opponents), [opp, opponents]);

  const save = () => {
    // Bekannte Schreibweisen (z. B. „BVB“) werden als offizieller Vereinsname gespeichert
    if (canSave) onSave({ ...form, opponent: canonicalName(opp) });
  };

  return (
    <>
      <div className="field">
        <label htmlFor="f-date" className="field__label">Datum</label>
        <input id="f-date" className="input" type="date" value={form.date} onChange={(e) => patch({ date: e.target.value })} required />
      </div>

      <div className="field">
        <span id="f-comp" className="field__label">Wettbewerb</span>
        <div className="seg seg--3" role="group" aria-labelledby="f-comp">
          {COMPETITIONS.map((c) => (
            <button key={c} type="button" className="seg__btn seg__btn--logo" aria-pressed={form.competition === c} onClick={() => patch({ competition: c })}>
              <LogoBox src={COMP_INFO[c].logo} size="seg" />
              {COMP_INFO[c].short}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span id="f-venue" className="field__label">Spielort</span>
        <div className="seg seg--2" role="group" aria-labelledby="f-venue">
          <button type="button" className="seg__btn" aria-pressed={form.home} onClick={() => patch({ home: true })}>Heim</button>
          <button type="button" className="seg__btn" aria-pressed={!form.home} onClick={() => patch({ home: false })}>Auswärts</button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-opp" className="field__label">Gegner</label>
        <input
          id="f-opp"
          className="input"
          type="text"
          placeholder="z. B. VfB Stuttgart"
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
          value={form.opponent}
          onChange={(e) => patch({ opponent: e.target.value })}
        />
        {suggestions.length > 0 && (
          <div className="suggestions" role="group" aria-label="Vorschläge">
            {suggestions.map((s) => (
              <button key={s} type="button" className="suggestion" onClick={() => patch({ opponent: s })}>
                <ClubCrest name={s} size="sm" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="field" style={{ gap: 8 }}>
        <span className="field__label">Ergebnis</span>
        <div className="scoreboard">
          <ScoreSide label="FC Bayern" who="FC Bayern" crest={<ClubCrest name="FC Bayern" bayern size="md" />} value={form.goalsBayern} onStep={(d) => step('goalsBayern', d)} />
          <span className="scoreboard__colon" aria-hidden="true">:</span>
          <ScoreSide
            label={opp ? canonicalName(opp) : 'Gegner'}
            who="Gegner"
            crest={opp ? <ClubCrest name={opp} size="md" /> : <span className="crest-img--md" />}
            value={form.goalsOpponent}
            onStep={(d) => step('goalsOpponent', d)}
          />
        </div>
        <div className="preview" aria-live="polite">
          <span className={`badge res-${res}`}>
            {RESULT_INFO[res].label}{opp ? ` gegen ${opp}` : ''}
          </span>
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn" onClick={onCancel}>Abbrechen</button>
        <button type="button" className="btn btn--primary" onClick={save} disabled={!canSave}>Speichern</button>
      </div>

      {initial && (
        <div className="delete-box">
          {confirmDelete ? (
            <>
              <p className="delete-box__q">Dieses Spiel wirklich löschen?</p>
              <div className="actions">
                <button type="button" className="btn btn--small" onClick={() => setConfirmDelete(false)}>Behalten</button>
                <button type="button" className="btn btn--small btn--dark" onClick={() => onDelete(initial)}>Löschen</button>
              </div>
            </>
          ) : (
            <button type="button" className="btn btn--small btn--danger-outline" onClick={() => setConfirmDelete(true)}>Spiel löschen</button>
          )}
        </div>
      )}
    </>
  );
}

interface ScoreSideProps {
  label: string;
  who: string;
  crest: ReactNode;
  value: number;
  onStep: (d: number) => void;
}

function ScoreSide({ label, who, crest, value, onStep }: ScoreSideProps) {
  return (
    <div className="scoreboard__side">
      {crest}
      <span className="scoreboard__name">{label}</span>
      <div className="scoreboard__ctrl">
        <button type="button" className="step" onClick={() => onStep(-1)} disabled={value <= 0} aria-label={`Tor ${who} abziehen`}>−</button>
        <span className="scoreboard__num" aria-label={`Tore ${who}`}>{value}</span>
        <button type="button" className="step step--plus" onClick={() => onStep(1)} disabled={value >= MAX_GOALS} aria-label={`Tor ${who} hinzufügen`}>+</button>
      </div>
    </div>
  );
}
