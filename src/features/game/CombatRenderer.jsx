import { motion } from 'framer-motion'
import { Shield, Swords } from 'lucide-react'

/**
 * @param {{ combatPhase: 'idle'|'ronin_dash'|'boss_dash'|'shake'; roninHp: number; bossHp: number; maxHp?: number }} props
 */
export default function CombatRenderer({ combatPhase, roninHp, bossHp, maxHp = 100 }) {
  const roninShift =
    combatPhase === 'ronin_dash' ? '24vw' : combatPhase === 'boss_dash' ? '-4vw' : '0vw'
  const bossShift =
    combatPhase === 'boss_dash' ? '-24vw' : combatPhase === 'ronin_dash' ? '4vw' : '0vw'

  const roninSlash = combatPhase === 'ronin_dash'
  const bossSlash = combatPhase === 'boss_dash'

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-black/70 via-ronin-nav-from/40 to-black/80"
      animate={combatPhase === 'shake' ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: combatPhase === 'shake' ? 0.32 : 0.2 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_120%,rgba(243,50,50,0.35),transparent_55%)]" />
      <div className="relative flex h-full items-end justify-between px-4 pb-6 pt-10 md:px-10">
        <motion.div
          className="relative flex flex-col items-center gap-2"
          animate={{ x: roninShift, rotate: roninSlash ? [0, -6, 14, -4, 0] : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="w-40 rounded-full border border-white/10 bg-black/50 px-2 py-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400/90 transition-[width] duration-300"
                style={{ width: `${Math.max(0, Math.min(1, roninHp / maxHp)) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 shadow-ronin-red md:h-28 md:w-28">
            <Swords className="h-10 w-10 md:h-12 md:w-12" aria-hidden />
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-ronin-muted">Ronin</p>
        </motion.div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ronin-crimson/25 bg-ronin-crimson/10 blur-[1px] md:block" />

        <motion.div
          className="relative flex flex-col items-center gap-2"
          animate={{ x: bossShift, rotate: bossSlash ? [0, 10, -16, 6, 0] : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="w-40 rounded-full border border-white/10 bg-black/50 px-2 py-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-ronin-crimson/90 transition-[width] duration-300"
                style={{ width: `${Math.max(0, Math.min(1, bossHp / maxHp)) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-ronin-crimson/50 bg-ronin-crimson/15 text-ronin-coral shadow-ronin-red md:h-28 md:w-28">
            <Shield className="h-10 w-10 md:h-12 md:w-12" aria-hidden />
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-ronin-muted">Boss</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
