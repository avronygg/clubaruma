import { cn } from '@/lib/cn'

type DividerProps = {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  tone?: 'default' | 'strong' | 'red'
}

const tones: Record<NonNullable<DividerProps['tone']>, string> = {
  default: 'bg-line',
  strong: 'bg-line-strong',
  red: 'bg-red',
}

/** Filete de 1px. El único separador del sistema. */
export function Divider({ className, orientation = 'horizontal', tone = 'default' }: DividerProps) {
  return (
    <span
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'block shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        tones[tone],
        className,
      )}
    />
  )
}
