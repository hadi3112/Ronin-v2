import { motion } from 'framer-motion'

export default function LoadingContainer({ message = "Launching IDE…" }) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-ronin-void">
      <p className="font-display text-lg font-bold tracking-[0.25em] text-white">
        {message}
      </p>

      <div className="relative h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 w-32 rounded-full bg-white"
          animate={{ x: ['-128px', '256px'] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
