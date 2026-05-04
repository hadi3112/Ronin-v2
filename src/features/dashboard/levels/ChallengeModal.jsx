import NeonButton from '../../../components/ui/NeonButton.jsx'
import UiModal from '../../../components/ui/UiModal.jsx'

export default function ChallengeModal({ open, onClose, detail }) {
  if (!detail) return null

  return (
    <UiModal open={open} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-ronin-gold">Challenge briefing</p>
        <h2 className="font-display text-2xl font-bold text-ronin-cream">{detail.title}</h2>
        <div className="flex flex-wrap gap-3 text-xs text-ronin-muted">
          <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1">
            ★ {detail.stars} / 3 rating
          </span>
          <span className="rounded-lg border border-ronin-crimson/30 bg-ronin-crimson/10 px-3 py-1 text-ronin-cream">
            {detail.difficulty}
          </span>
          <span className="rounded-lg border border-ronin-gold/30 bg-ronin-gold/10 px-3 py-1 text-ronin-cream">
            +{detail.xp} XP
          </span>
        </div>
        <p className="text-sm leading-relaxed text-ronin-muted">{detail.description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <NeonButton type="button" className="px-8 py-3 text-base text-white" onClick={onClose}>
            Start
          </NeonButton>
          <button
            type="button"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-ronin-muted hover:bg-white/5"
            onClick={onClose}
          >
            Scout later
          </button>
        </div>
      </div>
    </UiModal>
  )
}
