import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import NeonButton from '../components/ui/NeonButton.jsx'
import TextField from '../components/ui/TextField.jsx'
import RoninMark from '../components/branding/RoninMark.jsx'
import { useAuth } from '../hooks/useAuth.js'
import Snackbar from '../components/ui/Snackbar.jsx'
import VerificationDialog from '../components/auth/VerificationDialog.jsx'
import ErrorDialog from '../components/auth/ErrorDialog.jsx'

import loginMascot from '../assets/login_mascot.png'
import laptopMockup from '../assets/laptop_mockup.png'

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    let i = 0
    setDisplayText('')
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(interval)
    }, 100)
    return () => clearInterval(interval)
  }, [text])
  
  return <span>{displayText}<span className="animate-pulse">_</span></span>
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, gettingStartedDone, preferences, login, signup, resetPassword } = useAuth()
  
  const [authMode, setAuthMode] = useState(location.state?.mode || 'login') // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState(location.state?.prefilledEmail || '')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  
  const [showVerification, setShowVerification] = useState(false)
  
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [isNativeApp, setIsNativeApp] = useState(false)

  useEffect(() => {
    if (window.ReactNativeWebView) {
      setIsNativeApp(true)
    }
  }, [])

  // Update mode if navigation state changes
  useEffect(() => {
    if (location.state?.mode) {
      setAuthMode(location.state.mode)
    }
  }, [location.state])

  useEffect(() => {
    // Only redirect automatically if we're in login mode and authenticated
    // For signup, we want to hold them here to show the verification dialog
    if (!user || authMode === 'signup') return
    if (preferences) navigate('/dashboard', { replace: true })
    else if (gettingStartedDone) navigate('/preferences', { replace: true })
    else navigate('/getting-started', { replace: true })
  }, [user, gettingStartedDone, preferences, navigate, authMode])

  function getErrorMessage(err) {
    if (err.code === 'auth/configuration-not-found') return "Firebase configuration is missing or incomplete. Did you forget to set up your .env file?"
    if (err.code === 'auth/invalid-email') return "The email address is invalid."
    if (err.code === 'auth/email-already-in-use') return "An account with this email already exists."
    if (err.code === 'auth/weak-password') return "Your password is too weak. Please use at least 6 characters."
    if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') return "Invalid email or password."
    return err.message || "An unexpected error occurred."
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setShowError(false)
    
    try {
      if (authMode === 'login') {
        await login(email, password)
        navigate('/getting-started', { replace: true })
      } 
      else if (authMode === 'signup') {
        await signup(email, password)
        // Show success states
        setSnackbarMessage('Sign up was successful')
        setShowSnackbar(true)
        setShowVerification(true)
      } 
      else if (authMode === 'reset') {
        await resetPassword(email)
        setSnackbarMessage('Reset link sent if account exists')
        setShowSnackbar(true)
        setAuthMode('login') // Flip back to login
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(getErrorMessage(error))
      setShowError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const animationVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  }

  return (
    <div className={`flex h-screen w-full text-white overflow-hidden relative ${isNativeApp ? 'bg-[#2a0810] bg-[radial-gradient(ellipse_at_center,rgba(60,10,20,1)_0%,rgba(20,5,10,1)_100%)]' : 'bg-[#050304]'}`}>
      
      <Snackbar 
        isVisible={showSnackbar} 
        message={snackbarMessage} 
        onClose={() => setShowSnackbar(false)} 
      />

      <ErrorDialog
        isVisible={showError}
        title="Authentication Failed"
        message={errorMessage}
        onClose={() => setShowError(false)}
      />

      <VerificationDialog 
        isVisible={showVerification} 
        email={email} 
        onClose={() => {
          setShowVerification(false)
          navigate('/getting-started', { replace: true })
        }} 
      />

      {/* Left Panel (Form) */}
      <div className={`flex h-full flex-col justify-center items-center px-8 sm:px-16 lg:px-24 relative z-10 ${isNativeApp ? 'w-full' : 'w-full md:w-[40%]'}`}>
        
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="mb-12 flex justify-center w-full">
            <RoninMark size="lg" />
          </div>

          <div className="w-full relative min-h-[300px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-12 absolute inset-0"
                >
                  <Loader2 className="h-12 w-12 animate-spin text-ronin-crimson mb-6" />
                  <p className="text-sm font-semibold tracking-widest text-ronin-muted uppercase font-display">
                    {authMode === 'login' ? 'Authenticating...' : authMode === 'signup' ? 'Creating Account...' : 'Sending Link...'}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key={`form-${authMode}`}
                  variants={animationVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6 w-full"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display uppercase tracking-widest">
                      {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Join Ronin' : 'Reset Password'}
                    </h2>
                  </div>

                  <TextField
                    id="email"
                    label="Email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="hadi@ronin.dev"
                  />
                  
                  {authMode !== 'reset' && (
                    <div className="space-y-2">
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={authMode === 'login' ? "current-password" : "new-password"}
                        placeholder="••••••••"
                      />
                      {authMode === 'login' && (
                        <div className="flex justify-end">
                          <button 
                            type="button" 
                            onClick={() => setAuthMode('reset')}
                            className="text-[11px] text-ronin-crimson hover:text-red-400 hover:underline tracking-wide transition-colors"
                          >
                            Forgot your password?
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    <NeonButton type="submit" className="w-full py-3.5 text-sm tracking-widest font-display uppercase hover:shadow-[0_0_25px_rgba(232,37,58,0.6)] transition-all">
                      {authMode === 'login' ? 'Log in' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                    </NeonButton>
                    
                    {authMode === 'login' && (
                      <motion.button 
                        type="button" 
                        onClick={() => setAuthMode('signup')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex justify-center items-center py-3.5 text-sm font-display uppercase tracking-widest text-white bg-red-900/40 hover:bg-red-800/60 rounded-xl transition-all border border-red-500/20 shadow-[0_0_15px_rgba(232,37,58,0.1)] hover:shadow-[0_0_25px_rgba(232,37,58,0.6)]"
                      >
                        Sign Up
                      </motion.button>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 pt-8 text-[11px] text-ronin-muted uppercase tracking-wider">
                    {authMode === 'login' ? (
                      <button type="button" onClick={() => setAuthMode('signup')} className="text-ronin-crimson hover:text-red-400 hover:underline transition-colors">
                        Don't have an account? Sign up
                      </button>
                    ) : (
                      <button type="button" onClick={() => setAuthMode('login')} className="text-ronin-crimson hover:text-red-400 hover:underline transition-colors">
                        Already have an account? Sign in
                      </button>
                    )}
                    <p className="opacity-50 mt-2">Ronin Terms & Privacy Policy</p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Panel (Dark split section) - Only shown on Web */}
      {!isNativeApp && (
        <div className="hidden md:flex h-full w-[60%] flex-col bg-[#0D0A0B] relative overflow-hidden border-l border-white/5">
        
        {/* Glow behind the mascot */}
        <div className="absolute top-12 right-12 w-96 h-96 bg-ronin-crimson/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Laptop mock in the middle */}
        <img 
          src={laptopMockup} 
          alt="Laptop Mockup" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-4xl object-contain z-20 drop-shadow-2xl opacity-80" 
        />

        {/* Mascot positioned partially outside top-right window boundaries */}
        <motion.img
          src={loginMascot}
          alt="Login Mascot"
          style={{ imageRendering: 'high-quality' }}
          className="absolute -top-[10%] -right-[10%] w-[450px] object-contain z-10 drop-shadow-[0_0_20px_rgba(232,37,58,0.3)] origin-top-right scale-125"
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated Chip popping in and out in the center beneath the laptop */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[#4a0d16] text-white px-8 py-4 rounded-xl shadow-[15px_0_25px_rgba(255,255,255,0.15)] font-display uppercase tracking-widest text-sm border border-white/10 whitespace-nowrap"
          >
            <TypewriterText text="Train hard. Code harder." />
          </motion.div>
        </div>
        </div>
      )}
    </div>
  )
}
