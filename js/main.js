import { GameConfig } from './config/GameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';

function createGame() {
  return new Phaser.Game({
    ...GameConfig,
    parent: 'game-root',
    scene: [BootScene, GameScene],
  });
}

createGame();
