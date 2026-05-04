import { motion } from 'framer-motion'
import { useId } from 'react'

function SamuraiGlyph({ className }) {
  const gid = useId().replace(/:/g, '')
  const gradId = `roninBlade-${gid}`
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#F7F7F7" />
          <stop offset="1" stopColor="#F33232" />
        </linearGradient>
      </defs>
      <path
        d="M10 38 L24 8 L38 38"
        stroke={`url(#${gradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="24" cy="34" r="3" fill="#C8A423" opacity="0.95" />
      <path d="M16 22 H32" stroke="#F36E6E" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

const sizes = {
  lg: { glyph: 'h-14 w-14', title: 'text-3xl font-extrabold', tagline: 'text-[10px]' },
  md: { glyph: 'h-11 w-11', title: 'text-2xl font-bold', tagline: 'text-[9px]' },
  sm: { glyph: 'h-9 w-9', title: 'text-xl font-bold', tagline: 'text-[8px]' },
}

export default function RoninMark({ size = 'lg' }) {
  const s = sizes[size] ?? sizes.lg
  return (
    <motion.div
      className="flex items-center justify-center gap-3"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SamuraiGlyph className={`${s.glyph} drop-shadow-ronin-red`} />
      <div className="font-display tracking-[0.2em]">
        <span className={`${s.title} text-ronin-cream`}>.Ronin</span>
        <p className={`${s.tagline} uppercase tracking-[0.35em] text-ronin-muted`}>Samurai compile</p>
      </div>
    </motion.div>
  )
}
