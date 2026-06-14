import { ArrowRight } from 'lucide-react'
import NeonButton from '../../../components/ui/NeonButton.jsx'
import ModuleStepper from '../../../components/ui/ModuleStepper.jsx'
import { useNavigate } from 'react-router-dom'

export default function OnboardingCompleteView() {
  const navigate = useNavigate()
  
  // Mocked for Sprint 4 (Layer 3 orchestrator will provide this eventually)
  const nextActionCards = [
    {
      id: 'next-module',
      title: 'Continue Module 1',
      description: 'You are currently on Module 1: What is a Program.',
      buttonText: 'Resume Module',
      actionUrl: '/dashboard/paths',
      reasoning: "Let's finish the basics before we tackle the Training Grounds again.",
      color: 'crimson'
    },
    {
      id: 'train-weakness',
      title: 'Train: Loops',
      description: 'Your loop logic could use some practice.',
      buttonText: 'Start Session',
      actionUrl: '/dashboard/training',
      reasoning: "You struggled with the while loop in the diagnostic.",
      color: 'gold'
    },
    {
      id: 'daily-challenge',
      title: 'Daily Challenge',
      description: 'Complete 3 problems in a row without hints.',
      buttonText: 'Accept Challenge',
      actionUrl: '/dashboard/challenges',
      reasoning: "Build consistency to increase your XP multiplier.",
      color: 'coral'
    }
  ]

  return (
    <div className="mx-auto max-w-5xl pt-4">
      {/* Course Progression Stepper */}
      <ModuleStepper currentModule={1} totalModules={6} />

      <h2 className="mb-6 text-2xl font-bold tracking-tight text-ronin-cream">Recommended for You</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {nextActionCards.map((card) => (
          <div key={card.id} className={`flex flex-col rounded-2xl border border-ronin-crimson/30 bg-black/40 p-6 shadow-[0_0_30px_rgba(232,37,58,0.3)] backdrop-blur-md transition-all hover:border-ronin-${card.color}/40`}>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-ronin-cream">{card.title}</h3>
              <p className="mb-4 text-sm text-ronin-muted">{card.description}</p>
              
              <div className="mb-6 rounded-lg border border-white/5 bg-black/50 p-3 text-xs">
                <span className="font-semibold text-ronin-muted">Agent Ronin:</span>{' '}
                <span className="italic text-ronin-muted/80">"{card.reasoning}"</span>
              </div>
            </div>
            
            <NeonButton 
              variant={card.color} 
              className="w-full justify-center"
              onClick={() => navigate(card.actionUrl)}
            >
              {card.buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </NeonButton>
          </div>
        ))}
      </div>
    </div>
  )
}
