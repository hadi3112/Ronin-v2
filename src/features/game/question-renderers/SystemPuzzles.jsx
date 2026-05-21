import { useCallback, useEffect, useMemo, useState } from 'react'
import { ANSWER_TEXT, QUESTION_TEXT } from '../questionTypography.js'
import GraphChallengeCanvas, { triggerGraphAction } from '../../../components/GraphChallengeCanvas.jsx'
import { buildGraphChallengePackage } from '../../../game/graphChallenge/buildGraphChallengePackage.js'
import { GraphChallengeEventType } from '../../../game/graphChallenge/graphChallengeBus.js'

const GRAPH_SUBTYPES = new Set(['linked_list_memory', 'circular_queue', 'dfs_tree'])
const PUZZLE_WITH_BUTTONS = new Set(['linked_list_memory', 'dfs_tree'])

/**
 * System architecture questions: graph types render only in Phaser (see GraphChallengeCanvas).
 * React keeps copy text + wiring; circular-queue MCQ options render below the canvas like other banks.
 */
export default function SystemPuzzles({ subtype, payload, disabled, onSubmit, onMcq, questionId }) {
  const [ringReady, setRingReady] = useState(false)
  const enriched = useMemo(() => buildGraphChallengePackage(subtype, payload), [subtype, questionId])

  useEffect(() => {
    setRingReady(false)
  }, [questionId, subtype])

  const onBusDetail = useCallback(
    (d) => {
      if (subtype !== 'circular_queue') return
      if (d?.type === GraphChallengeEventType.RING_OPS_COMPLETE) setRingReady(true)
    },
    [subtype],
  )

  if (GRAPH_SUBTYPES.has(subtype)) {
    const choices = payload?.choices ?? []
    const qText = enriched && !enriched.unknown ? enriched.questionText : payload?.questionText
    const showExternalButtons = PUZZLE_WITH_BUTTONS.has(subtype)
    const isAndroidLandscape = typeof window !== 'undefined' && 
      /Android/i.test(navigator.userAgent) && 
      window.innerWidth > window.innerHeight

    const handleLock = () => triggerGraphAction(questionId, 'lock')
    const handleReset = () => triggerGraphAction(questionId, 'reset')

    return (
      <div className="space-y-3">
        {qText ? <p className={QUESTION_TEXT}>{qText}</p> : null}
        <div className={isAndroidLandscape ? 'mx-auto w-[60vw]' : 'w-full'}>
          <GraphChallengeCanvas
          subtype={subtype}
          payload={payload}
          disabled={disabled}
          onSubmit={onSubmit}
          questionId={questionId}
          onBusDetail={onBusDetail}
            hideButtons={showExternalButtons}
          />
        </div>
        {showExternalButtons && !disabled ? (
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleLock}
              className="rounded-xl bg-ronin-crimson px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-ronin-crimson/90 disabled:opacity-50"
            >
              {subtype === 'linked_list_memory' ? 'Lock in order' : 'Lock traversal'}
            </button>
            {subtype === 'dfs_tree' && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-white/20 bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
              >
                Reset
              </button>
            )}
          </div>
        ) : null}
        {subtype === 'circular_queue' && !ringReady && !disabled ? (
          <p className="text-center text-xs text-ronin-muted">Finish every simulator step to unlock choices A–D.</p>
        ) : null}
        {subtype === 'circular_queue' && choices.length > 0 ? (
          <div className="grid gap-2">
            {choices.map((c, i) => (
              <button
                key={`${questionId}-cq-${i}`}
                type="button"
                disabled={disabled || !ringReady}
                onClick={() => onMcq?.(i)}
                className={`rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left transition-colors hover:bg-white/5 active:bg-white/20 active:border-white/25 disabled:cursor-not-allowed disabled:opacity-40 ${ANSWER_TEXT}`}
              >
                <span className="font-semibold text-ronin-gold">{String.fromCharCode(65 + i)})</span> {c}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  return <p className="text-sm text-ronin-muted">Unknown puzzle type.</p>
}
