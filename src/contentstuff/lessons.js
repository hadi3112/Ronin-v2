/**
 * SEED: lessons
 *
 * Seeds lesson metadata for all three tracks.
 *
 * IMPORTANT: This seed writes metadata only — titles, concepts, timing,
 * and visualization type. The actual lesson content (markdown text,
 * embedded code examples) is stored either as:
 *   (a) a contentMarkdown field inline (for short lessons)
 *   (b) a Cloud Storage path for longer rich content
 *
 * For the initial migration, lessons for Foundations modules 1-2 and
 * all Builder modules (1, 5, 6, 7) are seeded since those are the
 * modules tied to existing Training Grounds problems.
 *
 * Remaining lessons are seeded as stubs (isContentReady: false)
 * so the schema is complete even if content is not written yet.
 *
 * Writes to: content/lessons/{lessonId}
 */

// Helper to create a lesson stub — content to be written later
function stub(id, moduleId, trackId, lessonNumber, title, conceptName, estimatedMinutes = 15) {
  return {
    id,
    moduleId,
    trackId,
    lessonNumber,
    title,
    conceptName,
    estimatedMinutes,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: false,
    contentMarkdown: null,
    contentStoragePath: null,
    createdAt: new Date().toISOString(),
  };
}

const LESSONS = [
  // ══════════════════════════════════════════════════════════════
  // BUILDER MODULE 1 — Lists at Depth (before Two Sum)
  // ══════════════════════════════════════════════════════════════
  {
    id: "builder_m1_l1",
    moduleId: "builder_module_1",
    trackId: "builder",
    lessonNumber: 1,
    title: "Lists as Arrays",
    conceptName: "contiguous memory and indexing mental model",
    estimatedMinutes: 12,
    hasVisualization: true,
    visualizationType: "phaser_array",
    isContentReady: true,
    contentMarkdown: `## Lists as Arrays

A Python list stores items in a row, one after another. Think of it like a row of numbered lockers — each locker holds one value and has an address (its index) starting at zero.

When you write \`nums[0]\`, Python goes directly to the first locker and reads what's inside. This is called **indexing**.

\`\`\`python
nums = [10, 20, 30, 40]
#        0   1   2   3   ← these are the indices

print(nums[0])  # 10
print(nums[2])  # 30
print(nums[3])  # 40
\`\`\`

The last valid index is always \`len(nums) - 1\`. Going above that causes an **IndexError**.`,
    contentStoragePath: null,
  },
  {
    id: "builder_m1_l2",
    moduleId: "builder_module_1",
    trackId: "builder",
    lessonNumber: 2,
    title: "Slicing",
    conceptName: "extracting a portion of a list",
    estimatedMinutes: 10,
    hasVisualization: true,
    visualizationType: "phaser_array",
    isContentReady: true,
    contentMarkdown: `## Slicing

Slicing lets you extract a portion of a list without changing the original.

\`\`\`python
nums = [10, 20, 30, 40, 50]

print(nums[1:3])   # [20, 30]  — from index 1 up to (not including) index 3
print(nums[:2])    # [10, 20]  — from the start up to index 2
print(nums[3:])    # [40, 50]  — from index 3 to the end
print(nums[::-1])  # [50, 40, 30, 20, 10]  — reversed
\`\`\`

Slicing creates a new list. The original is untouched.`,
    contentStoragePath: null,
  },
  stub("builder_m1_l3", "builder_module_1", "builder", 3, "List Comprehensions", "concise list creation", 15),
  stub("builder_m1_l4", "builder_module_1", "builder", 4, "Sorting and Searching", "sorted(), min(), max(), in operator", 12),

  // ══════════════════════════════════════════════════════════════
  // BUILDER MODULE 5 — Linked Lists (before Linked List Reversal)
  // ══════════════════════════════════════════════════════════════
  {
    id: "builder_m5_l1",
    moduleId: "builder_module_5",
    trackId: "builder",
    lessonNumber: 1,
    title: "What Is a Linked List",
    conceptName: "nodes, pointers, and why linked lists exist",
    estimatedMinutes: 15,
    hasVisualization: true,
    visualizationType: "phaser_linked_list",
    isContentReady: true,
    contentMarkdown: `## What Is a Linked List

A linked list is a chain of **nodes**. Each node stores two things: a value, and an arrow (pointer) to the next node. The last node points to nothing (\`None\`).

Unlike a regular list, the nodes are not stored next to each other in memory. They are scattered around, connected only by their pointers.

\`\`\`python
class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Building: 1 → 2 → 3 → None
head = Node(1)
head.next = Node(2)
head.next.next = Node(3)
\`\`\`

**Why use a linked list instead of a regular list?**
Inserting or removing from the middle of a linked list is fast — you just rewire one pointer. In a regular list, Python has to shift every item after the insertion point.`,
    contentStoragePath: null,
  },
  {
    id: "builder_m5_l2",
    moduleId: "builder_module_5",
    trackId: "builder",
    lessonNumber: 2,
    title: "Pointer Mechanics",
    conceptName: "how pointers connect nodes and how to traverse a list",
    estimatedMinutes: 15,
    hasVisualization: true,
    visualizationType: "phaser_linked_list",
    isContentReady: true,
    contentMarkdown: `## Pointer Mechanics

To read every value in a linked list, you start at \`head\` and follow the \`next\` pointer until you hit \`None\`.

\`\`\`python
current = head
while current is not None:
    print(current.val)
    current = current.next
\`\`\`

**The danger:** if you change \`current.next\` before moving \`current\` forward, you lose the rest of the list. This is the core challenge in linked list problems — the order in which you change pointers matters.

The Phaser visualization on the next screen shows this pointer rewiring in slow motion so you can see exactly what happens at each step.`,
    contentStoragePath: null,
  },

  // ══════════════════════════════════════════════════════════════
  // BUILDER MODULE 6 — Stacks and Queues (before Circular Queue)
  // ══════════════════════════════════════════════════════════════
  {
    id: "builder_m6_l1",
    moduleId: "builder_module_6",
    trackId: "builder",
    lessonNumber: 1,
    title: "The Stack — Last In, First Out",
    conceptName: "LIFO data structure and real-world examples",
    estimatedMinutes: 12,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## The Stack

A stack follows one rule: **the last item added is the first item removed**. This is called LIFO — Last In, First Out.

Real examples: the undo history in a text editor, the browser back button, and the call stack when functions call each other.

\`\`\`python
stack = []
stack.append(1)   # push
stack.append(2)
stack.append(3)
print(stack.pop()) # 3 — last in, first out
print(stack.pop()) # 2
\`\`\``,
    contentStoragePath: null,
  },
  {
    id: "builder_m6_l2",
    moduleId: "builder_module_6",
    trackId: "builder",
    lessonNumber: 2,
    title: "The Queue — First In, First Out",
    conceptName: "FIFO data structure and real-world examples",
    estimatedMinutes: 12,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## The Queue

A queue follows the opposite rule: **the first item added is the first item removed**. This is called FIFO — First In, First Out.

Real examples: a print queue, customers waiting in line, task scheduling in an operating system.

\`\`\`python
from collections import deque

queue = deque()
queue.append(1)     # enqueue
queue.append(2)
queue.append(3)
print(queue.popleft())  # 1 — first in, first out
print(queue.popleft())  # 2
\`\`\``,
    contentStoragePath: null,
  },
  {
    id: "builder_m6_l3",
    moduleId: "builder_module_6",
    trackId: "builder",
    lessonNumber: 3,
    title: "The Modulo Operator — Wrapping Around",
    conceptName: "using % for circular index arithmetic",
    estimatedMinutes: 10,
    hasVisualization: true,
    visualizationType: "phaser_circular_queue",
    isContentReady: true,
    contentMarkdown: `## The Modulo Operator

The modulo operator (\`%\`) gives you the **remainder** after division.

\`\`\`python
5 % 3  # → 2   (5 divided by 3 leaves remainder 2)
3 % 3  # → 0   (3 divided by 3 leaves no remainder)
4 % 3  # → 1
\`\`\`

This is how we make a queue circular. When the tail pointer reaches the last index, instead of falling off the edge, it wraps back to index 0:

\`\`\`python
next_position = (current_position + 1) % capacity
\`\`\`

Think of it like a clock. After 12 comes 1, not 13. The modulo operator does exactly that.`,
    contentStoragePath: null,
  },

  // ══════════════════════════════════════════════════════════════
  // BUILDER MODULE 7 — Trees and DFS (before DFS Traversal)
  // ══════════════════════════════════════════════════════════════
  {
    id: "builder_m7_l1",
    moduleId: "builder_module_7",
    trackId: "builder",
    lessonNumber: 1,
    title: "What Is a Tree",
    conceptName: "hierarchical data, nodes, children, leaves",
    estimatedMinutes: 12,
    hasVisualization: true,
    visualizationType: "phaser_dfs_tree",
    isContentReady: true,
    contentMarkdown: `## What Is a Tree

A tree organizes data in a hierarchy — like a family tree or a company org chart. Every item in a tree is a **node**. Nodes are connected by edges. The top node is called the **root**. Nodes with no children are called **leaves**.

In a **binary tree**, every node has at most two children — a left child and a right child.

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Building this tree:
#       1
#      / \\
#     2   3
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
\`\`\``,
    contentStoragePath: null,
  },
  stub("builder_m7_l2", "builder_module_7", "builder", 2, "Tree Traversal Orders", "pre-order, in-order, post-order", 15),
  stub("builder_m7_l3", "builder_module_7", "builder", 3, "DFS with Recursion", "how recursion maps to tree traversal", 15),

  // Stub lessons for remaining modules (content to be added as platform grows)
  stub("builder_m2_l1", "builder_module_2", "builder", 1, "Why Dictionaries Exist", "the lookup problem", 12),
  stub("builder_m2_l2", "builder_module_2", "builder", 2, "Key-Value Pairs", "creating and accessing dicts", 12),
  stub("builder_m2_l3", "builder_module_2", "builder", 3, "Common Dictionary Operations", "get, update, delete, iterate", 15),
  stub("builder_m2_l4", "builder_module_2", "builder", 4, "Dictionaries as Frequency Counters", "counting occurrences", 15),
  stub("builder_m3_l1", "builder_module_3", "builder", 1, "Strings as Sequences", "indexing, slicing, immutability", 12),
  stub("builder_m3_l2", "builder_module_3", "builder", 2, "Common String Methods", ".split(), .join(), .lower(), .strip()", 12),
  stub("builder_m3_l3", "builder_module_3", "builder", 3, "String Formatting", "f-strings and format()", 10),
  stub("builder_m3_l4", "builder_module_3", "builder", 4, "Two-Pointer Patterns on Strings", "palindrome detection", 15),
  stub("builder_m4_l1", "builder_module_4", "builder", 1, "Functions Calling Themselves", "the recursion mental model", 15),
  stub("builder_m4_l2", "builder_module_4", "builder", 2, "Base Case and Recursive Case", "when recursion stops", 12),
  stub("builder_m4_l3", "builder_module_4", "builder", 3, "The Call Stack Visualized", "what Python does internally", 15),
  stub("builder_m4_l4", "builder_module_4", "builder", 4, "Common Recursion Patterns", "factorial, fibonacci, sum", 15),
  stub("builder_m8_l1", "builder_module_8", "builder", 1, "Why Sorting Is Hard", "comparison operations and stability", 12),
  stub("builder_m8_l2", "builder_module_8", "builder", 2, "Bubble Sort", "visual step-by-step", 15),
  stub("builder_m8_l3", "builder_module_8", "builder", 3, "Merge Sort", "divide and conquer intuition", 20),
  stub("builder_m8_l4", "builder_module_8", "builder", 4, "Python Built-in Sort", "sorted(), .sort(), key= argument", 10),
];

module.exports = async function seedLessons(db, config) {
  let written = 0;
  let skipped = 0;
  let errors = 0;

  for (const lesson of LESSONS) {
    try {
      const docRef = db
        .collection("content")
        .doc("lessons")
        .collection("items")
        .doc(lesson.id);

      if (!config.DRY_RUN) {
        if (!config.OVERWRITE_EXISTING) {
          const existing = await docRef.get();
          if (existing.exists) {
            console.log(`  ⏭  Skipping lesson "${lesson.id}" — already exists`);
            skipped++;
            continue;
          }
        }
        await docRef.set(lesson);
      } else {
        console.log(`  [DRY RUN] Would write lesson: ${lesson.id}`);
      }

      const readyFlag = lesson.isContentReady ? "✓" : "stub";
      console.log(`  ${readyFlag}  ${lesson.id}: ${lesson.title}`);
      written++;
    } catch (err) {
      console.error(`  ❌ Error writing lesson "${lesson.id}": ${err.message}`);
      errors++;
    }
  }

  return { written, skipped, errors };
};
