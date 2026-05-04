/** Vertical circuit map nodes — positions in % of scroll track height units */

export const mockLevelNodes = [
  {
    id: 'l1',
    title: 'C++ Basics: Variables and Data Types',
    difficulty: 'Beginner',
    completion: 100,
    sublevels: [
      { id: 'l1a', title: 'C++ Syntax and Program Structure', completion: 100 },
      { id: 'l1b', title: 'Input and Output in C++', completion: 80 },
    ],
  },
  {
    id: 'l2',
    title: 'Control Flow: Conditions and Loops',
    difficulty: 'Intermediate',
    completion: 64,
    sublevels: [
      { id: 'l2a', title: 'if / else Decision Making', completion: 50 },
      { id: 'l2b', title: 'for and while Loops', completion: 40 },
      { id: 'l2c', title: 'switch Statements', completion: 0 },
    ],
  },
  {
    id: 'l3',
    title: 'Functions and Reusability',
    difficulty: 'Intermediate',
    completion: 22,
    sublevels: [{ id: 'l3a', title: 'Function Parameters and Return Values', completion: 10 }],
  },
  {
    id: 'l4',
    title: 'Arrays and Strings',
    difficulty: 'Intermediate',
    completion: 0,
    sublevels: [],
  },
  {
    id: 'l5',
    title: 'Object Oriented Programming',
    difficulty: 'Advanced',
    completion: 0,
    sublevels: [{ id: 'l5a', title: 'Classes and Objects', completion: 0 }],
  },
  {
    id: 'l6',
    title: 'Problem Solving Challenge Set',
    difficulty: 'Advanced',
    completion: 0,
    sublevels: [{ id: 'l6a', title: 'Grade Finder and Logic Tasks', completion: 0 }],
  },
]

export const mockChallengeDetail = {
  title: 'Challenge #1: Grade Finder',
  stars: 2,
  difficulty: 'Intermediate',
  xp: 420,
  description:
    'Write a C++ program that takes marks as input and outputs the correct grade using conditional logic.',
  testQuestions: [
    {
      id: 'q1',
      question: 'Which strategy prevents a race condition when multiple async requests return out of order?',
      options: ['Use AbortController + stale-check guards', 'Use setTimeout for every fetch', 'Reload the page each submit'],
      answer: 0,
    },
    {
      id: 'q2',
      question: 'What is the safest place to cancel inflight requests in React?',
      options: ['Inside render()', 'Inside useEffect cleanup', 'Inside module scope'],
      answer: 1,
    },
  ],
}
