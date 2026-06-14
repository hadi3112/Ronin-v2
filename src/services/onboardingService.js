/**
 * Onboarding Phase & Diagnostic Session Service — PLACEHOLDER / STUB
 * ---------------------------------------------------------------------------
 * This module manages two Firebase nodes:
 *
 *   users/{userId}
 *     onboardingPhase: "diagnostic_pending"
 *                    | "training_grounds_pending"
 *                    | "targeted_challenges_pending"
 *                    | "onboarding_complete"
 *
 *   diagnosticSession/{userId}
 *     startedAt: ISO timestamp string
 *     endedAt: ISO timestamp string
 *     sessionDurationSeconds: number
 *     totalScore: number (correct answers out of total)
 *     totalQuestions: number
 *     domains: {
 *       dfs:            { questionId, correct, timeTakenSeconds, answerChanged }
 *       linked_list:    { questionId, correct, timeTakenSeconds, answerChanged }
 *       circular_queue: { questionId, correct, timeTakenSeconds, answerChanged }
 *       stacktrace:     { questionId, correct, timeTakenSeconds, answerChanged }
 *       code_completion:{ questionId, correct, timeTakenSeconds, answerChanged }
 *       conceptual:     { questionId, correct, timeTakenSeconds, answerChanged }
 *     }
 *
 * ---------------------------------------------------------------------------
 * HOW TO WIRE FIREBASE (when ready):
 *   1) npm install firebase
 *   2) Create src/services/firebaseApp.js with initializeApp(...)
 *   3) import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
 *   4) Replace each // FIREBASE_PLACEHOLDER block below with the real Firestore call.
 *
 * Never commit real API keys — use Vite env: import.meta.env.VITE_FIREBASE_*
 */

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { app, db } from './firebase/firebaseConfig.js'

/** @typedef {'diagnostic_pending' | 'training_grounds_pending' | 'targeted_challenges_pending' | 'onboarding_complete'} OnboardingPhase */

// ---------------------------------------------------------------------------
// Phase management
// ---------------------------------------------------------------------------

/**
 * Read the current onboarding phase for a user.
 * @param {string} userId
 * @returns {Promise<OnboardingPhase | null>}
 */
export async function getOnboardingPhase(userId) {
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    return snap.exists() ? snap.data().onboardingPhase ?? null : null
  } catch (error) {
    console.error("Error reading onboarding phase:", error)
    return null
  }
}

/**
 * Write the onboarding phase for a user.
 * @param {string} userId
 * @param {OnboardingPhase} phase
 * @returns {Promise<void>}
 */
export async function setOnboardingPhase(userId, phase) {
  try {
    await setDoc(doc(db, 'users', userId), { onboardingPhase: phase }, { merge: true })
  } catch (error) {
    console.error("Error setting onboarding phase:", error)
  }
}

// ---------------------------------------------------------------------------
// Diagnostic session write
// ---------------------------------------------------------------------------

/**
 * @typedef {object} DiagnosticDomainResult
 * @property {string} questionId
 * @property {boolean} correct
 * @property {number} timeTakenSeconds
 * @property {boolean} answerChanged
 */

/**
 * @typedef {object} DiagnosticSessionPayload
 * @property {string} startedAt — ISO timestamp
 * @property {string} endedAt — ISO timestamp
 * @property {number} sessionDurationSeconds
 * @property {number} totalScore — correct count
 * @property {number} totalQuestions
 * @property {Record<string, DiagnosticDomainResult>} domains
 */

/**
 * Write the completed diagnostic session to Firebase.
 * Called once when the user finishes the diagnostic challenge.
 * @param {string} userId
 * @param {DiagnosticSessionPayload} payload
 * @returns {Promise<void>}
 */
export async function writeDiagnosticSession(userId, payload) {
  try {
    await setDoc(doc(db, 'diagnosticSession', userId), payload)
  } catch (error) {
    console.error("Error writing diagnostic session:", error)
  }
}

/**
 * Read back the stored diagnostic session (useful for debugging).
 * @param {string} userId
 * @returns {Promise<DiagnosticSessionPayload | null>}
 */
export async function readDiagnosticSession(userId) {
  try {
    const snap = await getDoc(doc(db, 'diagnosticSession', userId))
    return snap.exists() ? snap.data() : null
  } catch (error) {
    console.error("Error reading diagnostic session:", error)
    return null
  }
}

// ---------------------------------------------------------------------------
// Domain mapping helper
// ---------------------------------------------------------------------------

/**
 * Maps a question's bankType/subtype to a canonical domain key used in
 * the diagnosticSession.domains object.
 *
 * @param {string} bankType
 * @param {string | undefined} subtype
 * @returns {string}
 */
export function questionToDomain(bankType, subtype) {
  const foundationsDomains = ['output', 'variables', 'math', 'input', 'conditionals', 'loops']
  if (foundationsDomains.includes(bankType)) return bankType
  if (foundationsDomains.includes(subtype)) return subtype

  if (bankType === 'system_architecture') {
    if (subtype === 'linked_list_memory') return 'linked_list'
    if (subtype === 'dfs_tree') return 'dfs'
    if (subtype === 'circular_queue') return 'circular_queue'
    return 'system_architecture'
  }
  if (bankType === 'stacktrace') return 'stacktrace'
  if (bankType === 'code_completion') return 'code_completion'
  if (bankType === 'conceptual') return 'conceptual'
  return bankType
}

/** Human-readable label for each domain key */
export const DOMAIN_LABELS = {
  linked_list: 'Linked List',
  dfs: 'DFS Tree',
  circular_queue: 'Circular Queue',
  stacktrace: 'Stack Trace',
  code_completion: 'Code Completion',
  conceptual: 'Concept Check',
  output: 'Output & Print',
  variables: 'Variables',
  math: 'Math & Operations',
  input: 'Input & Types',
  conditionals: 'Conditionals',
  loops: 'Loops',
}
