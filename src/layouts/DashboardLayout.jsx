import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AmbientGrid from '../components/layout/AmbientGrid.jsx'
import MascotChatWidget from '../components/branding/MascotChatWidget.jsx'
import TopNav from '../features/dashboard/TopNav.jsx'

export default function DashboardLayout() {
  const location = useLocation()
  const isBossTrial = location.pathname.includes('boss-trial')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 1024 && window.innerHeight < 500
      setIsMobile(smallScreen || (mobileUA && window.innerWidth > window.innerHeight))
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const hideNav = isMobile && isBossTrial

  return (
    <div className="relative min-h-screen">
      <AmbientGrid />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(61,16,21,0.35),transparent)]" />
      <MascotChatWidget />
      {!hideNav && <TopNav />}
      <div className={`mx-auto max-w-[1400px] px-4 pb-16 md:px-8 ${hideNav ? 'pt-1' : 'pt-6'}`}>
        <Outlet />
      </div>
    </div>
  )
}
