import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import NeonButton from '../components/ui/NeonButton.jsx'
import BossTrialCombatPanel from '../features/game/BossTrialCombatPanel.jsx'
import QuestionStage from '../features/game/QuestionStage.jsx'
import SessionReviewView from '../features/game/SessionReviewView.jsx'
import AgentToast from '../components/ui/AgentToast.jsx'
import SessionExpansionBanner from '../features/game/SessionExpansionBanner.jsx'
import { useAdaptiveBossTrialGame } from '../features/game/hooks/useAdaptiveBossTrialGame.js'
import { mockProfile, updateXP } from '../data/mockUser.js'
import { generateSessionId } from '../game/sessionId.js'
import { useAuth } from '../hooks/useAuth.js'
import {
  writeDiagnosticSession,
  questionToDomain,
} from '../services/onboardingService.js'

function SessionOutcome({
  phase,
  roninHp,
  bossHp,
  correctCount,
  totalQuestions,
  onReplay,
  onExit,
  onReviewChallenge,
  isDiagnostic,
}) {
  const margin = Math.abs(roninHp - bossHp)
  const won =
    phase === 'victory' || phase === 'complete_win' || (phase === 'tie' && roninHp >= bossHp)
  const lost = phase === 'defeat' || phase === 'complete_loss' || (phase === 'tie' && roninHp < bossHp)

  let xpGain = 400
  if (phase === 'victory' || phase === 'complete_win') xpGain = 1000
  else if (phase === 'defeat' || phase === 'complete_loss') xpGain = 200

  const xpStart = mockProfile.xpCurrent
  const xpGoal = mockProfile.xpGoal
  const xpEnd = Math.min(xpGoal, xpStart + xpGain)
  const pctStart = Math.min(100, (xpStart / xpGoal) * 100)
  const pctEnd = Math.min(100, (xpEnd / xpGoal) * 100)

  useEffect(() => {
    // In diagnostic mode, XP is read-only — never touch the scoreboard
    // FIREBASE_PLACEHOLDER: in normal mode this would also write to Firestore scoreboard
    if (!isDiagnostic) {
      updateXP(xpEnd)
    }
  }, [xpEnd, isDiagnostic])

  let title = 'Session complete'
  let subtitle = 'Boss Trial closed.'
  let tone = 'neutral'

  if (phase === 'victory') {
    tone = 'win'
    title = 'Victory — boss routed'
    subtitle = `You carved the win by ${margin} HP. The dojo floor still hums from your last strike.`
  } else if (phase === 'defeat') {
    tone = 'lose'
    title = 'Defeat — you dropped first'
    subtitle = `You lost by ${margin} HP. That one hurts: study the trace, tighten your reads, come back sharper.`
  } else if (phase === 'complete_win') {
    tone = 'win'
    title = 'Win on points'
    subtitle = `Ten rounds deep and you still edged the boss by ${margin} HP.`
  } else if (phase === 'complete_loss') {
    tone = 'lose'
    title = 'Loss on points'
    subtitle = `Ten rounds and the boss still had ${margin} more HP than you. Ouch — review and retry.`
  } else if (phase === 'tie') {
    tone = 'neutral'
    title = 'Dead heat'
    subtitle = 'Ten rounds ended in a perfect HP tie. Neither side owns the floor today.'
  }

  const border =
    tone === 'win'
      ? 'border-emerald-400/40 bg-emerald-500/10'
      : tone === 'lose'
        ? 'border-ronin-crimson/50 bg-ronin-crimson/10'
        : 'border-white/15 bg-black/50'

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <div className={`rounded-2xl border p-6 text-center ${border}`}>
        <p className="text-xs uppercase tracking-[0.35em] text-ronin-muted">
          {tone === 'win' ? 'Victory' : tone === 'lose' ? 'Loss' : 'Outcome'}
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold text-ronin-cream">{title}</h2>
        <p className="mt-2 text-sm text-ronin-muted">{subtitle}</p>
        <p className="mt-3 text-xs text-ronin-gold">
          HP margin: {margin} · Ronin {roninHp} / Boss {bossHp}
        </p>
        <p className="mt-5 text-center font-display">
          <span className="text-2xl font-bold text-white">You Answered: </span>
          <span className={`text-2xl font-bold ${lost ? 'text-red-500' : 'text-emerald-400'}`}>
            {correctCount}/{totalQuestions}
          </span>
          <span className="text-2xl font-bold text-white"> correctly</span>
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
        <div className="flex items-center justify-between text-xs text-ronin-muted">
          <span>Ronin XP (demo)</span>
          <span className="text-ronin-gold">
            +{xpGain} XP{' '}
            {won && !lost ? '(champion bonus)' : lost ? '(consolation — keep training)' : '(dead heat bonus)'}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-ronin-muted">
          {xpStart.toLocaleString()} → {xpEnd.toLocaleString()} / {xpGoal.toLocaleString()}
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/60 ring-1 ring-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-ronin-crimson via-ronin-orange to-ronin-gold"
            initial={{ width: `${pctStart}%` }}
            animate={{ width: `${pctEnd}%` }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <NeonButton type="button" className="px-6 py-2" onClick={onReplay}>
          Run again
        </NeonButton>
        <button
          type="button"
          className="rounded-xl bg-zinc-950 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-zinc-900"
          onClick={onReviewChallenge}
        >
          Review challenge
        </button>
        <button
          type="button"
          className="rounded-xl border border-white/10 px-5 py-2 text-sm text-ronin-muted hover:bg-white/5"
          onClick={onExit}
        >
          Back to courses
        </button>
      </div>
    </div>
  )
}

export default function BossTrialGamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, onboardingPhase, updateOnboardingPhase } = useAuth()

  // When navigated here from the onboarding welcome modal, isDiagnostic=true.
  // In diagnostic mode: no XP update, no scoreboard write, telemetry goes to
  // diagnosticSession/{userId} and onboardingPhase advances on completion.
  const isDiagnostic = Boolean(location.state?.isDiagnostic) || onboardingPhase === 'diagnostic_pending'

  const sessionId = useMemo(() => generateSessionId(), [])
  const userId = user?.uid ?? 'guest'
  const game = useAdaptiveBossTrialGame({ userId, sessionId })
  const answeredRef = useRef(/** @type {string | null} */ (null))
  const [sessionReviewOpen, setSessionReviewOpen] = useState(false)
  const [quitConfirmOpen, setQuitConfirmOpen] = useState(false)
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)
  
  const [interfaceMode, setInterfaceMode] = useState('ide') // Bypasses the mode selection dialog entirely for challenges

  const addToast = useCallback((message, type = 'default') => {
    const id = `toast_${toastIdRef.current++}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2500)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    const checkLayout = () => {
      const isMobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      const isSmallScreen = window.innerWidth < 1024 && window.innerHeight < 500
      setIsMobileLandscape(isSmallScreen || (isMobileUA && window.innerWidth > window.innerHeight))
    }
    checkLayout()
    window.addEventListener('resize', checkLayout)
    return () => window.removeEventListener('resize', checkLayout)
  }, [])

  useEffect(() => {
    answeredRef.current = null
  }, [game.index, game.current?.id])

  const gamePhase = game.phase
  const sessionReviewShouldClose = gamePhase === 'playing' && sessionReviewOpen
  useEffect(() => {
    if (sessionReviewShouldClose) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionReviewOpen(false)
    }
  }, [sessionReviewShouldClose])

  const lastXPRef = useRef(0)
  const questionTypeLabels = {
    stacktrace: 'Stack Trace',
    code_completion: 'Code Completion',
    conceptual: 'Concept Check',
    linked_list_memory: 'Linked List',
    dfs_tree: 'DFS Tree',
    circular_queue: 'Ring Buffer',
  }
  
  useEffect(() => {
    if (game.latestXPGain > 0 && game.latestXPGain !== lastXPRef.current) {
      lastXPRef.current = game.latestXPGain
      const typeLabel = questionTypeLabels[game.lastQuestionType] || 'Question'
      
      if (game.lastAnswerCorrect) {
        addToast(`${typeLabel} correct! +${game.latestXPGain} XP`, 'xp')
      } else {
        addToast(`Incorrect answer. +${game.latestXPGain} XP`, 'evaluation')
      }
      
      setTimeout(() => addToast('Agent Ronin Agent Updated', 'evaluation'), 800)
      
      if (game.latestStreakLabel) {
        const streakMsg = game.expansion 
          ? `${game.latestStreakLabel} Increasing difficulty, more questions ahead!`
          : game.latestStreakLabel
        setTimeout(() => addToast(streakMsg, 'streak'), 400)
      }
    }
  }, [game.latestXPGain, game.latestStreakLabel, game.lastAnswerCorrect, game.lastQuestionType, game.expansion, addToast])

  const busy = game.animBusy || game.phase !== 'playing'
  
  const isPuzzleQuestion = game.current?.bankType === 'system_architecture' &&
    ['linked_list_memory', 'dfs_tree', 'circular_queue'].includes(game.current?.subtype)
  const isAndroid = /Android/i.test(navigator.userAgent)
  const usePuzzleLayout = isMobileLandscape && isPuzzleQuestion && isAndroid

  // ── Diagnostic session-end handler ───────────────────────────────────────
  // When running in diagnostic mode and the session ends, write telemetry to
  // diagnosticSession/{userId} and advance the onboarding phase, then navigate
  // back to dashboard with per-domain results for the results dialog.
  // FIREBASE_PLACEHOLDER: writeDiagnosticSession → Firestore diagnosticSession/{userId}
  // FIREBASE_PLACEHOLDER: updateOnboardingPhase  → Firestore users/{userId}.onboardingPhase
  const diagnosticFiredRef = useRef(false)
  useEffect(() => {
    if (!isDiagnostic) return
    if (game.phase === 'playing') return
    if (diagnosticFiredRef.current) return
    diagnosticFiredRef.current = true

    const endedAt = new Date().toISOString()

    // Build a per-domain result map from the answered questions array.
    // Since BossTrialGamePage doesn't track per-question correctness in its
    // own state (the adaptive agent does), we record domain presence here.
    // The overall correct/total counts come from game.correctCount/totalQuestions.
    // FIREBASE_PLACEHOLDER: extend useAdaptiveBossTrialGame to expose a per-question
    // answered log for more granular domain-level correct/incorrect breakdown.
    const domains = {}
    if (game.questions) {
      game.questions.forEach((q) => {
        const domain = questionToDomain(q.bankType, q.subtype)
        if (!domains[domain]) {
          domains[domain] = { domain, correct: true, timeTakenSeconds: 0, answerChanged: false }
        }
      })
    }

    if (game.answeredQuestions) {
      game.answeredQuestions.forEach((ans) => {
        const domain = questionToDomain(ans.bankType, ans.subtype)
        if (domains[domain]) {
          domains[domain].correct = domains[domain].correct && ans.isCorrect
          domains[domain].timeTakenSeconds += ans.timeMs / 1000
        }
      })
    }

    if (game.questions) {
      game.questions.forEach((q) => {
        const domain = questionToDomain(q.bankType, q.subtype)
        const hasAnswers = game.answeredQuestions?.some(
          (ans) => questionToDomain(ans.bankType, ans.subtype) === domain,
        )
        if (!hasAnswers && domains[domain]) {
          domains[domain].correct = false
        }
      })
    }

    const totalScore = game.correctCount
    const totalQuestions = game.totalQuestions

    writeDiagnosticSession(userId, {
      startedAt: new Date(Date.now() - 120000).toISOString(), // approximate start
      endedAt,
      sessionDurationSeconds: 120,
      totalScore,
      totalQuestions,
      domains,
      interfaceModeChosen: interfaceMode,
    })

    updateOnboardingPhase('training_grounds_pending').then(() => {
      navigate('/dashboard', {
        replace: true,
        state: {
          diagnosticComplete: true,
          results: domains,
          totalScore,
          totalQuestions,
        },
      })
    })
  }, [
    isDiagnostic,
    game.phase,
    game.questions,
    game.answeredQuestions,
    game.correctCount,
    game.totalQuestions,
    userId,
    navigate,
    updateOnboardingPhase,
  ])

  const handleMcq = (choiceIdx) => {
    if (!game.current) return
    if (busy) return
    if (answeredRef.current === game.current.id) return
    answeredRef.current = game.current.id
    const ok = choiceIdx === game.current.payload.answerIndex
    void game.applyAnswer(ok, false)
  }

  const handleSystem = (isCorrect) => {
    if (!game.current) return
    if (busy) return
    if (answeredRef.current === game.current.id) return
    answeredRef.current = game.current.id
    void game.applyAnswer(Boolean(isCorrect), false)
  }

  const handleSkip = () => {
    if (!game.current) return
    if (busy) return
    if (answeredRef.current === game.current.id) return
    answeredRef.current = game.current.id
    void game.applyAnswer(false, true)
  }

  const handleBack = () => {
    if (busy) return
    if (window.history.length > 1) navigate(-1)
    else navigate('/dashboard')
  }

  const handleQuitConfirmed = () => {
    setQuitConfirmOpen(false)
    navigate('/dashboard')
  }

  if (game.loadState === 'loading') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-ronin-muted">Loading Boss Trial pipeline…</p>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-ronin-crimson/70" />
        </div>
      </div>
    )
  }


  if (game.loadState === 'error') {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <p className="text-sm text-ronin-coral">Could not load the session.</p>
        <p className="text-xs text-ronin-muted">{game.loadError}</p>
        <NeonButton type="button" className="px-6 py-2" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </NeonButton>
      </div>
    )
  }

  const ended = game.phase !== 'playing'

  return (
    <div className="flex min-h-[calc(100vh-96px)] flex-col gap-3">
      {isReloading ? (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-md">
          <p className="text-lg font-display font-bold text-ronin-cream tracking-wider">Reloading challenges…</p>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-ronin-coral" />
        </div>
      ) : null}

      {quitConfirmOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quit-trial-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950/95 p-6 shadow-2xl">
            <h2 id="quit-trial-title" className="font-display text-lg font-bold text-ronin-cream">
              Quit Boss Trial?
            </h2>
            <p className="mt-3 text-sm text-ronin-muted">
              If you leave now, you will lose progress in this session. Your answers and HP for this run will not be
              saved.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-ronin-cream hover:bg-white/5"
                onClick={() => setQuitConfirmOpen(false)}
              >
                No, keep playing
              </button>
              <button
                type="button"
                className="rounded-xl bg-ronin-crimson/90 px-4 py-2 text-sm font-semibold text-white hover:bg-ronin-crimson"
                onClick={handleQuitConfirmed}
              >
                Yes, quit
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {game.expansion && (
          <SessionExpansionBanner expansion={game.expansion} onDismiss={game.dismissExpansion} />
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ronin-muted">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            session: <span className="text-ronin-cream">{sessionId.slice(0, 8)}</span>
          </span>
          {game.totalXP > 0 && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400">
              {game.totalXP.toLocaleString()} XP
            </span>
          )}
        </div>
        <Link to="/dashboard" className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-ronin-cream hover:bg-white/5">
          Exit to dashboard
        </Link>
      </div>

      <div className={`flex min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/35 shadow-ronin ${isMobileLandscape && !usePuzzleLayout ? 'flex-row' : 'flex-col'}`}>
        <section className={`flex flex-col p-4 md:p-6 min-h-0 flex-1 ${isMobileLandscape && !usePuzzleLayout ? 'w-1/2 border-r border-white/10 border-b-0' : usePuzzleLayout ? 'w-full border-b border-white/10' : 'min-h-[45vh] flex-[3] border-b border-white/10'}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-ronin-gold">Boss trial</p>
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-ronin-cream">
                Question {game.questionLabel}
              </span>
            </div>
            {!ended ? (
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/15 bg-zinc-900/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ronin-cream shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={busy}
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/15 bg-zinc-900/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ronin-cream shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={busy}
                  onClick={handleSkip}
                >
                  Skip
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-ronin-crimson/50 bg-zinc-900/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ronin-coral shadow-sm hover:bg-ronin-crimson/20 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={busy}
                  onClick={() => setQuitConfirmOpen(true)}
                >
                  Quit
                </button>
              </div>
            ) : null}
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto pr-1 pt-1">
            {ended && !sessionReviewOpen ? (
              <SessionOutcome
                phase={game.phase}
                roninHp={game.roninHp}
                bossHp={game.bossHp}
                correctCount={game.correctCount}
                totalQuestions={game.totalQuestions}
                isDiagnostic={isDiagnostic}
                onReplay={() => {
                  setIsReloading(true)
                  setTimeout(() => window.location.reload(), 800)
                }}
                onExit={() => navigate('/dashboard')}
                onReviewChallenge={() => setSessionReviewOpen(true)}
              />
            ) : null}
            {!ended ? (
              <QuestionStage
                key={game.current?.id ?? 'none'}
                question={game.current}
                disabled={busy}
                onMcq={handleMcq}
                onSystem={handleSystem}
                onTraceTimeout={() => {
                  if (!game.current) return
                  if (answeredRef.current === game.current.id) return
                  answeredRef.current = game.current.id
                  void game.applyAnswer(false, false)
                }}
              />
            ) : null}
          </div>
        </section>

        {!ended ? (
          <section className={`flex flex-col overflow-visible p-3 md:p-4 min-h-0 ${usePuzzleLayout ? 'h-[200px] w-full shrink-0' : isMobileLandscape ? 'w-1/2 flex-1' : 'min-h-[32vh] flex-[2]'}`}>
            <BossTrialCombatPanel
              combatVisualState={game.combatVisualState}
              roninHp={game.roninHp}
              bossHp={game.bossHp}
              phase={game.phase}
              compact={usePuzzleLayout}
            />
          </section>
        ) : null}
      </div>

      {ended && sessionReviewOpen && game.questions ? (
        <SessionReviewView questions={game.questions} onClose={() => setSessionReviewOpen(false)} />
      ) : null}

      <AgentToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
