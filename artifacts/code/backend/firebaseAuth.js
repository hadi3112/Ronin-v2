/**
 * PURPOSE: Implements client-side authentication stubbing for Firebase. Structures the sign-in, anonymous session loaders, sign-out, and auth change subscription behaviors ready for real Firebase SDK drop-in integration.
 * DEPENDENCIES: 
 *   - Local stub implementations
 * USAGE CONTEXT: Imported inside AuthProvider contexts and API/Firebase database managers to isolate authentication handlers.
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

export async function signOutStub() {
  await new Promise((r) => setTimeout(r, 120))
}

export async function signInAnonymouslyPlaceholder() {
  await new Promise((r) => setTimeout(r, 160))
  return { uid: `anon_${Math.random().toString(16).slice(2, 10)}`, isAnonymous: true }
}

export function getCurrentUserIdPlaceholder() {
  return 'guest'
}

export function onAuthStateChangedStub() {
  return () => {}
}
