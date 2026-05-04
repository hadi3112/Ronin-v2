import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import TextField from '../components/ui/TextField.jsx'
import RoninMark from '../components/branding/RoninMark.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, gettingStartedDone, preferences, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!user) return
    if (preferences) navigate('/dashboard', { replace: true })
    else if (gettingStartedDone) navigate('/preferences', { replace: true })
    else navigate('/getting-started', { replace: true })
  }, [user, gettingStartedDone, preferences, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    await login(email, password)
    navigate('/getting-started', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <AmbientGrid />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(243,110,110,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(243,50,50,0.12),transparent_35%)]" />

      <GlassCard className="relative z-10 w-full max-w-md px-8 py-10 shadow-ronin-red/30">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <RoninMark size="lg" />
          <p className="text-sm text-ronin-muted">Sign in to sync XP, streaks, and ranked challenges.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="hadi@ronin.dev"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />

          <NeonButton type="submit" className="w-full py-3 text-base">
            Enter the Dojo
          </NeonButton>
        </form>

        <motion.p
          className="mt-6 text-center text-[11px] uppercase tracking-[0.25em] text-ronin-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Powered by Firebase
        </motion.p>
        <p className="mt-2 text-center text-[10px] text-ronin-muted/70">
          {/* Wire Firebase Auth here: replace stub in services/firebaseAuth.js */}
          Demo mode: any credentials continue to onboarding.
        </p>
      </GlassCard>
    </div>
  )
}
