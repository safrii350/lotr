import { MapTilesetConfig } from '../config/MapTilesetConfig.js';

/**
 * Lädt assets/map/map.json und baut daraus eine Phaser-Tilemap.
 *
 * Layer-Reihenfolge (unten → oben): gras, weg, objekte.
 * Kollision: nur Layer "objekte" — Tiles werden nur gesetzt, wenn id !== "0";
 * alle gesetzten Tiles in diesem Layer sind kollidierbar.
 */
export class CustomMapLoader {
  /**
   * @param {Phaser.Scene} scene
   * @param {string} jsonKey — Cache-Key für das geladene JSON (JSON aus preload)
   */
  constructor(scene, jsonKey) {
    this.scene = scene;
    this.jsonKey = jsonKey;
  }

  /**
   * @returns {{
   *   map: Phaser.Tilemaps.Tilemap,
   *   layers: { gras: Phaser.Tilemaps.TilemapLayer, weg: Phaser.Tilemaps.TilemapLayer, objekte: Phaser.Tilemaps.TilemapLayer },
   *   collisionLayer: Phaser.Tilemaps.TilemapLayer
   * }}
   */
  build() {
    const data = this.scene.cache.json.get(this.jsonKey);
    const tileW = data.tileSize;
    const tileH = data.tileSize;
    const w = data.mapWidth;
    const h = data.mapHeight;

    const map = this.scene.make.tilemap({
      tileWidth: tileW,
      tileHeight: tileH,
      width: w,
      height: h,
    });

    const { textureKey } = MapTilesetConfig;
    const tileset = map.addTilesetImage(
      'terrain',
      textureKey,
      tileW,
      tileH,
      0,
      0
    );

    if (!tileset) {
      throw new Error(
        'CustomMapLoader: Tileset konnte nicht erstellt werden. Prüfe Pfad und Maße (128×368, 16×16).'
      );
    }

    const layerByName = {};
    const drawOrder = ['gras', 'weg', 'objekte'];

    for (const name of drawOrder) {
      layerByName[name] = map.createBlankLayer(name, tileset, 0, 0, w, h);
      layerByName[name].setDepth(name === 'objekte' ? 2 : name === 'weg' ? 1 : 0);
    }

    const layerDefs = data.layers || [];
    for (const def of layerDefs) {
      const layer = layerByName[def.name];
      if (!layer) {
        continue;
      }
      for (const cell of def.tiles || []) {
        const id = parseInt(String(cell.id), 10);
        if (Number.isNaN(id)) {
          continue;
        }
        if (def.name === 'objekte' && id === 0) {
          continue;
        }
        if (id === 0 && def.name !== 'objekte') {
          continue;
        }
        map.putTileAt(id, cell.x, cell.y, false, layer);
      }
    }

    const collisionLayer = layerByName.objekte;
    collisionLayer.setCollisionByExclusion([-1]);

    return { map, layers: layerByName, collisionLayer };
  }
}
