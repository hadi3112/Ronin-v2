import { useEffect, useMemo, useState } from 'react'

export default function StacktraceMode({ payload, disabled, onAnswer }) {
  const lines = useMemo(() => payload.lines ?? [], [payload.lines])
  const [visibleCount, setVisibleCount] = useState(0)
  const [traceDone, setTraceDone] = useState(false)

  useEffect(() => {
    if (!lines.length) {
      const t = window.setTimeout(() => setTraceDone(true), 0)
      return () => window.clearTimeout(t)
    }
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setVisibleCount((c) => Math.min(c + 1, lines.length))
      if (i >= lines.length) {
        window.clearInterval(id)
        window.setTimeout(() => setTraceDone(true), 220)
      }
    }, 420)
    return () => window.clearInterval(id)
  }, [lines])

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-emerald-200/90 md:text-xs">
        {!traceDone ? (
          <div className="space-y-1">
            {lines.slice(0, visibleCount).map((line, idx) => (
              <p key={`${idx}-${line}`} className="text-emerald-100/90">
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-ronin-muted">Trace cleared — pick the best explanation.</p>
        )}
      </div>

      {traceDone && (
        <div className="grid gap-2">
          {(payload.choices ?? []).map((c, idx) => (
            <button
              key={c}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(idx)}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm text-ronin-cream hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
