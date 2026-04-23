# Cyber-Nexus-Proto — Build-Protokoll

Chronologische Dokumentation von Änderungen, Entscheidungen und Build-Status.

---

## 2026-04-23 — Hurt & Death (Sprites + API)

**Entscheidung:** `Swordsman_lvl1_Hurt_with_shadow.png` (320×256, **5** Frames/Zeile), `Swordsman_lvl1_Death_with_shadow.png` (448×256, **7** Frames/Zeile), gleiche 4 Richtungen. `triggerHurt()` (kurz, stehend, blockiert nicht Tod; **nicht** während `_attacking`), `triggerDeath()` (entfernt `animationcomplete`-Listener, bricht Zustände ab, Ende: `anims.pause()`). Prototyp-Tasten **H** / **J** in `GameScene`. Getter `isDead`.

**Dateien:** `PlayerVisualConfig.js`, `AssetKeys.js`, `BootScene.js`, `GameScene.js`, `PlayerController.js`, `README.md`.

---

## 2026-04-23 — Bewegung während Walk-/Run-Attack

**Problem:** `update()` setzte bei jedem Angriff `velocity = 0` und beendete früh — Walk-/Run-Attack wirkten wie „Einfrieren“. **Lösung:** Nur bei **`_locomotion === 'attack'`** (stehend) weiter Stopp; bei **`walkAttack` / `runAttack`** dieselbe Eingabe wie normal → `setVelocity(vx * speed)` (Walk- vs. Run-Tempo via Shift). Kein `setVelocity(0)` mehr in `_beginWalkAttack` / `_beginRunAttack`.

---

## 2026-04-23 — Walk + Attack (E beim Gehen)

**Entscheidung:** `Swordsman_lvl1_Walk_Attack_with_shadow.png` (384×256, **6** Frames/Zeile wie Walk). **E** bei **Bewegung ohne Shift** → `_beginWalkAttack`; Priorität: Rennen (`Shift`) > Gehen > stehend.

**Dateien:** `PlayerVisualConfig.js` (`walkAttack`, `walkAttackFrameCount`/`Rate`), `AssetKeys.playerWalkAttack`, `BootScene`, `GameScene`, `PlayerController`, `index.html`, `README.md`.

---

## 2026-04-23 — Run + Attack (E beim Rennen)

**Entscheidung:** `Swordsman_lvl1_Run_Attack_with_shadow.png` (512×256, 8 Frames/Zeile, 4 Zeilen). Wenn **Shift + Bewegung** (Rennen) und **E** (`JustDown`) → `_beginRunAttack`, sonst weiter **stehender Angriff**. Gleiche Physik: Stillstand bis `animationcomplete`, dann Idle.

**Dateien:** `PlayerVisualConfig.js` (`runAttack`, `runAttackFrameCount`/`Rate`), `AssetKeys.playerRunAttack`, `BootScene`, `GameScene`, `PlayerController`, `index.html`, `README.md`.

---

## 2026-04-23 — Stehender Angriff (E)

**Entscheidung:** `Swordsman_lvl1_attack_with_shadow.png` (512×256, **8** Frames/Zeile, 4 Zeilen wie Run). Taste **E** (`JustDown`) startet Angriff in aktueller **Blickrichtung** (bei Bewegung aus Vektor, sonst `_lastDir`). **Geschwindigkeit 0** bis `animationcomplete`, dann zurück zu Idle. Animation `repeat: 0`.

**Dateien:** `PlayerVisualConfig.js`, `AssetKeys.js`, `BootScene.js`, `GameScene.js` (`eKey`), `PlayerController.js`, `index.html`, `README.md`.

---

## 2026-04-23 — Rennen (Shift + Richtung)

**Entscheidung:** `Swordsman_lvl1_Run_with_shadow.png` (512×256, **8×64** Frames, 4 Zeilen wie Walk/Idle) geladen; Animationen `player-run-*`. **Shift** + Bewegungstasten → Modus `run` mit `runSpeed` (250), sonst Walk. `PlayerController.update` erhält `shiftKey` (`KeyCodes.SHIFT`).

**Dateien:** `PlayerVisualConfig.js`, `AssetKeys.js`, `BootScene.js`, `GameScene.js`, `PlayerController.js`, `index.html` (Hinweis), `README.md`.

---

## 2026-04-23 — UI: Windows-95/2000 statt Wii

**Entscheidung:** Themenwechsel auf **schwarz/weiß/grau**, **eckige Kanten**, **blockigen Versatz-Schatten** (keine runden Wii-Formen). Spiel **mittig**; **Steuerung**, **Uhr** (de-DE, mit Sekunden) und **GitHub-Verlinkung** [`https://github.com/safrii350/lotr`](https://github.com/safrii350/lotr) im **unteren Bereich** desselben „Fensters“. Google Font **DotGothic16** eingebunden.

**Dateien:** `css/shell.css` (neu), `css/wii-frame.css` entfernt, `index.html` angepasst.

---

## 2026-04-23 — Steuerung als Wii-Systemmeldung

**Entscheidung:** Steuerungshinweise in einem **eigenen Panel rechts** neben dem Spiel. Optik angelehnt an Wii-Systemdialoge: stark abgerundeter Kasten, radialer/linearer Gloss, **Pill-Header „Steuerung“** mit **Cyan-Rand** und Glow — **ohne** unteren Action-Button. Inhalt: WASD, Pfeiltasten, Diagonal-Hinweis; `<aside>` + Überschrift für Barrierefreiheit.

**Dateien:** `index.html` (`.wii-stage-row`, `.wii-system-msg`), `css/wii-frame.css` (Panel-, Pill-, `kbd`-Styles; Dock `max-width` 980px; unter 960px Spaltenlayout).

---

## 2026-04-23 — Spielfenster 592×480

**Entscheidung:** Phaser-Canvas von **800×600** auf **592×480** verkleinert (`GameConfig.js`, Shell-CSS). README angepasst.

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

- `index.html` — Shell, Container für Spielfläche (592×480), Modul-Einstieg.
- `css/shell.css` — Fenster-/Panel-Optik (aktuell Retro-Desktop).
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

- Audio, UI-HUD, Speicherstände.
- Dialog-/Quest-System (siehe `TODO.md`).

---

*Neue Einträge stets oben unter neuem Datums-Block hinzufügen.*
