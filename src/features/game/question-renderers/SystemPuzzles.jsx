import { useMemo, useState } from 'react'

function LinkedListPuzzle({ payload, disabled, onSubmit }) {
  const target = useMemo(() => payload.solutionOrder ?? [], [payload.solutionOrder])
  const start = useMemo(() => payload.nodes ?? [], [payload.nodes])
  const [order, setOrder] = useState(() => [...start])

  const move = (from, dir) => {
    const to = from + dir
    if (to < 0 || to >= order.length) return
    const next = [...order]
    ;[next[from], next[to]] = [next[to], next[from]]
    setOrder(next)
  }

  const correct = JSON.stringify(order) === JSON.stringify(target)

  return (
    <div className="space-y-4">
      <p className="text-sm text-ronin-muted">{payload.title}</p>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {order.map((n, i) => (
          <div key={`${n}-${i}`} className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-sm font-bold text-ronin-cream">
              {n}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={disabled}
                className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-ronin-cream hover:bg-white/5 disabled:opacity-40"
                onClick={() => move(i, -1)}
              >
                Up
              </button>
              <button
                type="button"
                disabled={disabled}
                className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-ronin-cream hover:bg-white/5 disabled:opacity-40"
                onClick={() => move(i, 1)}
              >
                Down
              </button>
            </div>
            {i < order.length - 1 && <span className="text-ronin-muted">→</span>}
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSubmit(correct)}
        className="rounded-xl border border-ronin-crimson/40 bg-ronin-crimson/15 px-5 py-2 text-sm font-semibold text-ronin-cream hover:bg-ronin-crimson/25 disabled:opacity-40"
      >
        Lock answer
      </button>
    </div>
  )
}

function CircularQueuePuzzle({ payload, disabled, onSubmit }) {
  const [choice, setChoice] = useState(null)
  const seq = payload.sequence ?? []

  return (
    <div className="space-y-4">
      <p className="text-sm text-ronin-muted">{payload.title}</p>
      <div className="flex flex-wrap gap-2 text-xs text-ronin-cream">
        {seq.map((s, i) => (
          <span key={`${s.op}-${i}`} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">
            {s.op}
            {s.value ? `: ${s.value}` : ''}
          </span>
        ))}
      </div>
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {['A', 'B', 'C', 'D'].map((letter, idx) => (
          <div
            key={letter}
            className="relative flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-black/35 text-sm font-semibold text-ronin-cream"
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-ronin-muted">{idx}</span>
            {letter}
          </div>
        ))}
      </div>
      <p className="text-xs text-ronin-muted">Which value is at the front after the sequence?</p>
      <div className="grid gap-2">
        {(payload.choices ?? []).map((c, idx) => (
          <button
            key={c}
            type="button"
            disabled={disabled}
            onClick={() => setChoice(idx)}
            className={[
              'rounded-xl border px-4 py-3 text-left text-sm',
              choice === idx ? 'border-ronin-crimson/60 bg-ronin-crimson/15' : 'border-white/10 bg-black/40',
              'text-ronin-cream hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={disabled || choice == null}
        onClick={() => onSubmit(choice === payload.answerIndex)}
        className="rounded-xl border border-ronin-crimson/40 bg-ronin-crimson/15 px-5 py-2 text-sm font-semibold text-ronin-cream hover:bg-ronin-crimson/25 disabled:opacity-40"
      >
        Submit
      </button>
    </div>
  )
}

function DfsTreePuzzle({ payload, disabled, onSubmit }) {
  const solution = useMemo(() => payload.solutionClickOrder ?? [], [payload.solutionClickOrder])
  const [clicked, setClicked] = useState([])

  const nodes = useMemo(() => payload.nodes ?? [], [payload.nodes])

  const dimmed = useMemo(() => {
    const set = new Set()
    const skip = payload.skipNode
    if (!skip) return set
    const frontier = [skip]
    while (frontier.length) {
      const id = frontier.pop()
      if (set.has(id)) continue
      set.add(id)
      for (const n of nodes) {
        if (n.parent === id) frontier.push(n.id)
      }
    }
    return set
  }, [nodes, payload.skipNode])

  const handleClick = (id) => {
    if (disabled) return
    if (dimmed.has(id)) return
    setClicked((c) => [...c, id])
  }

  const correct = clicked.length === solution.length && clicked.every((v, i) => v === solution[i])

  const levels = useMemo(() => {
    const m = new Map()
    for (const n of nodes) {
      const arr = m.get(n.level) ?? []
      arr.push(n)
      m.set(n.level, arr)
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0])
  }, [nodes])

  return (
    <div className="space-y-4">
      <p className="text-sm text-ronin-muted">{payload.title}</p>
      <div className="space-y-6">
        {levels.map(([level, arr]) => (
          <div key={level} className="flex flex-wrap items-center justify-center gap-4">
            {arr.map((n) => {
              const dim = dimmed.has(n.id)
              return (
                <button
                  key={n.id}
                  type="button"
                  disabled={disabled || dim}
                  onClick={() => handleClick(n.id)}
                  className={[
                    'relative flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold transition',
                    dim ? 'border-white/5 bg-white/5 text-ronin-muted line-through' : 'border-white/20 bg-white text-black',
                    'hover:ring-2 hover:ring-ronin-crimson/40 disabled:cursor-not-allowed',
                  ].join(' ')}
                >
                  {n.id}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-ronin-muted">Order tapped: {clicked.join(' → ') || '—'}</p>
      <button
        type="button"
        disabled={disabled || clicked.length !== solution.length}
        onClick={() => onSubmit(correct)}
        className="w-full rounded-xl border border-ronin-crimson/40 bg-ronin-crimson/15 px-5 py-2 text-sm font-semibold text-ronin-cream hover:bg-ronin-crimson/25 disabled:opacity-40"
      >
        Submit traversal
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setClicked([])}
        className="w-full rounded-xl border border-white/10 px-5 py-2 text-xs text-ronin-muted hover:bg-white/5"
      >
        Reset taps
      </button>
    </div>
  )
}

export default function SystemPuzzles({ subtype, payload, disabled, onSubmit }) {
  if (subtype === 'linked_list') return <LinkedListPuzzle payload={payload} disabled={disabled} onSubmit={onSubmit} />
  if (subtype === 'circular_queue') return <CircularQueuePuzzle payload={payload} disabled={disabled} onSubmit={onSubmit} />
  if (subtype === 'dfs_tree') return <DfsTreePuzzle payload={payload} disabled={disabled} onSubmit={onSubmit} />
  return <p className="text-sm text-ronin-muted">Unknown architecture puzzle.</p>
}
