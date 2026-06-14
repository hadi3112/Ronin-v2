import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchModule } from '../services/firebase/firestoreService.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import { Play, CheckCircle } from 'lucide-react'

export default function FoundationsModulePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  
  const [moduleData, setModuleData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchModule(moduleId)
        setModuleData(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [moduleId])

  if (loading) {
    return <div className="flex h-full items-center justify-center p-20"><div className="animate-spin h-8 w-8 border-2 border-ronin-crimson border-t-transparent rounded-full" /></div>
  }

  if (!moduleData) {
    return <div className="p-20 text-center text-ronin-coral">Module not found.</div>
  }

  return (
    <div className="mx-auto max-w-4xl pt-10 pb-20">
      <div className="mb-8 rounded-2xl border border-white/10 bg-black/40 p-8 shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold tracking-tight text-ronin-cream">
          Module {moduleData.moduleNumber}: {moduleData.title}
        </h1>
        <p className="mt-4 text-lg text-ronin-muted">{moduleData.description}</p>
        
        <div className="mt-8 flex gap-4">
          <NeonButton 
            variant="crimson" 
            onClick={() => navigate(`/dashboard/lesson/${moduleData.trackId}/${moduleData.lessons[0]}`)}
          >
            <Play className="mr-2 h-4 w-4" /> Start Module
          </NeonButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ronin-cream mb-4">Lessons</h2>
        {moduleData.lessons?.map((lessonId, i) => (
          <div key={lessonId} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-5 hover:bg-black/40 transition-colors">
            <div className="flex items-center">
              <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-medium text-ronin-muted">
                {i + 1}
              </div>
              <span className="text-ronin-cream font-medium">Lesson Content</span>
            </div>
            <NeonButton variant="coral" onClick={() => navigate(`/dashboard/lesson/${moduleData.trackId}/${lessonId}`)}>
              View
            </NeonButton>
          </div>
        ))}
        
        {moduleData.challengeSetId && (
          <div className="mt-8 flex items-center justify-between rounded-xl border border-ronin-gold/20 bg-ronin-gold/5 p-5">
            <div className="flex items-center">
              <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-ronin-gold/20 text-ronin-gold">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-ronin-gold font-bold">Module Challenge</span>
            </div>
            <NeonButton variant="gold" onClick={() => navigate(`/dashboard/challenge/${moduleData.challengeSetId}`)}>
              Take Challenge
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  )
}
