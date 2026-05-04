import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import RoninMark from '../components/branding/RoninMark.jsx'
import { useAuth } from '../hooks/useAuth.js'

const interests = [
  'Python',
  'C++',
  'Web Dev',
  'AI / ML',
  'Android',
  'Blockchain',
  'Game Dev',
  'Embedded Systems',
]

const skills = ['Beginner', 'Intermediate', 'Advanced']
const styles = ['Tutorial heavy', 'Challenge heavy', 'Balanced']

function Chip({ active, children, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={[
        'rounded-xl border px-3 py-2 text-xs font-medium transition-colors md:text-sm',
        active
          ? 'border-ronin-crimson/60 bg-ronin-crimson/20 text-ronin-cream shadow-ronin-red'
          : 'border-white/10 bg-black/30 text-ronin-muted hover:border-white/20',
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
}

export default function PreferencesPage() {
  const navigate = useNavigate()
  const { savePreferences } = useAuth()
  const [selected, setSelected] = useState(() => new Set(['Web Dev', 'Python']))
  const [skill, setSkill] = useState('Intermediate')
  const [learningStyle, setLearningStyle] = useState('Balanced')

  const canContinue = useMemo(() => selected.size > 0 && Boolean(skill) && Boolean(learningStyle), [
    selected,
    skill,
    learningStyle,
  ])

  function toggleInterest(label) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  function handleContinue() {
    if (!canContinue) return
    savePreferences({
      interests: [...selected],
      skill,
      learningStyle,
    })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="relative min-h-screen px-4 py-12 md:px-10">
      <AmbientGrid />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(243,50,50,0.12),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        <RoninMark size="md" />

        <GlassCard className="p-8 md:p-10">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ronin-gold">Phase 02</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-ronin-cream">Forge your curriculum</h1>
            <p className="mt-2 text-sm text-ronin-muted">
              Interests tune recommendations. Skill and learning style calibrate pacing and challenge density.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ronin-muted">Choose interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((label) => (
                <Chip key={label} active={selected.has(label)} onClick={() => toggleInterest(label)}>
                  {selected.has(label) && <Check className="mr-1 inline h-3.5 w-3.5" />}
                  {label}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ronin-muted">Select skill</h2>
            <div className="grid gap-2 md:grid-cols-3">
              {skills.map((s) => (
                <Chip key={s} active={skill === s} onClick={() => setSkill(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ronin-muted">Learning style</h2>
            <div className="grid gap-2 md:grid-cols-3">
              {styles.map((s) => (
                <Chip key={s} active={learningStyle === s} onClick={() => setLearningStyle(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </section>

          <div className="mt-10 flex justify-end">
            <NeonButton type="button" disabled={!canContinue} onClick={handleContinue}>
              Continue to dashboard
            </NeonButton>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
