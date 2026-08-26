import { m } from 'motion/react'
import type { ReactNode } from 'react'

import { DURATION, EASE } from '@/lib/motion'

/**
 * Transición entre rutas.
 *
 * Hoy solo existe la home, pero el envoltorio ya está en su sitio: al añadir
 * `/vip` o `/galeria` la navegación encadena sin tocar los componentes.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.ui, ease: EASE.expensive }}
    >
      {children}
    </m.div>
  )
}
