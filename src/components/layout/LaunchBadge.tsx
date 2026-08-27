import { m } from 'motion/react'

import { useOverture } from '@/components/layout/Overture'
import { launch } from '@/data/site'
import { cn } from '@/lib/cn'
import { DURATION, EASE, OVERTURE } from '@/lib/motion'

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
  const { ready } = useOverture()
  // Cierra la obertura: no aparece hasta que la portada ha terminado de montarse.
  const visible = ready && !hidden

  return (
    <m.p
      aria-hidden={hidden}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
      transition={{
        duration: DURATION.ui,
        ease: EASE.expensive,
        delay: visible ? OVERTURE.badge : 0,
      }}
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
