import { executePython } from '../services/pythonRuntime.js';

/**
 * pythonExecutor.js
 *
 * This executor wraps Pyodide (our underlying runtime) to run the user's code,
 * capture output, and format the response.
 *
 * In future sprints, this file will also be responsible for injecting hidden 
 * assertions or test runners to validate `results`.
 */

export async function runPythonCode(code, tests = []) {
  // 1. Run the user code using our Pyodide wrapper
  const result = await executePython(code);

  // 2. Format the response
  // We combine stderr and runtime errors into a single 'errors' string for simplicity right now.
  let errors = '';
  if (result.error) errors += result.error + '\n';
  if (result.stderr) errors += result.stderr;

  // 3. Mock test results
  // We are not parsing or injecting actual python unit tests yet.
  // We'll return an empty results array for now.
  
  return {
    stdout: result.stdout || '',
    errors: errors.trim(),
    results: [], // To be populated when we implement real test injection
    passed: !errors // If there are no errors, we consider it passed for now
  };
}
