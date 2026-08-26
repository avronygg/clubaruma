import type { CSSProperties } from 'react'

import { cn } from '@/lib/cn'

/**
 * Dos variantes del mismo original, ambas con su proporción exacta.
 *
 * `mark` es la «A» recortada a su caja: el wordmark completo es 8:1 y dentro de
 * una pieza compacta —un círculo, un favicon— resultaría ilegible.
 */
const VARIANTS = {
  wordmark: { src: '/images/logo-aruma.webp', ratio: '2206 / 273' },
  mark: { src: '/images/logo-mark.webp', ratio: '256 / 280' },
} as const

type CssVars = CSSProperties & Record<`--${string}`, string>

type LogoProps = {
  /** Se controla el tamaño desde fuera (ancho o alto). */
  className?: string
  variant?: keyof typeof VARIANTS
  /** Decorativo: se oculta a lectores de pantalla porque el texto ya está en el DOM. */
  decorative?: boolean
  label?: string
}

/**
 * Logotipo oficial de ARUMA.
 *
 * El PNG del cliente se usa como **máscara CSS**, no como imagen: el color sale
 * de `currentColor`. Así se obtienen las versiones blanca, roja y negra desde un
 * único archivo, sin redibujar el logo, sin deformarlo y sin filtros de color.
 *
 *   <Logo className="w-40 text-white" />
 *   <Logo variant="mark" className="w-6 text-red" />
 */
export function Logo({
  className,
  variant = 'wordmark',
  decorative = false,
  label = 'Aruma',
}: LogoProps) {
  const source = VARIANTS[variant]
  const style: CssVars = {
    '--logo-src': `url("${source.src}")`,
    aspectRatio: source.ratio,
  }

  return (
    <span
      className={cn('block logo-mask', className)}
      style={style}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label })}
    />
  )
}
