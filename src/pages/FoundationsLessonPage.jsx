import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchLesson } from '../services/firebase/firestoreService.js'
import VideoLessonPlayer from '../components/lessons/VideoLessonPlayer.jsx'
import TextLessonRenderer from '../components/lessons/TextLessonRenderer.jsx'
import { ArrowLeft } from 'lucide-react'

export default function FoundationsLessonPage() {
  const { trackId, lessonId } = useParams()
  const navigate = useNavigate()
  
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true)
        const data = await fetchLesson(lessonId)
        if (!data) throw new Error("Lesson not found")
        setLesson(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadLesson()
  }, [lessonId])

  const handleComplete = () => {
    // Navigate to next lesson if it exists
    if (lesson?.followUpLessonId) {
      navigate(`/dashboard/lesson/${trackId}/${lesson.followUpLessonId}`)
    } else {
      // In a real flow, this might navigate to a Training Grounds problem or Challenge Set.
      // For now, return to dashboard.
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ronin-crimson border-t-transparent" />
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 text-center">
        <h2 className="text-xl font-bold text-ronin-coral">Failed to load lesson</h2>
        <p className="mt-2 text-ronin-muted">{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-6 flex items-center text-ronin-crimson hover:text-ronin-coral"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl pt-4 pb-20">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-ronin-muted hover:text-ronin-cream transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ronin-cream">{lesson.title}</h1>
        {lesson.description && (
          <p className="mt-2 text-lg text-ronin-muted">{lesson.description}</p>
        )}
      </div>

      <div className="mt-8">
        {lesson.type === 'video' ? (
          <VideoLessonPlayer 
            firebaseStoragePath={lesson.firebaseStoragePath} 
            onComplete={handleComplete} 
          />
        ) : (
          <TextLessonRenderer 
            contentMarkdown={lesson.contentMarkdown || '*Content is missing*'} 
            onComplete={handleComplete} 
            nextLabel={lesson.followUpLessonId ? "Next Lesson" : "Continue"}
          />
        )}
      </div>
    </div>
  )
}
