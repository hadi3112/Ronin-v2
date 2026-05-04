import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { exploreRows } from '../../../data/mockExplore.js'
import { useCourseCatalog } from '../../../hooks/useCourseCatalog.js'
import CourseCard from './CourseCard.jsx'
import CourseDetailModal from './CourseDetailModal.jsx'

function Row({ row, onOpen, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="space-y-3"
    >
      <div className="flex items-end justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-ronin-cream">{row.label}</h3>
        <span className="text-[10px] uppercase tracking-[0.35em] text-ronin-muted">Swipe</span>
      </div>
      <div className="relative -mx-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-10 bg-gradient-to-r from-ronin-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-10 bg-gradient-to-l from-ronin-void to-transparent" />
        <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-6 pt-2 scrollbar-hide snap-x snap-mandatory px-1">
          {row.courses.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default function ExplorePanel() {
  const navigate = useNavigate()
  const { exploreFeaturedRow, error } = useCourseCatalog()
  const [active, setActive] = useState(null)

  return (
    <div className="space-y-10">
      {error && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-100/90">
          Catalog sync warning: {error}. Python stays available offline.
        </p>
      )}
      <Row row={exploreFeaturedRow} onOpen={setActive} index={0} />
      {exploreRows.map((row, i) => (
        <Row key={row.id} row={row} onOpen={setActive} index={i + 1} />
      ))}
      <CourseDetailModal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        course={active}
        onStartLearning={(course) => {
          if (course.id === 'python' && !course.disabled && course.gameMode === 'boss_trial') {
            navigate('/dashboard/game/boss-trial')
          }
        }}
      />
    </div>
  )
}
