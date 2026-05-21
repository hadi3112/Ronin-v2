/**
 * Adaptive Question Engine — integrates with Antigravity Agent.
 * Handles weighted selection, dynamic expansion, and puzzle caps.
 */

import { buildDfsTreePayload } from '../dfsTreeGenerator.js'
import { buildLinkedListDragPayload } from '../linkedListPuzzle.js'
import { QuestionCategory, isPuzzleCategory } from './PlayerProfile.js'

const BASE_SESSION_SIZE = 10
const MAX_PUZZLES_PER_SESSION = 3

const CATEGORY_COUNTS = {
  stacktrace: 3,
  code_completion: 3,
  conceptual: 2,
  system_architecture: 2,
}

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickWeighted(pool, n, weights, rng, usedIds) {
  const available = pool.filter(q => !usedIds.has(q.id))
  const out = []

  for (let i = 0; i < n && available.length > 0; i++) {
    const totalWeight = available.reduce((sum, q) => {
      const cat = q.category || q.bankType
      return sum + (weights[cat] ?? 1.0)
    }, 0)

    let rand = rng() * totalWeight
    let selected = null

    for (const q of available) {
      const cat = q.category || q.bankType
      rand -= (weights[cat] ?? 1.0)
      if (rand <= 0) {
        selected = q
        break
      }
    }

    if (!selected) selected = available[0]
    
    usedIds.add(selected.id)
    out.push(selected)
    available.splice(available.indexOf(selected), 1)
  }

  return out
}

function buildLinkedListQuestion(rng, nodeCount) {
  const payload = buildLinkedListDragPayload(rng, nodeCount)
  return {
    id: `ll_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    bankType: 'system_architecture',
    subtype: 'linked_list_memory',
    category: QuestionCategory.LINKED_LIST,
    payload,
  }
}

function buildDfsQuestion(rng, branching, depth) {
  const payload = buildDfsTreePayload(rng, branching, depth)
  return {
    id: `dfs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    bankType: 'system_architecture',
    subtype: 'dfs_tree',
    category: QuestionCategory.DFS_TREE,
    payload,
  }
}

function buildRingQuestion(bank, rng, size) {
  const raw = bank.system_architecture?.circular_queue || bank.system_architecture?.circular_queue_alt
  if (!raw) return null
  
  return {
    id: `ring_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    bankType: 'system_architecture',
    subtype: 'circular_queue',
    category: QuestionCategory.RING_BUFFER,
    payload: { ...raw, ringSize: size },
  }
}

export function sampleAdaptiveSession(bank, agent, opts = {}) {
  const rng = opts.rng ?? Math.random
  const sessionKey = opts.sessionKey ?? `session_${Date.now()}`
  
  const profile = agent.getProfileSnapshot()
  const weights = profile.weights
  const difficulty = agent.getDifficultyParams()
  
  const used = new Set()
  const questions = []
  let puzzleCount = 0

  const stacktracePool = (bank.stacktrace || []).map(s => ({
    bankType: 'stacktrace',
    id: s.id,
    category: QuestionCategory.STACKTRACE,
    payload: s,
  }))

  const codeCompletionPool = (bank.code_completion || []).map(s => ({
    bankType: 'code_completion',
    id: s.id,
    category: QuestionCategory.CODE_COMPLETION,
    payload: s,
  }))

  const conceptualPool = (bank.conceptual || []).map(s => ({
    bankType: 'conceptual',
    id: s.id,
    category: QuestionCategory.CONCEPTUAL,
    payload: s,
  }))

  const stacktrace = pickWeighted(stacktracePool, CATEGORY_COUNTS.stacktrace, weights, rng, used)
  const codeCompletion = pickWeighted(codeCompletionPool, CATEGORY_COUNTS.code_completion, weights, rng, used)
  const conceptual = pickWeighted(conceptualPool, CATEGORY_COUNTS.conceptual, weights, rng, used)

  questions.push(...stacktrace, ...codeCompletion, ...conceptual)

  const puzzleTypes = [
    QuestionCategory.LINKED_LIST,
    QuestionCategory.DFS_TREE,
    QuestionCategory.RING_BUFFER,
  ]

  const sortedPuzzles = puzzleTypes
    .map(type => ({ type, weight: weights[type] ?? 1.0 }))
    .sort((a, b) => b.weight - a.weight)

  for (const { type } of sortedPuzzles) {
    if (puzzleCount >= MAX_PUZZLES_PER_SESSION) break

    if (type === QuestionCategory.LINKED_LIST) {
      questions.push(buildLinkedListQuestion(rng, difficulty.linkedListNodes))
      puzzleCount++
    } else if (type === QuestionCategory.DFS_TREE) {
      questions.push(buildDfsQuestion(rng, difficulty.dfsBranching, difficulty.dfsDepth))
      puzzleCount++
    } else if (type === QuestionCategory.RING_BUFFER && puzzleCount < MAX_PUZZLES_PER_SESSION) {
      const ringQ = buildRingQuestion(bank, rng, difficulty.ringBufferSize)
      if (ringQ) {
        questions.push(ringQ)
        puzzleCount++
      }
    }
  }

  shuffleInPlace(questions, rng)

  while (questions.length < BASE_SESSION_SIZE) {
    const filler = pickWeighted([...stacktracePool, ...codeCompletionPool, ...conceptualPool], 1, weights, rng, used)
    if (filler.length === 0) break
    questions.push(filler[0])
  }

  return {
    questions: questions.slice(0, BASE_SESSION_SIZE),
    sessionKey,
    initialSize: BASE_SESSION_SIZE,
    puzzleCount,
    difficulty,
  }
}

export function generateExpansionQuestions(bank, agent, currentQuestions, addCount, rng = Math.random) {
  const profile = agent.getProfileSnapshot()
  const weights = profile.weights
  const used = new Set(currentQuestions.map(q => q.id))
  
  const puzzleCount = currentQuestions.filter(q => isPuzzleCategory(q.category)).length

  const stacktracePool = (bank.stacktrace || []).map(s => ({
    bankType: 'stacktrace',
    id: s.id,
    category: QuestionCategory.STACKTRACE,
    payload: s,
  }))

  const codeCompletionPool = (bank.code_completion || []).map(s => ({
    bankType: 'code_completion',
    id: s.id,
    category: QuestionCategory.CODE_COMPLETION,
    payload: s,
  }))

  const conceptualPool = (bank.conceptual || []).map(s => ({
    bankType: 'conceptual',
    id: s.id,
    category: QuestionCategory.CONCEPTUAL,
    payload: s,
  }))

  const nonPuzzlePool = [...stacktracePool, ...codeCompletionPool, ...conceptualPool]
  const newQuestions = pickWeighted(nonPuzzlePool, addCount, weights, rng, used)

  return newQuestions
}

export const ADAPTIVE_ENGINE = {
  sampleAdaptiveSession,
  generateExpansionQuestions,
  BASE_SESSION_SIZE,
  MAX_PUZZLES_PER_SESSION,
}
