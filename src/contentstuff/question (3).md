# Number Guessing Game

Write a function that simulates a number guessing game. The function keeps asking for guesses until the player finds the secret number.

This is the first time you will use a loop — a tool that makes your program repeat steps automatically. Without a loop, you would have to write the same check over and over again.

---

### What your function receives

Your function is called `guessing_game`. It receives two things:

- `secret` — the number the player is trying to guess (an integer)
- `guesses` — a list of numbers the player guesses, in order

### What your function should return

The number of guesses it took to find the secret number.

If the player never guesses correctly within the list, return `-1`.

---

### Examples

**Example 1:**
- `secret = 7`, `guesses = [3, 9, 7]`
- Output: `3`
- Explanation: The player guessed 3 times before hitting 7.

**Example 2:**
- `secret = 5`, `guesses = [5]`
- Output: `1`
- Explanation: Got it on the first try.

**Example 3:**
- `secret = 4`, `guesses = [1, 2, 3]`
- Output: `-1`
- Explanation: Never guessed correctly.

---

### Constraints

- `guesses` will have between 1 and 20 items.
- All values are integers.
