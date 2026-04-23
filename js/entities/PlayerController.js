import { PlayerVisualConfig } from '../config/PlayerVisualConfig.js';

/**
 * Steuert Bewegung (Arcade-Body) und Richtungs-Animationen für den Spieler.
 * Shift + Richtung = Rennen.
 * E: stehend | Gehen = Walk-Attack | Rennen (Shift) = Run-Attack.
 * Walk-/Run-Attack: beweglich; stehender Angriff stoppt.
 * triggerHurt / triggerDeath: für Kampflogik (Szene kann auch Tasten binden).
 */
export class PlayerController {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} idleKey
   * @param {string} walkKey
   * @param {string} runKey
   * @param {string} attackKey
   * @param {string} runAttackKey
   * @param {string} walkAttackKey
   * @param {string} hurtKey
   * @param {string} deathKey
   */
  constructor(
    scene,
    x,
    y,
    idleKey,
    walkKey,
    runKey,
    attackKey,
    runAttackKey,
    walkAttackKey,
    hurtKey,
    deathKey
  ) {
    this.scene = scene;
    const sprite = scene.physics.add.sprite(x, y, idleKey);
    sprite.setCollideWorldBounds(false);
    const body = sprite.body;
    body.setSize(28, 20);
    body.setOffset(18, 38);
    this.sprite = sprite;
    this.idleKey = idleKey;
    this.walkKey = walkKey;
    this.runKey = runKey;
    this.attackKey = attackKey;
    this.runAttackKey = runAttackKey;
    this.walkAttackKey = walkAttackKey;
    this.hurtKey = hurtKey;
    this.deathKey = deathKey;
    this._lastDir = 'down';
    /** @type {'idle' | 'walk' | 'run' | 'attack' | 'runAttack' | 'walkAttack' | 'hurt' | 'death'} */
    this._locomotion = 'idle';
    this._attacking = false;
    this._hurting = false;
    this._dead = false;
    this._registerAnimations();
    sprite.anims.play(PlayerVisualConfig.anims.idle.down, true);
  }

  get isDead() {
    return this._dead;
  }

  _registerAnimations() {
    const cfg = PlayerVisualConfig;
    const rows = cfg.DIRECTION_ROW_INDEX;

    for (const [dir, row] of Object.entries(rows)) {
      const idleKeyName = cfg.anims.idle[dir];
      const walkKeyName = cfg.anims.walk[dir];
      const runKeyName = cfg.anims.run[dir];
      const attackKeyName = cfg.anims.attack[dir];
      const runAttackKeyName = cfg.anims.runAttack[dir];
      const walkAttackKeyName = cfg.anims.walkAttack[dir];
      const hurtKeyName = cfg.anims.hurt[dir];
      const deathKeyName = cfg.anims.death[dir];

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

      if (!this.scene.anims.exists(runKeyName)) {
        this.scene.anims.create({
          key: runKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.runKey, {
            start: row * cfg.runFrameCount,
            end: row * cfg.runFrameCount + cfg.runFrameCount - 1,
          }),
          frameRate: cfg.runFrameRate,
          repeat: -1,
        });
      }

      if (!this.scene.anims.exists(attackKeyName)) {
        this.scene.anims.create({
          key: attackKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.attackKey, {
            start: row * cfg.attackFrameCount,
            end: row * cfg.attackFrameCount + cfg.attackFrameCount - 1,
          }),
          frameRate: cfg.attackFrameRate,
          repeat: 0,
        });
      }

      if (!this.scene.anims.exists(runAttackKeyName)) {
        this.scene.anims.create({
          key: runAttackKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.runAttackKey, {
            start: row * cfg.runAttackFrameCount,
            end: row * cfg.runAttackFrameCount + cfg.runAttackFrameCount - 1,
          }),
          frameRate: cfg.runAttackFrameRate,
          repeat: 0,
        });
      }

      if (!this.scene.anims.exists(walkAttackKeyName)) {
        this.scene.anims.create({
          key: walkAttackKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.walkAttackKey, {
            start: row * cfg.walkAttackFrameCount,
            end: row * cfg.walkAttackFrameCount + cfg.walkAttackFrameCount - 1,
          }),
          frameRate: cfg.walkAttackFrameRate,
          repeat: 0,
        });
      }

      if (!this.scene.anims.exists(hurtKeyName)) {
        this.scene.anims.create({
          key: hurtKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.hurtKey, {
            start: row * cfg.hurtFrameCount,
            end: row * cfg.hurtFrameCount + cfg.hurtFrameCount - 1,
          }),
          frameRate: cfg.hurtFrameRate,
          repeat: 0,
        });
      }

      if (!this.scene.anims.exists(deathKeyName)) {
        this.scene.anims.create({
          key: deathKeyName,
          frames: this.scene.anims.generateFrameNumbers(this.deathKey, {
            start: row * cfg.deathFrameCount,
            end: row * cfg.deathFrameCount + cfg.deathFrameCount - 1,
          }),
          frameRate: cfg.deathFrameRate,
          repeat: 0,
        });
      }
    }
  }

  /**
   * Kurze Trefferanimation (stehend), danach Idle. Kein Start während Angriff.
   */
  triggerHurt() {
    const cfg = PlayerVisualConfig;
    if (this._dead || this._hurting || this._attacking) {
      return;
    }
    this._hurting = true;
    this.sprite.setVelocity(0, 0);
    this.sprite.setTexture(this.hurtKey);
    this._locomotion = 'hurt';

    const animKey = cfg.anims.hurt[this._lastDir];
    this.sprite.anims.play(animKey, false);

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      if (this._dead) {
        return;
      }
      this._hurting = false;
      this.sprite.setTexture(this.idleKey);
      this._locomotion = 'idle';
      this.sprite.anims.play(cfg.anims.idle[this._lastDir], false);
    });
  }

  /**
   * Tod: bricht alles ab, letztes Frame bleibt stehen (kein Respawn in dieser Szene).
   */
  triggerDeath() {
    const cfg = PlayerVisualConfig;
    if (this._dead) {
      return;
    }
    this._dead = true;
    this._hurting = false;
    this._attacking = false;
    this.sprite.setVelocity(0, 0);
    this.sprite.removeAllListeners('animationcomplete');

    this.sprite.setTexture(this.deathKey);
    this._locomotion = 'death';

    const animKey = cfg.anims.death[this._lastDir];
    this.sprite.anims.play(animKey, false);

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      this.sprite.anims.pause();
    });
  }

  /**
   * @param {'down'|'left'|'right'|'up'} dir
   */
  _beginAttack(dir) {
    const cfg = PlayerVisualConfig;
    this._attacking = true;
    this._lastDir = dir;
    this.sprite.setVelocity(0, 0);
    this.sprite.setTexture(this.attackKey);
    this._locomotion = 'attack';

    const animKey = cfg.anims.attack[dir];
    this.sprite.anims.play(animKey, false);

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      if (this._dead) {
        return;
      }
      this._attacking = false;
      this.sprite.setTexture(this.idleKey);
      this._locomotion = 'idle';
      this.sprite.anims.play(cfg.anims.idle[this._lastDir], false);
    });
  }

  /**
   * @param {'down'|'left'|'right'|'up'} dir
   */
  _beginRunAttack(dir) {
    const cfg = PlayerVisualConfig;
    this._attacking = true;
    this._lastDir = dir;
    this.sprite.setTexture(this.runAttackKey);
    this._locomotion = 'runAttack';

    const animKey = cfg.anims.runAttack[dir];
    this.sprite.anims.play(animKey, false);

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      if (this._dead) {
        return;
      }
      this._attacking = false;
      this.sprite.setTexture(this.idleKey);
      this._locomotion = 'idle';
      this.sprite.anims.play(cfg.anims.idle[this._lastDir], false);
    });
  }

  /**
   * @param {'down'|'left'|'right'|'up'} dir
   */
  _beginWalkAttack(dir) {
    const cfg = PlayerVisualConfig;
    this._attacking = true;
    this._lastDir = dir;
    this.sprite.setTexture(this.walkAttackKey);
    this._locomotion = 'walkAttack';

    const animKey = cfg.anims.walkAttack[dir];
    this.sprite.anims.play(animKey, false);

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      if (this._dead) {
        return;
      }
      this._attacking = false;
      this.sprite.setTexture(this.idleKey);
      this._locomotion = 'idle';
      this.sprite.anims.play(cfg.anims.idle[this._lastDir], false);
    });
  }

  /**
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
   * @param {Record<string, Phaser.Input.Keyboard.Key>} wasd
   * @param {Phaser.Input.Keyboard.Key} shiftKey
   * @param {Phaser.Input.Keyboard.Key} eKey
   */
  update(cursors, wasd, shiftKey, eKey) {
    const cfg = PlayerVisualConfig;

    if (this._dead) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    if (this._hurting) {
      this.sprite.setVelocity(0, 0);
      return;
    }

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

    const moving = vx !== 0 || vy !== 0;

    let dir = this._lastDir;
    if (moving) {
      if (Math.abs(vx) > Math.abs(vy)) {
        dir = vx > 0 ? 'right' : 'left';
      } else {
        dir = vy > 0 ? 'down' : 'up';
      }
    }

    const wantsRun = shiftKey.isDown && moving;
    const speed = wantsRun ? cfg.runSpeed : cfg.movementSpeed;

    if (this._attacking) {
      if (this._locomotion === 'attack') {
        this.sprite.setVelocity(0, 0);
        return;
      }
      this.sprite.setVelocity(vx * speed, vy * speed);
      if (moving) {
        this._lastDir = dir;
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(eKey)) {
      if (wantsRun) {
        this._beginRunAttack(dir);
      } else if (moving) {
        this._beginWalkAttack(dir);
      } else {
        this._beginAttack(dir);
      }
      return;
    }

    this.sprite.setVelocity(vx * speed, vy * speed);

    /** @type {'idle' | 'walk' | 'run'} */
    const mode = !moving ? 'idle' : wantsRun ? 'run' : 'walk';

    const textureForMode =
      mode === 'idle' ? this.idleKey : mode === 'walk' ? this.walkKey : this.runKey;
    const animKeyForMode =
      mode === 'idle'
        ? cfg.anims.idle[dir]
        : mode === 'walk'
          ? cfg.anims.walk[dir]
          : cfg.anims.run[dir];

    const enterMode = this._locomotion !== mode;
    if (enterMode) {
      this.sprite.setTexture(textureForMode);
      this._locomotion = mode;
    }

    const dirChanged = dir !== this._lastDir;
    if (enterMode || dirChanged) {
      this.sprite.anims.play(animKeyForMode, false);
    } else {
      this.sprite.anims.play(animKeyForMode, true);
    }

    this._lastDir = dir;
  }
}
