## How to Think About This Problem

Picture a line of people all facing right, each one with their hand
on the shoulder of the person in front of them. To reverse the line,
you need every person to turn around and put their hand on the
shoulder of the person who was *behind* them instead.

The problem with doing this is simple: **if you turn someone around
before they pass their connection forward, you lose track of who
comes next.** That is the core challenge of reversing a linked list.

---

## The Three-Pointer Approach

We need three helper variables to do this safely:

- `prev` — the node behind our current position (starts as `None`
  because there is nothing behind the first node yet)
- `curr` — the node we are currently looking at (starts at `head`)
- `next_node` — a temporary save of where `curr` used to point,
  before we change it

For every node we visit, we do four things in order:

1. Save `curr.next` into `next_node` before we lose it
2. Point `curr.next` backwards to `prev`
3. Move `prev` forward to where `curr` is
4. Move `curr` forward to where `next_node` is

We repeat this until `curr` is `None`, meaning we have passed the
end of the original list. At that point, `prev` is sitting on what
used to be the last node — which is now the new head.

---

## Pseudocode
set prev to None
set curr to head
while curr is not None:
save curr.next into next_node
point curr.next to prev
move prev to curr
move curr to next_node
return prev

---

## Step-by-step on Example 1

List: `1 → 2 → 3 → None`

| Step | prev | curr | curr.next after step |
|------|------|------|----------------------|
| Start | None | 1 | — |
| 1 | None → 1 | 1 → 2 | 1.next = None |
| 2 | 1 | 2 → 3 | 2.next = 1 |
| 3 | 2 | 3 → None | 3.next = 2 |
| End | 3 | None | — |

Return `prev` which is node 3. Result: `3 → 2 → 1 → None`

---

## Complexity

- **Time:** O(n) — we visit every node exactly once
- **Space:** O(1) — we only use three extra variables regardless
  of how long the list is
