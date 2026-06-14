import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Video, ChevronDown, ChevronUp, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import LearnMoreDialog from './LearnMoreDialog.jsx'

const formatInput = (input) => {
  if (typeof input === 'object' && input !== null) {
    return Object.entries(input)
      .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
      .join(', ')
  }
  return String(input)
}

export default function IDEQuestionPanel({ questionData, language, runResult, onOpenReasoning, onOpenVideo }) {
  const [testsExpanded, setTestsExpanded] = useState(true)
  const [selectedLearnMoreIdx, setSelectedLearnMoreIdx] = useState(null)

  if (!questionData) {
    return (
      <div className="flex h-full items-center justify-center text-ronin-muted text-xs">
        Loading question details...
      </div>
    )
  }

  const title = questionData.title || 'Untitled Problem'
  const difficulty = questionData.difficulty || 'Easy'
  const category = questionData.metadata?.category || 'General'
  const tests = questionData.tests || []

  // Compute test case statuses dynamically from sandbox stdout
  let failedCaseIndex = -1
  let runPassed = false
  if (runResult) {
    if (runResult.stdout && runResult.stdout.includes('ALL TESTS PASSED')) {
      runPassed = true
    } else if (runResult.stdout) {
      const match = runResult.stdout.match(/Test case (\d+)/)
      if (match) {
        failedCaseIndex = parseInt(match[1], 10) - 1
      }
    }
  }

  return (
    <div className="flex h-full flex-col min-h-0 justify-between">
      {/* Scrollable prompt description & test cases */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide space-y-4">
        {/* ── Problem header ── */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-ronin-gold/40 bg-ronin-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-ronin-gold">
              {language}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-ronin-muted">
              {category} · {difficulty}
            </span>
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-ronin-cream">
            {title}
          </h2>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-ronin-coral">
            Training Grounds · Active Course
          </p>
        </div>

        {/* ── Background Video Player (Embedded) ── */}
        {questionData.metadata?.video && (
          <div className="rounded-xl border border-white/[0.07] bg-black/30 overflow-hidden mb-4 relative aspect-video flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            <p className="z-10 text-xs font-semibold text-ronin-gold/60">
              Embedded Video Player Placeholder
            </p>
            <p className="absolute bottom-3 left-3 z-10 text-[10px] text-white/30">
              {questionData.metadata.video.firebaseStoragePath}
            </p>
          </div>
        )}

        {/* ── Description (Markdown) ── */}
        <div className="rounded-xl border border-white/[0.07] bg-black/30 p-4 text-sm text-ronin-muted leading-relaxed">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              code: ({ node, inline, ...props }) => (
                <code
                  className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] font-mono text-ronin-cream"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => <ul className="list-inside space-y-1 mt-2 text-[12px]" {...props} />,
              li: ({ node, ...props }) => <li className="pl-1" {...props} />,
            }}
          >
            {questionData.promptMarkdown}
          </ReactMarkdown>
        </div>

        {/* ── Test cases ── */}
        {tests.length > 0 && (
          <div className="rounded-xl border border-white/[0.07] bg-black/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setTestsExpanded(v => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
            >
              <span className="text-[11px] font-semibold uppercase tracking-widest text-ronin-muted">
                Test Cases ({tests.length})
              </span>
              {testsExpanded
                ? <ChevronUp className="h-3.5 w-3.5 text-ronin-muted" />
                : <ChevronDown className="h-3.5 w-3.5 text-ronin-muted" />
              }
            </button>

            <AnimatePresence>
              {testsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-white/[0.06]"
                >
                  <div className="divide-y divide-white/[0.05]">
                    {tests.map((tc, idx) => {
                      const isPassing = runPassed || (failedCaseIndex !== -1 && idx < failedCaseIndex)
                      const isFailing = failedCaseIndex !== -1 && idx === failedCaseIndex

                      return (
                        <div key={tc.id || idx} className="px-4 py-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-ronin-muted">
                              {idx === 3 ? 'Hidden Test Case 1' : idx === 4 ? 'Hidden Test Case 2' : `Case ${idx + 1}`}
                            </span>
                            {runResult && (
                              isPassing ? (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              ) : isFailing ? (
                                <XCircle className="h-3.5 w-3.5 shrink-0 text-ronin-crimson" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-white/10 mt-1" />
                              )
                            )}
                          </div>
                          <div className="mt-1.5 space-y-1">
                            <div className="flex gap-2 text-[11px]">
                              <span className="text-ronin-muted w-14 shrink-0">Input:</span>
                              <code className="font-mono text-ronin-cream text-[10.5px]">
                                {formatInput(tc.input)}
                              </code>
                            </div>
                            <div className="flex gap-2 text-[11px]">
                              <span className="text-ronin-muted w-14 shrink-0">Expected:</span>
                              <code className="font-mono text-ronin-gold text-[10.5px]">
                                {JSON.stringify(tc.expected)}
                              </code>
                            </div>
                            <div className="pt-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedLearnMoreIdx(idx)}
                                className="inline-flex items-center gap-1 text-[9px] font-bold text-ronin-gold hover:text-yellow-400 hover:bg-white/10 transition-all uppercase tracking-wider bg-white/5 border border-white/5 rounded-md px-2 py-0.5"
                              >
                                <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                                Learn More
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Docked action buttons bar ── */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06] shrink-0">
        <button
          type="button"
          onClick={onOpenReasoning}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-ronin-muted transition-all duration-200 hover:border-ronin-coral/30 hover:text-ronin-cream"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Show Reasoning
        </button>
      </div>

      <LearnMoreDialog
        isOpen={selectedLearnMoreIdx !== null}
        onClose={() => setSelectedLearnMoreIdx(null)}
        problemId={questionData.id}
        testCaseIdx={selectedLearnMoreIdx}
        testCaseData={tests[selectedLearnMoreIdx]}
      />
    </div>
  )
}
