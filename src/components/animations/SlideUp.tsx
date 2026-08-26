import { m } from 'motion/react'
import type { ReactNode } from 'react'

import { DURATION, EASE, VIEWPORT_ONCE } from '@/lib/motion'

type SlideUpProps = {
  children: ReactNode
  className?: string
  delay?: number
  distance?: number
}

/** Entrada vertical explícita, sin variants: útil dentro de listas ya escalonadas. */
export function SlideUp({ children, className, delay = 0, distance = 28 }: SlideUpProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.reveal, delay, ease: EASE.expensive }}
    >
      {children}
    </m.div>
  )
}
