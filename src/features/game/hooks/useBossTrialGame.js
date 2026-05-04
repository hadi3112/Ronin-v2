import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CombatVisualState, runCombatExchange } from '../../../game/CombatStateMachine.js'
import { loadBossTrialSession } from '../../../game/CourseLoader.js'
import { GameEngine } from '../../../game/GameEngine.js'
import { defaultFirebaseService } from '../../../services/FirebaseService.js'

/**
 * @param {{ userId: string; sessionId: string }} ids
 */
export function useBossTrialGame(ids) {
  void ids.userId

  const [loadState, setLoadState] = useState(/** @type {'loading'|'ready'|'error'} */ ('loading'))
  const [loadError, setLoadError] = useState(/** @type {string | null} */ (null))
  const [questions, setQuestions] = useState(/** @type {object[] | null} */ (null))

  const engineRef = useRef(/** @type {GameEngine | null} */ (null))
  const [roninHp, setRoninHp] = useState(100)
  const [bossHp, setBossHp] = useState(100)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('playing')
  const [combatVisualState, setCombatVisualState] = useState(CombatVisualState.IDLE)
  const [animBusy, setAnimBusy] = useState(false)
  const abortRef = useRef(/** @type {AbortController | null} */ (null))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { questions: q } = await loadBossTrialSession(defaultFirebaseService, 'python', ids.sessionId)
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
      abortRef.current?.abort()
    }
  }, [ids.sessionId])

  const applyAnswer = useCallback(
    async (isCorrect) => {
      const eng = engineRef.current
      if (!eng || eng.phase !== 'playing' || animBusy) return

      abortRef.current?.abort()
      abortRef.current = new AbortController()
      const signal = abortRef.current.signal

      setAnimBusy(true)
      try {
        await runCombatExchange(
          isCorrect,
          {
            onVisualState: (s) => setCombatVisualState(s),
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
          signal,
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
        setAnimBusy(false)
      }
    },
    [animBusy],
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
    combatVisualState,
    animBusy,
    questionLabel,
    applyAnswer,
  }
}
