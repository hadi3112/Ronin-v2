import { motion } from 'framer-motion'
import { Sparkles, ChevronUp } from 'lucide-react'

export default function SessionExpansionBanner({ expansion, onDismiss }) {
  if (!expansion) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-900/80 to-orange-900/80 px-5 py-3 shadow-xl backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/30">
          <ChevronUp className="h-5 w-5 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="font-display text-sm font-bold text-amber-100">{expansion.label}</span>
          </div>
          <p className="text-xs text-amber-200/80">
            +{expansion.added} bonus questions added! Session now has {expansion.newTotal} questions.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-2 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30"
        >
          Got it
        </button>
      </div>
    </motion.div>
  )
}
