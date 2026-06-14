# How to Think About This Problem

## The tool: chained if/elif/else

You need to check which range the score falls into. Python's `if/elif/else` chain is perfect for this — it checks conditions one at a time from top to bottom and stops the moment it finds a match.

```python
if score >= 90:
    return "A"
elif score >= 80:
    return "B"
elif score >= 70:
    return "C"
elif score >= 60:
    return "D"
else:
    return "F"
```

Notice you do not need to write `score >= 80 and score < 90` for the B case. Because Python already ruled out `score >= 90` before reaching the B condition, you know the score must be below 90. So `score >= 80` is enough.

---

## Why order matters

If you wrote the conditions in the wrong order — say, checked `score >= 60` first — then a score of 95 would match that condition and get a `"D"` by mistake. Always check from the highest threshold downward.

---

## Pseudocode

```
function get_grade(score):
    if score is 90 or above: return "A"
    else if score is 80 or above: return "B"
    else if score is 70 or above: return "C"
    else if score is 60 or above: return "D"
    else: return "F"
```

---

## Complexity

- **Time:** O(1) — at most 4 comparisons
- **Space:** O(1) — no extra storage
