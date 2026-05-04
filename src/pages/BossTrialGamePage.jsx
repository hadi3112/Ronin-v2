import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import NeonButton from '../components/ui/NeonButton.jsx'
import CombatRenderer from '../features/game/CombatRenderer.jsx'
import QuestionStage from '../features/game/QuestionStage.jsx'
import { useBossTrialGame } from '../features/game/hooks/useBossTrialGame.js'
import { mockProfile } from '../data/mockUser.js'
import { generateSessionId } from '../game/sessionId.js'
import { useAuth } from '../hooks/useAuth.js'

function SessionOutcome({
  phase,
  roninHp,
  bossHp,
  onReplay,
  onExit,
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
  const { user } = useAuth()
  const sessionId = useMemo(() => generateSessionId(), [])
  const userId = user?.uid ?? 'guest'
  const game = useBossTrialGame({ userId, sessionId })
  const answeredRef = useRef(/** @type {string | null} */ (null))

  useEffect(() => {
    answeredRef.current = null
  }, [game.index, game.current?.id])

  const busy = game.animBusy || game.phase !== 'playing'

  const handleMcq = (choiceIdx) => {
    if (!game.current) return
    if (busy) return
    if (answeredRef.current === game.current.id) return
    answeredRef.current = game.current.id
    const ok = choiceIdx === game.current.payload.answerIndex
    void game.applyAnswer(ok)
  }

  const handleSystem = (isCorrect) => {
    if (!game.current) return
    if (busy) return
    if (answeredRef.current === game.current.id) return
    answeredRef.current = game.current.id
    void game.applyAnswer(Boolean(isCorrect))
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
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ronin-muted">
        <div className="flex flex-wrap gap-3">
          <span>
            userId: <span className="text-ronin-cream">{userId}</span>
          </span>
          <span>
            session: <span className="text-ronin-cream">{sessionId}</span>
          </span>
        </div>
        <Link to="/dashboard" className="rounded-lg border border-white/10 px-3 py-1 text-[11px] text-ronin-cream hover:bg-white/5">
          Exit to dashboard
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/35 shadow-ronin">
        <section className="flex min-h-[45vh] flex-[3] flex-col border-b border-white/10 p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-ronin-gold">Boss trial</p>
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-ronin-cream">
                Question {game.questionLabel}
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {ended ? (
              <SessionOutcome
                phase={game.phase}
                roninHp={game.roninHp}
                bossHp={game.bossHp}
                onReplay={() => window.location.reload()}
                onExit={() => navigate('/dashboard')}
              />
            ) : (
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
                  void game.applyAnswer(false)
                }}
              />
            )}
          </div>
        </section>

        <section className="flex min-h-[32vh] flex-[2] flex-col overflow-visible p-3 md:p-4">
          <CombatRenderer
            combatVisualState={game.combatVisualState}
            roninHp={game.roninHp}
            bossHp={game.bossHp}
            phase={game.phase}
          />
        </section>
      </div>
    </div>
  )
}
