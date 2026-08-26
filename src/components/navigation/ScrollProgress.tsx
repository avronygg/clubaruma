import { m, useScroll, useSpring } from 'motion/react'

/**
 * Progreso de lectura: un filete rojo de 1px.
 * Anima `scaleX` sobre el compositor — no toca layout ni pintura.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-px origin-left bg-red-bright"
    />
  )
}
