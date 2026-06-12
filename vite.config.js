import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isExpo = process.env.BUILD_TARGET === 'expo' || mode === 'expo'

  return {
    plugins: [
      react(),
      isExpo ? viteSingleFile() : null
    ].filter(Boolean),
    base: './',
    build: {
      assetsInlineLimit: isExpo ? 100000000 : 4096,
    }
  }
})

