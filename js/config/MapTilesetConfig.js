/**
 * Abmessungen von assets/map/spritesheet.png und Kachel-Geometrie.
 * Quelle: Projekt-Vorgabe — Sheet 128×368 px, Map tileSize 16.
 */
export const MapTilesetConfig = Object.freeze({
  textureKey: 'map-spritesheet',
  imagePath: 'assets/map/spritesheet.png',
  /** Pixelbreite/Höhe des gesamten Sheets */
  sheetWidth: 128,
  sheetHeight: 368,
  tileWidth: 16,
  tileHeight: 16,
  /** Abgeleitet: 8 × 23 Kacheln */
  columns: 8,
  rows: 23,
});
