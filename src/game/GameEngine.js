const RONIN_START = 100
const BOSS_START = 100
const DAMAGE_TO_BOSS = 11
const DAMAGE_TO_RONIN = 14

/**
 * @typedef {'playing' | 'victory' | 'defeat' | 'tie' | 'complete_win' | 'complete_loss'} GamePhase
 */

export class GameEngine {
  /**
   * @param {object[]} questions
   */
  constructor(questions) {
    this.questions = questions
    this.roninHp = RONIN_START
    this.bossHp = BOSS_START
    this.index = 0
    /** @type {GamePhase} */
    this.phase = 'playing'
  }

  get current() {
    if (this.index >= this.questions.length) return null
    return this.questions[this.index]
  }

  get questionNumber() {
    return Math.min(this.index + 1, this.questions.length)
  }

  /**
   * @param {boolean} isCorrect
   * @returns {{ phase: GamePhase; roninHp: number; bossHp: number; index: number; lastCorrect?: boolean }}
   */
  submitAnswer(isCorrect) {
    if (this.phase !== 'playing') {
      return { phase: this.phase, roninHp: this.roninHp, bossHp: this.bossHp, index: this.index }
    }

    if (isCorrect) this.bossHp = Math.max(0, this.bossHp - DAMAGE_TO_BOSS)
    else this.roninHp = Math.max(0, this.roninHp - DAMAGE_TO_RONIN)

    if (this.bossHp <= 0) {
      this.phase = 'victory'
      return { phase: this.phase, roninHp: this.roninHp, bossHp: this.bossHp, index: this.index, lastCorrect: isCorrect }
    }
    if (this.roninHp <= 0) {
      this.phase = 'defeat'
      return { phase: this.phase, roninHp: this.roninHp, bossHp: this.bossHp, index: this.index, lastCorrect: isCorrect }
    }

    this.index += 1

    if (this.index >= this.questions.length) {
      if (this.roninHp > this.bossHp) this.phase = 'complete_win'
      else if (this.bossHp > this.roninHp) this.phase = 'complete_loss'
      else this.phase = 'tie'
    }

    return { phase: this.phase, roninHp: this.roninHp, bossHp: this.bossHp, index: this.index, lastCorrect: isCorrect }
  }
}
