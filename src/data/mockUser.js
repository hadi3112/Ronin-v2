let storedXp = 2571
try {
  const saved = localStorage.getItem('ronin_xp')
  if (saved) storedXp = parseInt(saved, 10)
} catch(e) {}

/** Dashboard hero + XP — mock until backend / Firebase profile exists */
export const mockProfile = {
  displayName: 'Hadi',
  startingLevel: 1,
  xpCurrent: storedXp,
  xpGoal: 8000,
  trackTitle: 'Python Boss Trial',
  trackPoints: 12840,
  latestCourse: {
    id: 'course-neon-stack',
    title: 'React + Vite Frontend Foundations',
    completionPct: 72,
    tutorialsWatched: 18,
    levelsCompleted: 9,
    challengesWon: 24,
    previewSrc: '',
    summary: 'Build modern frontend apps with React components, routing, state, and clean UI structure.',
  },
}

export function updateXP(newXp) {
  mockProfile.xpCurrent = newXp
  try {
    localStorage.setItem('ronin_xp', newXp.toString())
  } catch(e) {}
}
