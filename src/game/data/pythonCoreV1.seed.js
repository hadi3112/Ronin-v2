/** @typedef {{ id: string; lines: string[]; choices: string[]; answerIndex: number }} StacktraceSeed */
/** @typedef {{ id: string; code: string; choices: string[]; answerIndex: number }} CodeCompletionSeed */
/** @typedef {{ id: string; prompt: string; choices: string[]; answerIndex: number }} ConceptualSeed */

/** @type {StacktraceSeed[]} */
export const STACKTRACE_SEED = [
  {
    id: 'st_a',
    lines: [
      'Traceback (most recent call last):',
      '  File "main.py", line 8',
      '    print(arr[10])',
      'IndexError: list index out of range',
    ],
    choices: ['Index past end of list', 'SyntaxError in print()', 'KeyError on arr'],
    answerIndex: 0,
  },
  {
    id: 'st_b',
    lines: [
      'Traceback (most recent call last):',
      '  File "app.py", line 3, in <module>',
      '    x = "2" + 3',
      'TypeError: can only concatenate str (not "int") to str',
    ],
    choices: ['Mixing str and int with +', 'Division by zero', 'Recursion depth exceeded'],
    answerIndex: 0,
  },
  {
    id: 'st_c',
    lines: [
      'Traceback (most recent call last):',
      '  File "data.py", line 5, in <module>',
      '    print(user["email"])',
      "KeyError: 'email'",
    ],
    choices: ["Missing key in dict", 'List index error', 'ImportError for email'],
    answerIndex: 0,
  },
  {
    id: 'st_d',
    lines: [
      'Traceback (most recent call last):',
      '  File "api.py", line 12, in <module>',
      '    resp.raise_for_status()',
      'AttributeError: \'NoneType\' object has no attribute \'raise_for_status\'',
    ],
    choices: ['Calling method on None', 'Invalid HTTP verb', 'JSON decode failure'],
    answerIndex: 0,
  },
  {
    id: 'st_e',
    lines: [
      'Traceback (most recent call last):',
      '  File "parse.py", line 2, in <module>',
      '    value = int("12a")',
      'ValueError: invalid literal for int() with base 10: \'12a\'',
    ],
    choices: ['Non-numeric string passed to int()', 'Float overflow', 'Unicode decode error'],
    answerIndex: 0,
  },
]

/** @type {CodeCompletionSeed[]} */
export const CODE_COMPLETION_SEED = [
  {
    id: 'cc_a',
    code: 'def add(a, b):\n    return __',
    choices: ['a - b', 'a + b', 'a // b'],
    answerIndex: 1,
  },
  {
    id: 'cc_b',
    code: 'nums = [1, 2, 3]\nprint(__(nums))',
    choices: ['len', 'sum', 'sorted'],
    answerIndex: 0,
  },
  {
    id: 'cc_c',
    code: 'x = 5\ny = 2\nprint(x __ y)',
    choices: ['^', '**', '//'],
    answerIndex: 1,
  },
  {
    id: 'cc_d',
    code: 's = "hello"\nprint(s.__)',
    choices: ['upper()', 'UPPER()', 'toUpperCase()'],
    answerIndex: 0,
  },
  {
    id: 'cc_e',
    code: 'items = [10, 20, 30]\nprint(items.__)',
    choices: ['end()', 'last()', '[-1]'],
    answerIndex: 2,
  },
]

/** @type {ConceptualSeed[]} */
export const CONCEPTUAL_SEED = [
  {
    id: 'co_a',
    prompt: 'What does immutability mean for a Python tuple?',
    choices: ['Elements cannot be changed in-place', 'It cannot be iterated', 'It is always sorted'],
    answerIndex: 0,
  },
  {
    id: 'co_b',
    prompt: 'Which statement best describes a Python generator?',
    choices: [
      'A function that yields values lazily using yield',
      'A class that must inherit from abc.Generator',
      'A list comprehension that runs on import',
    ],
    answerIndex: 0,
  },
  {
    id: 'co_c',
    prompt: 'What is the GIL most associated with?',
    choices: [
      'Thread execution of Python bytecode in CPython',
      'Garbage collection pause times only',
      'Async event loop fairness guarantees',
    ],
    answerIndex: 0,
  },
  {
    id: 'co_d',
    prompt: 'Which complexity is typical for dict key lookup average case?',
    choices: ['O(1)', 'O(log n)', 'O(n)'],
    answerIndex: 0,
  },
  {
    id: 'co_e',
    prompt: 'What does `if __name__ == "__main__":` guard?',
    choices: [
      'Code that runs only when the file is executed directly',
      'Code that runs only inside pytest',
      'Code that runs before imports resolve',
    ],
    answerIndex: 0,
  },
]

/** Structured system architecture bank (exactly three puzzle templates). */
export const SYSTEM_ARCHITECTURE_SEED = {
  linked_list: {
    kind: 'linked_list',
    title: 'Reverse the chain',
    nodes: [1, 2, 3, 4],
    solutionOrder: [4, 3, 2, 1],
  },
  circular_queue: {
    kind: 'circular_queue',
    title: 'Circular queue — predict the front',
    capacity: 4,
    sequence: [
      { op: 'enqueue', value: 'A' },
      { op: 'enqueue', value: 'B' },
      { op: 'dequeue' },
      { op: 'enqueue', value: 'C' },
    ],
    choices: ['B', 'C', 'A'],
    answerIndex: 0,
  },
  dfs_tree: {
    kind: 'dfs_tree',
    title: 'DFS preorder — skip the second level-1 node (3) and its subtree',
    skipNode: 3,
    /** Preorder visiting all except skipNode subtree */
    solutionClickOrder: [1, 2, 5, 6, 4, 9, 10],
    nodes: [
      { id: 1, level: 0, parent: null },
      { id: 2, level: 1, parent: 1 },
      { id: 3, level: 1, parent: 1 },
      { id: 4, level: 1, parent: 1 },
      { id: 5, level: 2, parent: 2 },
      { id: 6, level: 2, parent: 2 },
      { id: 7, level: 2, parent: 3 },
      { id: 8, level: 2, parent: 3 },
      { id: 9, level: 2, parent: 4 },
      { id: 10, level: 2, parent: 4 },
    ],
  },
}
