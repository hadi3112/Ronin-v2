import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

/** /preferences — after getting started, before dashboard */
export default function PreferencesRoute({ children }) {
  const { user, gettingStartedDone, preferences } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (preferences) return <Navigate to="/dashboard" replace />
  if (!gettingStartedDone) return <Navigate to="/getting-started" replace />
  return children
}
