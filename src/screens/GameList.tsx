import { ClubCrest, LogoBox } from '../components/Chrome';
import { COMPETITIONS, COMP_INFO, RESULT_INFO, formatDate, resultOf, statsOf, type Competition, type Game } from '../model';

export type Filter = 'all' | Competition;

interface Props {
  games: Game[]; // bereits sortiert, neueste zuerst
  filter: Filter;
  onFilter: (f: Filter) => void;
  onOpen: (g: Game) => void;
}

export function GameList({ games, filter, onFilter, onOpen }: Props) {
  const total = statsOf(games);
  const visible = filter === 'all' ? games : games.filter((g) => g.competition === filter);

  return (
    <>
      <div className="tiles">
        <div className="tile"><span className="tile__num">{total.n}</span><span className="tile__label">SPIELE</span></div>
        <div className="tile tile--w"><span className="tile__num">{total.w}</span><span className="tile__label">SIEGE</span></div>
        <div className="tile tile--d"><span className="tile__num">{total.d}</span><span className="tile__label">REMIS</span></div>
        <div className="tile tile--l"><span className="tile__num">{total.l}</span><span className="tile__label">NIEDERL.</span></div>
      </div>

      <div className="chips" role="group" aria-label="Nach Wettbewerb filtern">
        <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => onFilter('all')}>Alle</button>
        {COMPETITIONS.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={filter === c} onClick={() => onFilter(c)}>
            <LogoBox src={COMP_INFO[c].logo} size="chip" />
            {COMP_INFO[c].label}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="empty">
          {games.length === 0 ? 'Noch keine Spiele eingetragen. Tippe auf „+“.' : 'Noch keine Spiele in diesem Wettbewerb.'}
        </div>
      )}

      {visible.map((g) => <Ticket key={g.id} game={g} onOpen={() => onOpen(g)} />)}
    </>
  );
}

function Ticket({ game: g, onOpen }: { game: Game; onOpen: () => void }) {
  const res = resultOf(g);
  const comp = COMP_INFO[g.competition];
  const homeName = g.home ? 'FC Bayern' : g.opponent;
  const awayName = g.home ? g.opponent : 'FC Bayern';
  const homeGoals = g.home ? g.goalsBayern : g.goalsOpponent;
  const awayGoals = g.home ? g.goalsOpponent : g.goalsBayern;

  return (
    <button
      type="button"
      className="ticket"
      onClick={onOpen}
      aria-label={`${comp.label}, ${formatDate(g.date)}: ${homeName} gegen ${awayName} ${homeGoals}:${awayGoals} – bearbeiten`}
    >
      <span className="ticket__top">
        <span className="ticket__comp">
          <LogoBox src={comp.logo} size="card" />
          {comp.label}
        </span>
        <span className="ticket__date">{formatDate(g.date)}</span>
      </span>
      <span className="ticket__match">
        <span className={'team team--home' + (g.home ? ' team--fcb' : '')}>
          <ClubCrest name={homeName} bayern={g.home} size="md" />
          {homeName}
        </span>
        <span className="score">{homeGoals}:{awayGoals}</span>
        <span className={'team' + (g.home ? '' : ' team--fcb')}>
          <ClubCrest name={awayName} bayern={!g.home} size="md" />
          {awayName}
        </span>
      </span>
      <span className="ticket__bottom">
        <span className="ticket__venue">{g.home ? 'Allianz Arena' : 'Auswärts'}</span>
        <span className={`badge res-${res}`}>{RESULT_INFO[res].label}</span>
      </span>
    </button>
  );
}
