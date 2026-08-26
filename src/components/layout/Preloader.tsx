import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/ui/Logo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { DURATION, EASE } from '@/lib/motion'

const SESSION_KEY = 'aruma:preloader'
/** Suelo para que la marca se lea; techo para no castigar nunca la entrada. */
const MIN_VISIBLE = 550
const MAX_VISIBLE = 1600

function alreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    // Modo privado o almacenamiento bloqueado: se comporta como primera visita.
    return false
  }
}

function remember(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* sin persistencia, sin drama */
  }
}

/**
 * Preloader.
 *
 * Deliberadamente discreto: logo, un filete rojo y fuera. Solo aparece en la
 * primera carga de la sesión, nunca con `prefers-reduced-motion`, y se retira en
 * cuanto la página termina de cargar — no impone una espera artificial.
 */
export function Preloader() {
  const reducedMotion = usePrefersReducedMotion()
  const [dismissed, setDismissed] = useState(() => alreadySeen())

  // Se deriva en render: con movimiento reducido nunca llega a pintarse.
  const visible = !dismissed && !reducedMotion

  useEffect(() => {
    if (dismissed) return

    if (reducedMotion) {
      remember()
      return
    }

    const startedAt = performance.now()
    let minTimer = 0

    const dismiss = () => {
      const elapsed = performance.now() - startedAt
      minTimer = window.setTimeout(
        () => {
          setDismissed(true)
          remember()
        },
        Math.max(0, MIN_VISIBLE - elapsed),
      )
    }

    const maxTimer = window.setTimeout(dismiss, MAX_VISIBLE)

    if (document.readyState === 'complete') {
      dismiss()
    } else {
      window.addEventListener('load', dismiss, { once: true })
    }

    return () => {
      window.removeEventListener('load', dismiss)
      window.clearTimeout(minTimer)
      window.clearTimeout(maxTimer)
    }
  }, [dismissed, reducedMotion])

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: DURATION.ui, ease: EASE.expensive } }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-black"
        >
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.reveal, ease: EASE.expensive }}
          >
            <Logo decorative className="w-32 text-white sm:w-40" />
          </m.div>

          <m.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: EASE.soft }}
            className="h-px w-24 origin-left bg-red"
          />
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
