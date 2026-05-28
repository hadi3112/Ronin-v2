import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

/**
 * IDEGeminiPanel — left-bottom: Gemini API response area.
 * Placeholder until Run button triggers the API call.
 */
export default function IDEGeminiPanel({ hasRun }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-blue-500/20 bg-black/40">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-blue-500/15 bg-blue-500/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
            Ronin Helper
          </span>
        </div>
        <span className={[
          'h-1.5 w-1.5 rounded-full transition-colors duration-300',
          hasRun ? 'bg-blue-400 animate-pulse' : 'bg-white/15',
        ].join(' ')} />
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-hide">
        <AnimatePresence mode="wait">
          {hasRun ? (
            <motion.div
              key="streaming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 text-sm text-ronin-muted"
            >
              <p className="text-blue-300">Analysing your code…</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center gap-3 text-center"
            >
              {/* Decorative gem icon */}
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/25 bg-blue-500/10">
                  <Sparkles className="h-7 w-7 text-blue-400/60" />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl" />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-blue-300/70">
                  Ronin Helper
                </p>
                <p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-white/20">
                  Run your code to receive AI-powered analysis, hints, and time/space complexity breakdown.
                </p>
              </div>

              {/* Fake skeleton lines to suggest future content */}
              <div className="mt-2 w-full max-w-[240px] space-y-2">
                {[85, 70, 55, 75, 45].map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-blue-500/10"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
