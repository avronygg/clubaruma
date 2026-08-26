import { m } from 'motion/react'
import type { ReactNode } from 'react'

import { DURATION, EASE, VIEWPORT_ONCE } from '@/lib/motion'

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

/** Aparición sin desplazamiento, para elementos que ya están donde deben. */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = DURATION.reveal,
}: FadeInProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration, delay, ease: EASE.expensive }}
    >
      {children}
    </m.div>
  )
}
