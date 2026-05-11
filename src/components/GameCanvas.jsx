import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

/** Empty scene — gameplay and assets come later. */
class PreferencesPhaserScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreferencesPhaserScene' })
  }

  preload() {
    // TODO(Phaser): preload `samurai_red.png` for hover preview on preferences
  }

  create() {
    // TODO(Phaser): spawn red samurai sprite with gentle hover / idle motion
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
