/**
 * Combat animation phases (presentation layer consumes this).
 * @typedef {'idle' | 'ronin_dash' | 'boss_dash' | 'shake'} CombatAnimPhase
 */

export class AnimationController {
  constructor() {
    /** @type {CombatAnimPhase} */
    this.phase = 'idle'
    this.shakeToken = 0
  }

  reset() {
    this.phase = 'idle'
  }

  /**
   * @param {boolean} roninAttacks
   * @param {() => void} onMid
   * @param {() => void} onEnd
   */
  playExchange(roninAttacks, onMid, onEnd) {
    this.phase = roninAttacks ? 'ronin_dash' : 'boss_dash'
    const midMs = 320
    const tailMs = 380

    window.setTimeout(() => {
      this.phase = 'shake'
      this.shakeToken += 1
      onMid?.()
    }, midMs)

    window.setTimeout(() => {
      this.phase = 'idle'
      onEnd?.()
    }, midMs + tailMs)
  }
}
