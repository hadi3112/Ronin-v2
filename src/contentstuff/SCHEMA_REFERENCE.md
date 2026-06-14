# Ronin — Complete Firebase Schema Reference

> **Single source of truth** for all Firestore collections, documents,
> and the read/write contracts each agent follows.
>
> **Never modify the schema without updating this document.**
> UI changes must never require schema changes — the UI reads from
> `users/{uid}/agentState/dashboardState` only.

---

## Architecture Overview

Two top-level collections. Hard separation — agents read from both,
but write **only** to `users`. The migration script writes `content`.
Client code reads from both but writes only to `users`.

```
firestore/
  users/        ← per-user state, written by agents and client
  content/      ← curriculum data, written only by migrate.js
```

### Firestore Path Convention

Because Firestore does not support nested collections on a document
that is also a collection, content uses a "named container document"
pattern:

```
content/tracks/items/{trackId}
content/modules/items/{moduleId}
content/lessons/items/{lessonId}
content/questions/items/{questionId}
content/challengeSets/items/{setId}
content/uiTemplates/items/{templateId}
```

The intermediate documents (`tracks`, `modules`, etc.) are empty
placeholder documents. All real data lives in the `items` subcollection.

---

## Collection: `users`

**Document ID:** Firebase Auth `uid` (1:1 with authentication)

### Top-level fields

```
users/{uid}/
  email:           string
  displayName:     string
  avatarUrl:       string | null
  createdAt:       ISO timestamp string
  lastActive:      ISO timestamp string
  onboardingPhase: enum — see values below
```

**`onboardingPhase` values (in order):**
```
"preferences_pending"         — just signed up, no preferences set
"diagnostic_pending"          — preferences set, diagnostic not taken
"training_grounds_pending"    — diagnostic done, TG not started
"targeted_challenges_pending" — TG done (2+ problems), challenges not taken
"track_assigned"              — Orchestrator has assigned a track
"onboarding_complete"         — full first cycle done
```

---

### Subcollection: `users/{uid}/preferences`

Written during onboarding preference screen. Never overwritten by agents.

```
selfReportedLevel:      enum ["never_coded", "some_basics", "experienced"]
goalStatement:          string   (free text from onboarding prompt)
statedGoal:             enum ["general_python", "data_science", "ml_ai", "job_prep"]
preferredSessionLength: number   (minutes)
setAt:                  ISO timestamp string
```

---

### Subcollection: `users/{uid}/track`

Written by Orchestrator Agent. Read by Session Agent and dashboard.

```
assignedTrack:       enum ["foundations", "builder", "accelerator"]
assignedBranch:      enum ["none", "data_science", "ml", "deep_learning"]
currentModuleId:     string   e.g. "builder_module_5"
currentLessonId:     string   e.g. "builder_m5_l1"
currentProblemId:    string   e.g. "linked_list_reversal"
trackAssignedAt:     ISO timestamp string
trackAssignedReason: string   (Orchestrator plain-language reason, max 2 sentences)
```

---

### Subcollection: `users/{uid}/skills`

Written by Progress Agent after each session end. Never decremented
below the previous value directly — always weighted average.

```
arrays:       number  (0.0 – 1.0)
linked_lists: number
trees:        number
queues:       number
recursion:    number
dfs:          number
sorting:      number
strings:      number
oop:          number
debugging:    number
last_updated: ISO timestamp string
```

**Weighted average formula (Progress Agent):**
```
new_score = (current_score × 0.4) + (session_score × 0.6)
```
Session score higher → improves quickly.
Session score lower  → absorbs gradually (never collapses profile).

---

### Subcollection: `users/{uid}/diagnostic`

Written **once** when diagnostic challenge completes. Never overwritten.

```
completedAt:        ISO timestamp string
sessionId:          string   (reference to challengeSessions/{id})
rawScores: {
  arrays:       number,
  linked_lists: number,
  trees:        number,
  queues:       number
}
perDomainConfidence: {
  arrays:       enum ["solid", "uncertain", "shaky", "blind"],
  linked_lists: enum [...],
  trees:        enum [...],
  queues:       enum [...]
}
agentInterpretation: string  (plain language from Orchestrator, shown on dashboard)
```

**Confidence tier definitions (Orchestrator reads these):**
- `solid`     — correct answer, fast response, no answer change
- `uncertain` — correct but slow, or answer was changed
- `shaky`     — incorrect answer
- `blind`     — extremely fast (likely random) or no meaningful attempt

---

### Subcollection: `users/{uid}/progression`

Written by Progress Agent. XP is a one-way ratchet — never decremented.

```
totalXP:           number   (never decremented)
currentLevel:      number
xpToNextLevel:     number
streakDays:        number
lastStreakDate:     ISO date string (YYYY-MM-DD)
domainBestScores: {
  arrays:       number,    (best score ever achieved in this domain)
  linked_lists: number,
  trees:        number,
  queues:       number,
  recursion:    number,
  dfs:          number,
  sorting:      number
}
```

**XP delta rule on repeat challenge runs:**
```
delta = max(0, newRunDomainScore - domainBestScores[domain])
totalXP += delta
```

---

### Subcollection: `users/{uid}/agentState`

Written by agents. Read by dashboard UI. **UI reads this only — never
raw session data directly.**

#### `users/{uid}/agentState/dashboardState`

Written by Orchestrator Agent. Drives everything the dashboard renders.

```
lastUpdated: ISO timestamp string
mascotMessage: string  (max 10 words, specific to this user's state)
recommendedRoute: enum [
  "training_grounds",
  "challenges",
  "continue_lesson",
  "review_weak_domain",
  "complete_diagnostic"
]
nextActionCards: [
  {
    cardId:      string,
    type:        enum ["training_grounds", "challenges", "lesson", "review"],
    title:       string,
    description: string  (max 20 words),
    targetId:    string  (problemId, moduleId, or challengeSetId),
    domain:      string,
    priority:    number  (1 = most important, shown first),
    reasonText:  string  (agent plain-language reason, max 1 sentence)
  }
]
```

Maximum 3 cards. Priority 1 card is the primary call to action.
The dashboard never shows more than 3 cards.

#### `users/{uid}/agentState/learningProfile`

Written by Progress Agent after each session end.

```
lastUpdated:           ISO timestamp string
patternLabel:          enum [
                         "reasoned_builder",
                         "hint_dependent_explorer",
                         "pattern_guesser",
                         "stuck_looper"
                       ]
sessionCount:          number
averageSessionQuality: number  (0.0 – 1.0, rolling average)
weakestDomain:         string
strongestDomain:       string
```

#### `users/{uid}/agentState/activeSession`

Written by Session Agent when a session starts. Cleared on session end.

```
sessionId:        string
sessionType:      enum ["training_grounds", "challenges", "diagnostic"]
startedAt:        ISO timestamp string
currentProblemId: string
```

---

### Subcollection: `users/{uid}/sessions/{sessionId}`

One document per Training Grounds session. Written by Session Agent.

```
type:      enum ["training_grounds"]
startedAt: ISO timestamp string
endedAt:   ISO timestamp string | null
trackId:   string
moduleId:  string
```

#### `sessions/{sessionId}/problems/{problemId}`

One document per problem attempted in this session.

```
startedAt:   ISO timestamp string
completedAt: ISO timestamp string | null
mode:        enum ["ide", "blocks"]
passed:      boolean
attempts: [
  {
    attemptNumber:       number,
    timestamp:           ISO timestamp string,
    codeOrArrangement:   string,  (raw code string OR JSON array of block positions)
    testResult:          enum ["pass", "fail", "error", "timeout"],
    testsPassedCount:    number,
    testsTotalCount:     number,
    timeDeltaMs:         number   (ms since problem loaded)
  }
]
hints: {
  dropdownsOpened: [
    { blockId: string, timestamp: ISO timestamp string }
  ],
  geminiHintsReceived: [
    {
      hintText:                string,
      timestamp:               ISO timestamp string,
      promptedByAttemptNumber: number,
      userActedOnHint:         boolean
    }
  ],
  videoViewed:          boolean,
  videoViewTimestamp:   ISO timestamp string | null
}
```

#### `sessions/{sessionId}/summary`

Written by Progress Agent after session ends. Never written by client.

```
totalTimeMs:               number
problemsAttempted:         number
problemsPassed:            number
totalRunAttempts:          number
totalHintsUsed:            number
totalGeminiHints:          number
sessionQualityScore:       number   (0.0 – 1.0, computed by Progress Agent)
domainScoresThisSession: {
  {domain}: number
}
agentProcessLabel:         string   (one of the four pattern labels)
```

---

### Subcollection: `users/{uid}/challengeSessions/{sessionId}`

One document per challenge session (diagnostic or targeted).

```
type:            enum ["diagnostic", "targeted", "review"]
startedAt:       ISO timestamp string
endedAt:         ISO timestamp string | null
questionSetId:   string   (reference to content/challengeSets/items/{id})
isRepeatRun:     boolean
shuffleSeed:     string   (ensures no two consecutive sessions share ordering)
```

#### `challengeSessions/{sessionId}/questions/{questionId}`

```
domain:             string
difficulty:         number
answeredCorrectly:  boolean
selectedOptionId:   string
correctOptionId:    string
timeToAnswerMs:     number
changedAnswer:      boolean
```

#### `challengeSessions/{sessionId}/summary`

Written by Progress Agent after challenge session ends.

```
totalScore:         number
perDomainScores: {
  {domain}: number
}
xpEarned:           number
isRepeatRun:        boolean
previousBestScore:  number
deltaXP:            number   (always >= 0, added to progression.totalXP)
```

---

## Collection: `content`

**Written by `migrate.js` only. Never written by client or agents.**
Agents read from this to know what content exists.

### `content/questions/items/{questionId}`

```
id:                   string   e.g. "two_sum"
title:                string
difficulty:           string   "easy" | "medium" | "hard"
difficultyNumeric:    number   1 | 2 | 3
track:                string   original track tag e.g. "arrays"
tags:                 string[]

moduleId:             string   e.g. "builder_module_1"
trackId:              string   "foundations" | "builder" | "accelerator"
domain:               string   e.g. "arrays"
templateType:         string   e.g. "phaser_array"
visualConfig:         object   renderer-specific config
solutionBlockCount:   number   target block count for blocks mode (8–11)

promptMarkdown:       string   full prompt.md content
reasoningMarkdown:    string   full reasoning.md content

starterCode: {
  python: string
}

testsVisible: [
  { id: string, input: object, expected: any }
]
testsHidden: [
  { id: string, input: object, expected: any }
]

globalStats: {
  totalAttempts:          number,
  totalPasses:            number,
  averageAttemptsToPass:  number | null
}

videoStoragePath: string | null
videoPreload:     boolean
estimatedMinutes: number
createdAt:        ISO timestamp string
migratedFromLocal: boolean
```

### `content/tracks/items/{trackId}`

```
id:                    string   "foundations" | "builder" | "accelerator"
displayName:           string
internalName:          string
tagline:               string
description:           string
targetAudience:        string
selfReportedLevelMatch: string[]
estimatedHours:        number
modules:               string[]   ordered array of moduleIds
branches:              object | null   (accelerator only)
capstoneModuleId:      string | null
nextTrack:             string | null
color:                 string   hex color for UI
iconName:              string
createdAt:             ISO timestamp string
```

### `content/modules/items/{moduleId}`

```
id:                          string
trackId:                     string
moduleNumber:                number
title:                       string
description:                 string
lessons:                     string[]   ordered lessonIds
trainingGroundsProblemId:    string | null
challengeSetId:              string | null
estimatedMinutes:            number
isCapstone:                  boolean
capstoneUnlocksTrack:        string | null
isBranchPoint:               boolean
availableBranches:           string[] | null
createdAt:                   ISO timestamp string
```

### `content/lessons/items/{lessonId}`

```
id:               string
moduleId:         string
trackId:          string
lessonNumber:     number
title:            string
conceptName:      string
estimatedMinutes: number
hasVisualization: boolean
visualizationType: string
isContentReady:   boolean
contentMarkdown:  string | null   (inline for short lessons)
contentStoragePath: string | null (Cloud Storage path for long lessons)
createdAt:        ISO timestamp string
```

### `content/challengeSets/items/{setId}`

```
id:                      string
moduleId:                string | null
type:                    enum ["diagnostic", "post_training_grounds", "review"]
domains:                 string[]
activatesAfterProblemId: string | null
questionCount:           number
questions: [
  {
    questionId:     string,
    domain:         string,
    difficulty:     number,
    type:           enum ["conceptual", "application", "debugging", "syntax"],
    questionText:   string,
    options: [
      { id: string, text: string }
    ],
    correctOptionId: string,
    explanation:    string,
    tags:           string[]
  }
]
createdAt: ISO timestamp string
```

**Note on options shuffling:** `correctOptionId` is always a stable
letter (`"a"`, `"b"`, `"c"`, `"d"`). The Orchestrator Agent shuffles
the `options` array order per session and writes a new `shuffledOptions`
array to the challenge session — the source document is never mutated.

### `content/uiTemplates/items/{templateId}`

```
id:                          string
templateName:                string
description:                 string
supportedDomains:            string[]
phaserScene:                 string | null
configSchema:                object
canvasResolutionMultiplier:  number   (always >= 2 for block mode)
minFontSizePx:               number   (always >= 14)
maxBlockCount:               number
createdAt:                   ISO timestamp string
```

---

## Agent Read/Write Contracts

### Session Agent

| Operation | Path |
|---|---|
| READ | `content/questions/items/{questionId}` — get test cases and block config |
| READ | `users/{uid}/agentState/activeSession` — check current session state |
| WRITE | `users/{uid}/sessions/{sessionId}` — create session document |
| WRITE | `users/{uid}/sessions/{sessionId}/problems/{problemId}` — log attempts |
| WRITE | `users/{uid}/agentState/activeSession` — update current problem |

**Triggers:** User clicks Run, opens hint dropdown, receives Gemini hint,
problem passes, problem is skipped.

**Never reads:** `users/{uid}/agentState/dashboardState` or any
`challengeSessions` data.

---

### Progress Agent

| Operation | Path |
|---|---|
| READ | `users/{uid}/sessions/` — all sessions for this user |
| READ | `users/{uid}/challengeSessions/` — all challenge sessions |
| READ | `users/{uid}/skills/` — current skill vector |
| READ | `users/{uid}/progression/` — current XP and bests |
| WRITE | `users/{uid}/sessions/{sessionId}/summary` — session summary |
| WRITE | `users/{uid}/challengeSessions/{sessionId}/summary` — challenge summary |
| WRITE | `users/{uid}/skills/` — updated skill vector (weighted average) |
| WRITE | `users/{uid}/progression/` — updated XP (delta only, never decrement) |
| WRITE | `users/{uid}/agentState/learningProfile` — updated pattern label |

**Triggers:** Session end (Training Grounds or Challenges), user logout,
user inactive for 30+ minutes with unsaved session.

**Never reads:** `content/` directly (that is the Orchestrator's job).

---

### Orchestrator Agent

| Operation | Path |
|---|---|
| READ | `users/{uid}/agentState/learningProfile` |
| READ | `users/{uid}/skills/` |
| READ | `users/{uid}/track/` |
| READ | `users/{uid}/diagnostic/` |
| READ | `users/{uid}/preferences/` |
| READ | `content/tracks/items/` — what tracks exist |
| READ | `content/modules/items/` — what modules exist and their problem IDs |
| READ | `content/challengeSets/items/` — what challenge sets are available |
| WRITE | `users/{uid}/agentState/dashboardState` — what dashboard renders |
| WRITE | `users/{uid}/track/currentModuleId` — advance track position |
| WRITE | `users/{uid}/track/currentLessonId` — advance lesson position |

**Triggers:**
- Progress Agent completes a write to `learningProfile` (Cloud Function trigger)
- User logs in after 24+ hour gap
- `onboardingPhase` transitions to `onboarding_complete`

**Never writes:** Any session data, any skill scores directly.

---

## Relationship to Original Implementation Plan

The original `Firebase Architecture & Migration Plan` proposed three
collections: `users`, `questions`, and `attempts`.

**What was kept:**
- `users` collection with Auth `uid` as document ID ✓
- `globalStats` on question documents (totalAttempts, totalPasses) ✓
- `promptMarkdown` and `reasoningMarkdown` inline on question document ✓
- `starterCode` keyed by language ✓
- `estimatedMinutes`, `tags`, `difficulty`, `track` fields ✓

**What was changed:**
- `attempts` collection → split into `sessions/{id}/problems/{id}/attempts`
  subcollection per user. Reason: enables per-user session history without
  cross-user queries; stays within document size limits; enables Progress
  Agent to read only one user's data per invocation.
- `questions` collection → moved to `content/questions/items/` under the
  content collection. Reason: separates user-mutable data from content
  data; migrate.js can safely overwrite content without touching user state.
- `exp`, `level`, `rank` on user doc → moved to `users/{uid}/progression/`
  subcollection. Reason: prevents agents from overwriting each other's
  writes to the same document; each subcollection has a single writer.
- Password storage → Firebase Authentication handles this. Never in
  Firestore. (This was already correct in the original plan.)

---

## Migration Script Usage

```bash
# Install dependencies
cd ronin-migration
npm install

# Place your service account key
# Download from: Firebase Console → Project Settings → Service Accounts
# Save as: ronin-migration/serviceAccountKey.json
# NEVER commit this file — add to .gitignore

# Update CONTENT_ROOT in migrate.js to point to your local content folder
# Default: "../content/questions/python"

# Run full migration
node migrate.js

# Run single seed
node migrate.js questions
node migrate.js tracks
node migrate.js modules
node migrate.js lessons
node migrate.js challengeSets
node migrate.js uiTemplates
```

**Seed execution order matters:**
tracks → modules → lessons → questions → challengeSets → uiTemplates

Running `node migrate.js` without arguments runs them in this order automatically.

---

## .gitignore additions required

```
# Firebase service account — NEVER commit
ronin-migration/serviceAccountKey.json
ronin-migration/node_modules/
```
