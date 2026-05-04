import { useCallback, useMemo, useState } from 'react'
import { isValidPostOrder } from '../../../game/dfsTreeGenerator.js'
import { explainLinkedListOrder, isCorrectLinkedListOrder } from '../../../game/linkedListPuzzle.js'
import { ANSWER_TEXT, QUESTION_TEXT } from '../questionTypography.js'

function LinkedListMemoryPuzzle({ payload, disabled, onSubmit }) {
  const nodes = payload.nodes ?? []
  const correctOrderIds = payload.correctOrderIds ?? []
  const q = payload.questionText ?? 'Arrange the nodes by the prev chain.'

  const [orderIds, setOrderIds] = useState(() => [...(payload.initialOrderIds ?? [])])
  const [dragId, setDragId] = useState(/** @type {string | null} */ (null))
  const [wrong, setWrong] = useState(/** @type {null | ReturnType<typeof explainLinkedListOrder>} */ (null))
  const [explainOpen, setExplainOpen] = useState(true)

  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  const moveId = useCallback((fromId, toId) => {
    if (!fromId || (toId && fromId === toId)) return
    setOrderIds((prev) => {
      const next = [...prev]
      const i = next.indexOf(fromId)
      if (i < 0) return prev
      next.splice(i, 1)
      if (!toId) {
        next.push(fromId)
        return next
      }
      const j = next.indexOf(toId)
      if (j < 0) {
        next.push(fromId)
        return next
      }
      next.splice(j, 0, fromId)
      return next
    })
  }, [])

  const handleLock = () => {
    if (disabled || wrong) return
    if (isCorrectLinkedListOrder(orderIds, correctOrderIds)) {
      onSubmit(true)
      return
    }
    setWrong(explainLinkedListOrder(nodes, orderIds, correctOrderIds))
    setExplainOpen(true)
  }

  const acknowledgeWrong = () => {
    setWrong(null)
    onSubmit(false)
  }

  const blocked = Boolean(disabled || wrong)

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{q}</p>
      <p className="text-xs text-ronin-muted">Drag cards to reorder. Exactly one of the 4! = 24 orderings matches the prev chain.</p>
      <div
        className="flex min-h-[140px] flex-wrap items-stretch justify-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => moveId(dragId, null)}
      >
        {orderIds.map((id) => {
          const c = nodesById.get(id)
          if (!c) return null
          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              draggable={!blocked}
              onDragStart={() => setDragId(id)}
              onDragEnd={() => setDragId(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveId(dragId, id)}
              className={`flex w-[92px] flex-col overflow-hidden rounded-lg border border-emerald-400/40 bg-black/60 shadow-innerGlow transition-opacity ${
                blocked ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'
              }`}
            >
              <div className="border-b border-white/10 bg-emerald-500/15 px-2 py-2 text-center">
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
      <button
        type="button"
        disabled={blocked}
        onClick={handleLock}
        className="w-full rounded-xl border border-ronin-crimson/40 bg-ronin-crimson/15 px-5 py-2 text-sm font-semibold text-ronin-cream disabled:opacity-40"
      >
        Lock in order
      </button>

      {wrong ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-amber-100"
            onClick={() => setExplainOpen((o) => !o)}
          >
            <span>Why this order is wrong</span>
            <span className="text-xs text-ronin-muted">{explainOpen ? '▼' : '▶'}</span>
          </button>
          {explainOpen ? (
            <div className="mt-2 space-y-2 text-xs text-ronin-cream/90">
              <p>
                <span className="text-ronin-muted">Correct chain (by data):</span> {wrong.correctLabels}
              </p>
              <p>
                <span className="text-ronin-muted">Your chain:</span> {wrong.userLabels}
              </p>
              <p className="text-ronin-muted">{wrong.why}</p>
            </div>
          ) : null}
          <button
            type="button"
            className="mt-3 w-full rounded-lg border border-white/15 bg-black/50 py-2 text-xs font-semibold text-ronin-cream hover:bg-white/5"
            onClick={acknowledgeWrong}
          >
            Continue
          </button>
        </div>
      ) : null}
    </div>
  )
}

function simulateRing(capacity, sequence) {
  const buf = Array.from({ length: capacity }, () => null)
  let head = 0
  let size = 0

  for (const step of sequence) {
    if (step.op === 'enqueue') {
      if (size >= capacity) continue
      buf[(head + size) % capacity] = step.value
      size += 1
    } else if (step.op === 'dequeue') {
      if (size <= 0) continue
      buf[head % capacity] = null
      head = (head + 1) % capacity
      size -= 1
    }
  }
  return { buf, head: head % capacity, size }
}

function CircularQueueRing({ payload, disabled, onSubmit }) {
  const capacity = payload.capacity ?? 6
  const { buf, head } = useMemo(() => simulateRing(capacity, payload.sequence ?? []), [capacity, payload.sequence])
  const q = payload.questionText ?? 'Follow the ring buffer operations.'

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{q}</p>
      <div className="relative mx-auto aspect-square w-full max-w-[min(100%,380px)]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="6 6" />
          {Array.from({ length: capacity }, (_, i) => {
            const angle = (i / capacity) * Math.PI * 2 - Math.PI / 2
            const cx = 100 + 64 * Math.cos(angle)
            const cy = 100 + 64 * Math.sin(angle)
            const letter = buf[i] ?? '·'
            const isHead = i === head
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="22"
                  fill={isHead ? 'rgba(243,50,50,0.22)' : 'rgba(0,0,0,0.55)'}
                  stroke={isHead ? 'rgba(243,110,110,0.8)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="2"
                />
                <text x={cx} y={cy + 5} textAnchor="middle" fill="#f7f7f7" fontSize="14" fontWeight="700">
                  {letter}
                </text>
                <text
                  x={100 + 86 * Math.cos(angle)}
                  y={100 + 86 * Math.sin(angle) + 4}
                  textAnchor="middle"
                  fill="rgba(191,191,191,0.85)"
                  fontSize="10"
                >
                  {i}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="text-xs text-ronin-muted">Head slot highlighted in crimson. Indices 0–{capacity - 1} mark ring order.</p>
      <div className="grid gap-2">
        {(payload.choices ?? []).map((c, idx) => (
          <button
            key={c}
            type="button"
            disabled={disabled}
            onClick={() => onSubmit(idx === payload.answerIndex)}
            className={`rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left ${ANSWER_TEXT} hover:bg-white/5 disabled:opacity-40`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

function DfsTreePuzzle({ payload, disabled, onSubmit }) {
  const q = payload.questionText ?? 'Traverse the tree correctly.'
  const targetId = payload.targetId ?? 0
  const nodes = useMemo(() => payload.nodes ?? [], [payload.nodes])
  const layout = payload.layout ?? {}
  const viewW = payload.viewWidth ?? 400
  const viewH = payload.viewHeight ?? 260
  const exampleOrder = payload.oneValidPostOrder ?? []

  const [sequence, setSequence] = useState(/** @type {number[]} */ ([]))
  const [wrong, setWrong] = useState(/** @type {null | { user: number[]; example: number[] }} */ (null))
  const [explainOpen, setExplainOpen] = useState(true)

  const leaves = useMemo(() => new Set(nodes.filter((n) => n.children.length === 0).map((n) => n.id)), [nodes])
  const hasLeafPicked = sequence.some((id) => leaves.has(id))

  const toggleNode = (id) => {
    if (disabled || wrong) return
    setSequence((prev) => {
      const i = prev.indexOf(id)
      if (i >= 0) return prev.filter((_, j) => j !== i)
      return [...prev, id]
    })
  }

  const allIds = nodes.map((n) => n.id)
  const nTotal = allIds.length
  const full =
    sequence.length === nTotal && sequence.length === new Set(sequence).size && allIds.every((id) => sequence.includes(id))

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

  const handleLock = () => {
    if (disabled || wrong) return
    if (!full) {
      setWrong({ user: [...sequence], example: exampleOrder })
      setExplainOpen(true)
      return
    }
    if (isValidPostOrder(nodes, sequence)) {
      onSubmit(true)
      return
    }
    setWrong({ user: [...sequence], example: exampleOrder })
    setExplainOpen(true)
  }

  const acknowledgeWrong = () => {
    setWrong(null)
    onSubmit(false)
  }

  const blocked = Boolean(disabled || wrong)

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{q}</p>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-2">
        <svg viewBox={`0 0 ${viewW} ${viewH}`} className="mx-auto min-h-[220px] w-full min-w-[320px]" style={{ maxHeight: 360 }}>
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
            const on = sequence.includes(n.id)
            const isTarget = n.id === targetId
            const fill = isTarget ? 'rgba(220,38,38,0.55)' : on ? 'rgba(34,197,94,0.35)' : '#f7f7f7'
            const stroke = isTarget ? 'rgba(252,165,165,0.95)' : on ? 'rgba(34,197,94,0.9)' : 'rgba(243,50,50,0.5)'
            return (
              <g
                key={n.id}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={() => toggleNode(n.id)}
                style={{ cursor: blocked ? 'default' : 'pointer' }}
              >
                <circle r="20" fill={fill} stroke={stroke} strokeWidth="2" />
                <text y="5" textAnchor="middle" fill={on || isTarget ? '#fff' : '#0a0a0a'} fontSize="13" fontWeight="800" pointerEvents="none">
                  {n.id}
                </text>
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
      </div>
      <p className="text-xs text-ronin-muted">
        Selection order: {sequence.join(' → ') || '—'} · Tap a node again to deselect it.
      </p>
      <button
        type="button"
        disabled={blocked}
        onClick={handleLock}
        className={`w-full rounded-xl border px-5 py-2 text-sm font-semibold transition-[box-shadow,border-color] disabled:opacity-40 ${
          hasLeafPicked
            ? 'border-amber-400/70 bg-amber-500/20 text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.25)]'
            : 'border-ronin-crimson/40 bg-ronin-crimson/15 text-ronin-cream'
        }`}
      >
        Lock traversal
      </button>
      <button
        type="button"
        disabled={blocked}
        onClick={() => setSequence([])}
        className="w-full rounded-xl border border-white/10 py-2 text-xs text-ronin-muted hover:bg-white/5"
      >
        Reset selection
      </button>

      {wrong ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-amber-100"
            onClick={() => setExplainOpen((o) => !o)}
          >
            <span>What a valid DFS post-order looks like</span>
            <span className="text-xs text-ronin-muted">{explainOpen ? '▼' : '▶'}</span>
          </button>
          {explainOpen ? (
            <div className="mt-2 space-y-2 text-xs text-ronin-cream/90">
              {!full ? (
                <p className="text-ronin-muted">You must include every node exactly once before locking.</p>
              ) : (
                <p className="text-ronin-muted">
                  In post-order, every parent appears only after all of its descendants. Your sequence breaks that rule at some
                  parent/child pair.
                </p>
              )}
              <p>
                <span className="text-ronin-muted">One valid order:</span> {wrong.example.join(' → ')}
              </p>
              <p>
                <span className="text-ronin-muted">Yours:</span> {wrong.user.join(' → ') || '—'}
              </p>
            </div>
          ) : null}
          <button
            type="button"
            className="mt-3 w-full rounded-lg border border-white/15 bg-black/50 py-2 text-xs font-semibold text-ronin-cream hover:bg-white/5"
            onClick={acknowledgeWrong}
          >
            Continue
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function SystemPuzzles({ subtype, payload, disabled, onSubmit }) {
  if (subtype === 'linked_list_memory') return <LinkedListMemoryPuzzle payload={payload} disabled={disabled} onSubmit={onSubmit} />
  if (subtype === 'circular_queue') return <CircularQueueRing payload={payload} disabled={disabled} onSubmit={onSubmit} />
  if (subtype === 'dfs_tree') return <DfsTreePuzzle payload={payload} disabled={disabled} onSubmit={onSubmit} />
  return <p className="text-sm text-ronin-muted">Unknown puzzle type.</p>
}
