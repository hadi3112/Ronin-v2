import { useState, useCallback } from 'react'
import HeroSection from '../features/dashboard/HeroSection.jsx'
import DashboardTabs from '../features/dashboard/DashboardTabs.jsx'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('explore')

  const handleNavigateToTutorial = useCallback((categoryName) => {
    setActiveTab('tutorials')
  }, [])

  return (
    <div className="space-y-2">
      <HeroSection onNavigateToTutorial={handleNavigateToTutorial} />
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
