import { ANSWER_TEXT, QUESTION_TEXT } from '../questionTypography.js'

export default function ConceptualMode({ payload, disabled, onAnswer }) {
  const questionText = payload.questionText ?? 'Concept check — pick the best answer.'

  return (
    <div className="space-y-4">
      <p className={QUESTION_TEXT}>{questionText}</p>
      <p className={QUESTION_TEXT}>{payload.prompt}</p>
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
