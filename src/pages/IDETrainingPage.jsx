import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Code2, X, Play, Send, Sparkles, CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import IDEQuestionPanel from '../features/training/IDEQuestionPanel.jsx'
import IDEEditorPanel, { PYTHON_DEFAULT } from '../features/training/IDEEditorPanel.jsx'
import IDEConsolePanel from '../features/training/IDEConsolePanel.jsx'
import IDEGeminiPanel from '../features/training/IDEGeminiPanel.jsx'
import IDEBottomBar from '../features/training/IDEBottomBar.jsx'
import PhaserBlocksPanel from '../features/training/PhaserBlocksPanel.jsx'
import { runPythonCode } from '../executors/pythonExecutor.js'
import { getQuestion } from '../services/questionLoader.js'
import { useAuth } from '../hooks/useAuth.js'
import LearnMoreDialog from '../features/training/LearnMoreDialog.jsx'
import {
  writeTrainingGroundsResult,
  computeAndSaveSkillVector,
} from '../services/trainingGroundsService.js'
import {
  PROBLEM_BLOCKS,
  getTestCodeForProblem,
  generateGeminiHint,
} from '../features/training/IDEBlocksRunner.js'

const LANG_META = {
  python: { label: 'Python', icon: '🐍', accent: '#3B82F6' },
}

const formatInput = (input) => {
  if (typeof input === 'object' && input !== null) {
    return Object.entries(input)
      .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
      .join(', ')
  }
  return String(input)
}

const SEQUENCE = ['two_sum', 'linked_list_reversal', 'dfs_traversal', 'circular_queue']

export default function IDETrainingPage() {
  const { language: langSlug } = useParams()
  const navigate = useNavigate()
  const { user, onboardingPhase, updateOnboardingPhase } = useAuth()
  const userId = user?.uid ?? 'guest'

  const meta = LANG_META[langSlug?.toLowerCase()] ?? LANG_META.python

  const [currentSeqIndex, setCurrentSeqIndex] = useState(0)
  const problemId = SEQUENCE[currentSeqIndex]

  const [questionData, setQuestionData] = useState(null)
  const [activeModal, setActiveModal] = useState(null) // 'reasoning' | 'video' | null

  // ── Mode selection ────────────────────────────────────────────────────────
  const [mode, setMode] = useState(null) // null | 'ide' | 'blocks'

  // ── Code / Blocks states ──────────────────────────────────────────────────
  const [code, setCode] = useState(PYTHON_DEFAULT)
  const [arrangedBlocks, setArrangedBlocks] = useState([])
  const [hasRun, setHasRun] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState(null)
  const [isPassed, setIsPassed] = useState(false)

  // ── Gemini Chat & Dialog Hint states ──────────────────────────────────────
  const [geminiMessages, setGeminiMessages] = useState([])
  const [geminiHintDialog, setGeminiHintDialog] = useState(null) // text or null for modal
  const [showVisualHint, setShowVisualHint] = useState(false)
  const [showIncorrectDialog, setShowIncorrectDialog] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  // ── Submission verification dialog states ──────────────────────────────────
  const [submissionActive, setSubmissionActive] = useState(false)
  const [submissionProgress, setSubmissionProgress] = useState(0)
  const [submissionCases, setSubmissionCases] = useState([])
  const [submissionIsFinished, setSubmissionIsFinished] = useState(false)
  const [submissionPassed, setSubmissionPassed] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const [detailedCaseIdx, setDetailedCaseIdx] = useState(null)

  // ── Onboarding / Progression modals ───────────────────────────────────────
  const [completionDialog, setCompletionDialog] = useState(false)
  const [solvedCount, setSolvedCount] = useState(0)

  // ── Performance telemetry refs/states ─────────────────────────────────────
  const startTimeRef = useRef(Date.now())
  const [runAttempts, setRunAttempts] = useState(0)
  const [hintsOpened, setHintsOpened] = useState(0)
  const [geminiHintsReceived, setGeminiHintsReceived] = useState(0)
  const [blockMovesMade, setBlockMovesMade] = useState(0)

  // Track if we have triggered the 90s idle tip for the current question
  const idleTipTriggeredRef = useRef(false)

  // Load problem details sequentially
  useEffect(() => {
    setQuestionData(null)
    setMode(null)
    setHasRun(false)
    setIsPassed(false)
    setRunResult(null)
    setGeminiMessages([])
    setGeminiHintDialog(null)
    setShowVisualHint(false)
    setShowIncorrectDialog(false)
    setSubmissionActive(false)
    setSubmissionProgress(0)
    setSubmissionCases([])
    setSubmissionIsFinished(false)
    setSubmissionPassed(false)
    setSubmissionMessage('')
    setShowSkipConfirm(false)
    setDetailedCaseIdx(null)
    setRunAttempts(0)
    setHintsOpened(0)
    setGeminiHintsReceived(0)
    setBlockMovesMade(0)
    idleTipTriggeredRef.current = false
    startTimeRef.current = Date.now()

    getQuestion('python', problemId)
      .then((data) => {
        setQuestionData(data)
        setCode(data.starterCode)
        // Setup blocks array
        const blks = PROBLEM_BLOCKS[problemId] || []
        setArrangedBlocks(blks.map((b) => ({ id: b.id, correctPosition: b.correctPosition })))
      })
      .catch(console.error)
  }, [problemId])

  // ── 90-second Idle Hint Prompt ────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'blocks' || !questionData || idleTipTriggeredRef.current) return

    const timer = setTimeout(() => {
      if (hintsOpened === 0 && !idleTipTriggeredRef.current) {
        idleTipTriggeredRef.current = true
        // Trigger Gemini chat notification
        const randomBlockIndex = Math.floor(Math.random() * (PROBLEM_BLOCKS[problemId]?.length || 8)) + 1
        const tipMsg = `Try clicking the arrow on block ${randomBlockIndex} to understand what it does.`
        setGeminiMessages((prev) => [...prev, { role: 'bot', text: tipMsg }])
      }
    }, 90000) // 90 seconds

    return () => clearTimeout(timer)
  }, [mode, questionData, hintsOpened, problemId])

  // Handle block order swap from Phaser scene
  const handleBlockOrderChange = useCallback((newOrder) => {
    setArrangedBlocks(newOrder)
    setBlockMovesMade((m) => m + 1)
  }, [])

  // Handle explanation dropdown clicked
  const handleDropdownOpened = useCallback((blockId) => {
    setHintsOpened((h) => h + 1)
    
    // Custom explanation feedback in the Gemini panel
    const b = PROBLEM_BLOCKS[problemId]?.find((x) => x.id === blockId)
    if (b) {
      setGeminiMessages((prev) => [
        ...prev,
        { role: 'bot', text: `Block Explanation: "${b.code.trim()}" -> ${b.explanation}` },
      ])
    }
  }, [problemId])

  const handleRun = async () => {
    setIsRunning(true)
    setRunResult(null)
    setRunAttempts((a) => a + 1)

    let finalPythonCode = code

    if (mode === 'blocks') {
      // Reassemble code in current arranged block order
      const assembledLines = []
      // Include class declarations so executing tests does not raise NameError in Pyodide
      if (problemId === 'linked_list_reversal') {
        assembledLines.push(
          'class Node:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n'
        )
      } else if (problemId === 'dfs_traversal') {
        assembledLines.push(
          'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n'
        )
      } else if (problemId === 'circular_queue') {
        assembledLines.push(
          'class CircularQueue:\n    def __init__(self, capacity):\n        self.queue = [None] * capacity\n        self.head = 0\n        self.tail = 0\n        self.size = 0\n        self.capacity = capacity\n'
        )
      }
      
      arrangedBlocks.forEach((userBlock) => {
        const fullBlock = PROBLEM_BLOCKS[problemId]?.find((b) => b.id === userBlock.id)
        if (fullBlock) {
          assembledLines.push(fullBlock.code)
        }
      })
      finalPythonCode = assembledLines.join('\n')
    }

    // Append assertions suite
    const assertScript = getTestCodeForProblem(problemId)
    const runCodeWithTests = `${finalPythonCode}\n\n${assertScript}`

    try {
      const result = await runPythonCode(runCodeWithTests)
      
      // Look for custom test failure or passing logs in stdout
      const isOk = result.passed && result.stdout.includes('ALL TESTS PASSED')
      setIsPassed(isOk)
      
      setRunResult({
        ...result,
        passed: isOk,
      })

      if (!isOk && mode === 'blocks') {
        // Trigger the visual Ronin blocks helper modal
        setShowVisualHint(true)
        const hintText = generateGeminiHint(problemId, arrangedBlocks)
        setGeminiHintsReceived((h) => h + 1)
        setGeminiMessages((prev) => [...prev, { role: 'bot', text: hintText }])
      } else if (isOk) {
        setGeminiMessages((prev) => [
          ...prev,
          { role: 'bot', text: 'All test assertions passed successfully! Excellent work, click Submit below to proceed.' },
        ])
      }
    } catch (err) {
      setRunResult({ stdout: '', errors: err.toString(), passed: false, results: [] })
    } finally {
      setIsRunning(false)
      setHasRun(true)
    }
  }

  const handleClearConsole = () => {
    setHasRun(false)
    setRunResult(null)
  }

  const handleSubmit = async () => {
    // 1. Open the submission overlay dialog in active state
    setSubmissionActive(true)
    setSubmissionProgress(0)
    setSubmissionIsFinished(false)
    setSubmissionPassed(false)
    setSubmissionMessage('Initializing sandbox execution environment...')
    
    const initialCases = (questionData?.tests || []).map((t) => ({
      ...t,
      status: 'waiting',
      actual: null,
    }))
    setSubmissionCases(initialCases)

    // Assemble final python code to evaluate in Pyodide
    let finalPythonCode = code
    if (mode === 'blocks') {
      const assembledLines = []
      if (problemId === 'linked_list_reversal') {
        assembledLines.push(
          'class Node:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n'
        )
      } else if (problemId === 'dfs_traversal') {
        assembledLines.push(
          'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n'
        )
      } else if (problemId === 'circular_queue') {
        assembledLines.push(
          'class CircularQueue:\n    def __init__(self, capacity):\n        self.queue = [None] * capacity\n        self.head = 0\n        self.tail = 0\n        self.size = 0\n        self.capacity = capacity\n'
        )
      }
      arrangedBlocks.forEach((userBlock) => {
        const fullBlock = PROBLEM_BLOCKS[problemId]?.find((b) => b.id === userBlock.id)
        if (fullBlock) {
          assembledLines.push(fullBlock.code)
        }
      })
      finalPythonCode = assembledLines.join('\n')
    }

    const assertScript = getTestCodeForProblem(problemId)
    const runCodeWithTests = `${finalPythonCode}\n\n${assertScript}`

    let runResultData = null
    try {
      // Execute the Pyodide test suite
      runResultData = await runPythonCode(runCodeWithTests)
    } catch (err) {
      runResultData = { stdout: '', errors: err.toString(), passed: false, results: [] }
    }

    // Determine correctness for each test case
    const totalCases = initialCases.length
    let failedCaseIndex = -1
    let errorMessage = ''

    if (runResultData.errors) {
      failedCaseIndex = 0
      errorMessage = runResultData.errors
    } else {
      const runPassed = runResultData.passed && runResultData.stdout.includes('ALL TESTS PASSED')
      if (!runPassed) {
        const matchFail = runResultData.stdout.match(/Test case (\d+) failed/)
        const matchExc = runResultData.stdout.match(/Test case (\d+) raised exception/)
        const match = matchFail || matchExc
        if (match) {
          failedCaseIndex = parseInt(match[1], 10) - 1
          const lines = runResultData.stdout.split('\n')
          errorMessage = lines.find(l => l.includes('failed') || l.includes('exception')) || 'Assertion failed.'
        } else {
          failedCaseIndex = 0
          errorMessage = 'Exception during execution.'
        }
      }
    }

    // Start sequential step-by-step animation of test cases
    let currentIdx = 0
    
    const animateNextCase = () => {
      if (currentIdx >= totalCases) {
        // All test cases finished executing and all passed!
        setSubmissionPassed(true)
        setSubmissionIsFinished(true)
        setSubmissionMessage('Success! All verification test cases passed.')
        return
      }

      const evaluatingIdx = currentIdx
      // Mark the current case as 'evaluating'
      setSubmissionCases((prev) =>
        prev.map((c, idx) => (idx === evaluatingIdx ? { ...c, status: 'evaluating' } : c))
      )
      setSubmissionMessage(`Applying assertions for ${evaluatingIdx === 3 ? 'Hidden Test Case 1' : evaluatingIdx === 4 ? 'Hidden Test Case 2' : `Case ${evaluatingIdx + 1}`}...`)

      // Wait 500ms before locking the result
      setTimeout(() => {
        const finishedIdx = evaluatingIdx
        const isFail = failedCaseIndex !== -1 && finishedIdx === failedCaseIndex
        
        if (isFail) {
          // Locked as fail!
          setSubmissionCases((prev) =>
            prev.map((c, idx) =>
              idx === finishedIdx ? { ...c, status: 'fail', actual: errorMessage } : c
            )
          )
          setSubmissionProgress(Math.round(((finishedIdx + 1) / totalCases) * 100))
          setSubmissionPassed(false)
          setSubmissionIsFinished(true)
          setSubmissionMessage(`Validation failed on ${finishedIdx === 3 ? 'Hidden Test Case 1' : finishedIdx === 4 ? 'Hidden Test Case 2' : `Case ${finishedIdx + 1}`}.`)
          return
        }

        // Locked as pass!
        setSubmissionCases((prev) =>
          prev.map((c, idx) => (idx === finishedIdx ? { ...c, status: 'pass' } : c))
        )
        const nextProgress = Math.round(((finishedIdx + 1) / totalCases) * 100)
        setSubmissionProgress(nextProgress)

        // Proceed to next test case index
        currentIdx++
        setTimeout(animateNextCase, 350)
      }, 500)
    }

    // Begin the animation sequence
    setTimeout(animateNextCase, 400)
  }

  const handleConfirmSubmit = () => {
    setSubmissionActive(false)
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    
    // 1. Write telemetry payload to LocalStorage Firebase stubs
    writeTrainingGroundsResult(userId, problemId, {
      modeChosen: mode,
      runAttempts,
      hintsOpened,
      geminiHintsReceived,
      blockMovesMade,
      timeTakenSeconds: timeTaken,
      status: 'pass',
      finalBlockArrangement: arrangedBlocks,
    })

    // Increment local solved solvedCount
    const nextSolvedCount = solvedCount + 1
    setSolvedCount(nextSolvedCount)

    // 2. Check sequential progression
    if (problemId === 'linked_list_reversal') {
      // Show completion progression dialog (Go to challenges, continue training, or return to dashboard)
      setCompletionDialog(true)
    } else if (currentSeqIndex + 1 < SEQUENCE.length) {
      // Move to next question immediately for other questions (e.g. two_sum)
      setCurrentSeqIndex((idx) => idx + 1)
    } else {
      // Completed all problems in Training Grounds!
      // Compute skill vector and write to skills/
      computeAndSaveSkillVector(userId)
      setCompletionDialog(true)
    }
  }

  const handleForceNextChallenge = () => {
    setSubmissionActive(false)
    if (currentSeqIndex + 1 < SEQUENCE.length) {
      setCurrentSeqIndex((idx) => idx + 1)
    } else {
      computeAndSaveSkillVector(userId)
      setCompletionDialog(true)
    }
  }

  const handleQuitOrExit = () => {
    // If the user cleared at least 1 question, show the test progression card on exit!
    if (solvedCount >= 1) {
      computeAndSaveSkillVector(userId)
      setCompletionDialog(true)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div
      className="flex flex-col relative"
      style={{ height: 'calc(100vh - 64px)', minHeight: 0 }}
    >
      {/* ── Top breadcrumb bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex shrink-0 items-center justify-between gap-3 px-4 pb-3 pt-1 border-b border-white/5 bg-black/20"
      >
        <button
          onClick={handleQuitOrExit}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-ronin-muted transition-colors hover:bg-white/5 hover:text-ronin-cream"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Dashboard
        </button>

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

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-ronin-muted">
            Problem {currentSeqIndex + 1} / {SEQUENCE.length}
          </span>
          {currentSeqIndex + 1 < SEQUENCE.length && (
            <button
              onClick={() => setShowSkipConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg border border-ronin-gold/20 bg-ronin-gold/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ronin-gold transition-all hover:bg-ronin-gold/20 hover:text-yellow-400"
            >
              Next Question
            </button>
          )}
          <button
            onClick={handleQuitOrExit}
            className="flex items-center gap-1.5 rounded-lg border border-ronin-crimson/20 bg-ronin-crimson/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ronin-crimson transition-all hover:bg-ronin-crimson/20 hover:text-red-400"
          >
            <X className="h-3.5 w-3.5" />
            Quit
          </button>
        </div>
      </motion.div>

      {/* ── Mode Selection Overlay Modal (renders before the IDE starts) ── */}
      <AnimatePresence>
        {mode === null && questionData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0506]/98 p-8 text-center shadow-ronin-red"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ronin-crimson/30 bg-ronin-crimson/15 mx-auto mb-4">
                <Code2 className="h-7 w-7 text-ronin-crimson animate-pulse" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ronin-cream mb-2">
                {questionData.title}
              </h2>
              <p className="text-sm text-ronin-muted mb-6">
                Choose your solving interface style for this problem. You can change your choice differently for each problem.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Option 1: Solve Myself (IDE) */}
                <button
                  type="button"
                  onClick={() => setMode('ide')}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-5 text-center transition-all hover:border-ronin-gold/50 hover:bg-white/[0.02]"
                >
                  <span className="text-2xl mb-2">⌨️</span>
                  <span className="font-display text-sm font-bold text-ronin-cream">
                    I want to solve this myself
                  </span>
                  <span className="mt-1 text-[11px] text-ronin-muted">
                    Full Monaco IDE with keyboard typing and local sandbox execution.
                  </span>
                </button>

                {/* Option 2: Walk me through it (Phaser Blocks) */}
                <button
                  type="button"
                  onClick={() => setMode('blocks')}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-5 text-center transition-all hover:border-ronin-crimson/50 hover:bg-white/[0.02]"
                >
                  <span className="text-2xl mb-2">🧩</span>
                  <span className="font-display text-sm font-bold text-ronin-cream">
                    Walk me through it
                  </span>
                  <span className="mt-1 text-[11px] text-ronin-muted">
                    Crisp Phaser-rendered visual workspace using draggable code blocks.
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Workspace Grid (Loaded only when mode is chosen) ── */}
      {mode !== null && questionData && (
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <div className="flex h-full flex-col lg:flex-row lg:gap-3">
            {/* ═══ LEFT COLUMN (Question & AI Panel) ═══ */}
            <div className="flex flex-col gap-3 lg:w-[38%] lg:min-w-[320px] lg:max-w-[480px]">
              {/* Question details */}
              <motion.div
                key={`question-${problemId}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="min-h-0 flex-[3] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-black/50 p-5 shadow-ronin"
                style={{ flexBasis: '60%' }}
              >
                <IDEQuestionPanel
                  language={meta.label}
                  questionData={questionData}
                  runResult={runResult}
                  onOpenReasoning={() => setActiveModal('reasoning')}
                  onOpenVideo={() => setActiveModal('video')}
                />
              </motion.div>

              {/* Gemini response chat logs */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.06 }}
                className="min-h-0 overflow-hidden"
                style={{ flexBasis: '40%', flex: '2' }}
              >
                <IDEGeminiPanel
                  hasRun={hasRun}
                  messages={geminiMessages}
                  isThinking={isThinking}
                />
              </motion.div>
            </div>

            {/* ═══ RIGHT COLUMN (Monaco IDE OR Phaser Blocks arrangement) ═══ */}
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <motion.div
                key={`editor-${problemId}-${mode}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.04 }}
                className="min-h-0 overflow-hidden"
                style={{ flex: '3', flexBasis: '62%' }}
              >
                {mode === 'ide' ? (
                  <IDEEditorPanel language={meta.label} code={code} onChange={setCode} />
                ) : (
                  <PhaserBlocksPanel
                    problemId={problemId}
                    blocks={PROBLEM_BLOCKS[problemId] || []}
                    onOrderChange={handleBlockOrderChange}
                    onDropdownOpened={handleDropdownOpened}
                  />
                )}
              </motion.div>

              {/* Terminal sandbox outputs */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="min-h-0 overflow-hidden"
                style={{ flex: '2', flexBasis: '38%' }}
              >
                <IDEConsolePanel
                  hasRun={hasRun}
                  runResult={runResult}
                  isRunning={isRunning}
                  onClear={handleClearConsole}
                />
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Bar ── */}
      {mode !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="shrink-0 border-t border-white/5 bg-black/45"
        >
          <IDEBottomBar
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            isSubmitEnabled={isPassed}
          />
        </motion.div>
      )}

      {/* ── Dialog modal overlays (Reasoning & Video intro explanation) ── */}
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

              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {activeModal === 'video' && (
                  <div className="relative mb-8 flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <p className="z-10 text-sm font-semibold text-ronin-gold/60">
                      Video Player Placeholder
                    </p>
                    <p className="absolute bottom-4 left-4 z-10 text-xs text-white/30">
                      {questionData.metadata.video.firebaseStoragePath}
                    </p>
                  </div>
                )}

                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="mb-4 text-2xl font-bold text-ronin-cream" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="mb-3 mt-6 text-xl font-bold text-ronin-cream" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="mb-2 mt-4 text-lg font-bold text-ronin-cream" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-[13px] leading-relaxed text-ronin-muted" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="mb-4 list-inside list-disc space-y-1 text-[13px] text-ronin-muted"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                    code: ({ node, inline, ...props }) =>
                      inline ? (
                        <code
                          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-ronin-cream"
                          {...props}
                        />
                      ) : (
                        <pre className="mb-4 overflow-x-auto rounded-xl border border-white/10 bg-[#09090c] p-4 font-mono text-[12px] text-ronin-cream shadow-inner">
                          <code {...props} />
                        </pre>
                      ),
                  }}
                >
                  {questionData.reasoningMarkdown}
                </ReactMarkdown>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Visual Ronin Helper Modal for Draggable Code Blocks ── */}
      <AnimatePresence>
        {showVisualHint && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0a0506]/98 p-6 text-center shadow-ronin-red flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center gap-2 mb-3 text-ronin-crimson justify-center">
                <Sparkles className="h-6 w-6 text-ronin-gold animate-pulse" />
                <h3 className="font-display text-lg font-bold text-ronin-cream">Ronin Helper Analysis</h3>
              </div>
              
              <p className="text-xs leading-relaxed text-ronin-muted mb-4 max-w-sm mx-auto">
                Review your current block arrangement. Correctly aligned blocks are highlighted in green, while misplaced ones are highlighted in red to help you debug your logical flow.
              </p>

              {/* Visual Block Stack */}
              <div className="space-y-3 mb-6 overflow-y-auto pr-1 flex-1 min-h-0 text-left custom-scrollbar">
                {arrangedBlocks.map((userBlock, idx) => {
                  const fullBlock = PROBLEM_BLOCKS[problemId]?.find((b) => b.id === userBlock.id)
                  const isAligned = userBlock.correctPosition === idx + 1
                  
                  return (
                    <div
                      key={userBlock.id}
                      className={`rounded-2xl p-3.5 border transition-all duration-200 bg-black/40 flex flex-col gap-2 ${
                        isAligned 
                          ? 'border-emerald-500/35 hover:border-emerald-500/50 shadow-sm shadow-emerald-950/20' 
                          : 'border-ronin-crimson/35 hover:border-ronin-crimson/50 shadow-sm shadow-red-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isAligned 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                            : 'bg-ronin-crimson/10 text-ronin-coral border border-ronin-crimson/25'
                        }`}>
                          {isAligned ? '✓ Aligned' : '✗ Misplaced'}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                          Slot {idx + 1}
                        </span>
                      </div>
                      
                      {/* Code preview snippet */}
                      <pre className="font-mono text-[11.5px] leading-relaxed text-ronin-cream overflow-x-auto p-2.5 bg-[#090506] rounded-xl border border-white/5 whitespace-pre">
                        <code>{fullBlock?.code}</code>
                      </pre>
                      
                      {/* Block operation tooltip */}
                      <p className="text-[11px] leading-normal text-ronin-muted italic pl-1 flex items-start gap-1">
                        <span className="text-ronin-gold not-italic">💡</span>
                        <span>{fullBlock?.explanation}</span>
                      </p>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowVisualHint(false)}
                className="w-full rounded-xl bg-ronin-crimson py-3 text-xs font-semibold uppercase tracking-wider text-ronin-cream hover:bg-[#d82229] transition-all shadow-md shadow-ronin-red/20 shrink-0"
              >
                I Understand, Let me think
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Centered Non-Dismissible Dialog: Ready to test yourself? ── */}
      <AnimatePresence>
        {completionDialog && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl border border-ronin-crimson/30 bg-[#0a0506]/98 p-6 text-center shadow-ronin-red"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ronin-gold/30 bg-ronin-gold/10 mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-ronin-gold" />
              </div>
              <h3 className="font-display text-lg font-bold text-ronin-cream mb-2">
                Training Grounds Challenge complete
              </h3>
              <p className="text-xs leading-relaxed text-ronin-muted mb-6">
                You&apos;ve completed Training Grounds. Based on how you worked through these problems, we&apos;ve built your first real challenge set. Ready to test yourself?
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setCompletionDialog(false)
                    navigate('/dashboard/game/boss-trial', { state: { isDiagnostic: false } })
                  }}
                  className="w-full rounded-xl bg-ronin-crimson py-3 text-xs font-semibold uppercase tracking-wider text-ronin-cream shadow-ronin hover:bg-[#d82229]"
                >
                  Yes, let&apos;s go
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompletionDialog(false)
                    if (currentSeqIndex + 1 < SEQUENCE.length) {
                      setCurrentSeqIndex((idx) => idx + 1)
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 text-xs font-semibold text-ronin-cream hover:bg-white/5"
                >
                  Continue training
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setCompletionDialog(false)
                    await updateOnboardingPhase('targeted_challenges_pending')
                    navigate('/dashboard')
                  }}
                  className="w-full rounded-xl border border-white/5 bg-transparent py-2.5 text-xs text-ronin-muted hover:text-white"
                >
                  Not yet, go to dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Dialog modal overlay for Submission Verification Progress ── */}
      <AnimatePresence>
        {submissionActive && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0506]/98 p-6 shadow-ronin-red flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4 justify-center">
                {submissionIsFinished ? (
                  submissionPassed ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ronin-crimson/20 text-ronin-coral animate-pulse">
                      <XCircle className="h-6 w-6" />
                    </div>
                  )
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ronin-gold/20 text-ronin-gold animate-spin">
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
                <h3 className="font-display text-lg font-bold text-ronin-cream">
                  {submissionIsFinished 
                    ? (submissionPassed ? 'Verification Passed!' : 'Verification Failed') 
                    : 'Verifying Solution...'}
                </h3>
              </div>

              {/* Message */}
              <p className="text-xs text-ronin-muted mb-4 text-center">
                {submissionMessage}
              </p>

              {/* Progress bar container */}
              <div className="mb-6 space-y-1">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-ronin-muted">
                  <span>Verification progress</span>
                  <span className="font-semibold text-ronin-gold">{submissionProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-ronin-crimson via-ronin-orange to-ronin-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${submissionProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Test Cases List */}
              <div className="space-y-3 mb-6 overflow-y-auto pr-1 flex-1 min-h-0 text-left custom-scrollbar">
                {submissionCases.map((tc, idx) => {
                  const status = tc.status // 'waiting' | 'evaluating' | 'pass' | 'fail'
                  const isWaiting = status === 'waiting'
                  const isEvaluating = status === 'evaluating'
                  const isPass = status === 'pass'
                  const isFail = status === 'fail'

                  return (
                    <div
                      key={tc.id || idx}
                      className={`rounded-2xl p-3 border transition-all duration-200 bg-black/45 flex flex-col gap-2 ${
                        isPass 
                          ? 'border-emerald-500/35 bg-emerald-500/[0.02]' 
                          : isFail 
                            ? 'border-ronin-crimson/35 bg-ronin-crimson/[0.02]'
                            : isEvaluating 
                              ? 'border-ronin-gold/35 bg-ronin-gold/[0.01]'
                              : 'border-white/5 opacity-55'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Circle Icon */}
                          {isPass && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          )}
                          {isFail && (
                            <XCircle className="h-4 w-4 shrink-0 text-ronin-crimson animate-bounce" />
                          )}
                          {isEvaluating && (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-ronin-gold border-t-transparent animate-spin shrink-0" />
                          )}
                          {isWaiting && (
                            <div className="h-3.5 w-3.5 rounded-full border border-dashed border-white/20 shrink-0" />
                          )}
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-ronin-cream">
                            {idx === 3 ? 'Hidden Test Case 1' : idx === 4 ? 'Hidden Test Case 2' : `Case ${idx + 1}`}
                          </span>
                        </div>
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isPass 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : isFail 
                              ? 'bg-ronin-crimson/10 text-ronin-coral border border-ronin-crimson/20' 
                              : isEvaluating
                                ? 'bg-ronin-gold/10 text-ronin-gold animate-pulse border border-ronin-gold/20'
                                : 'bg-white/5 text-ronin-muted border border-white/5'
                        }`}>
                          {isPass ? 'passed' : isFail ? 'failed' : isEvaluating ? 'evaluating' : 'waiting'}
                        </span>
                      </div>

                      {/* Inputs and expected outputs */}
                      <div className="mt-1 space-y-1 text-[11px] font-mono leading-relaxed pl-6">
                        <div className="flex gap-2">
                          <span className="text-ronin-muted w-14 shrink-0">Input:</span>
                          <span className="text-ronin-cream break-all">{formatInput(tc.input)}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-ronin-muted w-14 shrink-0">Expected:</span>
                          <span className="text-ronin-gold break-all">{JSON.stringify(tc.expected)}</span>
                        </div>
                        {isFail && tc.actual && (
                          <div className="flex gap-2 text-ronin-coral mt-1.5 p-2.5 bg-red-950/20 rounded-xl border border-red-500/10 text-[10px]">
                            <span className="font-semibold shrink-0">Error:</span>
                            <span className="break-all whitespace-pre-wrap">{tc.actual}</span>
                          </div>
                        )}
                        {/* Learn More Trigger Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setDetailedCaseIdx(idx)}
                            className="inline-flex items-center gap-1.5 text-[9px] font-bold text-ronin-gold hover:text-yellow-400 hover:bg-white/10 transition-all uppercase tracking-wider bg-white/5 border border-white/5 rounded-md px-2 py-0.5"
                          >
                            <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              {submissionIsFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 mt-2 shrink-0 animate-fade-in"
                >
                  {submissionPassed ? (
                    <button
                      type="button"
                      onClick={handleConfirmSubmit}
                      className="w-full rounded-xl bg-ronin-crimson py-3 text-xs font-semibold uppercase tracking-wider text-ronin-cream shadow-ronin hover:bg-[#d82229] transition-all cursor-pointer"
                    >
                      Confirm & Continue
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setSubmissionActive(false)}
                        className="w-full rounded-xl bg-ronin-crimson py-3 text-xs font-semibold uppercase tracking-wider text-ronin-cream shadow-ronin hover:bg-[#d82229] transition-all cursor-pointer"
                      >
                        Go Back
                      </button>
                      <button
                        type="button"
                        onClick={handleForceNextChallenge}
                        className="w-full rounded-xl border border-white/10 bg-black/40 py-3 text-xs font-semibold text-ronin-cream hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Skip & Start Next Challenge
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Dialog modal overlay for Skip Confirmation ── */}
      <AnimatePresence>
        {showSkipConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              className="w-full max-w-md rounded-3xl border border-ronin-crimson/30 bg-[#0a0506]/98 p-6 text-center shadow-ronin-red"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ronin-coral/30 bg-ronin-coral/10 mx-auto mb-3">
                <HelpCircle className="h-6 w-6 text-ronin-coral font-bold" />
              </div>
              <h3 className="font-display text-lg font-bold text-ronin-cream mb-2">
                Skip Current Question?
              </h3>
              <p className="text-xs leading-relaxed text-ronin-muted mb-6">
                Are you sure you&apos;ll lose progress here if you skip? Your current code/blocks arrangement for this problem will not be saved.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSkipConfirm(false)
                    if (currentSeqIndex + 1 < SEQUENCE.length) {
                      setCurrentSeqIndex((idx) => idx + 1)
                    }
                  }}
                  className="w-full rounded-xl bg-ronin-crimson py-3 text-xs font-semibold uppercase tracking-wider text-ronin-cream hover:bg-[#d82229] transition-all cursor-pointer"
                >
                  Yes, Skip Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowSkipConfirm(false)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 text-xs font-semibold text-ronin-cream hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Dialog modal overlay for Learn More Technical Detail ── */}
      <LearnMoreDialog
        isOpen={detailedCaseIdx !== null}
        onClose={() => setDetailedCaseIdx(null)}
        problemId={problemId}
        testCaseIdx={detailedCaseIdx}
        testCaseData={questionData?.tests?.[detailedCaseIdx]}
      />
    </div>
  )
}
