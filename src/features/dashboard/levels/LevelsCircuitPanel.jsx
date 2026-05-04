import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { mockChallengeDetail, mockLevelNodes } from '../../../data/mockLevels.js'
import ChallengeModal from './ChallengeModal.jsx'

export default function LevelsCircuitPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 pb-24">
      <div className="mb-2 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-ronin-crimson/20 px-4 py-3 text-sm font-semibold text-ronin-cream">
          Object Oriented Programming in C++
        </div>
        <div className="rounded-xl border border-white/10 bg-blue-500/20 px-4 py-3 text-sm font-semibold text-ronin-cream">
          Python: Getting Started
        </div>
        <div className="rounded-xl border border-white/10 bg-amber-500/20 px-4 py-3 text-sm font-semibold text-ronin-cream">
          HTML: Web 3.0
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-5 md:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/images/tech-line.png')",
            backgroundSize: '280px auto',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-ronin-cream">
            Current Track: <span className="rounded-full bg-ronin-crimson px-3 py-1 text-base">C++</span>
          </h3>
          <button type="button" className="text-sm font-semibold text-ronin-cream underline decoration-ronin-coral/50 underline-offset-4">
            See All
          </button>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <motion.path
              d="M 130 82 C 280 82, 360 170, 500 170"
              stroke="#F33232"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              fill="none"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.path
              d="M 500 170 C 360 260, 260 350, 120 440"
              stroke="#F33232"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              fill="none"
              animate={{ strokeDashoffset: [0, 24] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          {mockLevelNodes.map((node, idx) => (
          <motion.button
            key={node.id}
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="relative z-10 w-full rounded-[22px] border border-white/20 bg-gradient-to-br from-black/80 to-ronin-nav-from/25 p-4 text-left shadow-ronin"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ronin-crimson/40 bg-ronin-crimson/15 text-ronin-coral">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ronin-muted">{node.difficulty}</p>
                  <h3 className="font-display text-base font-semibold text-ronin-cream md:text-lg">{node.title}</h3>
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
          ))}
        </div>
      </div>

      <ChallengeModal open={open} onClose={() => setOpen(false)} detail={mockChallengeDetail} />
    </div>
  )
}
