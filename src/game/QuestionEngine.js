import { buildDfsTreePayload } from './dfsTreeGenerator.js'
import { buildLinkedListDragPayload } from './linkedListPuzzle.js'
import { getCompletedTrainingGroundsProblems } from '../services/trainingGroundsService.js'

const SESSION_TOTAL = 10
const COUNTS = { stacktrace: 3, code_completion: 3, conceptual: 2, system_architecture: 2 }

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
 * @param {{ linkedListNodes?: number; dfsBranching?: number; dfsDepth?: number; ringBufferSize?: number }} [difficulty]
 */
function buildSystemQuestion(bank, sysKey, rng, difficulty = {}) {
  const sys = bank.system_architecture
  const raw = sys?.[sysKey]
  if (!raw) return null
  const id = `sys_${sysKey}`

  if (sysKey === 'linked_list_memory') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'linked_list_memory',
      payload: buildLinkedListDragPayload(rng, difficulty.linkedListNodes ?? 4),
    }
  }
  if (sysKey === 'circular_queue' || sysKey === 'circular_queue_alt') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'circular_queue',
      payload: { ...raw, ringSize: difficulty.ringBufferSize ?? 6 },
    }
  }
  if (sysKey === 'dfs_tree') {
    return {
      id,
      bankType: 'system_architecture',
      subtype: 'dfs_tree',
      payload: buildDfsTreePayload(rng, difficulty.dfsBranching ?? 3, difficulty.dfsDepth ?? 3),
    }
  }
  return null
}

function isQuestionAllowed(qId, completedProblems) {
  if (qId.includes('arrays')) {
    return completedProblems.includes('two_sum')
  }
  if (qId.includes('linkedlist')) {
    return completedProblems.includes('linked_list_reversal')
  }
  if (qId.includes('queue')) {
    return completedProblems.includes('circular_queue')
  }
  if (qId.includes('dfs')) {
    return completedProblems.includes('dfs_traversal')
  }
  return true
}

/**
 * @param {import('./QuestionBankManager.js').QuestionBankShape} bank
 * @param {{ rng?: () => number; sessionKey?: string; userId?: string; difficulty?: { linkedListNodes?: number; dfsBranching?: number; dfsDepth?: number; ringBufferSize?: number } }} [opts]
 * @returns {object[]}
 */
export function sampleSessionQuestions(bank, opts = {}) {
  const rng = opts.rng ?? Math.random
  const difficulty = opts.difficulty ?? {}
  const h = opts.sessionKey ? hashSessionKey(opts.sessionKey) : Math.floor(rng() * 0xffffffff)
  const userId = opts.userId ?? 'guest'

  const completedProblems = getCompletedTrainingGroundsProblems(userId)

  // Filter bank pools to only allowed questions based on completed topics
  const allowedStacktrace = bank.stacktrace.filter((s) => isQuestionAllowed(s.id, completedProblems))
  const allowedCodeCompletion = bank.code_completion.filter((s) => isQuestionAllowed(s.id, completedProblems))
  const allowedConceptual = bank.conceptual.filter((s) => isQuestionAllowed(s.id, completedProblems))

  // Fallback to complete pool if allowed subset is too small to satisfy COUNT demands (except in diagnostic mode where we strictly enforce allowed questions)
  const isDiagnosticRun = completedProblems.length === 0
  const finalStacktracePool = (allowedStacktrace.length >= COUNTS.stacktrace || isDiagnosticRun) ? allowedStacktrace : bank.stacktrace
  const finalCodeCompletionPool = (allowedCodeCompletion.length >= COUNTS.code_completion || isDiagnosticRun) ? allowedCodeCompletion : bank.code_completion
  const finalConceptualPool = (allowedConceptual.length >= COUNTS.conceptual || isDiagnosticRun) ? allowedConceptual : bank.conceptual

  const used = new Set()
  const stacktrace = pickUnique(
    finalStacktracePool.map((s) => ({
      bankType: 'stacktrace',
      id: s.id,
      payload: s,
    })),
    COUNTS.stacktrace,
    rng,
    used,
  )
  
  // In diagnostic run, we pick 2 code completions instead of 3 to balance the total question count to exactly 10 since we are forcing 3 system puzzles
  const ccCount = isDiagnosticRun ? 2 : COUNTS.code_completion
  const code_completion = pickUnique(
    finalCodeCompletionPool.map((s) => ({
      bankType: 'code_completion',
      id: s.id,
      payload: s,
    })),
    ccCount,
    rng,
    used,
  )
  const conceptual = pickUnique(
    finalConceptualPool.map((s) => ({
      bankType: 'conceptual',
      id: s.id,
      payload: s,
    })),
    COUNTS.conceptual,
    rng,
    used,
  )

  const sysBank = bank.system_architecture || {}
  const hasLinkedList = Boolean(sysBank.linked_list_memory)
  const hasRingMain = Boolean(sysBank.circular_queue)
  const hasRingAlt = Boolean(sysBank.circular_queue_alt)
  const hasRing = hasRingMain || hasRingAlt
  const hasTree = Boolean(sysBank.dfs_tree)

  const sysList = []

  if (isDiagnosticRun) {
    // In diagnostic mode, we strictly force all three visual Phaser system puzzles (LL, Tree traversal, Circular queue) to appear
    const ll = buildSystemQuestion(bank, 'linked_list_memory', rng, difficulty)
    if (ll) {
      if (!used.has(ll.id)) used.add(ll.id)
      ll.id = `${ll.id}__${h.toString(36)}_${Math.floor(rng() * 0x10000).toString(16).padStart(4, '0')}`
      sysList.push(ll)
    }
    
    const dfs = buildSystemQuestion(bank, 'dfs_tree', rng, difficulty)
    if (dfs) {
      if (!used.has(dfs.id)) used.add(dfs.id)
      dfs.id = `${dfs.id}__${h.toString(36)}_${Math.floor(rng() * 0x10000).toString(16).padStart(4, '0')}`
      sysList.push(dfs)
    }

    const cq = buildSystemQuestion(bank, 'circular_queue', rng, difficulty)
    if (cq) {
      if (!used.has(cq.id)) used.add(cq.id)
      cq.id = `${cq.id}__${h.toString(36)}_${Math.floor(rng() * 0x10000).toString(16).padStart(4, '0')}`
      sysList.push(cq)
    }
  } else {
    // Normal progress-based system question loading
    const allowedRing = completedProblems.includes('circular_queue') && hasRing
    const allowedTree = completedProblems.includes('dfs_traversal') && hasTree

    // --- SLOT 1: Always linked list (if completed in Training Grounds) ---
    if (completedProblems.includes('linked_list_reversal') && hasLinkedList) {
      const ll = buildSystemQuestion(bank, 'linked_list_memory', rng, difficulty)
      if (ll) {
        if (!used.has(ll.id)) used.add(ll.id)
        ll.id = `${ll.id}__${h.toString(36)}_${Math.floor(rng() * 0x10000).toString(16).padStart(4, '0')}`
        sysList.push(ll)
      }
    }

    // --- SLOT 2: Pick one from remaining allowed puzzle families (ring or DFS) ---
    const secondFamilies = []
    if (allowedRing) secondFamilies.push('__ring__')
    if (allowedTree) secondFamilies.push('dfs_tree')

    if (secondFamilies.length > 0) {
      const fam = secondFamilies[h % secondFamilies.length]
      let sysKey2 = 'dfs_tree'
      if (fam === '__ring__') {
        const ringKeys = []
        if (hasRingMain) ringKeys.push('circular_queue')
        if (hasRingAlt) ringKeys.push('circular_queue_alt')
        sysKey2 = ringKeys[(h >>> 8) % ringKeys.length] ?? 'circular_queue'
      }
      const sys2 = buildSystemQuestion(bank, sysKey2, rng, difficulty)
      if (sys2) {
        if (!used.has(sys2.id)) used.add(sys2.id)
        sys2.id = `${sys2.id}__${h.toString(36)}_${Math.floor(rng() * 0x10000).toString(16).padStart(4, '0')}`
        sysList.push(sys2)
      }
    }
  }

  let assembled = [...stacktrace, ...code_completion, ...conceptual, ...sysList]

  // Backfill with standard questions if some system puzzles were filtered out
  if (assembled.length < SESSION_TOTAL) {
    const extraNeeded = SESSION_TOTAL - assembled.length
    const allStandardPool = [
      ...finalStacktracePool.map((s) => ({ bankType: 'stacktrace', id: s.id, payload: s })),
      ...finalCodeCompletionPool.map((s) => ({ bankType: 'code_completion', id: s.id, payload: s })),
      ...finalConceptualPool.map((s) => ({ bankType: 'conceptual', id: s.id, payload: s })),
    ]
    const extraPicks = pickUnique(allStandardPool, extraNeeded, rng, used)
    assembled = [...assembled, ...extraPicks]
  }

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

