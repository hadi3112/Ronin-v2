/**
 * SEED: questions
 *
 * Reads from local filesystem:
 *   {CONTENT_ROOT}/{questionId}/
 *     metadata.json   — id, title, difficulty, track, tags, video, estimatedMinutes
 *     prompt.md       — the problem statement shown to the learner
 *     reasoning.md    — the conceptual explanation / hint document
 *     starter.py      — starter code (named starter.py in current codebase)
 *     tests.json      — visible and hidden test cases
 *
 * Writes to Firestore:
 *   content/questions/{questionId}
 *
 * Schema aligns with the full Ronin schema defined in the architecture plan.
 * Fields from the original implementation plan (globalStats, promptMarkdown etc)
 * are preserved where they add value and superseded where the new schema
 * provides richer structure.
 */

const fs = require("fs");
const path = require("path");

// Maps question folder name → module ID and track ID
// Update this map as new questions are added
const QUESTION_MODULE_MAP = {
  two_sum: {
    moduleId: "builder_module_1",
    trackId: "builder",
    domain: "arrays",
    templateType: "phaser_array",
    visualConfig: {
      renderer: "phaser_array",
      animationMode: "index_highlight",
      showHashMap: true,
    },
    solutionBlockCount: 9,
  },
  linked_list_reversal: {
    moduleId: "builder_module_5",
    trackId: "builder",
    domain: "linked_lists",
    templateType: "phaser_linked_list",
    visualConfig: {
      renderer: "phaser_linked_list",
      animationMode: "pointer_rewire",
    },
    solutionBlockCount: 10,
  },
  circular_queue: {
    moduleId: "builder_module_6",
    trackId: "builder",
    domain: "queues",
    templateType: "phaser_circular_queue",
    visualConfig: {
      renderer: "phaser_circular_queue",
      animationMode: "head_tail_rotation",
    },
    solutionBlockCount: 11,
  },
  dfs_traversal: {
    moduleId: "builder_module_7",
    trackId: "builder",
    domain: "trees",
    templateType: "phaser_dfs_tree",
    visualConfig: {
      renderer: "phaser_dfs",
      animationMode: "node_highlight",
    },
    solutionBlockCount: 9,
  },
};

module.exports = async function seedQuestions(db, config) {
  const contentRoot = path.resolve(__dirname, "../../", config.CONTENT_ROOT);
  let written = 0;
  let skipped = 0;
  let errors = 0;

  if (!fs.existsSync(contentRoot)) {
    throw new Error(
      `CONTENT_ROOT not found: ${contentRoot}\n` +
        `  Check the CONTENT_ROOT value in migrate.js CONFIG`
    );
  }

  const questionFolders = fs
    .readdirSync(contentRoot)
    .filter((name) =>
      fs.statSync(path.join(contentRoot, name)).isDirectory()
    );

  console.log(`  Found ${questionFolders.length} question folders: ${questionFolders.join(", ")}`);

  for (const questionId of questionFolders) {
    const questionDir = path.join(contentRoot, questionId);

    try {
      // ── Read all source files ────────────────────────────────────────────
      const metadataPath = path.join(questionDir, "metadata.json");
      const promptPath = path.join(questionDir, "prompt.md");
      const reasoningPath = path.join(questionDir, "reasoning.md");
      const starterPath = path.join(questionDir, "starter.py");
      const testsPath = path.join(questionDir, "tests.json");

      // Validate required files exist
      const requiredFiles = [metadataPath, promptPath, reasoningPath, testsPath];
      for (const filePath of requiredFiles) {
        if (!fs.existsSync(filePath)) {
          throw new Error(`Missing required file: ${path.basename(filePath)}`);
        }
      }

      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      const promptMarkdown = fs.readFileSync(promptPath, "utf-8");
      const reasoningMarkdown = fs.readFileSync(reasoningPath, "utf-8");
      const starterCode = fs.existsSync(starterPath)
        ? fs.readFileSync(starterPath, "utf-8")
        : "# starter code not found\npass";
      const tests = JSON.parse(fs.readFileSync(testsPath, "utf-8"));

      // ── Split tests into visible and hidden ──────────────────────────────
      const visibleTests = tests.filter((t) => !t.id.includes("hidden"));
      const hiddenTests = tests.filter((t) => t.id.includes("hidden"));

      // ── Get module mapping ───────────────────────────────────────────────
      const moduleMapping = QUESTION_MODULE_MAP[questionId] || {
        moduleId: "unassigned",
        trackId: "builder",
        domain: "general",
        templateType: "none",
        visualConfig: {},
        solutionBlockCount: 10,
      };

      if (!QUESTION_MODULE_MAP[questionId]) {
        console.log(
          `  ⚠️  No module mapping for "${questionId}" — using defaults`
        );
      }

      // ── Assemble Firestore document ──────────────────────────────────────
      // Merges: original implementation plan fields + new architecture fields
      const firestoreDoc = {
        // Identity
        id: questionId,
        title: metadata.title,
        difficulty: metadata.difficulty,           // "easy" | "medium" | "hard"
        difficultyNumeric: difficultyToNumber(metadata.difficulty),
        track: metadata.track,                     // original track field (arrays, etc)
        tags: metadata.tags || [],

        // New architecture fields
        moduleId: moduleMapping.moduleId,
        trackId: moduleMapping.trackId,            // "foundations" | "builder" | "accelerator"
        domain: moduleMapping.domain,
        templateType: moduleMapping.templateType,
        visualConfig: moduleMapping.visualConfig,
        solutionBlockCount: moduleMapping.solutionBlockCount,

        // Content — stored inline (small enough, avoids extra reads)
        promptMarkdown: promptMarkdown,
        reasoningMarkdown: reasoningMarkdown,

        // Starter code keyed by language
        // Expandable: add js/cpp keys later without schema change
        starterCode: {
          python: starterCode,
        },

        // Test cases split by visibility
        testsVisible: visibleTests,
        testsHidden: hiddenTests,

        // Kept from original plan — useful for global leaderboard display
        globalStats: {
          totalAttempts: 0,
          totalPasses: 0,
          averageAttemptsToPass: null,
        },

        // Media
        videoStoragePath: metadata.video?.firebaseStoragePath || null,
        videoPreload: metadata.video?.preload || false,

        // Timing
        estimatedMinutes: metadata.estimatedMinutes || 10,

        // Metadata
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        migratedFromLocal: true,
      };

      // ── Write to Firestore ───────────────────────────────────────────────
      const docRef = db.collection("content").doc("questions").collection("items").doc(questionId);

      if (!config.DRY_RUN) {
        if (!config.OVERWRITE_EXISTING) {
          const existing = await docRef.get();
          if (existing.exists) {
            console.log(`  ⏭  Skipping "${questionId}" — already exists`);
            skipped++;
            continue;
          }
        }

        await docRef.set(firestoreDoc);
      }

      console.log(`  ✓  ${questionId} (${visibleTests.length} visible tests, ${hiddenTests.length} hidden)`);
      written++;
    } catch (err) {
      console.error(`  ❌ Error processing "${questionId}": ${err.message}`);
      errors++;
    }
  }

  return { written, skipped, errors };
};

function difficultyToNumber(difficulty) {
  const map = { easy: 1, medium: 2, hard: 3 };
  return map[difficulty?.toLowerCase()] || 1;
}
