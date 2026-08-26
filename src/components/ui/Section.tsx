import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  children: ReactNode
  /** Ritmo vertical del sistema. */
  spacing?: 'default' | 'tight' | 'loose' | 'none'
}

const spacings: Record<NonNullable<SectionProps['spacing']>, string> = {
  default: 'py-section',
  tight: 'py-[calc(var(--spacing-section)*0.6)]',
  loose: 'py-[calc(var(--spacing-section)*1.35)]',
  none: '',
}

export function Section({ children, className, spacing = 'default', ...rest }: SectionProps) {
  return (
    <section className={cn('relative', spacings[spacing], className)} {...rest}>
      {children}
    </section>
  )
}
