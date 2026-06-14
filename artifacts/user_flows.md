# User Flows: Web and Mobile Journeys in Ronin-v2

This document maps out the user navigation pathways, state transitions, and interactive interfaces across both platforms.

---

## 1. Web User Flow

```
[Landing / Login] ➔ [Preferences Selection] ➔ [Dashboard Hub]
                                                    │
                                                    ├─➔ [Diagnostic onboarding test]
                                                    │
                                                    └─➔ [Training Grounds sequences]
                                                              │
                                                              └─➔ [Boss Trial Challenges]
```

### Steps:
1. **Authentication**: User logs in or registers via `/login`.
2. **Onboarding Diagnostic**: If first-time user, prompts a 10-question adaptive test isolating core Python areas and Phaser system puzzles.
3. **Dashboard Page**: Displays course catalog cards, score stats, and recommendations.
4. **Training Grounds**: User solves sequential algorithmic problems (Two Sum, LinkedLists, DFS, and Circular Queue) utilizing Monaco Editor code entries or Phaser draggable block configurations.
5. **Targeted Challenges**: On completion, compiles skill vectors and loads adaptive challenges/MCQs.

---

## 2. Mobile User Flow (Android APK)

```
[App Launch] ➔ [Native Pulsating Splash Screen]
                       │
                       ▼
            [React Web App WebView]
                       │
                       ▼
        [Immersive Hidden Navigation Bar]
                       │
                       ▼
           [Tabbed Mobile Workspace]
    (Prompt Tab ➔ Editor/Blocks Tab ➔ Console Tab)
```

### Steps:
1. **Splash Screen**: Launch app to reveal black screen and scale-pulsating centered brand icon.
2. **WebView Initialization**: Native WebView loads bridged index.html locally. Once completed, the splash screen fades out.
3. **Persistent Immersive Mode**: Android system navigation bar is hid to prevent layout blockages.
4. **Mobile Workspace Layout**: Grid layout transitions to a clean, touch-responsive Tabbed Mobile Workspace, where dragging code blocks allows vertical scrolling via `pan-y` touch actions.
