export default function CodeCompletionMode({ payload, disabled, onAnswer }) {
  const code = String(payload.code ?? '')

  return (
    <div className="space-y-4">
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-[11px] leading-relaxed text-ronin-cream md:text-xs">
        {code}
      </pre>
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
