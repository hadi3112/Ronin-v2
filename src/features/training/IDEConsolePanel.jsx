import { Terminal } from 'lucide-react'

/**
 * IDEConsolePanel — right-bottom: console output placeholder.
 * Renders a terminal-like chrome with idle state.
 * Output will be populated when Run logic is wired.
 */
export default function IDEConsolePanel({ hasRun, runResult, isRunning, onClear }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#09090c]">
      {/* Console toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-ronin-muted" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ronin-muted">
            Console Output
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="rounded px-2 py-0.5 text-[10px] text-white/25 transition-colors hover:bg-white/5 hover:text-white/50"
          >
            Clear
          </button>
          <span
            className={`h-2 w-2 rounded-full ${hasRun ? 'bg-emerald-400' : 'bg-white/15'}`}
          />
        </div>
      </div>

      {/* Output area */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 font-mono text-[12px] scrollbar-hide">
        {isRunning ? (
          <p className="text-ronin-muted animate-pulse">{'>'} Executing code...</p>
        ) : hasRun && runResult ? (
          <div className="flex flex-col gap-2 whitespace-pre-wrap">
            {runResult.stdout && (
              <span className="text-ronin-cream">{runResult.stdout}</span>
            )}
            {runResult.errors && (
              <span className="text-ronin-crimson">{runResult.errors}</span>
            )}
            {!runResult.stdout && !runResult.errors && (
              <span className="text-white/30 italic">Process finished with no output.</span>
            )}
            <span className="text-white/20 mt-2">
              {'>'} Program exited with code {runResult.passed ? '0' : '1'}
            </span>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Terminal className="h-8 w-8 text-white/10" />
            <p className="text-[11px] text-white/20">
              Press <span className="text-ronin-coral/60">Run</span> to see output
            </p>
          </div>
        )}
      </div>

      {/* Console input row */}
      <div className="flex shrink-0 items-center gap-2 border-t border-white/[0.05] bg-black/20 px-4 py-2">
        <span className="font-mono text-[11px] text-ronin-coral/50">{'>'}</span>
        <div className="flex-1 cursor-text rounded bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-white/20">
          stdin input — available after execution is wired
        </div>
      </div>
    </div>
  )
}
