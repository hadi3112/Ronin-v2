import CodeCompletionMode from './question-renderers/CodeCompletionMode.jsx'
import ConceptualMode from './question-renderers/ConceptualMode.jsx'
import StacktraceMode from './question-renderers/StacktraceMode.jsx'
import SystemPuzzles from './question-renderers/SystemPuzzles.jsx'

export default function QuestionStage({ question, disabled, onMcq, onSystem }) {
  if (!question) return null

  if (question.bankType === 'stacktrace') {
    return <StacktraceMode payload={question.payload} disabled={disabled} onAnswer={onMcq} />
  }
  if (question.bankType === 'code_completion') {
    return <CodeCompletionMode payload={question.payload} disabled={disabled} onAnswer={onMcq} />
  }
  if (question.bankType === 'conceptual') {
    return <ConceptualMode payload={question.payload} disabled={disabled} onAnswer={onMcq} />
  }
  if (question.bankType === 'system_architecture') {
    return (
      <SystemPuzzles
        subtype={question.subtype}
        payload={question.payload}
        disabled={disabled}
        onSubmit={onSystem}
      />
    )
  }
  return <p className="text-sm text-ronin-muted">Unsupported question bank.</p>
}
