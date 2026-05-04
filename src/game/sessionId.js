/**
 * @returns {string}
 */
export function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `sess_${Date.now()}_${Math.random().toString(16).slice(2)}`
}
