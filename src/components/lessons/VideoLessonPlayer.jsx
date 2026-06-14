import { useState, useEffect } from 'react'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '../../services/firebase/firebaseConfig.js'
import { Film } from 'lucide-react'
import NeonButton from '../ui/NeonButton.jsx'

export default function VideoLessonPlayer({ firebaseStoragePath, onComplete }) {
  const [videoUrl, setVideoUrl] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!firebaseStoragePath) return
    const fetchUrl = async () => {
      try {
        const storageRef = ref(storage, firebaseStoragePath)
        const url = await getDownloadURL(storageRef)
        setVideoUrl(url)
      } catch (err) {
        console.warn('Video not uploaded yet:', firebaseStoragePath)
        setError(true)
      }
    }
    fetchUrl()
  }, [firebaseStoragePath])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-12 text-center shadow-lg">
        <Film className="mb-4 h-12 w-12 text-ronin-muted" />
        <h3 className="mb-2 text-xl font-semibold text-ronin-cream">Video Coming Soon</h3>
        <p className="mb-6 max-w-md text-sm text-ronin-muted">
          This lesson video is currently being forged in the dojo. In the meantime, you can continue to the next lesson.
        </p>
        <NeonButton variant="crimson" onClick={onComplete}>
          Continue to Next Lesson
        </NeonButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-[0_0_20px_rgba(243,50,50,0.1)]">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-auto aspect-video"
            onEnded={onComplete}
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ronin-crimson border-t-transparent" />
          </div>
        )}
      </div>
      <div className="mt-6 flex w-full justify-end">
        <NeonButton variant="crimson" onClick={onComplete}>
          Mark as Complete & Continue
        </NeonButton>
      </div>
    </div>
  )
}
