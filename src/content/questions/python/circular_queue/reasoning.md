## How to Think About This Problem

Think of a clock. After 12, the next number is 1 — not 13. The
numbers wrap around because a clock face is circular.

A circular queue uses the same idea. Instead of a clock face with
12 positions, we have a list with a fixed number of slots. When we
reach the last slot, the next position is slot 0 again — we wrap
around using a mathematical operation called **modulo**.

---

## What Modulo Does

Modulo (`%`) gives you the remainder after division.

- `5 % 3` → `2` (5 divided by 3 leaves remainder 2)
- `3 % 3` → `0` (3 divided by 3 leaves remainder 0)
- `4 % 3` → `1`

If our capacity is 3 and our tail is at index 2, then after one
more enqueue the tail should move to index 0:
new_tail = (2 + 1) % 3 → 3 % 3 → 0

This is how the wrap-around works. No special case needed. Modulo
handles it automatically.

---

## The Enqueue Operation

Before adding a value, check if the queue is full. It is full when
`self.size` equals `self.capacity`. If full, return `False`.

Otherwise:
1. Place the value at `self.queue[self.tail]`
2. Move tail forward using `(self.tail + 1) % self.capacity`
3. Increase `self.size` by 1
4. Return `True`

## The Dequeue Operation

Before removing a value, check if the queue is empty. It is empty
when `self.size` equals 0. If empty, return `None`.

Otherwise:
1. Save the value at `self.queue[self.head]`
2. Move head forward using `(self.head + 1) % self.capacity`
3. Decrease `self.size` by 1
4. Return the saved value

---

## Pseudocode
ENQUEUE(value):
if size == capacity:
return False
queue[tail] = value
tail = (tail + 1) % capacity
size = size + 1
return True
DEQUEUE():
if size == 0:
return None
value = queue[head]
head = (head + 1) % capacity
size = size - 1
return value

---

## Complexity

- **Enqueue Time:** O(1) — one placement, one modulo operation
- **Dequeue Time:** O(1) — one read, one modulo operation
- **Space:** O(n) — we allocate a fixed list of size `capacity`
