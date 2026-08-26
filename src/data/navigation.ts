import type { NavItem } from '@/types'

/**
 * Navegación principal.
 *
 * Hoy apuntan a anclas de la home. Cuando existan las páginas dedicadas basta
 * con cambiar `href` a `/experiencia`, `/vip`, etc.: `NavLink` detecta si el
 * destino es ancla o ruta y usa scroll suave o router según corresponda.
 */
export const navigationItems: readonly NavItem[] = [
  { id: 'inicio', label: 'Inicio', href: '#inicio' },
  { id: 'experiencia', label: 'Experiencia', href: '#experiencia' },
  { id: 'cocteleria', label: 'Coctelería', href: '#cocteleria' },
  { id: 'vip', label: 'VIP', href: '#vip' },
  { id: 'galeria', label: 'Galería', href: '#galeria' },
] as const

/**
 * Acción principal de la cabecera.
 * En prelanzamiento lleva a la lista de espera, que es el objetivo de la web.
 */
export const primaryAction = {
  label: 'Únete',
  longLabel: 'Únete a la lista VIP',
  href: '#lista',
} as const

export const footerLinks: readonly NavItem[] = [
  { id: 'experiencia', label: 'Experiencia', href: '#experiencia' },
  { id: 'cocteleria', label: 'Coctelería', href: '#cocteleria' },
  { id: 'ambiente', label: 'Ambiente', href: '#ambiente' },
  { id: 'vip', label: 'VIP', href: '#vip' },
  { id: 'musica', label: 'Música', href: '#musica' },
  { id: 'galeria', label: 'Galería', href: '#galeria' },
  { id: 'donde', label: 'Cómo llegar', href: '#donde' },
  { id: 'lista', label: 'Lista VIP', href: '#lista' },
] as const
