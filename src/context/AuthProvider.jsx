import { useCallback, useMemo, useState } from 'react'
import {
  signInWithEmailPasswordStub,
  signOutStub,
} from '../services/firebaseAuth.js'
import { AuthContext } from './auth-context-core.js'

const STORAGE_KEY = 'ronin.session.v1'

/** @typedef {{ uid: string; email: string; displayName: string }} AuthUser */
/** @typedef {{ interests: string[]; skill: string; learningStyle: string }} UserPreferences */

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeSession(data) {
  try {
    if (!data) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore quota / private mode */
  }
}

export default function AuthProvider({ children }) {
  const stored = readSession()
  const [user, setUser] = useState(/** @type {AuthUser | null} */ (stored?.user ?? null))
  const [gettingStartedDone, setGettingStartedDone] = useState(
    Boolean(stored?.gettingStartedDone),
  )
  const [preferences, setPreferences] = useState(
    /** @type {UserPreferences | null} */ (stored?.preferences ?? null),
  )

  const persist = useCallback((next) => {
    writeSession({
      user: next.user,
      gettingStartedDone: next.gettingStartedDone,
      preferences: next.preferences,
    })
  }, [])

  const login = useCallback(
    async (email, password) => {
      // Swap for Firebase: signInWithEmailAndPassword from 'firebase/auth'
      const u = await signInWithEmailPasswordStub(email, password)
      // Demo hero name matches dashboard mockup; with Firebase use user.displayName or profile doc.
      const nextUser = { ...u, displayName: 'Hadi' }
      setUser(nextUser)
      setGettingStartedDone(false)
      setPreferences(null)
      persist({
        user: nextUser,
        gettingStartedDone: false,
        preferences: null,
      })
    },
    [persist],
  )

  const logout = useCallback(async () => {
    await signOutStub()
    setUser(null)
    setGettingStartedDone(false)
    setPreferences(null)
    writeSession(null)
  }, [])

  const completeGettingStarted = useCallback(() => {
    setGettingStartedDone(true)
    persist({
      user,
      gettingStartedDone: true,
      preferences,
    })
  }, [persist, preferences, user])

  const savePreferences = useCallback(
    (/** @type {UserPreferences} */ prefs) => {
      setPreferences(prefs)
      persist({
        user,
        gettingStartedDone: true,
        preferences: prefs,
      })
    },
    [persist, user],
  )

  const value = useMemo(
    () => ({
      user,
      gettingStartedDone,
      preferences,
      isAuthenticated: Boolean(user),
      isOnboardingComplete: Boolean(user && preferences),
      login,
      logout,
      completeGettingStarted,
      savePreferences,
    }),
    [
      user,
      gettingStartedDone,
      preferences,
      login,
      logout,
      completeGettingStarted,
      savePreferences,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
