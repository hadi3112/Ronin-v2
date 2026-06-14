/**
 * SEED: challengeSets
 *
 * Writes all challenge question banks to Firestore.
 *
 * Types of challenge sets:
 *   "diagnostic"            — shown before any Training Grounds, uses existing custom UI
 *   "post_training_grounds" — unlocked after TG completion, targeted to what was just learned
 *   "review"                — generated on-demand for weak domain reinforcement
 *
 * The four post_training_grounds sets here correspond to the four
 * existing Training Grounds problems: two_sum, linked_list, circular_queue, dfs.
 *
 * Question structure matches the schema from the full architecture plan.
 * Options are stored as arrays — the Orchestrator Agent shuffles order per session.
 * correctOptionId must always be a stable reference (never changes on shuffle).
 *
 * Writes to: content/challengeSets/{setId}
 */

const CHALLENGE_SETS = [
  // ══════════════════════════════════════════════════════════════
  // POST TRAINING GROUNDS — Two Sum / Arrays
  // Activated after builder_module_1 (two_sum) is submitted
  // ══════════════════════════════════════════════════════════════
  {
    id: "cs_builder_m1",
    moduleId: "builder_module_1",
    type: "post_training_grounds",
    domains: ["arrays"],
    activatesAfterProblemId: "two_sum",
    questions: [
      {
        questionId: "cs_b1_q1",
        domain: "arrays",
        difficulty: 1,
        type: "conceptual",
        questionText:
          "In the two-sum problem, you need to find two numbers that add up to a target. Which data structure lets you check for the complement of a number in constant time?",
        options: [
          { id: "a", text: "Stack" },
          { id: "b", text: "Hash map" },
          { id: "c", text: "Linked list" },
          { id: "d", text: "Queue" },
        ],
        correctOptionId: "b",
        explanation:
          "A hash map (Python dictionary) stores values you have already seen so you can look them up in O(1) time — much faster than searching through the whole array again.",
        tags: ["hash-map", "lookup", "time-complexity"],
      },
      {
        questionId: "cs_b1_q2",
        domain: "arrays",
        difficulty: 1,
        type: "application",
        questionText:
          "Given the array [2, 7, 11, 15] and target 9, what pair of indices gives the correct answer?",
        options: [
          { id: "a", text: "[0, 1]" },
          { id: "b", text: "[1, 2]" },
          { id: "c", text: "[0, 2]" },
          { id: "d", text: "[2, 3]" },
        ],
        correctOptionId: "a",
        explanation:
          "nums[0] is 2 and nums[1] is 7. 2 + 7 = 9, which equals the target. So the answer is indices [0, 1].",
        tags: ["indexing", "addition"],
      },
      {
        questionId: "cs_b1_q3",
        domain: "arrays",
        difficulty: 2,
        type: "debugging",
        questionText:
          "This code has a bug:\n\nfor i in range(len(nums)):\n    for j in range(len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]\n\nWhat is wrong?",
        options: [
          { id: "a", text: "It will miss pairs at the end of the array" },
          { id: "b", text: "It compares a number with itself when i equals j" },
          { id: "c", text: "The range is off by one" },
          { id: "d", text: "Nothing is wrong" },
        ],
        correctOptionId: "b",
        explanation:
          "When i and j are the same index, the code checks if a number adds with itself. The fix is to start j at i + 1 instead of 0, or check that i != j.",
        tags: ["debugging", "nested-loops", "index-collision"],
      },
      {
        questionId: "cs_b1_q4",
        domain: "arrays",
        difficulty: 2,
        type: "conceptual",
        questionText:
          "What is the time complexity of solving two-sum using a hash map in a single pass?",
        options: [
          { id: "a", text: "O(n²)" },
          { id: "b", text: "O(n log n)" },
          { id: "c", text: "O(n)" },
          { id: "d", text: "O(1)" },
        ],
        correctOptionId: "c",
        explanation:
          "We visit each element once (that is O(n)) and each dictionary lookup is O(1), so the total is O(n). This is much better than the O(n²) brute force approach.",
        tags: ["time-complexity", "big-o", "hash-map"],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // POST TRAINING GROUNDS — Linked List
  // Activated after builder_module_5 (linked_list_reversal) is submitted
  // ══════════════════════════════════════════════════════════════
  {
    id: "cs_builder_m5",
    moduleId: "builder_module_5",
    type: "post_training_grounds",
    domains: ["linked_lists"],
    activatesAfterProblemId: "linked_list_reversal",
    questions: [
      {
        questionId: "cs_b5_q1",
        domain: "linked_lists",
        difficulty: 1,
        type: "conceptual",
        questionText:
          "When reversing a linked list, what must you save before changing a node's next pointer?",
        options: [
          { id: "a", text: "The node's value" },
          { id: "b", text: "The previous node" },
          { id: "c", text: "The next node" },
          { id: "d", text: "The head pointer" },
        ],
        correctOptionId: "c",
        explanation:
          "Once you redirect curr.next to point backwards at prev, you lose your only reference to the rest of the list. You must save curr.next into next_node first.",
        tags: ["pointers", "reversal", "order-of-operations"],
      },
      {
        questionId: "cs_b5_q2",
        domain: "linked_lists",
        difficulty: 1,
        type: "application",
        questionText:
          "After reversing the list [1 → 2 → 3 → None], what does the head now point to?",
        options: [
          { id: "a", text: "Node with value 1" },
          { id: "b", text: "Node with value 2" },
          { id: "c", text: "Node with value 3" },
          { id: "d", text: "None" },
        ],
        correctOptionId: "c",
        explanation:
          "After reversing, the last node (3) becomes the new head. The list is now 3 → 2 → 1 → None.",
        tags: ["reversal", "head-pointer"],
      },
      {
        questionId: "cs_b5_q3",
        domain: "linked_lists",
        difficulty: 2,
        type: "debugging",
        questionText:
          "A student wrote this reversal loop:\n\nprev = curr\ncurr = curr.next\ncurr.next = prev\n\nWhat is the bug?",
        options: [
          { id: "a", text: "prev is assigned to the wrong node" },
          { id: "b", text: "curr moves before the next pointer is saved, then next pointer assignment uses the already-moved curr" },
          { id: "c", text: "The loop will never terminate" },
          { id: "d", text: "There is no bug" },
        ],
        correctOptionId: "b",
        explanation:
          "The correct order is: (1) save next_node = curr.next, (2) point curr.next = prev, (3) move prev = curr, (4) move curr = next_node. In the buggy version curr moves first, making the next pointer assignment wrong.",
        tags: ["debugging", "pointer-order", "three-pointer"],
      },
      {
        questionId: "cs_b5_q4",
        domain: "linked_lists",
        difficulty: 2,
        type: "conceptual",
        questionText:
          "What is the space complexity of reversing a linked list in place using three pointers?",
        options: [
          { id: "a", text: "O(n)" },
          { id: "b", text: "O(n²)" },
          { id: "c", text: "O(log n)" },
          { id: "d", text: "O(1)" },
        ],
        correctOptionId: "d",
        explanation:
          "We only use three extra variables (prev, curr, next_node) regardless of how long the list is. The memory used does not grow with the input — that is O(1) space.",
        tags: ["space-complexity", "in-place", "big-o"],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // POST TRAINING GROUNDS — Circular Queue
  // Activated after builder_module_6 (circular_queue) is submitted
  // ══════════════════════════════════════════════════════════════
  {
    id: "cs_builder_m6",
    moduleId: "builder_module_6",
    type: "post_training_grounds",
    domains: ["queues"],
    activatesAfterProblemId: "circular_queue",
    questions: [
      {
        questionId: "cs_b6_q1",
        domain: "queues",
        difficulty: 1,
        type: "conceptual",
        questionText:
          "In a circular queue, how do you calculate the next position after the tail reaches the last index?",
        options: [
          { id: "a", text: "tail + 1" },
          { id: "b", text: "tail - 1" },
          { id: "c", text: "(tail + 1) % capacity" },
          { id: "d", text: "Reset tail to zero every time" },
        ],
        correctOptionId: "c",
        explanation:
          "The modulo operator wraps the index back to the beginning. Think of it like a clock — after 12 comes 1, not 13. (tail + 1) % capacity does the same thing for queue positions.",
        tags: ["modulo", "wrap-around", "circular"],
      },
      {
        questionId: "cs_b6_q2",
        domain: "queues",
        difficulty: 2,
        type: "application",
        questionText:
          "A circular queue has capacity 4, head at index 1, tail at index 3. After one enqueue, where is the tail?",
        options: [
          { id: "a", text: "Index 4" },
          { id: "b", text: "Index 0" },
          { id: "c", text: "Index 2" },
          { id: "d", text: "Index 3" },
        ],
        correctOptionId: "b",
        explanation:
          "(3 + 1) % 4 = 0. The tail wraps from the last index back to index 0. Index 4 does not exist in a 4-capacity queue.",
        tags: ["modulo", "index-wrap", "application"],
      },
      {
        questionId: "cs_b6_q3",
        domain: "queues",
        difficulty: 2,
        type: "debugging",
        questionText:
          "This enqueue code has a bug:\n\nself.tail = self.tail + 1\nself.queue[self.tail] = value\n\nWhat breaks when tail equals capacity minus 1?",
        options: [
          { id: "a", text: "The value is stored at the wrong index" },
          { id: "b", text: "Tail goes out of bounds instead of wrapping around" },
          { id: "c", text: "Head moves incorrectly" },
          { id: "d", text: "Nothing breaks" },
        ],
        correctOptionId: "b",
        explanation:
          "If capacity is 4 and tail is 3, adding 1 gives tail = 4. But index 4 does not exist. The fix is to use modulo: self.tail = (self.tail + 1) % self.capacity.",
        tags: ["debugging", "index-bounds", "modulo"],
      },
      {
        questionId: "cs_b6_q4",
        domain: "queues",
        difficulty: 2,
        type: "conceptual",
        questionText:
          "How do you tell the difference between a full circular queue and an empty one if you only track head and tail?",
        options: [
          { id: "a", text: "You cannot distinguish them" },
          { id: "b", text: "Full when tail equals head, empty when tail is -1" },
          { id: "c", text: "Track a separate size counter or use a boolean flag" },
          { id: "d", text: "Full when head is at index zero" },
        ],
        correctOptionId: "c",
        explanation:
          "When the queue is full and when it is empty, tail and head can end up at the same position. A size counter (or isFull flag) is the clean solution to tell them apart.",
        tags: ["full-vs-empty", "state-tracking", "design"],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // POST TRAINING GROUNDS — DFS / Trees
  // Activated after builder_module_7 (dfs_traversal) is submitted
  // ══════════════════════════════════════════════════════════════
  {
    id: "cs_builder_m7",
    moduleId: "builder_module_7",
    type: "post_training_grounds",
    domains: ["trees"],
    activatesAfterProblemId: "dfs_traversal",
    questions: [
      {
        questionId: "cs_b7_q1",
        domain: "trees",
        difficulty: 1,
        type: "conceptual",
        questionText:
          "In DFS on a tree, which data structure is used implicitly by the recursion?",
        options: [
          { id: "a", text: "Queue" },
          { id: "b", text: "Hash map" },
          { id: "c", text: "Stack" },
          { id: "d", text: "Array" },
        ],
        correctOptionId: "c",
        explanation:
          "Every time a function calls itself recursively, Python adds a new frame to the call stack. This is literally a stack data structure. That is why DFS naturally goes deep before going wide.",
        tags: ["recursion", "call-stack", "implicit-structure"],
      },
      {
        questionId: "cs_b7_q2",
        domain: "trees",
        difficulty: 1,
        type: "application",
        questionText:
          "For a tree with root 1, left child 2, right child 3, and left child of 2 being 4 — what is the pre-order DFS traversal?",
        options: [
          { id: "a", text: "[4, 2, 1, 3]" },
          { id: "b", text: "[1, 2, 4, 3]" },
          { id: "c", text: "[1, 3, 2, 4]" },
          { id: "d", text: "[4, 2, 3, 1]" },
        ],
        correctOptionId: "b",
        explanation:
          "Pre-order means: visit current node first, then left subtree, then right subtree. Starting from 1: visit 1, go left to 2, visit 2, go left to 4, visit 4, backtrack, go right from 1 to 3, visit 3. Result: [1, 2, 4, 3].",
        tags: ["pre-order", "traversal-order", "application"],
      },
      {
        questionId: "cs_b7_q3",
        domain: "trees",
        difficulty: 2,
        type: "debugging",
        questionText:
          "A DFS function on a graph visits a node but never marks it as visited. What happens if the graph has a cycle?",
        options: [
          { id: "a", text: "It terminates early" },
          { id: "b", text: "It skips nodes" },
          { id: "c", text: "It runs forever in an infinite loop" },
          { id: "d", text: "It returns the wrong path but still terminates" },
        ],
        correctOptionId: "c",
        explanation:
          "Without a visited set, the function will keep following the cycle — node A goes to B, B goes to A, A goes to B again, forever. Always mark nodes as visited before recursing on a graph (trees do not have this problem because they have no cycles).",
        tags: ["cycles", "visited-set", "infinite-loop"],
      },
      {
        questionId: "cs_b7_q4",
        domain: "trees",
        difficulty: 2,
        type: "conceptual",
        questionText:
          "What is the time complexity of DFS on a graph with V vertices and E edges?",
        options: [
          { id: "a", text: "O(V)" },
          { id: "b", text: "O(E)" },
          { id: "c", text: "O(V × E)" },
          { id: "d", text: "O(V + E)" },
        ],
        correctOptionId: "d",
        explanation:
          "DFS visits every vertex once (that is V operations) and processes every edge once (that is E operations). Together that is O(V + E). On a tree with no extra edges, this simplifies to O(n) where n is the number of nodes.",
        tags: ["time-complexity", "graphs", "big-o"],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // POST TRAINING GROUNDS — Syntax and Array Basics
  // Mixed set shown alongside the four domain sets
  // ══════════════════════════════════════════════════════════════
  {
    id: "cs_builder_syntax",
    moduleId: null,
    type: "post_training_grounds",
    domains: ["syntax", "arrays"],
    activatesAfterProblemId: "two_sum",
    questions: [
      {
        questionId: "cs_syn_q1",
        domain: "syntax",
        difficulty: 1,
        type: "syntax",
        questionText:
          "What does this print?\n\nnums = [3, 1, 4, 1, 5]\nprint(nums[2])",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "3" },
          { id: "c", text: "4" },
          { id: "d", text: "5" },
        ],
        correctOptionId: "c",
        explanation:
          "Python lists use zero-based indexing. Index 0 is 3, index 1 is 1, index 2 is 4. So nums[2] is 4.",
        tags: ["indexing", "zero-based", "lists"],
      },
      {
        questionId: "cs_syn_q2",
        domain: "syntax",
        difficulty: 1,
        type: "syntax",
        questionText:
          "Which line correctly adds a value to a Python list called items?",
        options: [
          { id: "a", text: "items.push(5)" },
          { id: "b", text: "items.add(5)" },
          { id: "c", text: "items.append(5)" },
          { id: "d", text: "items.insert(5)" },
        ],
        correctOptionId: "c",
        explanation:
          "Python uses .append() to add an item to the end of a list. .push() is JavaScript, .add() is for sets, and .insert() requires two arguments (position and value).",
        tags: ["list-methods", "append", "syntax"],
      },
      {
        questionId: "cs_syn_q3",
        domain: "syntax",
        difficulty: 1,
        type: "debugging",
        questionText:
          "What is wrong?\n\nfor i in range(5):\n    total = total + i\nprint(total)",
        options: [
          { id: "a", text: "range should be range(1, 5)" },
          { id: "b", text: "total is used before it is defined" },
          { id: "c", text: "print is inside the loop" },
          { id: "d", text: "Nothing is wrong" },
        ],
        correctOptionId: "b",
        explanation:
          "total is referenced on the right side of the assignment before it has ever been given a value. The fix is to add total = 0 before the loop starts.",
        tags: ["undefined-variable", "initialization", "debugging"],
      },
    ],
  },
];

module.exports = async function seedChallengeSets(db, config) {
  let written = 0;
  let skipped = 0;
  let errors = 0;

  for (const challengeSet of CHALLENGE_SETS) {
    try {
      const docRef = db
        .collection("content")
        .doc("challengeSets")
        .collection("items")
        .doc(challengeSet.id);

      if (!config.DRY_RUN) {
        if (!config.OVERWRITE_EXISTING) {
          const existing = await docRef.get();
          if (existing.exists) {
            console.log(`  ⏭  Skipping challenge set "${challengeSet.id}" — already exists`);
            skipped++;
            continue;
          }
        }
        await docRef.set({
          ...challengeSet,
          questionCount: challengeSet.questions.length,
          createdAt: new Date().toISOString(),
        });
      } else {
        console.log(`  [DRY RUN] Would write challenge set: ${challengeSet.id}`);
      }

      console.log(
        `  ✓  ${challengeSet.id}: ${challengeSet.questions.length} questions (${challengeSet.domains.join(", ")})`
      );
      written++;
    } catch (err) {
      console.error(`  ❌ Error writing challenge set "${challengeSet.id}": ${err.message}`);
      errors++;
    }
  }

  return { written, skipped, errors };
};
