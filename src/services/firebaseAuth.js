/**
 * Firebase auth — PLACEHOLDER / STUB
 * ---------------------------------------------------------------------------
 * Replace this module with real Firebase once your project is provisioned:
 *
 * 1) npm install firebase
 * 2) Create src/services/firebaseApp.js:
 *      import { initializeApp } from 'firebase/app'
 *      const firebaseConfig = { apiKey, authDomain, projectId, ... }
 *      export const app = initializeApp(firebaseConfig)
 * 3) import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInAnonymously }
 *    from 'firebase/auth'
 * 4) Export functions that wrap those APIs and throw on real errors.
 *
 * Never commit real API keys — use Vite env: import.meta.env.VITE_FIREBASE_*
 *
 * Example (real Firebase):
 *   const user = firebase.auth().currentUser
 *   const userId = user?.uid || 'guest'
 */

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ uid: string; email: string; displayName: string }>}
 */
export async function signInWithEmailPasswordStub(email, password) {
  void password
  await new Promise((r) => setTimeout(r, 380))
  const safeEmail = email?.trim() || 'ronin@demo.local'
  return {
    uid: 'demo-uid',
    email: safeEmail,
    displayName: safeEmail.split('@')[0] || 'Ronin',
  }
}

/**
 * @returns {Promise<void>}
 */
export async function signOutStub() {
  await new Promise((r) => setTimeout(r, 120))
}

/**
 * Placeholder anonymous auth — real: signInAnonymously(getAuth(app))
 * @returns {Promise<{ uid: string; isAnonymous: boolean }>}
 */
export async function signInAnonymouslyPlaceholder() {
  await new Promise((r) => setTimeout(r, 160))
  return { uid: `anon_${Math.random().toString(16).slice(2, 10)}`, isAnonymous: true }
}

/**
 * Mirrors: firebase.auth().currentUser?.uid ?? 'guest'
 * Wire to getAuth(app).currentUser when Firebase is installed.
 * @returns {string}
 */
export function getCurrentUserIdPlaceholder() {
  return 'guest'
}

/**
 * Subscribe to auth state — STUB returns unsubscribe noop.
 * Real: onAuthStateChanged(getAuth(app), callback)
 * @param {(user: { uid: string; email: string; displayName: string } | null) => void} [_callback]
 * @returns {() => void}
 */
export function onAuthStateChangedStub() {
  return () => {}
}
