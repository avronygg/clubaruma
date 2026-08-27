import { m } from 'motion/react'
import type { ReactNode } from 'react'

import { SEQUENCE_STEP, staggerContainer, step, VIEWPORT_ONCE } from '@/lib/motion'

type SequenceProps = {
  children: ReactNode
  className?: string
  /** Separación entre pasos, en segundos. */
  stagger?: number
  /** Espera antes del primer paso. Sirve para encadenar dos secuencias. */
  delay?: number
}

/**
 * Secuencia encadenada.
 *
 * Un único observador de viewport por bloque que va soltando a sus hijos
 * `<Step>` en el orden en que están escritos.
 *
 * ── Por qué esto y no un retardo por elemento ──────────────────────────────
 * Antes cada pieza llevaba su propio `<Reveal delay={0.08}>`, `0.14`, `0.2`…
 * Eso parece lo mismo pero no lo es: cada una tenía su propio observador y
 * arrancaba su cuenta cuando **ella** entraba en pantalla. Al bajar despacio se
 * escalonaba bien; al bajar rápido, el bloque entero cruzaba el umbral en el
 * mismo fotograma, las tres cuentas empezaban a la vez y todo aterrizaba junto.
 * El escalonado se perdía justo cuando más se nota.
 *
 * Con un solo observador, el orden es el mismo se baje como se baje.
 *
 * ── Cómo se usa ────────────────────────────────────────────────────────────
 * `Sequence` sustituye al contenedor de maquetación en lugar de envolverlo:
 * recibe sus clases y ocupa su sitio en la retícula, así que no aparecen
 * divisiones nuevas que descuadren un `grid` o un `flex`.
 *
 *     <Sequence className="col-span-12 lg:col-span-5">
 *       <Step><Eyebrow /></Step>
 *       <Step><Heading /></Step>
 *       <Step><p /></Step>
 *     </Sequence>
 *
 * Los elementos que se animan solos, como `<Figure>`, pueden vivir dentro sin
 * problema: definen su propio `initial`, así que no heredan estas variantes.
 */
export function Sequence({
  children,
  className,
  stagger = SEQUENCE_STEP,
  delay = 0,
}: SequenceProps) {
  return (
    <m.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </m.div>
  )
}

type StepProps = {
  children: ReactNode
  className?: string
}

/** Un eslabón de la secuencia. El retardo lo pone el padre, nunca el hijo. */
export function Step({ children, className }: StepProps) {
  return (
    <m.div className={className} variants={step}>
      {children}
    </m.div>
  )
}
