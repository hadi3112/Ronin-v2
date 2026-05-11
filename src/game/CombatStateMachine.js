/**
 * Combat presentation + timing contract (drives UI; damage applies only after HIT_RESOLVE).
 * Ronin correct path: dash → three strike beats → stagger → dash back → resolve damage.
 */

export const CombatVisualState = {
  IDLE: 'IDLE',
  RONIN_DASH: 'RONIN_DASH',
  RONIN_STRIKE_1: 'RONIN_STRIKE_1',
  RONIN_STRIKE_2: 'RONIN_STRIKE_2',
  RONIN_STRIKE_3: 'RONIN_STRIKE_3',
  RONIN_STRIKE_4: 'RONIN_STRIKE_4',
  RONIN_STRIKE_5: 'RONIN_STRIKE_5',
  RONIN_STRIKE_6: 'RONIN_STRIKE_6',
  BOSS_HIT_STAGGER: 'BOSS_HIT_STAGGER',
  RONIN_DASH_BACK: 'RONIN_DASH_BACK',
  BOSS_DASH: 'BOSS_DASH',
  BOSS_OVERHEAD_1: 'BOSS_OVERHEAD_1',
  BOSS_OVERHEAD_2: 'BOSS_OVERHEAD_2',
  BOSS_OVERHEAD_3: 'BOSS_OVERHEAD_3',
  RONIN_HIT_STAGGER: 'RONIN_HIT_STAGGER',
  BOSS_DASH_BACK: 'BOSS_DASH_BACK',
  HIT_RESOLVE: 'HIT_RESOLVE',
  BOSS_KO: 'BOSS_KO',
  RONIN_KO: 'RONIN_KO',
}

export const COMBAT_TIMINGS_MS = {
  DASH: 340,
  STRIKE_BEAT: 104,
  /** Ronin slash beats: base beat + 100ms slower */
  RONIN_STRIKE_BEAT: 204,
  STAGGER: 380,
  DASH_BACK: 340,
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
 * @param {boolean} isCorrect
 * @param {{ onVisualState: (s: string) => void; applyDamage: () => object; shouldRoninKO: () => boolean; shouldBossKO: () => boolean }} ops
 * @param {AbortSignal} [signal]
 */
export async function runCombatExchange(isCorrect, ops, signal) {
  const { onVisualState, applyDamage, shouldRoninKO, shouldBossKO } = ops
  const bossBeat = COMBAT_TIMINGS_MS.STRIKE_BEAT
  const roninBeat = COMBAT_TIMINGS_MS.RONIN_STRIKE_BEAT

  const roninStrikeStates = [
    CombatVisualState.RONIN_STRIKE_1,
    CombatVisualState.RONIN_STRIKE_2,
    CombatVisualState.RONIN_STRIKE_3,
  ]

  const seq = isCorrect
    ? [
        [CombatVisualState.RONIN_DASH, COMBAT_TIMINGS_MS.DASH],
        ...roninStrikeStates.map((s) => [s, roninBeat]),
        [CombatVisualState.BOSS_HIT_STAGGER, COMBAT_TIMINGS_MS.STAGGER],
        [CombatVisualState.RONIN_DASH_BACK, COMBAT_TIMINGS_MS.DASH_BACK],
      ]
    : [
        [CombatVisualState.BOSS_DASH, COMBAT_TIMINGS_MS.DASH],
        [CombatVisualState.BOSS_OVERHEAD_1, bossBeat],
        [CombatVisualState.BOSS_OVERHEAD_2, bossBeat],
        [CombatVisualState.BOSS_OVERHEAD_3, bossBeat],
        [CombatVisualState.RONIN_HIT_STAGGER, COMBAT_TIMINGS_MS.STAGGER],
        [CombatVisualState.BOSS_DASH_BACK, COMBAT_TIMINGS_MS.DASH_BACK],
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
