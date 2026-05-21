import Phaser from 'phaser'
import { COLORS, EASE, getDPR } from './phaserDesignTokens.js'
import bossImg from '../../../public/images/samurai_red.png'

/** Horizontal offset of red samurai from canvas center (px, Phaser space). */
const PREF_SAMURAI_OFFSET_X = 28

/** Preferences-only: red samurai preview (Phaser, not React). */
export class PreferencesSandboxScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreferencesSandboxScene' })
  }

  preload() {
    this.load.image('red_samurai', bossImg)
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
      sprite = this.add.rectangle(cx, cy, 64, 96, COLORS.BOSS_GLOW).setStrokeStyle(2, 0xffaaaa)
    }

    const texW = sprite.width || 64
    const texH = sprite.height || 96
    const fit = Math.min(maxW / texW, maxH / texH, 1)
    const doubled = fit * 2
    const maxAllowed = Math.min((w * 0.92) / texW, (h * 0.92) / texH)
    const baseScale = Math.min(doubled, maxAllowed)
    sprite.setScale(baseScale)

    if (sprite.postFX?.addGlow) {
      sprite.postFX.addGlow(COLORS.BOSS_GLOW, 3, 1, false, 0.11, 6)
    }

    // Floating particle ambience
    if (!this.textures.exists('pref_spark')) {
      const pg = this.make.graphics({ x: 0, y: 0, add: false })
      pg.fillStyle(0xffffff, 1)
      pg.fillCircle(3, 3, 3)
      pg.generateTexture('pref_spark', 6, 6)
      pg.destroy()
    }

    const emitter = this.add.particles(w / 2, h / 2, 'pref_spark', {
      speed: { min: 8, max: 20 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.3, end: 0.1 },
      alpha: { start: 0.15, end: 0 },
      lifespan: { min: 3000, max: 5000 },
      tint: [COLORS.CORAL, COLORS.CRIMSON],
      blendMode: 'ADD',
      frequency: 400,
      quantity: 1,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-w / 2, -h / 4, w, h / 2),
      },
    })
    emitter.setDepth((sprite.depth || 0) - 1)

    // Breathing animation
    this.tweens.add({
      targets: sprite,
      y: cy - 8,
      scaleX: baseScale * 1.045,
      scaleY: baseScale * 1.045,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: EASE.SMOOTH_INOUT,
    })
  }
}
