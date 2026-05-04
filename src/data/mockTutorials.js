/** Horizontal “subway” clusters */

export const mockTutorialClusters = [
  {
    id: 'c1',
    title: 'React Fundamentals',
    nodes: [
      { id: 'n1', title: 'React Hooks Basics', difficulty: 'Beginner', completion: 100, minutes: 12 },
      { id: 'n2', title: 'Optimizing with useMemo', difficulty: 'Intermediate', completion: 70, minutes: 18 },
      { id: 'n3', title: 'Concurrent Rendering Intro', difficulty: 'Intermediate', completion: 20, minutes: 26 },
    ],
  },
  {
    id: 'c2',
    title: 'Core Programming Concepts',
    nodes: [
      { id: 'n4', title: 'Binary and Number Systems', difficulty: 'Beginner', completion: 100, minutes: 10 },
      { id: 'n5', title: 'Pointers and Memory Basics', difficulty: 'Intermediate', completion: 55, minutes: 22 },
    ],
  },
  {
    id: 'c3',
    title: 'AI and Machine Learning',
    nodes: [
      { id: 'n6', title: 'Tensor and Matrix Basics', difficulty: 'Advanced', completion: 10, minutes: 34 },
      { id: 'n7', title: 'Intro to Diffusion Models', difficulty: 'Advanced', completion: 0, minutes: 40 },
    ],
  },
  {
    id: 'c4',
    title: 'Backend Engineering',
    nodes: [
      { id: 'n8', title: 'REST API Design', difficulty: 'Intermediate', completion: 35, minutes: 20 },
      { id: 'n9', title: 'Caching Strategies', difficulty: 'Advanced', completion: 5, minutes: 30 },
    ],
  },
]
