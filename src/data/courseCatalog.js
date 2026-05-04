/** UI-facing course cards — Python is always present; others are placeholders when Firebase is down. */

export const PYTHON_CARD = {
  id: 'python',
  title: 'Python',
  difficulty: 'Beginner',
  estimatedMinutes: 45,
  xpReward: 320,
  summary:
    'Boss Trial: stack traces, code completion, fast concepts, and one interactive architecture puzzle per run.',
  accent: 'from-emerald-500/35',
  image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
  skills: ['Debugging', 'Python core', 'Data structures', 'Reading errors'],
  syllabus: ['Tracebacks', 'Completion drills', 'Concept sprint', 'Architecture mini-labs'],
  reviews: { avg: 4.95, count: 18420 },
  disabled: false,
  isActive: true,
  gameMode: 'boss_trial',
}

export const PLACEHOLDER_COURSE_CARDS = [
  {
    id: 'javascript',
    title: 'JavaScript',
    difficulty: 'Coming soon',
    estimatedMinutes: 0,
    xpReward: 0,
    summary: 'Placeholder track — enable when the curriculum ships.',
    accent: 'from-amber-500/25',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1445d2472?auto=format&fit=crop&w=1200&q=80',
    skills: [],
    syllabus: [],
    reviews: { avg: 0, count: 0 },
    disabled: false,
    isActive: false,
    gameMode: 'boss_trial',
  },
  {
    id: 'rust',
    title: 'Rust',
    difficulty: 'Coming soon',
    estimatedMinutes: 0,
    xpReward: 0,
    summary: 'Placeholder track — systems programming path in development.',
    accent: 'from-orange-600/25',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    skills: [],
    syllabus: [],
    reviews: { avg: 0, count: 0 },
    disabled: false,
    isActive: false,
    gameMode: 'boss_trial',
  },
  {
    id: 'cpp',
    title: 'C++',
    difficulty: 'Coming soon',
    estimatedMinutes: 0,
    xpReward: 0,
    summary: 'Placeholder track — OOP circuit arrives after Python Boss Trial.',
    accent: 'from-sky-500/20',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80',
    skills: [],
    syllabus: [],
    reviews: { avg: 0, count: 0 },
    disabled: false,
    isActive: false,
    gameMode: 'boss_trial',
  },
]

export function buildFallbackCatalogRows() {
  return [{ id: 'ronin-paths', label: 'Ronin paths', courses: [PYTHON_CARD, ...PLACEHOLDER_COURSE_CARDS] }]
}

/**
 * @param {Array<Record<string, unknown>> | null} remoteCourses
 */
export function mergeCatalogWithRemote(remoteCourses) {
  const base = [PYTHON_CARD, ...PLACEHOLDER_COURSE_CARDS]
  if (!remoteCourses || !Array.isArray(remoteCourses)) return base

  const byId = new Map(base.map((c) => [c.id, { ...c }]))
  for (const r of remoteCourses) {
    const id = String(r.id ?? '')
    if (!id) continue
    const cur = byId.get(id) ?? {
      id,
      title: String(r.name ?? id),
      difficulty: r.isActive ? 'Available' : 'Coming soon',
      estimatedMinutes: 0,
      xpReward: 0,
      summary: r.isActive ? 'Loaded from Firebase catalog.' : 'Placeholder — not yet active.',
      accent: 'from-white/10',
      image: null,
      skills: [],
      syllabus: [],
      reviews: { avg: 4.5, count: 0 },
      disabled: !r.isActive,
      isActive: Boolean(r.isActive),
      gameMode: r.gameMode ?? null,
    }
    cur.title = String(r.name ?? cur.title)
    cur.isActive = Boolean(r.isActive)
    cur.disabled = false
    cur.gameMode = r.gameMode ?? cur.gameMode ?? 'boss_trial'
    byId.set(id, cur)
  }

  const order = ['python', 'javascript', 'rust', 'cpp']
  const ordered = order.map((id) => byId.get(id)).filter(Boolean)
  for (const [id, c] of byId) {
    if (!order.includes(id)) ordered.push(c)
  }
  return ordered
}
