/**
 * Adaptive difficulty scaling engine for puzzle questions.
 */

import { QuestionCategory, getCategoryAccuracy, getRecentTrend } from './PlayerProfile.js'

const LINKED_LIST_MIN = 2
const LINKED_LIST_MAX = 8
const DFS_BRANCHING_MIN = 2
const DFS_BRANCHING_MAX = 4
const DFS_DEPTH_MIN = 2
const DFS_DEPTH_MAX = 5
const RING_BUFFER_MIN = 4
const RING_BUFFER_MAX = 10

export function evaluateLinkedListDifficulty(profile, reasoningLog) {
  const cat = QuestionCategory.LINKED_LIST
  const acc = getCategoryAccuracy(profile, cat)
  const trend = getRecentTrend(profile, cat)
  const current = profile.difficulty.linkedListNodes

  let next = current
  let reason = ''

  if (acc >= 0.85 && trend !== 'declining') {
    next = Math.min(current + 1, LINKED_LIST_MAX)
    reason = `Linked list mastery detected (${Math.round(acc * 100)}% accuracy). Increasing node count to ${next}.`
  } else if (acc >= 0.7 && trend === 'improving') {
    next = Math.min(current + 1, LINKED_LIST_MAX)
    reason = `Player improving on linked lists. Scaling up to ${next} nodes.`
  } else if (acc < 0.4 || trend === 'declining') {
    next = Math.max(current - 1, LINKED_LIST_MIN)
    reason = `Player struggling with linked lists (${Math.round(acc * 100)}% accuracy). Reducing to ${next} nodes.`
  } else {
    reason = `Linked list difficulty stable at ${current} nodes.`
  }

  if (next !== current) {
    profile.difficulty.linkedListNodes = next
  }
  reasoningLog.push({ type: 'difficulty', category: cat, message: reason, timestamp: Date.now() })

  return { nodes: next, reason }
}

export function evaluateDfsDifficulty(profile, reasoningLog) {
  const cat = QuestionCategory.DFS_TREE
  const acc = getCategoryAccuracy(profile, cat)
  const trend = getRecentTrend(profile, cat)
  const currentBranching = profile.difficulty.dfsBranching
  const currentDepth = profile.difficulty.dfsDepth

  let nextBranching = currentBranching
  let nextDepth = currentDepth
  let reason = ''

  if (acc >= 0.85 && trend !== 'declining') {
    if (currentDepth < DFS_DEPTH_MAX) {
      nextDepth = currentDepth + 1
      reason = `DFS mastery detected. Increasing tree depth to ${nextDepth}.`
    } else if (currentBranching < DFS_BRANCHING_MAX) {
      nextBranching = currentBranching + 1
      reason = `DFS at max depth. Increasing branching factor to ${nextBranching}.`
    } else {
      reason = `DFS already at maximum complexity.`
    }
  } else if (acc < 0.4) {
    if (currentBranching > DFS_BRANCHING_MIN) {
      nextBranching = currentBranching - 1
      reason = `Player struggles with DFS branching. Reducing to ${nextBranching}-child nodes.`
    } else if (currentDepth > DFS_DEPTH_MIN) {
      nextDepth = currentDepth - 1
      reason = `Simplifying DFS tree depth to ${nextDepth} levels.`
    } else {
      reason = `DFS already at minimum complexity.`
    }
  } else {
    reason = `DFS difficulty stable: depth ${currentDepth}, branching ${currentBranching}.`
  }

  profile.difficulty.dfsBranching = nextBranching
  profile.difficulty.dfsDepth = nextDepth
  reasoningLog.push({ type: 'difficulty', category: cat, message: reason, timestamp: Date.now() })

  return { branching: nextBranching, depth: nextDepth, reason }
}

export function evaluateRingBufferDifficulty(profile, reasoningLog) {
  const cat = QuestionCategory.RING_BUFFER
  const acc = getCategoryAccuracy(profile, cat)
  const trend = getRecentTrend(profile, cat)
  const current = profile.difficulty.ringBufferSize

  let next = current
  let reason = ''

  if (acc >= 0.8 && trend !== 'declining') {
    next = Math.min(current + 1, RING_BUFFER_MAX)
    reason = `Ring buffer comprehension strong. Increasing size to ${next} slots.`
  } else if (acc >= 0.65 && trend === 'improving') {
    next = Math.min(current + 1, RING_BUFFER_MAX)
    reason = `Player improving on circular queues. Scaling to ${next} slots.`
  } else if (acc < 0.45 || trend === 'declining') {
    next = Math.max(current - 1, RING_BUFFER_MIN)
    reason = `Player struggling with wraparound logic. Reducing ring to ${next} slots.`
  } else {
    reason = `Ring buffer difficulty stable at ${current} slots.`
  }

  if (next !== current) {
    profile.difficulty.ringBufferSize = next
  }
  reasoningLog.push({ type: 'difficulty', category: cat, message: reason, timestamp: Date.now() })

  return { size: next, reason }
}

export function getDifficultyMultiplier(profile, category) {
  const diff = profile.difficulty
  switch (category) {
    case QuestionCategory.LINKED_LIST:
      return 0.8 + (diff.linkedListNodes - 2) * 0.15
    case QuestionCategory.DFS_TREE:
      return 0.8 + (diff.dfsBranching - 2) * 0.2 + (diff.dfsDepth - 2) * 0.15
    case QuestionCategory.RING_BUFFER:
      return 0.8 + (diff.ringBufferSize - 4) * 0.12
    default:
      return 1.0
  }
}

export function getDifficultyLabel(profile, category) {
  const mult = getDifficultyMultiplier(profile, category)
  if (mult >= 1.5) return 'Expert'
  if (mult >= 1.2) return 'Hard'
  if (mult >= 1.0) return 'Medium'
  return 'Easy'
}
