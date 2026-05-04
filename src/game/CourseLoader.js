import { mergeQuestionBank } from './QuestionBankManager.js'
import { sampleSessionQuestions } from './QuestionEngine.js'

/**
 * @param {ReturnType<import('../services/FirebaseService.js').createFirebaseService>} firebase
 */
export async function loadBossTrialSession(firebase, courseId = 'python') {
  const course = await firebase.loadCourseDocument(courseId)
  if (course.gameMode !== 'boss_trial') {
    throw new Error(`Unsupported gameMode: ${course.gameMode}`)
  }
  const remoteBank = await firebase.loadQuestionBankDocument(course.questionBankId)
  const bank = mergeQuestionBank(remoteBank)
  const questions = sampleSessionQuestions(bank)
  return { course, bank, questions }
}
