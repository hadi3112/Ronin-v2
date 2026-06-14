import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import GameCanvas from '../components/GameCanvas.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import { useAuth } from '../hooks/useAuth.js'

const IS_ANDROID = /Mobi|Android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '')

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
  
  const [selectedTrack, setSelectedTrack] = useState('foundations')
  const [learningStyle, setLearningStyle] = useState('Balanced')
  const [selectedModes, setSelectedModes] = useState(() => new Set(['Video based learning']))
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(null)

  useEffect(() => {
    const check = () => {
      const mobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      const smallLandscape = window.innerWidth < 1024 && window.innerHeight < 500
      setIsMobileLandscape(smallLandscape || (mobileUA && window.innerWidth > window.innerHeight))
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const canContinue = useMemo(
    () => Boolean(learningStyle) && selectedModes.size > 0 && Boolean(selectedTrack),
    [learningStyle, selectedModes, selectedTrack],
  )

  function toggleSetItem(setter, label) {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  function handleContinue(forcedTrack = null) {
    const trackToSave = forcedTrack || selectedTrack
    if (!trackToSave || (!forcedTrack && !canContinue)) return
    
    savePreferences({
      assignedTrack: trackToSave,
      skill: 'Beginner',
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
        <div className={`grid gap-8 ${isMobileLandscape ? 'grid-cols-[1.2fr_0.8fr]' : 'lg:grid-cols-[1.2fr_0.8fr]'}`}>
          <section>
            <h1 className={`max-w-md font-bold leading-tight text-ronin-cream ${IS_ANDROID ? 'text-xl md:text-5xl' : 'text-4xl md:text-5xl'}`}>
              Let&apos;s personalize your preferences
            </h1>
            <p className="mt-3 max-w-xl text-base text-ronin-muted">
              Select tech stacks and learning styles to shape your home page and challenge path.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-ronin-muted">Learning Path Track</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Foundations Card */}
                  <div 
                    onClick={() => setSelectedTrack('foundations')}
                    className={`relative cursor-pointer border-2 rounded-2xl p-4 transition-all ${selectedTrack === 'foundations' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold ${selectedTrack === 'foundations' ? 'text-emerald-400' : 'text-ronin-cream'}`}>Foundations</h4>
                      {selectedTrack === 'foundations' && <Check className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-ronin-cream/80 mt-1">Start from zero. Build real things.</p>
                    <span className="inline-block mt-3 px-2 py-0.5 text-[10px] font-medium bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      Recommended
                    </span>
                    <span className="block text-[10px] text-ronin-muted/80 mt-1.5 italic">
                      For beginners who are completely new to coding
                    </span>
                  </div>

                  {/* Builder Card */}
                  <div 
                    onClick={() => setShowAdvancedDialog('builder')}
                    className={`relative cursor-pointer border-2 rounded-2xl p-4 transition-all flex flex-col justify-between ${selectedTrack === 'builder' ? 'border-sky-500 bg-sky-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold ${selectedTrack === 'builder' ? 'text-sky-400' : 'text-ronin-cream'}`}>Builder</h4>
                        {selectedTrack === 'builder' && <Check className="h-4 w-4 text-sky-400" />}
                      </div>
                      <p className="text-xs text-ronin-cream/80 mt-1">Intermediate logic & algorithms.</p>
                      <span className="block text-[10px] text-ronin-muted/80 mt-1.5 italic">
                        For those with some coding experience looking to build full-stack logic.
                      </span>
                    </div>
                  </div>

                  {/* Accelerator Card */}
                  <div 
                    onClick={() => setShowAdvancedDialog('accelerator')}
                    className={`relative cursor-pointer border-2 rounded-2xl p-4 transition-all flex flex-col justify-between ${selectedTrack === 'accelerator' ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold ${selectedTrack === 'accelerator' ? 'text-amber-400' : 'text-ronin-cream'}`}>Accelerator</h4>
                        {selectedTrack === 'accelerator' && <Check className="h-4 w-4 text-amber-400" />}
                      </div>
                      <p className="text-xs text-ronin-cream/80 mt-1">Advanced systems & architecture.</p>
                      <span className="block text-[10px] text-ronin-muted/80 mt-1.5 italic">
                        For seasoned developers ready to master complex performance optimization.
                      </span>
                    </div>
                  </div>
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

          <div className="flex min-h-0 flex-col gap-4">
            <GameCanvas
              variant="preferences"
              heightOverride={IS_ANDROID ? 144 : undefined}
              className={`relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-black/20 p-6 shadow-none ${IS_ANDROID ? 'min-h-[144px]' : isMobileLandscape ? 'min-h-[200px]' : 'min-h-[300px]'}`}
            />
            <p className="text-center text-sm text-ronin-muted">Build your dojo path: code, challenge, master.</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-1.5 w-28 rounded-full bg-white/20">
            <div className="h-full w-1/2 rounded-full bg-black" />
          </div>
          <NeonButton type="button" variant="coral" disabled={!canContinue} onClick={() => handleContinue()} className="min-w-44 rounded-2xl py-3 text-lg">
            Done
            <ArrowRight className="h-4 w-4" />
          </NeonButton>
        </div>
      </div>

      {/* Advanced Track Modal */}
      <AnimatePresence>
        {showAdvancedDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0A0508] p-8 shadow-[0_0_50px_rgba(232,37,58,0.15)]"
            >
              <div className="text-center">
                <h3 className="text-2xl font-display font-bold uppercase tracking-widest text-ronin-cream">
                  {showAdvancedDialog === 'builder' ? 'Builder Track' : 'Accelerator Track'}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ronin-muted">
                  You've selected an advanced track! We love the ambition. To ensure you skip ahead to the exact right level, you'll need to blast through our rapid diagnostic test first.
                </p>
                <p className="mt-2 text-sm font-semibold text-ronin-cream/90">
                  Ready to show us what you've got?
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <NeonButton 
                    type="button" 
                    onClick={() => {
                      setSelectedTrack(showAdvancedDialog)
                      handleContinue(showAdvancedDialog)
                    }}
                    className="w-full py-3.5 text-sm tracking-wide"
                  >
                    Take Diagnostic Now
                  </NeonButton>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedDialog(null)}
                    className="w-full rounded-xl py-3 text-sm font-medium text-ronin-muted transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
