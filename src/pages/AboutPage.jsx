import { motion } from 'framer-motion'
import GlassCard from '../components/ui/GlassCard.jsx'

export default function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-6">
      <GlassCard className="p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-ronin-gold">About .Ronin</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ronin-cream">Neon discipline. Compiler soul.</h1>
        <p className="mt-4 text-sm leading-relaxed text-ronin-muted">
          .Ronin is a gamified coding platform blending Netflix-grade discovery, Duolingo loops, and ranked raids for
          Gen Z builders. Progress is measured in XP, streaks, and cinematic milestones — always dark-mode first, always
          production sharp.
        </p>
      </GlassCard>
    </motion.div>
  )
}
