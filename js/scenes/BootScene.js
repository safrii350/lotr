import { AssetKeys } from '../config/AssetKeys.js';
import { MapTilesetConfig } from '../config/MapTilesetConfig.js';
import {
  getPlayerTexturePaths,
  PlayerVisualConfig,
} from '../config/PlayerVisualConfig.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.json(AssetKeys.mapJson, 'assets/map/map.json');
    this.load.image(MapTilesetConfig.textureKey, MapTilesetConfig.imagePath);

    const paths = getPlayerTexturePaths();
    const { frameWidth, frameHeight } = PlayerVisualConfig;
    this.load.spritesheet(AssetKeys.playerIdle, paths.idle, {
      frameWidth,
      frameHeight,
    });
    this.load.spritesheet(AssetKeys.playerWalk, paths.walk, {
      frameWidth,
      frameHeight,
    });
    this.load.spritesheet(AssetKeys.playerRun, paths.run, {
      frameWidth,
      frameHeight,
    });
    this.load.spritesheet(AssetKeys.playerAttack, paths.attack, {
      frameWidth,
      frameHeight,
    });
    this.load.spritesheet(AssetKeys.playerRunAttack, paths.runAttack, {
      frameWidth,
      frameHeight,
    });
    this.load.spritesheet(AssetKeys.playerWalkAttack, paths.walkAttack, {
      frameWidth,
      frameHeight,
    });
    this.load.spritesheet(AssetKeys.playerHurt, paths.hurt, {
      frameWidth,
      frameHeight,
    });
    this.load.spritesheet(AssetKeys.playerDeath, paths.death, {
      frameWidth,
      frameHeight,
    });
  }

  create() {
    this.scene.start('GameScene');
  }
}
