import HeroSection from '../features/dashboard/HeroSection.jsx'
import DashboardTabs from '../features/dashboard/DashboardTabs.jsx'

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <HeroSection />
      <DashboardTabs />
    </div>
  )
}
