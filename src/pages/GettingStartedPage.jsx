import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu, Flame, Shield, Sparkles, Zap } from 'lucide-react'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import RoninMark from '../components/branding/RoninMark.jsx'
import { useAuth } from '../hooks/useAuth.js'

const steps = [
  {
    icon: Shield,
    title: 'Ranked paths',
    body: 'Choose tracks that feel like seasons — each with cinematic milestones and boss reviews.',
  },
  {
    icon: Cpu,
    title: 'Compiler-grade feedback',
    body: 'Instant lint, tests, and XP bursts tuned for speedruns and deep practice alike.',
  },
  {
    icon: Zap,
    title: 'Neon challenges',
    body: 'Timed raids, co-op relays, and async duels synced to your streak calendar.',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function GettingStartedPage() {
  const navigate = useNavigate()
  const { completeGettingStarted } = useAuth()

  function handleContinue() {
    completeGettingStarted()
    navigate('/preferences', { replace: true })
  }

  return (
    <div className="relative min-h-screen px-4 py-12 md:px-10">
      <AmbientGrid />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(200,164,35,0.12),transparent_45%)]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <RoninMark size="md" />
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-ronin-muted">
            <Sparkles className="h-4 w-4 text-ronin-gold" />
            Getting started · calibration sequence
          </div>
        </header>

        <GlassCard className="p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ronin-coral">Phase 01</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-ronin-cream md:text-4xl">
                Calibrate your Ronin link
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-ronin-muted">
                This is your onboarding airlock before preferences. We keep it cinematic, lightweight, and
                Duolingo-clear — then you choose your disciplines.
              </p>
            </div>
            <NeonButton variant="coral" className="shrink-0" type="button" onClick={handleContinue}>
              <Flame className="h-4 w-4" />
              Continue
            </NeonButton>
          </div>

          <motion.ul
            className="mt-10 grid gap-4 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {steps.map(({ icon: Icon, title, body }) => (
              <motion.li
                key={title}
                variants={item}
                className="rounded-2xl border border-white/10 bg-black/35 p-5 shadow-innerGlow"
              >
                <div className="mb-3 inline-flex rounded-xl border border-ronin-crimson/30 bg-ronin-crimson/10 p-2 text-ronin-coral">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-lg font-semibold text-ronin-cream">{title}</h2>
                <p className="mt-2 text-sm text-ronin-muted">{body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </GlassCard>
      </div>
    </div>
  )
}
