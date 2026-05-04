import { ANSWER_TEXT, QUESTION_TEXT, TRACE_TEXT } from '../questionTypography.js'

export default function CodeCompletionMode({ payload, disabled, onAnswer }) {
  const code = String(payload.code ?? '')
  const questionText = payload.questionText ?? 'Complete the snippet by choosing the correct fill-in.'

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{questionText}</p>
      <pre className={`overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-4 font-mono ${TRACE_TEXT}`}>{code}</pre>
      <div className="grid gap-2">
        {(payload.choices ?? []).map((c, idx) => (
          <button
            key={c}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer(idx)}
            className={`rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left ${ANSWER_TEXT} hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
