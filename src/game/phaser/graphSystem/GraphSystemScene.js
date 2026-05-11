import Phaser from 'phaser'
import { explainLinkedListOrder, isCorrectLinkedListOrder } from '../../linkedListPuzzle.js'
import { GraphChallengeEventType, emitGraphChallengeEvent } from '../../graphChallenge/graphChallengeBus.js'
import { applyRingStep, emptyRingState } from '../../graphChallenge/ringOps.js'

const DEPTH_BG = 0
const DEPTH_GRAPH = 10
const DEPTH_UI = 40

const LL_FONT =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export class GraphSystemScene extends Phaser.Scene {
  constructor() {
    super('GraphSystemScene')
    /** @type {{ package: object; questionId: string; getDisabled: () => boolean } | null} */
    this._boot = null
    this._blocked = false
    /** @type {Phaser.GameObjects.Text | null} */
    this._dfsSeqText = null
    /** @type {Phaser.GameObjects.GameObject[]} */
    this._dfsSprites = []
  }

  /**
   * @param {{ package: object; questionId: string; getDisabled: () => boolean }} data
   */
  init(data) {
    this._boot = data
  }

  create() {
    const boot = this._boot
    if (!boot?.package) {
      this.events.emit('graph-ready')
      return
    }
    const { package: pkg, questionId, getDisabled } = boot
    this._getDisabled = getDisabled
    this._questionId = questionId
    this._pkg = pkg

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a0a0c, 1).setOrigin(0).setDepth(DEPTH_BG)
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height * 0.5, 0x1a1210, 0.5)
      .setOrigin(0, 0)
      .setDepth(DEPTH_BG + 1)

    emitGraphChallengeEvent(questionId, pkg.subtype, GraphChallengeEventType.CHALLENGE_STARTED, {})

    if (pkg.subtype === 'linked_list_memory') this._buildLinkedList(pkg.linked)
    else if (pkg.subtype === 'circular_queue') this._buildCircular(pkg.ring)
    else if (pkg.subtype === 'dfs_tree') this._buildDfs(pkg.tree)
    else this.add.text(20, 40, 'Unknown graph challenge', { fontSize: '14px', color: '#ccc' }).setDepth(DEPTH_UI)

    this.events.emit('graph-ready')
  }

  _blockedInput() {
    return this._blocked || this._getDisabled?.()
  }

  _emitResult(correct) {
    this._blocked = true
    emitGraphChallengeEvent(this._questionId, this._pkg.subtype, correct ? GraphChallengeEventType.ANSWER_CORRECT : GraphChallengeEventType.ANSWER_WRONG, { correct })
  }

  _buildLinkedList(L) {
    const nodesById = new Map(L.nodes.map((n) => [n.id, n]))
    /** @type {string[]} */
    let orderIds = [...L.initialOrderIds]
    const correct = [...L.correctOrderIds]
    const cardW = 116
    const cardH = 152
    const rx = 14
    const hw = cardW / 2
    const hh = cardH / 2
    const nSlots = orderIds.length
    const margin = 40
    const gap = Math.max(
      76,
      Math.min(124, (this.scale.width - margin * 2 - cardW) / Math.max(1, nSlots - 1)),
    )
    const rowOuterW = (nSlots - 1) * gap + cardW
    const leftCenterX = this.scale.width / 2 - rowOuterW / 2 + hw
    const slotXs = orderIds.map((_, i) => leftCenterX + i * gap)
    const slotY = Math.min(228, Math.max(168, this.scale.height * 0.38))

    const cardMap = new Map()
    /** @type {string | null} */
    let glowId = null
    const textRes = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1.25 : 1.25)

    const clearCards = () => {
      cardMap.forEach((c) => c.destroy())
      cardMap.clear()
    }

    /**
     * @param {Phaser.GameObjects.Graphics} body
     * @param {boolean} highlighted
     */
    const paintBody = (body, highlighted) => {
      body.clear()
      if (typeof body.fillGradientStyle === 'function') {
        body.fillGradientStyle(0x273549, 0x273549, 0x111827, 0x0b1220, 1)
      } else {
        body.fillStyle(0x152238, 1)
      }
      body.fillRoundedRect(-hw, -hh, cardW, cardH, rx)
      if (highlighted) {
        body.lineStyle(2.25, 0xffffff, 0.92)
      } else {
        body.lineStyle(1.25, 0x2dd4bf, 0.55)
      }
      body.strokeRoundedRect(-hw, -hh, cardW, cardH, rx)
    }

    /**
     * @param {Phaser.GameObjects.Graphics} neon
     * @param {boolean} on
     */
    const paintNeon = (neon, on) => {
      neon.clear()
      if (!on) return
      const layers = [10, 7, 4]
      for (const ex of layers) {
        neon.lineStyle(2.5, 0xffffff, 0.07 + (11 - ex) * 0.028)
        neon.strokeRoundedRect(-hw - ex, -hh - ex, cardW + ex * 2, cardH + ex * 2, rx + 5)
      }
    }

    const refreshGlow = () => {
      cardMap.forEach((cont) => {
        const id = cont.getData('nodeId')
        const on = glowId === id
        const body = /** @type {Phaser.GameObjects.Graphics} */ (cont.getByName('llBody'))
        const neon = /** @type {Phaser.GameObjects.Graphics} */ (cont.getByName('llNeon'))
        if (body) paintBody(body, on)
        if (neon) paintNeon(neon, on)
      })
    }

    const redraw = () => {
      clearCards()
      orderIds.forEach((id, idx) => {
        const n = nodesById.get(id)
        if (!n) return
        const cx = slotXs[idx] ?? leftCenterX + idx * gap
        const cont = this.add.container(cx, slotY).setDepth(DEPTH_GRAPH)

        const shadow = this.add.graphics()
        shadow.fillStyle(0x000000, 0.4)
        shadow.fillRoundedRect(-hw + 4, -hh + 6, cardW, cardH, rx)
        cont.add(shadow)

        const neon = this.add.graphics().setName('llNeon')
        cont.add(neon)

        const body = this.add.graphics().setName('llBody')
        paintBody(body, glowId === id)
        paintNeon(neon, glowId === id)
        cont.add(body)

        const label = (y, text, size, color, mono = false) => {
          const t = this.add
            .text(0, y, text, {
              fontFamily: mono ? `"Consolas", "Monaco", monospace` : LL_FONT,
              fontSize: `${size}px`,
              color,
              fontStyle: mono ? '500' : '600',
            })
            .setOrigin(0.5)
          if (t.setResolution) t.setResolution(textRes)
          return t
        }

        cont.add(label(-hh + 22, 'DATA', 9, '#94a3b8'))
        cont.add(label(-hh + 44, String(n.data), 17, '#f8fafc'))
        cont.add(label(-hh + 74, 'PREV', 9, '#94a3b8'))
        cont.add(label(-hh + 94, String(n.prev), 12, '#fde68a', true))
        cont.add(label(-hh + 122, 'ADDR', 8, '#94a3b8'))
        cont.add(label(-hh + 138, String(n.address), 11, '#bae6fd', true))

        cont.setSize(cardW, cardH)
        cont.setInteractive({ draggable: true, useHandCursor: true })
        cont.setData('nodeId', id)
        this.input.setDraggable(cont)

        cont.on('pointerdown', (pointer) => {
          if (this._blockedInput() || pointer.button !== 0) return
          glowId = id
          refreshGlow()
        })

        cardMap.set(id, cont)
      })
    }

    const findSlotIndex = (worldX) => {
      let best = 0
      let bestD = Infinity
      for (let i = 0; i < slotXs.length; i += 1) {
        const d = Math.abs(worldX - slotXs[i])
        if (d < bestD) {
          bestD = d
          best = i
        }
      }
      return best
    }

    this.input.on('dragstart', (_p, obj) => {
      if (this._blockedInput()) return
      const nid = obj.getData('nodeId')
      if (nid) {
        glowId = nid
        refreshGlow()
      }
      this.children.bringToTop(obj)
    })

    this.input.on('drag', (_p, obj, dragX) => {
      if (this._blockedInput()) return
      obj.x = dragX
    })

    this.input.on('dragend', (_p, obj) => {
      if (this._blockedInput()) return
      const id = obj.getData('nodeId')
      const from = orderIds.indexOf(id)
      const to = findSlotIndex(obj.x)
      if (from < 0) return
      const next = [...orderIds]
      next.splice(from, 1)
      next.splice(to, 0, id)
      orderIds = next
      glowId = id
      this.time.delayedCall(0, redraw)
    })

    redraw()

    this._textButton(this.scale.width / 2, slotY + cardH / 2 + 52, 'Lock in order', () => {
      if (this._blockedInput() || this._blocked) return
      if (isCorrectLinkedListOrder(orderIds, correct)) {
        this._emitResult(true)
        return
      }
      const w = explainLinkedListOrder(L.nodes, orderIds, correct)
      this._showPanel(
        `Wrong order\nCorrect chain: ${w.correctLabels}\nYours: ${w.userLabels}\n\n${w.why}`,
        () => this._emitResult(false),
      )
    }).setDepth(DEPTH_UI + 2)
  }

  _buildCircular(R) {
    const W = this.scale.width
    const H = this.scale.height
    const textRes = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1.25 : 1.25)
    const plan = R.operationPlan ?? []
    const cap = R.capacity
    /** @type {{ buf: (string|null)[]; head: number; size: number }} */
    let state = emptyRingState(cap)
    let opIdx = 0
    let emittedComplete = false

    const ringCx = W * 0.56
    const ringCy = H * 0.32
    const ringR = Math.min(100, W * 0.15)

    const bankX = 168
    const bankTop = H * 0.14
    const chipSize = 44
    const chipHalf = chipSize / 2
    const chipGap = 50

    /** Wider vertical gap so PUSH / POP panels never overlap */
    const sockW = 86
    const sockH = 88
    const pushCX = W - 76
    const pushCY = H * 0.1
    const popCX = W - 76
    const popCY = H * 0.82
    const pushZone = new Phaser.Geom.Rectangle(pushCX - sockW / 2, pushCY - sockH / 2, sockW, sockH)
    const popZone = new Phaser.Geom.Rectangle(popCX - sockW / 2, popCY - sockH / 2, sockW, sockH)

    const gRing = this.add.graphics().setDepth(DEPTH_GRAPH)
    const slotBlobs = /** @type {Phaser.GameObjects.Container[]} */ ([])
    /** @type {Phaser.GameObjects.Text[]} */
    const slotIndexTexts = []
    /** @type {Phaser.GameObjects.GameObject[]} */
    const ringAnnot = []
    const chipHome = new Map()
    /** @type {Phaser.GameObjects.Container[]} */
    const chips = []
    /** @type {{ g: Phaser.GameObjects.Graphics; lab: Phaser.GameObjects.Text; val: Phaser.GameObjects.Text; hint: Phaser.GameObjects.Text; step: object }[]} */
    const timelineItems = []

    const stepLetters = ['k', 'l', 'm', 'n']

    /** Front value before each dequeue step (for static hint text). */
    const dequeueDragLetter = new Map()
    {
      let sim = emptyRingState(cap)
      for (let i = 0; i < plan.length; i += 1) {
        const st = plan[i]
        if (st.op === 'dequeue' && sim.size > 0) {
          const hv = sim.buf[sim.head % cap]
          if (hv != null) dequeueDragLetter.set(i, String(hv))
        }
        const ns = applyRingStep(sim, st)
        if (ns) sim = ns
      }
    }

    const strokeDashedArrow = (g, x0, y0, x1, y1, opts = {}) => {
      const dash = opts.dash ?? 10
      const gap = opts.gap ?? 6
      const color = opts.color ?? 0xe4e4e7
      const alpha = opts.alpha ?? 0.75
      const width = opts.width ?? 2
      const dx = x1 - x0
      const dy = y1 - y0
      const len = Math.hypot(dx, dy)
      if (len < 4) return
      const ux = dx / len
      const uy = dy / len
      let dist = 0
      g.lineStyle(width, color, alpha)
      while (dist < len - 14) {
        const d0 = dist
        const d1 = Math.min(dist + dash, len - 14)
        g.beginPath()
        g.moveTo(x0 + ux * d0, y0 + uy * d0)
        g.lineTo(x0 + ux * d1, y0 + uy * d1)
        g.strokePath()
        dist += dash + gap
      }
      const bx = x1 - ux * 12
      const by = y1 - uy * 12
      const px = -uy * 7
      const py = ux * 7
      g.fillStyle(color, alpha)
      g.fillTriangle(x1, y1, bx + px, by + py, bx - px, by - py)
    }

    const dragGuideG = this.add.graphics().setDepth(DEPTH_GRAPH + 8)
    const clearDragGuide = () => {
      dragGuideG.clear()
    }
    const showDragGuideFromHome = (homeX, homeY) => {
      const step = plan[opIdx]
      if (!step) {
        clearDragGuide()
        return
      }
      const tx = step.op === 'enqueue' ? pushCX : popCX
      const ty = step.op === 'enqueue' ? pushCY : popCY
      dragGuideG.clear()
      strokeDashedArrow(dragGuideG, homeX, homeY, tx, ty, { dash: 11, gap: 7, color: 0xfbbf24, alpha: 0.9, width: 2.2 })
    }

    const mkText = (x, y, str, size, color, bold = false) => {
      const t = this.add
        .text(x, y, str, {
          fontFamily: LL_FONT,
          fontSize: `${size}px`,
          color,
          fontStyle: bold ? '700' : '500',
        })
        .setOrigin(0.5)
      if (t.setResolution) t.setResolution(textRes)
      return t
    }

    const drawRingTrack = () => {
      gRing.clear()
      gRing.lineStyle(3, 0x52525b, 0.45)
      gRing.strokeCircle(ringCx, ringCy, ringR)
      gRing.lineStyle(1.5, 0x27272a, 0.9)
      gRing.strokeCircle(ringCx, ringCy, ringR - 3)
    }

    const paintSocket = (cx, cy, title, sub) => {
      const c = this.add.container(cx, cy).setDepth(DEPTH_GRAPH + 2)
      const g = this.add.graphics()
      const hw = sockW / 2
      const hh = sockH / 2
      g.fillStyle(0x18181b, 0.94)
      g.lineStyle(2, 0xa1a1aa, 0.45)
      g.fillRoundedRect(-hw, -hh, sockW, sockH, 12)
      g.strokeRoundedRect(-hw, -hh, sockW, sockH, 12)
      c.add(g)
      c.add(mkText(0, -26, title, 12, '#fafafa', true))
      c.add(mkText(0, 2, sub, 9, '#a3a3a3'))
      c.add(
        this.add
          .graphics()
          .lineStyle(2, 0xe4e4e7, 0.22)
          .strokeRoundedRect(-30, 22, 60, 26, 8),
      )
      return c
    }

    paintSocket(pushCX, pushCY, 'PUSH', 'Drop next value')
    paintSocket(popCX, popCY, 'POP', 'Drop front value')

    const progress = mkText(W / 2, H * 0.82, '', 12, '#d4d4d8')
    progress.setDepth(DEPTH_UI)

    const paintTimeline = () => {
      timelineItems.forEach((row, i) => {
        const step = row.step
        const isEnq = step.op === 'enqueue'
        const done = i < opIdx
        const cur = i === opIdx
        const fill = isEnq ? 0x15803d : 0xdc2626
        let alpha = 0.28
        let stroke = 0x737373
        let strokeA = 0.35
        if (done) {
          alpha = 0.72
          stroke = isEnq ? 0x86efac : 0xfca5a5
          strokeA = 0.65
        }
        if (cur) {
          alpha = 1
          stroke = 0xfef08a
          strokeA = 0.95
        }
        row.g.clear()
        row.g.fillStyle(fill, alpha)
        row.g.lineStyle(cur ? 2.5 : 1.5, stroke, strokeA)
        row.g.fillCircle(0, 0, 16)
        row.g.strokeCircle(0, 0, 16)
        const inner = step.op === 'enqueue' ? String(step.value ?? '?') : '−'
        row.val.setText(inner)
        row.val.setAlpha(cur ? 1 : done ? 0.85 : 0.55)
        if (row.hint) row.hint.setAlpha(done ? 0.35 : cur ? 1 : 0.55)
      })
    }

    const tlX = 52
    const tlY0 = H * 0.1
    const tlStep = Math.min(36, Math.max(22, (H * 0.62) / Math.max(plan.length, 1)))
    const hintWrap = Math.min(210, Math.max(140, W * 0.26))
    plan.forEach((step, i) => {
      const cy = tlY0 + i * tlStep + tlStep * 0.45
      const cont = this.add.container(tlX, cy).setDepth(DEPTH_GRAPH + 3)
      const g = this.add.graphics()
      const val = mkText(0, 0, '', 12, '#fafafa', true)
      const lab = mkText(0, -24, stepLetters[i % 4], 11, '#d4d4d4', true)
      const sl = stepLetters[i % 4]
      let hintLines = ''
      if (step.op === 'enqueue') {
        const v = String(step.value ?? '?')
        hintLines = `${sl}: Drag the "${v}" chip to the PUSH socket (top right).`
      } else {
        const dv = dequeueDragLetter.get(i) ?? '?'
        hintLines = `${sl}: Drag the "${dv}" chip to the POP socket (bottom right). It is the front value.`
      }
      const hint = this.add
        .text(28, 0, hintLines, {
          fontFamily: LL_FONT,
          fontSize: '10px',
          color: '#c8c8c8',
          fontStyle: '500',
          wordWrap: { width: hintWrap },
          lineSpacing: 3,
        })
        .setOrigin(0, 0.5)
      if (hint.setResolution) hint.setResolution(textRes)
      cont.add(g)
      cont.add(val)
      cont.add(lab)
      cont.add(hint)
      timelineItems.push({ g, lab, val, hint, step })
    })
    if (plan.length > 1) {
      const gLine = this.add.graphics().setDepth(DEPTH_GRAPH + 2)
      gLine.lineStyle(2, 0x52525b, 0.5)
      gLine.beginPath()
      gLine.moveTo(tlX, tlY0 + tlStep * 0.45)
      gLine.lineTo(tlX, tlY0 + (plan.length - 0.55) * tlStep)
      gLine.strokePath()
    }
    paintTimeline()

    const updateProgress = () => {
      paintTimeline()
      progress.setText(`Simulator steps: ${opIdx} / ${plan.length}`)
      if (opIdx >= plan.length && !emittedComplete) {
        emittedComplete = true
        emitGraphChallengeEvent(this._questionId, this._pkg.subtype, GraphChallengeEventType.RING_OPS_COMPLETE, {})
      }
    }

    const redrawSlots = () => {
      slotBlobs.forEach((s) => s.destroy())
      slotBlobs.length = 0
      slotIndexTexts.forEach((t) => t.destroy())
      slotIndexTexts.length = 0
      ringAnnot.forEach((o) => o.destroy())
      ringAnnot.length = 0
      const headIdx = state.size > 0 ? state.head % cap : -1
      const tailIdx = state.size > 0 ? (state.head + state.size - 1) % cap : -1
      for (let i = 0; i < cap; i += 1) {
        const angle = (i / cap) * Math.PI * 2 - Math.PI / 2
        const px = ringCx + (ringR - 22) * Math.cos(angle)
        const py = ringCy + (ringR - 22) * Math.sin(angle)
        const cont = this.add.container(px, py).setDepth(DEPTH_GRAPH + 1)
        const g = this.add.graphics()
        const isHead = i === headIdx && state.size > 0
        const isTail = i === tailIdx && state.size > 0
        g.fillStyle(isHead ? 0x450a0a : 0x18181b, isHead ? 0.55 : 0.92)
        g.lineStyle(2, isHead ? 0xf87171 : isTail ? 0x34d399 : 0x3f3f46, isHead ? 0.95 : isTail ? 0.75 : 0.55)
        g.fillRoundedRect(-26, -26, 52, 52, 12)
        g.strokeRoundedRect(-26, -26, 52, 52, 12)
        cont.add(g)
        const letter = state.buf[i] == null ? '·' : String(state.buf[i])
        cont.add(mkText(0, 0, letter, 16, isHead ? '#fef2f2' : '#fafafa', true))
        const ix = ringCx + (ringR + 26) * Math.cos(angle)
        const iy = ringCy + (ringR + 26) * Math.sin(angle)
        const idxT = this.add
          .text(ix, iy, String(i), { fontFamily: LL_FONT, fontSize: '10px', color: '#737373' })
          .setOrigin(0.5)
          .setDepth(DEPTH_GRAPH)
        slotIndexTexts.push(idxT)
        slotBlobs.push(cont)
      }
      if (state.size > 0 && headIdx >= 0) {
        const rad = ringR + 44
        const ah = (headIdx / cap) * Math.PI * 2 - Math.PI / 2
        const ax = ringCx + rad * Math.cos(ah)
        const ay = ringCy + rad * Math.sin(ah)
        const t1 = mkText(ax, ay - 10, 'FRONT \u25B6', 10, '#fca5a5', true)
        ringAnnot.push(t1)
        const th = (tailIdx / cap) * Math.PI * 2 - Math.PI / 2
        const tx = ringCx + rad * Math.cos(th)
        const ty = ringCy + rad * Math.sin(th)
        const t2 = mkText(tx, ty + 10, '\u25C0 REAR', 10, '#6ee7b7', true)
        ringAnnot.push(t2)
      }
      drawRingTrack()
    }

    const returnChip = (cont, fail = false) => {
      const hid = cont.getData('homeId')
      const home = chipHome.get(hid)
      if (!home) return
      this.tweens.add({
        targets: cont,
        x: home.x,
        y: home.y,
        duration: fail ? 220 : 160,
        ease: fail ? 'Back.easeOut' : 'Quad.out',
      })
    }

    const makeChip = (id, label, display, hx, hy) => {
      const cont = this.add.container(hx, hy).setDepth(DEPTH_GRAPH + 6)
      const body = this.add.graphics()
      body.fillStyle(0x172554, 0.96)
      body.lineStyle(2, 0x38bdf8, 0.75)
      body.fillRoundedRect(-chipHalf, -chipHalf, chipSize, chipSize, 12)
      body.strokeRoundedRect(-chipHalf, -chipHalf, chipSize, chipSize, 12)
      cont.add(body)
      const t = mkText(0, 0, display, 16, '#fafafa', true)
      cont.add(t)
      cont.setSize(chipSize, chipSize)
      cont.setInteractive({ draggable: true, useHandCursor: true })
      cont.setData('homeId', id)
      cont.setData('chipLetter', label)
      cont.setData('isPop', false)
      this.input.setDraggable(cont)
      chipHome.set(id, { x: hx, y: hy })
      chips.push(cont)
      return cont
    }

    let y = bankTop
    R.bankLetters.forEach((letter) => {
      const id = `v-${letter}`
      makeChip(id, letter, letter, bankX, y)
      y += chipGap
    })

    redrawSlots()
    drawRingTrack()
    updateProgress()

    chips.forEach((chip) => {
      chip.on('pointerdown', () => {
        if (this._blockedInput()) return
        const hid = chip.getData('homeId')
        if (hid == null) return
        const home = chipHome.get(hid)
        if (!home) return
        showDragGuideFromHome(home.x, home.y)
      })
    })
    this.input.on('pointerup', clearDragGuide)

    this.input.on('dragstart', (_p, obj) => {
      if (this._blockedInput()) return
      if (!obj.getData || obj.getData('homeId') == null) return
      this.children.bringToTop(obj)
    })

    this.input.on('drag', (_p, obj, dragX, dragY) => {
      if (this._blockedInput()) return
      if (obj.getData?.('homeId') == null) return
      obj.setPosition(dragX, dragY)
    })

    this.input.on('dragend', (_p, obj) => {
      clearDragGuide()
      if (this._blockedInput() || this._blocked) return
      if (obj.getData?.('homeId') == null) return
      const step = plan[opIdx]
      if (!step) {
        returnChip(obj, false)
        return
      }
      const wx = obj.x
      const wy = obj.y
      const onPush = pushZone.contains(wx, wy)
      const onPop = popZone.contains(wx, wy)
      const chipLetter = String(obj.getData('chipLetter') ?? '')

      let ok = false
      if (onPush && step.op === 'enqueue' && chipLetter === String(step.value)) {
        const ns = applyRingStep(state, step)
        if (ns) {
          state = ns
          opIdx += 1
          ok = true
        }
      } else if (onPop && step.op === 'dequeue' && state.size > 0) {
        const headVal = state.buf[state.head % cap]
        if (headVal != null && chipLetter === String(headVal)) {
          const ns = applyRingStep(state, step)
          if (ns) {
            state = ns
            opIdx += 1
            ok = true
          }
        }
      }

      if (ok) {
        redrawSlots()
        updateProgress()
        returnChip(obj, false)
      } else {
        returnChip(obj, true)
      }
    })

    if (plan.length === 0 && !emittedComplete) {
      emittedComplete = true
      emitGraphChallengeEvent(this._questionId, this._pkg.subtype, GraphChallengeEventType.RING_OPS_COMPLETE, {})
    }
  }

  _buildDfs(T) {
    const padX = 14
    const padTop = 40
    const actionBarH = 56
    const seqBlockH = 36
    const padBottom = actionBarH + seqBlockH + 18
    const gw = this.scale.width - padX * 2
    const gh = this.scale.height - padTop - padBottom

    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    const nodePad = 26
    for (const n of T.nodes) {
      const p = T.layout[n.id]
      if (!p) continue
      minX = Math.min(minX, p.x - nodePad)
      maxX = Math.max(maxX, p.x + nodePad)
      minY = Math.min(minY, p.y - nodePad)
      maxY = Math.max(maxY, p.y + nodePad)
    }
    if (!Number.isFinite(minX)) {
      minX = 0
      maxX = 200
      minY = 0
      maxY = 200
    }
    const bw = Math.max(maxX - minX, 64)
    const bh = Math.max(maxY - minY, 64)
    const midX = (minX + maxX) / 2
    const midY = (minY + maxY) / 2
    const s = Math.min(gw / bw, gh / bh, 1)
    const originX = this.scale.width / 2
    const originY = padTop + gh / 2
    /** @param {number} x @param {number} y */
    const map = (x, y) => ({
      x: originX + (x - midX) * s,
      y: originY + (y - midY) * s,
    })

    const nodeR = Math.max(14, Math.min(22, 20 * Math.max(s, 0.38)))
    const crossHalf = Math.max(6, 8 * s)

    const gEdges = this.add.graphics().setDepth(DEPTH_GRAPH)
    gEdges.lineStyle(Math.max(1.5, 2 * s), 0xf43f5e, 0.5)
    T.edges.forEach((e) => {
      const a = map(e.x1, e.y1)
      const b = map(e.x2, e.y2)
      gEdges.beginPath()
      gEdges.moveTo(a.x, a.y)
      gEdges.lineTo(b.x, b.y)
      gEdges.strokePath()
    })

    /** @type {number[]} */
    let sequence = []
    const nTotal = T.allIds.length

    const seqY = this.scale.height - padBottom + 8
    const dfsRes = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1.25 : 1.25)
    this._dfsSeqText = this.add
      .text(padX, seqY, '', {
        fontFamily: LL_FONT,
        fontSize: '13px',
        color: '#a8a29e',
        wordWrap: { width: this.scale.width - padX * 2 },
      })
      .setDepth(DEPTH_UI)
    if (this._dfsSeqText.setResolution) this._dfsSeqText.setResolution(dfsRes)

    const updateSeq = () => {
      if (this._dfsSeqText) this._dfsSeqText.setText(`Selection: ${sequence.join(' → ') || '—'}`)
    }

    const redrawNodes = () => {
      this._dfsSprites.forEach((obj) => obj.destroy())
      this._dfsSprites = []
      for (const n of T.nodes) {
        const p = T.layout[n.id]
        if (!p) continue
        const { x, y } = map(p.x, p.y)
        const on = sequence.includes(n.id)
        const isTarget = n.id === T.targetId
        const fill = isTarget ? 0xdc2626 : on ? 0x15803d : 0xfafafa
        const stroke = isTarget ? 0xfecaca : on ? 0x86efac : 0xe11d48
        const circle = this.add.circle(x, y, nodeR, fill, isTarget ? 0.55 : on ? 0.4 : 1).setStrokeStyle(2, stroke, 0.95)
        circle.setInteractive({ useHandCursor: true })
        circle.setDepth(DEPTH_GRAPH + 2)
        circle.on('pointerdown', () => {
          if (this._blockedInput() || this._blocked) return
          const i = sequence.indexOf(n.id)
          if (i >= 0) sequence = sequence.filter((_, j) => j !== i)
          else sequence = [...sequence, n.id]
          redrawNodes()
          updateSeq()
        })
        const col = on || isTarget ? '#ffffff' : '#171717'
        const t = this.add
          .text(x, y + 1, String(n.id), {
            fontFamily: LL_FONT,
            fontSize: Math.max(11, Math.round(13 * s)),
            color: col,
            fontStyle: '800',
          })
          .setOrigin(0.5)
          .setDepth(DEPTH_GRAPH + 3)
        if (t.setResolution) t.setResolution(dfsRes)
        this._dfsSprites.push(circle, t)
        if (isTarget) {
          const xg = this.add.graphics().setDepth(DEPTH_GRAPH + 4)
          xg.lineStyle(2, 0xffffff, 1)
          xg.beginPath()
          xg.moveTo(x - crossHalf, y - crossHalf)
          xg.lineTo(x + crossHalf, y + crossHalf)
          xg.moveTo(x + crossHalf, y - crossHalf)
          xg.lineTo(x - crossHalf, y + crossHalf)
          xg.strokePath()
          this._dfsSprites.push(xg)
        }
      }
      updateSeq()
    }

    redrawNodes()

    const barY = this.scale.height - actionBarH / 2 - 10
    const btnW = Math.min(168, (this.scale.width - 48) / 2 - 8)
    const gap = 12
    const cx = this.scale.width / 2
    const offset = btnW / 2 + gap / 2

    this._pillButton(cx - offset, barY, btnW, 44, 'Lock traversal', 'primary', () => {
      if (this._blockedInput() || this._blocked) return
      const full =
        sequence.length === nTotal &&
        sequence.length === new Set(sequence).size &&
        T.allIds.every((id) => sequence.includes(id))
      if (!full || !T.validateOrder(sequence)) {
        this._showPanel(
          !full
            ? 'Include every node exactly once before locking.'
            : 'Not the DFS post-order for this tree. Children are visited left to right; finish each subtree (post-order) before its parent.',
          () => this._emitResult(false),
          `Correct order: ${T.oneValidPostOrder.join(' → ')}\nYours: ${sequence.join(' → ') || '—'}`,
        )
        return
      }
      this._emitResult(true)
    }).setDepth(DEPTH_UI + 2)

    this._pillButton(cx + offset, barY, btnW, 44, 'Reset', 'secondary', () => {
      if (this._blockedInput() || this._blocked) return
      sequence = []
      redrawNodes()
    }).setDepth(DEPTH_UI + 2)
  }

  /**
   * @param {number} cx
   * @param {number} cy
   * @param {number} w
   * @param {number} h
   * @param {string} label
   * @param {'primary' | 'secondary'} variant
   * @param {() => void} onClick
   */
  _pillButton(cx, cy, w, h, label, variant, onClick) {
    const cont = this.add.container(cx, cy)
    const g = this.add.graphics()
    const isPrimary = variant === 'primary'
    const fill = isPrimary ? 0xc41e3a : 0x27272a
    const stroke = isPrimary ? 0xfe9a9a : 0xa3a3a3
    const fillA = isPrimary ? 0.98 : 0.94
    const res = Math.min(2.5, typeof window !== 'undefined' ? window.devicePixelRatio || 1.5 : 1.5)
    const paint = (fillC, strokeC, strokeA) => {
      g.clear()
      g.fillStyle(fillC, fillA)
      g.lineStyle(1.5, strokeC, strokeA)
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 14)
      g.strokeRoundedRect(-w / 2, -h / 2, w, h, 14)
    }
    paint(fill, stroke, isPrimary ? 0.55 : 0.42)
    const txt = this.add
      .text(0, 0, label, {
        fontFamily: LL_FONT,
        fontSize: isPrimary ? '15px' : '14px',
        color: isPrimary ? '#fff7f7' : '#f5f5f5',
        fontStyle: '600',
      })
      .setOrigin(0.5)
    if (txt.setResolution) txt.setResolution(res)
    cont.add([g, txt])
    cont.setSize(w, h)
    cont.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains)
    cont.input.useHandCursor = true
    cont.on('pointerover', () => {
      cont.setScale(1.03)
      if (isPrimary) paint(0xa61e32, 0xffe4e6, 0.75)
      else paint(0x3f3f46, 0xd4d4d4, 0.55)
    })
    cont.on('pointerout', () => {
      cont.setScale(1)
      paint(fill, stroke, isPrimary ? 0.55 : 0.42)
    })
    cont.on('pointerup', () => {
      if (this._blockedInput()) return
      onClick()
    })
    return cont
  }

  _textButton(cx, cy, label, onClick) {
    const txt = this.add
      .text(cx, cy, label, {
        fontSize: '13px',
        color: '#fafafa',
        backgroundColor: 'rgba(244,63,94,0.25)',
        padding: { x: 16, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    txt.on('pointerup', onClick)
    return txt
  }

  _showPanel(mainText, onContinue, extra = '') {
    const w = this.scale.width - 32
    const h = 220
    const bx = 16
    const by = this.scale.height - h - 16
    const bg = this.add.graphics().setDepth(DEPTH_UI + 20)
    bg.fillStyle(0x1c1917, 0.94)
    bg.lineStyle(2, 0xf59e0b, 0.45)
    bg.fillRoundedRect(bx, by, w, h, 14)
    bg.strokeRoundedRect(bx, by, w, h, 14)
    const body = [mainText, extra].filter(Boolean).join('\n\n')
    const t = this.add
      .text(bx + 16, by + 16, body, { fontSize: '11px', color: '#fef3c7', wordWrap: { width: w - 32 } })
      .setDepth(DEPTH_UI + 21)
    const btn = this._textButton(bx + w / 2, by + h - 36, 'Continue', () => {
      bg.destroy()
      t.destroy()
      btn.destroy()
      onContinue()
    })
    btn.setDepth(DEPTH_UI + 22)
  }
}
