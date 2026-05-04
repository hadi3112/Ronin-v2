import { useMemo, useState } from 'react'
import { ANSWER_TEXT, QUESTION_TEXT } from '../questionTypography.js'

function LinkedListMemoryPuzzle({ payload, disabled, onSubmit }) {
  const cells = payload.cells ?? []
  const q = payload.questionText ?? 'Study the memory layout.'

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{q}</p>
      <div className="flex flex-wrap items-end justify-center gap-3">
        {cells.map((c, i) => (
          <div
            key={`${c.data}-${i}`}
            className="flex w-[88px] flex-col overflow-hidden rounded-lg border border-emerald-400/40 bg-black/60 shadow-innerGlow"
          >
            <div className="border-b border-white/10 bg-emerald-500/15 px-2 py-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-ronin-muted">data</p>
              <p className={`${QUESTION_TEXT} text-center`}>{c.data}</p>
            </div>
            <div className="px-2 py-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-ronin-muted">prev</p>
              <p className="font-mono text-[12px] text-amber-200/90">{c.prev}</p>
            </div>
          </div>
        ))}
      </div>
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

function isValidTreeClick(clicked, nextId, nodesById, middleId) {
  if (clicked.has(nextId)) return false
  const n = nodesById.get(nextId)
  if (!n) return false
  for (const c of n.children) {
    if (!clicked.has(c)) return false
  }
  const l1 = [2, 3, 4].filter((id) => nodesById.has(id))
  if (nextId === middleId) {
    for (const id of l1) {
      if (id === middleId) continue
      if (!clicked.has(id)) return false
    }
  }
  if (nextId === 1) {
    for (const id of l1) {
      if (!clicked.has(id)) return false
    }
  }
  return true
}

const LAYOUT = {
  1: { x: 200, y: 28 },
  2: { x: 80, y: 100 },
  3: { x: 200, y: 100 },
  4: { x: 320, y: 100 },
  5: { x: 40, y: 200 },
  6: { x: 120, y: 200 },
  7: { x: 160, y: 200 },
  8: { x: 240, y: 200 },
  9: { x: 280, y: 200 },
  10: { x: 360, y: 200 },
}

function DfsTreePuzzle({ payload, disabled, onSubmit }) {
  const q = payload.questionText ?? 'Traverse the tree correctly.'
  const middleId = payload.middleId ?? 3
  const nodes = useMemo(() => payload.nodes ?? [], [payload.nodes])
  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const [clicked, setClicked] = useState(() => new Set())

  const handleClick = (id) => {
    if (disabled) return
    if (!isValidTreeClick(clicked, id, nodesById, middleId)) return
    setClicked((prev) => new Set([...prev, id]))
  }

  const allIds = nodes.map((n) => n.id)
  const done = allIds.length > 0 && allIds.every((id) => clicked.has(id))

  const edges = useMemo(() => {
    const out = []
    for (const n of nodes) {
      for (const c of n.children) {
        const a = LAYOUT[n.id]
        const b = LAYOUT[c]
        if (a && b) out.push({ x1: a.x, y1: a.y + 18, x2: b.x, y2: b.y - 18 })
      }
    }
    return out
  }, [nodes])

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{q}</p>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-2">
        <svg viewBox="0 0 400 240" className="mx-auto h-[260px] w-full min-w-[360px]">
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
            const p = LAYOUT[n.id]
            if (!p) return null
            const on = clicked.has(n.id)
            return (
              <g
                key={n.id}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={() => handleClick(n.id)}
                style={{ cursor: disabled ? 'default' : 'pointer' }}
              >
                <circle
                  r="20"
                  fill={on ? 'rgba(34,197,94,0.35)' : '#f7f7f7'}
                  stroke={on ? 'rgba(34,197,94,0.9)' : 'rgba(243,50,50,0.5)'}
                  strokeWidth="2"
                />
                <text y="5" textAnchor="middle" fill={on ? '#ecfdf5' : '#0a0a0a'} fontSize="13" fontWeight="800" pointerEvents="none">
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="text-xs text-ronin-muted">
        Tapped: {[...clicked].join(' → ') || '—'} · Rule: children before parent; middle level-1 ({middleId}) only after other
        level-1 nodes are cleared.
      </p>
      <button
        type="button"
        disabled={disabled || !done}
        onClick={() => onSubmit(true)}
        className="w-full rounded-xl border border-ronin-crimson/40 bg-ronin-crimson/15 px-5 py-2 text-sm font-semibold text-ronin-cream disabled:opacity-40"
      >
        Lock traversal
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setClicked(new Set())}
        className="w-full rounded-xl border border-white/10 py-2 text-xs text-ronin-muted hover:bg-white/5"
      >
        Reset taps
      </button>
    </div>
  )
}

export default function SystemPuzzles({ subtype, payload, disabled, onSubmit }) {
  if (subtype === 'linked_list_memory') return <LinkedListMemoryPuzzle payload={payload} disabled={disabled} onSubmit={onSubmit} />
  if (subtype === 'circular_queue') return <CircularQueueRing payload={payload} disabled={disabled} onSubmit={onSubmit} />
  if (subtype === 'dfs_tree') return <DfsTreePuzzle payload={payload} disabled={disabled} onSubmit={onSubmit} />
  return <p className="text-sm text-ronin-muted">Unknown puzzle type.</p>
}
