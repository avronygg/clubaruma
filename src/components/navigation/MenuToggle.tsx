import { m } from 'motion/react'

import { DURATION, EASE } from '@/lib/motion'

type MenuToggleProps = {
  open: boolean
  onToggle: () => void
  controls: string
}

const LINE = 'absolute left-0 h-px w-full bg-current'
const transition = { duration: DURATION.ui, ease: EASE.expensive }

/**
 * Conmutador del menú móvil.
 * Dos filetes de 1px que se cruzan. Sin iconografía prestada.
 */
export function MenuToggle({ open, onToggle, controls }: MenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      className="relative inline-flex size-11 items-center justify-center text-white lg:hidden"
    >
      <span className="relative block h-3 w-6">
        <m.span
          className={LINE}
          initial={false}
          animate={open ? { top: '50%', rotate: 45 } : { top: 0, rotate: 0 }}
          transition={transition}
        />
        <m.span
          className={LINE}
          initial={false}
          animate={open ? { top: '50%', rotate: -45 } : { top: '100%', rotate: 0 }}
          transition={transition}
        />
      </span>
    </button>
  )
}
