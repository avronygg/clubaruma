import { Link } from 'react-router'

import { cn } from '@/lib/cn'
import { isAnchor } from '@/lib/navigation'
import type { NavItem } from '@/types'

type NavLinkProps = {
  item: NavItem
  onNavigate?: () => void
  className?: string
}

/**
 * Enlace de navegación.
 *
 * Resuelve solo si el destino es un ancla de la página (scroll suave nativo) o
 * una ruta del router. Cuando las secciones se conviertan en páginas basta con
 * cambiar el `href` en `data/navigation.ts`.
 */
export function NavLink({ item, onNavigate, className }: NavLinkProps) {
  const classes = cn(
    // `tap-target` aporta el `position: relative` que necesita el subrayado y,
    // además, amplía el área pulsable: el texto mide 12px de alto y WCAG 2.5.8
    // pide 24×24 CSS px como mínimo.
    'group tap-target inline-block text-nav font-medium text-white/60 uppercase',
    '[--tap-expand-x:0.625rem] [--tap-expand:0.625rem]',
    'transition-colors duration-(--duration-micro) ease-expensive hover:text-white',
    className,
  )

  const underline = (
    <span
      aria-hidden="true"
      className={cn(
        'absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-red-bright',
        'transition-transform duration-(--duration-ui) ease-expensive',
        'group-hover:scale-x-100 group-focus-visible:scale-x-100',
      )}
    />
  )

  if (isAnchor(item.href)) {
    return (
      <a href={item.href} onClick={onNavigate} className={classes}>
        {item.label}
        {underline}
      </a>
    )
  }

  return (
    <Link to={item.href} onClick={onNavigate} className={classes}>
      {item.label}
      {underline}
    </Link>
  )
}
