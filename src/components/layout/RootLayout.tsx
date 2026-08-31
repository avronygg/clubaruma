import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router'

import { PageTransition } from '@/components/animations/PageTransition'
import { WaitlistFab } from '@/components/forms/WaitlistFab'
import { FloatingReel } from '@/components/media/FloatingReel'
import { WaitlistModal } from '@/components/forms/WaitlistModal'
import { Footer } from '@/components/layout/Footer'
import { LaunchBadge } from '@/components/layout/LaunchBadge'
import { Preloader } from '@/components/layout/Preloader'
import { useOverture } from '@/hooks/useOverture'
import { NavBar } from '@/components/navigation/NavBar'
import { ScrollProgress } from '@/components/navigation/ScrollProgress'
import { features } from '@/data/site'
import { OVERTURE } from '@/lib/motion'
import { useWaitlistDialog } from '@/hooks/useWaitlistDialog'

/**
 * Estructura común a todas las rutas: cabecera, contenido y pie.
 *
 * El aislamiento del foco se resuelve con `inert` en dos niveles, sin trampas
 * de foco escritas a mano:
 *
 *   · Menú móvil abierto → contenido y pie inertes; la cabecera sigue viva,
 *     porque el botón de cerrar está en ella.
 *   · Popup abierto      → todo inerte, cabecera incluida, porque el diálogo
 *     está por encima de todo.
 */
export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPath, setLastPath] = useState<string>(() => window.location.pathname)
  const location = useLocation()
  const outlet = useOutlet()

  const dialog = useWaitlistDialog(features.entryPopupDelay, features.entryPopup)
  const { begin, ready } = useOverture()
  // Los flotantes son lo último en llegar: aparecen sobre una página ya
  // montada, no compitiendo con ella mientras se monta.
  const [flotantes, setFlotantes] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])

  // Ajuste de estado durante el render al cambiar de ruta (no de ancla):
  // el patrón recomendado por React frente a un efecto que llama a setState.
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMenuOpen(false)
  }

  // Sin cortina no hay a quién esperar: la secuencia arranca en el primer
  // efecto, un fotograma después del montaje.
  useEffect(() => {
    if (!features.preloader) begin()
  }, [begin])

  useEffect(() => {
    if (!ready) return

    const timer = window.setTimeout(() => setFlotantes(true), OVERTURE.floating * 1000)
    return () => window.clearTimeout(timer)
  }, [ready])

  // Cambio de ruta: vuelta al principio del documento.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <>
      {features.preloader ? <Preloader onDone={begin} /> : null}
      {features.scrollProgress ? <ScrollProgress /> : null}

      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-pill focus:bg-white focus:px-5 focus:py-3 focus:text-nav focus:font-medium focus:text-black focus:uppercase"
      >
        Saltar al contenido
      </a>

      <div inert={dialog.open}>
        <NavBar menuOpen={menuOpen} onMenuToggle={toggleMenu} onMenuClose={closeMenu} />

        {features.launchBadge ? <LaunchBadge hidden={menuOpen} /> : null}

        <div inert={menuOpen}>
          <main id="contenido">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>{outlet}</PageTransition>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </div>

      {features.floatingReel ? (
        <FloatingReel onJoin={dialog.show} hidden={dialog.open || menuOpen || !flotantes} />
      ) : null}

      {features.waitlistFab ? (
        <WaitlistFab
          onOpen={dialog.show}
          bubbleDelay={features.fabBubbleDelay}
          hidden={dialog.open || menuOpen || !flotantes}
          submitted={dialog.submitted}
        />
      ) : null}

      <WaitlistModal open={dialog.open} onClose={dialog.close} onSubmitted={dialog.markSubmitted} />
    </>
  )
}
