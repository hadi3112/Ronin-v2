/**
 * IDEEditorPanel — Right-top: placeholder code editor area.
 * No Monaco. Mimics an editor chrome with line numbers + syntax-coloured skeleton rows.
 */
const STARTER_CODE = {
  Python: [
    { num: 1,  raw: 'def two_sum(nums, target):',                  tokens: [{ t: 'kw', v: 'def ' }, { t: 'fn', v: 'two_sum' }, { t: 'plain', v: '(nums, target):' }] },
    { num: 2,  raw: '    """',                                      tokens: [{ t: 'str', v: '    """' }] },
    { num: 3,  raw: '    :param nums: List[int]',                   tokens: [{ t: 'str', v: '    :param nums: List[int]' }] },
    { num: 4,  raw: '    :return: List[int]',                       tokens: [{ t: 'str', v: '    :return: List[int]' }] },
    { num: 5,  raw: '    """',                                      tokens: [{ t: 'str', v: '    """' }] },
    { num: 6,  raw: '    seen = {}',                                tokens: [{ t: 'plain', v: '    seen = {}' }] },
    { num: 7,  raw: '    for i, num in enumerate(nums):',           tokens: [{ t: 'kw', v: '    for ' }, { t: 'plain', v: 'i, num ' }, { t: 'kw', v: 'in ' }, { t: 'fn', v: 'enumerate' }, { t: 'plain', v: '(nums):' }] },
    { num: 8,  raw: '        complement = target - num',            tokens: [{ t: 'plain', v: '        complement = target - num' }] },
    { num: 9,  raw: '        if complement in seen:',               tokens: [{ t: 'kw', v: '        if ' }, { t: 'plain', v: 'complement ' }, { t: 'kw', v: 'in ' }, { t: 'plain', v: 'seen:' }] },
    { num: 10, raw: '            return [seen[complement], i]',     tokens: [{ t: 'kw', v: '            return ' }, { t: 'plain', v: '[seen[complement], i]' }] },
    { num: 11, raw: '        seen[num] = i',                        tokens: [{ t: 'plain', v: '        seen[num] = i' }] },
  ],
  'C++': [
    { num: 1,  raw: '#include <vector>',                            tokens: [{ t: 'kw', v: '#include ' }, { t: 'str', v: '<vector>' }] },
    { num: 2,  raw: '#include <unordered_map>',                     tokens: [{ t: 'kw', v: '#include ' }, { t: 'str', v: '<unordered_map>' }] },
    { num: 3,  raw: '',                                             tokens: [{ t: 'plain', v: '' }] },
    { num: 4,  raw: 'vector<int> twoSum(vector<int>& nums, int target) {', tokens: [{ t: 'kw', v: 'vector' }, { t: 'plain', v: '<int> ' }, { t: 'fn', v: 'twoSum' }, { t: 'plain', v: '(vector<int>& nums, int target) {' }] },
    { num: 5,  raw: '    unordered_map<int,int> seen;',             tokens: [{ t: 'kw', v: '    unordered_map' }, { t: 'plain', v: '<int,int> seen;' }] },
    { num: 6,  raw: '    for (int i = 0; i < nums.size(); i++) {', tokens: [{ t: 'kw', v: '    for ' }, { t: 'plain', v: '(int i = 0; i < nums.size(); i++) {' }] },
    { num: 7,  raw: '        int comp = target - nums[i];',         tokens: [{ t: 'kw', v: '        int ' }, { t: 'plain', v: 'comp = target - nums[i];' }] },
    { num: 8,  raw: '        if (seen.count(comp))',                tokens: [{ t: 'kw', v: '        if ' }, { t: 'plain', v: '(seen.count(comp))' }] },
    { num: 9,  raw: '            return {seen[comp], i};',          tokens: [{ t: 'kw', v: '            return ' }, { t: 'plain', v: '{seen[comp], i};' }] },
    { num: 10, raw: '        seen[nums[i]] = i;',                   tokens: [{ t: 'plain', v: '        seen[nums[i]] = i;' }] },
    { num: 11, raw: '    }',                                        tokens: [{ t: 'plain', v: '    }' }] },
    { num: 12, raw: '}',                                            tokens: [{ t: 'plain', v: '}' }] },
  ],
  JavaScript: [
    { num: 1,  raw: '/**',                                          tokens: [{ t: 'str', v: '/**' }] },
    { num: 2,  raw: ' * @param {number[]} nums',                    tokens: [{ t: 'str', v: ' * @param {number[]} nums' }] },
    { num: 3,  raw: ' * @param {number} target',                    tokens: [{ t: 'str', v: ' * @param {number} target' }] },
    { num: 4,  raw: ' * @return {number[]}',                        tokens: [{ t: 'str', v: ' * @return {number[]}' }] },
    { num: 5,  raw: ' */',                                          tokens: [{ t: 'str', v: ' */' }] },
    { num: 6,  raw: 'var twoSum = function(nums, target) {',        tokens: [{ t: 'kw', v: 'var ' }, { t: 'fn', v: 'twoSum' }, { t: 'plain', v: ' = ' }, { t: 'kw', v: 'function' }, { t: 'plain', v: '(nums, target) {' }] },
    { num: 7,  raw: '    const seen = new Map();',                  tokens: [{ t: 'kw', v: '    const ' }, { t: 'plain', v: 'seen = ' }, { t: 'kw', v: 'new ' }, { t: 'fn', v: 'Map' }, { t: 'plain', v: '();' }] },
    { num: 8,  raw: '    for (let i = 0; i < nums.length; i++) {', tokens: [{ t: 'kw', v: '    for ' }, { t: 'plain', v: '(let i = 0; i < nums.length; i++) {' }] },
    { num: 9,  raw: '        const comp = target - nums[i];',       tokens: [{ t: 'kw', v: '        const ' }, { t: 'plain', v: 'comp = target - nums[i];' }] },
    { num: 10, raw: '        if (seen.has(comp))',                  tokens: [{ t: 'kw', v: '        if ' }, { t: 'plain', v: '(seen.has(comp))' }] },
    { num: 11, raw: '            return [seen.get(comp), i];',      tokens: [{ t: 'kw', v: '            return ' }, { t: 'plain', v: '[seen.get(comp), i];' }] },
    { num: 12, raw: '        seen.set(nums[i], i);',                tokens: [{ t: 'plain', v: '        seen.set(nums[i], i);' }] },
    { num: 13, raw: '    }',                                        tokens: [{ t: 'plain', v: '    }' }] },
    { num: 14, raw: '};',                                           tokens: [{ t: 'plain', v: '};' }] },
  ],
}

const TOKEN_COLORS = {
  kw:    'text-blue-400',
  fn:    'text-yellow-300',
  str:   'text-emerald-400',
  plain: 'text-ronin-cream/90',
}

const EXT = { Python: 'py', 'C++': 'cpp', JavaScript: 'js' }

export default function IDEEditorPanel({ language }) {
  const lines = STARTER_CODE[language] ?? STARTER_CODE.Python
  const ext   = EXT[language] ?? 'txt'

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c0c10]">
      {/* Editor chrome toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[10px] text-ronin-muted">
          solution.{ext}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-widest text-ronin-muted">
          {language}
        </span>
      </div>

      {/* Tabs bar */}
      <div className="flex shrink-0 border-b border-white/[0.05] bg-black/20">
        <div className="flex items-center border-r border-white/[0.06] bg-[#0c0c10] px-4 py-1.5 text-[11px] text-ronin-cream">
          solution.{ext}
          <button
            type="button"
            className="ml-2.5 rounded text-ronin-muted/50 hover:text-ronin-muted"
            aria-label="Close tab"
          >
            ×
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto scrollbar-hide">
        <div className="min-w-max py-3">
          {lines.map((line) => (
            <div
              key={line.num}
              className="group flex items-start gap-0 font-mono text-[12.5px] leading-6 hover:bg-white/[0.02]"
            >
              {/* Line number gutter */}
              <span className="w-10 shrink-0 select-none pr-3 text-right text-[11px] text-white/20 group-hover:text-white/35">
                {line.num}
              </span>
              {/* Token-coloured code */}
              <span>
                {line.tokens.map((tok, i) => (
                  <span key={i} className={TOKEN_COLORS[tok.t] ?? TOKEN_COLORS.plain}>
                    {tok.v}
                  </span>
                ))}
              </span>
            </div>
          ))}

          {/* Blinking cursor line */}
          <div className="flex items-start gap-0 font-mono text-[12.5px] leading-6">
            <span className="w-10 shrink-0 select-none pr-3 text-right text-[11px] text-white/20">
              {lines.length + 1}
            </span>
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
          <span className="text-ronin-muted/50">Editor placeholder</span>
          <span className="h-1.5 w-1.5 rounded-full bg-ronin-gold/50 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
