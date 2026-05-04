import { useEffect, useMemo, useState } from 'react'
import { mergeCatalogWithRemote } from '../data/courseCatalog.js'
import { defaultFirebaseService } from '../services/FirebaseService.js'

export function useCourseCatalog() {
  const [catalogCourses, setCatalogCourses] = useState(() => mergeCatalogWithRemote(null))
  const [remoteOk, setRemoteOk] = useState(/** @type {boolean | null} */ (null))
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await defaultFirebaseService.initAuthPlaceholder()
        const list = await defaultFirebaseService.loadCoursesCatalog()
        if (!cancelled) {
          setCatalogCourses(mergeCatalogWithRemote(list))
          setRemoteOk(true)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setCatalogCourses(mergeCatalogWithRemote(null))
          setRemoteOk(false)
          setError(e instanceof Error ? e.message : 'Catalog load failed')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const exploreFeaturedRow = useMemo(
    () => ({ id: 'ronin-paths', label: 'Ronin paths', courses: catalogCourses }),
    [catalogCourses],
  )

  return {
    remoteOk,
    error,
    catalogCourses,
    exploreFeaturedRow,
    featuredRows: [exploreFeaturedRow],
  }
}
