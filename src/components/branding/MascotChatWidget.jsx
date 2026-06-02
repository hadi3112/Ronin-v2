import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import mascot from '../../assets/mascot.png'
import { useAuth } from '../../hooks/useAuth.js'

const STORAGE_KEY = 'ronin.session.v1'

function readPreferences() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data.preferences ?? null
  } catch {
    return null
  }
}

const STATIC_QA = [
  {
    id: 'nav',
    chip: 'Boss Trial path',
    q: 'How do I start the Boss Trial?',
    a: 'Open Explore or Levels, pick any course card, then tap Start Boss Trial. Every track currently routes into the same Python Boss Trial session.',
  },
  {
    id: 'score',
    chip: 'Scoring & HP',
    q: 'How does scoring work?',
    a: 'Each correct answer damages the boss; wrong answers or timeouts cost Ronin HP. After ten questions, whoever has more HP wins the exchange. You always earn XP on the results screen.',
  },
  {
    id: 'premium',
    chip: 'Premium perks',
    q: 'What do I get with Premium?',
    a: 'Premium is not wired in this build yet — placeholders only. Expect faster analytics, saved runs, and extra course packs when the backend lands.',
  },
  {
    id: 'prefs',
    chip: 'My preferences',
    q: 'What did I pick in preferences?',
    a: '',
  },
]

export default function MascotChatWidget() {
  const { onboardingPhase } = useAuth()
  const showBubble = onboardingPhase === 'training_grounds_pending'

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [
    { role: 'bot', text: 'Tap a quick question or type a note — I only know scripted answers for now.' },
  ])

  const prefs = useMemo(() => readPreferences(), [])

  const qa = useMemo(() => {
    const copy = STATIC_QA.map((row) => ({ ...row }))
    const p = prefs
    if (p) {
      const interests = (p.interests ?? []).join(', ') || 'not set'
      const modes = (p.contentModes ?? []).join(', ') || 'not set'
      const idx = copy.findIndex((c) => c.id === 'prefs')
      if (idx >= 0) {
        copy[idx].a = `From your last save: interests → ${interests}. Skill → ${p.skill ?? 'n/a'}. Style → ${p.learningStyle ?? 'n/a'}. Content → ${modes}. Live catalog: Python Boss Trial only; other cards are visual placeholders that still launch the same session.`
      }
    } else {
      const idx = copy.findIndex((c) => c.id === 'prefs')
      if (idx >= 0) copy[idx].a = 'No saved preferences in this browser session yet — finish onboarding to personalize hints.'
    }
    return copy
  }, [prefs])

  const pushBot = useCallback((text) => {
    setMessages((m) => [...m, { role: 'bot', text }])
  }, [])

  const quickAsk = useCallback(
    (row) => {
      setMessages((m) => [...m, { role: 'user', text: row.q }])
      window.setTimeout(() => pushBot(row.a), 180)
    },
    [pushBot],
  )

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="flex w-[min(100vw-2rem,360px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a0506]/95 shadow-ronin-red backdrop-blur-lg"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-ronin-cream">
                <MessageCircle className="h-4 w-4 text-ronin-gold" />
                Ronin guide
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-ronin-muted hover:bg-white/5 hover:text-ronin-cream"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto px-3 py-3 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={`${i}-${msg.text.slice(0, 12)}`}
                  className={[
                    'rounded-xl px-3 py-2 text-[13px] leading-snug',
                    msg.role === 'user' ? 'ml-6 bg-ronin-crimson/25 text-ronin-cream' : 'mr-4 bg-white/5 text-ronin-muted',
                  ].join(' ')}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 px-2 py-2">
              <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-ronin-muted">Quick asks</p>
              <div className="flex flex-wrap gap-1.5">
                {qa.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => quickAsk(row)}
                    className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-ronin-cream hover:border-ronin-coral/40"
                  >
                    {row.chip ?? row.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.5 }}
            className="relative mr-3 w-[320px] rounded-2xl border border-ronin-crimson/50 bg-[#0a0506] pl-4 pr-12 py-3 text-xs text-ronin-cream shadow-ronin-red"
            style={{
              position: 'absolute',
              right: '100%',
              bottom: '12px',
              whiteSpace: 'normal',
            }}
          >
            {/* Triangular arrow of bubble */}
            <div
              className="absolute h-3 w-3 rotate-45 border-r border-t border-ronin-crimson/50 bg-[#0a0506]"
              style={{
                right: '-6px',
                bottom: '14px',
              }}
            />
            <p className="font-semibold text-ronin-gold mb-1">Mascot Guide</p>
            <p className="leading-relaxed">
              Let&apos;s get to work! Click on the highlighted <span className="text-blue-400 font-semibold">Python: Basics and Data Structures</span> course card above to start your training.
            </p>
            <img src={mascot} alt="" className="absolute right-2.5 bottom-2 h-9 w-7 object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 rounded-full border border-ronin-crimson/40 bg-black/80 px-4 py-2 text-xs font-semibold text-ronin-cream shadow-ronin-red backdrop-blur"
      >
        <img src={mascot} alt="" className="h-9 w-7 object-contain" />
        {open ? 'Close' : 'Ask the mascot'}
      </motion.button>
    </div>
  )
}
