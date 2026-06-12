import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { Play, Calendar, ChevronRight, ArrowRight } from 'lucide-react'
import RoninMark from '../components/branding/RoninMark.jsx'

import laptopMockup from '../assets/laptop_mockup.png'
import brainIcon from '../assets/brain_icon_red.png'
import thunderIcon from '../assets/thunder_icon_yellow.png'
import starIcon from '../assets/star_icon_red.png'

import interactImg from '../assets/interact.png'
import playImg from '../assets/play.png'
import buildIntuitionImg from '../assets/build_intuition.png'
import completeMissionsImg from '../assets/complete_missions.png'
import experienceProgrammingImg from '../assets/experience_programming.png'

import devIcon from '../assets/dev_icon.png'
import progressIcon from '../assets/progress_icon_red.png'
import roninLogo from '../assets/ronin_logo.png'

// Reusable Section Label
const SectionLabel = ({ children }) => (
  <p className="text-sm font-bold tracking-widest uppercase text-ronin-crimson mb-4">
    {children}
  </p>
)

// Typewriter Text Component
const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (inView) {
      let i = 0
      setDisplayText('')
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i))
        i++
        if (i > text.length) clearInterval(interval)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [text, inView])
  
  return <span ref={ref} className="font-sans">{displayText}<span className="animate-pulse">_</span></span>
}

// Number Animation Component
const AnimatedNumber = ({ value, duration = 2.5, format = (v) => Math.floor(v) }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => format(latest))

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration, ease: "easeOut" })
      return controls.stop
    }
  }, [inView, count, value, duration])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

// Shrinking Progress Bar Component
const ShrinkingBar = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <div ref={ref} className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
      <motion.div 
        initial={{ width: "100%" }}
        animate={inView ? { width: "20%" } : { width: "100%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="h-full bg-ronin-crimson rounded-full"
      />
    </div>
  )
}

// The Shift Card Component
const ShiftCard = ({ oldWay, newWay, imageSrc }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#141012] border border-white/5 rounded-2xl overflow-hidden flex flex-col text-left shadow-lg hover:border-white/10 transition-colors"
    >
      {/* Image Container - Fixed height h-48 */}
      <div className="w-full h-48 bg-gradient-to-br from-white/5 to-transparent relative flex items-center justify-center border-b border-white/5 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={newWay} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/30 text-xs font-bold tracking-widest uppercase px-4 text-center">Image Placeholder</span>
        )}
      </div>
      {/* Text Content */}
      <div className="p-8">
        <h3 className="text-xl font-bold text-white mb-3">{newWay}</h3>
        <p className="text-white/60 text-sm font-medium">
          <span className="line-through opacity-40">{oldWay}</span> <span className="text-ronin-crimson mx-2">→</span> {newWay}
        </p>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  // Automatically redirect Android/iOS Native App users to the login screen
  useEffect(() => {
    if (window.ReactNativeWebView) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const handleStartForFree = (e) => {
    e.preventDefault()
    navigate('/login', { state: { prefilledEmail: email } })
  }

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen bg-[#0D0A0B] text-white font-sans selection:bg-ronin-crimson selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-white/5 bg-[#0D0A0B]/90 backdrop-blur-md">
        <div className="flex items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <RoninMark size="sm" />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link to="#" className="hover:text-white transition-colors">Why Ronin</Link>
          <Link to="#" className="hover:text-white transition-colors">Product</Link>
          <Link to="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="#" className="hover:text-white transition-colors">About</Link>
        </div>

        <div className="flex items-center">
          <button 
            onClick={() => navigate('/login')}
            className="rounded bg-[#E8253A] px-5 py-2 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600 hover:shadow-[0_0_15px_rgba(232,37,58,0.4)]"
          >
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-8 px-6 md:px-12 relative flex justify-center items-center overflow-visible min-h-[75vh]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,37,58,0.08),transparent_50%)]" />

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 z-10 relative">
          
          {/* Left Column: Hero Text */}
          <div className="w-full md:w-[45%] flex flex-col items-start text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-6"
            >
              The Fastest Growing Code & Training System
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-white/60 mb-8 max-w-xl leading-relaxed"
            >
              Only Ronin runs natively in your browser, streamlines learning with interactive diagnostics, and scales with your coding ability.
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleStartForFree}
              className="w-full max-w-md flex flex-col sm:flex-row gap-3 mb-4"
              noValidate
            >
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#E8253A] focus:bg-white/10 transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="whitespace-nowrap rounded bg-[#E8253A] px-6 py-3 font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600 hover:shadow-[0_0_15px_rgba(232,37,58,0.4)]"
              >
                Start Up Free
              </button>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xs text-white/40"
            >
              Sign up and start training instantly. No credit card required.
            </motion.p>
          </div>

          {/* Right Column: Video Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-[55%] flex justify-center items-center relative aspect-video cursor-pointer group"
          >
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#1a0a0d] to-[#0D0A0B] border border-white/10 shadow-[0_0_40px_rgba(232,37,58,0.15)] flex items-center justify-center transition-transform group-hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 bg-black/40 flex items-center justify-center group-hover:border-ronin-crimson group-hover:bg-ronin-crimson/20 transition-all">
                <Play className="w-6 h-6 text-white translate-x-0.5 group-hover:text-ronin-crimson transition-colors" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section (Moved significantly higher) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="w-full text-center relative z-20 -mt-8 mb-16 pb-12 overflow-hidden"
      >
        <p className="text-sm font-semibold tracking-widest uppercase text-white/30 mb-8">
          Trusted by students at
        </p>
        <div className="w-full flex overflow-hidden whitespace-nowrap relative [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          {/* Container 1 */}
          <motion.div 
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 200, ease: "linear" }}
            className="flex shrink-0 gap-16 pr-16 w-max opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-16">
                <span className="text-2xl font-bold font-display">STANFORD</span>
                <span className="text-2xl font-bold font-display">MIT</span>
                <span className="text-2xl font-bold font-display tracking-tighter">HARVARD</span>
                <span className="text-2xl font-bold font-display">BERKELEY</span>
                <span className="text-2xl font-bold font-display">WATERLOO</span>
                <span className="text-2xl font-bold font-display">CMU</span>
              </div>
            ))}
          </motion.div>
          {/* Container 2 (Duplicate for seamless loop) */}
          <motion.div 
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 200, ease: "linear" }}
            className="flex shrink-0 gap-16 pr-16 w-max opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-16">
                <span className="text-2xl font-bold font-display">STANFORD</span>
                <span className="text-2xl font-bold font-display">MIT</span>
                <span className="text-2xl font-bold font-display tracking-tighter">HARVARD</span>
                <span className="text-2xl font-bold font-display">BERKELEY</span>
                <span className="text-2xl font-bold font-display">WATERLOO</span>
                <span className="text-2xl font-bold font-display">CMU</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Interactive Feature Display (Laptop & Chips) */}
      <section className="pt-16 pb-24 relative px-6 md:px-12 bg-[#0D0A0B] overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
          
          {/* Left Side: Laptop Mockup without a container */}
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full lg:w-[60%] flex justify-start relative z-10"
          >
            {/* Animated Neon Glow */}
            <motion.div 
              animate={{ 
                scale: [0.85, 1.15, 0.85],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square bg-[#E8253A] blur-[100px] rounded-full pointer-events-none z-0"
            />
            
            <img 
              src={laptopMockup} 
              alt="Ronin IDE" 
              className="w-full max-w-4xl object-contain drop-shadow-2xl scale-[1.15] origin-left relative z-10" 
            />
          </motion.div>

          {/* Right Side: Stacked Animated Chips */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6 items-end relative z-20">
            {/* Chip 1 */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="relative flex items-center gap-4 bg-[#141012] rounded-[50px] border border-ronin-crimson/50 px-7 py-5 w-full max-w-[480px]"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3], boxShadow: ["0px 0px 10px rgba(232,37,58,0.2)", "0px 0px 25px rgba(232,37,58,0.6)", "0px 0px 10px rgba(232,37,58,0.2)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-[50px] pointer-events-none z-0"
              />
              <img src={brainIcon} alt="Brain" className="w-7 h-7 object-contain opacity-80 relative z-10" style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="text-white/90 text-[13px] leading-relaxed relative z-10">
                <TypewriterText text="For everyone from professionals to complete coding beginners" />
              </p>
            </motion.div>

            {/* Chip 2 */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              className="relative flex items-center gap-4 bg-[#141012] rounded-[50px] border border-ronin-crimson/50 px-7 py-5 w-full max-w-[480px]"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3], boxShadow: ["0px 0px 10px rgba(232,37,58,0.2)", "0px 0px 25px rgba(232,37,58,0.6)", "0px 0px 10px rgba(232,37,58,0.2)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 rounded-[50px] pointer-events-none z-0"
              />
              <img src={thunderIcon} alt="Thunder" className="w-7 h-7 object-contain opacity-80 relative z-10" style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="text-white/90 text-[13px] leading-relaxed relative z-10">
                <TypewriterText text="Scales and adapts to the way you learn" />
              </p>
            </motion.div>

            {/* Chip 3 */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              className="relative flex items-center gap-4 bg-[#141012] rounded-[50px] border border-ronin-crimson/50 px-7 py-5 w-full max-w-[480px]"
            >
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3], boxShadow: ["0px 0px 10px rgba(232,37,58,0.2)", "0px 0px 25px rgba(232,37,58,0.6)", "0px 0px 10px rgba(232,37,58,0.2)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-0 rounded-[50px] pointer-events-none z-0"
              />
              <img src={starIcon} alt="Star" className="w-7 h-7 object-contain opacity-80 relative z-10" style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="text-white/90 text-[13px] leading-relaxed relative z-10">
                <TypewriterText text="Finds the best path to guarantee Zero to Hero" />
              </p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>

      {/* THE WORLD OF CODING HAS CHANGED */}
      <section className="pt-16 pb-24 relative px-6 md:px-12 bg-[#0A0809]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
            <SectionLabel>The World of Coding Has Changed</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold">AI is now part of modern programming.</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center text-center">
              <h3 className="text-6xl font-black text-ronin-crimson font-display mb-4">
                <AnimatedNumber value={84} />%
              </h3>
              <p className="text-white font-bold text-lg mb-2">Developers use or plan to use AI tools</p>
              <p className="text-white/40 text-xs mt-auto">Stack Overflow Developer Survey 2025</p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center text-center">
              <h3 className="text-6xl font-black text-ronin-crimson font-display mb-4">
                <AnimatedNumber value={51} />%
              </h3>
              <p className="text-white font-bold text-lg mb-2">Professional developers use AI daily</p>
              <p className="text-white/40 text-xs mt-auto">Coding workflows are changing for everyone</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center text-center">
              <h3 className="text-6xl font-black text-ronin-crimson font-display mb-4">
                <AnimatedNumber value={46} />%
              </h3>
              <p className="text-white font-bold text-lg mb-2">Developers don't trust AI output</p>
              <p className="text-white/40 text-xs mt-auto">People use AI constantly—but still spend time fixing it.</p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>

      {/* LEARNING IS STILL STUCK IN THE PAST */}
      <section className="pt-16 pb-24 relative px-6 md:px-12 bg-[#0D0A0B]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
            <SectionLabel>Learning is still stuck in the past</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold">The tools changed. Learning didn't.</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
            {/* Card 1 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative bg-[#141012]/80 border border-ronin-crimson/30 rounded-xl p-8 flex flex-col items-center shadow-lg">
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3], boxShadow: ["0px 0px 10px rgba(232,37,58,0.2)", "0px 0px 25px rgba(232,37,58,0.5)", "0px 0px 10px rgba(232,37,58,0.2)"] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 rounded-xl pointer-events-none z-0" />
              <h3 className="text-4xl md:text-5xl font-black text-white font-display mb-4 relative z-10">3+ Hours</h3>
              <p className="text-ronin-crimson font-bold text-lg mb-2 relative z-10">Average tutorial length</p>
              <p className="text-white/60 mt-auto relative z-10">People binge tutorials instead of building.</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative bg-[#141012]/80 border border-ronin-crimson/30 rounded-xl p-8 flex flex-col items-center shadow-lg">
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3], boxShadow: ["0px 0px 10px rgba(232,37,58,0.2)", "0px 0px 25px rgba(232,37,58,0.5)", "0px 0px 10px rgba(232,37,58,0.2)"] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="absolute inset-0 rounded-xl pointer-events-none z-0" />
              <h3 className="text-4xl md:text-5xl font-black text-white font-display mb-4 relative z-10">
                <AnimatedNumber value={60} />M+
              </h3>
              <p className="text-ronin-crimson font-bold text-lg mb-2 relative z-10">Stack Overflow Qs</p>
              <p className="text-white/60 mt-auto relative z-10">Developers search for answers rather than retain concepts.</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative bg-[#141012]/80 border border-ronin-crimson/30 rounded-xl p-8 flex flex-col items-center shadow-lg">
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3], boxShadow: ["0px 0px 10px rgba(232,37,58,0.2)", "0px 0px 25px rgba(232,37,58,0.5)", "0px 0px 10px rgba(232,37,58,0.2)"] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} className="absolute inset-0 rounded-xl pointer-events-none z-0" />
              <h3 className="text-4xl md:text-5xl font-black text-white font-display mb-4 relative z-10">
                <AnimatedNumber value={19} />%
              </h3>
              <p className="text-ronin-crimson font-bold text-lg mb-2 relative z-10">Outdated reference code</p>
              <p className="text-white/60 mt-auto relative z-10">Top contributors admit old code is rarely updated.</p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>

      {/* BREAKING INTO TECH IS HARDER THAN EVER */}
      <section className="pt-16 pb-24 relative px-6 md:px-12 bg-[#0A0809]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
            <SectionLabel>Breaking into tech is harder than ever</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold max-w-3xl mx-auto">Experience is rewarded. Beginners are expected to have experience before getting experience.</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#110D0F] border border-white/10 rounded-xl p-8">
              <h3 className="text-5xl font-black text-ronin-crimson font-display mb-2">
                <AnimatedNumber value={80} />%
              </h3>
              <p className="text-white font-bold mb-4">Drop in entry-level hiring at AI-adopting companies since 2023</p>
              <ShrinkingBar />
              <p className="text-white/40 text-xs mt-4">Junior opportunities are shrinking.</p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#110D0F] border border-white/10 rounded-xl p-8">
              <h3 className="text-5xl font-black text-white font-display mb-2">
                <AnimatedNumber value={280000} format={(v) => Math.floor(v).toLocaleString()} />+
              </h3>
              <p className="text-white font-bold mb-4">Companies analyzed in Harvard research</p>
              <p className="text-white/40 text-xs mt-auto">The hiring shift is industry-wide.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#110D0F] border border-white/10 rounded-xl p-8">
              <h3 className="text-5xl font-black text-white font-display mb-2">
                <AnimatedNumber value={66} /> Million
              </h3>
              <p className="text-white font-bold mb-4">Worker records studied</p>
              <p className="text-white/40 text-xs mt-auto">This isn't anecdotal—it shows up in large datasets.</p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>

      {/* THE PROBLEM */}
      <section className="pt-16 pb-24 relative px-6 md:px-12 bg-gradient-to-b from-[#0A0809] to-[#0D0A0B]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel>The Problem</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
            {[
              { title: "Endless YouTube tutorials", desc: "Hours spent watching others code without retaining the concepts.", icon: brainIcon },
              { title: "Expensive courses", desc: "Bootcamps and courses costing thousands with low placement rates.", icon: starIcon },
              { title: "Outdated examples", desc: "Copy-pasting broken code snippets from old forums.", icon: devIcon },
              { title: "Information overload", desc: "Paralysis by analysis when trying to pick a tech stack.", icon: thunderIcon },
              { title: "Memorization instead of practice", desc: "Forgetting syntax the moment you step away from the tutorial.", icon: progressIcon },
              { title: "Passive learning", desc: "Reading docs without ever writing a line of code yourself.", icon: brainIcon }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 border-t-2 border-white/5 pt-10 relative hover:border-ronin-crimson/50 transition-colors"
              >
                <div className="absolute -top-8 w-16 h-16 bg-[#0A0809] border border-white/10 rounded-xl flex items-center justify-center shadow-lg">
                  <img src={item.icon} alt={item.title} className="w-8 h-8 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <h4 className="text-white font-bold text-lg mb-3 tracking-wide uppercase mt-4">{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>


      {/* THE SHIFT */}
      <section className="pt-16 pb-24 relative px-6 md:px-12 bg-[#0D0A0B]">
        <div className="max-w-6xl mx-auto text-center">
          <SectionLabel>The Shift</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-16">A new paradigm for learning.</h2>
          
          <div className="flex flex-col gap-6">
            {/* Top Row: 2 Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <ShiftCard 
                oldWay="Consume content" 
                newWay="Interact with content" 
                imageSrc={interactImg}
              />
              <ShiftCard 
                oldWay="Watch" 
                newWay="Play" 
                imageSrc={playImg}
              />
            </div>
            {/* Bottom Row: 3 Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <ShiftCard 
                oldWay="Memorize syntax" 
                newWay="Build intuition" 
                imageSrc={buildIntuitionImg}
              />
              <ShiftCard 
                oldWay="Finish courses" 
                newWay="Complete missions" 
                imageSrc={completeMissionsImg}
              />
              <ShiftCard 
                oldWay="Study programming" 
                newWay="Experience programming" 
                imageSrc={experienceProgrammingImg}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>

      {/* RONIN - THE SOLUTION */}
      <section className="pt-20 pb-32 px-6 md:px-12 bg-[#0A0809] relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-ronin-crimson/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <RoninMark size="lg" className="mx-auto mb-8" />
            <h2 className="font-display text-4xl md:text-6xl font-black mb-6 leading-tight">Coding should feel like a game.</h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 font-medium">
              Ronin transforms programming into interactive challenges, adaptive missions, and real problem solving.
            </p>
            <p className="text-lg text-ronin-crimson font-bold uppercase tracking-widest mb-16">
              Stop consuming code. Start becoming a developer.
            </p>

            <button 
              onClick={() => navigate('/login')}
              className="rounded bg-[#E8253A] px-10 py-5 font-bold uppercase tracking-widest text-lg text-white transition-all hover:bg-red-600 hover:shadow-[0_0_25px_rgba(232,37,58,0.5)]"
            >
              Start Playing
            </button>

            <p className="mt-12 text-white/30 text-sm max-w-xl mx-auto italic">
              The internet solved access to information. It never solved how humans actually learn. Ronin does.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>

      {/* BOOK A CALL CTA */}
      <section className="pt-16 pb-24 px-6 md:px-12 bg-gradient-to-b from-[#0A0809] to-[#0D0A0B] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-ronin-crimson/5 blur-[200px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          {/* Left Side: Copy */}
          <div className="w-full lg:w-1/2">
            <SectionLabel>Get a Test Run</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-6">Talk to a human. Get a free walkthrough.</h2>
            <p className="text-white/70 text-lg mb-10 max-w-lg">
              Not sure where to start? We'll have one of our on-call support engineers jump on a call with you. Free of charge. We'll walk you through the entire platform and answer any questions you have.
            </p>
            <div className="flex flex-col items-start gap-4">
              <button className="bg-white text-black px-8 py-4 font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                Book a Call
              </button>
              <Link to="/login" className="text-white/50 underline text-sm hover:text-white transition-colors ml-2 mt-2">
                Or explore Ronin myself
              </Link>
            </div>
          </div>

          {/* Right Side: Mock DatePicker */}
          <div className="w-full lg:w-1/2 flex justify-end pr-0 md:pr-8">
            <div className="bg-[#141012] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              {/* Subtle glow */}
              <div className="absolute inset-0 border border-ronin-crimson/30 rounded-2xl shadow-[0_0_30px_rgba(232,37,58,0.15)] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-white font-bold text-lg">Select a Date & Time</h4>
                  <p className="text-white/40 text-xs">30 min walkthrough</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/50 rotate-180 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-white/30 text-xs font-bold">{day}</div>
                ))}
                {/* Empty slots */}
                {Array.from({length: 3}).map((_, i) => <div key={`e-${i}`} className="p-2" />)}
                {/* Days */}
                {Array.from({length: 28}).map((_, i) => {
                  const isSelected = i === 14;
                  const isPast = i < 12;
                  return (
                    <button 
                      key={`day-${i}`} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors mx-auto
                        ${isSelected ? 'bg-ronin-crimson text-white font-bold shadow-[0_0_15px_rgba(232,37,58,0.5)]' : 
                          isPast ? 'text-white/20 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <button className="bg-white/5 border border-white/10 rounded-md py-3 text-sm text-white hover:bg-white/10 hover:border-white/20 transition-all">
                  9:00 AM
                </button>
                <button className="bg-ronin-crimson text-white font-bold rounded-md py-3 text-sm shadow-[0_0_15px_rgba(232,37,58,0.4)] hover:bg-red-600 transition-colors">
                  9:30 AM
                </button>
                <button className="bg-white/5 border border-white/10 rounded-md py-3 text-sm text-white hover:bg-white/10 hover:border-white/20 transition-all">
                  10:00 AM
                </button>
                <button className="bg-white/5 border border-white/10 rounded-md py-3 text-sm text-white hover:bg-white/10 hover:border-white/20 transition-all">
                  10:30 AM
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20" />
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A0809] border-t border-white/10 py-16 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Block: Logo + Links */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20 pl-0 md:pl-8">
            {/* Logo & Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img src={roninLogo} alt="Ronin Logo" className="w-32 object-contain mb-4 opacity-90" />
              <a href="mailto:info@roninv2.tech" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
                info@roninv2.tech
              </a>
            </div>

            {/* Footer Navigation Links */}
            <div className="flex flex-col items-center md:items-start gap-4 text-sm font-medium text-white/70">
              <Link to="#" className="hover:text-white transition-colors">Why Ronin</Link>
              <Link to="#" className="hover:text-white transition-colors">Product</Link>
              <Link to="#" className="hover:text-white transition-colors">Pricing</Link>
              <Link to="#" className="hover:text-white transition-colors">About</Link>
            </div>
          </div>

          {/* Contact Us Text Field */}
          <div className="w-full max-w-md">
            <p className="text-white/70 font-bold uppercase tracking-widest text-xs mb-3 pl-2">Contact Us</p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Enter your email to get in touch..." 
                className="w-full bg-[#141012] border border-white/10 rounded-full py-4 pl-6 pr-16 text-white text-sm focus:outline-none focus:border-ronin-crimson focus:shadow-[0_0_20px_rgba(232,37,58,0.2)] transition-all placeholder:text-white/30"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ronin-crimson hover:text-white transition-colors group-focus-within:bg-ronin-crimson text-white/50 group-focus-within:text-white">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
          <p>© {new Date().getFullYear()} Ronin. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
