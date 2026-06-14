/**
 * PURPOSE: Renders the premium 'Learn More' overlays containing highly detailed data structures and algorithms dry-runs for the 4 Training Grounds problems (Two Sum complement, Linked List 3-pointer swaps, DFS preorder tree traversal, and Circular Queue modulo arrays).
 * DEPENDENCIES: 
 *   - React (v19)
 *   - Framer Motion
 *   - Lucide Icons (X, Sparkles, HelpCircle, Layers, Link, Database, Repeat, CheckCircle)
 * USAGE CONTEXT: Connected to the sidebar test case triggers in IDETrainingPage.jsx. Displays live state calculations matched to the selected test case index.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, HelpCircle, Layers, Link as LinkIcon, Database, Repeat, CheckCircle } from 'lucide-react'

const getTestCaseLabel = (idx) => {
  if (idx === 3) return "Hidden Test Case 1"
  if (idx === 4) return "Hidden Test Case 2"
  return `Case ${idx + 1}`
}

export default function LearnMoreDialog({ isOpen, onClose, problemId, testCaseIdx, testCaseData }) {
  if (!isOpen || !testCaseData) return null

  const label = getTestCaseLabel(testCaseIdx)
  
  // Custom Visualizations for each question
  const renderVisualizer = () => {
    switch (problemId) {
      case 'two_sum':
        return renderTwoSumVisual()
      case 'linked_list_reversal':
        return renderLinkedListVisual()
      case 'dfs_traversal':
        return renderDFSVisual()
      case 'circular_queue':
        return renderCircularQueueVisual()
      default:
        return (
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-center text-xs text-ronin-muted italic">
            Visualizer not configured for this question type.
          </div>
        )
    }
  }

  // TWO SUM VISUALIZER
  const renderTwoSumVisual = () => {
    const nums = testCaseData.input?.nums || []
    const target = testCaseData.input?.target || 0
    const expected = testCaseData.expected || []

    return (
      <div className="space-y-4">
        {/* Nums array visualization */}
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-ronin-muted mb-2 font-semibold flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-ronin-gold" />
            Input Array State (nums)
          </h4>
          <div className="flex flex-wrap gap-2">
            {nums.map((val, idx) => {
              const isSelected = expected.includes(idx)
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center h-14 w-12 rounded-xl border transition-all duration-300 bg-black/40 ${
                    isSelected
                      ? 'border-ronin-gold bg-ronin-gold/10 shadow-sm shadow-ronin-gold/20 scale-105'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isSelected ? 'text-ronin-gold font-bold' : 'text-ronin-cream'}`}>
                    {val}
                  </span>
                  <span className="text-[9px] text-white/30 font-mono mt-1">i={idx}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dynamic walkthrough explanation */}
        <div className="rounded-2xl border border-white/5 bg-[#0e0a0a] p-4 text-[12px] leading-relaxed text-ronin-muted space-y-3">
          <p className="font-semibold text-ronin-cream flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-ronin-gold" />
            Complement Lookup Dry-Run
          </p>
          <div className="space-y-2 font-mono text-[11px] bg-black/30 p-3 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
            {nums.length === 1 ? (
              <div className="text-ronin-coral">
                Array length is 1. Standard Two Sum requires a pair. Returns empty array [] because no two elements can sum to target.
              </div>
            ) : (
              (() => {
                const logs = []
                const cache = {}
                let found = false
                for (let i = 0; i < nums.length; i++) {
                  const val = nums[i]
                  const complement = target - val
                  logs.push(
                    <div key={i} className="py-1 border-b border-white/5 last:border-0">
                      <span className="text-ronin-muted">Step {i+1}: </span>
                      <span className="text-ronin-cream">Check index {i} (val={val}).</span>
                      <br />
                      <span className="text-[10px] pl-4 text-white/40">
                        Complement required: {target} - {val} = <span className="text-ronin-gold font-semibold">{complement}</span>
                      </span>
                      <br />
                      {cache[complement] !== undefined ? (
                        <span className="text-emerald-400 font-bold pl-4">
                          ✓ Match found! Complement {complement} exists in cache at index {cache[complement]}. Returns [{cache[complement]}, {i}].
                        </span>
                      ) : (
                        <span className="text-ronin-muted/65 pl-4">
                          ✗ Not in cache. Save {val} with index {i} into lookup table.
                        </span>
                      )}
                    </div>
                  )
                  cache[val] = i
                  if (cache[complement] !== undefined && cache[complement] !== i) {
                    found = true
                    break
                  }
                }
                if (!found) {
                  logs.push(
                    <div key="not-found" className="text-ronin-coral font-semibold py-1">
                      ✗ End of array reached. No pair sums up to target {target}. Returns [].
                    </div>
                  )
                }
                return logs
              })()
            )}
          </div>
        </div>
      </div>
    )
  }

  // LINKED LIST VISUALIZER
  const renderLinkedListVisual = () => {
    const list = testCaseData.input?.list || []
    const expected = testCaseData.expected || []

    return (
      <div className="space-y-4">
        {/* Connection diagram */}
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-ronin-muted mb-2.5 font-semibold flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5 text-ronin-coral" />
            In-Place Node Pointers Swap
          </h4>
          
          <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col gap-5 overflow-x-auto min-w-0">
            {/* Original linked list */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Original Chain</span>
              <div className="flex items-center gap-2">
                {list.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div className="h-9 min-w-[36px] px-2.5 flex items-center justify-center rounded-lg border border-white/10 bg-black/40 text-xs font-semibold text-ronin-muted">
                      {val}
                    </div>
                    {idx < list.length - 1 && (
                      <span className="text-white/20 text-xs font-mono">➔</span>
                    )}
                  </React.Fragment>
                ))}
                {list.length > 0 && <span className="text-ronin-crimson/50 text-[10px] font-mono">None</span>}
              </div>
            </div>

            {/* Reversed linked list */}
            <div>
              <span className="text-[9px] uppercase tracking-wider text-ronin-gold block mb-1">Reversed Link Order</span>
              <div className="flex items-center gap-2">
                {expected.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div className="h-9 min-w-[36px] px-2.5 flex items-center justify-center rounded-lg border border-ronin-gold/45 bg-ronin-gold/5 text-xs font-semibold text-ronin-gold">
                      {val}
                    </div>
                    {idx < expected.length - 1 && (
                      <span className="text-ronin-gold/50 text-xs font-mono">➔</span>
                    )}
                  </React.Fragment>
                ))}
                {expected.length > 0 && <span className="text-ronin-crimson/50 text-[10px] font-mono">None</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Explain pointers */}
        <div className="rounded-2xl border border-white/5 bg-[#0e0a0a] p-4 text-[12px] leading-relaxed text-ronin-muted space-y-3">
          <p className="font-semibold text-ronin-cream flex items-center gap-1.5">
            <Repeat className="h-3.5 w-3.5 text-ronin-coral animate-spin" style={{ animationDuration: '4s' }} />
            The 3-Pointer Mechanism (In-Place)
          </p>
          <p className="text-[11.5px]">
            To reverse a singly linked list without allocating extra memory ($O(1)$ Space complexity), we track three pointers during iteration:
          </p>
          <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-xl border border-white/5 text-center text-[10px] font-mono">
            <div className="p-1 border border-white/5 rounded">
              <span className="text-ronin-gold font-bold">prev</span>
              <p className="text-white/40 mt-0.5">Trailing node</p>
            </div>
            <div className="p-1 border border-white/5 rounded">
              <span className="text-ronin-coral font-bold">curr</span>
              <p className="text-white/40 mt-0.5">Active node</p>
            </div>
            <div className="p-1 border border-white/5 rounded">
              <span className="text-emerald-400 font-bold">next_node</span>
              <p className="text-white/40 mt-0.5">Temporary buffer</p>
            </div>
          </div>
          <div className="font-mono text-[10.5px] p-2 bg-[#090506] border border-white/5 rounded-xl text-ronin-muted whitespace-pre">
{`while curr:
    next_node = curr.next # Buffer the remaining chain
    curr.next = prev      # Direct arrow BACKWARD!
    prev = curr           # Slide prev forward
    curr = next_node      # Slide curr forward`}
          </div>
        </div>
      </div>
    )
  }

  // DFS VISUALIZER
  const renderDFSVisual = () => {
    const expected = testCaseData.expected || []
    
    // Helpfully render basic binary tree depending on case
    const renderSimpleTreeGraph = () => {
      if (testCaseIdx === 0) {
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-xs">
            <div className="h-8 w-8 rounded-full border border-ronin-gold flex items-center justify-center text-ronin-gold font-bold bg-ronin-gold/10">1</div>
            <div className="flex gap-12 mt-2">
              <span className="text-white/20">/</span>
              <span className="text-white/20">\</span>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-ronin-cream font-bold">2</div>
                <div className="flex gap-4 mt-2">
                  <span className="text-white/20">/</span>
                  <span className="text-white/20">\</span>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-ronin-cream">4</div>
                  <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-ronin-cream">5</div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-ronin-cream">3</div>
              </div>
            </div>
          </div>
        )
      } else if (testCaseIdx === 1) {
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-xs">
            <div className="h-8 w-8 rounded-full border border-ronin-gold flex items-center justify-center text-ronin-gold font-bold bg-ronin-gold/10">1</div>
            <div className="pl-6 mt-1 text-white/20">\</div>
            <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-ronin-cream font-bold">2</div>
            <div className="pl-6 mt-1 text-white/20">\</div>
            <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-ronin-cream font-bold">3</div>
          </div>
        )
      } else {
        return (
          <div className="flex items-center justify-center p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] text-ronin-muted text-center italic">
            Linear tree or single node evaluation.
          </div>
        )
      }
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-ronin-muted mb-2 font-semibold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-ronin-gold" />
            Tree Layout & Order Node Visit
          </h4>
          {renderSimpleTreeGraph()}
        </div>

        {/* Visit trace list */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-ronin-muted block mb-2">Preorder Traversal Output Path</span>
          <div className="flex items-center gap-2 overflow-x-auto p-3 bg-black/50 border border-white/5 rounded-xl font-mono text-xs">
            {expected.map((v, i) => (
              <React.Fragment key={i}>
                <div className="h-8 w-8 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  {v}
                </div>
                {i < expected.length - 1 && <span className="text-white/25">➔</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e0a0a] p-4 text-[12px] leading-relaxed text-ronin-muted space-y-2">
          <p className="font-semibold text-ronin-cream flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            DFS Preorder Traversal Logic
          </p>
          <p className="text-[11.5px]">
            Depth First Search (DFS) Preorder follows the strict rule: <strong className="text-ronin-gold font-semibold">Root ➔ Left child ➔ Right child</strong>.
            The recursive stack drives deep to the left child nodes before winding back to traverse right branches.
          </p>
        </div>
      </div>
    )
  }

  // CIRCULAR QUEUE VISUALIZER
  const renderCircularQueueVisual = () => {
    const capacity = testCaseData.input?.capacity || 0
    const ops = testCaseData.input?.operations || []
    
    // Simulate circular queue properties
    let buffer = Array(capacity).fill(null)
    let head = 0
    let tail = 0
    let size = 0
    const trace = []

    ops.forEach((op, opIdx) => {
      const parts = op.split(' ')
      const command = parts[0]
      if (command === 'enqueue') {
        const val = parseInt(parts[1], 10)
        let success = false
        let explain = ''
        if (size < capacity) {
          buffer[tail] = val
          explain = `Enqueued ${val} at index ${tail}.`
          tail = (tail + 1) % capacity
          size++
          success = true
        } else {
          explain = `Failed to enqueue ${val}. Queue capacity reached (FULL).`
        }
        trace.push({ op, success, explain, head, tail, buffer: [...buffer], size })
      } else if (command === 'dequeue') {
        let val = null
        let explain = ''
        if (size > 0) {
          val = buffer[head]
          buffer[head] = null
          explain = `Dequeued value ${val} from index ${head}.`
          head = (head + 1) % capacity
          size--
        } else {
          explain = `Failed to dequeue. Queue is empty.`
        }
        trace.push({ op, result: val, explain, head, tail, buffer: [...buffer], size })
      }
    })

    return (
      <div className="space-y-4">
        {/* Buffers representation */}
        <div>
          <h4 className="text-[11px] uppercase tracking-wider text-ronin-muted mb-2 font-semibold flex items-center gap-1.5">
            <Repeat className="h-3.5 w-3.5 text-ronin-gold" />
            Modulo Array Wrap-Around Visualization
          </h4>

          {/* Current Queue Array representation */}
          <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-3 justify-center">
              {buffer.map((val, idx) => {
                const isHead = idx === head
                const isTail = idx === tail
                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <div className={`h-12 w-12 rounded-xl border flex items-center justify-center text-xs font-semibold font-mono ${
                      val !== null 
                        ? 'border-ronin-gold/55 bg-ronin-gold/10 text-ronin-gold' 
                        : 'border-white/5 bg-black/20 text-white/20'
                    }`}>
                      {val === null ? '-' : val}
                    </div>
                    <span className="text-[8px] text-white/30 font-mono mt-1">idx={idx}</span>
                    
                    {/* Head/Tail indicator label tags */}
                    <div className="absolute -top-6 flex flex-col gap-0.5 items-center">
                      {isHead && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[7px] font-bold uppercase tracking-widest px-1 rounded">H</span>
                      )}
                      {isTail && (
                        <span className="bg-ronin-coral/10 text-ronin-coral border border-ronin-crimson/25 text-[7px] font-bold uppercase tracking-widest px-1 rounded">T</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-center gap-6 text-[10px] font-mono text-ronin-muted">
              <span>H = Head pointer</span>
              <span>T = Tail pointer</span>
              <span className="text-ronin-gold">Size = {size} / {capacity}</span>
            </div>
          </div>
        </div>

        {/* Operations sequence trail list */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-ronin-muted block mb-2">Step-by-Step Operations Log</span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[10.5px] bg-black/50 p-3 rounded-xl border border-white/5">
            {trace.map((t, idx) => (
              <div key={idx} className="py-1 border-b border-white/5 last:border-0">
                <span className="text-ronin-gold font-semibold">{t.op}</span>
                <span className="text-white/30 mx-2">➔</span>
                <span className="text-ronin-cream">{t.explain}</span>
                <br />
                <span className="text-[9px] text-ronin-muted pl-4">
                  Indices: Head={t.head}, Tail={t.tail} | Array: [{t.buffer.map(b => b === null ? '-' : b).join(', ')}]
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e0a0a] p-4 text-[12px] leading-relaxed text-ronin-muted">
          <p className="font-semibold text-ronin-cream mb-1 flex items-center gap-1.5">
            <Repeat className="h-3.5 w-3.5 text-ronin-gold animate-spin" style={{ animationDuration: '6s' }} />
            Wrap-Around Formula
          </p>
          <p className="text-[11.5px]">
            Circular Queue tracks two indexes: <strong className="text-emerald-400 font-semibold font-mono">head</strong> for dequeue and <strong className="text-ronin-coral font-semibold font-mono">tail</strong> for enqueue.
            Pointers wrap around via modulo math: <span className="font-mono text-ronin-gold text-xs">tail = (tail + 1) % capacity</span>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-ronin-gold/25 bg-[#0a0506] p-6 shadow-2xl shadow-ronin-red max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ronin-gold/10 text-ronin-gold">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ronin-cream">
                Technical Analysis Detail
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-ronin-muted font-semibold">
                {label} explanation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar min-h-0">
          {/* Custom Visualization */}
          {renderVisualizer()}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/5 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-black/40 px-5 py-2 text-xs font-semibold text-ronin-cream hover:bg-white/5 transition-colors"
          >
            Close Detail
          </button>
        </div>
      </motion.div>
    </div>
  )
}
