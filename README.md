# Ronin-v2

**Gamified Coding for GenZ** — A boss-battle learning platform where players fight through algorithm and data structure challenges, powered by an adaptive AI agent that tailors difficulty in real-time.

---

## Table of Contents

- [Running Locally (Web Browser)](#running-locally-web-browser)
- [Running on Android (Expo Go)](#running-on-android-expo-go)
- [Antigravity Agent Architecture](#antigravity-agent-architecture)
- [Solution Design & Architecture Overview](#solution-design--architecture-overview)
- [What's Next](#whats-next)

---

## Running Locally (Web Browser)

The web app is built with **Vite + React 19 + Tailwind CSS 4** and uses **Phaser 3** for interactive game canvases.

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/your-username/Ronin-v2.git
cd Ronin-v2

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Running on Android (Expo Go)

The `expo-shell/` folder contains a React Native wrapper that loads the Vite web app inside a WebView. This allows the same codebase to run natively on Android via **Expo Go**.

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app installed on your Android device (from Play Store)
- **Your PC and mobile device must be on the same WiFi network**

### Step 1: Start the Vite Dev Server

First, start the web development server on your machine:

```bash
# From the project root
npm run dev
```

This runs on `http://localhost:5173` by default.

### Step 2: Find Your Machine's Local IP Address

Open a terminal and run:

```bash
# Windows (PowerShell or CMD)
ipconfig
```

Look for **IPv4 Address** under your active network adapter (usually `192.168.x.x` or `10.x.x.x`).

### Step 3: Update the Dev Server URL in `App.js`

Open `expo-shell/App.js` and update the `DEV_SERVER_URL` constant to your machine's IP:

```javascript
// Change this line to match your machine's local IP address
const DEV_SERVER_URL = 'http://192.168.1.100:5173';  // Example IP
```

### Step 4: Start Expo

```bash
# Navigate to the expo-shell folder
cd expo-shell

# Install Expo dependencies (first time only)
npm install

# Start Expo development server
npx expo start
```

Scan the QR code with the Expo Go app on your Android device.

### Troubleshooting: App Not Loading on Android

If the app doesn't load or shows a blank screen:

**1. Clear Expo Cache and Restart Metro Bundler:**

```bash
# Stop any running Expo processes (Ctrl+C), then:
npx expo start --clear
```

**2. Full Cache Clear (Nuclear Option):**

```bash
# Clear all caches
npm cache clean --force
rm -rf node_modules/.cache
rm -rf .expo

# Reinstall and restart
npm install
npx expo start --clear
```

**3. Verify Network Connection:**
- Ensure your phone and PC are on the **same WiFi network**
- Check that your firewall isn't blocking port `5173` (Vite) or `8081` (Metro)
- Try accessing `http://YOUR_IP:5173` from your phone's browser first

**4. Check IP Address:**

```bash
# Windows - find your IPv4 address
ipconfig | findstr /i "IPv4"

# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Update `DEV_SERVER_URL` in `expo-shell/App.js` with the correct IP.

---

## Antigravity Agent Architecture

The **Antigravity Agent** is the core AI system that powers adaptive gameplay in Ronin. It acts as:

- **Difficulty Scaler** — Adjusts puzzle complexity based on player performance
- **Question Selector** — Weighted random selection favoring weak areas
- **Referee** — Validates answers and tracks streaks
- **Reward Controller** — Calculates XP with bonuses for speed, difficulty, and streaks
- **Progression Engine** — Dynamically expands sessions for high performers

### Core Modules

| Module | Purpose |
|--------|---------|
| `AntigravityAgent.js` | Main orchestrator — ties all subsystems together |
| `PlayerProfile.js` | Runtime player state: accuracy per category, streaks, weights |
| `DifficultyEngine.js` | Adaptive scaling for puzzles (Linked List nodes, DFS depth/branching, Ring Buffer size) |
| `XPSystem.js` | XP calculation with streak multipliers, speed bonuses, difficulty bonuses |
| `ReasoningTrace.js` | Transparent AI logging — shows WHY the agent made each decision |
| `AdaptiveQuestionEngine.js` | Session builder with weighted sampling and puzzle caps |

### How the Agent Adapts

1. **Performance Tracking**: Every answer updates category-specific accuracy and recent trend (improving/declining/stable)

2. **Weight Adjustment**: Categories where the player struggles get higher selection weights (appear more often)

3. **Difficulty Scaling**: Puzzle parameters scale based on mastery:
   - **Linked List**: 2–8 nodes
   - **DFS Tree**: Depth 2–5, Branching 2–4
   - **Ring Buffer**: 4–10 slots

4. **Session Expansion**: Score 8+ correct in first 10 questions? The agent rewards you with 2–5 bonus questions

5. **Reasoning Transparency**: Every decision is logged with human-readable explanations displayed in the `AgentReasoningPanel`

### Example Agent Reasoning Output

```
🎯 Selected stacktrace question. Current weights: linked_list: 1.45, stacktrace: 1.20, conceptual: 0.85
🧠 Correct on stacktrace. Overall accuracy: 72% 📈
⚖️ Player improving on linked lists. Scaling up to 5 nodes.
✨ Correct! +156 XP (difficulty x1.15, On Fire! +15%)
```

---

## Solution Design & Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Ronin-v2 Platform                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React UI  │  │  Phaser 3   │  │   Expo Shell (Android)  │  │
│  │  Dashboard  │  │   Combat    │  │      WebView Wrapper    │  │
│  │  Questions  │  │   Sprites   │  │                         │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                     │                │
│         └────────────────┴─────────────────────┘                │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────────────────┐  │
│  │                  Antigravity Agent Layer                  │  │
│  │  ┌──────────────┬──────────────┬──────────────┐          │  │
│  │  │   Player     │  Difficulty  │    XP        │          │  │
│  │  │   Profile    │   Engine     │   System     │          │  │
│  │  └──────────────┴──────────────┴──────────────┘          │  │
│  │  ┌──────────────┬──────────────┐                          │  │
│  │  │  Reasoning   │  Adaptive    │                          │  │
│  │  │   Trace      │  Question    │                          │  │
│  │  │              │   Engine     │                          │  │
│  │  └──────────────┴──────────────┘                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────────────────┐  │
│  │                    Data & Services Layer                  │  │
│  │  ┌──────────────┬──────────────┬──────────────┐          │  │
│  │  │  Question    │  Session     │  Auth        │          │  │
│  │  │  Bank (JSON) │  Storage     │  Provider    │          │  │
│  │  └──────────────┴──────────────┴──────────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Game Engine | Phaser 3.90 |
| Routing | React Router 7 |
| Mobile | Expo 54 + React Native WebView |
| State Management | React Context + Local State |

### Question Types & Renderers

| Type | Renderer | Description |
|------|----------|-------------|
| `stacktrace` | `StacktraceMode.jsx` | Debug stack traces to find the bug |
| `code_completion` | `CodeCompletionMode.jsx` | Fill in missing code |
| `conceptual` | `ConceptualMode.jsx` | Theory & concept MCQs |
| `linked_list_memory` | `SystemPuzzles.jsx` + Phaser | Drag-and-drop linked list ordering |
| `dfs_tree` | `SystemPuzzles.jsx` + Phaser | Tap DFS post-order traversal |
| `circular_queue` | `SystemPuzzles.jsx` + Phaser | Ring buffer operations simulator |

### APIs & Services

#### Currently Implemented (Mock/Stub)

| Service | Status | Description |
|---------|--------|-------------|
| `AuthProvider` | Mock Stub | Session-based auth with `signInWithEmailPasswordStub()` |
| `CourseLoader` | Local JSON | Question banks loaded from static JSON files |
| `SessionStorage` | Browser | Player session persisted in `sessionStorage` |
| `PlayerProfile` | Runtime Only | In-memory profile (resets on reload) |

#### Planned (Firebase Integration)

| Service | Purpose |
|---------|---------|
| Firebase Auth | Real user authentication with email/password, OAuth |
| Firestore | Persistent player profiles, XP, preferences, progress |
| Cloud Functions | Server-side XP validation, anti-cheat, leaderboards |
| Analytics | Track learning patterns, question effectiveness |

### Agents Developed

1. **Antigravity Agent** — The core adaptive difficulty AI
   - Tracks per-category performance
   - Adjusts question weights dynamically
   - Scales puzzle complexity
   - Manages XP rewards with multipliers
   - Provides transparent reasoning logs

### Key Integrations

- **React ↔ Phaser**: Combat panels and puzzle canvases use Phaser scenes embedded in React components via `GameCanvas.jsx` and `GraphChallengeCanvas.jsx`
- **Antigravity ↔ UI**: `AntigravityContext` provides global access to agent methods; `AgentToast` and `AgentReasoningPanel` display real-time feedback
- **Web ↔ Mobile**: Expo WebView loads the Vite dev server, enabling hot reload on Android

---

## What's Next

### 1. Reusable Question Primitives for New Courses

The visual puzzle components (Linked Lists, DFS Trees, Circular Queues) are designed as generic primitives that can teach multiple domains:

| Primitive | Current Use | Future Courses |
|-----------|-------------|----------------|
| **Linked List Chain** | Memory pointers | Git commit history, React component trees, DOM traversal |
| **DFS Tree Traversal** | Algorithm practice | OOP inheritance hierarchies, ML decision trees, Neural network layers |
| **Circular Queue** | Ring buffer ops | Event loops, CPU scheduling, circular dependencies |

The agent can rearrange the same visual mechanics to teach:
- **Git History** — Commits as linked nodes, branches as trees
- **React Components** — Parent-child rendering order
- **OOP Inheritance** — Class hierarchies as traversable trees
- **ML Architectures** — Layer-by-layer network traversal
- **Neural Networks** — Forward/backward pass as DFS

### 2. Premium Packages

**Standard Library** (Free):
- Core question bank
- Basic adaptive difficulty
- Standard XP progression

**Premium Packages** (Paid):
- **Curated Challenge Packs** — Expert-designed question sets targeting specific skills (e.g., "System Design Intensive", "Algorithm Mastery")
- **Custom Feed AI** — Antigravity agent tuned to personal learning goals and career targets
- **Extended Sessions** — Longer boss trials with rare legendary drops (cosmetics, titles)
- **Priority Question Updates** — Early access to new question types and course content
- **Analytics Dashboard** — Deep insights into learning patterns, weakness reports, improvement trajectories

### 3. Social Raiding System

**Raid a Friend's Profile:**
1. Browse friends' profiles on the leaderboard
2. Select a friend to "Raid" — challenge them asynchronously
3. Solve **extra-hard questions** they've set as defense challenges
4. Success? Steal **100–500 XP** from their pool

**Set Trap Questions:**
- Configure 3–5 trap questions on your profile
- When a raider fails your trap, they lose XP to you
- If they succeed, they take your XP — high risk, high reward

**Raid Timer Mechanic:**
- When raided, a "Raid Alert" appears on your dashboard
- You have **30 days** to solve the raider's counter-challenge
- Fail to respond? Lose **1000+ XP** to the raider automatically
- Creates urgency and daily engagement loops

**Raid Rewards:**
- Successful raids earn exclusive "Raider" titles and cosmetics
- Defend 10 raids? Earn "Fortress" badge
- Leaderboard tracks raid win/loss ratios

---

## Project Structure

```
Ronin-v2/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Buttons, modals, cards
│   │   ├── GameCanvas.jsx   # Phaser combat scenes
│   │   └── GraphChallengeCanvas.jsx  # Puzzle canvases
│   ├── context/             # React contexts
│   │   ├── AuthProvider.jsx
│   │   └── AntigravityContext.jsx
│   ├── features/
│   │   ├── dashboard/       # Dashboard panels
│   │   └── game/            # Game components
│   │       ├── question-renderers/  # MCQ + puzzle renderers
│   │       └── hooks/       # Game logic hooks
│   ├── game/
│   │   ├── antigravity/     # Antigravity Agent modules
│   │   ├── phaser/          # Phaser scenes
│   │   └── graphChallenge/  # Puzzle generators
│   ├── pages/               # Route pages
│   └── data/                # Mock data & question banks
├── expo-shell/              # React Native Expo wrapper
│   ├── App.js               # WebView entry point
│   └── package.json
├── package.json
└── README.md
```

---

## License

MIT License — See [LICENSE](LICENSE) for details.
