import { useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NeonButton from '../components/ui/NeonButton.jsx'
import CombatRenderer from '../features/game/CombatRenderer.jsx'
import QuestionStage from '../features/game/QuestionStage.jsx'
import { useBossTrialGame } from '../features/game/hooks/useBossTrialGame.js'
import { generateSessionId } from '../game/sessionId.js'
import { useAuth } from '../hooks/useAuth.js'

function EndCard({ title, subtitle, tone }) {
  const border =
    tone === 'win'
      ? 'border-emerald-400/40 bg-emerald-500/10'
      : tone === 'lose'
        ? 'border-ronin-crimson/50 bg-ronin-crimson/10'
        : 'border-white/15 bg-black/50'
  return (
    <div className={`rounded-2xl border p-6 text-center ${border}`}>
      <p className="text-xs uppercase tracking-[0.35em] text-ronin-muted">{tone === 'win' ? 'Victory' : tone === 'lose' ? 'Outcome' : 'Session end'}</p>
      <h2 className="mt-3 font-display text-2xl font-bold text-ronin-cream">{title}</h2>
      <p className="mt-2 text-sm text-ronin-muted">{subtitle}</p>
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
    game.applyAnswer(ok)
  }

  const handleSystem = (isCorrect) => {
    if (!game.current) return
    if (busy) return
    if (answeredRef.current === game.current.id) return
    answeredRef.current = game.current.id
    game.applyAnswer(Boolean(isCorrect))
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
  let endTone = 'neutral'
  let endTitle = 'Session complete'
  let endSubtitle = 'Boss Trial closed.'
  if (game.phase === 'victory') {
    endTone = 'win'
    endTitle = 'Boss defeated'
    endSubtitle = 'Clean reads, sharp slashes, steady nerve.'
  } else if (game.phase === 'defeat') {
    endTone = 'lose'
    endTitle = 'Ronin falls'
    endSubtitle = 'Reset, study the trace, return when ready.'
  } else if (game.phase === 'complete_win') {
    endTone = 'win'
    endTitle = 'Win on points'
    endSubtitle = 'Ten rounds up — you held more HP than the boss.'
  } else if (game.phase === 'complete_loss') {
    endTone = 'lose'
    endTitle = 'Boss wins on points'
    endSubtitle = 'Ten rounds up — the boss kept more HP.'
  } else if (game.phase === 'tie') {
    endTone = 'neutral'
    endTitle = 'Stalemate'
    endSubtitle = 'Ten rounds up — perfectly matched HP.'
  }

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
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-ronin-muted">
              Focus timer (optional) — off
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {ended ? (
              <div className="mx-auto max-w-lg py-10">
                <EndCard title={endTitle} subtitle={endSubtitle} tone={endTone} />
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <NeonButton type="button" className="px-6 py-2" onClick={() => window.location.reload()}>
                    Run again
                  </NeonButton>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 px-5 py-2 text-sm text-ronin-muted hover:bg-white/5"
                    onClick={() => navigate('/dashboard')}
                  >
                    Back to courses
                  </button>
                </div>
              </div>
            ) : (
              <QuestionStage
                key={game.current?.id ?? 'none'}
                question={game.current}
                disabled={busy}
                onMcq={handleMcq}
                onSystem={handleSystem}
              />
            )}
          </div>
        </section>

        <section className="flex min-h-[32vh] flex-[2] flex-col p-3 md:p-4">
          <CombatRenderer combatPhase={game.combatPhase} roninHp={game.roninHp} bossHp={game.bossHp} />
        </section>
      </div>
    </div>
  )
}
