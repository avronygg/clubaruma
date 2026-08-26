import { waitlistBenefits } from '@/data/home'
import { cn } from '@/lib/cn'

type WaitlistBenefitsProps = {
  className?: string
}

/**
 * Los tres motivos para dejar los datos.
 *
 * Es el argumento de conversión, así que va en lista y no en párrafo: se
 * escanea de un vistazo. Mismo componente en el popup y en la sección de
 * cierre, para que la promesa sea idéntica en los dos puntos de captación.
 *
 * Alineada a la izquierda incluso dentro de bloques centrados: una lista
 * centrada obliga a buscar el inicio de cada línea.
 */
export function WaitlistBenefits({ className }: WaitlistBenefitsProps) {
  return (
    <ul className={cn('mx-auto flex max-w-[42ch] flex-col gap-3 text-left', className)}>
      {waitlistBenefits.map((benefit) => (
        <li key={benefit} className="flex items-start gap-3.5 text-body text-gray">
          <span
            aria-hidden="true"
            className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-red-bright"
          />
          {benefit}
        </li>
      ))}
    </ul>
  )
}
