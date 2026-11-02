import { useEffect, useState } from 'react';

// Versteckte Diagnose-Anzeige für Darstellungsprobleme (5× schnell aufs Wappen tippen).
// Zeigt Viewport- und Safe-Area-Maße, um Safari und Home-Bildschirm-App vergleichen zu können.

function measureInsets() {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;visibility:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const insets = `oben ${cs.paddingTop} · unten ${cs.paddingBottom} · links ${cs.paddingLeft} · rechts ${cs.paddingRight}`;
  probe.remove();
  return insets;
}

function collect(): [string, string][] {
  const rect = (sel: string) => {
    const r = document.querySelector(sel)?.getBoundingClientRect();
    return r ? `oben ${Math.round(r.top)} · unten ${Math.round(r.bottom)}` : '–';
  };
  const vv = window.visualViewport;
  return [
    ['Modus', matchMedia('(display-mode: standalone)').matches ? 'Home-Bildschirm-App' : 'Browser'],
    ['navigator.standalone', String((navigator as Navigator & { standalone?: boolean }).standalone)],
    ['Bildschirm', `${screen.width} × ${screen.height}`],
    ['Fenster (inner)', `${window.innerWidth} × ${window.innerHeight}`],
    ['Dokument (client)', `${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`],
    ['Visual Viewport', vv ? `${Math.round(vv.width)} × ${Math.round(vv.height)} · Versatz ${Math.round(vv.offsetTop)}` : '–'],
    ['Safe Area', measureInsets()],
    ['App-Rahmen', rect('.app')],
    ['Tab-Leiste', rect('.tabbar')],
    ['Pixeldichte', String(window.devicePixelRatio)],
    ['Statusleiste', document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.getAttribute('content') ?? '–'],
    ['Browser', navigator.userAgent.replace(/^Mozilla\/5\.0 /, '')]
  ];
}

export function DebugInfo({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState(collect);

  useEffect(() => {
    const update = () => setRows(collect());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="debug" role="dialog" aria-label="Diagnose">
      <h2 className="panel__title">Diagnose</h2>
      <dl className="debug__list">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="backup-actions">
        <button type="button" className="btn btn--small" onClick={() => setRows(collect())}>Neu messen</button>
        <button type="button" className="btn btn--small btn--dark" onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
}
