import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.jsx'
import { AntigravityProvider } from './context/AntigravityContext.jsx'
import './index.css'
import App from './App.jsx'

// Detect if running in an Android WebView/Expo environment
const isWebView = window.location.protocol === 'file:' || /wv|Expo|WebView/i.test(navigator.userAgent) || !!window.ReactNativeWebView
const Router = isWebView ? HashRouter : BrowserRouter

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <Router>
          <AuthProvider>
            <AntigravityProvider>
              <App />
            </AntigravityProvider>
          </AuthProvider>
        </Router>
      </StrictMode>,
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
