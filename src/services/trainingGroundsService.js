/**
 * Onboarding On-Device Storage Service for Training Grounds
 * ---------------------------------------------------------------------------
 * Simulates the trainingGrounds/{userId}/{problemId} and skills/{userId}
 * nodes in Firestore using LocalStorage stubs.
 */

const EXPECTED_TIMES = {
  two_sum: 10 * 60, // 10 minutes
  linked_list_reversal: 12 * 60, // 12 minutes
  dfs_traversal: 12 * 60, // 12 minutes
  circular_queue: 15 * 60, // 15 minutes
}

const THEORETICAL_MIN_MOVES = {
  two_sum: 2,
  linked_list_reversal: 2,
  dfs_traversal: 2,
  circular_queue: 3,
}

const PROBLEM_TITLES = {
  two_sum: 'Two Sum Array Logic',
  linked_list_reversal: 'Reverse a Linked List',
  dfs_traversal: 'Depth-First Search on a Tree',
  circular_queue: 'Build a Circular Queue',
}

const PROBLEM_DOMAINS = {
  two_sum: 'arrays',
  linked_list_reversal: 'linked_lists',
  dfs_traversal: 'trees',
  circular_queue: 'queues',
}

/**
 * @typedef {object} TrainingGroundsResult
 * @property {string} modeChosen - 'ide' | 'blocks'
 * @property {number} runAttempts
 * @property {number} hintsOpened - dropdown hints
 * @property {number} geminiHintsReceived
 * @property {number} blockMovesMade
 * @property {number} timeTakenSeconds
 * @property {string} status - 'pass' | 'fail'
 * @property {Array<any>} finalBlockArrangement
 */

/**
 * Write telemetry result for a Training Grounds problem.
 * @param {string} userId
 * @param {string} problemId
 * @param {TrainingGroundsResult} payload
 */
export function writeTrainingGroundsResult(userId, problemId, payload) {
  try {
    localStorage.setItem(
      `ronin.trainingGrounds.v1.${userId}.${problemId}`,
      JSON.stringify({
        ...payload,
        problemName: PROBLEM_TITLES[problemId] || problemId,
        timestamp: Date.now(),
      })
    )
  } catch (e) {
    console.error('LocalStorage write failed:', e)
  }
}

/**
 * Read all results for a user.
 * @param {string} userId
 * @returns {Record<string, any>}
 */
export function readTrainingGroundsResults(userId) {
  const problems = ['two_sum', 'linked_list_reversal', 'dfs_traversal', 'circular_queue']
  const results = {}
  problems.forEach((pid) => {
    try {
      const raw = localStorage.getItem(`ronin.trainingGrounds.v1.${userId}.${pid}`)
      if (raw) {
        results[pid] = JSON.parse(raw)
      }
    } catch {}
  })
  return results
}

/**
 * Get IDs of completed Training Grounds problems.
 * @param {string} userId
 * @returns {string[]}
 */
export function getCompletedTrainingGroundsProblems(userId) {
  const results = readTrainingGroundsResults(userId)
  return Object.keys(results).filter((pid) => results[pid]?.status === 'pass')
}

/**
 * Reads the skill vector for a user.
 * @param {string} userId
 * @returns {Record<string, number>}
 */
export function readSkillVector(userId) {
  try {
    const raw = localStorage.getItem(`ronin.skills.v1.${userId}`)
    return raw ? JSON.parse(raw) : { arrays: 0, linked_lists: 0, trees: 0, queues: 0 }
  } catch {
    return { arrays: 0, linked_lists: 0, trees: 0, queues: 0 }
  }
}

/**
 * Writes the skill vector for a user.
 * @param {string} userId
 * @param {Record<string, number>} skillVector
 */
export function writeSkillVector(userId, skillVector) {
  try {
    localStorage.setItem(`ronin.skills.v1.${userId}`, JSON.stringify(skillVector))
  } catch (e) {
    console.error('LocalStorage skill write failed:', e)
  }
}

/**
 * Calculates adaptive skills and updates/averages with the existing skill vector.
 * @param {string} userId
 * @returns {Record<string, number>}
 */
export function computeAndSaveSkillVector(userId) {
  const results = readTrainingGroundsResults(userId)
  const currentSkills = readSkillVector(userId)
  const newSkills = { ...currentSkills }

  Object.entries(results).forEach(([pid, stats]) => {
    if (stats.status !== 'pass') return

    const domain = PROBLEM_DOMAINS[pid]
    if (!domain) return

    // 1. Mode Choice (10%): IDE = 1.0, Blocks = 0.5
    const modeScore = stats.modeChosen === 'ide' ? 1.0 : 0.5

    // 2. Run Attempts (25%): 1 = 1.0, 2 = 0.8, 3 = 0.6, 4+ = 0.4
    let attemptScore = 0.4
    if (stats.runAttempts === 1) attemptScore = 1.0
    else if (stats.runAttempts === 2) attemptScore = 0.8
    else if (stats.runAttempts === 3) attemptScore = 0.6

    // 3. Hint Usage (30%): Dropdown (mild penalty), Gemini (heavier penalty)
    const dropdownPenalty = Math.min(0.3, stats.hintsOpened * 0.05)
    const geminiPenalty = Math.min(0.5, stats.geminiHintsReceived * 0.15)
    const hintScore = Math.max(0.1, 1.0 - dropdownPenalty - geminiPenalty)

    // 4. Block Move Efficiency (20%): Blocks mode only
    let efficiencyScore = 1.0
    if (stats.modeChosen === 'blocks') {
      const minMoves = THEORETICAL_MIN_MOVES[pid] || 4
      const ratio = stats.blockMovesMade / Math.max(1, minMoves)
      if (ratio > 3.0) {
        efficiencyScore = 0.0 // Exploratory guessing behavior
      } else {
        efficiencyScore = Math.max(0.0, 1.0 - (ratio - 1.0) / 2.0)
      }
    }

    // 5. Time Taken (15%): Normalized against expected seconds
    const expectedSec = EXPECTED_TIMES[pid] || 600
    const timeRatio = expectedSec / Math.max(1, stats.timeTakenSeconds)
    const timeScore = timeRatio >= 1.0 ? 1.0 : Math.max(0.3, timeRatio)

    // Weighted combination
    const calculatedScore =
      modeScore * 0.1 +
      attemptScore * 0.25 +
      hintScore * 0.3 +
      efficiencyScore * 0.2 +
      timeScore * 0.15

    // Overwrite if existing is zero, otherwise average
    const existing = currentSkills[domain] || 0
    newSkills[domain] = existing === 0 ? calculatedScore : (existing + calculatedScore) / 2
  })

  writeSkillVector(userId, newSkills)
  return newSkills
}
