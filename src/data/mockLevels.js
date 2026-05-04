/** Vertical circuit map nodes — positions in % of scroll track height units */

export const mockLevelNodes = [
  {
    id: 'l1',
    title: 'Compiler Dawn',
    difficulty: 'Novice',
    completion: 100,
    sublevels: [
      { id: 'l1a', title: 'Syntax Shrine', completion: 100 },
      { id: 'l1b', title: 'Runtime Rift', completion: 80 },
    ],
  },
  {
    id: 'l2',
    title: 'Async Abyss',
    difficulty: 'Adept',
    completion: 64,
    sublevels: [
      { id: 'l2a', title: 'Promise Gates', completion: 50 },
      { id: 'l2b', title: 'Await Arena', completion: 40 },
      { id: 'l2c', title: 'Microtask Maze', completion: 0 },
    ],
  },
  {
    id: 'l3',
    title: 'Neon Interface',
    difficulty: 'Elite',
    completion: 22,
    sublevels: [{ id: 'l3a', title: 'Motion Matrix', completion: 10 }],
  },
  {
    id: 'l4',
    title: 'Edge Citadel',
    difficulty: 'Master',
    completion: 0,
    sublevels: [],
  },
]

export const mockChallengeDetail = {
  title: 'Async Abyss — Await Arena',
  stars: 2,
  difficulty: 'Adept',
  xp: 420,
  description:
    'Navigate three parallel requests, cancel on unmount, and keep UI honor with suspenseful loading states.',
}
