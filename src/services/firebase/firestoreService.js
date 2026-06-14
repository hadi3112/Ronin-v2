import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig.js';

/**
 * Helper to fetch any document by path
 */
async function fetchDocByPath(collectionPath, docId) {
  try {
    console.log(`🔥 Firebase Request: Fetching document from [${collectionPath}/${docId}]...`);
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      console.log(`✅ Firebase Response [${collectionPath}/${docId}]:`, JSON.stringify(data, null, 2));
      return data;
    } else {
      console.warn(`⚠️ Firebase Response: Document NOT FOUND at [${collectionPath}/${docId}]`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Firebase Error fetching document [${collectionPath}/${docId}]:`, error);
    throw error;
  }
}

/**
 * Fetches track metadata by ID
 */
export async function fetchTrack(trackId) {
  return fetchDocByPath('content/tracks/items', trackId);
}

/**
 * Fetches module metadata by ID
 */
export async function fetchModule(moduleId) {
  return fetchDocByPath('content/modules/items', moduleId);
}

/**
 * Fetches lesson content (text) by ID
 */
export async function fetchLesson(lessonId) {
  return fetchDocByPath('content/lessons/items', lessonId);
}

/**
 * Fetches video lesson content by ID
 */
export async function fetchVideoLesson(videoId) {
  return fetchDocByPath('content/videoLessons/items', videoId);
}

/**
 * Fetches training grounds question by ID
 */
export async function fetchQuestion(questionId) {
  return fetchDocByPath('content/questions/items', questionId);
}

/**
 * Backward compatibility function for fetching a question document
 */
export async function fetchQuestionDoc(questionId) {
  return fetchQuestion(questionId);
}

/**
 * Fetches a challenge set (multiple choice questions) by ID
 */
export async function fetchChallengeSet(setId) {
  return fetchDocByPath('content/challengeSets/items', setId);
}

/**
 * Fetches diagnostic questions by ID
 */
export async function fetchDiagnostic(diagnosticId) {
  return fetchDocByPath('content/diagnostics/items', diagnosticId);
}

/**
 * Fetches all modules associated with a track ordered by module number
 */
export async function fetchModulesForTrack(trackId) {
  try {
    console.log(`🔥 Firebase Request: Fetching modules for track [${trackId}]...`);
    const modulesRef = collection(db, 'content/modules/items');
    const q = query(
      modulesRef,
      where('trackId', '==', trackId),
      orderBy('moduleNumber', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const modules = [];
    querySnapshot.forEach((docSnap) => {
      modules.push({ id: docSnap.id, ...docSnap.data() });
    });
    console.log(`✅ Firebase Response [Modules for ${trackId}]: Found ${modules.length} modules\n`, JSON.stringify(modules, null, 2));
    return modules;
  } catch (error) {
    console.error(`❌ Firebase Error fetching modules for track ${trackId}:`, error);
    throw error;
  }
}

/**
 * Saves a user attempt (stubbed to localStorage for now as user writes stay local)
 */
export async function saveAttempt(userId, questionId, attemptData) {
  const key = `user_attempt_${userId}_${questionId}`;
  localStorage.setItem(key, JSON.stringify({
    ...attemptData,
    timestamp: new Date().toISOString()
  }));
  return Promise.resolve();
}
