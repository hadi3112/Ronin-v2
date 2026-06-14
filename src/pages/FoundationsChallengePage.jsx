import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchChallengeSet } from '../services/firebase/firestoreService.js'
import NeonButton from '../components/ui/NeonButton.jsx'

export default function FoundationsChallengePage() {
  const { setId } = useParams()
  const navigate = useNavigate()
  
  const [challengeSet, setChallengeSet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchChallengeSet(setId)
        setChallengeSet(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [setId])

  if (loading) {
    return <div className="flex h-full items-center justify-center p-20"><div className="animate-spin h-8 w-8 border-2 border-ronin-crimson border-t-transparent rounded-full" /></div>
  }

  if (!challengeSet || !challengeSet.questions) {
    return <div className="p-20 text-center text-ronin-coral">Challenge set not found.</div>
  }

  if (isFinished) {
    return (
      <div className="mx-auto max-w-2xl pt-20 text-center">
        <h2 className="text-3xl font-bold text-ronin-cream mb-4">Challenge Complete!</h2>
        <div className="text-6xl font-black text-ronin-crimson mb-8">
          {score} <span className="text-2xl text-ronin-muted">/ {challengeSet.questions.length}</span>
        </div>
        <NeonButton variant="crimson" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </NeonButton>
      </div>
    )
  }

  const question = challengeSet.questions[currentQuestionIndex]

  const handleSelect = (optionId) => {
    if (showExplanation) return
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    if (showExplanation) {
      // Move to next question
      if (currentQuestionIndex < challengeSet.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedOption(null)
        setShowExplanation(false)
      } else {
        setIsFinished(true)
      }
    } else {
      // Check answer
      if (selectedOption === question.correctOptionId) {
        setScore(prev => prev + 1)
      }
      setShowExplanation(true)
    }
  }

  return (
    <div className="mx-auto max-w-3xl pt-10 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-ronin-muted">Question {currentQuestionIndex + 1} of {challengeSet.questions.length}</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-8 shadow-lg backdrop-blur-md">
        <h3 className="text-xl font-semibold text-ronin-cream mb-8 leading-relaxed">
          {question.questionText}
        </h3>

        <div className="space-y-4 mb-8">
          {question.options?.map(opt => {
            const isSelected = selectedOption === opt.id
            const isCorrect = showExplanation && opt.id === question.correctOptionId
            const isWrong = showExplanation && isSelected && opt.id !== question.correctOptionId

            let btnClass = "w-full text-left px-6 py-4 rounded-xl border transition-all "
            if (isCorrect) btnClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-100"
            else if (isWrong) btnClass += "bg-ronin-crimson/20 border-ronin-crimson/50 text-ronin-coral"
            else if (isSelected) btnClass += "bg-white/10 border-white/30 text-white"
            else btnClass += "bg-white/5 border-white/10 text-ronin-muted hover:bg-white/10"

            return (
              <button 
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={btnClass}
              >
                {opt.text}
              </button>
            )
          })}
        </div>

        {showExplanation && (
          <div className={`p-4 rounded-xl border mb-8 ${selectedOption === question.correctOptionId ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-ronin-crimson/10 border-ronin-crimson/30'}`}>
            <p className="text-sm font-medium text-ronin-cream mb-1">
              {selectedOption === question.correctOptionId ? 'Correct!' : 'Incorrect.'}
            </p>
            <p className="text-sm text-ronin-muted">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          <NeonButton 
            variant="crimson" 
            disabled={!selectedOption && !showExplanation}
            onClick={handleSubmit}
          >
            {showExplanation ? (currentQuestionIndex === challengeSet.questions.length - 1 ? 'Finish Challenge' : 'Next Question') : 'Submit Answer'}
          </NeonButton>
        </div>
      </div>
    </div>
  )
}
