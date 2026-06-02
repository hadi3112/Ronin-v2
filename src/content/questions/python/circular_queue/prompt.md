# Build a Circular Queue

Imagine a circular conveyor belt at a sushi restaurant. Plates of
food are placed at one end and picked up at the other. When the
belt reaches the end of the track, it loops back to the beginning
— it never stops, it just wraps around.

A **circular queue** works exactly like that. It is a fixed-size
container where you add items at the back and remove them from the
front. When the back reaches the end of the container, it wraps
around to the beginning instead of falling off the edge.

---

### Your Task

Complete the `CircularQueue` class by filling in two methods:

- **`enqueue(value)`** — Add a new value to the back of the queue.
  If the queue is already full, do nothing and return `False`.
  Otherwise add the value and return `True`.

- **`dequeue()`** — Remove and return the value at the front of
  the queue. If the queue is empty, return `None`.

The class is already set up with:
- `self.queue` — a fixed-size list to hold values
- `self.head` — index of the front item
- `self.tail` — index where the next item will be added
- `self.size` — how many items are currently in the queue
- `self.capacity` — the maximum number of items allowed

---

### Examples
queue = CircularQueue(3)
queue.enqueue(10)   → True    queue: [10, _, _]
queue.enqueue(20)   → True    queue: [10, 20, _]
queue.enqueue(30)   → True    queue: [10, 20, 30]
queue.enqueue(40)   → False   (queue is full)
queue.dequeue()     → 10      queue: [_, 20, 30]
queue.enqueue(40)   → True    queue: [40, 20, 30]  (wrapped around)
queue.dequeue()     → 20
queue.dequeue()     → 30
queue.dequeue()     → 40
queue.dequeue()     → None    (queue is empty)

---

### Constraints

- Capacity will be between 1 and 10.
- Values will be integers.
- Do not use Python's built-in `queue` or `deque` — build it yourself.
