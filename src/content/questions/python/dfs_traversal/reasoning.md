## How to Think About This Problem

The cave explorer analogy is the right one. You always go as deep
as you can before coming back. In a tree, "going deep" means
following the left child, then that node's left child, and so on
until you reach a node with no left child. Then you backtrack and
try the right side.

The beautiful thing about trees is that **every subtree is itself
a tree**. The left child of the root is the root of its own smaller
tree. This makes the problem naturally recursive — the solution for
the whole tree is the same process applied to each subtree.

---

## Why Recursion Works Here

A recursive function calls itself on a smaller version of the
problem. For DFS on a tree:

- If the current node is `None`, there is nothing to do — return
  an empty list. This is the **base case** that stops the recursion.
- Otherwise, record this node's value, then recursively do the
  same thing on the left subtree, then on the right subtree.
  This is the **recursive case**.

Every time we recurse, the tree gets smaller. Eventually we hit
`None` everywhere and the calls unwind back up.

---

## Pseudocode
function dfs(node):
if node is None:
return empty list
result = [node.val]
result = result + dfs(node.left)
result = result + dfs(node.right)

return result

---

## Step-by-step on Example 1

Tree:
    1
   / \
  2   3
 / \
4   5

| Call | Node | Action |
|------|------|--------|
| dfs(1) | 1 | record 1, go left |
| dfs(2) | 2 | record 2, go left |
| dfs(4) | 4 | record 4, go left |
| dfs(None) | None | return [] |
| back at 4 | 4 | go right → dfs(None) → [] |
| back at 2 | 2 | go right → dfs(5) |
| dfs(5) | 5 | record 5, both children None |
| back at 1 | 1 | go right → dfs(3) |
| dfs(3) | 3 | record 3, both children None |

Final result assembled: `[1, 2, 4, 5, 3]`

---

## Complexity

- **Time:** O(n) — every node is visited exactly once
- **Space:** O(h) where h is the height of the tree — this is how
  deep the recursion stack goes. In the worst case (a straight line
  tree) this is O(n). In a balanced tree it is O(log n).
