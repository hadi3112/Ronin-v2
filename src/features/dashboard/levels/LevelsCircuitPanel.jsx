import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { mockChallengeDetail, mockLevelNodes } from '../../../data/mockLevels.js'
import ChallengeModal from './ChallengeModal.jsx'

function CircuitConnector() {
  return (
    <div className="flex justify-center py-1">
      <div className="relative h-14 w-px overflow-hidden rounded-full bg-gradient-to-b from-ronin-crimson/10 via-ronin-crimson to-ronin-crimson/10">
        <motion.div
          className="absolute inset-x-0 top-0 h-8 w-full bg-gradient-to-b from-transparent via-ronin-gold to-transparent opacity-80"
          animate={{ y: ['-100%', '120%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  )
}

export default function LevelsCircuitPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative mx-auto max-w-3xl space-y-0 pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trace" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#F33232" stopOpacity="0" />
              <stop offset="0.5" stopColor="#F33232" stopOpacity="0.5" />
              <stop offset="1" stopColor="#F33232" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 50 40 C 120 120 20 200 180 320"
            stroke="url(#trace)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      {mockLevelNodes.map((node, idx) => (
        <div key={node.id}>
          {idx > 0 && <CircuitConnector />}
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            whileHover={{ scale: 1.01 }}
            className="relative w-full rounded-2xl border border-white/10 bg-gradient-to-br from-black/70 to-ronin-nav-from/30 p-5 text-left shadow-ronin"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ronin-crimson/40 bg-ronin-crimson/15 text-ronin-coral">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ronin-muted">{node.difficulty}</p>
                  <h3 className="font-display text-xl font-semibold text-ronin-cream">{node.title}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-ronin-muted">Completion</p>
                <p className="text-lg font-bold text-ronin-gold">{node.completion}%</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {node.sublevels.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-ronin-muted"
                >
                  {s.title} · {s.completion}%
                </span>
              ))}
            </div>
          </motion.button>
        </div>
      ))}

      <ChallengeModal open={open} onClose={() => setOpen(false)} detail={mockChallengeDetail} />
    </div>
  )
}
