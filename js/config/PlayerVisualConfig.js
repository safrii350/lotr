/**
 * Zentrale Konfiguration für Spieler-Sprites — hier nur Pfade/Frames tauschen,
 * um Fantasy-Assets durch Cyberpunk zu ersetzen.
 *
 * Hinweis: Im Repo liegt der Ordner als `With_shadow` (Großschreibung).
 */
export const PlayerVisualConfig = Object.freeze({
  basePath: 'assets/player/With_shadow',
  idleFile: 'Swordsman_lvl1_Idle_with_shadow.png',
  walkFile: 'Swordsman_lvl1_Walk_with_shadow.png',
  frameWidth: 64,
  frameHeight: 64,
  /** Phaser-Animations-Keys — unverändert lassen, wenn nur Texturen getauscht werden */
  anims: {
    idle: {
      down: 'player-idle-down',
      left: 'player-idle-left',
      right: 'player-idle-right',
      up: 'player-idle-up',
    },
    walk: {
      down: 'player-walk-down',
      left: 'player-walk-left',
      right: 'player-walk-right',
      up: 'player-walk-up',
    },
  },
  /**
   * Zeilen-Index pro logischer Richtung (0 = erste Zeile im Sheet).
   * Bei neuem Asset ggf. permutieren.
   */
  DIRECTION_ROW_INDEX: Object.freeze({
    down: 0,
    left: 1,
    right: 2,
    up: 3,
  }),
  idleFrameCount: 12,
  walkFrameCount: 6,
  walkFrameRate: 10,
  idleFrameRate: 8,
  movementSpeed: 140,
});

export function getPlayerTexturePaths() {
  const { basePath, idleFile, walkFile } = PlayerVisualConfig;
  return {
    idle: `${basePath}/${idleFile}`,
    walk: `${basePath}/${walkFile}`,
  };
}
