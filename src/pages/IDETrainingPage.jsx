import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Code2 } from 'lucide-react'
import IDEQuestionPanel from '../features/training/IDEQuestionPanel.jsx'
import IDEEditorPanel   from '../features/training/IDEEditorPanel.jsx'
import IDEConsolePanel  from '../features/training/IDEConsolePanel.jsx'
import IDEGeminiPanel   from '../features/training/IDEGeminiPanel.jsx'
import IDEBottomBar     from '../features/training/IDEBottomBar.jsx'

const LANG_META = {
  python:     { label: 'Python',     icon: '🐍', accent: '#3B82F6' },
  cpp:        { label: 'C++',        icon: '⚙️',  accent: '#F33232' },
  javascript: { label: 'JavaScript', icon: '⚡',  accent: '#C8A423' },
}

export default function IDETrainingPage() {
  const { language: langSlug } = useParams()
  const navigate = useNavigate()

  const meta = LANG_META[langSlug?.toLowerCase()] ?? LANG_META.python

  // UI-only state — no logic, no API calls yet
  const [hasRun, setHasRun]         = useState(false)
  const [isRunning, setIsRunning]   = useState(false)

  const handleRun = () => {
    // Placeholder: just flips visual state for layout testing
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setHasRun(true)
    }, 1200)
  }

  const handleSubmit = () => {
    // Placeholder — no logic yet
  }

  return (
    /*
     * Fill the remaining viewport height below the TopNav (~64px).
     * We use `calc(100vh - 64px)` so the IDE chrome never overflows;
     * all scroll happens inside individual panels.
     */
    <div
      className="flex flex-col"
      style={{ height: 'calc(100vh - 64px)', minHeight: 0 }}
    >
      {/* ── Top breadcrumb bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex shrink-0 items-center justify-between gap-3 px-1 pb-3 pt-1"
      >
        {/* Back link */}
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-ronin-muted transition-colors hover:bg-white/5 hover:text-ronin-cream"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>

        {/* Current context */}
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-ronin-muted" />
          <span className="text-[11px] uppercase tracking-widest text-ronin-muted">
            Training Grounds
          </span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] font-semibold" style={{ color: meta.accent }}>
            {meta.icon} {meta.label}
          </span>
        </div>

        {/* Problem counter pill */}
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-ronin-muted">
          Problem 1 / 20
        </span>
      </motion.div>

      {/* ── Main IDE grid ── */}
      {/*
       * Layout strategy (web only):
       *
       *  ┌─────────────────┬─────────────────────────────────┐
       *  │ Question        │ Code Editor                     │
       *  │ (left-top)      │ (right-top)                     │
       *  ├─────────────────┼─────────────────────────────────┤
       *  │ Gemini Response │ Console Output                  │
       *  │ (left-bottom)   │ (right-bottom)                  │
       *  └─────────────────┴─────────────────────────────────┘
       *  └──────────────────────────────────────────────────┘
       *                   Bottom Bar
       *
       * On screens < lg, the panels stack vertically.
       */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full flex-col lg:flex-row lg:gap-3">

          {/* ═══ LEFT COLUMN ═══ */}
          <div className="flex flex-col gap-3 lg:w-[38%] lg:min-w-[320px] lg:max-w-[480px]">

            {/* Left-top: Question Area */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-0 flex-[3] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-black/50 p-5 shadow-ronin"
              style={{ flexBasis: '60%' }}
            >
              <IDEQuestionPanel language={meta.label} />
            </motion.div>

            {/* Left-bottom: Gemini Response */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="min-h-0 overflow-hidden"
              style={{ flexBasis: '40%', flex: '2' }}
            >
              <IDEGeminiPanel hasRun={hasRun} />
            </motion.div>
          </div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="flex min-h-0 flex-1 flex-col gap-3">

            {/* Right-top: Code Editor */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              className="min-h-0 overflow-hidden"
              style={{ flex: '3', flexBasis: '62%' }}
            >
              <IDEEditorPanel language={meta.label} />
            </motion.div>

            {/* Right-bottom: Console Output */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="min-h-0 overflow-hidden"
              style={{ flex: '2', flexBasis: '38%' }}
            >
              <IDEConsolePanel hasRun={hasRun} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="shrink-0"
      >
        <IDEBottomBar
          onRun={handleRun}
          onSubmit={handleSubmit}
          isRunning={isRunning}
        />
      </motion.div>
    </div>
  )
}
