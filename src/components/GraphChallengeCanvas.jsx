import { useEffect, useMemo, useRef, useState } from 'react'
import Phaser from 'phaser'
import { buildGraphChallengePackage } from '../game/graphChallenge/buildGraphChallengePackage.js'
import { GRAPH_CHALLENGE_EVENT, GraphChallengeEventType } from '../game/graphChallenge/graphChallengeBus.js'
import { GraphSystemScene } from '../game/phaser/graphSystem/GraphSystemScene.js'

/** Phaser fires this on {@link Phaser.Game} when the core systems are up. */
const GAME_READY = Phaser.Core?.Events?.READY ?? 'ready'

/**
 * Phaser-only graph system challenges (linked list, circular buffer, DFS tree).
 * React listens on {@link GRAPH_CHALLENGE_EVENT} for ANSWER_* only.
 *
 * @param {{ subtype: string; payload: object; disabled: boolean; onSubmit: (ok: boolean) => void; questionId: string; onBusDetail?: (detail: object) => void }} props
 */
export default function GraphChallengeCanvas({ subtype, payload, disabled, onSubmit, questionId, onBusDetail }) {
  const parentRef = useRef(null)
  const gameRef = useRef(null)
  const disabledRef = useRef(disabled)
  const onSubmitRef = useRef(onSubmit)
  const [loading, setLoading] = useState(true)

  // Only rebuild when the question row changes. Parent often passes a new `payload` object reference each render;
  // tying pkg to that would destroy Phaser on every answer animation tick (DFS “blink” on Lock).
  // eslint-disable-next-line react-hooks/exhaustive-deps -- payload is read when subtype/questionId change (new question).
  const pkg = useMemo(() => buildGraphChallengePackage(subtype, payload), [subtype, questionId])

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

  const onBusDetailRef = useRef(onBusDetail)
  useEffect(() => {
    onBusDetailRef.current = onBusDetail
  }, [onBusDetail])

  useEffect(() => {
    const onBus = (e) => {
      const d = e.detail
      if (!d || d.questionId !== questionId) return
      onBusDetailRef.current?.(d)
      if (subtype === 'circular_queue') return
      if (d.type === GraphChallengeEventType.ANSWER_CORRECT) onSubmitRef.current?.(true)
      if (d.type === GraphChallengeEventType.ANSWER_WRONG) onSubmitRef.current?.(false)
    }
    window.addEventListener(GRAPH_CHALLENGE_EVENT, onBus)
    return () => window.removeEventListener(GRAPH_CHALLENGE_EVENT, onBus)
  }, [questionId, subtype])

  useEffect(() => {
    const parent = parentRef.current
    if (!parent || pkg.unknown) return

    setLoading(true)
    const rect = parent.getBoundingClientRect()
    const w = Math.max(320, Math.floor(rect.width) || parent.clientWidth || 520, 1)
    const h = Math.max(400, Math.floor(rect.height) || parent.clientHeight || 440, 1)

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: w,
      height: h,
      backgroundColor: '#0b0b0c',
      banner: false,
      antialias: true,
      roundPixels: false,
      audio: false,
    })
    gameRef.current = game

    let cancelled = false
    let raf = 0
    /** @type {null | (() => void)} */
    let removeGraphReady = null

    const startGraphScene = () => {
      if (cancelled) return
      game.scene.add('GraphSystemScene', GraphSystemScene, false)

      let attempts = 0
      const maxAttempts = 120

      const wireOrRetry = () => {
        if (cancelled) return
        const sc = game.scene.getScene('GraphSystemScene')
        if (sc?.events) {
          const onGraphReady = () => {
            if (!cancelled) setLoading(false)
          }
          sc.events.once('graph-ready', onGraphReady)
          removeGraphReady = () => sc.events.off('graph-ready', onGraphReady)

          game.scene.start('GraphSystemScene', {
            package: pkg,
            questionId,
            getDisabled: () => disabledRef.current,
          })
          return
        }
        attempts += 1
        if (attempts >= maxAttempts) {
          setLoading(false)
          return
        }
        raf = requestAnimationFrame(wireOrRetry)
      }

      wireOrRetry()
    }

    const onGameReady = () => {
      if (!cancelled) startGraphScene()
    }

    game.events.once(GAME_READY, onGameReady)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      game.events.off(GAME_READY, onGameReady)
      removeGraphReady?.()
      gameRef.current = null
      game.destroy(true)
    }
    // Fixed-length deps (subtype + questionId + pkg) so React never sees a changing dependency array size across HMR/edits.
  }, [subtype, questionId, pkg])

  if (pkg.unknown) {
    return <p className="text-sm text-ronin-coral">Unsupported graph subtype for Phaser.</p>
  }

  return (
    <div className="relative w-full">
      {loading ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-black/70 backdrop-blur-sm">
          <p className="text-sm font-semibold text-ronin-cream">Loading challenge…</p>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-ronin-coral" />
        </div>
      ) : null}
      <div ref={parentRef} className="min-h-[400px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/30" />
    </div>
  )
}
