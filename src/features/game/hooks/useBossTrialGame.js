import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadBossTrialSession } from '../../../game/CourseLoader.js'
import { GameEngine } from '../../../game/GameEngine.js'
import { defaultFirebaseService } from '../../../services/FirebaseService.js'

const MID_MS = 320
const TAIL_MS = 380

/**
 * @typedef {'idle' | 'ronin_dash' | 'boss_dash' | 'shake'} CombatPhase
 */

/**
 * @param {{ userId: string; sessionId: string }} ids
 */
export function useBossTrialGame(ids) {
  void ids.userId
  void ids.sessionId

  const [loadState, setLoadState] = useState(/** @type {'loading'|'ready'|'error'} */ ('loading'))
  const [loadError, setLoadError] = useState(/** @type {string | null} */ (null))
  const [questions, setQuestions] = useState(/** @type {object[] | null} */ (null))

  const engineRef = useRef(/** @type {GameEngine | null} */ (null))
  const [roninHp, setRoninHp] = useState(100)
  const [bossHp, setBossHp] = useState(100)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('playing')
  const [combatPhase, setCombatPhase] = useState(/** @type {CombatPhase} */ ('idle'))
  const [animBusy, setAnimBusy] = useState(false)
  const timersRef = useRef(/** @type {number[]} */ ([]))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { questions: q } = await loadBossTrialSession(defaultFirebaseService, 'python')
        if (cancelled) return
        engineRef.current = new GameEngine(q)
        setQuestions(q)
        setRoninHp(engineRef.current.roninHp)
        setBossHp(engineRef.current.bossHp)
        setIndex(engineRef.current.index)
        setPhase(engineRef.current.phase)
        setLoadState('ready')
        setLoadError(null)
      } catch (e) {
        if (cancelled) return
        setLoadState('error')
        setLoadError(e instanceof Error ? e.message : 'Failed to load game')
      }
    })()
    return () => {
      cancelled = true
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
    }
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }, [])

  const playCombat = useCallback((roninAttacks, onMid, onEnd) => {
    clearTimers()
    setCombatPhase(roninAttacks ? 'ronin_dash' : 'boss_dash')
    const t1 = window.setTimeout(() => {
      setCombatPhase('shake')
      onMid?.()
    }, MID_MS)
    const t2 = window.setTimeout(() => {
      setCombatPhase('idle')
      onEnd?.()
    }, MID_MS + TAIL_MS)
    timersRef.current.push(t1, t2)
  }, [clearTimers])

  const applyAnswer = useCallback(
    (isCorrect) => {
      const eng = engineRef.current
      if (!eng || eng.phase !== 'playing' || animBusy) return

      setAnimBusy(true)
      playCombat(
        isCorrect,
        () => {
          eng.submitAnswer(isCorrect)
          setRoninHp(eng.roninHp)
          setBossHp(eng.bossHp)
          setPhase(eng.phase)
        },
        () => {
          const latest = engineRef.current
          if (latest) setIndex(latest.index)
          setAnimBusy(false)
        },
      )
    },
    [animBusy, playCombat],
  )

  const current = useMemo(() => {
    if (!questions) return null
    if (index >= questions.length) return null
    return questions[index]
  }, [questions, index])

  const questionLabel = useMemo(() => {
    if (!questions) return '0 / 10'
    if (phase !== 'playing') return '10 / 10'
    return `${Math.min(index + 1, 10)} / 10`
  }, [questions, index, phase])

  return {
    loadState,
    loadError,
    questions,
    current,
    roninHp,
    bossHp,
    index,
    phase,
    combatPhase,
    animBusy,
    questionLabel,
    applyAnswer,
  }
}
