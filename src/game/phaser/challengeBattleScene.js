import Phaser from 'phaser'
import { assetUrl } from './assetUrl.js'
import { CombatVisualState, COMBAT_TIMINGS_MS } from '../CombatStateMachine.js'
import { playSlashEffect, SLASH_FX_DEPTH } from './slashEffect.js'

/** Boss sprite sits this many px lower than Ronin baseline (Phaser coordinates). */
export const BOSS_TRIAL_BOSS_Y_OFFSET_PX = 22

const RONIN_STRIKES = [
  CombatVisualState.RONIN_STRIKE_1,
  CombatVisualState.RONIN_STRIKE_2,
  CombatVisualState.RONIN_STRIKE_3,
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

/** Ronin glow reduced ~60% vs prior (outer 3→1, quality 6→2). */
function applyRoninGlow(sprite) {
  if (sprite?.postFX?.addGlow) {
    sprite.postFX.addGlow(0xffffff, 1, 1, false, 0.11, 2)
  }
}

function applyBossGlow(sprite) {
  if (sprite?.postFX?.addGlow) {
    sprite.postFX.addGlow(0x881144, 3, 1, false, 0.11, 6)
  }
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

    this.add.rectangle(W / 2, H * 0.42, W, H * 0.88, 0x16110e, 1).setDepth(1)
    this.add.rectangle(W / 2, H * 0.88, W, H * 0.28, 0x0c0a08, 0.94).setDepth(2)
    this.add
      .rectangle(W / 2, H * 0.72, W * 0.85, H * 0.22, 0x2a1f18, 0.35)
      .setStrokeStyle(1, 0x5c4030, 0.4)
      .setDepth(3)

    this.roninRoot = this.add.container(W * 0.22, floorY).setDepth(8)
    this.bossRoot = this.add.container(W * 0.78, floorY + BOSS_TRIAL_BOSS_Y_OFFSET_PX).setDepth(9)

    const roninTex = this.textures.exists('ronin') ? 'ronin' : 'ronin_fb'
    const ronin = this.add.image(0, 0, roninTex).setOrigin(0.5, 1)
    ronin.setFlipX(true)
    let rScale = Math.min((W * 0.14) / ronin.width, (H * 0.38) / ronin.height, 1) * 1.5
    rScale = Math.min(rScale, (W * 0.34) / ronin.width, (H * 0.48) / ronin.height)
    ronin.setScale(rScale)
    applyRoninGlow(ronin)
    this.roninRoot.add(ronin)

    const bossTex = this.textures.exists('boss') ? 'boss' : 'ronin_fb'
    const boss = this.add.image(0, 0, bossTex).setOrigin(0.5, 1)
    const bScale = Math.min((W * 0.22) / boss.width, (H * 0.42) / boss.height, 1) * 2.6
    boss.setScale(bScale)
    applyBossGlow(boss)
    this.bossRoot.add(boss)

    this.roninSword = this.add.image(28, -H * 0.22, 'ronin_sword').setOrigin(0.8, 0.85).setVisible(false)
    this.roninSword.setScale(rScale * 0.95)
    this.roninRoot.add(this.roninSword)

    const redsFrame = this.textures.getFrame('reds_sword')
    const redsH = redsFrame?.height || 120
    const targetSwordH = H * 0.26
    const bossSwordScale = Math.max(targetSwordH / redsH, bScale * 0.55)
    this.bossSword = this.add.image(-32, -H * 0.22, 'reds_sword').setOrigin(0.2, 0.85).setVisible(false)
    this.bossSword.setScale(bossSwordScale)
    this.bossSword.setDepth(4)
    this.bossRoot.add(this.bossSword)
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
    if (this.bossRoot) this.bossRoot.setY(floorY + BOSS_TRIAL_BOSS_Y_OFFSET_PX)

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

    if (v === CombatVisualState.RONIN_DASH) this._spawnDashWind(true, roninX0, floorY, W, H)
    if (v === CombatVisualState.BOSS_DASH) this._spawnDashWind(false, bossX0, floorY, W, H)

    const beat = strikeBeat(v)

    const roninBody = /** @type {Phaser.GameObjects.Image} */ (this.roninRoot?.list[0])
    const bossBody = /** @type {Phaser.GameObjects.Image} */ (this.bossRoot?.list[0])

    const stagger =
      v === CombatVisualState.BOSS_HIT_STAGGER || v === CombatVisualState.RONIN_HIT_STAGGER
    if (stagger) {
      this.cameras.main.shake(200, 0.014)
      if (v === CombatVisualState.BOSS_HIT_STAGGER && bossBody) {
        this.tweens.add({
          targets: bossBody,
          alpha: { from: 1, to: 0.28 },
          duration: 55,
          yoyo: true,
          repeat: 3,
          ease: 'Sine.inOut',
        })
      }
      if (v === CombatVisualState.RONIN_HIT_STAGGER && roninBody) {
        this.tweens.add({
          targets: roninBody,
          alpha: { from: 1, to: 0.35 },
          duration: 55,
          yoyo: true,
          repeat: 3,
          ease: 'Sine.inOut',
        })
      }
    }

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
      if (v !== CombatVisualState.RONIN_HIT_STAGGER) {
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

    if (strikeRonin || strikeBoss) {
      const pull = 12
      this.time.delayedCall(30, () => {
        this.tweens.add({
          targets: this.roninRoot,
          x: roninX0 + pull,
          duration: 70,
          yoyo: true,
          ease: 'Quad.inOut',
        })
        this.tweens.add({
          targets: this.bossRoot,
          x: bossX0 - pull,
          duration: 70,
          yoyo: true,
          ease: 'Quad.inOut',
        })
      })
    }

    const strikeDurRonin = COMBAT_TIMINGS_MS.RONIN_STRIKE_BEAT * 0.88
    const strikeDurBoss = COMBAT_TIMINGS_MS.STRIKE_BEAT * 0.88

    const bossTorsoY = floorY + BOSS_TRIAL_BOSS_Y_OFFSET_PX - H * 0.34
    const roninTorsoY = floorY - H * 0.3

    if (this.roninSword) {
      this.tweens.killTweensOf(this.roninSword)
      this.roninSword.setVisible(showRoninSwordIdle || strikeRonin)
      this.roninSword.setPosition(28, -H * 0.22)
      this.roninSword.setAngle(-30)
      if (strikeRonin) {
        const sx = this.roninSword.x
        const sy = this.roninSword.y
        this.tweens.add({
          targets: this.roninSword,
          x: sx + 42,
          y: sy - 16,
          angle: { from: -52, to: 22 },
          duration: strikeDurRonin,
          yoyo: true,
          ease: 'Cubic.out',
        })
        playSlashEffect(this, {
          direction: 'left-to-right',
          color: 0x6ee7b7,
          coreColor: 0xe8fff4,
          center: { x: bossX0, y: bossTorsoY },
          span: Math.min(320, W * 0.5),
          arcHeight: Math.min(110, H * 0.28),
          duration: Math.floor(strikeDurRonin * 0.95),
          depth: SLASH_FX_DEPTH,
        })
      }
    }
    if (this.bossSword) {
      this.tweens.killTweensOf(this.bossSword)
      this.bossSword.setVisible(showBossSwordIdle || strikeBoss)
      this.bossSword.setPosition(-32, -H * 0.22)
      this.bossSword.setAngle(-30)
      if (strikeBoss) {
        const sx = this.bossSword.x
        const sy = this.bossSword.y
        this.tweens.add({
          targets: this.bossSword,
          x: sx - 48,
          y: sy - 18,
          angle: { from: -35, to: 42 },
          duration: strikeDurBoss,
          yoyo: true,
          ease: 'Cubic.out',
        })
        playSlashEffect(this, {
          direction: 'right-to-left',
          color: 0xff1744,
          coreColor: 0xffcdd2,
          center: { x: roninX0, y: roninTorsoY },
          span: Math.min(320, W * 0.5),
          arcHeight: Math.min(110, H * 0.28),
          duration: Math.floor(strikeDurBoss * 0.95),
          depth: SLASH_FX_DEPTH,
        })
      }
    }
  }

  /**
   * Gust lines behind a dash (Phaser graphics only).
   * @param {boolean} roninLeftToRight
   */
  _spawnDashWind(roninLeftToRight, anchorX, floorY, W, H) {
    const y = floorY - H * 0.08
    const dir = roninLeftToRight ? 1 : -1
    for (let i = 0; i < 5; i += 1) {
      const g = this.add.graphics().setDepth(6)
      const x0 = anchorX - dir * (20 + i * 14)
      const x1 = anchorX - dir * (110 + i * 22)
      g.lineStyle(3 - i * 0.35, 0xf5f5f5, 0.22 - i * 0.03)
      g.beginPath()
      g.moveTo(x0, y + i * 4)
      g.lineTo(x1, y - 6 - i * 3)
      g.strokePath()
      this.tweens.add({
        targets: g,
        alpha: 0,
        duration: 220 + i * 30,
        ease: 'Cubic.out',
        onComplete: () => g.destroy(),
      })
    }
  }
}
