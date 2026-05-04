const SESSION_TOTAL = 10
const COUNTS = { stacktrace: 3, code_completion: 3, conceptual: 3, system_architecture: 1 }

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickUnique(pool, n, rng, usedIds) {
  const copy = pool.filter((q) => !usedIds.has(q.id))
  shuffleInPlace(copy, rng)
  const out = []
  for (const q of copy) {
    if (out.length >= n) break
    if (!usedIds.has(q.id)) {
      usedIds.add(q.id)
      out.push(q)
    }
  }
  return out
}

function buildSystemQuestion(bank, rng) {
  const sys = bank.system_architecture
  const keys = ['linked_list', 'circular_queue', 'dfs_tree'].filter((k) => sys && sys[k])
  if (!keys.length) return null
  const key = keys[Math.floor(rng() * keys.length)]
  const raw = sys[key]
  const id = `sys_${key}`

  if (key === 'linked_list') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'linked_list',
      payload: raw,
    }
  }
  if (key === 'circular_queue') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'circular_queue',
      payload: raw,
    }
  }
  return {
    id,
    bankType: 'system_architecture',
    subtype: 'dfs_tree',
    payload: raw,
  }
}

/**
 * Samples 10 unique questions: 3+3+3+1 across banks; shuffles final order.
 * @param {import('./QuestionBankManager.js').QuestionBankShape} bank
 * @param {{ rng?: () => number }} [opts]
 * @returns {object[]}
 */
export function sampleSessionQuestions(bank, opts = {}) {
  const rng = opts.rng ?? Math.random

  const used = new Set()
  const stacktrace = pickUnique(
    bank.stacktrace.map((s) => ({
      bankType: 'stacktrace',
      id: s.id,
      payload: s,
    })),
    COUNTS.stacktrace,
    rng,
    used,
  )
  const code_completion = pickUnique(
    bank.code_completion.map((s) => ({
      bankType: 'code_completion',
      id: s.id,
      payload: s,
    })),
    COUNTS.code_completion,
    rng,
    used,
  )
  const conceptual = pickUnique(
    bank.conceptual.map((s) => ({
      bankType: 'conceptual',
      id: s.id,
      payload: s,
    })),
    COUNTS.conceptual,
    rng,
    used,
  )

  const sys = buildSystemQuestion(bank, rng)
  if (sys && !used.has(sys.id)) used.add(sys.id)

  const assembled = [...stacktrace, ...code_completion, ...conceptual, ...(sys ? [sys] : [])]

  shuffleInPlace(assembled, rng)

  const ids = new Set()
  for (const q of assembled) {
    if (ids.has(q.id)) throw new Error(`Duplicate question id in session: ${q.id}`)
    ids.add(q.id)
  }

  return assembled
}

export const QUESTION_ENGINE = { sampleSessionQuestions, SESSION_TOTAL }
