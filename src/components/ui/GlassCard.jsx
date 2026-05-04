import { motion } from 'framer-motion'

export default function GlassCard({ className = '', children, ...motionProps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04]',
        'shadow-ronin backdrop-blur-xl',
        'before:pointer-events-none before:absolute before:inset-0 before:bg-glass-shine before:opacity-40',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}
