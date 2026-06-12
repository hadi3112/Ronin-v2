import { motion } from 'framer-motion'
import roninLogo from '../../assets/ronin_logo.png'

const sizes = {
  lg: { glyph: 'h-14 w-14', title: 'text-3xl font-extrabold', tagline: 'text-[10px]' },
  md: { glyph: 'h-11 w-11', title: 'text-2xl font-bold', tagline: 'text-[9px]' },
  sm: { glyph: 'h-9 w-9', title: 'text-xl font-bold', tagline: 'text-[8px]' },
}

export default function RoninMark({ size = 'lg', className = '' }) {
  const s = sizes[size] ?? sizes.lg
  return (
    <motion.div
      className={`flex items-center justify-center gap-3 ${className}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img src={roninLogo} alt="Ronin Logo" className={`${s.glyph} object-contain`} />
      <div className="font-display tracking-[0.2em]">
        <span className={`${s.title} text-ronin-cream`}>.Ronin</span>
        <p className={`${s.tagline} uppercase tracking-[0.35em] text-ronin-muted`}>Samurai compile</p>
      </div>
    </motion.div>
  )
}
