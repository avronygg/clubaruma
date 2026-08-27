import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { OvertureProvider } from '@/components/layout/Overture'
import { RootLayout } from '@/components/layout/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

/**
 * Raíz de la aplicación.
 *
 * `MotionConfig reducedMotion="user"` desactiva de forma centralizada las
 * animaciones de transformación cuando el sistema lo pide: ninguna sección
 * necesita comprobarlo por su cuenta.
 *
 * `LazyMotion` con `domAnimation` carga solo lo que la web usa (animaciones,
 * variants, salidas y gestos) y deja fuera drag y layout animations: unos 20 kB
 * comprimidos menos. `strict` obliga a usar `<m.div>` en lugar de
 * `<motion.div>`, que es lo que hace efectivo el recorte.
 *
 * Hoy solo existe la home. Añadir `/experiencia`, `/vip`, `/cocteleria`,
 * `/eventos`, `/galeria` o `/contacto` es añadir una línea aquí y un archivo en
 * `src/pages/` — el layout, la navegación y la transición ya están montados.
 */
export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <OvertureProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                <Route index element={<HomePage />} />
                {/*
                Rutas futuras:
                <Route path="experiencia" element={<ExperiencePage />} />
                <Route path="vip" element={<VipPage />} />
                <Route path="cocteleria" element={<CocktailsPage />} />
                <Route path="eventos" element={<EventsPage />} />
                <Route path="galeria" element={<GalleryPage />} />
                <Route path="contacto" element={<ContactPage />} />
              */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </OvertureProvider>
      </LazyMotion>
    </MotionConfig>
  )
}
