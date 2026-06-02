# Reverse a Linked List

Imagine you have a chain of boxes, and each box has a number inside
it and an arrow pointing to the next box. The last box points to
nothing. This chain is called a **linked list**.

Your job is to **reverse the direction of all the arrows** so that
the chain runs backwards. The box that used to be last should now
be first, and every arrow should point the opposite way.

---

### What you are working with

Each box in the chain is called a **Node**. It has two things:
- `val` — the number stored inside it
- `next` — a pointer to the next node (or `None` if it is the last one)

A `Node` class is already provided for you. You just need to write
the `reverse` function.

---

### Examples

**Example 1:**

- **Input:** `1 → 2 → 3 → 4 → 5 → None`
- **Output:** `5 → 4 → 3 → 2 → 1 → None`

**Example 2:**

- **Input:** `1 → 2 → None`
- **Output:** `2 → 1 → None`

**Example 3:**

- **Input:** `1 → None`
- **Output:** `1 → None`

---

### Constraints

- The list will have between 1 and 20 nodes.
- Node values are integers between 0 and 100.
- Do not create new nodes. Reverse the arrows in place.
