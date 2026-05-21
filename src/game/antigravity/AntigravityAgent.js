/**
 * Antigravity Agent — Core gameplay orchestrator.
 * Acts as difficulty scaler, question selector, referee, reward controller,
 * and adaptive progression engine.
 */

import {
  createPlayerProfile,
  recordAnswer,
  getCategoryAccuracy,
  getWeakCategories,
  getStrongCategories,
  isPuzzleCategory,
  mapBankTypeToCategory,
  QuestionCategory,
  getRecentTrend,
} from './PlayerProfile.js'

import {
  evaluateLinkedListDifficulty,
  evaluateDfsDifficulty,
  evaluateRingBufferDifficulty,
  getDifficultyMultiplier,
  getDifficultyLabel,
} from './DifficultyEngine.js'

import {
  calculateXPReward,
  calculateLevelFromXP,
  getStreakLabel,
  getSessionXPBonus,
} from './XPSystem.js'

import {
  createReasoningLog,
  addReasoning,
  getRecentReasoning,
  formatReasoningForDisplay,
  generateSelectionReasoning,
  generateEvaluationReasoning,
  generateExpansionReasoning,
  generateCapReasoning,
} from './ReasoningTrace.js'

const BASE_SESSION_SIZE = 10
const MAX_PUZZLES_PER_SESSION = 3

const EXPANSION_RULES = [
  { threshold: 10, add: 5, label: 'Perfect performance!' },
  { threshold: 9, add: 5, label: 'Near-perfect run!' },
  { threshold: 8, add: 4, label: 'Excellent showing!' },
  { threshold: 7, add: 2, label: 'Strong performance!' },
]

export function createAntigravityAgent() {
  const profile = createPlayerProfile()
  const reasoningLog = createReasoningLog()

  let currentSessionCorrect = 0
  let currentSessionTotal = 0
  let sessionQuestionCount = BASE_SESSION_SIZE
  let sessionExpanded = false

  addReasoning(reasoningLog, 'evaluation', 'Antigravity Agent initialized. Ready to adapt gameplay.')

  return {
    profile,
    reasoningLog,

    get sessionQuestionCount() {
      return sessionQuestionCount
    },

    get currentSessionCorrect() {
      return currentSessionCorrect
    },

    get currentSessionTotal() {
      return currentSessionTotal
    },

    startSession() {
      currentSessionCorrect = 0
      currentSessionTotal = 0
      sessionQuestionCount = BASE_SESSION_SIZE
      sessionExpanded = false
      profile.currentSessionPuzzleCount = 0
      profile.sessionCount += 1
      
      addReasoning(
        reasoningLog,
        'evaluation',
        `Session ${profile.sessionCount} started. Initial evaluation: ${BASE_SESSION_SIZE} questions.`
      )

      return {
        questionCount: sessionQuestionCount,
        profile: { ...profile },
      }
    },

    processAnswer(question, isCorrect, wasSkipped, timeMs) {
      const category = mapBankTypeToCategory(question.bankType, question.subtype)
      
      recordAnswer(profile, category, isCorrect, timeMs, wasSkipped)
      
      if (isPuzzleCategory(category)) {
        profile.currentSessionPuzzleCount += 1
      }

      currentSessionTotal += 1
      if (isCorrect && !wasSkipped) {
        currentSessionCorrect += 1
      }

      const accuracy = getCategoryAccuracy(profile, category)
      const trend = getRecentTrend(profile, category)
      
      addReasoning(
        reasoningLog,
        'evaluation',
        generateEvaluationReasoning(category, isCorrect, accuracy, trend)
      )

      const xpResult = calculateXPReward(profile, category, isCorrect, wasSkipped, timeMs, reasoningLog.entries)
      profile.totalXP += xpResult.xp

      this._updateDifficulty(category)
      this._updateWeights()

      const expansion = this._checkExpansion()

      return {
        xpAwarded: xpResult.xp,
        xpBreakdown: xpResult.breakdown,
        totalXP: profile.totalXP,
        level: calculateLevelFromXP(profile.totalXP),
        streak: profile.globalStreak,
        streakLabel: getStreakLabel(profile.globalStreak),
        expansion,
        reasoningLog: getRecentReasoning(reasoningLog, 3),
      }
    },

    _updateDifficulty(category) {
      if (category === QuestionCategory.LINKED_LIST) {
        evaluateLinkedListDifficulty(profile, reasoningLog.entries)
      } else if (category === QuestionCategory.DFS_TREE) {
        evaluateDfsDifficulty(profile, reasoningLog.entries)
      } else if (category === QuestionCategory.RING_BUFFER) {
        evaluateRingBufferDifficulty(profile, reasoningLog.entries)
      }
    },

    _updateWeights() {
      const weak = getWeakCategories(profile)
      const strong = getStrongCategories(profile)

      for (const cat of Object.keys(profile.weights)) {
        if (weak.includes(cat)) {
          profile.weights[cat] = Math.min(2.0, profile.weights[cat] + 0.15)
        } else if (strong.includes(cat)) {
          profile.weights[cat] = Math.max(0.5, profile.weights[cat] - 0.1)
        } else {
          profile.weights[cat] = Math.min(1.2, Math.max(0.8, profile.weights[cat] * 0.98 + 0.02))
        }
      }

      if (weak.length > 0) {
        addReasoning(
          reasoningLog,
          'weight',
          `Adjusting question weights. Weak areas (${weak.join(', ')}) will appear more often.`
        )
      }
    },

    _checkExpansion() {
      if (sessionExpanded) return null
      if (currentSessionTotal < BASE_SESSION_SIZE) return null

      for (const rule of EXPANSION_RULES) {
        if (currentSessionCorrect >= rule.threshold) {
          sessionExpanded = true
          sessionQuestionCount = BASE_SESSION_SIZE + rule.add
          
          addReasoning(
            reasoningLog,
            'expansion',
            generateExpansionReasoning(currentSessionCorrect, rule.add, sessionQuestionCount)
          )

          return {
            added: rule.add,
            newTotal: sessionQuestionCount,
            label: rule.label,
          }
        }
      }
      return null
    },

    selectNextQuestionType(availableTypes) {
      if (profile.currentSessionPuzzleCount >= MAX_PUZZLES_PER_SESSION) {
        const nonPuzzle = availableTypes.filter(t => !isPuzzleCategory(t))
        if (nonPuzzle.length > 0) {
          addReasoning(
            reasoningLog,
            'cap',
            generateCapReasoning(profile.currentSessionPuzzleCount, MAX_PUZZLES_PER_SESSION)
          )
          return this._weightedSelect(nonPuzzle)
        }
      }

      return this._weightedSelect(availableTypes)
    },

    _weightedSelect(types) {
      const totalWeight = types.reduce((sum, t) => sum + (profile.weights[t] ?? 1.0), 0)
      let rand = Math.random() * totalWeight
      
      for (const t of types) {
        rand -= (profile.weights[t] ?? 1.0)
        if (rand <= 0) {
          addReasoning(
            reasoningLog,
            'selection',
            generateSelectionReasoning(profile, t, profile.weights)
          )
          return t
        }
      }
      return types[0]
    },

    canSelectPuzzle() {
      return profile.currentSessionPuzzleCount < MAX_PUZZLES_PER_SESSION
    },

    getDifficultyParams() {
      return {
        linkedListNodes: profile.difficulty.linkedListNodes,
        dfsBranching: profile.difficulty.dfsBranching,
        dfsDepth: profile.difficulty.dfsDepth,
        ringBufferSize: profile.difficulty.ringBufferSize,
      }
    },

    getProfileSnapshot() {
      return {
        ...profile,
        level: calculateLevelFromXP(profile.totalXP),
        weakAreas: getWeakCategories(profile),
        strongAreas: getStrongCategories(profile),
        categoryStats: Object.fromEntries(
          Object.entries(profile.categories).map(([cat, stats]) => [
            cat,
            {
              ...stats,
              accuracy: getCategoryAccuracy(profile, cat),
              strength: stats.attempts >= 2 
                ? (getCategoryAccuracy(profile, cat) >= 0.8 ? 'strong' : getCategoryAccuracy(profile, cat) >= 0.5 ? 'moderate' : 'weak')
                : 'unknown',
              trend: getRecentTrend(profile, cat),
              difficultyLabel: getDifficultyLabel(profile, cat),
              multiplier: profile.weights[cat] ?? 1.0,
              currentDifficulty: cat === QuestionCategory.LINKED_LIST 
                ? { type: 'Linked List', nodes: profile.difficulty.linkedListNodes }
                : cat === QuestionCategory.DFS_TREE
                  ? { type: 'DFS Tree', branching: profile.difficulty.dfsBranching, depth: profile.difficulty.dfsDepth }
                  : cat === QuestionCategory.RING_BUFFER
                    ? { type: 'Ring Buffer', size: profile.difficulty.ringBufferSize }
                    : null,
              incorrectHistory: stats.lastResults
                .filter(r => !r.isCorrect && !r.wasSkipped)
                .map(r => ({ timestamp: r.timestamp, timeMs: r.timeMs })),
            },
          ])
        ),
      }
    },

    getFormattedReasoning(count = 10) {
      return formatReasoningForDisplay(getRecentReasoning(reasoningLog, count))
    },

    endSession() {
      const bonus = getSessionXPBonus(currentSessionCorrect, currentSessionTotal)
      if (bonus.bonus > 0) {
        profile.totalXP += bonus.bonus
        addReasoning(
          reasoningLog,
          'xp',
          `${bonus.label} Session bonus: +${bonus.bonus} XP`
        )
      }

      addReasoning(
        reasoningLog,
        'evaluation',
        `Session complete. Score: ${currentSessionCorrect}/${currentSessionTotal}. Total XP: ${profile.totalXP}`
      )

      return {
        correct: currentSessionCorrect,
        total: currentSessionTotal,
        sessionBonus: bonus,
        totalXP: profile.totalXP,
        level: calculateLevelFromXP(profile.totalXP),
      }
    },
  }
}

export const CATEGORY_DISPLAY_NAMES = {
  [QuestionCategory.STACKTRACE]: 'Stack Trace',
  [QuestionCategory.CODE_COMPLETION]: 'Code Completion',
  [QuestionCategory.CONCEPTUAL]: 'Concept Check',
  [QuestionCategory.LINKED_LIST]: 'Linked List',
  [QuestionCategory.DFS_TREE]: 'DFS Tree',
  [QuestionCategory.RING_BUFFER]: 'Ring Buffer',
}
