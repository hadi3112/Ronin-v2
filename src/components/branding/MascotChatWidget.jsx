import { AnimatePresence, motion } from 'framer-motion'
import mascot from '../../assets/mascot.png'
import { useAuth } from '../../hooks/useAuth.js'

export default function MascotChatWidget() {
  const { onboardingPhase } = useAuth()
  const showBubble = onboardingPhase === 'training_grounds_pending'

  return (
    <div className="fixed bottom-6 right-8 z-[60] flex items-center pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.03, 1], 
              x: 0,
              boxShadow: [
                '0 0 15px rgba(232,37,58,0.4)',
                '0 0 35px rgba(232,37,58,0.9)',
                '0 0 15px rgba(232,37,58,0.4)'
              ]
            }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ 
              opacity: { duration: 0.3 },
              x: { type: 'spring', damping: 20, stiffness: 300 },
              scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="relative mr-6 w-[400px] rounded-[1.5rem] border-2 border-ronin-crimson bg-[#0a0506]/95 px-6 py-5 text-base font-semibold text-ronin-cream"
          >
            {/* Triangular arrow of bubble */}
            <div
              className="absolute top-1/2 -right-[12px] -translate-y-1/2 h-6 w-6 rotate-45 border-r-2 border-t-2 border-ronin-crimson bg-[#0a0506]"
            />
            <p className="leading-relaxed tracking-wide text-center drop-shadow-md">
              Let&apos;s get to work! Select the diagnostic test right now to start your training.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img 
          src={mascot} 
          alt="Mascot" 
          className="h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(232,37,58,0.6)]" 
        />
      </motion.div>
    </div>
  )
}
