# Roadmap: Fantasy-Prototyp → Cyberpunk-RPG

Geordnete Erweiterungen, um **Cyber-Nexus-Proto** zu einem vollwertigen Cyberpunk-RPG auszubauen.

## Phase 1 — Visuelles Theming

- [ ] **Charakter-Sprites:** Neon/Cyberpunk-Idle/Walk-Sheets; `PlayerVisualConfig.js` nur auf neue Pfade/Frame-Counts trimmen.
- [ ] **Umgebung:** Neues Tileset (Stadt, Neon, Schatten); `map.json` + ggf. Editor-Workflow (Tiled-Export optional) dokumentieren.
- [ ] **UI-Skin:** Weitere Themes optional (CSS-Varianten / Tokens).

## Phase 2 — Welt & Interaktion

- [ ] **Szenen-Graph:** Innenräume, District-Wechsel, Übergänge (Türen, Teleporter).
- [ ] **NPCs:** Basisklasse mit States (idle, wander, talk), Trigger-Zonen.
- [ ] **Interaktions-Taste** (z. B. E/Enter) für Objekte und NPCs.

## Phase 3 — Dialog-System

- [ ] **Datenformat:** JSON/YAML für Zeilen, Sprecher, Bedingungen (Quest-Flags, Inventar).
- [ ] **Dialog-UI:** Textbox, Portraits, Tippen/Skip, Auswahloptionen (Branching).
- [ ] **Lokalisierung:** String-IDs, spätere Übersetzungen vorbereiten.

## Phase 4 — Quest-Log

- [ ] **Quest-Definitionen:** Ziele (reach, collect, talk, defeat), Belohnungen, Fehlschläge.
- [ ] **Journal-UI:** Aktive/abgeschlossene Quests, Hinweise, Karten-Marker optional.
- [ ] **Persistenz:** `localStorage` oder später Backend; Save/Load-Slots.

## Phase 5 — Kampf / Progression (optional je nach Design)

- [ ] **Stats:** HP, Energie, Cyber-Implants als Modifikatoren.
- [ ] **Inventar & Ausrüstung:** Datengetrieben, UI-Listen.
- [ ] **Encounter:** Top-Down-Echtzeit oder rundenbasiert — technische Basis in Phaser vorbereiten.

## Phase 6 — Polish & Produktion

- [ ] **Audio:** Musik/SFX, Mixer, Bereiche mit Ambience.
- [ ] **Performance:** Object Pooling, sichtbare Tilemap-Regionen prüfen.
- [ ] **Build:** Vite/Rollup-Bundle, Asset-Pipeline, Versionierte Releases.

---

*Priorität: Phase 1–3 für erkennbaren Cyberpunk-„Vertical Slice“ mit einem Quest und einem Dialogbaum.*
