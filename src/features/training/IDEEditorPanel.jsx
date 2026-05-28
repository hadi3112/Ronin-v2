import { lazy, Suspense } from 'react'

/**
 * IDEEditorPanel — Right-top panel.
 *
 * Python  → real Monaco Editor (web-only, @monaco-editor/react)
 * C++, JS → syntax-coloured skeleton (Monaco integration planned)
 *
 * The MonacoEditorWrapper is lazily imported so it is never bundled
 * for the Android/Expo shell build path.
 */

// Lazy-load Monaco so it is code-split away from the initial bundle
const MonacoEditorWrapper = lazy(() => import('./MonacoEditorWrapper.jsx'))

// ── Python default code (shown in Monaco) ──────────────────────────
export const PYTHON_DEFAULT = `def solution():
    # /*
    #  * Write your code here
    #  */
    print("Hello from Ronin Training Grounds 🐍")
    pass

# The line below will run your code once you Click the Run button
solution()
`

// ── Skeleton data for C++ / JS (placeholder) ──────────────────────
const SKELETON_LINES = {
  'C++': [
    { num: 1,  tokens: [{ t: 'kw', v: '#include ' }, { t: 'str', v: '<vector>' }] },
    { num: 2,  tokens: [{ t: 'kw', v: '#include ' }, { t: 'str', v: '<unordered_map>' }] },
    { num: 3,  tokens: [{ t: 'plain', v: '' }] },
    { num: 4,  tokens: [{ t: 'kw', v: 'vector' }, { t: 'plain', v: '<int> ' }, { t: 'fn', v: 'twoSum' }, { t: 'plain', v: '(vector<int>& nums, int target) {' }] },
    { num: 5,  tokens: [{ t: 'kw', v: '    unordered_map' }, { t: 'plain', v: '<int,int> seen;' }] },
    { num: 6,  tokens: [{ t: 'kw', v: '    for ' }, { t: 'plain', v: '(int i = 0; i < nums.size(); i++) {' }] },
    { num: 7,  tokens: [{ t: 'kw', v: '        int ' }, { t: 'plain', v: 'comp = target - nums[i];' }] },
    { num: 8,  tokens: [{ t: 'kw', v: '        if ' }, { t: 'plain', v: '(seen.count(comp)) return {seen[comp], i};' }] },
    { num: 9,  tokens: [{ t: 'plain', v: '        seen[nums[i]] = i;' }] },
    { num: 10, tokens: [{ t: 'plain', v: '    }' }] },
    { num: 11, tokens: [{ t: 'plain', v: '}' }] },
  ],
  JavaScript: [
    { num: 1,  tokens: [{ t: 'str', v: '/** @param {number[]} nums  @return {number[]} */' }] },
    { num: 2,  tokens: [{ t: 'kw', v: 'var ' }, { t: 'fn', v: 'twoSum' }, { t: 'plain', v: ' = function(nums, target) {' }] },
    { num: 3,  tokens: [{ t: 'kw', v: '    const ' }, { t: 'plain', v: 'seen = ' }, { t: 'kw', v: 'new ' }, { t: 'fn', v: 'Map' }, { t: 'plain', v: '();' }] },
    { num: 4,  tokens: [{ t: 'kw', v: '    for ' }, { t: 'plain', v: '(let i = 0; i < nums.length; i++) {' }] },
    { num: 5,  tokens: [{ t: 'kw', v: '        const ' }, { t: 'plain', v: 'comp = target - nums[i];' }] },
    { num: 6,  tokens: [{ t: 'kw', v: '        if ' }, { t: 'plain', v: '(seen.has(comp)) return [seen.get(comp), i];' }] },
    { num: 7,  tokens: [{ t: 'plain', v: '        seen.set(nums[i], i);' }] },
    { num: 8,  tokens: [{ t: 'plain', v: '    }' }] },
    { num: 9,  tokens: [{ t: 'plain', v: '};' }] },
  ],
}

const TOKEN_COLORS = {
  kw:    'text-blue-400',
  fn:    'text-yellow-300',
  str:   'text-emerald-400/90',
  plain: 'text-ronin-cream/85',
}

const EXT = { Python: 'py', 'C++': 'cpp', JavaScript: 'js' }
const MONACO_LANG = { Python: 'python', 'C++': 'cpp', JavaScript: 'javascript' }

// ── Skeleton code display (non-Python) ─────────────────────────────
function SkeletonEditor({ language }) {
  const lines = SKELETON_LINES[language] ?? []
  const ext = EXT[language] ?? 'txt'

  return (
    <>
      {/* Tabs bar */}
      <div className="flex shrink-0 border-b border-white/[0.05] bg-black/20">
        <div className="flex items-center border-r border-white/[0.06] bg-[#0c0c10] px-4 py-1.5 text-[11px] text-ronin-cream">
          solution.{ext}
          <button type="button" className="ml-2.5 rounded text-ronin-muted/50 hover:text-ronin-muted" aria-label="Close tab">×</button>
        </div>
      </div>

      {/* Code rows */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto scrollbar-hide">
        <div className="min-w-max py-3">
          {lines.map((line) => (
            <div key={line.num} className="group flex items-start font-mono text-[12.5px] leading-6 hover:bg-white/[0.02]">
              <span className="w-10 shrink-0 select-none pr-3 text-right text-[11px] text-white/20 group-hover:text-white/35">
                {line.num}
              </span>
              <span>
                {line.tokens.map((tok, i) => (
                  <span key={i} className={TOKEN_COLORS[tok.t] ?? TOKEN_COLORS.plain}>{tok.v}</span>
                ))}
              </span>
            </div>
          ))}
          {/* Blinking cursor */}
          <div className="flex items-start font-mono text-[12.5px] leading-6">
            <span className="w-10 shrink-0 select-none pr-3 text-right text-[11px] text-white/20">{lines.length + 1}</span>
            <span className="inline-block h-4 w-0.5 animate-pulse bg-ronin-coral/80" />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.05] bg-black/30 px-4 py-1">
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          <span>Ln {lines.length + 1}, Col 1</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-ronin-muted/40">Monaco coming soon for {language}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-ronin-gold/40 animate-pulse" />
        </div>
      </div>
    </>
  )
}

// ── Main export ─────────────────────────────────────────────────────
export default function IDEEditorPanel({ language, code, onChange }) {
  const ext = EXT[language] ?? 'txt'
  const isPython = language === 'Python'

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c0c10]">
      {/* Shared editor chrome toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[10px] text-ronin-muted">solution.{ext}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-widest text-ronin-muted">
            {language}
          </span>
        </div>
      </div>

      {/* ── Python → real Monaco; others → skeleton ── */}
      {isPython ? (
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center gap-3 bg-[#1e1e1e]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-blue-400/80" />
              <p className="font-mono text-[11px] text-white/30">Loading Monaco…</p>
            </div>
          }
        >
          <MonacoEditorWrapper
            language={MONACO_LANG[language]}
            value={code}
            onChange={onChange}
          />
        </Suspense>
      ) : (
        <SkeletonEditor language={language} />
      )}
    </div>
  )
}
