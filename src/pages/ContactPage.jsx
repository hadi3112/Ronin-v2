import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'

export default function ContactPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl">
      <GlassCard className="p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-ronin-coral">Contact</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-ronin-cream">Signal the guild</h1>
        <p className="mt-3 text-sm text-ronin-muted">
          Wire this form to Firebase, Resend, or your API route. For now it is a static shell.
        </p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-ronin-muted">
            <Mail className="h-5 w-5 text-ronin-gold" />
            guild@ronin.dev
          </div>
          <NeonButton type="button" variant="ghost" className="w-full">
            Open support channel (soon)
          </NeonButton>
        </div>
      </GlassCard>
    </motion.div>
  )
}
