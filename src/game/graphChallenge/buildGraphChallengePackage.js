import { isCanonicalDfsPostOrder } from '../dfsTreeGenerator.js'
import { bankLettersFromSequence, formatOperationPlanLines } from './ringOps.js'

/**
 * Immutable snapshot for Phaser — structure known before the scene boots.
 * @param {string} subtype
 * @param {object} payload
 */
export function buildGraphChallengePackage(subtype, payload) {
  if (subtype === 'linked_list_memory') {
    const nodes = structuredClone(payload.nodes ?? [])
    const correctOrderIds = [...(payload.correctOrderIds ?? [])]
    const initialOrderIds = [...(payload.initialOrderIds ?? [])]
    return Object.freeze({
      subtype,
      questionText: payload.questionText ?? '',
      linked: Object.freeze({
        nodes,
        correctOrderIds: Object.freeze(correctOrderIds),
        initialOrderIds: Object.freeze(initialOrderIds),
      }),
    })
  }

  if (subtype === 'circular_queue') {
    const capacity = payload.capacity ?? 6
    const sequence = structuredClone(payload.sequence ?? [])
    const operationLines = Object.freeze(formatOperationPlanLines(sequence))
    const bankLetters = Object.freeze(bankLettersFromSequence(sequence))
    const baseQ = (payload.questionText ?? '').trim()
    const hint =
      '\n\nUse the colored step strip inside the simulator (green = enqueue, red = dequeue). When all steps are done, choose A–D below.'
    const questionText = baseQ ? `${baseQ}${hint}` : `Ring buffer challenge.${hint}`.trim()
    return Object.freeze({
      subtype,
      questionText,
      ring: Object.freeze({
        capacity,
        operationPlan: Object.freeze(sequence.map((s) => Object.freeze({ ...s }))),
        operationLines,
        bankLetters,
        choices: Object.freeze([...(payload.choices ?? [])]),
        answerIndex: payload.answerIndex ?? 0,
      }),
    })
  }

  if (subtype === 'dfs_tree') {
    const nodes = structuredClone(payload.nodes ?? [])
    const layout = structuredClone(payload.layout ?? {})
    const viewWidth = payload.viewWidth ?? 400
    const viewHeight = payload.viewHeight ?? 260
    const targetId = payload.targetId ?? 0
    const oneValidPostOrder = Object.freeze([...(payload.oneValidPostOrder ?? [])])
    const edges = []
    for (const n of nodes) {
      for (const c of n.children) {
        const a = layout[n.id]
        const b = layout[c]
        if (a && b) edges.push(Object.freeze({ x1: a.x, y1: a.y + 18, x2: b.x, y2: b.y - 18 }))
      }
    }
    const leaves = new Set(nodes.filter((n) => n.children.length === 0).map((n) => n.id))
    const allIds = nodes.map((n) => n.id)
    return Object.freeze({
      subtype,
      questionText: payload.questionText ?? '',
      tree: Object.freeze({
        nodes: Object.freeze(nodes.map((n) => Object.freeze({ ...n }))),
        layout: Object.freeze(
          Object.fromEntries(Object.entries(layout).map(([k, v]) => [k, Object.freeze({ ...v })])),
        ),
        viewWidth,
        viewHeight,
        targetId,
        oneValidPostOrder,
        edges: Object.freeze(edges),
        leaves: Object.freeze([...leaves]),
        allIds: Object.freeze(allIds),
        /** Precomputed canonical DFS post-order (children left-to-right); lock must match exactly */
        validateOrder: (order) => isCanonicalDfsPostOrder(oneValidPostOrder, order),
      }),
    })
  }

  return Object.freeze({ subtype, unknown: true })
}
