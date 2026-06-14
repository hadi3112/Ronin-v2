import { useCallback, useMemo, useState, useEffect } from 'react'
import {
  signInWithEmailPassword,
  registerWithEmailPassword,
  sendPasswordReset,
  sendVerificationEmail,
  logOut,
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
      const u = await signInWithEmailPassword(email, password)
      const nextUser = { uid: u.uid, email: u.email, displayName: u.displayName || u.email.split('@')[0] }
      setUser(nextUser)
      setGettingStartedDone(false)
      setPreferences(null)
      persist({
        user: nextUser,
        gettingStartedDone: false,
        preferences: null,
      })
      getOnboardingPhase(nextUser.uid).then((phase) => {
        setOnboardingPhaseState(phase)
      })
    },
    [persist],
  )

  const signup = useCallback(
    async (email, password) => {
      const u = await registerWithEmailPassword(email, password)
      await sendVerificationEmail(u)
      
      const nextUser = { uid: u.uid, email: u.email, displayName: u.email.split('@')[0] }
      setUser(nextUser)
      setGettingStartedDone(false)
      setPreferences(null)
      persist({
        user: nextUser,
        gettingStartedDone: false,
        preferences: null,
      })
      getOnboardingPhase(nextUser.uid).then((phase) => {
        setOnboardingPhaseState(phase)
      })
      return u
    },
    [persist],
  )

  const resetPassword = useCallback(
    async (email) => {
      await sendPasswordReset(email)
    },
    [],
  )

  const logout = useCallback(async () => {
    await logOut()
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
      if (!onboardingPhase && user) {
        const uid = user.uid
        persistOnboardingPhase(uid, 'diagnostic_pending').then(() => {
          setOnboardingPhaseState('diagnostic_pending')
        })
      }
    },
    [persist, user, onboardingPhase],
  )

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
      signup,
      resetPassword,
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
      signup,
      resetPassword,
      logout,
      completeGettingStarted,
      savePreferences,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
