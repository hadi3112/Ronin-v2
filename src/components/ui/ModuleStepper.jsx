import { Check } from 'lucide-react'

export default function ModuleStepper({ currentModule = 1, totalModules = 6 }) {
  const steps = Array.from({ length: totalModules }, (_, i) => i + 1)
  
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto py-8 mb-6">
      {steps.map((step, index) => {
        const isCompleted = step < currentModule
        const isCurrent = step === currentModule
        
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="relative flex flex-col items-center">
              <div 
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 ${
                  isCompleted 
                    ? 'bg-ronin-crimson border-ronin-crimson text-white shadow-[0_0_15px_rgba(243,50,50,0.6)]' 
                    : isCurrent 
                    ? 'bg-ronin-dark border-ronin-crimson text-ronin-crimson shadow-[0_0_10px_rgba(243,50,50,0.4)]'
                    : 'bg-black/40 border-white/20 text-white/40'
                }`}
              >
                {isCompleted ? <Check className="h-6 w-6 font-bold" /> : <span className="font-bold text-lg">{step}</span>}
              </div>
              <span className={`absolute top-14 text-xs font-medium whitespace-nowrap ${
                isCompleted || isCurrent ? 'text-ronin-cream' : 'text-white/40'
              }`}>
                Module {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1.5 mx-3 rounded-full overflow-hidden bg-white/10 relative">
                 <div className={`absolute left-0 top-0 bottom-0 transition-all duration-500 bg-ronin-crimson shadow-[0_0_8px_rgba(243,50,50,0.6)] ${
                   isCompleted ? 'w-full' : 'w-0'
                 }`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
