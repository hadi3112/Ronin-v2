import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.jsx'
import { AntigravityProvider } from './context/AntigravityContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AntigravityProvider>
          <App />
        </AntigravityProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
