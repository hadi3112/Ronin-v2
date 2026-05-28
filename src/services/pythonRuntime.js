import { loadPyodide } from 'pyodide';

let pyodideInstance = null;
let initPromise = null;

/**
 * Initializes the Pyodide runtime once and caches it.
 * We use the jsDelivr CDN to load the WASM files without needing complex bundler config.
 */
export async function initPythonRuntime() {
  if (pyodideInstance) return pyodideInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/',
      });
      pyodideInstance = pyodide;
      return pyodide;
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Executes a string of Python code and captures stdout/stderr.
 * Uses Python's `sys.stdout` redirection to reliably capture outputs per execution.
 */
export async function executePython(code) {
  const py = await initPythonRuntime();

  // Setup stdout and stderr redirection
  await py.runPythonAsync(`
import sys
import io
import traceback
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
  `);

  let executionError = null;

  try {
    await py.runPythonAsync(code);
  } catch (err) {
    // Capture the Python runtime error
    executionError = err.toString();
  }

  // Retrieve captured output
  const stdout = await py.runPythonAsync(`sys.stdout.getvalue()`);
  const stderr = await py.runPythonAsync(`sys.stderr.getvalue()`);

  // Restore standard streams
  await py.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
  `);

  return {
    stdout,
    stderr,
    error: executionError,
  };
}
