import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingContainer from '../../../features/training/LoadingContainer.jsx'

/**
 * TrainingCard — selectable language training card.
 *
 * Flow:
 *   Click card  → expand
 *   Click "Start Training" → show fullscreen LoadingContainer
 *   LoadingContainer onComplete → navigate to /dashboard/training/:id
 */
export default function TrainingCard({ id, language, icon, description, accent, delay = 0 }) {
  const [expanded, setExpanded]     = useState(false)
  const [hoverBtn, setHoverBtn]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const navigate = useNavigate()

  const handleStartTraining = () => {
    setLoading(true)
  }

  const handleLoadComplete = () => {
    navigate(`/dashboard/training/${id}`)
  }

  return (
    <>
      {/* Fullscreen loading overlay — rendered outside card DOM flow via fixed positioning */}
      {loading && (
        <LoadingContainer
          language={language}
          onComplete={handleLoadComplete}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/50 shadow-ronin"
      >
        {/* Ambient accent glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{
            opacity: expanded ? 1 : 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}18, transparent 70%)`,
          }}
        />

        {/* ── Card Header / Trigger ── */}
        <motion.button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="group relative flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
        >
          {/* Language icon badge */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl"
            style={{
              borderColor: `${accent}40`,
              background: `${accent}18`,
            }}
          >
            {icon}
          </div>

          <div className="flex-1">
            <h3 className="font-display text-base font-semibold text-ronin-cream md:text-lg">
              {language} Training
            </h3>
            <p className="mt-0.5 text-[12px] text-ronin-muted">{description}</p>
          </div>

          {/* Expand chevron */}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0 text-ronin-muted"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4.5 6.75L9 11.25L13.5 6.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.button>

        {/* ── Expanded content ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.06] px-6 pb-6 pt-4">

                {/* IDE Preview placeholder */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10]">
                  {/* Editor toolbar */}
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-[10px] uppercase tracking-widest text-ronin-muted">
                      {language.toLowerCase()}_training.{language === 'Python' ? 'py' : language === 'C++' ? 'cpp' : 'js'}
                    </span>
                  </div>

                  {/* Code lines skeleton */}
                  <div className="space-y-2 p-4">
                    {[
                      { w: 'w-1/3', color: 'bg-blue-400/40' },
                      { w: 'w-1/2', color: 'bg-purple-400/30' },
                      { w: 'w-2/5', color: 'bg-ronin-coral/30' },
                      { w: 'w-1/4', color: 'bg-white/15' },
                      { w: 'w-3/5', color: 'bg-ronin-gold/25' },
                      { w: 'w-1/3', color: 'bg-green-400/30' },
                    ].map((line, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-5 text-right text-[10px] text-white/15">{i + 1}</span>
                        <div
                          className={`h-2 rounded-full ${line.w} ${line.color}`}
                          style={{ marginLeft: i >= 1 && i <= 4 ? `${Math.min(i, 2) * 16}px` : 0 }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Overlay label */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <div className="rounded-xl border border-white/10 bg-black/70 px-5 py-3 text-center">
                      <p className="font-display text-sm font-semibold" style={{ color: accent }}>
                        IDE Preview
                      </p>
                      <p className="mt-1 text-[11px] text-ronin-muted">
                        Click "Start Training" to launch
                      </p>
                    </div>
                  </div>
                </div>

                {/* Start Training CTA */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onMouseEnter={() => setHoverBtn(true)}
                    onMouseLeave={() => setHoverBtn(false)}
                    onClick={handleStartTraining}
                    className="relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200"
                    style={{
                      background: hoverBtn ? 'rgba(100, 100, 110, 0.35)' : accent,
                      color: hoverBtn ? '#BFBFBF' : '#050505',
                      border: `1px solid ${hoverBtn ? 'rgba(255,255,255,0.1)' : accent}`,
                      boxShadow: hoverBtn ? 'none' : `0 0 18px ${accent}55`,
                      transform: hoverBtn ? 'translateY(1px)' : 'translateY(-1px)',
                    }}
                  >
                    Start Training
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
