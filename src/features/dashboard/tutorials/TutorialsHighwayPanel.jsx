import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { mockTutorialClusters } from '../../../data/mockTutorials.js'
import TutorialModal from './TutorialModal.jsx'

export default function TutorialsHighwayPanel() {
  const [active, setActive] = useState(null)
  const loop = useMemo(() => [...mockTutorialClusters, ...mockTutorialClusters, ...mockTutorialClusters], [])

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-px bg-gradient-to-r from-transparent via-ronin-crimson/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-16 h-px bg-gradient-to-r from-transparent via-ronin-gold/30 to-transparent" />

      <div className="flex gap-6 overflow-x-auto pb-10 pt-8 scrollbar-hide">
        {loop.map((cluster, idx) => (
          <motion.div
            key={`${cluster.id}-${idx}`}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            className="relative flex min-w-[280px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/45 p-4 shadow-ronin"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-sm font-semibold text-ronin-cream">{cluster.title}</h3>
              <span className="text-[10px] uppercase tracking-widest text-ronin-muted">Cluster</span>
            </div>
            <div className="flex gap-2">
              {cluster.nodes.map((n, i) => (
                <div key={n.id} className="relative flex flex-1 flex-col items-center">
                  {i > 0 && (
                    <div className="absolute -left-1/2 top-6 hidden h-0.5 w-1/2 bg-gradient-to-r from-ronin-crimson/40 to-ronin-gold/40 sm:block" />
                  )}
                  <motion.button
                    type="button"
                    whileHover={{ y: -3 }}
                    onClick={() => setActive(n)}
                    className="relative w-full rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-black/40 p-3 text-left text-xs text-ronin-muted shadow-innerGlow"
                  >
                    <p className="font-semibold text-ronin-cream">{n.title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-ronin-gold">{n.difficulty}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-ronin-crimson to-ronin-gold"
                        style={{ width: `${n.completion}%` }}
                      />
                    </div>
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <TutorialModal open={Boolean(active)} onClose={() => setActive(null)} node={active} />
    </div>
  )
}
