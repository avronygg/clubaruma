import { m } from 'motion/react'

import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { navigationItems, primaryAction } from '@/data/navigation'
import { useScrolled } from '@/hooks/useScrolled'
import { useOverture } from '@/components/layout/Overture'
import { cn } from '@/lib/cn'
import { EASE, OVERTURE } from '@/lib/motion'

import { MenuToggle } from './MenuToggle'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

const MENU_ID = 'menu-principal'

type NavBarProps = {
  menuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
}

/**
 * Cabecera: píldora flotante de cristal.
 *
 * No es una barra a sangre sino una pieza que flota sobre la fotografía, como
 * en la referencia del cliente. Tiene tres estados y **transiciona entre ellos,
 * no salta**:
 *
 *   1. Reposo   — cristal ligero; en escritorio se ajusta a su contenido.
 *   2. Asentada — al bajar gana cuerpo, desenfoque y saturación.
 *   3. Abierta  — en móvil la propia píldora crece hasta ocupar la pantalla y
 *                 su radio pasa de cápsula a esquina blanda. El menú no aparece
 *                 *encima* de la cabecera: es la cabecera transformada.
 *
 * La morfología va en CSS (`height`, `border-radius`) en lugar de en JS: así
 * los valores siguen siendo responsive —`h-pill` cambia por breakpoint— y el
 * bloque global de `prefers-reduced-motion` la neutraliza sin código extra.
 *
 * El cristal se define una sola vez en `styles/globals.css` (`glass`), con
 * respaldo sólido donde no hay `backdrop-filter`.
 */
export function NavBar({ menuOpen, onMenuToggle, onMenuClose }: NavBarProps) {
  const { ready } = useOverture()
  const scrolled = useScrolled(32)
  const settled = scrolled && !menuOpen

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-gutter pt-5">
      {/* La píldora baja desde fuera de pantalla al cargar: es lo primero
          que aparece y lo que da el pie a todo lo demás. La entrada va en
          Motion y la morfología en CSS, así que no compiten: una escribe
          `transform` y la otra `height` y `border-radius`. */}
      <m.div
        initial={{ opacity: 0, y: -28 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -28 }}
        transition={{ duration: 0.9, ease: EASE.expensive, delay: OVERTURE.nav }}
        className={cn(
          'pointer-events-auto relative mx-auto flex flex-col overflow-hidden glass',
          // El cristal anima sus propios parámetros; aquí solo la morfología.
          'transition-[height,border-radius] duration-500 ease-expensive will-change-[height]',
          settled && 'glass-settled',
          menuOpen
            ? 'h-[calc(100svh-1.5rem)] w-full rounded-[1.75rem]'
            : 'h-pill w-full rounded-pill lg:h-pill-lg lg:w-fit',
        )}
      >
        {/* Fila de cabecera: en flujo, para que en escritorio defina el ancho
            de la píldora. Se queda arriba mientras la pieza crece. */}
        <div className="flex h-pill shrink-0 items-center gap-6 pr-3 pl-5 lg:h-pill-lg lg:gap-8 lg:pr-2.5 lg:pl-7">
          <a
            href="#inicio"
            onClick={onMenuClose}
            aria-label="Aruma Club — inicio"
            className="tap-target shrink-0 text-white transition-opacity duration-(--duration-micro) [--tap-expand:0.75rem] hover:opacity-70"
          >
            <Logo decorative className="w-[6.25rem] sm:w-[7rem]" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <span className="hidden lg:inline-flex">
              <Button href={primaryAction.href} size="sm">
                {primaryAction.label}
              </Button>
            </span>

            <MenuToggle open={menuOpen} onToggle={onMenuToggle} controls={MENU_ID} />
          </div>
        </div>

        {/* Contenido del menú, dentro de la misma pieza de cristal. */}
        <MobileMenu id={MENU_ID} open={menuOpen} onClose={onMenuClose} />
      </m.div>
    </header>
  )
}
