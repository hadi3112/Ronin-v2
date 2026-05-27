import { motion } from 'framer-motion'
import TrainingCard from './TrainingCard.jsx'

const TRAINING_LANGUAGES = [
  {
    id: 'python',
    language: 'Python',
    icon: '🐍',
    accent: '#3B82F6',
    description: 'Master data structures, algorithms, and scripting patterns with Python. Great for beginners and pros alike.',
    delay: 0,
  },
  {
    id: 'cpp',
    language: 'C++',
    icon: '⚙️',
    accent: '#F33232',
    description: 'Build blazing-fast systems, memory management mastery, and low-level algorithmic thinking with C++.',
    delay: 0.06,
  },
  {
    id: 'javascript',
    language: 'JavaScript',
    icon: '⚡',
    accent: '#C8A423',
    description: 'From closures to async flows — sharpen your JS intuition with real-world coding challenges.',
    delay: 0.12,
  },
]

export default function TrainingGroundsPanel() {
  return (
    <div className="relative mx-auto max-w-3xl space-y-6 pb-16">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-2"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-ronin-coral">
          Training Grounds
        </p>
        <h2 className="font-display text-2xl font-bold text-ronin-cream md:text-3xl">
          Choose Your Weapon
        </h2>
        <p className="max-w-lg text-sm text-ronin-muted">
          Select a language to enter the training grounds. Master the fundamentals,
          then face the boss.
        </p>
      </motion.div>

      {/* Decorative divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ronin-crimson/40 to-transparent" />
        <span className="text-[10px] uppercase tracking-widest text-ronin-muted">
          Select Language
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ronin-crimson/40 to-transparent" />
      </div>

      {/* Training cards */}
      <div className="space-y-3">
        {TRAINING_LANGUAGES.map((lang) => (
          <TrainingCard key={lang.id} {...lang} />
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center text-[11px] text-ronin-muted"
      >
        More languages dropping soon. Stay sharp, ronin.
      </motion.p>
    </div>
  )
}
