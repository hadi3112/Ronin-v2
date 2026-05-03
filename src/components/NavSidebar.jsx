import { NavLink } from 'react-router-dom'
import { mainNavLinks } from '../data/navigation.js'

function linkClassName({ isActive }) {
  return [
    'block rounded-md px-2 py-1.5 transition-colors',
    isActive
      ? 'bg-zinc-800 text-purple-400'
      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white',
  ].join(' ')
}

export default function NavSidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-4">
      <h1 className="text-2xl font-bold text-purple-400 mb-6">.Ronin</h1>

      <nav className="space-y-1 text-sm">
        {mainNavLinks.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={Boolean(end)} className={linkClassName}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
