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

const FALLBACK_FOUNDATIONS = {
  foundations_m1_video_1: {
    id: "foundations_m1_video_1",
    title: "Video: What Is Code?",
    description: "A short explanation of what a program is, what a computer actually does when it runs code, and why Python is a good first language.",
    type: "video",
    metadata: {
      video: {
        firebaseStoragePath: "gs://ronin-app-e77d4.appspot.com/videos/what_is_code.mp4"
      }
    }
  },
  foundations_m1_l1: {
    id: "foundations_m1_l1",
    title: "Your First print",
    difficulty: "easy",
    promptMarkdown: "The simplest thing a Python program can do is display a message using the `print()` function.",
    reasoningMarkdown: "In Python, `print()` outputs whatever string is inside the parentheses.",
    starterCode: "print('Hello, Ronin!')",
    tests: [{ id: "t1", input: "", expected: "Hello, Ronin!\n" }],
    metadata: { id: "foundations_m1_l1", title: "Your First print", difficulty: "easy", track: "foundations" }
  },
  foundations_m1_l2: {
    id: "foundations_m1_l2",
    title: "Running Code and Reading Errors",
    type: "coding",
    difficulty: "easy",
    promptMarkdown: `## Running Code and Reading Output

When you click **Run**, Python reads your code line-by-line. If a line is broken, Python raises an error like:
\`SyntaxError: EOL while scanning string literal\`

### Your Task
The starter code below is missing its closing quote on line 2. Fix the error by adding the missing closing quote so it prints \`Hello, Ronin!\` cleanly.`,
    reasoningMarkdown: "In Python, strings must start and end with matching quotes.",
    starterCode: "# FIX THE ERROR: Close the string quote on the line below\nprint('Hello, Ronin!)",
    tests: [{ id: "t1", input: "", expected: "Hello, Ronin!\n" }],
    metadata: { id: "foundations_m1_l2", title: "Running Code and Reading Errors", difficulty: "easy", track: "foundations" }
  },
  foundations_m1_l3: {
    id: "foundations_m1_l3",
    title: "Print Multiple Lines",
    type: "coding",
    difficulty: "easy",
    promptMarkdown: `## Print Multiple Lines

Python executes code line-by-line from top to bottom. Each \`print()\` outputs on a new line.

### Your Task
Run the code below to print \`Line 1\`, \`Line 2\`, and \`Line 3\` on separate lines.`,
    reasoningMarkdown: "Multiple print statements execute sequentially.",
    starterCode: "print('Line 1')\nprint('Line 2')\nprint('Line 3')",
    tests: [{ id: "t1", input: "", expected: "Line 1\nLine 2\nLine 3\n" }],
    metadata: { id: "foundations_m1_l3", title: "Print Multiple Lines", difficulty: "easy", track: "foundations" }
  },
  foundations_m2_video_1: {
    id: "foundations_m2_video_1",
    title: "Video: Variables",
    description: "An explanation of variables using labeled storage boxes.",
    type: "video",
    metadata: {
      video: {
        firebaseStoragePath: "gs://ronin-app-e77d4.appspot.com/videos/variables.mp4"
      }
    }
  },
  foundations_m2_l1: {
    id: "foundations_m2_l1",
    title: "Numbers vs Text",
    type: "coding",
    difficulty: "easy",
    promptMarkdown: "Python treats numbers and text differently. Learn how to declare variables for integers and strings.",
    reasoningMarkdown: "Variables store values that can be referenced later in your code.",
    starterCode: "x = 10\ntext = 'Hello'\nprint(x)\nprint(text)",
    tests: [{ id: "t1", input: "", expected: "10\nHello\n" }],
    metadata: { id: "foundations_m2_l1", title: "Numbers vs Text", difficulty: "easy", track: "foundations" }
  }
}

export async function getQuestion(track, id) {
  // Check if we are loading a Foundations question from Firestore
  if (track === 'foundations' && (id.startsWith('foundations_m') || id.startsWith('cs_'))) {
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

      if (FALLBACK_FOUNDATIONS[id]) {
        const fb = FALLBACK_FOUNDATIONS[id];
        const testsList = (qDoc.tests && qDoc.tests.length > 0) ? qDoc.tests : fb.tests;
        const formattedTests = testsList.map((t, idx) => ({
          id: t.id || `t_${idx + 1}`,
          input: t.input ?? "",
          expected: t.expectedOutput || t.expected || ""
        }));

        return {
          id: qDoc.id || id,
          title: fb.title || qDoc.title,
          difficulty: fb.difficulty || qDoc.difficulty || 'easy',
          promptMarkdown: fb.promptMarkdown || qDoc.contentMarkdown || qDoc.promptMarkdown || '',
          reasoningMarkdown: fb.reasoningMarkdown || qDoc.reasoningMarkdown || '',
          starterCode: qDoc.starterCode || fb.starterCode || "print('Hello, Ronin!')",
          tests: formattedTests,
          type: fb.type || qDoc.type || 'coding',
          metadata: fb.metadata || {
            id: id,
            title: fb.title || qDoc.title,
            difficulty: 'easy',
            track: 'foundations',
            tags: []
          }
        };
      }

      if (qDoc.type === 'video' || id.includes('_video_')) {
        return {
          id: qDoc.id || id,
          title: qDoc.title,
          description: qDoc.description,
          type: 'video',
          metadata: {
            video: {
              firebaseStoragePath: qDoc.firebaseStoragePath || qDoc.metadata?.video?.firebaseStoragePath || "gs://ronin-app-e77d4.appspot.com/videos/what_is_code.mp4"
            }
          }
        }
      }

      if (qDoc.type === 'coding' || qDoc.type === 'code' || qDoc.starterCode || (qDoc.tests && qDoc.tests.length > 0)) {
        const testsList = qDoc.tests || [
          ...(qDoc.testsVisible || []),
          ...(qDoc.testsHidden || [])
        ];
        const formattedTests = testsList.map((t, idx) => ({
          id: t.id || `t_${idx + 1}`,
          input: t.input ?? "",
          expected: t.expectedOutput || t.expected || ""
        }));

        return {
          id: qDoc.id || id,
          title: qDoc.title,
          difficulty: qDoc.difficulty || 'easy',
          promptMarkdown: qDoc.contentMarkdown || qDoc.questionMarkdown || qDoc.promptMarkdown || '',
          reasoningMarkdown: qDoc.reasoningMarkdown || qDoc.explanation || '',
          starterCode: typeof qDoc.starterCode === 'object' ? qDoc.starterCode.python : (qDoc.starterCode || "print('Hello, Ronin!')"),
          tests: formattedTests,
          metadata: {
            id: qDoc.id || id,
            title: qDoc.title,
            difficulty: qDoc.difficulty || 'easy',
            track: qDoc.trackId || qDoc.track || 'foundations',
            tags: qDoc.tags || []
          }
        };
      }

      if (qDoc.type === 'text') {
        return {
          id: qDoc.id || id,
          title: qDoc.title,
          promptMarkdown: qDoc.contentMarkdown || '',
          type: 'text',
          starterCode: 'pass',
          tests: [],
          metadata: {}
        }
      }

      // Default fallback for Firestore documents
      const combinedTests = [
        ...(qDoc.testsVisible || []),
        ...(qDoc.testsHidden || [])
      ];

      return {
        id: qDoc.id || id,
        title: qDoc.title,
        difficulty: qDoc.difficulty || 'easy',
        promptMarkdown: qDoc.questionMarkdown || qDoc.promptMarkdown || qDoc.contentMarkdown || '',
        reasoningMarkdown: qDoc.reasoningMarkdown || '',
        starterCode: typeof qDoc.starterCode === 'object' ? qDoc.starterCode.python : (qDoc.starterCode || 'pass'),
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
      console.warn(`Failed to load Foundations question [${id}] from Firestore, using fallback:`, error);
      if (FALLBACK_FOUNDATIONS[id]) {
        return FALLBACK_FOUNDATIONS[id];
      }
      return {
        id,
        title: id,
        difficulty: 'easy',
        promptMarkdown: 'Complete the python instructions below:',
        reasoningMarkdown: '',
        starterCode: "print('Hello, Ronin!')",
        tests: [],
        metadata: { id, title: id }
      }
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
