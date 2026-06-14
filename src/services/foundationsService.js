/**
 * Service for tracking Foundations progress (localStorage stubs)
 */

export function getLessonProgress(userId, moduleId) {
  try {
    const data = localStorage.getItem(`ronin_foundations_lessons_${userId}_${moduleId}`)
    return data ? JSON.parse(data) : []
  } catch (err) {
    return []
  }
}

export function markLessonComplete(userId, moduleId, lessonId) {
  const completed = getLessonProgress(userId, moduleId)
  if (!completed.includes(lessonId)) {
    completed.push(lessonId)
    localStorage.setItem(`ronin_foundations_lessons_${userId}_${moduleId}`, JSON.stringify(completed))
  }
}

export function getModuleProgress(userId) {
  try {
    const data = localStorage.getItem(`ronin_foundations_modules_${userId}`)
    return data ? JSON.parse(data) : []
  } catch (err) {
    return []
  }
}

export function markModuleComplete(userId, moduleId) {
  const completed = getModuleProgress(userId)
  if (!completed.includes(moduleId)) {
    completed.push(moduleId)
    localStorage.setItem(`ronin_foundations_modules_${userId}`, JSON.stringify(completed))
  }
}

export function writeChallengeResult(userId, setId, score, total) {
  const key = `ronin_challenge_result_${userId}_${setId}`
  localStorage.setItem(key, JSON.stringify({ score, total, timestamp: Date.now() }))
}
