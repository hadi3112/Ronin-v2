/**
 * SEED: uiTemplates
 *
 * Defines which Phaser scene renders for each question type.
 * The templateType field on a question document maps to one of these.
 * The configSchema tells the renderer what fields to expect from visualConfig.
 *
 * Writes to: content/uiTemplates/{templateId}
 */

const UI_TEMPLATES = [
  {
    id: "phaser_array",
    templateName: "Array Visualizer",
    description:
      "Renders an indexed array with highlight animations. Supports hash map overlay for two-pointer and lookup problems.",
    supportedDomains: ["arrays"],
    phaserScene: "ArrayScene",
    configSchema: {
      renderer: "phaser_array",
      animationMode: ["index_highlight", "two_pointer", "window_slide"],
      showHashMap: "boolean",
      showIndices: "boolean",
    },
    canvasResolutionMultiplier: 2,
    minFontSizePx: 14,
    maxBlockCount: 11,
  },
  {
    id: "phaser_linked_list",
    templateName: "Linked List Visualizer",
    description:
      "Renders a node chain with pointer arrows. Animations for swap, rewire, and reversal operations.",
    supportedDomains: ["linked_lists"],
    phaserScene: "LinkedListScene",
    configSchema: {
      renderer: "phaser_linked_list",
      animationMode: ["pointer_rewire", "node_swap", "pointer_highlight"],
    },
    canvasResolutionMultiplier: 2,
    minFontSizePx: 14,
    maxBlockCount: 11,
  },
  {
    id: "phaser_circular_queue",
    templateName: "Circular Queue Visualizer",
    description:
      "Renders a circular ring buffer with animated head and tail pointers. Shows wrap-around transitions.",
    supportedDomains: ["queues"],
    phaserScene: "CircularQueueScene",
    configSchema: {
      renderer: "phaser_circular_queue",
      animationMode: ["head_tail_rotation", "enqueue_animation", "dequeue_animation"],
    },
    canvasResolutionMultiplier: 2,
    minFontSizePx: 14,
    maxBlockCount: 11,
  },
  {
    id: "phaser_dfs_tree",
    templateName: "DFS Tree Visualizer",
    description:
      "Renders a binary tree with node highlight animations for DFS traversal. Shows recursion depth.",
    supportedDomains: ["trees"],
    phaserScene: "DFSTreeScene",
    configSchema: {
      renderer: "phaser_dfs",
      animationMode: ["node_highlight", "traversal_path", "stack_overlay"],
    },
    canvasResolutionMultiplier: 2,
    minFontSizePx: 14,
    maxBlockCount: 11,
  },
  {
    id: "phaser_call_stack",
    templateName: "Call Stack Visualizer",
    description:
      "Renders a growing and shrinking call stack for recursion problems. Shows function frames.",
    supportedDomains: ["recursion"],
    phaserScene: "CallStackScene",
    configSchema: {
      renderer: "phaser_call_stack",
      animationMode: ["push_frame", "pop_frame", "highlight_active"],
    },
    canvasResolutionMultiplier: 2,
    minFontSizePx: 14,
    maxBlockCount: 11,
  },
  {
    id: "none",
    templateName: "Standard IDE",
    description:
      "No Phaser visualization. Uses the standard code editor with console output only.",
    supportedDomains: ["general", "syntax", "strings", "oop"],
    phaserScene: null,
    configSchema: {},
    canvasResolutionMultiplier: 1,
    minFontSizePx: 14,
    maxBlockCount: 15,
  },
];

module.exports = async function seedUiTemplates(db, config) {
  let written = 0;
  let skipped = 0;
  let errors = 0;

  for (const template of UI_TEMPLATES) {
    try {
      const docRef = db
        .collection("content")
        .doc("uiTemplates")
        .collection("items")
        .doc(template.id);

      if (!config.DRY_RUN) {
        if (!config.OVERWRITE_EXISTING) {
          const existing = await docRef.get();
          if (existing.exists) {
            console.log(`  ⏭  Skipping template "${template.id}" — already exists`);
            skipped++;
            continue;
          }
        }
        await docRef.set({ ...template, createdAt: new Date().toISOString() });
      } else {
        console.log(`  [DRY RUN] Would write template: ${template.id}`);
      }

      console.log(`  ✓  ${template.id}: ${template.templateName}`);
      written++;
    } catch (err) {
      console.error(`  ❌ Error writing template "${template.id}": ${err.message}`);
      errors++;
    }
  }

  return { written, skipped, errors };
};
