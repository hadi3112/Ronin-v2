import NeonButton from '../../../components/ui/NeonButton.jsx'
import UiModal from '../../../components/ui/UiModal.jsx'

export default function TutorialModal({ open, onClose, node }) {
  if (!node) return null

  return (
    <UiModal open={open} onClose={onClose}>
      <p className="text-xs uppercase tracking-[0.35em] text-ronin-coral">Tutorial relay</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-ronin-cream">{node.title}</h2>
      <p className="mt-3 text-sm text-ronin-muted">
        Difficulty <span className="text-ronin-cream">{node.difficulty}</span> · {node.minutes} min · Completion{' '}
        <span className="text-ronin-gold">{node.completion}%</span>
      </p>
      <div className="mt-6 h-40 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ronin-crimson/25 via-black to-ronin-orange/20">
        <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.35em] text-ronin-muted">
          Preview stream placeholder
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <NeonButton type="button" className="px-8 py-3" onClick={onClose}>
          Start
        </NeonButton>
        <button
          type="button"
          className="rounded-xl border border-white/10 px-5 py-3 text-sm text-ronin-muted hover:bg-white/5"
          onClick={onClose}
        >
          Back to highway
        </button>
      </div>
    </UiModal>
  )
}
