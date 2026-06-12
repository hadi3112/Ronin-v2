import { Navigate, Route, Routes } from 'react-router-dom'
import GettingStartedRoute from './components/auth/GettingStartedRoute.jsx'
import PreferencesRoute from './components/auth/PreferencesRoute.jsx'
import RequireAuth from './components/auth/RequireAuth.jsx'
import RequirePreferences from './components/auth/RequirePreferences.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import BossTrialGamePage from './pages/BossTrialGamePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import GettingStartedPage from './pages/GettingStartedPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import PreferencesPage from './pages/PreferencesPage.jsx'
import IDETrainingPage from './pages/IDETrainingPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/getting-started"
        element={
          <RequireAuth>
            <GettingStartedRoute>
              <GettingStartedPage />
            </GettingStartedRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/preferences"
        element={
          <RequireAuth>
            <PreferencesRoute>
              <PreferencesPage />
            </PreferencesRoute>
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequirePreferences>
              <DashboardLayout />
            </RequirePreferences>
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="game/boss-trial" element={<BossTrialGamePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="training/:language" element={<IDETrainingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
