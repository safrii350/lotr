import { AssetKeys } from '../config/AssetKeys.js';
import { MapTilesetConfig } from '../config/MapTilesetConfig.js';
import {
  getPlayerTexturePaths,
  PlayerVisualConfig,
} from '../config/PlayerVisualConfig.js';
import {
  getSlimeTexturePaths,
  SlimeEnemyConfig,
} from '../config/SlimeEnemyConfig.js';

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

    const slimePaths = getSlimeTexturePaths();
    const sf = SlimeEnemyConfig.frameWidth;
    const sh = SlimeEnemyConfig.frameHeight;
    this.load.spritesheet(AssetKeys.slime2Idle, slimePaths.idle, {
      frameWidth: sf,
      frameHeight: sh,
    });
    this.load.spritesheet(AssetKeys.slime2Walk, slimePaths.walk, {
      frameWidth: sf,
      frameHeight: sh,
    });
    this.load.spritesheet(AssetKeys.slime2Run, slimePaths.run, {
      frameWidth: sf,
      frameHeight: sh,
    });
    this.load.spritesheet(AssetKeys.slime2Attack, slimePaths.attack, {
      frameWidth: sf,
      frameHeight: sh,
    });
    this.load.spritesheet(AssetKeys.slime2Hurt, slimePaths.hurt, {
      frameWidth: sf,
      frameHeight: sh,
    });
    this.load.spritesheet(AssetKeys.slime2Death, slimePaths.death, {
      frameWidth: sf,
      frameHeight: sh,
    });
  }

  create() {
    this.scene.start('GameScene');
  }
}
