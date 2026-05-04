import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CombatVisualState, COMBAT_TIMINGS_MS } from '../../game/CombatStateMachine.js'

const RONIN_IMG = '/images/mascot_img.png'
const BOSS_IMG = '/images/samurai_red.png'
const RONIN_FALLBACK = '/images/ronin-mascot.png'
const RONIN_SWORD = '/images/ronin_sword.png'
const REDS_SWORD = '/images/reds_sword.png'

const RONIN_STRIKE_STATES = [
  CombatVisualState.RONIN_STRIKE_1,
  CombatVisualState.RONIN_STRIKE_2,
  CombatVisualState.RONIN_STRIKE_3,
  CombatVisualState.RONIN_STRIKE_4,
  CombatVisualState.RONIN_STRIKE_5,
  CombatVisualState.RONIN_STRIKE_6,
]

const RONIN_SLASHES = [
  'M 8 72 Q 58 18 112 58',
  'M 12 68 Q 62 22 108 52',
  'M 6 76 Q 54 14 114 62',
  'M 10 70 Q 60 20 110 56',
  'M 14 64 Q 64 24 106 50',
  'M 4 78 Q 52 16 116 60',
]

const BOSS_SLASHES = [
  'M 104 18 Q 52 96 16 104',
  'M 98 22 Q 48 88 22 98',
  'M 110 14 Q 56 102 12 108',
]

const RONIN_SWING_SEC = COMBAT_TIMINGS_MS.RONIN_STRIKE_BEAT / 1000

function hpFillPercent(current, max) {
  if (max <= 0) return 0
  if (current >= max) return 100
  return Math.max(0, Math.min(100, Math.round((current / max) * 1000) / 10))
}

function StrikeSword({ side, visualState, strikeBeat }) {
  const isRonin = side === 'ronin'
  const src = isRonin ? RONIN_SWORD : REDS_SWORD
  const show =
    strikeBeat != null &&
    (isRonin
      ? RONIN_STRIKE_STATES.includes(visualState)
      : [
          CombatVisualState.BOSS_OVERHEAD_1,
          CombatVisualState.BOSS_OVERHEAD_2,
          CombatVisualState.BOSS_OVERHEAD_3,
        ].includes(visualState))

  const baseDeg = -30
  const swing = isRonin ? [baseDeg, baseDeg - 30, baseDeg + 30] : [baseDeg, baseDeg + 30, baseDeg - 30]

  const pos =
    isRonin
      ? { right: '-0.25rem', left: 'auto', top: '18%' }
      : { left: '-0.25rem', right: 'auto', top: '18%' }

  if (!show) return null

  const swingDur = isRonin ? RONIN_SWING_SEC : COMBAT_TIMINGS_MS.STRIKE_BEAT / 1000

  const inner = (
    <motion.img
      key={`${side}-sword-${visualState}`}
      src={src}
      alt=""
      className={`pointer-events-none h-[72%] w-auto max-w-[none] object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.85)] ${
        !isRonin ? 'drop-shadow-[0_0_14px_rgba(255,23,68,0.9)]' : ''
      }`}
      style={{
        transformOrigin: isRonin ? '80% 85%' : '20% 85%',
      }}
      initial={{ rotate: baseDeg, opacity: 1 }}
      animate={{ rotate: swing, opacity: 1 }}
      transition={{ duration: swingDur, ease: 'easeInOut' }}
    />
  )

  if (isRonin) {
    return (
      <div
        className="pointer-events-none absolute z-[2]"
        style={{ ...pos, transform: 'translateX(50px)' }}
      >
        {inner}
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute z-[2]" style={pos}>
      {inner}
    </div>
  )
}

function SpriteFigure({ side, imgSrc, fallbackSrc, visualState, isKo }) {
  const [src, setSrc] = useState(imgSrc)
  const isRonin = side === 'ronin'
  const facing = isRonin ? -1 : 1

  const roninAttacking =
    visualState === CombatVisualState.RONIN_DASH ||
    RONIN_STRIKE_STATES.includes(visualState) ||
    visualState === CombatVisualState.BOSS_HIT_STAGGER

  const roninReturning = visualState === CombatVisualState.RONIN_DASH_BACK

  const bossAttacking =
    visualState === CombatVisualState.BOSS_DASH ||
    visualState === CombatVisualState.BOSS_OVERHEAD_1 ||
    visualState === CombatVisualState.BOSS_OVERHEAD_2 ||
    visualState === CombatVisualState.BOSS_OVERHEAD_3 ||
    visualState === CombatVisualState.RONIN_HIT_STAGGER

  const bossReturning = visualState === CombatVisualState.BOSS_DASH_BACK

  const dashX = isRonin
    ? roninAttacking
      ? 'clamp(140px, 46vw, 520px)'
      : roninReturning || visualState === CombatVisualState.IDLE || visualState === CombatVisualState.HIT_RESOLVE
        ? '0px'
        : visualState === CombatVisualState.RONIN_HIT_STAGGER
          ? 'clamp(48px, 14vw, 160px)'
          : '0px'
    : bossAttacking
      ? 'clamp(-140px, -46vw, -520px)'
      : bossReturning || visualState === CombatVisualState.IDLE || visualState === CombatVisualState.HIT_RESOLVE
        ? '0px'
        : visualState === CombatVisualState.BOSS_HIT_STAGGER
          ? 'clamp(-48px, -14vw, -160px)'
          : '0px'

  const strikeBeat = (() => {
    if (isRonin) {
      const i = RONIN_STRIKE_STATES.indexOf(visualState)
      return i >= 0 ? i : null
    }
    if (visualState === CombatVisualState.BOSS_OVERHEAD_1) return 0
    if (visualState === CombatVisualState.BOSS_OVERHEAD_2) return 1
    if (visualState === CombatVisualState.BOSS_OVERHEAD_3) return 2
    return null
  })()

  const strikeRonin = strikeBeat != null && isRonin
  const strikeBoss = strikeBeat != null && !isRonin
  const idle = visualState === CombatVisualState.IDLE

  const koRonin = isKo && isRonin
  const koBoss = isKo && !isRonin

  const slashPath = strikeRonin ? RONIN_SLASHES[strikeBeat] : strikeBoss ? BOSS_SLASHES[strikeBeat] : null
  const slashKey = `${side}-slash-${visualState}`
  const slashDrawSec = strikeRonin ? Math.min(0.32, RONIN_SWING_SEC * 0.95) : 0.2

  const showSwordIdle = isRonin && (visualState === CombatVisualState.RONIN_DASH || visualState === CombatVisualState.RONIN_DASH_BACK)
  const showSwordIdleBoss =
    !isRonin && (visualState === CombatVisualState.BOSS_DASH || visualState === CombatVisualState.BOSS_DASH_BACK)

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2"
      animate={{ x: dashX }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
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
              ? { duration: Math.max(0.32, RONIN_SWING_SEC), ease: 'easeOut' }
              : { duration: 0.35, ease: 'easeInOut' }
        }
      >
        <div className="relative h-36 w-28 md:h-44 md:w-32">
          <div className="absolute inset-0" style={{ transform: `scaleX(${facing})` }}>
            <motion.img
              src={src}
              alt={isRonin ? 'Ronin' : 'Boss'}
              className="relative z-[1] h-full w-full object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
              onError={() => setSrc(fallbackSrc)}
              animate={
                visualState === CombatVisualState.RONIN_HIT_STAGGER && isRonin
                  ? { filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }
                  : {}
              }
              transition={{ duration: 0.22 }}
            />
          </div>

          {showSwordIdle ? (
            <div className="pointer-events-none absolute -right-1 top-[18%] z-[2]" style={{ transform: 'translateX(50px)' }}>
              <img
                src={RONIN_SWORD}
                alt=""
                className="h-[72%] w-auto max-w-none object-contain"
                style={{ transform: 'rotate(-30deg)', transformOrigin: '80% 85%' }}
              />
            </div>
          ) : null}
          {showSwordIdleBoss ? (
            <img
              src={REDS_SWORD}
              alt=""
              className="pointer-events-none absolute -left-1 top-[18%] z-[2] h-[72%] w-auto max-w-none object-contain"
              style={{ transform: 'rotate(-30deg)', transformOrigin: '20% 85%' }}
            />
          ) : null}

          <StrikeSword side={side} visualState={visualState} strikeBeat={strikeBeat} />

          <AnimatePresence>
            {slashPath ? (
              <motion.svg
                key={slashKey}
                className="pointer-events-none absolute -inset-8 z-[3] overflow-visible"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.85, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: slashDrawSec + 0.08 }}
                viewBox="0 0 120 120"
              >
                <defs>
                  <linearGradient id={`trail-${slashKey}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={isRonin ? '#6ee7b7' : '#ff1744'} stopOpacity="0.98" />
                    <stop offset="55%" stopColor={isRonin ? '#a7f3d0' : '#ff5252'} stopOpacity="0.85" />
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
                  transition={{ duration: slashDrawSec, ease: 'easeOut' }}
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
      className="relative h-full w-full overflow-x-hidden overflow-y-visible rounded-2xl border border-amber-900/45 shadow-[inset_0_0_90px_rgba(0,0,0,0.72)]"
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

      <div className="relative flex h-full items-end justify-between px-2 pb-5 pt-10 md:px-8">
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

        <div className="flex min-h-[200px] w-[min(100%,11rem)] flex-col items-center gap-0.5 md:w-48">
          <div className="w-full rounded-full border border-white/10 bg-black/55 px-2 py-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-ronin-crimson/90"
                style={{ width: `${bossPct}%` }}
              />
            </div>
          </div>
          <div className="origin-bottom translate-y-10 scale-[3] pb-1">
            <SpriteFigure side="boss" imgSrc={BOSS_IMG} fallbackSrc={RONIN_FALLBACK} visualState={combatVisualState} isKo={bossKo} />
          </div>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-ronin-muted">SAMURAI BOSS</p>
        </div>
      </div>
    </motion.div>
  )
}
