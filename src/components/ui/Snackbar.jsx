import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'
import { useEffect } from 'react'

export default function Snackbar({ isVisible, message, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-[#111] border border-ronin-crimson/30 shadow-[0_4px_30px_rgba(232,37,58,0.2)] rounded-lg px-4 py-3 text-white"
        >
          <CheckCircle className="w-5 h-5 text-ronin-crimson" />
          <span className="text-sm font-medium tracking-wide">{message}</span>
          <button 
            onClick={onClose}
            className="ml-2 text-white/50 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
