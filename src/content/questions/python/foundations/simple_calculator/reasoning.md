# How to Think About This Problem

## Start with what you know

You already know how to do math in Python:

```python
10 + 5   # gives 15
10 - 5   # gives 5
10 * 5   # gives 50
10 / 5   # gives 2.0
```

The challenge here is that you do not know in advance which operation the user wants. They tell you by passing in the `operator` string — either `"+"`, `"-"`, `"*"`, or `"/"`.

---

## The tool you need: if/elif/else

An `if` statement lets your program make a decision based on a condition:

```python
if operator == "+":
    return num1 + num2
```

The `==` symbol means "is equal to". It compares two values.

When you have more than two options, you chain them with `elif` (short for "else if"):

```python
if operator == "+":
    return num1 + num2
elif operator == "-":
    return num1 - num2
elif operator == "*":
    return num1 * num2
elif operator == "/":
    return num1 / num2
```

Python checks each condition from top to bottom and runs the first one that is `True`. Once it finds a match, it stops checking the rest.

---

## Pseudocode

```
function calculate(num1, num2, operator):
    if operator is "+":
        return num1 + num2
    else if operator is "-":
        return num1 - num2
    else if operator is "*":
        return num1 * num2
    else if operator is "/":
        return num1 / num2
```

---

## Step-by-step on Example 1

- Input: `num1 = 10`, `num2 = 5`, `operator = "+"`
- Python checks: is `operator == "+"` ? Yes.
- Python runs: `return 10 + 5`
- Output: `15`

---

## Complexity

- **Time:** O(1) — no loops, just one decision and one math operation
- **Space:** O(1) — no extra storage needed
