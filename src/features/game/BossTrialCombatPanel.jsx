import GameCanvas from '../../components/GameCanvas.jsx'

function hpFillPercent(current, max) {
  if (max <= 0) return 0
  if (current >= max) return 100
  return Math.max(0, Math.min(100, Math.round((current / max) * 1000) / 10))
}

const arenaBg = [
  'radial-gradient(ellipse at 50% 115%, rgba(61,16,21,0.62), transparent 52%)',
  'linear-gradient(185deg, rgba(42,28,22,0.97) 0%, rgba(24,18,14,0.99) 42%, rgba(10,8,7,1) 100%)',
  'repeating-linear-gradient(90deg, rgba(255,240,220,0.04) 0 1px, transparent 1px 56px)',
].join(',')

/**
 * Static React chrome (HP bars + arena frame) + Phaser combat sprites.
 * @param {{ combatVisualState: string; roninHp: number; bossHp: number; maxHp?: number; phase: string }} props
 */
export default function BossTrialCombatPanel({
  combatVisualState,
  roninHp,
  bossHp,
  maxHp = 100,
  phase,
}) {
  const roninPct = hpFillPercent(roninHp, maxHp)
  const bossPct = hpFillPercent(bossHp, maxHp)

  return (
    <div
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-2xl border border-amber-900/45 shadow-[inset_0_0_90px_rgba(0,0,0,0.72)]"
      style={{ backgroundImage: arenaBg }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.22]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cpath d='M0 36h72M36 0v72' stroke='%23f5e6d3' stroke-opacity='0.07'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute inset-x-[8%] top-[10%] z-[1] h-[32%] rounded-[40%] border border-amber-200/10 bg-gradient-to-b from-amber-100/5 to-transparent blur-[2px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/5 bg-gradient-to-t from-black/75 to-transparent" />

      <div className="pointer-events-none absolute left-0 right-0 top-2 z-20 flex justify-between gap-4 px-3 md:px-6">
        <div className="w-36 max-w-[40%] rounded-full border border-white/10 bg-black/55 px-2 py-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-emerald-400/90" style={{ width: `${roninPct}%` }} />
          </div>
          <p className="mt-1 text-center text-[9px] uppercase tracking-[0.35em] text-ronin-muted">Ronin</p>
        </div>
        <div className="w-36 max-w-[40%] rounded-full border border-white/10 bg-black/55 px-2 py-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-ronin-crimson/90" style={{ width: `${bossPct}%` }} />
          </div>
          <p className="mt-1 text-center text-[9px] font-semibold uppercase tracking-[0.35em] text-ronin-muted">Boss</p>
        </div>
      </div>

      <div className="relative z-[5] h-[calc(100%-5.5rem)] min-h-[200px] w-full pt-2">
        <GameCanvas
          variant="bossBattle"
          combatVisualState={combatVisualState}
          roninHp={roninHp}
          bossHp={bossHp}
          maxHp={maxHp}
          phase={phase}
          className="h-full w-full border-0 bg-transparent shadow-none"
        />
      </div>
    </div>
  )
}
