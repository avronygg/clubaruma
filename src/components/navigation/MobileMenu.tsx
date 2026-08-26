import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef } from 'react'

import { Divider } from '@/components/ui/Divider'
import { navigationItems, primaryAction } from '@/data/navigation'
import { launch, socialLinks } from '@/data/site'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/lib/cn'
import { DURATION, EASE, STAGGER } from '@/lib/motion'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  id: string
}

const panel = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.ui,
      ease: EASE.expensive,
      // Entra después de que la píldora haya empezado a crecer.
      delayChildren: 0.22,
      staggerChildren: STAGGER.normal,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.16, ease: EASE.inout } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE.expensive } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}

/**
 * Contenido del menú móvil.
 *
 * Vive dentro de la píldora de cristal de la cabecera: cuando `open` pasa a
 * `true`, la píldora se expande y este panel se revela en su interior. Por eso
 * no dibuja fondo propio — el cristal ya está puesto por `NavBar`.
 *
 * Mientras está abierto, `RootLayout` marca el contenido de la página como
 * `inert`, así que el tabulador solo recorre la cabecera y este panel. Escape
 * cierra.
 */
export function MobileMenu({ open, onClose, id }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 320)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-8 lg:hidden"
        >
          <nav aria-label="Principal" className="pt-4">
            <ul className="flex flex-col">
              {navigationItems.map((navItem, index) => (
                <m.li key={navItem.id} variants={item}>
                  <Divider />
                  <a
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={navItem.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-baseline gap-5 py-4 font-light tracking-[-0.03em] text-white',
                      'text-[clamp(1.875rem,8.5vw,2.75rem)] leading-none',
                    )}
                  >
                    <span aria-hidden="true" className="text-label text-red-bright tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {navItem.label}
                  </a>
                </m.li>
              ))}
            </ul>
          </nav>

          <m.div variants={item} className="mt-auto pt-10">
            <Divider className="mb-7" />

            <a
              href={primaryAction.href}
              onClick={onClose}
              className="inline-flex h-14 w-full items-center justify-center rounded-pill bg-red text-nav font-medium tracking-[0.16em] text-white uppercase transition-colors duration-(--duration-micro) hover:bg-red-bright"
            >
              {primaryAction.longLabel}
            </a>

            <div className="mt-8 flex flex-col gap-5 text-eyebrow uppercase">
              <p className="flex items-center gap-3 text-muted">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-red-bright" />
                {launch.shortLabel} · <span className="text-white/85">{launch.period}</span>
              </p>

              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tap-target link-underline pb-1 text-white/70 [--tap-expand:0.625rem]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
