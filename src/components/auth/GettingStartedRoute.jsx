import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

/** /getting-started — logged in, onboarding not finished, GS step not done yet */
export default function GettingStartedRoute({ children }) {
  const { user, gettingStartedDone, preferences } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (preferences) return <Navigate to="/dashboard" replace />
  if (gettingStartedDone) return <Navigate to="/preferences" replace />
  return children
}
