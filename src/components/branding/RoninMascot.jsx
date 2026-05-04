import { motion } from 'framer-motion'
import { useId } from 'react'

/** Stylized silhouette — placeholder art direction (replace with illustrated asset later). */
export default function RoninMascot({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const gCloak = `mcloak-${uid}`
  const gBlade = `mblade-${uid}`
  const fGlow = `mglow-${uid}`

  return (
    <motion.div
      aria-hidden
      className={['pointer-events-none select-none', className].join(' ')}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 200 240" className="h-52 w-44 md:h-64 md:w-52" fill="none">
        <defs>
          <linearGradient id={gCloak} x1="40" y1="20" x2="160" y2="220">
            <stop stopColor="#3D1015" />
            <stop offset="0.5" stopColor="#F33232" stopOpacity="0.85" />
            <stop offset="1" stopColor="#050505" />
          </linearGradient>
          <linearGradient id={gBlade} x1="120" y1="40" x2="190" y2="200">
            <stop stopColor="#F7F7F7" />
            <stop offset="1" stopColor="#C8A423" />
          </linearGradient>
          <filter id={fGlow} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="100" cy="210" rx="70" ry="12" fill="rgba(243,50,50,0.15)" />
        <path
          d="M55 200 C45 120 70 60 100 40 C130 60 155 120 145 200 Z"
          fill={`url(#${gCloak})`}
          filter={`url(#${fGlow})`}
          opacity="0.95"
        />
        <path d="M118 55 L175 30 L155 120 Z" fill={`url(#${gBlade})`} opacity="0.95" />
        <circle cx="92" cy="72" r="10" fill="#F7F7F7" opacity="0.9" />
        <path d="M78 88 Q100 98 122 88" stroke="#F36E6E" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 110 L100 165" stroke="#F38B1F" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      </svg>
    </motion.div>
  )
}
