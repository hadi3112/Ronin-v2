import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import mascot from '../../assets/mascot.png'

const lines = [
  "Hi! Looking to master coding? Let's go!",
  'New challenge detected on the right lane.',
  'Need hints? Open any level card.',
  'Ronin says: keep your streak alive.',
]

export default function MascotSpriteGuide() {
  const [visible, setVisible] = useState(true)
  const [lineIndex, setLineIndex] = useState(0)
  const current = useMemo(() => lines[lineIndex % lines.length], [lineIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v)
      setLineIndex((i) => i + 1)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none fixed right-4 top-[34%] z-40 hidden lg:block">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.35 }}
            className="flex items-end gap-3"
          >
            <div className="max-w-56 rounded-2xl border border-white/20 bg-black/75 px-4 py-2 text-xs font-semibold text-ronin-cream shadow-ronin backdrop-blur">
              {current}
            </div>
            <img src={mascot} alt="Ronin mascot sprite" className="h-28 w-20 object-contain drop-shadow-[0_0_16px_rgba(243,50,50,0.45)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
