import { Outlet } from 'react-router-dom'
import NavSidebar from '../components/NavSidebar.jsx'

export default function MainLayout() {
  return (
    <div className="h-screen flex bg-black text-white">
      <NavSidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
