import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  /** `wide` rompe el ancho máximo para composiciones a sangre. */
  width?: 'default' | 'wide' | 'prose'
}

const widths: Record<NonNullable<ContainerProps['width']>, string> = {
  default: 'max-w-page',
  wide: 'max-w-none',
  prose: 'max-w-prose',
}

/** Ancho y márgenes laterales del sistema. Nadie define padding lateral por su cuenta. */
export function Container({
  children,
  className,
  as: Tag = 'div',
  width = 'default',
}: ContainerProps) {
  return <Tag className={cn('mx-auto w-full px-gutter', widths[width], className)}>{children}</Tag>
}
