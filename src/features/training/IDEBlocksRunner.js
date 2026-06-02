/**
 * IDEBlocksRunner.js
 * 
 * Manages block datasets for the four problems, Python test validation script generators,
 * and the simulated Gemini cognitive hint engine.
 */

export const PROBLEM_BLOCKS = {
  two_sum: [
    {
      id: 'b1',
      code: 'def solution(nums, target):\n    seen = {}',
      explanation: 'Declares the solution function and initializes an empty dictionary to store seen values.',
      correctPosition: 1,
    },
    {
      id: 'b2',
      code: '    for i, num in enumerate(nums):\n        diff = target - num',
      explanation: 'Loops through list values and calculates the difference needed to reach the target sum.',
      correctPosition: 2,
    },
    {
      id: 'b3',
      code: '        if diff in seen:\n            return [seen[diff], i]',
      explanation: "Returns the matched pair of indices if the required difference is in the seen dictionary.",
      correctPosition: 3,
    },
    {
      id: 'b4',
      code: '        seen[num] = i\n    return []',
      explanation: 'Records the current number in the dictionary, returning empty list if no pair is found.',
      correctPosition: 4,
    },
  ],
  linked_list_reversal: [
    {
      id: 'b1',
      code: 'def reverse(head):\n    prev = None\n    curr = head',
      explanation: 'Defines the reverse function and sets prev to None and curr to the head node.',
      correctPosition: 1,
    },
    {
      id: 'b2',
      code: '    while curr is not None:',
      explanation: 'Loops through the linked list until curr pointer reaches the end.',
      correctPosition: 2,
    },
    {
      id: 'b3',
      code: '        next_node = curr.next\n        curr.next = prev',
      explanation: "Temporarily stores the next node and points the current node's next backward.",
      correctPosition: 3,
    },
    {
      id: 'b4',
      code: '        prev = curr\n        curr = next_node\n    return prev',
      explanation: 'Advances prev and curr pointers, then returns prev (the new head).',
      correctPosition: 4,
    },
  ],
  dfs_traversal: [
    {
      id: 'b1',
      code: 'def dfs(root):\n    if root is None:\n        return []',
      explanation: 'Defines dfs function and returns empty list if node is empty.',
      correctPosition: 1,
    },
    {
      id: 'b2',
      code: '    result = [root.val]',
      explanation: 'Pre-order visit: initializes the result list with current node value.',
      correctPosition: 2,
    },
    {
      id: 'b3',
      code: '    # Traverse left subtree\n    result = result + dfs(root.left)',
      explanation: 'Recursively performs DFS on left child and appends matching values.',
      correctPosition: 3,
    },
    {
      id: 'b4',
      code: '    # Traverse right subtree\n    result = result + dfs(root.right)\n    return result',
      explanation: 'Recursively performs DFS on right child and returns the accumulated result.',
      correctPosition: 4,
    },
  ],
  circular_queue: [
    {
      id: 'b1',
      code: '    def enqueue(self, value):\n        if self.size == self.capacity:\n            return False',
      explanation: 'Declares enqueue method and rejects the value if queue size is at capacity.',
      correctPosition: 1,
    },
    {
      id: 'b2',
      code: '        self.queue[self.tail] = value\n        self.tail = (self.tail + 1) % self.capacity\n        self.size += 1',
      explanation: 'Stores value at tail index, updates tail modulo capacity, and increments size.',
      correctPosition: 2,
    },
    {
      id: 'b3',
      code: '        return True',
      explanation: 'Returns True for a successful enqueue operation.',
      correctPosition: 3,
    },
    {
      id: 'b4',
      code: '    def dequeue(self):\n        if self.size == 0:\n            return None',
      explanation: 'Declares dequeue method and returns None if queue is empty.',
      correctPosition: 4,
    },
    {
      id: 'b5',
      code: '        value = self.queue[self.head]\n        self.head = (self.head + 1) % self.capacity\n        self.size -= 1',
      explanation: 'Gets value at head, updates head modulo capacity, and decrements size.',
      correctPosition: 5,
    },
    {
      id: 'b6',
      code: '        return value',
      explanation: 'Returns the dequeued value.',
      correctPosition: 6,
    },
  ],
}

/**
 * Generate Pyodide assertions wrapper code.
 * @param {string} problemId
 * @returns {string}
 */
export function getTestCodeForProblem(problemId) {
  if (problemId === 'two_sum') {
    return `
# two_sum validation
tests = [
  {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expected": [0, 1]},
  {"input": {"nums": [3, 2, 4], "target": 6}, "expected": [1, 2]},
  {"input": {"nums": [3, 3], "target": 6}, "expected": [0, 1]},
  {"input": {"nums": [1], "target": 1}, "expected": []},
  {"input": {"nums": [15, 14, 22, 28, 35, 40], "target": 49}, "expected": [1, 4]}
]

passed_all = True
for idx, tc in enumerate(tests):
    try:
        res = solution(tc["input"]["nums"], tc["input"]["target"])
        if sorted(res) != sorted(tc["expected"]):
            passed_all = False
            print(f"Test case {idx+1} failed: expected {tc['expected']}, got {res}")
            break
    except Exception as e:
        passed_all = False
        print(f"Test case {idx+1} raised exception: {e}")
        break

if passed_all:
    print("ALL TESTS PASSED")
`;
  }

  if (problemId === 'linked_list_reversal') {
    return `
# linked_list_reversal validation
def array_to_list(arr):
    if not arr: return None
    head = Node(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = Node(v)
        curr = curr.next
    return head

def list_to_array(head):
    arr = []
    curr = head
    while curr:
        arr.append(curr.val)
        curr = curr.next
    return arr

tests = [
  {"input": [1, 2, 3, 4, 5], "expected": [5, 4, 3, 2, 1]},
  {"input": [1, 2, 3], "expected": [3, 2, 1]},
  {"input": [10, 20], "expected": [20, 10]},
  {"input": [1], "expected": [1]},
  {"input": [7, 14, 21, 28, 35, 42], "expected": [42, 35, 28, 21, 14, 7]}
]

passed_all = True
for idx, tc in enumerate(tests):
    try:
        head = array_to_list(tc["input"])
        rev_head = reverse(head)
        res = list_to_array(rev_head)
        if res != tc["expected"]:
            passed_all = False
            print(f"Test case {idx+1} failed: expected {tc['expected']}, got {res}")
            break
    except Exception as e:
        passed_all = False
        print(f"Test case {idx+1} raised exception: {e}")
        break

if passed_all:
    print("ALL TESTS PASSED")
`;
  }

  if (problemId === 'dfs_traversal') {
    return `
# dfs_traversal validation
def dict_to_tree(d):
    if d is None: return None
    node = TreeNode(d["val"])
    node.left = dict_to_tree(d["left"])
    node.right = dict_to_tree(d["right"])
    return node

tests = [
  {
    "input": {
      "val": 1,
      "left": {
        "val": 2,
        "left": { "val": 4, "left": None, "right": None },
        "right": { "val": 5, "left": None, "right": None }
      },
      "right": { "val": 3, "left": None, "right": None }
    },
    "expected": [1, 2, 4, 5, 3]
  },
  {
    "input": {
      "val": 1,
      "left": None,
      "right": {
        "val": 2,
        "left": None,
        "right": { "val": 3, "left": None, "right": None }
      }
    },
    "expected": [1, 2, 3]
  },
  {
    "input": {
      "val": 10,
      "left": { "val": 5, "left": None, "right": None },
      "right": { "val": 15, "left": None, "right": None }
    },
    "expected": [10, 5, 15]
  },
  {
    "input": { "val": 7, "left": None, "right": None },
    "expected": [7]
  },
  {
    "input": {
      "val": 1,
      "left": {
        "val": 2,
        "left": {
          "val": 3,
          "left": { "val": 4, "left": None, "right": None },
          "right": None
        },
        "right": None
      },
      "right": None
    },
    "expected": [1, 2, 3, 4]
  }
]

passed_all = True
for idx, tc in enumerate(tests):
    try:
        root = dict_to_tree(tc["input"])
        res = dfs(root)
        if res != tc["expected"]:
            passed_all = False
            print(f"Test case {idx+1} failed: expected {tc['expected']}, got {res}")
            break
    except Exception as e:
        passed_all = False
        print(f"Test case {idx+1} raised exception: {e}")
        break

if passed_all:
    print("ALL TESTS PASSED")
`;
  }

  if (problemId === 'circular_queue') {
    return `
# circular_queue validation
def run_queue_test(capacity, operations):
    q = CircularQueue(capacity)
    enqueue_results = []
    dequeue_results = []
    for op in operations:
        parts = op.split()
        cmd = parts[0]
        if cmd == "enqueue":
            val = int(parts[1])
            enqueue_results.append(q.enqueue(val))
        elif cmd == "dequeue":
            dequeue_results.append(q.dequeue())
    return enqueue_results, dequeue_results

passed_all = True
try:
    # Test 1
    enq, deq = run_queue_test(3, ["enqueue 10", "enqueue 20", "enqueue 30", "dequeue"])
    if enq != [True, True, True] or deq != [10]:
        passed_all = False
        print("Test case 1 failed")

    # Test 2
    if passed_all:
        enq, deq = run_queue_test(3, ["enqueue 5", "dequeue", "enqueue 15", "dequeue"])
        if deq != [5, 15]:
            passed_all = False
            print("Test case 2 failed")

    # Test 3
    if passed_all:
        enq, deq = run_queue_test(2, ["enqueue 1", "enqueue 2", "enqueue 3"])
        if enq != [True, True, False]:
            passed_all = False
            print("Test case 3 failed")

    # Test 4
    if passed_all:
        enq, deq = run_queue_test(1, ["dequeue"])
        if deq != [None]:
            passed_all = False
            print("Test case 4 failed")

    # Test 5
    if passed_all:
        enq, deq = run_queue_test(3, [
          "enqueue 10", "enqueue 20", "enqueue 30",
          "dequeue", "dequeue", "dequeue",
          "enqueue 40", "enqueue 50"
        ])
        if deq[:3] != [10, 20, 30] or enq[3:] != [True, True]:
            passed_all = False
            print("Test case 5 failed")
except Exception as e:
    passed_all = False
    print(f"Queue validation raised exception: {e}")

if passed_all:
    print("ALL TESTS PASSED")
`;
  }

  return '';
}

const CORRECT_SEQUENCES = {
  two_sum: [
    "1. Define solution function and initialize empty seen dictionary",
    "2. Loop through numbers list and calculate targets difference",
    "3. Check dictionary for the difference and return matched pair of indices",
    "4. Store current number index, or return empty list if loop completes"
  ],
  linked_list_reversal: [
    "1. Define reverse function and set prev = None, curr = head",
    "2. Traverse the list in a while loop while curr is not None",
    "3. Save next_node reference and redirect curr.next link backward to prev",
    "4. Advance prev and curr pointers forward, and finally return new head (prev)"
  ],
  dfs_traversal: [
    "1. Define dfs function and handle base case returning [] if empty root",
    "2. Visit current node by initializing list with root.val",
    "3. Traverse left subtree recursively and append results",
    "4. Traverse right subtree recursively and return complete list"
  ],
  circular_queue: [
    "1. Declare enqueue method and check if queue size is at capacity limit",
    "2. Place value at tail index and increment tail pointer modulo capacity",
    "3. Increment queue size count and return True",
    "4. Declare dequeue method and return None if active size is 0",
    "5. Retrieve value at head, advance head modulo capacity, decrement size",
    "6. Return the dequeued value"
  ]
}

/**
 * Option A: Local simulated Gemini hint generator.
 * Analyzes the user's current block order and outputs the pre-stored correct step sequence.
 * 
 * @param {string} problemId
 * @param {Array<{ id: string; correctPosition: number }>} currentOrder - blocks in user's current order
 * @returns {string} - Full pre-stored correct step sequence.
 */
export function generateGeminiHint(problemId, currentOrder) {
  const seq = CORRECT_SEQUENCES[problemId]
  if (seq) {
    return `To solve this problem correctly, make sure your code blocks match this sequence:\n\n${seq.join('\n')}`
  }
  return 'Review your block arrangement sequence. Double check that operations execute in the correct mathematical order!'
}
