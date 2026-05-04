export default function ConceptualMode({ payload, disabled, onAnswer }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-ronin-cream md:text-base">{payload.prompt}</p>
      <div className="grid gap-2">
        {(payload.choices ?? []).map((c, idx) => (
          <button
            key={c}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer(idx)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm text-ronin-cream hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
