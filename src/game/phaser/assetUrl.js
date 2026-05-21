/** Resolve `public/` paths for Vite `base`. */
export function assetUrl(path) {
  const base = './';
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${path.replace(/^\//, '')}`.replace(/([^:]\/)\/+/g, '$1')
}
