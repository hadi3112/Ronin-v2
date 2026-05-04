import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ExplorePanel from './explore/ExplorePanel.jsx'
import LevelsCircuitPanel from './levels/LevelsCircuitPanel.jsx'
import TutorialsHighwayPanel from './tutorials/TutorialsHighwayPanel.jsx'

const tabs = [
  { id: 'explore', label: 'Explore' },
  { id: 'levels', label: 'Levels' },
  { id: 'tutorials', label: 'Tutorials' },
]

export default function DashboardTabs() {
  const [tab, setTab] = useState('explore')

  return (
    <section className="mt-10 space-y-6">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                'relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                active ? 'text-ronin-cream' : 'text-ronin-muted hover:text-ronin-cream',
              ].join(' ')}
            >
              {active && (
                <motion.span
                  layoutId="dashTab"
                  className="absolute inset-0 -z-10 rounded-lg bg-white/5 ring-1 ring-ronin-crimson/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {t.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {tab === 'explore' && <ExplorePanel />}
          {tab === 'levels' && <LevelsCircuitPanel />}
          {tab === 'tutorials' && <TutorialsHighwayPanel />}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
