import {
  STACKTRACE_SEED,
  CODE_COMPLETION_SEED,
  CONCEPTUAL_SEED,
  SYSTEM_ARCHITECTURE_SEED,
} from './data/pythonCoreV1.seed.js'

/**
 * @typedef {object} QuestionBankShape
 * @property {unknown[]} stacktrace
 * @property {unknown[]} code_completion
 * @property {unknown[]} conceptual
 * @property {unknown[] | Record<string, unknown>} system_architecture
 */

function cloneBank() {
  return {
    stacktrace: structuredClone(STACKTRACE_SEED),
    code_completion: structuredClone(CODE_COMPLETION_SEED),
    conceptual: structuredClone(CONCEPTUAL_SEED),
    system_architecture: structuredClone(SYSTEM_ARCHITECTURE_SEED),
  }
}

/**
 * Merges remote Firestore arrays with local defaults (remote wins when non-empty).
 * @param {Partial<QuestionBankShape>} remote
 * @returns {QuestionBankShape}
 */
export function mergeQuestionBank(remote) {
  const base = cloneBank()
  if (!remote || typeof remote !== 'object') return base

  const pick = (key) => {
    const r = remote[key]
    if (Array.isArray(r) && r.length > 0) return structuredClone(r)
    return base[key]
  }

  let sys = base.system_architecture
  if (remote.system_architecture && typeof remote.system_architecture === 'object') {
    const r = remote.system_architecture
    if (
      !Array.isArray(r) &&
      (r.linked_list_memory || r.circular_queue || r.circular_queue_alt || r.dfs_tree || r.linked_list)
    ) {
      sys = { ...base.system_architecture, ...structuredClone(r) }
    }
  }

  return {
    stacktrace: pick('stacktrace'),
    code_completion: pick('code_completion'),
    conceptual: pick('conceptual'),
    system_architecture: sys,
  }
}

export function getDefaultPythonCoreBank() {
  return cloneBank()
}
