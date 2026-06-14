import { motion, AnimatePresence } from 'framer-motion'
import { MailCheck, ArrowRight } from 'lucide-react'
import NeonButton from '../ui/NeonButton.jsx'

export default function VerificationDialog({ isVisible, email, onClose }) {
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
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-ronin-crimson/10 blur-[50px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-ronin-crimson/10 border border-ronin-crimson/30 rounded-full flex items-center justify-center mb-6">
              <MailCheck className="w-8 h-8 text-ronin-crimson" />
            </div>

            <h2 className="text-2xl font-display uppercase tracking-widest text-white mb-3">
              Account Created
            </h2>
            
            <p className="text-ronin-muted text-sm leading-relaxed mb-6">
              Welcome to Ronin. We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
              Please verify your account to unlock your dashboard and begin your journey.
            </p>

            <a 
              href="https://gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <NeonButton className="w-full flex items-center justify-center gap-2 py-3.5">
                Go to Email <ArrowRight className="w-4 h-4" />
              </NeonButton>
            </a>

            <button 
              onClick={onClose}
              className="mt-6 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest"
            >
              Close and verify later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
