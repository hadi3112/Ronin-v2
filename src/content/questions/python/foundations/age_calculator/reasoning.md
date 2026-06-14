# How to Think About This Problem

## The core idea

Age is just subtraction. If you were born in 2005 and it is now 2025, you subtract:

```
2025 - 2005 = 20
```

That is your age. Your function does exactly this one operation.

---

## Variables store the result

Instead of just calculating and throwing away the answer, you store it in a variable first, then return it:

```python
age = current_year - birth_year
return age
```

Or in one line:

```python
return current_year - birth_year
```

Both approaches work. The two-line version is clearer when you are learning.

---

## Why does this matter?

This problem teaches you that functions are not magic — they just take information in, do something simple with it, and send an answer back out. The `return` keyword is how you send the answer back.

Without `return`, the function does the calculation but the result disappears. Nothing comes back to whoever called the function.

---

## Pseudocode

```
function get_age(birth_year, current_year):
    age = current_year - birth_year
    return age
```

---

## Complexity

- **Time:** O(1) — one subtraction operation, nothing more
- **Space:** O(1) — one variable stored
