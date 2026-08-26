import { m, useMotionValue, useSpring } from 'motion/react'
import { useCallback, type PointerEvent, type ReactNode } from 'react'

import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

type MagneticButtonProps = {
  children: ReactNode
  className?: string
  /** Fracción del desplazamiento del cursor. Por encima de 0.3 se vuelve gimmick. */
  strength?: number
  /** Tope en píxeles. */
  max?: number
}

/**
 * Atracción magnética sutil.
 *
 * Solo con puntero fino y movimiento permitido: en táctil y en `reduced motion`
 * no se registra ningún listener y el hijo se renderiza tal cual.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.22,
  max = 10,
}: MagneticButtonProps) {
  const finePointer = useHasFinePointer()
  const reducedMotion = usePrefersReducedMotion()
  const enabled = finePointer && !reducedMotion

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 170, damping: 20, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 170, damping: 20, mass: 0.5 })

  const clamp = (value: number) => Math.max(-max, Math.min(max, value))

  const handleMove = useCallback(
    (event: PointerEvent<HTMLSpanElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      x.set(clamp((event.clientX - (rect.left + rect.width / 2)) * strength))
      y.set(clamp((event.clientY - (rect.top + rect.height / 2)) * strength))
    },
    // `clamp` depende solo de `max`, que es estable entre renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strength, max, x, y],
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  if (!enabled) {
    return <span className={cn('inline-flex', className)}>{children}</span>
  }

  return (
    <m.span
      className={cn('inline-flex will-change-transform', className)}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </m.span>
  )
}
