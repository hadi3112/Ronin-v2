import { mergeQuestionBank } from './QuestionBankManager.js'
import { sampleSessionQuestions } from './QuestionEngine.js'

/**
 * @param {ReturnType<import('../services/FirebaseService.js').createFirebaseService>} firebase
 * @param {string} [courseId]
 * @param {string} [sessionKey] session id for deterministic system-puzzle rotation
 */
export async function loadBossTrialSession(firebase, courseId = 'python', sessionKey = '') {
  const course = await firebase.loadCourseDocument(courseId)
  if (course.gameMode !== 'boss_trial') {
    throw new Error(`Unsupported gameMode: ${course.gameMode}`)
  }
  const remoteBank = await firebase.loadQuestionBankDocument(course.questionBankId)
  const bank = mergeQuestionBank(remoteBank)
  const questions = sampleSessionQuestions(bank, { sessionKey: sessionKey || `anon_${Date.now()}` })
  return { course, bank, questions }
}
