import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Dominio público del sitio. Sale del entorno para que la vista previa de
 * Vercel y el dominio definitivo no necesiten tocar el código.
 */
const SITE_URL = (process.env['VITE_SITE_URL'] ?? 'https://arumaclub.cl').replace(/\/$/, '')

/**
 * Sustituye `%SITE_URL%` en `index.html`.
 *
 * Las etiquetas Open Graph tienen que ser absolutas y tienen que estar en el
 * HTML servido, no inyectadas por React: WhatsApp, Facebook e Instagram leen
 * el enlace con un robot que no ejecuta JavaScript. Si la imagen y el título
 * solo existen después de hidratar, la vista previa del enlace sale vacía, que
 * es justo por donde va a circular esta web.
 *
 * Vite solo sustituye `%VITE_*%` cuando la variable existe; si falta, deja el
 * literal en el HTML. Por eso el reemplazo se hace aquí, con un valor por
 * defecto garantizado.
 */
function siteUrl(): Plugin {
  return {
    name: 'aruma-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
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
