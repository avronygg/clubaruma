import { AnimatePresence, m } from 'motion/react'
import { useEffect, useId, useRef } from 'react'

import { WaitlistBenefits } from '@/components/forms/WaitlistBenefits'
import { WaitlistForm } from '@/components/forms/WaitlistForm'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Logo } from '@/components/ui/Logo'
import { waitlistPopup } from '@/data/home'
import { launch } from '@/data/site'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { DURATION, EASE } from '@/lib/motion'

/** Margen tras completar el alta antes de retirar el diálogo solo. */
const CLOSE_AFTER_SUCCESS = 2400

type WaitlistModalProps = {
  open: boolean
  onClose: () => void
  onSubmitted: () => void
}

/**
 * Popup de entrada a la lista VIP.
 *
 * Diálogo modal real: `role="dialog"`, `aria-modal`, cierre con Escape, con la
 * cruz o pulsando fuera, y el foco devuelto a donde estaba. El resto de la
 * página queda `inert` mientras está abierto —lo aplica `RootLayout`—, así que
 * el tabulador se queda dentro sin necesidad de una trampa de foco a mano.
 *
 * Quién decide cuándo aparece está en `useEntryPopup`, no aquí: este componente
 * solo sabe pintarse.
 */
export function WaitlistModal({ open, onClose, onSubmitted }: WaitlistModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return

    previousFocus.current = document.activeElement as HTMLElement | null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    // El foco va al propio diálogo, no a un control: así el lector de pantalla
    // anuncia el título antes que nada. Enfocar el primer campo levantaría el
    // teclado en móvil, y enfocar la cruz destaca «cerrar» nada más abrir.
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 260)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
      previousFocus.current?.focus?.()
    }
  }, [open, onClose])

  function handleSuccess() {
    onSubmitted()
    window.setTimeout(onClose, CLOSE_AFTER_SUCCESS)
  }

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          className="fixed inset-0 z-110 flex items-center justify-center px-gutter py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.ui, ease: EASE.expensive }}
        >
          {/* Velo: cierra al pulsar fuera. Es un refuerzo del botón y de Escape,
              no la única vía, así que no necesita rol propio. */}
          <div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: DURATION.ui + 0.15, ease: EASE.expensive }}
            className="relative max-h-full w-full max-w-lg overflow-y-auto overscroll-contain rounded-[1.75rem] glass p-6 text-center focus:outline-none sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={waitlistPopup.close}
              className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full text-white/60 transition-colors duration-(--duration-micro) hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden="true" className="relative block size-4">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
              </span>
            </button>

            <Logo decorative className="mx-auto w-28 text-white" />

            <Eyebrow className="mt-7 justify-center">{waitlistPopup.eyebrow}</Eyebrow>

            <h2 id={titleId} className="mt-5 text-h3 font-light text-white">
              {waitlistPopup.title[0]}{' '}
              <span className="title-accent">{waitlistPopup.title[1]}</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[38ch] text-body text-gray">{waitlistPopup.body}</p>

            <WaitlistBenefits className="mt-5" />

            <p className="mt-6 flex items-center justify-center gap-2.5 text-eyebrow text-white/70 uppercase">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-red-bright" />
              {launch.shortLabel} · {launch.period}
            </p>

            <WaitlistForm source="popup" onSuccess={handleSuccess} className="mt-7" />

            <button
              type="button"
              onClick={onClose}
              className="tap-target mt-5 link-underline text-label text-muted-strong uppercase transition-colors duration-(--duration-micro) [--tap-expand:0.625rem] hover:text-white/70"
            >
              {waitlistPopup.dismiss}
            </button>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
