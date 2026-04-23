import { SlimeEnemyConfig } from '../config/SlimeEnemyConfig.js';

/**
 * Slime2-Gegner: verfolgt den Spieler, greift in Reichweite an (Schaden über Callback).
 */
export class SlimeEnemy {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {{ idle: string, walk: string, run: string, attack: string, hurt: string, death: string }} textureKeys
   * @param {Phaser.Tilemaps.TilemapLayer} collisionLayer
   * @param {(damage: number) => void} onDamagePlayer
   */
  constructor(scene, x, y, textureKeys, collisionLayer, onDamagePlayer) {
    this.scene = scene;
    this.cfg = SlimeEnemyConfig;
    this.keys = textureKeys;
    this.onDamagePlayer = onDamagePlayer;

    this.hp = this.cfg.maxHp;
    this._dead = false;
    this._hurting = false;
    this._attacking = false;
    this._lastDir = 'down';
    this._locomotion = 'idle';
    this._lastAttackTime = -999999;
    /** @type {Phaser.Time.TimerEvent | null} */
    this._attackHitTimer = null;

    const sprite = scene.physics.add.sprite(x, y, textureKeys.idle);
    sprite.setCollideWorldBounds(false);
    const body = sprite.body;
    body.setSize(30, 22);
    body.setOffset(17, 36);
    this.sprite = sprite;

    scene.physics.add.collider(sprite, collisionLayer);

    this._registerAnimations();
    sprite.anims.play(this.cfg.anims.idle.down, true);
    sprite.setDepth(4);
  }

  get isDead() {
    return this._dead;
  }

  _registerAnimations() {
    const c = this.cfg;
    const rows = c.DIRECTION_ROW_INDEX;
    const k = this.keys;

    for (const [dir, row] of Object.entries(rows)) {
      const defs = [
        [c.anims.idle[dir], k.idle, c.idleFrameCount, c.idleFrameRate, -1],
        [c.anims.walk[dir], k.walk, c.walkFrameCount, c.walkFrameRate, -1],
        [c.anims.run[dir], k.run, c.runFrameCount, c.runFrameRate, -1],
        [c.anims.attack[dir], k.attack, c.attackFrameCount, c.attackFrameRate, 0],
        [c.anims.hurt[dir], k.hurt, c.hurtFrameCount, c.hurtFrameRate, 0],
        [c.anims.death[dir], k.death, c.deathFrameCount, c.deathFrameRate, 0],
      ];

      for (const [keyName, texKey, count, rate, repeat] of defs) {
        if (!this.scene.anims.exists(keyName)) {
          this.scene.anims.create({
            key: keyName,
            frames: this.scene.anims.generateFrameNumbers(texKey, {
              start: row * count,
              end: row * count + count - 1,
            }),
            frameRate: rate,
            repeat,
          });
        }
      }
    }
  }

  _cancelAttackSchedule() {
    if (this._attackHitTimer) {
      this._attackHitTimer.remove(false);
      this._attackHitTimer = null;
    }
    this._attacking = false;
  }

  /**
   * @param {Phaser.GameObjects.GameObject} playerSprite
   */
  _tryMeleeHit(playerSprite) {
    const c = this.cfg;
    if (this.scene.time.now - this._lastAttackTime < c.attackCooldownMs) {
      return;
    }
    this._lastAttackTime = this.scene.time.now;
    this._attacking = true;
    this.sprite.setVelocity(0, 0);

    const dir = this._lastDir;
    this.sprite.setTexture(this.keys.attack);
    const animKey = c.anims.attack[dir];
    this.sprite.anims.play(animKey, false);

    this._attackHitTimer = this.scene.time.delayedCall(
      c.attackHitDelayMs,
      () => {
        this._attackHitTimer = null;
        if (this._dead || !this._attacking) {
          return;
        }
        const d = Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          playerSprite.x,
          playerSprite.y
        );
        if (d <= c.attackRange + 28) {
          this.onDamagePlayer(c.damageToPlayer);
        }
      }
    );

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      this._attacking = false;
      if (this._dead) {
        return;
      }
      this.sprite.setTexture(this.keys.idle);
      this._locomotion = 'idle';
      this.sprite.anims.play(c.anims.idle[this._lastDir], true);
    });
  }

  _dirFromVector(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  }

  triggerHurt() {
    const c = this.cfg;
    if (this._dead || this._hurting) {
      return;
    }
    this._cancelAttackSchedule();
    this.sprite.anims.stop();
    this.sprite.removeAllListeners('animationcomplete');
    this._hurting = true;
    this.sprite.setVelocity(0, 0);
    this.sprite.setTexture(this.keys.hurt);
    this._locomotion = 'hurt';

    const animKey = c.anims.hurt[this._lastDir];
    this.sprite.anims.play(animKey, false);

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      if (this._dead) {
        return;
      }
      this._hurting = false;
      this.sprite.setTexture(this.keys.idle);
      this._locomotion = 'idle';
      this.sprite.anims.play(c.anims.idle[this._lastDir], true);
    });
  }

  triggerDeath() {
    const c = this.cfg;
    if (this._dead) {
      return;
    }
    this._dead = true;
    this._hurting = false;
    this._cancelAttackSchedule();
    this.sprite.removeAllListeners('animationcomplete');
    this.sprite.setVelocity(0, 0);
    if (this.sprite.body) {
      this.sprite.body.setEnable(false);
    }

    this.sprite.setTexture(this.keys.death);
    const animKey = c.anims.death[this._lastDir];
    this.sprite.anims.play(animKey, false);

    this.sprite.once('animationcomplete', (anim) => {
      if (anim.key !== animKey) {
        return;
      }
      this.sprite.anims.pause();
    });
  }

  /**
   * @param {number} amount
   */
  takeDamage(amount) {
    if (this._dead) {
      return;
    }
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.triggerDeath();
    } else {
      this.triggerHurt();
    }
  }

  /**
   * @param {Phaser.GameObjects.GameObject} playerSprite
   * @param {boolean} playerIsDead
   */
  update(playerSprite, playerIsDead) {
    const c = this.cfg;
    if (this._dead) {
      return;
    }
    if (playerIsDead) {
      this.sprite.setVelocity(0, 0);
      if (!this._hurting && !this._attacking) {
        this.sprite.anims.play(c.anims.idle[this._lastDir], true);
      }
      return;
    }
    if (this._hurting) {
      this.sprite.setVelocity(0, 0);
      return;
    }
    if (this._attacking) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    const dx = playerSprite.x - this.sprite.x;
    const dy = playerSprite.y - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const dir = this._dirFromVector(dx, dy);
    this._lastDir = dir;

    if (dist < c.attackRange) {
      this.sprite.setVelocity(0, 0);
      this._tryMeleeHit(playerSprite);
      if (!this._attacking) {
        const idleKey = c.anims.idle[dir];
        if (this._locomotion !== 'idle') {
          this.sprite.setTexture(this.keys.idle);
          this._locomotion = 'idle';
        }
        this.sprite.anims.play(idleKey, true);
      }
      return;
    }

    const speed =
      dist > c.runDistanceThreshold ? c.runSpeed : c.walkSpeed;
    this.sprite.setVelocity((dx / dist) * speed, (dy / dist) * speed);

    const mode = dist > c.runDistanceThreshold ? 'run' : 'walk';
    const textureKey = mode === 'run' ? this.keys.run : this.keys.walk;
    const animKey =
      mode === 'run' ? c.anims.run[dir] : c.anims.walk[dir];

    if (this._locomotion !== mode) {
      this.sprite.setTexture(textureKey);
      this._locomotion = mode;
      this.sprite.anims.play(animKey, false);
    } else {
      this.sprite.anims.play(animKey, true);
    }
  }
}
