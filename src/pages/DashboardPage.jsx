import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HeroSection from '../features/dashboard/HeroSection.jsx'
import DashboardTabs from '../features/dashboard/DashboardTabs.jsx'
import WelcomeModal from '../features/dashboard/onboarding/WelcomeModal.jsx'
import DiagnosticResultsModal from '../features/dashboard/onboarding/DiagnosticResultsModal.jsx'
import AgentToast from '../components/ui/AgentToast.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { onboardingPhase, updateOnboardingPhase } = useAuth()

  const [activeTab, setActiveTab] = useState('explore')

  // ── Training Grounds tab button ref (kept for layout compatibility if needed) ──────────────
  const trainingTabRef = useRef(null)

  // ── Diagnostic results from navigation state ─────────────────────────────
  const diagState = location.state?.diagnosticComplete ? location.state : null
  const [resultsModalOpen, setResultsModalOpen] = useState(Boolean(diagState))

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

  // Clear navigation state after we've consumed it (prevent re-show on back nav)
  useEffect(() => {
    if (diagState && location.state) {
      // Replace history entry to clear the state
      window.history.replaceState({}, '', location.pathname)

      // Trigger the snack bar message that states "Agent Ronin Agent Updated"
      const t = setTimeout(() => {
        addToast('Agent Ronin Agent Updated', 'evaluation')
      }, 500)
      return () => clearTimeout(t)
    }
  }, [diagState]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleNavigateToTutorial = useCallback(() => {
    setActiveTab('tutorials')
  }, [])

  /** Called when user clicks "Start Challenge" in WelcomeModal */
  const handleStartDiagnostic = useCallback(() => {
    // Reuse the existing Boss Trial game page — it IS the diagnostic.
    // The isDiagnostic flag tells BossTrialGamePage to write telemetry and
    // advance the onboarding phase instead of updating XP/scoreboard.
    navigate('/dashboard/game/boss-trial', { state: { isDiagnostic: true } })
  }, [navigate])

  /**
   * Called when user clicks "Go to Training Grounds" in DiagnosticResultsModal.
   * Closes results modal, switches tab.
   */
  const handleGoToTraining = useCallback(() => {
    setResultsModalOpen(false)
    setActiveTab('training')
  }, [])

  /**
   * Called when user actually taps the Training Grounds tab button.
   * Clears the arrow and advances onboarding phase.
   */
  const handleTrainingGroundsTabClick = useCallback(async () => {
    if (onboardingPhase === 'training_grounds_pending') {
      await updateOnboardingPhase('onboarding_complete')
    }
  }, [onboardingPhase, updateOnboardingPhase])

  return (
    <>
      {/* ── Onboarding modals ──────────────────────────────────────────────── */}

      {/* Welcome modal — shown when user first lands on dashboard after preferences */}
      <WelcomeModal
        open={onboardingPhase === 'diagnostic_pending'}
        onStart={handleStartDiagnostic}
      />

      {/* Results modal — shown after diagnostic completes */}
      <DiagnosticResultsModal
        open={resultsModalOpen}
        results={diagState?.results ?? {}}
        totalScore={diagState?.totalScore ?? 0}
        totalQuestions={diagState?.totalQuestions ?? 0}
        onGoToTraining={handleGoToTraining}
      />

      {/* ── Main dashboard content ─────────────────────────────────────────── */}
      <div className="space-y-2">
        <HeroSection onNavigateToTutorial={handleNavigateToTutorial} />
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          trainingTabRef={trainingTabRef}
          onTrainingGroundsClick={handleTrainingGroundsTabClick}
        />
      </div>

      {/* Toast notifications on dashboard */}
      <AgentToast toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
