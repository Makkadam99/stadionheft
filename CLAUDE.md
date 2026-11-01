# Stadionheft – FC Bayern Stadion-Tagebuch

Private Mobile-App, in der ich die Spiele festhalte, die ich im Stadion besucht habe.
Nur für mich, kein App Store, keine Anmeldung, kein Server.

## Ziel
Eine **Progressive Web App (PWA)**, die ich auf dem iPhone/Android per „Zum Home-Bildschirm“ installiere
und die danach offline funktioniert.

## Tech-Vorgaben
- Vite + React + TypeScript
- Daten lokal im Browser speichern (IndexedDB, z. B. über `idb` oder Dexie)
- PWA: Manifest + Service Worker (z. B. `vite-plugin-pwa`), App-Icon = Bayern-Wappen
- Kein Backend
- Export/Import der Daten als JSON-Datei (Backup, falls der Browser-Speicher geleert wird)

## Datenmodell „Spiel“
- `id`
- `date` (ISO-Datum)
- `competition`: `bundesliga` | `dfb-pokal` | `champions-league`
- `home`: boolean (Heim = Allianz Arena, sonst Auswärts)
- `opponent`: string
- `goalsBayern`, `goalsOpponent`: number

## Screens (Vorlage: `design/stadionheft-design.html`)
1. **Meine Spiele** – Bilanz-Kacheln (Spiele/Siege/Remis/Niederlagen), Filter nach Wettbewerb,
   Spielkarten im Ticket-Look (Logo + Wettbewerb, Datum, Paarung, Ergebnis, Ort, Sieg/Remis/Niederlage).
   Neueste zuerst. Antippen einer Karte → bearbeiten oder löschen.
2. **Spiel eintragen** – Datum, Wettbewerb (mit Logos), Heim/Auswärts, Gegner (mit Vorschlägen aus bereits
   eingetragenen Gegnern), Tore per +/−, Live-Vorschau Sieg/Remis/Niederlage, Speichern/Abbrechen.
3. **Bilanz** – Siegquote, Torbilanz, letzte 5 Spiele (S/U/N), Balken pro Wettbewerb.
   Auswahl nach Saison (Saison läuft Juli–Juni) plus „Alle Saisons“.

Unten eine Tab-Leiste: Spiele · runder roter „+“-Button · Bilanz.

## Design
Das Design in `design/stadionheft-design.html` ist ein Entwurf aus einem Design-Tool (eigenes Template-Format,
nicht direkt lauffähig). Bitte Look & Feel **1:1 übernehmen**, den Code aber sauber neu in React schreiben:
- Farben: Rot `#C4122F`, Navy `#0E2A4F`, Ink `#1B1B1B`, Creme `#F4ECDC`, Papier `#FFFBF3`, Rauten-Blau `#1C5FA8`
- Schriften (Google Fonts, für Offline-Betrieb lokal einbinden): „Alfa Slab One“ (Überschriften, Zahlen), „Barlow Condensed“ 500/600/700 (Rest)
- Retro-Stil: dicke schwarze Ränder, harte Schatten (`4px 4px 0 #1B1B1B`), keine Rundungen außer Wappen/+-Button,
  gestreifter roter Header, weiß-blaues Rautenband oben
- Logos in `assets/` (fcb, bl = Bundesliga, dfb = DFB-Pokal, cl = Champions League), jeweils auf weißem Feld mit schwarzem Rand
- Touch-Ziele mindestens 44 px, Sprache Deutsch, Datum als „Sa 25.10.2026“

## Vorgehen
Erst kurz einen Plan zeigen, dann umsetzen. Am Ende erklären, wie ich die App lokal starte und kostenlos online stelle
(z. B. GitHub Pages, Netlify oder Vercel), damit ich sie auf dem Handy installieren kann.
