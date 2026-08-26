import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    // Los assets pesados viven en /public y se sirven con nombres estables.
    assetsInlineLimit: 2048,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Vendors separados: la librería de animación y el router se cachean
        // aparte del código de la web, que es lo que cambia en cada despliegue.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('motion') || id.includes('framer')) return 'motion'
          if (id.includes('react-router')) return 'router'
          if (id.includes('react')) return 'react'
          return undefined
        },
      },
    },
  },
})
