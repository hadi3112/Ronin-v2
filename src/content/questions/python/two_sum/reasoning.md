## Conceptual Explanation

The **Two Sum** problem is asking us to find two numbers in an array that add up to a specific `target`.

### The Naive Approach
A brute force way would be to check every possible pair of numbers. For every number `x`, we can iterate through the rest of the array to find a number `y` where `x + y == target`.
- **Time Complexity:** O(n²) because of nested loops.
- **Space Complexity:** O(1).

### The Optimal Approach (Hash Map)
Instead of searching for `y` in the rest of the array using a loop, we can use a Hash Map (a Dictionary in Python) to keep track of numbers we have already seen.

When we are looking at a number `x`, we know that the number we need to reach the target is `target - x`. 
Let's call this the **complement**.

If we look up the complement in our dictionary and it exists, we have found our pair! If not, we store `x` and its index in the dictionary for future numbers to find.

### Pseudocode

```text
initialize an empty dictionary called 'seen'

for each index 'i' and value 'num' in nums:
    complement = target - num
    
    if complement exists in 'seen':
        return [seen[complement], i]
        
    add num to 'seen' with its value as 'i'
```

- **Time Complexity:** O(n) — we traverse the list exactly once. Dictionary lookups take O(1) time.
- **Space Complexity:** O(n) — we might store up to n elements in the dictionary.
