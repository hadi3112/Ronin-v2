import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import NeonButton from '../components/ui/NeonButton.jsx'
import TextField from '../components/ui/TextField.jsx'
import RoninMark from '../components/branding/RoninMark.jsx'
import { useAuth } from '../hooks/useAuth.js'

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
  const { user, gettingStartedDone, preferences, login } = useAuth()
  
  const [email, setEmail] = useState(location.state?.prefilledEmail || '')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [isNativeApp, setIsNativeApp] = useState(false)

  useEffect(() => {
    if (window.ReactNativeWebView) {
      setIsNativeApp(true)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    if (preferences) navigate('/dashboard', { replace: true })
    else if (gettingStartedDone) navigate('/preferences', { replace: true })
    else navigate('/getting-started', { replace: true })
  }, [user, gettingStartedDone, preferences, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/getting-started', { replace: true })
    } catch (error) {
      console.error(error)
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  return (
    <div className={`flex h-screen w-full text-white overflow-hidden relative ${isNativeApp ? 'bg-[#2a0810] bg-[radial-gradient(ellipse_at_center,rgba(60,10,20,1)_0%,rgba(20,5,10,1)_100%)]' : 'bg-[#050304]'}`}>
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
                  <p className="text-sm font-semibold tracking-widest text-ronin-muted uppercase font-display">Authenticating...</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 w-full"
                  onSubmit={handleSubmit}
                  noValidate // Prevent browser HTML5 validation (like @ missing)
                >
                  {/* Changed type to "text" to completely disable email validation for now */}
                  <TextField
                    id="email"
                    label="Email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="hadi@ronin.dev"
                  />
                  
                  <div className="space-y-2">
                    <TextField
                      id="password"
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                    />
                    <div className="flex justify-end">
                      <a href="#" className="text-[11px] text-ronin-crimson hover:text-red-400 hover:underline tracking-wide transition-colors">Forgot your password?</a>
                    </div>
                  </div>

                  <NeonButton type="submit" className="w-full py-3.5 mt-4 text-base tracking-wide">
                    Sign in
                  </NeonButton>
                  
                  <div className="flex flex-col items-center gap-4 pt-8 text-[11px] text-ronin-muted uppercase tracking-wider">
                    <a href="#" className="text-ronin-crimson hover:text-red-400 hover:underline transition-colors">Sign in with another email</a>
                    <p className="opacity-50">Ronin Terms & Privacy Policy</p>
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
