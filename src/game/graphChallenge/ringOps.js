/**
 * Mutable ring-buffer state for the circular-queue Phaser simulator.
 * Matches {@link simulateRing} semantics from buildGraphChallengePackage.js.
 * @param {number} capacity
 */
export function emptyRingState(capacity) {
  const cap = Math.max(1, capacity | 0)
  return {
    buf: Array.from({ length: cap }, () => null),
    head: 0,
    size: 0,
    capacity: cap,
  }
}

/** @param {{ buf: (string|null)[]; head: number; size: number }} s */
export function cloneRingState(s) {
  return { buf: [...s.buf], head: s.head % s.buf.length, size: s.size, capacity: s.buf.length }
}

/**
 * Apply one step; returns new state or null if the step is illegal in this state.
 * @param {{ buf: (string|null)[]; head: number; size: number }} state
 * @param {{ op: string; value?: string }} step
 */
export function applyRingStep(state, step) {
  const cap = state.buf.length
  const next = cloneRingState(state)
  if (step.op === 'enqueue') {
    if (next.size >= cap) return null
    const v = step.value ?? '?'
    next.buf[(next.head + next.size) % cap] = v
    next.size += 1
    return next
  }
  if (step.op === 'dequeue') {
    if (next.size <= 0) return null
    next.buf[next.head % cap] = null
    next.head = (next.head + 1) % cap
    next.size -= 1
    return next
  }
  return null
}

/**
 * @param {{ op: string; value?: string }[]} sequence
 */
export function formatOperationPlanLines(sequence) {
  return (sequence ?? []).map((s, i) => {
    if (s.op === 'enqueue') return `${i + 1}. Enqueue "${s.value ?? '?'}" onto the tail.`
    if (s.op === 'dequeue') return `${i + 1}. Dequeue the front element.`
    return `${i + 1}. Unknown op`
  })
}

/**
 * Letters to show as draggable push chips (order: first appearance in enqueue ops).
 * @param {{ op: string; value?: string }[]} sequence
 */
export function bankLettersFromSequence(sequence) {
  const out = []
  const seen = new Set()
  for (const s of sequence ?? []) {
    if (s.op !== 'enqueue' || s.value == null) continue
    const v = String(s.value)
    if (!seen.has(v)) {
      seen.add(v)
      out.push(v)
    }
  }
  return out
}
