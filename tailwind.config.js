/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ronin: {
          void: '#050505',
          'nav-from': '#2A0B0F',
          'nav-to': '#3D1015',
          crimson: '#F33232',
          coral: '#F36E6E',
          gold: '#C8A423',
          orange: '#F38B1F',
          cream: '#F7F7F7',
          muted: '#BFBFBF',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ronin: '0 0 60px rgba(0, 0, 0, 0.75), 0 0 120px rgba(243, 50, 50, 0.06)',
        'ronin-red': '0 0 28px rgba(243, 50, 50, 0.35)',
        'ronin-gold': '0 0 20px rgba(200, 164, 35, 0.35)',
        innerGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      backgroundImage: {
        'nav-maroon': 'linear-gradient(90deg, #2A0B0F 0%, #3D1015 55%, #2A0B0F 100%)',
        'glass-shine':
          'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 45%)',
        'grid-faint':
          'linear-gradient(rgba(243, 50, 50, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(243, 50, 50, 0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      keyframes: {
        pulseLine: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        spark: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'pulse-line': 'pulseLine 2.4s ease-in-out infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        spark: 'spark 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
