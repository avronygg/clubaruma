import { m } from 'motion/react'
import type { ReactNode } from 'react'

import { DURATION, EASE } from '@/lib/motion'

/**
 * Transición entre rutas.
 *
 * Hoy solo existe la home, pero el envoltorio ya está en su sitio: al añadir
 * `/vip` o `/galeria` la navegación encadena sin tocar los componentes.
 *
 * `initial={false}` va aquí y no en el `AnimatePresence` que lo envuelve. Ahí
 * arriba parecía lo mismo y no lo era: el contexto de presencia alcanza a
 * cualquier descendiente, de modo que exentaba de su animación de entrada a la
 * página entera, portada incluida. Puesto en este componente, solo se exenta
 * él, que es lo que se quería: en la primera carga la página no se funde en
 * bloque, sino que se va montando pieza a pieza.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.ui, ease: EASE.expensive }}
    >
      {children}
    </m.div>
  )
}
