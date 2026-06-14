import { Outlet } from 'react-router-dom'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import MascotChatWidget from '../components/branding/MascotChatWidget.jsx'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-ronin-dark">
      {/* Backgrounds */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(61,16,21,0.35),transparent)]" />
      
      {/* Sidebar - fixed left rail */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto relative">
          <AmbientGrid />
          <MascotChatWidget />
          <div className="mx-auto max-w-[1200px] px-6 py-6 pb-24">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
