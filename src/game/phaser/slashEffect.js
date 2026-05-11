import Phaser from 'phaser'

/** Default draw order so slashes sit above fighters (Phaser depth). */
export const SLASH_FX_DEPTH = 520

function ensureSlashSparkTexture(scene) {
  if (scene.textures.exists('slash_spark')) return
  const g = scene.make.graphics({ x: 0, y: 0, add: false })
  g.fillStyle(0xffffff, 1)
  g.fillCircle(4, 4, 4)
  g.generateTexture('slash_spark', 8, 8)
  g.destroy()
}

/** Soft elongated streak stamped along a swipe curve (Phaser textures + tweens). */
function ensureBladeStreakTexture(scene) {
  if (scene.textures.exists('slash_blade_streak')) return
  const bw = 72
  const bh = 14
  const g = scene.make.graphics({ x: 0, y: 0, add: false })
  for (let x = 0; x < bw; x += 1) {
    const k = x / (bw - 1)
    const a = Math.pow(Math.sin(k * Math.PI), 1.35) * 0.75
    g.fillStyle(0xffffff, a)
    g.fillRect(x, 0, 1, bh)
  }
  g.generateTexture('slash_blade_streak', bw, bh)
  g.destroy()
}

/**
 * Curved swipe: staggered blade streaks along a quadratic path + bright core line + sparks.
 * Uses only Phaser (textures, images, tweens, particles, graphics) — no DOM.
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
 *   depth?: number
 * }} opts
 */
export function playSlashEffect(scene, opts) {
  const {
    direction,
    color,
    coreColor = 0xffffff,
    center,
    span = 260,
    arcHeight = 88,
    duration = 200,
    depth = SLASH_FX_DEPTH,
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
    y0 = midY + 14
    y2 = midY + 22
  } else {
    x0 = midX + span / 2
    x2 = midX - span / 2
    y0 = midY + 14
    y2 = midY + 22
  }

  const cxCtrl = midX + (direction === 'left-to-right' ? span * 0.08 : -span * 0.08)
  const cyCtrl = midY - arcHeight

  const curve = new Phaser.Curves.QuadraticBezier(
    new Phaser.Math.Vector2(x0, y0),
    new Phaser.Math.Vector2(cxCtrl, cyCtrl),
    new Phaser.Math.Vector2(x2, y2),
  )

  const p0 = new Phaser.Math.Vector2()
  const p1 = new Phaser.Math.Vector2()
  const tan = new Phaser.Math.Vector2()

  ensureBladeStreakTexture(scene)
  ensureSlashSparkTexture(scene)

  const segments = 26
  const staggerMs = Math.max(6, Math.floor((duration * 0.55) / segments))
  const bladeImages = []

  for (let i = 0; i < segments; i += 1) {
    const t = i / (segments - 1)
    curve.getPoint(t, p0)
    const t2 = Phaser.Math.Clamp(t + 0.04, 0, 1)
    curve.getPoint(t2, p1)
    tan.set(p1.x - p0.x, p1.y - p0.y).normalize()
    const ang = Math.atan2(tan.y, tan.x)
    const seg = scene.add
      .image(p0.x, p0.y, 'slash_blade_streak')
      .setOrigin(0.5, 0.5)
      .setDepth(depth + 1)
      .setRotation(ang)
      .setTint(i % 3 === 0 ? coreColor : color)
      .setBlendMode('ADD')
      .setAlpha(0)
    const segScale = 0.55 + (i / segments) * 0.35
    seg.setScale(segScale, (0.55 + (1 - i / segments) * 0.45) * 0.9)
    bladeImages.push(seg)
  }

  scene.tweens.add({
    targets: bladeImages,
    alpha: { from: 0, to: 0.92 },
    duration: 55,
    stagger: staggerMs,
    ease: 'Cubic.out',
    onComplete: () => {
      scene.tweens.add({
        targets: bladeImages,
        alpha: 0,
        duration: Math.max(120, duration * 0.55),
        stagger: Math.max(4, Math.floor(staggerMs * 0.65)),
        ease: 'Cubic.in',
        onComplete: () => {
          bladeImages.forEach((s) => s.destroy())
        },
      })
    },
  })

  const gCore = scene.add.graphics().setDepth(depth + 4)
  const state = { t: 0, alpha: 1 }
  const point = new Phaser.Math.Vector2()

  const drawCore = (tEnd) => {
    gCore.clear()
    const steps = 40
    const te = Phaser.Math.Clamp(tEnd, 0.03, 1)
    gCore.lineStyle(3, coreColor, 0.95 * state.alpha)
    gCore.beginPath()
    for (let i = 0; i <= Math.ceil(steps * te); i += 1) {
      curve.getPoint(i / steps, point)
      if (i === 0) gCore.moveTo(point.x, point.y)
      else gCore.lineTo(point.x, point.y)
    }
    gCore.strokePath()
    gCore.lineStyle(7, color, 0.28 * state.alpha)
    gCore.beginPath()
    for (let i = 0; i <= Math.ceil(steps * te); i += 1) {
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
    onUpdate: () => drawCore(state.t),
    onComplete: () => {
      scene.tweens.add({
        targets: state,
        alpha: 0,
        duration: Math.floor(duration * 0.45),
        ease: 'Cubic.in',
        onUpdate: () => drawCore(1),
        onComplete: () => gCore.destroy(),
      })
    },
  })

  const burstX = cxCtrl
  const burstY = cyCtrl + arcHeight * 0.12
  const angleMin = direction === 'left-to-right' ? -40 : 195
  const angleMax = direction === 'left-to-right' ? 40 : 345

  const emitter = scene.add.particles(burstX, burstY, 'slash_spark', {
    speed: { min: 100, max: 280 },
    angle: { min: angleMin, max: angleMax },
    scale: { start: 0.65, end: 0 },
    alpha: { start: 0.95, end: 0 },
    lifespan: { min: 120, max: 200 },
    tint: [color, coreColor],
    blendMode: 'ADD',
    emitting: false,
  })
  emitter.setDepth(depth + 2)

  scene.time.delayedCall(Math.floor(duration * 0.1), () => {
    emitter.explode(28, burstX, burstY)
  })
  scene.time.delayedCall(duration + 380, () => {
    emitter.destroy()
  })
}
