import NeonButton from '../../../components/ui/NeonButton.jsx'
import UiModal from '../../../components/ui/UiModal.jsx'

export default function ChallengeModal({ open, onClose, detail }) {
  if (!detail) return null

  return (
    <UiModal open={open} onClose={onClose}>
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-ronin-gold">Challenge#1 · Test dialogue</p>
        <h2 className="font-display text-2xl font-bold text-ronin-cream">{detail.title}</h2>
        <div className="flex flex-wrap gap-3 text-xs text-ronin-muted">
          <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1">★ {detail.stars} / 3 rating</span>
          <span className="rounded-lg border border-ronin-crimson/30 bg-ronin-crimson/10 px-3 py-1 text-ronin-cream">{detail.difficulty}</span>
          <span className="rounded-lg border border-ronin-gold/30 bg-ronin-gold/10 px-3 py-1 text-ronin-cream">+{detail.xp} XP</span>
        </div>
        <p className="text-sm leading-relaxed text-ronin-muted">{detail.description}</p>

        <div className="grid gap-3">
          {(detail.testQuestions ?? []).map((q, idx) => (
            <article key={q.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-widest text-ronin-coral">Question {idx + 1}</p>
              <h3 className="mt-2 text-sm font-semibold text-ronin-cream">{q.question}</h3>
              <div className="mt-3 grid gap-2">
                {q.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    type="button"
                    className={[
                      'rounded-xl border px-3 py-2 text-left text-xs transition-colors',
                      optionIndex === q.answer
                        ? 'border-ronin-gold/40 bg-ronin-gold/10 text-ronin-cream'
                        : 'border-white/10 bg-white/5 text-ronin-muted hover:border-white/25',
                    ].join(' ')}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <NeonButton type="button" className="px-8 py-3 text-base text-white" onClick={onClose}>
            Play Test
          </NeonButton>
          <button type="button" className="rounded-xl border border-white/10 px-5 py-3 text-sm text-ronin-muted hover:bg-white/5" onClick={onClose}>
            Scout later
          </button>
        </div>
      </div>
    </UiModal>
  )
}
