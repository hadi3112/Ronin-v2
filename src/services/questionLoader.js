import { fetchQuestion, fetchLesson, fetchVideoLesson } from './firebase/firestoreService.js';

/**
 * questionLoader.js
 * 
 * Abstract layer for loading question bundles.
 * Currently, it loads from local Vite imports for local tracks,
 * and fetches from Firestore for the Foundations track.
 * 
 * The UI should ONLY interact with this service and the QuestionDefinition object it returns.
 */

/**
 * @typedef {Object} TestCase
 * @property {string} id
 * @property {any} input
 * @property {any} expected
 */

/**
 * @typedef {Object} QuestionDefinition
 * @property {string} id
 * @property {string} title
 * @property {string} difficulty
 * @property {string} promptMarkdown
 * @property {string} reasoningMarkdown
 * @property {string} starterCode
 * @property {TestCase[]} tests
 * @property {Object} metadata
 */

export async function getQuestion(track, id) {
  // Check if we are loading a Foundations question from Firestore
  if (track === 'foundations') {
    try {
      let qDoc = null;
      
      if (id.includes('_video_')) {
        qDoc = await fetchVideoLesson(id);
      } else if (id.includes('_l')) {
        qDoc = await fetchLesson(id);
      } else {
        qDoc = await fetchQuestion(id);
      }

      if (!qDoc) {
        throw new Error(`Content node ${id} not found in Firestore`);
      }

      if (id.includes('_video_') || qDoc.type === 'video') {
        return {
          id: qDoc.id,
          title: qDoc.title,
          description: qDoc.description,
          type: 'video',
          metadata: {
            video: {
              firebaseStoragePath: qDoc.firebaseStoragePath
            }
          }
        }
      }

      if (id.includes('_l') || qDoc.type === 'text') {
        return {
          id: qDoc.id,
          title: qDoc.title,
          promptMarkdown: qDoc.contentMarkdown,
          type: 'text',
          starterCode: 'pass',
          tests: [],
          metadata: {}
        }
      }

      // Combine visible and hidden tests for the test runner compatibility
      const combinedTests = [
        ...(qDoc.testsVisible || []),
        ...(qDoc.testsHidden || [])
      ];

      return {
        id: qDoc.id || id,
        title: qDoc.title,
        difficulty: qDoc.difficulty || 'easy',
        promptMarkdown: qDoc.questionMarkdown || qDoc.promptMarkdown || '',
        reasoningMarkdown: qDoc.reasoningMarkdown || '',
        starterCode: typeof qDoc.starterCode === 'object' ? qDoc.starterCode.python : qDoc.starterCode || 'pass',
        tests: combinedTests,
        metadata: {
          id: qDoc.id || id,
          title: qDoc.title,
          difficulty: qDoc.difficulty || 'easy',
          track: qDoc.track || 'foundations',
          tags: qDoc.tags || []
        }
      };
    } catch (error) {
      console.error(`Failed to load Foundations question [${id}] from Firestore:`, error);
      throw error;
    }
  }

  // Fallback for local files (e.g. Builder track)
  try {
    // We use Vite's specific ?raw suffix to import text content without executing it.
    const promptMod = await import(`../content/questions/${track}/${id}/prompt.md?raw`);
    const reasoningMod = await import(`../content/questions/${track}/${id}/reasoning.md?raw`);
    const starterMod = await import(`../content/questions/${track}/${id}/starter.py?raw`);
    
    // JSON files are imported as objects directly by Vite
    const testsMod = await import(`../content/questions/${track}/${id}/tests.json`);
    const metadataMod = await import(`../content/questions/${track}/${id}/metadata.json`);

    return {
      id: metadataMod.default.id || id,
      title: metadataMod.default.title,
      difficulty: metadataMod.default.difficulty,
      promptMarkdown: promptMod.default,
      reasoningMarkdown: reasoningMod.default,
      starterCode: starterMod.default,
      tests: testsMod.default,
      metadata: metadataMod.default
    };
  } catch (error) {
    console.error(`Failed to load question [${track}/${id}]:`, error);
    throw new Error(`Could not load question bundle for ${id}`);
  }
}
