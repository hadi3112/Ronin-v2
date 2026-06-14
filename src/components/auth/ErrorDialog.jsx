import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import NeonButton from '../ui/NeonButton.jsx'

export default function ErrorDialog({ isVisible, title = "Something went wrong", message, onClose }) {
  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#0D0A0B] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(232,37,58,0.15)] overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-xl font-display uppercase tracking-widest text-white mb-3">
              {title}
            </h2>
            
            <p className="text-ronin-muted text-sm leading-relaxed mb-8">
              {message || "Please check your details and try again."}
            </p>

            <NeonButton onClick={onClose} className="w-full flex items-center justify-center py-3.5">
              Try Again
            </NeonButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
