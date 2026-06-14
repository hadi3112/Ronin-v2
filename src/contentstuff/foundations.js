/**
 * SEED: foundations
 *
 * Writes ALL content for the Foundations track (Track 1) to Firestore.
 * This is the only active track in the current release.
 *
 * What this seed writes:
 *   content/tracks/items/foundations
 *   content/modules/items/foundations_module_{1-6}
 *   content/lessons/items/{lessonId}          — all lessons for modules 1-6
 *   content/videoLessons/items/{videoLessonId} — video-only lesson nodes
 *   content/questions/items/{questionId}       — TG problems for modules 3-6
 *   content/challengeSets/items/{setId}        — MCQ banks for all 6 modules
 *   content/diagnostics/items/foundations_diagnostic
 *
 * File naming convention (local filesystem):
 *   content/questions/python/foundations/{questionId}/
 *     question.md      (replaces prompt.md)
 *     reasoning.md
 *     metadata.json
 *     last_saved.py    (replaces starter.py)
 *     tests.json
 *
 * Diagnostic routing logic:
 *   Currently implemented as if-else thresholds.
 *   Swap out routeDiagnosticResult() with a Gemini API call when ready.
 *
 * Writes to: content/* subcollections (never touches users/)
 */

const fs = require("fs");
const path = require("path");

// ─── HELPER ────────────────────────────────────────────────────────────────
function ts() {
  return new Date().toISOString();
}

async function write(db, config, collectionPath, docId, data) {
  const ref = db.doc(`${collectionPath}/${docId}`);
  if (config.DRY_RUN) {
    console.log(`  [DRY RUN] Would write: ${collectionPath}/${docId}`);
    return;
  }
  if (!config.OVERWRITE_EXISTING) {
    const existing = await ref.get();
    if (existing.exists) return "skipped";
  }
  await ref.set({ ...data, createdAt: ts() });
  return "written";
}

// ─── TRACK ─────────────────────────────────────────────────────────────────
const TRACK = {
  id: "foundations",
  displayName: "Foundations",
  tagline: "Start from zero. Build real things.",
  description:
    "For learners who have never written a line of code. Every concept is introduced through something you can immediately see change on screen. No abstract theory before concrete experience.",
  targetAudience: "Complete beginners with no prior coding experience",
  selfReportedLevelMatch: ["never_coded"],
  estimatedHours: 12,
  modules: [
    "foundations_module_1",
    "foundations_module_2",
    "foundations_module_3",
    "foundations_module_4",
    "foundations_module_5",
    "foundations_module_6",
  ],
  capstoneModuleId: "foundations_module_6",
  nextTrack: "builder",
  color: "#4ade80",
  iconName: "sprout",
  isActiveTrack: true,
};

// ─── MODULES ───────────────────────────────────────────────────────────────
const MODULES = [
  {
    id: "foundations_module_1",
    trackId: "foundations",
    moduleNumber: 1,
    title: "What Is a Program",
    description:
      "Understand what code actually is. Write your first output. Learn to read what the console is telling you.",
    lessons: [
      "foundations_m1_video_1",
      "foundations_m1_l1",
      "foundations_m1_video_2",
      "foundations_m1_l2",
      "foundations_m1_l3",
    ],
    trainingGroundsProblemId: null,
    challengeSetId: "cs_foundations_m1",
    estimatedMinutes: 25,
    hasVideoComponent: true,
    isCapstone: false,
  },
  {
    id: "foundations_module_2",
    trackId: "foundations",
    moduleNumber: 2,
    title: "Variables",
    description:
      "Store values with labels. Understand the difference between numbers and text. Change variables. Follow naming rules.",
    lessons: [
      "foundations_m2_video_1",
      "foundations_m2_l1",
      "foundations_m2_l2",
      "foundations_m2_video_2",
      "foundations_m2_l3",
      "foundations_m2_l4",
    ],
    trainingGroundsProblemId: null,
    challengeSetId: "cs_foundations_m2",
    estimatedMinutes: 30,
    hasVideoComponent: true,
    isCapstone: false,
  },
  {
    id: "foundations_module_3",
    trackId: "foundations",
    moduleNumber: 3,
    title: "Basic Math and Operations",
    description:
      "Do arithmetic in Python. Learn the modulo operator. Understand order of operations.",
    lessons: [
      "foundations_m3_video_1",
      "foundations_m3_l1",
      "foundations_m3_l2",
      "foundations_m3_l3",
    ],
    trainingGroundsProblemId: "simple_calculator",
    challengeSetId: "cs_foundations_m3",
    estimatedMinutes: 35,
    hasVideoComponent: true,
    isCapstone: false,
  },
  {
    id: "foundations_module_4",
    trackId: "foundations",
    moduleNumber: 4,
    title: "Getting Input",
    description:
      "Make your program respond to the user. Handle type conversion. Build interactive functions.",
    lessons: [
      "foundations_m4_video_1",
      "foundations_m4_l1",
      "foundations_m4_l2",
      "foundations_m4_l3",
    ],
    trainingGroundsProblemId: "age_calculator",
    challengeSetId: "cs_foundations_m4",
    estimatedMinutes: 30,
    hasVideoComponent: true,
    isCapstone: false,
  },
  {
    id: "foundations_module_5",
    trackId: "foundations",
    moduleNumber: 5,
    title: "Conditionals",
    description:
      "Make decisions in code. Use if, elif, and else. Combine multiple conditions.",
    lessons: [
      "foundations_m5_video_1",
      "foundations_m5_l1",
      "foundations_m5_l2",
      "foundations_m5_l3",
      "foundations_m5_l4",
    ],
    trainingGroundsProblemId: "grade_classifier",
    challengeSetId: "cs_foundations_m5",
    estimatedMinutes: 40,
    hasVideoComponent: true,
    isCapstone: false,
  },
  {
    id: "foundations_module_6",
    trackId: "foundations",
    moduleNumber: 6,
    title: "Loops",
    description:
      "Repeat instructions automatically. Use while and for loops. Control loops with break and continue.",
    lessons: [
      "foundations_m6_video_1",
      "foundations_m6_l1",
      "foundations_m6_l2",
      "foundations_m6_l3",
      "foundations_m6_l4",
    ],
    trainingGroundsProblemId: "number_guessing_game",
    challengeSetId: "cs_foundations_m6",
    estimatedMinutes: 45,
    hasVideoComponent: true,
    isCapstone: true,
    capstoneUnlocksTrack: "builder",
  },
];

// ─── VIDEO LESSONS ─────────────────────────────────────────────────────────
// Video-only lesson nodes. No coding expected. User watches and continues.
// firebaseStoragePath is set to a placeholder — replace with real path
// after uploading the MP4 to Firebase Storage manually.
// The UI calls Firestore to get this path, then streams from Firebase Storage.
// Never hardcode the Storage URL directly in client code.

const VIDEO_LESSONS = [
  // MODULE 1
  {
    id: "foundations_m1_video_1",
    moduleId: "foundations_module_1",
    trackId: "foundations",
    type: "video",
    lessonNumber: 1,
    title: "What Is Code? (Watch First)",
    description:
      "A 2-minute video explaining what a program is, what a computer actually does when it runs code, and why Python is a good first language.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m1_what_is_code.mp4",
    durationSeconds: 120,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m1_l1",
  },
  {
    id: "foundations_m1_video_2",
    moduleId: "foundations_module_1",
    trackId: "foundations",
    type: "video",
    lessonNumber: 3,
    title: "Reading the Console Output",
    description:
      "A short video showing what the console is, how to read error messages without panicking, and what a successful run looks like.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m1_reading_console.mp4",
    durationSeconds: 90,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m1_l2",
  },
  // MODULE 2
  {
    id: "foundations_m2_video_1",
    moduleId: "foundations_module_2",
    trackId: "foundations",
    type: "video",
    lessonNumber: 1,
    title: "Variables — Labeled Boxes for Data",
    description:
      "A 2-minute video using the analogy of labeled storage boxes to explain what a variable is and why programs need them.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m2_variables_intro.mp4",
    durationSeconds: 120,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m2_l1",
  },
  {
    id: "foundations_m2_video_2",
    moduleId: "foundations_module_2",
    trackId: "foundations",
    type: "video",
    lessonNumber: 4,
    title: "Numbers vs Text — Why Types Matter",
    description:
      "A short video explaining why the computer treats 5 and \"5\" differently, and what goes wrong when you mix them up.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m2_types_intro.mp4",
    durationSeconds: 100,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m2_l3",
  },
  // MODULE 3
  {
    id: "foundations_m3_video_1",
    moduleId: "foundations_module_3",
    trackId: "foundations",
    type: "video",
    lessonNumber: 1,
    title: "Math in Python — It's Just a Calculator",
    description:
      "A 2-minute video showing Python as a calculator. Covers +, -, *, /, and the modulo operator with visual examples.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m3_math_intro.mp4",
    durationSeconds: 120,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m3_l1",
  },
  // MODULE 4
  {
    id: "foundations_m4_video_1",
    moduleId: "foundations_module_4",
    trackId: "foundations",
    type: "video",
    lessonNumber: 1,
    title: "Making Programs Talk Back — input()",
    description:
      "A 2-minute video showing how to use input() to make a program respond to what a user types, and why you need int() to do math with the result.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m4_input_intro.mp4",
    durationSeconds: 130,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m4_l1",
  },
  // MODULE 5
  {
    id: "foundations_m5_video_1",
    moduleId: "foundations_module_5",
    trackId: "foundations",
    type: "video",
    lessonNumber: 1,
    title: "If This, Then That — How Programs Make Decisions",
    description:
      "A 2-minute video using everyday decision examples (traffic lights, vending machines) to introduce the concept of conditional logic before any code is shown.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m5_conditionals_intro.mp4",
    durationSeconds: 120,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m5_l1",
  },
  // MODULE 6
  {
    id: "foundations_m6_video_1",
    moduleId: "foundations_module_6",
    trackId: "foundations",
    type: "video",
    lessonNumber: 1,
    title: "Loops — Making the Computer Do Repetitive Work for You",
    description:
      "A 2-minute video showing what a loop is using the analogy of a factory assembly line. Explains why you would never want to write the same instruction 100 times.",
    firebaseStoragePath: "gs://ronin-videos/foundations/m6_loops_intro.mp4",
    durationSeconds: 120,
    isRequired: true,
    hasFollowUpLesson: true,
    followUpLessonId: "foundations_m6_l1",
  },
];

// ─── TEXT LESSONS ──────────────────────────────────────────────────────────
const TEXT_LESSONS = [
  // ── MODULE 1 ────────────────────────────────────────────────────────────
  {
    id: "foundations_m1_l1",
    moduleId: "foundations_module_1",
    trackId: "foundations",
    type: "text",
    lessonNumber: 2,
    title: "Your First print Statement",
    conceptName: "output, print(), string literals",
    estimatedMinutes: 8,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Your First print Statement

The simplest thing a Python program can do is display a message. You use the \`print()\` function.

\`\`\`python
print("Hello, world!")
\`\`\`

Run this and the console shows:
\`\`\`
Hello, world!
\`\`\`

The text inside the quotes is called a **string** — just a sequence of characters. The quotes tell Python "this is text, not code."

You can print anything:

\`\`\`python
print("My name is Ronin")
print("I am learning Python")
print(42)
\`\`\`

Each \`print()\` call appears on its own line.`,
  },
  {
    id: "foundations_m1_l2",
    moduleId: "foundations_module_1",
    trackId: "foundations",
    type: "text",
    lessonNumber: 4,
    title: "Running Code and Reading Output",
    conceptName: "console output, error messages, successful runs",
    estimatedMinutes: 8,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Running Code and Reading Output

When you click **Run**, Python reads your code from top to bottom and executes each line.

If everything works, you see your output in the console panel below the editor.

If something goes wrong, Python shows an **error message**. Error messages look scary but they always tell you two useful things:
- What line the problem is on
- What kind of error it is

\`\`\`
SyntaxError: EOL while scanning string literal (line 1)
\`\`\`

This means you opened a string with a quote but never closed it. Fix the quote, run again.

**Key habit:** Read the error message before guessing. The error tells you exactly where to look.`,
  },
  {
    id: "foundations_m1_l3",
    moduleId: "foundations_module_1",
    trackId: "foundations",
    type: "text",
    lessonNumber: 5,
    title: "Print Multiple Lines",
    conceptName: "multiple print statements, program flow top to bottom",
    estimatedMinutes: 6,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Print Multiple Lines

Python runs every line in order, from top to bottom. Each \`print()\` runs in sequence.

\`\`\`python
print("Line 1")
print("Line 2")
print("Line 3")
\`\`\`

Output:
\`\`\`
Line 1
Line 2
Line 3
\`\`\`

You can also print a blank line by calling \`print()\` with nothing inside:

\`\`\`python
print("First section")
print()
print("Second section")
\`\`\``,
  },

  // ── MODULE 2 ────────────────────────────────────────────────────────────
  {
    id: "foundations_m2_l1",
    moduleId: "foundations_module_2",
    trackId: "foundations",
    type: "text",
    lessonNumber: 2,
    title: "Variables as Labeled Boxes",
    conceptName: "variable assignment, storing values",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Variables as Labeled Boxes

A variable is a label stuck to a piece of data. When you write:

\`\`\`python
score = 95
\`\`\`

You are telling Python: "store the number 95 and call it \`score\`."

Later, you can use that label anywhere you need the value:

\`\`\`python
score = 95
print(score)        # prints 95
print(score + 5)    # prints 100
\`\`\`

The \`=\` sign in Python does not mean "equals" in the math sense. It means "store this value into this label." The right side is calculated first, then stored.`,
  },
  {
    id: "foundations_m2_l2",
    moduleId: "foundations_module_2",
    trackId: "foundations",
    type: "text",
    lessonNumber: 3,
    title: "Numbers and Text — Two Different Types",
    conceptName: "integers, strings, type differences",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Numbers and Text

Python treats numbers and text differently.

**Numbers** (integers and decimals):
\`\`\`python
age = 16
height = 5.9
\`\`\`

**Text** (strings — always inside quotes):
\`\`\`python
name = "Hadi"
city = "Lahore"
\`\`\`

Why does this matter? You can do math with numbers. You cannot do math with text:

\`\`\`python
age = 16
print(age + 4)    # works — prints 20

name = "Hadi"
print(name + 4)   # ERROR — you cannot add a number to a string
\`\`\`

The number \`5\` and the text \`"5"\` look the same to humans but are completely different to Python.`,
  },
  {
    id: "foundations_m2_l3",
    moduleId: "foundations_module_2",
    trackId: "foundations",
    type: "text",
    lessonNumber: 5,
    title: "Changing a Variable",
    conceptName: "reassignment, updating values",
    estimatedMinutes: 8,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Changing a Variable

Variables can change. You assign a new value to the same name:

\`\`\`python
score = 10
print(score)   # 10

score = 20
print(score)   # 20
\`\`\`

The old value is gone. Only the new value is stored.

You can also update a variable based on its current value:

\`\`\`python
score = 10
score = score + 5
print(score)   # 15
\`\`\`

Python reads the right side first: it gets the current \`score\` (10), adds 5, then stores 15 back into \`score\`.

Shorthand for this:
\`\`\`python
score += 5    # same as score = score + 5
score -= 3    # same as score = score - 3
\`\`\``,
  },
  {
    id: "foundations_m2_l4",
    moduleId: "foundations_module_2",
    trackId: "foundations",
    type: "text",
    lessonNumber: 6,
    title: "Naming Rules",
    conceptName: "variable naming conventions, valid names",
    estimatedMinutes: 7,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Naming Rules

Variable names follow rules in Python:

**Must follow:**
- Start with a letter or underscore (not a number)
- Only letters, numbers, and underscores — no spaces or symbols
- Cannot be a Python keyword like \`if\`, \`for\`, \`return\`

**Good names:**
\`\`\`python
player_score = 100
first_name = "Ali"
total_items = 5
\`\`\`

**Bad names:**
\`\`\`python
1score = 100       # starts with number — ERROR
player score = 100 # has a space — ERROR
if = 100           # reserved word — ERROR
\`\`\`

**Convention:** Python programmers use lowercase letters with underscores between words. This is called **snake_case**. It is not required by Python but everyone follows it.`,
  },

  // ── MODULE 3 ────────────────────────────────────────────────────────────
  {
    id: "foundations_m3_l1",
    moduleId: "foundations_module_3",
    trackId: "foundations",
    type: "text",
    lessonNumber: 2,
    title: "The Four Basic Operations",
    conceptName: "+, -, *, /, integer vs float division",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## The Four Basic Operations

Python supports all four basic math operations:

\`\`\`python
print(10 + 5)   # 15 — addition
print(10 - 5)   # 5  — subtraction
print(10 * 5)   # 50 — multiplication
print(10 / 5)   # 2.0 — division (always gives a decimal)
print(10 // 5)  # 2   — floor division (drops the decimal)
\`\`\`

Notice: regular division \`/\` always returns a decimal number even when the answer is a whole number. Use \`//\` if you specifically want a whole number result.

You can combine operations:
\`\`\`python
result = 10 + 5 * 2   # 20, not 30 — multiplication happens first
\`\`\``,
  },
  {
    id: "foundations_m3_l2",
    moduleId: "foundations_module_3",
    trackId: "foundations",
    type: "text",
    lessonNumber: 3,
    title: "The Modulo Operator",
    conceptName: "%, remainder, even/odd check",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## The Modulo Operator — %

The \`%\` operator gives you the **remainder** after division.

\`\`\`python
print(10 % 3)   # 1 — because 10 ÷ 3 = 3 remainder 1
print(10 % 5)   # 0 — because 10 ÷ 5 = 2 remainder 0
print(7 % 2)    # 1 — because 7 ÷ 2 = 3 remainder 1
\`\`\`

**Why is this useful?**

Checking if a number is even or odd:
\`\`\`python
number = 8
if number % 2 == 0:
    print("even")
else:
    print("odd")
\`\`\`

If dividing by 2 gives remainder 0, the number is even. This pattern appears constantly in programming.`,
  },
  {
    id: "foundations_m3_l3",
    moduleId: "foundations_module_3",
    trackId: "foundations",
    type: "text",
    lessonNumber: 4,
    title: "Order of Operations",
    conceptName: "PEMDAS, operator precedence, parentheses",
    estimatedMinutes: 8,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Order of Operations

Python follows the same order of operations you learned in math class:

1. Parentheses first
2. Then exponents (\`**\`)
3. Then multiplication and division (left to right)
4. Then addition and subtraction (left to right)

\`\`\`python
print(2 + 3 * 4)      # 14, not 20 — multiplication first
print((2 + 3) * 4)    # 20 — parentheses override
print(10 - 4 / 2)     # 8.0 — division first
print((10 - 4) / 2)   # 3.0 — parentheses first
\`\`\`

**When in doubt, use parentheses.** They make your code clearer and remove any ambiguity about what you intend.`,
  },

  // ── MODULE 4 ────────────────────────────────────────────────────────────
  {
    id: "foundations_m4_l1",
    moduleId: "foundations_module_4",
    trackId: "foundations",
    type: "text",
    lessonNumber: 2,
    title: "The input() Function",
    conceptName: "input(), reading user input, interactive programs",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## The input() Function

\`input()\` pauses the program and waits for the user to type something. When they press Enter, the typed text is handed back to your program.

\`\`\`python
name = input("What is your name? ")
print("Hello, " + name)
\`\`\`

The string inside \`input()\` is the prompt shown to the user. The user's response is stored in the variable — in this case, \`name\`.

**Important:** \`input()\` always returns a string, even if the user types a number:

\`\`\`python
age = input("How old are you? ")
print(type(age))   # <class 'str'> — it's text, not a number
\`\`\`

This means you cannot do math with it yet — you need to convert it first.`,
  },
  {
    id: "foundations_m4_l2",
    moduleId: "foundations_module_4",
    trackId: "foundations",
    type: "text",
    lessonNumber: 3,
    title: "Type Conversion",
    conceptName: "int(), float(), str(), type casting",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Type Conversion

To convert text to a number, wrap it with \`int()\` or \`float()\`:

\`\`\`python
age_text = input("How old are you? ")  # returns "16" as a string
age = int(age_text)                    # converts "16" to the number 16
print(age + 1)                         # now works: prints 17
\`\`\`

Or do it in one step:
\`\`\`python
age = int(input("How old are you? "))
\`\`\`

**The three main conversion functions:**
| Function | What it does |
|---|---|
| \`int("5")\` | Converts text to a whole number → \`5\` |
| \`float("5.5")\` | Converts text to a decimal → \`5.5\` |
| \`str(5)\` | Converts a number to text → \`"5"\` |

If you try to convert something that is not a number (like \`int("hello")\`), Python will crash with a \`ValueError\`.`,
  },
  {
    id: "foundations_m4_l3",
    moduleId: "foundations_module_4",
    trackId: "foundations",
    type: "text",
    lessonNumber: 4,
    title: "Building a Name Greeter",
    conceptName: "combining input, variables, and print",
    estimatedMinutes: 8,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Building a Name Greeter

Let's put it all together. Here is a small program that asks for a name and responds personally:

\`\`\`python
name = input("Enter your name: ")
greeting = "Welcome to Ronin, " + name + "!"
print(greeting)
\`\`\`

You can also build the string directly inside print:
\`\`\`python
name = input("Enter your name: ")
print("Welcome to Ronin, " + name + "!")
\`\`\`

Or use an f-string — the modern and cleaner approach:
\`\`\`python
name = input("Enter your name: ")
print(f"Welcome to Ronin, {name}!")
\`\`\`

The \`f\` before the quote tells Python: "anything inside curly braces is a variable, not text." This is the preferred way to include variables inside strings.`,
  },

  // ── MODULE 5 ────────────────────────────────────────────────────────────
  {
    id: "foundations_m5_l1",
    moduleId: "foundations_module_5",
    trackId: "foundations",
    type: "text",
    lessonNumber: 2,
    title: "If Statements",
    conceptName: "if, condition, boolean, indentation",
    estimatedMinutes: 12,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## If Statements

An \`if\` statement runs a block of code only when a condition is true:

\`\`\`python
age = 18
if age >= 18:
    print("You can vote")
\`\`\`

The condition is \`age >= 18\`. Python checks if that is \`True\` or \`False\`. If \`True\`, the indented code below runs.

**Indentation is not decoration — it is required.** Python uses spaces (usually 4) to know what belongs inside the \`if\`:

\`\`\`python
if age >= 18:
    print("This runs if condition is True")
    print("This also runs if condition is True")
print("This always runs, it is not inside the if")
\`\`\`

**Comparison operators:**
| Symbol | Meaning |
|---|---|
| \`==\` | equals |
| \`!=\` | not equal |
| \`>\` | greater than |
| \`<\` | less than |
| \`>=\` | greater than or equal |
| \`<=\` | less than or equal |`,
  },
  {
    id: "foundations_m5_l2",
    moduleId: "foundations_module_5",
    trackId: "foundations",
    type: "text",
    lessonNumber: 3,
    title: "Else and Elif",
    conceptName: "else, elif, chained conditions",
    estimatedMinutes: 12,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Else and Elif

\`else\` runs when the \`if\` condition is \`False\`:

\`\`\`python
age = 15
if age >= 18:
    print("You can vote")
else:
    print("You cannot vote yet")
\`\`\`

\`elif\` (short for "else if") handles more than two cases:

\`\`\`python
score = 75
if score >= 90:
    print("Excellent")
elif score >= 70:
    print("Good")
elif score >= 50:
    print("Pass")
else:
    print("Fail")
\`\`\`

Python checks from top to bottom and runs **only the first matching block**. Once a match is found, all remaining \`elif\` and \`else\` blocks are skipped.`,
  },
  {
    id: "foundations_m5_l3",
    moduleId: "foundations_module_5",
    trackId: "foundations",
    type: "text",
    lessonNumber: 4,
    title: "Comparison Operators",
    conceptName: "==, !=, >, <, >=, <=",
    estimatedMinutes: 8,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Comparison Operators

Every condition in an \`if\` statement uses a comparison operator to produce \`True\` or \`False\`:

\`\`\`python
print(5 == 5)    # True
print(5 == 6)    # False
print(5 != 6)    # True  (not equal)
print(10 > 5)    # True
print(10 < 5)    # False
print(5 >= 5)    # True  (5 is equal to 5, so >= is satisfied)
print(4 >= 5)    # False
\`\`\`

**Common mistake:** using \`=\` instead of \`==\` inside a condition.

\`\`\`python
# Wrong:
if score = 90:    # SyntaxError

# Right:
if score == 90:   # checks if score equals 90
\`\`\`

\`=\` assigns. \`==\` compares. They are completely different.`,
  },
  {
    id: "foundations_m5_l4",
    moduleId: "foundations_module_5",
    trackId: "foundations",
    type: "text",
    lessonNumber: 5,
    title: "Combining Conditions",
    conceptName: "and, or, not, compound conditions",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Combining Conditions with and / or

Use \`and\` when both conditions must be true:

\`\`\`python
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed")
\`\`\`

Use \`or\` when at least one condition must be true:

\`\`\`python
day = "Saturday"

if day == "Saturday" or day == "Sunday":
    print("Weekend!")
\`\`\`

Use \`not\` to flip a condition:

\`\`\`python
is_raining = False

if not is_raining:
    print("Go outside")
\`\`\`

**Tip:** When combining conditions, use parentheses to make the intent clear:

\`\`\`python
if (age >= 18) and (has_id == True):
    print("Allowed")
\`\`\``,
  },

  // ── MODULE 6 ────────────────────────────────────────────────────────────
  {
    id: "foundations_m6_l1",
    moduleId: "foundations_module_6",
    trackId: "foundations",
    type: "text",
    lessonNumber: 2,
    title: "While Loops",
    conceptName: "while, condition-controlled loops, infinite loops",
    estimatedMinutes: 12,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## While Loops

A \`while\` loop repeats as long as a condition stays \`True\`:

\`\`\`python
count = 1
while count <= 5:
    print(count)
    count += 1
\`\`\`

Output:
\`\`\`
1
2
3
4
5
\`\`\`

The loop checks the condition before each repetition. Once \`count\` reaches 6, the condition \`count <= 5\` becomes \`False\` and the loop stops.

**Infinite loop warning:** If the condition never becomes \`False\`, the loop runs forever and your program freezes:

\`\`\`python
count = 1
while count <= 5:
    print(count)
    # forgot count += 1 — this never stops!
\`\`\`

Always make sure something inside the loop moves it toward the stopping condition.`,
  },
  {
    id: "foundations_m6_l2",
    moduleId: "foundations_module_6",
    trackId: "foundations",
    type: "text",
    lessonNumber: 3,
    title: "For Loops",
    conceptName: "for, iterating over lists, range",
    estimatedMinutes: 12,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## For Loops

A \`for\` loop goes through every item in a sequence one at a time:

\`\`\`python
fruits = ["apple", "banana", "mango"]
for fruit in fruits:
    print(fruit)
\`\`\`

Output:
\`\`\`
apple
banana
mango
\`\`\`

\`fruit\` is a temporary variable that holds the current item. You can call it anything — \`item\`, \`x\`, whatever makes sense.

Use \`range()\` to loop a specific number of times:
\`\`\`python
for i in range(5):
    print(i)
# prints 0, 1, 2, 3, 4
\`\`\`

\`range(5)\` generates the numbers 0 through 4 (five numbers, starting at 0).`,
  },
  {
    id: "foundations_m6_l3",
    moduleId: "foundations_module_6",
    trackId: "foundations",
    type: "text",
    lessonNumber: 4,
    title: "The range() Function",
    conceptName: "range(start, stop, step), loop counting",
    estimatedMinutes: 8,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## The range() Function

\`range()\` generates a sequence of numbers. It has three forms:

\`\`\`python
range(5)          # 0, 1, 2, 3, 4
range(2, 6)       # 2, 3, 4, 5 (starts at 2, stops before 6)
range(0, 10, 2)   # 0, 2, 4, 6, 8 (step of 2)
range(10, 0, -1)  # 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 (count down)
\`\`\`

Examples:
\`\`\`python
for i in range(1, 6):
    print(i)
# 1 2 3 4 5

for i in range(0, 11, 2):
    print(i)
# 0 2 4 6 8 10
\`\`\`

**The stop number is never included.** \`range(2, 6)\` gives 2, 3, 4, 5 — not 6. This trips up everyone the first time.`,
  },
  {
    id: "foundations_m6_l4",
    moduleId: "foundations_module_6",
    trackId: "foundations",
    type: "text",
    lessonNumber: 5,
    title: "Break and Continue",
    conceptName: "break, continue, loop control",
    estimatedMinutes: 10,
    hasVisualization: false,
    visualizationType: "none",
    isContentReady: true,
    contentMarkdown: `## Break and Continue

\`break\` exits the loop immediately:

\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)
# prints 0, 1, 2, 3, 4 — stops when i hits 5
\`\`\`

\`continue\` skips the rest of the current iteration and moves to the next one:

\`\`\`python
for i in range(6):
    if i == 3:
        continue
    print(i)
# prints 0, 1, 2, 4, 5 — skips 3
\`\`\`

Think of it this way:
- \`break\` is the emergency exit — leaves the building
- \`continue\` is skipping a floor — stays in the building, moves up`,
  },
];

// ─── CHALLENGE SETS ────────────────────────────────────────────────────────
const CHALLENGE_SETS = [
  // ── MODULE 1 ─────────────────────────────────────────────────────────────
  {
    id: "cs_foundations_m1",
    moduleId: "foundations_module_1",
    type: "post_lesson",
    domains: ["output", "syntax"],
    questions: [
      {
        questionId: "f1_q1",
        domain: "output",
        difficulty: 1,
        type: "application",
        questionText: "What does this code print?\n\nprint(\"Hello\")\nprint(\"World\")",
        options: [
          { id: "a", text: "Hello World" },
          { id: "b", text: "Hello\nWorld" },
          { id: "c", text: "HelloWorld" },
          { id: "d", text: "Nothing" },
        ],
        correctOptionId: "b",
        explanation: "Each print() call outputs on its own line. So 'Hello' appears on line 1 and 'World' on line 2.",
        tags: ["print", "output", "newline"],
      },
      {
        questionId: "f1_q2",
        domain: "syntax",
        difficulty: 1,
        type: "debugging",
        questionText: "This code has an error. What is wrong?\n\nprint(Hello)",
        options: [
          { id: "a", text: "print should be PRINT" },
          { id: "b", text: "Hello needs to be in quotes" },
          { id: "c", text: "There should be no parentheses" },
          { id: "d", text: "Nothing is wrong" },
        ],
        correctOptionId: "b",
        explanation: "Text values (strings) must always be inside quotes. Without quotes, Python thinks Hello is a variable name, not text, and crashes because that variable does not exist.",
        tags: ["strings", "quotes", "syntax-error"],
      },
      {
        questionId: "f1_q3",
        domain: "output",
        difficulty: 1,
        type: "conceptual",
        questionText: "What does print() do when called with nothing inside, like this: print()",
        options: [
          { id: "a", text: "Causes an error" },
          { id: "b", text: "Prints the word None" },
          { id: "c", text: "Prints a blank line" },
          { id: "d", text: "Does nothing at all" },
        ],
        correctOptionId: "c",
        explanation: "Calling print() with no arguments outputs a blank line. This is useful for adding spacing between sections of output.",
        tags: ["print", "blank-line"],
      },
      {
        questionId: "f1_q4",
        domain: "syntax",
        difficulty: 1,
        type: "application",
        questionText: "Which of these correctly prints the number 42?",
        options: [
          { id: "a", text: "print[42]" },
          { id: "b", text: "Print(42)" },
          { id: "c", text: "print(42)" },
          { id: "d", text: "print 42" },
        ],
        correctOptionId: "c",
        explanation: "print is lowercase, uses parentheses, and takes the value directly. print[42] uses square brackets (wrong), Print with capital P is not recognized, and print 42 without parentheses is Python 2 syntax.",
        tags: ["print", "syntax", "function-call"],
      },
    ],
  },

  // ── MODULE 2 ─────────────────────────────────────────────────────────────
  {
    id: "cs_foundations_m2",
    moduleId: "foundations_module_2",
    type: "post_lesson",
    domains: ["variables"],
    questions: [
      {
        questionId: "f2_q1",
        domain: "variables",
        difficulty: 1,
        type: "application",
        questionText: "What is printed by this code?\n\nx = 5\nx = 10\nprint(x)",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "10" },
          { id: "c", text: "5 10" },
          { id: "d", text: "Error" },
        ],
        correctOptionId: "b",
        explanation: "x is assigned 5, then immediately reassigned to 10. The old value 5 is replaced. print(x) prints the current value, which is 10.",
        tags: ["reassignment", "variables"],
      },
      {
        questionId: "f2_q2",
        domain: "variables",
        difficulty: 1,
        type: "conceptual",
        questionText: "What is the difference between 5 and \"5\" in Python?",
        options: [
          { id: "a", text: "No difference, they are the same" },
          { id: "b", text: "5 is a number you can do math with, \"5\" is text you cannot" },
          { id: "c", text: "\"5\" is bigger than 5" },
          { id: "d", text: "5 is a string and \"5\" is an integer" },
        ],
        correctOptionId: "b",
        explanation: "5 without quotes is an integer. You can add, subtract, multiply it. \"5\" with quotes is a string — text. Python will crash if you try to add a number to it.",
        tags: ["types", "integer", "string"],
      },
      {
        questionId: "f2_q3",
        domain: "variables",
        difficulty: 1,
        type: "debugging",
        questionText: "Which variable name is invalid in Python?",
        options: [
          { id: "a", text: "player_score" },
          { id: "b", text: "_total" },
          { id: "c", text: "1stPlace" },
          { id: "d", text: "myVariable" },
        ],
        correctOptionId: "c",
        explanation: "Variable names cannot start with a number. 1stPlace starts with 1, which is a digit, so Python rejects it. All others are valid.",
        tags: ["naming", "syntax", "variables"],
      },
      {
        questionId: "f2_q4",
        domain: "variables",
        difficulty: 1,
        type: "application",
        questionText: "What does this print?\n\nscore = 10\nscore += 5\nprint(score)",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "5" },
          { id: "c", text: "15" },
          { id: "d", text: "score" },
        ],
        correctOptionId: "c",
        explanation: "score starts at 10. score += 5 means score = score + 5, so it becomes 15. print(score) prints 15.",
        tags: ["augmented-assignment", "+=", "variables"],
      },
    ],
  },

  // ── MODULE 3 ─────────────────────────────────────────────────────────────
  {
    id: "cs_foundations_m3",
    moduleId: "foundations_module_3",
    type: "post_lesson",
    domains: ["math", "operators"],
    questions: [
      {
        questionId: "f3_q1",
        domain: "math",
        difficulty: 1,
        type: "application",
        questionText: "What does 10 % 3 equal?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "1" },
          { id: "c", text: "0" },
          { id: "d", text: "3.33" },
        ],
        correctOptionId: "b",
        explanation: "10 divided by 3 is 3 with remainder 1. The % operator returns only the remainder, so 10 % 3 is 1.",
        tags: ["modulo", "%", "remainder"],
      },
      {
        questionId: "f3_q2",
        domain: "operators",
        difficulty: 1,
        type: "application",
        questionText: "What does 2 + 3 * 4 equal in Python?",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "14" },
          { id: "c", text: "24" },
          { id: "d", text: "9" },
        ],
        correctOptionId: "b",
        explanation: "Python follows order of operations. Multiplication happens before addition. So 3 * 4 = 12 first, then 2 + 12 = 14.",
        tags: ["order-of-operations", "precedence"],
      },
      {
        questionId: "f3_q3",
        domain: "math",
        difficulty: 1,
        type: "conceptual",
        questionText: "What is the difference between / and // in Python?",
        options: [
          { id: "a", text: "They do the same thing" },
          { id: "b", text: "/ gives a decimal result, // gives a whole number result" },
          { id: "c", text: "// is faster than /" },
          { id: "d", text: "/ only works on integers, // works on decimals" },
        ],
        correctOptionId: "b",
        explanation: "The / operator always returns a float (decimal), even for 10 / 5 which gives 2.0. The // operator (floor division) drops the decimal and returns an integer: 10 // 5 gives 2.",
        tags: ["division", "floor-division", "float"],
      },
      {
        questionId: "f3_q4",
        domain: "operators",
        difficulty: 1,
        type: "debugging",
        questionText: "A student writes: result = (4 + 6) * 2. What is result?",
        options: [
          { id: "a", text: "16" },
          { id: "b", text: "20" },
          { id: "c", text: "12" },
          { id: "d", text: "Error" },
        ],
        correctOptionId: "b",
        explanation: "Parentheses come first. 4 + 6 = 10, then 10 * 2 = 20.",
        tags: ["parentheses", "order-of-operations"],
      },
    ],
  },

  // ── MODULE 4 ─────────────────────────────────────────────────────────────
  {
    id: "cs_foundations_m4",
    moduleId: "foundations_module_4",
    type: "post_lesson",
    domains: ["input", "types"],
    questions: [
      {
        questionId: "f4_q1",
        domain: "types",
        difficulty: 1,
        type: "conceptual",
        questionText: "What type does input() always return?",
        options: [
          { id: "a", text: "Integer" },
          { id: "b", text: "Float" },
          { id: "c", text: "String" },
          { id: "d", text: "Boolean" },
        ],
        correctOptionId: "c",
        explanation: "input() always returns a string, no matter what the user types. If you need to do math with the result, you must convert it with int() or float().",
        tags: ["input", "string", "type"],
      },
      {
        questionId: "f4_q2",
        domain: "types",
        difficulty: 1,
        type: "debugging",
        questionText: "This code crashes. Why?\n\nage = input(\"Enter age: \")\nprint(age + 1)",
        options: [
          { id: "a", text: "input() does not accept a prompt string" },
          { id: "b", text: "You cannot add 1 to a string" },
          { id: "c", text: "print cannot show the result of addition" },
          { id: "d", text: "age is not defined" },
        ],
        correctOptionId: "b",
        explanation: "input() returns a string. You cannot add a number (1) to a string. The fix is: age = int(input(\"Enter age: \"))",
        tags: ["type-error", "input", "int()"],
      },
      {
        questionId: "f4_q3",
        domain: "input",
        difficulty: 1,
        type: "application",
        questionText: "What does int(\"42\") return?",
        options: [
          { id: "a", text: "\"42\" — unchanged" },
          { id: "b", text: "42.0" },
          { id: "c", text: "42" },
          { id: "d", text: "Error" },
        ],
        correctOptionId: "c",
        explanation: "int() converts a string containing a whole number into an actual integer. int(\"42\") gives the number 42, not the text \"42\".",
        tags: ["int()", "type-conversion"],
      },
      {
        questionId: "f4_q4",
        domain: "types",
        difficulty: 1,
        type: "application",
        questionText: "Which line correctly reads a number from the user and stores it for math?",
        options: [
          { id: "a", text: "num = input(\"Number: \")" },
          { id: "b", text: "num = int(input(\"Number: \"))" },
          { id: "c", text: "num = integer(input(\"Number: \"))" },
          { id: "d", text: "num = input(int(\"Number: \"))" },
        ],
        correctOptionId: "b",
        explanation: "int(input()) is the correct pattern. input() gets the text the user typed, then int() converts that text to a number. integer() does not exist in Python.",
        tags: ["int()", "input()", "type-conversion"],
      },
    ],
  },

  // ── MODULE 5 ─────────────────────────────────────────────────────────────
  {
    id: "cs_foundations_m5",
    moduleId: "foundations_module_5",
    type: "post_lesson",
    domains: ["conditionals"],
    questions: [
      {
        questionId: "f5_q1",
        domain: "conditionals",
        difficulty: 1,
        type: "application",
        questionText: "What prints here?\n\nx = 8\nif x > 10:\n    print(\"big\")\nelse:\n    print(\"small\")",
        options: [
          { id: "a", text: "big" },
          { id: "b", text: "small" },
          { id: "c", text: "big small" },
          { id: "d", text: "Nothing" },
        ],
        correctOptionId: "b",
        explanation: "x is 8. The condition x > 10 is False (8 is not greater than 10). So the else block runs and prints 'small'.",
        tags: ["if-else", "comparison"],
      },
      {
        questionId: "f5_q2",
        domain: "conditionals",
        difficulty: 1,
        type: "debugging",
        questionText: "What is wrong with this code?\n\nif score = 90:\n    print(\"A\")",
        options: [
          { id: "a", text: "The indentation is wrong" },
          { id: "b", text: "= should be == for comparison" },
          { id: "c", text: "90 should be in quotes" },
          { id: "d", text: "Nothing is wrong" },
        ],
        correctOptionId: "b",
        explanation: "Single = is assignment (storing a value). Double == is comparison (checking equality). Inside if conditions, you always need ==.",
        tags: ["assignment-vs-comparison", "=="],
      },
      {
        questionId: "f5_q3",
        domain: "conditionals",
        difficulty: 1,
        type: "application",
        questionText: "What prints?\n\nage = 20\nhas_id = False\nif age >= 18 and has_id:\n    print(\"allowed\")\nelse:\n    print(\"denied\")",
        options: [
          { id: "a", text: "allowed" },
          { id: "b", text: "denied" },
          { id: "c", text: "allowed denied" },
          { id: "d", text: "Error" },
        ],
        correctOptionId: "b",
        explanation: "The condition uses 'and'. Both sides must be True. age >= 18 is True, but has_id is False. True and False is False. So else runs and prints 'denied'.",
        tags: ["and", "boolean", "compound-conditions"],
      },
      {
        questionId: "f5_q4",
        domain: "conditionals",
        difficulty: 2,
        type: "application",
        questionText: "What prints?\n\ntemp = 75\nif temp > 90:\n    print(\"hot\")\nelif temp > 70:\n    print(\"warm\")\nelif temp > 50:\n    print(\"cool\")\nelse:\n    print(\"cold\")",
        options: [
          { id: "a", text: "hot" },
          { id: "b", text: "warm" },
          { id: "c", text: "warm cool" },
          { id: "d", text: "cool" },
        ],
        correctOptionId: "b",
        explanation: "temp is 75. The first condition (temp > 90) is False. The second (temp > 70) is True — 75 is greater than 70. Python runs that block and prints 'warm', then skips everything else.",
        tags: ["elif", "chained-conditions", "early-exit"],
      },
    ],
  },

  // ── MODULE 6 ─────────────────────────────────────────────────────────────
  {
    id: "cs_foundations_m6",
    moduleId: "foundations_module_6",
    type: "post_lesson",
    domains: ["loops"],
    questions: [
      {
        questionId: "f6_q1",
        domain: "loops",
        difficulty: 1,
        type: "application",
        questionText: "How many times does this loop run?\n\nfor i in range(5):\n    print(i)",
        options: [
          { id: "a", text: "4 times" },
          { id: "b", text: "5 times" },
          { id: "c", text: "6 times" },
          { id: "d", text: "1 time" },
        ],
        correctOptionId: "b",
        explanation: "range(5) generates 0, 1, 2, 3, 4 — five numbers. The loop runs once for each number, so it runs 5 times.",
        tags: ["range", "for-loop", "count"],
      },
      {
        questionId: "f6_q2",
        domain: "loops",
        difficulty: 1,
        type: "debugging",
        questionText: "This loop never stops. What is the bug?\n\ncount = 1\nwhile count <= 5:\n    print(count)",
        options: [
          { id: "a", text: "count should start at 0" },
          { id: "b", text: "The condition should be count < 5" },
          { id: "c", text: "count is never increased inside the loop" },
          { id: "d", text: "while loops cannot use <= " },
        ],
        correctOptionId: "c",
        explanation: "count starts at 1 and the condition count <= 5 is True. But nothing changes count inside the loop, so it stays at 1 forever. Adding count += 1 at the end of the loop body fixes it.",
        tags: ["infinite-loop", "while", "increment"],
      },
      {
        questionId: "f6_q3",
        domain: "loops",
        difficulty: 1,
        type: "application",
        questionText: "What does range(2, 6) generate?",
        options: [
          { id: "a", text: "2, 3, 4, 5, 6" },
          { id: "b", text: "2, 3, 4, 5" },
          { id: "c", text: "0, 1, 2, 3, 4, 5" },
          { id: "d", text: "2, 4, 6" },
        ],
        correctOptionId: "b",
        explanation: "range(start, stop) generates numbers from start up to but not including stop. So range(2, 6) gives 2, 3, 4, 5 — the number 6 is never included.",
        tags: ["range", "stop-exclusive"],
      },
      {
        questionId: "f6_q4",
        domain: "loops",
        difficulty: 2,
        type: "application",
        questionText: "What prints?\n\nfor i in range(5):\n    if i == 3:\n        break\n    print(i)",
        options: [
          { id: "a", text: "0 1 2 3 4" },
          { id: "b", text: "0 1 2 3" },
          { id: "c", text: "0 1 2" },
          { id: "d", text: "1 2 3 4" },
        ],
        correctOptionId: "c",
        explanation: "The loop prints i and then checks if i equals 3. When i is 0, print runs (prints 0). When i is 1, print runs (prints 1). When i is 2, print runs (prints 2). When i is 3, break exits before print runs. So only 0, 1, 2 are printed.",
        tags: ["break", "for-loop", "early-exit"],
      },
    ],
  },
];

// ─── DIAGNOSTIC QUESTION SET ───────────────────────────────────────────────
// Used before any training grounds. Routes user to correct starting module.
// Replace routeDiagnosticResult() with a Gemini API call when ready.

const DIAGNOSTIC = {
  id: "foundations_diagnostic",
  trackId: "foundations",
  type: "diagnostic",
  description:
    "A short quiz across all six Foundations modules used to determine where to start a user on the Foundations track.",
  questions: [
    // One question per module — tests the core concept of each
    {
      questionId: "diag_m1",
      moduleId: "foundations_module_1",
      domain: "output",
      difficulty: 1,
      questionText: "What does print(\"Hello\") do?",
      options: [
        { id: "a", text: "Stores the word Hello" },
        { id: "b", text: "Displays Hello on the screen" },
        { id: "c", text: "Creates a variable called Hello" },
        { id: "d", text: "Asks the user to type Hello" },
      ],
      correctOptionId: "b",
      explanation: "print() displays whatever is inside the parentheses on the screen.",
    },
    {
      questionId: "diag_m2",
      moduleId: "foundations_module_2",
      domain: "variables",
      difficulty: 1,
      questionText: "What is stored in x after this line runs?\n\nx = 7",
      options: [
        { id: "a", text: "The letter x" },
        { id: "b", text: "The text \"7\"" },
        { id: "c", text: "The number 7" },
        { id: "d", text: "Nothing" },
      ],
      correctOptionId: "c",
      explanation: "The = sign stores the value on the right into the variable on the left. x now holds the integer 7.",
    },
    {
      questionId: "diag_m3",
      moduleId: "foundations_module_3",
      domain: "math",
      difficulty: 1,
      questionText: "What does 9 % 4 equal?",
      options: [
        { id: "a", text: "2" },
        { id: "b", text: "1" },
        { id: "c", text: "0" },
        { id: "d", text: "4" },
      ],
      correctOptionId: "b",
      explanation: "9 divided by 4 is 2 with remainder 1. The % operator returns the remainder.",
    },
    {
      questionId: "diag_m4",
      moduleId: "foundations_module_4",
      domain: "input",
      difficulty: 1,
      questionText: "What does input() always return, no matter what the user types?",
      options: [
        { id: "a", text: "An integer" },
        { id: "b", text: "A float" },
        { id: "c", text: "A string" },
        { id: "d", text: "A boolean" },
      ],
      correctOptionId: "c",
      explanation: "input() always returns a string. To do math with the result, wrap it in int() or float().",
    },
    {
      questionId: "diag_m5",
      moduleId: "foundations_module_5",
      domain: "conditionals",
      difficulty: 1,
      questionText: "What symbol is used to check if two values are equal in an if statement?",
      options: [
        { id: "a", text: "=" },
        { id: "b", text: "==" },
        { id: "c", text: "!=" },
        { id: "d", text: ">=" },
      ],
      correctOptionId: "b",
      explanation: "== checks equality. Single = is assignment (storing a value). These are completely different things.",
    },
    {
      questionId: "diag_m6",
      moduleId: "foundations_module_6",
      domain: "loops",
      difficulty: 1,
      questionText: "What is the first number that range(3, 7) generates?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "3" },
        { id: "d", text: "7" },
      ],
      correctOptionId: "c",
      explanation: "range(start, stop) begins at the start value. range(3, 7) generates 3, 4, 5, 6.",
    },
  ],
};

// ─── DIAGNOSTIC ROUTING (if-else, swap for Gemini later) ──────────────────
/**
 * Takes an array of { questionId, answeredCorrectly, moduleId } objects.
 * Returns the moduleId the user should start from.
 *
 * Logic:
 *   - Find the first module where the user answered incorrectly.
 *   - Start them there.
 *   - If they got everything right, skip to module 4 (they have the basics).
 *   - If they got nothing right, start at module 1.
 *
 * TO REPLACE WITH GEMINI:
 *   Call the Gemini API with the diagnostic results as JSON context.
 *   Parse the JSON response for { startingModuleId, reasoning }.
 *   Write reasoning to users/{uid}/diagnostic/agentInterpretation.
 */
function routeDiagnosticResult(results) {
  const moduleOrder = [
    "foundations_module_1",
    "foundations_module_2",
    "foundations_module_3",
    "foundations_module_4",
    "foundations_module_5",
    "foundations_module_6",
  ];

  const correctCount = results.filter((r) => r.answeredCorrectly).length;

  // All correct — they know the basics, start at module 4 (input/functions)
  if (correctCount === 6) {
    return {
      startingModuleId: "foundations_module_4",
      reasoning:
        "You answered all diagnostic questions correctly. Starting you from Module 4 to skip what you already know.",
    };
  }

  // Find first incorrect answer in module order
  for (const moduleId of moduleOrder) {
    const result = results.find((r) => r.moduleId === moduleId);
    if (result && !result.answeredCorrectly) {
      return {
        startingModuleId: moduleId,
        reasoning: `You showed solid understanding up to this point. Starting you here to build from a strong foundation.`,
      };
    }
  }

  // Default: start from the beginning
  return {
    startingModuleId: "foundations_module_1",
    reasoning: "Starting from the beginning to build a solid foundation.",
  };
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────
module.exports = async function seedFoundations(db, config) {
  let written = 0;
  let skipped = 0;
  let errors = 0;

  const contentRoot = path.resolve(
    __dirname,
    "../../",
    config.CONTENT_ROOT,
    "foundations"
  );

  // Helper: read local question files and assemble Firestore doc
  async function writeQuestion(questionId) {
    const dir = path.join(contentRoot, questionId);
    if (!fs.existsSync(dir)) {
      console.log(`  ⚠️  Skipping question "${questionId}" — folder not found at ${dir}`);
      skipped++;
      return;
    }
    try {
      const metadata = JSON.parse(
        fs.readFileSync(path.join(dir, "metadata.json"), "utf-8")
      );
      const questionMarkdown = fs.readFileSync(
        path.join(dir, "question.md"),
        "utf-8"
      );
      const reasoningMarkdown = fs.readFileSync(
        path.join(dir, "reasoning.md"),
        "utf-8"
      );
      const lastSavedCode = fs.existsSync(path.join(dir, "last_saved.py"))
        ? fs.readFileSync(path.join(dir, "last_saved.py"), "utf-8")
        : "pass";
      const tests = JSON.parse(
        fs.readFileSync(path.join(dir, "tests.json"), "utf-8")
      );

      const doc = {
        ...metadata,
        questionMarkdown,
        reasoningMarkdown,
        starterCode: { python: lastSavedCode },
        testsVisible: tests.filter((t) => !t.id.includes("hidden")),
        testsHidden: tests.filter((t) => t.id.includes("hidden")),
        globalStats: { totalAttempts: 0, totalPasses: 0 },
      };

      const result = await write(
        db,
        config,
        "content/questions/items",
        questionId,
        doc
      );
      if (result === "skipped") {
        skipped++;
      } else {
        console.log(`  ✓  question: ${questionId}`);
        written++;
      }
    } catch (err) {
      console.error(`  ❌ question "${questionId}": ${err.message}`);
      errors++;
    }
  }

  // ── 1. Track ────────────────────────────────────────────────────────────
  const trackResult = await write(
    db, config, "content/tracks/items", TRACK.id, TRACK
  );
  if (trackResult === "skipped") skipped++; else { written++; console.log(`  ✓  track: ${TRACK.id}`); }

  // ── 2. Modules ──────────────────────────────────────────────────────────
  for (const mod of MODULES) {
    const r = await write(db, config, "content/modules/items", mod.id, mod);
    if (r === "skipped") skipped++; else { written++; console.log(`  ✓  module: ${mod.id}`); }
  }

  // ── 3. Video lessons ────────────────────────────────────────────────────
  for (const vl of VIDEO_LESSONS) {
    const r = await write(db, config, "content/lessons/items", vl.id, vl);
    if (r === "skipped") skipped++; else { written++; console.log(`  ✓  video lesson: ${vl.id}`); }
  }

  // ── 4. Text lessons ─────────────────────────────────────────────────────
  for (const tl of TEXT_LESSONS) {
    const r = await write(db, config, "content/lessons/items", tl.id, tl);
    if (r === "skipped") skipped++; else { written++; console.log(`  ✓  text lesson: ${tl.id}`); }
  }

  // ── 5. TG questions (read from local files) ─────────────────────────────
  const tgQuestions = [
    "simple_calculator",
    "age_calculator",
    "grade_classifier",
    "number_guessing_game",
  ];
  for (const qId of tgQuestions) {
    await writeQuestion(qId);
  }

  // ── 6. Challenge sets ───────────────────────────────────────────────────
  for (const cs of CHALLENGE_SETS) {
    const r = await write(
      db, config,
      "content/challengeSets/items",
      cs.id,
      { ...cs, questionCount: cs.questions.length }
    );
    if (r === "skipped") skipped++; else { written++; console.log(`  ✓  challengeSet: ${cs.id}`); }
  }

  // ── 7. Diagnostic ───────────────────────────────────────────────────────
  const diagDoc = {
    ...DIAGNOSTIC,
    questionCount: DIAGNOSTIC.questions.length,
    routingLogic: "if_else",  // change to "gemini" when upgraded
    routingFunctionSource: routeDiagnosticResult.toString(),
  };
  const diagResult = await write(
    db, config, "content/diagnostics/items", DIAGNOSTIC.id, diagDoc
  );
  if (diagResult === "skipped") skipped++; else { written++; console.log(`  ✓  diagnostic: ${DIAGNOSTIC.id}`); }

  return { written, skipped, errors };
};

// Export routing function so it can be imported directly into the app
// until Gemini orchestration is ready
module.exports.routeDiagnosticResult = routeDiagnosticResult;
