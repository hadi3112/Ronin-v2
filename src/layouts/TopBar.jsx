import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import NeonButton from '../components/ui/NeonButton.jsx'

export default function TopBar() {
  const location = useLocation()
  
  // A simple title mapping based on route
  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('training')) return 'Training Grounds'
    if (path.includes('challenges')) return 'Challenges'
    if (path.includes('scoreboard')) return 'Scoreboard'
    if (path.includes('tutorials')) return 'Tutorials'
    if (path.includes('paths')) return 'Paths'
    if (path.includes('boss-trial')) return 'Diagnostic'
    return 'Home'
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-black/20 px-6 backdrop-blur-md">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold tracking-wide text-ronin-cream">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-ronin-cream transition-colors hover:border-ronin-coral/40"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <NeonButton variant="coral" className="hidden px-4 py-1.5 text-xs sm:inline-flex">
          Premium
        </NeonButton>
      </div>
    </header>
  )
}
