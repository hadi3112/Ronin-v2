/**
 * SEED: modules
 *
 * Writes all curriculum modules to Firestore.
 * Each module is a unit of learning inside a track, containing:
 *   - An ordered list of lesson IDs
 *   - A linked Training Grounds problem ID
 *   - A linked challenge set ID
 *
 * The four Training Grounds problems currently in the codebase
 * are wired into Builder modules 1, 5, 6, 7.
 *
 * Writes to: content/modules/{moduleId}
 */

const MODULES = [
  // ══════════════════════════════════════════════════════════════
  // TRACK: FOUNDATIONS
  // ══════════════════════════════════════════════════════════════
  {
    id: "foundations_module_1",
    trackId: "foundations",
    moduleNumber: 1,
    title: "Module 1: Getting Started with Code",
    description: "Learn the basics of what code is, running programs, and printing output.",
    lessons: ["foundations_m1_video_1", "foundations_m1_l1", "foundations_m1_l2"],
    trainingGroundsProblemId: null,   // no TG problem yet — lessons only
    challengeSetId: "cs_foundations_m1",
    estimatedMinutes: 20,
    isCapstone: false,
  },
  {
    id: "foundations_module_2",
    trackId: "foundations",
    moduleNumber: 2,
    title: "Module 2: Variables & Data Types",
    description: "Understand variables, memory storage boxes, and numbers vs text.",
    lessons: ["foundations_m2_video_1", "foundations_m2_l1"],
    trainingGroundsProblemId: null,
    challengeSetId: "cs_foundations_m2",
    estimatedMinutes: 25,
    isCapstone: false,
  },
  {
    id: "foundations_module_3",
    trackId: "foundations",
    moduleNumber: 3,
    title: "Math and Operations",
    description: "Arithmetic, modulo, order of operations.",
    lessons: ["foundations_m3_l1", "foundations_m3_l2", "foundations_m3_l3"],
    trainingGroundsProblemId: "simple_calculator",
    challengeSetId: "cs_foundations_m3",
    estimatedMinutes: 30,
    isCapstone: false,
  },
  {
    id: "foundations_module_4",
    trackId: "foundations",
    moduleNumber: 4,
    title: "Getting Input",
    description: "input(), type conversion, building interactive programs.",
    lessons: ["foundations_m4_l1", "foundations_m4_l2", "foundations_m4_l3"],
    trainingGroundsProblemId: "age_calculator",
    challengeSetId: "cs_foundations_m4",
    estimatedMinutes: 25,
    isCapstone: false,
  },
  {
    id: "foundations_module_5",
    trackId: "foundations",
    moduleNumber: 5,
    title: "Conditionals",
    description: "If, else, elif, comparison operators, and/or logic.",
    lessons: ["foundations_m5_l1", "foundations_m5_l2", "foundations_m5_l3", "foundations_m5_l4"],
    trainingGroundsProblemId: "grade_classifier",
    challengeSetId: "cs_foundations_m5",
    estimatedMinutes: 35,
    isCapstone: false,
  },
  {
    id: "foundations_module_6",
    trackId: "foundations",
    moduleNumber: 6,
    title: "Loops",
    description: "While, for, range, break and continue.",
    lessons: ["foundations_m6_l1", "foundations_m6_l2", "foundations_m6_l3", "foundations_m6_l4"],
    trainingGroundsProblemId: "number_guessing_game",
    challengeSetId: "cs_foundations_m6",
    estimatedMinutes: 40,
    isCapstone: false,
  },
  {
    id: "foundations_module_7",
    trackId: "foundations",
    moduleNumber: 7,
    title: "Lists",
    description: "Ordered collections, indexing, append, remove, loops.",
    lessons: ["foundations_m7_l1", "foundations_m7_l2", "foundations_m7_l3", "foundations_m7_l4"],
    trainingGroundsProblemId: "shopping_list_manager",
    challengeSetId: "cs_foundations_m7",
    estimatedMinutes: 35,
    isCapstone: false,
  },
  {
    id: "foundations_module_8",
    trackId: "foundations",
    moduleNumber: 8,
    title: "Functions",
    description: "Reusable named instructions, parameters, return values, scope.",
    lessons: ["foundations_m8_l1", "foundations_m8_l2", "foundations_m8_l3", "foundations_m8_l4"],
    trainingGroundsProblemId: "temperature_converter",
    challengeSetId: "cs_foundations_m8",
    estimatedMinutes: 40,
    isCapstone: false,
  },
  {
    id: "foundations_module_9",
    trackId: "foundations",
    moduleNumber: 9,
    title: "First Real Project",
    description: "Capstone: text-based calculator combining all concepts.",
    lessons: [],
    trainingGroundsProblemId: "text_calculator_capstone",
    challengeSetId: null,
    estimatedMinutes: 45,
    isCapstone: true,
    capstoneUnlocksTrack: "builder",
  },

  // ══════════════════════════════════════════════════════════════
  // TRACK: BUILDER
  // ══════════════════════════════════════════════════════════════
  {
    id: "builder_module_1",
    trackId: "builder",
    moduleNumber: 1,
    title: "Lists at Depth",
    description: "Arrays, slicing, list comprehensions, sorting.",
    lessons: ["builder_m1_l1", "builder_m1_l2", "builder_m1_l3", "builder_m1_l4"],
    // two_sum is the Training Grounds entry point for Builder track
    trainingGroundsProblemId: "two_sum",
    challengeSetId: "cs_builder_m1",
    estimatedMinutes: 35,
    isCapstone: false,
  },
  {
    id: "builder_module_2",
    trackId: "builder",
    moduleNumber: 2,
    title: "Dictionaries and Hash Maps",
    description: "Key-value pairs, lookup, frequency counters.",
    lessons: ["builder_m2_l1", "builder_m2_l2", "builder_m2_l3", "builder_m2_l4"],
    trainingGroundsProblemId: "word_frequency_counter",
    challengeSetId: "cs_builder_m2",
    estimatedMinutes: 35,
    isCapstone: false,
  },
  {
    id: "builder_module_3",
    trackId: "builder",
    moduleNumber: 3,
    title: "Strings at Depth",
    description: "String methods, slicing, immutability, two-pointer patterns.",
    lessons: ["builder_m3_l1", "builder_m3_l2", "builder_m3_l3", "builder_m3_l4"],
    trainingGroundsProblemId: "palindrome_checker",
    challengeSetId: "cs_builder_m3",
    estimatedMinutes: 30,
    isCapstone: false,
  },
  {
    id: "builder_module_4",
    trackId: "builder",
    moduleNumber: 4,
    title: "Recursion",
    description: "Functions calling themselves, base case, call stack.",
    lessons: ["builder_m4_l1", "builder_m4_l2", "builder_m4_l3", "builder_m4_l4"],
    trainingGroundsProblemId: "factorial_fibonacci",
    challengeSetId: "cs_builder_m4",
    estimatedMinutes: 40,
    isCapstone: false,
  },
  {
    id: "builder_module_5",
    trackId: "builder",
    moduleNumber: 5,
    title: "Linked Lists",
    description: "Nodes, pointers, reversal, two-pointer technique.",
    lessons: ["builder_m5_l1", "builder_m5_l2"],
    trainingGroundsProblemId: "linked_list_reversal",
    challengeSetId: "cs_builder_m5",
    estimatedMinutes: 45,
    isCapstone: false,
  },
  {
    id: "builder_module_6",
    trackId: "builder",
    moduleNumber: 6,
    title: "Stacks and Queues",
    description: "LIFO, FIFO, circular buffer, wrap-around with modulo.",
    lessons: ["builder_m6_l1", "builder_m6_l2", "builder_m6_l3"],
    trainingGroundsProblemId: "circular_queue",
    challengeSetId: "cs_builder_m6",
    estimatedMinutes: 45,
    isCapstone: false,
  },
  {
    id: "builder_module_7",
    trackId: "builder",
    moduleNumber: 7,
    title: "Trees and DFS",
    description: "Binary trees, pre-order traversal, recursion on trees.",
    lessons: ["builder_m7_l1", "builder_m7_l2", "builder_m7_l3"],
    trainingGroundsProblemId: "dfs_traversal",
    challengeSetId: "cs_builder_m7",
    estimatedMinutes: 45,
    isCapstone: false,
  },
  {
    id: "builder_module_8",
    trackId: "builder",
    moduleNumber: 8,
    title: "Sorting Algorithms",
    description: "Bubble sort, merge sort, when to use built-ins.",
    lessons: ["builder_m8_l1", "builder_m8_l2", "builder_m8_l3", "builder_m8_l4"],
    trainingGroundsProblemId: "merge_sort",
    challengeSetId: "cs_builder_m8",
    estimatedMinutes: 40,
    isCapstone: false,
  },
  {
    id: "builder_module_9",
    trackId: "builder",
    moduleNumber: 9,
    title: "Real Project",
    description: "Capstone: student grade tracker with dicts, lists, sorting.",
    lessons: [],
    trainingGroundsProblemId: "grade_tracker_capstone",
    challengeSetId: null,
    estimatedMinutes: 60,
    isCapstone: true,
    capstoneUnlocksTrack: "accelerator",
  },

  // ══════════════════════════════════════════════════════════════
  // TRACK: ACCELERATOR
  // ══════════════════════════════════════════════════════════════
  {
    id: "accelerator_module_1",
    trackId: "accelerator",
    moduleNumber: 1,
    title: "Python for Programmers",
    description: "Python idioms, dynamic typing, gotchas for developers from other languages.",
    lessons: ["accelerator_m1_l1", "accelerator_m1_l2", "accelerator_m1_l3", "accelerator_m1_l4"],
    trainingGroundsProblemId: "python_idioms_refactor",
    challengeSetId: "cs_accelerator_m1",
    estimatedMinutes: 40,
    isCapstone: false,
  },
  {
    id: "accelerator_module_2",
    trackId: "accelerator",
    moduleNumber: 2,
    title: "Object-Oriented Python",
    description: "Classes, dunder methods, inheritance, dataclasses.",
    lessons: ["accelerator_m2_l1", "accelerator_m2_l2", "accelerator_m2_l3", "accelerator_m2_l4"],
    trainingGroundsProblemId: "oop_inventory_system",
    challengeSetId: "cs_accelerator_m2",
    estimatedMinutes: 45,
    isCapstone: false,
  },
  {
    id: "accelerator_module_3",
    trackId: "accelerator",
    moduleNumber: 3,
    title: "Python Standard Library",
    description: "collections, itertools, functools, pathlib.",
    lessons: ["accelerator_m3_l1", "accelerator_m3_l2", "accelerator_m3_l3", "accelerator_m3_l4"],
    trainingGroundsProblemId: "log_file_analyzer",
    challengeSetId: "cs_accelerator_m3",
    estimatedMinutes: 40,
    isCapstone: false,
  },
  {
    id: "accelerator_module_4",
    trackId: "accelerator",
    moduleNumber: 4,
    title: "Error Handling and Testing",
    description: "try/except, custom exceptions, pytest basics.",
    lessons: ["accelerator_m4_l1", "accelerator_m4_l2", "accelerator_m4_l3"],
    trainingGroundsProblemId: "csv_parser_with_errors",
    challengeSetId: "cs_accelerator_m4",
    estimatedMinutes: 35,
    isCapstone: false,
  },
  {
    id: "accelerator_module_5",
    trackId: "accelerator",
    moduleNumber: 5,
    title: "Choose Your Path",
    description: "Branch selection: Data Science, Machine Learning, or Deep Learning.",
    lessons: [],
    trainingGroundsProblemId: null,
    challengeSetId: null,
    estimatedMinutes: 5,
    isCapstone: false,
    isBranchPoint: true,
    availableBranches: ["data_science", "ml", "deep_learning"],
  },
];

module.exports = async function seedModules(db, config) {
  let written = 0;
  let skipped = 0;
  let errors = 0;

  for (const mod of MODULES) {
    try {
      const docRef = db
        .collection("content")
        .doc("modules")
        .collection("items")
        .doc(mod.id);

      if (!config.DRY_RUN) {
        if (!config.OVERWRITE_EXISTING) {
          const existing = await docRef.get();
          if (existing.exists) {
            console.log(`  ⏭  Skipping module "${mod.id}" — already exists`);
            skipped++;
            continue;
          }
        }
        await docRef.set({ ...mod, createdAt: new Date().toISOString() });
      } else {
        console.log(`  [DRY RUN] Would write module: ${mod.id}`);
      }

      console.log(`  ✓  ${mod.id}: ${mod.title}`);
      written++;
    } catch (err) {
      console.error(`  ❌ Error writing module "${mod.id}": ${err.message}`);
      errors++;
    }
  }

  return { written, skipped, errors };
};
