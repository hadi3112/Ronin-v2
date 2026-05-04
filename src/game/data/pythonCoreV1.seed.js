/** @typedef {{ id: string; questionText: string; lines: string[]; choices: string[]; answerIndex: number }} StacktraceSeed */
/** @typedef {{ id: string; questionText: string; code: string; choices: string[]; answerIndex: number }} CodeCompletionSeed */
/** @typedef {{ id: string; questionText: string; prompt: string; choices: string[]; answerIndex: number }} ConceptualSeed */

const CC_PROMPT =
  'Complete the snippet by choosing the expression that correctly fills every blank (`__`) so the code runs as intended in Python 3.'

/** @type {StacktraceSeed[]} */
export const STACKTRACE_SEED = [
  {
    id: 'st_a',
    questionText: 'Read the traceback. Which explanation best matches what went wrong?',
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
    questionText: 'Read the traceback. Which explanation best matches what went wrong?',
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
    questionText: 'Read the traceback. Which explanation best matches what went wrong?',
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
    questionText: 'Read the traceback. Which explanation best matches what went wrong?',
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
    questionText: 'Read the traceback. Which explanation best matches what went wrong?',
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
    questionText: CC_PROMPT,
    code: 'def add(a, b):\n    return __',
    choices: ['a - b', 'a + b', 'a // b'],
    answerIndex: 1,
  },
  {
    id: 'cc_b',
    questionText: CC_PROMPT,
    code: 'nums = [1, 2, 3]\nprint(__(nums))',
    choices: ['len', 'sum', 'sorted'],
    answerIndex: 0,
  },
  {
    id: 'cc_c',
    questionText: CC_PROMPT,
    code: 'x = 5\ny = 2\nprint(x __ y)',
    choices: ['^', '**', '//'],
    answerIndex: 1,
  },
  {
    id: 'cc_d',
    questionText: CC_PROMPT,
    code: 's = "hello"\nprint(s.__)',
    choices: ['upper()', 'UPPER()', 'toUpperCase()'],
    answerIndex: 0,
  },
  {
    id: 'cc_e',
    questionText: CC_PROMPT,
    code: 'items = [10, 20, 30]\nprint(items.__)',
    choices: ['end()', 'last()', '[-1]'],
    answerIndex: 2,
  },
]

/** @type {ConceptualSeed[]} */
export const CONCEPTUAL_SEED = [
  {
    id: 'co_a',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'What does immutability mean for a Python tuple?',
    choices: ['Elements cannot be changed in-place', 'It cannot be iterated', 'It is always sorted'],
    answerIndex: 0,
  },
  {
    id: 'co_b',
    questionText: 'Concept check — pick the best answer.',
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
    questionText: 'Concept check — pick the best answer.',
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
    questionText: 'Concept check — pick the best answer.',
    prompt: 'Which complexity is typical for dict key lookup average case?',
    choices: ['O(1)', 'O(log n)', 'O(n)'],
    answerIndex: 0,
  },
  {
    id: 'co_e',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'What does `if __name__ == "__main__":` guard?',
    choices: [
      'Code that runs only when the file is executed directly',
      'Code that runs only inside pytest',
      'Code that runs before imports resolve',
    ],
    answerIndex: 0,
  },
]

/** Structured system architecture bank (three templates; one sampled per session). */
export const SYSTEM_ARCHITECTURE_SEED = {
  linked_list_memory: {
    kind: 'linked_list_memory',
    questionText:
      'Each block is a list node: top row is payload `data`, bottom row is `prev` pointer (hex). Which `data` value belongs to the node whose `prev` is the sentinel / head marker `0x00000000`?',
    cells: [
      { data: 42, prev: '0x00000000' },
      { data: 17, prev: '0x8f0a3c10' },
      { data: 91, prev: '0x8f0a3c18' },
    ],
    choices: ['42', '17', '91'],
    answerIndex: 0,
  },
  circular_queue: {
    kind: 'circular_queue',
    questionText:
      'Six slots form a ring buffer (indices 0–5). Follow the operations; which letter sits at the head index after the sequence completes?',
    capacity: 6,
    sequence: [
      { op: 'enqueue', value: 'A' },
      { op: 'enqueue', value: 'B' },
      { op: 'enqueue', value: 'C' },
      { op: 'dequeue' },
      { op: 'enqueue', value: 'D' },
      { op: 'dequeue' },
      { op: 'enqueue', value: 'E' },
    ],
    choices: ['C', 'D', 'E', 'B'],
    answerIndex: 0,
  },
  circular_queue_alt: {
    kind: 'circular_queue',
    questionText:
      'Ring buffer with six slots. After the listed pushes and pops, what value is at the head?',
    capacity: 6,
    sequence: [
      { op: 'enqueue', value: 'K' },
      { op: 'enqueue', value: 'L' },
      { op: 'dequeue' },
      { op: 'enqueue', value: 'M' },
      { op: 'enqueue', value: 'N' },
      { op: 'dequeue' },
    ],
    choices: ['L', 'M', 'N', 'K'],
    answerIndex: 1,
  },
  dfs_tree: {
    kind: 'dfs_tree',
    questionText:
      'Interactive tree: level 0 has the root, level 1 has three nodes (left / middle / right), each branches to two leaves on level 2. Start on any level-2 node, then only click a node when both children beneath it are already selected. Remove the middle level-1 node last among the three level-1 nodes (visit its leaves first, then it). Finish at the root.',
    rootId: 1,
    /** middle level-1 id — must be clicked after its two leaves, before other L1 if they still have unclicked leaves */
    middleId: 3,
    nodes: [
      { id: 1, level: 0, parent: null, children: [2, 3, 4] },
      { id: 2, level: 1, parent: 1, children: [5, 6] },
      { id: 3, level: 1, parent: 1, children: [7, 8] },
      { id: 4, level: 1, parent: 1, children: [9, 10] },
      { id: 5, level: 2, parent: 2, children: [] },
      { id: 6, level: 2, parent: 2, children: [] },
      { id: 7, level: 2, parent: 3, children: [] },
      { id: 8, level: 2, parent: 3, children: [] },
      { id: 9, level: 2, parent: 4, children: [] },
      { id: 10, level: 2, parent: 4, children: [] },
    ],
  },
}
