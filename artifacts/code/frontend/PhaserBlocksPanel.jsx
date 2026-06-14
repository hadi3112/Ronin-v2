/**
 * PURPOSE: Renders the interactive drag-and-drop Phaser (v3) canvas workspace. Generates draggable code block tiles, tracks vertical slots dynamically, draws real-time directional arrows during drag sessions, and features click-expandable explanations.
 * DEPENDENCIES: 
 *   - React (v19)
 *   - Phaser (v3)
 *   - Framer Motion
 *   - Lucide Icons (passed from parent props if needed)
 * USAGE CONTEXT: Replaces the Monaco code editor pane when users enter the visual drag-and-drop mode. Integrates directly with the parent React layout, returning ordered block listings whenever tiles are swapped. Explicitly binds touch actions (touchAction: 'pan-y' and capture: false) to preserve vertical scrolling capability on mobile.
 */

import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { motion } from 'framer-motion'

export default function PhaserBlocksPanel({
  problemId,
  blocks,
  onOrderChange,
  onDropdownOpened,
}) {
  const containerRef = useRef(null)
  const gameRef = useRef(null)

  // Use a ref to store callbacks so the Phaser scene can always access the latest closures
  const callbacksRef = useRef({ onOrderChange, onDropdownOpened })
  useEffect(() => {
    callbacksRef.current = { onOrderChange, onDropdownOpened }
  }, [onOrderChange, onDropdownOpened])

  // Initialize blocks in a shuffled order on load
  const [shuffledBlocks] = useState(() => {
    const list = [...blocks]
    // Fisher-Yates shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[list[i], list[j]] = [list[j], list[i]]
    }
    return list
  })

  useEffect(() => {
    const parent = containerRef.current
    if (!parent) return

    const callbacks = callbacksRef.current
    // Subtract 20px from width to leave room for the scrollbar on the right side
    const w = Math.max(320, (parent.clientWidth || 550) - 20)
    // Dynamically calculate the total height required by all blocks in the vertical layout
    const h = Math.max(550, blocks.length * 130)

    // Technical requirement: resolution at minimum 2x the display pixel ratio
    const dpr = Math.min(2, window.devicePixelRatio || 1) * 2

    class TrainingBlocksScene extends Phaser.Scene {
      constructor() {
        super('TrainingBlocksScene')
        this.blockObjects = []
        this.expandedBlocks = new Set()
        this.dragArrowGraphics = null
        this.dragStartPos = null
      }

      create() {
        this.dragArrowGraphics = this.add.graphics()
        this.dragArrowGraphics.setDepth(100)

        // Instantiate shuffled list of block configs
        const configs = shuffledBlocks.map((b, index) => ({
          ...b,
          currentSlot: index, // 0-indexed position
        }))

        this.blockObjects = configs.map((config) => {
          return this.createBlockTile(config)
        })

        this.updateBlockLayout()

        // Trigger initial shuffled order callback to React immediately on mount
        const initialOrder = [...this.blockObjects]
          .sort((a, b) => a.currentSlot - b.currentSlot)
          .map((b) => ({ id: b.id, correctPosition: b.correctPosition }))
        
        // Wait a tick to ensure component mount is complete
        setTimeout(() => {
          if (callbacksRef.current && callbacksRef.current.onOrderChange) {
            callbacksRef.current.onOrderChange(initialOrder)
          }
        }, 50)

        // Handle dragging
        this.input.on('dragstart', (pointer, gameObject) => {
          gameObject.setDepth(50)
          this.dragStartPos = { x: gameObject.x, y: gameObject.y }
        })

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
          // Keep X steady, only drag Y for vertical stack alignment
          gameObject.y = dragY

          // Draw real-time animated arrow from start position to current position
          this.dragArrowGraphics.clear()
          this.dragArrowGraphics.lineStyle(3, 0xef4444, 0.85) // Red glow
          
          // Draw arrowhead
          const startX = w / 2
          const startY = this.dragStartPos.y
          const endX = w / 2
          const endY = dragY

          this.dragArrowGraphics.lineBetween(startX, startY, endX, endY)
          
          // Draw a small circle at start and arrowhead at end
          this.dragArrowGraphics.fillStyle(0xef4444, 1)
          this.dragArrowGraphics.fillCircle(startX, startY, 6)

          const direction = endY > startY ? 1 : -1
          this.dragArrowGraphics.beginPath()
          this.dragArrowGraphics.moveTo(endX - 10, endY - direction * 10)
          this.dragArrowGraphics.lineTo(endX, endY)
          this.dragArrowGraphics.lineTo(endX + 10, endY - direction * 10)
          this.dragArrowGraphics.closePath()
          this.dragArrowGraphics.fillPath()
        })

        this.input.on('dragend', (pointer, gameObject) => {
          this.dragArrowGraphics.clear()
          gameObject.setDepth(1)

          // 1. Sort all blocks by their current Y coordinate positions
          const sortedByY = [...this.blockObjects].sort((a, b) => a.y - b.y)

          // 2. Re-assign slots sequentially based on Y-level coordinates
          sortedByY.forEach((block, idx) => {
            block.currentSlot = idx
          })

          // 3. Trigger order change callback to React
          const updatedOrder = [...this.blockObjects]
            .sort((a, b) => a.currentSlot - b.currentSlot)
            .map((b) => ({ id: b.id, correctPosition: b.correctPosition }))

          if (callbacksRef.current && callbacksRef.current.onOrderChange) {
            callbacksRef.current.onOrderChange(updatedOrder)
          }

          this.updateBlockLayout(true) // Animate snap
        })
      }

      createBlockTile(config) {
        // We create a Phaser container to hold all tile graphics & text
        const container = this.add.container(0, 0)
        container.id = config.id
        container.correctPosition = config.correctPosition
        container.currentSlot = config.currentSlot
        container.code = config.code
        container.explanation = config.explanation

        // Background tile graphics
        const tileBg = this.add.graphics()
        container.add(tileBg)
        container.tileBg = tileBg

        const lines = config.code.split('\n').length
        const baseHeight = 30 + lines * 18

        // Large high-contrast position number (made smaller and centered inside circle)
        const positionText = this.add.text(-w / 2 + 35, 0, (config.currentSlot + 1).toString(), {
          fontFamily: 'Outfit, Inter, sans-serif',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#ffffff',
        }).setOrigin(0.5)
        container.add(positionText)
        container.positionText = positionText

        // Code text (min 14px at native resolution, vertically centered)
        const codeText = this.add.text(-w / 2 + 75, -baseHeight / 2 + 8, config.code, {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#e2e8f0', // Crisp slate
          lineSpacing: 4,
        })
        container.add(codeText)

        // Dropdown Toggle button text with neon glow arrow (centered vertically)
        const glowButton = this.add.text(w / 2 - 40, 0, '▼', {
          fontFamily: 'Outfit, Inter, sans-serif',
          fontSize: '18px',
          color: '#ef4444',
          shadow: {
            color: '#ef4444',
            blur: 10,
            stroke: true,
            fill: true,
          },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        container.add(glowButton)

        // Add explanation container (hidden by default)
        const expText = this.add.text(-w / 2 + 75, baseHeight / 2 - 32, config.explanation, {
          fontFamily: 'Outfit, Inter, sans-serif',
          fontSize: '13px',
          color: '#94a3b8',
          wordWrap: { width: w - 150 },
        }).setVisible(false)
        container.add(expText)
        container.expText = expText

        // Click dropdown toggle
        glowButton.on('pointerdown', (pointer, localX, localY, event) => {
          event.stopPropagation()
          const isExpanded = this.expandedBlocks.has(config.id)
          if (isExpanded) {
            this.expandedBlocks.delete(config.id)
            glowButton.setText('▼')
          } else {
            this.expandedBlocks.add(config.id)
            glowButton.setText('▲')
            if (callbacksRef.current && callbacksRef.current.onDropdownOpened) {
              callbacksRef.current.onDropdownOpened(config.id)
            }
          }
          this.updateBlockLayout(true)
        })

        // Make container interactive & draggable
        container.setSize(w - 20, baseHeight)
        container.setInteractive({ draggable: true })

        return container
      }

      updateBlockLayout(animate = false) {
        let currentY = 20

        // Sort by current slot index
        const sorted = [...this.blockObjects].sort((a, b) => a.currentSlot - b.currentSlot)

        sorted.forEach((block, index) => {
          // Update visual position number text
          block.positionText.setText((index + 1).toString())

          const isExpanded = this.expandedBlocks.has(block.id)
          const lines = block.code.split('\n').length
          const baseHeight = 30 + lines * 18
          const targetHeight = isExpanded ? baseHeight + 45 : baseHeight
          const targetY = currentY + targetHeight / 2

          // Redraw background & badge
          block.tileBg.clear()
          block.tileBg.fillStyle(0x0a0506, 0.9) // Dark transparent
          block.tileBg.lineStyle(1.5, isExpanded ? 0xef4444 : 0x334155, 0.8) // Glowing/Slate border
          
          const rectX = -w / 2 + 10
          const rectY = -targetHeight / 2
          const rectW = w - 20
          const rectH = targetHeight
          
          block.tileBg.fillRoundedRect(rectX, rectY, rectW, rectH, 12)
          block.tileBg.strokeRoundedRect(rectX, rectY, rectW, rectH, 12)

          // Redraw badge background (made smaller with radius 16)
          block.tileBg.fillStyle(0xef4444, 0.25)
          block.tileBg.fillCircle(-w / 2 + 35, 0, 16)

          block.expText.setVisible(isExpanded)
          if (isExpanded) {
            block.expText.y = targetHeight / 2 - 32
          }

          if (animate) {
            this.tweens.add({
              targets: block,
              x: w / 2,
              y: targetY,
              duration: 200,
              ease: 'Power2',
            })
          } else {
            block.x = w / 2
            block.y = targetY
          }

          currentY += targetHeight + 10
        })
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: w,
      height: h,
      transparent: true,
      backgroundColor: '#00000000',
      banner: false,
      audio: false,
      antialias: true,
      roundPixels: true,
      pixelArt: false,
      resolution: dpr,
      scene: [TrainingBlocksScene],
      scale: {
        mode: Phaser.Scale.NONE,
      },
      input: {
        touch: {
          capture: false
        },
        mouse: {
          capture: false
        }
      }
    })
    gameRef.current = game

    return () => {
      gameRef.current = null
      game.destroy(true)
    }
  }, [shuffledBlocks])

  return (
    <div
      ref={containerRef}
      className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden custom-scrollbar rounded-2xl border border-white/[0.08] bg-black/40"
      style={{ touchAction: 'pan-y' }}
      aria-label="Phaser Drag-and-Drop Code Blocks Canvas"
    />
  )
}
