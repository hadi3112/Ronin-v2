import { motion } from 'framer-motion'

const variants = {
  crimson:
    'bg-ronin-crimson text-white shadow-ronin-red hover:bg-red-600 border border-red-500/40',
  coral:
    'bg-ronin-coral text-ronin-void font-semibold shadow-ronin-red/40 hover:brightness-110 border border-white/10',
  ghost: 'bg-white/5 text-ronin-cream border border-white/10 hover:bg-white/10',
}

export default function NeonButton({
  variant = 'crimson',
  className = '',
  children,
  type = 'button',
  disabled,
  ...rest
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors',
        variants[variant] ?? variants.crimson,
        disabled ? 'cursor-not-allowed opacity-45' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
