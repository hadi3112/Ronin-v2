import { useMemo } from 'react'
import { ANSWER_TEXT, QUESTION_TEXT } from './questionTypography.js'

function McqReview({ payload }) {
  const ai = payload.answerIndex ?? 0
  const choices = payload.choices ?? []
  return (
    <div className="grid gap-2">
      {choices.map((c, idx) => (
        <div
          key={c}
          className={`rounded-xl border px-4 py-3 text-left ${ANSWER_TEXT} ${
            idx === ai ? 'border-emerald-500/70 bg-emerald-500/20 text-emerald-50' : 'border-white/10 bg-black/30 text-ronin-muted'
          }`}
        >
          {idx === ai ? '✓ ' : ''}
          {c}
        </div>
      ))}
    </div>
  )
}

function LinkedListReview({ payload }) {
  const nodes = payload.nodes ?? []
  const order = payload.correctOrderIds ?? []
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  return (
    <div className="flex flex-wrap justify-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
      {order.map((id) => {
        const c = byId.get(id)
        if (!c) return null
        return (
          <div
            key={id}
            className="flex w-[92px] flex-col overflow-hidden rounded-lg border-2 border-emerald-400/80 bg-black/60 shadow-innerGlow"
          >
            <div className="border-b border-white/10 bg-emerald-500/25 px-2 py-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-ronin-muted">data</p>
              <p className={`${QUESTION_TEXT} text-center`}>{c.data}</p>
            </div>
            <div className="px-2 py-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-ronin-muted">prev</p>
              <p className="font-mono text-[11px] text-amber-200/90">{c.prev}</p>
            </div>
            <div className="border-t border-white/10 px-1 py-1 text-center">
              <p className="text-[9px] uppercase tracking-widest text-ronin-muted">addr</p>
              <p className="font-mono text-[10px] text-sky-200/85">{c.address}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DfsTreeReview({ payload }) {
  const nodes = payload.nodes ?? []
  const layout = payload.layout ?? {}
  const targetId = payload.targetId ?? 0
  const path = payload.oneValidPostOrder ?? []
  const viewW = payload.viewWidth ?? 400
  const viewH = payload.viewHeight ?? 260
  const orderIndex = useMemo(() => new Map(path.map((id, i) => [id, i + 1])), [path])

  const edges = useMemo(() => {
    const out = []
    for (const n of nodes) {
      for (const c of n.children) {
        const a = layout[n.id]
        const b = layout[c]
        if (a && b) out.push({ x1: a.x, y1: a.y + 18, x2: b.x, y2: b.y - 18 })
      }
    }
    return out
  }, [nodes, layout])

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-2">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="mx-auto min-h-[200px] w-full min-w-[300px]">
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="rgba(243,50,50,0.45)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        {nodes.map((n) => {
          const p = layout[n.id]
          if (!p) return null
          const onPath = orderIndex.has(n.id)
          const isTarget = n.id === targetId
          const fill = isTarget ? 'rgba(220,38,38,0.6)' : onPath ? 'rgba(34,197,94,0.45)' : '#f7f7f7'
          const stroke = isTarget ? 'rgba(252,165,165,0.95)' : onPath ? 'rgba(34,197,94,0.9)' : 'rgba(243,50,50,0.5)'
          const step = orderIndex.get(n.id)
          return (
            <g key={n.id} transform={`translate(${p.x}, ${p.y})`}>
              <circle r="20" fill={fill} stroke={stroke} strokeWidth="2" />
              <text y="5" textAnchor="middle" fill={onPath || isTarget ? '#fff' : '#0a0a0a'} fontSize="13" fontWeight="800">
                {n.id}
              </text>
              {step != null ? (
                <text y="-22" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="700">
                  {step}
                </text>
              ) : null}
              {isTarget ? (
                <g pointerEvents="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="-8" y1="-8" x2="8" y2="8" />
                  <line x1="8" y1="-8" x2="-8" y2="8" />
                </g>
              ) : null}
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-center text-xs text-ronin-muted">
        One valid post-order (step numbers): {path.join(' → ')}
      </p>
    </div>
  )
}

function CircularReview({ payload }) {
  const ai = payload.answerIndex ?? 0
  const choices = payload.choices ?? []
  return (
    <div className="grid gap-2">
      {choices.map((c, idx) => (
        <div
          key={c}
          className={`rounded-xl border px-4 py-3 text-left ${ANSWER_TEXT} ${
            idx === ai ? 'border-emerald-500/70 bg-emerald-500/20 text-emerald-50' : 'border-white/10 bg-black/30 text-ronin-muted'
          }`}
        >
          {idx === ai ? '✓ ' : ''}
          {c}
        </div>
      ))}
    </div>
  )
}

function ReviewOneQuestion({ q, index }) {
  const p = q.payload ?? {}
  return (
    <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-[10px] uppercase tracking-widest text-ronin-gold">Question {index + 1}</p>
      <p className="mt-1 text-xs text-ronin-muted">{q.bankType}{q.subtype ? ` · ${q.subtype}` : ''}</p>
      {q.bankType === 'stacktrace' ? (
        <>
          <p className={`mt-2 ${QUESTION_TEXT}`}>{p.questionText}</p>
          <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-xs text-ronin-cream/90">
            {(p.lines ?? []).join('\n')}
          </pre>
          <McqReview payload={p} />
        </>
      ) : null}
      {q.bankType === 'code_completion' ? (
        <>
          <p className={`mt-2 ${QUESTION_TEXT}`}>{p.questionText}</p>
          <pre className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-xs text-ronin-cream/90">
            {String(p.code ?? '')}
          </pre>
          <McqReview payload={p} />
        </>
      ) : null}
      {q.bankType === 'conceptual' ? (
        <>
          <p className={`mt-2 ${QUESTION_TEXT}`}>{p.questionText}</p>
          <p className={`mt-1 ${QUESTION_TEXT}`}>{p.prompt}</p>
          <McqReview payload={p} />
        </>
      ) : null}
      {q.bankType === 'system_architecture' && q.subtype === 'linked_list_memory' ? (
        <>
          <p className={`mt-2 ${QUESTION_TEXT}`}>{p.questionText}</p>
          <p className="mt-2 text-xs font-semibold text-emerald-200/90">Correct order (by prev chain)</p>
          <LinkedListReview payload={p} />
        </>
      ) : null}
      {q.bankType === 'system_architecture' && q.subtype === 'dfs_tree' ? (
        <>
          <p className={`mt-2 ${QUESTION_TEXT}`}>{p.questionText}</p>
          <p className="mt-2 text-xs font-semibold text-emerald-200/90">One valid DFS post-order (green); delete target (red)</p>
          <DfsTreeReview payload={p} />
        </>
      ) : null}
      {q.bankType === 'system_architecture' && q.subtype === 'circular_queue' ? (
        <>
          <p className={`mt-2 ${QUESTION_TEXT}`}>{p.questionText}</p>
          <CircularReview payload={p} />
        </>
      ) : null}
    </article>
  )
}

/**
 * @param {{ questions: object[]; onClose: () => void }} props
 */
export default function SessionReviewView({ questions, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
        <h2 className="font-display text-lg font-bold text-ronin-cream">Session review</h2>
        <button
          type="button"
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-ronin-cream hover:bg-white/10"
          onClick={onClose}
        >
          Close review
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-16">
          {questions.map((q, i) => (
            <ReviewOneQuestion key={q.id ?? i} q={q} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
