import { buildDfsTreePayload } from './dfsTreeGenerator.js'
import { buildLinkedListDragPayload } from './linkedListPuzzle.js'

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

function hashSessionKey(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * @param {import('./QuestionBankManager.js').QuestionBankShape} bank
 * @param {string} sysKey
 * @param {() => number} rng
 */
function buildSystemQuestion(bank, sysKey, rng) {
  const sys = bank.system_architecture
  const raw = sys?.[sysKey]
  if (!raw) return null
  const id = `sys_${sysKey}`

  if (sysKey === 'linked_list_memory') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'linked_list_memory',
      payload: buildLinkedListDragPayload(rng),
    }
  }
  if (sysKey === 'circular_queue' || sysKey === 'circular_queue_alt') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'circular_queue',
      payload: raw,
    }
  }
  if (sysKey === 'dfs_tree') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'dfs_tree',
      payload: buildDfsTreePayload(rng),
    }
  }
  return null
}

/**
 * @param {import('./QuestionBankManager.js').QuestionBankShape} bank
 * @param {{ rng?: () => number; sessionKey?: string }} [opts]
 * @returns {object[]}
 */
export function sampleSessionQuestions(bank, opts = {}) {
  const rng = opts.rng ?? Math.random
  const h = opts.sessionKey ? hashSessionKey(opts.sessionKey) : Math.floor(rng() * 0xffffffff)

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

  const sysBank = bank.system_architecture || {}
  const variants = [
    { key: 'linked_list_memory', available: Boolean(sysBank.linked_list_memory) },
    { key: 'circular_queue', available: Boolean(sysBank.circular_queue) },
    { key: 'circular_queue_alt', available: Boolean(sysBank.circular_queue_alt) },
    { key: 'dfs_tree', available: Boolean(sysBank.dfs_tree) },
  ].filter((v) => v.available)

  const pickOrder = variants.length ? variants.map((v) => v.key) : ['dfs_tree']
  const sysKey = pickOrder[h % pickOrder.length] ?? pickOrder[0]
  const sys = buildSystemQuestion(bank, sysKey, rng)
  if (sys && !used.has(sys.id)) used.add(sys.id)
  if (sys) {
    // Unique per session so graph bus / Phaser canvas keys never collide with other rows or hot reload.
    sys.id = `${sys.id}__${h.toString(36)}_${Math.floor(rng() * 0x10000)
      .toString(16)
      .padStart(4, '0')}`
  }

  const assembled = [...stacktrace, ...code_completion, ...conceptual, ...(sys ? [sys] : [])]

  shuffleInPlace(assembled, rng)

  const ids = new Set()
  for (const q of assembled) {
    if (ids.has(q.id)) throw new Error(`Duplicate question id in session: ${q.id}`)
    ids.add(q.id)
  }

  if (assembled.length !== SESSION_TOTAL) {
    throw new Error(`QuestionEngine: expected ${SESSION_TOTAL} questions, got ${assembled.length}`)
  }

  return assembled
}

export const QUESTION_ENGINE = { sampleSessionQuestions, SESSION_TOTAL }
