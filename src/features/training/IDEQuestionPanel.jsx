import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Video, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'

const TEST_CASES = [
  { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]', passing: true },
  { id: 2, input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]', passing: true },
  { id: 3, input: 'nums = [3, 3], target = 6', expected: '[0, 1]', passing: null },
]

export default function IDEQuestionPanel({ language }) {
  const [reasoningOpen, setReasoningOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [testsExpanded, setTestsExpanded] = useState(true)

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">

      {/* ── Problem header ── */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-ronin-gold/40 bg-ronin-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-ronin-gold">
            {language}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-ronin-muted">
            Arrays · Easy
          </span>
        </div>
        <h2 className="mt-3 font-display text-xl font-bold text-ronin-cream">
          Two Sum
        </h2>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-ronin-coral">
          Training Grounds · Problem #1
        </p>
      </div>

      {/* ── Description ── */}
      <div className="rounded-xl border border-white/[0.07] bg-black/30 p-4 text-sm text-ronin-muted leading-relaxed">
        <p>
          Given an array of integers{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] font-mono text-ronin-cream">
            nums
          </code>{' '}
          and an integer{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] font-mono text-ronin-cream">
            target
          </code>
          , return the indices of the two numbers that add up to{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] font-mono text-ronin-cream">
            target
          </code>
          .
        </p>
        <p className="mt-3">
          You may assume that each input has exactly one solution, and you may not use the same element twice.
        </p>
        <div className="mt-4 space-y-1.5">
          <p className="text-[11px] uppercase tracking-widest text-ronin-muted">Constraints</p>
          <ul className="list-disc list-inside space-y-1 text-[12px]">
            <li><code className="text-ronin-cream font-mono">2 ≤ nums.length ≤ 10⁴</code></li>
            <li><code className="text-ronin-cream font-mono">-10⁹ ≤ nums[i] ≤ 10⁹</code></li>
            <li><code className="text-ronin-cream font-mono">-10⁹ ≤ target ≤ 10⁹</code></li>
          </ul>
        </div>
      </div>

      {/* ── Test cases ── */}
      <div className="rounded-xl border border-white/[0.07] bg-black/30 overflow-hidden">
        <button
          type="button"
          onClick={() => setTestsExpanded(v => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ronin-muted">
            Test Cases ({TEST_CASES.length})
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
                {TEST_CASES.map((tc) => (
                  <div key={tc.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-ronin-muted">
                        Case {tc.id}
                      </span>
                      {tc.passing !== null && (
                        <CheckCircle2
                          className={`h-3.5 w-3.5 shrink-0 ${tc.passing ? 'text-emerald-400' : 'text-ronin-crimson'}`}
                        />
                      )}
                    </div>
                    <div className="mt-1.5 space-y-1">
                      <div className="flex gap-2 text-[11px]">
                        <span className="text-ronin-muted w-14 shrink-0">Input:</span>
                        <code className="font-mono text-ronin-cream">{tc.input}</code>
                      </div>
                      <div className="flex gap-2 text-[11px]">
                        <span className="text-ronin-muted w-14 shrink-0">Expected:</span>
                        <code className="font-mono text-ronin-gold">{tc.expected}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          type="button"
          onClick={() => setReasoningOpen(v => !v)}
          className={[
            'flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200',
            reasoningOpen
              ? 'border-ronin-coral/50 bg-ronin-coral/10 text-ronin-coral'
              : 'border-white/10 bg-white/[0.04] text-ronin-muted hover:border-ronin-coral/30 hover:text-ronin-cream',
          ].join(' ')}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Show Reasoning
        </button>

        <button
          type="button"
          onClick={() => setVideoOpen(v => !v)}
          className={[
            'flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200',
            videoOpen
              ? 'border-ronin-gold/50 bg-ronin-gold/10 text-ronin-gold'
              : 'border-white/10 bg-white/[0.04] text-ronin-muted hover:border-ronin-gold/30 hover:text-ronin-cream',
          ].join(' ')}
        >
          <Video className="h-3.5 w-3.5" />
          Video Explanation
        </button>
      </div>

      {/* ── Reasoning placeholder ── */}
      <AnimatePresence>
        {reasoningOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-ronin-coral/20 bg-ronin-coral/5 p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ronin-coral mb-2">
              Agent Reasoning
            </p>
            <p className="text-xs text-ronin-muted leading-relaxed">
              Reasoning output will appear here once Gemini integration is active.
              The agent will explain its thought process step-by-step.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video placeholder ── */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-xl border border-ronin-gold/20 bg-black/40"
          >
            <div className="flex h-32 items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-ronin-gold">
                <Video className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ronin-cream">Video Explanation</p>
                <p className="mt-0.5 text-[11px] text-ronin-muted">Placeholder — video player coming soon</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
