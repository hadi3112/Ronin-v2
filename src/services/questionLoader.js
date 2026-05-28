/**
 * questionLoader.js
 * 
 * Abstract layer for loading question bundles.
 * Currently, it loads from local Vite imports. 
 * LATER: It will fetch from Firestore and Cloud Storage.
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
  try {
    // We use Vite's specific ?raw suffix to import text content without executing it.
    // In a future Firebase migration, these will be replaced with fetch() or getDoc() calls.
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
