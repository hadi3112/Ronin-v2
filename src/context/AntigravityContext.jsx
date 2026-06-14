import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { createAntigravityAgent, CATEGORY_DISPLAY_NAMES } from '../game/antigravity/AntigravityAgent.js'

const AntigravityContext = createContext(null)

export function AntigravityProvider({ children }) {
  const [agent] = useState(() => createAntigravityAgent())
  const [version, setVersion] = useState(0)

  const refresh = useCallback(() => setVersion(v => v + 1), [])

  const startSession = useCallback(() => {
    const result = agent.startSession()
    refresh()
    return result
  }, [agent, refresh])

  const processAnswer = useCallback((question, isCorrect, wasSkipped, timeMs) => {
    const result = agent.processAnswer(question, isCorrect, wasSkipped, timeMs)
    refresh()
    return result
  }, [agent, refresh])

  const selectNextQuestionType = useCallback((availableTypes) => {
    return agent.selectNextQuestionType(availableTypes)
  }, [agent])

  const endSession = useCallback(() => {
    const result = agent.endSession()
    refresh()
    return result
  }, [agent, refresh])

  const getProfileSnapshot = useCallback(() => {
    return agent.getProfileSnapshot()
  }, [agent])

  const getFormattedReasoning = useCallback((count = 10) => {
    return agent.getFormattedReasoning(count)
  }, [agent])

  const getDifficultyParams = useCallback(() => {
    return agent.getDifficultyParams()
  }, [agent])

  const canSelectPuzzle = useCallback(() => {
    return agent.canSelectPuzzle()
  }, [agent])

  const value = useMemo(() => ({
    agent,
    startSession,
    processAnswer,
    selectNextQuestionType,
    endSession,
    getProfileSnapshot,
    getFormattedReasoning,
    getDifficultyParams,
    canSelectPuzzle,
    get sessionQuestionCount() { return agent.sessionQuestionCount },
    get currentSessionCorrect() { return agent.currentSessionCorrect },
    get currentSessionTotal() { return agent.currentSessionTotal },
    CATEGORY_DISPLAY_NAMES,
    version,
  }), [agent, startSession, processAnswer, selectNextQuestionType, endSession, getProfileSnapshot, getFormattedReasoning, getDifficultyParams, canSelectPuzzle, version])

  return (
    <AntigravityContext.Provider value={value}>
      {children}
    </AntigravityContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAntigravity() {
  const ctx = useContext(AntigravityContext)
  if (!ctx) {
    throw new Error('useAntigravity must be used within AntigravityProvider')
  }
  return ctx
}

import { AgentPipeline } from '../services/agents/agentOrchestration.js'

// Simple hook to expose the Three-Layer Agent Pipeline to React components
export function useAgents() {
  return AgentPipeline
}
