import { useRef } from 'react';
import fcbLogo from '../../assets/fcb.png';
import { BAYERN_LOGO, findClub, initialsOf } from '../clubs';

/** onSecret: wird ausgelöst, wenn das Wappen 5× innerhalb von 2 Sekunden angetippt wird */
export function Header({ sub, onSecret }: { sub: string; onSecret?: () => void }) {
  const taps = useRef<number[]>([]);
  const tapCrest = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2000), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      onSecret?.();
    }
  };

  return (
    <>
      <div className="safe-top" aria-hidden="true" />
      <div className="rauten" aria-hidden="true" />
      <header className="header">
        <div className="header__titles">
          <h1 className="header__title">STADIONHEFT</h1>
          <span className="header__sub">{sub}</span>
        </div>
        <div className="crest" onClick={tapCrest}>
          <img src={fcbLogo} alt="FC Bayern München" />
        </div>
      </header>
    </>
  );
}

export type Tab = 'list' | 'stats';

interface TabBarProps {
  active: Tab | null;
  onList: () => void;
  onAdd: () => void;
  onStats: () => void;
}

export function TabBar({ active, onList, onAdd, onStats }: TabBarProps) {
  return (
    <nav className="tabbar" aria-label="Hauptnavigation">
      <button type="button" className={'tab' + (active === 'list' ? ' tab--on' : '')} onClick={onList} aria-current={active === 'list' ? 'page' : undefined}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        Spiele
      </button>
      <div className="tabbar__plus-wrap">
        <button type="button" className="tabbar__plus" onClick={onAdd} aria-label="Neues Spiel eintragen">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      <button type="button" className={'tab' + (active === 'stats' ? ' tab--on' : '')} onClick={onStats} aria-current={active === 'stats' ? 'page' : undefined}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 20V11M12 20V4M19 20v-6" />
        </svg>
        Bilanz
      </button>
    </nav>
  );
}

/** Vereinswappen; Vereine ohne hinterlegtes Wappen bekommen ein Abzeichen mit Kürzel */
export function ClubCrest({ name, bayern, size }: { name: string; bayern?: boolean; size: 'sm' | 'md' }) {
  const logo = bayern ? BAYERN_LOGO : findClub(name)?.logo;
  return logo ? (
    <img className={`crest-img crest-img--${size}`} src={logo} alt="" />
  ) : (
    <span className={`crest-badge crest-img--${size}`} aria-hidden="true">{initialsOf(name)}</span>
  );
}

export function LogoBox({ src, size }: { src: string; size: 'chip' | 'card' | 'seg' | 'bar' }) {
  return (
    <span className={`logo-box logo-box--${size}`}>
      <img src={src} alt="" />
    </span>
  );
}
