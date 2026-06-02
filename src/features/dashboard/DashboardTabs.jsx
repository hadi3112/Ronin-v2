import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ExplorePanel from './explore/ExplorePanel.jsx'
import LevelsCircuitPanel from './levels/LevelsCircuitPanel.jsx'
import TrainingGroundsPanel from './training/TrainingGroundsPanel.jsx'

const tabs = [
  { id: 'explore', label: 'Explore' },
  { id: 'levels', label: 'Levels' },
  { id: 'training', label: 'Training Grounds' },
]

export default function DashboardTabs({ activeTab, onTabChange, onTrainingGroundsClick, trainingTabRef }) {
  const [tab, setTab] = useState(activeTab || 'explore')

  useEffect(() => {
    if (activeTab && activeTab !== tab) {
      setTab(activeTab)
    }
  }, [activeTab])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    if (onTabChange) onTabChange(newTab)
    if (newTab === 'training' && onTrainingGroundsClick) onTrainingGroundsClick()
  }

  return (
    <section className="mt-10 space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-8 border-b border-white/10 pb-4">
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              ref={t.id === 'training' ? trainingTabRef : undefined}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={[
                'relative rounded-lg px-5 py-2 text-sm font-semibold transition-colors',
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
          {tab === 'training' && <TrainingGroundsPanel />}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
