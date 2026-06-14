# How to Think About This Problem

## The tool: for loop with enumerate

A `for` loop goes through every item in a list one at a time. You can use `enumerate` to get both the position (index) and the value at the same time:

```python
for index, guess in enumerate(guesses):
    print(index, guess)
```

For the list `[3, 9, 7]`, this prints:
```
0 3
1 9
2 7
```

Indices start at 0, but we want to count guesses starting from 1. So we use `index + 1`.

---

## Checking the guess

Inside the loop, check if the current guess matches the secret:

```python
for index, guess in enumerate(guesses):
    if guess == secret:
        return index + 1
```

The moment a guess matches, we return immediately. The loop stops.

---

## What if nobody guesses correctly?

If the loop finishes and no guess matched, we fall through to a `return -1`:

```python
for index, guess in enumerate(guesses):
    if guess == secret:
        return index + 1
return -1
```

The `return -1` is outside the loop (no indentation under the for). Python only reaches it if the loop completes without returning.

---

## Pseudocode

```
function guessing_game(secret, guesses):
    for each guess at position index in guesses:
        if guess equals secret:
            return index + 1
    return -1
```

---

## Complexity

- **Time:** O(n) — at most we check every guess once
- **Space:** O(1) — no extra storage, just the loop counter
