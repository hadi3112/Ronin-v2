# Normalized Implementation Plans: Ronin-v2

This document normalizes all implemented and planned features for the Ronin-v2 web and mobile workspaces.

---

## 1. Feature: Onboarding Diagnostic Puzzles
* **Objective**: Force the inclusion of three interactive Phaser system puzzles in the user's initial onboarding diagnostic test, bypassing standard progress rules.
* **Steps**:
  1. Add conditional checks in `QuestionEngine.js` for users with 0 completed problems.
  2. Inject `linked_list_memory`, `dfs_tree`, and `circular_queue` puzzles.
  3. Reduce standard code completion sample count to 2 to balance total diagnostic questions to exactly 10.
* **Status**: Completed.

---

## 2. Feature: Always-Clickable Submissions
* **Objective**: Revert disabled state constraints on the Monaco and blocks Submit button, allowing submissions at any time.
* **Steps**:
  1. Remove `isPassed` checks in `IDEBottomBar.jsx` to keep Submit button active and highlighted.
  2. Implement `showIncorrectDialog` modal in `IDETrainingPage.jsx` to capture incorrect or compile-failing submissions.
  3. Offer paths to either "Go Back" or "Start Next Challenge" to prevent blockages.
* **Status**: Completed.

---

## 3. Feature: Visual "Learn More" Detail Overlay
* **Objective**: Provide step-by-step technical and structural explanations with custom visualizers for all 4 Training Grounds problems across all 5 test cases.
* **Steps**:
  1. Create `LearnMoreDialog.jsx` presenting customized index grids for Two Sum complements, pointer swaps for Linked List Reversal, preorder trees for DFS, and circular arrays for Circular Queue.
  2. Connect the modal to the left sidebar's test cases list and the submission progress list.
* **Status**: Completed.

---

## 4. Feature: Premium Pulsating Native Splash Screen & Navigation Bar Hiding
* **Objective**: Set a dark immersive launch experience for the Android APK build, auto-hiding the navigation bar and rendering a centered logo.
* **Steps**:
  1. Edit `App.js` in `expo-shell/` to render a black screen with a scale-pulsating logo container.
  2. Fade out splash screen when the WebView finishes loading.
  3. Add `androidNavigationBar` `always-hidden` configuration in `app.json` for native compile-time immersive mode hiding.
  4. Configure `touchAction: 'pan-y'` and `capture: false` in Phaser to allow vertical scrolling in drag-and-drop screens.
* **Status**: Completed.
