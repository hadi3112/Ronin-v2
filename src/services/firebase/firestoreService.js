/**
 * firestoreService.js (Placeholder / Future Architecture)
 * 
 * This service is an architectural placeholder for the future transition 
 * from local files to Firebase Firestore.
 * 
 * =======================================================
 * FIREBASE DATABASE SCHEMA DESIGN PROPOSAL
 * =======================================================
 * 
 * We propose the following NoSQL collection structure to support scaling,
 * leaderboards, analytics, and user state:
 * 
 * 1. Collection: users/
 *    - Document: users/{userId}
 *    - Purpose: User profiles, global XP, total solved, preferences.
 * 
 * 2. Collection: questions/
 *    - Document: questions/{questionId}
 *    - Structure:
 *      {
 *        title: string,
 *        difficulty: "easy" | "medium" | "hard",
 *        track: "arrays" | "graphs" | "dp",
 *        promptMarkdown: string,       // The full prompt text
 *        reasoningMarkdown: string,    // The hidden conceptual explanation
 *        starterCode: map (e.g. { python: "...", cpp: "..." }),
 *        tests: array,                 // Visible JSON test cases
 *        videoUrl: string (optional),  // gs:// link to Firebase Storage
 *        tags: string[]
 *      }
 *    - Why: Centralizes question content. By storing markdown directly as strings,
 *      we avoid managing thousands of tiny document files. The UI can fetch exactly
 *      what the QuestionLoader currently builds locally.
 * 
 * 3. Collection: attempts/
 *    - Document: attempts/{attemptId} (or subcollection users/{userId}/attempts/{questionId})
 *    - Structure:
 *      {
 *        userId: reference,
 *        questionId: reference,
 *        attemptsCount: number,
 *        testsPassed: number,
 *        completed: boolean,
 *        bestTime: number,
 *        lastCodeSnapshot: string,
 *        updatedAt: timestamp
 *      }
 *    - Why: Separating attempts from the user document prevents the user document 
 *      from hitting the 1MB Firestore limit. It also makes it trivial to query 
 *      "global completion rates" or build "recent activity" feeds for raids.
 * 
 * 4. Collection: tracks/
 *    - Document: tracks/{trackId}
 *    - Purpose: Defines the curriculum order, categories, and required completion chains.
 * 
 * =======================================================
 * HOW LOCAL FILES MIGRATE TO FIRESTORE
 * =======================================================
 * 1. We will write a Node.js script (using firebase-admin) that loops over
 *    /src/content/questions/*, reads the .md and .json files, and constructs
 *    the Document payload.
 * 2. It will bulk-upload them into the `questions` collection.
 * 3. `questionLoader.js` will swap its `await import(...)` statements to
 *    `await getDoc(doc(db, "questions", id))`.
 * 4. The UI components will not need to change at all.
 */

export async function fetchQuestionDoc(questionId) {
  // TODO: implement Firestore getDoc() later
  throw new Error("Not implemented yet. Using local questionLoader for now.");
}

export async function saveAttempt(userId, questionId, attemptData) {
  // TODO: implement Firestore setDoc() / updateDoc() later
  throw new Error("Not implemented yet.");
}
