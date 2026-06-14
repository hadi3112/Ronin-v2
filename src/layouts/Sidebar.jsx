import { NavLink } from 'react-router-dom'
import { Home, Swords, Target, Trophy, BookOpen, Map, Settings, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import RoninMark from '../components/branding/RoninMark.jsx'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home, end: true },
  { to: '/dashboard/training', label: 'Training Grounds', icon: Swords },
  { to: '/dashboard/challenges', label: 'Challenges', icon: Target },
  { to: '/dashboard/scoreboard', label: 'Scoreboard', icon: Trophy },
  { to: '/dashboard/tutorials', label: 'Tutorials', icon: BookOpen },
  { to: '/dashboard/paths', label: 'Paths', icon: Map },
]

export default function Sidebar() {
  const { currentUser, logout } = useAuth()
  const [logoutPhase, setLogoutPhase] = useState(null) // 'saving' | 'saved' | 'blackout' | null
  
  // Mocking user profile info
  const xp = 1250
  const nextLevelXp = 2000
  const level = 5
  const xpPercent = Math.round((xp / nextLevelXp) * 100)

  const handleLogout = () => {
    setLogoutPhase('saving')

    // TODO: Reconcile SessionAgent skill vectors and perform final write-backs to Firebase database here.
    
    setTimeout(() => {
      setLogoutPhase('saved')
      
      setTimeout(() => {
        setLogoutPhase('blackout')
        
        setTimeout(() => {
          logout()
        }, 1500)
      }, 1500)
    }, 2000)
  }

  return (
    <>
      <aside className="hidden w-[220px] flex-col border-r border-white/5 bg-nav-maroon shadow-ronin backdrop-blur-md md:flex">
        {/* Brand Top */}
        <div className="flex h-16 items-center pl-8 border-b border-white/5">
          <div className="flex items-center">
            <RoninMark size="sm" />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-ronin-crimson/10 text-ronin-cream border-l-2 border-ronin-crimson shadow-[inset_1px_0_0_rgba(243,50,50,0.5)]'
                    : 'text-ronin-muted hover:bg-white/[0.03] hover:text-ronin-cream border-l-2 border-transparent',
                ].join(' ')
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button replacing the Mascot Bubble */}
        <div className="px-4 py-4 mt-auto">
          <motion.button 
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3 text-xs font-semibold uppercase tracking-widest text-ronin-cream hover:bg-ronin-crimson/80 hover:border-ronin-crimson/50 transition-all shadow-inner hover:shadow-[0_0_15px_rgba(232,37,58,0.3)]"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </motion.button>
        </div>

        {/* User Section Bottom */}
        <div className="border-t border-white/5 bg-black/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ronin-crimson to-ronin-dark text-white border border-white/10 shadow-lg">
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-ronin-cream">
                {currentUser?.displayName || 'Ronin User'}
              </div>
              <div className="text-xs text-ronin-gold font-medium">
                Level {level}
              </div>
            </div>
            <button className="text-ronin-muted hover:text-white transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
          
          {/* XP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-ronin-muted">
              <span>XP</span>
              <span>{xp} / {nextLevelXp}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-ronin-crimson to-ronin-coral shadow-[0_0_8px_rgba(243,50,50,0.5)]" 
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Flow Overlays */}
      <AnimatePresence>
        {(logoutPhase === 'saving' || logoutPhase === 'saved') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          >
            {logoutPhase === 'saving' && (
              <div className="flex flex-col items-center gap-6">
                <Loader2 className="h-16 w-16 animate-spin text-ronin-crimson" />
                <p className="text-2xl font-display uppercase tracking-widest text-ronin-cream drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  Saving Progress...
                </p>
              </div>
            )}
            
            {logoutPhase === 'saved' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-8 py-4 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)] font-medium tracking-wide"
              >
                Progress saved, returning to home screen.
              </motion.div>
            )}
          </motion.div>
        )}

        {logoutPhase === 'blackout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
          >
            <p className="text-4xl md:text-5xl font-display font-bold uppercase tracking-[0.2em] text-ronin-crimson drop-shadow-[0_0_20px_rgba(232,37,58,0.5)]">
              Logging Out...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
