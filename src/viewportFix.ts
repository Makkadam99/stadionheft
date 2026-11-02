// iOS 26 als Home-Bildschirm-App: Der Viewport ist um die Höhe der Statusleiste zu kurz,
// obwohl die Seite oben schon unter der Statusleiste beginnt. Unten bleibt dann ein leerer Streifen.
// Wir messen die Lücke und setzen sie als CSS-Variable --vp-gap, um die App bis an den Rand zu ziehen.

const MAX_GAP = 100; // größere Differenzen sind kein Statusleisten-Problem, dann lieber nichts tun

function update() {
  const portrait = window.innerHeight >= window.innerWidth;
  const screenHeight = portrait
    ? Math.max(screen.width, screen.height)
    : Math.min(screen.width, screen.height);
  const gap = screenHeight - window.innerHeight;
  document.documentElement.style.setProperty('--vp-gap', gap > 0 && gap <= MAX_GAP ? `${gap}px` : '0px');
}

export function installViewportFix() {
  // navigator.standalone gibt es nur auf iOS – Android und Desktop bleiben unberührt
  if (!(navigator as Navigator & { standalone?: boolean }).standalone) return;
  update();
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', () => setTimeout(update, 300));
}
