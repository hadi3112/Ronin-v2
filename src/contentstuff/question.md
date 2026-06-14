# Simple Calculator

You are going to build a calculator that takes two numbers and a math symbol, and returns the answer.

A person using your calculator should be able to type in two numbers and choose whether they want to add, subtract, multiply, or divide them. Your program should give back the correct answer.

---

### What your function receives

Your function is called `calculate`. It receives three things:

- `num1` — the first number (already a number, not text)
- `num2` — the second number (already a number, not text)
- `operator` — a text symbol: `"+"`, `"-"`, `"*"`, or `"/"`

### What your function should return

The result of applying the operator to the two numbers.

---

### Examples

**Example 1:**
- Input: `num1 = 10`, `num2 = 5`, `operator = "+"`
- Output: `15`

**Example 2:**
- Input: `num1 = 10`, `num2 = 5`, `operator = "-"`
- Output: `5`

**Example 3:**
- Input: `num1 = 10`, `num2 = 5`, `operator = "*"`
- Output: `50`

**Example 4:**
- Input: `num1 = 10`, `num2 = 5`, `operator = "/"`
- Output: `2.0`

---

### Constraints

- You can assume the operator will always be one of the four above.
- You can assume `num2` will never be `0` when dividing.
- Return the result directly — do not print it.
