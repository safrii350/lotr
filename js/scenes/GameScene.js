import { AssetKeys } from '../config/AssetKeys.js';
import { CustomMapLoader } from '../map/CustomMapLoader.js';
import { PlayerController } from '../entities/PlayerController.js';
import { HealthBar } from '../ui/HealthBar.js';

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
    this.healthBar = new HealthBar(this, 10, 10, 220, 28);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.player.isDead) {
      this.playerHp.current = Math.max(0, this.playerHp.current - 15);
      this.healthBar.setHp(this.playerHp.current, this.playerHp.max);
      if (this.playerHp.current <= 0) {
        this.player.triggerDeath();
      } else {
        this.player.triggerHurt();
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.jKey) && !this.player.isDead) {
      this.playerHp.current = 0;
      this.healthBar.setHp(0, this.playerHp.max);
      this.player.triggerDeath();
    }
    this.player.update(this.cursors, this.wasd, this.shiftKey, this.eKey);
  }
}
