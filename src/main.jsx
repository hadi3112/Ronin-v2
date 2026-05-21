import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.jsx'
import { AntigravityProvider } from './context/AntigravityContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <AntigravityProvider>
          <App />
        </AntigravityProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
