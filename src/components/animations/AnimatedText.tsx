import { m } from 'motion/react'

import { cn } from '@/lib/cn'
import { STAGGER, staggerContainer, wordReveal } from '@/lib/motion'

type AnimatedTextProps = {
  text: string
  className?: string
  delay?: number
  stagger?: number
  /** `viewport` espera al scroll; `mount` arranca al montar (hero). */
  trigger?: 'mount' | 'viewport'
}

/**
 * Titular palabra a palabra.
 *
 * El texto completo queda en `aria-label` y las palabras se ocultan a lectores
 * de pantalla: se escucha una frase continua, no una lista de fragmentos.
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = STAGGER.normal,
  trigger = 'viewport',
}: AnimatedTextProps) {
  const words = text.split(' ')
  const activation =
    trigger === 'mount'
      ? { animate: 'visible' as const }
      : { whileInView: 'visible' as const, viewport: { once: true, amount: 0.5 } }

  return (
    <m.span
      aria-label={text}
      className={cn('inline-block', className)}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      {...activation}
    >
      {words.map((word, index) => (
        <m.span
          // Lista estática: el índice es estable.
          key={`${word}-${index}`}
          aria-hidden="true"
          variants={wordReveal}
          className="inline-block"
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : null}
        </m.span>
      ))}
    </m.span>
  )
}
