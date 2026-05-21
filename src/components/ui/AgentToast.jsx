import { motion, AnimatePresence } from 'framer-motion'
import { Zap, TrendingUp, Brain, Target, Award } from 'lucide-react'

const icons = {
  xp: TrendingUp,
  streak: Zap,
  difficulty: Target,
  evaluation: Brain,
  default: Award,
}

const colors = {
  xp: 'from-emerald-500/90 to-emerald-600/90 border-emerald-400/50',
  streak: 'from-amber-500/90 to-orange-500/90 border-amber-400/50',
  difficulty: 'from-purple-500/90 to-indigo-500/90 border-purple-400/50',
  evaluation: 'from-blue-500/90 to-cyan-500/90 border-blue-400/50',
  default: 'from-zinc-700/90 to-zinc-800/90 border-zinc-500/50',
}

function ToastItem({ toast, onDismiss }) {
  const Icon = icons[toast.type] || icons.default
  const colorClass = colors[toast.type] || colors.default

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`flex items-center gap-3 rounded-xl border bg-gradient-to-r px-4 py-3 shadow-lg backdrop-blur-sm ${colorClass}`}
      onClick={onDismiss}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="text-sm font-medium text-white">{toast.message}</p>
    </motion.div>
  )
}

export default function AgentToast({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={() => onDismiss(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
