import Phaser from 'phaser'
import { assetUrl } from './assetUrl.js'
import { CombatVisualState, COMBAT_TIMINGS_MS } from '../CombatStateMachine.js'

const RONIN_STRIKES = [
  CombatVisualState.RONIN_STRIKE_1,
  CombatVisualState.RONIN_STRIKE_2,
  CombatVisualState.RONIN_STRIKE_3,
  CombatVisualState.RONIN_STRIKE_4,
  CombatVisualState.RONIN_STRIKE_5,
  CombatVisualState.RONIN_STRIKE_6,
]

const BOSS_OVERHEADS = [
  CombatVisualState.BOSS_OVERHEAD_1,
  CombatVisualState.BOSS_OVERHEAD_2,
  CombatVisualState.BOSS_OVERHEAD_3,
]

function dashRoninPx(visual, W) {
  const atk =
    visual === CombatVisualState.RONIN_DASH ||
    RONIN_STRIKES.includes(visual) ||
    visual === CombatVisualState.BOSS_HIT_STAGGER
  if (atk) return Math.max(100, Math.min(W * 0.46, 420))
  if (
    visual === CombatVisualState.RONIN_DASH_BACK ||
    visual === CombatVisualState.IDLE ||
    visual === CombatVisualState.HIT_RESOLVE
  )
    return 0
  if (visual === CombatVisualState.RONIN_HIT_STAGGER) return Math.max(36, Math.min(W * 0.14, 140))
  return 0
}

function dashBossPx(visual, W) {
  const atk =
    visual === CombatVisualState.BOSS_DASH ||
    BOSS_OVERHEADS.includes(visual) ||
    visual === CombatVisualState.RONIN_HIT_STAGGER
  if (atk) return -Math.max(100, Math.min(W * 0.46, 420))
  if (
    visual === CombatVisualState.BOSS_DASH_BACK ||
    visual === CombatVisualState.IDLE ||
    visual === CombatVisualState.HIT_RESOLVE
  )
    return 0
  if (visual === CombatVisualState.BOSS_HIT_STAGGER) return -Math.max(36, Math.min(W * 0.14, 140))
  return 0
}

function strikeBeat(visual) {
  const i = RONIN_STRIKES.indexOf(visual)
  if (i >= 0) return { side: 'ronin', i }
  if (visual === CombatVisualState.BOSS_OVERHEAD_1) return { side: 'boss', i: 0 }
  if (visual === CombatVisualState.BOSS_OVERHEAD_2) return { side: 'boss', i: 1 }
  if (visual === CombatVisualState.BOSS_OVERHEAD_3) return { side: 'boss', i: 2 }
  return null
}

export class ChallengeBattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChallengeBattleScene' })
    /** @type {Phaser.GameObjects.Container | null} */
    this.roninRoot = null
    /** @type {Phaser.GameObjects.Container | null} */
    this.bossRoot = null
    /** @type {Phaser.GameObjects.Image | null} */
    this.roninSword = null
    /** @type {Phaser.GameObjects.Image | null} */
    this.bossSword = null
    /** @type {string} */
    this._lastSyncKey = ''
  }

  preload() {
    this.load.image('ronin', assetUrl('images/mascot_img.png'))
    this.load.image('ronin_fb', assetUrl('images/ronin-mascot.png'))
    this.load.image('boss', assetUrl('images/samurai_red.png'))
    this.load.image('ronin_sword', assetUrl('images/ronin_sword.png'))
    this.load.image('reds_sword', assetUrl('images/reds_sword.png'))
    this.load.once('loaderror', (file) => {
      console.warn('[ChallengeBattleScene] load error', file?.key, file?.url)
    })
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height
    const floorY = H * 0.82

    this.roninRoot = this.add.container(W * 0.22, floorY)
    this.bossRoot = this.add.container(W * 0.78, floorY)

    const roninTex = this.textures.exists('ronin') ? 'ronin' : 'ronin_fb'
    const ronin = this.add.image(0, 0, roninTex).setOrigin(0.5, 1)
    ronin.setFlipX(true)
    const rScale = Math.min((W * 0.14) / ronin.width, (H * 0.38) / ronin.height, 1)
    ronin.setScale(rScale)
    this.roninRoot.add(ronin)

    const bossTex = this.textures.exists('boss') ? 'boss' : 'ronin_fb'
    const boss = this.add.image(0, 0, bossTex).setOrigin(0.5, 1)
    const bScale = Math.min((W * 0.22) / boss.width, (H * 0.42) / boss.height, 1) * 2.6
    boss.setScale(bScale)
    this.bossRoot.add(boss)

    this.roninSword = this.add.image(28, -H * 0.22, 'ronin_sword').setOrigin(0.8, 0.85).setVisible(false)
    this.roninSword.setScale(rScale * 0.95)
    this.roninRoot.add(this.roninSword)

    this.bossSword = this.add.image(-28, -H * 0.22, 'reds_sword').setOrigin(0.2, 0.85).setVisible(false)
    this.bossSword.setScale(bScale * 0.35)
    this.bossRoot.add(this.bossSword)

    this._slashGfx = this.add.graphics().setDepth(10).setVisible(false)
  }

  /**
   * @param {{ combatVisualState: string; roninHp: number; bossHp: number; maxHp: number; phase: string }} p
   */
  syncCombat(p) {
    const { combatVisualState: v, phase, roninHp, bossHp } = p
    const key = `${v}|${phase}|${roninHp}|${bossHp}`
    if (key === this._lastSyncKey) return
    this._lastSyncKey = key

    const W = this.scale.width
    const H = this.scale.height
    const floorY = H * 0.82
    if (this.roninRoot) this.roninRoot.setY(floorY)
    if (this.bossRoot) this.bossRoot.setY(floorY)

    const roninX0 = W * 0.22 + dashRoninPx(v, W)
    const bossX0 = W * 0.78 + dashBossPx(v, W)

    this.tweens.killTweensOf([this.roninRoot, this.bossRoot])
    this.tweens.add({
      targets: this.roninRoot,
      x: roninX0,
      duration: COMBAT_TIMINGS_MS.DASH * 0.85,
      ease: 'Cubic.out',
    })
    this.tweens.add({
      targets: this.bossRoot,
      x: bossX0,
      duration: COMBAT_TIMINGS_MS.DASH * 0.85,
      ease: 'Cubic.out',
    })

    const stagger =
      v === CombatVisualState.BOSS_HIT_STAGGER || v === CombatVisualState.RONIN_HIT_STAGGER
    if (stagger) this.cameras.main.shake(180, 0.012)

    const beat = strikeBeat(v)

    const roninBody = /** @type {Phaser.GameObjects.Image} */ (this.roninRoot?.list[0])
    const bossBody = /** @type {Phaser.GameObjects.Image} */ (this.bossRoot?.list[0])

    if (roninBody) {
      this.tweens.killTweensOf(roninBody)
      if (RONIN_STRIKES.includes(v)) {
        this.tweens.add({
          targets: roninBody,
          angle: { from: -10, to: 14 },
          duration: Math.max(280, COMBAT_TIMINGS_MS.RONIN_STRIKE_BEAT * 0.9),
          yoyo: true,
          ease: 'Quad.out',
        })
      } else {
        roninBody.setAngle(0)
      }
      const roninKo = phase === 'defeat' || v === CombatVisualState.RONIN_KO
      if (roninKo) {
        roninBody.setAngle(72)
        this.roninRoot.setY(floorY + 36)
      }
      if (v === CombatVisualState.RONIN_HIT_STAGGER) {
        this.tweens.add({
          targets: roninBody,
          alpha: { from: 1, to: 0.55 },
          duration: 90,
          yoyo: true,
          repeat: 1,
        })
      } else {
        roninBody.setAlpha(1)
      }
    }

    if (bossBody) {
      this.tweens.killTweensOf(bossBody)
      if (BOSS_OVERHEADS.includes(v)) {
        this.tweens.add({
          targets: bossBody,
          angle: { from: 12, to: -18 },
          duration: COMBAT_TIMINGS_MS.STRIKE_BEAT * 0.95,
          yoyo: true,
          ease: 'Quad.out',
        })
      } else {
        bossBody.setAngle(0)
      }
      const bossKo = phase === 'victory' || v === CombatVisualState.BOSS_KO
      bossBody.setAlpha(bossKo ? 0.15 : 1)
      if (bossKo) bossBody.setTint(0x888888)
      else bossBody.clearTint()
    }

    const showRoninSwordIdle =
      v === CombatVisualState.RONIN_DASH || v === CombatVisualState.RONIN_DASH_BACK
    const showBossSwordIdle = v === CombatVisualState.BOSS_DASH || v === CombatVisualState.BOSS_DASH_BACK
    const strikeRonin = beat?.side === 'ronin'
    const strikeBoss = beat?.side === 'boss'

    if (this.roninSword) {
      this.tweens.killTweensOf(this.roninSword)
      this.roninSword.setVisible(showRoninSwordIdle || strikeRonin)
      this.roninSword.setAngle(-30)
      if (strikeRonin) {
        this.tweens.add({
          targets: this.roninSword,
          angle: { from: -30, to: 12 },
          duration: COMBAT_TIMINGS_MS.RONIN_STRIKE_BEAT * 0.85,
          yoyo: true,
          ease: 'Sine.inOut',
        })
      }
    }
    if (this.bossSword) {
      this.tweens.killTweensOf(this.bossSword)
      this.bossSword.setVisible(showBossSwordIdle || strikeBoss)
      this.bossSword.setAngle(-30)
      if (strikeBoss) {
        this.tweens.add({
          targets: this.bossSword,
          angle: { from: -30, to: 18 },
          duration: COMBAT_TIMINGS_MS.STRIKE_BEAT * 0.85,
          yoyo: true,
          ease: 'Sine.inOut',
        })
      }
    }

    if (strikeRonin || strikeBoss) this.flashSlash(strikeRonin, W, H)
  }

  flashSlash(isRonin, W, H) {
    const g = this._slashGfx
    if (!g) return
    g.clear()
    g.setVisible(true)
    const x0 = isRonin ? W * 0.18 : W * 0.72
    const y0 = H * 0.55
    const x1 = isRonin ? W * 0.55 : W * 0.35
    const y1 = H * 0.62
    const col = isRonin ? 0x6ee7b7 : 0xff1744
    g.lineStyle(6, col, 0.85)
    g.lineBetween(x0, y0, x1, y1)
    g.setAlpha(1)
    this.tweens.add({
      targets: g,
      alpha: 0,
      duration: 220,
      ease: 'Cubic.out',
      onComplete: () => {
        g.clear()
        g.setVisible(false)
        g.setAlpha(1)
      },
    })
  }
}
