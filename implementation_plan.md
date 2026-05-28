# Firebase Architecture & Migration Plan

This document outlines the exact, step-by-step manual process required to set up Firebase for Ronin, along with the comprehensive database schema designed to support user profiles, experience points (EXP), leaderboards, and modular question data.

> [!WARNING]
> **Important Security Note regarding Passwords:**
> You requested storing the password in the database schema. **You should never store passwords in Firestore.** Instead, we will use **Firebase Authentication**. Firebase Auth securely handles email/password combinations, hashing, and session tokens. The Firestore database will only store the user's public profile and stats, linking to the Auth system via a unique `uid`.

---

## 🏗️ 1. Firebase Console Setup (Manual Steps)

These are the exact steps you need to follow outside of the codebase in your web browser.

### A. Create the Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Name it **Ronin**.
4. You can disable Google Analytics for now to keep things simple.
5. Once created, click the **Web icon (`</>`)** on the project overview page to register a Web App.
6. Name the app "Ronin Web".
7. Firebase will give you a `firebaseConfig` object containing keys (`apiKey`, `projectId`, etc.). **Copy this.** We will need it later for our `.env` files.

### B. Enable Authentication
1. On the left sidebar, click **Authentication**, then **Get Started**.
2. Click the **Sign-in method** tab.
3. Enable **Email/Password** and click Save.

### C. Set Up Firestore Database
1. On the left sidebar, click **Firestore Database**, then **Create Database**.
2. Start in **Test Mode** (this allows us to read/write freely while developing. We will lock this down with strict security rules before launching).
3. Choose a region closest to your primary user base (e.g., `us-central1`).

### D. Set Up Cloud Storage (For MP4s)
1. On the left sidebar, click **Storage**, then **Get Started**.
2. Start in **Test Mode**.
3. Once created, create a folder called `videos`.
4. **Upload your video:** Drag and drop `two_sum_intro.mp4` into this folder.
5. Click on the uploaded video to get its Storage Path (e.g., `gs://ronin-xxxx.appspot.com/videos/two_sum_intro.mp4`).

---

## 🗄️ 2. Comprehensive Firestore Schema Design

Firestore is a NoSQL document database. Data is stored in Collections, which contain Documents.

### Collection: `users`
**Purpose:** Stores user profiles, overall progression (EXP), and global statistics used for the scoreboard.
**Document ID:** The Firebase Auth `uid` (ensures 1:1 mapping with login credentials).

```json
{
  "email": "user@example.com",
  "username": "hadi_ronin", // Unique display name
  "avatarUrl": "gs://...",  // Optional
  
  // Progression
  "exp": 1450,
  "level": 5,
  "rank": "Silver II",
  
  // Scoreboard / Global Stats
  "totalSolved": 42,
  "accuracyPercentage": 87.5,
  
  // Breakdown by category (used for radar charts/profiles)
  "solvedByCategory": {
    "arrays": 15,
    "hash_tables": 10,
    "dynamic_programming": 2,
    "graphs": 15
  },
  
  // Breakdown by difficulty
  "solvedByDifficulty": {
    "easy": 30,
    "medium": 10,
    "hard": 2
  },

  "createdAt": "timestamp",
  "lastLoginAt": "timestamp"
}
```

### Collection: `questions`
**Purpose:** Replaces the local `/src/content/questions/` folders. This holds the actual problem data.
**Document ID:** Unique string (e.g., `two_sum`).

```json
{
  "title": "Two Sum",
  "difficulty": "easy",
  "track": "arrays",
  "tags": ["array", "hash-table"],
  
  // We store the Markdown as direct string fields.
  "promptMarkdown": "# Two Sum\nGiven an array...",
  "reasoningMarkdown": "### The Optimal Approach\nUse a Hash Map...",
  
  // Starter code mapped by language
  "starterCode": {
    "python": "def solution(nums, target):\n    pass",
    "cpp": "class Solution {\npublic:\n    vector<int> twoSum(...) {\n    }\n};"
  },
  
  // The exact JSON array we created in tests.json
  "tests": [
    {
      "id": "tc-1",
      "input": { "nums": [2,7,11,15], "target": 9 },
      "expected": [0,1]
    }
  ],
  
  // Media links pointing to Cloud Storage
  "videoStoragePath": "gs://ronin-xxxx.appspot.com/videos/two_sum_intro.mp4",
  
  "estimatedMinutes": 10,
  "globalStats": {
    "totalAttempts": 15420,
    "totalPasses": 12000
  }
}
```

### Collection: `attempts`
**Purpose:** Records every time a user submits code. We separate this from the `users` collection because a user might submit 500 times, and embedding that inside the user profile would break Firestore's 1MB document size limit.

**Document ID:** Auto-generated ID.

```json
{
  "userId": "auth_uid_123",        // Reference to the user
  "questionId": "two_sum",         // Reference to the question
  
  "languageUsed": "python",
  "passedAllTests": true,
  "testsPassed": 3,
  "totalTests": 3,
  
  "executionTimeMs": 45,
  "memoryUsedKb": 1024,
  
  "codeSnapshot": "def solution(nums, target):\n    seen = {}\n    ...", // Used for 'last_saved' reloading
  
  "expAwarded": 10,                // How much EXP they got for this specific run
  "timestamp": "timestamp"
}
```

---

## 🔄 3. How We Will Migrate Local Content to Firestore

Once you have completed the Firebase Console setup, we will need to inject our local `two_sum` data into the database.

**The Migration Process:**
1. I will write a temporary Node.js script called `migrateData.js`.
2. This script will read your local `prompt.md`, `reasoning.md`, `starter.py`, and `tests.json`.
3. It will merge them into the exact JSON format specified in the `questions` schema above.
4. It will use the Firebase Admin SDK to push this document into your live Firestore database.
5. Once confirmed, we delete the local markdown files.
6. We update `questionLoader.js` to fetch directly from Firestore.

---

### User Review Required

Please review the manual steps and the database schema. 
- Are you comfortable setting up the Firebase console manually based on these steps?
- Does the schema capture all the elements you want tracked for the scoreboard (e.g., EXP, breakdowns by category)?
- Do you understand why we must use Firebase Authentication for passwords rather than storing them in Firestore?
