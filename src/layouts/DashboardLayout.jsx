import { Outlet } from 'react-router-dom'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import TopNav from '../features/dashboard/TopNav.jsx'

export default function DashboardLayout() {
  return (
    <div className="relative min-h-screen">
      <AmbientGrid />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(61,16,21,0.35),transparent)]" />
      <TopNav />
      <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-6 md:px-8">
        <Outlet />
      </div>
    </div>
  )
}
