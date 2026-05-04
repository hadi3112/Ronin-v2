/** @typedef {{ id: string; data: number; prev: string; address: string }} LinkedListDragNode */

const SENTINEL = '0x00000000'

function hexAddr(seed, i) {
  const n = (seed + i * 0x20) & 0xfffffff0
  return `0x${n.toString(16).padStart(8, '0')}`
}

/**
 * Builds a 4-node doubly-linked list slice (prev chain), shuffles for display.
 * Validates answers against the single correct left-to-right order (4! = 24 permutations).
 * @param {() => number} rng
 */
export function buildLinkedListDragPayload(rng) {
  const seed = Math.floor(rng() * 0xf0000000) | 0x10000000
  const dataVals = new Set()
  while (dataVals.size < 4) {
    dataVals.add(10 + Math.floor(rng() * 90))
  }
  const dataArr = [...dataVals]

  const addresses = [hexAddr(seed, 0), hexAddr(seed, 1), hexAddr(seed, 2), hexAddr(seed, 3)]

  /** @type {LinkedListDragNode[]} */
  const chain = [
    { id: 'n0', data: dataArr[0], prev: SENTINEL, address: addresses[0] },
    { id: 'n1', data: dataArr[1], prev: addresses[0], address: addresses[1] },
    { id: 'n2', data: dataArr[2], prev: addresses[1], address: addresses[2] },
    { id: 'n3', data: dataArr[3], prev: addresses[2], address: addresses[3] },
  ]

  const correctOrderIds = ['n0', 'n1', 'n2', 'n3']
  const shuffled = [...chain]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return {
    kind: 'linked_list_memory',
    questionText:
      'Each card is one list node: `data` on top, `prev` below (hex). Drag the four cards into the order implied by the `prev` chain — leftmost is the head (its `prev` is the sentinel). Lock in when ready.',
    nodes: chain,
    initialOrderIds: shuffled.map((n) => n.id),
    correctOrderIds,
  }
}

/**
 * @param {string[]} userOrder
 * @param {string[]} correctOrderIds
 */
export function isCorrectLinkedListOrder(userOrder, correctOrderIds) {
  if (userOrder.length !== correctOrderIds.length) return false
  return userOrder.every((id, i) => id === correctOrderIds[i])
}

/**
 * @param {LinkedListDragNode[]} nodes
 * @param {string[]} userOrder
 * @param {string[]} correctOrderIds
 */
export function explainLinkedListOrder(nodes, userOrder, correctOrderIds) {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const correctLabels = correctOrderIds.map((id) => byId.get(id)?.data ?? id).join(' → ')
  const userLabels = userOrder.map((id) => byId.get(id)?.data ?? id).join(' → ')
  const why =
    'From left to right, each node’s `prev` must equal the previous card’s address. The head is the only node whose `prev` is the sentinel `0x00000000`; every other node’s `prev` matches the address printed on the node immediately to its left.'
  return { correctLabels, userLabels, why }
}
