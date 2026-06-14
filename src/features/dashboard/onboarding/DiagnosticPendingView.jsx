import { Play } from 'lucide-react'
import NeonButton from '../../../components/ui/NeonButton.jsx'
import mascot from '../../../assets/mascot.png'

export default function DiagnosticPendingView({ onStartDiagnostic }) {
  return (
    <div className="flex h-full items-center justify-center pt-10">
      <div className="relative max-w-2xl w-full rounded-2xl border border-ronin-crimson/30 bg-black/40 p-10 shadow-[0_0_30px_rgba(232,37,58,0.3)] backdrop-blur-md">
        
        {/* Decor */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full border border-white/5 bg-nav-maroon p-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ronin-crimson/20 text-ronin-crimson border border-ronin-crimson/30">
            <span className="font-black text-xl">R</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ronin-cream">
            Welcome to the Foundations Track.
          </h2>
          <p className="mt-4 text-lg text-ronin-muted">
            Before we build anything, let's see where you stand. We've prepared a quick diagnostic to test your intuition. This takes about 3 minutes.
          </p>

          <div className="mt-10 flex justify-center">
            <NeonButton 
              variant="crimson" 
              className="px-8 py-3 text-lg"
              onClick={onStartDiagnostic}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Diagnostic
            </NeonButton>
          </div>
        </div>

        {/* Mascot bubble */}
        <div className="absolute -bottom-6 -right-6 hidden sm:block">
          <div className="relative flex items-end gap-3">
            <div className="relative rounded-2xl rounded-br-sm border border-ronin-crimson/30 bg-black/80 px-4 py-3 shadow-[0_0_15px_rgba(243,50,50,0.2)]">
              <p className="text-sm italic text-ronin-cream">"Don't worry, I'll guide you through it."</p>
              {/* Speech bubble tail pointing to the right */}
              <div className="absolute -right-2 bottom-2 h-4 w-4 rotate-45 border-r border-t border-ronin-crimson/30 bg-black/80" />
            </div>
            <img src={mascot} alt="Ronin Mascot" className="w-24 h-auto object-contain drop-shadow-[0_0_15px_rgba(232,37,58,0.4)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
