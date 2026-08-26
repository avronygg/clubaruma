import { m } from 'motion/react'

import { launch } from '@/data/site'
import { cn } from '@/lib/cn'
import { DURATION, EASE } from '@/lib/motion'

type LaunchBadgeProps = {
  /** Se retira mientras el menú móvil ocupa la pantalla. */
  hidden?: boolean
}

/**
 * Distintivo de apertura.
 *
 * Fijo bajo la píldora de la cabecera y visible durante todo el scroll: el club
 * no ha abierto y ese es el dato que contextualiza cualquier sección en la que
 * aterrice el visitante.
 *
 * No intercepta el puntero: es información, no un control. Quien quiera actuar
 * tiene la cabecera encima y el botón flotante abajo.
 */
export function LaunchBadge({ hidden = false }: LaunchBadgeProps) {
  return (
    <m.p
      aria-hidden={hidden}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? -8 : 0 }}
      transition={{ duration: DURATION.ui, ease: EASE.expensive, delay: hidden ? 0 : 0.6 }}
      className={cn(
        'pointer-events-none fixed inset-x-0 z-40 flex justify-center px-gutter',
        'top-[calc(var(--spacing-nav)+0.75rem)]',
      )}
    >
      <span className="inline-flex animate-blink items-center gap-2.5 rounded-pill glass px-4 py-2 text-eyebrow whitespace-nowrap text-white/85 uppercase">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-red-bright" />
        {launch.badge} · {launch.period}
      </span>
    </m.p>
  )
}
