/**
 * Agent reasoning trace system — exposes WHY the agent made decisions.
 */

export function createReasoningLog() {
  return {
    entries: [],
    maxEntries: 100,
  }
}

export function addReasoning(log, type, message, metadata = {}) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    message,
    timestamp: Date.now(),
    ...metadata,
  }
  log.entries.push(entry)
  if (log.entries.length > log.maxEntries) {
    log.entries.shift()
  }
  return entry
}

export function getRecentReasoning(log, count = 5) {
  return log.entries.slice(-count)
}

export function getReasoningByType(log, type) {
  return log.entries.filter(e => e.type === type)
}

export function formatReasoningForDisplay(entries) {
  return entries.map(e => ({
    id: e.id,
    type: e.type,
    message: e.message,
    time: formatTimestamp(e.timestamp),
    icon: getReasoningIcon(e.type),
    color: getReasoningColor(e.type),
  }))
}

function formatTimestamp(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getReasoningIcon(type) {
  switch (type) {
    case 'difficulty': return '⚖️'
    case 'xp': return '✨'
    case 'selection': return '🎯'
    case 'evaluation': return '🧠'
    case 'expansion': return '📈'
    case 'cap': return '🚫'
    case 'weight': return '⚡'
    default: return '💭'
  }
}

function getReasoningColor(type) {
  switch (type) {
    case 'difficulty': return 'text-amber-400'
    case 'xp': return 'text-emerald-400'
    case 'selection': return 'text-blue-400'
    case 'evaluation': return 'text-purple-400'
    case 'expansion': return 'text-cyan-400'
    case 'cap': return 'text-red-400'
    case 'weight': return 'text-orange-400'
    default: return 'text-gray-400'
  }
}

export function generateSelectionReasoning(profile, selectedCategory, weights) {
  const sortedWeights = Object.entries(weights)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat, w]) => `${cat}: ${w.toFixed(2)}`)
    .join(', ')

  return `Selected ${selectedCategory} question. Current weights: ${sortedWeights}`
}

export function generateEvaluationReasoning(category, isCorrect, accuracy, trend) {
  const trendEmoji = trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'
  const resultStr = isCorrect ? 'Correct' : 'Incorrect'
  return `${resultStr} on ${category}. Overall accuracy: ${Math.round(accuracy * 100)}% ${trendEmoji}`
}

export function generateExpansionReasoning(correctCount, addedQuestions, newTotal) {
  return `Strong performance (${correctCount} correct). Expanding session by ${addedQuestions} questions to ${newTotal} total.`
}

export function generateCapReasoning(currentPuzzleCount, maxPuzzles) {
  return `Puzzle question cap reached (${currentPuzzleCount}/${maxPuzzles}). Switching to non-puzzle questions.`
}
