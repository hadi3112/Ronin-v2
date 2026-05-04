/**
 * Combat presentation + timing contract (drives UI; damage applies only after HIT phase).
 * Dash + triple strike + stagger; timings tuned ~1s snappier than the original 400/250/200 cadence.
 */

export const CombatVisualState = {
  IDLE: 'IDLE',
  RONIN_DASH: 'RONIN_DASH',
  RONIN_STRIKE_1: 'RONIN_STRIKE_1',
  RONIN_STRIKE_2: 'RONIN_STRIKE_2',
  RONIN_STRIKE_3: 'RONIN_STRIKE_3',
  BOSS_HIT_STAGGER: 'BOSS_HIT_STAGGER',
  BOSS_DASH: 'BOSS_DASH',
  BOSS_OVERHEAD_1: 'BOSS_OVERHEAD_1',
  BOSS_OVERHEAD_2: 'BOSS_OVERHEAD_2',
  BOSS_OVERHEAD_3: 'BOSS_OVERHEAD_3',
  RONIN_HIT_STAGGER: 'RONIN_HIT_STAGGER',
  HIT_RESOLVE: 'HIT_RESOLVE',
  BOSS_KO: 'BOSS_KO',
  RONIN_KO: 'RONIN_KO',
}

export const COMBAT_TIMINGS_MS = {
  DASH: 100,
  STRIKE_BEAT: 52,
  STAGGER: 100,
  KO: 1200,
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(id)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

/**
 * Runs one full exchange. Calls onVisualState during motion; calls applyDamage exactly once after stagger; then optional KO.
 * @param {boolean} isCorrect
 * @param {{ onVisualState: (s: string) => void; applyDamage: () => { roninHp: number; bossHp: number; phase: string; index: number }; shouldRoninKO: () => boolean; shouldBossKO: () => boolean }} ops
 * @param {AbortSignal} [signal]
 */
export async function runCombatExchange(isCorrect, ops, signal) {
  const { onVisualState, applyDamage, shouldRoninKO, shouldBossKO } = ops
  const b = COMBAT_TIMINGS_MS.STRIKE_BEAT
  const seq = isCorrect
    ? [
        [CombatVisualState.RONIN_DASH, COMBAT_TIMINGS_MS.DASH],
        [CombatVisualState.RONIN_STRIKE_1, b],
        [CombatVisualState.RONIN_STRIKE_2, b],
        [CombatVisualState.RONIN_STRIKE_3, b],
        [CombatVisualState.BOSS_HIT_STAGGER, COMBAT_TIMINGS_MS.STAGGER],
      ]
    : [
        [CombatVisualState.BOSS_DASH, COMBAT_TIMINGS_MS.DASH],
        [CombatVisualState.BOSS_OVERHEAD_1, b],
        [CombatVisualState.BOSS_OVERHEAD_2, b],
        [CombatVisualState.BOSS_OVERHEAD_3, b],
        [CombatVisualState.RONIN_HIT_STAGGER, COMBAT_TIMINGS_MS.STAGGER],
      ]

  for (const [state, ms] of seq) {
    onVisualState(state)
    await delay(ms, signal)
  }

  onVisualState(CombatVisualState.HIT_RESOLVE)
  const snapshot = applyDamage()

  if (shouldBossKO?.()) {
    onVisualState(CombatVisualState.BOSS_KO)
    await delay(COMBAT_TIMINGS_MS.KO, signal)
  } else if (shouldRoninKO?.()) {
    onVisualState(CombatVisualState.RONIN_KO)
    await delay(COMBAT_TIMINGS_MS.KO, signal)
  }

  onVisualState(CombatVisualState.IDLE)
  return snapshot
}
