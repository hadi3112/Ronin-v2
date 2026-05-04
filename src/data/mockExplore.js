/** Netflix-style rows for Explore tab */

const mk = (id, title, difficulty, minutes, xp, summary, accent, image) => ({
  id,
  title,
  difficulty,
  estimatedMinutes: minutes,
  xpReward: xp,
  summary,
  accent,
  image,
  skills: ['React', 'State machines', 'Animations'],
  syllabus: ['Neural UI basics', 'Motion design', 'Performance budgets', 'Ship kit'],
  reviews: { avg: 4.9, count: 12840 },
})

export const exploreRows = [
  {
    id: 'recommended',
    label: 'Recommended',
    courses: [
      mk('r1', 'Advanced React Component Patterns', 'Advanced', 220, 950, 'Build scalable, reusable component architecture for large React apps.', 'from-ronin-crimson/40', 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80'),
      mk('r2', 'Practical Tailwind for Production UI', 'Intermediate', 140, 520, 'Design polished responsive interfaces with Tailwind utility patterns.', 'from-ronin-orange/35', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80'),
      mk('r3', 'Building REST APIs with Node and Express', 'Advanced', 190, 880, 'Create robust API routes, validation, and error handling for real projects.', 'from-ronin-coral/30', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'),
      mk('r4', 'Web Graphics and Canvas Fundamentals', 'Expert', 260, 1200, 'Learn rendering basics, shaders, and smooth interactive visual effects.', 'from-ronin-gold/25', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80'),
    ],
  },
  {
    id: 'trending',
    label: 'Trending',
    courses: [
      mk('t1', 'Coding Interview Problem Solving', 'Beginner', 55, 210, 'Practice arrays, strings, and logic drills with clear walkthroughs.', 'from-emerald-500/25', 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80'),
      mk('t2', 'Git and GitHub Workflow Essentials', 'Intermediate', 95, 410, 'Master branching, pull requests, conflict resolution, and clean history.', 'from-violet-500/25', 'https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=1200&q=80'),
      mk('t3', 'Modern Frontend UX Patterns', 'Intermediate', 80, 360, 'Build intuitive navigation, card layouts, and smooth content discovery.', 'from-sky-500/20', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80'),
    ],
  },
  {
    id: 'for-you',
    label: 'For You',
    courses: [
      mk('f1', 'Async JavaScript and API Calls', 'Intermediate', 110, 480, 'Understand promises, async/await, and reliable API request flow.', 'from-ronin-crimson/35', 'https://images.unsplash.com/photo-1537432376769-00aabc4c4d19?auto=format&fit=crop&w=1200&q=80'),
      mk('f2', 'TypeScript for Beginners', 'Beginner', 75, 300, 'Add type safety to JavaScript projects and reduce runtime bugs.', 'from-blue-500/25', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80'),
    ],
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    courses: [
      mk('b1', 'Blockchain Fundamentals', 'Intermediate', 150, 600, 'Learn wallets, blocks, consensus, and transaction lifecycle.', 'from-amber-500/25', 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1200&q=80'),
      mk('b2', 'Smart Contract Development', 'Advanced', 200, 820, 'Write, test, and deploy Solidity smart contracts safely.', 'from-orange-600/25', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80'),
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    courses: [
      mk('a1', 'Machine Learning Model Training', 'Advanced', 210, 900, 'Train, evaluate, and improve supervised learning models.', 'from-fuchsia-500/25', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'),
      mk('a2', 'Vector Search and Embeddings', 'Intermediate', 125, 520, 'Implement semantic search using embeddings and vector databases.', 'from-pink-500/20', 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&w=1200&q=80'),
    ],
  },
  {
    id: 'beginner',
    label: 'Beginner Friendly',
    courses: [
      mk('g1', 'Command Line Basics', 'Beginner', 40, 160, 'Use terminal commands to navigate, edit, and run projects.', 'from-ronin-orange/30', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80'),
      mk('g2', 'Git Basics and Version Control', 'Beginner', 50, 190, 'Track code changes and collaborate confidently with Git.', 'from-teal-500/20', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80'),
    ],
  },
]
