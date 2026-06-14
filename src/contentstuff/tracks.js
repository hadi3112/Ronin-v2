/**
 * SEED: tracks
 *
 * Writes Ronin's three learning tracks to Firestore:
 *   content/tracks/foundations
 *   content/tracks/builder
 *   content/tracks/accelerator
 *
 * These are the top-level curriculum containers.
 * The Orchestrator Agent reads these to know what tracks exist
 * and where to route a user based on their diagnostic results.
 *
 * Module IDs listed here must match exactly what modules.js seeds.
 */

const TRACKS = [
  {
    id: "foundations",
    displayName: "Foundations",
    internalName: "foundations",
    tagline: "Start from zero. Build real things.",
    description:
      "For learners who have never written a line of code. Every concept is introduced through something you can immediately see and interact with.",
    targetAudience: "Complete beginners with no prior coding experience",
    selfReportedLevelMatch: ["never_coded"],
    estimatedHours: 20,
    modules: [
      "foundations_module_1",
      "foundations_module_2",
      "foundations_module_3",
      "foundations_module_4",
      "foundations_module_5",
      "foundations_module_6",
      "foundations_module_7",
      "foundations_module_8",
      "foundations_module_9",
    ],
    capstoneModuleId: "foundations_module_9",
    nextTrack: "builder",
    color: "#4ade80",   // green — growth
    iconName: "sprout",
    createdAt: new Date().toISOString(),
  },
  {
    id: "builder",
    displayName: "Builder",
    internalName: "builder",
    tagline: "Know the basics. Master the structures.",
    description:
      "For learners who can write Python but have not worked with data structures yet. Problems feel like real tasks, not academic exercises.",
    targetAudience: "Self-taught coders or first/second year CS students",
    selfReportedLevelMatch: ["some_basics"],
    estimatedHours: 25,
    modules: [
      "builder_module_1",  // Lists + Two Sum
      "builder_module_2",  // Dictionaries
      "builder_module_3",  // Strings
      "builder_module_4",  // Recursion
      "builder_module_5",  // Linked Lists
      "builder_module_6",  // Stacks and Queues + Circular Queue
      "builder_module_7",  // Trees + DFS
      "builder_module_8",  // Sorting
      "builder_module_9",  // Capstone Project
    ],
    capstoneModuleId: "builder_module_9",
    nextTrack: "accelerator",
    color: "#f59e0b",   // amber — building
    iconName: "hammer",
    createdAt: new Date().toISOString(),
  },
  {
    id: "accelerator",
    displayName: "Accelerator",
    internalName: "accelerator",
    tagline: "You already code. Now do it in Python.",
    description:
      "For experienced programmers from other languages, or Python users who want to go into data science or machine learning. Respects what you already know.",
    targetAudience: "Working developers or advanced students moving to Python",
    selfReportedLevelMatch: ["experienced"],
    estimatedHours: 30,
    modules: [
      "accelerator_module_1",  // Python for Programmers
      "accelerator_module_2",  // OOP in Python
      "accelerator_module_3",  // Standard Library
      "accelerator_module_4",  // Error Handling and Testing
      "accelerator_module_5",  // Branch entry point
    ],
    branches: {
      data_science: {
        displayName: "Data Science",
        modules: [
          "accelerator_ds_module_1",  // NumPy
          "accelerator_ds_module_2",  // Pandas
          "accelerator_ds_module_3",  // Visualization
        ],
      },
      ml: {
        displayName: "Machine Learning",
        modules: [
          "accelerator_ml_module_1",  // Scikit-learn
          "accelerator_ml_module_2",  // Model evaluation
          "accelerator_ml_module_3",  // Pipelines
        ],
      },
      deep_learning: {
        displayName: "Deep Learning",
        modules: [
          "accelerator_dl_module_1",  // Neural network intuition
          "accelerator_dl_module_2",  // Keras basics
          "accelerator_dl_module_3",  // Image classification
        ],
      },
    },
    capstoneModuleId: null,   // capstone is branch-specific
    nextTrack: null,
    color: "#ef4444",   // red — intensity, mastery
    iconName: "bolt",
    createdAt: new Date().toISOString(),
  },
];

module.exports = async function seedTracks(db, config) {
  let written = 0;
  let skipped = 0;
  let errors = 0;

  for (const track of TRACKS) {
    try {
      const docRef = db.collection("content").doc("tracks").collection("items").doc(track.id);

      if (!config.DRY_RUN) {
        if (!config.OVERWRITE_EXISTING) {
          const existing = await docRef.get();
          if (existing.exists) {
            console.log(`  ⏭  Skipping track "${track.id}" — already exists`);
            skipped++;
            continue;
          }
        }
        await docRef.set(track);
      } else {
        console.log(`  [DRY RUN] Would write track: ${track.id}`);
      }

      console.log(`  ✓  Track: ${track.displayName} (${track.modules.length} modules)`);
      written++;
    } catch (err) {
      console.error(`  ❌ Error writing track "${track.id}": ${err.message}`);
      errors++;
    }
  }

  return { written, skipped, errors };
};
