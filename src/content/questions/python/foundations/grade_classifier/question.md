# Grade Classifier

Write a function that takes a student's score and returns their letter grade.

Teachers use grading systems to quickly communicate how a student performed. Instead of saying "you got 87 out of 100", they say "you got a B". Your function converts a number score into the right letter.

---

### What your function receives

Your function is called `get_grade`. It receives one thing:

- `score` — a number between 0 and 100

### What your function should return

A single letter as a string: `"A"`, `"B"`, `"C"`, `"D"`, or `"F"`.

---

### Grading scale

| Score range | Grade |
|---|---|
| 90 and above | `"A"` |
| 80 to 89 | `"B"` |
| 70 to 79 | `"C"` |
| 60 to 69 | `"D"` |
| Below 60 | `"F"` |

---

### Examples

**Example 1:**
- Input: `score = 95`
- Output: `"A"`

**Example 2:**
- Input: `score = 82`
- Output: `"B"`

**Example 3:**
- Input: `score = 55`
- Output: `"F"`

---

### Constraints

- `score` is always between 0 and 100 inclusive.
- Return the grade as a capital letter string.
