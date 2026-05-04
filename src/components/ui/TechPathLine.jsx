import { useId } from 'react'

/**
 * Vector tech connectors — horizontal run, sharp elbow (≥45°), straight finish.
 * Do not use tech-line.png; these are pure SVG.
 */
export function TechPathSegmentH({ width = 120, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const gid = `tp-h-${uid}`
  return (
    <svg width={width} height={12} className={className} viewBox={`0 0 ${width} 12`} fill="none" aria-hidden>
      <path
        d={`M0 6 H${width}`}
        stroke={`url(#${gid})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 6"
      />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#F33232" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#C8A423" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F33232" stopOpacity="0.35" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function TechPathElbowDown({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const gid = `tp-ed-${uid}`
  return (
    <svg width="100" height="56" viewBox="0 0 100 56" className={className} fill="none" aria-hidden>
      <path
        d="M0 8 H52 L88 48 H100"
        stroke={`url(#${gid})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="7 6"
      />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F33232" />
          <stop offset="1" stopColor="#C8A423" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function TechPathElbowUp({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const gid = `tp-eu-${uid}`
  return (
    <svg width="100" height="56" viewBox="0 0 100 56" className={className} fill="none" aria-hidden>
      <path
        d="M0 48 H52 L88 8 H100"
        stroke={`url(#${gid})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="7 6"
      />
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#C8A423" />
          <stop offset="1" stopColor="#F33232" />
        </linearGradient>
      </defs>
    </svg>
  )
}
