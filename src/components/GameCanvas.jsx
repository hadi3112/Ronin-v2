import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

const assetUrl = (path) => {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${path.replace(/^\//, '')}`.replace(/([^:]\/)\/+/g, '$1')
}

class PreferencesPhaserScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreferencesPhaserScene' })
  }

  preload() {
    const roninUrl = assetUrl('images/mascot_img.png')
    const bossUrl = assetUrl('images/samurai_red.png')
    this.load.image('ronin', roninUrl)
    this.load.image('red_samurai', bossUrl)

    this.load.once('loaderror', (file) => {
      console.warn('[GameCanvas] Phaser asset failed to load — using placeholder.', {
        key: file.key,
        url: file.url,
      })
    })
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    const midY = h / 2
    const roninX = w * 0.28
    const bossX = w * 0.72
    const maxW = w * 0.22
    const maxH = h * 0.52

    this.addStaticEntity(roninX, midY, 'ronin', 0x34d399, maxW, maxH, 'Ronin')
    this.addStaticEntity(bossX, midY, 'red_samurai', 0xe11d48, maxW, maxH, 'Red Samurai')
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} textureKey
   * @param {number} fallbackColor
   * @param {number} maxW
   * @param {number} maxH
   * @param {string} labelForLog
   */
  addStaticEntity(x, y, textureKey, fallbackColor, maxW, maxH, labelForLog) {
    if (this.textures.exists(textureKey)) {
      const sprite = this.add.sprite(x, y, textureKey).setOrigin(0.5)
      const scale = Math.min(maxW / sprite.width, maxH / sprite.height, 1)
      sprite.setScale(scale)
      return sprite
    }

    console.warn(
      `[GameCanvas] Texture "${textureKey}" missing for ${labelForLog} — drawing placeholder rectangle.`,
    )
    const rw = Math.min(maxW, 56)
    const rh = Math.min(maxH, 88)
    return this.add.rectangle(x, y, rw, rh, fallbackColor).setStrokeStyle(2, 0xf5f5f5)
  }
}

/**
 * Minimal Phaser 3 host for React. Destroys the game instance on unmount.
 */
export default function GameCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const parent = containerRef.current
    if (!parent) return

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: 320,
      height: 288,
      transparent: true,
      backgroundColor: '#00000000',
      banner: false,
      scene: [PreferencesPhaserScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    })

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      id="game-container"
      className="h-72 w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.45)]"
      aria-label="Game preview canvas"
    />
  )
}
