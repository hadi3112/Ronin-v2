import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

/** Dashboard and post-onboarding routes */
export default function RequirePreferences({ children }) {
  const { user, preferences } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!preferences) return <Navigate to="/preferences" replace />
  return children
}
