import { m } from 'motion/react'
import type { ReactNode } from 'react'

import { slideUp, VIEWPORT_ONCE } from '@/lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Segundos de retardo. Se usa para escalonar bloques hermanos. */
  delay?: number
  /** Desplazamiento en píxeles. Nunca más de ~32: por encima se nota barato. */
  distance?: number
}

/**
 * Aparición al entrar en viewport. Dispara una sola vez.
 * Anima solo `opacity` y `transform`: nunca provoca reflow.
 */
export function Reveal({ children, className, delay = 0, distance = 24 }: RevealProps) {
  return (
    <m.div
      className={className}
      variants={slideUp(distance, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </m.div>
  )
}
