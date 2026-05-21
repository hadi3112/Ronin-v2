/**
 * Runtime player profile — tracks performance per question category.
 * No persistence; resets on app reload.
 */

export const QuestionCategory = {
  STACKTRACE: 'stacktrace',
  CODE_COMPLETION: 'code_completion',
  CONCEPTUAL: 'conceptual',
  LINKED_LIST: 'linked_list',
  DFS_TREE: 'dfs_tree',
  RING_BUFFER: 'ring_buffer',
}

const PUZZLE_CATEGORIES = [
  QuestionCategory.LINKED_LIST,
  QuestionCategory.DFS_TREE,
  QuestionCategory.RING_BUFFER,
]

function createCategoryStats() {
  return {
    correct: 0,
    incorrect: 0,
    skipped: 0,
    totalTime: 0,
    attempts: 0,
    streak: 0,
    maxStreak: 0,
    lastResults: [],
  }
}

export function createPlayerProfile() {
  return {
    sessionCount: 0,
    totalXP: 0,
    level: 1,
    
    categories: {
      [QuestionCategory.STACKTRACE]: createCategoryStats(),
      [QuestionCategory.CODE_COMPLETION]: createCategoryStats(),
      [QuestionCategory.CONCEPTUAL]: createCategoryStats(),
      [QuestionCategory.LINKED_LIST]: createCategoryStats(),
      [QuestionCategory.DFS_TREE]: createCategoryStats(),
      [QuestionCategory.RING_BUFFER]: createCategoryStats(),
    },

    difficulty: {
      linkedListNodes: 4,
      dfsBranching: 3,
      dfsDepth: 3,
      ringBufferSize: 6,
    },

    weights: {
      [QuestionCategory.STACKTRACE]: 1.0,
      [QuestionCategory.CODE_COMPLETION]: 1.0,
      [QuestionCategory.CONCEPTUAL]: 1.0,
      [QuestionCategory.LINKED_LIST]: 1.0,
      [QuestionCategory.DFS_TREE]: 1.0,
      [QuestionCategory.RING_BUFFER]: 1.0,
    },

    currentSessionPuzzleCount: 0,
    globalStreak: 0,
    maxGlobalStreak: 0,
  }
}

export function recordAnswer(profile, category, isCorrect, timeMs, wasSkipped = false) {
  const stats = profile.categories[category]
  if (!stats) return profile

  stats.attempts += 1
  stats.totalTime += timeMs

  if (wasSkipped) {
    stats.skipped += 1
    stats.streak = 0
  } else if (isCorrect) {
    stats.correct += 1
    stats.streak += 1
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak)
    profile.globalStreak += 1
    profile.maxGlobalStreak = Math.max(profile.maxGlobalStreak, profile.globalStreak)
  } else {
    stats.incorrect += 1
    stats.streak = 0
    profile.globalStreak = 0
  }

  stats.lastResults.push({ isCorrect, wasSkipped, timeMs, timestamp: Date.now() })
  if (stats.lastResults.length > 10) stats.lastResults.shift()

  return profile
}

export function getCategoryAccuracy(profile, category) {
  const stats = profile.categories[category]
  if (!stats || stats.attempts === 0) return 0.5
  return stats.correct / stats.attempts
}

export function getCategoryStrength(profile, category) {
  const acc = getCategoryAccuracy(profile, category)
  const stats = profile.categories[category]
  if (!stats || stats.attempts < 3) return 'unknown'
  if (acc >= 0.8) return 'strong'
  if (acc >= 0.5) return 'moderate'
  return 'weak'
}

export function getWeakCategories(profile) {
  return Object.entries(profile.categories)
    .filter(([cat, stats]) => stats.attempts >= 2 && getCategoryStrength(profile, cat) === 'weak')
    .map(([cat]) => cat)
}

export function getStrongCategories(profile) {
  return Object.entries(profile.categories)
    .filter(([cat, stats]) => stats.attempts >= 3 && getCategoryStrength(profile, cat) === 'strong')
    .map(([cat]) => cat)
}

export function isPuzzleCategory(category) {
  return PUZZLE_CATEGORIES.includes(category)
}

export function getOverallAccuracy(profile) {
  let total = 0
  let correct = 0
  for (const stats of Object.values(profile.categories)) {
    total += stats.attempts
    correct += stats.correct
  }
  return total > 0 ? correct / total : 0.5
}

export function getRecentTrend(profile, category, windowSize = 5) {
  const stats = profile.categories[category]
  if (!stats || stats.lastResults.length < 2) return 'stable'
  
  const recent = stats.lastResults.slice(-windowSize)
  const recentCorrect = recent.filter(r => r.isCorrect).length
  const recentAcc = recentCorrect / recent.length

  const older = stats.lastResults.slice(0, -windowSize)
  if (older.length === 0) return 'stable'
  const olderCorrect = older.filter(r => r.isCorrect).length
  const olderAcc = olderCorrect / older.length

  const diff = recentAcc - olderAcc
  if (diff > 0.2) return 'improving'
  if (diff < -0.2) return 'declining'
  return 'stable'
}

export function mapBankTypeToCategory(bankType, subtype) {
  if (bankType === 'stacktrace') return QuestionCategory.STACKTRACE
  if (bankType === 'code_completion') return QuestionCategory.CODE_COMPLETION
  if (bankType === 'conceptual') return QuestionCategory.CONCEPTUAL
  if (bankType === 'system_architecture') {
    if (subtype === 'linked_list_memory') return QuestionCategory.LINKED_LIST
    if (subtype === 'dfs_tree') return QuestionCategory.DFS_TREE
    if (subtype === 'circular_queue') return QuestionCategory.RING_BUFFER
  }
  return QuestionCategory.CONCEPTUAL
}
