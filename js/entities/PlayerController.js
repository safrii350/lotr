import { PlayerVisualConfig } from '../config/PlayerVisualConfig.js';

/**
 * Steuert Bewegung (Arcade-Body) und Richtungs-Animationen für den Spieler.
 */
export class PlayerController {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} idleKey
   * @param {string} walkKey
   */
  constructor(scene, x, y, idleKey, walkKey) {
    this.scene = scene;
    const sprite = scene.physics.add.sprite(x, y, idleKey);
    sprite.setCollideWorldBounds(false);
    const body = sprite.body;
    body.setSize(28, 20);
    body.setOffset(18, 38);
    this.sprite = sprite;
    this.idleKey = idleKey;
    this.walkKey = walkKey;
    this._lastDir = 'down';
    this._registerAnimations();
    sprite.anims.play(PlayerVisualConfig.anims.idle.down, true);
  }

  _registerAnimations() {
    const cfg = PlayerVisualConfig;
    const { frameWidth, frameHeight } = cfg;
    const rows = cfg.DIRECTION_ROW_INDEX;

    for (const [dir, row] of Object.entries(rows)) {
      const idleKeyName = cfg.anims.idle[dir];
      const walkKeyName = cfg.anims.walk[dir];

      if (!this.scene.anims.exists(idleKeyName)) {
        this.scene.anims.create({
          key: idleKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.idleKey, {
            start: row * cfg.idleFrameCount,
            end: row * cfg.idleFrameCount + cfg.idleFrameCount - 1,
          }),
          frameRate: cfg.idleFrameRate,
          repeat: -1,
        });
      }

      if (!this.scene.anims.exists(walkKeyName)) {
        this.scene.anims.create({
          key: walkKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.walkKey, {
            start: row * cfg.walkFrameCount,
            end: row * cfg.walkFrameCount + cfg.walkFrameCount - 1,
          }),
          frameRate: cfg.walkFrameRate,
          repeat: -1,
        });
      }
    }
  }

  /**
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
   * @param {Record<string, Phaser.Input.Keyboard.Key>} wasd
   */
  update(cursors, wasd) {
    const speed = PlayerVisualConfig.movementSpeed;
    let vx = 0;
    let vy = 0;

    const left = wasd.A.isDown || cursors.left.isDown;
    const right = wasd.D.isDown || cursors.right.isDown;
    const up = wasd.W.isDown || cursors.up.isDown;
    const down = wasd.S.isDown || cursors.down.isDown;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    if (vx !== 0 && vy !== 0) {
      const inv = 1 / Math.SQRT2;
      vx *= inv;
      vy *= inv;
    }

    this.sprite.setVelocity(vx * speed, vy * speed);

    const moving = vx !== 0 || vy !== 0;
    const cfg = PlayerVisualConfig;

    if (moving) {
      if (Math.abs(vx) > Math.abs(vy)) {
        this._lastDir = vx > 0 ? 'right' : 'left';
      } else {
        this._lastDir = vy > 0 ? 'down' : 'up';
      }
      this.sprite.setTexture(this.walkKey);
      this.sprite.anims.play(cfg.anims.walk[this._lastDir], true);
    } else {
      this.sprite.setTexture(this.idleKey);
      this.sprite.anims.play(cfg.anims.idle[this._lastDir], true);
    }
  }
}
