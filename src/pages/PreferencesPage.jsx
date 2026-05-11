import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Search } from 'lucide-react'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import GameCanvas from '../components/GameCanvas.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import { useAuth } from '../hooks/useAuth.js'

const interests = ['HTML', 'Machine Learning', 'JavaScript', 'C++', 'CSS', 'Rust', 'Python 3.0', 'Java', 'Solidity']
const skills = ['Beginner', 'Intermediate', 'Advanced']
const styles = ['Tutorial heavy', 'Challenge heavy', 'Balanced']
const contentModes = ['Video based learning', 'Code samples + puzzles', 'Flashcards']

function Chip({ active, children, onClick, color = 'red' }) {
  const palette = {
    red: active ? 'bg-ronin-crimson/80 border-ronin-coral text-white' : 'bg-white/10 border-white/10 text-ronin-cream',
    warm: active ? 'bg-amber-500/70 border-amber-300 text-black' : 'bg-amber-500/20 border-amber-300/40 text-amber-100',
    blue: active ? 'bg-sky-500/80 border-sky-200 text-black' : 'bg-sky-500/20 border-sky-300/35 text-sky-100',
    green: active ? 'bg-emerald-500/80 border-emerald-200 text-black' : 'bg-emerald-500/20 border-emerald-300/35 text-emerald-100',
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={['rounded-xl border px-3 py-2 text-xs font-semibold transition-colors md:text-sm', palette[color]].join(' ')}
    >
      {children}
    </motion.button>
  )
}

export default function PreferencesPage() {
  const navigate = useNavigate()
  const { savePreferences } = useAuth()
  const [selected, setSelected] = useState(() => new Set(['JavaScript', 'C++']))
  const [skill, setSkill] = useState('Intermediate')
  const [learningStyle, setLearningStyle] = useState('Balanced')
  const [selectedModes, setSelectedModes] = useState(() => new Set(['Video based learning']))
  const [search, setSearch] = useState('')

  const canContinue = useMemo(
    () => selected.size > 0 && Boolean(skill) && Boolean(learningStyle) && selectedModes.size > 0,
    [selected, skill, learningStyle, selectedModes],
  )

  const filteredInterests = interests.filter((item) => item.toLowerCase().includes(search.toLowerCase()))

  function toggleSetItem(setter, label) {
    setter((prev) => {
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
      contentModes: [...selectedModes],
    })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 md:px-10">
      <AmbientGrid />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_85%,rgba(243,50,50,0.14),transparent_40%),radial-gradient(circle_at_85%_22%,rgba(243,139,31,0.08),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-ronin backdrop-blur-xl md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <h1 className="max-w-md text-4xl font-bold leading-tight text-ronin-cream md:text-5xl">
              Let&apos;s personalize your preferences
            </h1>
            <p className="mt-3 max-w-xl text-base text-ronin-muted">
              Select tech stacks and learning styles to shape your home page and challenge path.
            </p>

            <label className="relative mt-6 block max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ronin-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-2xl border border-white/10 bg-white/90 py-3 pl-10 pr-4 text-sm text-black outline-none ring-2 ring-transparent transition focus:ring-ronin-coral/45"
              />
            </label>

            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-ronin-muted">Suggested</p>
                <div className="flex flex-wrap gap-2">
                  {filteredInterests.map((label, i) => {
                    const colors = ['green', 'warm', 'blue', 'warm', 'blue', 'red', 'warm', 'red', 'blue']
                    return (
                      <Chip key={label} active={selected.has(label)} onClick={() => toggleSetItem(setSelected, label)} color={colors[i % colors.length]}>
                        {selected.has(label) && <Check className="mr-1 inline h-3.5 w-3.5" />}
                        {label}
                      </Chip>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-ronin-muted">Skill level</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((item) => (
                    <Chip key={item} active={skill === item} onClick={() => setSkill(item)}>
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-ronin-muted">Learning style</p>
                <div className="flex flex-wrap gap-2">
                  {styles.map((item) => (
                    <Chip key={item} active={learningStyle === item} onClick={() => setLearningStyle(item)}>
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-ronin-muted">Content focus</p>
                <div className="flex flex-wrap gap-2">
                  {contentModes.map((item) => (
                    <Chip key={item} active={selectedModes.has(item)} onClick={() => toggleSetItem(setSelectedModes, item)}>
                      {selectedModes.has(item) && <Check className="mr-1 inline h-3.5 w-3.5" />}
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-black/20 p-6">
            <GameCanvas variant="preferences" />
            <p className="mt-4 text-center text-sm text-ronin-muted">Build your dojo path: code, challenge, master.</p>
          </section>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-1.5 w-28 rounded-full bg-white/20">
            <div className="h-full w-1/2 rounded-full bg-black" />
          </div>
          <NeonButton type="button" variant="coral" disabled={!canContinue} onClick={handleContinue} className="min-w-44 rounded-2xl py-3 text-lg">
            Done
            <ArrowRight className="h-4 w-4" />
          </NeonButton>
        </div>
      </div>
    </div>
  )
}
