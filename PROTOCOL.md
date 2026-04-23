# Cyber-Nexus-Proto — Build-Protokoll

Chronologische Dokumentation von Änderungen, Entscheidungen und Build-Status.

---

## 2026-04-23 — Steuerung als Wii-Systemmeldung

**Entscheidung:** Steuerungshinweise in einem **eigenen Panel rechts** neben dem Spiel. Optik angelehnt an Wii-Systemdialoge: stark abgerundeter Kasten, radialer/linearer Gloss, **Pill-Header „Steuerung“** mit **Cyan-Rand** und Glow — **ohne** unteren Action-Button. Inhalt: WASD, Pfeiltasten, Diagonal-Hinweis; `<aside>` + Überschrift für Barrierefreiheit.

**Dateien:** `index.html` (`.wii-stage-row`, `.wii-system-msg`), `css/wii-frame.css` (Panel-, Pill-, `kbd`-Styles; Dock `max-width` 980px; unter 960px Spaltenlayout).

---

## 2026-04-23 — Spielfenster 592×480

**Entscheidung:** Phaser-Canvas und `.wii-screen` von **800×600** auf **592×480** verkleinert (`GameConfig.js`, `css/wii-frame.css`). README angepasst. Breakpoint für horizontales Scrollen der Shell: ~640px Breite.

---

## 2026-04-23 — Wii-Menü-Shell (Layout)

**Status:** Außen-UI an Wii-Optik angelehnt: weiß/glossy, minimaler Blau-Rand ums Spielfenster, **kein** Kanal-Kachelraster — nur ein zentrales Spielfeld.

### Entscheidungen

- Unterer **Dock**-Balken mit runden „Orbs“ (wie Wii) und **Uhr** (`de-DE`, aktualisiert jede Sekunde); statt Marken-/Post-Schrift: **Baustellen-Emojis** (🚧 🏗️ 👷 🔧 ⚠️) als visueller „Under construction“-Hinweis.
- Kleines Inline-Skript nur für die Uhr (keine globalen Variablen; Listener auf `DOMContentLoaded`).

### Dateien

- `index.html` — neue Struktur `.wii-shell`, Kanal-Rahmen, Dock, Uhr-Skript.
- `css/wii-frame.css` — neues Styling (Glanz, Blau-Akzent, Dock, Orbs).

---

## 2026-04-23 — Initialisierung & Kern-Gameplay

**Status:** Prototyp spielbar (Top-Down, WASD, Tilemap-Kollision, Idle/Walk × 4 Richtungen).

### Entscheidungen

1. **Kartenformat:** `assets/map/map.json` ist kein Tiled-Export, sondern ein eigenes Format (`tileSize`, `mapWidth`/`mapHeight`, `layers[]` mit `tiles: { id, x, y }`). Es wird zur Laufzeit in eine Phaser-`Tilemap` übertragen.
2. **Layer-Mapping:**  
   - **Ground:** `gras` (Basis), darüber `weg` (Wege).  
   - **Walls (Kollision):** `objekte` — nur Zellen mit `id !== "0"` erhalten ein Tile; leere Objekt-Zellen bleiben leer (`-1`). Kollision: `setCollisionByExclusion([-1])` auf der Objekt-Layer.
3. **Tileset:** `spritesheet.png` — **128×368 px** (vom Team bestätigt), Kacheln **16×16** → **8×23 = 184** Kacheln (Index 0–183). IDs aus der JSON entsprechen diesen Indizes.
4. **Spieler-Visuals:** Abstraktion in `js/config/PlayerVisualConfig.js` (Pfade, Frame-Größe, Richtungs-Zeilen). Ordner im Repo: `assets/player/With_shadow/` (Großschreibung) — dokumentiert in README; Pfade sind zentral konfigurierbar.
5. **Richtungs-Reihen (Sprite-Sheets):** Zeile 0 = unten, 1 = links, 2 = rechts, 3 = oben (anpassbar über `DIRECTION_ROW_INDEX` in `PlayerVisualConfig.js`).
6. **Keine globalen Variablen:** Einstieg als ES-Modul (`main.js`); State in Szenen/Instanzen.
7. **Phaser:** CDN „latest“-Pin auf stabile 3.80.x (siehe `index.html`); bei Bedarf Version fixieren.

### Änderungen (Dateien)

- `index.html` — Wii-ähnlicher Rahmen, Container für Spielfläche (592×480), Modul-Einstieg.
- `css/wii-frame.css` — Rahmen/„Console“-Optik.
- `js/main.js` — Phaser-Bootstrap, Szenenliste.
- `js/config/GameConfig.js` — Auflösung, Physik, Pixeltreu.
- `js/config/AssetKeys.js` — Asset-Schlüssel.
- `js/config/PlayerVisualConfig.js` — austauschbare Sprite-Konfiguration (Cyberpunk später).
- `js/config/MapTilesetConfig.js` — **128×368**, Tile 16×16, Spalten/Zeilen.
- `js/map/CustomMapLoader.js` — JSON → Phaser-Layers + Kollisions-Layer.
- `js/entities/PlayerController.js` — WASD, Normalisierung diagonaler Bewegung, Animationen.
- `js/scenes/BootScene.js` — Preload.
- `js/scenes/GameScene.js` — Map, Spieler, Kamera, Collider.
- `README.md`, `TODO.md` — Dokumentation und Roadmap.

### Hotfix: Spieler-Animation

- **Problem:** `setTexture(walk)` wurde **jedes Frame** während der Bewegung aufgerufen; Phaser setzt die laufende Animation dabei zurück → Walk/Idle wirkten „eingefroren“ auf Frame 0.
- **Lösung:** `setTexture` nur beim Wechsel **idle ↔ walk**; Animation nur bei Moduswechsel oder **Richtungswechsel** mit `play(key, false)` neu starten, sonst `play(key, true)` (kein Zurücksetzen des Frame-Zählers).

### Nächste sinnvolle Schritte (kurz)

- Audio, UI-HUD im Wii-Rahmen, Speicherstände.
- Dialog-/Quest-System (siehe `TODO.md`).

---

*Neue Einträge stets oben unter neuem Datums-Block hinzufügen.*
