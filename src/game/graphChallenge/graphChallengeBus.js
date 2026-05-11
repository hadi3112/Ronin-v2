/** Cross-layer events: Phaser → React shell (no DOM gameplay). */

export const GRAPH_CHALLENGE_EVENT = 'ronin:graph-challenge'

export const GraphChallengeEventType = {
  CHALLENGE_STARTED: 'CHALLENGE_STARTED',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_WRONG: 'ANSWER_WRONG',
  /** Circular-queue simulator: user finished every planned push/pop. */
  RING_OPS_COMPLETE: 'RING_OPS_COMPLETE',
}

/**
 * @param {string} questionId
 * @param {string} subtype
 * @param {string} type
 * @param {object} [detail]
 */
export function emitGraphChallengeEvent(questionId, subtype, type, detail = {}) {
  window.dispatchEvent(
    new CustomEvent(GRAPH_CHALLENGE_EVENT, {
      bubbles: false,
      detail: { questionId, subtype, type, ...detail },
    }),
  )
}
