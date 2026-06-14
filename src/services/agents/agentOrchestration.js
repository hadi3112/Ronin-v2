import { runSessionAgent } from './sessionAgent.js'
import { runProgressAgent } from './progressAgent.js'
import { runOrchestratorAgent } from './orchestratorAgent.js'

/**
 * Pipelined Orchestration for the Three-Layer Agent Architecture.
 */
export const AgentPipeline = {
  /**
   * Called on every user code submission.
   */
  async processAttempt(attemptData, currentProblem, sessionState) {
    console.log('[Orchestrator] Invoking Session Agent (Layer 1)')
    const result = await runSessionAgent(attemptData, currentProblem, sessionState)
    return result
  },

  /**
   * Called when the user exits or finishes a training session.
   */
  async finalizeSession(sessionSummary, currentProfile) {
    console.log('[Orchestrator] Invoking Progress Agent (Layer 2)')
    const progressResult = await runProgressAgent(sessionSummary, currentProfile)
    
    // Simulate fetching the updated profile combining the deltas
    const updatedProfile = {
      ...currentProfile,
      ...(progressResult.profileUpdates || {})
    }
    
    console.log('[Orchestrator] Invoking Orchestrator Agent (Layer 3)')
    const orchestratorResult = await runOrchestratorAgent(updatedProfile, { /* mock curriculum state */ })
    
    return {
      progress: progressResult,
      dashboardUpdates: orchestratorResult
    }
  }
}
