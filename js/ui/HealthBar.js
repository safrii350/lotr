/** Farben wie Vorlage: Rand schwarz, Fill grün / dunkelrot, Text weiß. */
const COL = Object.freeze({
  border: 0x000000,
  missing: 0x990000,
  current: 0x00ff00,
});

/**
 * Horizontale HP-Leiste oben links (Screen Space: scrollFactor 0).
 * Grüner Anteil = current / max, Rest rot; Text „HP : a / b“ mittig.
 */
export class HealthBar {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x — links oben
   * @param {number} y
   * @param {number} barW
   * @param {number} barH
   * @param {{ borderW?: number, fontSize?: string }} [opts]
   */
  constructor(scene, x, y, barW, barH, opts = {}) {
    this.scene = scene;
    this.barW = barW;
    this.barH = barH;
    this.borderW = opts.borderW ?? 2;
    this.innerW = barW - this.borderW * 2;
    this.innerH = barH - this.borderW * 2;

    this.root = scene.add.container(x, y);
    this.root.setScrollFactor(0);
    this.root.setDepth(2000);

    this.bg = scene.add.rectangle(
      barW * 0.5,
      barH * 0.5,
      barW,
      barH,
      COL.missing
    );
    this.bg.setStrokeStyle(this.borderW, COL.border);

    this.green = scene.add.rectangle(
      this.borderW,
      barH * 0.5,
      this.innerW,
      this.innerH,
      COL.current
    );
    this.green.setOrigin(0, 0.5);

    this.label = scene.add.text(barW * 0.5, barH * 0.5, '', {
      fontFamily: 'sans-serif',
      fontSize: opts.fontSize ?? '12px',
      color: '#ffffff',
    });
    this.label.setOrigin(0.5);

    this.root.add([this.bg, this.green, this.label]);

    this._max = 100;
    this._current = 100;
    this.setHp(100, 100);
  }

  /**
   * @param {number} current
   * @param {number} max
   */
  setHp(current, max) {
    this._current = Math.max(0, current);
    this._max = Math.max(1, max);
    const ratio = Phaser.Math.Clamp(this._current / this._max, 0, 1);
    const w = Math.max(0, this.innerW * ratio);
    this.green.setSize(w, this.innerH);
    this.label.setText(
      `HP : ${Math.round(this._current)} / ${Math.round(this._max)}`
    );
  }
}

/**
 * Kompakte Leiste ohne Text, Weltkoordinaten (folgt der Kamera).
 * Vorlage: schmaler Balken mit schwarzem Rand, grün / dunkelrot.
 */
export class MiniHealthBar {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} barW
   * @param {number} barH
   * @param {number} [borderW]
   */
  constructor(scene, barW, barH, borderW = 2) {
    this.scene = scene;
    this.barW = barW;
    this.barH = barH;
    this.borderW = borderW;
    this.innerW = barW - borderW * 2;
    this.innerH = barH - borderW * 2;

    this.root = scene.add.container(0, 0);
    this.root.setDepth(50);

    this.bg = scene.add.rectangle(
      barW * 0.5,
      barH * 0.5,
      barW,
      barH,
      COL.missing
    );
    this.bg.setStrokeStyle(borderW, COL.border);

    this.green = scene.add.rectangle(
      borderW,
      barH * 0.5,
      this.innerW,
      this.innerH,
      COL.current
    );
    this.green.setOrigin(0, 0.5);

    this.root.add([this.bg, this.green]);

    this._max = 1;
    this._current = 1;
  }

  /**
   * @param {number} current
   * @param {number} max
   */
  setHp(current, max) {
    this._current = Math.max(0, current);
    this._max = Math.max(1, max);
    const ratio = Phaser.Math.Clamp(this._current / this._max, 0, 1);
    const w = Math.max(0, this.innerW * ratio);
    this.green.setSize(w, this.innerH);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    this.root.setPosition(x, y);
  }

  /**
   * @param {boolean} v
   */
  setVisible(v) {
    this.root.setVisible(v);
  }
}
