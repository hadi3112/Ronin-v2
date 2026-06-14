# Monaco Editor Integration: Ronin-v2

This document details the configuration, event bindings, and execution flow of the Monaco Editor integration in the Ronin-v2 codebase.

---

## 1. Setup & Configuration

The editor is integrated using `@monaco-editor/react` inside [IDEEditorPanel.jsx](file:///c:/Users/hadim/VS%20Projects/React%20projects/Ronin-v2/src/features/training/IDEEditorPanel.jsx) and wraps Monaco configurations:

* **Language**: Configured to `'python'` out-of-the-box.
* **Theme**: Configured to `'vs-dark'` for high contrast dark-mode styling.
* **Options**:
  ```javascript
  const EDITOR_OPTIONS = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    wordWrap: 'on',
    automaticLayout: true,
  }
  ```

---

## 2. Dynamic Code Execution Flow

The code is managed in the parent state (`code`) and compiled/run locally inside Pyodide (Wasm):

```
+------------------+                   +--------------------+
|  Monaco Editor   |                   |  Assertion Suite   |
|  (User edits)    |                   |  (Local test runs) |
+--------+---------+                   +---------+----------+
         |                                       |
         | Code text                             | Assertions script
         +-------------------+-------------------+
                             |
                             v
               +---------------------------+
               |    runPythonCode()        |
               | (Executes in Pyodide Wasm)|
               +-------------+-------------+
                             |
                             v
               +---------------------------+
               |      IDEConsolePanel      |
               | (Stdout / Mismatch errors)|
               +---------------------------+
```

1. **State Update**: Any keystroke in the editor calls the React state setter `onChange={setCode}`.
2. **Compilation**: When "Run" or "Submit" is clicked, `IDETrainingPage.jsx` fetches the active Pyodide runner.
3. **Execution**: The compiler merges the user's code with the active challenge tests (defined in `tests.json`) and runs `runPythonCode()`.
4. **Output Binding**: Returns test logs (`ALL TESTS PASSED`) or syntax/assertion failures, binding them directly to the console panels.
