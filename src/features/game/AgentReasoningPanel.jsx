import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Zap, TrendingUp } from 'lucide-react'

export default function AgentReasoningPanel({ reasoning, streakLabel, xpGain, isVisible = true }) {
  if (!isVisible) return null

  const latestReasoning = reasoning?.slice(-3) || []

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Brain className="h-4 w-4 text-purple-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ronin-muted">
          Antigravity Agent
        </span>
      </div>

      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {latestReasoning.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="flex items-start gap-2 rounded-lg bg-black/30 px-2.5 py-1.5"
            >
              <span className="text-sm">{entry.icon}</span>
              <p className={`text-[11px] leading-tight ${entry.color}`}>{entry.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {(streakLabel || xpGain) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-white/5 pt-2">
          {streakLabel && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400"
            >
              <Zap className="h-3 w-3" />
              {streakLabel}
            </motion.div>
          )}
          {xpGain > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400"
            >
              <TrendingUp className="h-3 w-3" />
              +{xpGain} XP
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
