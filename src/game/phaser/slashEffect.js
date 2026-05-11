import Phaser from 'phaser'

/**
 * @param {Phaser.Scene} scene
 */
function ensureSlashSparkTexture(scene) {
  if (scene.textures.exists('slash_spark')) return
  const g = scene.make.graphics({ x: 0, y: 0, add: false })
  g.fillStyle(0xffffff, 1)
  g.fillCircle(4, 4, 4)
  g.generateTexture('slash_spark', 8, 8)
  g.destroy()
}

/**
 * Fruit-ninja style curved slash: bezier stroke reveal + quick fade + spark burst.
 * All Phaser-native (Graphics + Particles + Tweens).
 *
 * @param {Phaser.Scene} scene
 * @param {{
 *   direction: 'left-to-right' | 'right-to-left'
 *   color: number
 *   coreColor?: number
 *   center: { x: number; y: number }
 *   span?: number
 *   arcHeight?: number
 *   duration?: number
 * }} opts
 */
export function playSlashEffect(scene, opts) {
  const {
    direction,
    color,
    coreColor = 0xffffff,
    center,
    span = 240,
    arcHeight = 78,
    duration = 210,
  } = opts

  const midX = center.x
  const midY = center.y
  let x0
  let y0
  let x2
  let y2
  if (direction === 'left-to-right') {
    x0 = midX - span / 2
    x2 = midX + span / 2
    y0 = midY + 18
    y2 = midY + 26
  } else {
    x0 = midX + span / 2
    x2 = midX - span / 2
    y0 = midY + 18
    y2 = midY + 26
  }

  const cxCtrl = midX + (direction === 'left-to-right' ? span * 0.06 : -span * 0.06)
  const cyCtrl = midY - arcHeight

  const curve = new Phaser.Curves.QuadraticBezier(
    new Phaser.Math.Vector2(x0, y0),
    new Phaser.Math.Vector2(cxCtrl, cyCtrl),
    new Phaser.Math.Vector2(x2, y2),
  )

  const gGlow = scene.add.graphics().setDepth(22)
  const gCore = scene.add.graphics().setDepth(23)
  const point = new Phaser.Math.Vector2()
  const state = { t: 0, alpha: 1 }

  const draw = (tEnd) => {
    gGlow.clear()
    gCore.clear()
    const steps = 36
    const te = Phaser.Math.Clamp(tEnd, 0.02, 1)
    const outerW = 12 + 8 * (1 - state.alpha)
    const innerW = 4 + 3 * (1 - state.alpha)

    gGlow.lineStyle(outerW, color, 0.5 * state.alpha)
    gGlow.beginPath()
    for (let i = 0; i <= Math.ceil(steps * te); i++) {
      curve.getPoint(i / steps, point)
      if (i === 0) gGlow.moveTo(point.x, point.y)
      else gGlow.lineTo(point.x, point.y)
    }
    gGlow.strokePath()

    gCore.lineStyle(innerW, coreColor, 0.92 * state.alpha)
    gCore.beginPath()
    for (let i = 0; i <= Math.ceil(steps * te); i++) {
      curve.getPoint(i / steps, point)
      if (i === 0) gCore.moveTo(point.x, point.y)
      else gCore.lineTo(point.x, point.y)
    }
    gCore.strokePath()
  }

  scene.tweens.add({
    targets: state,
    t: 1,
    duration,
    ease: 'Cubic.out',
    onUpdate: () => draw(state.t),
    onComplete: () => {
      scene.tweens.add({
        targets: state,
        alpha: 0,
        duration: Math.floor(duration * 0.5),
        ease: 'Cubic.in',
        onUpdate: () => draw(1),
        onComplete: () => {
          gGlow.destroy()
          gCore.destroy()
        },
      })
    },
  })

  ensureSlashSparkTexture(scene)
  const burstX = cxCtrl
  const burstY = cyCtrl + arcHeight * 0.15
  const angleMin = direction === 'left-to-right' ? -35 : 200
  const angleMax = direction === 'left-to-right' ? 35 : 340

  const emitter = scene.add.particles(burstX, burstY, 'slash_spark', {
    speed: { min: 90, max: 240 },
    angle: { min: angleMin, max: angleMax },
    scale: { start: 0.55, end: 0 },
    alpha: { start: 0.9, end: 0 },
    lifespan: { min: 140, max: 220 },
    tint: color,
    blendMode: 'ADD',
    emitting: false,
  })
  emitter.setDepth(21)
  scene.time.delayedCall(Math.floor(duration * 0.12), () => {
    emitter.explode(direction === 'left-to-right' ? 22 : 22, burstX, burstY)
  })
  scene.time.delayedCall(duration + 320, () => {
    emitter.destroy()
  })
}
