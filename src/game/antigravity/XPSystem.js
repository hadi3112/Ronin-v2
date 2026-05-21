/**
 * XP reward system with streak bonuses and difficulty multipliers.
 */

import { getDifficultyMultiplier } from './DifficultyEngine.js'
import { QuestionCategory, isPuzzleCategory } from './PlayerProfile.js'

const BASE_XP = {
  [QuestionCategory.STACKTRACE]: 80,
  [QuestionCategory.CODE_COMPLETION]: 70,
  [QuestionCategory.CONCEPTUAL]: 60,
  [QuestionCategory.LINKED_LIST]: 120,
  [QuestionCategory.DFS_TREE]: 130,
  [QuestionCategory.RING_BUFFER]: 110,
}

const STREAK_THRESHOLDS = [
  { streak: 3, bonus: 0.15, label: 'On Fire!' },
  { streak: 5, bonus: 0.3, label: 'Unstoppable!' },
  { streak: 8, bonus: 0.5, label: 'LEGENDARY!' },
  { streak: 10, bonus: 0.75, label: 'GODLIKE!' },
]

const SKIP_PENALTY = 0.5
const FAST_ANSWER_THRESHOLD_MS = 8000
const FAST_ANSWER_BONUS = 0.1

export function calculateXPReward(profile, category, isCorrect, wasSkipped, timeMs, reasoningLog) {
  const baseXP = BASE_XP[category] ?? 50

  if (wasSkipped) {
    const xp = Math.round(baseXP * SKIP_PENALTY * 0.25)
    reasoningLog.push({
      type: 'xp',
      message: `Question skipped. Minimal XP awarded: +${xp}`,
      timestamp: Date.now(),
    })
    return { xp, breakdown: { base: baseXP, penalty: 'skipped', final: xp } }
  }

  if (!isCorrect) {
    const xp = Math.round(baseXP * 0.15)
    reasoningLog.push({
      type: 'xp',
      message: `Incorrect answer. Consolation XP: +${xp}`,
      timestamp: Date.now(),
    })
    return { xp, breakdown: { base: baseXP, penalty: 'incorrect', final: xp } }
  }

  let multiplier = 1.0
  const bonuses = []

  const diffMult = getDifficultyMultiplier(profile, category)
  if (diffMult > 1.0) {
    multiplier *= diffMult
    bonuses.push(`difficulty x${diffMult.toFixed(2)}`)
  }

  const streak = profile.globalStreak
  for (let i = STREAK_THRESHOLDS.length - 1; i >= 0; i--) {
    const t = STREAK_THRESHOLDS[i]
    if (streak >= t.streak) {
      multiplier *= (1 + t.bonus)
      bonuses.push(`${t.label} +${Math.round(t.bonus * 100)}%`)
      break
    }
  }

  if (timeMs < FAST_ANSWER_THRESHOLD_MS) {
    multiplier *= (1 + FAST_ANSWER_BONUS)
    bonuses.push(`Quick answer +${Math.round(FAST_ANSWER_BONUS * 100)}%`)
  }

  if (isPuzzleCategory(category)) {
    multiplier *= 1.15
    bonuses.push('Puzzle bonus +15%')
  }

  const xp = Math.round(baseXP * multiplier)
  const bonusStr = bonuses.length > 0 ? ` (${bonuses.join(', ')})` : ''
  
  reasoningLog.push({
    type: 'xp',
    message: `Correct! +${xp} XP${bonusStr}`,
    timestamp: Date.now(),
  })

  return {
    xp,
    breakdown: {
      base: baseXP,
      multiplier,
      bonuses,
      final: xp,
    },
  }
}

export function calculateLevelFromXP(totalXP) {
  const thresholds = [0, 500, 1500, 3000, 5500, 9000, 14000, 21000, 30000, 42000, 58000]
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXP >= thresholds[i]) {
      const level = i + 1
      const currentThreshold = thresholds[i]
      const nextThreshold = thresholds[i + 1] ?? (currentThreshold + 20000)
      const progress = (totalXP - currentThreshold) / (nextThreshold - currentThreshold)
      return { level, progress: Math.min(progress, 1), xpToNext: nextThreshold - totalXP }
    }
  }
  return { level: 1, progress: 0, xpToNext: 500 }
}

export function getStreakLabel(streak) {
  for (let i = STREAK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (streak >= STREAK_THRESHOLDS[i].streak) {
      return STREAK_THRESHOLDS[i].label
    }
  }
  return null
}

export function getSessionXPBonus(correctCount, totalCount) {
  const ratio = correctCount / Math.max(1, totalCount)
  if (ratio >= 0.9) return { bonus: 500, label: 'Perfect Session!' }
  if (ratio >= 0.8) return { bonus: 300, label: 'Excellent Session!' }
  if (ratio >= 0.7) return { bonus: 150, label: 'Good Session' }
  return { bonus: 0, label: null }
}
