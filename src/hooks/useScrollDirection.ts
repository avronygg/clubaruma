import { useEffect, useState } from 'react'

export type ScrollDirection = 'up' | 'down'

/**
 * Hacia dónde se está moviendo la página.
 *
 * Sirve para retirar del paso a los elementos flotantes mientras alguien baja
 * leyendo, y devolverlos en cuanto sube. Es el mismo comportamiento que tienen
 * las cabeceras de las webs móviles, y resuelve la contradicción de una tarjeta
 * que debe verse grande sin taparle el texto a nadie.
 *
 * `threshold` descarta los microdesplazamientos: sin él, el rebote elástico de
 * iOS y el temblor de un trackpad harían parpadear lo que dependa de esto.
 *
 * La lectura va dentro de rAF, como en `useScrolled`: leer `scrollY` en cada
 * evento fuerza al navegador a recalcular la maquetación.
 */
export function useScrollDirection(threshold = 8): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('up')

  useEffect(() => {
    let frame = 0
    let previous = window.scrollY

    const read = () => {
      frame = 0
      const current = window.scrollY
      const delta = current - previous

      if (Math.abs(delta) < threshold) return
      previous = current

      // Arriba del todo siempre cuenta como subir: el rebote de iOS deja
      // valores negativos que si no se leerían como un descenso.
      setDirection(current <= 0 || delta < 0 ? 'up' : 'down')
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return direction
}
