import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, UserRound, X } from 'lucide-react'
import NeonButton from '../../components/ui/NeonButton.jsx'

const tabs = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/about', label: 'About' },
  { to: '/dashboard/contact', label: 'Contact' },
]

export default function TopNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-nav-maroon shadow-ronin backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 md:px-8">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-ronin-cream md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-ronin-cream md:inline-flex"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                [
                  'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-ronin-cream bg-white/5 ring-1 ring-ronin-crimson/30 shadow-ronin-red/20'
                    : 'text-ronin-muted hover:text-ronin-cream hover:bg-white/[0.03]',
                ].join(' ')
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-ronin-cream hover:border-ronin-coral/40"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-ronin-cream hover:border-ronin-gold/40"
            aria-label="Profile"
          >
            <UserRound className="h-5 w-5" />
          </button>
          <NeonButton variant="coral" className="hidden px-4 py-2 text-xs sm:inline-flex">
            Premium
          </NeonButton>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/40 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-ronin-cream hover:bg-white/5"
                >
                  {t.label}
                </NavLink>
              ))}
              <NeonButton variant="coral" className="mt-2 w-full justify-center py-2 text-xs">
                Premium
              </NeonButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
