/** @typedef {{ id: string; questionText: string; lines: string[]; choices: string[]; answerIndex: number }} StacktraceSeed */
/** @typedef {{ id: string; questionText: string; code: string; choices: string[]; answerIndex: number }} CodeCompletionSeed */
/** @typedef {{ id: string; questionText: string; prompt: string; choices: string[]; answerIndex: number }} ConceptualSeed */

const CC_PROMPT =
  'Complete the snippet by choosing the expression that correctly fills the blank (`__`) so the code runs as intended in Python 3.'

/** @type {StacktraceSeed[]} */
export const STACKTRACE_SEED = [
  // --- ARRAYS / TWO SUM ---
  {
    id: 'st_arrays_1',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this array retrieval?',
    lines: [
      'Traceback (most recent call last):',
      '  File "solution.py", line 4, in solution',
      '    print(nums[len(nums)])',
      'IndexError: list index out of range',
    ],
    choices: ['List indexing is 0-based, so len(nums) is out of bounds', 'The list was modified asynchronously', 'KeyError because nums is a dictionary'],
    answerIndex: 0,
  },
  {
    id: 'st_arrays_2',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this lookup?',
    lines: [
      'Traceback (most recent call last):',
      '  File "solution.py", line 7, in solution',
      '    val = nums["first"]',
      'TypeError: list indices must be integers or slices, not str',
    ],
    choices: ['Passing a string key to index into a list instead of a dict', 'The dictionary is missing the "first" key value', 'Out of memory while retrieving slice'],
    answerIndex: 0,
  },
  // --- LINKED LISTS ---
  {
    id: 'st_linkedlist_1',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this list traversal?',
    lines: [
      'Traceback (most recent call last):',
      '  File "list.py", line 14, in reverse',
      '    curr = curr.next',
      "AttributeError: 'NoneType' object has no attribute 'next'",
    ],
    choices: ['Traversed past the tail node, trying to access .next on None', 'Node constructor did not declare .next pointer', 'Infinite recursion limit exceeded'],
    answerIndex: 0,
  },
  {
    id: 'st_linkedlist_2',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in node allocation?',
    lines: [
      'Traceback (most recent call last):',
      '  File "list.py", line 3, in <module>',
      '    head = Node(10)',
      'TypeError: Node() takes no arguments',
    ],
    choices: ['Node class lacks an __init__ constructor or does not accept val', 'Memory assignment error on new allocation', 'Missing return value inside reverse'],
    answerIndex: 0,
  },
  // --- CIRCULAR QUEUES ---
  {
    id: 'st_queue_1',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this queue insertion?',
    lines: [
      'Traceback (most recent call last):',
      '  File "queue.py", line 11, in enqueue',
      '    self.queue[self.tail] = value',
      'IndexError: list assignment index out of range',
    ],
    choices: ['Index exceeded bounds because of missing modulo wrap-around calculation', 'Adding key element to empty queue array', 'AttributeError on tail pointer object'],
    answerIndex: 0,
  },
  {
    id: 'st_queue_2',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this dequeue call?',
    lines: [
      'Traceback (most recent call last):',
      '  File "queue.py", line 22, in dequeue',
      '    if self.size == 0:',
      "AttributeError: 'CircularQueue' object has no attribute 'size'",
    ],
    choices: ['Forgot to declare or initialize self.size inside constructor __init__', 'ImportError of circular dependencies', 'TypeError comparing None with zero'],
    answerIndex: 0,
  },
  // --- DFS TREES ---
  {
    id: 'st_dfs_1',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this tree search?',
    lines: [
      'Traceback (most recent call last):',
      '  File "tree.py", line 6, in dfs',
      '    result = result + dfs(root.left)',
      '  [Previous line repeated 995 more times]',
      'RecursionError: maximum recursion depth exceeded in comparison',
    ],
    choices: ['Missing base case check (if root is None) causing infinite recursion', 'The binary tree height exceeds 1000 active nodes', 'Variable result was shadowed by local scope'],
    answerIndex: 0,
  },
  {
    id: 'st_dfs_2',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this node visit?',
    lines: [
      'Traceback (most recent call last):',
      '  File "tree.py", line 9, in dfs',
      '    result = [root.val]',
      "AttributeError: 'NoneType' object has no attribute 'val'",
    ],
    choices: ['Accessing .val on None because of missing empty-node check guard', 'Incorrect tree node initialization parameter signature', 'TypeError on list concatenation'],
    answerIndex: 0,
  },
  // --- GENERAL PYTHON CORE ---
  {
    id: 'st_general_1',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this concatenation?',
    lines: [
      'Traceback (most recent call last):',
      '  File "solution.py", line 3, in solution',
      '    print("Result: " + 42.0)',
      'TypeError: can only concatenate str (not "float") to str',
    ],
    choices: ['Trying to concatenate a float to a string directly', 'Variables were not initialized', 'Division by zero inside print'],
    answerIndex: 0,
  },
  {
    id: 'st_general_2',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this string modification?',
    lines: [
      'Traceback (most recent call last):',
      '  File "solution.py", line 5, in solution',
      '    text.append("world")',
      "AttributeError: 'str' object has no attribute 'append'",
    ],
    choices: ['Strings are immutable and do not have an append method (use concatenation or lists instead)', 'The variable text was empty', 'IndexError on character lookup'],
    answerIndex: 0,
  },
  {
    id: 'st_general_3',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this dictionary retrieval?',
    lines: [
      'Traceback (most recent call last):',
      '  File "solution.py", line 2, in solution',
      '    val = info["age"]',
      "KeyError: 'age'",
    ],
    choices: ['The dictionary does not contain the key "age"', 'info is a list, not a dictionary', 'Syntax error in bracket declaration'],
    answerIndex: 0,
  },
  {
    id: 'st_general_4',
    questionText: 'Read the traceback. Which explanation best matches what went wrong in this calculation?',
    lines: [
      'Traceback (most recent call last):',
      '  File "solution.py", line 4, in solution',
      '    avg = total / count',
      'ZeroDivisionError: division by zero',
    ],
    choices: ['The count variable is equal to zero', 'The total variable is None', 'TypeError when dividing floats'],
    answerIndex: 0,
  },
]

/** @type {CodeCompletionSeed[]} */
export const CODE_COMPLETION_SEED = [
  // --- ARRAYS / TWO SUM ---
  {
    id: 'cc_arrays_1',
    questionText: CC_PROMPT,
    code: 'def get_indices(nums):\n    for idx, val in __(nums):\n        print(idx, val)',
    choices: ['enumerate', 'range', 'len'],
    answerIndex: 0,
  },
  {
    id: 'cc_arrays_2',
    questionText: CC_PROMPT,
    code: 'seen = {}\nfor i, n in enumerate(nums):\n    diff = target - n\n    if diff __ seen:\n        return [seen[diff], i]',
    choices: ['in', 'is', '=='],
    answerIndex: 0,
  },
  // --- LINKED LISTS ---
  {
    id: 'cc_linkedlist_1',
    questionText: CC_PROMPT,
    code: 'while curr:\n    next_node = __\n    curr.next = prev\n    prev = curr\n    curr = next_node',
    choices: ['curr.next', 'curr', 'prev'],
    answerIndex: 0,
  },
  {
    id: 'cc_linkedlist_2',
    questionText: CC_PROMPT,
    code: '# Reversal exit return statement\nwhile curr:\n    # pointer swapping...\n    curr = next_node\nreturn __',
    choices: ['prev', 'curr', 'head'],
    answerIndex: 0,
  },
  // --- CIRCULAR QUEUES ---
  {
    id: 'cc_queue_1',
    questionText: CC_PROMPT,
    code: '# Update circular tail index\nself.tail = (self.tail + 1) __ self.capacity',
    choices: ['%', '//', '**'],
    answerIndex: 0,
  },
  {
    id: 'cc_queue_2',
    questionText: CC_PROMPT,
    code: '# Dequeue head index advance\nval = self.queue[self.head]\nself.head = (self.head + 1) __ self.capacity',
    choices: ['%', '//', '/'],
    answerIndex: 0,
  },
  // --- DFS TREES ---
  {
    id: 'cc_dfs_1',
    questionText: CC_PROMPT,
    code: 'def dfs(root):\n    if not root: return __\n    return [root.val] + dfs(root.left) + dfs(root.right)',
    choices: ['[]', 'None', '0'],
    answerIndex: 0,
  },
  {
    id: 'cc_dfs_2',
    questionText: CC_PROMPT,
    code: '# Combine current value with recursive results\nresult = [root.val]\nresult = result __ dfs(root.left) __ dfs(root.right)',
    choices: ['+ and +', 'extend and extend', 'append and append'],
    answerIndex: 0,
  },
  // --- GENERAL PYTHON CORE ---
  {
    id: 'cc_general_1',
    questionText: CC_PROMPT,
    code: '# Filter odd numbers from a list\nodds = [x for x in nums if x __ 2 != 0]',
    choices: ['%', '//', '/'],
    answerIndex: 0,
  },
  {
    id: 'cc_general_2',
    questionText: CC_PROMPT,
    code: '# Return default value if key is missing from dictionary\nval = my_dict.__("status", "pending")',
    choices: ['get', 'pop', 'keys'],
    answerIndex: 0,
  },
  {
    id: 'cc_general_3',
    questionText: CC_PROMPT,
    code: '# Iterate through dictionary keys and values\nfor k, v in my_dict.__():\n    print(k, v)',
    choices: ['items', 'keys', 'values'],
    answerIndex: 0,
  },
  {
    id: 'cc_general_4',
    questionText: CC_PROMPT,
    code: '# Correctly format variable inside f-string\nmsg = __"User name is {name}"',
    choices: ['f', 'r', 'format'],
    answerIndex: 0,
  },
]

/** @type {ConceptualSeed[]} */
export const CONCEPTUAL_SEED = [
  // --- ARRAYS / TWO SUM ---
  {
    id: 'co_arrays_1',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'What is the average time complexity of checking if a key exists in a Python dict?',
    choices: ['O(1)', 'O(log N)', 'O(N)'],
    answerIndex: 0,
  },
  {
    id: 'co_arrays_2',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'Why does the Two Sum hashmap solution run faster than the brute force nested loops solution?',
    choices: [
      'It trades O(N) auxiliary space to achieve O(N) time complexity',
      'It sorts the numbers array first to run binary search',
      'It removes duplicates from the array during sorting',
    ],
    answerIndex: 0,
  },
  // --- LINKED LISTS ---
  {
    id: 'co_linkedlist_1',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'Unlike contiguous array lists, how are linked list nodes stored in memory?',
    choices: [
      'Non-contiguously, linked together by pointer memory addresses',
      'In a single continuous static block of RAM',
      'Inside the call stack memory registers',
    ],
    answerIndex: 0,
  },
  {
    id: 'co_linkedlist_2',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'Why does reversing a singly linked list in-place take O(1) auxiliary memory space?',
    choices: [
      'It only reassigns pointer links without allocating new nodes',
      'It copies the list elements into a dynamic array list',
      'It deletes and reconstructs nodes from scratch',
    ],
    answerIndex: 0,
  },
  // --- CIRCULAR QUEUES ---
  {
    id: 'co_queue_1',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'What is the key advantage of a Circular Queue over a standard Array List for queue operations?',
    choices: [
      'Avoids O(N) element shifts during dequeue by wrapping pointers in O(1)',
      'Consumes less memory',
      'Can store arbitrary data types',
    ],
    answerIndex: 0,
  },
  {
    id: 'co_queue_2',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'Which processing scheduling principal defines a Queue?',
    choices: ['First-In, First-Out (FIFO)', 'Last-In, First-Out (LIFO)', 'Key-based Priority'],
    answerIndex: 0,
  },
  // --- DFS TREES ---
  {
    id: 'co_dfs_1',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'In a pre-order Depth-First Search tree traversal, when is the current node visited?',
    choices: [
      'Before traversing either the left or right subtrees',
      'After traversing the left but before the right subtree',
      'After traversing both subtrees complete',
    ],
    answerIndex: 0,
  },
  {
    id: 'co_dfs_2',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'What is the worst-case space complexity of a Depth-First Search recursion stack on a binary tree of N nodes?',
    choices: ['O(N) for a skewed degenerate tree', 'O(log N) for balanced trees', 'O(1) always'],
    answerIndex: 0,
  },
  // --- GENERAL PYTHON CORE ---
  {
    id: 'co_general_1',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'What happens when you modify a mutable parameter (like a list) inside a function in Python?',
    choices: [
      'The changes affect the original object because Python passes object references',
      'Python makes a copy of the object, so the original is unaffected',
      'An AttributeError is immediately raised in all cases',
    ],
    answerIndex: 0,
  },
  {
    id: 'co_general_2',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'Which of the following built-in collection types in Python is immutable?',
    choices: ['str', 'list', 'dict'],
    answerIndex: 0,
  },
  {
    id: 'co_general_3',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'What does the slicing expression my_list[::-1] do in Python?',
    choices: ['Returns a reversed copy of the list', 'Returns only the last element of the list', 'Raises a SyntaxError always'],
    answerIndex: 0,
  },
  {
    id: 'co_general_4',
    questionText: 'Concept check — pick the best answer.',
    prompt: 'Which collection type in Python guarantees that all stored elements are unique?',
    choices: ['set', 'list', 'tuple'],
    answerIndex: 0,
  },
]

/** Structured system architecture bank (three templates; one sampled per session). */
export const SYSTEM_ARCHITECTURE_SEED = {
  /** Payload is generated per session in QuestionEngine (drag-and-drop prev chain). */
  linked_list_memory: {
    kind: 'linked_list_memory',
  },
  circular_queue: {
    kind: 'circular_queue',
    questionText:
      'Six-slot ring buffer (indices 0–5). Run every operation in the numbered list inside the simulator, then pick the value at the head.',
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
      'Six-slot ring. Perform the full operation list in the simulator, then answer which value ends up at the head.',
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
  /** Payload is generated per session in QuestionEngine (random 4-level tree, post-order check). */
  dfs_tree: {
    kind: 'dfs_tree',
  },
}
