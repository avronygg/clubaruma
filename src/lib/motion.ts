import type { Transition, Variants } from 'motion/react'

/**
 * Sistema de animación de ARUMA.
 *
 * Las duraciones replican en segundos las variables CSS de `styles/globals.css`
 * para que JS y CSS compartan el mismo tempo. Cambiar una implica cambiar la otra.
 *
 * Registro de marca: lento, suave, cinematográfico. Nunca elástico ni agresivo.
 */

type Bezier = [number, number, number, number]

/** Lado por el que entra una imagen al asomar en el viewport. */
export type MediaEnter = 'left' | 'right' | 'up'

export const EASE: Record<'expensive' | 'soft' | 'inout', Bezier> = {
  /** Salida larga y cara. Curva por defecto de la marca. */
  expensive: [0.16, 1, 0.3, 1],
  /** Entradas suaves sin frenada brusca. */
  soft: [0.33, 0, 0.13, 1],
  /** Simétrica: para estados que van y vuelven (menú, navbar). */
  inout: [0.65, 0, 0.35, 1],
}

export const DURATION = {
  /** Microinteracción: hover, foco, cambio de color. */
  micro: 0.2,
  /** UI: navbar, menús, botones. */
  ui: 0.4,
  /** Aparición de contenido al entrar en viewport. */
  reveal: 0.75,
  /** Revelado de imagen con clip-path. */
  image: 1.1,
  /** Secuencia del hero. */
  hero: 1.2,
} as const

export const STAGGER = {
  tight: 0.05,
  normal: 0.08,
  loose: 0.14,
} as const

/** Viewport compartido: dispara una sola vez, un poco antes del borde. */
export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -12% 0px',
} as const

export const transition = {
  micro: { duration: DURATION.micro, ease: EASE.expensive },
  ui: { duration: DURATION.ui, ease: EASE.expensive },
  reveal: { duration: DURATION.reveal, ease: EASE.expensive },
  image: { duration: DURATION.image, ease: EASE.expensive },
  hero: { duration: DURATION.hero, ease: EASE.expensive },
} satisfies Record<string, Transition>

/* ------------------------------------------------------------------------ */
/* Variants reutilizables                                                     */
/* ------------------------------------------------------------------------ */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.reveal },
}

/** Desplazamiento vertical sutil. `y` en píxeles, nunca más de ~32. */
export function slideUp(distance = 24, delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...transition.reveal, delay },
    },
  }
}

/** Revelado de imagen: cortina vertical con clip-path. */
export function imageReveal(delay = 0): Variants {
  return {
    hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { ...transition.image, delay },
    },
  }
}

/**
 * Entrada de imagen con dirección.
 *
 * Cada pieza llega desde el lado en el que se apoya en la retícula: la de la
 * izquierda entra por la izquierda y la de la derecha por la derecha, así que
 * al bajar la página el contenido parece plegarse hacia su sitio en lugar de
 * aparecer de golpe.
 *
 * El desplazamiento es de 56 px como mucho. `body` recorta en horizontal, de
 * modo que un elemento a todo el ancho desplazado no genera barra de scroll.
 */
export function mediaEnter(from: MediaEnter = 'up', delay = 0): Variants {
  const x = from === 'left' ? -56 : from === 'right' ? 56 : 0
  const y = from === 'up' ? 40 : 0

  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: DURATION.image, ease: EASE.expensive, delay },
    },
  }
}

/** Contra-escala interna: la foto se asienta mientras se descubre. */
export function imageSettle(delay = 0): Variants {
  return {
    hidden: { scale: 1.12 },
    visible: {
      scale: 1,
      transition: { duration: DURATION.image + 0.4, ease: EASE.expensive, delay },
    },
  }
}

export function staggerContainer(stagger: number = STAGGER.normal, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}

/** Palabra a palabra, para titulares del hero. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: '0.4em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE.expensive },
  },
}
