import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Code2, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import IDEQuestionPanel from '../features/training/IDEQuestionPanel.jsx'
import IDEEditorPanel, { PYTHON_DEFAULT }   from '../features/training/IDEEditorPanel.jsx'
import IDEConsolePanel  from '../features/training/IDEConsolePanel.jsx'
import IDEGeminiPanel   from '../features/training/IDEGeminiPanel.jsx'
import IDEBottomBar     from '../features/training/IDEBottomBar.jsx'
import { runPythonCode } from '../executors/pythonExecutor.js'
import { getQuestion } from '../services/questionLoader.js'

const LANG_META = {
  python:     { label: 'Python',     icon: '🐍', accent: '#3B82F6' },
  cpp:        { label: 'C++',        icon: '⚙️',  accent: '#F33232' },
  javascript: { label: 'JavaScript', icon: '⚡',  accent: '#C8A423' },
}

export default function IDETrainingPage() {
  const { language: langSlug } = useParams()
  const navigate = useNavigate()

  const meta = LANG_META[langSlug?.toLowerCase()] ?? LANG_META.python

  const [hasRun, setHasRun]         = useState(false)
  const [isRunning, setIsRunning]   = useState(false)
  const [code, setCode]             = useState(PYTHON_DEFAULT)
  const [runResult, setRunResult]   = useState(null)

  const [questionData, setQuestionData] = useState(null)
  const [activeModal, setActiveModal]   = useState(null) // 'reasoning' | 'video' | null

  useEffect(() => {
    // Hardcoded to 'two_sum' for now until routing supports IDs
    const questionId = 'two_sum'
    getQuestion(meta.label.toLowerCase(), questionId)
      .then((data) => {
        setQuestionData(data)
        const savedCode = localStorage.getItem(`ronin_code_${questionId}`)
        if (savedCode) {
          setCode(savedCode)
        } else {
          setCode(data.starterCode)
        }
      })
      .catch(console.error)
  }, [meta.label])

  // Auto-save code to localStorage whenever it changes
  useEffect(() => {
    if (questionData?.id && code) {
      // Don't save if it's the raw default before question load
      if (code !== PYTHON_DEFAULT) {
        localStorage.setItem(`ronin_code_${questionData.id}`, code)
      }
    }
  }, [code, questionData?.id])

  const handleRun = async () => {
    if (meta.label !== 'Python') {
      // Placeholder: just flips visual state for layout testing
      setIsRunning(true)
      setTimeout(() => {
        setIsRunning(false)
        setHasRun(true)
      }, 1200)
      return;
    }

    setIsRunning(true);
    setRunResult(null);

    try {
      const result = await runPythonCode(code);
      setRunResult(result);
    } catch (err) {
      setRunResult({ stdout: '', errors: err.toString(), passed: false, results: [] });
    } finally {
      setIsRunning(false);
      setHasRun(true);
    }
  }

  const handleClearConsole = () => {
    setHasRun(false);
    setRunResult(null);
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

        {/* Right side: Counter & Quit */}
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-ronin-muted">
            Problem 1 / 20
          </span>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg border border-ronin-crimson/20 bg-ronin-crimson/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ronin-crimson transition-all hover:bg-ronin-crimson/20 hover:text-red-400"
          >
            <X className="h-3.5 w-3.5" />
            Quit
          </Link>
        </div>
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
              <IDEQuestionPanel 
                language={meta.label} 
                onOpenReasoning={() => setActiveModal('reasoning')}
                onOpenVideo={() => setActiveModal('video')}
              />
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
              <IDEEditorPanel language={meta.label} code={code} onChange={setCode} />
            </motion.div>

            {/* Right-bottom: Console Output */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="min-h-0 overflow-hidden"
              style={{ flex: '2', flexBasis: '38%' }}
            >
              <IDEConsolePanel hasRun={hasRun} runResult={runResult} isRunning={isRunning} onClear={handleClearConsole} />
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

      {/* ── Fullscreen Modal ── */}
      <AnimatePresence>
        {activeModal && questionData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 flex h-[70vh] w-[70vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c10] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/40 px-6 py-4">
                <h3 className="font-display text-lg font-bold text-ronin-cream">
                  {activeModal === 'video' ? 'Video Explanation' : 'Agent Reasoning'}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {activeModal === 'video' && (
                  <div className="relative mb-8 flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <p className="z-10 text-sm font-semibold text-ronin-gold/60">Video Player Placeholder</p>
                    <p className="absolute bottom-4 left-4 z-10 text-xs text-white/30">{questionData.metadata.video.firebaseStoragePath}</p>
                  </div>
                )}
                
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="mb-4 text-2xl font-bold text-ronin-cream" {...props} />,
                    h2: ({node, ...props}) => <h2 className="mb-3 mt-6 text-xl font-bold text-ronin-cream" {...props} />,
                    h3: ({node, ...props}) => <h3 className="mb-2 mt-4 text-lg font-bold text-ronin-cream" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-[13px] leading-relaxed text-ronin-muted" {...props} />,
                    ul: ({node, ...props}) => <ul className="mb-4 list-inside list-disc space-y-1 text-[13px] text-ronin-muted" {...props} />,
                    li: ({node, ...props}) => <li className="pl-2" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-ronin-cream" {...props} /> 
                             : <pre className="mb-4 overflow-x-auto rounded-xl border border-white/10 bg-[#09090c] p-4 font-mono text-[12px] text-ronin-cream shadow-inner"><code {...props} /></pre>
                  }}
                >
                  {questionData.reasoningMarkdown}
                </ReactMarkdown>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
