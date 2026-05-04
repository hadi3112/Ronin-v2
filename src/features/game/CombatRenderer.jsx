import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CombatVisualState } from '../../game/CombatStateMachine.js'

const RONIN_IMG = '/images/mascot_img.png'
const BOSS_IMG = '/images/samurai_red.png'
const RONIN_FALLBACK = '/images/ronin-mascot.png'

const RONIN_SLASHES = [
  'M 8 72 Q 58 18 112 58',
  'M 12 68 Q 62 22 108 52',
  'M 6 76 Q 54 14 114 62',
]

const BOSS_SLASHES = [
  'M 104 18 Q 52 96 16 104',
  'M 98 22 Q 48 88 22 98',
  'M 110 14 Q 56 102 12 108',
]

function hpFillPercent(current, max) {
  if (max <= 0) return 0
  if (current >= max) return 100
  return Math.max(0, Math.min(100, Math.round((current / max) * 1000) / 10))
}

function SpriteFigure({ side, imgSrc, fallbackSrc, visualState, isKo }) {
  const [src, setSrc] = useState(imgSrc)
  const isRonin = side === 'ronin'
  /** Ronin mirrored toward center; boss (samurai_red) not mirrored */
  const facing = isRonin ? -1 : 1

  const dashX =
    visualState === CombatVisualState.RONIN_DASH && isRonin
      ? 'min(32vw, 240px)'
      : visualState === CombatVisualState.BOSS_DASH && !isRonin
        ? 'max(-32vw, -240px)'
        : visualState === CombatVisualState.RONIN_HIT_STAGGER && isRonin
          ? 'max(-11vw, -80px)'
          : visualState === CombatVisualState.BOSS_HIT_STAGGER && !isRonin
            ? 'min(11vw, 80px)'
            : '0vw'

  const strikeBeat = (() => {
    if (isRonin) {
      if (visualState === CombatVisualState.RONIN_STRIKE_1) return 0
      if (visualState === CombatVisualState.RONIN_STRIKE_2) return 1
      if (visualState === CombatVisualState.RONIN_STRIKE_3) return 2
    } else {
      if (visualState === CombatVisualState.BOSS_OVERHEAD_1) return 0
      if (visualState === CombatVisualState.BOSS_OVERHEAD_2) return 1
      if (visualState === CombatVisualState.BOSS_OVERHEAD_3) return 2
    }
    return null
  })()

  const strikeRonin = strikeBeat != null && isRonin
  const strikeBoss = strikeBeat != null && !isRonin
  const idle = visualState === CombatVisualState.IDLE

  const koRonin = isKo && isRonin
  const koBoss = isKo && !isRonin

  const slashPath = strikeRonin ? RONIN_SLASHES[strikeBeat] : strikeBoss ? BOSS_SLASHES[strikeBeat] : null
  const slashKey = strikeBeat != null ? `${side}-slash-${strikeBeat}-${visualState}` : 'none'

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2"
      style={{ scaleX: facing }}
      animate={{ x: dashX }}
      transition={{ duration: 0.11, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{
          rotateZ: strikeRonin
            ? [0, -12, 28, -10, 0]
            : strikeBoss
              ? [0, 16, -34, 14, 0]
              : idle
                ? [0, -2.8, 0, 2.8, 0]
                : 0,
          scaleY: idle ? [1, 1.04, 1, 1.02, 1] : 1,
          y: koRonin ? 48 : 0,
          rotateX: koRonin ? 72 : 0,
          opacity: koBoss ? 0.12 : 1,
          filter: koBoss ? 'grayscale(1) brightness(0.65)' : strikeRonin || strikeBoss ? 'brightness(1.08)' : 'none',
        }}
        transition={
          idle
            ? { duration: 2.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
            : strikeRonin || strikeBoss
              ? { duration: 0.14, ease: 'easeOut' }
              : { duration: 0.35, ease: 'easeInOut' }
        }
      >
        <div className="relative h-36 w-28 md:h-44 md:w-32">
          <motion.img
            src={src}
            alt={isRonin ? 'Ronin' : 'Boss'}
            className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            onError={() => setSrc(fallbackSrc)}
            animate={
              visualState === CombatVisualState.RONIN_HIT_STAGGER && isRonin
                ? { filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }
                : {}
            }
            transition={{ duration: 0.22 }}
          />
          <AnimatePresence mode="sync">
            {slashPath ? (
              <motion.svg
                key={slashKey}
                className="pointer-events-none absolute -inset-8 overflow-visible"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.92, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                viewBox="0 0 120 120"
              >
                <defs>
                  <linearGradient id={`trail-${slashKey}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={isRonin ? '#6ee7b7' : '#fca5a5'} stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={slashPath}
                  fill="none"
                  stroke={`url(#trail-${slashKey})`}
                  strokeWidth="7"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.95 }}
                  animate={{ pathLength: 1, opacity: [0.95, 1, 0] }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                />
              </motion.svg>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * @param {{ combatVisualState: string; roninHp: number; bossHp: number; maxHp?: number; phase: string }} props
 */
export default function CombatRenderer({ combatVisualState, roninHp, bossHp, maxHp = 100, phase }) {
  const roninKo = phase === 'defeat' || combatVisualState === CombatVisualState.RONIN_KO
  const bossKo = phase === 'victory' || combatVisualState === CombatVisualState.BOSS_KO

  const shake =
    combatVisualState === CombatVisualState.BOSS_HIT_STAGGER ||
    combatVisualState === CombatVisualState.RONIN_HIT_STAGGER

  const roninPct = hpFillPercent(roninHp, maxHp)
  const bossPct = hpFillPercent(bossHp, maxHp)

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-amber-900/45 shadow-[inset_0_0_90px_rgba(0,0,0,0.72)]"
      animate={shake ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.24 }}
      style={{
        backgroundImage: [
          'radial-gradient(ellipse at 50% 115%, rgba(61,16,21,0.62), transparent 52%)',
          'linear-gradient(185deg, rgba(42,28,22,0.97) 0%, rgba(24,18,14,0.99) 42%, rgba(10,8,7,1) 100%)',
          'repeating-linear-gradient(90deg, rgba(255,240,220,0.04) 0 1px, transparent 1px 56px)',
        ].join(','),
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cpath d='M0 36h72M36 0v72' stroke='%23f5e6d3' stroke-opacity='0.07'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute inset-x-[8%] top-[12%] h-[35%] rounded-[40%] border border-amber-200/10 bg-gradient-to-b from-amber-100/5 to-transparent blur-[2px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />

      <div className="relative flex h-full items-end justify-between px-3 pb-5 pt-10 md:px-10">
        <div className="flex w-40 flex-col items-center gap-1">
          <div className="w-full rounded-full border border-white/10 bg-black/55 px-2 py-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400/90"
                style={{ width: `${roninPct}%` }}
              />
            </div>
          </div>
          <SpriteFigure side="ronin" imgSrc={RONIN_IMG} fallbackSrc={RONIN_FALLBACK} visualState={combatVisualState} isKo={roninKo} />
          <p className="text-[10px] uppercase tracking-[0.35em] text-ronin-muted">Ronin</p>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[40%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/10 bg-amber-300/5 blur-[3px]" />

        <div className="flex w-40 flex-col items-center gap-1">
          <div className="w-full rounded-full border border-white/10 bg-black/55 px-2 py-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-ronin-crimson/90"
                style={{ width: `${bossPct}%` }}
              />
            </div>
          </div>
          <SpriteFigure side="boss" imgSrc={BOSS_IMG} fallbackSrc={RONIN_FALLBACK} visualState={combatVisualState} isKo={bossKo} />
          <p className="text-[10px] uppercase tracking-[0.35em] text-ronin-muted">Samurai boss</p>
        </div>
      </div>
    </motion.div>
  )
}
