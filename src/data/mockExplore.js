/** Netflix-style rows for Explore tab */

const mk = (id, title, difficulty, minutes, xp, summary, accent) => ({
  id,
  title,
  difficulty,
  estimatedMinutes: minutes,
  xpReward: xp,
  summary,
  accent,
  skills: ['React', 'State machines', 'Animations'],
  syllabus: ['Neural UI basics', 'Motion design', 'Performance budgets', 'Ship kit'],
  reviews: { avg: 4.9, count: 12840 },
})

export const exploreRows = [
  {
    id: 'recommended',
    label: 'Recommended',
    courses: [
      mk('r1', 'Quantum Components', 'Advanced', 220, 950, 'Composable systems for hostile latency.', 'from-ronin-crimson/40'),
      mk('r2', 'Neural CSS Lab', 'Intermediate', 140, 520, 'Style engines that breathe with your data.', 'from-ronin-orange/35'),
      mk('r3', 'Edge Ronin APIs', 'Advanced', 190, 880, 'Serverless blades that never dull.', 'from-ronin-coral/30'),
      mk('r4', 'Shader Mentorship', 'Expert', 260, 1200, 'GPU rituals for cinematic HUDs.', 'from-ronin-gold/25'),
    ],
  },
  {
    id: 'trending',
    label: 'Trending',
    courses: [
      mk('t1', 'Duolingo-grade Drills', 'Beginner', 55, 210, 'Micro wins, macro momentum.', 'from-emerald-500/25'),
      mk('t2', 'Solo Leveling Git', 'Intermediate', 95, 410, 'Commits that feel like rank-ups.', 'from-violet-500/25'),
      mk('t3', 'Netflix UX Patterns', 'Intermediate', 80, 360, 'Rows, rails, and reveal choreography.', 'from-sky-500/20'),
    ],
  },
  {
    id: 'for-you',
    label: 'For You',
    courses: [
      mk('f1', 'Async Ronin', 'Intermediate', 110, 480, 'Promises without plot holes.', 'from-ronin-crimson/35'),
      mk('f2', 'TypeScript Dojo', 'Beginner', 75, 300, 'Strict sensei mode engaged.', 'from-blue-500/25'),
    ],
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    courses: [
      mk('b1', 'Ledger Lore', 'Intermediate', 150, 600, 'Hash trails with honor.', 'from-amber-500/25'),
      mk('b2', 'Smart Contract Kata', 'Advanced', 200, 820, 'Battle-tested patterns.', 'from-orange-600/25'),
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    courses: [
      mk('a1', 'Model Ronin', 'Advanced', 210, 900, 'Fine-tune with surgical calm.', 'from-fuchsia-500/25'),
      mk('a2', 'Vector Dojo', 'Intermediate', 125, 520, 'Embeddings as throwing stars.', 'from-pink-500/20'),
    ],
  },
  {
    id: 'beginner',
    label: 'Beginner Friendly',
    courses: [
      mk('g1', 'Terminal Rituals', 'Beginner', 40, 160, 'CLI confidence in crimson light.', 'from-ronin-orange/30'),
      mk('g2', 'Git Origins', 'Beginner', 50, 190, 'Branches like bamboo paths.', 'from-teal-500/20'),
    ],
  },
]
