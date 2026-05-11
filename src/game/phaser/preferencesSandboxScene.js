import Phaser from 'phaser'
import { assetUrl } from './assetUrl.js'

/** Horizontal offset of red samurai from canvas center (px, Phaser space). */
const PREF_SAMURAI_OFFSET_X = 28

/** Preferences-only: red samurai preview (Phaser, not React). */
export class PreferencesSandboxScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreferencesSandboxScene' })
  }

  preload() {
    this.load.image('red_samurai', assetUrl('images/samurai_red.png'))
    this.load.once('loaderror', (file) => {
      console.warn('[GameCanvas] preferences asset failed', file?.key, file?.url)
    })
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    const cx = w / 2 + PREF_SAMURAI_OFFSET_X
    const cy = h / 2
    const maxW = w * 0.5
    const maxH = h * 0.65

    let sprite
    if (this.textures.exists('red_samurai')) {
      sprite = this.add.sprite(cx, cy, 'red_samurai').setOrigin(0.5)
    } else {
      sprite = this.add.rectangle(cx, cy, 64, 96, 0x881144).setStrokeStyle(2, 0xffaaaa)
    }

    const texW = sprite.width || 64
    const texH = sprite.height || 96
    const fit = Math.min(maxW / texW, maxH / texH, 1)
    const doubled = fit * 2
    const maxAllowed = Math.min((w * 0.92) / texW, (h * 0.92) / texH)
    const baseScale = Math.min(doubled, maxAllowed)
    sprite.setScale(baseScale)

    if (sprite.postFX?.addGlow) {
      sprite.postFX.addGlow(0x881144, 3, 1, false, 0.11, 6)
    }

    this.tweens.add({
      targets: sprite,
      y: cy - 8,
      scaleX: baseScale * 1.045,
      scaleY: baseScale * 1.045,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }
}
