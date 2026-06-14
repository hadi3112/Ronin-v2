# Age Calculator

Write a function that figures out how old someone is, based on the year they were born and the current year.

People often need to calculate ages — for forms, for apps, for games. Instead of doing the math in their head, your function does it for them.

---

### What your function receives

Your function is called `get_age`. It receives two things:

- `birth_year` — the year the person was born (a whole number, like `2005`)
- `current_year` — the year it is right now (a whole number, like `2025`)

### What your function should return

A whole number representing how old that person is (or will turn) this year.

---

### Examples

**Example 1:**
- Input: `birth_year = 2005`, `current_year = 2025`
- Output: `20`

**Example 2:**
- Input: `birth_year = 2010`, `current_year = 2025`
- Output: `15`

**Example 3:**
- Input: `birth_year = 2000`, `current_year = 2024`
- Output: `24`

---

### Constraints

- `current_year` will always be greater than `birth_year`.
- Both numbers are already integers — you do not need to convert them.
- Return the age as an integer.
