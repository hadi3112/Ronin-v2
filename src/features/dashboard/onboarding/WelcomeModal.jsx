import { motion } from 'framer-motion'
import { Swords } from 'lucide-react'
import NeonButton from '../../../components/ui/NeonButton.jsx'

/**
 * Non-dismissible welcome modal shown once on first dashboard load.
 * Backdrop click and keyboard escape do nothing — user must click the button.
 *
 * @param {{ open: boolean; onStart: () => void }} props
 */
export default function WelcomeModal({ open, onStart }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,2,3,0.82)', backdropFilter: 'blur(10px)' }}
      role="presentation"
      // intentionally no onClick dismiss
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0c0405] shadow-[0_0_80px_-10px_rgba(220,40,40,0.35)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ronin-crimson/60 to-transparent" />

        {/* Glow behind icon */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(220,40,40,0.18),transparent)]" />

        <div className="relative flex flex-col items-center gap-6 px-8 py-10 text-center">
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-ronin-crimson/40 bg-ronin-crimson/15 shadow-[0_0_30px_rgba(220,40,40,0.3)]"
          >
            <Swords className="h-8 w-8 text-ronin-coral" />
          </motion.div>

          {/* Eyebrow */}
          <p className="text-[10px] uppercase tracking-[0.4em] text-ronin-coral">
            Diagnostic Challenge
          </p>

          {/* Heading */}
          <h2
            id="welcome-modal-title"
            className="font-display text-2xl font-bold leading-tight text-ronin-cream"
          >
            Welcome to Ronin.
          </h2>

          {/* Body */}
          <p className="max-w-xs text-sm leading-relaxed text-ronin-muted">
            Before we find out where you stand, let&apos;s run a quick diagnostic challenge.
            This will tell us exactly what to focus on.
            Hit <span className="font-semibold text-ronin-cream">Start</span> when you&apos;re ready.
          </p>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* CTA */}
          <NeonButton
            id="diagnostic-start-btn"
            variant="crimson"
            className="w-full justify-center rounded-2xl py-3 text-base"
            onClick={onStart}
          >
            Start Challenge
          </NeonButton>
        </div>

        {/* Bottom accent bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ronin-crimson/30 to-transparent" />
      </motion.div>
    </div>
  )
}
