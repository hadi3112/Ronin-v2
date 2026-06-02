import { useCallback, useMemo, useState, useEffect } from 'react'
import {
  signInWithEmailPasswordStub,
  signOutStub,
} from '../services/firebaseAuth.js'
import { AuthContext } from './auth-context-core.js'
import {
  getOnboardingPhase,
  setOnboardingPhase as persistOnboardingPhase,
} from '../services/onboardingService.js'

const STORAGE_KEY = 'ronin.session.v1'

/** @typedef {{ uid: string; email: string; displayName: string }} AuthUser */
/** @typedef {{ interests: string[]; skill: string; learningStyle: string; contentModes?: string[] }} UserPreferences */

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
  const [onboardingPhase, setOnboardingPhaseState] = useState(
    /** @type {import('../services/onboardingService.js').OnboardingPhase | null} */ (null),
  )

  // Load onboardingPhase from storage whenever user changes
  useEffect(() => {
    if (!user) {
      setOnboardingPhaseState(null)
      return
    }
    getOnboardingPhase(user.uid).then((phase) => {
      setOnboardingPhaseState(phase)
    })
  }, [user?.uid])

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
      // Load onboarding phase for the newly logged-in user
      getOnboardingPhase(nextUser.uid).then((phase) => {
        setOnboardingPhaseState(phase)
      })
    },
    [persist],
  )

  const logout = useCallback(async () => {
    await signOutStub()
    setUser(null)
    setGettingStartedDone(false)
    setPreferences(null)
    setOnboardingPhaseState(null)
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
      // First time a user saves preferences → begin diagnostic onboarding
      // FIREBASE_PLACEHOLDER: this also calls setOnboardingPhase which writes to users/{userId}.onboardingPhase
      if (!onboardingPhase && user) {
        const uid = user.uid
        persistOnboardingPhase(uid, 'diagnostic_pending').then(() => {
          setOnboardingPhaseState('diagnostic_pending')
        })
      }
    },
    [persist, user, onboardingPhase],
  )

  /**
   * Update the onboarding phase both in storage and local state.
   * Call this to advance through: diagnostic_pending → training_grounds_pending → onboarding_complete
   * FIREBASE_PLACEHOLDER: replace persistOnboardingPhase internals with real Firestore setDoc call.
   * @param {import('../services/onboardingService.js').OnboardingPhase} phase
   */
  const updateOnboardingPhase = useCallback(
    async (phase) => {
      if (!user) return
      await persistOnboardingPhase(user.uid, phase)
      setOnboardingPhaseState(phase)
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      gettingStartedDone,
      preferences,
      isAuthenticated: Boolean(user),
      isOnboardingComplete: Boolean(user && preferences),
      onboardingPhase,
      updateOnboardingPhase,
      login,
      logout,
      completeGettingStarted,
      savePreferences,
    }),
    [
      user,
      gettingStartedDone,
      preferences,
      onboardingPhase,
      updateOnboardingPhase,
      login,
      logout,
      completeGettingStarted,
      savePreferences,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
