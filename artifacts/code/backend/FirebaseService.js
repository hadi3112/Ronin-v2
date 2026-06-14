/**
 * PURPOSE: Provides abstract database queries and courses/questions loading schemas. It interfaces with LocalStorage stubs to simulate Firestore document fetches for courses, catalogs, and question banks.
 * DEPENDENCIES: 
 *   - services/firebaseAuth.js (getCurrentUserIdPlaceholder)
 * USAGE CONTEXT: Primary data management layer service. Mounts default and custom services in pages and question engines to retrieve structured challenges without network overhead.
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

export function createFirebaseService(opts = {}) {
  const { shouldFailCourses = false, shouldFailBank = false } = opts

  return {
    initAuthPlaceholder() {
      void getCurrentUserIdPlaceholder()
      return Promise.resolve()
    },

    getSessionIdentityPlaceholder() {
      return {
        userId: getCurrentUserIdPlaceholder(),
        firebaseUserSummary: 'stub-auth',
      }
    },

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

    async loadCoursesCatalog() {
      await new Promise((r) => setTimeout(r, 140))
      if (shouldFailCourses) throw new Error('Firebase courses unreachable (simulated)')
      return [{ id: 'python', ...PYTHON_COURSE }, ...PLACEHOLDER_COURSES]
    },

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
