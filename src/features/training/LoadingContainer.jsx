import { useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * LoadingContainer — fullscreen splash before IDE loads.
 *
 * Simple looping progress bar + "Launching IDE…" text.
 * 5-second delay before onComplete fires.
 * In future sprints this delay will be replaced with
 * real async awaits (Pyodide init, Monaco mount, etc.)
 */
export default function LoadingContainer({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 5000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-ronin-void">
      {/* Text */}
      <p className="font-display text-lg font-bold tracking-[0.25em] text-white">
        Launching IDE…
      </p>

      {/* Looping bar track */}
      <div className="relative h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 w-32 rounded-full bg-white"
          animate={{ x: ['-128px', '256px'] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
