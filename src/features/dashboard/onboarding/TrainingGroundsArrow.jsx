import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Neon red pulsing arrow that points at the Training Grounds tab button.
 * Mounts as a fixed-position overlay anchored to the tab element.
 * Disappears automatically once the user taps Training Grounds.
 *
 * @param {{ tabRef: React.RefObject<HTMLElement>; visible: boolean }} props
 */
export default function TrainingGroundsArrow({ tabRef, visible }) {
  const [pos, setPos] = useState(null)
  const rafRef = useRef(null)

  // Keep arrow position synced to the tab button as layout shifts
  useEffect(() => {
    if (!visible) {
      setPos(null)
      return
    }

    const updatePos = () => {
      if (!tabRef.current) return
      const rect = tabRef.current.getBoundingClientRect()
      setPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
      })
    }

    updatePos()
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, { passive: true })

    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', updatePos)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [visible, tabRef])

  return (
    <AnimatePresence>
      {visible && pos && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            transform: 'translateX(-50%)',
            zIndex: 55,
            pointerEvents: 'none',
          }}
        >
          {/* Arrow SVG — points upward toward the tab */}
          <motion.svg
            width="28"
            height="32"
            viewBox="0 0 28 32"
            fill="none"
            style={{ display: 'block' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
          >
            {/* Drop shadow glow */}
            <filter id="arrowGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feFlood floodColor="rgba(220,40,40,0.8)" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Arrow pointing up */}
            <path
              d="M14 2 L26 28 L14 22 L2 28 Z"
              fill="rgba(220,40,40,0.95)"
              stroke="rgba(255,100,80,0.7)"
              strokeWidth="1.5"
              filter="url(#arrowGlow)"
            />
          </motion.svg>

          {/* Label */}
          <motion.p
            style={{
              marginTop: 6,
              textAlign: 'center',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,100,80,0.9)',
              textShadow: '0 0 12px rgba(220,40,40,0.8)',
              whiteSpace: 'nowrap',
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            Training Grounds
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
