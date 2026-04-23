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
  runFile: 'Swordsman_lvl1_Run_with_shadow.png',
  attackFile: 'Swordsman_lvl1_attack_with_shadow.png',
  runAttackFile: 'Swordsman_lvl1_Run_Attack_with_shadow.png',
  walkAttackFile: 'Swordsman_lvl1_Walk_Attack_with_shadow.png',
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
    run: {
      down: 'player-run-down',
      left: 'player-run-left',
      right: 'player-run-right',
      up: 'player-run-up',
    },
    attack: {
      down: 'player-attack-down',
      left: 'player-attack-left',
      right: 'player-attack-right',
      up: 'player-attack-up',
    },
    runAttack: {
      down: 'player-run-attack-down',
      left: 'player-run-attack-left',
      right: 'player-run-attack-right',
      up: 'player-run-attack-up',
    },
    walkAttack: {
      down: 'player-walk-attack-down',
      left: 'player-walk-attack-left',
      right: 'player-walk-attack-right',
      up: 'player-walk-attack-up',
    },
  },
  /**
   * Zeilen: 0 = zur Kamera / „down“, 1 = links, 2 = rechts, 3 = weg / „up“.
   * Walk/Walk+Attack 384×256 → je 6 Frames/Zeile. Run/Attack/Run+Attack 512×256 → 8/Zeile.
   */
  DIRECTION_ROW_INDEX: Object.freeze({
    down: 0,
    left: 1,
    right: 2,
    up: 3,
  }),
  idleFrameCount: 12,
  walkFrameCount: 6,
  runFrameCount: 8,
  attackFrameCount: 8,
  runAttackFrameCount: 8,
  walkAttackFrameCount: 6,
  walkFrameRate: 10,
  runFrameRate: 12,
  attackFrameRate: 14,
  runAttackFrameRate: 14,
  walkAttackFrameRate: 12,
  idleFrameRate: 8,
  movementSpeed: 140,
  runSpeed: 250,
});

export function getPlayerTexturePaths() {
  const {
    basePath,
    idleFile,
    walkFile,
    runFile,
    attackFile,
    runAttackFile,
    walkAttackFile,
  } = PlayerVisualConfig;
  return {
    idle: `${basePath}/${idleFile}`,
    walk: `${basePath}/${walkFile}`,
    run: `${basePath}/${runFile}`,
    attack: `${basePath}/${attackFile}`,
    runAttack: `${basePath}/${runAttackFile}`,
    walkAttack: `${basePath}/${walkAttackFile}`,
  };
}
