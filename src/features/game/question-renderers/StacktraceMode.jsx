import { useEffect, useMemo, useRef, useState } from 'react'
import { ANSWER_TEXT, QUESTION_TEXT, TRACE_TEXT } from '../questionTypography.js'

const BUDGET_SEC = 15

export default function StacktraceMode({ payload, disabled, onAnswer, onTimeout, reviewMode }) {
  const lines = useMemo(() => payload.lines ?? [], [payload.lines])
  const questionText = payload.questionText ?? 'Read the traceback and select the best explanation.'
  const [remaining, setRemaining] = useState(BUDGET_SEC)
  const fired = useRef(false)

  useEffect(() => {
    if (reviewMode || disabled) return undefined
    const id = window.setInterval(() => {
      setRemaining((r) => {
        const next = r - 1
        if (next <= 0) {
          window.clearInterval(id)
          if (!fired.current) {
            fired.current = true
            onTimeout?.()
          }
          return 0
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [disabled, onTimeout, payload.id, reviewMode])

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{questionText}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-100/90">
          {reviewMode ? 'Review — no timer' : 'Trace stays visible'}
        </span>
        {!reviewMode ? (
          <span className={`font-mono text-sm font-bold ${remaining <= 5 ? 'text-ronin-crimson' : 'text-ronin-gold'}`}>
            {remaining}s to answer
          </span>
        ) : null}
      </div>
      <div className={`rounded-xl border border-white/10 bg-black/70 p-4 ${TRACE_TEXT}`}>
        <div className="space-y-1">
          {lines.map((line, idx) => (
            <p key={`${idx}-${line}`}>{line}</p>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        {(payload.choices ?? []).map((c, idx) => (
          <button
            key={c}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer(idx)}
            className={`rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left ${ANSWER_TEXT} hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
