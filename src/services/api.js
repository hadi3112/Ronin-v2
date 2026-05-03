/**
 * Shared HTTP helpers for backend calls. Extend as APIs are added.
 * @param {RequestInfo | URL} input
 * @param {RequestInit} [init]
 */
export function apiFetch(input, init) {
  return fetch(input, init)
}
