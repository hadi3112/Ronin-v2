/**
 * Firebase-facing service (stubbed).
 * Replace internals with:
 *   import { getFirestore, doc, getDoc } from 'firebase/firestore'
 *   import { getAuth } from 'firebase/auth'
 *
 * Example placeholders (real Firebase):
 *   const user = firebase.auth().currentUser
 *   const userId = user?.uid || 'guest'
 */
import { getCurrentUserIdPlaceholder } from './firebaseAuth.js'

const PYTHON_COURSE = {
  name: 'Python',
  isActive: true,
  gameMode: 'boss_trial',
  questionBankId: 'python_core_v1',
}

const PLACEHOLDER_COURSES = [
  { id: 'javascript', name: 'JavaScript', isActive: false, gameMode: null, questionBankId: null },
  { id: 'rust', name: 'Rust', isActive: false, gameMode: null, questionBankId: null },
  { id: 'go', name: 'Go', isActive: false, gameMode: null, questionBankId: null },
]

/**
 * @param {{ shouldFailCourses?: boolean; shouldFailBank?: boolean }} [opts]
 */
export function createFirebaseService(opts = {}) {
  const { shouldFailCourses = false, shouldFailBank = false } = opts

  return {
    /**
     * Placeholder: real app should call initializeApp + getAuth + signInAnonymously as needed.
     */
    initAuthPlaceholder() {
      void getCurrentUserIdPlaceholder()
      return Promise.resolve()
    },

    getSessionIdentityPlaceholder() {
      return {
        userId: getCurrentUserIdPlaceholder(),
        /** Swap for: firebase.auth().currentUser */
        firebaseUserSummary: 'stub-auth',
      }
    },

    /**
     * @param {string} courseId
     * @returns {Promise<{ id: string } & typeof PYTHON_COURSE>}
     */
    async loadCourseDocument(courseId) {
      await new Promise((r) => setTimeout(r, 120))
      if (shouldFailCourses) throw new Error('Firebase courses unreachable (simulated)')
      if (courseId !== 'python') {
        return {
          id: courseId,
          name: courseId,
          isActive: false,
          gameMode: null,
          questionBankId: null,
        }
      }
      return { id: 'python', ...PYTHON_COURSE }
    },

    /**
     * @returns {Promise<Array<{ id: string } & Record<string, unknown>>>}
     */
    async loadCoursesCatalog() {
      await new Promise((r) => setTimeout(r, 140))
      if (shouldFailCourses) throw new Error('Firebase courses unreachable (simulated)')
      return [{ id: 'python', ...PYTHON_COURSE }, ...PLACEHOLDER_COURSES]
    },

    /**
     * @param {string} bankId
     * @returns {Promise<{ stacktrace: unknown[]; code_completion: unknown[]; conceptual: unknown[]; system_architecture: unknown[] }>}
     */
    async loadQuestionBankDocument(bankId) {
      await new Promise((r) => setTimeout(r, 140))
      if (shouldFailBank) throw new Error('Firebase questionBanks unreachable (simulated)')
      if (bankId !== 'python_core_v1') {
        return {
          stacktrace: [],
          code_completion: [],
          conceptual: [],
          system_architecture: [],
        }
      }
      /** Firestore returns references; app merges with local defaults in QuestionBankManager */
      return {
        stacktrace: [],
        code_completion: [],
        conceptual: [],
        system_architecture: [],
      }
    },
  }
}

export const defaultFirebaseService = createFirebaseService()
