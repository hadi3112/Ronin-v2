import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CombatVisualState, runCombatExchange } from '../../../game/CombatStateMachine.js'
import { loadBossTrialSession } from '../../../game/CourseLoader.js'
import { GameEngine } from '../../../game/GameEngine.js'
import { useAntigravity } from '../../../context/AntigravityContext.jsx'
import { defaultFirebaseService } from '../../../services/FirebaseService.js'
import { sampleSessionQuestions } from '../../../game/QuestionEngine.js'
import { mergeQuestionBank } from '../../../game/QuestionBankManager.js'

export function useAdaptiveBossTrialGame(ids) {
  void ids.userId

  const {
    startSession,
    processAnswer,
    endSession,
    getFormattedReasoning,
    sessionQuestionCount,
    getDifficultyParams,
  } = useAntigravity()

  const [loadState, setLoadState] = useState('loading')
  const [loadError, setLoadError] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  const engineRef = useRef(null)
  const answerStartTimeRef = useRef(0)
  const [roninHp, setRoninHp] = useState(100)
  const [bossHp, setBossHp] = useState(100)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('playing')
  const [combatVisualState, setCombatVisualState] = useState(CombatVisualState.IDLE)
  const [animBusy, setAnimBusy] = useState(false)
  const animBusyRef = useRef(false)
  const abortRef = useRef(null)

  const [latestXPGain, setLatestXPGain] = useState(0)
  const [latestStreakLabel, setLatestStreakLabel] = useState(null)
  const [expansion, setExpansion] = useState(null)
  const [agentReasoning, setAgentReasoning] = useState([])
  const [totalXP, setTotalXP] = useState(0)
  const [dynamicQuestionCount, setDynamicQuestionCount] = useState(10)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [lastQuestionType, setLastQuestionType] = useState(null)
  const bankRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const difficulty = getDifficultyParams()
        const { questions: q, bank } = await loadBossTrialSession(
          defaultFirebaseService,
          'python',
          ids.sessionId,
          difficulty
        )
        if (cancelled) return

        startSession()
        bankRef.current = bank
        
        engineRef.current = new GameEngine(q)
        setQuestions(q)
        setDynamicQuestionCount(q.length)
        setCorrectCount(0)
        setRoninHp(engineRef.current.roninHp)
        setBossHp(engineRef.current.bossHp)
        setIndex(engineRef.current.index)
        setPhase(engineRef.current.phase)
        setLoadState('ready')
        setLoadError(null)
        answerStartTimeRef.current = performance.now()
      } catch (e) {
        if (cancelled) return
        setLoadState('error')
        setLoadError(e instanceof Error ? e.message : 'Failed to load game')
      }
    })()
    return () => {
      cancelled = true
      abortRef.current?.abort()
    }
  }, [ids.sessionId, startSession, getDifficultyParams])

  useEffect(() => {
    answerStartTimeRef.current = performance.now()
  }, [index])

  const applyAnswer = useCallback(async (isCorrect, wasSkipped = false) => {
    const eng = engineRef.current
    if (!eng || eng.phase !== 'playing' || animBusyRef.current) return

    animBusyRef.current = true
    setAnimBusy(true)

    const currentQ = eng.current
    const timeMs = performance.now() - answerStartTimeRef.current

    if (isCorrect && !wasSkipped) setCorrectCount(c => c + 1)
    
    // Track last answer for toast messages
    setLastAnswerCorrect(isCorrect && !wasSkipped)
    const qType = currentQ?.subtype || currentQ?.bankType || 'question'
    setLastQuestionType(qType)

    const agentResult = processAnswer(currentQ, isCorrect, wasSkipped, timeMs)
    setLatestXPGain(agentResult.xpAwarded)
    setLatestStreakLabel(agentResult.streakLabel)
    setTotalXP(agentResult.totalXP)
    setAgentReasoning(getFormattedReasoning(5))

    if (agentResult.expansion && bankRef.current && engineRef.current) {
      setExpansion(agentResult.expansion)
      const difficulty = getDifficultyParams()
      const extraQuestions = sampleSessionQuestions(bankRef.current, {
        sessionKey: `${ids.sessionId}_exp_${Date.now()}`,
        difficulty,
      }).slice(0, agentResult.expansion.added)
      
      // IMPORTANT: Update engine questions SYNCHRONOUSLY before combat exchange
      // so the engine doesn't end the game prematurely
      const updatedQuestions = [...(engineRef.current.questions || []), ...extraQuestions]
      engineRef.current.questions = updatedQuestions
      
      setQuestions(updatedQuestions)
      setDynamicQuestionCount(agentResult.expansion.newTotal)
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    try {
      await runCombatExchange(
        isCorrect,
        {
          onVisualState: s => setCombatVisualState(s),
          applyDamage: () => {
            const res = eng.applyCombatResult(isCorrect)
            setRoninHp(eng.roninHp)
            setBossHp(eng.bossHp)
            setPhase(eng.phase)
            return res
          },
          shouldBossKO: () => eng.phase === 'victory',
          shouldRoninKO: () => eng.phase === 'defeat',
        },
        signal
      )
      setIndex(eng.index)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        /* unmount */
      } else {
        throw e
      }
    } finally {
      setCombatVisualState(CombatVisualState.IDLE)
      animBusyRef.current = false
      setAnimBusy(false)
    }
  }, [processAnswer, getFormattedReasoning])

  const handleSessionEnd = useCallback(() => {
    const result = endSession()
    return result
  }, [endSession])

  const current = useMemo(() => {
    if (!questions) return null
    if (index >= questions.length) return null
    return questions[index]
  }, [questions, index])

  const questionLabel = useMemo(() => {
    if (!questions) return '0 / 10'
    const total = dynamicQuestionCount || questions.length
    if (phase !== 'playing') return `${total} / ${total}`
    return `${Math.min(index + 1, total)} / ${total}`
  }, [questions, index, phase, dynamicQuestionCount])

  const dismissExpansion = useCallback(() => {
    setExpansion(null)
  }, [])

  return {
    loadState,
    loadError,
    questions,
    current,
    roninHp,
    bossHp,
    index,
    phase,
    combatVisualState,
    animBusy,
    questionLabel,
    applyAnswer,
    correctCount,
    totalQuestions: dynamicQuestionCount,
    
    latestXPGain,
    latestStreakLabel,
    lastAnswerCorrect,
    lastQuestionType,
    expansion,
    dismissExpansion,
    agentReasoning,
    totalXP,
    handleSessionEnd,
  }
}
