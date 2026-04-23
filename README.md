# Cyber-Nexus-Proto

Top-Down-Pixel-RPG-Prototyp mit **Phaser 3** (HTML5/CSS/ES-Module). Die Spielfläche ist **592×480**; daneben zeigt ein **Wii-ähnliches Infofeld** die Steuerung (Systemmeldungs-Optik, ohne Button). Rahmen und Layout: `index.html` + `css/wii-frame.css`.

## Voraussetzungen

- Moderner Browser mit ES-Module-Unterstützung.
- **Lokaler HTTP-Server** (wegen `import` / Modulen): z. B. aus dem Projektroot:

```bash
npx --yes serve .
```

Dann im Browser die angezeigte URL öffnen (z. B. `http://localhost:3000`).

## Projektstruktur

| Pfad | Zweck |
|------|--------|
| `assets/map/map.json` | Eigene Karten-Definition (Layer: `gras`, `weg`, `objekte`) |
| `assets/map/spritesheet.png` | Tileset **128×368 px**, Kacheln **16×16** (8×23 Tiles) |
| `assets/player/With_shadow/` | Spieler-Spritesheets (über `PlayerVisualConfig.js` austauschbar) |
| `js/config/` | Auflösung, Assets, **MapTilesetConfig**, **PlayerVisualConfig** |
| `js/map/CustomMapLoader.js` | JSON → Phaser-Tilemap, Kollision auf `objekte` |
| `js/entities/PlayerController.js` | WASD + Animationen |
| `PROTOCOL.md` | Chronologisches Build-Protokoll |
| `TODO.md` | Roadmap Richtung Cyberpunk-Vollspiel |

## Steuerung

- **WASD** oder **Pfeiltasten** — achtparallele Bewegung mit normalisierten Diagonalen.

## Karte & Kollision

- **Ground:** Layer `gras` und `weg` (Dekoration / Wege).
- **Wände:** Layer `objekte` — nur Zellen mit `id !== "0"` sind belegt und **kollidierbar** (Phaser `setCollisionByExclusion([-1])`).

## Asset-Tausch (Fantasy → Cyberpunk)

1. Neue Texturen ablegen.
2. Pfade in `js/config/PlayerVisualConfig.js` anpassen (`basePath`, Dateinamen, ggf. `DIRECTION_ROW_INDEX` und Frame-Anzahlen).
3. Bei geändertem Tileset: `js/config/MapTilesetConfig.js` (Sheet-Pixelmaße, Kachelgröße).

## Technologie

- Phaser **3.80.1** (CDN in `index.html`; Version bei Bedarf anheften oder lokal bundlen).

## Build-Protokoll

Änderungen und Entscheidungen: siehe **`PROTOCOL.md`**.
