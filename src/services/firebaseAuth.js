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
 * 3) import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut }
 *    from 'firebase/auth'
 * 4) Export functions that wrap those APIs and throw on real errors.
 *
 * Never commit real API keys — use Vite env: import.meta.env.VITE_FIREBASE_*
 */

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ uid: string; email: string; displayName: string }>}
 */
export async function signInWithEmailPasswordStub(email, password) {
  // Simulate network; replace with signInWithEmailAndPassword(auth, email, password)
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
 * Subscribe to auth state — STUB returns unsubscribe noop.
 * Real: onAuthStateChanged(getAuth(app), callback)
 * @param {(user: { uid: string; email: string; displayName: string } | null) => void} [_callback]
 * @returns {() => void}
 */
export function onAuthStateChangedStub() {
  return () => {}
}
