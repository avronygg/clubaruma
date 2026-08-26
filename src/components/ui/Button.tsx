import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

type BaseProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

type AnchorProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps> & { href: string }

type NativeButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps> & { href?: undefined }

export type ButtonProps = AnchorProps | NativeButtonProps

const base =
  'group relative inline-flex items-center justify-center gap-2.5 text-nav font-medium uppercase ' +
  'whitespace-nowrap transition-[background-color,color,border-color,box-shadow] ' +
  'duration-(--duration-micro) ease-expensive'

const variants: Record<Variant, string> = {
  // El único bloque de rojo sólido de la interfaz: la acción principal.
  primary:
    'rounded-pill bg-red text-white hover:bg-red-bright ' +
    'hover:shadow-[0_10px_34px_-14px_rgb(255_26_26/0.5)]',
  secondary:
    'rounded-pill border border-line-strong text-white hover:border-white/55 hover:bg-white/5',
  ghost: 'text-white hover:text-red-bright',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5',
  md: 'h-12 px-6 sm:h-[3.125rem] sm:px-8',
}

/** La variante fantasma no tiene caja, así que amplía su zona pulsable. */
const ghostSizes: Record<Size, string> = {
  sm: 'h-auto p-0 tap-target [--tap-expand:0.625rem]',
  md: 'h-auto p-0 tap-target [--tap-expand:0.75rem]',
}

/**
 * Botón del sistema.
 *
 * Renderiza `<a>` si recibe `href` y `<button>` si no: nunca un `div` con
 * `onClick`. La variante `ghost` incorpora flecha y subrayado animado.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props

  const classes = cn(
    base,
    variants[variant],
    variant === 'ghost' ? ghostSizes[size] : sizes[size],
    'tracking-[0.16em]',
    className,
  )

  const content =
    variant === 'ghost' ? (
      <>
        <span className="link-underline pb-1">{children}</span>
        <span
          aria-hidden="true"
          className="translate-y-px transition-transform duration-(--duration-ui) ease-expensive group-hover:translate-x-1"
        >
          →
        </span>
      </>
    ) : (
      children
    )

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...anchorProps } = props
    return (
      <a className={classes} {...anchorProps}>
        {content}
      </a>
    )
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    href: _h,
    type = 'button',
    ...buttonProps
  } = props

  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
