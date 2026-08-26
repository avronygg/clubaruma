import { cn } from '@/lib/cn'

type EyebrowProps = {
  /** Numeral editorial de la sección: «02». */
  index?: string
  children: string
  className?: string
  tone?: 'default' | 'inverted'
}

/**
 * Antetítulo del sistema: numeral y etiqueta en versalitas.
 *
 * Sin filete entre ambos. El «número + rayita roja» es el recurso que traen de
 * serie las plantillas, y se notaba. El acento rojo pasa al propio numeral, que
 * es contenido y no adorno; la separación la hace el espacio.
 */
export function Eyebrow({ index, children, className, tone = 'default' }: EyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-4 text-eyebrow font-medium uppercase',
        tone === 'inverted' ? 'text-black/60' : 'text-muted',
        className,
      )}
    >
      {index ? <span className="text-red-bright tabular-nums">{index}</span> : null}
      <span>{children}</span>
    </p>
  )
}
