import { Target, Trophy, Swords } from 'lucide-react'
import NeonButton from '../../../components/ui/NeonButton.jsx'
import { useNavigate } from 'react-router-dom'

export default function TargetedChallengesPendingView({ skills = {} }) {
  const navigate = useNavigate()
  
  const domains = [
    { id: 'output', label: 'Output', score: skills.output || 0.4 },
    { id: 'variables', label: 'Variables', score: skills.variables || 0.6 },
    { id: 'math', label: 'Math', score: skills.math || 0.8 },
    { id: 'input', label: 'Input', score: skills.input || 0.3 },
    { id: 'conditionals', label: 'Conditionals', score: skills.conditionals || 0.5 },
    { id: 'loops', label: 'Loops', score: skills.loops || 0.2 },
  ]

  return (
    <div className="mx-auto max-w-4xl pt-6">
      <div className="mb-8 rounded-2xl border border-ronin-coral/30 bg-black/40 p-8 shadow-[0_0_30px_rgba(232,37,58,0.3)] backdrop-blur-md">
        <h2 className="mb-6 text-2xl font-bold text-ronin-cream">Your Skill Profile</h2>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
          {domains.map(d => (
            <div key={d.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-ronin-cream">{d.label}</span>
                <span className="text-ronin-muted">{Math.round(d.score * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-ronin-coral to-ronin-gold" 
                  style={{ width: `${d.score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div>
            <h3 className="font-semibold text-ronin-cream">Ready to test yourself?</h3>
            <p className="text-sm text-ronin-muted">Jump into a targeted challenge set based on your weaknesses.</p>
          </div>
          <NeonButton variant="coral" onClick={() => navigate('/dashboard/challenges')}>
            <Target className="mr-2 h-4 w-4" />
            Start Challenges
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div 
          onClick={() => navigate('/dashboard/scoreboard')}
          className="cursor-pointer rounded-xl border border-white/10 bg-black/30 p-6 transition-all hover:bg-white/5 hover:border-ronin-gold/40"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ronin-cream">Scoreboard</h3>
            <Trophy className="h-5 w-5 text-ronin-gold" />
          </div>
          <p className="text-sm text-ronin-muted">See how you rank against other Ronin.</p>
        </div>

        <div 
          onClick={() => navigate('/dashboard/training')}
          className="cursor-pointer rounded-xl border border-white/10 bg-black/30 p-6 transition-all hover:bg-white/5 hover:border-ronin-crimson/40"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ronin-cream">Training Grounds</h3>
            <Swords className="h-5 w-5 text-ronin-crimson" />
          </div>
          <p className="text-sm text-ronin-muted">Practice more problems to hone your skills.</p>
        </div>
      </div>
    </div>
  )
}
