import { Play, Send } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * IDEBottomBar — sticky bottom action bar with Run and Submit buttons.
 * No logic — just UI shell.
 */
export default function IDEBottomBar({ onRun, onSubmit, isRunning, isSubmitEnabled }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.07] bg-black/60 px-6 py-3 backdrop-blur-md">
      {/* Left metadata */}
      <div className="flex items-center gap-3">
        <span className="hidden text-[11px] text-white/20 sm:block">
          Training Grounds IDE
        </span>
        <span className="h-3 w-px bg-white/10 hidden sm:block" />
        <span className="text-[11px] text-white/20">No unsaved changes</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {/* Run button */}
        <motion.button
          type="button"
          onClick={onRun}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
          className={[
            'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors',
            isRunning
              ? 'border border-ronin-crimson/50 bg-ronin-crimson/20 text-ronin-coral'
              : 'border border-white/10 bg-white/[0.06] text-ronin-cream hover:border-ronin-coral/30 hover:bg-white/[0.09]',
          ].join(' ')}
          disabled={isRunning}
        >
          <Play className={`h-3.5 w-3.5 ${isRunning ? 'animate-pulse' : ''}`} />
          {isRunning ? 'Running…' : 'Run'}
        </motion.button>

        {/* Submit button */}
        <motion.button
          type="button"
          onClick={onSubmit}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
          className={[
            'flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold tracking-wide transition-all shadow-ronin-red',
            'border-ronin-crimson/50 bg-ronin-crimson/90 text-white hover:bg-ronin-crimson cursor-pointer',
          ].join(' ')}
          disabled={isRunning}
        >
          <Send className="h-3.5 w-3.5" />
          Submit
        </motion.button>
      </div>
    </div>
  )
}
