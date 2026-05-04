/**
 * Random 4-level tree (levels 0–3): root at 0, leaves at 3.
 * Each internal node gets 2–5 children. Root forced to ≥2 children so “2nd level-1 node” exists.
 * @param {() => number} rng
 */

function rndInt(rng, lo, hi) {
  return lo + Math.floor(rng() * (hi - lo + 1))
}

/** @typedef {{ id: number; level: number; parent: number | null; children: number[] }} TreeNodeFlat */

/** @typedef {{ id: number; level: number; children: TreeNodeRec[] }} TreeNodeRec */

function buildRecursive(level, rng, nextIdRef) {
  const id = nextIdRef.v++
  if (level >= 3) {
    return { id, level, children: [] }
  }
  let k = rndInt(rng, 2, 5)
  if (level === 0) k = Math.max(2, k)
  const children = []
  for (let i = 0; i < k; i += 1) {
    children.push(buildRecursive(level + 1, rng, nextIdRef))
  }
  return { id, level, children }
}

function flatten(rec, parentId, out) {
  const childIds = rec.children.map((c) => c.id)
  out.push({ id: rec.id, level: rec.level, parent: parentId, children: childIds })
  for (const c of rec.children) flatten(c, rec.id, out)
}

/** Post-order: children left-to-right, then node */
function onePostOrder(rec) {
  const seq = []
  for (const c of rec.children) seq.push(...onePostOrder(c))
  seq.push(rec.id)
  return seq
}

/**
 * @param {TreeNodeFlat[]} flat
 * @param {number[]} order
 */
export function isValidPostOrder(flat, order) {
  const n = flat.length
  if (order.length !== n) return false
  const seen = new Set()
  for (const id of order) {
    if (seen.has(id)) return false
    seen.add(id)
  }
  if (seen.size !== n) return false
  const pos = new Map(order.map((id, i) => [id, i]))
  for (const node of flat) {
    const pi = pos.get(node.id)
    if (pi === undefined) return false
    for (const cid of node.children) {
      const ci = pos.get(cid)
      if (ci === undefined || ci >= pi) return false
    }
  }
  return true
}

/**
 * @param {TreeNodeFlat[]} flat
 * @param {Record<number, { x: number; y: number }>} layout
 */
export function computeLayoutFromTree(rootRec) {
  /** @type {Record<number, { x: number; y: number }>} */
  const layout = {}

  function subtreeWidth(rec) {
    if (!rec.children.length) return 1
    return rec.children.reduce((s, c) => s + subtreeWidth(c), 0)
  }

  function place(rec, left, depth, yStep) {
    const w = subtreeWidth(rec)
    const x = left + (w - 1) / 2
    const y = depth * yStep
    layout[rec.id] = { x: x * 72 + 40, y: y + 36 }
    let cursor = left
    for (const c of rec.children) {
      const cw = subtreeWidth(c)
      place(c, cursor, depth + 1, yStep)
      cursor += cw
    }
  }

  place(rootRec, 0, 0, 64)
  let maxX = 120
  let maxY = 120
  for (const p of Object.values(layout)) {
    maxX = Math.max(maxX, p.x + 48)
    maxY = Math.max(maxY, p.y + 48)
  }
  return { layout, viewWidth: maxX + 40, viewHeight: maxY + 40 }
}

/**
 * @param {() => number} rng
 */
export function buildDfsTreePayload(rng) {
  const nextIdRef = { v: 1 }
  const rootRec = buildRecursive(0, rng, nextIdRef)
  /** @type {TreeNodeFlat[]} */
  const flat = []
  flatten(rootRec, null, flat)

  const rootChildren = rootRec.children
  const targetId = rootChildren[1]?.id ?? rootChildren[0].id
  const oneValidPostOrder = onePostOrder(rootRec)

  const { layout, viewWidth, viewHeight } = computeLayoutFromTree(rootRec)

  return {
    kind: 'dfs_tree',
    questionText:
      'Depth-first search (post-order): tap nodes in an order where every node is selected only after all of its children have been selected. Your goal is to “delete” the second child of the root (marked with a red target and cross) — build a full traversal that respects DFS post-order for the whole tree.',
    rootId: rootRec.id,
    targetId,
    nodes: flat,
    layout,
    viewWidth,
    viewHeight,
    oneValidPostOrder,
  }
}
