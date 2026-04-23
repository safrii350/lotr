/**
 * Slime2 — Zeilen: 0 zur View (down), 1 weg (up), 2 links, 3 rechts.
 * Alle Kacheln 64×64, außer explizit durch Sheetgröße abgeleitet.
 */
export const SlimeEnemyConfig = Object.freeze({
  basePath: 'assets/enemys/slime',
  idleFile: 'Slime2_Idle_with_shadow.png',
  walkFile: 'Slime2_Walk_with_shadow.png',
  runFile: 'Slime2_Run_with_shadow.png',
  attackFile: 'Slime2_Attack_with_shadow.png',
  hurtFile: 'Slime2_Hurt_with_shadow.png',
  deathFile: 'Slime2_Death_with_shadow.png',
  frameWidth: 64,
  frameHeight: 64,
  anims: {
    idle: {
      down: 'slime2-idle-down',
      up: 'slime2-idle-up',
      left: 'slime2-idle-left',
      right: 'slime2-idle-right',
    },
    walk: {
      down: 'slime2-walk-down',
      up: 'slime2-walk-up',
      left: 'slime2-walk-left',
      right: 'slime2-walk-right',
    },
    run: {
      down: 'slime2-run-down',
      up: 'slime2-run-up',
      left: 'slime2-run-left',
      right: 'slime2-run-right',
    },
    attack: {
      down: 'slime2-attack-down',
      up: 'slime2-attack-up',
      left: 'slime2-attack-left',
      right: 'slime2-attack-right',
    },
    hurt: {
      down: 'slime2-hurt-down',
      up: 'slime2-hurt-up',
      left: 'slime2-hurt-left',
      right: 'slime2-hurt-right',
    },
    death: {
      down: 'slime2-death-down',
      up: 'slime2-death-up',
      left: 'slime2-death-left',
      right: 'slime2-death-right',
    },
  },
  DIRECTION_ROW_INDEX: Object.freeze({
    down: 0,
    up: 1,
    left: 2,
    right: 3,
  }),
  idleFrameCount: 6,
  walkFrameCount: 8,
  runFrameCount: 8,
  attackFrameCount: 11,
  hurtFrameCount: 5,
  deathFrameCount: 10,
  idleFrameRate: 8,
  walkFrameRate: 10,
  runFrameRate: 12,
  attackFrameRate: 14,
  hurtFrameRate: 14,
  deathFrameRate: 12,
  walkSpeed: 95,
  runSpeed: 165,
  attackRange: 54,
  runDistanceThreshold: 200,
  attackCooldownMs: 1500,
  /** Schaden an den Spieler (pro Treffer) */
  damageToPlayer: 10,
  /** Verzögerung bis Trefferregister in der Attack-Animation (ms) */
  attackHitDelayMs: 380,
  maxHp: 100,
});

export function getSlimeTexturePaths() {
  const c = SlimeEnemyConfig;
  const p = c.basePath;
  return {
    idle: `${p}/${c.idleFile}`,
    walk: `${p}/${c.walkFile}`,
    run: `${p}/${c.runFile}`,
    attack: `${p}/${c.attackFile}`,
    hurt: `${p}/${c.hurtFile}`,
    death: `${p}/${c.deathFile}`,
  };
}
