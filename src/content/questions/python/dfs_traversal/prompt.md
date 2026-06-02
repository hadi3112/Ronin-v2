# Depth-First Search on a Tree

Imagine you are exploring a cave system. You walk into a tunnel and
keep going as deep as you can until you hit a dead end. Then you
turn back, take the nearest unexplored branch, and go as deep as
you can again. You repeat this until you have visited every part
of the cave.

That is **Depth-First Search**. Instead of a cave, we have a tree
made of nodes. Each node has a value and can have a left child and
a right child. We want to visit every node and collect all their
values in the order we visit them.

---

### The Visit Order: Pre-Order

We will use **pre-order** traversal, which means:

1. Visit the current node first — record its value
2. Then explore the left branch as deep as possible
3. Then explore the right branch as deep as possible

---

### What you are working with

Each node has:
- `val` — the number stored in this node
- `left` — the left child node (or `None` if there is no left child)
- `right` — the right child node (or `None` if there is no right child)

A `TreeNode` class is already provided. Write the `dfs` function
that takes the root node and returns a list of values in pre-order.

---

### Examples

**Example 1:**
    1
   / \
  2   3
 / \
4   5

- **Input:** root = Node(1, Node(2, Node(4), Node(5)), Node(3))
- **Output:** `[1, 2, 4, 5, 3]`

**Example 2:**
1
 \
  2
   \
    3

- **Output:** `[1, 2, 3]`

**Example 3:**

- **Input:** Single node with value 7
- **Output:** `[7]`

---

### Constraints

- The tree will have between 1 and 7 nodes.
- Node values are integers between 1 and 100.
- Return the values as a plain Python list.
