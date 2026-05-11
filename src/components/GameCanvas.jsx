import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { PreferencesSandboxScene } from '../game/phaser/preferencesSandboxScene.js'
import { ChallengeBattleScene } from '../game/phaser/challengeBattleScene.js'

/**
 * @param {{
 *   variant?: 'preferences' | 'bossBattle'
 *   combatVisualState?: string
 *   roninHp?: number
 *   bossHp?: number
 *   maxHp?: number
 *   phase?: string
 *   className?: string
 * }} props
 */
export default function GameCanvas({
  variant = 'preferences',
  combatVisualState,
  roninHp,
  bossHp,
  maxHp = 100,
  phase = 'playing',
  className = '',
}) {
  const containerRef = useRef(null)
  const gameRef = useRef(null)

  useEffect(() => {
    const parent = containerRef.current
    if (!parent) return

    const SceneClass = variant === 'bossBattle' ? ChallengeBattleScene : PreferencesSandboxScene
    const w = variant === 'bossBattle' ? Math.max(300, parent.clientWidth || 520) : 320
    const h = variant === 'bossBattle' ? Math.max(220, parent.clientHeight || 260) : 288

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: w,
      height: h,
      transparent: true,
      backgroundColor: '#00000000',
      banner: false,
      scene: [SceneClass],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    })
    gameRef.current = game

    return () => {
      gameRef.current = null
      game.destroy(true)
    }
  }, [variant])

  useEffect(() => {
    if (variant !== 'bossBattle') return
    const game = gameRef.current
    if (!game) return

    const payload = {
      combatVisualState: combatVisualState ?? 'IDLE',
      roninHp: roninHp ?? 100,
      bossHp: bossHp ?? 100,
      maxHp: maxHp ?? 100,
      phase: phase ?? 'playing',
    }

    let attempts = 0
    const trySync = () => {
      attempts += 1
      const g = gameRef.current
      if (!g || attempts > 50) return
      if (g.scene.isActive('ChallengeBattleScene')) {
        g.scene.getScene('ChallengeBattleScene')?.syncCombat?.(payload)
        return
      }
      window.setTimeout(trySync, 20)
    }
    window.setTimeout(trySync, 0)
  }, [variant, combatVisualState, roninHp, bossHp, maxHp, phase])

  const baseClass =
    variant === 'preferences'
      ? 'relative flex min-h-[288px] w-full max-w-sm flex-1 flex-col overflow-hidden'
      : 'h-full min-h-[220px] w-full overflow-hidden rounded-2xl border border-amber-900/35 bg-black/20'

  return (
    <div
      ref={containerRef}
      id={variant === 'preferences' ? 'game-container' : undefined}
      className={[baseClass, className].filter(Boolean).join(' ')}
      aria-label={variant === 'preferences' ? 'Game preview canvas' : 'Boss trial combat canvas'}
    />
  )
}
