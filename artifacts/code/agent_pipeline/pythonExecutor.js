/**
 * PURPOSE: Wrapper around the active Pyodide WASM runtime. Standardizes the execution interface, combines stderrs, captures stdout, and evaluates script state completion.
 * DEPENDENCIES: 
 *   - services/pythonRuntime.js (executePython)
 * USAGE CONTEXT: Mounted inside IDETrainingPage.jsx and challenge pages. Executes users' code merged with the active challenge tests.
 */

import { executePython } from '../agent_pipeline/pythonRuntime.js';

export async function runPythonCode(code, tests = []) {
  // 1. Run the user code using our Pyodide wrapper
  const result = await executePython(code);

  // 2. Format the response
  // We combine stderr and runtime errors into a single 'errors' string for simplicity right now.
  let errors = '';
  if (result.error) errors += result.error + '\n';
  if (result.stderr) errors += result.stderr;

  return {
    stdout: result.stdout || '',
    errors: errors.trim(),
    results: [], // To be populated when we implement real test injection
    passed: !errors // If there are no errors, we consider it passed for now
  };
}
