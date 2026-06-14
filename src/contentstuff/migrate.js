/**
 * RONIN — Master Migration Runner
 *
 * Run this ONCE to populate Firestore from local content files.
 * Never run against a production database that already has live user data.
 *
 * Prerequisites:
 *   1. npm install firebase-admin fs path
 *   2. Download your Firebase service account key from:
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *   3. Save it as serviceAccountKey.json in this directory (never commit this file)
 *   4. Set CONTENT_ROOT in config below to your local content path
 *
 * Usage:
 *   node migrate.js              — runs all seeds
 *   node migrate.js questions    — runs only the questions seed
 *   node migrate.js tracks       — runs only the tracks seed
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// ─── CONFIG ────────────────────────────────────────────────────────────────
const CONFIG = {
  // Absolute or relative path to your content/questions/python directory
  CONTENT_ROOT: "../content/questions/python",

  // Set to true to do a dry run — prints what would be written without writing
  DRY_RUN: false,

  // If true, overwrites existing Firestore documents with same ID
  OVERWRITE_EXISTING: true,
};
// ───────────────────────────────────────────────────────────────────────────

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Import seed modules in dependency order
const seedTracks = require("./scripts/seeds/tracks");
const seedModules = require("./scripts/seeds/modules");
const seedLessons = require("./scripts/seeds/lessons");
const seedQuestions = require("./scripts/seeds/questions");
const seedChallengeSets = require("./scripts/seeds/challengeSets");
const seedUiTemplates = require("./scripts/seeds/uiTemplates");

const ALL_SEEDS = {
  tracks: seedTracks,
  modules: seedModules,
  lessons: seedLessons,
  questions: seedQuestions,
  challengeSets: seedChallengeSets,
  uiTemplates: seedUiTemplates,
};

async function run() {
  const targetSeed = process.argv[2]; // optional: run single seed

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║       RONIN — Firebase Migration         ║");
  console.log("╚══════════════════════════════════════════╝\n");

  if (CONFIG.DRY_RUN) {
    console.log("⚠️  DRY RUN MODE — nothing will be written to Firestore\n");
  }

  const seedsToRun = targetSeed
    ? { [targetSeed]: ALL_SEEDS[targetSeed] }
    : ALL_SEEDS;

  if (targetSeed && !ALL_SEEDS[targetSeed]) {
    console.error(`❌ Unknown seed: "${targetSeed}"`);
    console.error(`   Available seeds: ${Object.keys(ALL_SEEDS).join(", ")}`);
    process.exit(1);
  }

  let totalWritten = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const [name, seedFn] of Object.entries(seedsToRun)) {
    console.log(`\n▶  Running seed: ${name}`);
    console.log("─".repeat(44));

    try {
      const result = await seedFn(db, CONFIG);
      totalWritten += result.written || 0;
      totalSkipped += result.skipped || 0;
      totalErrors += result.errors || 0;

      console.log(
        `✓  ${name}: ${result.written} written, ${result.skipped} skipped, ${result.errors} errors`
      );
    } catch (err) {
      totalErrors++;
      console.error(`❌ Seed "${name}" failed with error:`);
      console.error(`   ${err.message}`);
      if (err.stack) console.error(err.stack);
    }
  }

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║              Migration Complete          ║");
  console.log(`║  Written:  ${String(totalWritten).padEnd(30)}║`);
  console.log(`║  Skipped:  ${String(totalSkipped).padEnd(30)}║`);
  console.log(`║  Errors:   ${String(totalErrors).padEnd(30)}║`);
  console.log("╚══════════════════════════════════════════╝\n");

  if (totalErrors > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
