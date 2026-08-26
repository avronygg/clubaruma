import { m } from 'motion/react'
import type { ReactNode } from 'react'

import { slideUp, STAGGER, staggerContainer, VIEWPORT_ONCE } from '@/lib/motion'

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
}

/** Contenedor que escalona a sus hijos `<StaggerItem>`. */
export function Stagger({
  children,
  className,
  stagger = STAGGER.normal,
  delayChildren = 0,
}: StaggerProps) {
  return (
    <m.div
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </m.div>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  distance?: number
}

export function StaggerItem({ children, className, distance = 20 }: StaggerItemProps) {
  return (
    <m.div className={className} variants={slideUp(distance)}>
      {children}
    </m.div>
  )
}
