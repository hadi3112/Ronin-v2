import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ExploreLevelsPage from './pages/ExploreLevelsPage.jsx'
import TutorialsPage from './pages/TutorialsPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="explore" element={<ExploreLevelsPage />} />
        <Route path="tutorials" element={<TutorialsPage />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  )
}
