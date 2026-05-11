/** Resolve `public/` paths for Vite `base`. */
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${path.replace(/^\//, '')}`.replace(/([^:]\/)\/+/g, '$1')
}
