import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { useId } from 'react'
import NeonButton from '../../components/ui/NeonButton.jsx'
import { mockProfile } from '../../data/mockUser.js'
import { useAuth } from '../../hooks/useAuth.js'
import appicon from '../../assets/appicon.png'
import mascot from '../../assets/mascot.png'

function Ring({ pct }) {
  const gid = useId().replace(/:/g, '')
  const gradId = `ringGrad-${gid}`
  const r = 52
  const c = 2 * Math.PI * r
  const target = c - (pct / 100) * c

  return (
    <div className="relative h-28 w-28 shrink-0 md:h-32 md:w-32">
      <svg className="-rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="120" y2="120">
            <stop stopColor="#C8A423" />
            <stop offset="1" stopColor="#F33232" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          stroke={`url(#${gradId})`}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: target }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-ronin-cream">
        {pct}%
      </div>
    </div>
  )
}

export default function HeroSection() {
  const { user } = useAuth()
  const name = user?.displayName ?? mockProfile.displayName
  const { xpCurrent, xpGoal, trackTitle, trackPoints, latestCourse } = mockProfile
  const xpPct = Math.min(100, Math.round((xpCurrent / xpGoal) * 100))

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/50 p-6 shadow-ronin"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ronin-crimson/20 blur-3xl" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ronin-muted">Greeting</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ronin-cream md:text-3xl">Hi, {name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-[10px] uppercase tracking-widest text-ronin-muted sm:block">
              Ronin XP
            </div>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-ronin-gold/40 bg-black/40 shadow-ronin-gold">
              <img src={appicon} alt="Ronin profile" className="h-8 w-8 object-contain" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-ronin-muted">
            <span>
              {xpCurrent.toLocaleString()} / {xpGoal.toLocaleString()} Ronin XP
            </span>
            <span className="text-ronin-gold">{xpPct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ronin-crimson via-ronin-orange to-ronin-gold"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
          <div className="min-w-[180px] rounded-xl border border-white/10 bg-black/35 p-4 shadow-innerGlow">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ronin-muted">Current track</p>
            <p className="mt-2 font-display text-lg font-semibold text-ronin-cream">{trackTitle}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-ronin-crimson/35 bg-ronin-crimson/10 px-4 py-3 text-sm font-semibold text-ronin-cream shadow-ronin-red">
            <Sparkles className="h-4 w-4 text-ronin-gold" />
            {trackPoints.toLocaleString()} pts
          </div>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ronin-nav-to/40 to-black/60 p-6 shadow-ronin"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(243,110,110,0.18),transparent_45%)]" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ronin-muted">Latest course</p>
              <h3 className="mt-1 font-display text-xl font-bold text-ronin-cream md:text-2xl">{latestCourse.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Ring pct={latestCourse.completionPct} />
              <ul className="grid flex-1 gap-2 text-sm text-ronin-muted">
                <li className="flex justify-between rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/5">
                  <span>Tutorials watched</span>
                  <span className="font-semibold text-ronin-cream">{latestCourse.tutorialsWatched}</span>
                </li>
                <li className="flex justify-between rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/5">
                  <span>Levels completed</span>
                  <span className="font-semibold text-ronin-cream">{latestCourse.levelsCompleted}</span>
                </li>
                <li className="flex justify-between rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/5">
                  <span>Challenges won</span>
                  <span className="font-semibold text-ronin-cream">{latestCourse.challengesWon}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <NeonButton type="button" className="px-6">
                Continue
              </NeonButton>
            </div>
          </div>

          <div className="relative flex min-h-[160px] flex-1 items-stretch justify-end md:max-w-[44%]">
            <motion.div
              className="relative mt-4 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 md:mt-0"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-ronin-crimson/30 via-transparent to-ronin-orange/25" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-30"
                animate={{ x: ['-30%', '30%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative flex h-full min-h-[160px] flex-col justify-end p-4">
                <p className="text-xs text-ronin-muted line-clamp-3">{latestCourse.summary}</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-ronin-gold">
                  Cinematic preview
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/55 text-ronin-cream shadow-ronin-red backdrop-blur">
                  <Play className="ml-0.5 h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <img
              src={mascot}
              alt="Ronin mascot"
              className="pointer-events-none absolute -bottom-6 -right-2 z-10 h-40 w-28 object-contain md:-right-6 md:h-48 md:w-32"
            />
          </div>
        </div>
      </motion.article>
    </section>
  )
}
