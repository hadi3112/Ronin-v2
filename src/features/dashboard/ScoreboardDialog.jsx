import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Minus, BookOpen, Target, Zap, Trophy, ChevronDown, Settings2, Clock } from 'lucide-react'
import { useAntigravity } from '../../context/AntigravityContext.jsx'
import { CATEGORY_DISPLAY_NAMES } from '../../game/antigravity/AntigravityAgent.js'
import { useAuth } from '../../hooks/useAuth.js'
import {
  readTrainingGroundsResults,
  readSkillVector,
} from '../../services/trainingGroundsService.js'

function formatTimestamp(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function CategoryCard({ name, stats, onViewTutorial }) {
  const [expanded, setExpanded] = useState(false)
  const isWeak = stats.strength === 'weak'
  const isStrong = stats.strength === 'strong'
  const accuracyPct = Math.round(stats.accuracy * 100)

  const TrendIcon = stats.trend === 'improving' ? TrendingUp : stats.trend === 'declining' ? TrendingDown : Minus
  const trendColor = stats.trend === 'improving' ? 'text-emerald-400' : stats.trend === 'declining' ? 'text-red-400' : 'text-gray-400'

  const borderColor = isStrong
    ? 'border-emerald-500/40 bg-emerald-500/5'
    : isWeak
      ? 'border-red-500/40 bg-red-500/5'
      : 'border-white/10 bg-white/5'

  const strengthBadge = isStrong
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : isWeak
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'

  const hasDetails = stats.multiplier !== 1.0 || stats.currentDifficulty || (stats.incorrectHistory?.length > 0)

  return (
    <div className={`rounded-xl border p-4 ${borderColor} transition-all`}>
      <button 
        className="w-full text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-display text-sm font-semibold text-ronin-cream">{name}</h4>
            <div className="mt-1 flex items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${strengthBadge}`}>
                {stats.strength === 'unknown' ? 'New' : stats.strength}
              </span>
              <span className="text-xs text-ronin-muted">{stats.difficultyLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            {hasDetails && (
              <ChevronDown className={`h-4 w-4 text-ronin-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
            )}
          </div>
        </div>
      </button>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-black/30 px-2 py-1.5">
          <div className="font-semibold text-emerald-400">{stats.correct}</div>
          <div className="text-ronin-muted">Correct</div>
        </div>
        <div className="rounded-lg bg-black/30 px-2 py-1.5">
          <div className="font-semibold text-red-400">{stats.incorrect}</div>
          <div className="text-ronin-muted">Wrong</div>
        </div>
        <div className="rounded-lg bg-black/30 px-2 py-1.5">
          <div className="font-semibold text-amber-400">{stats.skipped}</div>
          <div className="text-ronin-muted">Skipped</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[10px] text-ronin-muted">
          <span>Accuracy</span>
          <span className={isStrong ? 'text-emerald-400' : isWeak ? 'text-red-400' : 'text-ronin-cream'}>
            {accuracyPct}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
          <motion.div
            className={`h-full rounded-full ${isStrong ? 'bg-emerald-500' : isWeak ? 'bg-red-500' : 'bg-amber-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${accuracyPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {stats.maxStreak > 0 && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-ronin-gold">
          <Zap className="h-3 w-3" />
          Best streak: {stats.maxStreak}
        </div>
      )}

      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-ronin-muted">
                  <Settings2 className="h-3 w-3" />
                  Question Multiplier
                </span>
                <span className={`font-semibold ${stats.multiplier > 1.0 ? 'text-amber-400' : stats.multiplier < 1.0 ? 'text-cyan-400' : 'text-ronin-cream'}`}>
                  {stats.multiplier.toFixed(2)}x
                </span>
              </div>

              {stats.currentDifficulty && (
                <div className="rounded-lg bg-black/30 p-2 text-[10px]">
                  <div className="text-ronin-muted mb-1">Current Difficulty Settings</div>
                  {stats.currentDifficulty.type === 'Linked List' && (
                    <div className="text-ronin-cream">Nodes: <span className="text-amber-400">{stats.currentDifficulty.nodes}</span></div>
                  )}
                  {stats.currentDifficulty.type === 'DFS Tree' && (
                    <div className="text-ronin-cream">
                      Branching: <span className="text-amber-400">{stats.currentDifficulty.branching}</span>, 
                      Depth: <span className="text-amber-400">{stats.currentDifficulty.depth}</span>
                    </div>
                  )}
                  {stats.currentDifficulty.type === 'Ring Buffer' && (
                    <div className="text-ronin-cream">Size: <span className="text-amber-400">{stats.currentDifficulty.size}</span></div>
                  )}
                </div>
              )}

              {stats.incorrectHistory?.length > 0 && (
                <div className="rounded-lg bg-black/30 p-2 text-[10px]">
                  <div className="flex items-center gap-1 text-red-400 mb-1.5">
                    <Clock className="h-3 w-3" />
                    Recent Incorrect Answers
                  </div>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {stats.incorrectHistory.slice(-5).reverse().map((h, i) => (
                      <div key={i} className="flex justify-between text-ronin-muted">
                        <span>{formatTimestamp(h.timestamp)}</span>
                        <span>{(h.timeMs / 1000).toFixed(1)}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isWeak && stats.attempts >= 2 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onViewTutorial(name)
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20"
        >
          <BookOpen className="h-3.5 w-3.5" />
          View Tutorial
        </button>
      )}
    </div>
  )
}

function ReasoningEntry({ entry }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-black/30 px-3 py-2">
      <span className="text-lg">{entry.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs ${entry.color}`}>{entry.message}</p>
        <p className="mt-0.5 text-[10px] text-ronin-muted">{entry.time}</p>
      </div>
    </div>
  )
}

export default function ScoreboardDialog({ open, onClose, onNavigateToTutorial }) {
  const { getProfileSnapshot, getFormattedReasoning } = useAntigravity()
  const { user } = useAuth()
  const userId = user?.uid ?? 'guest'

  const [activeTab, setActiveTab] = useState('challenges') // 'challenges' | 'training_grounds'
  
  const profile = getProfileSnapshot()
  const reasoning = getFormattedReasoning(8)

  const tgResults = readTrainingGroundsResults(userId)
  const skillVector = readSkillVector(userId)

  const TG_PROBLEM_INFO = [
    { id: 'two_sum', name: 'Two Sum Array Logic', domain: 'arrays', icon: '🔢' },
    { id: 'linked_list_reversal', name: 'Reverse a Linked List', domain: 'linked_lists', icon: '🔗' },
    { id: 'dfs_traversal', name: 'Depth-First Search on a Tree', domain: 'trees', icon: '🌳' },
    { id: 'circular_queue', name: 'Build a Circular Queue', domain: 'queues', icon: '🔄' },
  ]

  const handleViewTutorial = (categoryName) => {
    onClose()
    if (onNavigateToTutorial) {
      onNavigateToTutorial(categoryName)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/98 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-ronin-muted transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close scoreboard"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-white/10 bg-gradient-to-r from-ronin-crimson/20 to-transparent px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ronin-crimson/20 text-ronin-gold">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ronin-cream">Performance Scoreboard</h2>
                  <p className="text-xs text-ronin-muted">
                    Level {profile.level.level} · {profile.totalXP.toLocaleString()} XP · {profile.sessionCount} sessions
                  </p>
                </div>
              </div>
            </div>

            {/* ── Tabs toggle ── */}
            <div className="flex border-b border-white/10 bg-black/40 px-6 py-2 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('challenges')}
                className={`pb-2 pt-1 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'challenges'
                    ? 'border-ronin-crimson text-ronin-cream'
                    : 'border-transparent text-ronin-muted hover:text-ronin-cream'
                }`}
              >
                Adaptive Challenges
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('training_grounds')}
                className={`pb-2 pt-1 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'training_grounds'
                    ? 'border-ronin-crimson text-ronin-cream'
                    : 'border-transparent text-ronin-muted hover:text-ronin-cream'
                }`}
              >
                Training Grounds
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
              {activeTab === 'challenges' ? (
                <>
                  {profile.weakAreas.length > 0 && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                      <div className="flex items-center gap-2 text-red-400">
                        <Target className="h-4 w-4" />
                        <span className="text-sm font-semibold">Areas to Improve</span>
                      </div>
                      <p className="mt-1 text-xs text-ronin-muted">
                        Focus on: {profile.weakAreas.map(c => CATEGORY_DISPLAY_NAMES[c]).join(', ')}
                      </p>
                    </div>
                  )}

                  {profile.strongAreas.length > 0 && (
                    <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold">Your Strengths</span>
                      </div>
                      <p className="mt-1 text-xs text-ronin-muted">
                        Mastered: {profile.strongAreas.map(c => CATEGORY_DISPLAY_NAMES[c]).join(', ')}
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ronin-muted">
                      Category Breakdown
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(profile.categoryStats).map(([cat, stats]) => (
                        <CategoryCard
                          key={cat}
                          name={CATEGORY_DISPLAY_NAMES[cat] || cat}
                          stats={stats}
                          onViewTutorial={handleViewTutorial}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                      <div className="font-display text-xl font-bold text-ronin-gold">{profile.maxGlobalStreak}</div>
                      <div className="text-[10px] text-ronin-muted">Best Streak</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                      <div className="font-display text-xl font-bold text-emerald-400">
                        {Object.values(profile.categoryStats).reduce((s, c) => s + c.correct, 0)}
                      </div>
                      <div className="text-[10px] text-ronin-muted">Total Correct</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                      <div className="font-display text-xl font-bold text-amber-400">
                        {Math.round(
                          (Object.values(profile.categoryStats).reduce((s, c) => s + c.correct, 0) /
                            Math.max(1, Object.values(profile.categoryStats).reduce((s, c) => s + c.attempts, 0))) * 100
                        )}%
                      </div>
                      <div className="text-[10px] text-ronin-muted">Overall Acc.</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
                      <div className="font-display text-xl font-bold text-purple-400">{profile.sessionCount}</div>
                      <div className="text-[10px] text-ronin-muted">Sessions</div>
                    </div>
                  </div>

                  {reasoning.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ronin-muted">
                        Agent Reasoning Log
                      </h3>
                      <div className="space-y-2">
                        {reasoning.map(entry => (
                          <ReasoningEntry key={entry.id} entry={entry} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Training Grounds skill vector */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ronin-muted">
                      Training Grounds Skill Vector
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(skillVector).map(([domain, val]) => {
                        const label = domain === 'arrays' ? 'Array Logic' : domain === 'linked_lists' ? 'Linked Lists' : domain === 'trees' ? 'DFS Trees' : 'Circular Queues'
                        const pct = Math.round(val * 100)
                        return (
                          <div key={domain} className="rounded-xl border border-white/10 bg-black/30 p-4">
                            <div className="flex justify-between text-xs font-semibold text-ronin-cream mb-2">
                              <span>{label}</span>
                              <span className="text-ronin-gold">{pct}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-black/40">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-ronin-crimson to-ronin-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Telemetry and progress check */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ronin-muted">
                      Telemetry & Progress
                    </h3>
                    <div className="space-y-3">
                      {TG_PROBLEM_INFO.map((prob) => {
                        const stats = tgResults[prob.id]
                        const completed = stats?.status === 'pass'

                        if (!completed) {
                          return (
                            <div
                              key={prob.id}
                              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 text-left opacity-60"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">🔒</span>
                                <div>
                                  <h4 className="font-display text-sm font-semibold text-ronin-muted">
                                    {prob.name}
                                  </h4>
                                  <span className="text-[10px] uppercase tracking-wider text-ronin-muted/50">
                                    Locked / Not Attempted
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        const minutes = Math.floor(stats.timeTakenSeconds / 60)
                        const seconds = stats.timeTakenSeconds % 60
                        const durationText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

                        return (
                          <div
                            key={prob.id}
                            className="rounded-xl border border-ronin-crimson/30 bg-ronin-crimson/5 p-4 text-left transition-all hover:bg-ronin-crimson/10"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/5 pb-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{prob.icon}</span>
                                <div>
                                  <h4 className="font-display text-sm font-semibold text-ronin-cream">
                                    {prob.name}
                                  </h4>
                                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-emerald-400">
                                    Cleared
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-ronin-muted">
                                Cleared: {new Date(stats.timestamp).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                              <div className="rounded-lg bg-black/45 p-2">
                                <div className="text-ronin-muted text-[10px]">Interface Mode</div>
                                <div className="font-bold text-ronin-cream capitalize">
                                  {stats.modeChosen === 'ide' ? '⌨️ Monaco IDE' : '🧩 Phaser Blocks'}
                                </div>
                              </div>
                              <div className="rounded-lg bg-black/45 p-2">
                                <div className="text-ronin-muted text-[10px]">Attempts & Moves</div>
                                <div className="font-bold text-ronin-cream">
                                  {stats.runAttempts} Runs {stats.modeChosen === 'blocks' ? `· ${stats.blockMovesMade} Moves` : ''}
                                </div>
                              </div>
                              <div className="rounded-lg bg-black/45 p-2">
                                <div className="text-ronin-muted text-[10px]">Hints & AI Support</div>
                                <div className="font-bold text-ronin-cream">
                                  {stats.hintsOpened} Mild / {stats.geminiHintsReceived} Gemini
                                </div>
                              </div>
                              <div className="rounded-lg bg-black/45 p-2">
                                <div className="text-ronin-muted text-[10px]">Time Spent</div>
                                <div className="font-bold text-ronin-cream">{durationText}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
