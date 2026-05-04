import { motion } from 'framer-motion'
import NeonButton from '../../../components/ui/NeonButton.jsx'
import UiModal from '../../../components/ui/UiModal.jsx'

export default function CourseDetailModal({ open, onClose, course }) {
  if (!course) return null

  return (
    <UiModal open={open} onClose={onClose}>
      <div className="grid gap-6 md:grid-cols-5">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 md:col-span-2">
          <motion.div
            className={`h-48 bg-gradient-to-br md:h-full min-h-[200px] ${course.accent ?? 'from-ronin-crimson/40'}`}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.35em] text-ronin-cream/80">
            Autoplay preview (swap for Firebase Storage / MUX / Vimeo)
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.35em] text-ronin-gold">{course.difficulty}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ronin-cream md:text-3xl">{course.title}</h2>
          <p className="mt-3 text-sm text-ronin-muted">{course.summary}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-xs text-ronin-muted">
              <p className="text-[10px] uppercase tracking-widest text-ronin-coral">Est. time</p>
              <p className="mt-1 text-sm font-semibold text-ronin-cream">{course.estimatedMinutes} min</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-xs text-ronin-muted">
              <p className="text-[10px] uppercase tracking-widest text-ronin-gold">XP reward</p>
              <p className="mt-1 text-sm font-semibold text-ronin-cream">+{course.xpReward} XP</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-xs text-ronin-muted">
              <p className="text-[10px] uppercase tracking-widest text-ronin-muted">Reviews</p>
              <p className="mt-1 text-sm font-semibold text-ronin-cream">
                {course.reviews?.avg ?? 4.8} / 5 · {Intl.NumberFormat().format(course.reviews?.count ?? 9000)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ronin-muted">Syllabus</h3>
              <ul className="mt-2 space-y-1 text-sm text-ronin-muted">
                {(course.syllabus ?? []).map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-ronin-crimson">▹</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ronin-muted">Skills gained</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {(course.skills ?? []).map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-ronin-crimson/30 bg-ronin-crimson/10 px-2 py-1 text-xs text-ronin-cream"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <NeonButton type="button" className="px-8 py-3 text-base" onClick={onClose}>
              Start learning
            </NeonButton>
            <button
              type="button"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-ronin-muted hover:bg-white/5"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </UiModal>
  )
}
