# Android Adaptation Layer: Ronin-v2 Mobile System

This document provides a detailed breakdown of the native mobile adaptations, WebView bridges, custom touch controls, and offline loading configurations enabling Ronin-v2 to run inside Android WebView containers using the Expo shell.

---

## 1. Native Immersive System Navigation

To maximize landscape viewports and prevent mobile system controls from blocking interactive scrolling regions in the code training grounds, Ronin-v2 integrates compile-time and runtime navigation hides.

### Sticky Immersive Behavior
The bottom Android hamburger and home buttons are configured to run in **sticky-immersive mode**. Under this setup, the navbar remains hidden at launch. If the user swipes from the screen edge, the navbar briefly shows for exactly 5 seconds before sliding away automatically.

* **Implementation Code** (`expo-shell/App.js`):
  ```javascript
  useEffect(() => {
    if (Platform.OS === 'android') {
      const configureNavigationBar = async () => {
        try {
          await NavigationBar.setBehaviorAsync('sticky-immersive');
          await NavigationBar.setVisibilityAsync('hidden');
        } catch (error) {
          console.warn('⚠️ NavigationBar configuration failed: ', error);
        }
      };
      configureNavigationBar();
    }
  }, []);
  ```

---

## 2. Dark Immersive Pulsating Splash Screen

To establish a premium aesthetic from the moment the user clicks the app icon, Ronin-v2 implements a native scale-pulsating splash screen directly in React Native before mounting the web view content.

### Aesthetic Specifications:
* **Background**: Pitch-black (`#000000`) screen.
* **Logo**: The Red Ronin Brand Icon (`assets/icon.png`) is centered and wrapped in a premium dark container (`#121214`) to hide the gray background of the source PNG.
* **Animations**:
  * Scale animation loops continuously, pulsing between `0.95x` and `1.05x` every 1100ms.
  * Once the WebView triggers `onLoadEnd` (meaning Vite resources have successfully initialized), the splash overlay fades out smoothly over 500ms before unmounting.
* **Android Shadow Compatibility**: Uses both physical shadow styles and native elevation properties:
  ```javascript
  logoContainer: {
    backgroundColor: '#121214',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  }
  ```

---

## 3. Touch Propagation & Mobile Scroll Fixes

Standard Phaser configurations capture both touch and pointer events to register drag sessions. Inside scrollable web views, this completely freezes vertical scroll commands. Ronin-v2 solves this by isolating mouse/touch input captures.

* **Phaser Configurations**: Setting both mouse and touch input `capture: false` ensures Phaser lets touch events bubble up to the surrounding container:
  ```javascript
  const game = new Phaser.Game({
    // ...
    input: {
      touch: { capture: false },
      mouse: { capture: false }
    }
  });
  ```
* **CSS Scroll Enforcements**: The main Phaser viewport container has standard CSS enforcements to ensure natural drag actions behave correctly:
  ```css
  div[ref="containerRef"] {
    touch-action: pan-y;
  }
  ```

---

## 4. Local File Origin & ESM WebView Compatibility

Android's default security model blocks standard ES module loading (`type="module"`) over local file schemes (`file:///android_asset/www/index.html`) due to cross-origin resource sharing restrictions. 

To bridge Vite's compiled resources to local native loading formats, Ronin-v2 uses a custom pre-bundler compiler called `copy-assets.js`:

```
+------------------+     npm run build      +---------------------+
| Vite Source Code | ---------------------> | dist/ (Standard ESM)|
+------------------+                        +----------+----------+
                                                       |
                                                       | Runs copy-assets.js
                                                       v
+------------------+                        +---------------------+
| expo-shell www/  | <--------------------- | Strips type="module"|
| (Offline Ready)  |     Local caching      | and import.meta.url |
+------------------+                        +---------------------+
```

### Transforming Tasks:
1. **Module Stripping**: Replaces `type="module" crossorigin` with standard `defer` scripts, removing the ESM load requirement.
2. **Metadata Safe-Guards**: Replaces standard `import.meta.url` instances with stubbed JSON configurations `({url:""})` to avoid JavaScript runtime crash errors on older WebView APIs.

---

## 5. Offline Data Synchronization

To ensure continuous sandbox training offline, Ronin-v2 establishes a local synchronization caching pipeline:

```
[User Submissions] ──> [LocalStorage Stubs] ──> [If Online] ──> [Firestore Database Sync]
                                                   │
                                                   └──> [If Offline] ──> [Persist & Sync on reconnect]
```

* **Offline Capabilities**: Sets `FORCE_OFFLINE_STANDALONE = true` in `expo-shell/App.js` to bypass external dev-server checks. 
* **Auth Bridging**: The standard auth flows fallback securely to anonymous stubs `anon_xxxx` to allow sandboxed problem-solving without requiring remote authentication handshake roundtrips.
