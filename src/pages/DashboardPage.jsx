import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// New Views
import DiagnosticPendingView from '../features/dashboard/onboarding/DiagnosticPendingView.jsx'
import TrainingGroundsPendingView from '../features/dashboard/onboarding/TrainingGroundsPendingView.jsx'
import TargetedChallengesPendingView from '../features/dashboard/onboarding/TargetedChallengesPendingView.jsx'
import OnboardingCompleteView from '../features/dashboard/onboarding/OnboardingCompleteView.jsx'

import AgentToast from '../components/ui/AgentToast.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { onboardingPhase, updateOnboardingPhase } = useAuth()

  // ── Diagnostic results from navigation state ─────────────────────────────
  const diagState = location.state?.diagnosticComplete ? location.state : null

  // ── Toast Notifications ──────────────────────────────────────────────────
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)

  const addToast = useCallback((message, type = 'default') => {
    const id = `toast_${toastIdRef.current++}`
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Clear navigation state after we've consumed it
  useEffect(() => {
    if (diagState && location.state) {
      window.history.replaceState({}, '', location.pathname)
      const t = setTimeout(() => {
        addToast('Agent Ronin Profile Updated', 'evaluation')
      }, 500)
      return () => clearTimeout(t)
    }
  }, [diagState, addToast, location.pathname, location.state])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStartDiagnostic = useCallback(() => {
    navigate('/dashboard/game/boss-trial', { state: { isDiagnostic: true, diagnosticType: 'foundations' } })
  }, [navigate])

  const handleGoToTraining = useCallback(async () => {
    if (onboardingPhase === 'training_grounds_pending') {
      await updateOnboardingPhase('targeted_challenges_pending')
    }
    navigate('/dashboard/training')
  }, [onboardingPhase, updateOnboardingPhase, navigate])

  return (
    <>
      <div className="h-full">
        {onboardingPhase === 'diagnostic_pending' && (
          <DiagnosticPendingView onStartDiagnostic={handleStartDiagnostic} />
        )}
        
        {onboardingPhase === 'training_grounds_pending' && (
          <TrainingGroundsPendingView 
            onGoToTraining={handleGoToTraining} 
            diagnosticResult={diagState?.results} 
          />
        )}
        
        {onboardingPhase === 'targeted_challenges_pending' && (
          <TargetedChallengesPendingView />
        )}
        
        {(!onboardingPhase || onboardingPhase === 'onboarding_complete') && (
          <OnboardingCompleteView />
        )}
      </div>

      <AgentToast toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
