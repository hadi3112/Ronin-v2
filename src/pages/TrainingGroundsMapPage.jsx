import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ModuleCard({ title, locked, onClick }) {
  return (
    <motion.div
      whileHover={locked ? {} : { scale: 1.02, boxShadow: '0 0 15px 5px rgba(239, 68, 68, 0.4)' }}
      onClick={onClick}
      className={`flex-shrink-0 flex items-center justify-center w-64 h-40 rounded-xl border-2 transition-all cursor-pointer
        ${locked 
          ? 'border-gray-800 bg-gray-900/40 text-gray-600 cursor-not-allowed' 
          : 'border-ronin-crimson/70 bg-black/60 text-ronin-cream'}`}
    >
      <h2 className="text-2xl font-display font-bold tracking-widest uppercase">{title}</h2>
    </motion.div>
  )
}

function SubmoduleCard({ title, desc, locked, onClick }) {
  const [expanded, setExpanded] = useState(false)
  
  const handleClick = (e) => {
    if (locked) {
      onClick(e)
      return
    }
    setExpanded(!expanded)
  }

  return (
    <div 
      onClick={handleClick}
      className={`flex-shrink-0 flex flex-col justify-center w-56 rounded-lg border p-5 transition-all cursor-pointer overflow-hidden
        ${locked 
          ? 'border-gray-800 bg-gray-900/30 text-gray-600 cursor-not-allowed h-32' 
          : 'border-white/10 bg-white/5 text-white hover:border-ronin-crimson/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] ' + (expanded ? 'h-48' : 'h-32')}`}
    >
      <h3 className="text-sm font-bold uppercase tracking-widest mb-2">{title}</h3>
      {expanded && !locked ? (
        <p className="text-xs text-gray-300 mt-2 leading-relaxed">{desc}</p>
      ) : (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{desc}</p>
      )}
    </div>
  )
}

function DashedLine() {
  return (
    <div className="flex-shrink-0 w-16 border-t-[3px] border-dashed border-gray-700/50" />
  )
}

export default function TrainingGroundsMapPage() {
  const [lockDialogOpen, setLockDialogOpen] = useState(false)

  const handleLockedClick = () => {
    setLockDialogOpen(true)
  }

  const M1_SUBMODULES = [
    { id: 'm1_sub1', title: 'Video: What Is Code?', desc: 'A short explanation of what a program is, what a computer actually does when it runs code, and why Python is a good first language.' },
    { id: 'm1_sub2', title: 'Your First print', desc: 'The simplest thing a Python program can do is display a message using the print() function.' },
    { id: 'm1_sub3', title: 'Console Output', desc: 'Understand how to read error messages and successfully run your code from top to bottom.' },
  ]

  const M2_SUBMODULES = [
    { id: 'm2_sub1', title: 'Video: Variables', desc: 'An explanation of variables using labeled storage boxes.' },
    { id: 'm2_sub2', title: 'Numbers vs Text', desc: 'Python treats numbers and text differently. Learn why types matter.' },
  ]

  return (
    <div className="h-full w-full bg-[#030303] flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="p-10 pb-6 border-b border-white/5">
        <h1 className="text-3xl font-display font-bold uppercase text-ronin-cream tracking-widest">
          Training Grounds Map
        </h1>
        <p className="text-gray-500 text-sm mt-3 tracking-wide">Scroll horizontally to view your module path.</p>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-16 space-x-0 pb-12 
        [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        {/* Module 1 Sequence */}
        <ModuleCard title="Module 1" locked={false} />
        {M1_SUBMODULES.map((sub) => (
          <React.Fragment key={sub.id}>
            <DashedLine />
            <SubmoduleCard title={sub.title} desc={sub.desc} locked={false} />
          </React.Fragment>
        ))}

        {/* Transition to Module 2 */}
        <DashedLine />

        {/* Module 2 Sequence (Locked) */}
        <ModuleCard title="Module 2" locked={true} onClick={handleLockedClick} />
        {M2_SUBMODULES.map((sub) => (
          <React.Fragment key={sub.id}>
            <DashedLine />
            <SubmoduleCard title={sub.title} desc={sub.desc} locked={true} onClick={handleLockedClick} />
          </React.Fragment>
        ))}

        {/* Extra space at the end to allow overscroll */}
        <div className="w-32 flex-shrink-0" />
      </div>

      {/* Lock Dialog */}
      <AnimatePresence>
        {lockDialogOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a0a0a] border-2 border-ronin-crimson/40 shadow-[0_0_40px_rgba(239,68,68,0.2)] rounded-2xl p-8"
            >
              <h2 className="text-xl font-display font-bold uppercase text-ronin-crimson mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">Module Locked</h2>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                You must complete <strong className="text-ronin-cream">Module 1</strong> before accessing this content. Here is your pending curriculum:
              </p>
              
              <div className="space-y-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-ronin-crimson/50" />
                  <span className="font-semibold text-gray-300">Module 1 - Video: What Is Code?</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                  Module 1 - Your First print
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                  Module 1 - Console Output
                </div>
              </div>

              <button 
                onClick={() => setLockDialogOpen(false)}
                className="w-full py-3.5 rounded-xl bg-ronin-crimson/10 border border-ronin-crimson/30 text-ronin-crimson text-sm font-bold uppercase tracking-[0.2em] hover:bg-ronin-crimson/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:border-ronin-crimson/60 transition-all"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
