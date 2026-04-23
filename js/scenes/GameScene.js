import { AssetKeys } from '../config/AssetKeys.js';
import { CustomMapLoader } from '../map/CustomMapLoader.js';
import { PlayerController } from '../entities/PlayerController.js';
import { SlimeEnemy } from '../entities/SlimeEnemy.js';
import { HealthBar } from '../ui/HealthBar.js';

const PLAYER_MELEE_RANGE = 72;
const PLAYER_MELEE_DAMAGE = 20;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const loader = new CustomMapLoader(this, AssetKeys.mapJson);
    const { map, collisionLayer } = loader.build();

    const mapWidthPx = map.widthInPixels;
    const mapHeightPx = map.heightInPixels;

    this.physics.world.setBounds(0, 0, mapWidthPx, mapHeightPx);

    const startX = mapWidthPx * 0.45;
    const startY = mapHeightPx * 0.55;

    this.player = new PlayerController(
      this,
      startX,
      startY,
      AssetKeys.playerIdle,
      AssetKeys.playerWalk,
      AssetKeys.playerRun,
      AssetKeys.playerAttack,
      AssetKeys.playerRunAttack,
      AssetKeys.playerWalkAttack,
      AssetKeys.playerHurt,
      AssetKeys.playerDeath
    );
    this.player.sprite.setDepth(5);

    this.physics.add.collider(this.player.sprite, collisionLayer);

    this.cameras.main.setBounds(0, 0, mapWidthPx, mapHeightPx);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
    this.cameras.main.setZoom(1);

    this.playerHp = { current: 100, max: 100 };
    this.healthBar = new HealthBar(this, 10, 10, 152, 16, {
      borderW: 2,
      fontSize: '11px',
    });

    this._playerHitSlimeThisSwing = false;

    this.slime = new SlimeEnemy(
      this,
      startX + 160,
      startY + 30,
      {
        idle: AssetKeys.slime2Idle,
        walk: AssetKeys.slime2Walk,
        run: AssetKeys.slime2Run,
        attack: AssetKeys.slime2Attack,
        hurt: AssetKeys.slime2Hurt,
        death: AssetKeys.slime2Death,
      },
      collisionLayer,
      (damage) => this.applyPlayerDamage(damage)
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
  }

  /**
   * @param {number} amount
   */
  applyPlayerDamage(amount) {
    if (this.player.isDead) {
      return;
    }
    this.playerHp.current = Math.max(0, this.playerHp.current - amount);
    this.healthBar.setHp(this.playerHp.current, this.playerHp.max);
    if (this.playerHp.current <= 0) {
      this.player.triggerDeath();
    } else {
      this.player.triggerHurt();
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.player.isDead) {
      this.applyPlayerDamage(15);
    }
    if (Phaser.Input.Keyboard.JustDown(this.jKey) && !this.player.isDead) {
      this.playerHp.current = 0;
      this.healthBar.setHp(0, this.playerHp.max);
      this.player.triggerDeath();
    }

    this.player.update(this.cursors, this.wasd, this.shiftKey, this.eKey);

    if (!this.player.isAttacking) {
      this._playerHitSlimeThisSwing = false;
    }
    if (
      this.slime &&
      !this.slime.isDead &&
      this.player.isAttacking &&
      !this._playerHitSlimeThisSwing
    ) {
      const d = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.slime.sprite.x,
        this.slime.sprite.y
      );
      if (d <= PLAYER_MELEE_RANGE) {
        this._playerHitSlimeThisSwing = true;
        this.slime.takeDamage(PLAYER_MELEE_DAMAGE);
      }
    }

    this.slime.update(this.player.sprite, this.player.isDead);
  }
}
