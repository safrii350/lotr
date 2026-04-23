import { AssetKeys } from '../config/AssetKeys.js';
import { CustomMapLoader } from '../map/CustomMapLoader.js';
import { PlayerController } from '../entities/PlayerController.js';

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
      AssetKeys.playerWalkAttack
    );
    this.player.sprite.setDepth(5);

    this.physics.add.collider(this.player.sprite, collisionLayer);

    this.cameras.main.setBounds(0, 0, mapWidthPx, mapHeightPx);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
    this.cameras.main.setZoom(1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  update() {
    this.player.update(this.cursors, this.wasd, this.shiftKey, this.eKey);
  }
}
