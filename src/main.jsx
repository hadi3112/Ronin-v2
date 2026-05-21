import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.jsx'
import { AntigravityProvider } from './context/AntigravityContext.jsx'
import './index.css'
import App from './App.jsx'

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <HashRouter>
          <AuthProvider>
            <AntigravityProvider>
              <App />
            </AntigravityProvider>
          </AuthProvider>
        </HashRouter>
      </StrictMode>,
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
