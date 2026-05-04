import { motion } from 'framer-motion'

export default function CourseCard({ course, onOpen }) {
  const placeholder = !course.isActive

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(course)}
      className={[
        'group relative w-[220px] shrink-0 snap-start text-left md:w-[260px]',
        placeholder ? 'opacity-90' : '',
      ].join(' ')}
      whileHover={{ zIndex: 5 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-ronin"
        whileHover={{ scale: 1.12 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        {course.image ? (
          <img src={course.image} alt={course.title} className="h-32 w-full object-cover md:h-36" />
        ) : (
          <div
            className={`relative h-32 bg-gradient-to-br md:h-36 ${course.accent ?? 'from-ronin-crimson/35 to-black'}`}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(243,50,50,0.35), transparent 40%), radial-gradient(circle at 80% 30%, rgba(200,164,35,0.25), transparent 35%)',
            }}
          />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 font-display text-sm font-semibold text-ronin-cream">{course.title}</h3>
          <p className="text-[11px] text-ronin-muted">
            {placeholder ? `${course.difficulty} · opens Boss Trial` : course.difficulty}
          </p>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-black/85 p-4 text-[11px] text-ronin-muted opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          initial={false}
        >
          <p className="line-clamp-3 text-ronin-cream/90">{course.summary}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-ronin-gold">
            <span>{course.estimatedMinutes}m</span>
            <span>·</span>
            <span>{course.difficulty}</span>
            <span>·</span>
            <span>+{course.xpReward} XP</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.button>
  )
}
