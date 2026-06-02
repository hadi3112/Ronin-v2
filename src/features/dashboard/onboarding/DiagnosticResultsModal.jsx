import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, BarChart2 } from 'lucide-react'
import NeonButton from '../../../components/ui/NeonButton.jsx'
import { DOMAIN_LABELS } from '../../../services/onboardingService.js'

/**
 * Non-dismissible results dialog shown immediately after the diagnostic session ends.
 * Displays per-domain pass/fail and routes the user to Training Grounds.
 *
 * @param {{
 *   open: boolean;
 *   results: Record<string, { correct: boolean }>;
 *   totalScore: number;
 *   totalQuestions: number;
 *   onGoToTraining: () => void;
 * }} props
 */
export default function DiagnosticResultsModal({
  open,
  results,
  totalScore,
  totalQuestions,
  onGoToTraining,
}) {
  if (!open) return null

  const domainEntries = Object.entries(DOMAIN_LABELS).filter(
    ([key]) => results && key in results,
  )

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,2,3,0.88)', backdropFilter: 'blur(10px)' }}
      role="presentation"
      // intentionally no onClick dismiss
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="diag-results-title"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0c0405] shadow-[0_0_80px_-10px_rgba(220,40,40,0.3)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ronin-gold/40 to-transparent" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(200,164,35,0.12),transparent)]" />

        <div className="relative flex flex-col gap-6 px-8 py-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ronin-gold/30 bg-ronin-gold/10">
              <BarChart2 className="h-7 w-7 text-ronin-gold" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ronin-gold">Results</p>
            <h2
              id="diag-results-title"
              className="font-display text-xl font-bold leading-snug text-ronin-cream"
            >
              Good work.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-ronin-muted">
              Based on what we just saw, here&apos;s your starting point. Now let&apos;s build
              your skills properly.{' '}
              <span className="font-semibold text-ronin-cream">Training Grounds</span> is next.
            </p>
          </div>

          {/* Score pill */}
          <div className="flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-ronin-cream">
              Score:{' '}
              <span className={totalScore >= totalQuestions / 2 ? 'text-emerald-400' : 'text-ronin-coral'}>
                {totalScore}
              </span>
              <span className="text-ronin-muted"> / {totalQuestions}</span>
            </div>
          </div>

          {/* Per-domain results */}
          {domainEntries.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-ronin-muted">
                Domain Breakdown
              </p>
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
                {domainEntries.map(([key, label], i) => {
                  const correct = results[key]?.correct ?? false
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.25 }}
                      className={[
                        'flex items-center justify-between px-4 py-3 text-sm',
                        i < domainEntries.length - 1 ? 'border-b border-white/5' : '',
                      ].join(' ')}
                    >
                      <span className="font-medium text-ronin-cream">{label}</span>
                      {correct ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-ronin-coral" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* CTA */}
          <NeonButton
            id="go-training-grounds-btn"
            variant="crimson"
            className="w-full justify-center rounded-2xl py-3 text-base"
            onClick={onGoToTraining}
          >
            Go to Training Grounds
          </NeonButton>
        </div>

        {/* Bottom accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ronin-crimson/30 to-transparent" />
      </motion.div>
    </div>
  )
}
