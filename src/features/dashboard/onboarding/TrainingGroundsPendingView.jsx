import { Swords, Lock } from 'lucide-react'
import NeonButton from '../../../components/ui/NeonButton.jsx'

export default function TrainingGroundsPendingView({ onGoToTraining, diagnosticResult }) {
  // Mock fallback if no real result is available yet
  const interpretation = diagnosticResult?.agentInterpretation || "You have a solid grasp of basic logic, but need practice with variables and loops. Let's start building that muscle."
  
  return (
    <div className="mx-auto max-w-4xl pt-6">
      <div className="mb-8 rounded-2xl border border-ronin-crimson/30 bg-black/40 p-8 shadow-[0_0_30px_rgba(232,37,58,0.3)] backdrop-blur-md">
        <h2 className="mb-2 text-2xl font-bold text-ronin-cream">Diagnostic Complete</h2>
        <div className="mb-6 rounded-lg border border-white/5 bg-black/50 p-4">
          <p className="text-ronin-muted">
            <span className="font-semibold text-ronin-coral">Agent Ronin:</span> "{interpretation}"
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-ronin-muted">
            Your first mission awaits in the Training Grounds.
          </p>
          <NeonButton variant="crimson" onClick={onGoToTraining}>
            <Swords className="mr-2 h-4 w-4" />
            Go to Training Grounds
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-black/20 p-6 opacity-50 grayscale transition-all hover:grayscale-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ronin-cream">Scoreboard</h3>
            <Lock className="h-5 w-5 text-ronin-muted" />
          </div>
          <p className="text-sm text-ronin-muted">Unlocks after your first session.</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-black/20 p-6 opacity-50 grayscale transition-all hover:grayscale-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ronin-cream">Challenges</h3>
            <Lock className="h-5 w-5 text-ronin-muted" />
          </div>
          <p className="text-sm text-ronin-muted">Unlocks after your first session.</p>
        </div>
      </div>
    </div>
  )
}
